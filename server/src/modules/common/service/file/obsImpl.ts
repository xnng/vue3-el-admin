import { Inject, Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { BaseClass } from '../../../../core/baseClass';
import { EBucketName, EBucketType, IComResponse } from '../../../../interface';
import { BaseFile } from '../../entity/baseFile';
import { OBSUtils } from '../../utils/huawei/obs';
import { FileStrategy, IgetFileUrlByKeyRes } from './fileStrategy';

@Provide()
export class ObsImpl extends BaseClass implements FileStrategy {
  @Inject()
  OBSUtils: OBSUtils;

  @InjectEntityModel(BaseFile)
  baseFileModel: Repository<BaseFile>;

  async getFileSignUrl(fileType: string): Promise<IComResponse> {
    const fileConfig = {
      bucketName: EBucketName.No1,
      bucketType: EBucketType.OBS,
    };
    const result = await this.OBSUtils.getPostSignUrl({
      fileType,
      ...fileConfig,
    });
    await this.baseFileModel.manager.transaction(async manager => {
      const fileRes = await manager.save(BaseFile, {
        key: result.uploadParams.key,
        ...fileConfig,
      });
      await manager.softDelete(BaseFile, { id: fileRes.id });
    });
    return this.success(result);
  }

  async getFileUrlByKey(key: string): Promise<IgetFileUrlByKeyRes> {
    const file = await this.baseFileModel.findOneBy({ key });
    if (!file) return this.fail('文件不存在');
    return this.success({
      key: file.key,
      url: await this.OBSUtils.getFileUrl(file.key, file.bucketNameKey),
    });
  }
}
