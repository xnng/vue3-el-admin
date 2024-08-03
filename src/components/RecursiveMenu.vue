<template>
  <template v-for="route in routes" :key="route.path">
    <!-- 如果路由有子路由，则渲染为子菜单 -->
    <el-sub-menu v-if="route.children && route.children.length > 0" :index="resolvePath(route.path)">
      <template #title>
        <Icon v-if="route.meta && route.meta.icon" :icon="route.meta.icon" class="mr-2" />
        <span>{{ route.meta && route.meta.title }}</span>
      </template>
      <!-- 递归渲染子菜单 -->
      <recursive-menu :routes="route.children" :base-path="resolvePath(route.path)" />
    </el-sub-menu>
    <!-- 如果路由没有子路由，则渲染为菜单项 -->
    <el-menu-item v-else :index="resolvePath(route.path)">
      <Icon v-if="route.meta && route.meta.icon" :icon="route.meta.icon" class="mr-2" />
      <template #title>{{ route.meta && route.meta.title }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { RouteItem } from '@/types/route'

// 定义组件属性
const props = defineProps({
  routes: {
    type: Array as () => RouteItem[],
    required: true
  },
  basePath: {
    type: String,
    default: ''
  }
})

// 解析路由路径
const resolvePath = (routePath: string) => {
  if (routePath.startsWith('/')) {
    return routePath
  }
  return props.basePath ? `${props.basePath}/${routePath}`.replace(/\/+/g, '/') : routePath
}
</script>
