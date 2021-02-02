require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const ANALYTICS = require('./my_modules/analytics.js')
const ROUTES = require('./my_modules/routes.js')
const GITHUB = require('./my_modules/github.js')
const SOCKETS = require('./my_modules/sockets.js')
const port = process.env.PORT || 80

app.use(ANALYTICS)
app.use(express.static(`${__dirname}/www`))
app.use(ROUTES)
app.use(GITHUB)

io.on('connection', (socket) => SOCKETS(socket, io))

http.listen(port, () => console.log(`listening on: ${port}`))

if (process.env.PROD) {
  const proxy = require('redbird')({
    port: 80,
    // xfwd: false,
    letsencrypt: { path: 'certs', port: 3000 },
    ssl: { port: 443 }
  })
  const config = {
    ssl: { letsencrypt: { email: 'hi@netizen.org', production: true } }
  }
  proxy.register('68.183.115.149', 'http://localhost:8001', config)
  proxy.register('netnet.studio', 'http://localhost:8001', config)
  proxy.register('www.netnet.studio', 'http://localhost:8001', config)
  // temporary home for the older VR tutorials while we continue to refactor
  proxy.register('netnet.studio/beta-v1', 'http://localhost:8002', config)
}
