<script lang="ts" setup>
import { useLayoutMode } from '@/hooks/useLayoutMode'
import logo from '@/assets/layouts/logo.png?url'
import logoText1 from '@/assets/layouts/logo-text-1.png?url'
import logoText2 from '@/assets/layouts/logo-text-2.png?url'

const useImgLogo = false

interface Props {
  collapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  collapse: true
})

const { isLeft, isTop } = useLayoutMode()
</script>

<template>
  <div class="layout-logo-container" :class="{ collapse: props.collapse, 'layout-mode-top': isTop }">
    <transition name="layout-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/">
        <img v-if="useImgLogo" :src="logo" class="layout-logo" />
        <span class="layout-logo-title" v-else>AI</span>
      </router-link>
      <router-link v-else key="expand" to="/">
        <img v-if="useImgLogo" :src="!isLeft ? logoText2 : logoText1" class="layout-logo-text" />
        <span v-else class="layout-logo-title">AI 知识库</span>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.layout-logo-container {
  position: relative;
  width: 100%;
  height: var(--admin-navigationbar-height);
  line-height: var(--admin-navigationbar-height);
  text-align: center;
  overflow: hidden;
  .layout-logo {
    display: none;
    &-title {
      font-size: 20px;
      color: white;
      font-weight: bold;
      background: linear-gradient(90deg, #00c6ff, #0072ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  .layout-logo-text {
    height: 100%;
    vertical-align: middle;
  }
}

.layout-mode-top {
  height: var(--admin-navigationbar-height);
  line-height: var(--admin-navigationbar-height);
}

.collapse {
  .layout-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }
  .layout-logo-text {
    display: none;
  }
}
</style>
