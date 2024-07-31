import { Body, Controller, Inject, Post } from '@midwayjs/core';
import { BaseClass } from '../../../core/baseClass';
import { IComResponse } from '../../../interface';
import { NotLogin } from '../../common/decorator/notLogin';
import { UseLock } from '../../common/decorator/useLock';
import { UserService } from '../service/user/userService';

@Controller('/user', { description: '用户模块' })
export class UserController extends BaseClass {
  @Inject()
  userService: UserService;

  @Post('/login', { description: '登录' })
  @NotLogin()
  @UseLock()
  async login(@Body() payload: any): Promise<IComResponse> {
    const { type } = payload;
    if (!type) return this.fail('缺少 type 参数');
    return await this.userService.login(type, payload);
  }
}
