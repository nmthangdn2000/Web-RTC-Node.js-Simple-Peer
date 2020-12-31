const Account = require('../models/Account.models')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/appconfig')

const endCodeToken = (inforUser) => {
    return jwt.sign(inforUser, JWT_SECRET, {expiresIn: '30d'})
}
// đăng ký
const postSignUp = async (req, res) => {
    const newAccount = new Account({
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
    const data = req.account
    const inforUser = {
        id: data._id,
        userName: data.userName
    }
    const token = endCodeToken(inforUser)
    res.json({
        _id: data._id,
        user_name: data.userName,
        email: data.email,
        avata: data.avata,
        token: token
    })
}

module.exports = {
    postSignUp,
    postSignIn
}