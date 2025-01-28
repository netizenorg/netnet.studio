require('dotenv').config()

const path = require('path')
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

const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json({ limit: '50mb' })) // GitHub's limit is 100mb

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
app.use('/docs', express.static(path.join(__dirname, 'docs')))

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
  const msg = `
  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
/                                    '.
| hi there! the local server is up and |
| running, open a browser and visit:   |
| http://localhost:${PORT}                |
\` _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _  ,/
                                  .'\`
                           ( ◕ ◞ ◕ )つ
`
  httpServer.listen(PORT, () => console.log(msg))
  io.attach(httpServer)
  ANALYTICS.live(httpServer, io)
}
