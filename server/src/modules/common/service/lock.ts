import { Inject, Provide } from '@midwayjs/core';
import { RedisService } from '@midwayjs/redis';
import { v4 as uuidv4 } from 'uuid';

@Provide()
export class LockService {
  @Inject()
  protected redisService: RedisService;

  async lockAcquire(key: string, expires = 1000): Promise<string | null> {
    const value = uuidv4();
    const res = await this.redisService.set(key, value, 'PX', expires, 'NX');
    return res === 'OK' ? value : null;
  }

  async lockRelease(key: string, value: string): Promise<boolean> {
    const res = await this.redisService.eval(
      `if redis.call("get",KEYS[1]) == ARGV[1] then
          return redis.call("del",KEYS[1])
      else
          return 0
      end
      `,
      1,
      key,
      value
    );
    return res === 1;
  }
}
