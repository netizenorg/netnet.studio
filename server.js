require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http')
const SocketsServer = require('socket.io')
const ANALYTICS = require('stats-not-tracks')
const ROUTES = require('./my_modules/routes.js')
const GITHUB = require('./my_modules/github.js')
const SOCKETS = require('./my_modules/sockets.js')
const PORT = process.env.PORT || 8001

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

app.use(ROUTES)
app.use(GITHUB)
app.use(express.static(`${__dirname}/www`))

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
