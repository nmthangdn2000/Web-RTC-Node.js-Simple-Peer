const mongoose = require('mongoose')
const { URL_MONGODB } = require('../config/appconfig')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect(URL_MONGODB)

const db = mongoose.connection
db.on('error', err => console.log("mongoose error: ", err))
.once('open', () => {
    console.log('DB Connect sucesses');
})