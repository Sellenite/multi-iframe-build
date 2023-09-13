const merge = require("webpack-merge")
const prodConfig = require("./webpack.prod.conf")
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = merge(prodConfig, {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
})