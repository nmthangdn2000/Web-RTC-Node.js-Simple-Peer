const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt} = require('passport-jwt')
const { JWT_SECRET } = require('../config/appconfig')
const Account = require('../models/Account.models')

// passport jwt
var cookieExtractor = function(req) {
    var token = null
    if (req && req.cookies['token'] != undefined){
        token = req.cookies['token'].split(' ')[1]
    }
    return token;
};
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
        cookieExtractor
    ]),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const account = await Account.findById(payload.id)
        if(!account) return done(null, false)
        done(null, account)
    } catch (error) {
        console.log(error);
        done(error, false)
    }
}))
// passport local
passport.use(new LocalStrategy({
    usernameField: 'email'
}, async (email, password, done) => {
    try {
        const account = await Account.findOne({email})
        if(!account) return done(null, false)
        const isCorrectPassword = await account.isValidPassWord(password)
        if(!isCorrectPassword) return done(null, false)
        done(null, account)
    } catch (error) {
        done(error, false)
    }
}))
