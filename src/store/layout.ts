import { defineStore } from 'pinia'

export enum ELayoutStyle {
  Sidebar = 'sidebar',
  Top = 'top'
}

interface LayoutState {
  layoutStyle: ELayoutStyle
}

export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    layoutStyle: ELayoutStyle.Sidebar
  }),
  actions: {
    setLayoutStyle(style: ELayoutStyle) {
      this.layoutStyle = style
    }
  },
  persist: true
})
