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
    this.width = 450
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
    this.viewing = null
    this.rendering = null // which html file is rendered in iframe

    this._createContextMenu()
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
    const c1 = nn.hex2rgb(utils.getVal('--netizen-meta'))
    const fileClr = `rgb(${c1.r},${c1.g},${c1.b})`
    const c2 = nn.hex2rgb(utils.getVal('--fg-color'))
    const fldrClr = `rgb(${c2.r},${c2.g},${c2.b})`

    this.innerHTML = `
      <style>
        .proj-files__tree-view li:before {
          margin-right: 10px;
          content: "";
          height: 20px;
          vertical-align: middle;
          width: 20px;
          background-repeat: no-repeat;
          display: inline-block;
          /* file icon by default */
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='${fileClr}' d='M85.714,42.857V87.5c0,1.487-0.521,2.752-1.562,3.794c-1.042,1.041-2.308,1.562-3.795,1.562H19.643 c-1.488,0-2.753-0.521-3.794-1.562c-1.042-1.042-1.562-2.307-1.562-3.794v-75c0-1.487,0.521-2.752,1.562-3.794 c1.041-1.041,2.306-1.562,3.794-1.562H50V37.5c0,1.488,0.521,2.753,1.562,3.795s2.307,1.562,3.795,1.562H85.714z M85.546,35.714 H57.143V7.311c3.05,0.558,5.505,1.767,7.366,3.627l17.41,17.411C83.78,30.209,84.989,32.665,85.546,35.714z' /></svg>");
          background-position: center 2px;
          background-size: 60% auto;
        }

        .proj-files__tree-view li.folder:before {
          /* folder icon if folder class is specified */
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='${fldrClr}' d='M96.429,37.5v39.286c0,3.423-1.228,6.361-3.684,8.817c-2.455,2.455-5.395,3.683-8.816,3.683H16.071 c-3.423,0-6.362-1.228-8.817-3.683c-2.456-2.456-3.683-5.395-3.683-8.817V23.214c0-3.422,1.228-6.362,3.683-8.817 c2.455-2.456,5.394-3.683,8.817-3.683h17.857c3.422,0,6.362,1.228,8.817,3.683c2.455,2.455,3.683,5.395,3.683,8.817V25h37.5 c3.422,0,6.361,1.228,8.816,3.683C95.201,31.138,96.429,34.078,96.429,37.5z' /></svg>");
          background-position: center top;
          background-size: 75% auto;
        }
      </style>
      <div class="proj-files">
        <!-- if project is not open -->
        <div class="proj-files__disclaimer">
          ${loggedIn ? loggedInMsg : loggedOutMsg}
        </div>
        <!-- if project is open -->
        <div class="proj-files__header">
          <!-- tabs to switch between, tree-view, finder-view && terminal-view -->
          <!-- <button class="pill-btn" name="upload">Upload Asset</button> -->
          Tree View
        </div>
        <ul class="proj-files__list proj-files__tree-view">
          <!-- this._updateFilesGUI() populates this div -->
        </ul>
      </div>
    `

    this._showHideDivs()

    // this.updateFiles()
  }

  _showHideDivs () {
    const op = WIDGETS['student-session'].getData('opened-project')
    this.$('.proj-files__disclaimer').style.display = op ? 'none' : 'block'
    this.$('.proj-files__header').style.display = op ? 'block' : 'none'
    this.$('.proj-files__list').style.display = op ? 'block' : 'none'
  }

  _updateFilesGUI () {
    // runs everytime a new repo (github project) is created or opened
    // as well as anytime a file is uploaded or deleted
    this._showHideDivs()
    this.$('.proj-files__list').innerHTML = ''

    // update view
    this._setupTreeView()
  }

  _setupTreeView () {
    // create "tree" data structure
    // ----------------------------

    this.tree = []
    const agg = { temp: [] }
    Object.values(this.files).forEach(file => {
      // via: https://stackoverflow.com/a/73514205/1104148
      file.path.split('/').reduce((agg, part, level, parts) => {
        if (!agg[part]) {
          agg[part] = { temp: [] }
          agg.temp.push({
            id: parts.slice(0, level + 1).join('/'),
            level: level + 1,
            children: agg[part].temp
          })
        }
        return agg[part]
      }, agg)
      // update files + folders dictionary/array
      this.tree = agg.temp
    })

    // tree DOM helper functions
    // ----------------------------

    const hover = (e, type) => {
      if (type === 'over') {
        e.stopPropagation()
        const c2 = nn.hex2rgb(utils.getVal('--fg-color'))
        e.target.style.background = `rgba(${c2.r},${c2.g},${c2.b}, 0.25)`
      } else if (type === 'out') {
        e.stopPropagation()
        e.target.style.background = 'transparent'
      }
    }

    const createLi = (path, parent, click) => {
      const ele = document.createElement('li')
      const arr = path.split('/')
      ele.textContent = arr[arr.length - 1]
      ele.dataset.path = path
      if (click) {
        ele.addEventListener('click', (e) => {
          e.stopPropagation(); this.openFile(path)
        })
      }
      ele.addEventListener('contextmenu', (e) => this._openContextMenu(e))
      ele.addEventListener('mouseover', (e) => hover(e, 'over'))
      ele.addEventListener('mouseout', (e) => hover(e, 'out'))
      parent.appendChild(ele)
      return ele
    }

    const createUl = (parent) => {
      const ele = document.createElement('ul')
      ele.classList.add('active')
      parent.appendChild(ele)
      return ele
    }

    const toggleFolder = (e, init) => {
      const li = e.target
      const ul = li.querySelector('ul')
      if (!ul) return
      e.preventDefault(); e.stopPropagation()
      if (!ul.classList.contains('active')) { // open folder
        ul.classList.add('active')
        ul.style.height = 'auto'
      } else { // close folder
        ul.style.height = '0px'
        ul.classList.remove('active')
        ul.querySelectorAll('.active').forEach((ulc) => {
          ulc.style.height = '0px'
          ulc.classList.remove('active')
        })
      }
    }

    const iterate = (obj, ele = this.$('.proj-files__tree-view')) => {
      if (obj.children.length > 0) {
        // create folder if obj has children...
        const li = createLi(obj.id, ele)
        li.classList.add('folder')
        const ul = createUl(li)
        li.addEventListener('click', (e) => toggleFolder(e))
        // - - - - - - - - - - - - - - recuuuursssiiiion
        obj.children.forEach(child => iterate(child, ul))
        // ...otherwise create file
      } else createLi(obj.id, ele, true)
    }

    // create the tree DOM elements
    // ----------------------------
    // obj = { id: [filepath], level: [number], children: [array] }
    this.tree.forEach(obj => iterate(obj))

    if (this.$('.proj-files__tree-view > .folder')) {
      // close folders by default
      if (this.$('.proj-files__tree-view > .folder') instanceof window.NodeList) {
        this.$('.proj-files__tree-view > .folder').forEach(f => f.click())
      } else {
        this.$('.proj-files__tree-view > .folder').click()
      }
    }

    // TODO: why was this here originally?????
    // // label file currently (rendering)
    // if (this._rendering) {
    //   this._updateOpenFile()
    //   this._renderToIframe()
    // }
  }

  // .................................................... CONTEXT MENU .........

  _createContextMenu () {
    if (this.ctxmenu) return
    this.ctxmenu = document.createElement('nav')
    this.ctxmenu.className = 'proj-files__ctx'
    this.ctxmenu.style.display = 'none'
    this.ctxmenu.style.position = 'absolute'
    this.ctxmenu.style.zIndex = '500'
    this.ctxmenu.style.color = 'var(--bg-color)'
    this.ctxmenu.style.backgroundColor = 'var(--netizen-meta)'
    this.ctxmenu.style.border = '1px solid var(--bg-color)'
    this.ctxmenu.style.padding = '10px'
    this.ctxmenu.innerHTML = `
      <!-- the right-click context menu -->
      <div class="proj-files__ctx-rename">rename</div>
      <div class="proj-files__ctx-delete">delete</div>
      <div class="proj-files__ctx-copy">copy relative path</div>
      <hr>
      <div>upload file</div>
      <div>new file</div>
      <div>new folder</div>
    `
    document.body.appendChild(this.ctxmenu)

    this.ctxmenu.querySelectorAll('div').forEach(div => {
      div.addEventListener('click', (e) => {
        if (e.target.textContent.includes('rename')) this.renameFile()
        else if (e.target.textContent.includes('delete')) this.deleteFile()
        else if (e.target.textContent.includes('copy relative path')) this.copyRelativePath()
        else if (e.target.textContent.includes('upload file')) this.fu.input.click()
        else if (e.target.textContent.includes('new file')) this.newFile()
        else if (e.target.textContent.includes('new folder')) this.newFolder()
      })
    })

    const close = () => {
      if (this.ctxmenu.dataset.open === 'true') this._closeContextMenu()
    }
    window.addEventListener('click', () => close())
    window.addEventListener('keyup', () => close())
    NNE.on('render-update', () => {
      NNE.iframe.contentWindow.addEventListener('click', () => close())
    })
  }

  _openContextMenu (e) {
    e.preventDefault()
    this._rightClicked = e.target
    const rn = this.ctxmenu.querySelector('.proj-files__ctx-rename')
    const dl = this.ctxmenu.querySelector('.proj-files__ctx-delete')
    const cp = this.ctxmenu.querySelector('.proj-files__ctx-copy')
    const hr = this.ctxmenu.querySelector('hr')
    const name = e.target.childNodes[0].nodeValue.trim()

    if (!name || name === '') {
      cp.style.display = hr.style.display = rn.style.display = dl.style.display = 'none'
    } else {
      cp.style.display = hr.style.display = rn.style.display = dl.style.display = 'block'
      rn.textContent = `rename "${name}"`
      dl.textContent = `delete "${name}"`
    }

    this.ctxmenu.style.left = e.clientX - 8 + 'px'
    this.ctxmenu.style.top = e.clientY - 8 + 'px'
    this.ctxmenu.style.display = 'inline-block'
    this.ctxmenu.dataset.open = 'true'
  }

  _closeContextMenu () {
    this.ctxmenu.style.display = 'none'
    this.ctxmenu.dataset.open = 'false'
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  copyRelativePath () { // TODO: needs updating (THIS IS FROM OLD LOGIC)
    const b = WIDGETS['student-session'].getData('branch')
    let cpath = this._rightClicked.dataset.path
    let bpath = NNE._root.split(b)[1]
    cpath = cpath.split('/').filter(i => i !== '')
    bpath = bpath.split('/').filter(i => i !== '')
    while (bpath[0] === cpath[0]) { bpath.shift(); cpath.shift() }
    cpath = cpath.join('/')
    for (let i = 0; i < bpath.length; i++) { cpath = '../' + cpath }
    navigator.clipboard.writeText(cpath)
  }

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
          window.convo = new Convo(this.convos, 'project-opened')
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
    this.viewing = filename

    const repo = WIDGETS['student-session'].getData('opened-project')
    NNW.updateTitleBar(`${repo}/${filename}`) // TODO: might need to update for nested files

    NNE.code = this.files[filename].code
    if (NNW.layout === 'welcome') NNW.layout = 'dock-left'

    setTimeout(() => {
      NNW.menu.switchFace('default')
      if (!NNE.autoUpdate) NNE.update() // NOTE: TODO: probably want to change auto-update when working on projects
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
      drop: '.proj-files',
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
