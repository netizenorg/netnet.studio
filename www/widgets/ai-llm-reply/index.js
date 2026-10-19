/* global WIDGETS, Widget, Convo, utils, navigator, Netitor, NNE */
class AiLlmReply extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'ai-llm-reply'
    this.title = 'LLM Context <span style="opacity: 0.5;margin-left:10px">(chat history)</span>'
    this.listed = false
    this._editor = null // Netitor instance, when editing a model's reply
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
    this.on('open', () => this._render())
    // wrapped lines change when the widget's width does
    this.on('resize', () => this._fitTraces())
  }

  // the conversation lives in ai-api-conduit's history (in memory):
  // [{ role: 'user', content, files }, { role: 'model', content }, ...]
  get history () { return WIDGETS['ai-api-conduit'].history }

  loadConversation () {
    if (this.opened) this._render()
  }

  // ............................................................................

  _render () {
    if (!utils.customElementReady('code-trace')) {
      setTimeout(() => this._render(), 100)
      return
    }

    this._editor = null
    this.innerHTML = '<div class="ai-llm-reply__main reference-widget"></div>'
    const main = this.$('.ai-llm-reply__main')
    if (this.history.length === 0) {
      main.innerHTML = '<p><i>There are no messages in this conversation yet.</i></p>'
      return
    }
    this.history.forEach((m, i) => main.appendChild(this._message(m, i)))
    // scroll to the newest message
    window.requestAnimationFrame(() => {
      const last = main.lastElementChild
      if (last) last.scrollIntoView({ block: 'start' })
    })
  }

  _message (m, i) {
    // a message in the conversation, with its edit && delete buttons
    const msg = document.createElement('div')
    msg.className = `ai-llm-reply__msg ai-llm-reply__msg--${m.role}`
    msg.innerHTML = `
      <div class="ai-llm-reply__msg-header">
        <span>${m.role === 'user' ? 'you' : 'LLM'}</span>
        <span>
          <button class="ai-llm-reply__icon ai-llm-reply__icon--edit" name="edit" title="edit this message" aria-label="edit this message"></button>
          <button class="ai-llm-reply__icon ai-llm-reply__icon--delete" name="delete" title="delete this message" aria-label="delete this message"></button>
        </span>
      </div>
      <div class="ai-llm-reply__msg-body"></div>
    `
    msg.querySelector('[name="edit"]').addEventListener('click', () => this._edit(msg, i))
    msg.querySelector('[name="delete"]').addEventListener('click', () => {
      this._toDelete = i
      window.convo = new Convo(this.convos, 'delete-message')
    })
    this._displayBody(msg, m)
    return msg
  }

  _displayBody (msg, m) {
    const body = msg.querySelector('.ai-llm-reply__msg-body')
    const conduit = WIDGETS['ai-api-conduit']
    if (m.role === 'user') {
      body.innerHTML = conduit._escapeHTML(m.content).replace(/\n/g, '<br>')
      return
    }
    // the model's reply is markdown (see ai-api-conduit's renderMarkdown())
    const { html, blocks } = conduit.renderMarkdown(m.content)
    body.innerHTML = html
    // for each code block placeholder, replace with code-trace + copy btn
    body.querySelectorAll('[data-block]').forEach(placeholder => {
      const block = blocks[parseInt(placeholder.dataset.block)]
      if (block) placeholder.replaceWith(this._codeBlock(block))
    })
  }

  _codeBlock (block) {
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

    // set code after element is in DOM
    window.requestAnimationFrame(() => {
      trace.language = this._mapLang(block.lang)
      trace.code = block.code
      this._fitTrace(trace)
    })
    return wrapper
  }

  // ............................................................................
  // editing the history (only changes the history, nothing gets sent)

  _edit (msg, i) {
    if (this._editing !== undefined && this._editing !== null) this._render()
    msg = this.$('.ai-llm-reply__main').children[i]
    this._editing = i
    const m = this.history[i]
    const body = msg.querySelector('.ai-llm-reply__msg-body')
    body.innerHTML = `
      <div class="ai-llm-reply__edit"></div>
      <div class="ai-llm-reply__edit-actions">
        <button class="pill-btn pill-btn--secondary" name="save">save</button>
        <button class="pill-btn pill-btn--secondary" name="cancel">cancel</button>
      </div>
    `
    const area = body.querySelector('.ai-llm-reply__edit')
    let getValue
    if (m.role === 'user') {
      // the student's questions are plain text
      const textarea = document.createElement('textarea')
      textarea.value = m.content
      textarea.spellcheck = false
      area.appendChild(textarea)
      textarea.focus()
      getValue = () => textarea.value
    } else {
      // the model's replies are markdown, so we edit them in a markdown editor
      const lines = m.content.split('\n').length
      area.style.height = `${Math.min(400, Math.max(120, lines * 22 + 20))}px`
      this._editor = new Netitor({
        ele: area,
        background: false,
        autoUpdate: false,
        hint: false,
        lint: false,
        wrap: true,
        theme: NNE.theme,
        language: 'markdown',
        code: m.content
      })
      getValue = () => this._editor.code
    }

    body.querySelector('[name="cancel"]').addEventListener('click', () => {
      this._editing = null
      this._render()
    })
    body.querySelector('[name="save"]').addEventListener('click', () => {
      const changed = getValue() !== m.content
      m.content = getValue()
      this._editing = null
      this._render()
      WIDGETS['ai-api-conduit']._refreshRequestBody()
      if (changed && m.role === 'model' && !this._editedModel) {
        this._editedModel = true // only the first time
        window.convo = new Convo(this.convos, 'edited-model-message')
      }
    })
  }

  deleteMessage () {
    // deletes the message chosen in the delete-message convo
    if (typeof this._toDelete !== 'number') return
    this.history.splice(this._toDelete, 1)
    this._toDelete = null
    this._render()
    WIDGETS['ai-api-conduit']._refreshRequestBody()
  }

  // ............................................................................

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
