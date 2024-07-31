import { IMiddleware, Logger, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { BaseClass } from '../../../core/baseClass';

/**
 * 日志中间件
 */
@Middleware()
export class LogMiddleware
  extends BaseClass
  implements IMiddleware<Context, NextFunction>
{
  @Logger('httpLogger')
  httpLogger: any;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      await next();
      const url = ctx.request.originalUrl;
      const user = ctx?.user?.id || null;
      const time = Date.now() - ctx.startTime;

      const ip = this.getRealIp(ctx);
      const reqBody = JSON.stringify(ctx.request.body);
      const resBody = JSON.stringify(ctx.response.body);
      this.httpLogger.info(
        `url: ${url}; querytime: ${time}; ip: ${ip}; uid: ${user}; reqbody: ${reqBody}; resbody: ${resBody}; authorization: ${ctx.headers.authorization}; ua: ${ctx.headers['user-agent']}; referer: ${ctx.headers.referer}; method: ${ctx.method}; status: ${ctx.status}`
      );
      ctx.response.set('x-log-full-time', `${time}ms`);
    };
  }
}
