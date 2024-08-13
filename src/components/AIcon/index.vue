<script setup lang="ts">
import { computed, unref } from 'vue'
import { ElIcon } from 'element-plus'
import { Icon } from '@iconify/vue'

const props = defineProps({
  // icon name
  icon: { type: String, required: true },
  // icon color
  color: { type: String, default: '' },
  // icon size
  size: { type: Number, default: 16 },
  hoverColor: { type: String, default: '' }
})

const isLocal = computed(() => props.icon.startsWith('svg-icon:'))

const symbolId = computed(() => {
  return unref(isLocal) ? `#icon-${props.icon.split('svg-icon:')[1]}` : props.icon
})

const getIconifyStyle = computed(() => {
  const { color, size } = props
  return {
    fontSize: `${size}px`,
    color
  }
})
</script>

<template>
  <ElIcon :size="size" :color="color">
    <svg v-if="isLocal" aria-hidden="true">
      <use :xlink:href="symbolId" />
    </svg>

    <Icon v-else :icon="icon" :style="getIconifyStyle" />
  </ElIcon>
</template>
