import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../../core/baseMode';

@Entity()
export class RbacRole extends BaseModel {
  @Column({ comment: '角色名称' })
  name: string;

  @Column({ comment: '角色描述', nullable: true })
  desc: string;

  @Column({ comment: '是否是默认角色', default: false })
  isDefault: boolean;
}
