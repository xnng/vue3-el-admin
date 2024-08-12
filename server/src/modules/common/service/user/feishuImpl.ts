import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseClass } from '../../../../core/baseClass';
import { BaseUser } from '../../entity/baseUser';
import { FeishuAppUtils } from '../../utils/feishu/app';
import { ILoginRes, UserStrategy } from './userStrategy';
import { CommonUtils } from '../../utils/common';

@Provide()
export class FeishuImpl extends BaseClass implements UserStrategy {
  @InjectEntityModel(BaseUser)
  userModel: Repository<BaseUser>;

  @Inject()
  feishuAppUtils: FeishuAppUtils;

  @Inject()
  commonUtils: CommonUtils;

  async login(payload: any): Promise<ILoginRes> {
    const getUserInfoRes = await this.feishuAppUtils.getUserInfoByCode(
      payload.code
    );
    if (!getUserInfoRes.success) {
      return getUserInfoRes;
    }
    const { avatar, email, mobile, name, uid } = getUserInfoRes.data;
    let user = await this.userModel.findOneBy({ uid });
    if (user) {
      user.name = name;
      user.email = email;
      user.mobile = mobile;
      user.avatar = avatar;
      user = await this.userModel.save(user);
    } else {
      const newUser = new BaseUser();
      newUser.name = name;
      newUser.email = email;
      newUser.mobile = mobile;
      newUser.avatar = avatar;
      newUser.uid = uid;
      user = await this.userModel.save(newUser);
    }
    return this.success({
      user,
      token: this.commonUtils.signToken(user),
    });
  }
}
