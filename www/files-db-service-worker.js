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

// NOTE: kill service worker chrome (copy+paste into web console)
;(async () => {
  const regs = await navigator.serviceWorker.getRegistrations()
  for (const r of regs) await r.unregister()
  const keys = await caches.keys()
  await Promise.all(keys.map(k => caches.delete(k)))
  location.reload()
})()

*/

// NOTE: these must match values in project-files + tut maker's file-manager.js
// (AVOID CHANGING THESE UNLESS WE HAVE TO FOR SOME UNFORSEEN REASON)
const DB_VERSION = 1
const STORE_NAME = 'filesStore'
const OBJ_NAME = 'files'

const LOG = false // for debugging

const PROJ_PREFIX = 'PROJ__'
const TUT_PREFIX = 'TUTORIAL_MAKER'

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
    // 3D formats
    obj: 'text/plain',
    mtl: 'text/plain',
    gltf: 'model/gltf+json',
    glb: 'model/gltf-binary',
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

// =============================================================================
// =============================================================== IDB FUNCTIONS
// =============================================================================

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

// =============================================================================
// ============================================================= HTTP RESPONSES
// =============================================================================

// NOTE: this used to only handle blob urls (#3 below) but can now handle raw
// blobs + also generally has better conditional/fallback logic
async function generateResponse (filePath, data) {
  try {
    // NOTE: render .md as HTML (see markdownToHtml in fetch listener below)
    const mimeType = filePath.endsWith('.md')
      ? 'text/html; charset=UTF-8'
      : (getMimeType(filePath) || 'application/octet-stream')

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
    if (/^(audio|video)\//.test(baseType)) {
      headers.set('Vary', 'Range')
      headers.set('Accept-Ranges', 'bytes')
    }

    // 1) direct binary (best path for fonts/images/audio/video)
    if (data instanceof Blob) {
      // optional: Content-Length is nice-to-have
      try {
        const buf = await data.arrayBuffer()
        headers.set('Content-Length', String(buf.byteLength))
        if (/^(font|audio|video)\//.test(baseType)) headers.set('Accept-Ranges', 'bytes')
        if (LOG) console.log('[SW] responding from -> Blob')
        return new Response(buf, { headers })
      } catch { // fallback: stream Blob as-is if .arrayBuffer() fails
        if (LOG) console.log('[SW] responding from -> stream Blob')
        return new Response(data, { headers })
      }
    }
    if (data instanceof ArrayBuffer) {
      headers.set('Content-Length', String(data.byteLength))
      if (/^(font|audio|video)\//.test(baseType)) headers.set('Accept-Ranges', 'bytes')
      if (LOG) console.log('[SW] responding from -> ArrayBuffer')
      return new Response(data, { headers })
    }
    if (data instanceof Uint8Array) {
      headers.set('Content-Length', String(data.byteLength))
      if (/^(font|audio|video)\//.test(baseType)) headers.set('Accept-Ranges', 'bytes')
      if (LOG) console.log('[SW] responding from -> Uint8Array')
      return new Response(data, { headers })
    }

    // 2) data:…;base64,… (tiny assets only)
    if (typeof data === 'string' && data.startsWith('data:')) {
      const comma = data.indexOf(',')
      const meta = data.slice(5, comma) // e.g. 'font/woff2;base64'
      const b64 = data.slice(comma + 1)
      const bin = window.atob(b64)
      const arr = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
      const mt = meta.split(';')[0] || mimeType
      headers.set('Content-Type', mt)
      headers.set('Content-Length', String(arr.byteLength))
      if (/^(font|audio|video)\//.test(mt)) headers.set('Accept-Ranges', 'bytes')
      if (LOG) console.log('[SW] responding from -> data:…;base64')
      return new Response(arr.buffer, { headers })
    }

    // 3) legacy blob: URL (kept for backward compat)
    if (typeof data === 'string' && data.startsWith('blob:')) {
      const res = await fetch(data)
      const buf = await res.arrayBuffer()
      headers.set('Content-Length', String(buf.byteLength))
      if (/^(font|audio|video)\//.test(baseType)) headers.set('Accept-Ranges', 'bytes')
      if (LOG) console.log('[SW] responding from -> blob:URL')
      return new Response(buf, { headers })
    }

    // 4) plain text (html/css/js/md/etc)
    if (typeof data === 'string') {
      // you already convert .md → HTML earlier; this just sends the string
      if (LOG) console.log('[SW] responding from -> plain text')
      return new Response(new Blob([data], { type: mimeType }), { headers })
    }

    // 5) last resort: stringify whatever it is
    const s = String(data ?? '')
    if (LOG) console.log('[SW] responding from -> stringified !!! fallack')
    return new Response(new Blob([s], { type: 'text/plain; charset=UTF-8' }), { headers })
  } catch (err) {
    console.error('[SW] Error generating response', err)
    throw new Error('Error generating response')
  }
}

// if a student has a large media file (like an image) or .js file (like a minified library) in their GH project
// it won't load when 'opening a project', instead we store the raw URL to the hosted file on github
// this handles (ie. proxies) requesting and returning that large file
async function handleProxyRequest (targetUrl, rangeHdr) {
  try {
    const headers = new Headers()
    if (rangeHdr) headers.set('Range', rangeHdr)

    const req = new Request(targetUrl, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      redirect: 'follow',
      headers
    })

    const res = await fetch(req)
    // 200 or 206 are both fine; we'll normalize headers below
    if (!res.ok && res.status !== 206) {
      console.warn('[SW] Proxy target returned', res.status, res.statusText)
      return new Response('Failed to fetch resource', { status: 502 })
    }

    // Derive MIME type from URL extension when upstream returns generic types
    const guessedType = getMimeType(targetUrl) || res.headers.get('content-type') || 'application/octet-stream'

    // Build a new headers object, preserving important range/cache headers and setting our own Content-Type
    const outHeaders = new Headers()
    // Preserve common useful headers
    const passthrough = [
      'content-length',
      'content-range',
      'accept-ranges',
      'etag',
      'last-modified',
      'cache-control'
    ]
    passthrough.forEach(h => { const v = res.headers.get(h); if (v) outHeaders.set(h, v) })
    // Always set content type based on extension or upstream hint
    outHeaders.set('Content-Type', guessedType)
    // Allow usage by media elements without CORS issues in same-origin SW response
    outHeaders.set('Access-Control-Allow-Origin', '*')
    // Ensure Range semantics are advertised for media
    if (/^(audio|video)\//.test(guessedType)) {
      if (!outHeaders.has('accept-ranges')) outHeaders.set('Accept-Ranges', 'bytes')
      outHeaders.set('Vary', 'Range')
    }

    // Return a new Response with adjusted headers while streaming body
    return new Response(res.body, {
      status: res.status,
      statusText: res.statusText,
      headers: outHeaders
    })
  } catch (err) {
    console.error('[SW] Proxy fetch error:', err)
    return new Response('Error: ' + err.message, { status: 500 })
  }
}

// in Chrome we were having issues seeking (ie. changint currentTime) in videos
// being resolved by the SW. Sometimes these vids are stored as http://raw
// urls on GitHub (those are handled separately) but other times they may be
// Blob's stored in IDB; respondWithRange handles ressolving rquests for
// "ranges" (ie. video seek) for these videos.
function parseRangeHeader (hdr, size) {
  if (!hdr || !hdr.startsWith('bytes=')) return null
  // we only handle a single range (what browsers send for media)
  const m = /^bytes=(\d*)-(\d*)$/.exec(hdr)
  if (!m) return null
  let start = m[1] === '' ? NaN : parseInt(m[1], 10)
  let end = m[2] === '' ? NaN : parseInt(m[2], 10)

  if (Number.isNaN(start) && Number.isNaN(end)) return null

  if (Number.isNaN(start)) {
    // suffix range: last N bytes
    const n = Math.min(end, size)
    start = size - n
    end = size - 1
  } else {
    if (Number.isNaN(end) || end >= size) end = size - 1
  }

  if (start < 0 || start > end || start >= size) return null
  return { start, end }
}

async function respondWithRange (filePath, data, rangeHdr, mimeType) {
  // normalize to a Blob so we can slice() cheaply
  let blob
  if (data instanceof Blob) {
    blob = data
  } else if (data instanceof ArrayBuffer) {
    blob = new Blob([data], { type: mimeType || 'application/octet-stream' })
  } else if (data instanceof Uint8Array) {
    blob = new Blob([data], { type: mimeType || 'application/octet-stream' })
  } else {
    // last-ditch fallback (shouldn’t happen because caller checks isBinary)
    const s = String(data ?? '')
    blob = new Blob([s], { type: mimeType || 'application/octet-stream' })
  }

  const size = blob.size
  const parsed = parseRangeHeader(rangeHdr, size)
  if (!parsed) {
    return new Response('Requested Range Not Satisfiable', {
      status: 416,
      headers: {
        'Content-Range': `bytes */${size}`,
        'Accept-Ranges': 'bytes',
        Vary: 'Range'
      }
    })
  }

  const { start, end } = parsed
  const chunk = blob.slice(start, end + 1)

  const headers = new Headers({
    'Content-Type': blob.type || mimeType || 'application/octet-stream',
    'Content-Length': String(chunk.size),
    'Content-Range': `bytes ${start}-${end}/${size}`,
    'Accept-Ranges': 'bytes',
    Vary: 'Range',
    'Cache-Control': 'no-store'
  })

  return new Response(chunk, { status: 206, headers })
}

// =============================================================================
// ============================================================ MISC FETCH UTILS
// =============================================================================

// in order to render markdown files
function markdownToHtml (md) {
  if (typeof md !== 'string') {
    throw new TypeError('Expected a string')
  }
  const escapeHtml = str => str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  // block dangerous URL schemes in links and images
  const safeUrl = url => /^(javascript|data|vbscript):/i.test(url.trim()) ? '#' : url.trim()
  // pull code blocks and inline code into placeholders before escaping so
  // their already-escaped content isn't double-escaped
  const slots = []
  const slot = html => { const id = `\x00${slots.length}\x00`; slots.push(html); return id }
  md = md.replace(/```([\s\S]*?)```/g, (_, code) => slot('<pre><code>' + escapeHtml(code) + '</code></pre>'))
  md = md.replace(/`([^`]+)`/g, (_, code) => slot('<code>' + escapeHtml(code) + '</code>'))
  // escape all remaining raw text — headers, bold, italic, paragraphs are now safe
  md = escapeHtml(md)
  // Headers (h1–h6) — content already escaped above
  md = md.replace(/^(#{1,6}) (.*)$/gm, (_, h, content) => `<h${h.length}>${content}</h${h.length}>`)
  // Bold and italic — content already escaped above
  md = md.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  md = md.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  md = md.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // Images and links — text/alt already escaped; validate URL scheme
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img src="${safeUrl(src)}" alt="${alt}">`)
  md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => `<a href="${safeUrl(href)}">${text}</a>`)
  // Unordered lists
  md = md.replace(/(?:^|\n)([-+*]) (.*?)(?=\n[^-*+]|$)/gs, match => {
    const items = match.trim().split('\n').map(item => {
      return '<li>' + item.replace(/^[-+*] /, '') + '</li>'
    }).join('')
    return '<ul>' + items + '</ul>'
  })
  // restore placeholders before paragraphs so <pre> lines are excluded below
  md = md.replace(/\x00(\d+)\x00/g, (_, i) => slots[parseInt(i)])
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

    const content = files[path]
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

// =============================================================================
// ============================================================= EVENT LISTENERS
// =============================================================================

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
  // bypass local Ollama API — must be before respondWith
  const reqUrl = new URL(event.request.url)
  if ((reqUrl.hostname === 'localhost' || reqUrl.hostname === '127.0.0.1') && reqUrl.port === '11434') return

  event.respondWith((async () => {
    try {
      const request = event.request

      // bypass not GET requests
      if (request.method !== 'GET') return fetch(request)
      if (request.method !== 'GET' && LOG) console.log('[SW] bypass non-GET', request.url)

      const url = new URL(request.url)
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

      // .......................................................................
      // ------------------------------------------------- TUTORIAL_MAKER lookup
      if (filePath.startsWith(TUT_PREFIX + '/')) {
        if (LOG) console.log('[SW] checking TUT:', filePath)
        const fileData = await getFileFromIndexedDB('tutorialMakerDB', filePath, opts)
        if (fileData && LOG) console.log('[SW] TUT data found!')
        if (fileData) return generateResponse(filePath, fileData)
        return fetch(request, { cache: 'no-store' })
      }

      // .......................................................................
      // ----------------------------------------------------- PROJ-FILES lookup
      if (LOG) console.log('[SW] checking path:', filePath)
      const proj = parseProjectPath(filePath)

      if (proj) {
        const { dbName, innerPath } = proj
        const lookup = innerPath || 'index.html'

        if (LOG) console.log('[SW] looking for file in PROJ:', dbName)
        let fileData = await getFileFromIndexedDB(dbName, lookup, opts)

        // --------------------------- ABSOLUTE URL passthrough (ex: raw GitHub)
        // now resolves seeking rquests on http://raw.github... vids as well
        const rangeHdr = request.headers.get('Range')
        const isMediaPath = /\.(mp4|webm|ogv|mp3|wav|weba|ogg|oga)$/i.test(lookup)
        const isBinary =
          fileData instanceof Blob ||
          fileData instanceof ArrayBuffer ||
          fileData instanceof Uint8Array

        // local media (bytes in IDB): serve a range slice (for video seeking)
        if (rangeHdr && isMediaPath && isBinary) {
          const mt = getMimeType(lookup) || 'application/octet-stream'
          return respondWithRange(lookup, fileData, rangeHdr, mt)
        }
        // otherwise handle absolute URL (string, ie. http://raw.github...)
        if (typeof fileData === 'string' && fileData.startsWith('http')) {
          // For media and all other absolute URLs, proxy them so we can
          // normalize headers (e.g., proper Content-Type) and preserve Range.
          return handleProxyRequest(fileData, rangeHdr)
        }

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

        // miss inside project → return a real 404 instead of letting the
        // request fall through to the dev server, which would respond with
        // the SPA's index.html and silently fail to parse as CSS / JS / an
        // image. Surfacing a 404 puts a clear error in DevTools and, for
        // HTML navigations, renders a helpful page in the iframe.
        const missExt = lookup.split('.').pop().toLowerCase()
        const isHtmlLike = missExt === 'html' || missExt === 'htm' || missExt === 'md'
        const safe = String(lookup)
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        const missBody = isHtmlLike
          ? `<!doctype html><html><body style="font-family:system-ui;padding:2rem;line-height:1.5">
               <h1>⚠️ 404: file not found</h1>
               <p>The file <code>${safe}</code> isn't in this project.</p>
               <p>Check your Project Files tree and the path in your code.</p>
             </body></html>`
          : `Not found in project: ${lookup}`
        return new Response(missBody, {
          status: 404,
          headers: {
            'Content-Type': (isHtmlLike ? 'text/html' : 'text/plain') + '; charset=utf-8'
          }
        })
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
