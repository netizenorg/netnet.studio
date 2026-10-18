/* global WIDGETS, Widget, Convo, utils, navigator */
class AiLlmReply extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'ai-llm-reply'
    this.title = 'LLM Response'
    this.listed = false
    this._blocks = [] // [{code, lang}]
    this._rawHtml = ''
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
    this.on('open', () => this._render())
    // wrapped lines change when the widget's width does
    this.on('resize', () => this._fitTraces())
  }

  loadReply (text) {
    // see ai-api-conduit's renderMarkdown()
    const { html, blocks } = WIDGETS['ai-api-conduit'].renderMarkdown(text)
    this._rawHtml = '<br>' + html
    this._blocks = blocks
    if (this.opened) this._render()
  }

  // ............................................................................

  _render () {
    if (!utils.customElementReady('code-trace')) {
      setTimeout(() => this._render(), 100)
      return
    }

    this.innerHTML = `<div class="ai-llm-reply__main reference-widget">${this._rawHtml}</div>`

    // for each code block placeholder, replace with code-trace + copy btn
    this.ele.querySelectorAll('[data-block]').forEach(placeholder => {
      const i = parseInt(placeholder.dataset.block)
      const block = this._blocks[i]
      if (!block) return

      // a first estimate, until the code has rendered (see _fitTrace)
      const height = block.code.split('\n').length * 22 + 16

      const wrapper = document.createElement('div')
      wrapper.className = 'ai-llm-reply__block'

      const trace = document.createElement('code-trace')
      trace.setAttribute('bright', 'true')
      trace.style.display = 'block'
      trace.style.height = `${height}px`
      wrapper.appendChild(trace)

      const actions = document.createElement('div')
      actions.className = 'ai-llm-reply__copy'
      const copyBtn = document.createElement('button')
      copyBtn.className = 'pill-btn pill-btn--secondary'
      copyBtn.textContent = 'copy code'
      copyBtn.addEventListener('click', () => this._copyCode(trace))
      actions.appendChild(copyBtn)
      wrapper.appendChild(actions)

      placeholder.replaceWith(wrapper)

      // set code after element is in DOM
      window.requestAnimationFrame(() => {
        trace.language = this._mapLang(block.lang)
        trace.code = block.code
        this._fitTrace(trace)
      })
    })
  }

  _fitTrace (trace) {
    // size the code-trace to fit its code, including lines that wrap
    const cm = trace._base && trace._base.cm
    if (!cm) return window.requestAnimationFrame(() => this._fitTrace(trace))
    window.requestAnimationFrame(() => {
      cm.refresh()
      const h = cm.getScrollInfo().height
      if (!h) return
      trace.style.height = `${h}px`
      const container = trace.querySelector('.code-trace')
      if (container) container.style.height = `${h}px`
    })
  }

  _fitTraces () {
    this.ele.querySelectorAll('.ai-llm-reply__block code-trace')
      .forEach(trace => this._fitTrace(trace))
  }

  _copyCode (trace) {
    const check = trace.check()
    if (check.matched) {
      trace.clearDiff()
      navigator.clipboard.writeText(check.baseCode)
      window.convo = new Convo(this.convos, 'reply-copied')
    } else if (check.overlayCode === '') {
      this._untracedTrace = trace // for the "copy anyway" option
      window.convo = new Convo(this.convos, 'reply-no-code')
    } else {
      trace.showDiff('rgba(255, 0, 0, 0.4)')
      window.convo = new Convo(this.convos, 'reply-not-copied')
    }
  }

  _copyAnyway () {
    // copies a code block without tracing it first (see 'reply-no-code' convo)
    if (!this._untracedTrace) return
    navigator.clipboard.writeText(this._untracedTrace.check().baseCode)
    this._untracedTrace = null
    window.convo = new Convo(this.convos, 'reply-copied')
  }

  // ............................................................................

  _mapLang (l) {
    l = (l || '').toLowerCase().trim()
    if (['javascript', 'js', 'jsx', 'ts', 'typescript'].includes(l)) return 'javascript'
    if (['css', 'scss', 'sass', 'less'].includes(l)) return 'css'
    if (['markdown', 'md'].includes(l)) return 'markdown'
    if (l === 'htmlmixed') return 'htmlmixed'
    return 'html'
  }
}

window.AiLlmReply = AiLlmReply
