/* global HTMLElement, Netitor, NNE */
class CodeSample extends HTMLElement {
  constructor () {
    super()
    this.syncProps2Attr()
  }

  connectedCallback () {
    const div = document.createElement('div')
    this.appendChild(div)
  }

  updateExample (code, lang) {
    if (!code) return
    if (!this.netitor) {
      const div = this.querySelector('div')
      this.netitor = new Netitor({
        ele: div,
        renderWithErrors: true,
        background: NNE.background,
        autoUpdate: false,
        hint: false,
        lint: false,
        readOnly: true,
        theme: NNE.theme,
        language: lang || 'html',
        code: ''
      })
    }
    this.netitor.code = code
    // if (lang) this.netitor.language = lang
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* attributes + properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  static get observedAttributes () {
    return ['language', 'code']
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
      this.updateExample()
    }
  }
}

window.customElements.define('code-sample', CodeSample)
