/* global HTMLElement NNE */
class CodeSlider extends HTMLElement {
  constructor () {
    super()
    this.syncProps2Attr()
  }

  connectedCallback (opts) {
    const label = document.createElement('span')
    // label.style.margin = '0px 20px 0px 0px'
    label.innerHTML = this.label || ''
    label.className = 'gen-slider-label'
    this.innerHTML = `<style>
      .__code-slider-bubble {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        border: 2px solid var(--netizen-meta);
        transform: translate(-7px,17px);
        position: relative;
        left: 127px;
      }
      .__code-slider-num {
        color: var(--netizen-meta);
        transform: translate(-12px, 5px);
        text-align: center;
        position: relative;
        width: 27px;
        left: 127px;
      }
      .__code-slider-range {
        -webkit-appearance: none;
        /* width: 100%; */
        width: 255px;
        height: 10px;
        border-radius: 5px;
        outline: none;
        border: 1px solid var(--netizen-meta);
      }

      .__code-slider-range ::-webkit-slider-thumb >input{
        -webkit-appearance: none;
        appearance: none;
        width: 4px;
        height: 24px;
        background: #fff;
        cursor: pointer;
        border-radius: 5px;
      }

      .__code-slider-range ::-moz-range-thumb >input{
        -webkit-appearance: none;
        appearance: none;
        width: 4px;
        height: 24px;
        background: #fff;
        cursor: pointer;
        border-radius: 5px;
      }
    </style>

    <div>
    <div class="__code-slider-bubble"></div>
        <span class='__code-slider-label'style='margin-right:20px;'>${this.label || ''}</span>
        <input class='__code-slider-range' type='range'
          min=${this.min || 1}
          max=${this.max || 100}
          step=${this.step || 1}
          value=${this.value || 50}>
        <div id="clr-wig-val-num" class="clr-wig-num">50</div>
    </div>`

    this.querySelector('input').addEventListener('input', (e) => {
      this.setAttribute('value', e.target.value)
      this.change(e)
    })
  }

  syncProps2Attr () {
    if (this.constructor.observedAttributes &&
      this.constructor.observedAttributes.length) {
      this.constructor.observedAttributes.forEach(attr => {
        Object.defineProperty(this, attr, {
          get () { return this.getAttribute(attr) },
          set (v) {
            console.log(attr, v)
            if (v) this.setAttribute(attr, v)
            else this.removeAttribute(attr)
          }
        })
      })
    }
  }

  static get observedAttributes () {
    return ['value', 'min', 'max', 'step', 'label']
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (newVal !== oldVal) this[attrName] = newVal
    if (attrName === 'value') {
      this.querySelector('input').value = newVal
    } else if (attrName === 'label') {
      this.querySelector('span').innerHTML = newVal
    }
    // change position of bubble here
    // if the user decides to change min or max, listen for attrName === min, etc, make sure that the attribute changes to match
  }
}

window.customElements.define('code-slider', CodeSlider)

class CodeField extends HTMLElement {
  connectedCallback (opts) {
    this.innerHTML = `<style>
      .__code-slider-codes{
        background-color: var(--netizen-meta);
        font-family: monospace;
        color: var(--netizen-hint-color);
        padding: 6px;
        border: none;
        margin: 6px;
        width: 250px;
        border-radius: 5px;
      }
    </style>
    <div>
        <button>insert</button>
        <input class='__code-slider-codes' type="text">
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

    this.querySelector('input').addEventListener('input', (e) => {
      this.setAttribute('value', e.target.value)
      this.change(e)
    })
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
