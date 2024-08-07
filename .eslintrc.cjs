// .eslintrc.cjs
const { defineConfig } = require('eslint-define-config')
// const unocss = require('@unocss/eslint-config/flat')

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
    /**  */
    'prettier/prettier': 'error',
    /** 关闭 不允许使用 require */
    '@typescript-eslint/no-var-requires': 'off',

    'vue/multi-word-component-names': 'off', // 关闭 不能使用单个单词命名组件
    '@typescript-eslint/no-explicit-any': 'off', // 关闭 不允许使用 any
    '@unocss/order-attributify': 'off', // 关闭 unocss 类名必须按一定规则排序
    'vue/attributes-order': 'off', // 关闭 vue 属性必须按一定规则排序
    'vue/attribute-hyphenation': 'off', // 关闭 vue 属性必须使用连字符
    'vue/one-component-per-file': 'off', // 关闭 【一个文件只能有一个组件】
    'vue/component-definition-name-casing': 'off', // 关闭 【组件定义名称必须符合特定的规则】
    '@typescript-eslint/ban-ts-comment': 'off' // 关闭 【禁止使用 @ts-xxx 注释】
  }
})
