require('dotenv').config()

const express = require('express')
const app = express()
const http = require('http')
const SocketsServer = require('socket.io')
const ANALYTICS = require('stats-not-tracks')
const PLAUSIBLE = require('./my_modules/plausible.js')
const utils = require('./my_modules/utils.js')
const ROUTES = require('./my_modules/routes.js')
const GITHUB = require('./my_modules/github.js')
const SOCKETS = require('./my_modules/sockets.js')
const ERRORS = require('./my_modules/errors.js')
const PORT = process.env.PORT || 8001

const fs = require('fs')
const path = require('path')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
app.use(cookieParser())

/*
  -----------------------
  FILE SIZE UPLOAD LIMITS
  -----------------------
*/
// we need a largest limit for users upload assets (Note: GitHub limit is 100mb)
app.use('/api/github/push', express.json({ limit: '50mb' }))
// templates can include binary assets so we also need a lerger limit here
app.use('/api/github/new-repo-from-template', express.json({ limit: '10mb' }))
// otherwise we ust 256kb as default POST limit
// our /etc/nginx/sites-available/default should also reflect this:
// client_max_body_size 50M;
app.use(express.json({ limit: '256kb' }))

/*
  -----------------------------
  RATE LIMITS (PREVENT DOS/etc)
  -----------------------------
*/
// More specific routes are listed first, broader github catch-all at the bottom
const limiters = [
  ['/api/github/proxy', 60 * 1000, 100],
  ['/api/github/client-id', 15 * 60 * 1000, 10],
  ['/user/signin/callback', 15 * 60 * 1000, 10],
  ['/api/shorten', 60 * 1000, 20],
  ['/api/github', 60 * 1000, 60]
]
const makeLimiter = ({ windowMs, max }) => rateLimit({
  windowMs, max, standardHeaders: true, legacyHeaders: false
})
// request counts are tracked in this server's memory. if we ever run multiple
// server processes at once (ex PM2 cluster mode), each process would keep its
// own separate count (so we'd need to rethink how this works if/when)
limiters.forEach(([route, windowMs, max]) => {
  app.use(route, makeLimiter({ windowMs, max }))
})

// ANALYTICS SETUP
// ---------------
ANALYTICS.setup(app, {
  path: `${__dirname}/data/analytics`,
  admin: {
    route: 'analytics',
    dashboard: `${__dirname}/data/analytics`,
    secret: process.env.ANALYTICS_SECRET,
    hash: process.env.ANALYTICS_HASH
  }
})

// CURTAIN SETUP (PAGE BLOCKER)
// ---------------------------
if (process.env.CURTAIN) {
  app.get('/', (req, res) => {
    const curtain = fs.readFileSync(path.join(__dirname, 'www', 'curtain.html'), 'utf8')
    res.send(curtain.replace('{{MESSAGE}}', process.env.CURTAIN))
  })
}

// SECURITY HEADERS
// ---------------
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains')
  next()
})

// REST OF THE SETUP
// -----------------
app.use('/api', utils.corsMiddleware)
app.use(ROUTES)
app.use(GITHUB)
PLAUSIBLE(app, `${__dirname}/www`)

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
