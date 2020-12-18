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
const postRoom = (req, res) => {
    user = req.body.name
    res.redirect(`/room_id=${req.body.roomid}`)
}
module.exports = {
    roomCall,
    shareRoomURL,
    postRoom
}