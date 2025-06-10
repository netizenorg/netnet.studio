/* global Widget, Convo, NNE, NNW, WIDGETS, nn, utils */
class FunctionsMenu extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Functions Menu'
    this.key = 'functions-menu'
    this.keywords = ['settings', 'configure', 'configuration', 'options', 'edit', 'file']
    this.listed = true
    this.resizable = false

    this.ghAuthedMenu = [
      {
        click: 'codeReview',
        alts: ['check', 'code', 'review', 'audit', 'lint', 'error', 'mistake']
      },
      {
        click: 'tidyCode',
        alts: ['tidy', 'format', 'clean', 'indent'],
        hrAfter: true
      },
      {
        click: 'uploadAssets',
        alts: ['files', 'upload', 'assets'],
        hrAfter: true
      },
      {
        click: 'newProject',
        alts: ['new', 'blank', 'start', 'fresh', 'canvas']
      },
      {
        click: 'openProject',
        alts: ['open', 'github', 'project', 'repo', 'repository']
      },
      {
        click: 'closeProject',
        alts: ['quit', 'close', 'github', 'project', 'repo', 'repository']
      },
      {
        click: 'saveProject',
        alts: ['save', 'github', 'project', 'repo', 'repository'],
        hrAfter: true
      },
      {
        click: 'publishProject',
        alts: ['host', 'github', 'publish', 'public']
      },
      {
        click: 'shareProject',
        alts: ['share', 'github', 'project', 'link']
      },
      {
        click: 'downloadProject',
        alts: ['download', 'export', 'save'],
        hrAfter: true
      },
      {
        click: 'downloadCode',
        alts: ['download', 'export', 'save']
      }
      // {
      //   click: 'BrowserFest',
      //   alts: []
      // }
    ]

    this.noAuthedMenu = [
      {
        click: 'codeReview',
        alts: ['check', 'code', 'review', 'audit', 'lint', 'error', 'mistake']
      },
      {
        click: 'tidyCode',
        alts: ['tidy', 'format', 'clean', 'indent'],
        hrAfter: true
      },
      {
        click: 'newSketch',
        alts: ['new', 'sketch', 'blank', 'canvas']
      },
      {
        click: 'shareSketch',
        alts: ['share', 'link', 'save']
      },
      {
        click: 'saveSketch',
        alts: ['progress', 'save', 'state'],
        hrAfter: true
      },
      {
        click: 'downloadCode',
        alts: ['download', 'export', 'save']
      },
      {
        click: 'uploadCode',
        alts: ['upload', 'import', 'open']
      }
    ]

    this.editorSettingsMenu = [
      {
        click: 'autoUpdate',
        alts: ['update', 'render', 'auto', 'compile'],
        select: 'func-menu-update-select'
      },
      {
        click: 'runUpdate',
        alts: ['update', 'render', 'compile']
      },
      {
        click: 'chattiness',
        alts: ['chatty', 'dialogue', 'netnet', 'bubbles'],
        select: 'func-menu-chat-select'
      },
      // {
      //   click: 'popUpWindow',
      //   alts: ['pop', 'up', 'out', 'separate', 'window']
      // },
      {
        click: 'changeLayout',
        alts: ['layout', 'view', 'orientation', 'setup'],
        select: 'func-menu-layout-select'
      },
      {
        click: 'changeTheme',
        alts: ['theme', 'color', 'style', 'syntax highlight'],
        select: 'func-menu-themes-select'
      },
      {
        click: 'wordWrap',
        alts: ['word', 'line', 'wrap', 'warpping'],
        select: 'func-menu-wrap-select'
      },
      {
        click: 'viewShortcuts',
        alts: []
      },
      {
        click: 'viewYourData',
        alts: []
      }
    ]

    this._createHTML()

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
  }

  // TEMPORARY
  // BrowserFest () {
  //   if (WIDGETS['browser-fest']) {
  //     WIDGETS['browser-fest'].submit()
  //   } else {
  //     WIDGETS.load('browser-fest', (w) => w.submit())
  //   }
  // }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  codeReview () {
    WIDGETS.open('code-review')
  }

  tidyCode () {
    NNE.tidy()
  }

  uploadAssets () {
    WIDGETS.open('project-files')
  }

  saveProject (redirect) {
    if (WIDGETS['code-examples']) WIDGETS['code-examples'].cancelExample()
    const op = WIDGETS['student-session'].data.github.openedProject
    if (utils.url.github) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'unsaved-changes-b4-fork-proj')
    } if (op) {
      this.convos = window.CONVOS[this.key](this)
      this._redirect = redirect // if trying to create 'new-project' or 'open-project'
      const msg = WIDGETS['student-session'].getData('last-commit-msg')
      if (msg === 'netnet initialized repo' || msg === 'Initial commit') {
        window.convo = new Convo(this.convos, 'save-newish-project')
      } else {
        window.convo = new Convo(this.convos, 'save-open-project')
      }
    } else {
      this.newProject()
    }
  }

  newProject () {
    const op = WIDGETS['student-session'].data.github.openedProject
    const lastCode = WIDGETS['student-session'].data.github.lastCommitCode
    const currCode = utils.btoa(NNE.code)
    if (utils.url.github) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'unsaved-changes-b4-fork-proj')
    } else if (op && lastCode !== currCode) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'unsaved-changes-b4-new-proj')
    } else {
      this.convos = window.CONVOS[this.key](this)
      if (NNE.code !== '') {
        window.convo = new Convo(this.convos, 'clear-code?')
      } else { window.convo = new Convo(this.convos, 'create-new-project') }
      // if users says "yes" convo will call _createNewRepo()
    }
  }

  openProject () {
    if (WIDGETS['browser-fest']) WIDGETS['browser-fest'].close()
    const op = WIDGETS['student-session'].data.github.openedProject
    const lastCode = WIDGETS['student-session'].data.github.lastCommitCode
    const currCode = utils.btoa(NNE.code)
    this.convos = window.CONVOS[this.key](this)
    if (op && lastCode !== currCode) {
      window.convo = new Convo(this.convos, 'unsaved-changes-b4-open-proj')
    } else {
      // if user chooses a project to open, convo will call _openProject()
      window.convo = new Convo(this.convos, 'open-project')
    }
  }

  closeProject () {
    const projOpen = WIDGETS['student-session'].getData('opened-project')
    if (projOpen) {
      WIDGETS['student-session'].clearProjectData()
      NNE.code = ''
      NNW.updateTitleBar(null)
      if (window.convo) window.convo.hide()
      this._hideIrrelevantOpts('closeProject')
    }
  }

  shareProject () {
    const op = WIDGETS['student-session'].data.github.openedProject
    if (op) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'share-project')
    } else window.convo = new Convo(this.convos, 'cant-share-project')
  }

  publishProject () {
    const op = WIDGETS['student-session'].data.github.openedProject
    if (op) this._publishProject()
    else window.convo = new Convo(this.convos, 'cant-publish-project')
  }

  downloadProject () {
    const p = WIDGETS['student-session'].getData('opened-project')
    const o = WIDGETS['student-session'].getData('owner')
    const b = WIDGETS['student-session'].getData('branch')
    const url = `https://github.com/${o}/${p}/archive/refs/heads/${b}.zip`
    const a = document.createElement('a')
    a.setAttribute('download', 'index.html')
    a.setAttribute('href', url)
    a.click()
    a.remove()
  }

  // -------------

  shareSketch () {
    WIDGETS.open('share-widget')
  }

  saveSketch () {
    if (WIDGETS['code-examples']) WIDGETS['code-examples'].cancelExample()
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'session-saved')
    this.sesh.setSavePoint()
  }

  newSketch () {
    WIDGETS['student-session'].clearSaveState()
    const name = this.sesh.getData('username')
    const adj = [
      'Super Rad', 'Amazing', 'Spectacular', 'Revolutionary', 'Contemporary'
    ]
    NNW.layout = 'dock-left'
    NNE.code = typeof name === 'string'
      ? `<h1>${nn.random(adj)} Net Art</h1>\n<h2>by ${name}</h2>`
      : '<h1>Hello World Wide Web!</h1>'
    setTimeout(() => {
      window.convo = new Convo(this.convos, 'blank-canvas-ready')
      if (!NNE.autoUpdate) NNE.update()
    }, utils.getVal('--layout-transition-time'))
  }

  downloadCode () {
    const uri = `data:text/html;base64,${utils.btoa(NNE.code)}`
    const a = document.createElement('a')
    a.setAttribute('download', 'index.html')
    a.setAttribute('href', uri)
    a.click()
    a.remove()
  }

  uploadCode () {
    this.close()
    this.fu.input.click()
  }

  autoUpdate (val) {
    const gotVal = typeof val === 'boolean'
    NNE.autoUpdate = gotVal ? val : this.autoUpdateSel.value === 'true'

    if (this.sesh) this.sesh.setData('auto-update', NNE.autoUpdate.toString())

    if (!NNE.autoUpdate && !gotVal) {
      window.convo = new Convo(this.convos, 'need-to-update')
    } else if (!gotVal && window.convo && window.convo.id === 'need-to-update') {
      window.convo.hide()
    }
    this._hideIrrelevantOpts('autoUpdate')
  }

  runUpdate () {
    console.clear()
    NNE.update()
  }

  changeLayout () {
    NNW.layout = this.layoutsSel.value
  }

  popUpWindow () {
    this.layoutsSel.value = 'full-screen'
    this.changeLayout()
    // TODO: working on:
    // https://github.com/netizenorg/netnet.studio/issues/220
    // https://github.com/netizenorg/netnet.studio/issues/240
    // see: "window.onmessage" && notes at the bottom of www/core/utils.js
  }

  changeTheme () {
    const prevTheme = NNW.theme
    NNW.theme = this.themesSel.value
    this.sesh.setData('theme', NNW.theme)
    const nc = utils.starterCode()
    if (NNE.code.includes('/* netnet default bg */') && NNE.code !== nc) {
      NNE.code = nc
    }
    if (NNW.theme !== prevTheme && this.events['theme-change']) {
      this.emit('theme-change', { data: NNW.theme })
    }
  }

  wordWrap (val) {
    if (typeof val === 'boolean') {
      this.lineWrapping.value = val
    }
    NNE.wrap = this.lineWrapping.value === 'true'
    this.sesh.setData('wrap', this.lineWrapping.value)
  }

  chattiness (val) {
    const v = val || this.chatty.value
    this.chatty.value = v
    this.sesh.setData('chattiness', v)
    WIDGETS['code-review'].updateIssues()
    if (this.chatty.value === 'low') {
      window.convo = new Convo(this.convos, 'chatty-level-low')
    } else if (this.chatty.value === 'medium') {
      window.convo = new Convo(this.convos, 'chatty-level-medium')
    } else if (this.chatty.value === 'high') {
      window.convo = new Convo(this.convos, 'chatty-level-high')
    }
  }

  viewYourData () {
    WIDGETS.open('student-session')
  }

  viewShortcuts () {
    WIDGETS.open('keyboard-shortcuts')
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  gitHubUpdated (gh) {
    this._createHTML(gh)
  }

  gitHubProjectsUpdated () {
    this.convos = window.CONVOS[this.key](this)
  }

  toggleSubMenu (id, type) {
    const subSec = this.$(`#${id} > .func-menu-sub-section`)
    const subSecParent = this.$(`#${id}`)
    if (type === 'close') {
      subSec.style.display = 'none'
      subSecParent.classList.remove('open')
    } else if (type === 'open') {
      subSec.style.display = 'block'
      subSecParent.classList.add('open')
    } else {
      if (subSec.style.display === 'block') {
        subSec.style.display = 'none'
        subSecParent.classList.remove('open')
      } else {
        subSec.style.display = 'block'
        subSecParent.classList.add('open')
      }
    }
    setTimeout(() => this.keepInFrame(), 500)
  }

  checkIfHidden (func) { // check if this menu function has been hidden
    const m = [...this.$('button')].filter(e => e.textContent.includes(func))
    if (m.length > 0 && m[0].style.display === 'none') return true
    else return false
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML (gh) {
    this.subs = {}
    if (gh) this.subs['my project'] = this.ghAuthedMenu
    else this.subs['my sketch'] = this.noAuthedMenu
    this.subs['editor settings'] = this.editorSettingsMenu

    this.innerHTML = `
      <div id="func-menu-content">
        <div id="func-menu-login" tabindex="0">
          ${gh ? 'logout' : 'login'}
          <span class="icon"></span>
        </div>
      </div>
    `

    this.$('#func-menu-login').addEventListener('click', () => {
      this._login()
      this.$('#func-menu-login').blur()
    })
    this.$('#func-menu-login').addEventListener('keypress', (e) => {
      if (e.which === 13) this._login()
    })

    for (const sub in this.subs) {
      const div = document.createElement('div')
      div.id = `func-menu-${sub.replace(/ /g, '-')}`
      div.classList.add('func-menu-dropdown')
      const title = document.createElement('span')
      title.textContent = sub
      title.tabIndex = 0
      title.addEventListener('click', () => {
        for (const sub in this.subs) {
          if (title.textContent === sub) {
            this.toggleSubMenu(div.id)
          } else {
            const id = `func-menu-${sub.replace(/ /g, '-')}`
            this.toggleSubMenu(id, 'close')
          }
        }
        title.blur()
      })
      title.addEventListener('keypress', (e) => {
        if (e.which === 13) {
          for (const sub in this.subs) {
            if (title.textContent === sub) {
              this.toggleSubMenu(div.id)
            } else {
              const id = `func-menu-${sub.replace(/ /g, '-')}`
              this.toggleSubMenu(id, 'close')
            }
          }
        }
      })
      div.appendChild(title)
      const subSec = document.createElement('div')
      subSec.className = 'func-menu-sub-section'
      subSec.style.display = 'none'
      div.appendChild(subSec)
      this.subs[sub].forEach(btn => {
        const b = document.createElement('button')
        b.textContent = btn.click + '('
        // HACK: to avoid having netnet's textBubble pull focus from drop down
        // which causes autoUpdate to get stuck on false in some systems
        if (btn.click !== 'autoUpdate' && btn.click !== 'chattiness') {
          b.addEventListener('click', (e) => this[btn.click]())
        }
        if (btn.select) {
          b.classList.add('select-inside')
          b.textContent = btn.click + '('
          const sel = document.createElement('select')
          sel.classList.add('dropdown')
          sel.id = btn.select
          b.appendChild(sel)
          b.addEventListener('click', () => sel.focus())
        } else if (btn.float) {
          b.textContent = btn.click + '('
          const inp = document.createElement('input')
          inp.setAttribute('type', 'number')
          inp.setAttribute('min', '0')
          inp.setAttribute('max', '1')
          inp.setAttribute('step', '0.1')
          inp.id = btn.float
          b.appendChild(inp)
          b.addEventListener('click', () => inp.focus())
        }
        subSec.appendChild(b)
        if (btn.hrAfter) subSec.appendChild(document.createElement('hr'))
      })
      this.$('#func-menu-content').appendChild(div)
    }

    if (this._recentered) this.update({ left: 20, top: 20 })

    this._initValues()
    this._setupListeners()
    this._hideIrrelevantOpts('_createHTML')
  }

  _hideIrrelevantOpts (from) {
    // console.log('calling hide from:', from)
    const btns = this.$('button')
    const _is = (ele, func) => ele.textContent.includes(func)
    const projOpen = WIDGETS['student-session']
      ? WIDGETS['student-session'].getData('opened-project') : null
    const hideIf = (b, condition) => {
      if (condition) b.style.display = 'none'
      else b.style.display = 'block'
    }
    // reset: display all buttons at first...
    btns.forEach(b => { b.style.display = 'block' })
    // ...then figure out which need to be hidden
    for (let i = 0; i < btns.length; i++) {
      // hide runUpdate if autoUpdate is enabled (default)
      if (_is(btns[i], 'runUpdate')) hideIf(btns[i], NNE.autoUpdate)
      // hide closeProject if project isn't open
      if (_is(btns[i], 'closeProject')) hideIf(btns[i], !projOpen)
      // hide downloadProject if project isn't open
      if (_is(btns[i], 'downloadProject')) hideIf(btns[i], !projOpen)
      // hide downloadCode if project is open
      if (_is(btns[i], 'downloadCode')) hideIf(btns[i], projOpen)
    }
    // update SearchBars dictionary when serach bar is ready
    const loadSearchData = () => {
      if (!NNW.menu.search) { setTimeout(() => loadSearchData(), 100); return }
      NNW.menu.search._loadFunctionsMenuData()
    }
    loadSearchData()
  }

  _creatOption (value, parent) {
    const o = document.createElement('option')
    o.setAttribute('value', value)
    o.textContent = value
    parent.appendChild(o)
  }

  _initValues () {
    if (!WIDGETS['student-session']) {
      setTimeout(() => this._initValues(), 100)
      return
    }
    this.sesh = WIDGETS['student-session']
    this.autoUpdateSel = this.$('#func-menu-update-select')
    this._creatOption('true', this.autoUpdateSel)
    this._creatOption('false', this.autoUpdateSel)
    this.autoUpdateSel.value = this.sesh.getData('auto-update')
    this.autoUpdateSel.addEventListener('change', () => this.autoUpdate())

    this.layoutsSel = this.$('#func-menu-layout-select')
    if (this.layoutsSel.children.length < NNW.layouts.length) {
      NNW.layouts.forEach(l => this._creatOption(l, this.layoutsSel))
    }
    this.layoutsSel.value = NNW.layout

    this.themesSel = this.$('#func-menu-themes-select')
    if (this.themesSel.children.length < Object.keys(NNE.themes).length) {
      Object.keys(NNE.themes).forEach(l => this._creatOption(l, this.themesSel))
    }
    this.themesSel.value = NNW.theme

    this.lineWrapping = this.$('#func-menu-wrap-select')
    if (this.lineWrapping.children.length < 2) {
      this._creatOption('true', this.lineWrapping)
      this._creatOption('false', this.lineWrapping)
    }
    this.lineWrapping.value = typeof this.sesh.getData('wrap') === 'string' ? this.sesh.getData('wrap') : true
    this.lineWrapping.addEventListener('change', () => this.wordWrap())

    this.chatty = this.$('#func-menu-chat-select')
    if (this.chatty.children.length < 3) {
      this._creatOption('high', this.chatty)
      this._creatOption('medium', this.chatty)
      this._creatOption('low', this.chatty)
    }
    this.chatty.value = this.sesh.getData('chattiness')
    this.chatty.addEventListener('change', () => this.chattiness())
  }

  _setupListeners () {
    // setup FileUploader
    this.fu = new nn.FileUploader({
      click: '#func-menu-upload',
      drop: '#nn-window',
      filter: (type) => {
        if (type !== 'text/html') return false
        else return true // TODO: later allow CSS && JS
      },
      dropping: (e) => { /* maybe change face... */ },
      dropped: (e) => { /* ...if so change face back */ },
      ready: (file) => {
        this.close()
        const data = file.data.split('data:text/html;base64,')[1]
        NNE.code = utils.atob(data)
      },
      error: (err) => {
        window.convo = new Convo(this.convos, 'temp-disclaimer')
        console.error('MenuFunctions:', err)
      }
    })

    this.on('close', () => {
      // close open sub menus
      for (const sub in this.subs) {
        const id = `func-menu-${sub.replace(/ /g, '-')}`
        this.toggleSubMenu(id, 'close')
      }
    })

    NNW.on('theme-change', () => {
      if (this.themesSel) this.themesSel.value = NNW.theme
    })

    NNW.on('layout-change', () => {
      if (this.layoutsSel) {
        this.layoutsSel.value = NNW.layout
      }
    })
  }

  // -------------------------- PRIVATE GITHUB STUFF ---------------------------

  _login () {
    const status = this.$('#func-menu-login').textContent.trim()
    if (status === 'login') {
      WIDGETS['student-session'].chatGitHubAuth()
      if (this.events.login) this.emit('login', { data: null })
    } else {
      WIDGETS['student-session'].chatGitHubLogout()
      if (this.events.logout) this.emit('logout', { data: null })
    }
  }

  _createNewRepo (c, t, v) {
    WIDGETS['student-session'].clearSaveState()
    window.convo = new Convo(this.convos, 'pushing-updates')
    const data = { name: v, data: utils.btoa(NNE.code) }
    window.utils.post('./api/github/new-repo', data, (res) => {
      NNW.menu.switchFace('default')
      window.convo.hide()
      if (res.error) { // if there's an error creating the repo
        console.log('FunctionsMenu:', res)
        if (res.error.errors[0].message.includes('name already exists')) {
          window.convo = new Convo(this.convos, 'project-already-exists')
        } else {
          window.convo = new Convo(this.convos, 'oh-no-error')
        }
      } else { // otherwise let the user know it's all good!
        WIDGETS['student-session'].setProjectData({
          name: res.name,
          message: 'netnet initialized repo',
          sha: res.sha,
          url: res.url,
          ghpages: res.ghpages,
          branch: res.branch,
          code: utils.btoa(NNE.code)
        })
        WIDGETS['student-session'].updateRoot()
        NNW.updateTitleBar(`${res.name}/index.html`)
        // update ProjectFiles
        if (!WIDGETS['project-files']) {
          WIDGETS.load('project-files', (w) => w.updateFiles([]))
        } else WIDGETS['project-files'].updateFiles([])
        // ...convo
        if (NNW.layout === 'welcome') NNW.layout = 'dock-left'
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'new-project-created')
        // ... upldate list of repos...
        utils.get('/api/github/saved-projects', (json) => {
          if (!json.data) return
          const names = json.data.map(o => o.name)
          WIDGETS['student-session'].setData('repos', names.join(', '))
          this.gitHubProjectsUpdated()
        })
        // update sub menu
        this._hideIrrelevantOpts('_createNewRepo')
      }
    })
  }

  _openProject (repo) {
    const ohNoErr = (res) => {
      console.log('FunctionsMenu:', res)
      window.convo = new Convo(this.convos, 'oh-no-error')
    }
    WIDGETS['student-session'].clearSaveState()
    window.convo = new Convo(this.convos, 'opening-project')
    const owner = WIDGETS['student-session'].data.github.owner
    const filename = 'index.html'
    const data = { filename, repo, owner }
    utils.post('./api/github/open-project', data, (res) => {
      if (!res.success) return ohNoErr(res)
      const files = res.data.map(f => f.name)
      if (files.includes('index.html')) {
        WIDGETS['student-session'].setData('opened-project', repo)
        NNW.updateTitleBar(`${repo}/index.html`)
        utils.updateURL(`?gh=${owner}/${repo}`)
        // update ProjectFiles
        if (!WIDGETS['project-files']) {
          WIDGETS.load('project-files', (w) => w.updateFiles(res.data))
        } else WIDGETS['project-files'].updateFiles(res.data)
        // get index.html data
        utils.post('./api/github/open-file', data, (res) => {
          if (!res.success) return ohNoErr(res)
          const url = (res.data.html_url.includes('/blob/master'))
            ? res.data.html_url.split('/blob/master')[0]
            : res.data.html_url.split('/blob/main')[0]
          const branch = (res.data.html_url.includes('/blob/master')) ? 'master' : 'main'
          WIDGETS['student-session'].setData('project-url', url)
          WIDGETS['student-session'].setData('branch', branch)
          WIDGETS['student-session'].setData('index-sha', res.data.sha)
          // // for some reason GitHub adds a '\n' at the end of the base64 string?
          // const c = (data.code.indexOf('\n') === data.code.length - 1)
          //   ? data.code.substr(0, data.code.length - 1) : data.code
          const c = utils.atob(res.data.content)
          WIDGETS['student-session'].setData('last-commit-code', utils.btoa(c))
          const m = res.data.html_url.includes('/blob/master') ? 'master' : 'main'
          WIDGETS['student-session'].updateRoot(m)
          NNE.code = c
          if (NNW.layout === 'welcome') NNW.layout = 'dock-left'
          setTimeout(() => {
            NNW.menu.switchFace('default')
            if (!NNE.autoUpdate) NNE.update()
            window.convo = new Convo(this.convos, 'project-opened')
          }, utils.getVal('--layout-transition-time'))
        })
        // update last commit data
        utils.post('./api/github/get-commits', data, (res) => {
          if (!res.success) return ohNoErr(res)
          const msg = res.data[0].commit.message
          WIDGETS['student-session'].setData('last-commit-msg', msg)
        })
        // update sub menu
        this._hideIrrelevantOpts('_openProject')
      } else {
        window.convo = new Convo(this.convos, 'not-a-web-project')
      }
    })
  }

  _updateProject (msg) {
    WIDGETS['student-session'].clearSaveState()
    window.convo = new Convo(this.convos, 'pushing-updates')
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: window.sessionStorage.getItem('opened-project'),
      sha: window.sessionStorage.getItem('index-sha'),
      path: 'index.html',
      message: msg,
      code: utils.btoa(NNE.code)
    }
    utils.post('./api/github/save-project', data, (res) => {
      if (!res.success) {
        console.log('FunctionsMenu:', res)
        window.convo = new Convo(this.convos, 'oh-no-error')
      } else {
        NNW.menu.switchFace('default')
        // if user was redirected to save te project while trying
        // to create 'new-project' or 'open-project' && decided to
        // save the currently open project before doing so
        if (this._redirect) {
          WIDGETS['student-session'].clearProjectData()
          this.convos = window.CONVOS[this.key](this)
          window.convo = new Convo(this.convos, this._redirect)
          this._redirect = false
        } else { // if user clicked saveProject()
          WIDGETS['student-session'].setProjectData({
            message: res.data.commit.message,
            sha: res.data.content.sha,
            code: utils.btoa(NNE.code)
          })
          window.convo = new Convo(this.convos, 'project-saved')
        }
      }
    })
  }

  _publishProject () {
    window.convo = new Convo(this.convos, 'pushing-updates')
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: window.sessionStorage.getItem('opened-project'),
      branch: window.sessionStorage.getItem('branch')
    }
    utils.post('./api/github/gh-pages', data, (res) => {
      if (!res.success) {
        console.log('FunctionsMenu:', res)
        window.convo = new Convo(this.convos, 'oh-no-error')
      } else {
        NNW.menu.switchFace('default')
        WIDGETS['student-session'].setData('ghpages', res.data.html_url)
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'published-to-ghpages')
      }
    })
  }
}

window.FunctionsMenu = FunctionsMenu
