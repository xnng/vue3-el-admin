// core
import { createApp } from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/router/permission'
// css
import 'uno.css'
import 'normalize.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
import ElementPlus from 'element-plus'
import permission from '@/directives/vPermission'
import ACard from '@/components/ACard/index.vue'
import ATable from '@/components/ATable/index.vue'
import AIcon from '@/components/AIcon/index.vue'

const app = createApp(App)

app.use(ElementPlus)

// 注册全局组件
app.component('ACard', ACard)
app.component('ATable', ATable)
app.component('AIcon', AIcon)

app.use(store).use(router)
app.directive('permission', permission)

router.isReady().then(() => {
  app.mount('#app')
})
