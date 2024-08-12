import {
  IMiddleware,
  Inject,
  Middleware,
  MidwayWebRouterService,
  RouterInfo,
} from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseClass } from '../../../core/baseClass';
import { RbacApi } from '../entity/api';
import { RbacApiPerBind } from '../entity/apiPerBind';
import { RbacRole } from '../entity/role';
import { RbacRolePerBind } from '../entity/rolePerBind';
import { BaseUser } from '../../common/entity/baseUser';

/**
 * rbac 鉴权
 */
@Middleware()
export class RbacMiddleware
  extends BaseClass
  implements IMiddleware<Context, NextFunction>
{
  @InjectEntityModel(BaseUser)
  userModel: Repository<BaseUser>;

  @InjectEntityModel(RbacApi)
  RbacApiModel: Repository<RbacApi>;

  @InjectEntityModel(RbacApiPerBind)
  RbacApiPerBindModel: Repository<RbacApiPerBind>;

  @InjectEntityModel(RbacRole)
  RbacRoleModel: Repository<RbacRole>;

  @Inject()
  webRouterService: MidwayWebRouterService;

  @InjectEntityModel(RbacRolePerBind)
  RbacRolePerBindModel: Repository<RbacRolePerBind>;

  @Inject()
  notLoginRouter: RouterInfo[];

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();
      // 不是 /admin 开头的接口放行
      if (!ctx.path.startsWith('/admin')) {
        await next();
        return;
      }

      // 不用登录的接口放行
      if (
        this.notLoginRouter.find(
          router =>
            router.requestMethod.toLowerCase() ===
              ctx.request.method.toLowerCase() &&
            ctx.path.startsWith(router.fullUrl)
        )
      ) {
        await next();
        return;
      }

      const roleId = ctx.user.roleId;
      // 测试账号，放行
      if (roleId == -2) {
        await next();
        return;
      }
      // 使用正则表达式去掉路径末尾的数字部分
      const removeTrailingNumbers = (url: string) => {
        return url.replace(/\/\d+$/, '');
      };
      const currentPath = removeTrailingNumbers(ctx.path);
      const querBuilder = this.RbacApiModel.createQueryBuilder('api')
        .leftJoin(RbacApiPerBind, 'apb', 'apb.apiId = api.id')
        .leftJoin(RbacRolePerBind, 'rpb', 'rpb.permissionId = apb.permissionId')
        .where('rpb.roleId = :roleId', { roleId })
        .andWhere('api.url = :url', { url: currentPath })
        .andWhere('api.method = :method', {
          method: ctx.method.toLocaleLowerCase(),
        });
      const currentApi = await querBuilder.getOne();
      if (!currentApi) {
        ctx.status = 403;
        ctx.body = {
          success: false,
          message: '无权限',
        };
        return;
      }
      const time = Date.now() - startTime;
      ctx.response.set('x-log-auth-time', `${time}ms`);
      await next();
    };
  }
}
