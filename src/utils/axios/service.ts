import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse } from 'axios'

import qs from 'qs'
import singleMessage from '@/utils/singleMessage'
import { useUserStore } from '@/store/modules/user'
import { IResponse } from '.'

let globalUrl = ''

export interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers: AxiosRequestHeaders
}

const requestInterceptors = (config: InternalAxiosRequestConfig) => {
  if (config.method === 'post' && config.params) {
    config.headers && (config.headers['Content-Type'] = 'application/x-www-form-urlencoded')
    config.data = qs.stringify(config.params)
    delete config.params
  }
  if (config.method === 'get' && config.params) {
    let url = config.url as string
    url += '?'
    const keys = Object.keys(config.params)
    for (const key of keys) {
      if (config.params[key] !== void 0 && config.params[key] !== null) {
        url += `${key}=${encodeURIComponent(config.params[key])}&`
      }
    }
    url = url.substring(0, url.length - 1)
    delete config.params
    config.url = url
  }

  const token = useUserStore().token
  if (token) {
    config.headers && (config.headers['Authorization'] = token)
  }
  globalUrl = config.url as string
  return config
}

const responseInterceptors = (response: AxiosResponse<any>) => {
  if (response?.config?.responseType === 'blob') {
    // 如果是文件流，直接过
    return response
  }
  const data: any = response?.data
  const errMsg = data?.errMsg || ''
  if (data && !data.success) {
    singleMessage.error(errMsg)
  }

  return response.data
}

const resErrorInterceptors = (error: AxiosError) => {
  const status = error.response?.status || 500
  const data: any = error?.response?.data
  const errMsg = data?.errMsg || ''
  if (globalUrl.indexOf('/auth/token/logout') > 0) {
    return
  }
  if (status === 401) {
    singleMessage.warning('登录已过期，请重新登录')
    // useUserStore().logOut()
    return Promise.reject(new Error('登录已过期，请重新登录'))
  }
  if ([503, 502].includes(status)) {
    singleMessage.warning('服务维护中，请稍后再试！')
    return Promise.reject(error)
  }
  if ([504].includes(status)) {
    singleMessage.warning('网络好像断开了,请稍后重试！')
    return Promise.reject(error)
  }
  if ([403].includes(status)) {
    singleMessage.warning('暂无权限')
    return Promise.reject(error)
  }
  if ([404].includes(status)) {
    singleMessage.warning('资源不存在')
    return Promise.reject(error)
  }
  if (error.message && error.message.startsWith('timeout of')) {
    singleMessage.error('请求超时，请重试！')
    return Promise.reject(error)
  }
  if (error.message && error.message.startsWith('Network Error')) {
    singleMessage.error('网络异常，请重试！')
    return Promise.reject(error)
  }
  singleMessage.error(errMsg)
  return Promise.reject(error)
}

const axiosInstance: AxiosInstance = axios.create({
  timeout: 8 * 1000,
  baseURL: import.meta.env.VITE_API_BASE_PATH
})

axiosInstance.interceptors.request.use(requestInterceptors)
axiosInstance.interceptors.response.use(responseInterceptors, resErrorInterceptors)

const service = (config: AxiosRequestConfig): Promise<IResponse<any>> => {
  return axiosInstance.request(config)
}

export default service
