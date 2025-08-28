/* global self, clients, indexedDB, Blob, Response, Headers, fetch, Request */
/*

this class is used to intercept requests coming from the website (specifically
the iframe rendering the output) and resolve those by returning the data stored
in indexedDB via the project-files widget.
 ___________________                                  ________________
|        www         |                               | service-worker |
| netitor | <iframe> |<------ send res to -----------|________________|
|____\_______________|                                           |
      \__                 _______________                        /
         \__ save to --> | project-files | ->>- pass data to ___/
                         |   IndexedDB   |
                         |_______________|

 this is also now being used by the Tutorial Maker widget, so any local tutorial
 files (which will eventually be in www/tutorials) which get loaded from a zip
 can be stored in indexedDB while working on tutorials and resolved correctly.

// NOTE: for debug console visit "about:debugging" in Firefox
*/

const DEFAULT_CFG = {
  dbName: 'netnetDB',
  dbVersion: 1,
  storeName: 'filesStore',
  objName: 'files',
  log: false
}

const TUTORIAL_MAKER_PATH = 'TUTORIAL_MAKER'
const TUTORIAL_MAKER_CFG = {
  dbName: 'tutorialMakerDB',
  dbVersion: 1,
  storeName: 'filesStore',
  objName: 'files',
  log: false
}

// one SW controls all tabs (if multiple projs open); track a config per client
const clientConfigs = new Map() // clientId -> cfg
const parentOf = new Map() // childId -> topId

async function getCfgForClientAsync (clientId, requestUrl, preferId) {
  // 1) exact hit
  if (clientId && clientConfigs.has(clientId)) return clientConfigs.get(clientId)

  // 2) try to “inherit” from a top-level window with same origin
  const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  const reqOrigin = new URL(requestUrl).origin

  // If we know which client id we prefer (e.g. resultingClientId for navigations), try that one’s origin first
  let candidateTop = null
  if (preferId) {
    const prefer = await self.clients.get(preferId)
    if (prefer) {
      const topWithCfgSameOrigin = all.find(c =>
        c.frameType === 'top-level' &&
        new URL(c.url).origin === reqOrigin &&
        clientConfigs.has(c.id)
      )
      candidateTop = topWithCfgSameOrigin || null
    }
  }
  // Otherwise just pick any top-level same-origin client that already registered a cfg
  if (!candidateTop) {
    candidateTop = all.find(c =>
      c.frameType === 'top-level' &&
      new URL(c.url).origin === reqOrigin &&
      clientConfigs.has(c.id)
    ) || null
  }

  if (candidateTop) {
    const cfg = clientConfigs.get(candidateTop.id)
    // cache it for this nested client so future subresource fetches don’t have to search again
    if (clientId) {
      clientConfigs.set(clientId, cfg)
      parentOf.set(clientId, candidateTop.id)
    }
    return cfg
  }

  // 3) no config known → signal “no project” so you fall through to network
  return null
}

// prune configs for closed clients
async function pruneDeadClients () {
  const alive = new Set((await self.clients.matchAll({ type: 'window', includeUncontrolled: true })).map(c => c.id))
  for (const id of clientConfigs.keys()) {
    if (!alive.has(id)) clientConfigs.delete(id)
  }
}

function openDB (cfg) {
  if (cfg?.log) console.log('[SW] openDB', cfg.dbName)
  return new Promise((resolve, reject) => {
    // Open a database, specifying the name and version of specific tab (ie. cfg)
    const req = indexedDB.open(cfg.dbName, cfg.dbVersion)
    // Handle database upgrades
    req.onupgradeneeded = e => {
      const db = e.target.result
      if (!db.objectStoreNames.contains(cfg.storeName)) db.createObjectStore(cfg.storeName)
    }
    // Handle successful database opening
    req.onsuccess = e => resolve(e.target.result)
    // Handle errors in opening the database
    req.onerror = e => reject(new Error('Failed to open DB: ' + e.target.error))
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

async function getKVFromDB (key, cfg) {
  const db = await openDB(cfg)
  const tx = db.transaction([cfg.storeName], 'readonly')
  const store = tx.objectStore(cfg.storeName)
  return new Promise((resolve, reject) => {
    const getReq = store.get(key)
    getReq.onsuccess = () => resolve(getReq.result || false)
    getReq.onerror = () => reject(new Error('IndexedDB read error'))
  })
}

const getFileFromIndexedDB = async (filePath, cfg) => {
  const dict = await getKVFromDB(cfg.objName, cfg)
  if (dict && dict[filePath]) return dict[filePath]
  return false
}

const getAllFilesFromIndexedDB = async (cfg) => {
  const dict = await getKVFromDB(cfg.objName, cfg)
  return dict || false
}

const tryGetFromIDB = async (path, cfg, isIframe) => {
  // if in tutorial mode and this is an iframe, try prefixed path first
  if (cfg?.prefix && isIframe) {
    const prefixed = cfg.prefix + path
    const hit = await getFileFromIndexedDB(prefixed, cfg)
    if (hit) return { data: hit, path: prefixed }
  }
  // otherwise (or if prefix miss), try the raw path
  const hit = await getFileFromIndexedDB(path, cfg)
  if (hit) return { data: hit, path }
  return { data: null, path }
}

async function generateResponse (filePath, data) {
  try { // NOTE: render .md as HTML (see markdownToHtml in fetch listener below)
    const mimeType = filePath.endsWith('.md') ? 'text/html; charset=UTF-8' : getMimeType(filePath)
    const headers = new Headers({
      'Content-Type': mimeType,
      'Access-Control-Allow-Origin': '*'
    })

    let blob
    if (data.startsWith('blob:')) {
      // Fetch the actual Blob data from the blob URL
      const response = await fetch(data)
      blob = await response.blob()
    } else {
      blob = new Blob([data], { type: mimeType })
    }

    return new Response(blob, { headers })
  } catch (error) {
    console.error('Error generating response', error)
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
      console.warn('Proxy target returned', res.status, res.statusText)
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
    console.error('Proxy fetch error:', err)
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

async function findFileReferences (filePath, cfg) {
  const files = await getAllFilesFromIndexedDB(cfg)
  const before = ['src="', 'href="', 'url(', 'poster="']
  const result = {}
  if (!files) return result

  for (const path in files) {
    const content = files[path]
    const lines = content.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      for (const prefix of before) {
        if (line.includes(prefix + filePath)) {
          result[path] = {
            lineNo: i + 1,
            line: line,
            badPath: filePath
          }
          break
        }
      }
      if (result[path]) break
    }
  }
  return result
}

// send a message to the client (see _handleServiceWorkerMessage in project-files widget)
async function postMessageToClient (clientId, type, data) {
  const c = await self.clients.get(clientId)
  if (c) c.postMessage({ type, data })
}

self.addEventListener('install', (event) => {
  self.skipWaiting() // Forces the waiting service worker to become the active service worker
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()) // Takes control of all clients immediately
})

// receiving messages from the client
self.addEventListener('message', event => {
  const id = event?.source?.id
  if (!id) return
  const data = event.data || {}

  // ...................... tutorial mode iframe routing ......................
  if (data.type === 'SET_TUTORIAL_MODE') {
    if (data.enabled) {
      const slug = String(data.slug || '').trim()
      const prefix = slug ? `TUTORIAL_MAKER/${slug}/` : ''
      clientConfigs.set(id, { ...TUTORIAL_MAKER_CFG, prefix })
      if (TUTORIAL_MAKER_CFG.log) console.log('[SW] tutorial ON', id, prefix)
    } else {
      // turn OFF: remove this tab's cfg and any inherited child mappings
      clientConfigs.delete(id)
      if (typeof parentOf !== 'undefined') {
        for (const [childId, topId] of parentOf.entries()) {
          if (topId === id) {
            parentOf.delete(childId)
            clientConfigs.delete(childId)
          }
        }
      }
      if (DEFAULT_CFG.log) console.log('[SW] tutorial OFF', id)
    }
    pruneDeadClients()
    return
  }

  // ...................... project-files mode cfg's ......................
  if (
    data.dbName || data.dbVersion || data.storeName || data.objName || typeof data.log === 'boolean'
  ) {
    const cfg = {
      dbName: data.dbName || DEFAULT_CFG.dbName,
      dbVersion: data.dbVersion || DEFAULT_CFG.dbVersion,
      storeName: data.storeName || DEFAULT_CFG.storeName,
      objName: data.objName || DEFAULT_CFG.objName,
      log: !!data.log
    }
    clientConfigs.set(id, cfg)
    if (cfg.log) console.log('[SW] config set for client', id, cfg)
    pruneDeadClients()
  }
})

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      const request = event.request
      const url = new URL(request.url)
      const filePath = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname

      const clientId = event.resultingClientId || event.clientId
      const cfg = filePath.startsWith(TUTORIAL_MAKER_PATH + '/')
        ? TUTORIAL_MAKER_CFG : await getCfgForClientAsync(clientId, url)

      let isIframe = false // is req coming from iframe or main netnet
      try {
        if (clientId) {
          const cli = await self.clients.get(clientId)
          isIframe = !!cli && cli.frameType !== 'top-level'
        }
      } catch (_) {}

      if (request.mode === 'navigate' && cfg?.log) {
        console.log('[SW] NAV', { path: url.pathname, clientId })
      }
      if (cfg?.log) console.log('[SW] fetch', { clientId, filePath, cfg })

      // not an iframe request, then let it pass through
      const hasProjectCfg = cfg && cfg.dbName && cfg.storeName
      if (!hasProjectCfg) {
        return fetch(request, { cache: 'no-store' })
      }

      const hosts = ['localhost', 'netnet.studio', 'dev.netnet.studio']
      const comingFromNetnet = hosts.includes(url.hostname)

      // ----------------------------------------------------- MAIN file lookup
      // let fileData = await getFileFromIndexedDB(filePath, cfg)
      // if (cfg?.log) console.warn('[SW] fileData:', fileData)
      let { data: fileData, path: lookedUpPath } = await tryGetFromIDB(filePath, cfg, isIframe)
      if (cfg?.log) console.warn('[SW] lookup', { requestPath: filePath, lookedUpPath, hit: !!fileData })

      // ------------------------------------------- FOLDER index.html fallback
      if (!fileData) {
        const idx = await tryGetFromIDB(filePath + '/index.html', cfg, isIframe)
        if (idx.data) {
          fileData = '⚠️ OOPS: it appears you clicked on a link navigating to a folder containing an index.html file... add index.html to the end of the path you navigated to.'
          lookedUpPath = idx.path
        }
      }

      // ----------------------------------------------------- BAD PATHS helper
      // ex: trying to link (src, href, ) to a local file that does not exist
      if (!fileData) {
        const bads = await findFileReferences(filePath, cfg)
        if (bads && Object.keys(bads).length > 0 && clientId) {
          await postMessageToClient(clientId, 'BAD_PATHS', bads)
        }
      }

      // ---------------------------- ABSOLUTE URL passthrough (ex: raw GitHub)
      if (fileData && typeof fileData === 'string' && fileData.startsWith('http') && comingFromNetnet) {
        if (fileData.startsWith('https://raw.')) return handleProxyRequest(fileData)
        return fetch(fileData, { cache: 'no-store' })
      }

      // ------------------------------------------------- SERVE FROM IndexedDB
      if (fileData) {
        if (cfg?.log) console.log('[SW] serving from IDB:', lookedUpPath || filePath)
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
        return generateResponse(filePath, body)
      }

      // ------------------------------------------- else, pass request through
      if (cfg?.log) console.warn('[SW] miss; falling back to network:', filePath)
      return fetch(request, { cache: 'no-store' })
    } catch (err) {
      console.error('[SW] fetch error:', err)
      return new Response('File not found or failed to load', { status: 404 })
    }
  })())
})
