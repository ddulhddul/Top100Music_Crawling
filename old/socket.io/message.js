module.exports = (globalSocket) => {
    let moment = require('moment')
    let Message = require('../model/Message')

    const INITIAL_FETCH_SIZE = 10
    const ADDITIONAL_FETCH_SIZE = 5

    // on connection established
    globalSocket.on('connection', (socket) => {
        
        // whenever recieve requestMessage
        socket.on('requestMessage', (lastSeq) => {
            Promise.all([
                _countMessage(),
                _getMessageList(lastSeq, ADDITIONAL_FETCH_SIZE)
            ])
            .then((results) => {
                socket.emit('fetchMessage', {
                    totalCount: results[0],
                    messageList: results[1]
                })
            })
            .catch((error) => {
                console.error(error)
                socket.emit('error', error)
            })
        })
        
        // whenever recieve sendMessage
        socket.on('sendMessage', (message) => {
            message = new Message(message)

            _getMaxSeq()
            .then((result) => {
                // pre-process
                message.seq = result ? result.seq + 1 : 1
                message.date = new Date()
                message.formattedDate = moment(message.date).locale('ko').format('LLL')
                message.state = 1

                // save
                message
                .save()
                .then((saved) => {
                    globalSocket.emit('newMessage', saved)
                })
            })
            .catch((error) => {
                console.error(error)
                socket.emit('error', error)
            })
        })

        // send initial messageList
        Promise.all([
            _countMessage(),
            _getMessageList(0, INITIAL_FETCH_SIZE)
        ])
        .then((results) => {
            socket.emit('fetchMessage', {
                totalCount: results[0],
                messageList: results[1]
            })
        })
        .catch((error) => {
            console.error(error)
            socket.emit('error', error)
        })
    })

    let _getMessageList = (lastSeq, count) => {
        return new Promise((onFurfilled, onRejected) => {
            // 이미 조회된 메시지가 존재 할 경우에만 seq 조건을 추가한다.
            let findCondition = { state: 1 }
            if ( lastSeq > 0 ) { findCondition.seq = { $lt: lastSeq } }

            Message
            .find(findCondition)
            .limit(count)
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

}
