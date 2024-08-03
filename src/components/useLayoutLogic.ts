import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ELayoutStyle, useLayoutStore } from '@/store/layout'
import { RouteItem } from '@/types/route'

export function useLayoutLogic() {
  const route = useRoute()
  const router = useRouter()
  const layoutStore = useLayoutStore()

  const currentRoute = computed(() => route.path)

  const isCollapse = ref(false)
  const toggleSidebar = () => {
    isCollapse.value = !isCollapse.value
  }

  const menuRoutes = computed(() => {
    const rootRoute = router.options.routes.find((route) => route.path === '/') as RouteItem | undefined
    return rootRoute ? rootRoute.children || [] : []
  })

  const breadcrumbItems = computed(() => {
    return route.matched.filter((item) => item.meta && item.meta.title)
  })

  const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }

  const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
  }

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
