require('babel-polyfill')
const ServerUtil = require('./ServerUtil')

// webpack
const webpack = require('webpack')
const config = require('./webpack.config')
const compiler = webpack(config)

// node
const express = require('express')
const app = express()
app.use(express.static(__dirname +'/assets'))

app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true, publicPath: config.output.publicPath
}))

app.use(require("webpack-hot-middleware")(compiler))

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n')
})

app.get('/', (req, res)=>{
  return res.redirect('/song');
})

app.get('/song', (req, res)=>{
  res.render('index')
})

app.get('/song/list', async (req, res)=>{
  const result = await ServerUtil.getChartByUrlRequest()
  res.send({
    result
  })
})