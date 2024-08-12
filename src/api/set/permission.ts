import request from '@/utils/axios'

// 新增权限
export const addPermissionApi = (data: any) => {
  return request.post({ url: '/admin/permission/add', data })
}

// 编辑权限
export const editPermissionApi = (data: any) => {
  return request.put({ url: '/admin/permission/edit', data })
}

// 删除权限
export const deletePermissionApi = (id: number) => {
  return request.delete({ url: `/admin/permission/del/${id}` })
}

// 获取接口列表
export const getPermissionApiListApi = () => {
  return request.get({ url: '/admin/permission/apiList' })
}

// 获取权限列表
export const getPermissionApi = (params: any) => {
  return request.get({ url: '/admin/permission/list', params })
}

// 绑定接口
export const bindPermissionApi = (data: any) => {
  return request.post({ url: `/admin/permission/bindApi`, data })
}
