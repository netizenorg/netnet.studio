/* global HTMLElement, hljs */
class CodeExample extends HTMLElement {
  constructor () {
    super()
    /*
      NOTE: this relies on:
      <link rel="stylesheet" href="css/libs/hljs-default.css">
      <script src="./js/libs/highlight.pack.js"></script>
    */
    this.syncProps2Attr()
  }

  connectedCallback () {
    const style = document.createElement('style')
    style.innerHTML = `
      .hljs {
        display: block;
        overflow-x: auto;
        padding: .5em;
        background: var(--bg-color);
        border: 1px solid var(--netizen-atom);
        border-radius: 5px;
      }

      .hljs *::-moz-selection {
        background-color: var(--fg-color) !important;
        color: var(--bg-color) !important;
      }

      .hljs *::selection {
        background-color: var(--fg-color) !important;
        color: var(--bg-color) !important;
      }

      pre.hljs > code.html,
      pre.hljs > code.css,
      pre.hljs > code.javascript {
        background-color: transparent !important;
        color: var(--netizen-text);
      }

      .hljs-meta,
      .hljs-deletion,
      .hljs-quote,
      .hljs-doctag {
        color: var(--netizen-meta);
      }

      .hljs-code {
        color: var(--netizen-text);
      }

      .hljs-comment {
        color: var(--netizen-comment);
      }

      .hljs-tag,
      .hljs-selector-attr {
        color: var(--netizen-tag-bracket);
      }

      .hljs-selector-pseudo,
      .hljs-addition {
        color: var(--netizen-variable-3);
      }

      .hljs-name,
      .hljs-strong {
        color: var(--netizen-tag);
      }

      .hljs-attr,
      .hljs-attribute,
      .hljs-symbol,
      .hljs-regexp,
      .hljs-link {
        color: var(--netizen-attribute);
      }

      .hljs-string,
      .hljs-subst,
      .hljs-bullet,
      .hljs-section,
      .hljs-emphasis,
      .hljs-type {
        color: var(--netizen-string);
      }

      .hljs-literal {
        color: var(--netizen-string-2);
      }

      .hljs-keyword {
        color: var(--netizen-keyword);
      }

      .hljs-selector-class,
      .hljs-selector-id {
        color: var(--netizen-qualifier);
      }

      .hljs-selector-tag {
        color: var(--netizen-tag);
      }

      .hljs-built_in,
      .hljs-builtin-name {
        color: var(--netizen-variable-callee);
      }

      .hljs-number {
        color: var(--netizen-number);
      }

      .hljs-title {
        color: var(--netizen-def);
      }

      .css .hljs-attribute {
        color: var(--netizen-property);
      }

      .javascript .hljs-built_in,
      .hljs-variable,
      .hljs-template-tag,
      .hljs-template-variable {
        color: var(--netizen-variable);
      }
    `
    this.appendChild(style)
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    pre.appendChild(code)
    this.appendChild(pre)
    this.updateExample()
    hljs.highlightBlock(pre)
  }

  updateExample (code, lang) {
    // if (this._delayRetry) clearTimeout(this._delayRetry)
    // if (!this.querySelector('pre')) {
    //   console.log('not ready');
    //   this._delayRetry = setTimeout(() => this.updateExample(code, lang), 250)
    //   return
    // }
    if (code) this.code = code
    if (lang) this.lang = lang
    const setLang = typeof this.lang === 'string' && this.lang.length > 0
    const setCode = typeof this.code === 'string' && this.code.length > 0
    this.querySelector('pre').className = setLang ? `hljs ${this.lang}` : 'hljs xml'
    const ele = this.querySelector('code')
    ele.className = setLang ? this.lang : 'html'
    ele.textContent = setCode ? this.code : '<p>hello world</p>'
    hljs.highlightBlock(this.querySelector('pre'))
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

window.customElements.define('code-example', CodeExample)
