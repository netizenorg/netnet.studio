/* global Widget, Convo, NNE, NNW, FileUploader, WIDGETS, Maths, utils */
class FunctionsMenu extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Functions Menu'
    this.key = 'functions-menu'
    this.keywords = ['settings', 'configure', 'configuration', 'options', 'edit', 'file']
    this.listed = true
    this.resizable = false

    // const ghAuthedMenu = [
    //   {
    //     click: 'codeReview',
    //     alts: ['check', 'code', 'review', 'audit', 'lint', 'error', 'mistake']
    //   },
    //   {
    //     click: 'tidyCode',
    //     alts: ['tidy', 'format', 'clean', 'indent'],
    //     hrAfter: true
    //   },
    //   {
    //     click: 'saveProject',
    //     alts: ['save', 'github', 'project', 'repo', 'repository']
    //   },
    //   {
    //     click: 'openProject',
    //     alts: ['open', 'github', 'project', 'repo', 'repository']
    //   },
    //   {
    //     click: 'newProject',
    //     alts: ['new', 'blank', 'start', 'fresh', 'canvas']
    //   }
    // ]

    const noAuthedMenu = [
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
        click: 'saveSketch',
        alts: ['progress', 'save', 'state']
      },
      {
        click: 'shareSketch',
        alts: ['share', 'link', 'save']
      },
      {
        click: 'newSketch',
        alts: ['new', 'sketch', 'blank', 'canvas'],
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

    const editorSettingsMenu = [
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
        click: 'changeLayout',
        alts: ['layout', 'view', 'orientation', 'setup'],
        select: 'func-menu-layout-select'
      },
      {
        click: 'changeTheme',
        alts: ['theme', 'color', 'style', 'syntax highlight'],
        select: 'func-menu-themes-select'
      }
    ]

    this.subs = {}
    // TODO: if user is authenticated show auth menu, otherwise other menu
    // this.subs['my project'] = ghAuthedMenu
    this.subs['my sketch'] = noAuthedMenu
    this.subs['editor settings'] = editorSettingsMenu

    this._createHTML()
    this._initValues()
    this._setupListeners()

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  codeReview () {
    // TODO: once new erorr system widget is finished
    WIDGETS.open('code-review')
  }

  tidyCode () {
    NNE.tidy()
  }

  saveProject () {
    // TODO: once github functionality is updated
    window.convo = new Convo(this.convos, 'coming-soon')
  }

  openProject () {
    // TODO: once github functionality is updated
    window.convo = new Convo(this.convos, 'coming-soon')
  }

  newProject () {
    // TODO: once github functionality is updated
    window.convo = new Convo(this.convos, 'coming-soon')
  }

  shareSketch () {
    // NNE.saveToHash() NOTE: hash generated in convo now
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'generate-sketch-url')
  }

  saveSketch () {
    window.convo = new Convo(this.convos, 'session-saved')
    this.sesh.setSavePoint()
  }

  newSketch () {
    const name = this.sesh.getData('username')
    const adj = [
      'Super Rad', 'Amazing', 'Spectacular', 'Revolutionary', 'Contemporary'
    ]
    NNW.layout = 'dock-left'
    NNE.code = typeof name === 'string'
      ? `<h1>${Maths.random(adj)} Net Art</h1>\n<h2>by ${name}</h2>`
      : '<h1>Hello World Wide Web!</h1>'
    window.convo = new Convo(this.convos, 'blank-canvas-ready')
  }

  downloadCode () {
    const uri = `data:text/html;base64,${window.btoa(NNE.code)}`
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
    this._hideIrrelevantOpts('func-menu-editor-settings')
  }

  runUpdate () {
    NNE.update()
  }

  changeLayout () {
    NNW.layout = this.layoutsSel.value
  }

  changeTheme () {
    NNW.theme = this.themesSel.value
    this.sesh.setData('theme', NNW.theme)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  toggleSubMenu (id, type) {
    const subSec = this.$(`#${id} > .func-menu-sub-section`)
    const subSecParent = this.$(`#${id}`)
    this._hideIrrelevantOpts(id, type)
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
    this.keepInFrame()
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _demonstrateCreditComment () {
    const name = this.sesh.getData('username') || 'me'
    const credit = `<!-- this code was hand crafted by ${name} -->\n`
    NNE.cm.setSelection({ line: 0, ch: 0 })
    NNE.cm.replaceSelection(credit)
    setTimeout(() => {
      NNE.spotlight(1)
      window.convo = new Convo(this.convos, 'show-me-how-to-comment')
    }, utils.getVal('--menu-fades-time'))
  }

  _shortenURL (layout) {
    NNE.spotlight(null)
    NNW.menu.switchFace('processing')
    window.convo = new Convo(this.convos, 'ok-processing')
    const time = utils.getVal('--layout-transition-time')
    setTimeout(() => {
      const data = { hash: NNE.generateHash() }
      utils.post('./api/shorten-url', data, (res) => {
        if (!res.success) {
          NNW.menu.switchFace('upset')
          console.error(res.error)
          window.convo = new Convo(this.convos, 'oh-no-error')
        } else {
          NNW.menu.switchFace('default')
          this._tempCode = res.key
          this.convos = window.CONVOS['functions-menu'](this)
          if (layout) window.convo = new Convo(this.convos, 'no-hide-short')
          else window.convo = new Convo(this.convos, 'shorten-url')
        }
      })
    }, time)
  }

  _shareLongCodeWithLayout () {
    this.convos = window.CONVOS['functions-menu'](this)
    window.convo = new Convo(this.convos, 'no-hide-long')
  }

  _createHTML () {
    this.innerHTML = `
      <div id="func-menu-content">
        <div id="func-menu-login" tabindex="0">
          login <!-- or logout -->
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

    if (this._recentered) this.update({ left: 20, top: 20 })
  }

  _hideIrrelevantOpts (id, type) {
    function hideIf (b, condition) {
      if (condition) b.style.display = 'none'
      else b.style.display = 'block'
    }

    if (id === 'func-menu-editor-settings' && !type) {
      const btns = this.$('button')
      for (let i = 0; i < btns.length; i++) {
        if (btns[i].textContent.includes('runUpdate')) {
          hideIf(btns[i], NNE.autoUpdate)
        }
        // NOTE: ...should we hide (or not) welcome layout in drop down?
        // else if (btns[i].textContent.includes('changeLayout')) {
        //   hideIf(btns[i], NNW.layout === 'welcome')
        // }
      }
    }
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
    NNW.layouts
      // .filter(l => l !== 'welcome') // NOTE: see other note
      .forEach(l => this._creatOption(l, this.layoutsSel))
    this.themesSel = this.$('#func-menu-themes-select')
    Object.keys(NNE.themes).forEach(l => this._creatOption(l, this.themesSel))
    this.layoutsSel.value = NNW.layout
    this.themesSel.value = NNW.theme
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
      dropping: (e) => { /* maybe change face... */ },
      dropped: (e) => { /* ...if so change face back */ },
      ready: (file) => {
        this.close()
        const data = file.data.split('data:text/html;base64,')[1]
        NNE.code = window.atob(data)
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
        this._hideIrrelevantOpts('func-menu-editor-settings')
      }
    })
  }

  _login () {
    const status = this.$('#func-menu-login').textContent.trim()
    console.log(status)
    window.convo = new Convo(this.convos, 'coming-soon')
  }
}

window.FunctionsMenu = FunctionsMenu
