import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

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
  // {
  //   path: '/404',
  //   component: () => import('@/views/error-page/404.vue'),
  //   meta: {
  //     hidden: true
  //   },
  //   alias: '/:pathMatch(.*)*'
  // },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  }
]

export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/set',
    component: Layout,
    name: 'Set',
    meta: {
      title: '权限管理',
      elIcon: 'setting'
    },
    children: [
      {
        path: 'user',
        name: 'UserList',
        meta: {
          title: '用户列表',
          elIcon: 'user'
        },
        component: () => import('@/views/set/user.vue')
      },
      {
        path: 'permission',
        name: 'Permission',
        meta: {
          title: '权限列表',
          elIcon: 'lock'
        },
        component: () => import('@/views/set/permission.vue')
      },
      {
        path: 'role',
        name: 'Role',
        meta: {
          title: '角色列表',
          elIcon: 'user'
        },
        component: () => import('@/views/set/role.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes.concat(dynamicRoutes)
})

export default router
