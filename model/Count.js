var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var countSchema = new Schema({
    yymmdd: String,
    cnt: Number,
    ip : { type : Array , "default" : [] }
});

module.exports = mongoose.model('count', countSchema);
