require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http')
const https = require('https')
const SocketsServer = require('socket.io')
const ANALYTICS = require('stats-not-tracks')
const ROUTES = require('./my_modules/routes.js')
const GITHUB = require('./my_modules/github.js')
const SOCKETS = require('./my_modules/sockets.js')
const PORT = process.env.PORT || 8001

ANALYTICS.setup(app, {
  path: `${__dirname}/data/analytics`,
  admin: {
    route: 'analytics',
    dashboard: `${__dirname}/data/analytics`,
    secret: process.env.ANALYTICS_SECRET,
    hash: process.env.ANALYTICS_HASH
  }
})

app.use(ROUTES)
app.use(GITHUB)
app.use(express.static(`${__dirname}/www`))

const io = new SocketsServer.Server()
io.on('connection', (socket) => SOCKETS(socket, io))

if (process.env.PROD) {
  const fs = require('fs')
  const credentials = {
    key: fs.readFileSync('/etc/letsencrypt/live/netnet.studio/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/netnet.studio/cert.pem', 'utf8'),
    ca: fs.readFileSync('/etc/letsencrypt/live/netnet.studio/chain.pem', 'utf8')
  }

  const httpsServer = https.createServer(credentials, app)
  httpsServer.listen(443, () => console.log('HTTPS listening on port 443'))
  io.attach(httpsServer)
  ANALYTICS.live(httpsServer, io)
} else {
  const httpServer = http.createServer(app)
  httpServer.listen(PORT, () => console.log('listening on 8001'))
  io.attach(httpServer)
  ANALYTICS.live(httpServer, io)
}
