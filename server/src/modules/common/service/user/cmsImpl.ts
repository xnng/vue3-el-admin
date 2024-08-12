import { Inject, Provide } from '@midwayjs/core';
import { BaseClass } from '../../../../core/baseClass';
import { ILoginRes, UserStrategy } from './userStrategy';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { BaseUser } from '../../entity/baseUser';
import { Repository } from 'typeorm';
import { CommonUtils } from '../../utils/common';

@Provide()
export class CmsImpl extends BaseClass implements UserStrategy {
  @InjectEntityModel(BaseUser)
  userModel: Repository<BaseUser>;

  @Inject()
  commonUtils: CommonUtils;

  async login(payload: any): Promise<ILoginRes> {
    const { name, password } = payload;
    const user = await this.userModel.findOneBy({ name });
    if (!user) {
      return this.fail('用户名或密码错误');
    }
    if (user.password !== password) {
      return this.fail('用户名或密码错误');
    }
    return this.success({
      user,
      token: this.commonUtils.signToken(user),
    });
  }
}
