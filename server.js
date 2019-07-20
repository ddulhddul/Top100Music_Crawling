// server.js
require('babel-polyfill')
const ServerUtil = require('./ServerUtil')

// DB
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
const db = mongoose.connection
db.on('error', console.error)
db.once('open', function(){
    console.log("Connected to mongod server")
})
mongoose.connect('mongodb://127.0.0.1/chartdb')
const DBUtil = require('./mongodb/DBUtil')

// webpack
const webpack = require('webpack')
const config = require('./webpack.config')
const compiler = webpack(config)

// node
const express = require('express')
const app = express()
app.use(express.static(__dirname +'/dist'))

app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true, publicPath: config.output.publicPath
}))
app.use(require("webpack-hot-middleware")(compiler))

app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n')
})

app.get('/', (req, res)=>{
  return res.redirect('/song')
})

app.get('/song', (req, res)=>{
  res.render('index')
})

app.get('/song/list/:tab', async (req, res)=>{
  const tab = req.params.tab
  const yymmddhh = ServerUtil.getYymmddhh()

  let list = (await DBUtil.listChart(tab, yymmddhh)) || []
  if(!list.length){
    list = await ServerUtil.getChartByUrlRequest(tab, yymmddhh)
    DBUtil.insertChartList(tab, yymmddhh, list)
  }

  res.send({ list, yymmddhh, tab })
})

app.get('/song/change', async (req, res)=>{
  const result = await ServerUtil.getVideoIdBySongAndSinger(req.query)
  res.send({ ...result })
})