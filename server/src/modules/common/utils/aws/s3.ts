import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Config, Singleton } from '@midwayjs/core';
import { BaseClass } from '../../../../core/baseClass';
import { EBucketName, EBucketType } from '../../../../interface';
import { getRandomId } from '../base';

@Singleton()
export class S3Utils extends BaseClass {
  @Config('s3')
  s3Config: any;

  getClient(s3BucketKey: EBucketName) {
    return new S3Client({
      region: this.s3Config[s3BucketKey].region,
      credentials: {
        accessKeyId: this.s3Config[s3BucketKey].accessKeyId,
        secretAccessKey: this.s3Config[s3BucketKey].secretAccessKey,
      },
    });
  }

  async getPostSignUrl(query: {
    bucketType: EBucketType;
    fileType: string;
    bucketName: EBucketName;
  }): Promise<{
    host: string;
    uploadParams: any;
  }> {
    const s3Client = this.getClient(query.bucketName);
    const key = `file/${getRandomId()}.${query.fileType}`;
    const bucketConfig = this.s3Config[query.bucketName];
    const { url, fields } = await createPresignedPost(s3Client, {
      Bucket: bucketConfig.bucket,
      Key: key,
      Conditions: [['content-length-range', 1, 1024 * 1024 * 100]],
      Expires: 3600,
    });
    return {
      host: url,
      uploadParams: {
        key,
        'X-Amz-Credential': fields['X-Amz-Credential'],
        'X-Amz-Algorithm': fields['X-Amz-Algorithm'],
        'X-Amz-Date': fields['X-Amz-Date'],
        Policy: fields.Policy,
        'X-Amz-Signature': fields['X-Amz-Signature'],
      },
    };
  }

  async getFileUrl(key: string, bucketKey: EBucketName): Promise<string> {
    const bucketConfig = this.s3Config[bucketKey];
    if (bucketConfig.isPublic) {
      return `https://${bucketConfig.bucket}.s3.${bucketConfig.region}.amazonaws.com/${key}`;
    } else {
      const command = new PutObjectCommand({
        Bucket: bucketConfig.bucket,
        Key: key,
      });
      const signedUrl = await getSignedUrl(this.getClient(bucketKey), command, {
        expiresIn: 3600,
      });
      return signedUrl;
    }
  }
}
