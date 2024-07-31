import { Inject, Provide } from '@midwayjs/core';
import { BaseClass } from '../../../core/baseClass';
import { EFeishuMsgCardType, IComResponse } from '../../../interface';
import { FeishuAppUtils } from '../utils/feishu/app';
@Provide()
export class FeishuMsgService extends BaseClass {
  @Inject()
  feishuAppUtils: FeishuAppUtils;

  async sendMsgToUserWithText(uid: string, msg: string): Promise<IComResponse> {
    const options = {
      receive_id: uid,
      msg_type: 'text',
      content: JSON.stringify({ text: msg }),
    };
    const res = await this.feishuAppUtils.sendMsgToUser(options);
    return res;
  }

  async sendMsgToUserWithCard(
    title: string,
    uid: string,
    type: EFeishuMsgCardType,
    content: string[]
  ): Promise<IComResponse> {
    if (!Array.isArray(content)) {
      return this.fail('content must be an array');
    }
    const options = {
      receive_id: uid,
      msg_type: 'interactive',
      content: JSON.stringify({
        header: {
          title: {
            content: title,
            tag: 'plain_text',
          },
          template: type,
        },
        elements: [
          ...content.map(item => ({
            tag: 'div',
            text: {
              content: item,
              tag: 'lark_md',
            },
          })),
        ],
      }),
    };
    const res = await this.feishuAppUtils.sendMsgToUser(options);
    return res;
  }
}
