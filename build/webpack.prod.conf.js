var merge = require("webpack-merge")
var common = require("./webpack.base.conf")

var CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
var TerserPlugin = require("terser-webpack-plugin")
var { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = merge(common, {
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    minimize: true, // 是否总开启压缩
    minimizer: [
      // webpack5默认会在生产模式下压缩js，但不压缩css，如果配置了css压缩，js的压缩会自动失效，需要额外写
      new CssMinimizerPlugin(),
      new TerserPlugin()
    ]
  }
})