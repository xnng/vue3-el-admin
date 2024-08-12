import {
  Config,
  IMiddleware,
  Inject,
  Middleware,
  RouterInfo,
} from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { BaseClass } from '../../../core/baseClass';
import { EUseStatus } from '../../../interface';
import { BaseUser } from '../entity/baseUser';

interface IJwtVerfifyResult extends jwt.JwtPayload {
  userId: number;
  tokenFlag: string;
}

/**
 * jwt 登录鉴权
 */
@Middleware()
export class LoginAuthMiddleware
  extends BaseClass
  implements IMiddleware<Context, NextFunction>
{
  @InjectEntityModel(BaseUser)
  userModel: Repository<BaseUser>;

  @Config('jwt')
  jwtConfig;

  @Inject()
  notLoginRouter: RouterInfo[];

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const ip = this.getRealIp(ctx);
      if (
        this.notLoginRouter.find(
          router =>
            router.requestMethod.toLowerCase() ===
              ctx.request.method.toLowerCase() &&
            ctx.path.startsWith(router.fullUrl)
        )
      ) {
        await next();
      } else {
        const authHeader = ctx.headers['authorization'];
        let token = null;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.slice(7).trim();
        }
        if (!token) {
          this.logger.warn(
            `未找到token, ip: ${ip}, ${ctx.path}`,
            JSON.stringify(ctx.headers)
          );
          ctx.status = 401;
          ctx.body = this.fail('forbidden');
          return;
        }
        let verifyToken: IJwtVerfifyResult;
        let user: BaseUser;
        try {
          verifyToken = <IJwtVerfifyResult>(
            jwt.verify(token, this.jwtConfig.code)
          );
          const { userId, tokenFlag } = verifyToken;
          user = await this.userModel.findOneBy({ id: verifyToken.userId });
          if (!user) {
            this.logger.warn(`用户不存在: ${userId}, ip: ${ip}`);
            ctx.status = 401;
            ctx.body = this.fail('user not found');
            return;
          }
          if (user.tokenFlag !== tokenFlag) {
            throw new Error('token expired');
          }
          if (user.status === EUseStatus.DISABLE) {
            ctx.status = 405;
            ctx.body = this.fail('user is disabled');
            return;
          }
        } catch (error) {
          ctx.status = 401;
          ctx.body = this.fail('token expired');
          return;
        }
        ctx.user = user;
        await next();
      }
    };
  }
}
