/* global HTMLElement NNE */
class CodeField extends HTMLElement {
  connectedCallback (opts) {
    this.innerHTML = `<div>
        <button class="pill-btn pill-btn--secondary">insert</button>
        <input class="code-field" type="text">
    </div>`
    this.querySelector('input').value = this.value

    this.querySelector('button').addEventListener('click', () => {
      const val = this.querySelector('input').value
      this.from = NNE.cm.getCursor('from')
      this.to = NNE.cm.getCursor('to')
      NNE.cm.replaceSelection(val)
      const t = { line: this.to.line, ch: this.from.ch + val.length }
      NNE.cm.setSelection(this.from, t)
    })

    this.querySelector('input').addEventListener('change', (e) => {
      this.setAttribute('value', e.target.value)
      this.change(e)
    })

    this.querySelector('input').addEventListener('input', (e) => {
      this.update(e)
    })

    if (this.readonly !== '250px') {
      this.querySelector('input').setAttribute('readonly', true)
    }

    this.ele = this.querySelector('div')
  }

  change () {
    // this gets assigned in widgets/index.js createCodeField method
  }

  update () {
    // this gets assigned in widgets/index.js createCodeField method
  }

  get value () {
    return this.getAttribute('value')
  }

  set value (val) {
    this.setAttribute('value', val)
    const input = this.querySelector('input')
    if (input) {
      input.value = val
    }
  }

  static get observedAttributes () {
    return ['value']
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (newVal !== oldVal) this[attrName] = newVal
  }
}

window.customElements.define('code-field', CodeField)
