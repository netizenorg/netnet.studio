/* global HTMLElement, WIDGETS, utils */
window.WIDGETS = { // GLOBAL WIDGETS OBJECT
  // all named/keyed instantiated widgets are properties of this global object
  loaded: ['Widget.js'], // list of filenames of all currently loaded widgets
  instantiated: [], // list of keys of all currently instantiated widgets
  list: () => WIDGETS.instantiated.map(key => WIDGETS[key]), // array of widgets
  load: (filename, cbfunc) => {
    const s = document.createElement('script')
    s.setAttribute('src', `widgets/${filename}`)
    s.onload = () => {
      WIDGETS.loaded.push(filename)
      // instantiate widget unless skipAutoInstantiation is set to true
      const className = filename.split('.')[0]
      if (window[className].skipAutoInstantiation !== true) {
        const wig = new window[className]()
        if (!wig.key) console.error(`WIDGETS: ${className} is missing it's key`)
        WIDGETS[wig.key] = wig
        WIDGETS.instantiated.push(wig.key)
        if (cbfunc) cbfunc(wig)
      } else { if (cbfunc) cbfunc() }
    }
    s.onerror = () => {
      const error = `widgets/${filename} does not exist`
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
    WIDGETS[key] = wig
    WIDGETS.instantiated.push(key)
    return wig
  },
  open: (key, filename) => {
    if (WIDGETS.instantiated.includes(key)) WIDGETS[key].open()
    else if (filename) WIDGETS.load(filename, w => w.open())
    else { // make a guess about the filename based on keyname conventions
      const cap = (s) => s[0].toUpperCase() + s.substr(1)
      const arr = key.split('-')
      const name = arr.map(w => cap(w)).join('') + '.js'
      WIDGETS.load(name, w => w.open())
    }
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
      close: []
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
      this.ele.querySelector('.w-top-bar__title > span').textContent = v
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
      const c = this.ele.querySelector('.w-innerHTML')
      c.innerHTML = ''
      if (typeof v === 'string') c.innerHTML = v
      else if (v instanceof HTMLElement) c.appendChild(v)
    }
  }

  get closable () { return this._closable }
  set closable (v) {
    this._closable = v
    const close = v ? '<span class="close">✖</span>' : ''
    this.ele.querySelector('.w-top-bar__close').innerHTML = close
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
    const e = this.ele.querySelector('.w-innerHTML').querySelectorAll(selector)
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

  open () {
    this.keepInFrame()
    this._display('visible')
    this.events.open.forEach(func => func())
  }

  close () {
    this._display('hidden')
    this.events.close.forEach(func => func())
  }

  update (opts, time) {
    time = time || 0
    const t = `${time}ms`
    this.ele.style.transition = `all ${t} var(--sarah-ease)`
    // trigger transition
    setTimeout(() => {
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
    if (this.ele.offsetTop < 2) this.top = 2
    else if (this.ele.offsetTop > window.innerHeight) {
      this.bottom = 2
    }
    if (this.ele.offsetLeft < 2) this.left = 2
    else if (this.ele.offsetLeft > window.innerWidth) {
      this.left = window.innerWidth - this.ele.offsetWidth - 10
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

  // TODO: ...Ilai's code goes here...

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createWindow () {
    this.ele = document.createElement('div')
    this.ele.className = 'widget'
    this.ele.innerHTML = `
      <div class="w-top-bar">
        <span class="w-top-bar__title">
          <span>${this._title}</span>
        </span>
        <span class="w-top-bar__close">
          ${this.closable ? '<span class="close">✖</span>' : ''}
        </span>
      </div>
      <div class="w-innerHTML">${this.innerHTML}</div>
    `
    document.body.appendChild(this.ele)
    this.ele.style.visibility = 'hidden'

    const close = this.ele.querySelector('.w-top-bar .close')
    if (close) close.addEventListener('click', () => this.close())

    this.recenter()
    this._marquee()
  }

  _marquee () {
    const titleWidth = this.ele.querySelector('.w-top-bar__title').clientWidth
    const titleSpanWidth = this.ele.querySelector('.w-top-bar__title > span').clientWidth
    if (titleSpanWidth >= titleWidth) {
      this.ele.querySelector('.w-top-bar__title').classList.add('marquee')
      this.ele.querySelector('.w-top-bar__title > span').style.animationDelay = `${Math.random() * 3}s`
    } else {
      this.ele.querySelector('.w-top-bar__title').classList.remove('marquee')
    }
  }

  _display (value) {
    if (value === 'visible' && this.ele.style.visibility === 'hidden') {
      this.bring2front()
    }
    this.ele.style.visibility = value
  }

  _css (prop, val) {
    const p = ['top', 'right', 'bottom', 'left']
    const s = ['width', 'height']
    if (s.includes(prop)) {
      this.ele.style[prop] = (typeof val === 'number') ? `${val}px` : val
    } else if (p.includes(prop)) {
      if (prop === 'left' || prop === 'right') {
        const left = (prop === 'left')
          ? val : window.innerWidth - val - this.width
        this.ele.style.left = `${left}px`
      } else { // top || bottom
        const top = (prop === 'top')
          ? val : window.innerHeight - val - this.height
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
      if (e.target.className === 'w-top-bar') {
        this.ele.querySelector('.w-top-bar').style.cursor = 'move'
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
    this.ele.querySelector('.w-top-bar').style.cursor = 'grab'
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
    if (this.mousedown === 'w-top-bar') {
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
      if (this._resizable) this.update({ width: w, height: h })
    }
  }
}

window.Widget = Widget
