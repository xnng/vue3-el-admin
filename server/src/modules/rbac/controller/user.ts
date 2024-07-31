import { Body, Controller, Get, Inject, Post, Queries } from '@midwayjs/core';
import { BaseClass } from '../../../core/baseClass';
import { IComResponse } from '../../../interface';
import { UseLock } from '../../common/decorator/useLock';
import { PermissionService } from '../service/permission';
import { AdminUserService } from '../service/user';

@Controller('/admin/user', { description: '用户模块' })
export class AdminUserController extends BaseClass {
  @Inject()
  adminUserService: AdminUserService;

  @Inject()
  permissionService: PermissionService;

  @Get('/list', { description: '获取用户列表' })
  async getList(@Queries() query: any): Promise<IComResponse> {
    if (!query.page || !query.size) return this.fail('缺少分页参数');
    return await this.adminUserService.getList(query);
  }

  @Get('/menu', { description: '获取用户菜单' })
  async getMenu(): Promise<IComResponse> {
    return await this.permissionService.getMenuList();
  }

  @Post('/bindRole', { description: '给用户绑定角色' })
  @UseLock()
  async bindRole(@Body() body: any): Promise<IComResponse> {
    if (!body.uid) return this.fail('用户ID不能为空');
    if (!body.roleId) return this.fail('角色ID不能为空');
    return this.adminUserService.bindRole(body);
  }
}
