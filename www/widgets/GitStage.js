/* global Widget Convo WIDGETS utils, NNW */
class GitStage extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'git-stage'
    this.listed = false
    this.title = 'the Git "Stage"'
    this.data = {}

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('open', () => {
      this.update({ left: 20, top: 20 }, 500)
      const delay = utils.getVal('--menu-fades-time') + 100
      setTimeout(() => this.$('.git-stage-add').focus(), delay)
    })

    this._createHTML()
  }

  _createHTML () {
    this.innerHTML = `
      <style>
        .git-stage__title {
          cursor: pointer;
        }
        .git-stage__message {
          text-transform: uppercase;
        }
      </style>
      <div class="git-stage">
        <p>
          The following files have been changed since the last commit:&nbsp;
          <button name="info">?</button>
        </p>
        <div class="git-stage-list"></div>
        <button class="git-stage-add" style="float: right">add files</button>
      </div>
    `

    this.$('[name="info"]').addEventListener('click', () => {
      window.convo = new Convo(this.convos, 'info')
    })

    this.$('.git-stage-add').addEventListener('click', () => {
      this.addToStage()
    })
  }

  loadData (data, redirect) {
    if (window.CONVOS[this.key]) {
      this.convos = window.CONVOS[this.key](this)
    }
    this._redirect = redirect
    this.data = data

    if (Object.keys(data).length === 0) this.close()

    this.$('.git-stage-list').innerHTML = ''
    for (const path in data) {
      const div = document.createElement('div')
      div.innerHTML = `${path} <input type="checkbox" checked name="${path}">`
      this.$('.git-stage-list').appendChild(div)
    }
  }

  addToStage () {
    this.close()
    if (Object.keys(this.data).length === 0) return
    const msg = WIDGETS['student-session'].getData('last-commit-msg')
    if (msg === 'netnet initialized repo' || msg === 'Initial commit') {
      window.convo = new Convo(this.convos, 'first-original-commit')
    } else {
      window.convo = new Convo(this.convos, 'new-commit')
    }
  }

  pushChanges (message) {
    if (typeof message !== 'string') {
      return window.alert('GitStage: can not push changes without a commit message')
    }
    // move function menu _updateProject to here
    // update this._redirect when function menu's saveProject(redirect)

    WIDGETS['student-session'].clearSaveState()
    window.convo = new Convo(this.convos, 'pushing-updates')

    const staged = []
    for (const path in this.data) {
      if (this.$(`input[name="${path}"]`).checked) {
        const copyFile = JSON.parse(JSON.stringify(this.data[path]))
        copyFile.code = utils.atob(copyFile.code)
        staged.push(copyFile)
      }
    }

    const data = {
      owner: WIDGETS['student-session'].getData('owner'),
      repo: WIDGETS['student-session'].getData('opened-project'),
      branch: WIDGETS['student-session'].getData('branch'),
      message: message,
      files: staged
    }
    utils.post('./api/github/save-project', data, (res) => {
      if (!res.success) {
        console.log('GitStage:', res)
        window.convo = new Convo(this.convos, 'oh-no-error')
      } else {
        NNW.menu.switchFace('default')
        // if user was redirected to save te project while trying
        // to create 'new-project' or 'open-project' && decided to
        // save the currently open project before doing so
        if (this._redirect) {
          WIDGETS['student-session'].clearProjectData()
          this.convos = window.CONVOS['functions-menu'](WIDGETS['functions-menu'])
          window.convo = new Convo(this.convos, this._redirect)
          this._redirect = false
        } else { // if user clicked saveProject()
          WIDGETS['files-and-folders'].updateDict(staged)
          WIDGETS['student-session'].setProjectData({ message })
          window.convo = new Convo(this.convos, 'project-saved')
        }
      }
    })
  }
}

window.GitStage = GitStage
