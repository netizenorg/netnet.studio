const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const path = require('path')
const fs = require('fs')

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

router.get('/api/widgets', (req, res) => {
  fs.readdir(path.join(__dirname, '../www/widgets'), (err, list) => {
    if (err) return console.log(err)
    else res.json(list)
  })
})

module.exports = router
