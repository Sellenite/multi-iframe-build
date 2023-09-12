var path = require("path")
var utils = require("./utils.js")
var myPackage = require("../package")

var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
// var VueLoaderPlugin = require('vue-loader/lib/plugin') // @15.9.8 for vue2, latest for vue3
var { VueLoaderPlugin } = require('vue-loader') // @15.9.8 for vue2, latest for vue3

var pages = utils.genMultiEntries().files
var titles = utils.genMultiEntries().titles

// 生成页面入口html
var index = 0
var htmlList = []
for (var k in pages) {
  var level = k.split("/").length - 2
  // 获取static的相对位置，统一在dist的第一层
  var prefix = '..'
  for (var i = 0; i < level; i++) {
    prefix += "/.."
  }
  htmlList.push(new HtmlWebpackPlugin({
    filename: k + ".html",
    template: "template/general.html",
    inject: true,
    chunks: ["vender", "manifest", k],
    static: prefix,
    title: titles[index]
  }))
  index++
}

module.exports = {
  entry: utils.genMultiEntries().files,
  output: {
    path: path.resolve(__dirname, '../dist'), // 输出目录
    filename: utils.assetsPath("js/[name].[chunkhash].js"), // name就是entry的key，这里是例如：login/index，入口文件名
    chunkFilename: utils.assetsPath("js/[name].[chunkhash].js"), // 非入口文件名
    publicPath: '/', // 资源前缀，dev-server如果在输出目录基本是/，生产环境看资源分布情况
  },
  resolve: {
    extensions: [".js", ".ts", ".vue", ".json", ".css", ".sass", ".scss", ".png", ".jpg", ".jpeg"],
    alias: {
      "@": path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: "vue-loader"
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"]
        }
      }
    },
    {
      test: /\.ts$/, // 匹配.ts文件
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            [
              "@babel/preset-typescript",
              {
                allExtensions: true, //支持所有文件扩展名(重要)
              },
            ],
          ]
        }
      }
    },
    {
      test: /\.css$/,
      use: [MiniCssExtractPlugin.loader, "css-loader"], // 抽取css，不抽取就是用内联css, style-loader
    },
    {
      test: /\.(scss|sass)(\?.*)?$/,
      use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // 抽取css，不抽取就是用内联css, style-loader
    },
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: "url-loader",
      options: {
        limit: 100000, // byte
        esModule: false, // 重要，不然会使用ES模块，而vue是CommonJS模块引入，导致无法显示
        name: utils.assetsPath("img/[name].[hash:7].[ext]")
      }
    },
    {
      test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
      loader: "file-loader",
      options: {
        name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
      }
    }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../dist/static')
      }]
    }),
    new MiniCssExtractPlugin({
      // works like output.filename
      // 抽取css的目录，name会有额外目录到这里例如：static/css/login/index.[chunkhash].css，name就是entry的key，这里是例如：login/index
      filename: utils.assetsPath("css/[name].[chunkhash].css")
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      // 是否开启 options API，学习Vue3之后我们知道，以前我们学习vue主要是options语法，Vue3新增了setup语法（推荐）。
      __VUE_PROD_DEVTOOLS__: false
      // 生产环境是否支持DEVTOOLS
    }),
    ...htmlList
  ]
}