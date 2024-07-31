import { IComResponse } from '../../../../interface';
import { BaseUser } from '../../entity/baseUser';

export interface ILoginRes extends IComResponse {
  data?: {
    /**
     * 用户信息
     */
    user: BaseUser;
    /**
     * token
     */
    token: string;
  };
}

export interface UserStrategy {
  login(payload: any): Promise<ILoginRes>;
}
