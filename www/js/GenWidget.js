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
  connectedCallback (opts) {
    this.innerHTML = `<div>
        <button>insert</button>
        <input type="text">
    </div>`

    this.input = this.querySelector('input')
    this.insertButton = this.querySelector('button')

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

class GenWidget extends Widget {
  constructor (opts) {
    super(opts)
    console.log('genwidget constructed')
  }

  createCodeField (opts) {
    const el = document.createElement('code-field')
    el.setAttribute('value', '12')
    el.value = 13
    el.change = opts.change

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
    const parsedCode = {
      property: 'css-property',
      value: ['13.37px']
    }
    const regExp = /\(([^)]+)\)/g
    let matches = regExp.exec(string)
    const line = string.split(':')
    parsedCode.property = line[0]

    if (matches) {
      const funcs = line[1].split(' ')
        .filter(item => item.includes('('))
        .map(item => item.split('(')[0])

      matches = matches.map((item) => {
        item.replace(/[()]/g, '')
        return item.split(',')
      })
      console.log(matches)
      matches.forEach((item, index) => {
        item.unshift(funcs[index])
      })
      parsedCode.value = matches
    } else {
      line[1] = line[1].split(' ')
      const valueArr = line[1].filter(el => el.trim().length > 0)
      parsedCode.value = valueArr
    }

    return parsedCode
  }
}

window.GenWidget = GenWidget
