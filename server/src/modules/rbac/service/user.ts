import { Config, Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseClass } from '../../../core/baseClass';
import { IComResponse } from '../../../interface';
import { BaseUser } from '../../common/entity/baseUser';
import { RabbitmqService } from '../../common/service/rabbitmq';
import { FeishuAppUtils } from '../../common/utils/feishu/app';
import { RbacRole } from '../../rbac/entity/role';

@Provide()
export class AdminUserService extends BaseClass {
  @Config('jwt')
  jwtConfig;

  @Inject()
  feishuAppUtils: FeishuAppUtils;

  @InjectEntityModel(BaseUser)
  userModel: Repository<BaseUser>;

  @InjectEntityModel(RbacRole)
  RbacRoleModel: Repository<RbacRole>;

  @Inject()
  rabbitmqService: RabbitmqService;

  async getList(query: any): Promise<IComResponse> {
    const { page, size } = query;
    const userQuery = this.userModel
      .createQueryBuilder('user')
      .leftJoinAndMapOne('user.role', RbacRole, 'role', 'user.roleId = role.id')
      .orderBy('user.createTime', 'DESC')
      .skip((page - 1) * size)
      .take(size);
    if (query.name) {
      userQuery.andWhere('user.name like :name', { name: `%${query.name}%` });
    }
    const result = await userQuery.getManyAndCount();
    return this.makePagination(result);
  }

  async bindRole(body: any): Promise<IComResponse> {
    const { uid, roleId } = body;
    const user = await this.userModel.findOneBy({ uid });
    if (!user) return this.fail('用户不存在');
    const role = await this.RbacRoleModel.findOneBy({ id: roleId });
    if (!role) return this.fail('角色不存在');
    user.roleId = roleId;
    this.logger.warn('updateUser', user);
    const res = await this.userModel.save(user);
    return this.success(res);
  }
}
