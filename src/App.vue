<script lang="ts" setup>
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useThemeStore } from './store/theme'
import { watchEffect } from 'vue'

const themeStore = useThemeStore()
watchEffect(() => {
  const currentTheme = themeStore.currentTheme
  themeStore.setHtmlRootClassName(currentTheme)
})
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view />
  </el-config-provider>
</template>
