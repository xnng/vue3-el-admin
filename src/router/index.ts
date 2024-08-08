import { type RouteRecordRaw, createRouter } from 'vue-router'
import { history, flatMultiLevelRoutes } from './helper'
import routeSettings from '@/config/route'

const Layout = () => import('@/layouts/index.vue')

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ':path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hidden: true
    },
    alias: '/:pathMatch(.*)*'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  }
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/set',
    component: Layout,
    name: 'Set',
    meta: {
      title: '权限管理',
      icon: 'ep:setting'
    },
    children: [
      {
        path: 'user',
        name: 'UserList',
        meta: {
          title: '用户列表',
          icon: 'ep:user'
        },
        component: () => import('@/views/set/user.vue')
      },
      {
        path: 'permission',
        name: 'Permission',
        meta: {
          title: '权限列表',
          icon: 'ep:lock'
        },
        component: () => import('@/views/set/permission.vue')
      },
      {
        path: 'role',
        name: 'Role',
        meta: {
          title: '角色列表',
          icon: 'ep:user'
        },
        component: () => import('@/views/set/role.vue')
      }
    ]
  }
]

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
