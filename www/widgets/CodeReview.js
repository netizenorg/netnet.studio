/* global Widget, NNE, NNW, Convo, utils, Color */
class CodeReview extends Widget {
  constructor (opts) {
    opts = opts || {}
    opts.width = 500
    super(opts)
    this.key = 'code-review'
    this.listed = true
    this.keywords = ['error', 'mistakes', 'lint', 'audit', 'review', 'check', 'assessment']

    // here's some more example code...
    this.title = 'Code Review'
    this.info = ''
    this.tempCode = null
    this.issues = []
    this._createHTML()

    this.on('open', () => this._opened())
    NNW.on('theme-change', () => this.updateIssues())
    NNE.cm.on('scroll', (e) => this._netitorScroll(e))

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key]() })
  }

  updateIssues (e) {
    if (e) this.issues = e
    this._markErrors(this.issues)
    const list = this.$('.code-review')
    list.innerHTML = ''
    this.issues.forEach((err, i) => this._createErrDiv(err, i))
  }

  undoTidy () {
    if (this.tempCode) NNE.code = this.tempCode
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _positionMarkers () {
    const x = document.querySelector('.CodeMirror-gutter-elt').offsetWidth
    document.querySelectorAll('.CodeMirror-gutter-elt > div').forEach(m => {
      m.style.transform = `translate(${x}px, 9px)`
    })
  }

  _markErrors (arr) {
    NNE.marker(null)
    const lines = []
    arr.forEach(e => {
      if (lines.includes(e.line)) return
      lines.push(e.line)
      const clk = () => this._explainError(e)
      if (e.type === 'warning') NNE.marker(e.line, 'orange', clk)
      else NNE.marker(e.line, 'red', clk)
    })
    this._positionMarkers()
  }

  _netitorScroll (e) {
    if (this.issues.length > 0) this._markErrors(this.issues)
  }

  _textBubble (id) {
    this.convos = window.CONVOS[this.key]()
    window.convo = new Convo(this.convos, id)
  }

  _explainError (err, loc) {
    const opts = {
      'ok thanks': (e) => { utils.spotLightCode('clear'); e.hide() }
    }
    if (loc) {
      opts[`what's: ${loc}`] = () => this._textBubble('explain-line-numbers')
    }
    if (!this.opened) {
      opts['run Code Review'] = () => this.open()
    }
    NNE.cm.scrollIntoView({ line: err.line - 1 })
    utils.spotLightCode(err.line)
    this._positionMarkers()
    window.convo = new Convo({
      content: err.friendly,
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
    utils.spotLightCode('clear')
    if (NNW.layout === 'dock-bottom') this.update({ left: 10, top: 10 })
    else if (NNW.layout === 'full-screen') this.update({ bottom: 10 })
    else this.update({ bottom: 10, right: 10 })
    if (this.issues.length > 0) {
      this._textBubble('found-errors')
    } else if (this._couldTidy()) {
      this._textBubble('could-indent')
    } else {
      this._textBubble('error-free')
      const t = 'sketch' // TODO check if in GH project, change to "tab" or "file"
      this.$('.code-review').innerHTML = 'No issues where found in this' + t
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML () {
    this.ele.querySelector('.w-innerHTML').style.padding = 0

    this.innerHTML = `
      <style>
        .code-review {
          max-height: ${window.innerHeight * 0.66}px;
          overflow-y: scroll;
        }
        .code-review__issue {
          border: 1px solid var(--bg-color);
          border-radius: 5px;
          color: var(--bg-color);
          margin-bottom: 5px;
          cursor: pointer;
          font-family: "fira-code", inconsolata, monospace;
        }

        .code-review__issue > div {
          padding: 5px;
        }

        .code-review__issue__head {
          border-bottom: 1px solid var(--bg-color);
          border-radius: 5px 5px 0 0;
          display: flex;
          justify-content: space-between;
          font-family: "fira-sans-regular", Helvetica, Arial, "Lucida Grande", sans-serif;
        }

        .code-review--link {
          text-decoration: underline;
        }
      </style>
      <div class="code-review"><!-- list issues --></div>
    `
  }

  _createErrDiv (e, i) {
    // TODO check if in GH project, change to "index.html" to filename
    const filename = 'index.html'
    const div = document.createElement('div')
    div.className = 'code-review__issue'
    div.style.background = utils.getVal('--netizen-meta') + Color.alpha2hex(0.7)
    const msg = e.message.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/`/g, '')
    const loc = `${filename}:${e.line}:${e.col}`
    const clr = e.language === 'html'
      ? 'var(--netizen-tag)' : e.language === 'css'
        ? 'var(--netizen-attribute)' : 'var(--netizen-number)'
    div.innerHTML = `
      <div class="code-review__issue__head">
        <span>${e.language} <i>${e.type}</i></span>
        <span class="code-review--link">${loc}</span>
      </div>
      <div>${msg}</div>
    `
    div.querySelector('.code-review__issue__head').style.background = clr
    div.addEventListener('click', () => this._explainError(e, loc))
    this.$('.code-review').appendChild(div)
  }
}

window.CodeReview = CodeReview
