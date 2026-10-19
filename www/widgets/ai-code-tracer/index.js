/* global WIDGETS, Widget, Convo, utils, navigator */
class AiCodeTracer extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'ai-code-tracer'
    this.title = 'LLM Code Snippets'
    this.listed = false

    this.width = 530
    this.height = 400

    // the code block currently displayed: { code, lang }
    // (shown by ai-api-conduit's "possessed convo" integration, see its _goToStep)
    this.block = null

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
    this.on('open', () => this._createHTML())
  }

  showBlock (block) {
    if (this.block === block && this.$('code-trace')) return // already showing
    this.block = block
    if (this.$('code-trace')) this._displayBlock()
  }

  _createHTML () {
    if (!utils.customElementReady('code-trace')) {
      setTimeout(() => this._createHTML(), 100)
      return
    }

    this.innerHTML = `
      <div class="ai-code-tracer__main">
        <code-trace bright="true"></code-trace>
        <div class="ai-code-tracer__actions">
          <button class="pill-btn pill-btn--secondary" name="copy-btn">copy code</button>
        </div>
      </div>
    `

    this.$('[name="copy-btn"]').addEventListener('click', () => this._copyCode())

    if (this.block) this._displayBlock()
  }

  _displayBlock () {
    const trace = this.$('code-trace')
    trace.language = this._mapLanguage(this.block.lang, this.block.code)
    trace.code = this.block.code
    this._resizeToFit(this.block.code)
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

      // widget chrome: top bar (~40px), actions row, margins
      const chromeH = 40 + 40 + 34
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
      window.convo = new Convo(this.convos, 'llm-possessed-snippet-copied')
    } else if (check.overlayCode === '') {
      window.convo = new Convo(this.convos, 'llm-possessed-snippet-no-code')
    } else {
      trace.showDiff('rgba(255, 0, 0, 0.4)')
      window.convo = new Convo(this.convos, 'llm-possessed-snippet-not-copied')
    }
  }

  _copyAnyway () {
    // copies the code without tracing it first (see the snippet-no-code convo)
    navigator.clipboard.writeText(this.$('code-trace').check().baseCode)
    window.convo = new Convo(this.convos, 'llm-possessed-snippet-copied')
  }

  _backToReply () {
    // back to the possessed convo's current step
    WIDGETS['ai-api-conduit'].resumeSteps()
  }

  _mapLanguage (lang, code) {
    const l = (lang || '').toLowerCase()
    if (!l) { // no language tag, guess from the code
      return /^\s*</.test(code) ? 'htmlmixed' : 'javascript'
    }
    if (l === 'html' || l === 'htm') return 'htmlmixed'
    if (l === 'js') return 'javascript'
    return l
  }
}

window.AiCodeTracer = AiCodeTracer
