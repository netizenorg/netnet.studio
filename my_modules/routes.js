const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const exec = require('child_process').exec
const utils = require('./utils.js')
const axios = require('axios')

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //
// // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\
// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //   ROUTES

const frontEndDependencies = [
  { url: '/netitor.min.js', loc: '../www/js/netitor/build/netitor.min.js' },
  { url: '/netitor.js', loc: '../www/js/netitor/build/netitor.js' },
  { url: '/netnet-standard-library.js', loc: '../www/js/netnet-standard-library/build/netnet-standard-library.js' },
  { url: '/nn.min.js', loc: '../www/js/netnet-standard-library/build/nn.min.js' },
  { url: '/examples-index', loc: '../www/data/misc/examples-index.html' }
]

frontEndDependencies.forEach(dep => {
  router.get(dep.url, (req, res) => res.sendFile(path.join(__dirname, dep.loc)))
})

router.get('/sketch', (req, res) => res.redirect('/#sketch'))

router.get('/tutorials/*', (req, res, next) => {
  if (req.headers.host.includes(':1337')) { // for dev server
    const file = `../../netnet.studio/www/${req.originalUrl}`
    res.sendFile(path.join(__dirname, file))
  } else if (req.originalUrl.includes('/list.json')) {
    // if asking for tutorials that don't exist (ex: in local dev)
    const list = path.join(__dirname, '../www/tutorials/list.json')
    const file = fs.readFileSync(list)
    const json = JSON.parse(file)
    const dirs = fs.readdirSync(path.join(__dirname, '../www/tutorials/'))
    for (const sec in json) {
      json[sec] = json[sec].filter(t => dirs.includes(t))
    }
    res.json(json)
  } else next()
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //
// // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\
// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //   REST API

router.get('/api/videos/:video', (req, res) => {
  const v = req.params.video
  if (!v) res.json({ success: false, error: 'URL is missing video id/name' })
  fs.stat(path.join(__dirname, `../data/videos/${v}`), (err, stat) => {
    if (err === null) res.sendFile(path.join(__dirname, `../data/videos/${v}`))
  })
})

router.get('/api/nn-proxy', async (req, res) => {
  let URL = req.query.url
  for (const key in req.query) {
    if (key !== 'url') URL += `&${key}=${req.query[key]}`
  }
  const request = await axios.get(URL)
  res.send(request.data)
})

router.get('/api/proxy', (req, res) => {
  let URL = Object.keys(req.query)[0]
  // accont for redbird proxy bug
  if (URL.includes('http:/')) {
    URL = URL.replace('http:/', 'http://')
  }
  if (URL.includes('http:///')) {
    URL = URL.replace('http:///', 'http://')
  }
  // proxy request
  axios.get(URL)
    .then(r => res.end(r.data))
    .catch(err => console.log(err))
})

router.get('/api/custom-elements', (req, res) => {
  fs.readdir(path.join(__dirname, '../www/js/custom-elements'), (err, list) => {
    if (err) return console.log(err)
    else res.json(list)
  })
})

router.get('/api/face-assets', (req, res) => {
  fs.readdir(path.join(__dirname, '../www/images/faces'), (err, list) => {
    if (err) return console.log(err)
    else res.json(list)
  })
})

router.get('/api/widgets', (req, res) => {
  fs.readdir(path.join(__dirname, '../www/widgets'), (err, list) => {
    if (err) return console.log(err)
    const wigs = []
    list.forEach(filename => {
      const filepath = path.join(__dirname, `../www/widgets/${filename}`)
      const opts = { encoding: 'utf8' }
      const code = fs.readFileSync(filepath, opts)
      if (!code.includes('listed = false')) {
        const data = { filename, title: null, key: null, keywords: [] }
        code.split('\n').forEach(line => {
          if (line.includes('this.title =') && !data.title) {
            data.title = line.split('=')[1].trim()
            data.title = data.title.substr(1, data.title.length - 2)
          }
          if (line.includes('this.key =') && !data.key) {
            data.key = line.split('=')[1].trim()
            data.key = data.key.substr(1, data.key.length - 2)
          }
          if (line.includes('this.keywords =') && !data.keywords) {
            let kw = line.split('=')[1].trim()
            kw = kw.replace(/\[/g, '').replace(/\]/g, '')
            data.keywords = kw.split(',')
              .map(s => s.trim().replace(/'/g, '').replace(/"/g, ''))
          }
        })
        wigs.push(data)
      }
    })
    res.json(wigs)
  })
})

router.get('/api/user-geo', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  exec(`curl http://ip-api.com/json/${ip}`, (err, stdout) => {
    if (err) res.json({ success: false, error: err })
    else res.json({ success: true, data: JSON.parse(stdout) })
  })
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //   URL SHORTENER

function shortenURL (req, res, dbPath) {
  const urlsDict = require(dbPath)
  const index = Object.keys(urlsDict).length
  const key = (index === 0) ? '0' : utils.b10tob64(index)
  let repeatEntry = false
  for (const key in urlsDict) {
    if (urlsDict[key] === req.body.hash) { repeatEntry = key; break }
  }
  if (repeatEntry) {
    const url = `https://netnet.studio/?c=${repeatEntry}`
    res.json({ success: true, url, key: repeatEntry })
  } else {
    urlsDict[key] = req.body.hash
    fs.writeFile(dbPath, JSON.stringify(urlsDict, null, 2), (err) => {
      if (err) res.json({ success: false, error: err })
      else {
        const url = `https://netnet.studio/?c=${key}`
        res.json({ success: true, url, key })
      }
    })
  }
}

router.post('/api/shorten-url', (req, res) => {
  const dbPath = path.join(__dirname, '../data/shortened-urls.json')
  utils.checkForJSONFile(req, res, dbPath, () => {
    shortenURL(req, res, dbPath)
  })
})

router.post('/api/expand-url', (req, res) => {
  const dbPath = path.join(__dirname, '../data/shortened-urls.json')
  const urlsDict = require(dbPath)
  const hash = urlsDict[req.body.key]
  if (typeof hash === 'string') {
    res.json({ success: 'success', hash })
  } else {
    res.json({ error: `${req.body.key} is not in the database.` })
  }
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //  CODE EXAMPLES

function createExamplesDict () {
  const dict = {
    examples: {}, // examples by key
    map: [] // sections in order
  }
  const exPath = path.join(__dirname, '../data/examples')
  const files = fs.readdirSync(exPath)
  files.forEach(file => {
    const obj = JSON.parse(fs.readFileSync(`${exPath}/${file}`))
    dict.examples[obj.key] = obj
  })
  const mapPath = path.join(__dirname, '../data/examples-map.json')
  dict.map = JSON.parse(fs.readFileSync(mapPath))
  return dict
}

router.get('/api/examples', (req, res) => {
  const dict = createExamplesDict()
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET'
  })
  if (typeof dict === 'object' && typeof dict.examples === 'object') {
    res.json({ success: 'success', data: dict.examples, sections: dict.map })
  } else {
    res.json({ error: 'there was an issue loading the database', data: dict })
  }
})

router.post('/api/example-data', (req, res) => {
  const exPath = path.join(__dirname, '../data/examples')
  const files = fs.readdirSync(exPath)
  const file = files.filter(f => f.indexOf(`${req.body.key}--`) === 0)[0]
  const str = fs.readFileSync(`${exPath}/${file}`)
  const obj = JSON.parse(str)
  const name = obj.name
  const hash = obj.code
  const info = obj.info
  if (typeof hash === 'string') {
    res.json({ success: 'success', name, hash, info })
  } else {
    res.json({ error: `${req.body.key} is not in the database.` })
  }
})

// ************************
// BROWSERFEST SUBMISSIONS
// ************************

const multer = require('multer')
const bfimgs = path.join(__dirname, '../data/browserfest-thumbnails')
const uploadImgStorage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, bfimgs) },
  filename: function (req, file, cb) { cb(null, file.originalname) }
})
const uploadImg = multer({ storage: uploadImgStorage }).single('image')

// POST.......

router.post('/api/browserfest/upload-image', async (req, res) => {
  uploadImg(req, res, function (err) {
    if (err) res.json({ success: false, error: err })
    else res.json({ success: 'success', message: `${req.file.filename} uploaded` })
  })
})

router.post('/api/browserfest/submission', (req, res) => {
  const dbPath = path.join(__dirname, '../data/browserfest-submissions.json')
  utils.checkForJSONArrayFile(req, res, dbPath, () => {
    const bfsubs = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    if (bfsubs) {
      bfsubs.push(req.body)
      fs.writeFile(dbPath, JSON.stringify(bfsubs, null, 2), (err) => {
        if (err) res.json({ success: false, error: err })
        else res.json({ success: 'success' })
      })
    } else {
      res.json({ error: 'there was an error with the database.' })
    }
  })
})

// GET ........

router.use(express.static(path.join(__dirname, '../data/browserfest-thumbnails')))

router.get('/api/browserfest/submissions', (req, res) => {
  const dbPath = path.join(__dirname, '../data/browserfest-submissions.json')
  const bfsubs = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  res.set({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET'
  })
  const msg = 'welcome h4x0r! to BrowserFest\'s API, here\'s that R4W data!'
  if (bfsubs) res.json({ success: msg, data: bfsubs })
  else res.json({ error: 'there was an error with the database.' })
})

module.exports = router
