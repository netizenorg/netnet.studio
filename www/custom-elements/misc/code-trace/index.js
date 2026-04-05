/* global HTMLElement, Netitor, NNE */
class CodeTrace extends HTMLElement {
  constructor () {
    super()
    this.syncProps2Attr()
  }

  connectedCallback () {
    this.innerHTML = `
    <div class="code-trace">
      <div class="code-trace__base"></div>
      <div class="code-trace__overlay"></div>
    </div>`

    this._initWhenReady()
  }

  _initWhenReady () {
    if (this.offsetParent !== null) {
      this._createBaseEditor()
      this._createOverlayEditor()
      this._updateHeight()
    } else {
      window.requestAnimationFrame(() => this._initWhenReady())
    }
  }

  _updateHeight () {
    const container = this.querySelector('.code-trace')
    const base = this.querySelector('.code-trace__base')
    const h = base.offsetHeight
    if (h > 0) {
      container.style.height = h + 'px'
    } else {
      window.requestAnimationFrame(() => this._updateHeight())
    }
  }

  _createBaseEditor () {
    const div = this.querySelector('.code-trace__base')
    this._base = new Netitor({
      ele: div,
      renderWithErrors: true,
      wrap: true,
      background: NNE.background,
      autoUpdate: false,
      hint: false,
      lint: false,
      readOnly: true,
      theme: NNE.theme,
      language: this.language || 'javascript',
      code: this.code || ''
    })
  }

  _createOverlayEditor () {
    const div = this.querySelector('.code-trace__overlay')
    this._overlay = new Netitor({
      ele: div,
      renderWithErrors: true,
      wrap: true,
      background: false,
      autoUpdate: false,
      hint: false,
      lint: false,
      readOnly: false,
      theme: NNE.theme,
      language: this.language || 'javascript',
      code: ''
    })

    this._overlay.on('code-update', () => {
      this._checkMatch()
    })

    this._overlay.cm.on('beforeChange', (cm, change) => {
      if (!this._base) return
      const baseLineCount = this._base.code.split('\n').length
      const linesAdded = change.text.length - 1
      const linesRemoved = change.to.line - change.from.line
      const newLineCount = cm.lineCount() + linesAdded - linesRemoved
      if (newLineCount > baseLineCount) change.cancel()
    })
  }

  _normalizeLine (str) {
    return str.replace(/\t/g, '  ').replace(/\s+$/g, '')
  }

  check () {
    const baseCode = this._base ? this._base.code : ''
    const overlayCode = this._overlay ? this._overlay.code : ''
    const baseNorm = baseCode.split('\n').map(l => this._normalizeLine(l)).join('\n')
    const overlayNorm = overlayCode.split('\n').map(l => this._normalizeLine(l)).join('\n')
    const matched = overlayNorm === baseNorm && baseNorm.length > 0
    return { matched, baseCode, overlayCode }
  }

  _checkMatch () {
    const data = this.check()
    this.dispatchEvent(new window.CustomEvent('trace-update', { detail: data }))
  }

  reset () {
    if (this._overlay) this._overlay.code = ''
  }

  clearDiff () {
    this._overlay.highlight(null)
  }

  showDiff (color) {
    if (!this._base || !this._overlay) return
    const diffColor = color || 'rgba(255, 0, 0, 0.3)'
    // clear any previous highlights
    this._overlay.highlight(null)

    const baseCode = this._base.code
    const overlayCode = this._overlay.code
    const baseLines = baseCode.split('\n')
    const overlayLines = overlayCode.split('\n')

    for (let i = 0; i < overlayLines.length; i++) {
      const baseLine = this._normalizeLine(baseLines[i] || '')
      const overlayLine = this._normalizeLine(overlayLines[i])
      if (overlayLine === baseLine) continue

      // find the first and last mismatched columns in this line
      let startCol = null
      let endCol = 0
      const maxLen = Math.max(baseLine.length, overlayLine.length)
      for (let c = 0; c < maxLen; c++) {
        if (overlayLine[c] !== baseLine[c]) {
          if (startCol === null) startCol = c
          endCol = c + 1
        }
      }

      if (startCol !== null) {
        const lineNum = i + 1
        this._overlay.highlight({
          startLine: lineNum,
          startCol: startCol,
          endLine: lineNum,
          endCol: endCol,
          color: diffColor
        })
      }
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* attributes + properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  static get observedAttributes () {
    return ['code', 'language', 'bright']
  }

  syncProps2Attr () {
    if (this.constructor.observedAttributes &&
      this.constructor.observedAttributes.length) {
      this.constructor.observedAttributes.forEach(attr => {
        Object.defineProperty(this, attr, {
          get () { return this.getAttribute(attr) },
          set (v) {
            if (v !== null || typeof v !== 'undefined') this.setAttribute(attr, v)
            else this.removeAttribute(attr)
          }
        })
      })
    }
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (newVal !== oldVal) {
      this[attrName] = newVal
      if (attrName === 'code' && this._base) {
        this._base.code = newVal
        this.reset()
        this._updateHeight()
      }
      if (attrName === 'language') {
        if (this._base) this._base.language = newVal
        if (this._overlay) this._overlay.language = newVal
      }
      if (attrName === 'bright') {
        this._updateBright()
      }
    }
  }

  _updateBright () {
    const baseEl = this.querySelector('.code-trace__base')
    if (!baseEl) return

    const isBright = this.getAttribute('bright') === 'true'

    if (isBright) {
      baseEl.style.opacity = '1'

      if (!this._brightListenersAdded) {
        this._brightListenersAdded = true

        this._onBrightEnter = () => {
          if (this.getAttribute('bright') === 'true') {
            baseEl.style.opacity = '0.35'
          }
        }
        this._onBrightLeave = () => {
          if (this.getAttribute('bright') === 'true') {
            baseEl.style.opacity = '1'
          }
        }

        this.addEventListener('mouseenter', this._onBrightEnter)
        this.addEventListener('mouseleave', this._onBrightLeave)
        this.addEventListener('focusin', this._onBrightEnter)
        this.addEventListener('focusout', this._onBrightLeave)
      }
    } else {
      baseEl.style.opacity = ''
    }
  }
}

window.customElements.define('code-trace', CodeTrace)
