/* global HTMLElement, WIDGETS, utils */
window.WIDGETS = { // GLOBAL WIDGETS OBJECT
  // all named/keyed instantiated widgets are properties of this global object
  loaded: [], // list of filenames of all currently loaded widgets
  instantiated: [], // list of keys of all currently instantiated widgets
  list: () => WIDGETS.instantiated.map(key => WIDGETS[key]), // array of widgets
  load: (dirname, cbfunc) => {
    utils.loadStyleSheet(`widgets/${dirname}/styles.css`)
    const s = document.createElement('script')
    s.setAttribute('src', `widgets/${dirname}/index.js`)
    s.onload = () => {
      WIDGETS.loaded.push(dirname)
      const words = dirname.split('-')
      const className = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')
      // instantiate widget unless skipAutoInstantiation is set to true
      if (window[className].skipAutoInstantiation !== true) {
        const wig = new window[className]()
        if (!wig.key) console.error(`WIDGETS: ${className} is missing it's key`)
        WIDGETS[wig.key] = wig
        WIDGETS.instantiated.push(wig.key)
        if (cbfunc) cbfunc(wig)
      } else { if (cbfunc) cbfunc() }
    }
    s.onerror = () => {
      const error = `widgets/${dirname} does not exist`
      if (cbfunc) cbfunc({ error })
      else console.error(`WIDGET: ${error}`)
    }
    document.body.appendChild(s)
  },
  create: (opts) => {
    opts = opts || {}
    if (!opts.type) opts.type = 'Widget'
    const wig = new window[opts.type](opts)
    const key = opts.key || `anon-${Date.now()}`
    if (WIDGETS.instantiated.includes(key)) {
      window.alert(`ERROR: looks like a ${key} widget already exists`)
    } else {
      WIDGETS[key] = wig
      WIDGETS.instantiated.push(key)
      return wig
    }
  },
  open: (key, cb) => {
    if (WIDGETS.instantiated.includes(key)) WIDGETS[key].open(cb)
    else WIDGETS.load(key, w => w.open(cb))
  },
  close: (key) => {
    if (WIDGETS.instantiated.includes(key)) WIDGETS[key].close()
    else console.error(`WIDGETS: ${key} was never instantiated`)
  }
}

/*

WIDGETS.create({
  type: 'Widget',
  key: 'my-new-widget'
})

const w = new Widget({
  title: 'netnet widget', // for widget title bar
  innerHTML: '',          // html string or HTMLElement
  closable: true,         // allow user to close the widget
  resizable: true,        // allow user to resize the widget
  listed: true,           // should widget be listed in search results
  left: 20,               //
  top: 20,                //
  zIndex: 100,            // make sure it's always between 100 && 200
  width: 500,             //
  height: 500             //
})

*/

class Widget {
  constructor (opts) {
    opts = opts || {}
    this._key = opts.key
    this._title = opts.title || 'netnet widget'
    this._innerHTML = opts.innerHTML || ''
    this._listed = (typeof opts.listed === 'boolean') ? opts.listed : true
    this._resizable = (typeof opts.resizable === 'boolean') ? opts.resizable : true
    this._closable = (typeof opts.closable === 'boolean') ? opts.closable : true

    this.mousedown = false

    this.events = {
      open: [],
      close: [],
      resize: []
    }

    this._createWindow()

    const s = ['top', 'right', 'bottom', 'left', 'zIndex', 'width', 'height']
    s.forEach(p => { this[`_${p}`] = null })
    for (const prop in opts) if (s.includes(prop)) this._css(prop, opts[prop])

    window.addEventListener('mousedown', (e) => this._mouseDown(e), true)
    window.addEventListener('mouseup', (e) => this._mouseUp(e), true)
    window.addEventListener('mousemove', (e) => this._mouseMove(e), true)
    window.addEventListener('mousemove', (e) => utils.updateShadow(e, this.ele))
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  get key () { return this._key }
  set key (v) {
    if (typeof v !== 'string') {
      return console.error('Widget: key property must be set to a string')
    } else {
      this._key = v
    }
  }

  get listed () { return this._listed }
  set listed (v) {
    if (typeof v !== 'boolean') {
      return console.error('Widget: listed property must be set to a boolean')
    } else {
      this._listed = v
      // TODO update the Search dict so that it's no longer listed ???????????
    }
  }

  get resizable () { return this._resizable }
  set resizable (v) { this._resizable = v }

  get opened () { return this.ele.style.visibility === 'visible' }
  set opened (v) { console.error('Widget: opened property is read only') }

  get title () { return this._title }
  set title (v) {
    if (typeof v !== 'string') {
      return console.error('Widget: title property must be set to a string')
    } else {
      this._title = v
      const titlebar = this.ele.querySelector('.widget__top__title__txt')
      titlebar.innerHTML = v
      if (titlebar.children.length > 0) {
        titlebar.style.display = 'flex'
        titlebar.style.alignItems = 'center'
      }
      this._marquee()
    }
  }

  get innerHTML () { return this._innerHTML }
  set innerHTML (v) {
    if (typeof v !== 'string' && !(v instanceof HTMLElement)) {
      const m = 'innerHTML string or an instanceof HTMLElement'
      return console.error('Widget: innerHTML property must be an ' + m)
    } else {
      this._innerHTML = v
      const c = this.ele.querySelector('.widget__inner-html')
      c.innerHTML = ''
      if (typeof v === 'string') c.innerHTML = v
      else if (v instanceof HTMLElement) c.appendChild(v)
    }
  }

  get closable () { return this._closable }
  set closable (v) {
    this._closable = v
    const close = v ? '<span class="close">✖</span>' : ''
    this.ele.querySelector('.widget__top__close').innerHTML = close
  }

  get left () { return parseInt(this.ele.style.left) }
  set left (v) { this._css('left', v) }

  get top () { return parseInt(this.ele.style.top) }
  set top (v) { this._css('top', v) }

  get right () { return window.innerWidth - this.width - this.left }
  set right (v) { this._css('right', v) }

  get bottom () { return window.innerHeight - this.height - this.top }
  set bottom (v) { this._css('bottom', v) }

  get zIndex () { return parseInt(this.ele.style.zIndex) }
  set zIndex (v) { this._css('zIndex', v) }

  get width () { return this.ele.offsetWidth }
  set width (v) { this._css('width', v) }

  get height () { return this.ele.offsetHeight }
  set height (v) { this._css('height', v) }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  $ (selector) {
    const e = this.ele.querySelector('.widget__inner-html').querySelectorAll(selector)
    if (e.length > 1) return e
    else return e[0]
  }

  on (eve, cb) {
    if (!this.events[eve]) { this.events[eve] = [] }
    this.events[eve].push(cb)
  }

  emit (eve, data) {
    if (this.events[eve] instanceof Array) {
      this.events[eve].forEach((cb, i) => {
        data.unsubscribe = () => { this.events[eve].splice(i, 1) }
        cb(data)
      })
    }
  }

  open (func) {
    this._display('visible', () => {
      this.keepInFrame()
      this.events.open.forEach(func => func())
      if (func) return func(this)
    })
  }

  close (func) {
    if (this.ele.querySelector('video')) this.ele.querySelector('video').pause()
    if (this.ele.querySelector('audio')) this.ele.querySelector('audio').pause()
    this._display('hidden')
    this.events.close.forEach(func => func())
    if (func) return func(this)
  }

  update (opts, time) {
    time = time || 0
    const t = `${time}ms`
    this.ele.style.transition = `all ${t} var(--sarah-ease)`
    // trigger transition
    setTimeout(() => {
      // NOTE: width && height should alwasy be set before left, top, etc
      // if props called in other order than _css won't render right
      for (const prop in opts) this._css(prop, opts[prop])
      setTimeout(() => {
        this.ele.style.transition = 'none'
        this.keepInFrame()
      }, time)
      this._recentered = false
    }, 25)
  }

  recenter () {
    this._css('left', window.innerWidth / 2 - this.width / 2)
    this._css('top', window.innerHeight / 2 - this.height / 2)
    this._recentered = true
  }

  keepInFrame () {
    if (this.width >= window.innerWidth - 20) {
      this.width = window.innerWidth - 20
    }
    if (this.height >= window.innerHeight - 20) {
      this.height = window.innerHeight - 20
    }

    const o = this.ele.offsetTop + this.ele.offsetHeight
    if (o > window.innerHeight - 10) this.update({ bottom: 10 }, 500)
    else if (this.ele.offsetTop < 2) this.update({ top: 10 }, 500)
    else if (this.ele.offsetTop > window.innerHeight) {
      this.bottom = 2
    }

    const edge = this.ele.offsetLeft + this.ele.offsetWidth
    if (this.ele.offsetLeft < 2) this.update({ left: 10 }, 500)
    else if (edge > window.innerWidth &&
      this.ele.offsetWidth + 10 < window.innerWidth) {
      const l = window.innerWidth - this.ele.offsetWidth - 10
      this.update({ left: l }, 500)
    }
  }

  bring2front () {
    let z = 100
    const allWidgets = WIDGETS.list()
      .filter(w => w.key !== this.key)
      .sort((a, b) => { return parseFloat(a.zIndex) - parseFloat(b.zIndex) })

    allWidgets.forEach(w => { w.zIndex = ++z })
    this.zIndex = ++z
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ CSS GENERATOR HELPERS

  createCodeField (opts) {
    const el = document.createElement('code-field')
    el.value = opts.value
    el.readonly = opts.readonly
    if (typeof opts.change === 'function') el.change = opts.change
    if (typeof opts.update === 'function') el.update = opts.update
    return el
  }

  createSlider (opts) {
    opts = opts || {}
    const el = document.createElement('code-slider')
    el.value = (typeof opts.value === 'undefined') ? 50 : opts.value
    el.change = opts.change || function () {}
    el.min = (typeof opts.min === 'undefined') ? 1 : opts.min
    el.max = (typeof opts.max === 'undefined') ? 255 : opts.max
    el.step = (typeof opts.step === 'undefined') ? 1 : opts.step
    el.label = opts.label || ''
    el.bubble = opts.bubble
    el.background = opts.background || 'var(--netizen-meta)'
    return el
  }

  parseCSS (string) {
    const parsedCode = { property: '', value: [] }

    const regExp = /\(([^)]+)\)/g
    let matches = string.match(regExp) // find css functions

    const line = string.split(':')
    parsedCode.property = line[0]

    if (line.length < 2) return null

    if (matches) {
      // store CSS function names
      const funcs = line[1].split(' ')
        .filter(item => item.includes('('))
        .map(item => item.split('(')[0])

      // create string version of all CSS vals (including non functions)
      let valueArr = line[1]
      matches.forEach(m => { valueArr = valueArr.replace(m, '') })

      // create mutli-dimentoinal-array of CSS function arguments
      matches = matches.map((item) => {
        item = item.replace(/[()]/g, '')
        return item.split(',')
      })
      // add coresponding func name to start of the arrays
      matches.forEach((item, index) => {
        item.unshift(funcs[index])
      })

      // interweave non-function values && function values together
      let count = 0
      valueArr = valueArr.split(' ')
        .filter(el => el.trim().length > 0)
        .map(el => el.replace(';', ''))
        .map(v => {
          if (funcs.includes(v)) {
            const nxtArr = matches[count]
            count++
            return nxtArr
          } else return v
        })

      parsedCode.value = valueArr
    } else {
      const valueArr = line[1].split(' ')
        .filter(el => el.trim().length > 0)
        .map(el => el.replace(';', ''))

      parsedCode.value = valueArr
    }

    return parsedCode
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createWindow () {
    this.ele = document.createElement('div')
    this.ele.className = 'widget'
    this.ele.innerHTML = `
      <div class="widget__top">
        <div class="widget__top__title">
          <span class="hdr-md widget__top__title__txt">${this._title}</span>
        </div>
        <span class="widget__top__close">
          ${this.closable ? '<span class="close">✖</span>' : ''}
        </span>
      </div>
      <div class="widget__inner-html">${this.innerHTML}</div>
    `
    document.body.appendChild(this.ele)
    this.ele.style.visibility = 'hidden'

    const close = this.ele.querySelector('.widget__top .close')
    if (close) close.addEventListener('click', () => this.close())

    this.recenter()
    setTimeout(() => this._marquee(), 100)
  }

  _marquee () {
    const titleWidth = this.ele.querySelector('.widget__top__title').clientWidth
    const titleSpanWidth = this.ele.querySelector('.widget__top__title__txt').clientWidth
    if (titleSpanWidth > titleWidth) {
      this.ele.querySelector('.widget__top__title').classList.add('widget__top__title--marquee')
      this.ele.querySelector('.widget__top__title__txt').style.animationDelay = `${Math.random() * 3}s`
    } else {
      this.ele.querySelector('.widget__top__title').classList.remove('widget__top__title--marquee')
    }
  }

  _display (value, callback) {
    if (value === 'visible') {
      this.ele.style.animation = 'openBounce 0.3s ease forwards'
    } else {
      this.ele.style.animation = 'none'
    }
    if (value === 'visible' && this.ele.style.visibility === 'hidden') {
      this.bring2front()
    }
    this.ele.style.visibility = value
    if (callback) setTimeout(callback, 300)
  }

  _css (prop, val) {
    const p = ['top', 'right', 'bottom', 'left']
    const s = ['width', 'height']
    if (s.includes(prop)) {
      this.ele.style[prop] = (typeof val === 'number') ? `${val}px` : val
    } else if (p.includes(prop)) {
      if (prop === 'left' || prop === 'right') {
        const width = parseInt(this.ele.style.width)
          ? parseInt(this.ele.style.width) : this.width
        const left = (prop === 'left')
          ? val : window.innerWidth - val - width
        this.ele.style.left = `${left}px`
      } else { // top || bottom
        const height = parseInt(this.ele.style.height)
          ? parseInt(this.ele.style.height) : this.height
        const top = (prop === 'top')
          ? val : window.innerHeight - val - height
        this.ele.style.top = `${top}px`
      }
    } else {
      this.ele.style[prop] = val
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _shouldResize (e) {
    const offX = this.ele.offsetWidth + this.ele.offsetLeft - 20
    const offY = this.ele.offsetHeight + this.ele.offsetTop - 20
    return e.clientX > offX && e.clientY > offY && this._resizable
  }

  _mouseDown (e) {
    const self = e.target.parentNode === this.ele || e.target === this.ele
    if (self) {
      this.mousedown = e.target.className
      if (e.target.className === 'widget__top') {
        this.ele.querySelector('.widget__top').style.cursor = 'move'
      }
      // if it wasn't clicked on bottom right, then we shouldn't resize
      if (this.mousedown === 'widget' && !this._shouldResize(e)) {
        this.mousedown = false
      }
      // update z index so it's above other widgets
      this.bring2front()
    }
  }

  _mouseUp (e) {
    this.mousedown = false
    this.winOff = null
    this.ele.querySelector('.widget__top').style.cursor = 'grab'
    this.keepInFrame()
    utils.selecting(true)
  }

  _mouseMove (e) {
    // e.preventDefault()
    // check if cursor is over bottom right corner
    if (this._shouldResize(e)) {
      this.ele.style.cursor = 'se-resize'
    } else this.ele.style.cursor = 'auto'

    if (this.ele.style.cursor === 'auto') utils.selecting(true)
    else utils.selecting(false)

    // move or resize window
    if (this.mousedown === 'widget__top') {
      this._recentered = false
      if (!this.winOff || typeof this.winOff === 'undefined') {
        this.winOff = {
          x: e.clientX - this.ele.offsetLeft,
          y: e.clientY - this.ele.offsetTop
        }
      }
      this._css('left', e.clientX - this.winOff.x)
      this._css('top', e.clientY - this.winOff.y)
    } else if (this.mousedown === 'widget') {
      const w = e.clientX - this.ele.offsetLeft
      const h = e.clientY - this.ele.offsetTop
      if (this._resizable) {
        this.emit('resize', { width: w, height: h })
        this.update({ width: w, height: h })
      }
    }
  }
}

window.Widget = Widget
