const io = require('socket.io')()
let peer = {}
let people = {}

io.on('connection', (socket) => {

    
    socket.on('NewUser', roomID => {
        peer[socket.id] = socket
        console.log("đã kết nối " + socket.id)
        socket.emit('getsocketid', socket.id)
        socket.to(roomID).emit('initReceive', socket.id)
        io.to(roomID).emit('numberUser', io.sockets.adapter.rooms[roomID].length)
    })

    socket.on('join-room', (roomID, user) => {
        people[socket.id] = user
        console.log("aaaaaaaaaaa",people[socket.id]);
        socket.join(roomID)
        console.log(io.sockets.adapter.rooms[roomID]);
    })

    socket.on('signal', data => {
        console.log('sending signal from ' + socket.id + ' to ' +data)
        if(!peer[data.socket_id]) return
        peer[data.socket_id].emit('signal', {
            socket_id: socket.id,
            signal: data.signal
        })
    })

    socket.on('initSend', init_socket_id => {
        console.log('INIT SEND by ' + socket.id + ' for ' + init_socket_id)
        // gửi socket.id cho các client khác
        peer[init_socket_id].emit('initSend', socket.id)
    })



    socket.on('turn off mic', (id) => {
        console.log("asdklsaj "+id);
        socket.broadcast.emit('turn off mic', id)
    })

    socket.on('turn off video', id => {
        socket.broadcast.emit('turn off video', id)
    })
    socket.on('disconnect', () => {
        console.log('ngắt kết nối ' + socket.id)
        socket.broadcast.emit('removePeer', socket.id)
        delete peer[socket.id]
        console.log(Object.keys(peer).length);
        io.emit('numberUser', Object.keys(peer).length)
    })
})

module.exports = io