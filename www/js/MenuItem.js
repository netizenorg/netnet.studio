/* global Maths */
/*
  -----------
     info
  -----------

  This class is used to create menu items. These are the circle bubbles that
  appear in the main menu as well as alerts (for errors and edu information)

  NOTE: this class is dependent on a couple of outside variables, see globals
  in the comment on the fist line for global JS variables it references

  -----------
     usage
  -----------

  const mi = new MenuItem({
    title: 'name',            // name of item, appears on hover
    icon: 'path/to/icon.png', // path to menu item icon
    click: () => {},          // function to call when clicked
  })

  // when used in main menu there are a couple of additional options,
  // these are used to know where/how to position the item
  {
    index: 0, // to know it's place/order in the menu
    total: 4 // to know the total number of menu items in the menu
  }

  mi.ele // the actual html element, needs to be injected into the DOM

  mi.icon = 'path/to/icon.png' // to update the icon
  mi.title = 'name' // to update the name

  mi.toggle() // to show/hide the menu item
  mi.click() // to call it's click funciton

*/
class MenuItem {
  constructor (opts) {
    this._title = opts.title || ''
    this._icon = opts.icon || ''
    this.click = opts.click
    this.index = opts.index || 0
    this.total = opts.total || 1
    this.opened = false

    const t = window.getComputedStyle(document.documentElement)
      .getPropertyValue('--menu-fades-time')
    this.transitionTime = t.includes('ms') ? parseInt(t) : parseInt(t) * 1000
    this.offset = opts.offset || -20

    this._setupElement()

    // ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ .  event listeners

    window.addEventListener('mousemove', (e) => this._updateShadow(e))
    this.ele.addEventListener('click', (e) => this.click())
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  get icon () { return this._icon }
  set icon (v) { this._icon = v; this.img.setAttribute('src', this._icon) }

  get title () { return this._title }
  set title (v) {
    this._title = v
    this.ele.setAttribute('title', this._title)
    this.img.setAttribute('alt', this._title)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•.¸ public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  toggle (opened, rad, sub, turn) {
    if (opened) {
      this.opened = true
      this.ele.style.display = 'flex'
      this._oldPos = { left: this.ele.style.left, top: this.ele.style.top }
      clearTimeout(this._toggleTO)
      this._toggleTO = setTimeout(() => {
        this._positionElement(rad, sub, turn)
        this.ele.style.opacity = 1
      }, 50)
    } else {
      this.ele.style.left = this._oldPos.left
      this.ele.style.top = this._oldPos.top
      this.ele.style.opacity = 0
      const time = this.transitionTime
      clearTimeout(this._toggleTO)
      this._toggleTO = setTimeout(() => {
        this.ele.style.display = 'none'
        this.opened = false
      }, time)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _css (ele, obj) { for (const key in obj) ele.style[key] = obj[key] }

  _setupElement () {
    this.ele = document.createElement('div')
    this.ele.setAttribute('title', this._title)
    this._css(this.ele, {
      cursor: 'pointer',
      position: 'absolute',
      zIndex: '10',
      top: `${this.offset}px`,
      left: `${this.offset}px`,
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: 'var(--fg-color)',
      boxShadow: '33px 33px 33px -9px rgba(0, 0, 0, 0.75)',
      display: 'none', /* or flex */
      justifyContent: 'center',
      alignItems: 'center',
      transition: `left ${this.transitionTime}ms, top ${this.transitionTime}ms, opacity ${this.transitionTime}ms`
    })

    this._oldPos = { left: this.ele.style.left, top: this.ele.style.top }

    this.img = document.createElement('img')
    this.img.setAttribute('src', this._icon)
    this.img.setAttribute('alt', this._title)
    this.img.style.width = '50%'
    this.ele.appendChild(this.img)

    this.tri = document.createElement('div')
    this.ele.appendChild(this.tri)
    this._css(this.tri, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '20px',
      height: '15px',
      background: 'var(--fg-color)',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      webkitClipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
    })
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

  _positionTriangle (i) {
    const offset = {
      x: parseInt(this.ele.style.width) / 2 - parseInt(this.tri.style.width) / 2,
      y: parseInt(this.ele.style.height) / 2 - parseInt(this.tri.style.height) / 2
    }
    const radius = parseInt(this.ele.style.width) * 0.55
    this.tri.style.top = -Math.cos(i) * radius + offset.y + 'px'
    this.tri.style.left = -Math.sin(i) * radius + offset.x + 'px'
    this.tri.style.transform = `rotate(${-i}rad)`
  }

  _positionElement (rad, sub, turn) {
    // rad = radius of circle (default 100px)
    // sub = fraction of circle to draw (default full circle)
    // turn = spin/turn the circle (default no turn)
    const radius = rad || 100
    const arc = (Math.PI * 2) * (sub || 1)
    const i = (this.index) * (arc / this.total) + (turn || 0)
    this.ele.style.top = Math.cos(i) * radius + this.offset + 'px'
    this.ele.style.left = Math.sin(i) * radius + this.offset + 'px'
    this._positionTriangle(i)
  }
}

window.MenuItem = MenuItem
