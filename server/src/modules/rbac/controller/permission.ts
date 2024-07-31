import {
  Body,
  Controller,
  Del,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@midwayjs/core';
import { BaseClass } from '../../../core/baseClass';
import { ERbacPermissionType, IComResponse } from '../../../interface';
import { PermissionService } from '../service/permission';
import { UseLock } from '../../common/decorator/useLock';

@Controller('/admin/permission', { description: '权限模块' })
export class PermissionController extends BaseClass {
  @Inject()
  permissionService: PermissionService;

  @Post('/add', { description: '添加权限' })
  @UseLock()
  async add(@Body() body: any): Promise<IComResponse> {
    if (!body.type) return this.fail('缺少权限类型');
    if (!body.name) return this.fail('缺少权限名称');
    if (!body.pid) return this.fail('缺少父级权限id');
    if (body.type === ERbacPermissionType.PAGE && !body.router) {
      return this.fail('缺少页面路由');
    }
    return this.permissionService.addPermission(body);
  }

  @Put('/edit', { description: '编辑权限' })
  @UseLock()
  async edit(@Body() body: any): Promise<IComResponse> {
    if (!body.id) return this.fail('缺少权限id');
    if (!body.type) return this.fail('缺少权限类型');
    if (!body.name) return this.fail('缺少权限名称');
    if (body.type === ERbacPermissionType.PAGE && !body.router) {
      return this.fail('缺少页面路由');
    }
    return this.permissionService.editPermission(body);
  }

  @Del('/del/:id', { description: '删除权限' })
  @UseLock()
  async delete(@Param('id') id: number): Promise<IComResponse> {
    return this.permissionService.delete(id);
  }

  @Get('/list', { description: '获取权限和绑定的接口列表' })
  async list(): Promise<IComResponse> {
    return this.permissionService.getList();
  }

  @Get('/apiList', { description: '获取权限可绑定的接口列表' })
  async apiList(): Promise<IComResponse> {
    return this.permissionService.getApiList();
  }

  @Post('/bindApi', { description: '绑定权限与接口' })
  @UseLock()
  async bindApi(@Body() body: any): Promise<IComResponse> {
    if (!body.permissionId) return this.fail('缺少权限id');
    if (!body.apiIds || !Array.isArray(body.apiIds)) {
      return this.fail('参数不正确');
    }
    return this.permissionService.bindApi(body);
  }
}
