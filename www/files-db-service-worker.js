/* global self, clients, indexedDB, Blob, Response, Headers, fetch, Request */
/*

this class is used to intercept requests coming from the website (specifically
the iframe rendering the output) and resolve those by returning the data stored
in indexedDB via the project-files widget.
 __________                                           ________________
|    www   |                                         | service-worker |
| <iframe> | <--------- send res to -----------------|________________|
|_ netitor_|                                                      |
      \__                 _______________                        /
         \__ save to --> | project-files | <--- get data from __/
                         |   IndexedDB   |
                         |_______________|

// NOTE: for debug console visit "about:debugging" in Firefox
*/

// NOTE: these must match values in project-files + tut maker's file-manager.js
// (AVOID CHANGING THESE UNLESS WE HAVE TO FOR SOME UNFORSEEN REASON)
const DB_VERSION = 1
const STORE_NAME = 'filesStore'
const OBJ_NAME = 'files'

const LOG = false // for debugging

const PROJ_PREFIX = 'PROJ__'
const TUT_PREFIX = 'TUTORIAL_MAKER'

if (LOG) console.log('[SW] hang version ran.....')

function openDB (dbName, opts = {}) {
  const { timeoutMs = 2000 } = opts // <- so we avoid "hanging"
  return new Promise((resolve, reject) => {
    let settled = false
    const timer = setTimeout(() => {
      if (settled) return
      settled = true
      console.warn('[SW] IDB open timeout for', dbName)
      reject(new Error('IDB_OPEN_TIMEOUT'))
    }, timeoutMs)

    const req = indexedDB.open(dbName, DB_VERSION)

    req.onupgradeneeded = e => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
        if (LOG) console.log(`[SW] Created object store ${STORE_NAME}`)
      }
    }

    req.onblocked = () => {
      console.warn('[SW] IDB open BLOCKED for', dbName, '(another tab holds older version open)')
    }

    req.onsuccess = e => {
      if (settled) { e.target.result.close(); return }
      settled = true
      clearTimeout(timer)
      if (LOG) console.log('[SW] Successfully opened database', dbName)
      resolve(e.target.result)
    }

    req.onerror = e => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      console.error(`[SW] Failed to open database ${dbName}:`, e.target.error)
      reject(e.target.error || new Error('IDB_OPEN_ERROR'))
    }
  })
}

// NOTE: this method needs to stay in sync with the mimeTypes object in the Project Files widget
function getMimeType (filePath) {
  const extension = filePath.split('.').pop().toLowerCase()
  const mimeTypes = {
    md: 'text/markdown',
    html: 'text/html',
    css: 'text/css',
    js: 'text/javascript',
    txt: 'text/plain',
    csv: 'text/csv',
    json: 'application/json',
    xml: 'application/xml',
    // image
    png: 'image/png',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    svg: 'image/svg+xml',
    ico: 'image/x-icon',
    webp: 'image/webp',
    // fonts
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    otf: 'font/otf',
    // av media
    mp4: 'video/mp4',
    webm: 'video/webm',
    ogv: 'video/ogg',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    weba: 'audio/webm',
    ogg: 'audio/ogg',
    oga: 'audio/ogg',
    // misc
    pdf: 'application/pdf',
    zip: 'application/zip'
  }
  return mimeTypes[extension]
}

async function getFileFromIndexedDB (dbName, filePath, opts) {
  try {
    const db = await openDB(dbName, opts)
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const getRequest = store.get(OBJ_NAME)

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = (event) => {
        if (getRequest.result && getRequest.result[filePath]) {
          resolve(getRequest.result[filePath]) // File exists
        } else {
          resolve(false) // File does not exist
        }
      }

      getRequest.onerror = (event) => {
        reject(new Error('Error checking file in IndexedDB'))
      }
    })
  } catch (error) {
    console.error('[SW] Error accessing the database', error)
    throw new Error('Error accessing the database')
  }
}

async function getAllFilesFromIndexedDB (dbName) {
  try {
    const db = await openDB(dbName)
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const getRequest = store.get(OBJ_NAME)

    return new Promise((resolve, reject) => {
      getRequest.onsuccess = () => {
        if (getRequest.result) {
          // An object whose keys are file paths and values are your files
          resolve(getRequest.result)
        } else {
          // No files stored yet
          resolve(false)
        }
      }
      getRequest.onerror = () => {
        reject(new Error('Error retrieving files from IndexedDB'))
      }
    })
  } catch (error) {
    console.error('[SW] Error accessing the database', error)
    throw new Error('Error accessing the database')
  }
}

async function generateResponse (filePath, data) {
  try { // NOTE: render .md as HTML (see markdownToHtml in fetch listener below)
    const mimeType = filePath.endsWith('.md')
      ? 'text/html; charset=UTF-8'
      : (getMimeType(filePath) || 'application/octet-stream')

    // make sure Chrome never caches text files (so SW always returns them)
    const baseType = mimeType.split(';')[0].trim()
    const noStore = baseType.startsWith('text/') ||
      baseType === 'application/json' ||
      baseType === 'application/javascript' ||
      baseType === 'application/xml'

    const headers = new Headers({
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*'
    })

    if (noStore) headers.set('Cache-Control', 'no-store')

    // NOTE: assumes blobs are stored as strings in IDB
    // if we decide to change this in the future and "data" is not a string then
    // this type check below will throw an error b/c .startsWith is for strings
    let blob
    if (data.startsWith('blob:')) {
      // Fetch the actual Blob data from the blob URL string
      const response = await fetch(data)
      blob = await response.blob()
    } else {
      blob = new Blob([data], { type: mimeType })
    }

    return new Response(blob, { headers })
  } catch (error) {
    console.error('[SW] Error generating response', error)
    throw new Error('Error generating response')
  }
}

// if a stuent has a large media file (like an image) or .js file (like a minified library) in their GH project
// it won't load when 'opening a project', instead we store the raw URL to the hosted js file on github
// this handles (ie. proxies) requesting and returning that large .js file
async function handleProxyRequest (targetUrl) {
  try {
    // 1) build a Request so we can set redirect:'follow'
    const proxyReq = new Request(targetUrl, { mode: 'cors', credentials: 'omit', redirect: 'follow' })
    const res = await fetch(proxyReq)
    // 2) if GitHub/raw gave us an error status, bail
    if (!res.ok) {
      console.warn('[SW] Proxy target returned', res.status, res.statusText)
      return new Response('Failed to fetch resource', { status: 502 })
    }
    // 3) grab a fresh Headers object to copy back later
    const headers = new Headers(res.headers)
    // 4) only read as text if we need to mutate (e.g. JS injection)
    if (targetUrl.endsWith('.js')) {
      const body = await res.text()
      // ensure Content-Type stays correct
      headers.set('Content-Type', headers.get('Content-Type') || 'application/javascript')
      return new Response(body, { status: res.status, statusText: res.statusText, headers })
    }
    // 5) all other assets (images, CSS, etc.) get streamed straight back
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers })
  } catch (err) {
    console.error('[SW] Proxy fetch error:', err)
    return new Response('Error: ' + err.message, { status: 500 })
  }
}

// in order to render markdown files
function markdownToHtml (md) {
  if (typeof md !== 'string') {
    throw new TypeError('Expected a string')
  }
  const escapeHtml = str => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // Code blocks
  md = md.replace(/```([\s\S]*?)```/g, (_, code) => {
    return '<pre><code>' + escapeHtml(code) + '</code></pre>'
  })
  // Inline code
  md = md.replace(/`([^`]+)`/g, (_, code) => {
    return '<code>' + escapeHtml(code) + '</code>'
  })
  // Headers (h1 to h6)
  md = md.replace(/^###### (.*)$/gm, '<h6>$1</h6>')
  md = md.replace(/^##### (.*)$/gm, '<h5>$1</h5>')
  md = md.replace(/^#### (.*)$/gm, '<h4>$1</h4>')
  md = md.replace(/^### (.*)$/gm, '<h3>$1</h3>')
  md = md.replace(/^## (.*)$/gm, '<h2>$1</h2>')
  md = md.replace(/^# (.*)$/gm, '<h1>$1</h1>')
  // Bold and italic
  md = md.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  md = md.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // Images
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
  // Links
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  // Unordered lists
  md = md.replace(/(?:^|\n)([-+*]) (.*?)(?=\n[^-*+]|$)/gs, match => {
    const items = match.trim().split('\n').map(item => {
      return '<li>' + item.replace(/^[-+*] /, '') + '</li>'
    }).join('')
    return '<ul>' + items + '</ul>'
  })
  // Paragraphs (very naive — do this last)
  md = md.replace(/^(?!<(h\d|ul|li|pre|code|blockquote|\/)).+/gm, line => {
    return '<p>' + line + '</p>'
  })
  return md.trim()
}

async function findFileReferences (dbName, filePath) {
  const files = await getAllFilesFromIndexedDB(dbName)
  const result = {}
  if (!files) return result

  const textExts = new Set(['html', 'htm', 'css', 'js', 'md', 'txt'])
  const escapeRegExp = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const rePath = escapeRegExp(filePath)
  const htmlRe = new RegExp(`(?:src|href|poster)\\s*=\\s*["']?${rePath}["']?`, 'i')
  const cssRe = new RegExp(`url\\(\\s*["']?${rePath}["']?\\s*\\)`, 'i')

  for (const path in files) {
    const ext = path.split('.').pop().toLowerCase()
    if (!textExts.has(ext)) continue

    let content = files[path]
    if (content && typeof content === 'object' && typeof content.code === 'string') {
      content = content.code
    }
    if (typeof content !== 'string') continue

    const lines = content.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (htmlRe.test(line) || cssRe.test(line)) {
        result[path] = { lineNo: i + 1, line, badPath: filePath }
        break
      }
    }
  }

  return result
}

// send a message to the client (see _handleServiceWorkerMessage in project-files widget)
async function postMessage (type, data) {
  // Get all clients that are currently controlled by the service worker
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  // Iterate through clients and send messages
  for (const client of clients) client.postMessage({ type, data })
}

const normalizePath = p => (p || '').replace(/^\/+/, '')

const parseProjectPath = filePath => {
  const [first, ...rest] = filePath.split('/')
  if (!first || !first.startsWith(PROJ_PREFIX)) return null
  const dbName = decodeURIComponent(first.slice(PROJ_PREFIX.length))
  const innerPath = rest.join('/') // may be '' (folder root)
  return { dbName, innerPath }
}

self.addEventListener('install', (event) => {
  self.skipWaiting() // Forces the waiting service worker to become the active service worker
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()) // Takes control of all clients immediately
})

// receiving messages from the client
self.addEventListener('message', event => {
  if (LOG) console.log('[SW] message from client:', event.data)
})

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    try {
      const request = event.request

      // bypass not GET requests
      if (request.method !== 'GET') return fetch(request)
      if (request.method !== 'GET' && LOG) console.log('[SW] bypass non-GET', request.url)

      const url = new URL(request.url)
      // const filePath = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
      const filePath = normalizePath(url.pathname)

      // bypass sockets && analytics
      const accept = request.headers.get('accept') || ''
      const isRealtimeOrAnalytics = url.pathname === '/socket.io' ||
          url.pathname.startsWith('/socket.io/') ||
          url.pathname.startsWith('/snt-api/') ||
          accept.includes('text/event-stream')
      if (isRealtimeOrAnalytics) return fetch(request)
      if (isRealtimeOrAnalytics && LOG) console.log('[SW] bypass SNT/socket.io ', url.pathname)

      const isNav = event.request.mode === 'navigate'
      const opts = isNav ? { timeoutMs: 1500 } : undefined

      // ------------------------------------------------- TUTORIAL_MAKER lookup
      if (filePath.startsWith(TUT_PREFIX + '/')) {
        if (LOG) console.log('[SW] checking TUT:', filePath)
        const fileData = await getFileFromIndexedDB('tutorialMakerDB', filePath, opts)
        if (fileData && LOG) console.log('[SW] TUT data found!')
        if (fileData) return generateResponse(filePath, fileData)
        return fetch(request, { cache: 'no-store' })
      }

      // ----------------------------------------------------- MAIN file lookup
      if (LOG) console.log('[SW] checking path:', filePath)
      const proj = parseProjectPath(filePath)

      if (proj) {
        const { dbName, innerPath } = proj
        const lookup = innerPath || 'index.html'

        if (LOG) console.log('[SW] looking for file in PROJ:', dbName)
        let fileData = await getFileFromIndexedDB(dbName, lookup, opts)

        // ------------------------------------------ FOLDER index.html fallback
        // ex: request is for a directory; check if dir has an index file in DB
        let indexPath
        if (!fileData && innerPath && !innerPath.includes('.')) {
          indexPath = innerPath + '/index.html'
          fileData = await getFileFromIndexedDB(dbName, indexPath, opts)
          if (fileData) {
            const body = `⚠️ OOPS: it appears you clicked on a link navigating to a folder containing an index.html file, but you forgot to specify index.html in your linked path, try writing: ${indexPath}`
            // NOTE: this wouldn't be a problem in publshed www, but it is here
            // b/c SW needs a filepath (not dir only) to lokkup + return DB data
            return generateResponse(indexPath, body)
          }
        }

        // ---------------------------------------------------- BAD PATHS helper
        // ex: trying to link (src, href, ) to a local file that does not exist
        if (!fileData) {
          const bads = await findFileReferences(dbName, lookup)
          if (bads && Object.keys(bads).length > 0) await postMessage('BAD_PATHS', bads)
        }

        // --------------------------- ABSOLUTE URL passthrough (ex: raw GitHub)
        const hosts = ['localhost', 'netnet.studio', 'dev.netnet.studio']
        const comingFromNetnet = hosts.includes(url.hostname)
        if (fileData && typeof fileData === 'string' && fileData.startsWith('http') && comingFromNetnet) {
          if (fileData.startsWith('https://raw.')) return handleProxyRequest(fileData)
          return fetch(fileData, { cache: 'no-store' })
        }

        // ------------------------------------------------ SERVE FROM IndexedDB
        if (fileData) {
          if (LOG) console.log('[SW] serving:', lookup, ' :: from :', dbName)
          let body = fileData
          if (filePath.endsWith('.html')) {
            body = `<script>
              window.onerror = function (message, source, lineno) {
                window.parent.postMessage({ type: 'iframe-error', message, source, lineno }, '*')
              }
            </script>` + body
          } else if (filePath.endsWith('.md')) {
            body = markdownToHtml(body)
          }
          return generateResponse(lookup, body)
        }

        // miss inside project → network
        return fetch(request, { cache: 'no-store' })
      }

      // ------------------------------------------- else, pass request through
      if (LOG) console.warn('[SW] not PROJ; falling back to network:', filePath)
      return fetch(request, { cache: 'no-store' })
    } catch (err) {
      console.error('[SW] fetch error:', err)
      return new Response('File not found or failed to load', { status: 404 })
    }
  })())
})
