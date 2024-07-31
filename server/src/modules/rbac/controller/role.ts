import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Queries,
} from '@midwayjs/core';
import { BaseClass } from '../../../core/baseClass';
import { IComResponse } from '../../../interface';
import { RoleService } from '../service/role';
import { UseLock } from '../../common/decorator/useLock';

@Controller('/admin/role', { description: '角色模块' })
export class RoleController extends BaseClass {
  @Inject()
  roleService: RoleService;

  @Get('/list', { description: '获取角色列表' })
  async getRoleList(@Queries() query: any): Promise<IComResponse> {
    if (!query.page) return this.fail('缺少页码');
    if (!query.size) return this.fail('缺少每页数量');
    return this.roleService.getList(query);
  }

  @Post('/add', { description: '添加角色' })
  @UseLock()
  async addRole(@Body() body: any): Promise<IComResponse> {
    if (!body.name) return this.fail('缺少角色名称');
    return this.roleService.addRole(body);
  }

  @Put('/edit', { description: '编辑角色' })
  @UseLock()
  async editRole(@Body() body: any): Promise<IComResponse> {
    if (!body.id) return this.fail('缺少角色 ID');
    return this.roleService.editRole(body);
  }

  @Del('/delete/:id', { description: '删除角色' })
  @UseLock()
  async deleteRole(@Param('id') id: number): Promise<IComResponse> {
    if (!id) return this.fail('缺少角色 ID');
    return this.roleService.deleteRole(id);
  }

  @Get('/permission/list', { description: '获取角色能绑定的权限列表' })
  async getPermissionList(): Promise<IComResponse> {
    return this.roleService.getPermissionList();
  }

  @Get('/permission/ids', { description: '获取角色绑定的权限ID集合' })
  async getPermissionIds(@Queries() query: any): Promise<IComResponse> {
    if (!query.roleId) return this.fail('缺少角色ID');
    return this.roleService.getPermissionIds(query.roleId);
  }

  @Post('/bindPermission', { description: '绑定权限到角色' })
  @UseLock()
  async bindPermission(@Body() body: any): Promise<IComResponse> {
    if (!body.roleId) return this.fail('缺少角色ID');
    if (!body.permissionIds) return this.fail('缺少权限ID');
    return this.roleService.bindPermission(body);
  }
}
