import { defineStore } from 'pinia'

enum ThemeName {
  Default = 'normal',
  Dark = 'dark',
  DarkBlue = 'dark-blue'
}

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: ThemeName.Default
  }),
  persist: true,
  actions: {
    setHtmlRootClassName(value: ThemeName) {
      document.documentElement.className = value
    }
  }
})
