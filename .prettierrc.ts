export default {
  printWidth: 150, // 单行长度
  tabWidth: 2, // 缩进长度
  useTabs: false, // 使用空格缩进
  semi: false, // 句末不使用分号
  vueIndentScriptAndStyle: false, // 不对vue中的script及style标签缩进
  singleQuote: true, // 使用单引号
  quoteProps: "as-needed", // 仅在必需时为对象的key添加引号
  bracketSpacing: true, // 在对象前后添加空格-eg: { foo: bar }
  trailingComma: "none", // 不使用尾逗号
  jsxSingleQuote: true, // jsx中使用单引号
  arrowParens: "always", // 单参数箭头函数参数周围使用圆括号-eg: (x) => x
  insertPragma: false, // 不在已被preitter格式化的文件顶部加上标注
  endOfLine: "lf", // 结束行形式
}