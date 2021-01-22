const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    room_id:{
        type: String,
        required: true,
    },
    room_name:{
        type: String,
        required: true,
    },
    status:{
        type: Boolean,
        required: true
    },
    room_mode: {
        type: String,
        required: true
    },
    room_password:{
        type: String,
        require: true
    },
    create_at:{
        type: Number,
        require: true
    },
    update_at:{
        type: Number,
        require: true
    }
})

const RoomCall = mongoose.model('RoomCall', roomSchema, 'roomcall')

module.exports = RoomCall