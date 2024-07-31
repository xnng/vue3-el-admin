import { defineStore } from 'pinia'

export enum ELayout {
  SIDE = 'side',
  TOP = 'top'
}

export const useAppStore = defineStore('app', {
  state: () => {
    return {
      /** * 是否是移动端 */
      mobile: false,
      /** * 是否折叠侧边栏 */
      collapse: false,
      /** * 布局模式 */
      layout: ELayout.SIDE,
      title: import.meta.env.VITE_APP_TITLE
    }
  },
  actions: {
    setCollapse(collapse: boolean) {
      this.collapse = collapse
    },
    initMobileListener() {
      window.addEventListener('resize', () => {
        if (document.body.clientWidth > 768) {
          this.mobile = false
        } else {
          this.mobile = true
        }
      })
    }
  },
  persist: {
    key: 'store_app',
    storage: localStorage
  }
})
