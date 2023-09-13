const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")
const webpack = require("webpack")
const CLASS_NAME = "HtmlWebpackInjectPlugin"

class HtmlWebpackInjectPlugin {
  constructor(assetsDir = '', config) {
    this.assetsDir = assetsDir
    this.externalsConfig = config
  }
  apply(compiler) {
    const COMPILER_LOGGER = compiler.getInfrastructureLogger(CLASS_NAME)
    this.projectContext = compiler.context
    compiler.hooks.compilation.tap(CLASS_NAME, (compilation) => {
      const COMPILATION_LOGGER = compilation.getLogger(CLASS_NAME)
      const requestMap = new Map()
      // 记录每个chunk需要的external module
      compilation.hooks.optimizeChunks.tap(CLASS_NAME, chunks => {
        Array.from(chunks).forEach(chunk => {
          const moduleList = compilation.chunkGraph.getChunkModules(chunk)
          moduleList.forEach(module => {
            if (module instanceof webpack.ExternalModule || module instanceof webpack.NormalModule) {
              const requestName = module.userRequest
              if (this.externalsConfig[requestName]) {
                if (requestMap.has(chunk.name) === false) {
                  requestMap.set(chunk.name, [])
                }
                requestMap.get(chunk.name).push(requestName)
              }
            }
          })
          if (requestMap.has(chunk.name) === true) {
            COMPILER_LOGGER.info(`${chunk.name} need these external modules: `, requestMap.get(chunk.name))
          }
        })
      })
      // 向每个页面注入他的chunks所引用的external script
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapPromise(CLASS_NAME, async (htmlPluginData) => {
        const publicPath = htmlPluginData.assets.publicPath
        const chunks = htmlPluginData.plugin.options.chunks
        if (chunks === "all") {
          const error = new webpack.WebpackError("HtmlWebpackInjectPlugin is available only when the option [chunks] of HtmlWebpackPlugin is provided as type of string[]!")
          COMPILATION_LOGGER.error(error)
          compilation.errors.push(error)
          throw error
        } else {
          const jsList = []
          const cssList = []
          for (const chunkName of chunks) {
            if (requestMap.has(chunkName) === false) {
              continue
            }
            for (const requestName of requestMap.get(chunkName)) {
              const fileList = Array.isArray(this.externalsConfig[requestName].files) ? this.externalsConfig[requestName].files : this.externalsConfig[requestName].files ? [this.externalsConfig[requestName].files] : []
              for (const fileName of fileList) {
                const filePath = path.posix.join(publicPath, this.assetsDir, fileName)
                switch (path.extname(fileName).toLowerCase()) {
                  case ".js":
                    jsList.push(filePath)
                    break
                  case ".css":
                    cssList.push(filePath)
                    break
                  default:
                    const error = new webpack.WebpackError('Only support .js/.css file\n' + `External import ${requestName} contains a not .js/.css file: "${filePath}"`)
                    COMPILATION_LOGGER.error(error)
                    compilation.errors.push(err)
                    throw error
                }
              }
            }
          }
          if (jsList.length) {
            htmlPluginData.assets.js = jsList.concat(htmlPluginData.assets.js)
          }
          if (cssList.length) {
            htmlPluginData.assets.css = jsList.concat(htmlPluginData.assets.css)
          }
          return htmlPluginData
        }
      })
    })
  }
}

module.exports = HtmlWebpackInjectPlugin