/* global Widget, Convo, utils, navigator */
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
  }

  loadReply (text) {
    const { html, blocks } = this._markdownToHtml(text)
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

      const lineCount = block.code.split('\n').length
      const height = lineCount * 22 + 16

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
        trace.language = block.lang
        trace.code = block.code
      })
    })
  }

  _copyCode (trace) {
    const check = trace.check()
    if (check.matched) {
      trace.clearDiff()
      navigator.clipboard.writeText(check.baseCode)
      window.convo = new Convo(this.convos, 'reply-copied')
    } else if (check.overlayCode === '') {
      window.convo = new Convo(this.convos, 'reply-no-code')
    } else {
      trace.showDiff('rgba(255, 0, 0, 0.4)')
      window.convo = new Convo(this.convos, 'reply-not-copied')
    }
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

  _markdownToHtml (md) {
    const blocks = []

    // extract fenced code blocks first
    md = md.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
      blocks.push({ code: code.trimEnd(), lang: this._mapLang(lang) })
      return `\x00block${blocks.length - 1}\x00`
    })

    // inline code — uses .reference-widget__slide code CSS
    md = md.replace(/`([^`]+)`/g, (_, code) => `<code>${code}</code>`)

    // headers
    md = md.replace(/^### (.+)$/gm, '<h3>$1</h3>')
    md = md.replace(/^## (.+)$/gm, '<h2>$1</h2>')
    md = md.replace(/^# (.+)$/gm, '<h1>$1</h1>')

    // bold + italic
    md = md.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    md = md.replace(/\*(.+?)\*/g, '<em>$1</em>')

    // unordered lists
    md = md.replace(/((?:^[ \t]*[-*+] .+\n?)+)/gm, match => {
      const items = match.trim().split('\n')
        .map(l => `<li>${l.replace(/^[ \t]*[-*+] /, '')}</li>`).join('')
      return `<ul>${items}</ul>`
    })

    // ordered lists
    md = md.replace(/((?:^\d+\. .+\n?)+)/gm, match => {
      const items = match.trim().split('\n')
        .map(l => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('')
      return `<ol>${items}</ol>`
    })

    // paragraphs
    md = md.split(/\n{2,}/).map(para => {
      para = para.trim()
      if (!para) return ''
      if (/^<[huo]|^\x00block/.test(para)) return para
      return `<p>${para.replace(/\n/g, '<br>')}</p>`
    }).join('\n')

    // restore code blocks as placeholder spans
    md = md.replace(/\x00block(\d+)\x00/g, (_, i) =>
      `<span data-block="${i}"></span>`)

    return { html: md, blocks }
  }
}

window.AiLlmReply = AiLlmReply
