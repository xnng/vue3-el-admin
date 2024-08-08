import { ref } from 'vue'
import store from '@/store'
import { defineStore } from 'pinia'
import { type RouteRecordRaw } from 'vue-router'
import { constantRoutes, dynamicRoutes } from '@/router'
import { filterRoutesByWhitelist, flatMultiLevelRoutes } from '@/router/helper'
import routeSettings from '@/config/route'

const whiteList = ['/set/', '/set/user', '/set/permission', '/set/role']

export const usePermissionStore = defineStore('permission', () => {
  /** 可访问的路由 */
  const routes = ref<RouteRecordRaw[]>([])
  /** 有访问权限的动态路由 */
  const addRoutes = ref<RouteRecordRaw[]>([])

  /** 根据角色生成可访问的 Routes（可访问的路由 = 常驻路由 + 有访问权限的动态路由） */
  const setRoutes = () => {
    const accessedRoutes = filterRoutesByWhitelist(dynamicRoutes, whiteList)
    _set(accessedRoutes)
  }

  /** 所有路由 = 所有常驻路由 + 所有动态路由 */
  const setAllRoutes = () => {
    _set(dynamicRoutes)
  }

  const _set = (accessedRoutes: RouteRecordRaw[]) => {
    routes.value = constantRoutes.concat(accessedRoutes)
    addRoutes.value = routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(accessedRoutes) : accessedRoutes
  }

  return { routes, addRoutes, setRoutes, setAllRoutes }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
