const RoomCall = require('../models/RoomCall.models')
const {v4: uuidV4} = require('uuid')
let user =""

const roomCall = (req, res) => {
    if(user.length > 0)
        res.render('frontend/index.ejs', {
            roomID: req.params.room,
            userName: user
        })
    else
        res.redirect(`lounge=${req.params.room}`)
    user = ""
}
//
const shareRoomURL = (req, res) => {
    res.redirect(`/lounge=${req.params.room}`)
}
//
const postRoom = async (req, res) => {
    let checkRoom = false
    user = req.body.name
    const AllRoom = await RoomCall.find()
    AllRoom.some(element => {
        console.log(element)
        if(element.room_id === req.body.roomid) checkRoom = true
        return element.room_id === req.body.roomid
    })
    if(checkRoom == false) {
        let newRoom = await new RoomCall({
            room_id: req.body.roomid,
            room_name: user,
            status: true, // room đang hoạt động
            room_mode: false, // room đang ở chế độ private
            create_at: new Date,
            update_at: new Date
        })
        await newRoom.save()
        .then(data => {
            console.log(data);
            res.redirect(`/room_id=${req.body.roomid}`)
        })
        .catch(err => console.log("",err))
    }else{
        res.redirect(`/room_id=${req.body.roomid}`)
    }
}  
//
const getAllRoom = async (req, res) => {
    await RoomCall.find()
    .then(data => {
        res.json(data)
    })
    .catch(err => {
        console.log("", err)
        res.json({
            err: false,
            msg: "lỗi"
        })
    })
}
//
const getNewRoomId = async (req, res) => {
    res.json(uuidV4())
}
module.exports = {
    roomCall,
    shareRoomURL,
    postRoom,
    getAllRoom,
    getNewRoomId
}