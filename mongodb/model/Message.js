const mongoose = require('mongoose')
const Schema = mongoose.Schema
const messageSchema = new Schema({
    writer: String,
    contents: String,
    date: String
})
module.exports = mongoose.model('message', messageSchema)