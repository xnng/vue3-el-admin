import * as bull from '@midwayjs/bull';
import * as bullBoard from '@midwayjs/bull-board';
import {
  App,
  Configuration,
  ILifeCycle,
  IMidwayContainer,
  Inject,
  Logger,
  MidwayLoggerService,
} from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import { ILogger } from '@midwayjs/logger';
import * as prometheus from '@midwayjs/prometheus';
import * as rabbitmq from '@midwayjs/rabbitmq';
import * as redis from '@midwayjs/redis';
import * as typeorm from '@midwayjs/typeorm';
import { InjectEntityModel } from '@midwayjs/typeorm';
import * as Validate from '@midwayjs/validate';
import { join } from 'path';
import { Repository } from 'typeorm';
import { BaseUser } from './modules/common/entity/baseUser';
import { CorsMiddleware } from './modules/common/middleware/cors';
import { ExecptionMiddleware } from './modules/common/middleware/execption';
import { LogMiddleware } from './modules/common/middleware/log';
import { LoginAuthMiddleware } from './modules/common/middleware/loginAuth';
import { RbacMiddleware } from './modules/rbac/middleware/rbac';

@Configuration({
  imports: [
    koa,
    Validate,
    typeorm,
    redis,
    bull,
    bullBoard,
    prometheus,
    rabbitmq,
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle implements ILifeCycle {
  @App()
  app: koa.Application;

  @Inject()
  loggerService: MidwayLoggerService;

  @InjectEntityModel(BaseUser)
  baseUserModel: Repository<BaseUser>;

  @Logger()
  logger: ILogger;

  async onReady() {
    // 注册中间件
    const middlewares = [
      LogMiddleware,
      CorsMiddleware,
      ExecptionMiddleware,
      LoginAuthMiddleware,
      RbacMiddleware,
    ];
    this.app.useMiddleware(middlewares);
  }

  async onServerReady(): Promise<void> {
    setTimeout(async () => {
      // 数据库预热
      await this.baseUserModel.findOneBy({ id: 1 });
      // 通知 pm2 新的进程已准备完毕，可以杀掉 old 进程了
      process.send('ready');
    }, 2000);
  }

  async onStop(container: IMidwayContainer): Promise<void> {
    const framework = await container.getAsync(koa.Framework);
    const server = framework.getServer();

    // 在此之前 midway 已接收到 pm2 发出的下线信号(SIGINT)，在程序退出之前需要做一些等待
    // 等待旧的请求响应完毕
    const waitResponseDone = () => {
      return new Promise(resolve => {
        server.close(() => {
          resolve('done');
        });
      });
    };
    await waitResponseDone();
  }
}
