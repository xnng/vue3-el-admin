import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/Home.vue'),
        meta: { title: '首页', icon: 'ep:house' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/pages/About.vue'),
        meta: { title: '关于', icon: 'ep:info-filled' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/pages/Users.vue'),
        meta: { title: '用户', icon: 'ep:user' }
      },
      {
        path: 'nested',
        name: 'Nested',
        component: () => import('@/pages/Nested.vue'),
        meta: { title: '嵌套菜单', icon: 'ep:menu' },
        children: [
          {
            path: 'nested1',
            name: 'Nested1',
            component: () => import('@/pages/Nested1.vue'),
            meta: { title: '嵌套菜单1' }
          },
          {
            path: 'nested2',
            name: 'Nested2',
            component: () => import('@/pages/Nested2.vue'),
            meta: { title: '嵌套菜单2' }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
