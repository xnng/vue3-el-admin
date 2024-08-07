module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/eslint-config-typescript',
    '@unocss'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
      tsx: true
    }
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-var-requires': 'off', // 关闭【不允许使用 require】
    'vue/multi-word-component-names': 'off', // 关闭【不能使用单个单词命名组件】
    '@typescript-eslint/no-explicit-any': 'off', // 关闭【不允许使用 any】
    '@unocss/order-attributify': 'off', // 关闭【unocss 类名必须按一定规则排序】
    '@unocss/order': 'off', // 关闭【unocss 类名必须按一定规则排序】
    'vue/attributes-order': 'off', // 关闭【vue 属性必须按一定规则排序】
    'vue/attribute-hyphenation': 'off', // 关闭【vue 属性必须使用连字符】
    '@typescript-eslint/ban-ts-comment': 'off', // 关闭【不允许使用 @ts-ignore】
    'no-useless-escape': 'off' // 关闭【不允许使用无用的转义字符】
  }
}
