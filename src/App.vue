<script setup lang="ts">
import { useAppStore } from './store/app'

const appStore = useAppStore()
appStore.initMobileListener()
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
