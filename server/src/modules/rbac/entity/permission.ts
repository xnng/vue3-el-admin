import { Column, Entity } from 'typeorm';
import { BaseModel } from '../../../core/baseMode';
import { ERbacPermissionType } from '../../../interface';

@Entity()
export class RbacPermission extends BaseModel {
  @Column({ comment: '权限名称' })
  name: string;

  @Column({ comment: '权限类型', type: 'enum', enum: ERbacPermissionType })
  type: ERbacPermissionType;

  @Column({
    comment:
      '如果类型是页面，则这里填写 url, 如果这里是按钮, 则后端生成一个唯一的 key',
    nullable: true,
  })
  key: string;

  @Column({ comment: '排序', default: 0 })
  sort: number;

  @Column({ type: 'int' })
  pid: number;
}
