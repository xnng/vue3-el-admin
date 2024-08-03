<template>
  <component :is="currentLayout"></component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutStore, ELayoutStyle } from '@/store/layout'
import SidebarLayout from './SidebarLayout.vue'
import TopLayout from './TopLayout.vue'

// 使用布局存储
const layoutStore = useLayoutStore()

// 根据当前布局样式计算应该显示哪个布局组件
const currentLayout = computed(() => {
  return layoutStore.layoutStyle === ELayoutStyle.Sidebar ? SidebarLayout : TopLayout
})
</script>
