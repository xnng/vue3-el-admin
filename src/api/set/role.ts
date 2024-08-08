import request from '@/utils/axios'

export const getRoleApi = (params: any) => {
  return request.get({ url: '/role/list', params })
}

export const getPermissionByRoleIdApi = (id: number) => {
  return request.get({ url: `/role/permission/ids`, params: { roleId: id } })
}

export const addRoleApi = (data: any) => {
  return request.post({ url: '/role/add', data })
}

export const editRoleApi = (data: any) => {
  return request.put({ url: '/role/edit', data })
}

export const bindRoleWithPermissionApi = (data: { permissionIds: any[]; roleId: number }) => {
  return request.post({ url: '/role/bindPermission', data })
}

export const deleteRoleApi = (id: number) => {
  return request.delete({ url: `/role/delete/${id}` })
}

// 获取角色能绑定的权限列表
export const getRolePermissionListApi = (params: any) => {
  return request.get({ url: '/role/permission/list', params })
}
