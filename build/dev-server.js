const webpackDevServer = require("webpack-dev-server")
const webpack = require("webpack")
const webpackDevConfig = require("./webpack.dev.conf")

const compiler = webpack(webpackDevConfig)

compiler.hooks.done.tap("webpack-dev-server", stats => {
  if (stats.hasErrors()) {
    return
  }

  const site = `http://localhost:${webpackDevConfig.devServer.port}/main/index.html`

  console.log(`run success, main page is ${site}`)
})

const server = new webpackDevServer(webpackDevConfig.devServer, compiler)

server.start()