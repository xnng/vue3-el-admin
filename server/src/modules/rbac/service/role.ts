import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseClass } from '../../../core/baseClass';
import { IComResponse } from '../../../interface';
import { covertListToTree } from '../../common/utils/base';
import { RbacPermission } from '../entity/permission';
import { RbacRole } from '../entity/role';
import { RbacRolePerBind } from '../entity/rolePerBind';

@Provide()
export class RoleService extends BaseClass {
  @InjectEntityModel(RbacRole)
  RbacRoleModel: Repository<RbacRole>;

  @InjectEntityModel(RbacPermission)
  rbacPermissionModel: Repository<RbacPermission>;

  @InjectEntityModel(RbacRolePerBind)
  RbacRolePerBindModel: Repository<RbacRolePerBind>;

  async getList(query: any): Promise<IComResponse> {
    const { page, size } = query;
    const roleQuery = this.RbacRoleModel.createQueryBuilder('role')
      .orderBy('role.createTime', 'DESC')
      .skip((page - 1) * size)
      .take(size);
    if (query.name) {
      roleQuery.andWhere('role.name like :name', { name: `%${query.name}%` });
    }
    const result = await roleQuery.getManyAndCount();
    return this.makePagination(result);
  }

  async addRole(body: any): Promise<IComResponse> {
    const { name } = body;
    const oldVal = await this.RbacRoleModel.findOneBy({ name });
    if (oldVal) return this.fail('角色名称已存在');
    const role = new RbacRole();
    role.name = body.name;
    if (body.desc) {
      role.desc = body.desc;
    }
    await this.RbacRoleModel.save(role);
    return this.success();
  }

  async editRole(body: any): Promise<IComResponse> {
    const oldVal = await this.RbacRoleModel.findOneBy({ id: body.id });
    if (!oldVal) return this.fail('角色不存在');
    if (body.name) {
      const existVal = await this.RbacRoleModel.findOneBy({ name: body.name });
      if (existVal && existVal.id !== body.id) {
        return this.fail('该名称已被占用');
      }
      oldVal.name = body.name;
    }
    if (body.desc) {
      oldVal.desc = body.desc;
    }
    const newVal = await this.RbacRoleModel.save(oldVal);
    return this.success(newVal);
  }

  async deleteRole(id: number): Promise<IComResponse> {
    const role = await this.RbacRoleModel.findOneBy({ id });
    if (!role) return this.fail('角色不存在');
    if ([2, 3, 4].includes(role.id)) return this.fail('系统内置角色不可删除');
    await this.RbacRoleModel.softRemove(role);
    return this.success();
  }

  async getPermissionList(): Promise<IComResponse> {
    const queryBuilder =
      this.rbacPermissionModel.createQueryBuilder('permission');
    queryBuilder.orderBy('permission.sort', 'ASC');
    const list = await queryBuilder.getMany();
    return this.success(covertListToTree(list, 'pid'));
  }

  async getPermissionIds(roleId: number): Promise<IComResponse> {
    const role = await this.RbacRoleModel.findOneBy({ id: roleId });
    if (!role) return this.fail('角色不存在');
    const ids = await this.RbacRolePerBindModel.find({
      where: { roleId },
      select: ['permissionId'],
    });
    return this.success(ids.map(item => item.permissionId));
  }

  async bindPermission(body: any): Promise<IComResponse> {
    const { permissionIds, roleId } = body;
    const role = await this.RbacRoleModel.findOneBy({ id: roleId });
    if (!role) return this.fail('角色不存在');
    await this.RbacRolePerBindModel.manager.transaction(async transaction => {
      await this.RbacRolePerBindModel.softDelete({ roleId });
      await transaction.insert(
        RbacRolePerBind,
        permissionIds.map(permissionId => ({ roleId, permissionId }))
      );
    });
    return this.success('操作成功');
  }
}
