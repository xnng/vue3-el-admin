import {
  Autoload,
  CONTROLLER_KEY,
  Init,
  Inject,
  MidwayWebRouterService,
  Scope,
  ScopeEnum,
  getClassMetadata,
  listModule,
} from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { chunk } from 'lodash';
import { Repository } from 'typeorm';
import { BaseClass } from '../../../core/baseClass';
import { ERbacApiType } from '../../../interface';
import { RbacApi } from '../entity/api';
import { RbacRole } from '../entity/role';

@Autoload()
@Scope(ScopeEnum.Singleton)
export class InitRbacDataService extends BaseClass {
  @Inject()
  webRouterService: MidwayWebRouterService;

  @InjectEntityModel(RbacApi)
  rbacApiModel: Repository<RbacApi>;

  @InjectEntityModel(RbacRole)
  rbacRoleModel: Repository<RbacRole>;

  @Init()
  init() {
    this.initRbacRouter();
    this.initRole();
  }

  /**
   * 初始化 rbac 路由
   */
  async initRbacRouter() {
    // 获取 controller 列表
    const controllerModules = listModule(CONTROLLER_KEY);
    const controllerList = controllerModules
      .map(controller => getClassMetadata(CONTROLLER_KEY, controller))
      .filter(v => v.prefix.startsWith('/admin'))
      .map(v => ({
        url: v.prefix,
        type: ERbacApiType.MODULE,
        description: v.routerOptions.description,
      }));

    // 保存 controller
    const saveController = async controller => {
      const existController = await this.rbacApiModel.findOneBy({
        url: controller.url,
        type: controller.type,
      });
      if (!existController) {
        await this.rbacApiModel.save(controller);
      } else {
        existController.description = controller.description;
        await this.rbacApiModel.save(existController);
      }
    };
    await Promise.all(controllerList.map(v => saveController(v)));

    // 获取 router 列表
    const routerTables = await this.webRouterService.getFlattenRouterTable();
    // 使用正则表达式去掉路径中的变量部分
    const removePathVariables = (url: string) => {
      return url.replace(/\/:[^/]+/g, '');
    };
    const routerList = routerTables
      .filter(v => v.prefix.startsWith('/admin'))
      .map(v => ({
        parentUrl: v.prefix,
        description: v.description,
        method: v.requestMethod,
        type: ERbacApiType.API,
        url: removePathVariables(v.fullUrl),
      }));
    // 保存到数据库
    const targetRouterList = JSON.parse(
      JSON.stringify(controllerList.concat(routerList))
    );
    const groupRouterList = chunk(targetRouterList, 20);
    for (const routerList of groupRouterList) {
      const saveRouter = async router => {
        const existRouter = await this.rbacApiModel.findOneBy({
          url: router.url,
          method: router.method,
          type: router.type,
        });
        if (!existRouter) {
          const controller = await this.rbacApiModel.findOneBy({
            url: router.parentUrl,
            type: ERbacApiType.MODULE,
          });
          router.parentId = controller.id;
          await this.rbacApiModel.save(router);
        } else {
          existRouter.description = router.description;
          await this.rbacApiModel.save(existRouter);
        }
      };
      await Promise.all(routerList.map(v => saveRouter(v)));
    }
  }

  /**
   * 初始化角色
   */
  async initRole() {
    const defaultRole = await this.rbacRoleModel.findOneBy({ isDefault: true });
    if (!defaultRole) {
      const role1 = new RbacRole();
      role1.id = 2;
      role1.name = '团队成员';
      role1.desc = '拥有基本权限';
      role1.isDefault = true;

      const role2 = new RbacRole();
      role2.id = 3;
      role2.name = '团队管理员';
      role2.desc = '拥有管理团队的必要权限';
      role2.isDefault = true;

      const role3 = new RbacRole();
      role3.id = 4;
      role3.name = '团队所有者';
      role3.desc = '拥有最高权限';
      role3.isDefault = true;
      await this.rbacRoleModel.insert([role1, role2, role3]);
    }
  }
}
