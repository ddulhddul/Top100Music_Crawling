module.exports = (express) => {
    let moment = require('moment')
    let Message = require('../model/Message')

    let route = express.Router()

    const INITIAL_FETCH_SIZE = 5
    const ADDITIONAL_FETCH_SIZE = 5

    // get Message list
    route.get('/:messageCount', (req, res) => {
        // extract existing message count
        let messageCount = Number.isNaN(req.params.messageCount) ? 0 : Number(req.params.messageCount)
        // determine message count for querying
        let loadCount = messageCount === 0 ? INITIAL_FETCH_SIZE : messageCount + ADDITIONAL_FETCH_SIZE

        Promise.all([
            _countMessage(),
            _getMessageList(loadCount)
        ])
        .then((results) => {
            res.send({
                totalCount: results[0],
                messageList: results[1]
            })
        })
        .catch((error) => {
            console.error(error)
            res.setStatus(500).send(error)
        })
    })

    // save Message
    route.post('/', (req, res) => {
        let message = new Message(req.body)

        let messageCount = Number.isNaN(req.body.messageCount) ? 0 : Number(req.body.messageCount)
        let loadCount = messageCount + 1
        
        _getMaxSeq()
        .then((result) => {
            // pre-process
            message.seq = result ? result.seq + 1 : 1
            message.date = new Date()
            message.formattedDate = moment(message.date).locale('ko').format('LLL')
            // message.formattedDate 
            //     = [message.date.getFullYear(),message.date.getMonth()+1,message.date.getDate()].join('-')
            //     + ' '
            //     + [message.date.getHours(), message.date.getMinutes() < 10 ? '0'+message.date.getMinutes() : message.date.getMinutes()].join(':')
            message.state = 1
            message.writer = req.body.writer
            message.content = req.body.content

            // save
            message
            .save()
            .then(() => { 
                Promise.all([
                    _countMessage(),
                    _getMessageList(loadCount)
                ])
                .then((results) => {
                    res.send({
                        totalCount: results[0],
                        messageList: results[1]
                    })
                })
            })
        })
        .catch((error) => {
            console.error(error)
            res.setStatus(500).send(error)
        })
    })

    let _getMessageList = (loadCount) => {
        return new Promise((onFurfilled, onRejected) => {
            Message
            .find({ state: 1 })
            .limit(loadCount)
            .sort({ date: -1 })
            .then(onFurfilled)
        })
    }

    let _getMaxSeq = () => {
        return new Promise((onFurfilled, onRejected) => {
            Message
            .findOne()
            .sort({ seq: -1 })
            .select('seq')
            .then(onFurfilled)
        })
    }

    let _countMessage = () => {
        return new Promise((onFurfilled, onRejected) => {
            Message
            .count({ state: 1 })
            .then(onFurfilled)
        })
    }

    return route
}