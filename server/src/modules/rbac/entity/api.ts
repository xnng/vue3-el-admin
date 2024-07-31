import { Column, Entity, Index } from 'typeorm';
import { BaseModel } from '../../../core/baseMode';
import { ERbacApiType } from '../../../interface';

@Entity()
@Index(['method', 'url'])
export class RbacApi extends BaseModel {
  @Column()
  description: string;

  @Column({ nullable: true })
  method: string;

  @Column()
  url: string;

  @Column({
    comment: 'api 类型',
    type: 'enum',
    enum: ERbacApiType,
  })
  type: ERbacApiType;

  @Column({ default: -1 })
  parentId: number;
}
