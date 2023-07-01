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
    this.issues = []
    this._createHTML()

    this.on('open', () => this._opened())
    NNW.on('theme-change', () => this.updateIssues())

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key]() })
  }

  updateIssues (e) {
    const t = 'sketch' // TODO check if in GH project, change to "tab" or "file"
    if (e) this.issues = e
    // mark editor
    const c = WIDGETS['student-session']
      ? WIDGETS['student-session'].getData('chattiness') : null
    if (c && c !== 'low') this._markErrors(this.issues, true)
    else NNE.marker(null)
    // update code review widget list
    const list = this.$('.code-review')
    if (this.issues.length > 0) list.innerHTML = ''
    else list.innerHTML = `<h3>No issues were found in this ${t}</h3>`
    this.issues.forEach((err, i) => this._createErrDiv(err, i))
  }

  undoTidy () {
    if (this.tempCode) NNE.code = this.tempCode
  }

  addIssueMarkers () { // used after explainer markers are added
    this._markErrors(this.issues, false)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _markErrors (arr, clearFirst) {
    if (clearFirst) NNE.marker(null)
    const lines = []
    arr.forEach(e => {
      if (lines.includes(e.line)) return
      lines.push(e.line)
      const clk = () => this._explainError(e)
      const clr = (e.type === 'warning') ? 'orange' : 'red'
      /*
        HACK: not sure why, but some errors return e.line: 0 ???
        ex: localhost:8001/?tutorial=html-crash-course&t=1157
      */
      if (e.line === 0) e.line = 1
      const m = NNE.marker(e.line, clr, clk)
      m.setAttribute('title', e.message)
    })
  }

  _textBubble (id) {
    this.convos = window.CONVOS[this.key]()
    window.convo = new Convo(this.convos, id)
  }

  _explainError (err, loc) {
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

  _createErrDiv (e, i) {
    // TODO check if in GH project, change to "index.html" to filename
    const filename = 'index.html'
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
    div.addEventListener('click', () => this._explainError(e, loc))
    this.$('.code-review').appendChild(div)
  }
}

window.CodeReview = CodeReview
