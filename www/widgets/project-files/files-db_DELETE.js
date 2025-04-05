/*

  NOTE: THIS NEEDS TO BE MIGRATED INTO project-files

PROPERTIES:
  files   // dictionary object, { filename: data }
  sw      // reference to service worker

METHODS:
  initIndexedDB
  clearIndexedDB

  loadFilesFromIndexedDB
  saveFilesToIndexedDB

  handleImageUpload
  updateFile
  readFile
  deleteFile
  getFile
  listAllFiles

  readyToRender

  handleServiceWorkerMessage
  disableServiceWorker

*/
class FilesDB {
  constructor (opts) {
    this.dbName = 'netnetDB'
    this.storeName = 'filesStore'
    this.objName = 'files'
    this.files = {}
    this.dbVersion = 1
    this.sw = null // service worker
    this.onload = opts.onload
    this.log = opts.log
    this.initIndexedDB()

    // Listen for messages from the service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (this.log) console.log('FilesDB: Message received from service worker:', event.data)
        // Handle the data received from the service worker
        this.handleServiceWorkerMessage(event.data)
      })
    } else {
      console.error('FilesDB: no service worker support in this browser')
    }
  }

  handleServiceWorkerMessage (data) {
    console.log('MESSAGE:', data)
    // TODO Example: handle different types of messages from the service worker
    if (data.type === 'UPDATE_FILES') {
      // Update the files object with new data
      this.files = data.files
      if (this.log) console.log('FilesDB: Files updated from service worker message')
    }
  }

  async disableServiceWorker () {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration('/files-db-service-worker.js')
      if (registration) {
        await registration.unregister()
        this.sw = null
        if (this.log) console.log('FilesDB: Service worker unregistered successfully')
      } else {
        if (this.log) console.log('FilesDB: No service worker found to unregister')
      }
    }
  }

  // Initialize IndexedDB
  async initIndexedDB () {
    if (!window.indexedDB) {
      console.error('FilesDB: is not supported in this browser.')
      return
    }

    const request = window.indexedDB.open(this.dbName, this.dbVersion)

    request.onerror = (event) => {
      console.error('FilesDB: error:', event.target.error)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(this.storeName)) {
        db.createObjectStore(this.storeName)
      }
    }

    request.onsuccess = (event) => {
      this.db = event.target.result
      this.loadFilesFromIndexedDB()
    }
  }

  async clearIndexedDB () {
    if (!this.db) {
      console.error('FilesDB: IndexedDB is not initialized.')
      return
    }

    const transaction = this.db.transaction([this.storeName], 'readwrite')
    const objectStore = transaction.objectStore(this.storeName)
    const request = objectStore.clear()

    request.onerror = (event) => {
      console.error('FilesDB: IndexedDB clear error:', event.target.error)
    }

    request.onsuccess = () => {
      if (this.log) console.log('FilesDB: All data cleared from IndexedDB successfully.')
      this.files = {} // Clear the in-memory files object as well
      this.disableServiceWorker() // disable the service worker
    }
  }

  // Load the files object from IndexedDB
  loadFilesFromIndexedDB () {
    if (!this.db.objectStoreNames.contains(this.storeName)) {
      console.error(`FilesDB: load error: '${this.storeName}' is not a known object store name.`)
      return
    }
    const transaction = this.db.transaction([this.storeName], 'readonly')
    const objectStore = transaction.objectStore(this.storeName)
    const request = objectStore.get(this.objName)

    request.onerror = (event) => {
      console.error('FilesDB: load error:', event.target.error)
    }

    request.onsuccess = (event) => {
      const data = event.target.result
      if (this.log) console.log('FilesDB: requested db, data is:', typeof data)
      if (data) {
        // load files from indexedDB
        this.files = data
        if (this.log) console.log('FilesDB: Files loaded from IndexedDB successfully.')
      }

      // setup service worker to intercept iFrame requests
      if ('serviceWorker' in navigator) {
        if (this.log) console.log('FilesDB: service worker loading')
        navigator.serviceWorker.register('/files-db-service-worker.js', {
          scope: '/'
        }).then(reg => {
          this.sw = reg.installing || reg.waiting || reg.active
          if (this.log) console.log('FilesDB: service workiner is registered')
        }).then(() => {
          if (this.sw) {
            this.sw.postMessage({
              dbName: this.dbName,
              dbVersion: this.dbVersion,
              storeName: this.storeName,
              objName: this.objName,
              log: this.log
            })
          }
        })

        if (this.log && navigator.serviceWorker.controller) {
          if (this.log) console.log('FilesDB: we have a service worker installed')
        }
      } else {
        console.error('FilesDB: no service worker support in this browser')
      }

      // fire onload...
      if (typeof this.onload === 'function') this.onload()
    }
  }

  // Save the files object to IndexedDB
  saveFilesToIndexedDB () {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const objectStore = transaction.objectStore(this.storeName)
      const request = objectStore.put(this.files, this.objName)

      request.onerror = (event) => {
        console.error('FilesDB: IndexedDB save error:', event.target.error)
        reject(event.target.error)
      }

      request.onsuccess = () => {
        if (this.log) console.log('FilesDB: Files saved to IndexedDB successfully.')
        resolve()
      }
    })
  }

  handleImageUpload (event, cb) {
    const file = event.target.files[0]
    const self = this
    console.log(self)
    if (file) {
      const reader = new window.FileReader()
      reader.onload = function (e) {
        const binaryData = e.target.result
        self.files[file.name] = binaryData
        if (cb) cb(file)
        self.saveFilesToIndexedDB()
      }
      reader.readAsArrayBuffer(file)
    }
  }

  // Update a specific file in the files object
  async updateFile (filePath, fileContent) {
    this.files[filePath] = fileContent
    await this.saveFilesToIndexedDB()
  }

  // Read a specific file from the files object
  readFile (filePath) {
    return this.files[filePath] || null // Return the file content or null if the file doesn't exist
  }

  getFile (filePath) {
    const path = filePath
    let data = this.readFile(filePath)
    if (!data) data = ''

    const arr = filePath.split('.')
    const name = arr[arr.length - 2]
    const ext = arr[arr.length - 1]
    const sansFile = filePath.substring(0, filePath.lastIndexOf('/'))
    const dir = sansFile.endsWith('/') ? sansFile.slice(0, -1) : sansFile

    let lang = 'binary'
    if (ext === 'html') lang = 'html'
    else if (ext === 'css') lang = 'css'
    else if (ext === 'js') lang = 'javascript'

    return { data, lang, dir, name, ext, path }
  }

  async deleteFile (filePath) {
    if (this.files[filePath]) {
      delete this.files[filePath]
      await this.saveFilesToIndexedDB()
      if (this.log) console.log(`FilesDB: File '${filePath}' deleted successfully.`)
    } else {
      console.warn(`FilesDB: File '${filePath}' not found.`)
    }
  }

  // List all files in the store
  listAllFiles () {
    return Object.keys(this.files)
  }

  readyToRender () {
    return this.sw && this.listAllFiles().length > 0
  }
}
