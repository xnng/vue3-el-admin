import { Inject, Provide } from '@midwayjs/core';
import { EBucketType } from '../../../../interface';
import { FileStrategy } from './fileStrategy';
import { ObsImpl } from './obsImpl';
import { S3Impl } from './s3Impl';

@Provide()
export class FileStrategyFactory {
  @Inject()
  obsImpl: ObsImpl;

  @Inject()
  s3Impl: S3Impl;

  createStrategy(type: string): FileStrategy {
    switch (type) {
      case EBucketType.OBS:
        return this.obsImpl;
      case EBucketType.S3:
        return this.s3Impl;
      default:
        return this.obsImpl;
    }
  }
}
