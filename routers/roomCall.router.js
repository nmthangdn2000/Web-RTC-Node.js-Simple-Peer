const express = require('express');
const router = express.Router();
const controller = require('../controllers/roomCall.controller');
const validate = require('../middlewares/validate_form')
// get new id room
router.get('/get_room_id', controller.getNewRoomId)
//phòng họp
router.get('/room_id=:room', controller.roomCall)
// share link
router.get('/:room', controller.shareRoomURL)
// post 
router.post('/room_id', validate.validateLounge, controller.postRoom)
//get all room
router.get('/room_id', controller.getAllRoom)

module.exports = router