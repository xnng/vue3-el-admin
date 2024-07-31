import { IComResponse } from '../../../../interface';

export interface IgetFileUrlByKeyRes extends IComResponse {
  data?: {
    /**
     * 文件访问地址
     */
    url: string;
    /**
     * 文件 key
     */
    key: string;
  };
}

export interface FileStrategy {
  getFileSignUrl(fileType: string): Promise<IComResponse>;
  getFileUrlByKey(key: string): Promise<IgetFileUrlByKeyRes>;
}
