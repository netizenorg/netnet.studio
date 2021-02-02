const axios = require('axios')
const triplesec = require('triplesec')
const { Octokit } = require('@octokit/core')
const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const cookieParser = require('cookie-parser')
// const multer = require('multer')

router.use(cookieParser())
router.use(bodyParser.json({ limit: '10mb' }))

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
// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // [GET]

// ~ * ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ * Auth Token

router.get('/api/github/client-id', (req, res) => {
  res.json({ success: true, message: process.env.GITHUB_CLIENT_ID })
})

router.get('/api/github/auth-status', (req, res) => {
  const token = req.cookies.AuthTok
  if (!token) return res.json({ success: false, message: 'no access token' })
  else return res.json({ success: true, message: 'has access token' })
})

router.get('/api/github/clear-cookie', (req, res) => {
  res.cookie('AuthTok', null, { maxAge: 500, httpOnly: true })
    .json({ message: 'cookie cleared' })
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
          secure: true,
          sameSite: true,
          httpOnly: true
        }).redirect('/')
      }
    })
  }).catch(err => console.log(err))
})

// ~ * ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  Other GETs

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

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\  [POST]

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
        message: 'netnet initialized repo',
        content: data
      })
    }).then(gitRes => {
      if (gitRes.data.content.html_url.includes('/blob/master')) {
        const url = gitRes.data.content.html_url.split('/blob/master')[0]
        const branch = 'master'
        res.json({ success: true, name, url, branch, data: gitRes.data })
      } else {
        const url = gitRes.data.content.html_url.split('/blob/main')[0]
        const branch = 'main'
        res.json({ success: true, name, url, branch, data: gitRes.data })
      }
    }).catch(err => {
      res.json({ success: false, message: 'error creating repo', error: err })
    })
  })
})

router.post('/api/github/save-project', (req, res) => {
  // TODO: will need to update for multi-file projets f/when we get there...
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
      owner, repo
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error opening project', error: err })
    })
  })
})

router.post('/api/github/open-file', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  const path = req.body.filename
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#get-repository-content
    octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner, repo, path
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error opening project', error: err })
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
          source: { branch: req.body.branch },
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
