var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    seq: Number,
    writer: String,
    content: String,
    date: Date,
    formattedDate: String,
    state: Number
});

module.exports = mongoose.model('message', messageSchema);
