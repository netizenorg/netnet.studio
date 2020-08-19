const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
// const multer = require('multer')
const fs = require('fs')
const utils = require('./utils.js')

router.use(bodyParser.json())

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //
// // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\
// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //   ROUTES

router.get('/netitor.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/netitor/build/netitor.min.js'))
})

router.get('/Maths.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/Maths/Maths.js'))
})

router.get('/Color.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/Color/Color.js'))
})

router.get('/Averigua.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/averigua/Averigua.js'))
})

router.get('/FileUploader.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/FileUploader/FileUploader.js'))
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // REST API [GET]

router.get('/api/widgets', (req, res) => {
  fs.readdir(path.join(__dirname, '../www/widgets'), (err, list) => {
    if (err) return console.log(err)
    else res.json(list)
  })
})

router.get('/api/tutorials', (req, res) => {
  fs.readdir(path.join(__dirname, '../www/tutorials'), (err, list) => {
    if (err) return console.log(err)
    else res.json(list)
  })
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // REST API [POST]

function shortenURL (req, res, dbPath) {
  const urlsDict = require(dbPath)
  const index = Object.keys(urlsDict).length
  const key = (index === 0) ? '0' : utils.b10tob64(index)
  urlsDict[key] = req.body.hash
  fs.writeFile(dbPath, JSON.stringify(urlsDict, null, 2), (err) => {
    if (err) res.status(404).json({ status: 'error', error: err })
    else {
      const url = `http://netnet.studio/?c=${key}`
      res.json({ status: 'success', url })
    }
  })
}

router.post('/api/shorten-url', (req, res) => {
  const dbPath = path.join(__dirname, '../data/shortened-urls.json')
  fs.stat(dbPath, (err, stat) => {
    if (err == null) shortenURL(req, res, dbPath)
    else if (err.code === 'ENOENT') {
      fs.writeFile(dbPath, '{}', (err) => {
        if (err) res.json({ error: err })
        else shortenURL(req, res, dbPath)
      })
    }
  })
})

router.post('/api/expand-url', (req, res) => {
  const dbPath = path.join(__dirname, '../data/shortened-urls.json')
  const urlsDict = require(dbPath)
  const hash = urlsDict[req.body.key]
  if (typeof hash === 'string') {
    res.json({ status: 'success', hash })
  } else {
    res.json({ error: `${req.body.key} is not in the database.` })
  }
})

module.exports = router
