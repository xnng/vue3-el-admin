import { Config, Singleton } from '@midwayjs/core';
import { BaseClass } from '../../../core/baseClass';
import { BaseUser } from '../entity/baseUser';
import * as jwt from 'jsonwebtoken';

@Singleton()
export class CommonUtils extends BaseClass {
  @Config('jwt')
  jwtConfig;

  signToken(user: BaseUser): string {
    const token = jwt.sign(
      { userId: user.id, tokenFlag: user.tokenFlag },
      this.jwtConfig.code,
      {
        expiresIn: this.jwtConfig.expiresIn,
      }
    );
    return `Bearer ${token}`;
  }
}
