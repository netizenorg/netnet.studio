/* global Widget, Convo, WIDGETS, nn, utils, QRious */
class WebPublish extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'web-publish'
    this.keywords = ['publish', 'ghpages', 'server', 'host', 'deploy', 'domain', 'web']
    this.title = 'Web Publish'
    this.width = 480

    this.pagesData = null // raw GitHub Pages API response, only set once enabled
    this._pollTimer = null
    this.qrcode = null

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this._createHTML()

    this.on('open', () => this._refreshStatus())
    this.on('close', () => this._stopPolling())
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. GUI methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML () {
    this.innerHTML = `
      <div class="web-publish">
        <div class="web-publish__not-published">
          <p>Publish your project to the Web using <a href="https://pages.github.com/" target="_blank">GitHub Pages</a>. This generates a public URL for your site. Once published, every time you "push" updates they'll automatically go live within a few minutes.</p>
          <br>
          <button class="pill-btn" name="publish">publish to the web</button>
        </div>
        <div class="web-publish__published">
          <button class="pill-btn pill-btn--secondary" name="pub-info" style="float: right; position: relative; z-index: 2;">?</button>
          <div class="web-publish__section">
            <label>published URL</label>
            <div class="web-publish__row">
              <button class="web-publish__qr-btn" name="qr-btn" title="show QR code">
                <span class="web-publish__qr-icon"></span>
              </button>
              <a href="#" target="_blank" name="published-url" class="web-publish__url"></a>
              <a href="#" target="_blank" name="status" class="web-publish__status" title="view deployment log"></a>
            </div>
            <div name="pub-qr-code" class="web-publish__qr-code"></div>
          </div>
          <div class="web-publish__section web-publish__domain-section">
            <label>custom domain setup</label>
            <div class="web-publish__row">
              <input type="text" name="domain-input" placeholder="yourdomain.com">
              <button class="pill-btn pill-btn--secondary" name="save-domain">save</button>
            </div>
            <div class="web-publish__row">
              <span class="link" name="remove-domain" style="display:none">remove custom domain</span>
              <a href="#" target="_blank" name="ghpages-settings" class="link" style="display:none">ghpages settings</a>
            </div>
          </div>
        </div>
      </div>
    `
    this.$('[name="publish"]').addEventListener('click', () => this.publish())
    this.$('[name="save-domain"]').addEventListener('click', () => this.saveDomain())
    this.$('[name="remove-domain"]').addEventListener('click', () => this.removeDomain())
    this.$('[name="domain-input"]').addEventListener('focus', () => {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'domain-input-focus')
    })
    this.$('[name="pub-info"]').addEventListener('click', () => {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'pub-info')
    })

    this.$('[name="qr-btn"]').addEventListener('click', () => this._toggleQRCode())

    const qrIcon = this.$('.web-publish__qr-icon')
    utils.get('/assets/images/icons/qr-code.svg', (svg) => {
      if (typeof svg === 'string') qrIcon.innerHTML = svg
    }, true)
  }

  _render () {
    const enabled = !!this.pagesData
    this.$('.web-publish__not-published').style.display = enabled ? 'none' : 'block'
    this.$('.web-publish__published').style.display = enabled ? 'block' : 'none'
    if (!enabled) {
      this.$('[name="pub-qr-code"]').style.display = 'none'
      this.qrcode = null
      return
    }

    const owner = WIDGETS['student-session'].getData('owner')
    const repo = WIDGETS['project-files']?.projectData.name
    const url = this.pagesData.html_url
    const status = this.pagesData.status || 'building'

    const urlLink = this.$('[name="published-url"]')
    urlLink.href = url
    urlLink.textContent = url
    if (this.qrcode) this.qrcode.value = url

    const statusLabels = {
      building: 'building…',
      queued: 'building…',
      built: 'live',
      errored: 'build failed'
    }
    const resolvedStatus = (!status || status === 'built') ? 'built' : status
    const statusEl = this.$('[name="status"]')
    statusEl.textContent = statusLabels[resolvedStatus] || 'building…'
    statusEl.dataset.status = (resolvedStatus === 'built' || resolvedStatus === 'errored') ? resolvedStatus : 'building'
    statusEl.href = `https://github.com/${owner}/${repo}/actions`

    this.$('[name="ghpages-settings"]').href = `https://github.com/${owner}/${repo}/settings/pages`

    const domainInput = this.$('[name="domain-input"]')
    if (document.activeElement !== domainInput) domainInput.value = this.pagesData.cname || ''

    const hasCname = !!this.pagesData.cname
    this.$('[name="remove-domain"]').style.display = hasCname ? 'inline' : 'none'
    this.$('[name="ghpages-settings"]').style.display = hasCname ? 'inline' : 'none'
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  publish () {
    const owner = WIDGETS['student-session'].getData('owner')
    const repo = WIDGETS['project-files']?.projectData.name
    if (!repo) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'cant-publish-project')
      return
    }
    const branch = WIDGETS['project-files'].projectData.branch
    nn.get('load-curtain').show('github.html', { filename: `${owner}/${repo}` })
    utils.post('./api/github/gh-pages', { owner, repo, branch }, (res) => {
      nn.get('load-curtain').hide()
      this.convos = window.CONVOS[this.key](this)
      if (!res.success) {
        window.convo = new Convo(this.convos, 'oh-no-error')
        return
      }
      if (window.plausible) window.plausible('published_project')
      this.pagesData = res.data
      this._render()
      window.convo = new Convo(this.convos, 'first-published')
      this._pollIfBuilding()
    })
  }

  saveDomain () {
    const value = this.$('[name="domain-input"]').value.trim()
    if (!value) return
    if (!value.includes('.') || /\s/.test(value)) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'domain-invalid')
      return
    }
    this._putDomain(value, 'domain-saved')
  }

  removeDomain () {
    this._putDomain('', 'domain-removed')
  }

  reset () {
    this._stopPolling()
    this.pagesData = null
    this._render()
    this.close()
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _putDomain (cname, convoOnSuccess) {
    const owner = WIDGETS['student-session'].getData('owner')
    const repo = WIDGETS['project-files']?.projectData.name
    if (!repo) return
    utils.post('./api/github/pages-domain', { owner, repo, cname }, (res) => {
      this.convos = window.CONVOS[this.key](this)
      if (!res.success) {
        window.convo = new Convo(this.convos, 'oh-no-error')
        return
      }
      window.convo = new Convo(this.convos, convoOnSuccess)
      const pf = WIDGETS['project-files']
      if (cname && pf) {
        pf._updateFile('CNAME', cname).then(() => {
          pf.lastCommitFiles['CNAME'] = { path: 'CNAME', code: cname }
          pf._updateFilesGUI()
          pf.changes = pf.computeChanges()
        })
      } else if (!cname && pf?.files?.CNAME) {
        pf._postDeletion('CNAME').then(() => {
          delete pf.lastCommitFiles['CNAME']
          pf.changes = pf.computeChanges()
        })
      }
      this._startRebuildPolling()
    })
  }

  _refreshStatus () {
    const owner = WIDGETS['student-session'].getData('owner')
    const repo = WIDGETS['project-files']?.projectData.name
    if (!repo) return
    utils.get(`./api/github/pages-status?owner=${owner}&repo=${repo}`, (res) => {
      if (!res || !res.success) {
        this._pollTimer = setTimeout(() => this._refreshStatus(), 6000)
        return
      }
      this.pagesData = res.enabled ? res.data : null
      this._render()
      this._pollIfBuilding()
    })
  }

  _startRebuildPolling () {
    if (!this.pagesData) return
    this._stopPolling()
    this.pagesData.status = 'building'
    this._render()
    this._pollTimer = setTimeout(() => this._refreshStatus(), 6000)
  }

  _pollIfBuilding () {
    this._stopPolling()
    if (!this.pagesData) return
    const status = this.pagesData.status
    if (status === 'built' || status === 'errored') return
    this._pollTimer = setTimeout(() => this._refreshStatus(), 6000)
  }

  _toggleQRCode () {
    const container = this.$('[name="pub-qr-code"]')
    const url = this.pagesData?.html_url || ''
    if (!this.qrcode) {
      this.qrcode = new QRious({
        element: container,
        background: '#ffffff',
        backgroundAlpha: 0,
        foreground: utils.getVal('--netizen-meta'),
        foregroundAlpha: 1,
        level: 'H',
        size: 200,
        value: url
      })
      if (!this.qrcode.canvas.parentElement) {
        container.appendChild(this.qrcode.canvas)
      }
    } else {
      this.qrcode.value = url
    }
    const visible = window.getComputedStyle(container).display !== 'none'
    container.style.display = visible ? 'none' : 'flex'
  }

  _stopPolling () {
    if (this._pollTimer) clearTimeout(this._pollTimer)
    this._pollTimer = null
  }
}

window.WebPublish = WebPublish
