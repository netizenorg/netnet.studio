/* global Widget, NNE */
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
class GenWidget extends Widget {
  constructor (opts) {
    super(opts)
    console.log('genwidget constructed')
  }

  createCodeField (opts) {
    const el = document.createElement('div')
    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.addEventListener('change', (e) => opts.change(e))

    const insertButton = document.createElement('button')
    insertButton.setAttribute('type', 'button')
    insertButton.appendChild(document.createTextNode('insert'))
    insertButton.addEventListener('click', insert())
    function insert () {
      NNE.cm.replaceSelection(input.value)
    }

    el.appendChild(input)
    el.appendChild(insertButton)
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
    slider.addEventListener('change', function (e) {
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

  parseCSS (string) {
    const parsedCode = {}
    const line = string.split(':')
    line[1] = line[1].split(' ')
    parsedCode.line[0] = line[1]
    return parsedCode
  }
}

window.GenWidget = GenWidget
