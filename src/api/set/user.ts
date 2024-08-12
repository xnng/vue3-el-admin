import request from '@/utils/axios'

export const getUserListApi = (params: any) => {
  return request.get({ url: '/admin/user/list', params })
}

// 设为管理员
export const toggleAdminApi = (data: any) => {
  return request.post({ url: '/adminuser/toggleAdmin', data })
}

// 绑定角色
export const bindRoleApi = (data: any) => {
  return request.post({ url: '/admin/user/bindRole', data })
}

// 获取菜单
export const getMenuApi = () => {
  return request.get({ url: '/admin/user/menu' })
}
