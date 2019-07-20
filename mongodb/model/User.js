let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    userId: String,
    password: String,
    songList: Array
});

module.exports = mongoose.model('user', userSchema);
