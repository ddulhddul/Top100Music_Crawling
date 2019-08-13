var mongoose = require('mongoose')
var Schema = mongoose.Schema

var chartSchema = new Schema({
  tab: String,
  yymmddhh: String,
  num: Number,
  song: String,
  singer: String,
  url: String,
  videoId: String,
  srch: String,
  videoTime: String
})

module.exports = mongoose.model('chart', chartSchema)
