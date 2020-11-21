/* global HTMLElement NNE Maths */
/*
  -----------
     info
  -----------

  These custom elements are used by the base Widget class specifically for
  creating CSS generator widgets that make use of <code-field> and
  <code-slider> elements

*/
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
      :root {
        --__code-slider-bg: var(--netizen-meta);
        --__code-slider-bubble-bg: #fff;
      }

      .__code-slider-parent {
        /* TODO width property/attribute maybe */
        width: 255px;
      }

      .__code-slider-bubble {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid var(--netizen-meta);
        transform: translate(-8px, -4px);
        position: relative;
        left: 127px;
        background: var(--__code-slider-bubble-bg);
      }

      .__code-slider-label {
        position: absolute;
        left: 15px;
        top: 38px;
        font-size: 10px;
      }

      .__code-slider-range {
        -webkit-appearance: none;
        width: 100%;
        height: 10px;
        border-radius: 5px;
        outline: none;
        border: 1px solid var(--netizen-meta);
        background: var(--__code-slider-bg);
      }

      .__code-slider-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 4px;
        height: 24px;
        background: #fff;
        cursor: pointer;
        border-radius: 5px;
      }

      .__code-slider-range::-moz-range-thumb {
        width: 4px;
        height: 24px;
        background: #fff;
        cursor: pointer;
        border-radius: 5px;
      }

      .__code-slider-num {
        color: var(--netizen-meta);
        transform: translate(-12px, -12px);
        text-align: center;
        position: relative;
        width: 27px;
        left: 127px;
      }

    </style>

    <div class="__code-slider-parent">
      <span class="__code-slider-label"
        style="padding-right: ${this.label.length > 0 ? '20px' : '0'};">${this.label}</span>
      <div class="__code-slider-bubble"></div>
      <input class="__code-slider-range" type="range"
        min="${this.min}"
        max="${this.max}"
        step="${this.step}"
        value="${this.value}">
      <div class="__code-slider-num">${this.value}</div>
    </div>`

    this.querySelector('input').addEventListener('input', (e) => {
      this.setAttribute('value', e.target.value)
      this.thumbUpdate()
      this.change(e)
    })

    this.thumbUpdate()
    this.updateColors(this.background, this.bubble)
  }

  change () {
    // this gets assigned in Widget.js createSlider method
  }

  thumbUpdate (v) {
    const w = parseInt(this.querySelector('.__code-slider-range').style.width) || 255
    const min = parseInt(this.min)
    const max = parseInt(this.max)
    const p = Maths.map(parseInt(this.value), min, max, 4, w - 4)
    this.querySelector('.__code-slider-bubble').style.left = `${p}px`
    this.querySelector('.__code-slider-num').style.left = `${p}px`
    this.querySelector('.__code-slider-num').textContent = this.value
  }

  updateColors (slider, bubble) {
    if (slider) {
      document.documentElement.style
        .setProperty('--__code-slider-bg', slider)
    }
    if (bubble) {
      document.documentElement.style
        .setProperty('--__code-slider-bubble-bg', bubble)
    }
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

  static get observedAttributes () {
    return ['value', 'min', 'max', 'step', 'label', 'bubble', 'background']
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (newVal !== oldVal) this[attrName] = newVal

    if (!this.querySelector('input')) return

    if (attrName === 'label') {
      this.querySelector('span').innerHTML = newVal
    } else if (['value', 'min', 'max', 'step'].includes(attrName)) {
      this.querySelector('input')[attrName] = newVal
    } else if (attrName === 'background') {
      this.updateColors(newVal)
    } else if (attrName === 'bubble') {
      this.updateColors(null, newVal)
    }
  }
}

window.customElements.define('code-slider', CodeSlider)

class CodeField extends HTMLElement {
  connectedCallback (opts) {
    this.innerHTML = `<style>
      .__code-field{
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
        <input class='__code-field' type="text">
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

  change () {
    // this gets assigned in Widget.js createCodeField method
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
