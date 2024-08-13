// core
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import '@/router/permission'
import 'uno.css'
import 'normalize.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import ElementPlus from 'element-plus'
import permission from '@/directives/vPermission'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
import ACard from '@/components/ACard/index.vue'
import ATable from '@/components/ATable/index.vue'
import AIcon from '@/components/AIcon/index.vue'
import ASearch from '@/components/ASearch/index.vue'
import ADialog from '@/components/ADialog/index.vue'
import ASelectPagination from '@/components/ASelectPagination/index.vue'

// 仅在开发环境中引入 Element Plus 的样式
if (import.meta.env.DEV) {
  import('element-plus/dist/index.css')
}

const app = createApp(App)

app.use(ElementPlus)

// 注册全局组件
app.component('ACard', ACard)
app.component('ATable', ATable)
app.component('AIcon', AIcon)
app.component('ASearch', ASearch)
app.component('ADialog', ADialog)
app.component('ASelectPagination', ASelectPagination)

// 注册全局指令
app.directive('permission', permission)

const store = createPinia()
store.use(piniaPluginPersistedstate)
app.use(store).use(router)

router.isReady().then(() => {
  app.mount('#app')
})
