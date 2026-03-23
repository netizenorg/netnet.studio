/*

  NOTE: this is modeled on the same methods from the project-files widget
  we should avoid changes these so they remain compatible with that widget
  && it's corresponidng service worker (files-db-service-worker.js)
  if changes MUST be made, we should ensure the logic between these three
  files all stay in sync.

*/
const FILES = {
  db: null,
  dbName: 'tutorialMakerDB',
  storeName: 'filesStore',
  objName: 'files',
  dbVersion: 1,
  log: false,
  root: 'TUTORIAL_MAKER/[tutrial-id]',
  files: {},

  init: async (id, files) => {
    FILES.root = `TUTORIAL_MAKER/${id}/`
    await FILES._initServiceWorker() // setup service worker
    FILES.db = await FILES._initIndexedDB() // setup indexedDB
    await FILES._clearIndexedDB() // clear this store for fresh project state
    await FILES._saveFilesToIndexedDB()
    // loop through all the tutorials files && load them into files obj && db
    Object.entries(files).forEach(([key, val]) => FILES.updateFile(key, val))
    return FILES.files
  },

  updateFile: async (filepath, fileContent) => {
    // ensure path looks like "TUTORIAL_MAKER/[tutrial-id]/[file-path]"
    if (!filepath.startsWith(FILES.root)) {
      if (filepath.startsWith('TUTORIAL_MAKER/')) {
        filepath = filepath.split('TUTORIAL_MAKER/')[1]
      }
      filepath = FILES.root + filepath
    }

    if (!FILES.files[filepath]) { // create new file
      FILES.files[filepath] = { code: fileContent, path: filepath }
    } else { // update existing file
      FILES.files[filepath].code = fileContent
    }
    await FILES._saveFilesToIndexedDB()
  },

  deleteFile: async (filepath) => {
    if (!filepath.startsWith(FILES.root)) filepath = FILES.root + filepath

    if (FILES.files[filepath]) {
      if (typeof FILES.files[filepath].code === 'string' &&
        FILES.files[filepath].code.indexOf('blob') === 0) {
        URL.revokeObjectURL(FILES.files[filepath].code) // for memory management
      }
      delete FILES.files[filepath]
      await FILES._saveFilesToIndexedDB()
      if (FILES.log) console.log(`TUTORIAL FILE MANGAER: File '${filepath}' deleted successfully.`)
    } else {
      console.warn(`TUTORIAL FILE MANGAER: File '${filepath}' not found.`)
    }
  },

  readFile: (filepath) => {
    if (!filepath.startsWith(FILES.root)) filepath = FILES.root + filepath
    return FILES.files[filepath]?.code || null
  },

  listAllFiles: () => { return Object.keys(FILES.files) },

  // .....................
  // ..................... Initialize Service Worker
  // ...........................................................................
  _initServiceWorker: async () => {
    if (!('serviceWorker' in navigator)) {
      console.error('TUTORIAL FILE MANGAER: no service worker support in this browser')
      return
    }

    if (FILES.log) console.log('TUTORIAL FILE MANGAER: service worker loading')

    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener('message', event => {
      if (FILES.log) console.log('TUTORIAL FILE MANGAER: Message received from service worker:', event.data)
      // Handle the data received from the service worker
      FILES._handleServiceWorkerMessage(event.data)
    })

    try { // setup the service worker
      const reg = await navigator.serviceWorker.register('/files-db-service-worker.js', {
        scope: '/'
      })
      return reg.active || reg.waiting || reg.installing
    } catch (error) {
      console.error('TUTORIAL FILE MANGAER: error registering service worker', error)
    }
  },

  _handleServiceWorkerMessage: (message) => {
    if (FILES.log) console.log('SW MESSAGE:', message)
    if (message.type === 'BAD_PATHS') {
      for (const path in message.data) {
        const badPath = message.data[path].badPath
        const parts = path.split('/')
        const language = parts[parts.length - 1].split('.')[1]
        if (language === 'html' || language === 'css') {
          const loc = window.location
          const message = `Failed to load ‘${loc.protocol}//${loc.host}/${badPath}’. A ServiceWorker intercepted the request and encountered an unexpected error.`
          console.error('TUTORIAL FILE MANGAER:', message)
        }
      }
    }
  },

  // NOTE: FOR DEV PURPOSES ONLY
  _forceUnregisterServiceWorker: async () => {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.getRegistration('/files-db-service-worker.js')
    if (reg) await reg.unregister()
  },

  // .....................
  // .....................  IndexedDB methods
  // ...........................................................................
  _initIndexedDB: async () => {
    if (!window.indexedDB) {
      console.error('TUTORIAL FILE MANGAER: is not supported in this browser.')
      return
    }

    try {
      const request = window.indexedDB.open(FILES.dbName, FILES.dbVersion)
      const db = await new Promise((resolve, reject) => {
        request.onerror = event => {
          console.error('TUTORIAL FILE MANGAER: error:', event.target.error)
          reject(event.target.error)
        }
        request.onupgradeneeded = event => {
          const db = event.target.result
          if (!db.objectStoreNames.contains(FILES.storeName)) {
            db.createObjectStore(FILES.storeName)
          }
        }
        request.onsuccess = event => {
          resolve(event.target.result)
        }
      })

      return db
    } catch (error) {
      console.error('TUTORIAL FILE MANGAER: error initializing IndexedDB:', error)
    }
  },

  _clearIndexedDB: async () => {
    if (!FILES.db) {
      if (FILES.log) console.log('TUTORIAL FILE MANGAER: IndexedDB hasn\'t been not initialized yet.')
      return
    }

    try {
      if (!FILES.db.objectStoreNames.contains(FILES.storeName)) {
        if (FILES.log) console.log('TUTORIAL FILE MANGAER: store not found, nothing to clear.')
        FILES.files = {}
        return
      }

      const tx = FILES.db.transaction([FILES.storeName], 'readwrite')
      const store = tx.objectStore(FILES.storeName)
      const req = store.clear()

      await new Promise((resolve, reject) => {
        req.onerror = e => {
          console.error('TUTORIAL FILE MANGAER: IndexedDB clear error:', e.target.error)
          reject(e.target.error)
        }
        tx.oncomplete = () => resolve()
        tx.onerror = e => reject(e.target.error)
        tx.onabort = e => reject(e.target.error)
      })

      if (FILES.log) console.log('TUTORIAL FILE MANGAER: All data cleared from IndexedDB successfully.')
      FILES.files = {}
    } catch (error) {
      console.error('TUTORIAL FILE MANGAER: Error while clearing IndexedDB:', error)
    }
  },

  _saveFilesToIndexedDB: () => {
    const filesDict = {}
    Object.values(FILES.files).forEach(file => {
      if (file.code) filesDict[file.path] = file.code
    })

    return new Promise((resolve, reject) => {
      const transaction = FILES.db.transaction([FILES.storeName], 'readwrite')
      const objectStore = transaction.objectStore(FILES.storeName)
      const request = objectStore.put(filesDict, FILES.objName)

      request.onerror = (event) => {
        console.error('TUTORIAL FILE MANGAER: IndexedDB save error:', event.target.error)
        reject(event.target.error)
      }

      request.onsuccess = () => {
        if (FILES.log) console.log('TUTORIAL FILE MANGAER: Files saved to IndexedDB successfully.', FILES.dbName)
        resolve()
      }
    })
  }
}

window.FILES = FILES
