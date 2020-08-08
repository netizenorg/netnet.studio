require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const ROUTES = require('./my_modules/routes.js')
const SOCKETS = require('./my_modules/sockets.js')
const port = process.env.PORT || 80

app.use(express.static(`${__dirname}/www`))
app.use(ROUTES)

io.on('connection', (socket) => SOCKETS(socket, io))

http.listen(port, () => console.log(`listening on: ${port}`))
