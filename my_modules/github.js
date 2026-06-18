const crypto = require('crypto')
const express = require('express')
const router = express.Router()

// Fail hard at startup if required env vars are missing.
// Better to crash immediately than to run with a broken/insecure configuration.
if (!process.env.TOKEN_PASSWORD) throw new Error('Missing required env var: TOKEN_PASSWORD')
if (!process.env.GITHUB_CLIENT_ID) throw new Error('Missing required env var: GITHUB_CLIENT_ID')
if (!process.env.GITHUB_CLIENT_SECRET) throw new Error('Missing required env var: GITHUB_CLIENT_SECRET')

// Derive a 32-byte AES key from TOKEN_PASSWORD at startup.
// SHA-256 is appropriate here because TOKEN_PASSWORD is a server-managed
// secret (not a user-supplied password), so a dedicated KDF like scrypt
// isn't necessary.
const _aesKey = crypto.createHash('sha256').update(process.env.TOKEN_PASSWORD).digest()

function _aesEncrypt (plaintext) {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', _aesKey, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  // format: iv:authTag:ciphertext (all hex, colon-separated)
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

function _aesDecrypt (cookieVal) {
  const parts = cookieVal.split(':')
  if (parts.length !== 3) throw new Error('invalid token format')
  const [ivHex, authTagHex, encHex] = parts
  const decipher = crypto.createDecipheriv('aes-256-gcm', _aesKey, Buffer.from(ivHex, 'hex'))
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))
  return Buffer.concat([
    decipher.update(Buffer.from(encHex, 'hex')),
    decipher.final()
  ]).toString('utf8')
}

// NOTE: this ghRequest helper function created by Claude in order to replace
// the old gh/core module (and it's corresponding vulnerabilities)
function ghRequest (atok, endpoint, params) {
  // Parses 'METHOD /path/{template}' endpoint strings, substitutes {params} into
  // the URL path (preserving slashes within values so multi-segment paths like
  // 'src/js/app.js' and refs like 'heads/main' are not double-encoded), puts
  // remaining params in the query string (GET) or JSON body (other methods),
  // and adds the required auth + versioning headers. Octokit-specific keys
  // (mediaType) are stripped from POST bodies.
  const spaceIdx = endpoint.indexOf(' ')
  const method = endpoint.slice(0, spaceIdx)
  const template = endpoint.slice(spaceIdx + 1)

  const used = new Set()
  const urlPath = template.replace(/\{(\w+)\}/g, (_, k) => {
    used.add(k)
    const v = params[k]
    // encode each segment individually to preserve intentional slashes
    return v !== undefined ? String(v).split('/').map(encodeURIComponent).join('/') : ''
  })

  const rest = {}
  for (const [k, v] of Object.entries(params || {})) {
    if (!used.has(k) && k !== 'mediaType') rest[k] = v
  }

  const isGet = method === 'GET'
  let url = `https://api.github.com${urlPath}`
  if (isGet && Object.keys(rest).length > 0) {
    url += '?' + new URLSearchParams(rest).toString()
  }

  const opts = {
    method,
    headers: {
      Authorization: `Bearer ${atok}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }
  if (!isGet && Object.keys(rest).length > 0) {
    opts.body = JSON.stringify(rest)
    opts.headers['Content-Type'] = 'application/json'
  }

  return fetch(url, opts).then(async r => {
    const data = await r.json().catch(() => null)
    if (!r.ok) {
      const err = new Error((data && data.message) || r.statusText)
      err.status = r.status
      err.response = { data }
      throw err
    }
    return { data }
  })
}

const README_TEMPLATE = `# [project-title]

This is your project's README a file which contains information about your work. This can include things like instructions, installation guides or documentation. You can write whatever you want here using a simple markup language called [markdown](https://markdownguide.offshoot.io/basic-syntax/). This is the first thing someone will see when they view your project on GitHub, but it won't be visible to the audience viewing your published site on the Web. To learn more about working on projects in netnet visit the [Coding](https://netnet.studio/docs/students/coding.html) page on our docs!

----

◕ ◞ ◕ This project was made by [user-name] using https://netnet.studio`

// Helper function for decrypting token
function decryptToken (req, res, cb) {
  const token = req.cookies.AuthTok
  if (!token) return res.status(401).json({ success: false, message: 'no access token' })
  try {
    const atok = new URLSearchParams(_aesDecrypt(token)).get('access_token')
    if (!atok) return res.status(401).json({ success: false, message: 'invalid token payload' })
    const gh = { request: (endpoint, params) => ghRequest(atok, endpoint, params) }
    cb(gh)
  } catch (err) {
    console.error('token decrypt error:', err)
    return res.status(401).json({ success: false, message: 'invalid token' })
  }
}

// MAX FILES/DEPTH in place to prevent large repo from making us crash.
// NOTE: if we change these values, make sure to update convo in project-files
// 'files-truncated', 'max-files-reached' and 'max-depth-reached'
const FETCH_FILES_MAX_DEPTH = 5
const FETCH_FILES_MAX_FILES = 300
// Helper function to recursively fetch files.
// It starts at the given path (empty string means repository root),
// and returns an object mapping file paths to their content data.
// depth, fileCount, and state are internal — callers should omit them.
async function fetchFiles (gh, owner, repo, path, depth = 0, fileCount = { n: 0 }, state = { truncated: false, reason: null }) {
  // Stop recursing if we've gone too deep into nested folders.
  if (depth > FETCH_FILES_MAX_DEPTH) {
    state.truncated = true
    state.reason = 'depth'
    return {}
  }
  const result = {}
  // Request the contents of the current path.
  const response = await gh.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner, repo, path: path || '' // if path is empty, use the repo root
  })
  const data = response.data

  // If data is an array, it represents a directory listing.
  if (Array.isArray(data)) {
    // Sort so HTML files come first — this ensures index.html (or any root
    // .html file) is always fetched before the file cap kicks in, so the
    // client can still identify the project as a web project even when truncated.
    const items = [...data].sort((a, b) => {
      const aHtml = a.name.endsWith('.html')
      const bHtml = b.name.endsWith('.html')
      if (aHtml !== bHtml) return aHtml ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    // Process each item (file or directory) in the listing.
    // For simplicity, process items sequentially.
    for (const item of items) {
      // Stop fetching if we've hit the total file cap.
      if (fileCount.n >= FETCH_FILES_MAX_FILES) {
        state.truncated = true
        state.reason = 'files'
        break
      }
      if (item.type === 'file') {
        fileCount.n++
        // Retrieve the file content.
        const fileResponse = await gh.request('GET /repos/{owner}/{repo}/contents/{path}', {
          owner, repo, path: item.path
        })
        // Save the file data using its path as the key.
        result[item.path] = fileResponse.data
      } else if (item.type === 'dir') {
        // Recursively fetch files inside subdirectories.
        const nestedFiles = await fetchFiles(gh, owner, repo, item.path, depth + 1, fileCount, state)
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

router.get('/api/github/proxy', async (req, res) => {
  if (!req.query.url) return res.status(400).json({ error: 'missing url param' })
  // fix single-slash typo that can come from the redbird proxy
  const url = req.query.url.replace('https:/raw', 'https://raw')
  // only allow HTTPS requests to raw.githubusercontent.com — no open SSRF
  let parsed
  try { parsed = new URL(url) } catch { return res.status(400).json({ error: 'invalid url' }) }
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'raw.githubusercontent.com') {
    return res.status(403).json({ error: 'host not allowed' })
  }
  // HACK: proxy exists to get around MIME-type mismatch issue with raw.githubusercontent.com
  // https://stackoverflow.com/questions/40728554/resource-blocked-due-to-mime-type-mismatch-x-content-type-options-nosniff/41309463#41309463
  const PROXY_MAX_BYTES = 5 * 1024 * 1024 // 5MB
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const r = await fetch(url, { signal: controller.signal })
    if (!r.ok) return res.status(r.status).json({ error: 'proxy request failed' })
    // check content-length header first to avoid buffering oversized responses
    const contentLength = Number(r.headers.get('content-length') || 0)
    if (contentLength > PROXY_MAX_BYTES) return res.status(413).json({ error: 'file too large' })
    const buf = Buffer.from(await r.arrayBuffer())
    if (buf.length > PROXY_MAX_BYTES) return res.status(413).json({ error: 'file too large' })
    // Set Content-Type explicitly — raw.githubusercontent.com sends text/plain for
    // CSS and JS, which nosniff blocks. This is the whole reason this proxy exists.
    const ext = parsed.pathname.split('.').pop()
    if (ext === 'css') res.setHeader('Content-Type', 'text/css')
    else if (ext === 'js') res.setHeader('Content-Type', 'application/javascript')
    if (ext === 'css') {
      res.end(reWriteCSSPaths(req, buf))
    } else res.end(buf)
  } catch (err) {
    console.error('proxy error:', err)
    res.status(502).json({ error: 'proxy request failed' })
  } finally {
    clearTimeout(timeout)
  }
})

// ~ * ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ * Auth Token
// ~ * ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *

router.get('/api/github/client-id', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex')
  res.cookie('nn-oauth-state', state, {
    maxAge: 5 * 60 * 1000,
    httpOnly: true,
    sameSite: 'lax',
    secure: true
  })
  res.json({ success: true, message: process.env.GITHUB_CLIENT_ID, state })
})

router.get('/api/github/auth-status', async (req, res) => {
  const token = req.cookies.AuthTok
  if (!token) return res.json({ success: false, message: 'no access token' })
  // Decrypt and verify the token is still valid on GitHub's side.
  // A corrupt/undecryptable cookie is definitely invalid; a GitHub network
  // error is not — don't log the user out if GitHub is temporarily down.
  let atok
  try {
    atok = new URLSearchParams(_aesDecrypt(token)).get('access_token')
    if (!atok) return res.json({ success: false, message: 'invalid token' })
  } catch (e) {
    return res.json({ success: false, message: 'invalid token' })
  }
  try {
    const r = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${atok}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    if (r.status === 401) return res.json({ success: false, message: 'token revoked' })
    return res.json({ success: true, message: 'token valid' })
  } catch (e) {
    // Network error — treat as still logged in rather than falsely clearing the session
    return res.json({ success: true, message: 'token unverified' })
  }
})

router.post('/api/github/clear-cookie', (req, res) => {
  res.clearCookie('AuthTok', { httpOnly: true, sameSite: 'lax', secure: true })
    .json({ message: 'cookie cleared' })
})

router.get('/user/signin/callback', (req, res) => {
  // validate OAuth state to prevent login CSRF (H-1)
  const { code, state } = req.query
  const stored = req.cookies['nn-oauth-state']
  if (!state || !stored || state !== stored) {
    return res.status(403).send('(✖ _ ✖) Invalid OAuth state (possible CSRF attempt)')
  }
  res.clearCookie('nn-oauth-state', { httpOnly: true, sameSite: 'lax', secure: true })
  // assuming user was redirected here from GitHub Auth Page...
  const codeParam = `code=${code}` // ...we should have a user ?code=...
  const root = 'https://github.com/login/oauth/access_token'
  const id = `client_id=${process.env.GITHUB_CLIENT_ID}`
  const sec = `client_secret=${process.env.GITHUB_CLIENT_SECRET}`
  fetch(`${root}?${id}&${sec}&${codeParam}`, { // ask GitHub for Auth Token
    method: 'POST'
  }).then(response => response.text()).then(token => {
    const ermsg = '◕ ︵ ◕ oh no! looks like something went wrong with GitHub'
    if (token.indexOf('error') === 0) return res.send(ermsg)
    // ...assuming we don't get an error back, let's encrypt and store the token
    try {
      const oneYear = 365 * 24 * 60 * 60 * 1000
      res.cookie('AuthTok', _aesEncrypt(token), {
        maxAge: oneYear,
        secure: true,
        sameSite: 'lax',
        httpOnly: true
      }).redirect('/')
    } catch (err) {
      console.error('token encrypt error:', err)
      res.status(500).send('◕ ︵ ◕ oh no! something went wrong with the login')
    }
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
  'get-commits': 'GET /repos/{owner}/{repo}/commits',
  // https://docs.github.com/en/rest/reference/repos#create-a-fork
  'fork-repo': 'POST /repos/{owner}/{repo}/forks'
}

function makeRequest (req, res, query, obj) {
  decryptToken(req, res, (gh) => {
    gh.request(dict[query], obj).then(gitRes => {
      res.json({ success: true, message: `${query} success`, data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: `${query} error`, error: err })
    })
  })
}

router.get('/api/github/username', (req, res) => {
  makeRequest(req, res, 'get-username', {})
})

router.get('/api/github/readme-template', (req, res) => {
  res.json({ success: true, message: README_TEMPLATE })
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

router.post('/api/github/fork', (req, res) => {
  const obj = { owner: req.body.owner, repo: req.body.repo }
  makeRequest(req, res, 'fork-repo', obj)
})

router.post('/api/github/open-all-files', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  decryptToken(req, res, async gh => {
    try { // Start at the repo root by passing an empty string.
      const state = { truncated: false, reason: null }
      const files = await fetchFiles(gh, owner, repo, '', 0, { n: 0 }, state)
      res.json({ success: true, message: 'open-all-files success', data: files, truncated: state.truncated, truncatedReason: state.reason })
    } catch (error) {
      res.json({ success: false, message: 'open-all-files error', error })
    }
  })
})

router.post('/api/github/new-repo', (req, res) => {
  const { name, user, indexData } = req.body
  if (typeof name !== 'string' || typeof indexData !== 'string' || typeof user !== 'string') {
    return res.json({ success: false, message: 'Missing name, user or indexData' })
  }

  decryptToken(req, res, gh => {
    gh.request('POST /user/repos', {
      name,
      description: '◕ ◞ ◕ This project was made using https://netnet.studio',
      auto_init: false
    }).then(repoRes => {
      const owner = repoRes.data.owner.login
      const repo = repoRes.data.name
      const branch = repoRes.data.default_branch || 'main'

      const readmeData = README_TEMPLATE
        .replace(/\[project-title\]/g, name)
        .replace(/\[user-name\]/g, user)

      const indexContent = Buffer.from(indexData, 'utf8').toString('base64')
      const readmeContent = Buffer.from(readmeData, 'utf8').toString('base64')

      return gh.request(
        'PUT /repos/{owner}/{repo}/contents/index.html',
        { owner, repo, path: 'index.html', message: 'created index.html', content: indexContent, branch }
      ).then(() => {
        return gh.request(
          'PUT /repos/{owner}/{repo}/contents/README.md',
          { owner, repo, path: 'README.md', message: 'created README.md', content: readmeContent, branch }
        )
      }).then(() => {
        res.json({
          success: true,
          owner,
          repo,
          branch,
          url: repoRes.data.html_url,
          data: [
            ['README.md', readmeData],
            ['index.html', indexData]
          ]
        })
      })
    }).catch(err => {
      res.json({ success: false, message: 'error creating repo', error: err.response.data })
    })
  })
})

// POST UPDATES
router.post('/api/github/push', (req, res) => {
  const { owner, repo, branch = 'main', commitMessage, changes } = req.body
  if (!owner || !repo || !commitMessage || !Array.isArray(changes)) {
    return res.json({ success: false, message: 'Missing required data' })
  }

  decryptToken(req, res, async gh => {
    try {
      // 1. Get the latest commit SHA on the branch
      const refResponse = await gh.request('GET /repos/{owner}/{repo}/git/ref/{ref}', {
        owner, repo, ref: `heads/${branch}`
      })
      const latestCommitSha = refResponse.data.object.sha

      // 2. Get the base commit tree SHA
      const baseCommitResponse = await gh.request('GET /repos/{owner}/{repo}/git/commits/{commit_sha}', {
        owner, repo, commit_sha: latestCommitSha
      })
      const baseTreeSha = baseCommitResponse.data.tree.sha

      // 3. Retrieve the full base tree recursively
      const baseTreeResponse = await gh.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', {
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
            const blobResponse = await gh.request('POST /repos/{owner}/{repo}/git/blobs', {
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
      const treeResponse = await gh.request('POST /repos/{owner}/{repo}/git/trees', {
        owner, repo, tree: newTreeItems, base_tree: baseTreeSha
      })
      const newTreeSha = treeResponse.data.sha

      // 7.5. Map each pushed path to its resolved blob sha (GitHub assigns
      // these as part of creating the tree, even for inline `content`
      // entries — no extra API calls needed). The client uses these to
      // keep its remote-sha baseline accurate after a push, so a later
      // "pull" can tell whether a file has *actually* changed on GitHub
      // since vs. just being out of date because of this push.
      const shaByPath = {}
      treeResponse.data.tree.forEach(item => { shaByPath[item.path] = item.sha })
      const shas = {}
      changes.forEach(change => {
        if (change.action !== 'delete' && shaByPath[change.path]) {
          shas[change.path] = shaByPath[change.path]
        }
      })

      // 8. Create a new commit referencing the new tree and the previous commit as parent
      const commitResponse = await gh.request('POST /repos/{owner}/{repo}/git/commits', {
        owner, repo, message: commitMessage, tree: newTreeSha, parents: [latestCommitSha]
      })
      const newCommitSha = commitResponse.data.sha

      // 9. Update the branch reference to point to the new commit
      await gh.request('PATCH /repos/{owner}/{repo}/git/refs/{ref}', {
        owner, repo, ref: `heads/${branch}`, sha: newCommitSha
      })

      res.json({ success: true, message: 'Commit pushed successfully', commitSha: newCommitSha, shas })
    } catch (error) {
      res.json({ success: false, message: 'Push failed', error })
    }
  })
})

// POST PUBLISH PROJECT
router.post('/api/github/gh-pages', (req, res) => {
  decryptToken(req, res, (gh) => {
    // https://docs.github.com/en/rest/reference/repos#get-a-repository
    gh.request('GET /repos/{owner}/{repo}', {
      owner: req.body.owner,
      repo: req.body.repo
    }).then(gitRes => {
      if (gitRes.data.has_pages) {
        // https://docs.github.com/en/rest/reference/repos#get-a-github-pages-site
        return gh.request('GET /repos/{owner}/{repo}/pages', {
          owner: req.body.owner,
          repo: req.body.repo
        })
      } else {
        // https://docs.github.com/en/rest/reference/repos#create-a-github-pages-site
        return gh.request('POST /repos/{owner}/{repo}/pages', {
          owner: req.body.owner,
          repo: req.body.repo,
          source: { branch: req.body.branch, path: '/' },
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

// READ-ONLY status check — used by the web-publish widget to poll build
// status without ever creating/enabling a pages site as a side effect.
router.get('/api/github/pages-status', (req, res) => {
  decryptToken(req, res, (gh) => {
    gh.request('GET /repos/{owner}/{repo}/pages', {
      owner: req.query.owner,
      repo: req.query.repo
    }).then(gitRes => {
      res.json({ success: true, enabled: true, data: gitRes.data })
    }).catch(err => {
      if (err.status === 404) return res.json({ success: true, enabled: false })
      res.json({ success: false, message: 'error fetching pages status', error: err })
    })
  })
})

// https://docs.github.com/en/rest/reference/repos#update-information-about-a-github-pages-site
// `cname` set to '' (or omitted) removes any existing custom domain.
router.post('/api/github/pages-domain', (req, res) => {
  const { owner, repo, cname } = req.body
  decryptToken(req, res, (gh) => {
    gh.request('PUT /repos/{owner}/{repo}/pages', {
      owner,
      repo,
      cname: cname || null,
      mediaType: { previews: ['switcheroo'] }
    }).then(() => {
      res.json({ success: true, message: 'domain updated' })
    }).catch(err => {
      res.json({ success: false, message: 'error updating custom domain', error: err })
    })
  })
})

// CREATE NEW REPO FROM TEMPLATE DATA
router.post('/api/github/new-repo-from-template', (req, res) => {
  const { name, user, files, message } = req.body
  if (typeof name !== 'string' || typeof user !== 'string' || typeof files !== 'object' || !files) {
    return res.json({ success: false, message: 'Missing or invalid name, user, or files' })
  }

  decryptToken(req, res, async gh => {
    try {
      // 1) create empty repo
      const repoRes = await gh.request('POST /user/repos', {
        name,
        description: '◕ ◞ ◕ This project was made using https://netnet.studio',
        auto_init: false
      })

      const owner = repoRes.data.owner.login
      const repo = repoRes.data.name
      const branch = repoRes.data.default_branch || 'main'

      // 2) commit each file (creates initial commit on first PUT)
      const entries = Object.entries(files) // [[path, content], ...]
      // optional: keep deterministic order
      entries.sort((a, b) => a[0].localeCompare(b[0]))

      for (const [pathRel, contentVal] of entries) {
        let base64
        if (contentVal && typeof contentVal === 'object' && contentVal.base64) {
          // binary provided by client, already base64
          base64 = contentVal.base64
        } else {
          // plain text -> encode here
          base64 = Buffer.from(String(contentVal), 'utf8').toString('base64')
        }

        await gh.request('PUT /repos/{owner}/{repo}/contents/{path}', {
          owner, repo, path: pathRel, message, content: base64, branch
        })
      }

      res.json({
        success: true, owner, repo, branch, url: repoRes.data.html_url, files: Object.keys(files)
      })
    } catch (err) {
      res.json({ success: false, message: 'error creating repo from files', error: err.response?.data || err })
    }
  })
})

module.exports = router
