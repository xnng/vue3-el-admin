import request from '@/utils/axios'

export const loginApi = (data: any) => {
  return request.post({ url: '/user/login', data })
}

export const getMenuApi = () => {
  return request.get({ url: '/admin/user/menu' })
}
