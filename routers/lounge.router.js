const express = require('express');
const router = express.Router();
const controller = require('../controllers/lounge.controller');

//phòng chờ chưa có id
router.get('/lounge', controller.getLounge)
// phòng chờ có id
router.get('/lounge=:room', controller.getLoungeID)

module.exports = router