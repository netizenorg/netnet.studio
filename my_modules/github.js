const fs = require('fs')
const path = require('path')
const axios = require('axios')
const triplesec = require('triplesec')
const { Octokit } = require('@octokit/core')
const express = require('express')
const router = express.Router()

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

// ~ . _ . ~ *  ~ . _ . ~ *  ~ . _ . ~ *  ~ proxy for raw.githubusercontent.com

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

function saveTempGHFiles (obj) {
  // console.log(obj);
  let sub = obj.data.path.split('/'); sub.pop(); sub = sub.join('/')
  const str = `../data/temp-gh-user-data/${obj.owner}/${sub}`
  const dir = path.join(__dirname, str)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  const fpath = `${dir}/${obj.data.name}`
  const fdata = Buffer.from(obj.data.content, 'base64').toString('binary')
  fs.writeFileSync(fpath, fdata)
}

function checkTempGHFile (url) {
  const upath = url.split('raw.githubusercontent.com/')[1]
  const owner = upath.split('/')[0]
  const dir = path.join(__dirname, `../data/temp-gh-user-data/${owner}/`)
  const branch = upath.includes('/master/') ? 'master' : 'main'
  const fpath = upath.split(`/${branch}/`)[1]
  const exists = fs.existsSync(`${dir}/${fpath}`)
  if (exists) return fs.readFileSync(`${dir}/${fpath}`)
  else return null
}

router.post('/api/github/delete-cache', (req, res) => {
  const resErr = (error, message) => ({ success: false, message, error })
  const owner = req.body.owner
  const dir = path.join(__dirname, `../data/temp-gh-user-data/${owner}/`)

  if (!fs.existsSync(dir)) {
    return res.json({ success: true, message: 'nothing to delete' })
  }

  try {
    if (fs.existsSync(dir)) {
      fs.rm(dir, { recursive: true }, (err) => {
        if (err) return res.json(resErr(err, 'error deleting cache'))
        return res.json({ success: true, message: 'removed user gh-cache' })
      })
    }
  } catch (err) {
    return res.json(resErr(err, 'error deleting cache'))
  }
})

router.post('/api/github/update-cache', (req, res) => {
  const resErr = (error, message) => ({ success: false, message, error })
  try {
    saveTempGHFiles({
      owner: req.body.owner,
      data: { name: req.body.name, path: req.body.path, content: req.body.code }
    })
    return res.json({ success: true, message: 'updated github cache' })
  } catch (err) {
    return res.json(resErr(err, 'error updating github cache'))
  }
})

router.get('/api/github/proxy', (req, res) => {
  // HACK: the purpose of this proxy to get around this issue:
  // https://stackoverflow.com/questions/40728554/resource-blocked-due-to-mime-type-mismatch-x-content-type-options-nosniff/41309463#41309463

  // HACK: on the live version, the redbird proxy screws w/this proxy
  const url = req.query.url.replace('https:/raw', 'https://raw')
  // && removes one of the slashes after the protocol https://
  // ...this fixes the redbird screw up

  // see reWriteCSSPaths above
  const checkForCSSB4Res = (data) => {
    if (req.query.url.includes('.css')) {
      res.end(reWriteCSSPaths(req, data))
    } else res.end(data)
  }

  const file = checkTempGHFile(url)
  if (file) checkForCSSB4Res(file)
  else {
    axios.get(url, { responseType: 'arraybuffer' })
      .then(r => checkForCSSB4Res(r.data))
      .catch(err => console.log('ERR: /api/github/proxy', err.config.url))
  }
})

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

router.post('/api/github/repo-data', (req, res) => {
  // https://docs.github.com/en/rest/reference/repos#get-a-repository
  const octokit = new Octokit()
  octokit.request('GET /repos/{owner}/{repo}', {
    owner: req.body.owner,
    repo: req.body.repo
  }).then(gitRes => {
    res.json({ success: true, message: 'success', data: gitRes.data })
  }).catch(err => {
    res.json({ success: false, message: 'octokit error', error: err })
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

router.post('/api/github/open-project', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  const obj = { owner, repo }
  let branch = 'main'
  decryptToken(req, res, (octokit) => {
    octokit.request('GET /repos/{owner}/{repo}/branches', obj).then(gitRes => {
      branch = gitRes.data[0].name
      return octokit.request(`GET /repos/:owner/:repo/branches/${branch}`, obj)
    }).then(gitRes => {
      // // https://docs.github.com/en/rest/reference/repos#get-repository-content
      // return octokit.request('GET /repos/{owner}/{repo}/contents/{path}', obj)
      // ^ this one only returns root directory... using "trees" below instead
      // https://docs.github.com/en/rest/git/trees#get-a-tree
      obj.tree_sha = gitRes.data.commit.sha
      obj.recursive = 'true'
      return octokit.request('GET /repos/{owner}/{repo}/git/trees/{tree_sha}', obj)
    }).then(gitRes => {
      res.json({ success: true, message: 'success', branch, data: gitRes.data })
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
      saveTempGHFiles({ owner, repo, data: gitRes.data })
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      console.log("TRIED OPEN FILE -------------", req.body);
      res.json({ success: false, message: 'error opening file', error: err })
    })
  })
})

// \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\ // \\  [POST]

router.post('/api/github/new-repo', (req, res) => {
  const data = {
    name: req.body.name,
    content: req.body.data,
    message: 'netnet initialized repo'
  }
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#create-a-repository-for-the-authenticated-user
    octokit.request('POST /user/repos', {
      name: data.name,
      description: '◕ ◞ ◕ This project was made using https://netnet.studio',
      auto_init: true
    }).then(gitRes => {
      data.owner = gitRes.data.owner.login
      data.branch = gitRes.data.default_branch
      data.url = gitRes.data.html_url
      // https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
      return octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
        owner: data.owner,
        repo: data.name,
        path: 'index.html',
        message: data.message,
        content: data.content
      })
    }).then(gitRes => {
      data.ghpages = gitRes.data.html_url
      data.success = true
      res.json(data)
    }).catch(err => {
      res.json({ success: false, message: 'error creating repo', error: err })
    })
  })
})

router.post('/api/github/upload-file', (req, res) => {
  const message = `created ${req.body.name}`
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
    octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
      owner: req.body.owner,
      repo: req.body.repo,
      path: req.body.name,
      message: message,
      content: req.body.code
    }).then(gitRes => {
      res.json({ success: true, message, data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error uploading file', error: err })
    })
  })
})

router.post('/api/github/delete-file', (req, res) => {
  const message = `removed ${req.body.path}`
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#delete-a-file
    octokit.request('DELETE /repos/{owner}/{repo}/contents/{path}', {
      owner: req.body.owner,
      repo: req.body.repo,
      path: req.body.path,
      sha: req.body.sha,
      message
    }).then(gitRes => {
      res.json({ success: true, message, data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error deleting file', error: err })
    })
  })
})

router.post('/api/github/delete-folder', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  const branch = req.body.branch
  const path = req.body.path
  const message = `removed directory ${path}`
  const obj = { owner, repo, branch }
  let baseTreeSha
  /*
    Dang was this hard to figure out!!!
    see notes in /rename-file below
  */
  decryptToken(req, res, (octokit) => {
    // console.log('1. Get the current branch')
    obj.recursive = 1
    octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', obj).then(gitRes => {
      // console.log('2. Get the current tree')
      obj.base_tree = baseTreeSha = gitRes.data.commit.sha
      return octokit.request('GET /repos/{owner}/{repo}/git/trees/{base_tree}', obj)
    }).then(gitRes => {
      // console.log('3. Create a new tree')
      delete obj.base_tree
      obj.tree = gitRes.data.tree.filter(f => {
        return f.path !== 0 && f.path.indexOf(`${path}/`) !== 0 && f.type !== 'tree'
      })
      return octokit.request('POST /repos/{owner}/{repo}/git/trees?recursive=1', obj)
    }).then(gitRes => {
      // console.log('4. Create a commit for the new tree')
      const commit = {
        owner,
        repo,
        message,
        tree: gitRes.data.sha,
        parents: [baseTreeSha]
      }
      return octokit.request('POST /repos/{owner}/{repo}/git/commits', commit)
    }).then(gitRes => {
      // console.log('5. Point your branch at the new commit')
      const nc = { owner, repo, branch, sha: gitRes.data.sha }
      return octokit.request('POST /repos/{owner}/{repo}/git/refs/heads/{branch}', nc)
    }).then(gitRes => {
      res.json({ success: true, message, branch, data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error renaming file', error: err })
    })
  })
})

router.post('/api/github/rename-file', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  const branch = req.body.branch
  const path = req.body.file.path
  const newpath = req.body.newpath
  const message = `renamed ${path} to ${newpath}`
  const obj = { owner, repo, branch }
  let baseTreeSha
  /*
    Dang was this hard to figure out!!!
    started here...
    https://stackoverflow.com/questions/31563444/rename-a-file-with-github-api
    turns out this was most helpful...
    https://www.levibotelho.com/development/commit-a-file-with-the-github-api/
    (specifically the "hard war")
  */
  decryptToken(req, res, (octokit) => {
    // console.log('1. Get the current branch')
    obj.recursive = 1
    octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', obj).then(gitRes => {
      // console.log('2. Get the current tree')
      obj.base_tree = baseTreeSha = gitRes.data.commit.sha
      return octokit.request('GET /repos/{owner}/{repo}/git/trees/{base_tree}', obj)
    }).then(gitRes => {
      // console.log('3. Create a new tree')
      delete obj.base_tree /* "harder way" is not supposed to have "base_tree"... */
      obj.tree = gitRes.data.tree.map((f) => {
        if (f.path.indexOf(path) === 0) f.path = f.path.replace(path, newpath)
        if (f.type !== 'tree') return f /* ...nor should it have "sub trees" */
      }).filter(f => f !== undefined)
      return octokit.request('POST /repos/{owner}/{repo}/git/trees?recursive=1', obj)
    }).then(gitRes => {
      // console.log('4. Create a commit for the new tree')
      const commit = {
        owner,
        repo,
        message,
        tree: gitRes.data.sha,
        parents: [baseTreeSha]
      }
      return octokit.request('POST /repos/{owner}/{repo}/git/commits', commit)
    }).then(gitRes => {
      // console.log('5. Point your branch at the new commit')
      const nc = { owner, repo, branch, sha: gitRes.data.sha }
      return octokit.request('POST /repos/{owner}/{repo}/git/refs/heads/{branch}', nc)
    }).then(gitRes => {
      res.json({ success: true, message, branch, data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error renaming file', error: err })
    })
  })
})



// router.post('/api/github/save-project', (req, res) => {
//   // TODO: will need to update for multi-file projets f/when we get there...
//   decryptToken(req, res, (octokit) => {
//     // https://docs.github.com/en/rest/reference/repos#create-or-update-file-contents
//     octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
//       owner: req.body.owner,
//       repo: req.body.repo,
//       path: req.body.path,
//       sha: req.body.sha,
//       message: req.body.message,
//       content: req.body.code
//     }).then(gitRes => {
//       res.json({ success: true, message: 'success', data: gitRes.data })
//     }).catch(err => {
//       res.json({ success: false, message: 'error saving ' + req.data.path, error: err })
//     })
//   })
// })

router.post('/api/github/save-project', (req, res) => {
  const owner = req.body.owner
  const repo = req.body.repo
  const branch = req.body.branch
  const message = req.body.message
  const files = req.body.files
  const obj = { owner, repo, branch }
  let baseTreeSha
  const blobsDict = {}
  /*
    bsaed on '/api/github/rename-file' above
  */
  decryptToken(req, res, (octokit) => {
    // console.log('0. create the new blobs')
    Promise.all(files.map((file) => {
      return octokit.request('POST /repos/{owner}/{repo}/git/blobs', {
        owner: req.body.owner,
        repo: req.body.repo,
        content: file.code,
        encoding: 'utf-8'
      })
    })).then(gitRes => {
      gitRes.forEach((gres, i) => {
        // update files array w/new sha + url
        files[i].sha = gres.data.sha
        files[i].url = gres.data.url
        // create blobsDict for easy lookup
        blobsDict[files[i].path] = files[i]
      })
      // console.log('1. Get the current branch')
      obj.recursive = 1
      return octokit.request('GET /repos/{owner}/{repo}/branches/{branch}', obj)
    }).then(gitRes => {
      // console.log('2. Get the current tree')
      obj.base_tree = baseTreeSha = gitRes.data.commit.sha
      return octokit.request('GET /repos/{owner}/{repo}/git/trees/{base_tree}', obj)
    }).then(gitRes => {
      // console.log('3. Create a new tree')
      delete obj.base_tree /* "harder way" is not supposed to have "base_tree"... */
      obj.tree = gitRes.data.tree.map((f) => {
        if (blobsDict[f.path]) { // update sha/url with the new blob
          f.sha = blobsDict[f.path].sha
          f.url = blobsDict[f.path].url
        }
        if (f.type !== 'tree') return f /* ...nor should it have "sub trees" */
      }).filter(f => f !== undefined)
      return octokit.request('POST /repos/{owner}/{repo}/git/trees?recursive=1', obj)
    }).then(gitRes => {
      // console.log('4. Create a commit for the new tree')
      const commit = {
        owner, repo, message, tree: gitRes.data.sha, parents: [baseTreeSha]
      }
      return octokit.request('POST /repos/{owner}/{repo}/git/commits', commit)
    }).then(gitRes => {
      // console.log('5. Point your branch at the new commit')
      const nc = { owner, repo, branch, sha: gitRes.data.sha }
      return octokit.request('POST /repos/{owner}/{repo}/git/refs/heads/{branch}', nc)
    }).then(gitRes => {
      res.json({ success: true, message, branch, data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error saving project', error: err })
    })
  })
})

// ...................... || ....................... || ........................

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

router.post('/api/github/fork', (req, res) => {
  decryptToken(req, res, (octokit) => {
    // https://docs.github.com/en/rest/reference/repos#create-a-fork
    octokit.request('POST /repos/{owner}/{repo}/forks', {
      owner: req.body.owner, /// owner of repo to fork
      repo: req.body.repo // repo to fork
    }).then(gitRes => {
      res.json({ success: true, message: 'success', data: gitRes.data })
    }).catch(err => {
      res.json({ success: false, message: 'error updating ghpages', error: err })
    })
  })
})

module.exports = router
