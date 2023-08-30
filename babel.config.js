module.exports = {
  presets: [
    ["@vue/babel-preset-app", {
      useBuiltIns: "entry" // 只会再项目入口处导入需要的polyfill，而不是所有文件都导入
    }]
  ]
}