import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLayoutStore, ELayoutStyle } from '@/store/layout'
import { RouteItem } from '@/types/route'

/**
 * 布局逻辑组合函数
 */
export function useLayoutLogic() {
  const route = useRoute()
  const router = useRouter()
  const layoutStore = useLayoutStore()

  /**
   * 计算当前路由路径
   */
  const currentRoute = computed(() => route.path)

  /**
   * 控制侧边栏折叠状态
   */
  const isCollapse = ref(false)
  const toggleSidebar = () => {
    isCollapse.value = !isCollapse.value
  }

  /**
   * 计算菜单路由
   */
  const menuRoutes = computed(() => {
    const rootRoute = router.options.routes.find((route) => route.path === '/') as RouteItem | undefined
    return rootRoute ? rootRoute.children || [] : []
  })

  /**
   * 计算面包屑项目
   */
  const breadcrumbItems = computed(() => {
    return route.matched.filter((item) => item.meta && item.meta.title)
  })

  /**
   * 菜单打开的处理函数
   */
  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }

  /**
   * 菜单关闭的处理函数
   */
  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }

  /**
   * 切换布局样式
   */
  const toggleLayout = () => {
    layoutStore.setLayoutStyle(layoutStore.layoutStyle === ELayoutStyle.Sidebar ? ELayoutStyle.Top : ELayoutStyle.Sidebar)
  }

  return {
    currentRoute,
    isCollapse,
    toggleSidebar,
    menuRoutes,
    breadcrumbItems,
    handleOpen,
    handleClose,
    toggleLayout
  }
}
