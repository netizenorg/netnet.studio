/* global Convo, Widget, WIDGETS, NNE, NNW, nn, utils */
class StudentSession extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'student-session'
    this.listed = true
    this.keywords = ['github', 'login', 'logout', 'session', 'user', 'account', 'me', 'my', 'data']

    this.title = 'Your Session Data'
    this.greeted = false

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('open', () => this._onOpen())

    // temporary store for platform info (used to explain "made-up-name")
    this._explainName = 'oh dang! I hit a bug...'

    this._init()
    this._createHTML()
  }

  get data () {
    const ls = window.localStorage
    // const ss = window.sessionStorage
    const data = {
      username: ls.getItem('username'),
      editor: {
        autoUpdate: ls.getItem('auto-update'),
        wrap: typeof ls.getItem('wrap') === 'string' ? ls.getItem('wrap') : true,
        chattiness: ls.getItem('chattiness'),
        theme: ls.getItem('theme'),
        nomotion: ls.getItem('nomotion')
      },
      github: {
        owner: ls.getItem('owner'),
        repos: ls.getItem('repos')
      },
      llm: {
        provider: ls.getItem('llm-provider'),
        keyOpenai: ls.getItem('llm-key-openai'),
        keyAnthropic: ls.getItem('llm-key-anthropic'),
        modelOpenai: ls.getItem('llm-model-openai'),
        modelAnthropic: ls.getItem('llm-model-anthropic'),
        temperature: ls.getItem('llm-temperature'),
        maxTokens: ls.getItem('llm-max-tokens')
      },
      lastSave: {
        sketch: ls.getItem('last-saved-sketch'),
        layout: ls.getItem('last-saved-layout'),
        widgets: ls.getItem('last-saved-widgets')
      },
      tutorial: {
        // TODO: bookmark feature?
        // saves tut-video-timeline timecode + widget placements + netitor code && layout
      }
    }
    return data
  }

  set data (v) {
    return console.warn('StudentSession: data is read-only, use .setData() method')
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  getData (type) {
    const ls = window.localStorage
    if (type) {
      if (Object.keys(this.data).includes(type)) return this.data[type]
      else if (Object.keys(ls).includes(type)) {
        return ls.getItem(type)
      } else if (Object.keys(window.sessionStorage).includes(type)) {
        return window.sessionStorage.getItem(type)
      } else if (type === 'wrap') {
        return typeof ls.getItem('wrap') === 'string' ? ls.getItem('wrap') : true
      }
    } else return this.data
  }

  setData (type, value) {
    // NOTE: was used to use "sessionStorage" for project data to allow multiple
    // tabs on diff projects, this was before Project Files handled this
    const sesh = [
      // 'opened-project', 'project-url', 'branch', 'ghpages'
    ]
    const store = sesh.includes(type) ? 'sessionStorage' : 'localStorage'
    if (!value) window[store].removeItem(type)
    else window[store].setItem(type, value)
    this._createHTML()
    return this.data
  }

  setSavePoint () {
    const wigs = WIDGETS.list()
      .filter(w => w.opened)
      .map(w => { return { key: w.key, top: w.top, left: w.left, zIndex: w.zIndex } })
    const code = NNE.generateHash()
    window.localStorage.setItem('last-saved-sketch', code)
    window.localStorage.setItem('last-saved-layout', NNW.layout)
    window.localStorage.setItem('last-saved-widgets', JSON.stringify(wigs))
    this._createHTML()
  }

  clearSaveState () {
    window.localStorage.removeItem('last-saved-sketch')
    window.localStorage.removeItem('last-saved-layout')
    window.localStorage.removeItem('last-saved-widgets')
  }

  newSketch (convo) {
    this.convos = window.CONVOS[this.key](this)
    this.clearSaveState()
    NNW.layout = 'dock-left'
    NNE.code = ''
    setTimeout(() => {
      window.convo = new Convo(this.convos, convo || 'blank-canvas-ready')
      if (!NNE.autoUpdate) NNE.update()
    }, utils.getVal('--layout-transition-time'))
  }

  restoreSavePoint () {
    const code = window.localStorage.getItem('last-saved-sketch').substr(6)
    const decoded = NNE._decode(code)
    NNE.code = decoded
    this.code = decoded
    setTimeout(() => { NNE.cm.refresh() }, 10)
    NNW.layout = window.localStorage.getItem('last-saved-layout')
    const wigs = JSON.parse(window.localStorage.getItem('last-saved-widgets'))
    wigs
      .filter(w => w.key !== 'hyper-video-player')
      .forEach(w => {
        WIDGETS.open(w.key, widget => {
          widget.update({ left: w.left, top: w.top, zIndex: w.zIndex }, 500)
        })
      })
  }

  clearAllData (skipDialogue) {
    window.localStorage.clear()
    window.sessionStorage.clear()
    this.deleteGitHubSession(skipDialogue, () => this._init())
  }

  chatGitHubLogout () {
    window.convo = new Convo(this.convos, 'github-logout')
  }

  deleteGitHubSession (skipDialogue, callback) {
    utils.get('./api/github/clear-cookie', (res) => {
      this.authStatus = false
      if (WIDGETS['project-files']?.projectData.name) {
        WIDGETS['project-files'].closeProject()
      }
      this.setData('owner', null)
      this.setData('repos', null)
      this._createHTML()
      WIDGETS['coding-menu'].gitHubUpdated(false)
      if (!skipDialogue) {
        window.convo = new Convo(this.convos, 'logged-out-of-gh')
      }
      if (callback) callback()
    })
  }

  chatGitHubAuth () {
    window.convo = new Convo(this.convos, 'github-auth')
  }

  authGitHubSession () {
    const temp = `#code/${NNE._encode('<h1>Hello World Wide Web</h1>')}`
    const code = (utils.btoa(NNE.code) === utils.starterCodeB64)
      ? temp : NNE.generateHash()
    if (utils.url.github) {
      window.localStorage.setItem('gh-auth-temp-code', '__GH__' + utils.url.github)
    } else if (utils.url.template) {
      window.localStorage.setItem('gh-auth-temp-code', '__TEMP__' + utils.url.template)
    } else window.localStorage.setItem('gh-auth-temp-code', code)
    utils.get('api/github/client-id', (json) => {
      if (json.success === false) return utils._Convo('oh-no-error', json)
      const id = `client_id=${json.message}`
      const scope = 'scope=public_repo'
      const url = `https://github.com/login/oauth/authorize?${id}&${scope}`
      const a = document.createElement('a')
      a.setAttribute('download', 'index.html')
      a.setAttribute('href', url)
      a.click()
    })
  }

  initGitHubData (json) {
    if (json.success) {
      utils.get('/api/github/username', (json) => {
        if (json.data) this.setData('owner', json.data.login)
        WIDGETS['coding-menu'].gitHubUpdated(true)
      })
      utils.get('/api/github/saved-projects', (json) => {
        if (!json.data) return
        const names = json.data.map(o => o.name)
        this.setData('repos', names.join(', '))
        this.convos = window.CONVOS[this.key](this) // to redo repoSelectionList
      })
    } else {
      this.authStatus = false
      WIDGETS['coding-menu'].gitHubUpdated(false)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  greetStudent () {
    if (!this.convos) {
      setTimeout(() => this.greetStudent(), 100)
      return
    }

    // during tutorial
    const hvp = WIDGETS['hyper-video-player']
    if (hvp && hvp.data?.metadata.id) {
      hvp.pause()
      const convos = this.convos = window.CONVOS['hyper-video-player'](hvp)
      window.convo = new Convo(convos, 'interrupt')
      return
    } else {
      this.convos = window.CONVOS[this.key](this)
    }

    // if netnet was hiding, let's center+display it
    if (NNW.win.style.display === 'none') NNW.recenter(1000)

    // if user hasn't yet accepted the "Safari risk"
    if (nn.browserInfo().name === 'Safari' && !utils._acceptSafari) {
      window.convo = new Convo(this.convos, 'safari')
      return
    }

    if (typeof this.getData('username') === 'string') {
      if (this.greeted) {
        window.convo = new Convo(this.convos, 'returning-student-after')
      } else {
        window.convo = new Convo(this.convos, 'returning-student-init')
      }
    } else {
      window.convo = new Convo(this.convos, 'first-time')
    }

    this.greeted = true
    this.convos = window.CONVOS[this.key](this)
  }

  checkForSavePoint () {
    const prevSketch = typeof this.getData('last-saved-sketch') === 'string'
    const ghuser = this.getData('owner')
    if (ghuser && prevSketch) {
      window.convo = new Convo(this.convos, 'prior-github-or-save-state')
    } else if (ghuser) {
      window.convo = new Convo(this.convos, 'prior-github-login')
    } else if (prevSketch) {
      window.convo = new Convo(this.convos, 'prior-save-state')
    } else {
      this.newSketch()
    }
  }

  makeUpName (e) {
    const postName = () => {
      setTimeout(() => {
        NNW.menu.switchFace('happy')
        this._explainName = `<i>${this._temp.a}</i> because you're on a ${this._temp.os} device; <i>${this._temp.b}</i> becuase you're using version ${this._temp.browser?.version} of the ${this._temp.browser?.name} browser;`
        if (this._temp.city) {
          this._explainName += ` <i>${this._temp.c}</i> because you're currently located in the city of ${this._temp.city};`
        }
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'made-up-name')
      }, 1000)
    }

    NNW.menu.switchFace('processing')
    const p = nn.platformInfo()
    const a = p.platform.substr(0, 3)
    const b = p.browser.name.toLowerCase().substr(0, 4)
    this._temp = { a, b, os: p.platform, browser: p.browser }
    this.setData('username', a + b)
    utils.get('./api/user-geo', (res) => {
      if (res.success && res.data.city) {
        this._temp.city = res.data.city
        const c = res.data.city.toLowerCase().substr(0, 4)
        this._temp.c = c
        this.setData('username', a + b + c)
        postName()
      } else postName()
    })
  }

  askAnLLM () {
    WIDGETS.load('ai-api-conduit', async (w) => {
      await w._createHTML('no-convo')
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'ask-llm')
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _init (cb) {
    if (!WIDGETS['coding-menu']) {
      setTimeout(() => this._init(), 100); return
    }

    if (window.localStorage.getItem('auto-update') === null) {
      this.setData('auto-update', 'true')
    }

    NNE.autoUpdate = (this.getData('auto-update') === 'true')
    NNE.wrap = !(typeof this.getData('wrap') === 'string' && this.getData('wrap') === 'false')

    if (!window.localStorage.getItem('chattiness')) {
      this.setData('chattiness', 'high')
    }

    if (!window.localStorage.getItem('nomotion')) this.setData('nomotion', 'false')
    if (utils.reduceMotion()) this.setData('nomotion', 'true')

    if (window.localStorage.getItem('theme') === null) {
      this.setData('theme', 'dark')
    }

    if (NNW.theme !== this.data.editor.theme) {
      NNW.theme = this.data.editor.theme || 'dark'
    }

    utils.get('/api/github/auth-status', (json) => this.initGitHubData(json))
  }

  _onOpen () {
    utils.get('/api/github/auth-status', (json) => {
      this.authStatus = json.success
      window.convo = new Convo(this.convos, 'open-widget-info')
      this._createHTML()
    })
  }

  _createHTML () {
    this.innerHTML = `
      <div class="student-session">
        <div style="width: 100%; margin-bottom: 27px;">
          <button class="pill-btn" name="reboot" style="align-self: flex-start;">Clear All My Data</button>
          <button class="pill-btn pill-btn--secondary" name="privacy-policy">View Privacy Policy</button>
        </div>
        <button class="pill-btn pill-btn--secondary" name="general-data">?</button>
        <div>
          name:
          <input id="name-input" value="${this.data.username}">
        </div>
        <div>
          editor theme:
          <input value="${this.data.editor.theme}" readonly="readonly">
        </div>
        <div>
          editor auto-update:
          <input value="${this.data.editor.autoUpdate}" readonly="readonly">
        </div>
        <div>
          editor line wrap:
          <input value="${this.data.editor.wrap}" readonly="readonly">
        </div>
        <div>
          netnet's chattiness:
          <input value="${this.data.editor.chattiness}" readonly="readonly">
        </div>
        <h2><span>Last Save Point</span> <button class="pill-btn pill-btn--secondary" name="last-save">?</button></h2>
        <div>
          netnet layout:
          <input  value="${this.data.lastSave.layout}" readonly="readonly">
        </div>
        <div>
          sketch code:
          <input value="${this.data.lastSave.sketch}" readonly="readonly">
        </div>
        <div>
          opened widgets:
          <input value="${
            this.data.lastSave.widgets
              ? this.data.lastSave.widgets.replace(/"/g, "'") : ''
          }" readonly="readonly">
        </div>
        <h2>
          <span>GitHub Data</span>
          <button class="pill-btn pill-btn--secondary" name="github">Sign-${this.authStatus ? 'Out of' : 'In to'} GitHub</button>
          <button class="pill-btn pill-btn--secondary" name="github-data">?</button>
        </h2>
        <div>
          username:
          <input  value="${this.data.github.owner}" readonly="readonly">
        </div>
        <div>
          repositories:
          <input  value="${this.data.github.repos}" readonly="readonly">
        </div>
        <h2>
          <span>LLM API Settings</span>
          <button class="pill-btn pill-btn--secondary" name="llm-data">?</button>
        </h2>
        <div>
          provider:
          <input value="${this.data.llm.provider || ''}" readonly="readonly">
        </div>
        <div>
          OpenAI key:
          <input type="password" value="${this.data.llm.keyOpenai || ''}" readonly="readonly">
        </div>
        <div>
          Anthropic key:
          <input type="password" value="${this.data.llm.keyAnthropic || ''}" readonly="readonly">
        </div>
        <div>
          OpenAI model:
          <input value="${this.data.llm.modelOpenai || ''}" readonly="readonly">
        </div>
        <div>
          Anthropic model:
          <input value="${this.data.llm.modelAnthropic || ''}" readonly="readonly">
        </div>
        <div>
          temperature:
          <input value="${this.data.llm.temperature || ''}" readonly="readonly">
        </div>
        <div>
          max tokens:
          <input value="${this.data.llm.maxTokens || ''}" readonly="readonly">
        </div>
      </div>
    `

    this.$('#name-input').addEventListener('change', (e) => {
      this.setData('username', e.target.value)
      this.convos = window.CONVOS[this.key](this)
    })

    this.$('button[name="github"]').addEventListener('click', () => {
      if (this.authStatus) this.chatGitHubLogout()
      else this.chatGitHubAuth()
    })

    this.$('button').forEach(b => b.addEventListener('click', (e) => {
      if (e.target.name === 'general-data') {
        window.convo = new Convo(this.convos, 'general-data-info')
      } else if (e.target.name === 'last-save') {
        window.convo = new Convo(this.convos, 'save-point-data-info')
      } else if (e.target.name === 'github-data') {
        window.convo = new Convo(this.convos, 'github-data-info')
      } else if (e.target.name === 'llm-data') {
        window.convo = new Convo(this.convos, 'llm-keys-data-info')
      }
    }))

    this.$('[name="privacy-policy"]').addEventListener('click', () => {
      WIDGETS.open('privacy-policy')
    })

    this.$('[name="reboot"]').addEventListener('click', () => {
      window.convo = new Convo(this.convos, 'reboot-session')
    })

    this.title = 'Your Session Data'
    this.ele.querySelector('.widget__top').style.padding = '0px 15px 0px'
    this.ele.querySelector('.widget__inner-html').style.padding = '10px 0px'
  }
}

window.StudentSession = StudentSession
