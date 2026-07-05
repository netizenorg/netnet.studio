const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

// pre-compute token once at startup so each request is just a string compare
const curtainToken = process.env.CURTAIN_PASSWORD
  ? crypto.createHash('sha256').update(process.env.CURTAIN_PASSWORD).digest('hex')
  : null

if (curtainToken) {
  router.post('/api/curtain-login', (req, res) => {
    if (req.body?.password === process.env.CURTAIN_PASSWORD) {
      res.cookie('curtain_access', curtainToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      res.json({ success: true })
    } else {
      res.status(401).json({ success: false })
    }
  })
}

router.get('/', (req, res, next) => {
  // login mode: valid cookie → pass through to the real app
  if (curtainToken && req.cookies.curtain_access === curtainToken) return next()
  const mode = curtainToken ? 'login' : 'block'
  const curtain = fs.readFileSync(path.join(__dirname, '../www/curtain.html'), 'utf8')
  res.send(curtain
    .replace('{{MESSAGE}}', process.env.CURTAIN)
    .replace('{{MODE}}', mode)
  )
})

module.exports = router
