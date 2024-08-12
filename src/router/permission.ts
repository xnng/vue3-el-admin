import router from '@/router'
import { useTitle } from '@/hooks/useTitle'
import isWhiteList from '@/config/white-list'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/user'

const { setTitle } = useTitle()
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStore()
  const token = userStore.token

  // 如果没有登陆
  if (!token) {
    if (isWhiteList(to)) return next()
    return next('/login')
  }

  if (to.path === '/login') {
    return next({ path: '/' })
  }

  if (userStore.hasGetMenu) {
    return next()
  } else {
    try {
      await userStore.getMenu()
      next({ ...to, replace: true })
    } catch (err: any) {
      next('/login')
    }
  }
})

router.afterEach((to) => {
  setTitle(to.meta.title)
  NProgress.done()
})
