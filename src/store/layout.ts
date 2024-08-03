import { defineStore } from 'pinia'

/**
 * 定义布局样式枚举
 */
export enum ELayoutStyle {
  /** 侧边栏布局 */
  Sidebar = 'sidebar',
  /** 顶部布局 */
  Top = 'top'
}

/**
 * 定义布局状态接口
 */
interface LayoutState {
  layoutStyle: ELayoutStyle
}

/**
 * 定义并导出布局存储
 */
export const useLayoutStore = defineStore('layout', {
  state: (): LayoutState => ({
    layoutStyle: ELayoutStyle.Sidebar // 默认使用侧边栏布局
  }),
  actions: {
    /**
     * 设置布局样式的action
     * @param style 要设置的布局样式
     */
    setLayoutStyle(style: ELayoutStyle) {
      this.layoutStyle = style
    }
  },
  persist: true // 启用持久化存储
})
