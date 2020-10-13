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

router.get('/netitor.min.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/netitor/build/netitor.min.js'))
})

router.get('/netitor.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../node_modules/netitor/build/netitor.js'))
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

router.get('/tutorials/:lesson', (req, res) => {
  res.redirect('/?tutorial=' + req.params.lesson)
})

router.get('/api/videos/:video', (req, res) => {
  const v = req.params.video
  if (!v) res.json({ success: false, error: 'URL is missing video id/name' })
  fs.stat(path.join(__dirname, `../data/videos/${v}`), (err, stat) => {
    if (err === null) res.sendFile(path.join(__dirname, `../data/videos/${v}`))
  })
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

router.get('/api/user-geo', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  exec(`curl http://ip-api.com/json/${ip}`, (err, stdout) => {
    if (err) res.json({ success: false, error: err })
    else res.json({ success: true, data: JSON.parse(stdout) })
  })
})

router.get('/api/data/:type', (req, res) => {
  if (req.params.type === 'aframe') {
    const aframe = require('../data/a-frame-edu-data.json')
    res.json(aframe)
  } else {
    res.status(404).json({ error: `there is no ${req.params.type} data` })
  }
})

router.get('/api/clear-cookie', (req, res) => {
  res.cookie('AuthTok', null, { maxAge: 500, httpOnly: true })
    .json({ message: 'cookie cleared' })
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // REST API [POST]

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
    res.json({ success: true, url })
  } else {
    urlsDict[key] = req.body.hash
    fs.writeFile(dbPath, JSON.stringify(urlsDict, null, 2), (err) => {
      if (err) res.json({ success: false, error: err })
      else {
        const url = `https://netnet.studio/?c=${key}`
        res.json({ success: true, url })
      }
    })
  }
}

router.post('/api/shorten-url', (req, res) => {
  const dbPath = path.join(__dirname, '../data/shortened-urls.json')
  fs.stat(dbPath, (err, stat) => {
    if (err == null) shortenURL(req, res, dbPath)
    else if (err.code === 'ENOENT') {
      fs.writeFile(dbPath, '{}', (err) => {
        if (err) res.json({ success: false, error: err })
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
    res.json({ success: 'success', hash })
  } else {
    res.json({ error: `${req.body.key} is not in the database.` })
  }
})

router.post('/api/bug-report', (req, res) => {
  const time = Date.now()
  const dir = path.join(__dirname, '../data/bug-reports')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
  const file = `${dir}/${time}.json`
  fs.writeFile(file, JSON.stringify(req.body, null, 2), (err) => {
    if (err) res.json({ success: false, error: err })
    else res.json({ success: true })
  })
})

router.post('/api/feedback-report', (req, res) => {
  const time = Date.now()
  const dir = path.join(__dirname, '../data/feedback-reports')
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)
  const file = `${dir}/${time}.json`
  fs.writeFile(file, JSON.stringify(req.body, null, 2), (err) => {
    if (err) res.json({ success: false, error: err })
    else res.json({ success: true })
  })
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //
// // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\
// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ //   GITHUB

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // [GET]

function decryptToken (req, res, cb) {
  const token = req.cookies.AuthTok
  if (!token) return res.json({ success: false, message: 'no access token' })
  triplesec.decrypt({
    data: triplesec.Buffer.from(token, 'hex'),
    key: triplesec.Buffer.from(process.env.TOKEN_PASSWORD)
  }, (err, buff) => {
    if (err) return res.json(err)
    else {
      const auth = buff.toString()
      const atok = auth.split('&scope')[0].split('=')[1]
      const octokit = new Octokit({ auth: atok })
      cb(octokit)
    }
  })
}

router.get('/api/github/auth-status', (req, res) => {
  const token = req.cookies.AuthTok
  if (!token) return res.json({ success: false, message: 'no access token' })
  else return res.json({ success: true, message: 'has access token' })
})

router.get('/api/github/username', (req, res) => {
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/users
    octokit.request('GET /user').then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error getting user', error: err })
    })
  })
})

router.get('/api/github/saved-projects', (req, res) => {
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#list-repositories-for-the-authenticated-user
    octokit.request('GET /user/repos', {
      type: 'owner',
      sort: 'created',
      per_page: 100 // max... TODO: we'll have to paginate for larger
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error getting repos', error: err })
    })
  })
})

router.get('/user/signin/callback', (req, res) => {
  // assuming user was redirected here from GitHub Auth Page...
  const code = `code=${req.query.code}` // ...we should have a user ?code=...
  const root = 'https://github.com/login/oauth/access_token'
  const id = `client_id=${process.env.GITHUB_CLIENT_ID}`
  const sec = `client_secret=${process.env.GITHUB_CLIENT_SECRET}`
  axios.post(`${root}?${id}&${sec}&${code}`, { // ask GitHub for Auth Token
    method: 'post',
    headers: { Accept: 'application/json' }
  }).then(response => {
    const token = response.data
    const ermsg = '◕ ︵ ◕ oh no! looks like something went wrong with GitHub'
    if (token.indexOf('error') === 0) return res.send(ermsg)
    // ...assuming we don't get an error back, let's encrypt the token
    triplesec.encrypt({
      data: triplesec.Buffer.from(token),
      key: triplesec.Buffer.from(process.env.TOKEN_PASSWORD)
    }, (err, buff) => {
      if (err) return res.json(err)
      else { // ...now let's create cookie w/encrypted token
        const oneYear = 365 * 24 * 60 * 60 * 1000
        res.cookie('AuthTok', buff.toString('hex'), {
          maxAge: oneYear,
          httpOnly: true
        }).redirect('/')
      }
    })
  }).catch(err => console.log(err))
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // [POST]

router.post('/api/github/new-repo', (req, res) => {
  const name = req.body.name
  const data = req.body.data
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#create-a-repository-for-the-authenticated-user
    octokit.request('POST /user/repos', {
      name: name,
      description: '◕ ◞ ◕ This project was made using https://netnet.studio',
      auto_init: true
    }).then(gitRes => {
      // console.log('created repo >>', gitRes.data.name)
      // https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
      return octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: gitRes.data.owner.login,
        repo: name,
        path: 'index.html',
        message: 'created the index.html page',
        content: data
      })
    }).then(gitRes => {
      const url = gitRes.data.content.html_url.split('/blob/master')[0]
      res.json({ success: true, name, url, data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error creating repo', error: err })
    })
  })
})

router.post('/api/github/save-project', (req, res) => {
  // TODO: will need to update for multi-file projets when we get there...
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
    octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: req.body.owner,
      repo: req.body.repo,
      path: 'index.html',
      sha: req.body.sha,
      message: req.body.message,
      content: req.body.code
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error saving index.html', error: err })
    })
  })
})

router.post('/api/github/open-project', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#get-repository-content
    octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner, repo, path: 'index.html'
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error opening project', error: err })
    })
  })
})

router.post('/api/github/get-files', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#get-repository-content
    octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner, repo
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error getting files', error: err })
    })
  })
})

router.post('/api/github/upload-file', (req, res) => {
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
    octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: req.body.owner,
      repo: req.body.repo,
      path: req.body.name,
      message: `created ${req.body.name}`,
      content: req.body.code
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error uploading file', error: err })
    })
  })
})

router.post('/api/github/delete-file', (req, res) => {
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#delete-a-file
    octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
      owner: req.body.owner,
      repo: req.body.repo,
      path: req.body.name,
      sha: req.body.sha,
      message: `removed ${req.body.name}`
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error deleting file', error: err })
    })
  })
})

router.post('/api/github/get-commits', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#list-commits
    octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner, repo
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error getting files', error: err })
    })
  })
})

router.post('/api/github/gh-pages', (req, res) => {
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#get-a-repository
    octokit.request('GET /repos/{owner}/{repo}', {
      owner: req.body.owner,
      repo: req.body.repo
    }).then(gitRes => {
      if (gitRes.data.has_pages) {
        // https://docs.github.com/en/rest/reference/repos#get-a-github-pages-site
        return octokit.request('GET /repos/{owner}/{repo}/pages', {
          owner: req.body.owner,
          repo: req.body.repo
        })
      } else {
        // https://docs.github.com/en/rest/reference/repos#create-a-github-pages-site
        return octokit.request('POST /repos/{owner}/{repo}/pages', {
          owner: req.body.owner,
          repo: req.body.repo,
          source: { branch: 'main' },
          mediaType: { previews: ['switcheroo'] }
        })
      }
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error updating ghpages', error: err })
    })
  })
})

module.exports = router
