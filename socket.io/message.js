module.exports = (sockets) => {
    sockets.on('connection', (socket) => {
        // on connection established
        socket.emit('welcome', { message: 'hello socket.io!' })

        // recieving message
        socket.on('sendMessage', (data) => {
            console.log("socket.on('sendMessage')", data)
        })
    })
}
