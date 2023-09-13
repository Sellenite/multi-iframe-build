const merge = require("webpack-merge")
const baseConfig = require("./webpack.base.conf")

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const VENDORS_NAME = 'vendors'
const COMMONS_NAME = 'commons'

module.exports = merge(baseConfig, {
  plugins: [
    new CleanWebpackPlugin()
  ],
  optimization: {
    splitChunks: { // 分隔代码
      cacheGroups: {
        vendors: { // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          name: VENDORS_NAME, // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1, // 提取优先级为1
        },
        commons: { // 提取页面公共代码
          name: COMMONS_NAME, // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
        }
      }
    },
    minimize: true, // 是否总开启压缩
    minimizer: [
      // webpack5默认会在生产模式下压缩js，但不压缩css，如果配置了css压缩，js的压缩会自动失效，需要额外写
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        extractComments: false, // 禁止自动生成license文件
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"] // 删除console.log
          }
        }
      })
    ]
  }
})