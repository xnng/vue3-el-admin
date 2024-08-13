import router from '@/router'
import { useTitle } from '@/hooks/useTitle'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useUserStore } from '@/store/user'
import { setRouteChange } from '@/hooks/useRouteListener'

const { setTitle } = useTitle()
NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStore()
  const token = userStore.token

  if (!token) {
    return to.path == '/login' ? next() : next('/login')
  }

  if (to.path === '/login') {
    return next({ path: '/' })
  }
  return next()
})

router.afterEach((to) => {
  setRouteChange(to)
  setTitle(to.meta.title)
  NProgress.done()
})
