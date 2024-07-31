import { IMiddleware, Middleware } from '@midwayjs/core';
import { Context, NextFunction } from '@midwayjs/koa';

/**
 * 跨域
 */
@Middleware()
export class CorsMiddleware implements IMiddleware<Context, NextFunction> {
  addCorsHeader(ctx: Context) {
    ctx.set('Access-Control-Max-Age', '600');
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', '*');
    ctx.set('Access-Control-Allow-Methods', '*');
  }

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      this.addCorsHeader(ctx);
      if (ctx.request.method.toLowerCase() === 'options') {
        ctx.status = 200;
        return;
      } else {
        await next();
      }
    };
  }
}
