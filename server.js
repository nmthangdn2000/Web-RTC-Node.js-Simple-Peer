require('dotenv').config();
const app = require('./app')
const http = require('http').Server(app)
const port = process.env.PORT || 3000
const io = require('./services/socket')
const db = require('./db/connectDB')

io.attach(http);

http.listen(port, () => console.log(`Active on ${port} port`))