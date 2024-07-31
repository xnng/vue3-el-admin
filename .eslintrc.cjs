// .eslintrc.cjs
const { defineConfig } = require('eslint-define-config')
const unocss = require('@unocss/eslint-config/flat')

module.exports = defineConfig({
  root: true,
  env: {
    node: true,
    browser: true,
    es2021: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    '@vue/eslint-config-prettier',
    '@unocss'
  ],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-var-requires': 'off', // 允许使用 require
    'vue/multi-word-component-names': 'off', // 允许使用单个单词的组件名
    '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any
    '@unocss/order-attributify': 'off', // 关闭 unocss 类名必须按一定规则排序
    'vue/attributes-order': 'off', // 关闭 vue 属性必须按一定规则排序
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
})
