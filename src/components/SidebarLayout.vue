<template>
  <div class="h-screen flex flex-col">
    <el-container class="flex-1 overflow-hidden">
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '250px'" class="bg-[#001529] transition-width duration-300 overflow-x-hidden">
        <!-- 侧边栏顶部logo区域 -->
        <div class="h-15 flex items-center px-5 bg-[#002140]">
          <img src="@/assets/logo.png" alt="Logo" class="w-8 h-8 mr-3" />
          <span v-show="!isCollapse" class="text-white text-lg font-semibold">管理系统</span>
        </div>
        <!-- 侧边栏菜单 -->
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
        <!-- 顶部导航栏 -->
        <el-header class="bg-white shadow-md flex items-center justify-between">
          <div class="flex items-center">
            <!-- 折叠按钮 -->
            <Icon class="text-xl cursor-pointer mr-5" :icon="isCollapse ? 'ep:expand' : 'ep:fold'" @click="toggleSidebar" />
            <!-- 面包屑导航 -->
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
                {{ item.meta.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <!-- 用户下拉菜单 -->
          <user-dropdown />
        </el-header>
        <!-- 主内容区 -->
        <el-main class="flex-1 bg-[#f0f2f5]">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- 布局切换按钮 -->
    <el-button class="layout-toggle-btn" @click="toggleLayout"> 切换布局 </el-button>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import RecursiveMenu from './RecursiveMenu.vue'
import UserDropdown from './UserDropdown.vue'
import { useLayoutLogic } from '@/components/useLayoutLogic'

// 使用布局逻辑
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
