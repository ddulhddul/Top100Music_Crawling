var mongoose = require('mongoose')
var moment = require('moment')
var Message = require('./model/Message')

// let db = mongoose.connection;
// db.on('error', console.error);
// db.once('open', function(){
//     // CONNECTED TO MONGODB SERVER
//     console.log("Connected to mongod server");
// });
mongoose.connect('mongodb://127.0.0.1/chartdb');

Message
.find()
.snapshot()
.then((result) => {
  result.forEach((message) => {
    message.formattedDate = moment(message.date).locale('ko').format('LLL')
    message
    .save()
    .then((saved) => {
      console.log('[%s] formattedDate updated from %s >> %s', saved.seq, message.formattedDate, saved.formattedDate)
    })
  })
})
.catch(console.error)