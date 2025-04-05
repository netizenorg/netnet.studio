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

this file also sends API calls to my_modules/github.js

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
    this.lastCommitFiles = {} // for tracking changes

    // NOTE: this method needs to stay in sync with the method in the files-db-service-worker.js
    this.mimeTypes = {
      md: 'text/markdown',
      html: 'text/html',
      css: 'text/css',
      js: 'text/javascript',
      png: 'image/png',
      gif: 'image/gif',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      svg: 'image/svg+xml',
      json: 'application/json',
      ico: 'image/x-icon',
      webp: 'image/webp',
      woff: 'font/woff',
      woff2: 'font/woff2',
      ttf: 'font/ttf',
      otf: 'font/otf',
      mp4: 'video/mp4',
      webm: 'video/webm',
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      txt: 'text/plain',
      xml: 'application/xml',
      pdf: 'application/pdf',
      zip: 'application/zip',
      csv: 'text/csv'
    }

    this._createContextMenu()
    this._createHTML()
    // this._setupFileUploader()

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('open', () => { window.convo = new Convo(this.convos, 'explain') })

    NNE.on('code-update', () => {
      const repo = WIDGETS['student-session'].getData('opened-project')
      if (!repo) return
      this._updateViewingFile()
    })

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
          <div class="git-btn">git push</div>
        </div>
        <ul class="proj-files__list proj-files__tree-view">
          <!-- this._updateFilesGUI() populates this div -->
        </ul>
      </div>
    `

    this._showHideDivs()

    this.ele.querySelector('.widget__inner-html').style.height = 'calc(100% - 25px)'
  }

  _showHideDivs () {
    const op = WIDGETS['student-session'].getData('opened-project')
    this.$('.proj-files__disclaimer').style.display = op ? 'none' : 'block'
    this.$('.proj-files__header').style.display = op ? 'flex' : 'none'
    this.$('.proj-files__list').style.display = op ? 'block' : 'none'
  }

  // runs everytime a new repo (github project) is created or opened
  // as well as anytime a file is uploaded or deleted
  _updateFilesGUI () {
    // get all currently opened folders
    this._openDirNames = nn.getAll('.folder > ul.active').map(ul => ul.parentNode.childNodes[0].textContent)

    this._showHideDivs()
    this.$('.proj-files__list').innerHTML = ''
    // update view
    this._setupTreeView()

    // reopen previously opened folders
    const rootName = this.$('.proj-files__tree-view li')[0].childNodes[0].textContent
    const folders = [...this.ele.querySelectorAll('.folder')]
    folders
      .filter(li => this._openDirNames.includes(li.childNodes[0].textContent))
      .forEach(li => {
        const name = li.childNodes[0].textContent
        if (name !== rootName) li.click()
      })
  }

  _setupTreeView () {
    const root = WIDGETS['student-session'].getData('opened-project')

    // create "tree" data structure
    // ----------------------------
    this.tree = []
    const agg = { temp: [] }
    Object.values(this.files)
      .map(file => `${root}/${file.path}`)
      .forEach(filepath => {
        // via: https://stackoverflow.com/a/73514205/1104148
        filepath.split('/').reduce((agg, part, level, parts) => {
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
      const subRootPath = path.slice(root.length + 1)
      ele.dataset.path = subRootPath
      if (click) {
        ele.addEventListener('click', (e) => {
          e.stopPropagation(); this.openFile(subRootPath)
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

    this.$('.proj-files__tree-view li')[0].click() // close root (and thus sub folders) by default
    this.$('.proj-files__tree-view li')[0].click() // re-open root folder only
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
      <div class="proj-files__ctx-copy">copy file path</div>
      <hr>
      <div>upload file</div>
      <div>new file</div>
      <div>new folder</div>
    `
    document.body.appendChild(this.ctxmenu)

    this.ctxmenu.querySelectorAll('div').forEach(div => {
      div.addEventListener('click', (e) => { // TODO: need to implement some of these functions
        if (e.target.textContent.includes('rename')) this.renameFile()
        else if (e.target.textContent.includes('delete')) this.deleteFile()
        else if (e.target.textContent.includes('copy file path')) this.copyFilePath()
        else if (e.target.textContent.includes('upload file')) this.uploadFile()
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
      NNE.iframe.addEventListener('click', () => close())
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
    const repo = WIDGETS['student-session'].getData('opened-project')
    const name = e.target.childNodes[0].nodeValue.trim()

    if (!name || name === '' || name === repo) {
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

  openProject (repo) {
    if (!window.CONVOS[this.key]) { // make sure convo is laoded before proceeding
      return setTimeout(() => this.openProject(repo), 100)
    }

    this.convos = window.CONVOS[this.key](this)
    if (!repo) {
      window.convo = new Convo(this.convos, 'open-project')
    } else {
      WIDGETS['student-session'].clearSaveState()
      const owner = WIDGETS['student-session'].getData('owner')
      nn.get('load-curtain').show('upload.html', { filename: repo })
      this.open()

      // load data for all the files
      utils.post('./api/github/open-all-files', { repo, owner }, async (res) => {
        if (!res.success) {
          nn.get('load-curtain').hide()
          return this._ohNoErr(res)
        }

        if (Object.keys(res.data).includes('index.html')) {
          NNE.addCustomRoot(null)

          // update student session data
          const htmlUrl = res.data['index.html'].html_url
          const branch = (htmlUrl.includes('/blob/master')) ? 'master' : 'main'
          const url = (htmlUrl.includes('/blob/master'))
            ? htmlUrl.split('/blob/master')[0] : htmlUrl.split('/blob/main')[0]
          WIDGETS['student-session'].setProjectData({ url, branch, name: repo })

          // update netnet URL
          const ghStr = branch === 'main'
            ? `?gh=${owner}/${repo}`
            : `?gh=${owner}/${repo}/${branch}`
          utils.updateURL(ghStr)

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
            // this.files[name] = data // NOTE: no longer storing all the github data
            this.files[name] = { path: data.path, raw: data.download_url } // NOTE: adding "raw" as potential fix for large image bug (TODO)
            // TODO: if we decide to keep "raw" would be good to expose it in getFileData as well
            let code // store plain-text/code
            if (mimetype.split('/')[0] === 'text' || mimetype === 'application/json') {
              code = utils.atob(data.content)
            } else { // otherwise assume binary file && store blob-url
              code = this._base64ToBlob(data.content, mimetype)
            }
            this._updateFile(name, code)
          })

          this.lastCommitFiles = JSON.parse(JSON.stringify(this.files))

          // TODO: NOTE: may not need this anymore? check back in once finished with new git logic
          // update last commit data
          // const filename = 'index.html'
          // utils.post('./api/github/get-commits', { filename, repo, owner }, (res) => {
          //   if (!res.success) return this._ohNoErr(res)
          //   const msg = res.data[0].commit.message
          //   WIDGETS['student-session'].setData('last-commit-msg', msg)
          // })

          this._updateFilesGUI()

          // open the index.html file by default
          this.openFile('index.html')
          window.convo = new Convo(this.convos, 'project-opened')
        } else {
          this.files = {}
          nn.get('load-curtain').hide()
          window.convo = new Convo(this.convos, 'not-a-web-project')
        }
      })
    }
  }

  closeProject () {
    utils.updateURL() // remove github path from URL
    this._clearIndexedDB(true)
    this._createHTML()
  }

  _openImageViewer (filepath) { // TODO: make sure widget fits (might need to scale image down)
    const urlBlob = this.files[filepath].code
    const img = `
      <div style="text-align:right">
        <a href="${urlBlob}" target="_blank">open image in new tab</a>
      </div>
      <img src="${urlBlob}" style="max-height: ${nn.height / 2}px">
    `
    if (WIDGETS.instantiated.includes(`VIEW-${filepath}`)) {
      WIDGETS[`VIEW-${filepath}`].innerHTML = img
      return WIDGETS[`VIEW-${filepath}`].open()
    } else {
      return WIDGETS.create({
        key: `VIEW-${filepath}`, title: 'Image Viewer', innerHTML: img
      }).open()
    }
  }

  openFile (filepath) {
    const imgs = ['jpg', 'jpeg', 'png', 'gif', 'ico', 'webp'] // TODO: move svg here?
    const txts = ['html', 'svg', 'css', 'js', 'md', 'txt', 'json', 'csv', 'xml']
    // const { filename, sub, ext } = this._parsePath(filepath)
    const ext = filepath.split('.').pop().toLowerCase()

    // TODO: add widgets for opening up audio files and video files (maybe zip too?)
    // const vids = ['mp4', 'webm']
    // const auds = ['mp3', 'wav']
    // TODO: create 'CNAME' convo object
    if (imgs.includes(ext) || imgs.includes(ext.toLowerCase())) {
      return this._openImageViewer(filepath)
    } else if (!filepath.includes('.gitkeep') && !txts.includes(ext) && !txts.includes(ext.toLowerCase())) {
      window.convo = new Convo(this.convos, 'unknown-format')
      return
    }

    if (ext === 'html') this.rendering = filepath
    this.viewing = filepath

    const repo = WIDGETS['student-session'].getData('opened-project')
    NNW.updateTitleBar(`${repo}/${filepath}`)

    // update netitor
    NNE.code = this.files[filepath].code
    if (NNW.layout === 'welcome') NNW.layout = 'dock-left'
    if (ext === 'html' || ext === 'js' || ext === 'css') {
      NNE.language = ext === 'js' ? 'javascript' : ext
      if (ext === 'html') NNE.update() // TODO: should we auto-upate html files?
    } else if (ext === 'json' || ext === 'csv' || ext === 'txt' || ext === 'md') {
      NNE.language = 'markdown'
    } else {
      NNE.language = 'html'
    }
    NNE.wrap = WIDGETS['student-session'].getData('wrap') === 'true'

    setTimeout(() => {
      NNW.menu.switchFace('default')
      nn.get('load-curtain').hide()
      if (!NNE.autoUpdate) NNE.update()
    }, utils.getVal('--layout-transition-time'))
  }

  deleteFile (filepath) {
    const fpath = this._rightClicked.dataset.path
    if (filepath || !fpath) return console.error('deleteFile: can only be used via the project-files context menu')
    this._delete = fpath
    this.convos = window.CONVOS[this.key](this)
    if (!this.files[fpath]) { // assume it's a folder (which can only exist if there are files in it)
      window.convo = new Convo(this.convos, 'can-no-delete')
      return
    }
    window.convo = new Convo(this.convos, 'confirm-delete')
  }

  renameFile (file) {
    const fpath = this._rightClicked.dataset.path
    const type = this._fpathExists(fpath)
    if (file || !type) return console.error('renameFile: can only be used via the project-files context menu')
    this._rename = type === 'file' ? this.getFileData(fpath).fullname : fpath.split('/').pop()
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, `${type}-rename`)
  }

  newProject () {
    // TODO: display netnet convo for naming a new project (&& creating a repo)
    console.log('new project')
  }

  newFolder () {
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'new-folder')
  }

  newFile () {
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'new-file')
  }

  async uploadFile () {
    const cpath = this._rightClicked.dataset.path
    const type = this._fpathExists(cpath)
    const path = type === 'folder' ? cpath : this._getSubPath(cpath)
    const allowedTypes = Object.values(this.mimeTypes)
    allowedTypes.push('application/x-javascript')
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = allowedTypes.join(',')
    input.style.display = 'none'
    document.body.appendChild(input)
    input.addEventListener('change', async () => {
      const file = input.files[0]
      document.body.removeChild(input)
      if (!file) return
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'unknown-format')
      } else if (this.files[file.name]) {
        this._duplicate = file.name
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'duplicate-file')
      } else {
        nn.get('load-curtain').show('upload.html', { filename: file.name })
        const isTextType = file.type.split('/')[0] === 'text' ||
          file.type === 'application/json' || file.type === 'application/x-javascript'
        const reader = new window.FileReader()
        reader.onloadend = async () => {
          // console.log({ name: file.name, type: file.type, data })
          let data = reader.result
          if (!isTextType) {
            data = this._base64ToBlob(data.split(',')[1], file.type)
          }
          const filepath = path ? `${path}/${file.name}` : file.name
          await this._updateFile(filepath, data)
          this._updateFilesGUI()
          setTimeout(() => nn.get('load-curtain').hide(), 200)
        }
        if (isTextType) reader.readAsText(file)
        else reader.readAsDataURL(file)
      }
    })
    input.click()
  }

  saveCurrentFile (skipUpdate) {
    this._updateFile(this.viewing, NNE.code)
    if (!skipUpdate) NNE.update()
    this._updateViewingFile()
    if (this.log) console.log('PF: saveCurrentFile')
  }

  // Read a specific file from the files object
  readFile (filePath) {
    return this.files[filePath]?.code || null // Return the file content or null if the file doesn't exist
  }

  getFileData (filePath) {
    const path = filePath
    let code = this.readFile(filePath)
    if (!code) code = ''

    const arr = filePath.split('.')
    const name = arr[arr.length - 2].split('/').pop()
    const ext = arr[arr.length - 1]
    const fullname = name + '.' + ext
    const sansFile = filePath.substring(0, filePath.lastIndexOf('/'))
    const dir = sansFile.endsWith('/') ? sansFile.slice(0, -1) : sansFile

    let lang = 'binary'
    if (ext === 'html') lang = 'html'
    else if (ext === 'css') lang = 'css'
    else if (ext === 'js') lang = 'javascript'

    // const github = Object.fromEntries(
    //   Object.entries(this.files[filePath]).filter(([key]) => key !== 'code')
    // )

    // return { code, lang, dir, name, ext, fullname, path, github }
    return { code, lang, dir, name, ext, fullname, path }
  }

  // List all files in the store
  listAllFiles () {
    return Object.keys(this.files)
  }

  copyFilePath () {
    const cpath = this._rightClicked.dataset.path
    navigator.clipboard.writeText(`/${cpath}`)
  }

  explainTitleBar (path) {
    this.convos = window.CONVOS[this.key](this)
    if (path.includes('index.html') && path.match(/\//g).length === 1) {
      window.convo = new Convo(this.convos, 'netnet-title-bar-index')
    } else if (path.includes('README.md') && path.match(/\//g).length === 1) {
      window.convo = new Convo(this.convos, 'netnet-title-bar-readme')
    } else {
      window.convo = new Convo(this.convos, 'netnet-title-bar-misc')
    }
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
        if (!this.files[this.rendering].code) {
          eve.update(`<h1>⚠️ 404</h1> <h3>the file <i>${this.rendering}</i> could not be found.</h3> If you're still working on this file, you'll need to write some code to your file first and then <i>save</i> it (${utils.hotKey()} + S) before rendering it.`)
        }
        console.log('rendered this.rendering')
      } else {
        // eve.iframe.srcdoc = eve.code
        eve.update(eve.code)
        console.log('rendered default')
      }
    }
  }

  _getSubPath (fromPath) {
    const arr = fromPath.split('/')
    arr.pop()
    return arr.join('/')
  }

  _fpathExists (fpath) {
    const allFiles = Object.keys(this.files)
    const allDirs = allFiles.map(p => this._getSubPath(p)).filter(s => s !== '')
    // check if file exists...
    if (this.files[fpath]) { // file exists
      return 'file'
    } else if (allDirs.includes(fpath)) {
      return 'folder'
    } else {
      return false
    }
  }

  _name2path (name, type) {
    const fldr = this._rightClicked.classList.contains('folder')
    let path = (!this._rightClicked.dataset.path) // path to array
      ? [''] : this._rightClicked.dataset.path.split('/')
    if (path.length !== 0 && !fldr) path.pop() // if clicked file, pop it out
    path = path.join('/') // convert path back to string
    if (type === 'folder') path += `/${name}/.gitkeep`
    else if (type === 'file') path += `/${name}`
    path = path[0] === '/' ? path.substring(1) : path
    return path
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

  async _updateFile (filePath, fileContent) {
    if (!this.files[filePath]) { // create new file
      this.files[filePath] = { code: fileContent, path: filePath }
    } else { // update existing file
      this.files[filePath].code = fileContent
    }
    await this._saveFilesToIndexedDB()
  }

  _updateViewingFile () {
    // runs on each netitor update
    const lastSave = this.readFile(this.viewing)
    const title = NNW.title.textContent
    if (NNE.code !== lastSave) {
      NNW.updateTitleBar(title, true)
      NNW.title.dataset.unsaved = true
    } else {
      NNW.updateTitleBar(title, false)
      delete NNW.title.dataset.unsaved
    }
  }

  _getMimeType (filePath) {
    const extension = filePath.split('.').pop().toLowerCase()
    const type = this.mimeTypes[extension] || 'application/octet-stream'
    return type
  }

  // --------------------- --------------------- --------------------- ---------
  // ------- functions which run after user dialogue with context menu functions

  async _postNew (name, type) {
    window.convo.hide()
    const path = this._name2path(name, type) // based on last context-click
    const exists = this._fpathExists(path)
    if (exists) {
      this._duplicate = name
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, `duplicate-${type}`)
    } else if (type === 'file') {
      await this._updateFile(path, '')
    } else if (type === 'folder') {
      const str = 'This ".gitkeep" file is a typical GitHub hack. The file exists in order to create an otherwise empty folder/directory on GitHub. Once you\'ve pushed other files to this folder you can delete this file, but if this is the only file in the folder, deleting it will also delete the folder. To learn more see: https://stackoverflow.com/a/7229996/1104148'
      await this._updateFile(path, str)
    }
    this._updateFilesGUI()
  }

  async _postDeletion (filepath) {
    // nn.get('load-curtain').show('delete.html')
    if (this.files[filepath]) {
      if (this.files[filepath].code.indexOf('blob') === 0) {
        URL.revokeObjectURL(this.files[filepath].code) // for memory management
      }
      delete this.files[filepath]
      await this._saveFilesToIndexedDB()
      if (this.log) console.log(`FilesDB: File '${filepath}' deleted successfully.`)
      this._updateFilesGUI()
      // setTimeout(() => nn.get('load-curtain').hide(), 100)
    } else {
      console.warn(`FilesDB: File '${filepath}' not found.`)
      // setTimeout(() => nn.get('load-curtain').hide(), 100)
    }
  }

  async _postRenameFile (tempname) {
    window.convo.hide()
    const fpath = this._rightClicked.dataset.path
    const subPath = this._getSubPath(fpath)
    const type = this._fpathExists(fpath)
    const newPath = subPath ? `${subPath}/${tempname}` : tempname
    const dup = this._fpathExists(newPath)
    const renameFile = (newPath, oldPath) => {
      this.files[newPath] = JSON.parse(JSON.stringify(this.files[oldPath]))
      this.files[newPath].path = newPath
      delete this.files[oldPath]
    }

    if (dup) {
      this._duplicate = tempname
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, `duplicate-${type}`)
    } else {
      if (type === 'file') {
        renameFile(newPath, fpath)
      } else {
        Object.keys(this.files).forEach(path => {
          const file = this.getFileData(path)
          if (file.dir === fpath) {
            const newName = `${newPath}/${file.fullname}`
            const oldName = `${fpath}/${file.fullname}`
            renameFile(newName, oldName)
          }
        })
      }
      // update database && tree view
      await this._saveFilesToIndexedDB()
      if (this.log) console.log(`FilesDB: '${fpath}' renamed to '${newPath}'`)
      this._updateFilesGUI()
      this._duplicate = null
      this._rename = null
    }
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
  // .....................  IndexedDB methods
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
  _saveFilesToIndexedDB () {
    const filesDict = {}
    Object.values(this.files).forEach(file => {
      if (file.code) filesDict[file.path] = file.code
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
}

window.ProjectFiles = ProjectFiles
