import { Column, Entity, Index } from 'typeorm';
import { BaseModel } from '../../../core/baseMode';

@Entity()
export class RbacApiPerBind extends BaseModel {
  @Column()
  @Index()
  apiId: number;

  @Column()
  @Index()
  permissionId: number;
}
