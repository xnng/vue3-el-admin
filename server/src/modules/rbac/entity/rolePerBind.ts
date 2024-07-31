import { Column, Entity, Index } from 'typeorm';
import { BaseModel } from '../../../core/baseMode';

@Entity()
export class RbacRolePerBind extends BaseModel {
  @Column({ type: 'int' })
  @Index()
  roleId: number;

  @Column({ type: 'int' })
  @Index()
  permissionId: number;
}
