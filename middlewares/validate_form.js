const RoomCall = require('../models/RoomCall.models')

module.exports.validateLounge = async (req, res, next) => {
    console.log("qưeqwe   ",req.body);
    const errores = []
    if(req.body.type_room && req.body.name && req.body.roomid){
        next()
    }
    else{
        if(!req.body.name)
            errores.push('Bạn chưa nhập tên ')
        if(!req.body.roomid){
            errores.push('Phòng hội thảo trống')
        }else{  
            const roomId = await RoomCall.findOne({room_id: req.body.roomid})
            if(!roomId)
                    errores.push('Phòng hội thảo không tồn tài')
        }
        if(errores.length > 0)
            res.json(errores)
        else   
            next()
    }
}