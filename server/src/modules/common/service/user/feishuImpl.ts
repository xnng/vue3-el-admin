import { Config, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { BaseClass } from '../../../../core/baseClass';
import { BaseUser } from '../../entity/baseUser';
import { FeishuAppUtils } from '../../utils/feishu/app';
import { ILoginRes, UserStrategy } from './userStrategy';

@Provide()
export class FeishuImpl extends BaseClass implements UserStrategy {
  @InjectEntityModel(BaseUser)
  userModel: Repository<BaseUser>;

  @Config('jwt')
  jwtConfig;

  @Inject()
  feishuAppUtils: FeishuAppUtils;

  signToken(user: BaseUser): string {
    return jwt.sign(
      { userId: user.id, tokenFlag: user.tokenFlag },
      this.jwtConfig.code,
      {
        expiresIn: this.jwtConfig.expiresIn,
      }
    );
  }

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
      token: this.signToken(user),
    });
  }
}
