import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import { BaseClass } from '../../../core/baseClass';
import { ERbacPermissionType, IComResponse } from '../../../interface';
import {
  covertListToTree,
  findNodeAndChildrenIds,
  getRandomId,
} from '../../common/utils/base';
import { RbacApi } from '../entity/api';
import { RbacApiPerBind } from '../entity/apiPerBind';
import { RbacPermission } from '../entity/permission';
import { RbacRolePerBind } from '../entity/rolePerBind';

@Provide()
export class PermissionService extends BaseClass {
  @InjectEntityModel(RbacPermission)
  rbacPermissionModel: Repository<RbacPermission>;

  @InjectEntityModel(RbacApiPerBind)
  rbacApiPerBindModel: Repository<RbacApiPerBind>;

  @InjectEntityModel(RbacApi)
  rbacApiModel: Repository<RbacApi>;

  @InjectEntityModel(RbacRolePerBind)
  RbacRolePerBindModel: Repository<RbacRolePerBind>;

  async addPermission(body: any): Promise<IComResponse> {
    if (body.type === ERbacPermissionType.PAGE) {
      const oldValue = await this.rbacPermissionModel.findOneBy({
        key: body.router,
        type: Not(ERbacPermissionType.CATALOG),
      });
      if (oldValue) return this.fail('页面路由已存在');
    }
    const permission = new RbacPermission();
    permission.name = body.name;
    permission.type = body.type;
    if (permission.type === ERbacPermissionType.PAGE) {
      permission.key = body.router;
    }
    if (permission.type === ERbacPermissionType.BUTTON) {
      permission.key = getRandomId();
    }
    permission.pid = body.pid;
    if (body.sort) {
      permission.sort = body.sort;
    }
    const res = await this.rbacPermissionModel.save(permission);
    return this.success(res);
  }

  async editPermission(body: any): Promise<IComResponse> {
    const permission = await this.rbacPermissionModel.findOneBy({
      id: body.id,
    });
    if (!permission) return this.fail('权限不存在');
    if (body.type) {
      permission.type = body.type;
    }
    if (body.name) {
      permission.name = body.name;
    }
    if (body.router) {
      permission.key = body.router;
    }
    if (body.sort) {
      permission.sort = body.sort;
    }
    const res = await this.rbacPermissionModel.save(permission);
    return this.success(res);
  }

  async delete(id: number): Promise<IComResponse> {
    const permissionTree = await this.getList();
    if (permissionTree.success) {
      const permissionList = permissionTree.data;
      const ids = findNodeAndChildrenIds(permissionList, id);
      if (ids.length === 0) {
        return this.fail('未找到要删除的权限');
      }
      await this.rbacPermissionModel.manager.transaction(async manager => {
        await manager.delete(RbacPermission, { id: In(ids) });
        await manager.delete(RbacApiPerBind, { permissionId: In(ids) });
        await manager.delete(RbacRolePerBind, { permissionId: In(ids) });
      });
      return this.success('删除成功');
    }
    return this.fail('删除失败');
  }

  async getList(): Promise<IComResponse> {
    const queryBuilder = this.rbacPermissionModel
      .createQueryBuilder('permission')
      .leftJoinAndMapMany(
        'permission.apis',
        RbacApiPerBind,
        'rbacApiPerBind',
        'permission.id = rbacApiPerBind.permissionId'
      )
      .leftJoinAndMapMany(
        'permission.apis',
        RbacApi,
        'api',
        'api.id = rbacApiPerBind.apiId'
      );
    queryBuilder.orderBy('permission.sort', 'ASC');

    const list = await queryBuilder.getMany();
    return this.success(covertListToTree(list, 'pid'));
  }

  async getApiList(): Promise<IComResponse> {
    const list = await this.rbacApiModel.find();
    const result = JSON.parse(JSON.stringify(list));
    const resTree = covertListToTree(result, 'parentId');
    return this.success(resTree);
  }

  async bindApi(body: any): Promise<IComResponse> {
    const { permissionId, apiIds } = body;
    await this.rbacApiPerBindModel.manager.transaction(async manager => {
      await manager.delete(RbacApiPerBind, { permissionId });
      await manager.insert(
        RbacApiPerBind,
        apiIds.map(v => ({
          permissionId,
          apiId: v,
        }))
      );
    });
    return this.success('绑定成功');
  }

  async getMenuList(): Promise<IComResponse> {
    const roleId = this.ctx.user.roleId;
    const queryBuilder = this.rbacPermissionModel
      .createQueryBuilder('permission')
      .leftJoin(
        RbacRolePerBind,
        'rolePerBind',
        'rolePerBind.permissionId = permission.id'
      )
      .where('rolePerBind.roleId = :roleId', { roleId });
    const list = await queryBuilder.getMany();
    const routerList = list
      .filter(v => v.type === ERbacPermissionType.PAGE)
      .map(v => v.key);
    const btnList = list
      .filter(v => v.type === ERbacPermissionType.BUTTON)
      .map(v => v.key);
    return this.success({ routerList, btnList });
  }
}
