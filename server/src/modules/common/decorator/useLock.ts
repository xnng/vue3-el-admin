import {
  Autoload,
  Init,
  Inject,
  JoinPoint,
  MidwayDecoratorService,
  REQUEST_OBJ_CTX_KEY,
  createCustomMethodDecorator,
} from '@midwayjs/core';
import { BaseClass } from '../../../core/baseClass';
import { LockService } from '../service/lock';

export const LOCK_KEY = 'decorator:lock_key';

interface LockMetadata {
  /** * 非自动释放锁的情况下，锁住最长时间，单位毫秒 */
  time?: number;
  /** * 锁的范围，all 锁全局，user 锁用户，默认锁用户 */
  lockArea?: 'all' | 'user';
  /** * 是否自动释放锁，默认 true */
  autoRelaseLock?: boolean;
}

/**
 * Redis 分布式锁，防止接口重复请求/限流
 */
export function UseLock(options?: LockMetadata): MethodDecorator {
  let autoRelaseLock = true;
  if (options && options.autoRelaseLock !== undefined) {
    autoRelaseLock = options.autoRelaseLock;
  }
  return createCustomMethodDecorator(LOCK_KEY, {
    time: options?.time || 1000,
    lockArea: options?.lockArea || 'user',
    autoRelaseLock,
  });
}

@Autoload()
export class UseLockDecorator extends BaseClass {
  @Inject()
  decoratorService: MidwayDecoratorService;

  @Inject()
  lockService: LockService;

  @Init()
  init() {
    this.decoratorService.registerMethodHandler(LOCK_KEY, options => {
      return {
        around: async (joinPoint: JoinPoint) => {
          const instance = joinPoint.target;
          const ctx = instance[REQUEST_OBJ_CTX_KEY];

          const { time, lockArea, autoRelaseLock } = options.metadata;
          let key = '';
          const uid = ctx?.user?.uid;
          const method = ctx.method.toLowerCase();
          const path = ctx.path;
          const ip = this.getRealIp(ctx);
          if (lockArea === 'user') {
            const uKey = uid ? uid : ip;
            key = `lock:${uKey}:${method}_${path}`;
          } else {
            key = `lock:${method}_${path}`;
          }
          const lock = await this.lockService.lockAcquire(key, time);
          if (!lock) {
            return this.fail('操作频繁，请稍后再试');
          }
          const result = await joinPoint.proceed(...joinPoint.args);
          if (autoRelaseLock) {
            await this.lockService.lockRelease(key, lock);
          }
          return result;
        },
      };
    });
  }
}
