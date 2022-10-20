/* global Widget, FileUploader, Convo, utils, NNE, NNW, Color, WIDGETS */
class FilesAndFolders extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'files-and-folders'
    this.listed = true
    this.keywords = ['assets', 'upload', 'github', 'files', 'project', 'finder', 'fodler', 'terminal']
    this.width = 547

    this.title = 'Files + Folders'
    this.dict = {}
    this.tree = {}
    this._createContextMenu()
    this._createHTML()
    this._setupFileUploader()

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.ele.addEventListener('contextmenu', (e) => this._openContextMenu(e))

    this.on('open', () => this._openGreeting())

    NNE.on('code-update', () => {
      const repo = WIDGETS['student-session'].getData('opened-project')
      if (!repo) return
      const of = WIDGETS['student-session'].getData('opened-file')
      const b64 = utils.btoa(NNE.code)
      WIDGETS['student-session'].setChanges(of, b64)
    })
  }

  _openGreeting () {
    if (!Object.keys(window.CONVOS).includes(this.key)) {
      return setTimeout(() => this._openGreeting(), 100)
    }

    const owner = WIDGETS['student-session'].getData('owner')
    const repo = WIDGETS['student-session'].getData('opened-project')
    if (!repo) return

    this.title = `Files + Folders -- /${repo}`
    window.convo = new Convo(this.convos, 'opened')

    if (Object.keys(this.dict).length <= 0) {
      const data = { repo, owner }
      NNW.menu.switchFace('processing')
      utils.post('./api/github/open-project', data, (res) => {
        if (!res.success) {
          window.convo = new Convo(this.convos, 'oh-no-error')
          return console.log('FilesAndFolders:', res)
        }
        utils.updateURL(`?gh=${owner}/${repo}`)
        this.updateFiles(res.data.tree)
        const delay = utils.getVal('--layout-transition-time')
        setTimeout(() => { NNW.menu.switchFace('default') }, delay)
      })
    }
  }

  // CONTEXT MENU ..............................................................
  // ---------------------------------------------------------------------------

  _createContextMenu () {
    if (this.ctxmenu) return
    this.ctxmenu = document.createElement('nav')
    this.ctxmenu.className = 'fnf__ctx'
    this.ctxmenu.style.display = 'none'
    this.ctxmenu.style.position = 'absolute'
    this.ctxmenu.style.zIndex = '500'
    this.ctxmenu.style.color = 'var(--bg-color)'
    this.ctxmenu.style.backgroundColor = 'var(--netizen-meta)'
    this.ctxmenu.style.border = '1px solid var(--bg-color)'
    this.ctxmenu.style.padding = '10px'
    this.ctxmenu.innerHTML = `
      <!-- the right-click context menu -->
      <div class="fnf__ctx-rename">rename</div>
      <div class="fnf__ctx-delete">delete</div>
      <div>copy relative path</div>
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
    const rn = this.ctxmenu.querySelector('.fnf__ctx-rename')
    const dl = this.ctxmenu.querySelector('.fnf__ctx-delete')
    const hr = this.ctxmenu.querySelector('hr')
    const name = e.target.childNodes[0].nodeValue.trim()

    if (!name || name === '') {
      hr.style.display = rn.style.display = dl.style.display = 'none'
    } else {
      hr.style.display = rn.style.display = dl.style.display = 'block'
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

  // FILES AND FOLDERS .........................................................
  // ---------------------------------------------------------------------------

  _createHTML () {
    const c1 = Color.hex2rgb(utils.getVal('--netizen-meta'))
    const fileClr = `rgb(${c1.r},${c1.g},${c1.b})`
    const c2 = Color.hex2rgb(utils.getVal('--fg-color'))
    const fldrClr = `rgb(${c2.r},${c2.g},${c2.b})`
    this.innerHTML = `
      <style>
        .fnf * {
          user-select: none;
          -webkit-user-select: none; /*Safari*/
          -moz-user-select: none; /*Firefox*/
        }

        .fnf__ctx {
          font-family: 'fira-mono-regular', monospace;
        }

        .fnf__ctx > div {
          padding: 2px;
        }

        .fnf__ctx > div:hover {
          background-color: var(--bg-color);
          color: var(--netizen-meta);
          cursor: pointer;
        }

        .fnf__tree-view {
          margin: 0;
          padding: 0;
        }

        /* The list style < modified from: https://codepen.io/asraven/pen/qbrgje
        -------------------------------------------------------------- */

        .fnf__tree-view li {
          list-style: none;
          color: var(--netizen-meta);
          font-size: 17px;
          font-weight: normal;
        }

        .fnf__tree-view li:hover {
          cursor: pointer;
        }

        .fnf__tree-view ul {
          margin-left: 10px;
          border-left: 1px dashed var(--netizen-meta);
          border-bottom: 1px solid transparent;
          padding-left: 20px;
          color: var(--netizen-meta);
          text-decoration: none;
          transition: all 0.2s ease;
          overflow: hidden;
        }

        .fnf__tree-view ul:not(.active) {
          display: none;
        }

        .fnf__tree-view .folder {
          color: var(--netizen-meta);
          font-weight: bold;
        }

        .fnf__tree-view li:before {
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

        .fnf__tree-view li.folder:before {
          /* folder icon if folder class is specified */
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path fill='${fldrClr}' d='M96.429,37.5v39.286c0,3.423-1.228,6.361-3.684,8.817c-2.455,2.455-5.395,3.683-8.816,3.683H16.071 c-3.423,0-6.362-1.228-8.817-3.683c-2.456-2.456-3.683-5.395-3.683-8.817V23.214c0-3.422,1.228-6.362,3.683-8.817 c2.455-2.456,5.394-3.683,8.817-3.683h17.857c3.422,0,6.362,1.228,8.817,3.683c2.455,2.455,3.683,5.395,3.683,8.817V25h37.5 c3.422,0,6.361,1.228,8.816,3.683C95.201,31.138,96.429,34.078,96.429,37.5z' /></svg>");
          background-position: center top;
          background-size: 75% auto;
        }
      </style>
      <div class="fnf">
        <!-- if logged out of GitHub -->
        <div class="fnf__disclaimer">
          You're working on a sketch, which is a single HTML file. If you'd like to work with multiple files, including assets like images, you'll need to create a project first by authenticating your GitHub account and then clicking <code>newProject()</code> in the <b>Functions Menu</b>. (click on netnet's face to launch the <b>Functions Menu</b>)
        </div>
        <!-- if logged into GitHub -->
        <div class="fnf__header">
          <!-- tabs to switch between, tree-view, finder-view && terminal-view -->
        </div>
        <ul class="fnf__tree-view">
          <!-- upldateFiles populates this elements -->
        </ul>
      </div>
    `

    this.updateFiles()
  }

  _showHideDivs () { // displays fnf__disclaimer if project is not open
    const op = WIDGETS['student-session'].getData('opened-project')
    this.$('.fnf__disclaimer').style.display = op ? 'none' : 'block'
    this.$('.fnf__header').style.display = op ? 'block' : 'none'
    this.$('.fnf__tree-view').style.display = op ? 'block' : 'none'
  }

  _setupFileUploader () {
    this.fu = new FileUploader({
      maxSize: 5000, // 5 MB (see convos/files-and-folders)
      ready: (file) => this.uploadFile(file, true),
      drop: '.fnf',
      error: (err) => {
        console.error('ProjectFiles:', err)
        if (err.includes('file larger than max size')) {
          window.convo = new Convo(this.convos, 'file-too-big')
        }
      }
    })
  }

  _setupTreeView () {
    const hover = (e, type) => {
      if (type === 'over') {
        e.stopPropagation()
        const c2 = Color.hex2rgb(utils.getVal('--fg-color'))
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
          e.stopPropagation(); this.openFile({ path })
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

    const iterate = (obj, ele = this.$('.fnf__tree-view')) => {
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

    // obj = { id: [filepath], level: [number], children: [array] }
    this.tree.forEach(obj => iterate(obj))
  }

  // MAIN UPDATE DATA LOGIC ----------------------------------------------------
  // ---------------------------------------------------------------------------

  updateFiles (files) {
    // runs everytime a new repo (github project) is created or opened (StudentSession.js + FunctionsMenu.js)
    // as well as anytime a file is uploaded or deleted (in this Widget)
    this._showHideDivs()
    this.$('.fnf__tree-view').innerHTML = ''
    if (!files) return

    this.dict = {}
    this.tree = []
    const agg = { temp: [] }
    files.forEach(file => {
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
      this.dict[file.path] = file // { mode, path, sha, size, type, url }
    })

    // update view
    this._setupTreeView()
  }

  // EVENTS ....................................................................
  // ---------------------------------------------------------------------------

  copyRelativePath () {
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

  openFile (file) {
    let sub = file.path.split('/')
    sub.pop() // remove file
    sub = sub.join('/')
    if (sub !== '') sub += '/'
    NNW.menu.switchFace('processing')
    const filename = file.path
    const owner = WIDGETS['student-session'].data.github.owner
    const repo = WIDGETS['student-session'].data.github.openedProject
    const data = { filename, repo, owner }
    utils.post('./api/github/open-file', data, (res) => {
      if (!res.success) {
        window.convo = new Convo(this.convos, 'oh-no-error')
        return console.log('FilesAndFolders:', res)
      }
      window.convo.hide()
      NNW.updateTitleBar(`${repo}/${res.data.path}`)
      const c = utils.atob(res.data.content)
      WIDGETS['student-session'].setData('opened-file', res.data.path)
      WIDGETS['student-session'].setData('last-commit-code', utils.btoa(c))
      WIDGETS['student-session'].updateRoot(sub)
      NNE.code = c
      NNW.menu.switchFace('default')
    })
  }

  uploadFile (file, fu, cb) {
    if (fu) console.log(file);
    if (fu) { // via file uploader
      file.name = file.path = this._name2path(file.name, 'file')
    }
    this._upload = file.name
    if (this.dict[file.path]) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'duplicate-file')
    } else {
      // TODO, add second argument to uploadFile(file, curtain = 'upload.html')
      // so we can optionally pass a diff value to this function
      utils.showCurtain('upload.html', {
        filename: file.name
      })

      const content = file.data.includes('base64,')
        ? file.data.split('base64,')[1] : file.data

      const data = {
        owner: WIDGETS['student-session'].getData('owner'),
        repo: WIDGETS['student-session'].getData('opened-project'),
        name: file.name,
        path: file.path,
        code: content
      }
      utils.post('./api/github/upload-file', data, res => this._postUpdate(res, cb))
    }
  }

  _postUpdate (res, cb) {
    if (!res.success) {
      console.log('FilesAndFolders:', res)
      window.convo = new Convo(this.convos, 'oh-no-error')
      utils.hideCurtain('delete.html')
      utils.hideCurtain('upload.html')
    } else {
      this._upload = null
      WIDGETS['student-session'].setData('last-commit-msg', res.message)
      const data = {
        owner: WIDGETS['student-session'].getData('owner'),
        repo: WIDGETS['student-session'].getData('opened-project')
      }
      utils.post('./api/github/open-project', data, (res) => {
        this.updateFiles(res.data.tree)
        utils.hideCurtain('delete.html')
        utils.hideCurtain('upload.html')
        NNE.update()
        if (cb) cb()
      })
    }
  }

  deleteFile (filepath) { // && delete folder
    this._delete = filepath || this._rightClicked.dataset.path
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'confirm-delete')
  }

  _postConfirmDeletion () {
    utils.showCurtain('delete.html')
    const data = {
      owner: WIDGETS['student-session'].getData('owner'),
      repo: WIDGETS['student-session'].getData('opened-project'),
      branch: WIDGETS['student-session'].getData('branch'),
      path: this._delete,
      sha: this.dict[this._delete].sha
    }
    const endpoint = this.dict[this._delete].type === 'blob'
      ? './api/github/delete-file'
      : './api/github/delete-folder'
    utils.post(endpoint, data, (res) => this._postUpdate(res))
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

  newFile (div) {
    window.convo = new Convo(this.convos, 'new-file')
  }

  _postNewFile (name) {
    window.convo.hide()
    const path = this._name2path(name, 'file')
    const file = { path, name: path, data: '' }
    this.uploadFile(file, false, () => this.openFile(file))
  }

  newFolder (div) {
    window.convo = new Convo(this.convos, 'new-folder')
  }

  _postNewFolder (name) {
    window.convo.hide()
    const path = this._name2path(name, 'folder')
    const str = 'This ".gitkeep" file is a popluar/conventional GitHub hack.\n' +
      'The file exists in order to create an otherwise empty folder/directory on GitHub.\n' +
      'Once you\'ve pushed other files to this folder you can delete this file,\n' +
      'but if this is the only file in the folder, deleting it will also delete the folder.\n' +
      'To learn more see: https://stackoverflow.com/a/7229996/1104148'
    this.uploadFile({ path, name: path, data: utils.btoa(str) })
  }

  renameFile (div) { // && rename folder
    const f = (this._rightClicked.classList.contains('folder')) ? 'folder' : 'file'
    window.convo = new Convo(this.convos, `${f}-rename`)
  }

  _postRenameFile (name) {
    window.convo.hide()
    let newpath = this._rightClicked.dataset.path.split('/')
    newpath[newpath.length - 1] = name
    newpath = newpath.join('/')

    utils.showCurtain('upload.html', { filename: name })
    const data = {
      owner: WIDGETS['student-session'].getData('owner'),
      repo: WIDGETS['student-session'].getData('opened-project'),
      branch: WIDGETS['student-session'].getData('branch'),
      newpath: newpath,
      file: this.dict[this._rightClicked.dataset.path]
    }
    utils.post('./api/github/rename-file', data, (res) => this._postUpdate(res))
  }
}

window.FilesAndFolders = FilesAndFolders
