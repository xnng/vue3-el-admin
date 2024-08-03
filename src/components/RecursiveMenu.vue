<template>
  <template v-for="route in routes" :key="route.path">
    <el-sub-menu v-if="route.children && route.children.length > 0" :index="resolvePath(route.path)">
      <template #title>
        <Icon v-if="route.meta && route.meta.icon" :icon="route.meta.icon" class="mr-2" />
        <span>{{ route.meta && route.meta.title }}</span>
      </template>
      <recursive-menu :routes="route.children" :base-path="resolvePath(route.path)" />
    </el-sub-menu>
    <el-menu-item v-else :index="resolvePath(route.path)">
      <Icon v-if="route.meta && route.meta.icon" :icon="route.meta.icon" class="mr-2" />
      <template #title>{{ route.meta && route.meta.title }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { RouteItem } from '@/types/route'

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

const resolvePath = (routePath: string) => {
  if (routePath.startsWith('/')) {
    return routePath
  }
  return props.basePath ? `${props.basePath}/${routePath}`.replace(/\/+/g, '/') : routePath
}
</script>
