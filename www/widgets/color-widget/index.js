/* global Widget, WIDGETS, NNE, NNW, Convo, nn, utils */
class ColorWidget extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'color-widget'
    this.keywords = ['color', 'colour', 'rgb', 'hsv', 'hsl', 'hex', 'hue']

    this.resizable = false
    this.title = 'Color Widget'

    this._SubWin = 'hsl'
    const clr = utils.getVal('--netizen-tag')
    const hsl = nn.toHSL(clr)
    this.hue = hsl.h
    this.sat = hsl.s
    this.lit = hsl.l
    const rgb = nn.toRGB(clr)
    this.red = rgb.r
    this.green = rgb.g
    this.blue = rgb.b
    this.alpha = 1

    this._createHTML()
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
    WIDGETS['coding-menu'].on('motion-change', () => this._updateMotion())

    this.events['update-color'] = []

    this.on('open', () => {
      window.convo = new Convo({
        content: 'The color widget helps you create color codes to inject into your project. It will insert code wherever your cursor is placed, or replace code you currently have highlighted/selected.'
      })

      const color = NNE.cm.getSelection().toLowerCase()
      const c = nn.colorMatch(color)
      const k = NNE.edu.css.colors[color]
      if (c && c[0] !== 'named') {
        this.updateColor(c)
        this._changeSubWin(c[0])
      } else if (c && c[0] === 'named') {
        const named = NNE.edu.css.colors[c[1]]
        if (named) {
          const o = nn.colorMatch(named.rgb)
          if (o) { this.updateColor(o); this._changeSubWin('rgb') }
        }
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
        const rgb = nn.toRGB(c[1])
        this.red = rgb.r
        this.green = rgb.g
        this.blue = rgb.b
        if (c[1].length === 9) this.alpha = c[1].substring(7, 9)
        else if (c[1].length === 5) this.alpha = c[1].substring(4, 5)
        else this.alpha = 1
        this.alpha = this.alpha === 1 ? 1 : nn.hex2alpha(this.alpha)
        this._SubWin = 'hex'
        this._updateRGB()
      } else if (c[0] === 'rgb' || c[0] === 'rgba') {
        this.red = c[2]
        this.green = c[3]
        this.blue = c[4]
        this.alpha = c[5] !== undefined ? c[5] : 1
        this._SubWin = 'rgb'
        this._updateRGB()
      } else if (c[0] === 'hsl' || c[0] === 'hsla') {
        this.hue = c[2]
        this.sat = c[3]
        this.lit = c[4]
        this.alpha = c[5] !== undefined ? c[5] : 1
        this._SubWin = 'hsl'
        this._updateHSL()
      }
    } else {
      if (this._SubWin === 'hsl') this._updateHSL()
      else this._updateRGB()
    }
    this.emit('update-color', { r: this.red, g: this.green, b: this.blue, a: this.alpha })
  }

  _updateHSL () {
    this.alpha = Math.floor(this.alpha * 100) / 100

    const clr = this.alpha < 1
      ? `hsla(${this.hue}, ${this.sat}%, ${this.lit}%, ${this.alpha})`
      : `hsl(${this.hue}, ${this.sat}%, ${this.lit}%)`
    utils.setVal('clr-wig-composite', clr)
    const hslRgb = nn.toRGB({ h: this.hue, s: this.sat, l: this.lit })
    if (this._eyeR) this._eyeR.setAttribute('fill', `rgba(${hslRgb.r}, 0, 0, ${this.alpha})`)
    if (this._eyeG) this._eyeG.setAttribute('fill', `rgba(0, ${hslRgb.g}, 0, ${this.alpha})`)
    if (this._eyeB) this._eyeB.setAttribute('fill', `rgba(0, 0, ${hslRgb.b}, ${this.alpha})`)
    if (this._pickFill) this._pickFill.setAttribute('fill', `rgba(${hslRgb.r}, ${hslRgb.g}, ${hslRgb.b}, ${this.alpha})`)
    if (this._hslCenter) this._hslCenter.style.background = `rgba(${hslRgb.r}, ${hslRgb.g}, ${hslRgb.b}, ${this.alpha})`
    if (this._wheel) this._wheel.style.setProperty('--hue-angle', `${this.hue}deg`)

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

    if (this._faceDragging) {
      const c = `rgb(${hslRgb.r}, ${hslRgb.g}, ${hslRgb.b})`
      this._tintFaceEyes(c, null, c)
    }
  }

  _updateRGB () {
    // const isHex = this._SubWin === 'hex' ? 'hex' : null
    const clr = this.alpha < 1
      ? `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
      : `rgb(${this.red}, ${this.green}, ${this.blue})`
    utils.setVal('clr-wig-composite', clr)
    if (this._eyeR) this._eyeR.setAttribute('fill', `rgba(${this.red}, 0, 0, ${this.alpha})`)
    if (this._eyeG) this._eyeG.setAttribute('fill', `rgba(0, ${this.green}, 0, ${this.alpha})`)
    if (this._eyeB) this._eyeB.setAttribute('fill', `rgba(0, 0, ${this.blue}, ${this.alpha})`)
    if (this._pickFill) this._pickFill.setAttribute('fill', `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`)

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
      ? nn.toHex({ r: this.red, g: this.green, b: this.blue }) + nn.alpha2hex(this.alpha)
      : nn.toHex({ r: this.red, g: this.green, b: this.blue })
    this.hexField.ele.querySelector('input').style.background = 'var(--netizen-meta)'

    if (this._faceDragging) {
      const color = `rgb(${this.red}, ${this.green}, ${this.blue})`
      this._tintFaceEyes(color, null, color)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods

  _changeSubWin (type) {
    if (type === 'rgba') type = 'rgb'
    else if (type === 'hsla') type = 'hsl'
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
      const hsl = nn.toHSL({ r: this.red, g: this.green, b: this.blue })
      this.hue = hsl.h
      this.sat = hsl.s
      this.lit = hsl.l
    } else if (type !== 'hsl' && this._SubWin === 'hsl') {
      const rgb = nn.toRGB({ h: this.hue, s: this.sat, l: this.lit })
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
    this.$('svg.clr-wig-eyes').style.display = type === 'hsl' ? 'none' : 'block'
    this.$('#clr-hsl-view').style.display = type === 'hsl' ? 'flex' : 'none'
    this.updateColor()
  }

  _setupHueDrag () {
    const wheel = this._wheel
    const gapRadius = 85 // matches .clr-wig-wheel__gap half-width

    const angleFromEvent = (e) => {
      const rect = wheel.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      const deg = Math.atan2(clientX - cx, -(clientY - cy)) * 180 / Math.PI
      return (deg + 360) % 360
    }

    const onMove = (e) => {
      e.preventDefault()
      this.hue = Math.round(angleFromEvent(e))
      this._updateHSL()
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onUp)
    }

    const onDown = (e) => {
      const rect = wheel.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const clientY = e.touches ? e.touches[0].clientY : e.clientY
      const dist = Math.sqrt((clientX - cx) ** 2 + (clientY - cy) ** 2)
      if (dist < gapRadius) return // click inside gap/center — ignore
      e.preventDefault()
      onMove(e)
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
      document.addEventListener('touchmove', onMove, { passive: false })
      document.addEventListener('touchend', onUp)
    }

    wheel.addEventListener('mousedown', onDown)
    wheel.addEventListener('touchstart', onDown, { passive: false })
  }

  _launchHelpConvo () {
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'intro')
  }

  _tintFaceEyes (left, mouth, right) {
    const spans = document.querySelectorAll('#face > span')
    const tint = (span, color) => {
      if (!span) return
      const svg = span.querySelector('svg')
      if (svg) svg.style.fill = color
    }
    tint(spans[0], left)
    if (mouth !== null) tint(spans[1], mouth)
    tint(spans[2], right)
  }

  _setupFaceSync () {
    const onDown = () => {
      if (this._faceDragging) return
      this._faceDragging = true
      if (this._SubWin === 'hsl') {
        NNW.menu.updateFace({ leftEye: '◉', mouth: '‿', rightEye: '◉' })
        const rgb = nn.toRGB({ h: this.hue, s: this.sat, l: this.lit })
        const color = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
        this._tintFaceEyes(color, null, color)
      } else {
        NNW.menu.updateFace({ leftEye: '◕', mouth: '‿', rightEye: '◕' })
        const color = `rgb(${this.red}, ${this.green}, ${this.blue})`
        this._tintFaceEyes(color, null, color)
      }
    }

    const onUp = () => {
      if (!this._faceDragging) return
      this._faceDragging = false
      NNW.menu.switchFace('default')
    }

    const sliders = [
      this.hueSlider, this.satSlider, this.litSlider,
      this.redSlider, this.greenSlider, this.blueSlider, this.alphaSlider
    ]
    sliders.forEach(s => {
      nn.get(s.ele).on('mousedown', onDown).on('touchstart', onDown, { passive: true })
    })
    nn.on('mouseup', onUp)
    nn.on('touchend', onUp)
  }

  _updateMotion () {
    const nomotion = WIDGETS['student-session']?.getData('nomotion') === 'true'
    this.ele.classList.toggle('no-motion', nomotion)
  }

  _createHTML () {
    const p = 'M100.28,0c27.93,0,51.49,9.79,70.7,29.35c19.2,19.57,28.81,43.63,28.81,72.18c0,18.79-5.81,36.85-17.44,54.19c-8.93,13.39-20.84,24.01-35.74,31.84c-14.9,7.84-30.65,11.76-47.26,11.76c-26.99,0-50.3-9.86-69.92-29.59C9.81,150.02,0,126.6,0,99.51c0-14.12,3.11-27.87,9.34-41.27s14.79-24.81,25.69-34.26C53.51,8,75.26,0,100.28,0z M100.28,12.93c-24.29,0-44.87,8.38-61.74,25.15c-16.87,16.77-25.3,37.19-25.3,61.28l86.74,0.47L100.28,12.93z'
    // guitar-pick: triple-circle intersection computed from centers (115.21,74.63) (75.21,139.63) (155.21,139.63) r=75
    const pick = 'M 115.21 76.19 A 75 75 0 0 1 150.20 140.97 A 75 75 0 0 1 80.22 140.97 A 75 75 0 0 1 115.21 76.19 Z'

    this.innerHTML = `<div class="clr-row1">
        <div>
          <div id="clr-hsl-view">
            <div class="clr-wig-wheel">
              <div class="clr-wig-wheel__gap">
                <div id="clr-hsl-center" class="clr-wig-wheel__center"></div>
              </div>
              <svg id="clr-hue-dot" class="clr-wig-hue-dot" viewBox="0 0 30 26" xmlns="http://www.w3.org/2000/svg">
                <polygon points="15,24 2,2 28,2"/>
              </svg>
            </div>
          </div>
          <svg class="clr-wig-eyes" viewBox="0 0 230 215" xmlns="http://www.w3.org/2000/svg">
            <g id="clr-eye-r" style="mix-blend-mode:screen"><path d="${p}" transform="translate(40,0) scale(0.75) rotate(45,100,100)"/></g>
            <g id="clr-eye-b" style="mix-blend-mode:screen"><path d="${p}" transform="translate(0,65) scale(0.75) rotate(270,100,100)"/></g>
            <g id="clr-eye-g" style="mix-blend-mode:screen"><path d="${p}" transform="translate(80,65) scale(0.75) rotate(180,100,100)"/></g>
            <g id="clr-pick">
              <path id="clr-pick-fill" d="${pick}" fill="white" opacity="0"/>
              <path id="clr-pick-stroke" d="${pick}" fill="none" stroke="var(--netizen-meta)" stroke-width="2.5"/>
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

    this._eyeR = this.$('#clr-eye-r path')
    this._eyeG = this.$('#clr-eye-g path')
    this._eyeB = this.$('#clr-eye-b path')
    this._pickFill = this.$('#clr-pick-fill')
    this._hslCenter = this.$('#clr-hsl-center')
    this._hueDot = this.$('#clr-hue-dot')
    this._wheel = this.$('.clr-wig-wheel')
    this._setupHueDrag()

    this.$('svg.clr-wig-eyes').style.display = this._SubWin === 'hsl' ? 'none' : 'block'
    this.$('#clr-hsl-view').style.display = this._SubWin === 'hsl' ? 'flex' : 'none'

    this._updateMotion()

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
      value: nn.toHex({ h: this.hue, s: this.sat, l: this.lit }),
      change: (e) => fieldUpdate(e)
    })

    const rgb = nn.toRGB({ h: this.hue, s: this.sat, l: this.lit })
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

    ;[this.hexField, this.rgbField, this.hslField].forEach(field => {
      const btn = nn.create('button')
        .set('.pill-btn pill-btn--secondary')
        .content('?')
        .on('click', () => this._launchHelpConvo())
      field.ele.insertBefore(btn, field.ele.firstChild)
    })

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

    this._setupFaceSync()

    // -------------------------------------------------------------------------

    this._changeSubWin('hsl')
    this.updateColor()
  }
}

window.ColorWidget = ColorWidget
