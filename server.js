require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http')
const SocketsServer = require('socket.io')
const ANALYTICS = require('stats-not-tracks')
const utils = require('./my_modules/utils.js')
const ROUTES = require('./my_modules/routes.js')
const GITHUB = require('./my_modules/github.js')
const SOCKETS = require('./my_modules/sockets.js')
const ERRORS = require('./my_modules/errors.js')
const PORT = process.env.PORT || 8001

const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json({ limit: '50mb' })) // GitHub's limit is 100mb
// our /etc/nginx/sites-available/default should also reflect this:
// client_max_body_size 50M;

ANALYTICS.setup(app, {
  path: `${__dirname}/data/analytics`,
  admin: {
    route: 'analytics',
    dashboard: `${__dirname}/data/analytics`,
    secret: process.env.ANALYTICS_SECRET,
    hash: process.env.ANALYTICS_HASH
  }
})

if (process.env.CURTAIN) {
  app.get('/', (req, res) => {
    const curtain = fs.readFileSync(path.join(__dirname, 'www', 'curtain.html'), 'utf8')
    res.send(curtain.replace('{{MESSAGE}}', process.env.CURTAIN))
  })
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains')
  next()
})

app.use('/api', utils.corsGate)
app.use(ROUTES)
app.use(GITHUB)
const staticCORS = (res) => res.setHeader('Access-Control-Allow-Origin', '*')
app.use(express.static(`${__dirname}/www`, { setHeaders: staticCORS }))
app.use('/docs', express.static(`${__dirname}/docs`, { setHeaders: staticCORS }))
app.use(ERRORS.notFound)
app.use(ERRORS.errorHandler)

const io = new SocketsServer.Server()
io.on('connection', (socket) => SOCKETS(socket, io))

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
