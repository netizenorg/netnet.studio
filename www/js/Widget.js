/* global HTMLElement, STORE, WIDGETS */
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
    z: 100,            // optional (make sure it's always between 100 && 200)
    width: 500,        // optional
    height: 500        // optional
    resizable: true,   // optional (can user resize)
    listed: true       // optional (can user star && display in Widgets Menu?)
  })

  w.innerHTML = element
  w.title = 'settings'
  w.x = 20
  w.y = '50vh'
  w.z = 100
  w.width = '50vw'
  w.height = '50vh'
  w.resizable = false

  w.opened // read only property, returns true/false

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
    this._resizable = opts.resizable || true
    this._listed = opts.listed || true
    this._key = null
    this.mousedown = false

    this._createWindow()
    this.position(opts.x, opts.y, opts.z)
    this.resize(this.width, this.height)
    this._updateIfListed()

    // ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ .  event listeners
    const wu = window.utils
    window.addEventListener('mousedown', (e) => this._mouseDown(e), true)
    window.addEventListener('mouseup', (e) => this._mouseUp(e), true)
    window.addEventListener('mousemove', (e) => this._mouseMove(e), true)
    window.addEventListener('mousemove', (e) => wu.updateShadow(e, this))
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
      this.ele.querySelector('.w-top-bar > span:nth-child(1)').textContent = v
    }
  }

  get key () { return this._key }
  set key (v) {
    if (typeof v !== 'string') {
      return console.error('Widget: key property must be set to a string')
    } else {
      this._key = v
      this._updateIfListed()
    }
  }

  get listed () { return this._listed }
  set listed (v) {
    if (typeof v !== 'boolean') {
      return console.error('Widget: listed property must be set to a boolean')
    } else {
      this._listed = v
      this._updateIfListed()
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

  _createWindow () {
    this.ele = document.createElement('div')
    this.ele.className = 'widget'
    this.ele.innerHTML = `
      <div class="w-top-bar">
        <span>${this._title}</span>
        <span>
          <span class="star">☆</span>
          <span class="close">✖</span>
        </span>
      </div>
      <div class="w-innerHTML">${this.innerHTML}</div>
    `
    document.body.appendChild(this.ele)
    this.ele.style.visibility = 'hidden'

    this.ele.querySelector('.w-top-bar .close')
      .addEventListener('click', () => this.close())

    this.ele.querySelector('.w-top-bar .star')
      .addEventListener('click', () => this._star())
  }

  _updateIfListed () {
    // if this instance is set to be listed && if it has it's key property set
    // (ie. if it was instantiated via a 'LOAD_WIDGETS' action)
    if (this.listed && this.key) {
      // display star span
      this.ele.querySelector('.w-top-bar .star').style.display = 'inline'
      // set appropriate star character if user has starred it
      let stared = window.localStorage.getItem('stared-widgets')
      stared = stared ? JSON.parse(stared) : []
      if (stared.includes(this.key)) {
        this.ele.querySelector('.w-top-bar .star').textContent = '★'
      } else {
        this.ele.querySelector('.w-top-bar .star').textContent = '☆'
      }
    } else { // hide star span
      this.ele.querySelector('.w-top-bar .star').style.display = 'none'
    }
  }

  _star () {
    // this method runs when the user clicks the star icon
    // as noted in _updateIfListed(), the icon only shows up if the instanceof
    // the widget has this.listed === true (some widgets like those used in
    // as sub-menus should not be listed) and also if the widget has it's
    // key property set. a key property is set when the widget is instantiated
    // by having dispatched a LOAD_WIDGETS actions, like...
    // STORE.dispatch('LOAD_WIDGETS', { keyname: new Widget() })
    // (which is how any Widgets defined in a tutorial are loaded)
    // or, if the Widget is a more complex class, extended from this base
    // class && defined in it's own file in the www/widgets/ directory
    // then it needs to have been given a this.key = 'something' in it's
    // constructor in ordfer for it to have been automatically instantiated
    // by the WindowManager (which wil also dispatch a LOAD_WIDGETS action)
    let stared = window.localStorage.getItem('stared-widgets')
    stared = stared ? JSON.parse(stared) : []
    if (stared.includes(this.key)) { // unstar it
      this.ele.querySelector('.w-top-bar .star').textContent = '☆'
      const i = stared.indexOf(this.key)
      stared.splice(i, 1)
      window.localStorage.setItem('stared-widgets', JSON.stringify(stared))
    } else { // star it
      this.ele.querySelector('.w-top-bar .star').textContent = '★'
      stared.push(this.key)
      stared = stared.reverse()
      window.localStorage.setItem('stared-widgets', JSON.stringify(stared))
    }
    // udpate Widgets Menu to reflect changes
    if (WIDGETS['widgets-menu']) WIDGETS['widgets-menu'].update()
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _pos (val, prop) {
    this[`_${prop}`] = val
    if (prop === 'x') {
      this.ele.style.left = (typeof val === 'number') ? `${val}px` : val
    } else if (prop === 'y') {
      this.ele.style.top = (typeof val === 'number') ? `${val}px` : val
    } else if (prop === 'z') {
      this.ele.style.zIndex = val
    }
  }

  _size (val, prop) {
    this[`_${prop}`] = val
    this.ele.style[prop] = (typeof val === 'number') ? `${val}px` : val
  }

  _display (value) {
    // used by StateManager's render() method when OPEN/CLOSE_WIDGET dispatched
    if (value === 'visible' && this.ele.style.visibility === 'hidden') {
      this._bring2front()
    }
    this.ele.style.visibility = value
  }

  _bring2front () {
    // NOTE: this will work so long as there are less than 100
    // Widgets open... safe assumption i hope
    this.z = 200
    let z = 100
    STORE.state.widgets
      .forEach(w => { if (w.key !== this.key) w.ref.z = ++z })
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
      // update z index so it's above other widgets
      this._bring2front()
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
    if (e.clientX > offX && e.clientY > offY && this._resizable) {
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
      if (this._resizable) this.resize(w, h)
    }
  }
}

window.Widget = Widget
