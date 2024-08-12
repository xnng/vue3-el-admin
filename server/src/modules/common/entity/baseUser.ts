import { Column, Entity, Index } from 'typeorm';
import { BaseModel } from '../../../core/baseMode';
import { EUseStatus } from '../../../interface';

@Entity()
export class BaseUser extends BaseModel {
  @Column()
  @Index()
  uid: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  mobile: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: EUseStatus,
    default: EUseStatus.ENABLE,
  })
  status: EUseStatus;

  @Column({
    type: 'int',
    default: -1,
  })
  roleId: number;

  @Column({
    comment: '改密码后需修改此字段，让旧 token 立即失效',
    default: '8sAod8dc',
  })
  tokenFlag: string;
}
