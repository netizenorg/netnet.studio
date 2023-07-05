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

    this._init()
    this._createHTML()
  }

  get data () {
    const ls = window.localStorage
    const ss = window.sessionStorage
    const data = {
      username: ls.getItem('username'),
      editor: {
        autoUpdate: ls.getItem('auto-update'),
        wrap: ls.getItem('wrap'),
        chattiness: ls.getItem('chattiness'),
        theme: ls.getItem('theme')
      },
      github: {
        owner: ls.getItem('owner'),
        repos: ls.getItem('repos'),
        openedProject: ss.getItem('opened-project'),
        projectURL: ss.getItem('project-url'),
        branch: ss.getItem('branch'),
        indexSha: ss.getItem('index-sha'),
        lastCommitMsg: ss.getItem('last-commit-msg'),
        lastCommitCode: ss.getItem('last-commit-code'),
        ghpages: ss.getItem('ghpages')
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
    if (type) {
      if (Object.keys(this.data).includes(type)) return this.data[type]
      else if (Object.keys(window.localStorage).includes(type)) {
        return window.localStorage.getItem(type)
      } else if (Object.keys(window.sessionStorage).includes(type)) {
        return window.sessionStorage.getItem(type)
      }
    } else return this.data
  }

  setData (type, value) {
    const sesh = [
      'opened-project', 'project-url', 'branch', 'index-sha', 'last-commit-msg', 'last-commit-code', 'ghpages'
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

  restoreSavePoint () {
    const code = window.localStorage.getItem('last-saved-sketch').substr(6)
    const decoded = NNE._decode(code)
    NNE.code = decoded
    this.code = decoded
    setTimeout(() => { NNE.cm.refresh() }, 10)
    NNW.layout = window.localStorage.getItem('last-saved-layout')
    const wigs = JSON.parse(window.localStorage.getItem('last-saved-widgets'))
    wigs.forEach(w => {
      WIDGETS.open(w.key, widget => {
        widget.update({ left: w.left, top: w.top, zIndex: w.zIndex }, 500)
      })
    })
  }

  setProjectData (data) {
    const ss = window.sessionStorage
    // TODO: will need to update mutli-file-widget if/when we make that widget
    if (data.name) ss.setItem('opened-project', data.name)
    if (data.message) ss.setItem('last-commit-msg', data.message)
    if (data.sha) ss.setItem('index-sha', data.sha)
    if (data.url) ss.setItem('project-url', data.url)
    if (data.ghpages) ss.setItem('ghpages', data.ghpages)
    if (data.branch) ss.setItem('branch', data.branch)
    if (data.code) ss.setItem('last-commit-code', data.code)
    this._createHTML()
  }

  clearProjectData () {
    const ss = window.sessionStorage
    ss.removeItem('opened-project')
    ss.removeItem('last-commit-msg')
    ss.removeItem('last-commit-code')
    ss.removeItem('index-sha')
    ss.removeItem('project-url')
    ss.removeItem('ghpages')
    ss.removeItem('branch')
    NNE.addCustomRoot(null)
    if (WIDGETS['project-files']) WIDGETS['project-files'].updateFiles([])
    this._createHTML()
  }

  clearAllData () {
    window.localStorage.clear()
    window.sessionStorage.clear()
    this._init()
    this.deleteGitHubSession()
    this.greetStudent()
  }

  chatGitHubLogout () {
    window.convo = new Convo(this.convos, 'github-logout')
  }

  deleteGitHubSession () {
    utils.get('./api/github/clear-cookie', (res) => {
      this.authStatus = false
      if (this.getData('opened-project')) {
        NNE.code = ''
        NNW.updateTitleBar(null)
      }
      this.clearProjectData()
      this.setData('owner', null)
      this.setData('repos', null)
      this._createHTML()
      WIDGETS['functions-menu'].gitHubUpdated(false)
      window.convo = new Convo(this.convos, 'logged-out-of-gh')
    })
  }

  chatGitHubAuth () {
    window.convo = new Convo(this.convos, 'github-auth')
  }

  authGitHubSession () {
    const temp = `#code/${NNE._encode('<h1>Hello World Wide Web</h1>')}`
    const code = (utils.btoa(NNE.code) === utils.starterCodeB64)
      ? temp : NNE.generateHash()
    if (NNE._root && NNE._root.includes('.com')) {
      // if gitHub url in root
      window.localStorage.setItem('gh-auth-temp-code', NNE._root)
    } else window.localStorage.setItem('gh-auth-temp-code', code)
    utils.get('api/github/client-id', (json) => {
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
        WIDGETS['functions-menu'].gitHubUpdated(true)
      })
      utils.get('/api/github/saved-projects', (json) => {
        if (!json.data) return
        const names = json.data.map(o => o.name)
        this.setData('repos', names.join(', '))
        WIDGETS['functions-menu'].gitHubProjectsUpdated()
      })
    } else {
      this.authStatus = false
      WIDGETS['functions-menu'].gitHubUpdated(false)
    }
  }

  updateRoot () {
    const owner = window.localStorage.getItem('owner')
    const repo = window.sessionStorage.getItem('opened-project')
    const main = window.sessionStorage.getItem('branch')
    if (owner && repo) {
      const base = `https://raw.githubusercontent.com/${owner}/${repo}/${main}/`
      const proto = window.location.protocol
      const host = window.location.host
      const proxy = `${proto}//${host}/api/github/proxy?url=${base}/`
      NNE.addCustomRoot({ base, proxy })
    } else {
      NNE.addCustomRoot(null)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  greetStudent () {
    if (!this.convos) {
      setTimeout(() => this.greetStudent(), 100)
      return
    }

    // if netnet was hiding, let's center+display it
    if (NNW.win.style.display === 'none') NNW.recenter(1000)

    if (typeof this.getData('username') === 'string') {
      window.convo = new Convo(this.convos, 'returning-student')
    } else {
      window.convo = new Convo(this.convos, 'first-time')
    }

    this.greeted = true
    this.convos = window.CONVOS[this.key](this)
  }

  checkForSavePoint () {
    if (typeof this.getData('opened-project') === 'string') {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'prior-opened-project')
    } else if (typeof this.getData('last-saved-sketch') === 'string') {
      window.convo = new Convo(this.convos, 'prior-save-state')
    } else {
      WIDGETS['functions-menu'].newSketch()
    }
  }

  makeUpName (e) {
    const postName = () => {
      setTimeout(() => {
        NNW.menu.switchFace('happy')
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

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _init () {
    if (!WIDGETS['functions-menu']) {
      setTimeout(() => this._init(), 100); return
    }

    if (window.localStorage.getItem('auto-update') === null) {
      this.setData('auto-update', 'true')
    }

    NNE.autoUpdate = (this.getData('auto-update') === 'true')
    NNE.wrap = (this.getData('wrap') === 'true')

    if (!window.localStorage.getItem('chattiness')) {
      this.setData('chattiness', 'high')
    }

    if (window.localStorage.getItem('theme') === null) {
      this.setData('theme', 'dark')
    }
    NNW.theme = this.data.editor.theme || 'dark'

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
        <button name="reboot" style="align-self: flex-start;">Clear All My Data</button>
        <button name="general-data">?</button>
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
        <h2><span>Last Save Point</span> <button name="last-save">?</button></h2>
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
        <h2><span>GitHub Data</span> <button name="github-data">?</button></h2>
        <div>
          username:
          <input  value="${this.data.github.owner}" readonly="readonly">
        </div>
        <div>
          repositories:
          <input  value="${this.data.github.repos}" readonly="readonly">
        </div>
        <div>
          opened project:
          <input  value="${this.data.github.openedProject}" readonly="readonly">
        </div>
        <div>
          branch:
          <input  value="${this.data.github.branch}" readonly="readonly">
        </div>
        <div>
          project url:
          <input  value="${this.data.github.projectURL}" readonly="readonly">
        </div>
        <div>
          hosted url:
          <input  value="${this.data.github.ghpages}" readonly="readonly">
        </div>
        <div>
          last commit code:
          <input  value="${this.data.github.lastCommitCode}" readonly="readonly">
        </div>
        <div>
          last commit message:
          <input  value="${this.data.github.lastCommitMsg}" readonly="readonly">
        </div>
        <div>
          index sha:
          <input  value="${this.data.github.indexSha}" readonly="readonly">
        </div>
        <button name="github">Sign-${this.authStatus ? 'Out of' : 'In to'} GitHub</button>
        <hr>
        <div name="privacy-policy" style="align-self: center; cursor: pointer;">Privacy Policy</div>
      </div>

      <!-- TODO: add SIGNOUT of GitHub button -->
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
      }
    }))

    this.$('div[name="privacy-policy"]').addEventListener('click', () => {
      utils.openPrivacyPolicy()
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
