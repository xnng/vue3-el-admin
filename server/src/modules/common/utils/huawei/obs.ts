import { Config, Singleton } from '@midwayjs/core';
import * as ObsClient from 'esdk-obs-nodejs';
import { BaseClass } from '../../../../core/baseClass';
import { EBucketName, EBucketType } from '../../../../interface';
import { getRandomId } from '../base';

@Singleton()
export class OBSUtils extends BaseClass {
  @Config('OBS')
  obsConfig: any;

  getClient(obsBucketKey: EBucketName) {
    return new ObsClient({
      access_key_id: this.obsConfig[obsBucketKey].accessKeyId,
      secret_access_key: this.obsConfig[obsBucketKey].secretAccessKey,
      server: this.obsConfig[obsBucketKey].endpoint,
      signature: 'obs',
    });
  }

  async getPostSignUrl(query: {
    bucketName: EBucketName;
    bucketType: EBucketType;
    fileType: string;
  }): Promise<{
    host: string;
    uploadParams: any;
  }> {
    const client = this.getClient(query.bucketName);
    const key = `file/${getRandomId()}.${query.fileType}`;
    const expires = 3600;
    const res = client.createPostSignatureSync({
      Expires: expires,
    });

    const bucketConfig = this.obsConfig[query.bucketName];

    return {
      host: `https://${bucketConfig.bucket}.${bucketConfig.endpoint}`,
      uploadParams: {
        key,
        policy: res.Policy,
        accessKeyId: bucketConfig.accessKeyId,
        signature: res.Signature,
      },
    };
  }

  async getFileUrl(key: string, bucketKey: EBucketName): Promise<string> {
    const bucketConfig = this.obsConfig[bucketKey];
    return `https://${bucketConfig.bucket}.${bucketConfig.endpoint}/${key}`;
  }
}
