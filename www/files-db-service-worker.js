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

// NOTE: these must match values in FilesDB constructor
// these get overridden on message below (to ensure they are in sync)
let DB_NAME = 'netnetDB'
let DB_VERSION = 1
let STORE_NAME = 'filesStore'
let OBJ_NAME = 'files'
let LOG = false

function openDB () {
  return new Promise((resolve, reject) => {
    // Open a database, specifying the name and version
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    // Handle database upgrades
    request.onupgradeneeded = function (event) {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
        if (LOG) console.log(`Created object store ${STORE_NAME}`)
      }
    }

    // Handle successful database opening
    request.onsuccess = function (event) {
      const db = event.target.result
      if (LOG) console.log(`Successfully opened database ${DB_NAME}`)
      resolve(db)
    }

    // Handle errors in opening the database
    request.onerror = function (event) {
      console.error(`Failed to open database ${DB_NAME}: ${event.target.errorCode}`)
      reject(new Error(`Failed to open database ${DB_NAME}: ${event.target.errorCode}`))
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

async function getFileFromIndexedDB (filePath) {
  try {
    const db = await openDB()
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
    console.error('Error accessing the database', error)
    throw new Error('Error accessing the database')
  }
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

/*
TODO: function for sending messages to the client

(async () => {
  // Get all clients that are currently controlled by the service worker
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  })
  // Iterate through clients and send messages
  for (const client of clients) {
    client.postMessage({
      msg: 'CHECK_FOR_FILE',
      url: event.request.url
    })
    console.log('Message sent to client:', client.url)
  }
})()
*/

self.addEventListener('install', (event) => {
  self.skipWaiting() // Forces the waiting service worker to become the active service worker
})

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()) // Takes control of all clients immediately
})

// receiving messages from the client
self.addEventListener('message', event => {
  DB_NAME = event.data.dbName ? event.data.dbName : 'netnetDB'
  DB_VERSION = event.data.dbVersion ? event.data.dbVersion : 1
  STORE_NAME = event.data.storeName ? event.data.storeName : 'filesStore'
  OBJ_NAME = event.data.objName ? event.data.objName : 'files'
  LOG = event.data.log ? event.data.log : false
  if (LOG) console.log('message', event.data)
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  const filePath = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
  if (LOG) console.log('checking for file:', filePath)

  const comingFromNetnet = () => {
    const hosts = ['localhost', 'netnet.studio', 'dev.netnet.studio']
    return hosts.includes(url.hostname)
  }

  event.respondWith(
    (async () => {
      try {
        let fileData = await getFileFromIndexedDB(filePath)

        if (!fileData) { // check if they clicked on a link in their page to navigate to a new directory (with an index file in it)
          fileData = await getFileFromIndexedDB(filePath + '/index.html')
          if (fileData) {
            fileData = '⚠️ OOPS: it appears you clicked on a link navigating to a folder containing an index.html file, instead of navigating directly to that file. While this will work once published on the web, in order for me to render a preview here, you\'ll need to link directly to the index.html file in this folder. Make sure to add index.html to the end of the path you navigated to in your code.'
          }
        }

        if (fileData && fileData.startsWith('http') && comingFromNetnet()) {
          // assume absolute path in student project's code (whether from their actual code or localStorage like gitHub raw url)
          if (fileData.startsWith('https://raw.')) return handleProxyRequest(fileData)
          else return fetch(fileData, { cache: 'no-store' })
        } else if (fileData) {
          if (LOG) console.log('...fetching from IndexedDB:', filePath)
          if (filePath.endsWith('.html')) {
            // main.js listens for these errors + sends them to 'code-review' widget
            fileData = `<script>
              window.onerror = function (message, source, lineno) {
                window.parent.postMessage({ type: 'iframe-error', message, source, lineno }, '*')
              }
            </script>` + fileData
          } else if (filePath.endsWith('.md')) {
            fileData = markdownToHtml(fileData)
          }
          const response = await generateResponse(filePath, fileData)
          // if (LOG) console.log('DATA:', filePath, fileData)
          if (LOG) console.log('...RES:', response)
          return response
        } else {
          console.warn('...file not found in IndexedDB, fetching from network:', filePath)
          return fetch(event.request, { cache: 'no-store' })
        }
      } catch (err) {
        console.error('Error handling IndexedDB fetch:', err)
        return new Response('File not found or failed to load', { status: 404 })
      }
    })()
  )
})
