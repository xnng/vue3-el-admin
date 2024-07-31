import { Column, Entity, Index } from 'typeorm';
import { BaseModel } from '../../../core/baseMode';
import { EBucketName, EBucketType } from '../../../interface';

@Entity()
export class BaseFile extends BaseModel {
  @Column({
    unique: true,
  })
  key: string;

  @Column({
    type: 'enum',
    enum: EBucketType,
    comment: '存储桶类型',
  })
  @Index()
  bucketType: EBucketType;

  @Column({
    type: 'enum',
    enum: EBucketName,
    comment: '存储桶名称',
  })
  @Index()
  bucketNameKey: EBucketName;

  @Column({
    nullable: true,
    comment: '文件类型',
  })
  fileType: string;
}
