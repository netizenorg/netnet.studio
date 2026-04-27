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
    this.title = 'Project Files <span style="opacity:0.5;padding-left:10px;">(BETA 1.0)</span>'
    this.width = 450
    // this.shaDict = {}

    // indexedDB file data store
    this.log = false // debug logging
    this.dbName = 'netnetDB'
    this.storeName = 'filesStore'
    this.objName = 'files'
    this.dbVersion = 1
    this.projectData = {} // GitHub project data { name, branch, url, ghpags }
    this.files = {} // GitHub info, includes {name, sha, type, etc} + code
    this.db = null // IndexedDB, only { name: code }

    // state
    this.viewing = null
    this.rendering = null // which html file is rendered in iframe
    this.history = {
      stack: {}, redoStack: {}, max: 100, skipPush: false, debounce: 400, timer: null
    }
    this.lastCommitFiles = {} // for tracking changes
    this._uploadedFile = {}
    this._agreed2beta = false
    this.changes = [] // "change" objects ("create", "updated", "delete") since last git commit

    this.codeEdit = null // runs on code update when proj is open

    // NOTE: this method needs to stay in sync with the method in the files-db-service-worker.js
    this.mimeTypes = {
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
      // fonts (include .ext b/c finders/browsers screw up font mimeTypes)
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

    this._createContextMenu()
    this._createHTML()

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('open', () => {
      if (window.convo && window.convo.id && window.convo.id.includes('title-bar')) return
      window.convo = new Convo(this.convos, 'explain')
      const { x, y } = this._openSpot()
      // this.update({ right: 20, bottom: 20 }, 500)
      this.update({ left: x, top: y }, 500)
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. GUI methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML () {
    const loggedInMsg = 'You\'re currently working on a "<b>sketch</b>", that\'s what we call a web page made from a single HTML file. If you\'d like to work on "<b>project</b>" consisting of multiple files/assets which can be published on the web, we can either <span class="inline-link" onclick="WIDGETS[\'project-files\'].openProject()">open a project</span> you have stored on GitHub or we could <span class="inline-link" onclick="WIDGETS[\'project-files\'].newProject()">create a new one?</span>'

    const loggedOutMsg = 'You\'re currently working on a "<b>sketch</b>", that\'s what we call a web page made from a single HTML file. To create a "<b>project</b>" consisting of multiple files/assets which can be published on the web you\'ll need to <span class="inline-link" onclick="WIDGETS[\'coding-menu\']._login()">authenticate your GitHub account</span>. This is because we don\'t store any data on our servers, instead your projects are stored as repositories in your own GitHub account. If you\'re not familiar with <a href="https://github.com/" target="_blank">GitHub</a>, don\'t worry, you won\'t need to interact with it directly, we\'ll walk you through all the steps here in the studio.'

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

    this.ele.querySelector('.git-btn').addEventListener('click', () => this._launchGit())
  }

  _showHideDivs () {
    const op = this.projectData.name

    this.$('.proj-files__disclaimer').style.display = op ? 'none' : 'block'

    this.$('.proj-files__header').style.display = op ? 'flex' : 'none'
    this.$('.proj-files__list').style.display = op ? 'block' : 'none'

    this.keepInFrame()
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

    this._colorizeChanges()
    this.keepInFrame()
  }

  async _colorizeChanges () {
    if (nn.get('load-curtain').showing) return

    this.changes = await this.computeChanges()
    if (WIDGETS['git-push']) WIDGETS['git-push']._createHTML()

    if (this.changes.length > 0) this.$('.git-btn').classList.add('changes')
    else this.$('.git-btn').classList.remove('changes')
    const changeMap = new Map(this.changes.map(c => [c.path, c]))
    const clr = { create: '--netizen-attribute', update: '--netizen-number' }
    Array.from(this.$('.proj-files__list.proj-files__tree-view li'))
      .filter(li => !li.classList.contains('folder'))
      .forEach(li => {
        const change = changeMap.get(li.dataset.path)?.action
        if (change) li.style.color = `var(${clr[change]})`
        else li.style.color = null
      })
  }

  _launchGit () {
    if (this.changes.length > 0) WIDGETS.load('git-push', (w) => w.open())
    else { window.convo = new Convo(this.convos, 'git-push-not-ready') }
  }

  _setupTreeView () {
    const root = this.projectData.name

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
        if (!this.files[subRootPath].code) ele.classList.add('empty')
        ele.addEventListener('click', (e) => {
          e.stopPropagation(); this.openFile(subRootPath)
          if (this.ctxmenu.dataset.open === 'true') this._closeContextMenu()
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
      if (this.ctxmenu.dataset.open === 'true') this._closeContextMenu()
      this.keepInFrame()
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
      <div class="proj-files__ctx-copy">copy relative path</div>
      <div class="proj-files__ctx-move">move/update path</div>
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
        else if (e.target.textContent.includes('copy relative path')) this.copyFilePath()
        else if (e.target.textContent.includes('move/update path')) this.moveFilePath()
        else if (e.target.textContent.includes('upload file')) this.uploadFile()
        else if (e.target.textContent.includes('new file')) this.newFile()
        else if (e.target.textContent.includes('new folder')) this.newFolder()
      })
    })

    const close = () => {
      if (this.ctxmenu.dataset.open === 'true') this._closeContextMenu()
    }
    window.addEventListener('click', () => close())
    this.ele.addEventListener('click', () => close())
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
    const mv = this.ctxmenu.querySelector('.proj-files__ctx-move')
    const hr = this.ctxmenu.querySelector('hr')
    const repo = this.projectData.name
    const name = e.target.childNodes[0].nodeValue.trim()

    if (!name || name === '' || name === repo) {
      cp.style.display = mv.style.display = hr.style.display = rn.style.display = dl.style.display = 'none'
    } else {
      cp.style.display = mv.style.display = hr.style.display = rn.style.display = dl.style.display = 'block'
      rn.textContent = `rename "${name}"`
      dl.textContent = `delete "${name}"`
    }

    this.ctxmenu.style.left = e.clientX - 8 + 'px'
    this.ctxmenu.style.top = e.clientY - 8 + 'px'
    this.ctxmenu.style.display = 'inline-block'
    this.ctxmenu.dataset.open = 'true'

    const offY = this.ctxmenu.offsetHeight + this.ctxmenu.offsetTop - nn.height
    const offX = this.ctxmenu.offsetWidth + this.ctxmenu.offsetLeft - nn.width

    if (offY > 0) { this.ctxmenu.style.top = e.clientY - (offY + 16) + 'px' }
    if (offX > 0) { this.ctxmenu.style.left = e.clientX - (offX + 16) + 'px' }
  }

  _closeContextMenu () {
    this.ctxmenu.style.display = 'none'
    this.ctxmenu.dataset.open = 'false'
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  async openProject (repo) {
    if (!window.CONVOS[this.key]) { // make sure convo is laoded before proceeding
      return setTimeout(() => this.openProject(repo), 100)
    }

    if (!repo) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'open-project')
      return
    }

    // Phase 3: if we have unpushed local changes for this repo, ask the
    // student which copy to open before destroying anything.
    const hasLocal = await this._peekUnpushedLocal(repo)
    if (hasLocal) {
      this._pendingOpenRepo = repo
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'open-from-local-or-github')
      return
    }

    await this._openFromGitHub(repo)
  }

  async _openFromGitHub (repo) {
    utils.cancelAllNetitorUses('project-files')
    WIDGETS['student-session'].clearSaveState()
    const owner = WIDGETS['student-session'].getData('owner')
    if (this.projectData.name) this.closeProject()
    nn.get('load-curtain').show('folder.html', { filename: repo })
    this.open()

    // load data for all the files
    utils.post('./api/github/open-all-files', { repo, owner }, async (res) => {
      if (res.success === 'false') {
        nn.get('load-curtain').hide()
        return this._ohNoErr(res)
      }

      if (Object.keys(res.data).includes('index.html')) {
        utils.setCustomRenderer(null)

        this._setupCodeUpdateListener()

        // update student session data
        const htmlUrl = res.data['index.html'].html_url
        const branch = (htmlUrl.includes('/blob/master')) ? 'master' : 'main'
        const url = (htmlUrl.includes('/blob/master'))
          ? htmlUrl.split('/blob/master')[0] : htmlUrl.split('/blob/main')[0]
        this.projectData = { url, branch, name: repo }
        this.dbName = repo

        // wipe any stale local DB for this repo before re-initializing
        // with the freshly-fetched GitHub state. Phase 3 will gate this
        // behind an "open from local?" check.
        await this._destroyProjectDB(repo)
        this._swControl = this._initServiceWorker() // setup service worker
        this.db = await this._initIndexedDB() // setup indexedDB
        await this._saveFilesToIndexedDB()
        await this._saveProjectMetaToIndexedDB()

        // update netnet URL
        const ghStr = branch === 'main'
          ? `?gh=${owner}/${repo}`
          : `?gh=${owner}/${repo}/${branch}`
        utils.updateURL(ghStr)

        // setup netitor's custom renderer to work with service worker
        this._setCustomRenderer()

        // load all the data

        Object.entries(res.data).forEach((arr) => {
          const name = arr[0]
          const data = arr[1]
          const mt = this._getMimeType(name)
          const textMimes = ['application/json', 'image/svg+xml', 'model/gltf+json']
          const isTxt = mt.split('/')[0] === 'text' || textMimes.includes(mt)
          this.files[name] = { path: data.path }
          let code // store plain-text/code
          if (name.split('/').includes('.gitkeep') || isTxt) {
            code = (data.content === '') ? data.download_url : utils.atob(data.content)
            // exception for empty index.html files
            if (name === 'index.html' && data.content === '') code = ''
          } else { // otherwise assume binary file && store blob-url (or github URL)
            // b/c github sends back empty strings for large binary files's content
            code = (data.content === '')
              ? data.download_url : this._base64ToBlob(data.content, mt)
          }
          this._updateFile(name, code)
        })

        this.lastCommitFiles = this._snapshotFiles(this.files)
        await this._saveBaselinesToIndexedDB()

        this._updateFilesGUI()

        // open the index.html file by default
        this.openFile('index.html')
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'project-opened')
        // NOTE: load-curtain is hidden after index.html file is opened
      } else {
        this.files = {}
        nn.get('load-curtain').hide()
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'not-a-web-project')
      }
    })
  }

  // Phase 3: open a project from its local IDB without touching GitHub.
  // Used when the student picks "open local copy" in response to the
  // open-from-local-or-github convo.
  async _openFromLocal (repo) {
    utils.cancelAllNetitorUses('project-files')
    WIDGETS['student-session'].clearSaveState()
    if (this.projectData.name) this.closeProject()
    nn.get('load-curtain').show('folder.html', { filename: repo })
    this.open()

    this.dbName = repo
    this._swControl = this._initServiceWorker()
    this.db = await this._initIndexedDB()

    const filesDict = await this._loadFilesFromIndexedDB()
    const baselines = await this._loadBaselinesFromIndexedDB()
    const meta = await this._loadProjectMetaFromIndexedDB()

    if (!meta || !filesDict || Object.keys(filesDict).length === 0) {
      // local data is incomplete somehow — fall back to GitHub
      console.warn('ProjectFiles: local data incomplete, falling back to GitHub')
      nn.get('load-curtain').hide()
      return this._openFromGitHub(repo)
    }

    utils.setCustomRenderer(null)
    this._setupCodeUpdateListener()

    this.projectData = {
      name: meta.repo || repo,
      branch: meta.branch || 'main',
      url: meta.url || null,
      ghpages: null
    }

    // populate this.files from the IDB working copy
    for (const [path, code] of Object.entries(filesDict)) {
      this.files[path] = { path, code }
    }
    // reconstruct lastCommitFiles so computeChanges keeps working
    this.lastCommitFiles = this._reconstructLastCommitFiles(this.files, baselines)

    const owner = meta.owner || WIDGETS['student-session'].getData('owner')
    const ghStr = (this.projectData.branch === 'main')
      ? `?gh=${owner}/${repo}`
      : `?gh=${owner}/${repo}/${this.projectData.branch}`
    utils.updateURL(ghStr)

    this._setCustomRenderer()
    this._updateFilesGUI()

    this.openFile('index.html')
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'project-opened-from-local')
  }

  closeProject () {
    // reset this widget — keep the project's IndexedDB intact so unpushed
    // local work survives close. just release the connection.
    if (this.db) {
      try { this.db.close() } catch (e) { /* already closed */ }
      this.db = null
    }
    this.files = {}
    this._createHTML()
    this.viewing = null
    this.rendering = null
    this.lastCommitFiles = {}
    this.projectData = {}
    // remove github path from URL + clear title bar
    utils.updateURL()
    NNW.updateTitleBar(null)
    // remove code update event listener
    NNE.off('code-update', this.codeEdit)
    this.codeEdit = null
    // remove custom shorcuts
    const CM = NNE.cm.constructor
    CM.keyMap.default['Cmd-Z'] = 'undo'
    CM.keyMap.default['Ctrl-Z'] = 'undo'
    CM.keyMap.default['Cmd-Y'] = 'redo'
    CM.keyMap.default['Ctrl-Y'] = 'redo'
    delete CM.commands.nnU
    delete CM.commands.nnR
    // clear code
    NNE.customRender = null
    NNE.code = ''
    NNE.language = 'html'
    NNE.wrap = WIDGETS['student-session'].getData('wrap') === 'true'
    // close widget
    this.close()
  }

  publishProject () {
    const ur = WIDGETS['student-session'].getData('owner')
    const op = this.projectData.name
    if (!op) {
      window.convo = new Convo(this.convos, 'cant-publish-project')
      return
    }

    nn.get('load-curtain').show('github.html', { filename: `${ur}/${op}` })
    const data = {
      owner: WIDGETS['student-session'].getData('owner'),
      repo: this.projectData.name,
      branch: this.projectData.branch
    }
    utils.post('./api/github/gh-pages', data, (res) => {
      if (!res.success) {
        nn.get('load-curtain').hide()
        window.convo = new Convo(this.convos, 'oh-no-error')
      } else {
        this.projectData.ghpages = res.data.html_url
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'published-to-ghpages')
      }
      nn.get('load-curtain').hide()
    })
  }

  // Create and download a ZIP of the current project files
  async downloadProject () {
    try {
      if (!this.projectData?.name) {
        console.error('ProjectFiles: no project open to download.')
        return
      }

      await this._ensureJSZip()

      const zip = new window.JSZip()
      const root = zip.folder(this.projectData.name || 'project')

      const entries = Object.entries(this.files || {})
      const tasks = entries.map(async ([path, file]) => {
        const code = file?.code
        const zipPath = path.replace(/^\/+/, '')

        // include empty files explicitly
        if (code === '' || code === null || typeof code === 'undefined') {
          root.file(zipPath, '')
          return
        }

        if (code instanceof window.Blob) {
          root.file(zipPath, code, { compression: 'STORE' })
          return
        }

        if (typeof code === 'string') {
          // blob: or http(s) URL — fetch and store binary
          if (code.startsWith('blob:') || code.startsWith('http')) {
            try {
              const res = await window.fetch(code)
              if (!res.ok) throw new Error(`fetch failed with status ${res.status}`)
              const blob = await res.blob()
              root.file(zipPath, blob, { compression: 'STORE' })
            } catch (err) {
              // fallback: if text-like, save as text; otherwise log the error
              const mt = this._getMimeType(zipPath)
              if (this._isTxt(zipPath, mt)) {
                root.file(zipPath, code)
              } else {
                console.error('ProjectFiles: failed to fetch asset for zip:', zipPath, err)
              }
            }
          } else {
            // treat as plain text
            root.file(zipPath, code)
          }
          return
        }

        // unknown type — stringify as last resort
        try { root.file(zipPath, String(code)) } catch (e) { /* noop */ }
      })

      await Promise.all(tasks)

      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'download-project')

      const blob = await zip.generateAsync({ type: 'blob' })
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = `${this.projectData.name}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(a.href)
    } catch (error) {
      console.error('ProjectFiles: failed to download project zip:', error)
    }
  }

  // NOTE: this is here for the future, if/when we want to be able to work on
  // "local" projects (ie. projs u upload/download locally) instead of requreing
  // a GitHub account to work on projects. This method has been tested, but not
  // thoroughly. Apart from this method, we'll need to adjust the entire proj
  // workflow (b/c we can no longer assume it's a github repo)

  /*
  // Open a .zip and import files into the current (or new) project
  async uploadProject () {
    try {
      await this._ensureJSZip()

      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.zip,application/zip'
      input.style.display = 'none'
      document.body.appendChild(input)

      input.addEventListener('change', async () => {
        const file = input.files && input.files[0]
        input.remove()
        if (!file) return

        nn.get('load-curtain').show('folder.html', { filename: file.name })
        try {
          const ab = await file.arrayBuffer()
          const zip = await window.JSZip.loadAsync(ab)

          // collect file entries (skip directories and __MACOSX)
          const entries = []
          zip.forEach((path, zipEntry) => {
            if (zipEntry.dir) return
            if (path.startsWith('__MACOSX/')) return
            entries.push(path)
          })

          if (entries.length === 0) {
            console.warn('ProjectFiles: zip is empty or contains only unsupported files')
            nn.get('load-curtain').hide()
            return
          }

          // determine common top-level folder to strip (e.g., repo-branch/)
          const firstSegs = entries.map(p => p.split('/')[0])
          const sameTop = firstSegs.every(s => s === firstSegs[0])
          const stripRoot = sameTop ? firstSegs[0] : ''

          // derive project name when none is open
          let projName = this.projectData?.name
          if (!projName) {
            projName = stripRoot || file.name.replace(/\.zip$/i, '')
            this.projectData = { name: projName, branch: 'local', url: null }
            this.dbName = projName
            // wipe any stale local DB with this name before init
            await this._destroyProjectDB(projName)
            this._swControl = this._initServiceWorker()
            this.db = await this._initIndexedDB()
          } else {
            // replacing current project contents — destroy + re-init
            await this._destroyProjectDB(this.dbName)
            this.db = await this._initIndexedDB()
          }

          // load each entry
          const tasks = entries.map(async (fullPath) => {
            const rel = stripRoot && fullPath.startsWith(stripRoot + '/')
              ? fullPath.slice(stripRoot.length + 1)
              : fullPath
            const path = rel.replace(/^\/+/, '')
            const extType = this._getMimeType(path)
            const isText = this._isTxt(path, extType)
            const item = zip.file(fullPath)
            if (!item) return
            if (isText) {
              const text = await item.async('string')
              await this._updateFile(path, text)
            } else {
              const blob = await item.async('blob')
              const typed = new window.Blob([blob], { type: extType })
              await this._updateFile(path, typed)
            }
          })

          await Promise.all(tasks)

          this._removeRedundantGitkeeps()
          await this._saveFilesToIndexedDB()

          // ensure custom renderer is active for SW loading
          this._setCustomRenderer && this._setCustomRenderer()

          this.lastCommitFiles = this._snapshotFiles(this.files)
          this._updateFilesGUI()

          // open index.html if present
          if (this.files['index.html']) this.openFile('index.html')
        } catch (err) {
          console.error('ProjectFiles: failed to upload project zip:', err)
        } finally {
          nn.get('load-curtain').hide()
        }
      })

      input.click()
    } catch (error) {
      console.error('ProjectFiles: uploadProject init failed:', error)
    }
  }
  */

  async _ensureJSZip () {
    if (typeof window.JSZip !== 'undefined') return
    await new Promise((resolve, reject) => {
      const s = document.createElement('script')
      s.src = '/core/libs/jszip.min.js'
      s.onload = () => resolve()
      s.onerror = (e) => reject(new Error('Failed to load JSZip'))
      document.head.appendChild(s)
    })
  }

  _openMediaViewer (filepath, type) { // TODO: make sure widget fits (might need to scale image down)
    const urlBlob = this._toBlobURL(this.files[filepath].code)

    let html = `<div style="align-self: flex-end; margin-bottom: 13px;">
      <a href="${urlBlob}" target="_blank">open file in new tab</a>
    </div>`
    if (type === 'image') {
      html += `<img src="${urlBlob}" style="max-height: ${nn.height / 2}px; background: repeating-conic-gradient(#ccc 0 25%,#fff 0 50%) 0 / 10px 10px;">`
    } else if (type === 'video') {
      html += `<video src="${urlBlob}" controls style="max-height: ${nn.height / 2}px"></video`
    } else if (type === 'audio') {
      html += `<audio src="${urlBlob}" controls></audio`
    }

    if (WIDGETS.instantiated.includes(`VIEW-${filepath}`)) {
      WIDGETS[`VIEW-${filepath}`].innerHTML = html
      return WIDGETS[`VIEW-${filepath}`].open()
    } else {
      const o = { key: `VIEW-${filepath}`, title: 'Media File Viewer', innerHTML: html }
      const w = WIDGETS.create(o)
      const inner = w.ele.querySelector('.widget__inner-html')
      inner.style.display = 'flex'
      inner.style.flexDirection = 'column'
      inner.style.alignItems = 'center'
      w.open()
      return w
    }
  }

  openFile (filepath, skipSave) {
    window.convo.hide()
    this._opening = filepath
    this._openingCode = this._toBlobURL(this.files[filepath].code)

    this.convos = window.CONVOS[this.key](this)
    const imgs = ['jpg', 'jpeg', 'png', 'gif', 'ico', 'webp']
    const txts = ['html', 'css', 'js', 'md', 'txt', 'json', 'csv', 'xml', 'svg']
    const vids = ['mp4', 'webm', 'ogv']
    const auds = ['mp3', 'wav', 'ogg']
    const ext = filepath.split('.').pop().toLowerCase()

    if (imgs.includes(ext) || imgs.includes(ext.toLowerCase())) {
      return this._openMediaViewer(filepath, 'image')
    } else if (vids.includes(ext) || vids.includes(ext.toLowerCase())) {
      return this._openMediaViewer(filepath, 'video')
    } else if (auds.includes(ext) || auds.includes(ext.toLowerCase())) {
      return this._openMediaViewer(filepath, 'audio')
    } else if (filepath === 'LICENSE') {
      window.convo = new Convo(this.convos, 'license'); return
    } else if (filepath.includes('.gitignore')) {
      window.convo = new Convo(this.convos, 'gitignore'); return
    } else if (filepath === 'CNAME') {
      window.convo = new Convo(this.convos, 'cname'); return
    } else if (!filepath.includes('.gitkeep') && !txts.includes(ext) && !txts.includes(ext.toLowerCase())) {
      window.convo = new Convo(this.convos, 'unknown-format2'); return
    } else if (typeof this.files[filepath].code === 'string' && this.files[filepath].code.startsWith('https://raw.')) {
      this._jsLibPath = this.files[filepath].code
      this.convos = window.CONVOS[this.key](this)
      if (filepath.endsWith('.js')) window.convo = new Convo(this.convos, 'js-too-big')
      else window.convo = new Convo(this.convos, 'misc-too-big')
      return
    }

    if (this.viewing && this.files[this.viewing] && !skipSave) { // make sure not to loose unsaved data
      const lastSave = this.readFile(this.viewing)
      if (NNE.code !== lastSave) {
        window.convo = new Convo(this.convos, 'will-loose-data'); return
      }
    }

    if (this.files[filepath].code.length / (1024 * 1024) >= 1.0) {
      window.convo = new Convo(this.convos, 'txt-too-big'); return
    }

    if (ext === 'html' || ext === 'svg' || ext === 'md') {
      if (this.$('li.rendering')) this.$('li.rendering').classList.remove('rendering')
      this.rendering = filepath
      const newRnd = this.$(`li[data-path="${filepath}"]`)
      if (newRnd) newRnd.classList.add('rendering')
    }
    this.viewing = filepath
    this._opening = null
    if (this._openingCode) URL.revokeObjectURL(this._openingCode)
    this._openingCode = null

    if (WIDGETS['demo-toc']) WIDGETS['demo-toc'].cancel()

    const repo = this.projectData.name
    NNW.updateTitleBar(`${repo}/${filepath}`)
    NNW.title.dataset.project = true

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

    if (this.history.stack[filepath]?.length === 0) {
      this.history.stack[filepath] = [NNE.code]
      this.history.redoStack[filepath] = []
    }

    setTimeout(() => {
      if (!nn.get('load-curtain').showing) return
      // run on initial load only
      NNW.menu.switchFace('default')
      const { x, y } = this._openSpot()
      this.update({ left: x, top: y }, 500)
      nn.get('load-curtain').hide()
      if (!NNE.autoUpdate) NNE.update()
    }, utils.getVal('--layout-transition-time'))
  }

  undo () {
    const path = this.viewing
    const s = this.history.stack[path]
    if (!s || s.length < 2) return
    const cur = s.pop()
    this.history.redoStack[path].push(cur)
    const prev = s[s.length - 1]
    this.history.skipPush = true
    NNE.code = prev.code
    NNE.cm.setCursor(prev.cursor)
    NNE.cm.scrollTo(prev.scroll.left, prev.scroll.top)
  }

  redo () {
    const path = this.viewing
    const r = this.history.redoStack[path]
    if (!r || !r.length) return
    const next = r.pop()
    this.history.stack[path].push(next)
    this.history.skipPush = true
    NNE.code = next.code
    NNE.cm.setCursor(next.cursor)
    NNE.cm.scrollTo(next.scroll.left, next.scroll.top)
  }

  deleteFile (filepath) {
    const fpath = this._rightClicked.dataset.path
    if (filepath || !fpath) return console.error('deleteFile: can only be used via the project-files context menu')
    if (fpath === 'index.html') {
      window.convo = new Convo(this.convos, 'no-delete-index'); return
    }
    this._delete = fpath
    this.convos = window.CONVOS[this.key](this)
    if (!this.files[fpath]) { // assume it's a folder (which can only exist if there are files in it)
      window.convo = new Convo(this.convos, 'can-no-delete'); return
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

  moveFilePath (file) {
    const fpath = this._rightClicked.dataset.path
    const type = this._fpathExists(fpath)
    if (file || !type) return console.error('moveFilePath: can only be used via the project-files context menu')
    this.convos = window.CONVOS[this.key](this)
    if (Object.keys(this.files).filter(path => path.includes('/')).length > 0) {
      window.convo = new Convo(this.convos, 'move-update-path')
    } else window.convo = new Convo(this.convos, 'move-no-other-path')
  }

  newProject () {
    if (typeof window.CONVOS[this.key] !== 'function') {
      setTimeout(() => this.newProject(), 100); return
    }
    // if convo is ready, then continue...
    const op = this.projectData.name
    const owner = WIDGETS['student-session'].getData('owner')
    const urlUser = utils.url.github ? utils.url.github.split('/')[0] : null
    this.convos = window.CONVOS[this.key](this)
    if (!op && utils.url.github && urlUser !== owner) {
      window.convo = new Convo(this.convos, 'unsaved-changes-b4-fork-proj')
    } else if (!op && utils.url.github && urlUser === owner) {
      window.convo = new Convo(this.convos, 'unsaved-changes-b4-own-proj')
    } else if (this.changes.length > 0) {
      window.convo = new Convo(this.convos, 'unsaved-changes-b4-new-proj')
    } else {
      if (NNW.layout !== 'welcome' && NNE.code !== '') {
        const tpw = WIDGETS['template-projects'] // if code is from a template
        if (tpw && typeof tpw.state.name === 'string' && typeof tpw.state.files === 'object') {
          tpw.preNewRepoFromTemplate()
        } else window.convo = new Convo(this.convos, 'clear-code?')
      } else { window.convo = new Convo(this.convos, 'create-new-project') }
    }
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
    const bytesToMB = (bytes) => {
      if (bytes === 0) return 0
      const mb = bytes / (1024 * 1024)
      return Number(mb.toFixed(1))
    }

    const allowedTypes = Object.values(this.mimeTypes)
    allowedTypes.push('application/x-javascript')
    allowedTypes.push('application/ogg')
    // accept by extension for formats where browsers often omit type
    allowedTypes.push('.woff', '.woff2', '.ttf', '.otf')
    allowedTypes.push('.obj', '.mtl', '.gltf', '.glb')
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = allowedTypes.join(',')
    input.style.display = 'none'
    document.body.appendChild(input)
    input.addEventListener('change', async () => {
      this._uploadedFile = input.files[0]
      if (!input.files[0]) return
      const mb = bytesToMB(this._uploadedFile.size)
      const txt = input.files[0].type.startsWith('text') ||
          input.files[0].type === 'application/x-javascript'
      this._uploadedFile.smb = mb
      this.convos = window.CONVOS[this.key](this)
      if (txt && mb > 1.0) {
        window.convo = new Convo(this.convos, 'text-file-too-big')
      } else if (mb > 50.0) {
        window.convo = new Convo(this.convos, 'file-too-big')
      } else if (mb > 5.0) {
        window.convo = new Convo(this.convos, 'file-pretty-big')
      } else {
        this._postUpload()
      }
    })
    input.click()
    setTimeout(() => document.body.removeChild(input), 200)
  }

  saveCurrentFile (skipUpdate) {
    this._updateFile(this.viewing, NNE.code)
    // force iframe reload via NNE.update() since customRender otherwise
    // skips reassigning src when target URL is unchanged.
    this._forceRender = true
    if (!skipUpdate) NNE.update()
    this._updateViewingFile()
    console.clear()
    if (this.log) console.log('PF: saveCurrentFile')
  }

  // Read a specific file from the files object
  readFile (filePath) {
    return this.files[filePath]?.code || null // Return the file content or null if the file doesn't exist
  }

  getFileData (filePath) {
    const path = filePath
    const code = this.readFile(path) || ''
    // directory (empty string for root)
    const slashIdx = path.lastIndexOf('/')
    const dir = slashIdx === -1 ? '' : path.slice(0, slashIdx)
    // filename (with extension)
    const fileName = slashIdx === -1 ? path : path.slice(slashIdx + 1)
    // split name + ext
    const dotIdx = fileName.lastIndexOf('.')
    let name = fileName
    let ext = ''
    let fullname = fileName

    if (dotIdx > 0) {
      name = fileName.slice(0, dotIdx)
      ext = fileName.slice(dotIdx + 1)
      fullname = `${name}.${ext}`
    }

    let lang = 'binary'
    if (ext === 'html') lang = 'html'
    else if (ext === 'css') lang = 'css'
    else if (ext === 'js') lang = 'javascript'
    return { code, lang, dir, name, ext, fullname, path }
  }

  // List all files in the store
  listAllFiles () {
    return Object.keys(this.files)
  }

  copyFilePath () {
    const editingExt = this.viewing.split('.').pop().toLowerCase()
    const baseFile = editingExt === 'css' ? this.viewing : this.rendering

    let convo = 'copy-relative-path'
    if (editingExt === 'js') convo = 'copy-relative-path2'
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, convo)

    const from = baseFile.split('/').slice(0, -1)
    const to = this._rightClicked.dataset.path.split('/')

    let i = 0
    while (i < from.length && i < to.length && from[i] === to[i]) {
      i++
    }

    const upCount = from.length - i
    const relParts = [
      ...Array(upCount).fill('..'),
      ...to.slice(i)
    ]

    const relPath = relParts.join('/')
    navigator.clipboard.writeText(relPath)
  }

  explainTitleBar (path) {
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'netnet-title-bar')

    if (!this.opened) {
      this.open()
      const { x, y } = this._openSpot()
      this.update({ left: x, top: y }, 500)
    }
  }

  explainSave () {
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'cmd-enter-save-info')
  }

  _openSpot () {
    const pt = nn.get('#proj-title')
    const pad = pt.style.padding.split(' ').map(v => parseInt(v))
    const cx = pt.x + ((pt.width - (pad[1] + pad[3])) / 2) + pad[3]
    const x = cx - this.width / 2
    const y = pt.y + pt.height
    return { x, y }
  }

  _snapshotFiles (files) {
    const snap = {}
    for (const [path, f] of Object.entries(files || {})) {
      // shallow copy; keep the exact Blob/string reference
      snap[path] = { path: f.path, code: f.code }
    }
    return snap
  }

  async resetChanges () {
    this.lastCommitFiles = this._snapshotFiles(this.files)
    await this._saveBaselinesToIndexedDB()
    this.changes = await this.computeChanges()
    return this.changes
  }

  async computeChanges () {
    const oldFiles = this.lastCommitFiles || {}
    const newFiles = this.files || {}

    const toBase64 = async (src) => {
      if (src instanceof window.Blob) {
        const buf = await src.arrayBuffer()
        // fast btoa for big arrays
        let binary = ''
        const bytes = new Uint8Array(buf)
        const chunk = 0x8000
        for (let i = 0; i < bytes.length; i += chunk) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk))
        }
        return window.btoa(binary)
      }
      if (typeof src === 'string' && src.startsWith('blob:')) {
        const r = await window.fetch(src)
        return toBase64(await r.blob())
      }
      if (typeof src === 'string' && src.startsWith('data:')) {
        return src.split('base64,')[1] || ''
      }
      return '' // or throw if you prefer
    }

    const isBinary = (v) =>
      v instanceof window.Blob ||
      (typeof v === 'string' && (v.startsWith('blob:') || v.startsWith('data:')))

    const changes = []
    const allPaths = new Set([...Object.keys(oldFiles), ...Object.keys(newFiles)])

    for (const path of allPaths) {
      const prev = oldFiles[path]
      const curr = newFiles[path]

      if (!prev && curr) {
        const change = { action: 'create', path }
        change.isBinary = isBinary(curr.code)
        change.content = change.isBinary ? await toBase64(curr.code) : (curr.code || '')
        changes.push(change)
        continue
      }

      if (prev && !curr) {
        changes.push({ action: 'delete', path })
        continue
      }

      if (prev && curr) {
        const a = prev.code
        const b = curr.code

        let same = false
        if (typeof a === 'string' && typeof b === 'string') same = a === b
        else if (a instanceof window.Blob && b instanceof window.Blob) same = a === b // Blob identity

        if (!same) {
          const change = { action: 'update', path }
          change.isBinary = isBinary(b)
          change.content = change.isBinary ? await toBase64(b) : (b || '')
          changes.push(change)
        }
      }
    }

    return changes
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _setupCodeUpdateListener () {
    if (this.codeEdit) return

    // setup code-update event listener
    const codeEdit = () => {
      if (!this.projectData.name) return
      this._updateViewingFile()
    }
    this.codeEdit = codeEdit
    NNE.on('code-update', codeEdit)

    // setup custom keybord shortcuts logic
    const CM = NNE.cm.constructor
    CM.commands.nnU = cm => this.undo(cm)
    CM.commands.nnR = cm => this.redo(cm)
    CM.keyMap.default['Cmd-Z'] = 'nnU'
    CM.keyMap.default['Ctrl-Z'] = 'nnU'
    CM.keyMap.default['Cmd-Y'] = 'nnR'
    CM.keyMap.default['Ctrl-Y'] = 'nnR'
  }

  _ohNoErr (res) {
    console.log('ProjectFiles:', res)
    window.convo = new Convo(this.convos, 'oh-no-error')
  }

  waitForSWControl (timeoutMs = 1200) {
    return new Promise(resolve => {
      // already controlled?
      if (navigator.serviceWorker && navigator.serviceWorker.controller) return resolve(true)

      let done = false
      const finish = ok => { if (!done) { done = true; cleanup(); resolve(ok) } }

      const onChange = () => finish(true)
      const cleanup = () => {
        if (navigator.serviceWorker) {
          navigator.serviceWorker.removeEventListener('controllerchange', onChange)
        }
        clearTimeout(timer)
      }

      // when the active worker is ready, we may or may not be controlled; if still not, wait a bit more
      if (navigator.serviceWorker) {
        navigator.serviceWorker.ready.then(() => {
          if (navigator.serviceWorker.controller) finish(true)
        })
        navigator.serviceWorker.addEventListener('controllerchange', onChange)
      }

      const timer = setTimeout(() => finish(false), timeoutMs)
    })
  }

  _setCustomRenderer () {
    NNE.customRender = async (eve) => {
      // await (this._swControl || Promise.resolve())

      // don't hang here forever on hard-reload
      const controlled = await this.waitForSWControl(1200)

      if (this.listAllFiles().length > 0) {
        const page = (this.rendering || 'index.html').replace(/^\/+/, '')
        const swPath = `/PROJ__${encodeURIComponent(this.dbName)}`

        if (!controlled) {
          // if not controlled, probably b/c they hard refreshed, let them know...
          eve.update('<div style="font:24px system-ui;padding:1rem">Seems you may have refreshed the page with a "hard reload". Refresh netnet once more normally for things to reboot correctly ( ◕ ◞ ◕ )</div>')
          return
        }

        // avoid reassigning src on every keystroke (would force a full
        // iframe reload and re-fetch all assets, e.g. big images flicker).
        // saveCurrentFile triggers an explicit reload when the rendered
        // file is saved.
        const target = new URL(`${swPath}/${page}`, window.location.origin).href
        if (eve.iframe.src !== target || this._forceRender) {
          eve.iframe.src = `${swPath}/${page}`
          this._forceRender = false
          if (this.log) console.log('rendered via SW path')
        }

        if (!this.files[page]?.code) {
          eve.update(`<h1>⚠️ 404</h1> <h3>the file <i>${page}</i> could not be found.</h3> If you're still working on this file, you'll need to write some code to your file first and then <i>save</i> it (${utils.hotKey()} + S) before it can be rendered.`)
        }
      } else {
        // eve.iframe.srcdoc = eve.code
        eve.update(eve.code) // srcdoc fallback only when no files yet
        if (this.log) console.log('rendered default')
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
    const dirPaths = new Set()

    allFiles.forEach(fp => {
      const idx = fp.lastIndexOf('/')
      if (idx === -1) return

      // start with the immediate parent
      let dir = fp.slice(0, idx)

      // add this dir *and* all its ancestors
      while (true) {
        dirPaths.add(dir)
        const slash = dir.lastIndexOf('/')
        if (slash === -1) break
        dir = dir.slice(0, slash)
      }
    })

    if (this.files[fpath]) {
      return 'file'
    } else if (dirPaths.has(fpath)) {
      return 'folder'
    } else {
      return false
    }
  }

  _isTxt (name, type) {
    const mimeType = type || this.mimeTypes[name.split('.')[1]]
    return mimeType.split('/')[0] === 'text' ||
      mimeType === 'application/json' ||
      mimeType === 'model/gltf+json' ||
      mimeType === 'application/x-javascript' ||
      mimeType === 'application/xml'
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

  _toBlobURL (c) { // convert files[path].code into URL
    if (typeof c === 'string' && (c.startsWith('blob:') || c.startsWith('http'))) return c
    else if (c instanceof window.Blob) return URL.createObjectURL(c)
    else return null
  }

  _base64ToBlob (base64, mimeType = '') {
    const binary = window.atob(base64)
    const len = binary.length
    const chunkSize = 1 << 20 // 1MB
    const parts = []

    for (let i = 0; i < len; i += chunkSize) {
      const slice = binary.slice(i, i + chunkSize)
      const arr = new Uint8Array(slice.length)
      for (let j = 0; j < slice.length; j++) arr[j] = slice.charCodeAt(j)
      parts.push(arr)
    }

    return new window.Blob(parts, { type: mimeType })
  }

  _base64ToText (base64) {
    try {
      const decoded = window.atob(base64)
      const bytes = new Uint8Array([...decoded].map(c => c.charCodeAt(0)))
      const decoder = new TextDecoder('utf-8')
      return decoder.decode(bytes)
    } catch (err) {
      console.error('Failed to decode base64 to text:', err)
      return null
    }
  }

  async _updateFile (filePath, fileContent) {
    if (!this.files[filePath]) { // create new file
      this.files[filePath] = { code: fileContent, path: filePath }
      this._colorizeChanges()
    } else { // update existing file
      const oldCode = this.files[filePath].code
      this.files[filePath].code = fileContent
      if (!oldCode) this._updateFilesGUI() // re-render to remove "(empty file)"
      else this._colorizeChanges()
    }
    await this._saveFilesToIndexedDB()
  }

  _removeRedundantGitkeeps () {
    const folders = {} // group keys by parent folder
    for (const path of Object.keys(this.files)) {
      const parts = path.split('/')
      const name = parts.pop()
      const folder = parts.join('/') || ''
      if (!folders[folder]) folders[folder] = []
      folders[folder].push({ name, full: path })
    }
    // delete .gitkeep when the folder has another entry
    for (const entries of Object.values(folders)) {
      const idx = entries.findIndex(e => e.name === '.gitkeep')
      if (idx !== -1 && entries.length > 1) {
        delete this.files[entries[idx].full]
      }
    }
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
    // make sure project files list says "rendering"
    if (this.viewing === this.rendering && NNE.code !== '' && !NNW.title.dataset.unsaved) {
      const r = this.$(`li[data-path="${this.viewing}"]`)
      if (r && !r.classList.contains('rendering')) r.classList.add('rendering')
    }
    // update file edit history (for under/redo)
    if (this.history.skipPush) {
      clearTimeout(this.history.timer)
      this.history.skipPush = false
      return
    }
    const path = this.viewing || 'index.html'
    clearTimeout(this.history.timer)
    this.history.timer = setTimeout(() => {
      const code = NNE.code
      const cursor = NNE.cm.getCursor()
      const scroll = NNE.cm.getScrollInfo()
      this.history.stack[path] = this.history.stack[path] || []
      this.history.redoStack[path] = []
      const len = this.history.stack[path].length
      const last = this.history.stack[path][len - 1]
      if (!last || last.code !== code) { // only push if text really changed
        this.history.stack[path].push({ code, cursor, scroll })
        if (len > this.history.max) this.history.stack[path].shift()
      }
    }, this.history.debounce)
  }

  _getMimeType (filePath) {
    const extension = filePath.split('.').pop().toLowerCase()
    const type = this.mimeTypes[extension] || 'application/octet-stream'
    return type
  }

  // --------------------- --------------------- --------------------- ---------
  // ------- functions which run after user dialogue with context menu functions

  _postNewRepo (c, t, v) {
    utils.cancelAllNetitorUses('project-files')
    WIDGETS['student-session'].clearSaveState()
    const user = WIDGETS['student-session'].getData('owner')
    const indexData = utils.starterCode() === NNE.code || NNE.code === ''
      ? '<h1>Hello World Wide Web!</h1>' : NNE.code
    nn.get('load-curtain').show('github.html', { filename: `${user}/${v}` })
    const data = { name: v, user, indexData }
    window.utils.post('./api/github/new-repo', data, async (res) => {
      if (res.error) {
        console.log('ProjectFiles:', res.error)
        if (res.error.errors[0].message.includes('name already exists')) {
          window.convo = new Convo(this.convos, 'project-already-exists')
        } else window.convo = new Convo(this.convos, 'oh-no-error')
        setTimeout(() => nn.get('load-curtain').hide(), 500)
      } else if (!res.success) {
        console.log('ProjectFiles:', res)
        window.convo = new Convo(this.convos, 'oh-no-error')
        setTimeout(() => nn.get('load-curtain').hide(), 500)
      } else { // otherwise let the user know it's all good!
        if (NNW.layout === 'welcome') NNW.layout = 'dock-left'
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'new-project-created')

        // ... upldate list of repos...
        utils.get('/api/github/saved-projects', (json) => {
          if (!json.data) return
          const names = json.data.map(o => o.name)
          WIDGETS['student-session'].setData('repos', names.join(', '))
        })

        this._setupCodeUpdateListener()

        // update student session data
        this.projectData = {
          name: res.repo,
          url: res.url,
          ghpages: null,
          branch: res.branch
        }
        this.dbName = res.repo

        // wipe any stale local DB with this name before init
        await this._destroyProjectDB(res.repo)
        this._swControl = this._initServiceWorker() // setup service worker
        this.db = await this._initIndexedDB() // setup indexedDB
        await this._saveFilesToIndexedDB()
        await this._saveProjectMetaToIndexedDB()

        // update netnet URL
        const ghStr = res.branch === 'main'
          ? `?gh=${res.owner}/${res.repo}`
          : `?gh=${res.owner}/${res.repo}/${res.branch}`
        utils.updateURL(ghStr)

        // setup netitor's custom renderer to work with service worker
        this._setCustomRenderer()

        // load all the data
        res.data.forEach((arr) => {
          const name = arr[0]
          this.files[name] = { path: name }
          this._updateFile(name, arr[1])
        })

        this.lastCommitFiles = this._snapshotFiles(this.files)
        await this._saveBaselinesToIndexedDB()

        this._updateFilesGUI()

        if (!this.opened) this.open()

        // open the index.html file by default
        this.openFile('index.html')
        window.convo = new Convo(this.convos, 'project-opened')
        // NOTE: load-curtain is hidden after index.html file is opened
      }
    })
  }

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
      if (this._isTxt(path)) this.openFile(path) // open file by default
      this._updateFilesGUI()
    } else if (type === 'folder') {
      const str = 'This ".gitkeep" file is a typical GitHub hack. The file exists in order to create an otherwise empty folder/directory on GitHub. Once you\'ve pushed other files to this folder you can delete this file, but if this is the only file in the folder, deleting it will also delete the folder. To learn more see: https://stackoverflow.com/a/7229996/1104148'
      await this._updateFile(path, str)
      this._updateFilesGUI()
      // open dir by default (NOT WORKING)
      // this.$(`li[data-path="${path}"]`).click()
    }
  }

  _postUpload () {
    const cpath = this._rightClicked.dataset.path
    const fof = this._fpathExists(cpath)
    const path = fof === 'folder' ? cpath : this._getSubPath(cpath)
    const allowedTypes = Object.values(this.mimeTypes)
    allowedTypes.push('application/x-javascript')
    allowedTypes.push('application/ogg')
    const file = this._uploadedFile
    let type = file.type
    if (!file) return console.error('project-files: upload file faild, no file data to uplaod')
    // finders/browsers screw up font mimeTypes, this corrects for that
    const ext = file.name.split('.').pop().toLowerCase()
    const fmt = ['woff', 'woff2', 'ttf', 'otf']
    if (fmt.includes(ext)) type = `font/${ext}`
    // normalize 3D formats where type is often blank or generic
    if (ext === 'obj') type = this.mimeTypes.obj
    else if (ext === 'mtl') type = this.mimeTypes.mtl
    else if (ext === 'gltf') type = this.mimeTypes.gltf
    else if (ext === 'glb') type = this.mimeTypes.glb
    // ....
    if (allowedTypes.length > 0 && !allowedTypes.includes(type)) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'unknown-format')
      this._uploadedFile = {}
    } else if (this.files[file.name]) {
      this._duplicate = file.name
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'duplicate-file')
      this._uploadedFile = {}
    } else {
      nn.get('load-curtain').show('upload.html', { filename: file.name })
      const isTextType = this._isTxt(file.name, type)
      const reader = new window.FileReader()
      reader.onloadend = async () => {
        // console.log({ name: file.name, type: type, data })
        try {
          let data = reader.result
          if (!isTextType && type !== 'image/svg+xml') {
            data = this._base64ToBlob(data.split(',')[1], type)
          } else if (type === 'image/svg+xml') {
            data = utils.atob(data.split(',')[1])
          }
          const filepath = path ? `${path}/${file.name}` : file.name
          await this._updateFile(filepath, data)
          this._updateFilesGUI()
        } catch (err) {
          console.error('ProjectFiles: upload failed:', err)
          utils._Convo('oh-no-error', err)
        } finally {
          // always hide the curtain so a thrown error doesn't strand the user
          setTimeout(() => nn.get('load-curtain').hide(), 200)
          this._uploadedFile = {}
        }
      }
      reader.onerror = (err) => {
        utils._Convo('oh-no-error', err)
        setTimeout(() => nn.get('load-curtain').hide(), 200)
      }
      reader.onabort = () => {
        console.log('ProjectFiles: read file aborted')
        setTimeout(() => nn.get('load-curtain').hide(), 200)
      }
      if (isTextType) reader.readAsText(file)
      else reader.readAsDataURL(file)
    }
  }

  async _postDeletion (filepath) {
    // nn.get('load-curtain').show('delete.html')
    if (this.files[filepath]) {
      const c = this.files[filepath].code
      if (typeof c === 'string' && c.indexOf('blob') === 0) {
        URL.revokeObjectURL(this.files[filepath].code) // for memory management
      }
      delete this.files[filepath]
      await this._saveFilesToIndexedDB()
      if (this.log) console.log(`FilesDB: File '${filepath}' deleted successfully.`)
      this._updateFilesGUI()
      if (this.viewing === filepath) this.openFile('index.html')
      // setTimeout(() => nn.get('load-curtain').hide(), 100)
    } else {
      console.warn(`FilesDB: File '${filepath}' not found.`)
      // setTimeout(() => nn.get('load-curtain').hide(), 100)
    }
  }

  async _postMoveFile (newSubPath) {
    window.convo.hide()
    const fpath = this._rightClicked.dataset.path
    const type = this._fpathExists(fpath)
    const filename = this.getFileData(fpath).fullname
    const newPath = newSubPath === '[root directory]' ? filename : `${newSubPath}/${filename}`
    const dup = this._fpathExists(newPath)

    const renameFile = (newPath, oldPath) => {
      if (!oldPath || !newPath || newPath === oldPath) return
      const entry = this.files[oldPath]
      if (!entry) return
      delete this.files[oldPath]
      entry.path = newPath
      this.files[newPath] = entry
    }

    let errConvo
    if (newSubPath === fpath) {
      errConvo = 'move-folder-self'
    } else if (newPath === fpath) {
      errConvo = `move-${type}-same`
    } else if (dup) { errConvo = `move-${type}-denied` }
    if (errConvo) { window.convo = new Convo(this.convos, errConvo); return }

    if (type === 'file') {
      renameFile(newPath, fpath)
    } else { // move this folder (&& all relevant paths)
      Object.keys(this.files).forEach(oldPath => {
        if (!oldPath.startsWith(`${fpath}/`)) return
        const rest = oldPath.slice(fpath.length + 1)
        const updatedPath = `${newPath}/${rest}`
        renameFile(updatedPath, oldPath)
      })
    }

    this._removeRedundantGitkeeps()

    // update database && tree view
    await this._saveFilesToIndexedDB()
    if (this.log) console.log(`FilesDB: '${fpath}' renamed to '${newPath}'`)
    this._updateFilesGUI()
  }

  async _postRenameFile (tempname) {
    window.convo.hide()
    const fpath = this._rightClicked.dataset.path
    const subPath = this._getSubPath(fpath)
    const type = this._fpathExists(fpath)
    const newPath = subPath ? `${subPath}/${tempname}` : tempname

    const dup = this._fpathExists(newPath)

    const renameFile = (newPath, oldPath) => {
      if (!oldPath || !newPath || newPath === oldPath) return
      const entry = this.files[oldPath]
      if (!entry) return
      delete this.files[oldPath]
      entry.path = newPath
      this.files[newPath] = entry
    }

    if (dup) {
      this._duplicate = tempname
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, `duplicate-${type}`)
    } else {
      if (type === 'file') {
        renameFile(newPath, fpath)
      } else { // rename this folder (&& all relevant paths)
        Object.keys(this.files).forEach(oldPath => {
          if (!oldPath.startsWith(`${fpath}/`)) return
          const rest = oldPath.slice(fpath.length + 1)
          const updatedPath = `${newPath}/${rest}`
          renameFile(updatedPath, oldPath)
        })
      }

      this._removeRedundantGitkeeps()

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

    // attach controllerchange + message listeners only once per page load,
    // not on every project open (was leaking listeners with each reopen).
    if (!this._swListenersAttached) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('SW now controlling')
      })
      navigator.serviceWorker.addEventListener('message', event => {
        if (this.log) console.log('ProjectFiles: Message from SW:', event.data)
        this._handleServiceWorkerMessage(event.data)
      })
      this._swListenersAttached = true
    }

    try {
      const reg = await navigator.serviceWorker.register('/files-db-service-worker.js', { scope: '/' })

      // wait until the SW is active
      await navigator.serviceWorker.ready

      // ensure the current page is actually *controlled*
      if (!navigator.serviceWorker.controller) {
        await new Promise(resolve => {
          const onChange = () => {
            navigator.serviceWorker.removeEventListener('controllerchange', onChange)
            resolve()
          }
          navigator.serviceWorker.addEventListener('controllerchange', onChange, { once: true })
        })
      }

      // NOTE: for messaging (in case we need it again in the future)
      // navigator.serviceWorker.controller.postMessage()

      return reg.active || reg.waiting || reg.installing
    } catch (error) {
      console.error('ProjectFiles: error registering service worker', error)
    }
  }

  _badPathsConvo () {
    window.convo = new Convo(this.convos, 'file-path')
  }

  _handleServiceWorkerMessage (message) {
    if (this.log) console.log('SW MESSAGE:', message)
    if (message.type === 'BAD_PATHS') {
      for (const path in message.data) {
        if (path !== this.viewing) continue
        const type = 'warning'
        const badPath = message.data[path].badPath
        const line = message.data[path].lineNo
        const col = message.data[path].line.indexOf(badPath)
        const parts = path.split('/')
        const language = parts[parts.length - 1].split('.')[1]
        if (language === 'html' || language === 'css') {
          const loc = window.location
          const message = `Failed to load ‘${loc.protocol}//${loc.host}/${badPath}’. A ServiceWorker intercepted the request and encountered an unexpected error.`
          const friendly = `It seems you're trying to load <code>${badPath}</code> but that file does not exist in your project. Double check your spelling and make sure the <span class="link" onclick="WIDGETS['project-files']._badPathsConvo()">file path</span> is written correctly.`
          const obj = { type, language, message, friendly, line, col }
          WIDGETS['code-review'].appendIssue(obj)
        }
      }
    }
  }

  // NOTE: FOR DEV PURPOSES ONLY
  async _forceUnregisterServiceWorker () {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.getRegistration('/files-db-service-worker.js')
    if (reg) await reg.unregister()
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

  // Delete an IndexedDB database entirely. Use this only when the intent
  // is "wipe and start fresh" — e.g. creating a new project that happens
  // to collide with a stale local DB of the same name. closeProject does
  // NOT call this — local unpushed work must survive close.
  async _destroyProjectDB (name) {
    if (!window.indexedDB) return
    if (this.db && this.dbName === name) {
      try { this.db.close() } catch (e) { /* already closed */ }
      this.db = null
    }
    this.files = {}
    return new Promise((resolve) => {
      const req = window.indexedDB.deleteDatabase(name)
      req.onsuccess = () => resolve()
      req.onerror = (e) => {
        console.error('ProjectFiles: deleteDatabase error:', e.target.error)
        resolve()
      }
      req.onblocked = () => {
        console.warn('ProjectFiles: deleteDatabase blocked (open connections elsewhere)')
        resolve()
      }
    })
  }

  // save the "code" in this.files into indexedDB (avoids storing all other GH data)
  // atomically also persists baselines so unpushed-changes detection
  // survives reload (used by Phase 3's "open from local?" convo).
  _saveFilesToIndexedDB () {
    if (!this.db) return Promise.resolve()
    const filesDict = {}
    Object.values(this.files).forEach(file => {
      if (file.code) filesDict[file.path] = file.code
    })
    const baselines = this._buildBaselines()

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], 'readwrite')
      const store = tx.objectStore(this.storeName)
      store.put(filesDict, this.objName)
      store.put(baselines, 'baselines')

      tx.oncomplete = () => {
        if (this.log) console.log('ProjectFiles: Files+baselines saved.', this.dbName)
        resolve()
      }
      tx.onerror = (event) => {
        console.error('ProjectFiles: IndexedDB save error:', event.target.error)
        reject(event.target.error)
      }
      tx.onabort = (event) => reject(event.target.error)
    })
  }

  // Build the persisted baselines map: only paths where current files
  // diverge from lastCommitFiles. Sentinel `null` means "didn't exist
  // at last push" (newly created since); a value (string|Blob) means
  // "existed at last push with this content" (modified or deleted).
  _buildBaselines () {
    const baselines = {}
    const lastCommit = this.lastCommitFiles || {}
    const allPaths = new Set([
      ...Object.keys(lastCommit),
      ...Object.keys(this.files || {})
    ])
    for (const path of allPaths) {
      const prev = lastCommit[path]?.code
      const curr = this.files[path]?.code
      if (prev === curr) continue
      baselines[path] = (prev === undefined) ? null : prev
    }
    return baselines
  }

  // Explicit baselines write — call after lastCommitFiles is reset to
  // a fresh snapshot (openProject, _postNewRepo, resetChanges) to clear
  // any drift left by intermediate saves during the load loop.
  _saveBaselinesToIndexedDB () {
    if (!this.db) return Promise.resolve()
    const baselines = this._buildBaselines()
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], 'readwrite')
      const store = tx.objectStore(this.storeName)
      const req = store.put(baselines, 'baselines')
      req.onerror = e => {
        console.error('ProjectFiles: baselines save error:', e.target.error)
        reject(e.target.error)
      }
      req.onsuccess = () => resolve()
    })
  }

  _loadFilesFromIndexedDB () {
    if (!this.db) return Promise.resolve({})
    return new Promise(resolve => {
      const tx = this.db.transaction([this.storeName], 'readonly')
      const store = tx.objectStore(this.storeName)
      const req = store.get(this.objName)
      req.onerror = () => resolve({})
      req.onsuccess = () => resolve(req.result || {})
    })
  }

  // Check whether a local IDB for this repo has unpushed changes (a
  // non-empty 'baselines' map). Used by openProject to decide whether
  // to fire the "open from local?" convo before fetching from GitHub.
  // Avoids creating an empty DB shell for repos that have never been
  // opened locally — only opens if the DB already exists.
  async _peekUnpushedLocal (repo) {
    if (!window.indexedDB) return false
    if (!window.indexedDB.databases) return false // Safari pre-2023; skip peek
    let exists = false
    try {
      const dbs = await window.indexedDB.databases()
      exists = dbs.some(d => d.name === repo)
    } catch (e) { return false }
    if (!exists) return false

    return new Promise(resolve => {
      const req = window.indexedDB.open(repo, this.dbVersion)
      req.onerror = () => resolve(false)
      req.onupgradeneeded = e => {
        const d = e.target.result
        if (!d.objectStoreNames.contains(this.storeName)) {
          d.createObjectStore(this.storeName)
        }
      }
      req.onsuccess = e => {
        const db = e.target.result
        try {
          const tx = db.transaction([this.storeName], 'readonly')
          const store = tx.objectStore(this.storeName)
          const r = store.get('baselines')
          r.onsuccess = () => {
            const baselines = r.result || {}
            db.close()
            resolve(Object.keys(baselines).length > 0)
          }
          r.onerror = () => { db.close(); resolve(false) }
        } catch (err) {
          db.close()
          resolve(false)
        }
      }
    })
  }

  _loadBaselinesFromIndexedDB () {
    if (!this.db) return Promise.resolve(null)
    return new Promise(resolve => {
      const tx = this.db.transaction([this.storeName], 'readonly')
      const store = tx.objectStore(this.storeName)
      const req = store.get('baselines')
      req.onerror = () => resolve(null)
      req.onsuccess = () => resolve(req.result || {})
    })
  }

  _saveProjectMetaToIndexedDB () {
    if (!this.db) return Promise.resolve()
    const owner = WIDGETS['student-session']?.getData('owner') || null
    const meta = {
      owner,
      repo: this.projectData?.name || null,
      branch: this.projectData?.branch || null,
      url: this.projectData?.url || null,
      lastPushSHA: this.projectData?.lastPushSHA || null
    }
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction([this.storeName], 'readwrite')
      const store = tx.objectStore(this.storeName)
      const req = store.put(meta, 'projectMeta')
      req.onerror = e => {
        console.error('ProjectFiles: meta save error:', e.target.error)
        reject(e.target.error)
      }
      req.onsuccess = () => resolve()
    })
  }

  _loadProjectMetaFromIndexedDB () {
    if (!this.db) return Promise.resolve(null)
    return new Promise(resolve => {
      const tx = this.db.transaction([this.storeName], 'readonly')
      const store = tx.objectStore(this.storeName)
      const req = store.get('projectMeta')
      req.onerror = () => resolve(null)
      req.onsuccess = () => resolve(req.result || null)
    })
  }

  // Used in Phase 3 to rebuild lastCommitFiles from working copy +
  // persisted baselines, so computeChanges keeps working after reload.
  _reconstructLastCommitFiles (files, baselines) {
    const result = {}
    baselines = baselines || {}
    for (const path of Object.keys(files || {})) {
      if (baselines[path] === null) continue // newly created — wasn't in last commit
      if (Object.prototype.hasOwnProperty.call(baselines, path)) {
        result[path] = { path, code: baselines[path] }
      } else {
        result[path] = { path, code: files[path].code }
      }
    }
    // include deleted files (in baselines but not in working copy)
    for (const [path, baseCode] of Object.entries(baselines)) {
      if (files[path] !== undefined) continue
      if (baseCode === null) continue
      result[path] = { path, code: baseCode }
    }
    return result
  }
}

window.ProjectFiles = ProjectFiles
