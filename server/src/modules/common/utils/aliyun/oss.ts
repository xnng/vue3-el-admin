// import { Config, Provide, Scope, ScopeEnum, sleep } from '@midwayjs/core';
// import * as OSS from 'ali-oss';
// import * as crypto from 'crypto';
// import * as dayjs from 'dayjs';
// import * as utc from 'dayjs/plugin/utc';
// import * as qs from 'qs';
// import { BaseClass } from '../core/baseClass';
// import { getCommonError } from '../middleware/execption';
// import { BaseFile, EOssType } from '../modules/base/entity/baseFile';

// /**
//  * 阿里云 oss 和 cdn 工具类
//  */
// @Provide()
// @Scope(ScopeEnum.Singleton)
// export class OssUtils extends BaseClass {
//   @Config('ossCdn')
//   ossCdnConfig;

//   @Config('custom')
//   custom;

//   private DEFAULT_EXPIRE_SECONDS = 3600;
//   private DEFAULT_FILE_MAXSIZE = 500;

//   /**
//    * @description 获取 oss 客户端
//    * @param ossType oss 类型
//    * @param useAccelerate 是否使用加速域名
//    * @returns {OSS}
//    */
//   public getOssClient(
//     ossType: EOssType,
//     useAccelerate?: boolean,
//     usePublicNet?: boolean
//   ): OSS {
//     let endpoint = this.custom.ossUseOssIntranet
//       ? this.ossCdnConfig[ossType].intranetEndpoint
//       : this.ossCdnConfig[ossType].ipv4Endpoint;
//     if (usePublicNet) {
//       endpoint = this.ossCdnConfig[ossType].ipv4Endpoint;
//     }
//     if (useAccelerate) {
//       endpoint = this.ossCdnConfig[ossType].superEndpoint;
//     }
//     return new OSS({
//       endpoint,
//       bucket: this.ossCdnConfig[ossType].bucket,
//       secure: true,
//       accessKeyId: this.ossCdnConfig[ossType].accessKeyId,
//       accessKeySecret: this.ossCdnConfig[ossType].accessKeySecret,
//     });
//   }

//   /**
//    * @description 获取 cdn 下载链接
//    * @param ossType oss 类型
//    * @param key 文件名，包含路径，示例：img/demo.png
//    * @param enhance 常用图片处理参数
//    * @param process 自定义图片处理参数 https://help.aliyun.com/document_detail/183902.html
//    * @param expireSeconds 签名失效时间，单位秒，默认 30 分钟
//    * @returns 签名后的 url
//    */
//   public getCdnUrl(
//     ossType: EOssType,
//     key: string,
//     enhance?: IImageEnhance,
//     process?: string,
//     expireSeconds?: number
//   ): string {
//     const queryParams = {};
//     const fileKey = key.startsWith('/') ? key : `/${key}`;
//     if (ossType === EOssType.PRIVATE) {
//       const expireIn = expireSeconds
//         ? expireSeconds
//         : this.DEFAULT_EXPIRE_SECONDS;
//       const timestamp = dayjs.extend(utc).utc().unix() + expireIn;
//       const rand = 0;
//       const uid = 0;
//       const privateKey = this.ossCdnConfig[ossType].cdnKey;
//       const HashString = `${fileKey}-${timestamp}-${rand}-${uid}-${privateKey}`;
//       const HashValue = crypto
//         .createHash('md5')
//         .update(HashString)
//         .digest('hex');

//       const auth_key = `${timestamp}-${rand}-${uid}-${HashValue}`;
//       queryParams['auth_key'] = auth_key;
//     }

//     if (enhance) {
//       let process = 'image';
//       if (enhance.thumbnail) {
//         const thumbnail =
//           enhance.thumbnailMode === 'w'
//             ? `w_${enhance.thumbnail},m_mfit`
//             : `l_${enhance.thumbnail}`;
//         process += `/resize,${thumbnail}`;
//       }
//       if (enhance.format) {
//         process += `/format,${enhance.format}`;
//       }
//       if (enhance.compress) {
//         process += `/quality,Q_${enhance.compress}`;
//       }
//       queryParams['x-oss-process'] = process;
//     }
//     if (process) {
//       queryParams['x-oss-process'] = process;
//     }
//     return `${this.ossCdnConfig[ossType].cdnHost}${fileKey}${
//       JSON.stringify(queryParams) !== '{}' ? '?' : ''
//     }${qs.stringify(queryParams)}`;
//   }

//   /**
//    * @description 获取 oss 下载链接，主要用于内网中转数据
//    * @param ossType oss 类型
//    * @param key 文件名，包含路径，示例：img/demo.png
//    * @param enhance 常用图片处理参数
//    * @param process 自定义图片处理参数 https://help.aliyun.com/document_detail/183902.html
//    * @param useAccelerate 是否使用加速域名，默认不使用
//    * @param usePublicNet 是否指定公网，默认是内网
//    * @param expireSeconds 签名失效时间，单位秒，默认 30 分钟
//    * @returns 签名后的 url
//    */
//   public getOssUrl(
//     ossType: EOssType,
//     key: string,
//     enhance?: IImageEnhance,
//     process?: string,
//     useAccelerate?: boolean,
//     usePublicNet?: boolean,
//     expireSeconds?: number
//   ): string {
//     const options: OSS.SignatureUrlOptions = {
//       expires: expireSeconds ? expireSeconds : this.DEFAULT_EXPIRE_SECONDS,
//     };
//     if (enhance) {
//       let process = 'image';
//       if (enhance.thumbnail) {
//         const thumbnail =
//           enhance.thumbnailMode === 'w'
//             ? `w_${enhance.thumbnail},m_mfit`
//             : `l_${enhance.thumbnail}`;
//         process += `/resize,${thumbnail}`;
//       }
//       if (enhance.format) {
//         process += `/format,${enhance.format}`;
//       }
//       if (enhance.compress) {
//         process += `/quality,Q_${enhance.compress}`;
//       }
//       options.process = process;
//     }
//     if (process) {
//       options.process = process;
//     }
//     const url = this.getOssClient(
//       ossType,
//       useAccelerate,
//       usePublicNet
//     ).signatureUrl(key, options);
//     if (ossType === EOssType.PRIVATE) return url;

//     const xOssProcess = qs.parse(url.split('?')[1])['x-oss-process'];
//     if (xOssProcess) {
//       return `${url.split('?')[0]}?x-oss-process=${xOssProcess}`;
//     } else {
//       return url.split('?')[0];
//     }
//   }

//   /**
//    * @description 服务端上传文件
//    * @param appKey 应用 Id
//    * @param ossType oss 类型
//    * @param key 文件名，包含路径，示例：img/demo.png
//    * @param path 本地文件路径
//    * @param userId 用户 Id
//    * @returns 包含路径的文件名
//    */
//   public async serverUpload(
//     appKey: string,
//     ossType: EOssType,
//     key: string,
//     path: string,
//     userId: number,
//     timeout?: number
//   ): Promise<BaseFile> {
//     const callback: OSS.ObjectCallback = {
//       url: `${this.custom.ossCallback}/${key.split('/').reverse()[0]}`,
//       body:
//         `ossType=${ossType}` +
//         `&appKey=${appKey}` +
//         '&bucket=${bucket}' +
//         '&object=${object}' +
//         '&etag=${etag}' +
//         '&size=${size}' +
//         '&image_format=${imageInfo.format}' +
//         '&mimeType=${mimeType}' +
//         '&image_height=${imageInfo.height}' +
//         '&image_width=${imageInfo.width}' +
//         `&userId=${userId}`,
//       contentType: 'application/x-www-form-urlencoded',
//     };
//     try {
//       const result = await this.getOssClient(ossType).put(key, path, {
//         callback,
//         timeout: timeout || 3000,
//       });
//       return result.data['data'];
//     } catch (error) {
//       this.logger.warn(
//         '上传图片失败',
//         JSON.stringify(callback),
//         key,
//         path,
//         error.stack
//       );
//       await sleep(300);
//       try {
//         const result = await this.getOssClient(ossType).put(key, path, {
//           callback,
//           timeout: timeout || 5000,
//         });
//         return result.data['data'];
//       } catch (error) {
//         this.logger.error(
//           '第二次上传图片失败',
//           JSON.stringify(callback),
//           key,
//           path,
//           error.stack
//         );
//         throw getCommonError('上传失败，请重试');
//       }
//     }
//   }

//   /**
//    * @description 前端上传文件
//    * @param appkey 应用 id
//    * @param ossType oss 类型
//    * @param key 文件全路径
//    * @param userId 用户 Id
//    * @param useAccelerate 是否使用加速域名
//    * @returns 前端直传 oss 所需的参数
//    */
//   public getUploadParams(
//     appKey: string,
//     ossType: EOssType,
//     key: string,
//     userId: number,
//     useAccelerate?: boolean,
//     useIntranet?: boolean
//   ) {
//     const policy = this.getPolicyBase64(key);
//     const {
//       bucket,
//       ipv4Endpoint,
//       superEndpoint,
//       accessKeySecret,
//       intranetEndpoint,
//       accessKeyId,
//     } = this.ossCdnConfig[ossType];
//     let ossHost = `https://${bucket}.${ipv4Endpoint}`;
//     if (useIntranet && process.env.NODE_ENV === 'production') {
//       ossHost = `https://${bucket}.${intranetEndpoint}`;
//     }
//     const superOssHost = `https://${bucket}.${superEndpoint}`;
//     const signature = crypto
//       .createHmac('sha1', accessKeySecret)
//       .update(policy)
//       .digest('base64');
//     const callback = {
//       callbackUrl: `${this.custom.ossCallback}/${key.split('/').reverse()[0]}`,
//       callbackBody:
//         `ossType=${ossType}` +
//         `&appKey=${appKey}` +
//         '&bucket=${bucket}' +
//         '&object=${object}' +
//         '&etag=${etag}' +
//         '&size=${size}' +
//         '&mimeType=${mimeType}' +
//         '&image_format=${imageInfo.format}' +
//         '&image_height=${imageInfo.height}' +
//         '&image_width=${imageInfo.width}' +
//         `&userId=${userId}`,
//       callbackBodyType: 'application/x-www-form-urlencoded',
//     };
//     return {
//       uploadUrl: useAccelerate ? superOssHost : ossHost,
//       formData: {
//         callback: Buffer.from(JSON.stringify(callback)).toString('base64'),
//         key,
//         success_action_status: 200,
//         OSSAccessKeyId: accessKeyId,
//         policy,
//         signature,
//       },
//     };
//   }

//   /**
//    * @param key 文件名，包含路径，例如：img/demo.png
//    * @param fileMaxSize 最大可上传的文件大小，单位 MB，默认 200 MB
//    * @returns policy base64 string
//    */
//   private getPolicyBase64(key: string, fileMaxSize?: number) {
//     const expireTime = this.DEFAULT_EXPIRE_SECONDS; // 签名失效时间，单位：秒
//     const expiration = new Date(
//       new Date().getTime() + expireTime * 1000
//     ).toISOString();
//     const maxSize = fileMaxSize ? fileMaxSize : this.DEFAULT_FILE_MAXSIZE;
//     const policyString = {
//       expiration,
//       conditions: [
//         ['content-length-range', 0, maxSize * 1024 * 1024],
//         ['starts-with', '$key', key],
//       ],
//     };
//     const buffer = Buffer.from(JSON.stringify(policyString));
//     return buffer.toString('base64');
//   }

//   async deleteFile(ossType: EOssType, key: string) {
//     await this.getOssClient(ossType).delete(key);
//   }
// }

// export interface IImageEnhance {
//   /**
//    * 缩略图宽度
//    */
//   thumbnail?: number;
//   /**
//    * 缩略图模式
//    */
//   thumbnailMode?: 'l' | 'w';
//   /**
//    * 压缩率，0 到 100
//    */
//   compress?: number;
//   /**
//    * 格式转换，目标格式
//    */
//   format?: string;
// }
