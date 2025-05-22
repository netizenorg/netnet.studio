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

// ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ proxy for raw.githubusercontent.com
// ~ .  used when viewing someone's github project (rather than opening ur own)

function reWriteCSSPaths (req, data) { // HACK!!!
  // b/c all requests for JS files (via <script>) && CSS files (via <link>)
  // are routed through the proxy below (in order to get around the issue
  // linked below) any CSS url(...) w/realtive paths assume the root path is
  // /api/github/ (ie. the proxy server's path) && so it won't find any of the
  // linked assets. in order to get around this, here we reconstruct relative
  // paths w/in a stylesheet so that they become absolute paths to the assett.
  // ...this is a huge HACK, it works fine for now, but may cause issues
  // if/when we decide to support multi-file editing in netnet.
  let str = data.toString()
  // HACK: redird converst '//' into '/' ...so we need to undo that >_<
  const url = req.query.url.replace('https:/raw', 'https://raw')
  const arr = url.split('/')
  const path = arr.slice(0, arr.length - 1).join('/')
  const urlMatches = str.match(/\burl\(([^()]*)\)/g) || []
  urlMatches.forEach(m => { // all url(...) matches in stylesheet
    const n = (m.includes('"') || m.includes("'")) ? 5 : 4
    const s = m.substring(n, m.length)
    const r = m.replace(s, `${path}/${s}`)
    if (s.indexOf('http') !== 0) str = str.replace(m, r)
  })
  return str
}

router.get('/api/github/proxy', (req, res) => {
  // HACK: on the live version, the redbird proxy screws w/this proxy
  // && removes one of the slashes after the protocol https://
  // ...this fixes the redbird screw up
  const url = req.query.url.replace('https:/raw', 'https://raw')
  // HACK: the purpose of this proxy to get around this issue:
  // https://stackoverflow.com/questions/40728554/resource-blocked-due-to-mime-type-mismatch-x-content-type-options-nosniff/41309463#41309463
  axios.get(url, { responseType: 'arraybuffer' })
    .then(r => {
      if (req.query.url.includes('.css')) {
        res.end(reWriteCSSPaths(req, r.data))
      } else res.end(r.data)
    })
    .catch(err => console.log(err))
})

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

router.post('/api/github/open-project', (req, res) => { // NOTE: might not need anymore
  const owner = req.body.owner
  const repo = req.body.repo
  makeRequest(req, res, 'open-project', { owner, repo })
})

router.post('/api/github/open-file', (req, res) => { // NOTE: might not need anymore
  const owner = req.body.owner
  const repo = req.body.repo
  const path = req.body.filename
  makeRequest(req, res, 'open-file', { owner, repo, path })
})

router.post('/api/github/get-commits', (req, res) => { // NOTE: might not need anymore
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

// POST UPDATES
router.post('/api/github/push', (req, res) => {
  const { owner, repo, branch = 'main', commitMessage, changes } = req.body
  if (!owner || !repo || !commitMessage || !Array.isArray(changes)) {
    return res.json({ success: false, message: 'Missing required data' })
  }

  decryptToken(req, res, async octokit => {
    try {
      // 1. Get the latest commit SHA on the branch
      const refResponse = await octokit.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
        owner, repo, ref: `heads/${branch}`
      })
      const latestCommitSha = refResponse.data.object.sha

      // 2. Get the base commit tree SHA
      const baseCommitResponse = await octokit.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
        owner, repo, commit_sha: latestCommitSha
      })
      const baseTreeSha = baseCommitResponse.data.tree.sha

      // 3. Retrieve the full base tree recursively
      const baseTreeResponse = await octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
        owner, repo, tree_sha: baseTreeSha, recursive: '1'
      })
      const baseTree = baseTreeResponse.data.tree

      // 4. Build a map of the base tree keyed by file path
      const treeMap = {}
      baseTree.forEach(item => { treeMap[item.path] = item })

      // 5. Process the changes from the payload
      // For "delete", remove the file; for "create" or "update", add/update the file content
      for (const change of changes) {
        if (change.action === 'delete') {
          // tell GitHub to delete this path by setting its sha to null
          const existing = treeMap[change.path] || {}
          treeMap[change.path] = {
            path: change.path, mode: existing.mode || '100644', type: existing.type || 'blob', sha: null
          }
        } else if (change.action === 'update' || change.action === 'create') {
          if (change.isBinary) {
            // Create a blob for binary content using Base64 encoding
            const blobResponse = await octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
              owner, repo, content: change.content, encoding: 'base64'
            })
            treeMap[change.path] = {
              path: change.path, mode: '100644', type: 'blob', sha: blobResponse.data.sha
            }
          } else {
            // For text files, include the content inline
            treeMap[change.path] = {
              path: change.path, mode: '100644', type: 'blob', content: change.content
            }
          }
        }
      }

      // 6. Convert the map back into an array for creating the new tree
      const newTreeItems = Object.values(treeMap).map(item => {
        if (item.content !== undefined) {
          return {
            path: item.path, mode: item.mode, type: item.type, content: item.content
          }
        }
        return {
          path: item.path, mode: item.mode, type: item.type, sha: item.sha
        }
      })

      // 7. Create the new tree with the updated items
      const treeResponse = await octokit.request('POST /repos/{owner}/{repo}/git/trees', {
        owner, repo, tree: newTreeItems, base_tree: baseTreeSha
      })
      const newTreeSha = treeResponse.data.sha

      // 8. Create a new commit referencing the new tree and the previous commit as parent
      const commitResponse = await octokit.request('POST /repos/{owner}/{repo}/git/commits', {
        owner, repo, message: commitMessage, tree: newTreeSha, parents: [latestCommitSha]
      })
      const newCommitSha = commitResponse.data.sha

      // 9. Update the branch reference to point to the new commit
      await octokit.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
        owner, repo, ref: `heads/${branch}`, sha: newCommitSha
      })

      res.json({ success: true, message: 'Commit pushed successfully', commitSha: newCommitSha })
    } catch (error) {
      res.json({ success: false, message: 'Push failed', error })
    }
  })
})

module.exports = router
