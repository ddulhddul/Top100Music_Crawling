var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chartSchema = new Schema({
    yymmddhh: String,
    num: Number,
    song: String,
    singer: String,
    url: String,
    videoId: String,
    srch: String
});

module.exports = mongoose.model('chart', chartSchema);
