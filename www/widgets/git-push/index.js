/* global Widget, Convo, WIDGETS, NNW, nn, utils */
class GitPush extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'git-push'
    this.keywords = ['git', 'github', 'push', 'version', 'upload', 'publish', 'repo', 'repository']

    this.title = 'Version Control <span style="opacity:0.5;padding-left:10px;">(BETA 0.1)</span>'
    this.width = 680

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('open', () => {
      const op = WIDGETS['student-session'].getData('opened-project')
      const ch = WIDGETS['project-files']?.changes
      if (op && ch.length > 0) window.convo = new Convo(this.convos, 'start-ready')
      else if (op) window.convo = new Convo(this.convos, 'start-not-ready2')
      else window.convo = new Convo(this.convos, 'start-not-ready')
    })

    this.steps = this._createSteps()
    this.include = []
    this._commitMessage = ''

    this._createHTML()
  }

  _createHTML () {
    const chgs = WIDGETS['project-files']?.changes
    const user = WIDGETS['student-session'].getData('owner')
    const proj = WIDGETS['student-session'].getData('opened-project')

    if (!proj) {
      this.innerHTML = `
        <div class="git-push-widget">
          <p>This widget is used along side the <span class="link" onclick="WIDGETS.open('project-files')">Project Files</span> widget to "version" your changes. When working on a "project" the changes you make and save are stored in your browser temporarily. In order to save these changes permanently you'll need to "push" them GitHub, which is what this widget is for.</p>
        </div>
      `
      return
    } else if (proj && chgs.length === 0) {
      this.innerHTML = `
        <div class="git-push-widget">
          <section>
            <div class="git-push-widget__terminal">
              <span class="git-push-widget__prompt">${user}@netnet</span>:<span class="git-push-widget__path">${proj}</span>$
              <span class="git-push-widget__cli">${this.steps.status.cli}</span>
              <div>
                <button class="pill-btn pill-btn--secondary" name="run">run</button>
                <button class="pill-btn pill-btn--secondary" name="back" style="opacity:0.25">back</button>
              </div>
            </div>
            <div class="git-push-widget__info">
              Running <code>git status</code> in the terminal will list all the files which have changed since your last commit. However, when nothing has changed it will just output:<br>
              <code style="padding-left: 10px">nothing to commit, working tree clean</code>
            </div>
          </section>
        </div>
      `
      this.$('.git-push-widget__terminal button[name="run"]').onclick = () => {
        window.convo = new Convo(this.convos, 'pre-stage')
      }
      return
    }

    this.innerHTML = `
      <div class="git-push-widget">
        <section>
          <div class="git-push-widget__terminal">
            <span class="git-push-widget__prompt">${user}@netnet</span>:<span class="git-push-widget__path">${proj}</span>$
            <span class="git-push-widget__cli">${this.steps.status.cli}</span>
            <div>
              <button class="pill-btn pill-btn--secondary" name="run">run</button>
              <button class="pill-btn pill-btn--secondary" name="back" style="opacity:0.25">back</button>
            </div>
          </div>
          <div class="git-push-widget__info">
            ${this.steps.status.info()}
          </div>
        </section>
      </div>
    `
    this.$('button[name="run"]').onclick = () => this.steps.status.next()
    utils.afterLayoutTransition(() => this.$('button[name="run"]').focus())
  }

  _nextCmd (key) {
    const obj = this.steps[key]
    this.$('.git-push-widget__cli').innerHTML = obj.cli
    this.$('.git-push-widget__info').innerHTML = obj.info()
    window.convo = new Convo(this.convos, obj.convo)
    this.$('button[name="run"]').innerHTML = obj.btn || 'run'
    this.$('button[name="run"]').onclick = () => obj.next()
    const o = (key === 'finished' || key === 'status') ? 0.25 : 1
    this.$('button[name="back"]').style.opacity = o
    this.$('button[name="back"]').onclick = () => obj.back()
    utils.afterLayoutTransition(() => {
      if (obj.btn === 'edit') nn.get('text-bubble input').focus()
      else this.$('button[name="run"]').focus()
    })
  }

  _createSteps () {
    return {
      status: {
        cli: 'git status',
        convo: 'start-ready',
        info: () => {
          return 'Running <code>git status</code> in the terminal will list all the files which have changed since your last commit.'
        },
        next: () => this._nextCmd('stage')
      },
      stage: {
        cli: 'git add ...',
        convo: 'git-stage',
        info: () => {
          const clr = { create: 'var(--netizen-attribute)', update: 'var(--netizen-number)', delete: 'red' }
          let str = 'Choose which of the changes below to "stage" in this commit. I will replace the <code>...</code> in the terminal above with the changes you\'ve selected.<br>'
          WIDGETS['project-files'].changes.forEach((c, i) => {
            str += `
              <span class="git-state-item" style="color:${clr[c.action]}" data-index="${i}">
                <input type="checkbox" checked="true"> ${c.path}
              </span>
            `
          })
          return str
        },
        next: () => {
          const spans = this.$('.git-state-item')
          const list = spans instanceof window.NodeList ? Array.from(spans) : [spans]
          this.include = list
            .filter(s => s.children[0].checked)
            .map(s => WIDGETS['project-files'].changes[Number(s.dataset.index)])
          this.convos = window.CONVOS[this.key](this)
          if (this.include.length <= 0) {
            window.convo = new Convo(this.convos, 'empty-stage')
          } else this._nextCmd('commit')
        },
        back: () => this._nextCmd('status')
      },
      commit: {
        cli: 'git commit -m "..."',
        convo: 'git-commit',
        btn: 'edit',
        info: () => {
          const owner = WIDGETS['student-session'].getData('owner')
          const op = WIDGETS['student-session'].getData('opened-project')
          return `Creating a "commit" generates something like a save-point in your git history. Each commit is a point in the <a href="https://github.com/${owner}/${op}/network" target="_blank">timeline</a> of your project's evolution, containing the changes made as well as the date, time and message you enter with netnet.`
        },
        next: () => {
          if (!this._commitMessage) {
            window.convo = new Convo(this.convos, 'git-commit')
          } else this._nextCmd('push')
        },
        back: () => this._nextCmd('stage')
      },
      push: {
        cli: 'git push',
        convo: 'git-push',
        info: () => {
          const owner = WIDGETS['student-session'].getData('owner')
          const op = WIDGETS['student-session'].getData('opened-project')
          return `Pushing this commit to your <a href="https://github.com/${owner}/${op}" target="_blank">GitHub repo</a> perminantly adds it to your project's <a href="https://github.com/${owner}/${op}/network" target="_blank">timeline</a> and stores your progress there so the next time you come back to netnet.studio you can pick up where you left off.`
        },
        next: () => {
          const owner = WIDGETS['student-session'].getData('owner')
          const repo = WIDGETS['student-session'].getData('opened-project')
          const branch = WIDGETS['student-session'].getData('branch')
          const commitMessage = this._commitMessage
          const changes = this.include
          nn.get('load-curtain').show('folder.html', { filename: repo })
          const data = { owner, repo, branch, commitMessage, changes }
          window.utils.post('/api/github/push', data, async (json) => {
            if (json.success) {
              const changes = await WIDGETS['project-files'].resetChanges()
              WIDGETS['project-files']._updateFilesGUI(changes)
              nn.get('load-curtain').hide()
              this._nextCmd('finished')
            } else {
              console.log('GIT SERVER ERROR:', json)
              const face = { leftEye: 'ŏ', mouth: '︵', rightEye: 'ŏ', lookAtCursor: false }
              NNW.menu.updateFace(face)
            }
          })
        },
        back: () => this._nextCmd('commit')
      },
      finished: {
        cli: '',
        convo: 'git-updated',
        info: () => {
          const owner = WIDGETS['student-session'].getData('owner')
          const op = WIDGETS['student-session'].getData('opened-project')
          return `Your <a href="https://github.com/${owner}/${op}" target="_blank">GitHub repo</a> has been updated with your new commit, it is now part of your project's timeline or "<a href="https://github.com/${owner}/${op}/network" target="_blank">version hisotry</a>". To publish your project on the World Wide Web, open the <b>Coding Menu > my code > share</b>, if you previously published your project you do not need to republish it, it will update automaticlly (You can <a href="https://github.com/${WIDGETS['student-session'].getData('owner')}/${WIDGETS['student-session'].getData('opened-project')}/actions" target="_blank">view the deployment progress here</a>). Feel free to also <span class="link" onclick="WIDGETS['git-push'].downloadProject()">download</span> a backup copy of the current stage of your project.`
        },
        next: () => {
          this.include = []
          this._commitMessage = ''
          this._createHTML()
        }
      }
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

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

  // here's an example of a "private" method
  _startConvo () {
    // this is referencing a convo key from the convo.js file
    window.convo = new Convo(this.convos, 'start')
  }
}

window.GitPush = GitPush
