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
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname +'/dist'))

app.use(require("webpack-dev-middleware")(compiler, {
  noInfo: true, publicPath: config.output.publicPath
}))
app.use(require("webpack-hot-middleware")(compiler))

app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n')
})

app.get('/', (req, res)=>{
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

app.get('/song/search', async (req, res)=>{
  const list = await ServerUtil.getSearchSongList(req.query)
  res.send({ list })
})


/*
  My Songs
*/
app.get('/song/passport/login', async (req, res)=>{
  const param = req.query || {}
  const result = await DBUtil.findUserByIdPw(param.userId, param.userPassword)
  res.send(result)
})

app.get('/song/passport/getUserInfo', async (req, res)=>{
  const param = req.query || {}
  const result = await DBUtil.findUserBy_id(param.userId)
  res.send(result)
})

app.get('/song/passport/join', async (req, res)=>{
  const param = req.query || {}
  const result = await DBUtil.joinUser(param.userId, param.userPassword)
  res.send(result)
})

app.get('/song/passport/updateMySongList', async (req, res)=>{
  const param = req.query || {}
  const user = (await DBUtil.findUserBy_id(param.userId))._doc || {}
  let defaultMusicList = (user.music || {}).default || []
  if(!param.deleteVideoId){
    const musicDupCheck = defaultMusicList.find((obj)=> obj.videoId == param.videoId)
    if(musicDupCheck){
      res.send('DUP')
      return
    }
    defaultMusicList.push({
      videoId: param.videoId,
      videoTime: param.videoTime,
      title: param.title,
    })
  }else{
    defaultMusicList = defaultMusicList.filter((obj)=> obj.videoId != param.deleteVideoId)
  }

  await DBUtil.insertMySong({
    ...user,
    music: {
      ...user.music,
      default: defaultMusicList
    }
  })
  res.send('SUCCESS')
})


/*
  Message
*/
app.get('/song/message/list', async (req, res)=>{
  const param = req.query || {}
  const list = await DBUtil.listMessage(param) || []
  res.send({ list })
})

app.get('/song/message/insert', async (req, res)=>{
  const param = req.query || {}
  await DBUtil.insertMessage(param)
  res.send({ result: 'SUCCESS' })
})