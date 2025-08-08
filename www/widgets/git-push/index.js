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
            ${this.steps.status.info ? this.steps.status.info() : ''}
          </div>
        </section>
      </div>
    `
    this.$('button[name="run"]').onclick = () => this.steps.status.next()
    utils.afterLayoutTransition(() => this.$('button[name="run"]').focus())
  }

  _nextCmd (key) {
    const obj = this.steps[key]
    window.convo = new Convo(this.convos, obj.convo)
    // update widget HTML
    this.$('.git-push-widget__cli').innerHTML = obj.cli
    if (obj.info) this.$('.git-push-widget__info').innerHTML = obj.info()
    else this.$('.git-push-widget__info').innerHTML = ''
    // setup back button
    const o = (key === 'finished' || key === 'status') ? 0.25 : 1
    this.$('button[name="back"]').style.opacity = o
    this.$('button[name="back"]').onclick = () => obj.back()
    // setup run button
    this.$('button[name="run"]').innerHTML = obj.btn || 'run'
    this.$('button[name="run"]').onclick = () => obj.next()
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
        next: () => this._nextCmd('stage')
      },
      stage: {
        cli: 'git add <span style="opacity:0.5">&lt;selected files below&gt;<span>',
        convo: 'git-stage',
        info: () => {
          const clr = { create: 'var(--netizen-attribute)', update: 'var(--netizen-number)', delete: 'red' }
          let str = ''
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
        next: () => {
          const owner = WIDGETS['student-session'].getData('owner')
          const repo = WIDGETS['student-session'].getData('opened-project')
          const branch = WIDGETS['student-session'].getData('branch')
          const commitMessage = this._commitMessage
          const changes = this.include
          nn.get('load-curtain').show('github.html', { filename: repo })
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
}

window.GitPush = GitPush
