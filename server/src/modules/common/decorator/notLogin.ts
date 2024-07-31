import {
  IMidwayContainer,
  MidwayWebRouterService,
  Singleton,
} from '@midwayjs/core';
import {
  ApplicationContext,
  Autoload,
  CONTROLLER_KEY,
  Init,
  Inject,
  attachClassMetadata,
  getClassMetadata,
  listModule,
} from '@midwayjs/decorator';
import { BaseClass } from '../../../core/baseClass';

export const NOT_LOGIN_KEY = 'decorator:not.login';

/**
 * 无需登录的接口
 */
export function NotLogin(): MethodDecorator {
  return (target, key, descriptor: PropertyDescriptor) => {
    attachClassMetadata(NOT_LOGIN_KEY, { methodName: key }, target);
    return descriptor;
  };
}

@Autoload()
@Singleton()
export class NotLoginDecorator extends BaseClass {
  @Inject()
  webRouterService: MidwayWebRouterService;

  @ApplicationContext()
  applicationContext: IMidwayContainer;

  @Init()
  async init() {
    const controllerModules = listModule(CONTROLLER_KEY);
    const methods = [];
    for (const module of controllerModules) {
      const methodNames = getClassMetadata(NOT_LOGIN_KEY, module) || [];
      // 获取所有 controllder 名称，并将首字母转为小写
      const className = module.name[0].toLowerCase() + module.name.slice(1);
      // 将带有次装饰器的方法名按 controller 分组
      if (methodNames.length !== 0) {
        methods.push(
          ...methodNames.map(method => `${className}.${method.methodName}`)
        );
      }
    }
    // 补充每一条数据的路由信息，将其挂在到全局
    const routerTables = await this.webRouterService.getFlattenRouterTable();
    const notLoginRouter = routerTables
      .filter(router => methods.includes(router.handlerName))
      .map(router => ({
        ...router,
        fullUrl: router.fullUrl.split(':')[0],
      }));
    this.applicationContext.registerObject('notLoginRouter', notLoginRouter);
    await this.redisService.set(
      'longtime:notLoginRouter',
      JSON.stringify(
        notLoginRouter.map(router => ({
          fullUrl: router.fullUrl,
          requestMethod: router.requestMethod,
          description: router.description,
        }))
      )
    );
  }
}
