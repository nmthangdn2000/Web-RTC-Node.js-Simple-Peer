const Account = require('../models/Account.models')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/appconfig')

const endCodeToken = (inforUser) => {
    return jwt.sign(inforUser, JWT_SECRET, {expiresIn: '30d'})
}
// đăng ký
const postSignUp = async (req, res) => {
    const newAccount = await new Account({
        user_name: req.body.userName, 
        email: req.body.email,
        password: req.body.passWord,
        create_at: new Date,
        update_at: new Date
    })
    await newAccount.save().then(data => {
        res.json({
            success: true,
            msg: "SignUp success"
        })
    }).catch(err => 
        res.json({
            success: false,
            msg: "SignUp failed"
        })
    )
}
// đăng nhập
const postSignIn = async (req, res) => {
    const data = req.user
    const inforUser = {
        id: data._id,
        userName: data.userName
    }
    const token = endCodeToken(inforUser)
    res.cookie('token', 'Bearer '+token, {maxAge: 1000*60*60*24*30})
    res.redirect('lounge')
}
// đăng xuất
const getSignOut = async (req, res) => {
    res.clearCookie('token')
    res.redirect('/lounge');
}
module.exports = {
    postSignUp,
    postSignIn,
    getSignOut
}