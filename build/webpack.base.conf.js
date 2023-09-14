const path = require("path")
const utils = require("./utils.js")
const myPackage = require("../package")

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInjectPlugin = require('./plugins/HtmlWebpackInjectPlugin.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const VueLoaderPlugin = require('vue-loader/lib/plugin') // @15.9.8 for vue2, latest for vue3
const { VueLoaderPlugin } = require('vue-loader') // @15.9.8 for vue2, latest for vue3
const ESLintWebpackPlugin = require('eslint-webpack-plugin')

const pages = utils.genMultiEntries().files
const titles = utils.genMultiEntries().titles

const VENDORS_NAME = 'vendors'
const COMMONS_NAME = 'commons'

// 生成页面入口html
let index = 0
const htmlList = []
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
    chunks: [VENDORS_NAME, COMMONS_NAME, k],
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
    // clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
  },
  cache: {
    type: 'filesystem', // 使用文件缓存，使再次打包的时间提升了90%
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".vue", ".json", ".css", ".sass", ".scss", ".png", ".jpg", ".jpeg"],
    alias: {
      "@": path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: ["vue-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        ]
      },
      // 让vue支持tsx
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
          },
          {
            loader: "ts-loader",
            options: {
              appendTsxSuffixTo: [/\.vue$/],
              transpileOnly: true // 是否只做语言转换，不做类型检查，为false会导致打包很慢
            }
          }
        ]
      },
      // 精确使用loader，避免执行无用loader
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 抽取css为独立的文件，不抽取就是使用style-loader：把解析后的css代码从js中抽离，放到头部的style标签中
          "css-loader", // 解析css文件代码
          {
            loader: 'postcss-loader', // postcss-loader：处理css时自动加前缀
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'] // autoprefixer：决定添加哪些浏览器前缀到css中
              }
            }
          }
        ],
      },
      {
        test: /\.(scss|sass)$/,
        use: [
          MiniCssExtractPlugin.loader, // 抽取css为独立的文件，不抽取就是使用style-loader：把解析后的css代码从js中抽离，放到头部的style标签中
          "css-loader", // 解析css文件代码
          {
            loader: 'postcss-loader', // postcss-loader：处理css时自动加前缀
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'] // autoprefixer：决定添加哪些浏览器前缀到css中
              }
            }
          },
          "sass-loader"
        ],
      },
      // {
      //   test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      //   loader: "url-loader",
      //   options: {
      //     limit: 100000, // byte
      //     esModule: false, // 重要，不然会使用ES模块，而vue是CommonJS模块引入，导致无法显示
      //     name: utils.assetsPath("images/[name].[hash:7].[ext]")
      //   }
      // },
      // {
      //   test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
      //   loader: "file-loader",
      //   options: {
      //     name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
      //   }
      // }
      // webpack5不使用file-loader和url-loader了，而是使用自带的asset-module来处理
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: utils.assetsPath("images/[name].[hash:7].[ext]"), // 文件输出目录和命名
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: utils.assetsPath("fonts/[name].[hash:7].[ext]"), // 文件输出目录和命名
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator: {
          filename: utils.assetsPath("medias/[name].[hash:7].[ext]"), // 文件输出目录和命名
        },
      },
    ]
  },
  externals: utils.genStatic4Externals(),
  plugins: [
    ...htmlList,
    new HtmlWebpackInjectPlugin('static', myPackage.externals),
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
      // 是否开启 options API
      __VUE_OPTIONS_API__: true,
      // 生产环境是否支持DEVTOOLS
      __VUE_PROD_DEVTOOLS__: false,
      // 必须定义，不然业务代码无法找到process，process.env.BASE_ENV应该是内置已经定义的，直接取process是不行的
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      // 用于判断打包出来的代码在哪个环境
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV),
    }),
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, 'src'),
      extensions: ["js", "jsx", "ts", "tsx", "vue"]
    }),
  ]
}