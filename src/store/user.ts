import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {} as any,
      token: '',
      menuList: [] as any[]
    }
  },
  persist: true,
  actions: {}
})
