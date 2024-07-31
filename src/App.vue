<script setup lang="ts">
import { useAppStore } from './store/app'

const appStore = useAppStore()
appStore.initMobileListener()
</script>

<template>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
