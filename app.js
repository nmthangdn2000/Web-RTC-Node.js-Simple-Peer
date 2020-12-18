const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const {v4: uuidV4} = require('uuid')

app.use(express.static(__dirname + '/public'))
app.set('views', './views')
app.set('view engine', 'ejs');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const routerLounge = require('./routers/lounge.router')
const routerRoomCall = require('./routers/roomCall.router')

app.use(routerLounge)
app.use(routerRoomCall)

app.get('/aaa', (req, res) => {
    res.render('frontend/index.ejs', {roomID: req.params.room})
})

module.exports = app

