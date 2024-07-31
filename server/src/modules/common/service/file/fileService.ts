import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseClass } from '../../../../core/baseClass';
import { EBucketType, IComResponse } from '../../../../interface';
import { BaseFile } from '../../entity/baseFile';
import { FileStrategyFactory } from './fileStrategyFactory';

@Provide()
export class BaseFileService extends BaseClass {
  @Inject()
  fileStrategyFactory: FileStrategyFactory;

  @InjectEntityModel(BaseFile)
  baseFileModel: Repository<BaseFile>;

  async saveFile(body: any): Promise<IComResponse> {
    await this.baseFileModel.restore({ key: body.key });
    return this.getFileUrlByKey(body.key);
  }

  async getFileSignUrl(
    fileType: string,
    type: EBucketType
  ): Promise<IComResponse> {
    return this.fileStrategyFactory
      .createStrategy(type)
      .getFileSignUrl(fileType);
  }

  async getFileUrlByKey(key: string): Promise<IComResponse> {
    const file = await this.baseFileModel.findOneBy({ key });
    if (!file) return this.fail('文件不存在');
    return this.fileStrategyFactory
      .createStrategy(file.bucketType)
      .getFileUrlByKey(key);
  }
}
