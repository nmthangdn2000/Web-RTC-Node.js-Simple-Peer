const mongoose = require('mongoose')
const brcypt = require('bcryptjs')

const accountSchema = new mongoose.Schema({
    user_name : {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    avata:{
        type: String,
        require: true,
    },
    create_at:{
        type: Number,
        required: true,
    },
    update_at:{
        type: Number,
        required: true,
    }
})

accountSchema.pre('save', async function(next){
    try {
        // Generatipn a salt ...
        const salt = await brcypt.genSalt(10)
        // Generation a password hash (salt + hash)
        const passWordHashed = await brcypt.hash(this.password, salt)
        //Re-assign password hashed
        this.password = passWordHashed
        
        next()

    } catch (error) {
        next(error)
    }
})

accountSchema.methods.isValidPassWord = async function(newPassword) {
    try {
        return await brcypt.compare(newPassword, this.password)
    } catch (error) {
        throw new Error(error)
    }
}

const Account = mongoose.model('Account', accountSchema, 'account')

module.exports = Account