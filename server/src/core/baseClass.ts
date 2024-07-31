import { Inject, Logger } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ILogger } from '@midwayjs/logger';
import { RedisService } from '@midwayjs/redis';
import { IComResponse } from './../interface';

export abstract class BaseClass {
  @Inject()
  protected ctx: Context;

  @Logger()
  protected logger: ILogger;

  @Inject()
  protected redisService: RedisService;

  /**
   * 通用处理失败情况下的返回信息
   * @param msg 错误信息
   * @returns {IComResponse}
   */
  protected fail(msg: string): IComResponse {
    return {
      msg,
      success: false,
    };
  }

  /**
   * 通用处理成功情况下的返回信息
   * @param data 返回数据
   * @returns {IComResponse}
   */
  protected success(data?: any): IComResponse {
    return {
      data,
      success: true,
    };
  }

  /**
   * 从请求头中获取 IP 地址
   */
  public getRealIp(ctx: Context): string {
    const ipList = ctx.headers['x-forwarded-for'];
    if (!ipList) return 'unkown';
    return (<string>ipList).split(',')[0];
  }

  /**
   * 分页列表的返回格式
   */
  public makePagination(body: [any[], number], enumObj?: any) {
    return this.success({
      list: body[0],
      total: body[1],
      enum: enumObj || null,
    });
  }

  /**
   * 获取枚举列表
   */
  public getEnumList(enumObj: object): { label: string; value: string }[] {
    const enumList = Object.entries(enumObj)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => typeof value === 'string')
      .map(([label, value]) => ({
        label,
        value,
      }));
    return enumList;
  }
}
