/* global Widget, WIDGETS, STORE, NNW, NNE, NNM, FileUploader, Convo */
/*
  -----------
     info
  -----------

  the main menu's Functions sub-menu

  -----------
     usage
  -----------

  // this widget is instantiated by the WindowManager as...
  WIDGETS['functions-menu'] = new MenuFunctions()

  // it has the following methods
  WIDGETS['functions-menu'].startMenu()
  WIDGETS['functions-menu'].shareLink()
  WIDGETS['functions-menu'].downloadCode()
  WIDGETS['functions-menu'].uploadCode()
  WIDGETS['functions-menu'].saveProject()
  WIDGETS['functions-menu'].openProject()
  WIDGETS['functions-menu'].newProject()
  WIDGETS['functions-menu'].tidyCode()
  WIDGETS['functions-menu'].runUpdate()
  WIDGETS['functions-menu'].autoUpdate()
  WIDGETS['functions-menu'].changeLayout()
  WIDGETS['functions-menu'].changeTheme()
  WIDGETS['functions-menu'].changeOpacity()
  WIDGETS['functions-menu'].resetErrors()
  WIDGETS['functions-menu'].refresh()
  WIDGETS['functions-menu'].reboot()

  // type is optional, should be either 'open' or 'close'
  WIDGETS['functions-menu'].toggleSubMenu('sub-menu-id', type)

  // also inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js

*/
class MenuFunctions extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Functions Menu' // shows up in title bar
    this.key = 'functions-menu' // used for: WIDGETS[key] = new MenuFunctions()
    this.resizable = false
    this.listed = false // make sure it doesn't show up in Widgets Menu
    this.keywords = ['settings', 'configure', 'configuration', 'options', 'edit', 'file']
    this.subs = {
      'my project': [
        {
          click: 'shareLink',
          alts: ['share', 'link', 'save'],
          hrAfter: true
        },
        {
          click: 'downloadCode',
          alts: ['download', 'export', 'save']
        },
        {
          click: 'uploadCode',
          alts: ['upload', 'import', 'open'],
          hrAfter: true
        },
        {
          click: 'saveProject',
          alts: ['save', 'github', 'project', 'repo', 'repository']
        },
        {
          click: 'openProject',
          alts: ['open', 'github', 'project', 'repo', 'repository']
        },
        {
          click: 'newProject',
          alts: ['new', 'blank', 'start', 'fresh', 'canvas']
        }
      ],
      'editor settings': [
        {
          click: 'tidyCode',
          alts: ['tidy', 'format', 'clean', 'indent']
        },
        {
          click: 'runUpdate',
          alts: ['update', 'render', 'compile']
        },
        {
          click: 'autoUpdate',
          alts: ['update', 'render', 'auto', 'compile'],
          select: 'func-menu-update-select'
        },
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
          click: 'changeOpacity',
          alts: ['opacity', 'transparency', 'fade'],
          float: 'func-menu-opacity-input'
        }
      ],
      'reset options': [
        {
          click: 'resetErrors',
          alts: ['reset', 'ignored', 'dismissed', 'errors']
        },
        {
          click: 'refresh',
          alts: ['restart', 'reset']
        },
        {
          click: 'reboot',
          alts: ['restart', 'clear', 'start over']
        }
      ]
    }
    this._createContent()
    this._initValues()
    this._setupListeners()

    this.convos = null
    window.utils.loadConvoData('functions-menu', () => {
      // NOTE: need to rerun this everytime a convo which relies on
      // localStorage data is going to launch (to ensure latest data)
      this.convos = window.convos['functions-menu'](this)
    })
  }

  startMenu () {
    this.close()
    window.greetings.startMenu()
  }

  shareLink () {
    if (!this.convos) window.alert('on sec, loading data') // TODO loading
    STORE.dispatch('CLOSE_WIDGET', 'functions-menu')
    const opened = window.localStorage.getItem('opened-project')
    if (opened) {
      this.convos = window.convos['functions-menu'](this)
      window.convo = new Convo(this.convos['share-saved-project'])
    } else {
      STORE.dispatch('SHARE_URL')
      window.convo = new Convo(this.convos['share-sketch'])
    }
  }

  saveProject () {
    STORE.dispatch('CLOSE_WIDGET', 'functions-menu')
    window.utils.get('./api/github/auth-status', (res) => {
      if (res.success) { // if user is authenticated
        if (window.localStorage.getItem('opened-project')) {
          if (window.localStorage.getItem('last-commit-msg') === 'init') {
            window.convo = new Convo(this.convos['save-newish-project'])
          } else {
            this.convos = window.convos['functions-menu'](this)
            window.convo = new Convo(this.convos['save-open-project'])
          }
        } else { // if this is a new project ...
          window.convo = new Convo(this.convos['create-new-project'])
        }
        window.utils.updateRoot()
      } else { // if user has not authenticated
        window.utils.updateRoot()
        window.convo = new Convo(this.convos['user-needs-login-to-save'])
      }
    })
  }

  openProject () {
    STORE.dispatch('CLOSE_WIDGET', 'functions-menu')
    window.utils.get('./api/github/auth-status', (res) => {
      if (res.success) WIDGETS['saved-projects'].open()
      else window.convo = new Convo(this.convos['user-needs-login-to-open'])
    })
  }

  _newProject () {
    // TODO: new project from a set of templates? templates widget?
    NNE.code = '<!DOCTYPE html>'
    window.utils.clearProjectData()
  }

  newProject () {
    STORE.dispatch('CLOSE_WIDGET', 'functions-menu')
    if (!window.localStorage.getItem('opened-project')) this._newProject()
    else {
      const lastCode = window.localStorage.getItem('last-commit-code')
      const currCode = window.localStorage.getItem('code')
      if (lastCode === currCode) {
        this.convos = window.convos['functions-menu'](this)
        window.convo = new Convo(this.convos['start-new-project'])
      } else {
        this.convos = window.convos['functions-menu'](this)
        window.convo = new Convo(this.convos['unsaved-changes'])
      }
    }
  }

  uploadCode () {
    STORE.dispatch('CLOSE_WIDGET', 'functions-menu')
    this.fu.input.click()
  }

  downloadCode () {
    const uri = `data:text/html;base64,${window.btoa(NNE.code)}`
    const a = document.createElement('a')
    a.setAttribute('download', 'index.html')
    a.setAttribute('href', uri)
    a.click()
    a.remove()
  }

  tidyCode () {
    NNE.tidy()
  }

  runUpdate () {
    NNE.update()
    if (NNE.autoUpdate) {
      window.convo = new Convo(this.convos['no-need-to-update'])
    }
  }

  autoUpdate () {
    NNE.autoUpdate = this.autoUpdateSel.value === 'true'
    if (!NNE.autoUpdate) {
      window.convo = new Convo(this.convos['need-to-update'])
    }
  }

  changeLayout () {
    STORE.dispatch('CHANGE_LAYOUT', this.layoutsSel.value)
  }

  changeTheme () {
    STORE.dispatch('CHANGE_THEME', this.themesSel.value)
  }

  changeOpacity () {
    STORE.dispatch('CHANGE_OPACITY', Number(this.opacityInp.value))
  }

  resetErrors () {
    window.localStorage.removeItem('error-exceptions')
    NNE.clearErrorExceptions()
    setTimeout(() => {
      if (!STORE.is('SHOWING_ERROR')) {
        window.convo = new Convo(this.convos['confirm-errors-reset'])
      }
    }, STORE.getTransitionTime())
  }

  reboot () {
    window.convo = new Convo(this.convos['reboot-netnet'])
  }

  refresh () {
    window.convo = new Convo(this.convos['refresh-netnet'])
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
    this._stayInFrame()
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createContent (quote, author) {
    this.innerHTML = `
      <div id="func-menu-content">
        <div id="func-menu-hi" tabindex="0">
          hi netnet!
          <span class="icon"></span>
        </div>
      </div>
    `

    this.$('#func-menu-hi').addEventListener('click', () => {
      this.startMenu()
      this.$('#func-menu-hi').blur()
    })
    this.$('#func-menu-hi').addEventListener('keypress', (e) => {
      if (e.which === 13) {
        this.startMenu()
      }
    })

    for (const sub in this.subs) {
      const div = document.createElement('div')
      div.id = `func-menu-${sub.replace(/ /g, '-')}`
      div.classList.add('func-menu-dropdown')
      const title = document.createElement('span')
      title.textContent = sub
      title.tabIndex = 0
      title.addEventListener('click', () => {
        this.toggleSubMenu(div.id)
        title.blur()
      })
      title.addEventListener('keypress', (e) => {
        if (e.which === 13) {
          this.toggleSubMenu(div.id)
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
        b.addEventListener('click', (e) => this[btn.click]())
        if (btn.select) {
          b.textContent = btn.click + '('
          const sel = document.createElement('select')
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

    if (this._recentered) this.update({ left: 20, bottom: 20 })
  }

  _creatOption (value, parent) {
    const o = document.createElement('option')
    o.setAttribute('value', value)
    o.textContent = value
    parent.appendChild(o)
  }

  _initValues () {
    this.autoUpdateSel = this.$('#func-menu-update-select')
    this._creatOption('true', this.autoUpdateSel)
    this._creatOption('false', this.autoUpdateSel)
    this.autoUpdateSel.addEventListener('change', () => this.autoUpdate())
    this.layoutsSel = this.$('#func-menu-layout-select')
    NNW.layouts.forEach(l => this._creatOption(l, this.layoutsSel))
    this.themesSel = this.$('#func-menu-themes-select')
    Object.keys(NNE.themes).forEach(l => this._creatOption(l, this.themesSel))
    this.opacityInp = this.$('#func-menu-opacity-input')
    this.opacityInp.value = STORE.state.opacity
    this.layoutsSel.value = STORE.state.layout
    this.themesSel.value = STORE.state.theme
  }

  _setupListeners () {
    // setup FileUploader
    this.fu = new FileUploader({
      click: '#func-menu-upload',
      drop: '#nn-window',
      filter: (type) => {
        if (type !== 'text/html') return false
        else return true // TODO: later allow CSS && JS
      },
      dropping: (e) => { STORE.dispatch('CHANGE_OPACITY', 0.5) },
      dropped: (e) => { STORE.dispatch('CHANGE_OPACITY', 1) },
      ready: (file) => {
        STORE.dispatch('CLOSE_WIDGET', 'functions-menu')
        const data = file.data.split('data:text/html;base64,')[1]
        NNE.code = window.atob(data)
      },
      error: (err) => {
        window.convo = new Convo(this.convos['temp-disclaimer'])
        console.error('MenuFunctions:', err)
      }
    })

    // setup WIDGET listeners
    this.on('close', () => {
      // close open sub menus
      for (const sub in this.subs) {
        const id = `func-menu-${sub.replace(/ /g, '-')}`
        this.toggleSubMenu(id, 'close')
      }
    })

    // setup STORE listeners
    STORE.subscribe('layout', (data) => {
      this.layoutsSel.value = data
    })
    STORE.subscribe('theme', (data) => {
      this.themesSel.value = data
    })
    STORE.subscribe('opacity', (data) => {
      this.opacityInp.value = data
    })
  }

  _stayInFrame () { // ensure that the textBubble is always readable in frame
    setTimeout(() => {
      const offset = (this.ele.offsetTop + this.ele.offsetHeight)
      if (offset > window.innerHeight) {
        this.ele.style.transition = 'top .5s cubic-bezier(0.165, 0.84, 0.44, 1)'
        setTimeout(() => {
          const t = this.ele.offsetTop - Math.abs(window.innerHeight - offset - 20)
          this.ele.style.top = `${t + 10}px` // +10 for a little space
          setTimeout(() => { this.ele.style.transition = 'none' }, 500)
        }, 10)
      }
    }, STORE.getTransitionTime())
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _shortenURL () {
    return () => {
      STORE.dispatch('SHOW_EDU_TEXT', { content: 'Ok, ...processing...' })
      const time = STORE.getTransitionTime()
      setTimeout(() => {
        window.utils.runProcessingFace()
        setTimeout(() => {
          const data = { hash: window.location.hash }
          window.utils.post('./api/shorten-url', data, (res) => {
            if (!res.success) {
              console.error(res.error)
              window.convo = new Convo(this.convos['oh-no-error'])
              setTimeout(() => NNM.setFace('ŏ', '︵', 'ŏ', false), time)
            } else {
              const waitForDramaticEffect = time < 2000 ? 2000 : time
              setTimeout(() => {
                window.localStorage.setItem('project-url', res.url)
                this.convos = window.convos['functions-menu'](this)
                window.convo = new Convo(this.convos['url-shortened'])
                window.utils.processingFace = false
              }, waitForDramaticEffect)
            }
          })
        }, time)
      }, time)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // github methods

  _githubAuth (from) {
    // keep a refernce for where the user was redirected from
    // ('save' or 'open') so netnet knows what dialogue to present
    // when they get redirected back.
    window.localStorage.setItem('pre-auth-from', from)
    const id = 'client_id=af0f317a19fc4fd571be'
    const scope = 'scope=public_repo'
    const url = `https://github.com/login/oauth/authorize?${id}&${scope}`
    const a = document.createElement('a')
    a.setAttribute('download', 'index.html')
    a.setAttribute('href', url)
    a.click()
  }

  _createNewRepo (c, t, v) {
    window.utils.runProcessingFace()
    t.$('section').innerHTML = '...saving to GitHub...'
    NNM.textBubble.updatePosition()
    const time = STORE.getTransitionTime()
    const data = { name: v, data: window.btoa(NNE.code) }
    window.utils.post('./api/github/new-repo', data, (res) => {
      window.utils.processingFace = false
      if (res.error) { // if there's an error creating the repo
        console.error(res.error)
        if (res.error.errors[0].message.includes('name already exists')) {
          window.convo = new Convo(this.convos['project-already-exists'])
        } else {
          window.convo = new Convo(this.convos['oh-no-error'])
        }
        setTimeout(() => NNM.setFace('ŏ', '︵', 'ŏ', false), time)
      } else { // otherwise let the user know it's all good!
        const code = NNE._encode(NNE.code)
        window.utils.setProjectData({
          name: res.name,
          code: code,
          sha: res.data.content.sha,
          message: 'init'
        })
        WIDGETS['saved-projects'].add(res.name)
        this.convos = window.convos['functions-menu'](this)
        window.convo = new Convo(this.convos['new-project-created'])
      }
    })
  }

  _publishProject () {
    STORE.dispatch('SHOW_EDU_TEXT', {
      content: '...publishing to GitHub Pages...'
    })
    const time = STORE.getTransitionTime()
    setTimeout(() => { window.utils.runProcessingFace() }, time)
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: window.localStorage.getItem('opened-project')
    }
    window.utils.post('./api/github/gh-pages', data, (res) => {
      if (!res.success) {
        window.convo = new Convo(this.convos['oh-no-error'])
        setTimeout(() => NNM.setFace('ŏ', '︵', 'ŏ', false), time)
      } else {
        window.localStorage.setItem('project-url', res.data.html_url)
        this.convos = window.convos['functions-menu'](this)
        window.convo = new Convo(this.convos['publish-to-ghpages'])
      }
    })
  }

  _updateProject (message) {
    STORE.dispatch('SHOW_EDU_TEXT', { content: '...saving to GitHub...' })
    const time = STORE.getTransitionTime()
    setTimeout(() => { window.utils.runProcessingFace() }, time)
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: window.localStorage.getItem('opened-project'),
      sha: window.localStorage.getItem('index-sha'),
      path: 'index.html',
      message: message,
      code: window.btoa(NNE.code)
    }
    window.utils.post('./api/github/save-project', data, (res) => {
      if (!res.success) {
        window.convo = new Convo(this.convos['oh-no-error'])
        setTimeout(() => NNM.setFace('ŏ', '︵', 'ŏ', false), time)
      } else {
        window.localStorage.setItem('index-sha', res.data.content.sha)
        window.localStorage.setItem('last-commit-msg', res.data.commit.message)
        window.localStorage.setItem('last-commit-code', NNE._encode(NNE.code))
        window.convo = new Convo(this.convos['project-saved'])
      }
    })
  }
}

window.MenuFunctions = MenuFunctions
