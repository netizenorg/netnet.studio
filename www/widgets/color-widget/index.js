/* global Widget, NNW, NNE, Convo, nn, utils */
class ColorWidget extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'color-widget'
    this.keywords = ['color', 'colour', 'rgb', 'hsv', 'hsl', 'hex', 'hue']

    this.resizable = false
    this.title = 'Color Widget'

    this._SubWin = 'hsl'
    const clr = utils.getVal('--netizen-tag')
    const hsl = nn.hex2hsl(clr)
    this.hue = hsl.h
    this.sat = hsl.s
    this.lit = hsl.l
    const rgb = nn.hex2rgb(clr)
    this.red = rgb.r
    this.green = rgb.g
    this.blue = rgb.b
    this.alpha = 1

    this._createHTML()

    this.on('open', () => {
      window.convo = new Convo({
        content: 'The color widget helps you create color codes to inject into your project. It will insert code wherever your cursor is placed, or replace code you currently have highlighted/selected.'
      })

      const color = NNE.cm.getSelection().toLowerCase()
      const c = nn.colorMatch(color)
      const k = NNE.edu.css.colors[color]
      if (c) {
        this.updateColor(c)
        this._changeSubWin(c[0])
      } else if (k) {
        const o = nn.colorMatch(k.rgb)
        this.updateColor(o)
        this._changeSubWin('rgb')
      }
    })

    NNE.on('edu-info', (e) => {
      const clrs = ['rgb', 'rgba', 'hsl', 'hsla']
      let s = e.data.toLowerCase()
      if (e.type === 'keyword' && NNE.edu.css.colors[e.data]) {
        s = NNE.edu.css.colors[e.data].rgb
      }
      const c = nn.colorMatch(s)
      if (c) {
        this._changeSubWin(c[0])
        this.updateColor(c)
      } else if (clrs.includes(s)) {
        setTimeout(() => {
          // give CSSReference time to re-select entire color string
          // && then check again...
          const sel = NNE.cm.getSelection().toLowerCase()
          const c = nn.colorMatch(sel)
          if (c) {
            this._changeSubWin(c[0])
            this.updateColor(c)
          }
        }, 200)
      }
    })
  }

  updateColor (c) {
    if (typeof c === 'string') c = nn.colorMatch(c.toLowerCase())
    if (c && c !== null) {
      if (c[2]) c[2] = Number(c[2]) || parseInt(c[2])
      if (c[3]) c[3] = Number(c[3]) || parseInt(c[3])
      if (c[4]) c[4] = Number(c[4]) || parseInt(c[4])
      if (c[0] === 'hex') {
        const rgb = nn.hex2rgb(c[1])
        this.red = rgb.r
        this.green = rgb.g
        this.blue = rgb.b
        if (c[1].length === 9) this.alpha = c[1].substring(7, 9)
        else if (c[1].length === 5) this.alpha = c[1].substring(4, 5)
        else this.alpha = 1
        this.alpha = this.alpha === 1 ? 1 : nn.hex2alpha(this.alpha)
        this._SubWin = 'hex'
        this._updateRGB()
      } else if (c[0] === 'rgb') {
        this.red = c[2]
        this.green = c[3]
        this.blue = c[4]
        this.alpha = c[5]
        this._SubWin = 'rgb'
        this._updateRGB()
      } else if (c[0] === 'hsl') {
        this.hue = c[2]
        this.sat = c[3]
        this.lit = c[4]
        this.alpha = c[5]
        this._SubWin = 'hsl'
        this._updateHSL()
      }
    } else {
      if (this._SubWin === 'hsl') this._updateHSL()
      else this._updateRGB()
    }
  }

  _updateHSL () {
    this.alpha = Math.floor(this.alpha * 100) / 100

    const clr = this.alpha < 1
      ? `hsla(${this.hue}, ${this.sat}%, ${this.lit}%, ${this.alpha})`
      : `hsl(${this.hue}, ${this.sat}%, ${this.lit}%)`
    document.documentElement.style.setProperty('--clr-wig-composite', clr)

    this.hueSlider.bubble = `hsl(${this.hue}, 100%, 50%)`
    this.hueSlider.updateThumb(this.hue)

    const satbg = `linear-gradient(to left, hsl(${this.hue}, 100%, 50%), white)`
    this.satSlider.background = satbg
    const satlit = nn.map(this.sat, 0, 100, 100, 50)
    this.satSlider.bubble = `hsl(${this.hue}, ${this.sat}%, ${satlit}%)`
    this.satSlider.updateThumb(this.sat)

    const byte = nn.map(this.lit, 0, 100, 0, 255)
    this.litSlider.bubble = `rgb(${byte}, ${byte}, ${byte})`
    this.litSlider.updateThumb(this.lit)

    const opac = `linear-gradient(to left, hsl(${this.hue}, ${this.sat}%, ${this.lit}%), #fff0)`
    this.alphaSlider.bubble = clr
    this.alphaSlider.background = opac
    this.alphaSlider.updateThumb(this.alpha)
    this.alphaSlider.ele.style.opacity = this.alpha < 1 ? 1 : 0.33

    this.hslField.value = clr
    this.hslField.ele.querySelector('input').style.background = 'var(--netizen-meta)'
  }

  _updateRGB () {
    // const isHex = this._SubWin === 'hex' ? 'hex' : null
    const clr = this.alpha < 1
      ? `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
      : `rgb(${this.red}, ${this.green}, ${this.blue})`
    document.documentElement.style.setProperty('--clr-wig-composite', clr)

    this.redSlider.bubble = `rgb(${this.red}, 0, 0)`
    this.redSlider.updateThumb(this.red, this._SubWin)

    this.greenSlider.bubble = `rgb(0, ${this.green}, 0)`
    this.greenSlider.updateThumb(this.green, this._SubWin)

    this.blueSlider.bubble = `rgb(0, 0, ${this.blue})`
    this.blueSlider.updateThumb(this.blue, this._SubWin)

    const opac = `linear-gradient(to left, rgb(${this.red}, ${this.green}, ${this.blue}), #fff0)`
    this.alphaSlider.bubble = clr
    this.alphaSlider.background = opac
    this.alphaSlider.updateThumb(this.alpha, this._SubWin)
    this.alphaSlider.ele.style.opacity = this.alpha < 1 ? 1 : 0.33

    this.rgbField.value = clr
    this.rgbField.ele.querySelector('input').style.background = 'var(--netizen-meta)'

    this.hexField.value = this.alpha < 1
      ? nn.rgb2hex(this.red, this.green, this.blue) + nn.alpha2hex(this.alpha)
      : nn.rgb2hex(this.red, this.green, this.blue)
    this.hexField.ele.querySelector('input').style.background = 'var(--netizen-meta)'
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods

  _changeSubWin (type) {
    // highlight button
    this.$('.clr-wig__sub-btn').forEach(b => {
      b.style.color = null; b.style.backgroundColor = null
    })
    const ele = type === 'hsl'
      ? this.$('.clr-wig__sub-btn')[0]
      : type === 'rgb'
        ? this.$('.clr-wig__sub-btn')[1]
        : this.$('.clr-wig__sub-btn')[2]
    ele.style.color = 'var(--bg-color)'
    ele.style.backgroundColor = 'var(--netizen-match-color)'

    // syncronize colors
    if (type === 'hsl' && this._SubWin !== type) {
      const hsl = nn.rgb2hsl(this.red, this.green, this.blue)
      this.hue = hsl.h
      this.sat = hsl.s
      this.lit = hsl.l
    } else if (type !== 'hsl' && this._SubWin === 'hsl') {
      const rgb = nn.hsl2rgb(this.hue, this.sat, this.lit)
      this.red = rgb.r
      this.green = rgb.g
      this.blue = rgb.b
    }
    this._SubWin = type

    // toggle appropriate sliders / fields
    const types = ['hsl', 'rgb', 'hex']
    types.forEach(t => { this[t + 'Field'].ele.style.display = 'none' })
    this[type + 'Field'].ele.style.display = 'block'
    // ...
    const hsls = ['hue', 'sat', 'lit']
    const rgbs = ['red', 'green', 'blue']
    if (type === 'hsl') {
      hsls.forEach(t => { this[t + 'Slider'].ele.style.display = 'block' })
      rgbs.forEach(t => { this[t + 'Slider'].ele.style.display = 'none' })
    } else {
      hsls.forEach(t => { this[t + 'Slider'].ele.style.display = 'none' })
      rgbs.forEach(t => { this[t + 'Slider'].ele.style.display = 'block' })
    }
    this.updateColor()
  }

  _createHTML () {
    this.innerHTML = `<div class="clr-row1">
        <!-- <div id="clr-wig-sample"></div> -->
        <div>
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 200 200" style="enable-background:new 0 0 200 200;" xml:space="preserve" class="clr-wig-svg">
            <g>
              <path class="clr-wig-svg-text" d="M100.28,0c27.93,0,51.49,9.79,70.7,29.35c19.2,19.57,28.81,43.63,28.81,72.18c0,18.79-5.81,36.85-17.44,54.19
                c-8.93,13.39-20.84,24.01-35.74,31.84c-14.9,7.84-30.65,11.76-47.26,11.76c-26.99,0-50.3-9.86-69.92-29.59
                C9.81,150.02,0,126.6,0,99.51c0-14.12,3.11-27.87,9.34-41.27s14.79-24.81,25.69-34.26C53.51,8,75.26,0,100.28,0z M100.28,12.93
                c-24.29,0-44.87,8.38-61.74,25.15c-16.87,16.77-25.3,37.19-25.3,61.28l86.74,0.47L100.28,12.93z"/>
            </g>
          </svg>
          <div id="clr-wig-codes">
            <!-- INJECT CODE FILEDS HERE -->
          </div>
        </div>
        <div>
          <div class="clr-wig-type-opts">
            <button class="clr-wig__sub-btn pill-btn pill-btn--secondary">hsl</button>
            <button class="clr-wig__sub-btn pill-btn pill-btn--secondary">rgb</button>
            <button class="clr-wig__sub-btn pill-btn pill-btn--secondary">hex</button>
          </div>
          <div id="clr-wig-sliders">
            <!-- INJECT CODE SLIDERS HERE -->
          </div>
        </div>
      </div>
    `

    this.$('.clr-wig__sub-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this._changeSubWin(e.target.textContent)
      })
    })

    // code fields -------------------------------------------------------------

    const fieldUpdate = (e) => {
      const c = nn.colorMatch(e.target.value.toLowerCase())
      if (c) {
        this.updateColor(c)
        e.target.style.background = 'var(--netizen-meta)'
      } else { e.target.style.background = 'red' }
    }

    this.hexField = this.createCodeField({
      value: nn.hsl2hex(this.hue, this.sat, this.lit),
      change: (e) => fieldUpdate(e)
    })

    const rgb = nn.hsl2rgb(this.hue, this.sat, this.lit)
    this.rgbField = this.createCodeField({
      value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      change: (e) => fieldUpdate(e)
    })

    this.hslField = this.createCodeField({
      value: `hsl(${this.hue}, ${this.sat}%, ${this.lit}%)`,
      change: (e) => fieldUpdate(e)
    })

    this.$('#clr-wig-codes').appendChild(this.hexField)
    this.$('#clr-wig-codes').appendChild(this.rgbField)
    this.$('#clr-wig-codes').appendChild(this.hslField)

    // sliders -----------------------------------------------------------------

    this.hueSlider = this.createSlider({
      label: 'Hue',
      background: 'linear-gradient(to left, red, #f0f, blue, cyan, #0f0, yellow, red)',
      min: 0,
      max: 360,
      change: (e) => { this.hue = Number(e.target.value); this.updateColor() }
    })

    this.satSlider = this.createSlider({
      label: 'Saturation',
      background: `linear-gradient(to left, hsl(${this.hue}, 100%, 50%), white)`,
      min: 0,
      max: 100,
      change: (e) => { this.sat = Number(e.target.value); this.updateColor() }
    })

    this.litSlider = this.createSlider({
      label: 'Lightness',
      background: 'linear-gradient(to left, white, black)',
      min: 0,
      max: 100,
      change: (e) => { this.lit = Number(e.target.value); this.updateColor() }
    })

    this.redSlider = this.createSlider({
      label: 'Red',
      background: 'linear-gradient(to left, #f00, transparent)',
      min: 0,
      max: 255,
      change: (e) => { this.red = Number(e.target.value); this.updateColor() }
    })

    this.greenSlider = this.createSlider({
      label: 'Green',
      background: 'linear-gradient(to left, #0f0, transparent)',
      min: 0,
      max: 255,
      change: (e) => { this.green = Number(e.target.value); this.updateColor() }
    })

    this.blueSlider = this.createSlider({
      label: 'Blue',
      background: 'linear-gradient(to left, #00f, transparent)',
      min: 0,
      max: 255,
      change: (e) => { this.blue = Number(e.target.value); this.updateColor() }
    })

    this.alphaSlider = this.createSlider({
      label: 'Alpha (transparency)',
      background: `linear-gradient(to left, hsl(${this.hue}, ${this.sat}%, ${this.lit}%), #fff0)`,
      min: 0,
      max: 1,
      step: 0.01,
      change: (e) => { this.alpha = Number(e.target.value); this.updateColor() }
    })

    this.$('#clr-wig-sliders').appendChild(this.hueSlider)
    this.$('#clr-wig-sliders').appendChild(this.satSlider)
    this.$('#clr-wig-sliders').appendChild(this.litSlider)
    this.$('#clr-wig-sliders').appendChild(this.redSlider)
    this.$('#clr-wig-sliders').appendChild(this.greenSlider)
    this.$('#clr-wig-sliders').appendChild(this.blueSlider)
    this.$('#clr-wig-sliders').appendChild(this.alphaSlider)

    // -------------------------------------------------------------------------

    this._changeSubWin('hsl')
    this.updateColor()

    window.addEventListener('mousemove', () => {
      const r = NNW.menu.ele
        .querySelector('#face > span:nth-child(1) > svg').style.transform
      this.$('svg').style.transform = r
    })
  }
}

window.ColorWidget = ColorWidget
