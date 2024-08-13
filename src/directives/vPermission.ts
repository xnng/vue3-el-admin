import { useUserStore } from '@/store/user'

export default {
  mounted(el: any, binding: any) {
    const user = useUserStore().userInfo
    if (binding.value && binding.value == 'show') return true
    const isHas = user.btnList.some((rule: any) => {
      const ruleRegex = new RegExp(rule.replace(/\*/g, '.*'))
      return ruleRegex.test(binding.value)
    })
    if (!isHas) {
      el.style.display = 'none'
    }
  }
}
