/* global HTMLElement nn */
class CodeSlider extends HTMLElement {
  constructor () {
    super()
    this.syncProps2Attr()
  }

  connectedCallback (opts) {
    this.innerHTML = `
    <div class="code-slider">
      <span class="code-slider__label"
        style="padding-right: ${this.label.length > 0 ? '20px' : '0'};">${this.label}</span>
      <div class="code-slider__bubble"></div>
      <input class="code-slider__range" type="range"
        min="${this.min}"
        max="${this.max}"
        step="${this.step}"
        value="${this.value}">
      <div class="code-slider__num">${this.value}</div>
    </div>`

    this.querySelector('input').addEventListener('input', (e) => {
      this.setAttribute('value', e.target.value)
      this.updateThumb()
      this.change(e)
    })

    this.updateThumb()
    this.querySelector('.code-slider__range').style.background = this.background

    if (typeof this.bubble !== 'undefined' && this.bubble !== 'undefined') {
      this.querySelector('.code-slider__bubble').style.background = this.bubble
    } else {
      this.querySelector('.code-slider__bubble').style.display = 'none'
      this.querySelector('.code-slider__label').style.top = '15px'
    }

    this.ele = this.querySelector('.code-slider')
  }

  change () {
    // this gets assigned in widgets/index.js createSlider method
  }

  updateThumb (v, t) {
    if (typeof v !== 'undefined') this.value = v
    const w = parseInt(this.querySelector('.code-slider__range').style.width) || 255
    const min = parseFloat(this.min)
    const max = parseFloat(this.max)
    const p = nn.map(parseFloat(this.value), min, max, 3, w - 3)
    this.querySelector('.code-slider__bubble').style.left = `${p}px`
    this.querySelector('.code-slider__num').style.left = `${p}px`
    if (t === 'hex' || t === 'HEX') {
      let val = (min === 0 && max === 1)
        ? Math.round(nn.map(parseFloat(v), 0, 1, 0, 255)).toString(16)
        : parseInt(v).toString(16)
      if (t === 'HEX') val = val.toUpperCase()
      this.querySelector('.code-slider__num').textContent = val
    } else this.querySelector('.code-slider__num').textContent = this.value
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
      this.querySelector('.code-slider__range').style.background = newVal
    } else if (attrName === 'bubble') {
      this.querySelector('.code-slider__bubble').style.background = newVal
    }
  }
}

window.customElements.define('code-slider', CodeSlider)
