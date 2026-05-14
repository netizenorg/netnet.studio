const fs = require('fs')

function b10tob64 (num) {
  const order = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
  const base = order.length
  let r
  let str = ''
  while (num) {
    r = num % base
    num -= r
    num /= base
    str = order.charAt(r) + str
  }
  return str
}

function b64tob10 (str) {
  const order = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-'
  const base = order.length
  let r
  let num = 0
  while (str.length) {
    r = order.indexOf(str.charAt(0))
    str = str.substr(1)
    num *= base
    num += r
  }
  return num
}

function checkForJSONFile (req, res, dbPath, callback) {
  fs.stat(dbPath, (err, stat) => {
    if (err == null) callback(req, res, dbPath)
    else if (err.code === 'ENOENT') {
      fs.writeFile(dbPath, '{}', (err) => {
        if (err) res.json({ success: false, error: err })
        else callback(req, res, dbPath)
      })
    }
  })
}

function checkForJSONArrayFile (req, res, dbPath, callback) {
  fs.stat(dbPath, (err, stat) => {
    if (err == null) callback(req, res, dbPath)
    else if (err.code === 'ENOENT') {
      fs.writeFile(dbPath, '[]', (err) => {
        if (err) res.json({ success: false, error: err })
        else callback(req, res, dbPath)
      })
    }
  })
}

const allowedOrigins = [
  'https://netnet.studio',
  'https://dev.netnet.studio',
  'https://v1.netnet.studio',
  'https://v2.netnet.studio',
  'https://v3.netnet.studio',
  'http://localhost:' + process.env.PORT
]

function corsMiddleware (req, res, next) {
  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin)
    res.set('Vary', 'Origin')
  }
  res.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  // NOTE: if we decide to send custom headers/credentials later via frontend
  // res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  // res.set('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
}

module.exports = { b10tob64, b64tob10, checkForJSONFile, checkForJSONArrayFile, corsMiddleware }
