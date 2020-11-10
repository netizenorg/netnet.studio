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
    this.innerHTML = `
    <style>
      #__code-slider-range > input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        height: 10px;
        border-radius: 5px;
        outline: none;
        border: 1px solid var(--netizen-meta);
      }

      #__code-slider-range > input::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 4px;
        height: 24px;
        background: #fff;
        cursor: pointer;
        border-radius: 5px;
      }

      #__code-slider-range > input::-moz-range-thumb {
        width: 4px;
        height: 24px;
        background: #fff;
        cursor: pointer;
        border-radius: 5px;
      }
    </style>

    <div>
        <span id='__code-slider-label'style='margin-right:20px;'>${this.label || ''}</span>
        <input id='__code-slider-range' type='range'
          min=${this.min || 1}
          max=${this.max || 100}
          step=${this.step || 1}
          value=${this.value || 50}>
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
    this.innerHTML = `<div>
        <button>insert</button>
        <input type="text">
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

class GenWidget extends Widget {
  createCodeField (opts) {
    const el = document.createElement('code-field')
    el.value = opts.value
    el.change = opts.change

    return el
  }

  createSlider (opts) {
    const el = document.createElement('code-slider')
    el.value = opts.value
    el.change = opts.change
    el.min = opts.min
    el.max = opts.max
    el.step = opts.step
    el.label = opts.label
    el.bubble = opts.bubble
    el.background = opts.background

    // if bubble is undefined, div is hidden
    // background is a string defined by user

    return el
  }
  // createSlider (opts) {
  //   const el = document.createElement('div')
  //   el.className = 'gen-slider-div'
  //
  //   const slider = document.createElement('input')
  //   slider.setAttribute('type', 'range')
  //   slider.setAttribute('min', opts.min || '1')
  //   slider.setAttribute('max', opts.max || '100')
  //   slider.setAttribute('step', opts.step || '1')
  //   slider.setAttribute('value', opts.value || '50')
  //   slider.className = 'gen-slider'
  //   slider.addEventListener('input', function (e) {
  //     // el.setAttribute('value', slider.value)
  //     // console.log(slider.value)
  //     opts.change(e)
  //   })
  //   const label = document.createElement('span')
  //   label.style.margin = '0px 20px 0px 0px'
  //   label.innerHTML = opts.label || ''
  //   label.className = 'gen-slider-label'
  //
  //   const bubble = document.createElement('div')
  //   bubble.style = 'width: 15px;height: 15px;border-radius: 50%;border: 2px solid var(--netizen-meta);transform: translate(-7px,17px);position: relative;left: 127px;'
  //   bubble.className = 'gen-slider-bubble'
  //
  //   el.appendChild(label)
  //   el.appendChild(slider)
  //
  //   return el
  // }

  parceCSS (string) {
    const parsedCode = {
      property: 'css-property',
      value: ['13.37px']
    }
    const regExp = /\(([^)]+)\)/g
    let matches = string.match(regExp)
    const line = string.split(':')
    parsedCode.property = line[0]

    if (matches) {
      const funcs = line[1].split(' ')
        .filter(item => item.includes('('))
        .map(item => item.split('(')[0])

      matches = matches.map((item) => {
        item = item.replace(/[()]/g, '')
        return item.split(',')
      })
      matches.forEach((item, index) => {
        item.unshift(funcs[index])
      })
      parsedCode.value = matches
    } else {
      line[1] = line[1].split(' ')
      const valueArr = line[1]
        .filter(el => el.trim().length > 0)
        .map(el => el.replace(';', ''))
      parsedCode.value = valueArr
    }

    return parsedCode
  }
}

window.GenWidget = GenWidget
