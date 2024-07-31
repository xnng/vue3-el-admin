import { IMiddleware, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';
import { BaseClass } from '../../../core/baseClass';

/**
 * 可以返回给前端提示的业务错误
 * @param message 错误信息
 * @returns Error
 */
export const getCommonError = (message: string): Error => {
  const error = new Error();
  error.name = 'CommonError';
  error.message = message;
  return error;
};

/**
 * 全局异常处理中间件
 */
@Middleware()
export class ExecptionMiddleware
  extends BaseClass
  implements IMiddleware<Context, NextFunction>
{
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      try {
        await next();
      } catch (error) {
        switch (error.name) {
          case 'MidwayValidationError':
            ctx.status = 200;
            ctx.body = this.fail(error.message);
            break;
          case 'QueryFailedError':
            this.logger.error(new Error(`QueryFailedError: ${error.stack}`));
            ctx.status = 400;
            ctx.body = this.fail('系统错误:sql');
            break;
          case 'ForbiddenError':
            this.logger.warn(
              `ForbiddenError: ${ctx.path}, ${ctx.method}, ${ctx.user.id}`
            );
            ctx.status = 401;
            ctx.body = this.fail('暂无权限');
            break;
          case 'CommonError':
            this.logger.error(`CommonError: ${error.message}`);
            ctx.status = 200;
            ctx.body = this.fail(error.message);
            break;
          case 'NotFoundError':
            ctx.body = this.fail('404');
            break;
          default:
            // 未知的系统错误，可能包含敏感信息，不返回给前端 error message
            this.logger.error(
              new Error(`UNKNOWN SERVER ERROR: ${error.stack}`)
            );
            ctx.status = 400;
            ctx.body = this.fail('系统错误');
        }
      }
    };
  }
}
