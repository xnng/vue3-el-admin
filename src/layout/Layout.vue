<template>
  <section class="w-[100%] h-[100%] relative">
    <div v-if="layout === sideLayout">
      <div :class="['absolute top-0 left-0 h-full layout-border__right', { '!fixed z-3000': mobile }]">
        <div>logo</div>
        <div>menu</div>
      </div>
      <div
        :class="[
          'absolute top-0 h-[100%]',
          {
            'w-[calc(100%-var(--left-menu-min-width))] left-[var(--left-menu-min-width)]': collapse && !mobile && !mobile,
            'w-[calc(100%-var(--left-menu-max-width))] left-[var(--left-menu-max-width)]': !collapse && !mobile && !mobile,
            'fixed !w-full !left-0': mobile
          }
        ]"
        style="transition: all var(--transition-time-02)"
      >
        <ElScrollbar>
          <router-view>
            <template #default="{ Component, route }">
              <!-- <keep-alive :include="getCaches"> -->
              <component :is="Component" :key="route.fullPath" />
              <!-- </keep-alive> -->
            </template>
          </router-view>
        </ElScrollbar>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ELayout, useAppStore } from '@/store/app'
import { computed } from 'vue'

const appStore = useAppStore()

const mobile = computed(() => appStore.mobile)
const collapse = computed(() => appStore.collapse)
const layout = computed(() => appStore.layout)
const sideLayout = ELayout.SIDE
</script>

<style lang="less" scoped></style>
