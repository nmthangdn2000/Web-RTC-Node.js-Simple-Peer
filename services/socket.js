const RoomCall = require('../models/RoomCall.models')
const io = require('socket.io')()
let peer = {}
let people = {}

io.on('connection', (socket) => {
    console.log(socket.id);
    peer[socket.id] = socket

    socket.emit('lounge', socket.id)
    socket.on('NewUser', roomID => {
        console.log("đã kết nối " + socket.id)
        socket.emit('getsocketid', socket.id)
        socket.to(roomID).emit('initReceive', socket.id)
        io.to(roomID).emit('numberUser', io.sockets.adapter.rooms[roomID].length)
    })

    socket.on('join-room', (roomID, user) => {
        people[socket.id] = user
        socket.join(roomID)
        socket.to(roomID).emit('user-name', socket.id, user);
        Object.keys(io.sockets.adapter.rooms[roomID].sockets).forEach(element => {
            if(element != socket.id)
                socket.emit('user-name-for-me', element, people[element]);
        });
    })
    // lounge join room
    socket.on('lounge-join-room', async (username, roomId, socketid) => {
        if(io.sockets.adapter.rooms[roomId] != undefined){
            await RoomCall.findOne({room_id: roomId})
            .then(data => {
                const socketid_master = Object.keys(io.sockets.adapter.rooms[roomId].sockets)[0]
                if(data.room_mode === "public")
                    socket.emit('join-room-ok')
                else if(data.room_mode === "private"){
                    io.to(roomId).emit('room-master', username, socketid_master, socketid)
                }
                else if(data.room_mode === "password"){
                    socket.emit('room-password', username, roomId, socketid)
                }
            })
            .catch(err => console.log(err))
        }else{
            socket.emit('join-room-ok')
        }
    })
    socket.on('submit-room-password', async (username, roomId, socketid, password) => {
        await RoomCall.findOne({room_id: roomId})
        .then(data => {
            console.log("hahahahh ---------------------   ", data);
            if(data.room_password === password)
                socket.emit('join-room-ok')
            else{
                socket.emit('feeback-room-password', username, roomId, socketid)
            }
        })
        .catch(err => console.log(err))
    })
    //feedback-join-room
    socket.on('feedback-join-room', (feedback, socketid) => {
        peer[socketid].emit('feedback-join-room', feedback)
    })
    // chat
    socket.on('send-mess', (value, iduser, roomId) => {
        socket.to(roomId).emit('send-mess', value, people[iduser])
    })
    // chat
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