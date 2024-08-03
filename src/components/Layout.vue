<template>
  <component :is="currentLayout"></component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutStore } from '@/store/layout'
import SidebarLayout from './SidebarLayout.vue'
import TopLayout from './TopLayout.vue'

const layoutStore = useLayoutStore()

const currentLayout = computed(() => {
  return layoutStore.layoutStyle === 'sidebar' ? SidebarLayout : TopLayout
})
</script>
