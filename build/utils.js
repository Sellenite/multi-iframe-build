const path = require("path")
const glob = require("glob")
const myPackage = require("../package")
const minimist = require("minimist")

function getRunModules() {
  const rawArgs = process.argv.slice(2)
  return minimist(rawArgs)
}

function assetsPath(_path) {
  const assetsSubDirectory = 'static'
  // 标准化路径，不同操作系统渲染出来的html内容不一样，例如windows的是'\/'，posix就是'/'，跨平台必须使用posix
  return path.posix.join(assetsSubDirectory, _path)
}

function genMultiEntries() {
  var runModules = getRunModules().modules // 需要编译的模块
  var dir = path.resolve(__dirname, "../src/modules/**/routes.json")
  var titles = []
  var files = {}

  runModules = runModules ? runModules.split(",") : ""
  glob.sync(dir).forEach(function (confPath) {
    // 遍历模块配置
    var moduleName = getModuleName(confPath) // 模块名
    // 理论上可以无限加子目录，位率避免链接过长，目前限制到4级
    if (moduleName.split("/").length > 4) {
      return
    }
    var arr = confPath.split("/")
    arr.pop()
    var pages = require(confPath)
    // 判断该模块是否需要编译
    if (!runModules || runModules.indexOf(moduleName) != -1 || isInEverything(runModules, moduleName) || pages["#always"] === true) {
      for (var pageName in pages) {
        if (pageName === "#always") {
          // 过滤掉关键词选项
          continue
        }
        var pCfg = pages[pageName] // 单个页面信息
        var entry = pCfg.entry // 入口js文件路径
        if (!entry) {
          titles.push(pCfg)
          entry = `${pageName}/main`
        }
        entry = path.join(arr.join("/"), entry)
        files[moduleName + "/" + pageName] = entry
      }
    }
  })
  return { files, titles }
}

function getModuleName(confPath) {
  var ps = confPath.split("src/modules/")
  return ps[1].replace(/\/routes.json/, "")
}

function isInEverything(runModules, moduleName) {
  for (var i = 0; i < runModules.length; i++) {
    var module = runModules[i]
    if (module.indexOf("/*") !== -1) {
      if (moduleName.startsWith(module.replace("*", ""))) {
        return true
      }
    }
  }
  return false
}

function genStatic4Externals() {
  var staticMap = myPackage.externals
  var ret = {}
  for (var k in staticMap) {
    if (!staticMap[k].env || staticMap[k].env === 'both' || staticMap[k].env == process.env.NODE_ENV) {
      ret[k] = staticMap[k].var
    }
  }
  return ret
}

module.exports = {
  genMultiEntries,
  assetsPath,
  genStatic4Externals
}