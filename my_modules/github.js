const axios = require('axios')
const triplesec = require('triplesec')
const { Octokit } = require('@octokit/core')
const express = require('express')
const router = express.Router()

// Helper function for decrypting token
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

// Helper function to recursively fetch files.
// It starts at the given path (empty string means repository root),
// and returns an object mapping file paths to their content data.
async function fetchFiles (octokit, owner, repo, path) {
  const result = {}
  // Request the contents of the current path.
  const response = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner, repo, path: path || '' // if path is empty, use the repo root
  })
  const data = response.data

  // If data is an array, it represents a directory listing.
  if (Array.isArray(data)) {
    // Process each item (file or directory) in the listing.
    // For simplicity, process items sequentially.
    for (const item of data) {
      if (item.type === 'file') {
        // Retrieve the file content.
        const fileResponse = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner, repo, path: item.path
        })
        // Save the file data using its path as the key.
        result[item.path] = fileResponse.data
      } else if (item.type === 'dir') {
        // Recursively fetch files inside subdirectories.
        const nestedFiles = await fetchFiles(octokit, owner, repo, item.path)
        Object.assign(result, nestedFiles)
      }
    }
  } else if (data.type === 'file') {
    // If the initial call returns a single file rather than a directory,
    // add it directly.
    result[data.path] = data
  }

  return result
}

// ~ * ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ * Auth Token
// ~ * ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *

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

//
// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\  [POST]
// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\  [POST]
// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\  [POST]
//

// ~ * ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ * get files
// ~ * ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *

const dict = {
  // https://docs.github.com/en/rest/reference/users
  'get-username': 'GET /user',
  // https://docs.github.com/en/rest/reference/repos#list-repositories-for-the-authenticated-user
  'saved-projects': 'GET /user/repos',
  // https://docs.github.com/en/rest/reference/repos#get-repository-content
  'open-project': 'GET /repos/{owner}/{repo}/contents/{path}',
  'open-file': 'GET /repos/{owner}/{repo}/contents/{path}',
  // https://docs.github.com/en/rest/reference/repos#list-commits
  'get-commits': 'GET /repos/{owner}/{repo}/commits'
}

function makeRequest (req, res, query, obj) {
  decryptToken(req, res, (octokit) => {
    octokit.request(dict[query], obj).then(gitRes => {
      res.json({ success: true, message: `${query} success`, data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: `${query} error`, error: err })
    })
  })
}

router.get('/api/github/username', (req, res) => {
  makeRequest(req, res, 'get-username', {})
})

router.get('/api/github/saved-projects', (req, res) => {
  // 100 is the max... TODO: we'll have to paginate for larger lists
  const obj = { type: 'owner', sort: 'created', per_page: 100 }
  makeRequest(req, res, 'saved-projects', obj)
})

router.post('/api/github/open-project', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  makeRequest(req, res, 'open-project', { owner, repo })
})

router.post('/api/github/open-file', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  const path = req.body.filename
  makeRequest(req, res, 'open-file', { owner, repo, path })
})

router.post('/api/github/get-commits', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  makeRequest(req, res, 'get-commits', { owner, repo })
})

router.post('/api/github/open-all-files', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  decryptToken(req, res, async octokit => {
    try { // Start at the repo root by passing an empty string.
      const files = await fetchFiles(octokit, owner, repo, '')
      res.json({ success: true, message: 'open-all-files success', data: files })
    } catch (error) {
      res.json({ success: false, message: 'open-all-files error', error })
    }
  })
})

module.exports = router
