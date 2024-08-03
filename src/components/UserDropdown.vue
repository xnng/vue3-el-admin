<template>
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
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<style scoped>
.username {
  color: inherit;
}
</style>
