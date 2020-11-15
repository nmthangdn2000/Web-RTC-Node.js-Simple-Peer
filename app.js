const express = require('express')
const app = express()


app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs');

app.use('/' , (req, res) => {
    res.render('frontend/index.ejs')
})


module.exports = app

