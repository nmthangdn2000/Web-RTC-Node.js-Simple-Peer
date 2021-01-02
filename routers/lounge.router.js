const express = require('express');
const router = express.Router();
const controller = require('../controllers/lounge.controller');
const auth = require('../middlewares/auth')


//phòng chờ chưa có id
router.get('/lounge', auth.authentication,  controller.getLounge)
// phòng chờ có id
router.get('/lounge=:room', auth.authentication, controller.getLoungeID)

module.exports = router