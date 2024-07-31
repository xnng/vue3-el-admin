import { Config, Singleton } from '@midwayjs/core';
import axios from 'axios';
import { BaseClass } from '../../../../core/baseClass';
import { ERediskey, IComResponse } from '../../../../interface';

@Singleton()
export class FeishuAppUtils extends BaseClass {
  @Config('feishu')
  feishuConfig: any;

  async getAppAccessToken(): Promise<IComResponse> {
    const token = await this.redisService.get(ERediskey.feishuAppToken);
    if (token) {
      return this.success(token);
    }
    const options = {
      app_id: this.feishuConfig.appId,
      app_secret: this.feishuConfig.appSecret,
    };
    try {
      const res = await axios({
        url: 'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal',
        method: 'post',
        data: options,
      });
      if (res.data.code === 0) {
        const { app_access_token, expire } = res.data;
        await this.redisService.setex(
          ERediskey.feishuAppToken,
          expire - 60,
          app_access_token
        );
        const token = await this.redisService.get(ERediskey.feishuAppToken);
        return this.success(token);
      } else {
        this.logger.error('获取应用凭证失败1', res.data);
        return this.fail('获取应用凭证失败');
      }
    } catch (error) {
      this.logger.error('获取应用凭证失败2', error);
      return this.fail('获取应用凭证失败');
    }
  }

  async getUserInfoByCode(code: string): Promise<IComResponse> {
    const tokenRes = await this.getUserAccessToken(code);
    if (!tokenRes.success) {
      return tokenRes;
    }
    const { access_token, refresh_token, expires_in, refresh_expires_in } =
      tokenRes.data;
    const res = await axios({
      url: 'https://open.feishu.cn/open-apis/authen/v1/user_info',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    if (res.data.code === 0) {
      this.logger.info('获取用户信息成功', JSON.stringify(res.data));
      const { avatar_middle, email, name, mobile, user_id } = res.data.data;

      await this.redisService.setex(
        ERediskey.feishuUserToken + `${name}_${user_id}`,
        expires_in - 60,
        access_token
      );
      await this.redisService.setex(
        ERediskey.feishuUserRefreshToken + `${name}_${user_id}`,
        refresh_expires_in - 60,
        refresh_token
      );

      return this.success({
        avatar: avatar_middle,
        email,
        name,
        mobile,
        uid: user_id,
      });
    } else {
      this.logger.error('获取用户信息失败', JSON.stringify(res.data));
      return this.fail('登录失败');
    }
  }

  async getUserAccessToken(code: string): Promise<IComResponse> {
    const appAccesstokenRes = await this.getAppAccessToken();
    if (!appAccesstokenRes.success) {
      return appAccesstokenRes;
    }
    const appAccessToken = appAccesstokenRes.data;
    const options = {
      code,
      grant_type: 'authorization_code',
    };
    const res = await axios({
      url: 'https://open.feishu.cn/open-apis/authen/v1/oidc/access_token',
      method: 'post',
      headers: {
        Authorization: `Bearer ${appAccessToken}`,
      },
      data: options,
    });
    if (res.data.code === 0) {
      this.logger.info('获取userAccessToken成功', JSON.stringify(res.data));
      const { access_token, refresh_token, expires_in, refresh_expires_in } =
        res.data.data;
      return this.success({
        access_token,
        refresh_token,
        expires_in,
        refresh_expires_in,
      });
    }
    if (res.data.code === 20003) {
      this.logger.warn('code已经被使用过了', res.data);
      return this.fail('code已经被使用过了');
    }
    this.logger.error('获取用户凭证失败', res.data);
    return this.fail('获取用户凭证失败');
  }

  /**
   * https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal
   */
  async getTenantAccessToken(): Promise<IComResponse> {
    const token = await this.redisService.get(ERediskey.feishuTenantToken);
    if (token) {
      return this.success(token);
    }
    const options = {
      app_id: this.feishuConfig.appId,
      app_secret: this.feishuConfig.appSecret,
    };
    const res = await axios({
      url: 'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      method: 'post',
      data: options,
    });
    if (res.data.code === 0) {
      const { tenant_access_token, expire } = res.data;
      await this.redisService.setex(
        ERediskey.feishuTenantToken,
        expire - 60,
        tenant_access_token
      );
      const token = await this.redisService.get(ERediskey.feishuTenantToken);
      return this.success(token);
    } else {
      this.logger.error('获取tenantToken失败', res.data);
      return this.fail('获取tenantToken失败');
    }
  }

  /**
   * 接口文档：https://open.feishu.cn/document/server-docs/im-v1/message/create?appId=cli_a6e56b89d15d1013
   * 发送消息类型文档：https://open.feishu.cn/document/server-docs/im-v1/message-content-description/create_json
   */
  async sendMsgToUser(content: any): Promise<IComResponse> {
    const tokenRes = await this.getTenantAccessToken();
    if (!tokenRes.success) {
      return tokenRes;
    }
    const tenantAccessToken = tokenRes.data;
    try {
      const res = await axios({
        url: 'https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=user_id',
        method: 'post',
        headers: {
          Authorization: `Bearer ${tenantAccessToken}`,
        },
        data: content,
      });
      if (res.data.code === 0) {
        return this.success();
      } else {
        this.logger.error('发送消息失败1', res.data, content);
        return this.fail('发送消息失败');
      }
    } catch (error) {
      this.logger.error('发送消息失败2', content, error.response.data);
      return this.fail('发送消息失败');
    }
  }
}
