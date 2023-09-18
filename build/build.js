const webpackProdConfig = require("./webpack.prod.conf")
const webpack = require("webpack")

webpack(webpackProdConfig, (err, stats) => {
  if (err) {
    console.log(err)
  }

  if (stats.hasErrors) {
    for (const error of stats.compilation.errors) {
      console.log(error)
    }
  }

  console.log('webpack stats:', stats.toString(), '\n')
})