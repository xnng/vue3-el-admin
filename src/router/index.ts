import { createRouter, createMemoryHistory } from 'vue-router'
import Layout from '@/components/Layout.vue'

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/home/home.vue')
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/pages/home/about.vue')
      }
    ]
  }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes
})
