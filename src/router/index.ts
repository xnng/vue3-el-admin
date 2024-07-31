import { createMemoryHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/home/home.vue') },
  { path: '/about', component: () => import('@/pages/home/about.vue') }
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes
})
