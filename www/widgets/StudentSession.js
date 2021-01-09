/* global Convo, Widget, WIDGETS, NNE, NNW, Averigua, utils */
class StudentSession extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'student-session'
    this.listed = true
    this.keywords = ['login', 'logout', 'session', 'user', 'account', 'me', 'my', 'data']

    this.title = 'Your Session Data'
    this.greeted = false

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('open', () => this._onOpen())

    this._init()
    this._createHTML()
  }

  get data () {
    const ls = window.localStorage
    const data = {
      username: ls.getItem('username'),
      editor: {
        autoUpdate: ls.getItem('auto-update'),
        theme: ls.getItem('theme')
      },
      github: {
        owner: ls.getItem('owner'),
        repos: ls.getItem('repos'),
        openedProject: ls.getItem('opened-project'),
        projectURL: ls.getItem('project-url'),
        indexSha: ls.getItem('index-sha'),
        lastCommitMsg: ls.getItem('last-commit-msg'),
        lastCommitCode: ls.getItem('last-commit-code')
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
      }
    } else return this.data
  }

  setData (type, value) {
    if (!value) window.localStorage.removeItem(type)
    else window.localStorage.setItem(type, value)
    this._createHTML()
    return this.data
  }

  setSavePoint () {
    const wigs = WIDGETS.list()
      .filter(w => w.opened)
      .map(w => { return { key: w.key, top: w.top, left: w.left, zIndex: w.zIndex } })
    window.localStorage.setItem('last-saved-sketch', NNE.code)
    window.localStorage.setItem('last-saved-layout', NNW.layout)
    window.localStorage.setItem('last-saved-widgets', JSON.stringify(wigs))
  }

  restoreSavePoint () {
    NNE.code = window.localStorage.getItem('last-saved-sketch')
    setTimeout(() => { NNE.cm.refresh() }, 10)
    NNW.layout = window.localStorage.getItem('last-saved-layout')
    const wigs = JSON.parse(window.localStorage.getItem('last-saved-widgets'))
    wigs.forEach(w => {
      WIDGETS.open(w.key, null, (widget) => {
        widget.update({ left: w.left, top: w.top, zIndex: w.zIndex }, 500)
      })
    })
  }

  setProjectData (data) {
    const ls = window.localStorage
    // TODO: will need to update mutli-file-widget if/when we make that widget
    if (data.name) ls.setItem('opened-project', data.name)
    if (data.message) ls.setItem('last-commit-msg', data.message)
    if (data.sha) ls.setItem('index-sha', data.sha)
    if (data.url) ls.setItem('project-url', data.url)
    if (data.code) {
      // for some reason GitHub adds a '\n' at the end of the base64 string?
      const c = (data.code.indexOf('\n') === data.code.length - 1)
        ? data.code.substr(0, data.code.length - 1) : data.code
      ls.setItem('last-commit-code', c)
    }
  }

  clearProjectData () {
    window.localStorage.removeItem('opened-project')
    window.localStorage.removeItem('last-commit-msg')
    window.localStorage.removeItem('last-commit-code')
    window.localStorage.removeItem('index-sha')
    window.localStorage.removeItem('project-url')
    NNE.addCustomRoot(null)
  }

  clearAllData () {
    window.localStorage.clear()
    this._init()
    this.deleteGitHubSession()
  }

  deleteGitHubSession () {
    utils.get('./api/github/clear-cookie', (res) => {
      this.clearProjectData()
      console.log(res)
      // TODO: message confirming + explaining
    })
  }

  authGitHubSession () {
    // TODO...
    window.convo = new Convo(this.convos, 'coming-soon')
  }

  updateRoot () {
    const owner = window.localStorage.getItem('owner')
    const repo = window.localStorage.getItem('opened-project')
    if (owner && repo) {
      // TODO: address master v main change
      const path = `https://raw.githubusercontent.com/${owner}/${repo}/main/`
      NNE.addCustomRoot(path)
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
    if (typeof this.getData('last-saved-sketch') === 'string') {
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
    const p = Averigua.platformInfo()
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
    const bool = (this.getData('auto-update') === 'true')
    WIDGETS['functions-menu'].autoUpdate(bool)

    if (window.localStorage.getItem('theme') === null) {
      this.setData('theme', 'dark')
    }
    NNW.theme = this.data.editor.theme || 'dark'
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
      <style>
        .student-session {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          max-height: 400px;
          padding: 0px 15px;
          overflow-y: scroll;
          scrollbar-color: var(--netizen-meta) rgba(0,0,0,0);
          scrollbar-width: thin;
        }
        .student-session input {
          background-color: var(--netizen-meta);
          font-family: monospace;
          color: var(--netizen-hint-color);
          padding: 6px;
          border: none;
          margin: 6px;
          width: 250px;
          border-radius: 5px;
        }
        .student-session input[readonly] {
          opacity: 0.5
        }

        .student-session h2 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          margin-top: 42px;
        }
      </style>
      <div class="student-session">
        <button name="general-data">?</button>
        <div>
          name:
          <input value="${this.data.username}">
        </div>
        <div>
          editor theme:
          <input value="${this.data.editor.theme}" readonly="readonly">
        </div>
        <div>
          editor auto-update:
          <input value="${this.data.editor.autoUpdate}" readonly="readonly">
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
          <input value="${this.data.lastSave.widgets}" readonly="readonly">
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
          project url:
          <input  value="${this.data.github.projectURL}" readonly="readonly">
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

    this.$('button[name="github"]').addEventListener('click', () => {
      if (this.authStatus) this.deleteGitHubSession()
      else this.authGitHubSession()
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

    this.title = 'Your Session Data'
    this.ele.style.padding = '5px 5px 10px'
    this.ele.querySelector('.w-top-bar').style.padding = '0px 15px 0px'
    this.ele.querySelector('.w-innerHTML').style.padding = '10px 0px'

    // this.$('.student-session__title')
    //   .addEventListener('click', () => this._ranColor())
  }
}

window.StudentSession = StudentSession
