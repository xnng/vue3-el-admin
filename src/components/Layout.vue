<template>
  <el-container class="h-screen">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '250px'" class="bg-[#001529] transition-width duration-300 overflow-x-hidden">
      <div class="h-15 flex items-center px-5 bg-[#002140]">
        <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 mr-3" />
        <span v-show="!isCollapse" class="text-white text-lg font-semibold">管理系统</span>
      </div>
      <el-menu
        :default-active="currentRoute"
        class="el-menu-vertical border-none"
        :collapse="isCollapse"
        @open="handleOpen"
        @close="handleClose"
        router
        background-color="#001529"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <recursive-menu :routes="menuRoutes" :basePath="'/'" />
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 顶部导航栏 -->
      <el-header class="bg-white shadow-md flex items-center justify-between px-5">
        <div class="flex items-center">
          <Icon class="text-xl cursor-pointer mr-5" :icon="isCollapse ? 'ep:expand' : 'ep:fold'" @click="toggleSidebar" />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
              {{ item.meta.title }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-dropdown>
          <span class="el-dropdown-link flex items-center cursor-pointer">
            <el-avatar :size="32" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" class="mr-2"></el-avatar>
            <span class="username mr-1">Admin</span>
            <Icon icon="ep:arrow-down" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <!-- 主要内容区域 -->
      <el-main class="bg-[#f0f2f5] p-5">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import RecursiveMenu from './RecursiveMenu.vue'

const route = useRoute()
const router = useRouter()
const currentRoute = computed(() => route.path)

const isCollapse = ref(false)
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const menuRoutes = computed(() => {
  const rootRoute = router.options.routes.find((route) => route.path === '/')
  return rootRoute ? rootRoute.children : []
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
</script>

<style lang="less" scoped>
.el-menu-vertical {
  :deep(.el-menu-item.is-active) {
    background-color: #1890ff !important;
  }
}

.username {
  color: #333;
}

// 添加一些响应式样式
@media (max-width: 768px) {
  .el-aside {
    position: absolute;
    z-index: 10;
    height: 100%;
  }

  .el-main {
    margin-left: 64px;
  }
}
</style>
