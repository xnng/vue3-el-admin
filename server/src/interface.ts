import { BaseUser } from './modules/common/entity/baseUser';

/**
 * 通用接口返回数据格式
 */
export interface IComResponse {
  success: boolean;
  msg?: string;
  data?: any;
}

export enum ILoggerType {
  'info' = 'info',
  'error' = 'error',
  'slow' = 'slow',
}

declare module '@midwayjs/koa' {
  interface Context {
    /**
     * 用户登录之后将其挂载到 context 上
     */
    user?: BaseUser;
  }
}
/**
 * 存储桶配置 key
 */
export enum EBucketName {
  No1 = '1',
}

/**
 * 存储桶类型
 */
export enum EBucketType {
  /** aws s3 */
  S3 = '1',
  /** obs */
  OBS = '2',
}

/**
 * 登录类型
 */
export enum EUserLoginType {
  '飞书应用网页登录' = '1',
  '微信小程序登录' = '2',
  'CMS登录' = '3',
}

export enum ERabbitQueue {
  'feishumsg' = 'feishu_msg',
}

/**
 * sls 存储配置
 */
export enum ESlsStore {
  /**
   * 换电柜 console
   */
  'saas-admin' = '1',
  'web' = '2',
}

/**
 * 排序方式
 */
export enum EQueryOrder {
  /**
   * 正序
   */
  'ASC' = 'ASC',
  /**
   * 倒序
   */
  'DESC' = 'DESC',
}

/**
 * 启用状态
 */
export enum EUseStatus {
  /**
   * 启用
   */
  'ENABLE' = '1',
  /**
   * 禁用
   */
  'DISABLE' = '0',
}

/**
 * redis缓存 key
 */
export enum ERediskey {
  /** * 飞书应用 token */
  'feishuAppToken' = 'feishu:appToken',
  /** * 飞书tenant token */
  'feishuTenantToken' = 'feishu:tenantToken',
  /** * 飞书应用用户 token */
  'feishuUserToken' = 'feishu:userToken:',
  /** * 飞书应用用户 refresh token */
  'feishuUserRefreshToken' = 'feishu:refresh:userToken:',
  /** * 贡献审核员 */
  'contributeAuditor' = 'longtimekey:contributeAuditor',
}

/**
 * 文章状态
 */
export enum ESoftBlogPageStatus {
  /**
   * 草稿
   */
  'DRAFT' = '1',
  /**
   * 已发布
   */
  'PUBLISH' = '2',
  /**
   * 审核中
   */
  'REVIEW' = '3',
}

/**
 * 用户角色
 */
export enum EUserRole {
  /** * 团队成员 */
  'member' = 2,
  /** * 团队管理员 */
  'admin' = 3,
  /** * 团队所有者 */
  'owner' = 4,
}

/**
 * 审核状态
 */
export enum EAuditStatus {
  /** * 未审核 */
  'UNAUDITED' = '1',
  /** * 审核中 */
  'AUDITING' = '2',
  /** * 审核通过 */
  'PASS' = '3',
  /** * 审核未通过 */
  'FAIL' = '4',
}

/**
 * rbac 权限类型
 */
export enum ERbacPermissionType {
  /** * 页面 */
  'PAGE' = '1',
  /** * 按钮 */
  'BUTTON' = '2',
  /** * 目录 */
  'CATALOG' = '3',
}

/**
 * rbac 接口类型
 */
export enum ERbacApiType {
  /** * 单个接口 */
  'API' = '1',
  /** * 模块 */
  'MODULE' = '2',
}

export enum ElogActionType {
  /** * 博客 */
  'BLOG' = '1',
  /** * 招聘职位 */
  'RECRUIT' = '2',
  /** 论坛 */
  'FORUM' = '3',
  /** 贡献榜 */
  'CONTRIBUTE' = '4',
  /** 用户 */
  'USER' = '5',
  /** 权限 */
  'PERMISSION' = '6',
}

/**
 * 飞书卡片消息类型
 */
export enum EFeishuMsgCardType {
  'warn' = 'yellow',
  'error' = 'red',
  'success' = 'green',
}

/**
 * 飞书消息提醒类型
 */
export enum EFeishuMsgType {
  '卡片消息' = '1',
  '文本消息' = '2',
}

/**
 * 埋点日志事件状态
 */
export enum ESlsEventStatus {
  '已上线' = '1',
  '待上线' = '2',
}
