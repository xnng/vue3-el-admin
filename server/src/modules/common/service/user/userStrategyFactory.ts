import { Inject, Provide } from '@midwayjs/core';
import { EUserLoginType } from '../../../../interface';
import { FeishuImpl } from './feishuImpl';
import { UserStrategy } from './userStrategy';

@Provide()
export class UserStrategyFactory {
  @Inject()
  feishuImpl: FeishuImpl;

  createStrategy(type: string): UserStrategy {
    switch (type) {
      case EUserLoginType['飞书应用网页登录']:
        return this.feishuImpl;
      default:
        return this.feishuImpl;
    }
  }
}
