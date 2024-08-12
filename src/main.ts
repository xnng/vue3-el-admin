// core
import { createApp } from 'vue'
import App from '@/App.vue'
import store from '@/store'
import router from '@/router'
import '@/router/permission'
// load
import { loadSvg } from '@/icons'
import { loadPlugins } from '@/plugins'
// css
import 'uno.css'
import 'normalize.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/styles/index.scss'
// 引入全局自定义指令
import permission from '@/directives/vPermission'

const app = createApp(App)

const directives = {
  // 指令对象
  permission
}

/** 加载插件 */
loadPlugins(app)
/** 加载全局 SVG */
loadSvg(app)

app.use(store).use(router)

// 注册全局自定义指令
Object.keys(directives).forEach((key) => {
  app.directive(key, directives[key])
})

router.isReady().then(() => {
  app.mount('#app')
})
