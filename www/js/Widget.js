/* global Maths, HTMLElement, STORE */
/*
  -----------
     info
  -----------

  This class is used to create widgets, which is any additional functionality
  or information we want to display in it's own movable pop up window. It can
  be used on it's own to create simple widgets, but it can also be extended
  to make more complex widgets (see widgets/example.js)

  NOTE: this class is dependent on a couple of outside variables, see globals
  in the comment on the fist line for global JS variables it references

  -----------
     usage
  -----------

  const w = new Widget({
    title: 'settings', // required
    innerHTML: element,  // optional html string or HTMLElement
    x: 20,             // optional
    y: 20,             // optional
    z: 100,            // optional (make sure it's always between 100 && 200?)
    width: 500,        // optional
    height: 500        // optional
  })

  w.innerHTML = element
  w.title = 'settings'
  w.x = 20
  w.y = '50vh'
  w.z = 100
  w.width = '50vw'
  w.height = '50vh'

  w.position(x, y, z)     // update position
  w.resize(width, height) // update size
  w.open()                // display
  w.close()               // hide

*/
class Widget {
  constructor (opts) {
    opts = opts || {}
    this._title = opts.title || 'netnet widget'
    this._innerHTML = opts.innerHTML || ''
    this._x = opts.x || 20
    this._y = opts.y || 20
    this._z = opts.z || 100
    this._width = opts.width
    this._height = opts.height
    this.mousedown = false

    this._createWindow()
    this.position(opts.x, opts.y, opts.z)
    this.resize(this.width, this.height)

    // ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ .  event listeners

    window.addEventListener('mousedown', (e) => this._mouseDown(e), true)
    window.addEventListener('mouseup', (e) => this._mouseUp(e), true)
    window.addEventListener('mousemove', (e) => this._mouseMove(e), true)
    window.addEventListener('mousemove', (e) => this._updateShadow(e))
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  get x () { return this._x }
  set x (v) { this.position(v, null, null) }

  get y () { return this._y }
  set y (v) { this.position(null, v, null) }

  get z () { return this._z }
  set z (v) { this.position(null, null, v) }

  get width () { return this._width }
  set width (v) { this.resize(v, null) }

  get height () { return this._height }
  set height (v) { this.resize(null, v) }

  get title () { return this._title }
  set title (v) {
    if (typeof v !== 'string') {
      return console.error('Widget: title property must be set to a string')
    } else {
      this._title = v
      this.ele.querySelector('.w-top-bar > span:nth-child(1)').textContent = v
    }
  }

  get innerHTML () { return this._innerHTML }
  set innerHTML (v) {
    if (typeof v !== 'string' && !(v instanceof HTMLElement)) {
      const m = 'html string or an instanceof HTMLElement'
      return console.error('Widget: innerHTML property must be an ' + m)
    } else {
      this._innerHTML = v
      const c = this.ele.querySelector('.w-innerHTML')
      c.innerHTML = ''
      if (typeof v === 'string') c.innerHTML = v
      else if (v instanceof HTMLElement) c.appendChild(v)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  open () {
    STORE.dispatch('OPEN_WIDGET', this)
  }

  close () {
    STORE.dispatch('CLOSE_WIDGET', this)
  }

  position (x, y, z) {
    if (x) this._pos(x, 'x')
    if (y) this._pos(y, 'y')
    if (z) this._pos(z, 'z')
  }

  resize (w, h) {
    if (w) this._size(w, 'width')
    if (h) this._size(h, 'height')
  }

  $ (selector) {
    const e = this.ele.querySelector('.w-innerHTML').querySelectorAll(selector)
    if (e.length > 1) return e
    else return e[0]
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _pos (val, prop) {
    const type = prop === 'x'
      ? 'left' : prop === 'y'
        ? 'top' : prop === 'z'
          ? 'zIndex' : null
    this[`_${prop}`] = val
    this.ele.style[type] = (typeof val === 'number') ? `${val}px` : val
  }

  _size (val, prop) {
    this[`_${prop}`] = val
    this.ele.style[prop] = (typeof val === 'number') ? `${val}px` : val
  }

  _display (value) {
    this.ele.style.display = value
  }

  _createWindow () {
    this.ele = document.createElement('div')
    this.ele.className = 'widget'
    this.ele.innerHTML = `
      <div class="w-top-bar">
        <span>${this._title}</span>
        <span class="close">✖</span>
      </div>
      <div class="w-innerHTML">${this.innerHTML}</div>
    `
    document.body.appendChild(this.ele)
    this.ele.style.display = 'none'

    const topbar = this.ele.querySelector('.w-top-bar')
    topbar.style.cursor = 'grab'

    const title = this.ele.querySelector('.w-top-bar > span:nth-child(1)')
    title.style.cursor = 'auto'

    const close = this.ele.querySelector('.w-top-bar > span:nth-child(2)')
    close.style.cursor = 'pointer'
    close.addEventListener('click', () => this.close())
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _mouseDown (e) {
    const self = e.target.parentNode === this.ele || e.target === this.ele
    if (self) {
      this.mousedown = e.target.className
      if (e.target.className === 'w-top-bar') {
        this.ele.querySelector('.w-top-bar').style.cursor = 'move'
      }
      document.body.style.userSelect = 'none'
    }
  }

  _mouseUp (e) {
    this.mousedown = false
    this.winOff = null
    this.ele.querySelector('.w-top-bar').style.cursor = 'grab'
    document.body.style.userSelect = 'auto'
  }

  _mouseMove (e) {
    e.preventDefault()
    // check if cursor is over bottom right corner
    const offX = this.ele.offsetWidth + this.ele.offsetLeft - 20
    const offY = this.ele.offsetHeight + this.ele.offsetTop - 20
    if (e.clientX > offX && e.clientY > offY) {
      this.ele.style.cursor = 'se-resize'
    } else this.ele.style.cursor = 'auto'

    // move or resize window
    if (this.mousedown === 'w-top-bar') {
      if (!this.winOff || typeof this.winOff === 'undefined') {
        this.winOff = {
          x: e.clientX - this.ele.offsetLeft,
          y: e.clientY - this.ele.offsetTop
        }
      }
      this.ele.style.left = e.clientX - this.winOff.x + 'px'
      this.ele.style.top = e.clientY - this.winOff.y + 'px'
    } else if (this.mousedown === 'widget') {
      const w = e.clientX - this.ele.offsetLeft
      const h = e.clientY - this.ele.offsetTop
      this.resize(w, h)
    }
  }

  _updateShadow (e) {
    const center = {
      x: this.ele.getBoundingClientRect().left,
      y: this.ele.getBoundingClientRect().top
    }
    const x = e.clientX < center.x
      ? Maths.map(e.clientX, 0, center.x, 33, 0)
      : Maths.map(e.clientX, center.x, window.innerWidth, 0, -33)
    const y = e.clientY < center.y
      ? Maths.map(e.clientY, 0, center.y, 33, 0)
      : Maths.map(e.clientY, center.y, window.innerHeight, 0, -33)
    this.ele.style.boxShadow = `${x}px ${y}px 33px -9px rgba(0, 0, 0, 0.75)`
  }
}

window.Widget = Widget
