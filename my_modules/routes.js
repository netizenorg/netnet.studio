const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const utils = require('./utils.js')
const os = require('os')

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //
// // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\
// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //   ROUTES

const aliasRoutes = [
  { url: '/netitor.min.js', loc: '../www/core/netitor/build/netitor.min.js' },
  { url: '/netitor.js', loc: '../www/core/netitor/build/netitor.js' },
  { url: '/netnet-standard-library.js', loc: '../www/core/netnet-standard-library/build/netnet-standard-library.js' },
  { url: '/nn.min.js', loc: '../www/core/netnet-standard-library/build/nn.min.js' },
  { url: '/images/*', loc: '../www/assets/images/' },
  { url: '/audios/*', loc: '../www/assets/audios/' },
  { url: '/fonts/*', loc: '../www/assets/fonts/' },
  { url: '/videos/*', loc: '../www/assets/videos/' },
  { url: '/snt-css.css', loc: '../data/analytics/snt-css.css' },
  { url: '/css/styles.css', loc: '../www/widgets/learning-guide/data/assets/styles.css' }
  // { url: '/templates/*', loc: '../data/templates/' }
]

const images = fs.readdirSync(path.join(__dirname, '../www/assets/images'))
images.forEach(sub => {
  if (sub === 'cats' || sub === 'gifs' || sub === 'logos' || sub === 'bg' || sub === 'icons') {
    const files = fs.readdirSync(path.join(__dirname, `../www/assets/images/${sub}`))
    files.forEach(f => aliasRoutes.push({ url: `/${f}`, loc: `../www/assets/images/${sub}/${f}` }))
  }
})

const otherAssets = ['videos', 'audios', 'fonts']
otherAssets.forEach(dir => {
  const files = fs.readdirSync(path.join(__dirname, `../www/assets/${dir}`))
  files.forEach(f => aliasRoutes.push({ url: `/${f}`, loc: `../www/assets/${dir}/${f}` }))
})

aliasRoutes.forEach(dep => {
  if (dep.url.includes('*')) { // for routes with wildcards
    router.get(dep.url, (req, res) => { // req.params[0] contains the wildcard path
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.sendFile(req.params[0], { root: path.join(__dirname, dep.loc) }, (err) => {
        if (err) res.status(404).end()
      })
    })
  } else { // for exact routes
    router.get(dep.url, (req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.sendFile(path.join(__dirname, dep.loc))
    })
  }
})

router.get('/sketch', (req, res) => res.redirect('/#sketch'))

router.get('/tutorials/*', (req, res, next) => {
  const host = req.hostname
  // any subdomains (ex dev.netnet) should load tutorials from production server
  if (host.endsWith('.netnet.studio') && !req.originalUrl.endsWith('/list.json')) {
    const root = path.resolve(__dirname, '../../netnet.studio/www/tutorials')
    return res.sendFile(req.params[0], { root }, (err) => {
      if (err) res.status(404).end()
    })
  }
  // NOTE: v2 && v3 have a modified version of this route which returns the old
  // tutorials, stored in ../../netnet.studio-v3/www
  next()
})

// directory listing for /templates/*
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const templateListPage = (rel, upLink, rows) => {
  const arr = rel.split('/').filter(s => s !== '')
  arr.splice(0, 2)
  rel = arr.join('/')
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Contents of ${escapeHtml(rel)}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Arial, sans-serif; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 1rem; }
      li { padding: .25rem 0; }
      a { text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    ${arr.length > 1 ? upLink : ''}
    <h1><span style="opacity: 0.5">Contents of:</span> ${escapeHtml(rel)}</h1>
    <ul>${rows}</ul>
  </body>
</html>`
}

router.get('/templates/*', (req, res) => {
  const baseDir = path.join(__dirname, '../data/templates')
  const rel = req.params[0] || ''
  const requestedPath = path.normalize(path.join(baseDir, rel))
  // prevent path traversal outside of baseDir
  if (!requestedPath.startsWith(baseDir)) {
    return res.status(400).send('Invalid path')
  }
  fs.stat(requestedPath, (err, stats) => {
    if (err) return res.status(404).send('Not found')
    if (stats.isDirectory()) {
      const indexPath = path.join(requestedPath, 'index.html')
      fs.access(indexPath, fs.constants.F_OK, (indexErr) => {
        if (!indexErr) return res.sendFile(indexPath)
        // no index.html → list directory
        fs.readdir(requestedPath, { withFileTypes: true }, (readErr, entries) => {
          if (readErr) return res.status(500).send('Error reading directory')
          // build breadcrumb path for links
          const prefix = `/templates/${rel ? rel.replace(/\/+$/, '') + '/' : ''}`
          const rows = entries
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(d => {
              const href = prefix + encodeURIComponent(d.name) + (d.isDirectory() ? '/' : '')
              const label = d.name + (d.isDirectory() ? '/' : '')
              return `<li><a href="${href}">${label}</a></li>`
            })
            .join('')
          const upLink = rel
            ? (() => {
              const parent = rel.replace(/\/+$/, '').split('/').slice(0, -1).join('/')
              const href = '/templates/' + (parent ? encodeURI(parent) + '/' : '')
              return `<p><a href="${href}" style="font-style: italic;">../ back up to parent directory</a></p>`
            })()
            : ''
          const html = templateListPage(rel, upLink, rows)
          res.set('Content-Type', 'text/html; charset=utf-8')
          res.send(html)
        })
      })
    } else { // it's a file → serve it directly
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.sendFile(requestedPath)
    }
  })
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

function getSubdirectories (directory, depth = 0) {
  if (depth >= 2) return Promise.resolve([])
  return readdir(directory)
    .then(files => {
      const directoriesInfo = []

      const promises = files.map(file => {
        const filePath = path.join(directory, file)
        return stat(filePath).then(stats => {
          if (stats.isDirectory()) {
            const css = path.join(directory, `${file}/styles.css`)
            const dirInfo = { path: file, css: fs.existsSync(css) }
            directoriesInfo.push(dirInfo)

            return getSubdirectories(filePath, depth + 1).then(subdirs => {
              directoriesInfo.push(...subdirs.map(subdir => {
                return {
                  path: path.join(file, subdir.path),
                  css: subdir.css
                }
              }))
            })
          }
        })
      })
      return Promise.all(promises).then(() => directoriesInfo)
    })
    .catch(error => { console.error(error); return [] })
}

router.get('/api/custom-elements', async (req, res) => {
  try {
    const directory = path.join(__dirname, '../www/custom-elements')
    const directoriesInfo = await getSubdirectories(directory)
    const separator = os.platform() === 'win32' ? '\\' : '/'
    const filteredDirectoriesInfo = directoriesInfo
      .filter(dirInfo => dirInfo.path.includes(separator))
      .map(dirInfo => {
        dirInfo.path = dirInfo.path.replace(/\\/g, '/')
        return dirInfo
      })
    res.json(filteredDirectoriesInfo)
  } catch (error) { console.error(error); res.json([]) }
})

router.get('/api/face-assets', (req, res) => {
  fs.readdir(path.join(__dirname, '../www/assets/images/faces'), (err, list) => {
    if (err) return console.log(err)
    else res.json(list)
  })
})

router.get('/api/widgets', (req, res) => {
  fs.readdir(path.join(__dirname, '../www/widgets'), (err, list) => {
    if (err) return console.log(err)
    const wigs = []
    list.filter(f => f !== 'index.js' && f !== 'styles.css').forEach(dirname => {
      const filepath = path.join(__dirname, `../www/widgets/${dirname}/index.js`)
      const opts = { encoding: 'utf8' }
      const code = fs.readFileSync(filepath, opts)
      if (!code.includes('listed = false')) {
        const data = { title: null, key: null, keywords: [] }
        code.split('\n').forEach(line => {
          if (line.includes('this.title =') && !data.title) {
            line = line.replace(/<[^>]+>/g, '')
            data.title = line.split('=')[1].trim()
            data.title = data.title.substr(1, data.title.length - 2)
          }
          if (line.includes('this.key =') && !data.key) {
            data.key = line.split('=')[1].trim()
            data.key = data.key.substr(1, data.key.length - 2)
          }
          if (line.includes('this.keywords =') && data.keywords.length === 0) {
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

router.get('/api/convos', (req, res) => {
  fs.readdir(path.join(__dirname, '../www/widgets'), (err, list) => {
    if (err) return console.log(err)
    const wigs = []
    list.filter(f => f !== 'index.js' && f !== 'styles.css').forEach(dirname => {
      const filepath = path.join(__dirname, `../www/widgets/${dirname}/index.js`)
      const convpath = path.join(__dirname, `../www/widgets/${dirname}/convo.js`)
      const opts = { encoding: 'utf8' }
      const code = fs.readFileSync(filepath, opts)
      if (fs.existsSync(convpath)) {
        const convo = fs.readFileSync(convpath, opts)
        const data = { title: null, key: null, code: convo }
        code.split('\n').forEach(line => {
          if (line.includes('this.title =') && !data.title) {
            line = line.replace(/<[^>]+>/g, '')
            data.title = line.split('=')[1].trim()
            data.title = data.title.substr(1, data.title.length - 2)
          }
          if (line.includes('this.key =') && !data.key) {
            data.key = line.split('=')[1].trim()
            data.key = data.key.substr(1, data.key.length - 2)
          }
        })
        if (data.key !== 'example-widget') wigs.push(data)
      }
    })
    res.json(wigs)
  })
})

router.get('/api/user-geo', async (req, res) => {
  const raw = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  const ip = raw ? raw.split(',')[0].trim() : ''
  const validIP = /^([0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]+$/.test(ip)
  if (!validIP) return res.json({ success: false, error: 'invalid IP' })
  try {
    const r = await fetch(`http://ip-api.com/json/${ip}`)
    const data = await r.json()
    res.json({ success: true, data })
  } catch (err) {
    res.json({ success: false, error: err.message })
  }
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //   URL SHORTENER

function shortenURL (req, res, dbPath) {
  let urlsDict
  try {
    urlsDict = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  } catch (err) {
    return res.json({ success: false, error: 'failed to read URL database' })
  }
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
  let urlsDict
  try {
    urlsDict = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
  } catch (err) {
    return res.json({ error: 'failed to read URL database' })
  }
  const hash = urlsDict[req.body.key]
  if (typeof hash === 'string') {
    res.json({ success: 'success', hash })
  } else {
    res.json({ error: `${req.body.key} is not in the database.` })
  }
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //  CODE EXAMPLES

router.get('/api/demo/:num', (req, res) => {
  const num = req.params.num
  const exPath = path.join(__dirname, '../data/demos')
  const files = fs.readdirSync(exPath)
  const file = files.filter(f => f.indexOf(`${num}--`) === 0)[0]
  const str = fs.readFileSync(`${exPath}/${file}`)
  const obj = JSON.parse(str)
  obj.success = 'success'
  if (typeof obj.code === 'string') res.json(obj)
  else res.json({ error: `demo ${num} is not in the database.` })
})

router.get('/api/demos', (req, res) => {
  const dict = {}
  const exPath = path.join(__dirname, '../data/demos')
  const files = fs.readdirSync(exPath).filter(f => f !== '.DS_Store')
  files.forEach(file => {
    const d = JSON.parse(fs.readFileSync(`${exPath}/${file}`))
    if (d.hide !== true) {
      dict[d.key] = {
        key: d.key, name: d.name, tags: d.tags, info: d.info instanceof Array
      }
    }
  })
  res.json({ success: 'success', data: dict })
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //  PROJ TEMPLATES

async function listFilesRecursive (dir, root = dir) {
  const out = []
  const entries = await fs.promises.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    if (e.name === '.DS_Store') continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      out.push(...await listFilesRecursive(full, root))
    } else if (e.isFile()) {
      // make it relative to `root` and normalize to forward slashes
      const rel = path.relative(root, full).replace(/\\/g, '/')
      out.push(rel)
    }
  }
  return out
}

router.get('/api/templates', async (req, res) => {
  try {
    const base = path.join(__dirname, '../data/templates')
    let order = []
    let buildOn = {}
    try {
      const text = await fs.promises.readFile(path.join(base, 'list.json'), 'utf8')
      const dict = JSON.parse(text)
      order = Array.isArray(dict.published) ? dict.published : []
      buildOn = dict['build-on'] || {}
    } catch (err) {
      console.log('Failed to find template list.json')
    }

    const list = {}
    for (const name of order) {
      try {
        const file = path.join(base, name, 'data.json')
        const text = await fs.promises.readFile(file, 'utf8')
        const json = JSON.parse(text)
        const filesDir = path.join(base, name, 'files')
        const files = await listFilesRecursive(filesDir)
        list[name] = { title: json.title, description: json.description, files }
      } catch (err) { console.error('TEMPLATE ERROR', err) }
    }

    res.json({ success: true, data: { list, buildOn } })
  } catch (err) {
    console.error('Failed to list templates:', err)
    res.status(500).json({ success: false, error: 'Failed to load template' })
  }
})

router.get('/api/template/:template', async (req, res) => {
  const name = req.params.template
  if (!/^[a-z0-9-]+$/i.test(name)) return res.status(400).json({ success: false, error: 'invalid template name' })
  try {
    const base = path.join(__dirname, '../data/templates', name)
    const text = await fs.promises.readFile(path.join(base, 'data.json'), 'utf8')
    const data = JSON.parse(text)
    const filesDir = path.join(base, 'files')
    let files = []
    try {
      files = await listFilesRecursive(filesDir)
    } catch (e) { /* folders missing "files" fail silently */ }

    data.files = files
    res.json({ success: true, data })
  } catch (err) {
    console.error('Failed to load template:', err)
    res.status(500).json({ success: false, error: 'Failed to load templates' })
  }
})

module.exports = router
