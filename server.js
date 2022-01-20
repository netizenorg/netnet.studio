require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http')
const https = require('https')
// const http = require('http').createServer(app)
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
    secret: process.env.ANALYTICS_SECRET,
    hash: process.env.ANALYTICS_HASH
  }
})

app.use(express.static(`${__dirname}/www`))
app.use(ROUTES)
app.use(GITHUB)

const io = new SocketsServer.Server()
io.on('connection', (socket) => SOCKETS(socket, io))

// http.listen(port, () => console.log(`listening on: ${port}`))

if (process.env.PROD) {
  // const proxy = require('redbird')({
  //   port: 80,
  //   // xfwd: false,
  //   letsencrypt: { path: 'certs', port: 3000 },
  //   ssl: { port: 443 }
  // })
  // const config = {
  //   ssl: { letsencrypt: { email: 'hi@netizen.org', production: true } }
  // }
  // proxy.register('68.183.115.149', 'http://localhost:8001', config)
  // proxy.register('netnet.studio', 'http://localhost:8001', config)
  // proxy.register('www.netnet.studio', 'http://localhost:8001', config)
  const fs = require('fs')
  const credentials = {
    key: fs.readFileSync(`${__dirname}certs/netnet.studio/privkey.pem`, 'utf8'),
    cert: fs.readFileSync(`${__dirname}certs/netnet.studio/cert.pem`, 'utf8'),
    ca: fs.readFileSync(`${__dirname}certs/netnet.studio/chain.pem`, 'utf8')
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
