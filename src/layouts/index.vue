<script lang="ts" setup>
import { computed, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '@/store/modules/settings'
import useResize from './hooks/useResize'
import { useLayoutMode } from '@/hooks/useLayoutMode'
import LeftMode from './LeftMode.vue'
import TopMode from './TopMode.vue'
import LeftTopMode from './LeftTopMode.vue'
import { getCssVariableValue, setCssVariableValue } from '@/utils'
import { isMobile as mobileStatus } from '@/utils'

/** Layout 布局响应式 */
useResize()

const isMobile = computed(() => mobileStatus())

const { isLeft, isTop, isLeftTop } = useLayoutMode()
const settingsStore = useSettingsStore()
const { showTagsView, showGreyMode, showColorWeakness } = storeToRefs(settingsStore)

const classes = computed(() => {
  return {
    showGreyMode: showGreyMode.value,
    showColorWeakness: showColorWeakness.value
  }
})

//#region 隐藏标签栏时删除其高度，是为了让 Logo 组件高度和 Header 区域高度始终一致
const cssVariableName = '--admin-tagsview-height'
const v3TagsviewHeight = getCssVariableValue(cssVariableName)
watchEffect(() => {
  showTagsView.value ? setCssVariableValue(cssVariableName, v3TagsviewHeight) : setCssVariableValue(cssVariableName, '0px')
})
//#endregion
</script>

<template>
  <div :class="classes">
    <!-- 左侧模式 -->
    <LeftMode v-if="isLeft || isMobile" />
    <!-- 顶部模式 -->
    <TopMode v-else-if="isTop" />
    <!-- 混合模式 -->
    <LeftTopMode v-else-if="isLeftTop" />
  </div>
</template>

<style lang="scss" scoped>
.showGreyMode {
  filter: grayscale(1);
}

.showColorWeakness {
  filter: invert(0.8);
}
</style>
