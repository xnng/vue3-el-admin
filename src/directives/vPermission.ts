import { useUserStore } from '@/store/user'

export default {
  mounted(el, binding) {
    // 判断
    const user = useUserStore().userInfo
    if (user?.tenantId === 1) return true
    if (binding.value && binding.value == 'show') return true
    const isHas = useUserStore().btnList.some((rule) => {
      const ruleRegex = new RegExp(rule.replace(/\*/g, '.*'))
      return ruleRegex.test(binding.value)
    })
    if (!isHas) {
      el.style.display = 'none'
    }
  }
}
