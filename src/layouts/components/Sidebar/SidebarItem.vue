<script lang="ts" setup>
import { computed } from 'vue'
import { type RouteMeta } from 'vue-router'
import SidebarItemLink from './SidebarItemLink.vue'
import { isExternal } from '@/utils/validate'
import path from 'path-browserify'

interface Props {
  item: {
    path: string
    meta?: RouteMeta
    children?: any[]
  }
  basePath?: string
}

const props = withDefaults(defineProps<Props>(), {
  basePath: ''
})

/** 是否始终显示根菜单 */
const alwaysShowRootMenu = computed(() => props.item.meta?.alwaysShow)

/** 显示的子菜单 */
const showingChildren = computed(() => {
  return props.item.children?.filter((child) => !child.meta?.hidden) ?? []
})

/** 显示的子菜单数量 */
const showingChildNumber = computed(() => {
  return showingChildren.value.length
})

/** 唯一的子菜单项 */
const theOnlyOneChild = computed(() => {
  const number = showingChildNumber.value
  switch (true) {
    case number > 1:
      return null
    case number === 1:
      return showingChildren.value[0]
    default:
      return { ...props.item, path: '' }
  }
})

/** 解析路径 */
const resolvePath = (routePath: string) => {
  switch (true) {
    case isExternal(routePath):
      return routePath
    case isExternal(props.basePath):
      return props.basePath
    default:
      return path.resolve(props.basePath, routePath)
  }
}
</script>

<template>
  <template v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children">
    <SidebarItemLink v-if="theOnlyOneChild.meta" :to="resolvePath(theOnlyOneChild.path)">
      <el-menu-item :index="resolvePath(theOnlyOneChild.path)">
        <a-icon v-if="theOnlyOneChild.meta.icon" :icon="theOnlyOneChild.meta.icon" />
        <template v-if="theOnlyOneChild.meta.title" #title>
          {{ theOnlyOneChild.meta.title }}
        </template>
      </el-menu-item>
    </SidebarItemLink>
  </template>
  <el-sub-menu v-else :index="resolvePath(props.item.path)" teleported>
    <template #title>
      <a-icon v-if="props.item.meta?.icon" :icon="props.item.meta.icon" />
      <span v-if="props.item.meta?.title">{{ props.item.meta.title }}</span>
    </template>
    <template v-if="props.item.children">
      <SidebarItem v-for="child in showingChildren" :key="child.path" :item="child" :base-path="resolvePath(child.path)" />
    </template>
  </el-sub-menu>
</template>

<style lang="scss" scoped>
.svg-icon {
  min-width: 1em;
  margin-right: 12px;
  font-size: 18px;
}

.el-icon {
  width: 1em !important;
  margin-right: 12px !important;
  font-size: 18px;
}
</style>
