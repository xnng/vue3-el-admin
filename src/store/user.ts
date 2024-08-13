import { loginApi, getMenuApi } from '@/api/user'
import { defineStore } from 'pinia'
import { filterRoutesByWhitelist } from '@/router/helper'
import { constantRoutes, dynamicRoutes } from '@/router'
import router from '@/router'

const routerDebugMode = true

export const useUserStore = defineStore('user', {
  state: () => ({
    /** 用户信息 */
    userInfo: {} as any,
    /** 该用户有权限访问到所有路由 */
    routerList: [],
    /** 该用户有权限访问的所有按钮 */
    btnList: [],
    /** 用户可访问的所有路由 */
    fullRoutes: [] as any[],
    token: ''
  }),
  persist: true,
  actions: {
    async login(payload: any) {
      const loginRes = await loginApi(payload)
      if (loginRes.success) {
        this.userInfo = loginRes.data.user
        this.token = loginRes.data.token
      } else {
        throw new Error(loginRes.msg)
      }
    },
    logOut() {
      this.userInfo = {}
      this.routerList = []
      this.btnList = []
      this.fullRoutes = []
      this.token = ''
    },
    async getMenu() {
      const menuRes = await getMenuApi()
      if (menuRes.success) {
        const { routerList, btnList } = menuRes.data
        this.routerList = routerList
        this.btnList = btnList
        this.setRoutes()
      } else {
        throw new Error(menuRes.msg)
      }
    },
    setRoutes() {
      const accessedRoutes = routerDebugMode ? dynamicRoutes : filterRoutesByWhitelist(dynamicRoutes, this.routerList)
      this.fullRoutes = constantRoutes.concat(accessedRoutes)
      accessedRoutes.forEach((route) => {
        router.addRoute(route)
      })
    }
  }
})
