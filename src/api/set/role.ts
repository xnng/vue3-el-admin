import request from '@/utils/axios'

export const getRoleApi = (params: any) => {
  return request.get({ url: '/admin/role/list', params })
}

export const getPermissionByRoleIdApi = (id: number) => {
  return request.get({ url: `/admin/role/permission/ids`, params: { roleId: id } })
}

export const addRoleApi = (data: any) => {
  return request.post({ url: '/admin/role/add', data })
}

export const editRoleApi = (data: any) => {
  return request.put({ url: '/admin/role/edit', data })
}

export const bindRoleWithPermissionApi = (data: { permissionIds: any[]; roleId: number }) => {
  return request.post({ url: '/admin/role/bindPermission', data })
}

export const deleteRoleApi = (id: number) => {
  return request.delete({ url: `/admin/role/delete/${id}` })
}

// 获取角色能绑定的权限列表
export const getRolePermissionListApi = (params: any) => {
  return request.get({ url: '/admin/role/permission/list', params })
}
