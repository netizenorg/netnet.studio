/* global self, clients, indexedDB, Blob, Response, Headers, fetch */
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

// NOTE: this method needs to stay in sync with the method in the Project Files widget
function getMimeType (filePath) {
  const extension = filePath.split('.').pop().toLowerCase()
  switch (extension) {
    case 'md': return 'text/markdown'
    case 'html': return 'text/html'
    case 'css': return 'text/css'
    case 'js': return 'text/javascript'
    case 'png': return 'image/png'
    case 'gif': return 'image/gif'
    case 'jpg': return 'image/jpeg'
    case 'jpeg': return 'image/jpeg'
    case 'svg': return 'image/svg+xml'
    case 'json': return 'application/json'
    case 'ico': return 'image/x-icon'
    case 'webp': return 'image/webp'
    case 'woff': return 'font/woff'
    case 'woff2': return 'font/woff2'
    case 'ttf': return 'font/ttf'
    case 'otf': return 'font/otf'
    case 'mp4': return 'video/mp4'
    case 'webm': return 'video/webm'
    case 'mp3': return 'audio/mpeg'
    case 'wav': return 'audio/wav'
    case 'txt': return 'text/plain'
    case 'xml': return 'application/xml'
    case 'pdf': return 'application/pdf'
    case 'zip': return 'application/zip'
    case 'csv': return 'text/csv'
    // Add more MIME types as needed
    default: return 'application/octet-stream'
  }
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
  try {
    const mimeType = getMimeType(filePath)
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

  event.respondWith(
    (async () => {
      try {
        const fileData = await getFileFromIndexedDB(filePath)
        if (fileData) {
          if (LOG) console.log('...fetching from IndexedDB:', filePath)
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
