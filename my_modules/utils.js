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

module.exports = { b10tob64, b64tob10, checkForJSONFile, checkForJSONArrayFile }
