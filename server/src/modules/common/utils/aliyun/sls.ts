import * as $OpenApi from '@alicloud/openapi-client';
import Sls20201230, * as $Sls20201230 from '@alicloud/sls20201230';
import * as $Util from '@alicloud/tea-util';
import { Config, Singleton } from '@midwayjs/core';
import { BaseClass } from '../../../../core/baseClass';
import { ESlsStore, IComResponse } from '../../../../interface';

@Singleton()
export class SlsUtils extends BaseClass {
  @Config('sls')
  config: any;

  getClient(logStore: ESlsStore): Sls20201230 {
    const config = new $OpenApi.Config({
      accessKeyId: this.config[logStore].accessKeyId,
      accessKeySecret: this.config[logStore].secretAccessKey,
    });
    config.endpoint = `${this.config[logStore].region}.log.aliyuncs.com`;
    return new Sls20201230(config);
  }

  async getLogs(
    logStore: ESlsStore,
    from: number,
    to: number,
    query: string
  ): Promise<IComResponse> {
    const client = this.getClient(logStore);
    const getLogsRequest = new $Sls20201230.GetLogsRequest({
      from,
      to,
      query,
    });
    const runtime = new $Util.RuntimeOptions({});
    const headers: { [key: string]: string } = {};
    try {
      const res = await client.getLogsWithOptions(
        this.config[logStore].project,
        this.config[logStore].logStore,
        getLogsRequest,
        headers,
        runtime
      );
      if (res.statusCode !== 200) {
        this.logger.error('获取日志失败1', logStore, from, to, query, res);
        return this.fail('获取日志失败');
      }
      return this.success(res.body);
    } catch (error) {
      this.logger.error('获取日志失败2', logStore, from, to, query, error);
      return this.fail('获取日志失败');
    }
  }
}
