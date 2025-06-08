/* global Widget, NNE, NNW, Convo, utils, nn, WIDGETS */
class CodeReview extends Widget {
  constructor (opts) {
    opts = opts || {}
    opts.width = 500
    super(opts)
    this.key = 'code-review'
    this.listed = true
    this.keywords = ['error', 'mistakes', 'lint', 'audit', 'review', 'check', 'assessment']

    this.title = 'Code Review'
    this.info = ''
    this.tempCode = null
    this.issues = [] // issues netnet catches via linting
    this.error = {} // last error passed by browser console
    this._createHTML()

    this.on('open', () => this._opened())
    NNW.on('theme-change', () => this.updateIssues())

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
  }

  review (obj = {}) {
    this.updateIssues(obj.issues)
    this.updateError(obj.error)
    // update code review widget view
    this._reviewIssues()
  }

  updateIssues (issues) {
    // issues array from netnet 'lint-errors'
    if (issues) this.issues = issues
    // mark editor
    const c = WIDGETS['student-session']
      ? WIDGETS['student-session'].getData('chattiness') : null
    if (c && c !== 'low') this._markIssues(this.issues, true)
    else NNE.marker(null)
  }

  updateError (event) {
    const pf = WIDGETS['project-files']
    const ss = WIDGETS['student-session']
    // check chattiness level
    const c = ss ? ss.getData('chattiness') : null
    // event object from 'onerror' event injected into iframe either via
    // utils.setCustomRenderer (sketch) or files-db-service-worker.js (project)
    if (c && c !== 'low' && event?.data && event?.data.type === 'iframe-error') {
      // these are the number of lines added to the top of the file before rendering
      // (see errMsgr in utils.setCustomRenderer)
      const diff = 4
      const message = event.data.message
      let file = event.data.source.includes('.') ? event.data.source : null
      let line = event.data.lineno - diff

      // if project, ensure only showing errors on current file
      if (ss.getData('opened-project') && pf) {
        file = new URL(file).pathname
        if (file !== '/' + pf.viewing) return
        if (!file.endsWith('.html')) line += diff
      }

      // add error markers (aka _markErrors)
      const m = NNE.marker(line, 'red', () => {
        // _explainError
        this.error = { message, line, file }
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'custom-renderer-error')
      })
      m.setAttribute('title', message)
      m.dataset.err = JSON.stringify({ message, line, file })
    }
  }

  undoTidy () {
    if (this.tempCode) NNE.code = this.tempCode
  }

  addIssueMarkers () { // used after green annoted example markers are added
    this._markIssues(this.issues, false)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _findErrors () { // list console error objects
    return Array.from(nn.getAll('.netitor-gutter-marker'))
      .filter(ele => ele.dataset.err)
      .map(ele => JSON.parse(ele.dataset.err))
  }

  _explainIssue (err, loc) {
    const opts = {
      'ok thanks': (e) => { NNE.spotlight(null); e.hide() }
    }
    if (loc) {
      opts[`what's: ${loc}`] = () => this._textBubble('explain-line-numbers')
    }
    if (!this.opened) {
      opts['run Code Review'] = () => this.open()
    }
    NNE.cm.scrollIntoView({ ch: 0, line: err.line - 1 })
    setTimeout(() => NNE.spotlight(err.line), 100)
    window.convo = new Convo({
      content: `On line ${err.line}, ${err.friendly}`,
      options: opts
    })
  }

  _markIssues (arr, clearFirst) {
    if (clearFirst) NNE.marker(null)
    const lines = []
    arr.forEach(e => {
      if (lines.includes(e.line)) return
      lines.push(e.line)
      const clk = () => this._explainIssue(e)
      const clr = (e.type === 'warning') ? 'orange' : 'red'
      /*
        HACK: not sure why, but some errors return e.line: 0 ???
        ex: localhost:8001/?tutorial=html-crash-course&t=1157
        NOTE: this should be fixed now... but doesn't hurt to keep it
      */
      if (e.line === 0) e.line = 1
      const m = NNE.marker(e.line, clr, clk)
      m.setAttribute('title', e.message)
    })
  }

  _textBubble (id) {
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, id)
  }

  _couldTidy () {
    this.tempCode = NNE.code
    NNE.tidy()
    const tidyCode = NNE.code
    const couldTidy = (tidyCode !== this.tempCode)
    NNE.code = this.tempCode
    return couldTidy
  }

  _opened () {
    NNE.spotlight(null)
    if (NNW.layout === 'dock-bottom') this.update({ left: 10, top: 10 })
    else if (NNW.layout === 'full-screen') this.update({ bottom: 10 })
    else this.update({ bottom: 10, right: 10 })
    if (this.issues.length > 0) {
      this._textBubble('found-errors')
    } else if (this._couldTidy()) {
      this._textBubble('could-indent')
    } else {
      this._textBubble('error-free')
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML () {
    this.ele.querySelector('.widget__inner-html').style.padding = 0

    this.innerHTML = `
      <div class="code-review"><!-- list issues --></div>
    `
  }

  _createBanner (selected) {
    const s = this.issues.length
    const e = this._findErrors().length
    const b = nn.browserInfo().name || 'browser'
    const div = nn.create('div').set('class', 'code-review__tabs')
    nn.create('span').content(`netnet caught ${s} issue${s === 1 ? '' : 's'}`)
      .set('class', 'code-review__tab')
      .css({
        background: selected === 'issues' ? 'var(--netizen-meta)' : 'var(--bg-color)',
        color: selected === 'issues' ? 'var(--bg-color)' : 'var(--netizen-meta)'
      })
      .on('click', () => this._back2Issues())
      .addTo(div)
    nn.create('span').content(`${b} caught ${e} error${e === 1 ? '' : 's'}`)
      .set('class', 'code-review__tab')
      .css({
        background: selected === 'errors' ? 'var(--netizen-meta)' : 'var(--bg-color)',
        color: selected === 'errors' ? 'var(--bg-color)' : 'var(--netizen-meta)'
      })
      .on('click', () => this._reviewErrors())
      .addTo(div)
    return div
  }

  _reviewIssues () {
    let html = ''
    if (this.issues.length > 0) {
      const many = `Below are ${this.issues.length} potential issues`
      const opener = this.issues.length > 1 ? many : 'Below is one potential issue'
      html += `${opener} netnet noticed in your code.`
    } else {
      const errs = this._findErrors().length
      html = 'No issues found, your code has passed netnet\'s code review.'
      if (errs > 0) {
        html += ` That said, your browser did catch ${errs} error${errs > 1 ? 's' : ''}, click on the tab above to view those.`
      }
    }

    const tabs = this._createBanner('issues')
    const info = nn.create('div').content(html).css({ marginBottom: '5px' })
    this.$('.code-review').innerHTML = ''
    this.$('.code-review').appendChild(tabs)
    this.$('.code-review').appendChild(info)
    this.issues.forEach((err, i) => this._createIssueDiv(err, i))
  }

  _reviewErrors () {
    const errs = this._findErrors()
    let html = ''
    if (errs.length > 0) {
      const Mac = nn.platformInfo().platform.includes('Mac')
      const count = errs.length > 1 ? `${errs.length} errors` : '1 error'
      html += `After rending your code, your browser caught ${count}. You can also view these in your browser's JavaScript error console by presssing <code>${Mac ? 'Fn+' : ''}F12</code> to open your browser's "<a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools" target="_blank">developer tools</a>" and then switch to the "Console" tab.`
    } else {
      const ish = this.issues.length
      html = 'There were no errors caught by your browser.'
      if (ish > 0) {
        html += ` That said, netnet did notice ${ish} potential issue${ish > 1 ? 's' : ''} with your code, click on the tab above to view those.`
      }
    }

    const tabs = this._createBanner('errors')
    const info = nn.create('div').content(html).css({ marginBottom: '5px' })
    this.$('.code-review').innerHTML = ''
    this.$('.code-review').appendChild(tabs)
    this.$('.code-review').appendChild(info)
    errs.forEach((err, i) => this._createErrorDiv(err, i))
  }

  _back2Issues () { this.review(); NNE.update() }

  _fileName () {
    const op = WIDGETS['student-session'].getData('opened-project')
    const pf = WIDGETS['project-files']
    const file = (op && pf) ? pf.viewing : 'index.html'
    return file
  }

  _createIssueDiv (e, i) {
    const filename = this._fileName()
    const div = document.createElement('div')
    div.className = 'code-review__issue'
    div.style.background = utils.getVal('--netizen-meta') + nn.alpha2hex(0.7)
    const msg = e.message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '')
    const loc = `${filename}:${e.line}:${e.col}`
    const clr = e.language === 'html'
      ? 'var(--netizen-tag)' : e.language === 'css'
        ? 'var(--netizen-attribute)' : 'var(--netizen-number)'
    div.innerHTML = `
      <div class="code-review__issue__head">
        <span>${e.language} <i>${e.type}</i></span>
        <span class="code-review__issue__head__link">${loc}</span>
      </div>
      <div>${msg}</div>
    `
    div.querySelector('.code-review__issue__head').style.background = clr
    div.addEventListener('click', () => this._explainIssue(e, loc))
    this.$('.code-review').appendChild(div)
  }

  _createErrorDiv (e, i) {
    const filename = this._fileName()
    const div = document.createElement('div')
    div.className = 'code-review__issue'
    div.style.background = utils.getVal('--netizen-meta') + nn.alpha2hex(0.7)
    const msg = e.message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '')
    div.innerHTML = `
      <div class="code-review__issue__head">
        <span>Error</span>
        <span>${filename}:${e.line}</span>
      </div>
      <div>${msg}</div>
    `
    div.querySelector('.code-review__issue__head').style.background = 'rgba(255,0,0,0.70)'
    div.addEventListener('click', () => NNE.spotlight(e.line))
    this.$('.code-review').appendChild(div)
  }
}

window.CodeReview = CodeReview
