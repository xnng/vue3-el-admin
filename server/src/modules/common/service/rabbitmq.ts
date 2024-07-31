import {
  Autoload,
  Config,
  Destroy,
  Init,
  Provide,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import * as amqp from 'amqp-connection-manager';
import { ChannelWrapper } from 'amqp-connection-manager';
import { ERabbitQueue } from '../../../interface';

@Autoload()
@Provide()
@Scope(ScopeEnum.Singleton)
export class RabbitmqService {
  private connection: amqp.AmqpConnectionManager;

  private channelWrapper: ChannelWrapper;

  @Config('rabbitmq')
  rabbitmqConfig;

  @Init()
  async connect() {
    this.connection = amqp.connect(this.rabbitmqConfig);
    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: (channel: amqp.Channel) => {
        return Promise.all(
          Object.values(ERabbitQueue).map(queue =>
            channel.assertQueue(queue, { durable: true })
          )
        );
      },
    });
  }

  public async sendToQueue(queueName: string, data: object): Promise<boolean> {
    return this.channelWrapper.sendToQueue(queueName, data);
  }

  @Destroy()
  async close() {
    await this.channelWrapper.close();
    await this.connection.close();
  }
}
