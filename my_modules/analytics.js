const device = require('device')
const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec

function addToAnalytics (data, filepath) {
  const logs = require('../data/analytics.json')
  logs.push(data)
  fs.writeFile(filepath, JSON.stringify(logs), (err) => {
    if (err) console.log(err)
  })
}

function logData (data) {
  const filepath = path.join(__dirname, '../data/analytics.json')
  fs.stat(filepath, (err, stat) => {
    if (err === null) addToAnalytics(data, filepath)
    else if (err.code === 'ENOENT') {
      fs.writeFile(filepath, '[]', (err) => {
        if (err) return console.log('ANALYTICS ERROR:', err)
        else addToAnalytics(data, filepath)
      })
    } else console.log('ANALYTICS ERROR:', err)
  })
}

module.exports = (req, res, next) => {
  if (req.originalUrl !== '/') return next() // only log reqs to the homepage

  const dev = device(req.headers['user-agent'], { parseUserAgent: true })
  const data = {
    timestamp: Date.now(),
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    url: {
      host: req.headers.host,
      path: req.originalUrl
    },
    device: {
      type: dev.type,
      model: dev.model
    },
    agent: dev.parser.useragent,
    referer: req.headers.referer,
    origin: req.headers.origin,
    langauge: req.headers['accept-language']
  }

  exec(`curl http://ip-api.com/json/${data.ip}`, (err, stdout) => {
    if (err) data.geo = 'curl failed'
    else data.geo = JSON.parse(stdout)
    logData(data)
  })

  next()
}
