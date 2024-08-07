import { useUserStoreHook } from '@/store/modules/user'
import { type RouteRecordRaw } from 'vue-router'

/** 全局权限判断函数，和权限指令 v-permission 功能类似 */
export const checkPermission = (permissionRoles: string[]): boolean => {
  if (Array.isArray(permissionRoles) && permissionRoles.length > 0) {
    const { roles } = useUserStoreHook()
    return roles.some((role) => permissionRoles.includes(role))
  } else {
    console.error("need roles! Like checkPermission(['admin','editor'])")
    return false
  }
}

export const filterRoutesByWhitelist = (routes: RouteRecordRaw[], whitelist: string[]): RouteRecordRaw[] | [] => {
  function isExactMatch(path: string): boolean {
    return whitelist.includes(path)
  }

  function isAncestorPath(path: string): boolean {
    return whitelist.some((whitelistPath) => whitelistPath.startsWith(path + '/'))
  }

  function filterRoute(route: RouteRecordRaw, parentPath: string = ''): RouteRecordRaw | null {
    let fullPath: string
    if (route.path === '' || route.path === 'index') {
      fullPath = parentPath
    } else if (route.path.startsWith('/')) {
      fullPath = route.path
    } else {
      fullPath = parentPath + '/' + route.path
    }
    fullPath = fullPath.replace(/\/+/g, '/').replace(/\/$/, '') // 移除多余的斜杠和末尾的斜杠

    if (isExactMatch(fullPath) || isAncestorPath(fullPath)) {
      const filteredChildren = route.children
        ? route.children.map((child) => filterRoute(child, fullPath)).filter((child): child is RouteRecordRaw => child !== null)
        : undefined

      // @ts-ignore
      return {
        ...route,
        children: filteredChildren && filteredChildren.length > 0 ? filteredChildren : undefined
      }
    }

    return null
  }

  return routes.map((route) => filterRoute(route)).filter((route): route is RouteRecordRaw => route !== null)
}
