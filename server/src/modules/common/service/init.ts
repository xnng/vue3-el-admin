import {
  Autoload,
  Init,
  Inject,
  MidwayWebRouterService,
  Scope,
  ScopeEnum,
} from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { BaseClass } from '../../../core/baseClass';
import { RbacApi } from '../../rbac/entity/api';
import { RbacRole } from '../../rbac/entity/role';

@Autoload()
@Scope(ScopeEnum.Singleton)
export class BaseInitService extends BaseClass {
  @Inject()
  webRouterService: MidwayWebRouterService;

  @InjectEntityModel(RbacApi)
  rbacApiModel: Repository<RbacApi>;

  @InjectEntityModel(RbacRole)
  rbacRoleModel: Repository<RbacRole>;

  @Init()
  init() {
    this.initTempDir();
  }

  /**
   * 初始化临时文件存储文件夹
   */
  initTempDir() {
    const tempPath = 'temp/';
    const existPath = fs.existsSync(tempPath);
    if (!existPath) {
      fs.mkdirSync(tempPath);
    }
  }
}
