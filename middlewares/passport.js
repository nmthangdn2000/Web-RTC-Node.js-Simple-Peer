const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt} = require('passport-jwt')
const { JWT_SECRET } = require('../config/appconfig')
const Account = require('../models/Account.models')

// passport jwt
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: JWT_SECRET
}), async (payload, done) => {
    try {
        const account = await Account.findById(payload.id)
        if(!account) return done(null, false)
        done(null, account)
    } catch (error) {
        done(error, false)
    }
})
// passport local
passport.use(new LocalStrategy({
    usernameField: 'email'
}), async (email, password, done) => {
    try {
        const account = await account.findOne(email)
        if(!account) return done(null, false)
        const isValidPassWord = await account.isValidPassWord(password)
        if(!isValidPassWord) return done(null, false)
        done(null, account)
    } catch (error) {
        done(error, false)
    }
})
