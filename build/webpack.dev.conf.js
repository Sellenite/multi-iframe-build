var merge = require("webpack-merge")
var common = require("./webpack.base.conf")
var path = require("path")

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, '../dist') // webpack5使用，dev-server的启动目录
    },
    port: 9000,
  }
})