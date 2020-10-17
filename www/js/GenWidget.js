/* global Widget, NNE, HTMLElement */
/*
  -----------
     info
  -----------

  This Code Generator Widget extends the base Widget class to add methods
  for more easily creating CSS generator Widgets.

  -----------
     usage
  -----------

  // this class inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js to see what those are
  // or take a look at the wiki...
  // https://github.com/netizenorg/netnet.studio/wiki/Creating-Widgets

  this.codeField = this.createCodeField({
    value: 'font-size 24px;',
    change: (e) => this._codeFieldUpdate(e)
  })

  this.slider = w.createSlider({
    background: '#f00',
    min: 0,
    max: 100,
    label: 'PX'
    change: (e) => this._fontSliderUpdate(e)
  })

*/
class CodeField extends HTMLElement {
  connectedCallback () {
    this.innerHTML = `<div>
        <button>insert</button>
        <input type="text">
    </div>`
  }

  get value () {
    return this.getAttribute('value')
  }

  set value (val) {
    this.setAttribute('value', val)
  }

  static get observedAttributes () {
    return ['value']
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (newVal !== oldVal) this[attrName] = newVal
  }
}

window.customElements.define('code-field', CodeField)

class GenWidget extends Widget {
  constructor (opts) {
    super(opts)
    console.log('genwidget constructed')
    this.observer = new window.MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          console.log(mutation)
          if (mutation.attributeName === 'value' &&
          mutation.target === this.codeField &&
          this.codeField.value !== this.codeField.children[0].value) {
            this.codeField.children[0].value = this.codeField.value
            console.log(this.codeField.value)
            console.log(this.codeField.children[0].value)
          }
        }
      })
    })
  }

  createCodeField (opts) {
    const el = document.createElement('code-field')
    el.className = 'gen-code-field-element'
    this.codeField = el
    el.setAttribute('value', '12')
    this.observer.observe(el, {
      attributes: true
    })
    // const input = el.children[0].querySelector('input')
    // const insertButton = el.children[0].querySelector('button')
    //
    // insertButton.addEventListener('click', () => {
    //   NNE.cm.replaceSelection(input.value)
    // })

    return el
  }

  createSlider (opts) {
    const el = document.createElement('div')
    el.className = 'gen-slider-div'

    const slider = document.createElement('input')
    slider.setAttribute('type', 'range')
    slider.setAttribute('min', opts.min || '1')
    slider.setAttribute('max', opts.max || '100')
    slider.setAttribute('step', opts.step || '1')
    slider.setAttribute('value', opts.value || '50')
    slider.className = 'gen-slider'
    slider.addEventListener('input', function (e) {
      // el.setAttribute('value', slider.value)
      // console.log(slider.value)
      opts.change(e)
    })
    const label = document.createElement('span')
    label.innerHTML = opts.label || ''
    label.className = 'gen-slider-label'

    const bubble = document.createElement('div')
    bubble.style = 'width: 15px;height: 15px;border-radius: 50%;border: 2px solid var(--netizen-meta);transform: translate(-7px,17px);position: relative;left: 127px;'
    bubble.className = 'gen-slider-bubble'

    el.appendChild(slider)
    el.appendChild(label)
    return el
  }

  parceCSS (string) {
    const parsedCode = { property: 'css-property', value: ['10px'] }
    if (hasColon(string)) {
      const line = string.split(':')
      line[1] = line[1].split(' ')
      const valueArr = line[1].filter(el => el.trim().length > 0)
      console.log(valueArr)
      parsedCode[line[0]] = valueArr
      console.log(parsedCode)
      return parsedCode
    } else {
      return parsedCode
    }

    function hasColon (str) {
      const colon = new RegExp(':')
      return colon.test(str)
    }
  }
}

window.GenWidget = GenWidget
