const passport = require('passport')
const passportConfig = require('../middlewares/passport')

module.exports.authentication = function (req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, infor) => {
        if(user) res.app.locals.user = user
        else res.app.locals.user = undefined
        next()
    })(req, res, next)
}