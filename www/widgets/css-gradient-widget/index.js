/* global NNW, Widget, utils, nn, Convo */
class CssGradientWidget extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'css-gradient-widget'
    this.listed = true
    this.keywords = ['gradient', 'color', 'linear', 'radial', 'conic', 'css']

    this.settings = {}
    this.resetSettings(true)

    this.title = 'CSS Gradient Generator'
    this.width = 680
    this._createHTML()

    Convo.load(this.key, () => {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'gradient-gen-intro')
    })

    this.on('open', () => {
      if (!this.convos) return
      window.convo = new Convo(this.convos, 'gradient-gen-intro')
    })

    this.on('close', () => {
      const opened = NNW.menu.textBubble.opened
      const intro = window.convo.id === 'gradient-gen-intro'
      if (opened && intro) window.convo.hide()
    })
  }

  _createHTML () {
    this.innerHTML = `
      <div class="gradient-widget">
        <div class="gradient-widget__description"></div>
        <div class="gradient-widget__preview"></div>
        <div class="gradient-widget__gui"></div>
      </div>
    `

    this._genPreview()
    this._genDesc()
    this._genColorStopGUI()
  }

  _gradPreviewClick (e) {
    if (this.settings.func !== 'linear-gradient') {
      const isRadial = (this.settings.func === 'radial-gradient')
      const b = e.target.getBoundingClientRect()
      let x = Math.round(e.clientX - b.x)
      let y = Math.round(e.clientY - b.y)
      const type = isRadial ? this.settings.position : '%'
      if (type === '%') {
        x = Math.round(nn.map(x, 0, b.width, 0, 100))
        y = Math.round(nn.map(y, 0, b.height, 0, 100))
      }
      if (isRadial &&
        (this.settings.position !== '%' && this.settings.position !== 'px')) {
        this.settings.posArr = [50, 50]
        x = Math.round(nn.map(x, 0, b.width, 0, 100))
        y = Math.round(nn.map(y, 0, b.height, 0, 100))
        this.updateSettings({
          position: '%',
          posArr: [x, y]
        })
      } else this.updateSettings({ posArr: [x, y] })
    }
  }

  _genPreview () {
    const div = document.createElement('div')

    this.previewGradient = document.createElement('div')
    this.previewGradient.style.width = '100%'
    this.previewGradient.style.height = '200px'
    this.previewGradient.style.borderRadius = '5px'
    this.previewGradient.style.background = this.settings.starter
    this.previewGradient.addEventListener('click', (e) => {
      this._gradPreviewClick(e)
    })
    div.appendChild(this.previewGradient)

    this.outputCode = this.createCodeField({
      value: this.settings.starter,
      readonly: true
    })
    div.appendChild(this.outputCode)

    this.$('.gradient-widget__preview').appendChild(div)
    this.outputCode.querySelector('input').style.width = '545px'
    this.outputCode.querySelector('input').style.margin = '6px 0px 6px 6px'
    div.style.paddingBottom = '20px'
  }

  _genCode () {
    let code = ''
    const opts = this.settings
    if (opts.func === 'linear-gradient') {
      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      code += 'linear-gradient('
      if (typeof opts.angle === 'number' || opts.angle === 'degrees') {
        const v = opts.angle === 'degrees' ? 0 : opts.angle
        code += `${v}deg, `
      } else if (opts.angle && !opts.angle.includes('default')) {
        code += `${opts.angle}, `
      }
      code += this._genColorStopStr()
      code += ')'
    } else if (opts.func === 'radial-gradient') {
      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      if (opts.shape instanceof Array) {
        code += `radial-gradient(${opts.shape[0]}px ${opts.shape[1]}px`
      } else {
        code += `radial-gradient(${opts.shape}`
      }
      const printSize = typeof opts.size === 'number' ||
        (typeof opts.size === 'string' && !opts.size.includes('default'))
      const printPos = opts.position && !opts.position.includes('default')
      if (printSize || printPos) code += ' '
      if (printSize) {
        code += opts.size
        if (typeof opts.size === 'number') code += 'px'
        if (!printPos) code += ', '
        else code += ' '
      }
      if (printPos) {
        if (opts.position === '%') {
          code += `at ${opts.posArr[0]}% ${opts.posArr[1]}%, `
        } else if (opts.position === 'px') {
          code += `at ${opts.posArr[0]}px ${opts.posArr[1]}px, `
        } else {
          code += `at ${opts.position}, `
        }
      }
      if (!printSize && !printPos) code += ', '
      code += this._genColorStopStr()
      code += ')'
    } else if (this.settings.func === 'conic-gradient') {
      // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
      code += 'conic-gradient('
      const printDeg = opts.angle !== 0
      const printPos = opts.posArr[0] !== 50 || opts.posArr[1] !== 50
      if (printDeg) {
        code += `from ${opts.angle}deg`
        if (printPos) code += ' '
        else code += ', '
      }
      if (printPos) {
        code += `at ${opts.posArr[0]}% ${opts.posArr[1]}%, `
      }
      code += this._genColorStopStr()
      code += ')'
    }
    this.outputCode.value = code
    this.previewGradient.style.background = code
  }

  _genDesc () {
    const div = document.createElement('div')
    div.appendChild(this._genSpan('A '))
    const grads = ['linear-gradient', 'radial-gradient', 'conic-gradient']
    const types = this._genList(grads, (v) => {
      this.resetSettings()
      this.updateSettings({ func: v })
    })
    div.appendChild(types)
    types.selectedIndex = grads.indexOf(this.settings.func)

    if (this.settings.func === 'linear-gradient') {
      this._genLinearGradientDesc(div)
    } else if (this.settings.func === 'radial-gradient') {
      this._genRadialGradientDesc(div)
    } else if (this.settings.func === 'conic-gradient') {
      this._genConicGradientDesc(div)
    }

    const stopsCSS = {
      display: 'inline-block',
      width: '47px',
      padding: '3px',
      margin: '4px',
      borderRadius: '5px',
      color: '#000',
      fontWeight: 'bold',
      textAlign: 'center'
    }
    div.appendChild(this._genSpan(' with the following color stops: '))
    const stops = this.settings.colorStops
    stops.forEach(cs => {
      const css = JSON.parse(JSON.stringify(stopsCSS))
      css.backgroundColor = cs.dataset.color
      css.color = nn.isLight(cs.dataset.color) ? '#000' : '#ff'
      div.appendChild(this._genSpan(`${cs.dataset.stop}%`, css))
    })

    const btnCSS = JSON.parse(JSON.stringify(stopsCSS))
    btnCSS.width = '24px'
    btnCSS.backgroundColor = utils.getVal('--netizen-meta')
    btnCSS.cursor = 'pointer'
    div.appendChild(this._genSpan('+', btnCSS, () => {
      this._addColorStop()
    }))
    div.appendChild(this._genSpan('-', btnCSS, () => {
      this._rmvColorStop()
    }))

    this.$('.gradient-widget__description').innerHTML = ''
    this.$('.gradient-widget__description').appendChild(div)
  }

  _genLinearGradientDesc (div) {
    div.appendChild(this._genSpan(' angled '))
    if (typeof this.settings.angle === 'number' ||
      this.settings.angle === 'degrees') {
      const num = this._genNum(this.settings.angle, (e) => {
        this.updateSettings({ angle: Number(e.target.value) })
      }, 360)
      div.appendChild(num)
    }
    const dirStrs = [
      'to bottom (default)',
      'to bottom left',
      'to left',
      'to top left',
      'to top',
      'to top right',
      'to right',
      'to bottom right',
      'degrees'
    ]
    const dirs = this._genList(dirStrs, (v) => {
      if (v === 'to bottom (default)') this.updateSettings({ angle: null })
      this.updateSettings({ angle: v })
    })
    if (typeof this.settings.angle === 'string') {
      dirs.selectedIndex = dirStrs.indexOf(this.settings.angle)
    } else if (typeof this.settings.angle === 'number') {
      dirs.selectedIndex = dirStrs.length - 1
    }
    div.appendChild(dirs)
  }

  _genRadialGradientDesc (div) {
    const opts = this.settings
    // shape
    const sh = ['circle', 'ellipse', 'custom ellipse']
    const shapes = this._genList(sh, (v) => {
      if (v === 'custom ellipse') this.updateSettings({ shape: [50, 50] })
      else this.updateSettings({ shape: v })
    })
    const shi = sh.indexOf(opts.shape)
    if (shi === -1) {
      shapes.selectedIndex = 2
    } else { shapes.selectedIndex = shi }
    if (shi === 1) div.appendChild(this._genSpan(' shaped like an '))
    else div.appendChild(this._genSpan(' shaped like a '))
    div.appendChild(shapes)
    if (opts.shape instanceof Array) {
      div.appendChild(this._genSpan(' with a width of '))
      const X = this._genNum(opts.shape[0], (e) => {
        const x = Number(e.target.value)
        const y = opts.shape[1]
        this.updateSettings({ shape: [x, y] })
      })
      div.appendChild(X)
      div.appendChild(this._genSpan('px and a height of '))
      const Y = this._genNum(opts.shape[1], (e) => {
        const x = opts.shape[0]
        const y = Number(e.target.value)
        this.updateSettings({ shape: [x, y] })
      })
      div.appendChild(Y)
      div.appendChild(this._genSpan('px, '))
    }
    // size
    if (shi !== 0 && typeof opts.size === 'number') {
      opts.size = 'farthest-side (default)'
    }
    if (shi !== -1) {
      if (typeof opts.size === 'number') {
        div.appendChild(this._genSpan(' extending '))
        const num = this._genNum(opts.size, (e) => {
          this.updateSettings({ size: Number(e.target.value) })
        })
        div.appendChild(num)
      } else {
        div.appendChild(this._genSpan(' extending to the '))
      }
      const sz = [
        'farthest-side (default)',
        'closest-side',
        'farthest-corner',
        'closest-corner'
      ]
      if (shi === 0) sz.push('px')
      const size = this._genList(sz, (v) => {
        if (v === 'px') this.updateSettings({ size: 50 })
        else this.updateSettings({ size: v })
      })
      if (typeof opts.size === 'string') {
        size.selectedIndex = sz.indexOf(opts.size)
      } else if (typeof opts.size === 'number') {
        size.selectedIndex = sz.length - 1
      }
      div.appendChild(size)
    }
    // position
    div.appendChild(this._genSpan(' located at the '))
    if (opts.posArr instanceof Array) {
      const X = this._genNum(opts.posArr[0], (e) => {
        const x = Number(e.target.value)
        const y = opts.posArr[1]
        this.updateSettings({ posArr: [x, y] })
      }, 100)
      div.appendChild(X)
      div.appendChild(this._genSpan(' X-axis (horizontal)'))
      div.appendChild(this._genSpan(' and the '))
      const Y = this._genNum(opts.posArr[1], (e) => {
        const x = opts.posArr[0]
        const y = Number(e.target.value)
        this.updateSettings({ posArr: [x, y] })
      }, 100)
      div.appendChild(Y)
      div.appendChild(this._genSpan(' Y-axis (vertical)'))
    }
    const ps = [
      'center (default)',
      'top',
      'top right',
      'right',
      'bottom right',
      'bottom',
      'bottom left',
      'left',
      'top left',
      '%',
      'px'
    ]
    const pos = this._genList(ps, (v) => {
      if (v === '%' || v === 'px') {
        const arr = opts.posArr
        this.updateSettings({ position: v, posArr: arr || [50, 50] })
      } else this.updateSettings({ position: v, posArr: null })
    })
    if (typeof opts.position === 'string') {
      pos.selectedIndex = ps.indexOf(opts.position)
    } else if (typeof opts.position === 'number') {
      pos.selectedIndex = ps.length - 1
    }
    div.appendChild(pos)
  }

  _genConicGradientDesc (div) {
    const opts = this.settings
    // angle
    div.appendChild(this._genSpan(' angled '))
    if (typeof opts.angle !== 'number') { this.settings.angle = 0 }
    const num = this._genNum(this.settings.angle, (e) => {
      this.updateSettings({ angle: Number(e.target.value) })
    }, 360)
    div.appendChild(num)
    // position
    div.appendChild(this._genSpan('degrees located at the '))
    if (!(opts.posArr instanceof Array)) {
      this.settings.posArr = [50, 50]
    }
    const X = this._genNum(opts.posArr[0], (e) => {
      const x = Number(e.target.value)
      const y = opts.posArr[1]
      this.updateSettings({ posArr: [x, y] })
    }, 100)
    div.appendChild(X)
    div.appendChild(this._genSpan('% X-axis (horizontal)'))
    div.appendChild(this._genSpan(' and the '))
    const Y = this._genNum(opts.posArr[1], (e) => {
      const x = opts.posArr[0]
      const y = Number(e.target.value)
      this.updateSettings({ posArr: [x, y] })
    }, 100)
    div.appendChild(Y)
    div.appendChild(this._genSpan('% Y-axis (vertical)'))
  }

  _genSpan (text, css, click) {
    const span = document.createElement('span')
    span.textContent = text
    for (const prop in css) { span.style[prop] = css[prop] }
    if (click) span.addEventListener('click', click)
    return span
  }

  _genList (items, callback) {
    const sel = document.createElement('select')
    sel.classList.add('dropdown', 'dropdown--invert')
    items.forEach((key) => {
      const opt = document.createElement('option')
      opt.setAttribute('value', key)
      opt.textContent = key
      sel.appendChild(opt)
    })
    sel.addEventListener('change', (e) => callback(e.target.value))
    return sel
  }

  _genNum (val, change, max) {
    val = typeof val === 'number' ? val : '0'
    const ele = document.createElement('input')
    ele.setAttribute('type', 'number')
    ele.setAttribute('min', 0)
    if (max) ele.setAttribute('max', max)
    ele.value = val
    ele.style.width = '54px'
    ele.style.padding = '3px'
    ele.style.borderRadius = '5px'
    ele.addEventListener('change', change)
    return ele
  }

  _genColorStopStr () {
    let str = ''
    for (let i = 0; i < this.settings.colorStops.length; i++) {
      str += this.settings.colorStops[i].dataset.color
      str += ` ${this.settings.colorStops[i].dataset.stop}%`
      if (i < this.settings.colorStops.length - 1) str += ', '
    }
    return str
  }

  _genColorStop (val, color) {
    const div = document.createElement('div')
    div.style.display = 'flex'
    div.style.padding = '8px 0px'
    div.dataset.color = color
    div.dataset.stop = val

    const clr = document.createElement('input')
    clr.setAttribute('type', 'color')
    clr.setAttribute('value', color)
    clr.style.marginRight = '20px'
    clr.style.cursor = 'pointer'
    clr.addEventListener('change', (e) => {
      const cs = e.target.parentNode
      cs.dataset.color = e.target.value
      cs.querySelector('code-slider').background = e.target.value
      this.updateSettings()
    })
    div.appendChild(clr)

    const slider = this.createSlider({
      value: val,
      min: 0,
      max: 100,
      label: '%',
      change: (e) => {
        const cs = e.target.parentNode.parentNode.parentNode
        cs.dataset.stop = e.target.value
        this.updateSettings()
      }
    })
    slider.background = color
    div.appendChild(slider)

    return div
  }

  _genColorStopGUI () {
    const div = document.createElement('div')
    div.style.maxHeight = '149px'
    div.style.overflowY = 'scroll'
    div.appendChild(this.settings.colorStops[0])
    div.appendChild(this.settings.colorStops[1])
    this.$('.gradient-widget__gui').innerHTML = ''
    this.$('.gradient-widget__gui').appendChild(div)
    this.colorStopsElement = div
  }

  _addColorStop () {
    const ran = Math.floor(Math.random() * 100)
    const cs = this._genColorStop(ran, nn.randomColor())
    this.settings.colorStops.push(cs)
    this.colorStopsElement.appendChild(cs)
    const l = this.settings.colorStops.length
    this.settings.colorStops.forEach((s, i) => {
      const val = Math.round(nn.map(i, 0, l - 1, 0, 100))
      s.querySelector('code-slider').value = val
      s.dataset.stop = val
    })
    this.updateSettings()
  }

  _rmvColorStop () {
    const total = this.settings.colorStops.length
    if (total <= 2) {
      window.convo = new Convo(this.convos, 'stops')
      return
    }
    const lastStop = this.settings.colorStops.pop()
    this.colorStopsElement.removeChild(lastStop)
    this.settings.colorStops.forEach((s, i) => {
      const val = Math.round(nn.map(i, 0, total - 2, 0, 100))
      s.querySelector('code-slider').value = val
      s.dataset.stop = val
    })
    this.updateSettings()
  }

  // --------------

  resetSettings (init) {
    const c1 = this.settings.colorStops
      ? this.settings.colorStops[0].dataset.color
      : utils.getVal('--netizen-number')
    const c2 = this.settings.colorStops
      ? this.settings.colorStops[1].dataset.color
      : utils.getVal('--netizen-tag')
    const cs = (this.settings.colorStops)
      ? [...this.settings.colorStops] : null
    this.settings = {
      starter: `linear-gradient(${c1}, ${c2})`,
      func: 'linear-gradient',
      shape: 'ellipse',
      size: null,
      position: null,
      angle: null,
      colorStops: cs
    }
    if (init) {
      this.settings.colorStops = [
        this._genColorStop(0, c1),
        this._genColorStop(100, c2)
      ]
    }
  }

  updateSettings (obj) {
    for (const prop in obj) { this.settings[prop] = obj[prop] }
    if (this.settings.func !== 'linear-gradient') {
      this.previewGradient.style.cursor = 'crosshair'
    } else {
      this.previewGradient.style.cursor = 'auto'
    }
    this._genDesc()
    this._genCode()
  }
}

window.CssGradientWidget = CssGradientWidget
