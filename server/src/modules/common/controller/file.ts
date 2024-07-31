import { Body, Controller, Get, Inject, Post, Query } from '@midwayjs/core';
import { BaseClass } from '../../../core/baseClass';
import { EBucketType, IComResponse } from '../../../interface';
import { BaseFileService } from '../service/file/fileService';

@Controller('/file')
export class BaseFileController extends BaseClass {
  @Inject()
  baseFileService: BaseFileService;

  /**
   * 获取文件上传参数
   */
  @Get('/getUploadParams')
  async getFileUpload(
    @Query('fileType') fileType: string,
    @Query('type') type: EBucketType
  ): Promise<IComResponse> {
    if (!fileType) return this.fail('文件后缀名不能为空');
    if (!type) return this.fail('上传类型不能为空');
    return await this.baseFileService.getFileSignUrl(fileType, type);
  }

  /**
   * 保存文件
   */
  @Post('/save')
  async saveFile(@Body() body: any): Promise<IComResponse> {
    if (!body.key) return this.fail('key 不能为空');
    return await this.baseFileService.saveFile(body);
  }

  /**
   * 根据 key 获取文件地址
   */
  @Get('/getUrl')
  async getFileUrlByKey(@Query('key') key: string): Promise<IComResponse> {
    if (!key) return this.fail('key 不能为空');
    return await this.baseFileService.getFileUrlByKey(key);
  }
}

@Controller('/admin/file', { description: '文件模块' })
export class AdminBaseFileController extends BaseClass {
  @Inject()
  baseFileService: BaseFileService;

  @Get('/getUploadParams', { description: '获取文件上传参数' })
  async getFileUpload(
    @Query('fileType') fileType: string,
    @Query('type') type: EBucketType
  ): Promise<IComResponse> {
    if (!fileType) return this.fail('文件后缀名不能为空');
    if (!type) return this.fail('上传类型不能为空');
    return await this.baseFileService.getFileSignUrl(fileType, type);
  }

  @Post('/save', { description: '保存文件' })
  async saveFile(@Body() body: any): Promise<IComResponse> {
    if (!body.key) return this.fail('key 不能为空');
    return await this.baseFileService.saveFile(body);
  }

  @Get('/getUrl', { description: '获取文件访问链接' })
  async getFileUrlByKey(@Query('key') key: string): Promise<IComResponse> {
    if (!key) return this.fail('key 不能为空');
    return await this.baseFileService.getFileUrlByKey(key);
  }
}
