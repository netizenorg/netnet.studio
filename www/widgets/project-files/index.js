/* global NNE, NNW, WIDGETS, Widget, Convo, utils, nn */
/*

this widget is used to store project files in local storage, it works in tandem
with /files-db-service-worker.js (in root), which is used to resolve requests
made from this site for any of the files stored in the indexedDB
 __________                                           ________________
|    www   |                                         | service-worker |
| <iframe> | <--------- send res to -----------------|________________|
|_ netitor_|                                                      |
     \__                 _______________                        /
        \__ save to --> | project-files | <--- get data from __/
                        |   IndexedDB   |
                        |_______________|

this file also sends various API calls to my_modules/github.js

*/
class ProjectFiles extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'project-files'
    this.keywords = ['assets', 'upload', 'github', 'files', 'project', 'finder']
    this.title = 'Project Files'
    // this.shaDict = {}

    // indexedDB file data store
    this.log = true // debug logging
    this.dbName = 'netnetDB'
    this.storeName = 'filesStore'
    this.objName = 'files'
    this.dbVersion = 1
    this.files = {} // GitHub info, includes {name, sha, type, etc} + code
    this.db = null // IndexedDB, only { name: code }
    this.sw = null // service worker

    // state
    this.rendering = null // which html file is rendered in iframe

    this._createHTML()
    // this._setupFileUploader()

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('open', () => { window.convo = new Convo(this.convos, 'explain') })

    window.addEventListener('beforeunload', async () => {
      this._clearIndexedDB(true)
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. GUI methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML () {
    const loggedInMsg = 'You\'re currently working on a "<b>sketch</b>", that\'s what we call a web page made from a single HTML file. If you\'d like to work on "<b>project</b>" consisting of multiple files/assets which can be published on the web, we can either <span class="inline-link" onclick="WIDGETS[\'project-files\'].openProject()">open a project</span> you have stored on GitHub or we could <span class="inline-link" onclick="WIDGETS[\'project-files\'].newProject()">create a new one?</span>'

    const loggedOutMsg = 'You\'re currently working on a "<b>sketch</b>", that\'s what we call a web page made from a single HTML file. To create a "<b>project</b>" consisting of multiple files/assets which can be published on the web you\'ll need to <span class="inline-link" onclick="WIDGETS[\'functions-menu\']._login()">authenticate your GitHub account</span>. This is because we don\'t store any data on our servers, instead your projects are stored as repositories in your own GitHub account. If you\'re not familiar with <a href="https://github.com/" target="_blank">GitHub</a>, don\'t worry, you won\'t need to interact with it directly, we\'ll walk you through all the steps here in the studio.'

    const loggedIn = WIDGETS['student-session'].getData('owner')

    this.innerHTML = `
      <div class="files-widget">
        <!-- if project is not open -->
        <div class="files-widget__disclaimer">
          ${loggedIn ? loggedInMsg : loggedOutMsg}
        </div>
        <!-- if project is open -->
        <div class="files-widget__header">
          <button class="pill-btn" name="upload">Upload Asset</button>
        </div>
        <ul class="files-widget__list">
          <!-- upldateFiles populates this div -->
        </ul>
      </div>
    `

    this._showHideDivs()

    // this.updateFiles()
  }

  _showHideDivs () {
    const op = window.sessionStorage.getItem('opened-project')
    if (!op) {
      this.$('.files-widget__disclaimer').style.display = 'block'
      this.$('.files-widget__header').style.display = 'none'
      this.$('.files-widget__list').style.display = 'none'
    } else {
      this.$('.files-widget__disclaimer').style.display = 'none'
      this.$('.files-widget__header').style.display = 'block'
      this.$('.files-widget__list').style.display = 'block'
    }
  }

  _updateFilesGUI () {
    // runs everytime a new repo (github project) is created or opened
    // as well as anytime a file is uploaded or deleted
    this._showHideDivs()
    this.$('.files-widget__list').innerHTML = ''

    Object.keys(this.files).forEach(file => {
      const ele = document.createElement('li')
      ele.className = 'files-widget__file'

      const name = document.createElement('span')
      name.className = 'files-widget__name'
      name.textContent = file

      const del = document.createElement('span')

      const trash = '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M4230.9,4975.2c-271.7-74.3-476.8-241-607.6-497.3c-69.2-138.4-71.8-153.8-79.5-625.5c-7.7-464-7.7-484.5,46.1-540.9c151.2-161.5,556.3-125.6,638.3,56.4c15.4,35.9,28.2,220.5,28.2,430.7c0,335.8,5.1,376.8,51.3,423c28.2,28.2,76.9,56.4,110.2,64.1c30.8,7.7,320.4,12.8,643.5,7.7l584.5-7.7l61.5-71.8c59-69.2,61.5-87.2,61.5-464c0-423,0-423,153.8-502.5c89.7-48.7,330.7-43.6,428.1,7.7c133.3,69.2,141,107.7,130.7,592.2c-7.7,428.1-10.3,440.9-87.1,605c-100,212.8-258.9,371.7-471.7,471.7l-166.6,79.5l-692.1,5.1C4510.4,5013.7,4343.7,5006,4230.9,4975.2z"/><path d="M2936.4,4616.3c-753.7-182-1286.9-435.8-1591.9-758.8c-269.2-284.5-343.5-499.9-343.5-994.6c0-474.3,74.3-710.1,294.8-945.9l110.2-117.9l182-1768.8c100-974.1,223-2171.3,271.7-2666.1c89.7-892.1,92.3-897.2,179.4-1079.2c258.9-530.7,956.2-874.2,2102.1-1040.8c358.9-51.3,1463.8-43.6,1832.9,15.4c1074.1,166.6,1748.3,512.7,1997,1020.3c92.3,184.6,61.5-61.5,505,4288.8l123.1,1204.8l105.1,128.2c248.7,299.9,294.8,448.6,294.8,961.3c0,487.1-43.6,640.9-253.8,917.7c-251.2,328.1-974.1,687-1709.8,846l-233.3,48.7l48.7-130.7c28.2-71.8,58.9-220.5,66.6-333.3l17.9-202.5l256.3-71.8c825.4-230.7,1274.1-594.7,1168.9-951.1c-43.6-146.1-269.2-364-502.4-487.1c-1322.8-687-4258-705-5639.7-30.8c-512.7,248.7-689.6,543.5-512.7,846c148.7,253.8,584.5,479.4,1335.6,689.6c15.4,5.1,35.9,87.2,43.6,184.6c7.7,97.4,38.4,246.1,66.7,330.7c28.2,82,48.7,151.2,46.2,153.8C3195.3,4675.3,3077.4,4649.6,2936.4,4616.3z M2741.5,1145.3c100-28.2,243.5-156.4,299.9-264c25.6-48.7,92.3-605,205.1-1691.9c89.7-892.1,182-1779.1,202.5-1971.4c20.5-192.3,38.5-415.3,38.5-492.2c0-123-7.7-146.1-79.5-205.1c-174.3-148.7-474.3-17.9-558.8,246.1C2821-3143.4,2408.3,748,2408.3,940.2c-2.6,92.3,10.3,125.6,66.7,171.8C2549.3,1176.1,2608.2,1183.8,2741.5,1145.3z M7548.1,1117.1c56.4-43.6,66.6-71.8,66.6-179.4c0-192.3-405-4047.8-438.3-4163.1c-56.4-202.5-289.7-356.3-471.7-310.2c-76.9,20.5-158.9,102.5-171.8,176.9c-20.5,112.8,407.6,4160.6,448.6,4237.5C7107.2,1117.1,7394.3,1240.2,7548.1,1117.1z M5187.1,783.8c30.8-15.4,76.9-53.8,100-84.6c41-48.7,46.2-205.1,46.2-2199.5v-2143.1l-64.1-79.5c-169.2-197.4-507.6-143.5-576.8,94.9c-20.5,64.1-25.6,751.1-20.5,2186.7c7.7,2053.4,7.7,2094.4,59,2150.8c28.2,30.8,74.3,66.7,102.5,79.5C4910.3,819.7,5123,817.2,5187.1,783.8z"/></g></svg>'
      const receptacle = document.createElement('span')
      receptacle.innerHTML = trash
      del.appendChild(receptacle)

      del.className = 'files-widget__del files-widget--pointer'
      del.addEventListener('click', () => this.deleteFile(file))

      ele.appendChild(name)
      ele.appendChild(del)
      this.$('.files-widget__list').appendChild(ele)
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  openProject (repo) {
    this.convos = window.CONVOS[this.key](this)
    if (!repo) {
      window.convo = new Convo(this.convos, 'open-project')
    } else {
      WIDGETS['student-session'].clearSaveState()
      const owner = WIDGETS['student-session'].getData('owner')

      // load data for all the files
      utils.post('./api/github/open-all-files', { repo, owner }, async (res) => {
        if (!res.success) return this._ohNoErr(res)

        if (Object.keys(res.data).includes('index.html')) {
          NNE.addCustomRoot(null)
          // utils.updateURL(`?gh=${owner}/${repo}`) // TODO: uncommment && test once open file is working

          // update student session data
          const htmlUrl = res.data['index.html'].html_url
          const branch = (htmlUrl.includes('/blob/master')) ? 'master' : 'main'
          const url = (htmlUrl.includes('/blob/master'))
            ? htmlUrl.split('/blob/master')[0] : htmlUrl.split('/blob/main')[0]
          WIDGETS['student-session'].setProjectData({ url, branch, name: repo })

          await this._clearIndexedDB(true) // reset indexedDB && kill service worker
          this.sw = await this._initServiceWorker() // setup service worker
          this.db = await this._initIndexedDB() // setup indexedDB
          // setup netitor's custom renderer to work with service worker
          this._setCustomRenderer()

          // load all the data
          Object.entries(res.data).forEach((arr) => {
            const name = arr[0]
            const data = arr[1]
            const mimetype = this._getMimeType(name)
            this.files[name] = data
            let code // store plain-text/code
            if (mimetype.split('/')[0] === 'text' || mimetype === 'application/json') {
              code = utils.atob(data.content)
            } else { // otherwise assume binary file && store blob-url
              code = this._base64ToBlob(data.content, mimetype)
            }
            this._updateFile(name, code)
          })

          // update last commit data
          const filename = 'index.html'
          utils.post('./api/github/get-commits', { filename, repo, owner }, (res) => {
            if (!res.success) return this._ohNoErr(res)
            const msg = res.data[0].commit.message
            WIDGETS['student-session'].setData('last-commit-msg', msg)
          })

          this._updateFilesGUI()
          // TODO: show/hide screen blocker

          // open the index.html file by default
          this.openFile('index.html')
        } else {
          this.files = {}
          window.convo = new Convo(this.convos, 'not-a-web-project')
        }
      })
    }
  }

  openFile (filename) {
    const extension = filename.split('.').pop().toLowerCase()
    if (extension === 'html') this.rendering = filename

    const repo = WIDGETS['student-session'].getData('opened-project')
    NNW.updateTitleBar(`${repo}/${filename}`) // TODO: might need to update for nested files

    NNE.code = this.files[filename].code
    if (NNW.layout === 'welcome') NNW.layout = 'dock-left'

    setTimeout(() => {
      NNW.menu.switchFace('default')
      if (!NNE.autoUpdate) NNE.update() // NOTE: TODO: probably want to change auto-update when working on projects
      window.convo = new Convo(this.convos, 'project-opened')
    }, utils.getVal('--layout-transition-time'))
  }

  deleteFile (filename) {
    console.log(`delete ${filename}`);
  }

  newProject () {
    // TODO: display netnet convo for naming a new project (&& creating a repo)
    console.log('new project')
  }

  saveCurrentFile () {
    // this.convos = window.CONVOS[this.key](this)
    // TODO: create convo logic for this.

    // TODO: save currently opened file
    console.log('PF: saveCurrentFile');
  }

  // List all files in the store
  listAllFiles () {
    return Object.keys(this.files)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _ohNoErr (res) {
    console.log('ProjectFiles:', res)
    window.convo = new Convo(this.convos, 'oh-no-error')
  }

  _readyToRender () {
    return this.sw && this.listAllFiles().length > 0
  }

  _setCustomRenderer () {
    NNE.customRender = (eve) => {
      if (this._readyToRender()) {
        eve.iframe.src = this.rendering || 'index.html'
        console.log('rendered this.rendering')
      } else {
        // eve.iframe.srcdoc = eve.code
        eve.update(eve.code)
        console.log('rendered default')
      }
    }
  }

  _base64ToBlob (base64, mimeType) {
    mimeType = mimeType || ''
    const sliceSize = 1024
    const byteCharacters = window.atob(base64)
    const byteArrays = []

    for (let offset = 0, len = byteCharacters.length; offset < len; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    const blob = new window.Blob(byteArrays, { type: mimeType })
    return URL.createObjectURL(blob)
  }

  // Update a specific text file in the files object
  async _updateFile (filePath, fileContent) {
    this.files[filePath].code = fileContent
    await this.saveFilesToIndexedDB()
  }

  // .....................
  // ..................... Initialize Service Worker
  // ...........................................................................
  async _initServiceWorker () {
    if (!('serviceWorker' in navigator)) {
      console.error('ProjectFiles: no service worker support in this browser')
      return
    }

    if (this.log) console.log('ProjectFiles: service worker loading')

    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener('message', event => {
      if (this.log) console.log('ProjectFiles: Message received from service worker:', event.data)
      // Handle the data received from the service worker
      this._handleServiceWorkerMessage(event.data)
    })

    try { // setup the service worker
      const reg = await navigator.serviceWorker.register('/files-db-service-worker.js', {
        scope: '/'
      })

      const sw = reg.installing || reg.waiting || reg.active
      if (this.log) console.log('ProjectFiles: service worker is registered')

      if (sw) {
        sw.postMessage({
          dbName: this.dbName,
          dbVersion: this.dbVersion,
          storeName: this.storeName,
          objName: this.objName,
          log: this.log
        })
      }

      if (this.log && navigator.serviceWorker.controller) {
        console.log('ProjectFiles: we have a service worker installed')
      }

      return sw
    } catch (error) {
      console.error('ProjectFiles: error registering service worker', error)
    }
  }

  _handleServiceWorkerMessage (data) {
    if (this.log) console.log('MESSAGE:', data)
    // if (data.type === 'UPDATE_FILES') {
    //   // Update the files object with new data
    //   this.files = data.files
    //   if (this.log) console.log('ProjectFiles: Files updated from service worker message')
    // } else {
    //   if (this.log) console.log('ProjectFiles: _handleServiceWorkerMessage disregarded message')
    //   // TODO Example: handle different types of messages from the service worker
    // }
  }

  async _disableServiceWorker () {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration('/files-db-service-worker.js')
      if (registration) {
        await registration.unregister()
        this.sw = null
        if (this.log) console.log('ProjectFiles: Service worker unregistered successfully')
      } else {
        if (this.log) console.log('ProjectFiles: No service worker found to unregister')
      }
    }
  }

  // .....................
  // ..................... Initialize IndexedDB
  // ...........................................................................
  async _initIndexedDB () {
    if (!window.indexedDB) {
      console.error('ProjectFiles: is not supported in this browser.')
      return
    }

    try {
      const request = window.indexedDB.open(this.dbName, this.dbVersion)
      const db = await new Promise((resolve, reject) => {
        request.onerror = event => {
          console.error('ProjectFiles: error:', event.target.error)
          reject(event.target.error)
        }
        request.onupgradeneeded = event => {
          const db = event.target.result
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName)
          }
        }
        request.onsuccess = event => {
          resolve(event.target.result)
        }
      })

      return db
    } catch (error) {
      console.error('ProjectFiles: error initializing IndexedDB:', error)
    }
  }

  async _clearIndexedDB (disableServiceWorker) {
    if (!this.db) {
      if (disableServiceWorker) await this._disableServiceWorker()
      if (this.log) console.log('ProjectFiles: IndexedDB hasn\'t been not initialized yet.')
      return
    }

    try {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const objectStore = transaction.objectStore(this.storeName)
      const request = objectStore.clear()

      await new Promise((resolve, reject) => {
        request.onerror = event => {
          console.error('ProjectFiles: IndexedDB clear error:', event.target.error)
          reject(event.target.error)
        }
        request.onsuccess = () => resolve()
      })

      if (this.log) console.log('ProjectFiles: All data cleared from IndexedDB successfully.')
      // Clear the in-memory files object as well
      this.files = {}
      // disable the service worker
      if (disableServiceWorker) await this._disableServiceWorker()
    } catch (error) {
      console.error('ProjectFiles: Error while clearing IndexedDB:', error)
    }
  }

  // save the "code" in this.files into indexedDB (avoids storing all other GH data)
  saveFilesToIndexedDB () {
    const filesDict = {}
    Object.values(this.files).forEach(file => {
      if (file.code) filesDict[file.name] = file.code
    })

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite')
      const objectStore = transaction.objectStore(this.storeName)
      const request = objectStore.put(filesDict, this.objName)

      request.onerror = (event) => {
        console.error('ProjectFiles: IndexedDB save error:', event.target.error)
        reject(event.target.error)
      }

      request.onsuccess = () => {
        if (this.log) console.log('ProjectFiles: Files saved to IndexedDB successfully.')
        resolve()
      }
    })
  }

  // NOTE: this method needs to stay in sync with the method in the files-db-service-worker.js
  _getMimeType (filePath) {
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


/*
  uploadFile (file) {
    this._upload = file.name
    if (this.shaDict[file.name]) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'duplicate-file')
    } else {
      document.querySelector('load-curtain').show('upload.html', {
        filename: file.name
      })

      const data = {
        owner: window.localStorage.getItem('owner'),
        repo: window.sessionStorage.getItem('opened-project'),
        name: file.name,
        code: file.data.split('base64,')[1]
      }
      utils.post('./api/github/upload-file', data, (res) => {
        if (!res.success) {
          console.log('FunctionsMenu:', res)
          window.convo = new Convo(this.convos, 'oh-no-error')
        } else {
          this._upload = null
          this._postUpdate()
        }
      })
    }
  }

  deleteFile (filename) {
    // runs when user clicks a files delete button
    this._delete = filename
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'confirm-delete')
  }

  _postDeletion (file) {
    document.querySelector('load-curtain').show('delete.html')
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: window.sessionStorage.getItem('opened-project'),
      name: this._delete,
      sha: this.shaDict[this._delete]
    }
    utils.post('./api/github/delete-file', data, (res) => {
      if (!res.success) {
        console.log('FunctionsMenu:', res)
        window.convo = new Convo(this.convos, 'oh-no-error')
      } else {
        delete this.shaDict[this._delete]
        this._delete = null
        this._postUpdate()
      }
    })
  }

  _postUpdate () {
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: window.sessionStorage.getItem('opened-project')
    }
    utils.post('./api/github/open-project', data, (res) => {
      this.updateFiles(res.data)
      document.querySelector('load-curtain').hide()
      NNE.update()
    })
  }



  _setupFileUploader () {
    this.fu = new nn.FileUploader({
      maxSize: 5000, // 5 MB (see widgets/project-files/convo.js)
      ready: (file) => this.uploadFile(file),
      drop: '.files-widget',
      error: (err) => {
        console.error('ProjectFiles:', err)
        if (err.includes('file larger than max size')) {
          window.convo = new Convo(this.convos, 'file-too-big')
        }
      }
    })
  }
  */
}

window.ProjectFiles = ProjectFiles
