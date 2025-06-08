/* global Widget, Convo, NNE, NNW, WIDGETS, utils */
class CodingMenu extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Coding Menu'
    this.key = 'coding-menu'
    this.keywords = ['settings', 'configure', 'configuration', 'options', 'edit', 'file']
    this.listed = true
    this.resizable = false

    this.codeMenu = [
      {
        key: 'save',
        alts: ['save', 'github', 'project', 'repo', 'repository']
      },
      {
        key: 'new',
        alts: ['new', 'blank', 'start', 'fresh', 'canvas']
      },
      {
        key: 'open',
        func: 'openFile',
        alts: ['open', 'github', 'project', 'repo', 'repository']
      },
      {
        key: 'share',
        alts: ['host', 'github', 'publish', 'public', 'share'],
        hrAfter: true
      },
      {
        key: 'code review',
        alts: ['check', 'code', 'review', 'audit', 'lint', 'error', 'mistake']
      },
      {
        key: 'tidy code',
        alts: ['tidy', 'format', 'clean', 'indent']
      }
      // {
      //   key: 'BrowserFest',
      //   alts: []
      // }
    ]

    this.editorSettingsMenu = [
      {
        key: 'auto-update',
        alts: ['update', 'render', 'auto', 'compile'],
        select: 'func-menu-update-select'
      },
      {
        key: 'chattiness',
        alts: ['chatty', 'dialogue', 'netnet', 'bubbles'],
        select: 'func-menu-chat-select'
      },
      // {
      //   key: 'popUpWindow',
      //   alts: ['pop', 'up', 'out', 'separate', 'window']
      // },
      {
        key: 'layout',
        alts: ['layout', 'view', 'orientation', 'setup'],
        select: 'func-menu-layout-select'
      },
      {
        key: 'theme',
        alts: ['theme', 'color', 'style', 'syntax highlight'],
        select: 'func-menu-themes-select'
      },
      {
        key: 'word wrap',
        alts: ['word', 'line', 'wrap', 'warpping'],
        select: 'func-menu-wrap-select',
        hrAfter: true
      },
      {
        key: 'view shortcuts',
        alts: []
      },
      {
        key: 'view your data',
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

  save () {
    if (WIDGETS['code-examples']) WIDGETS['code-examples'].cancelExample()
    this.convos = window.CONVOS[this.key](this)

    if (WIDGETS['project-files'] && WIDGETS['student-session'].getData('opened-project')) {
      // working on an opened github project
      WIDGETS['project-files'].saveCurrentFile()
    } else if (utils.url.github) {
      this.convos = window.CONVOS[this.key](this)
      const ghOwner = utils.url.github.split('/')[0]
      const loggedIn = WIDGETS['student-session'].getData('owner')
      if (loggedIn && loggedIn === ghOwner) { // viewing ur own project
        window.convo = new Convo(this.convos, 'viewing-prev-saved-proj')
      } else if (loggedIn) { // viewing someone else's gh project
        window.convo = new Convo(this.convos, 'unsaved-changes-b4-fork-proj')
      } else {
        window.convo = new Convo(this.convos, 'unsaved-changes-b4-fork-proj-logged-out')
      }
    } else { // working on a sketch
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'session-saved')
      WIDGETS['student-session'].setSavePoint()
    }
  }

  new () {
    this.convos = window.CONVOS[this.key](this)
    const repo = WIDGETS['student-session'].getData('opened-project')
    const pf = WIDGETS['project-files']
    if (repo && pf) window.convo = new Convo(this.convos, 'new-proj-or-sketch2')
    else window.convo = new Convo(this.convos, 'new-proj-or-sketch')
  }

  _newProject () {
    if (WIDGETS['project-files']) WIDGETS['project-files'].newProject()
    else WIDGETS.load('project-files', (w) => w.newProject())
  }

  _newSketch () {
    WIDGETS['student-session'].newSketch()
  }

  share () {
    this.convos = window.CONVOS[this.key](this)
    if (WIDGETS['student-session'].getData('opened-project')) {
      // working on an opened github project
      window.convo = new Convo(this.convos, 'share-project')
    } else if (utils.url.github) {
      this.convos = window.CONVOS[this.key](this)
      const ghOwner = utils.url.github.split('/')[0]
      const loggedIn = WIDGETS['student-session'].getData('owner')
      if (loggedIn && loggedIn === ghOwner) { // viewing ur own project
        window.convo = new Convo(this.convos, 'share-my-gh-project')
      } else { // viewing someone else's gh project
        window.convo = new Convo(this.convos, 'share-other-gh-project')
      }
    } else { // working on a sketch
      WIDGETS.open('share-widget')
    }
  }

  openFile () {
    this.convos = window.CONVOS[this.key](this)
    const loggedIn = WIDGETS['student-session'].getData('owner')
    if (loggedIn) {
      const op = WIDGETS['student-session'].getData('opened-project')
      if (op) {
        window.convo = new Convo(this.convos, 'open-logged-in-proj')
      } else {
        window.convo = new Convo(this.convos, 'open-logged-in')
      }
    } else {
      window.convo = new Convo(this.convos, 'open-logged-out')
    }
  }

  // -------------

  downloadCode () {
    const uri = `data:text/html;base64,${utils.btoa(NNE.code)}`
    const a = document.createElement('a')
    a.setAttribute('download', 'index.html')
    a.setAttribute('href', uri)
    a.click()
    a.remove()
  }

  uploadCode () {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.html'

      input.addEventListener('change', function (event) {
        const file = event.target.files[0]
        if (!file) {
          reject(new Error('No file selected'))
          return
        }

        if (!file.type.includes('html')) {
          reject(new Error('Please upload a valid HTML file'))
          return
        }

        const reader = new window.FileReader()
        reader.onload = function (e) {
          NNE.code = e.target.result
          resolve(e.target.result)
        }

        reader.onerror = function () {
          reject(new Error('Error reading file'))
        }

        reader.readAsText(file)
      })

      input.click()
    })
  }

  // ------------------------------------------ editor settings functions ------

  autoUpdate (val) {
    const gotVal = typeof val === 'boolean'
    NNE.autoUpdate = gotVal ? val : this.autoUpdateSel.value === 'true'

    if (this.sesh) this.sesh.setData('auto-update', NNE.autoUpdate.toString())

    if (!NNE.autoUpdate && !gotVal) {
      const repo = WIDGETS['student-session'].getData('opened-project')
      if (repo) window.convo = new Convo(this.convos, 'need-to-update2')
      else window.convo = new Convo(this.convos, 'need-to-update')
    } else if (!gotVal && window.convo && window.convo.id.startsWith('need-to-update')) {
      window.convo.hide()
    }
  }

  layout () {
    NNW.layout = this.layoutsSel.value
  }

  popUpWindow () {
    this.layoutsSel.value = 'full-screen'
    this.layout()
    // TODO: working on:
    // https://github.com/netizenorg/netnet.studio/issues/220
    // https://github.com/netizenorg/netnet.studio/issues/240
    // see: "window.onmessage" && notes at the bottom of www/core/utils.js
  }

  theme () {
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
    WIDGETS['code-review'].review()
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

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML (gh) {
    this.subs = {}
    this.subs['my code'] = this.codeMenu
    this.subs['editor settings'] = this.editorSettingsMenu

    this.innerHTML = `
      <div id="func-menu-content">
        <div id="func-menu-login" tabindex="0">
          ${gh ? 'disconnect from GitHub' : 'connect to GitHub'}
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
        b.textContent = btn.key
        const func = btn.func || this._toCamelCase(btn.key)
        // HACK: to avoid having netnet's textBubble pull focus from drop down
        // which causes autoUpdate to get stuck on false in some systems
        if (btn.key !== 'auto-update' && btn.key !== 'chattiness') {
          b.addEventListener('click', (e) => this[func]())
        }
        if (btn.select) {
          b.classList.add('select-inside')
          b.textContent = btn.key
          const sel = document.createElement('select')
          sel.classList.add('dropdown')
          sel.id = btn.select
          b.appendChild(sel)
          b.addEventListener('click', () => sel.focus())
        } else if (btn.float) {
          b.textContent = btn.key
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
  }

  _toCamelCase (str) {
    return str.split(' ')
      .map((word, index) => {
        if (index === 0) return word.toLowerCase()
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      }).join('')
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
    if (this.autoUpdateSel.children.length < 2) {
      this._creatOption('true', this.autoUpdateSel)
      this._creatOption('false', this.autoUpdateSel)
    }
    this.autoUpdateSel.value = this.sesh.getData('auto-update')
    this.autoUpdateSel.addEventListener('change', () => this.autoUpdate())

    this.layoutsSel = this.$('#func-menu-layout-select')
    if (this.layoutsSel.children.length < NNW.layouts.length) {
      NNW.layouts // lets hide 'separate-window' for now
        .filter(l => l !== 'separate-window') // will be misleading when we create popUpWindow()
        .forEach(l => {
          if (this.layoutsSel.children.length < 4) this._creatOption(l, this.layoutsSel)
        })
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
    if (status === 'connect to GitHub') {
      WIDGETS['student-session'].chatGitHubAuth()
      if (this.events.login) this.emit('login', { data: null }) // TODO: what is this for? check tutorials?
    } else {
      WIDGETS['student-session'].chatGitHubLogout()
      if (this.events.logout) this.emit('logout', { data: null }) // TODO: what is this for? check tutorials?
    }
  }
}

window.CodingMenu = CodingMenu
