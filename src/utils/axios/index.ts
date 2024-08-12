import { AxiosRequestConfig } from 'axios'
import service from './service'

export interface IResponse<T = any> {
  success: boolean
  msg: string
  data: T extends any ? T : T & any
}

const request = (option: AxiosRequestConfig) => {
  const { url, method, params, data, headers, responseType } = option
  const config = {
    url: url,
    method,
    params,
    data,
    responseType: responseType,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  }
  return service(config)
}

export default {
  get: <T = any>(option: AxiosRequestConfig) => {
    return request({ method: 'get', ...option }) as Promise<IResponse<T>>
  },
  post: <T = any>(option: AxiosRequestConfig) => {
    return request({ method: 'post', ...option }) as Promise<IResponse<T>>
  },
  delete: <T = any>(option: AxiosRequestConfig) => {
    return request({ method: 'delete', ...option }) as Promise<IResponse<T>>
  },
  put: <T = any>(option: AxiosRequestConfig) => {
    return request({ method: 'put', ...option }) as Promise<IResponse<T>>
  }
}
