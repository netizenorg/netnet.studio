const axios = require('axios')
const triplesec = require('triplesec')
const { Octokit } = require('@octokit/core')
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const cookieParser = require('cookie-parser')
// const multer = require('multer')
const fs = require('fs')
const exec = require('child_process').exec
const utils = require('./utils.js')

router.use(cookieParser())
router.use(bodyParser.json({ limit: '10mb' }))

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //
// // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\
// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //   ROUTES

const frontEndDependencies = [
  { url: '/netitor.min.js', loc: '../node_modules/netitor/build/netitor.min.js' },
  { url: '/netitor.js', loc: '../node_modules/netitor/build/netitor.js' },
  { url: '/Maths.js', loc: '../node_modules/Maths/Maths.js' },
  { url: '/Color.js', loc: '../node_modules/Color/Color.js' },
  { url: '/Averigua.js', loc: '../node_modules/averigua/Averigua.js' },
  { url: '/FileUploader.js', loc: '../node_modules/FileUploader/FileUploader.js' }
]

frontEndDependencies.forEach(dep => {
  router.get(dep.url, (req, res) => res.sendFile(path.join(__dirname, dep.loc)))
})

router.get('/sketch', (req, res) => {
  res.redirect('/#code/eJyzUXTxdw6JDHBVyCjJzbEDACErBIk=')
})

router.get('/api/videos/:video', (req, res) => {
  const v = req.params.video
  if (!v) res.json({ success: false, error: 'URL is missing video id/name' })
  fs.stat(path.join(__dirname, `../data/videos/${v}`), (err, stat) => {
    if (err === null) res.sendFile(path.join(__dirname, `../data/videos/${v}`))
  })
})

router.get('/api/custom-elements', (req, res) => {
  fs.readdir(path.join(__dirname, '../www/js/custom-elements'), (err, list) => {
    if (err) return console.log(err)
    else res.json(list)
  })
})

module.exports = router
