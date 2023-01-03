/* global HTMLElement nn */
class CodeSlider extends HTMLElement {
  constructor () {
    super()
    this.syncProps2Attr()
  }

  connectedCallback (opts) {
    this.innerHTML = `<style>
      .__code-slider-parent {
        /* TODO width property/attribute maybe */
        position: relative;
        width: 255px;
      }

      .__code-slider-bubble {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid var(--netizen-meta);
        transform: translate(-8px, -4px);
        position: relative;
        left: 127px;
        background: #fff;
      }

      .__code-slider-label {
        position: absolute;
        left: 0px;
        top: 30px;
        font-size: 10px;
        margin-top: 0 !important;
      }

      .__code-slider-range {
        -webkit-appearance: none;
        width: 100%;
        height: 10px;
        border-radius: 5px;
        outline: none;
        border: 1px solid var(--netizen-meta);
        background: var(--netizen-meta);
      }

      .__code-slider-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 6px;
        height: 24px;
        background: #fff;
        cursor: pointer;
        border-radius: 5px;
        border: 1px solid var(--netizen-meta);
      }

      .__code-slider-range::-moz-range-thumb {
        width: 6px;
        height: 24px;
        background: #fff;
        cursor: pointer;
        border-radius: 5px;
        border: 1px solid var(--netizen-meta);
      }

      .__code-slider-num {
        color: var(--netizen-meta);
        transform: translate(-14px, 3px);
        text-align: center;
        position: relative;
        width: 27px;
        left: 127px;
        margin-top: 0 !important;
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
      this.updateThumb()
      this.change(e)
    })

    this.updateThumb()
    this.querySelector('.__code-slider-range').style.background = this.background

    if (typeof this.bubble !== 'undefined' && this.bubble !== 'undefined') {
      this.querySelector('.__code-slider-bubble').style.background = this.bubble
    } else {
      this.querySelector('.__code-slider-bubble').style.display = 'none'
      this.querySelector('.__code-slider-label').style.top = '15px'
    }

    this.ele = this.querySelector('.__code-slider-parent')
  }

  change () {
    // this gets assigned in Widget.js createSlider method
  }

  updateThumb (v, t) {
    if (typeof v !== 'undefined') this.value = v
    const w = parseInt(this.querySelector('.__code-slider-range').style.width) || 255
    const min = parseFloat(this.min)
    const max = parseFloat(this.max)
    const p = nn.map(parseFloat(this.value), min, max, 3, w - 3)
    this.querySelector('.__code-slider-bubble').style.left = `${p}px`
    this.querySelector('.__code-slider-num').style.left = `${p}px`
    if (t === 'hex' || t === 'HEX') {
      let val = (min === 0 && max === 1)
        ? Math.round(nn.map(parseFloat(v), 0, 1, 0, 255)).toString(16)
        : parseInt(v).toString(16)
      if (t === 'HEX') val = val.toUpperCase()
      this.querySelector('.__code-slider-num').textContent = val
    } else this.querySelector('.__code-slider-num').textContent = this.value
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
      this.updateThumb()
    } else if (attrName === 'background') {
      this.querySelector('.__code-slider-range').style.background = newVal
    } else if (attrName === 'bubble') {
      this.querySelector('.__code-slider-bubble').style.background = newVal
    }
  }
}

window.customElements.define('code-slider', CodeSlider)
