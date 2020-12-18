const express = require('express');
const router = express.Router();
const controller = require('../controllers/roomCall.controller');

//phòng họp
router.get('/room_id=:room', controller.roomCall)
// share link
router.get('/:room', controller.shareRoomURL)
// post 
router.post('/room_id', controller.postRoom)

module.exports = router