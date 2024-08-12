import { Inject, Provide } from '@midwayjs/core';
import { EUserLoginType } from '../../../../interface';
import { FeishuImpl } from './feishuImpl';
import { UserStrategy } from './userStrategy';
import { CmsImpl } from './cmsImpl';

@Provide()
export class UserStrategyFactory {
  @Inject()
  feishuImpl: FeishuImpl;

  @Inject()
  cmsImpl: CmsImpl;

  createStrategy(type: string): UserStrategy {
    switch (type) {
      case EUserLoginType['飞书应用网页登录']:
        return this.feishuImpl;
      case EUserLoginType['CMS登录']:
        return this.cmsImpl;
      default:
        return this.feishuImpl;
    }
  }
}
