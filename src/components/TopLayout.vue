<template>
  <div class="h-screen flex flex-col">
    <el-header class="w-full bg-[#001529] text-white shadow-md flex items-center justify-between">
      <div class="flex items-center">
        <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 mr-3" />
        <span class="text-lg font-semibold">管理系统</span>
      </div>
      <user-dropdown />
    </el-header>
    <el-container class="flex-1 overflow-hidden">
      <el-aside :width="isCollapse ? '64px' : '250px'" class="bg-[#001529] transition-width duration-300 overflow-x-hidden">
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
      <el-container class="flex flex-col">
        <el-header class="bg-white shadow-md flex items-center justify-between">
          <div class="flex items-center">
            <Icon class="text-xl cursor-pointer mr-5 text-[#001529]" :icon="isCollapse ? 'ep:expand' : 'ep:fold'" @click="toggleSidebar" />
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
                {{ item.meta.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
        </el-header>
        <el-main class="flex-1 bg-[#f0f2f5]">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <el-button class="layout-toggle-btn" @click="toggleLayout"> 切换布局 </el-button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import RecursiveMenu from './RecursiveMenu.vue'
import UserDropdown from './UserDropdown.vue'
import { useLayoutLogic } from '@/components/useLayoutLogic'

const { currentRoute, isCollapse, toggleSidebar, menuRoutes, breadcrumbItems, handleOpen, handleClose, toggleLayout } = useLayoutLogic()
</script>

<style lang="less" scoped>
.el-menu-vertical {
  :deep(.el-menu-item.is-active) {
    background-color: #1890ff !important;
  }
}

.layout-toggle-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
}

:deep(.el-dropdown) {
  color: inherit;
}

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
