import { Inject, Provide } from '@midwayjs/core';
import { BaseClass } from '../../../../core/baseClass';
import { EUserLoginType, IComResponse } from '../../../../interface';
import { UserStrategyFactory } from './userStrategyFactory';

@Provide()
export class UserService extends BaseClass {
  @Inject()
  userStrategyFactory: UserStrategyFactory;

  async login(type: EUserLoginType, payload: any): Promise<IComResponse> {
    return this.userStrategyFactory.createStrategy(type).login(payload);
  }
}
