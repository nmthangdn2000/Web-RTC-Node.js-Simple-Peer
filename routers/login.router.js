const express = require('express');
const router = express.Router();
const controller = require('../controllers/login.controller')

const passport = require('passport')
const passportConfig = require('../middlewares/passport')

router.post('/signin', passport.authenticate('local', { session: false }), controller.postSignIn)

router.post('/signup', controller.postSignUp)

router.get('/signout', controller.getSignOut)

module.exports = router