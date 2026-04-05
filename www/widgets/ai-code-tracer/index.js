/* global WIDGETS,Widget, Convo, utils */
class AiCodeTracer extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'ai-code-tracer'
    this.title = 'LLM Responses'
    this.listed = false

    this.width = 530
    this.height = 400

    this.snippets = []
    this.currentIndex = 0

    this.on('open', () => this._createHTML())
  }

  loadSnippets (snippets) {
    this.snippets = snippets || []
    this.currentIndex = 0
    if (this.opened) this._createHTML()
  }

  _createHTML () {
    if (!utils.customElementReady('code-trace')) {
      setTimeout(() => this._createHTML(), 100)
      return
    }

    this.innerHTML = `
      <div class="ai-code-tracer__main">
        <div class="ai-code-tracer__nav">
          <button class="pill-btn pill-btn--secondary" name="prev-btn">previous</button>
          <span class="ai-code-tracer__counter"></span>
          <button class="pill-btn pill-btn--secondary" name="next-btn">next</button>
        </div>
        <code-trace bright="true"></code-trace>
        <div class="ai-code-tracer__actions">
          <button class="pill-btn pill-btn--secondary" name="copy-btn">copy code</button>
        </div>
      </div>
    `

    this.$('[name="prev-btn"]').addEventListener('click', () => this._prev())
    this.$('[name="copy-btn"]').addEventListener('click', () => this._copyCode())
    this.$('[name="next-btn"]').addEventListener('click', () => this._next())

    if (this.snippets.length > 0) this._displaySnippet()
  }

  _next () {
    if (this.currentIndex < this.snippets.length - 1) {
      this.currentIndex++
      this._displaySnippet()
    }
  }

  _prev () {
    if (this.currentIndex > 0) {
      this.currentIndex--
      this._displaySnippet()
    }
  }

  _escapeHtml (str) {
    const escaped = str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
    return escaped.replace(/`([^`]+)`/g, '<code>$1</code>')
  }

  _displaySnippet () {
    const snippet = this.snippets[this.currentIndex]
    if (!snippet) return

    WIDGETS['ai-api-conduit']._getPossessed()

    const options = {}
    if (this.currentIndex < this.snippets.length - 1) {
      options.ok = () => this._next()
    } else {
      options.ok = (e) => e.hide()
    }

    window.convo = new Convo({
      id: 'llm-possessed-snippet',
      content: this._escapeHtml(snippet.explanation),
      options
    })

    const trace = this.$('code-trace')
    trace.language = this._mapLanguage(snippet.language)
    trace.code = snippet.code

    // update counter and button states
    const total = this.snippets.length
    this.$('.ai-code-tracer__counter').textContent = `${this.currentIndex + 1} / ${total}`
    this.$('[name="prev-btn"]').disabled = this.currentIndex === 0
    this.$('[name="next-btn"]').disabled = this.currentIndex === total - 1

    this._resizeToFit(snippet.code)
  }

  _resizeToFit (code) {
    const trace = this.$('code-trace')
    // wait for the base editor to be ready
    const tryResize = () => {
      if (!trace._base || !trace._base.cm) {
        window.requestAnimationFrame(tryResize)
        return
      }

      const cm = trace._base.cm
      const charW = cm.defaultCharWidth()
      const lineH = cm.defaultTextHeight()

      const lines = code.split('\n')
      const lineCount = lines.length
      const longestLine = lines.reduce((max, l) => Math.max(max, l.length), 0)

      // code area: char width * longest line + gutter + padding
      const gutterW = cm.getGutterElement().offsetWidth || 40
      const codePadding = 54
      const codeWidth = Math.ceil(longestLine * charW) + gutterW + codePadding

      // widget chrome: top bar (~40px), nav row, actions row, margins
      const chromeH = 40 + 35 + 40 + 34
      const codeHeight = Math.ceil(lineCount * lineH) + 10

      // apply with min/max bounds
      const width = Math.max(300, Math.min(codeWidth, 800))
      const height = Math.max(200, Math.min(codeHeight + chromeH, 600))

      this.update({ width, height }, 500)
    }

    window.requestAnimationFrame(tryResize)
  }

  _copyCode () {
    const trace = this.$('code-trace')
    const check = trace.check()

    if (check.matched) {
      trace.clearDiff()
      navigator.clipboard.writeText(check.baseCode)
      window.convo = new Convo({
        id: 'llm-possessed-snippet',
        content: 'Copied to clipboard!',
        options: { ok: (e) => e.hide() }
      })
    } else {
      trace.showDiff('rgba(255, 0, 0, 0.4)')
      window.convo = new Convo({
        id: 'llm-possessed-snippet',
        content: 'The code you typed doesn\'t match the snippet. The differences are highlighted in <span style="color:red">red</span>. Fix the highlighted sections and try again.',
        options: { ok: (e) => e.hide() }
      })
    }
  }

  _mapLanguage (lang) {
    if (!lang) return 'javascript'
    const l = lang.toLowerCase()
    if (l === 'html' || l === 'htm') return 'htmlmixed'
    if (l === 'js') return 'javascript'
    return l
  }
}

window.AiCodeTracer = AiCodeTracer
