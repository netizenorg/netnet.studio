/* global Widget, Convo, WIDGETS, nn, utils */
class GitPush extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'git-push'
    this.keywords = ['git', 'github', 'push', 'version', 'upload', 'publish', 'repo', 'repository']

    this.title = 'Version Control <span style="opacity:0.5;padding-left:10px;">(BETA 1.1)</span>'
    this.width = 680

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('open', () => {
      const op = WIDGETS['project-files']?.projectData.name
      const ch = WIDGETS['project-files']?.changes
      if (op && ch.length > 0) window.convo = new Convo(this.convos, 'start-ready')
      else if (op) window.convo = new Convo(this.convos, 'start-not-ready2')
      else window.convo = new Convo(this.convos, 'start-not-ready')
      this.$('button[name="run"]').focus()
      utils.afterLayoutTransition(() => this.$('button[name="run"]').focus())
    })

    this.steps = this._createSteps()
    this.include = []
    this._commitMessage = ''

    this._createHTML()
  }

  _createHTML () {
    const chgs = WIDGETS['project-files']?.changes
    const user = WIDGETS['student-session'].getData('owner')
    const proj = WIDGETS['project-files']?.projectData.name

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
      if (obj.btn === 'edit') { // commit message bubble
        nn.get('text-bubble input').on('keydown', (e) => {
          if (e.key === 'Enter') this._updateCommitMessage(window.convo)
        }).focus()
      } else this.$('button[name="run"]').focus()
    })
  }

  // runs after every successful push. If the student got here by choosing
  // "push first" out of a pull conflict, offer to pick the pull back up
  // now that their local changes are safely on GitHub.
  _finishPush () {
    this._nextCmd('finished')
    if (WIDGETS['project-files']._resumePullAfterPush) {
      WIDGETS['project-files']._resumePullAfterPush = false
      window.convo = new Convo(this.convos, 'pushed-now-pull')
    }
    // if web-publish is already open, rerun status indicator
    if (WIDGETS['web-publish']?.opened) WIDGETS['web-publish']._refreshStatus()
  }

  _updateCommitMessage (e) {
    const v = nn.get('text-bubble input').value
    if (v.length < 1) e.goTo('message-too-short')
    else if (v.length > 72) e.goTo('message-too-long')
    else {
      this._commitMessage = v
      this.$('button[name="run"]').innerHTML = 'run'
      this.$('.git-push-widget__cli').innerHTML = `git commit -m "${v}"`
      e.goTo('git-commit2')
      utils.afterLayoutTransition(() => this.$('button[name="run"]').focus())
    }
  }

  _pushPayloadTooLarge (changes, convoId) {
    // if server.js limit for /api/github/push ever changes (currently 50mb),
    // update MAX_PUSH_MB to match (keeping a few MB of headroom below it)
    const MAX_PUSH_MB = 45
    const bytes = changes.reduce((sum, c) => sum + (c.content ? c.content.length : 0), 0)
    if (bytes <= MAX_PUSH_MB * 1024 * 1024) return false
    this.pushSizeMB = Math.round(bytes / 1024 / 1024)
    nn.get('load-curtain').hide()
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, convoId)
    return true
  }

  async _autoCommit () {
    // similar to on-open logic (update if that changes)
    const op = WIDGETS['project-files']?.projectData.name
    const ch = WIDGETS['project-files']?.changes
    if (op && ch.length === 0) {
      window.convo = new Convo(this.convos, 'start-not-ready2')
      return
    } else if (!op) {
      window.convo = new Convo(this.convos, 'start-not-ready')
      return
    }
    // similar to 'git push' logic (update if that chaanges)
    const owner = WIDGETS['student-session'].getData('owner')
    const repo = WIDGETS['project-files']?.projectData.name
    const branch = WIDGETS['project-files']?.projectData.branch
    const commitMessage = '( ◕ ◞ ◕ ) auto commit'
    nn.get('load-curtain').show('github.html', { filename: repo })
    // hydrate at push-time so we only base64 the binaries we're sending
    const changes = await WIDGETS['project-files'].hydrateChanges(
      WIDGETS['project-files'].changes
    )
    if (this._pushPayloadTooLarge(changes, 'payload-too-large-auto')) return
    const data = { owner, repo, branch, commitMessage, changes }
    window.utils.post('/api/github/push', data, async (json) => {
      this.convos = window.CONVOS[this.key](this)
      try {
        if (json.success) {
          const changes = await WIDGETS['project-files'].resetChanges(undefined, json.shas)
          WIDGETS['project-files']._updateFilesGUI(changes)
          this._finishPush()
        } else {
          console.log('GIT SERVER ERROR:', json)
          window.convo = new Convo(this.convos, 'oh-no-error')
        }
      } catch (err) {
        console.error('GitPush: error after push response:', err)
        window.convo = new Convo(this.convos, 'oh-no-error')
      } finally {
        nn.get('load-curtain').hide()
      }
    }, 180000)
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
        next: async () => {
          const owner = WIDGETS['student-session'].getData('owner')
          const repo = WIDGETS['project-files']?.projectData.name
          const branch = WIDGETS['project-files']?.projectData.branch
          const commitMessage = this._commitMessage
          nn.get('load-curtain').show('github.html', { filename: repo })
          // hydrate at push-time only — base64-encode just the staged
          // binaries instead of every binary in the project on every save.
          const changes = await WIDGETS['project-files'].hydrateChanges(this.include)
          if (this._pushPayloadTooLarge(changes, 'payload-too-large')) return
          const data = { owner, repo, branch, commitMessage, changes }
          window.utils.post('/api/github/push', data, async (json) => {
            this.convos = window.CONVOS[this.key](this)
            try {
              if (json.success) {
                // pass the staged subset so unstaged files keep their pre-push
                // baseline and their unpushed changes remain visible.
                const changes = await WIDGETS['project-files'].resetChanges(this.include, json.shas)
                WIDGETS['project-files']._updateFilesGUI(changes)
                this._finishPush()
              } else {
                console.log('GIT SERVER ERROR:', json)
                window.convo = new Convo(this.convos, 'oh-no-error')
              }
            } catch (err) {
              console.error('GitPush: error after push response:', err)
              window.convo = new Convo(this.convos, 'oh-no-error')
            } finally {
              nn.get('load-curtain').hide()
            }
          }, 180000)
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

  downloadProject () {
    const p = WIDGETS['project-files']?.projectData.name
    const o = WIDGETS['student-session'].getData('owner')
    const b = WIDGETS['project-files']?.projectData.branch
    const url = `https://github.com/${o}/${p}/archive/refs/heads/${b}.zip`
    const a = document.createElement('a')
    a.setAttribute('download', 'index.html')
    a.setAttribute('href', url)
    a.setAttribute('target', '_blank')
    a.setAttribute('rel', 'noopener noreferrer')
    a.click()
    a.remove()
  }
}

window.GitPush = GitPush
