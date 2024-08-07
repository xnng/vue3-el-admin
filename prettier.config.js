/**
 * 修改配置后重启编辑器
 * 配置项文档：https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

export default {
  /** 每一行的宽度 */
  printWidth: 150,
  /** 使用空格缩进 */
  useTabs: false,
  /** 缩进的空格数 */
  tabWidth: 2,
  /** 是否在语句末尾添加分号 */
  semi: false,
  /** 是否使用单引号 */
  singleQuote: true,
  /** 在对象中的括号之间是否用空格来间隔 */
  bracketSpacing: true,
  /** 对象或者数组的最后一个元素后面不要加逗号 */
  trailingComma: "none",
  /** 箭头函数参数周围使用圆括号-eg: (x) => x */
  arrowParens: "always",
  /** 换行符的形式 */
  endOfLine: "lf"
}
