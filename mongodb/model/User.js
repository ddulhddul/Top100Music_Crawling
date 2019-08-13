const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  userId: String,
  userPassword: String,
  userKey: String,
  music: Object
})
module.exports = mongoose.model('user', userSchema)
