/* global Widget, NNM, NNE, Convo, Maths, Color */
/*
  -----------
     info
  -----------

  This Widget helps you create hex, rgb/a, hsl/a color codes and inject them
  into the netitor.

  -----------
     usage
  -----------

  // this class inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js to see what those are
  // or take a look at the wiki...
  // https://github.com/netizenorg/netnet.studio/wiki/Creating-Widgets

  WIDGETS['color-widget'].updateColor(str) // takes a color string
*/
class ColorWidget extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'color-widget'
    this.keywords = ['color', 'colour', 'rgb', 'hsv', 'hsl', 'hex', 'hue']

    this.resizable = false
    this.title = 'Color Widget'

    const de = document.documentElement
    const clr = window.getComputedStyle(de).getPropertyValue('--netizen-tag')
    const hsl = Color.hex2hsl(clr)
    this.hue = hsl.h
    this.sat = hsl.s
    this.val = hsl.l
    this.alpha = 1

    this._createHTML()

    this.on('open', () => {
      window.convo = new Convo({
        content: 'The color widget helps you create color codes to inject into your project. It will insert code wherever your cursor is placed, or replace code you currently have highlighted/selected.'
      })
    })

    NNE.on('edu-info', (e) => {
      const c = Color.match(e.data.toLowerCase())
      if (c) this.updateColor(c)
      setTimeout(() => {
        if (c && c[0] === 'hex') {
          this.from = NNE.cm.getCursor('from')
          this.to = NNE.cm.getCursor('to')
          const f = { line: this.from.line, ch: this.from.ch - 1 }
          NNE.cm.setSelection(f, this.to)
        }
      }, 100)
    })
  }

  updateColor (c) {
    if (c && c !== null) {
      if (c[2]) c[2] = Number(c[2]) || parseInt(c[2])
      if (c[3]) c[3] = Number(c[3]) || parseInt(c[3])
      if (c[4]) c[4] = Number(c[4]) || parseInt(c[4])
      if (c[0] === 'hex') {
        const hsl = Color.hex2hsl(c[1])
        this.hue = hsl.h
        this.sat = hsl.s
        this.val = hsl.l
        if (c[1].length === 9) this.alpha = c[1].substring(7, 9)
        else if (c[1].length === 5) this.alpha = c[1].substring(4, 5)
        else this.alpha = 1
        this.alpha = this.alpha === 1 ? 1 : Color.hex2alpha(this.alpha)
      } else if (c[0] === 'rgb') {
        const hsl = Color.rgb2hsl(c[2], c[3], c[4])
        this.hue = hsl.h
        this.sat = hsl.s
        this.val = hsl.l
        this.alpha = c[5]
      } else if (c[0] === 'hsl') {
        this.hue = c[2]
        this.sat = c[3]
        this.val = c[4]
        this.alpha = c[5]
      }
    }

    this.alpha = Math.floor(this.alpha * 100) / 100

    this._updateSlider(this.hue, 'hue')
    this._updateSlider(this.sat, 'sat')
    this._updateSlider(this.val, 'val')
    this._updateSlider(this.alpha, 'alpha')
    this._updateColor(c)

    this.$('#clr-wig-hue-slider').value = this.hue
    this.$('#clr-wig-sat-slider').value = this.sat
    this.$('#clr-wig-val-slider').value = this.val
    this.$('#clr-wig-alpha-slider').value = this.alpha
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods

  _createHTML () {
    this.innerHTML = `
      <style>
        :root {
          --clr-wig-composite: hsl(180, 50%, 50%);
          --clr-wig-hue: hsl(180, 50%, 50%);
          --clr-wig-sat: hsl(180, 50%, 50%);
          --clr-wig-val: hsl(180, 0%, 50%);
          --clr-wig-alpha: hsla(180, 0%, 50%, 1);
        }

        div.clr-row1 {
          display: flex;
          justify-content: space-between;
          width: 670px;
        }

        div.clr-row1 div {
          display: block;
          flex: 0 0 60%;
        }

        div.clr-row1 div#clr-wig-sliders {
          display: block;
          flex: 0 0 40%;
          max-width: 255px;
        }

        #clr-wig-sample {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          margin: 50px 100px 50px 50px;
          background: var(--clr-wig-composite);
        }

        #clr-wig-sliders > span {
          display: inline-block;
          transform: translate(-31px, 27px);
        }

        .clr-wig-bubble {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          border: 2px solid var(--netizen-meta);
          transform: translate(-7px,17px);
          position: relative;
          left: 127px;
        }

        .clr-wig-num {
          color: var(--netizen-meta);
          transform: translate(-12px, 5px);
          text-align: center;
          position: relative;
          width: 27px;
          left: 127px;
        }

        #clr-wig-sliders > input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 10px;
          border-radius: 5px;
          outline: none;
          border: 1px solid var(--netizen-meta);
        }

        #clr-wig-sliders > input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 4px;
          height: 24px;
          background: #fff;
          cursor: pointer;
          border-radius: 5px;
        }

        #clr-wig-sliders > input::-moz-range-thumb {
          width: 4px;
          height: 24px;
          background: #fff;
          cursor: pointer;
          border-radius: 5px;
        }

        #clr-wig-hue-bubble {
          background: var(--clr-wig-hue);
        }


        input#clr-wig-hue-slider {
          background-image: url(images/widgets/hue_gradient.png);
        }

        #clr-wig-sat-bubble {
          background: var(--clr-wig-sat);
        }

        input#clr-wig-sat-slider {
          background: linear-gradient(90deg, #fff 0%, var(--clr-wig-hue) 100%);
        }

        #clr-wig-val-bubble {
          background: var(--clr-wig-val);
        }

        input#clr-wig-val-slider {
          background: linear-gradient(90deg, #000 0%, #fff 100%);
        }

        #clr-wig-alpha-bubble {
          background: var(--clr-wig-alpha);
        }

        input#clr-wig-alpha-slider {
          border: none !important;
          background: linear-gradient(90deg, #fff0 0%, var(--clr-wig-hue) 100%);
        }

        #clr-wig-codes {
          margin-right: 54px;
          position: relative;
          z-index: 2;
        }

        #clr-wig-codes > input {
          background-color: var(--netizen-meta);
          font-family: monospace;
          color: var(--netizen-hint-color);
          padding: 6px;
          border: none;
          margin: 6px;
          width: 250px;
          border-radius: 5px;
        }

        .clr-wig-svg {
          position: relative;
          left: -15px;
          width: 120px;
          height: 120px;
          display: block;
          margin: 25px auto;
        }

        .clr-wig-svg-text {
          fill: var(--clr-wig-composite);
          fill-opacity: 1;
          stroke: none;
        }
      </style>
      <div class="clr-row1">
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
            <button id="clr-wig-hex-btn">insert</button>
            <input id="clr-wig-hex-input"><br>
            <button id="clr-wig-rgb-btn">insert</button>
            <input id="clr-wig-rgb-input"><br>
            <button id="clr-wig-hsl-btn">insert</button>
            <input id="clr-wig-hsl-input"><br>
          </div>
        </div>
        <div id="clr-wig-sliders">
          <div id="clr-wig-hue-bubble" class="clr-wig-bubble"></div>
          <span>H</span>
          <input type="range" min="0" max="360" value="180" id="clr-wig-hue-slider">
          <div id="clr-wig-hue-num" class="clr-wig-num">180</div>

          <div id="clr-wig-sat-bubble" class="clr-wig-bubble"></div>
          <span>S</span>
          <input type="range" min="0" max="100" value="50" id="clr-wig-sat-slider">
          <div id="clr-wig-sat-num" class="clr-wig-num">50</div>

          <div id="clr-wig-val-bubble" class="clr-wig-bubble"></div>
          <span>L</span>
          <input type="range" min="0" max="100" value="50" id="clr-wig-val-slider">
          <div id="clr-wig-val-num" class="clr-wig-num">50</div>

          <div id="clr-wig-alpha-bubble" class="clr-wig-bubble"></div>
          <span id="clr-wig-alpha-span">A</span>
          <input type="range" min="0" max="1" step="0.01" value="1" id="clr-wig-alpha-slider">
          <div id="clr-wig-alpha-num" class="clr-wig-num">1</div>
        </div>
      </div>
    `

    this.updateColor()

    window.addEventListener('mousemove', () => {
      const r = NNM.ele.querySelector('#face > span:nth-child(1)').style.transform
      this.$('svg').style.transform = r
    })

    this.$('#clr-wig-hue-slider')
      .addEventListener('input', (e) => this._onSliderInput(e, 'hue'))

    this.$('#clr-wig-sat-slider')
      .addEventListener('input', (e) => this._onSliderInput(e, 'sat'))

    this.$('#clr-wig-val-slider')
      .addEventListener('input', (e) => this._onSliderInput(e, 'val'))

    this.$('#clr-wig-alpha-slider')
      .addEventListener('input', (e) => this._onSliderInput(e, 'alpha'))

    this.$('#clr-wig-hex-btn')
      .addEventListener('click', (e) => this._onButtonClick(e, 'hex'))

    this.$('#clr-wig-rgb-btn')
      .addEventListener('click', (e) => this._onButtonClick(e, 'rgb'))

    this.$('#clr-wig-hsl-btn')
      .addEventListener('click', (e) => this._onButtonClick(e, 'hsl'))

    this.$('#clr-wig-hex-input')
      .addEventListener('change', (e) => this._onInputChange(e, 'hex'))

    this.$('#clr-wig-rgb-input')
      .addEventListener('change', (e) => this._onInputChange(e, 'rgb'))

    this.$('#clr-wig-hsl-input')
      .addEventListener('change', (e) => this._onInputChange(e, 'hsl'))
  }

  _onSliderInput (e, t) {
    const v = this[t] = e.target.value
    this._updateSlider(v, t)
    this._updateColor()
  }

  _onButtonClick (e, type) {
    const val = this.$(`#clr-wig-${type}-input`).value
    this.from = NNE.cm.getCursor('from')
    this.to = NNE.cm.getCursor('to')
    NNE.cm.replaceSelection(val)
    const t = { line: this.to.line, ch: this.from.ch + val.length }
    NNE.cm.setSelection(this.from, t)
  }

  _onInputChange (e, type) {
    const val = e.target.value
    this.updateColor(Color.match(val))
  }

  _updateSlider (v, type) {
    const p = type === 'hue'
      ? Maths.map(v, 0, 360, 3, 252) : type === 'alpha'
        ? Maths.map(v, 0, 1, 3, 252) : Maths.map(v, 0, 100, 3, 252)
    this.$(`#clr-wig-${type}-num`).textContent = v
    this.$(`#clr-wig-${type}-num`).style.left = `${p}px`
    this.$(`#clr-wig-${type}-bubble`).style.left = `${p}px`

    const as = [
      '#clr-wig-alpha-bubble',
      '#clr-wig-alpha-span',
      '#clr-wig-alpha-slider',
      '#clr-wig-alpha-num'
    ]
    if (this.alpha < 1) as.forEach(a => { this.$(a).style.opacity = 1 })
    else as.forEach(a => { this.$(a).style.opacity = 0.25 })
  }

  _updateColor (arr) {
    const hue = `hsl(${this.hue}, 50%, 50%)`
    const sat = `hsl(${this.hue}, ${this.sat}%, 50%)`
    const val = `hsl(180, 0%, ${this.val}%)`
    const alpha = `hsla(${this.hue}, 50%, 50%, ${this.alpha})`
    document.documentElement.style.setProperty('--clr-wig-hue', hue)
    document.documentElement.style.setProperty('--clr-wig-sat', sat)
    document.documentElement.style.setProperty('--clr-wig-val', val)
    document.documentElement.style.setProperty('--clr-wig-alpha', alpha)

    const c = this.alpha < 1
      ? `hsla(${this.hue}, ${this.sat}%, ${this.val}%, ${this.alpha})`
      : `hsl(${this.hue}, ${this.sat}%, ${this.val}%)`
    document.documentElement.style.setProperty('--clr-wig-composite', c)

    const hex = (arr && arr[0] === 'hex')
      ? arr[1] : Color.hsl2hex(this.hue, this.sat, this.val)
    const hexA = Color.alpha2hex(this.alpha)
    const rgb = (arr && arr[0] === 'rgb')
      ? { r: arr[2], g: arr[3], b: arr[4] }
      : Color.hsl2rgb(this.hue, this.sat, this.val)

    this.$('#clr-wig-hsl-input').value = c
    this.$('#clr-wig-hex-input').value = this.alpha < 1 ? hex + hexA : hex
    this.$('#clr-wig-rgb-input').value = this.alpha < 1
      ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.alpha})`
      : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  }
}

window.ColorWidget = ColorWidget
