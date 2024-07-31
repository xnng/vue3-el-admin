import { defineStore } from "pinia";
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      userInfo: {} as any,
    };
  },
  persist: {
    key: "store_user",
    storage: localStorage,
  },
  actions: {
    setUserInfo(payload: any) {
      this.userInfo = payload;
    },
  },
});
