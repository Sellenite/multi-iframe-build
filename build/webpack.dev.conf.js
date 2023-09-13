const merge = require("webpack-merge")
const baseConfig = require("./webpack.base.conf")
const path = require("path")

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist') // webpack5使用，dev-server的启动目录
    },
    port: 9000,
  }
})