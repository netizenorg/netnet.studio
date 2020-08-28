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
    title: 'settings',  // required
    innerHTML: element, // optional html string or HTMLElement
    resizable: true,    // optional (can user resize)
    listed: true,       // optional (can user star && display in Widgets Menu?)
    left: 20,           // optional
    top: 20,            // optional
    zIndex: 100,        // optional (make sure it's always between 100 && 200)
    width: 500,         // optional
    height: 500         // optional
  })

  w.innerHTML = element
  w.title = 'settings'
  w.resizable = false
  w.left = 20
  w.top =  '50vh'
  w.bottom = 20
  w.right =  '50vh'
  w.zIndex = 100
  w.width = '50vw'
  w.height = '50vh'

  w.opened // read only property, returns true/false

  w.open()                // display
  w.close()               // hide

  w.recenter() // recenters the widget
  w.update(cssObj, transitionTime) // to update CSS

  // when using update() to position the widget (left/right/top/bottom)
  // you must pass number values (not strings), for example:
  w.update({ top: 29, right: 20 }, 500)

*/
class Widget {
  constructor (opts) {
    opts = opts || {}
    this._key = null
    this._title = opts.title || 'netnet widget'
    this._innerHTML = opts.innerHTML || ''
    this._listed = (typeof opts.listed === 'boolean') ? opts.listed : true
    this._resizable = (typeof opts.resizable === 'boolean') ? opts.resizable : true
    this.mousedown = false

    this._createWindow()
    this._updateIfListed()

    const s = ['top', 'right', 'bottom', 'left', 'zIndex', 'width', 'height']
    s.forEach(p => { this[`_${p}`] = null })
    for (const prop in opts) if (s.includes(prop)) this._css(prop, opts[prop])

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

  get left () { return parseInt(this.ele.style.left) }
  set left (v) { this._css('left', v) }

  get top () { return parseInt(this.ele.style.top) }
  set top (v) { this._css('top', v) }

  get right () { return window.innerWidth - this.width - this.left }
  set right (v) { this._css('right', v) }

  get bottom () { return window.innerHeight - this.height - this.top }
  set bottom (v) { this._css('bottom', v) }

  get zIndex () { return this.ele.style.zIndex }
  set zIndex (v) { this._css('zIndex', v) }

  get width () { return this.ele.offsetWidth }
  set width (v) { this._css('width', v) }

  get height () { return this.ele.offsetHeight }
  set height (v) { this._css('height', v) }

  get title () { return this._title }
  set title (v) {
    if (typeof v !== 'string') {
      return console.error('Widget: title property must be set to a string')
    } else {
      this._title = v
      this.ele.querySelector('.w-top-bar > span:nth-child(1)').textContent = v
    }
  }

  get resizable () { return this._resizable }
  set resizable (v) { this._resizable = v }

  get opened () { return this.ele.style.visibility === 'visible' }
  set opened (v) { console.error('Widget: opened property is read only') }

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
    if (STORE.state.widgets.map(w => w.ref).includes(this)) {
      STORE.dispatch('OPEN_WIDGET', this)
    } else {
      console.error('Widget: this widget was never loaded to the STORE')
    }
  }

  close () {
    STORE.dispatch('CLOSE_WIDGET', this)
  }

  update (opts, time) {
    time = time || 0
    const t = `${time}ms`
    const ease = 'cubic-bezier(0.165, 0.84, 0.44, 1)'
    this.ele.style.transition = `all ${t} ${ease}`
    // trigger transition
    setTimeout(() => {
      for (const prop in opts) this._css(prop, opts[prop])
      setTimeout(() => { this.ele.style.transition = 'none' }, time)
      this._recentered = false
    }, 25)
  }

  recenter () {
    this._css('left', window.innerWidth / 2 - this.width / 2)
    this._css('top', window.innerHeight / 2 - this.height / 2)
    this._recentered = true
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  $ (selector) {
    const e = this.ele.querySelector('.w-innerHTML').querySelectorAll(selector)
    if (e.length > 1) return e
    else return e[0]
  }

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

    this.recenter()
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
    this.zIndex = 200
    let z = 100
    STORE.state.widgets
      .forEach(w => { if (w.key !== this.key) w.ref.zIndex = ++z })
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
      document.body.style.userSelect = 'none'
      // if it wasn't clicked on bottom right, then we shouldn't resize
      if (this.mousedown === 'widget' && !this._shouldResize(e)) {
        this.mousedown = false
      }
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
    if (this._shouldResize(e)) {
      this.ele.style.cursor = 'se-resize'
    } else this.ele.style.cursor = 'auto'

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
