/* global HTMLElement, utils */
class MenuItem extends HTMLElement {
  constructor () {
    super()
    this._oldPos = { left: '0px', top: '0px' }
    this.syncProps2Attr()
  }

  connectedCallback () {
    if (!this.offset) this.offset = -20

    const time = utils.getVal('--menu-fades-time')

    const div = document.createElement('div')
    div.setAttribute('title', this.title)
    utils.css(div, {
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
      transition: `left ${time}ms, top ${time}ms, opacity ${time}ms`
    })

    this._oldPos = { left: div.style.left, top: div.style.top }

    const img = document.createElement('img')
    img.setAttribute('src', this.icon)
    img.setAttribute('alt', this.title)
    img.style.width = '50%'
    div.appendChild(img)

    const tri = document.createElement('div')
    div.appendChild(tri)
    utils.css(tri, {
      position: 'absolute',
      left: '0px',
      top: '0px',
      width: '20px',
      height: '15px',
      background: 'var(--fg-color)',
      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
      webkitClipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
    })

    this.appendChild(div)
  }

  set opened (v) {
    console.error('menu-item: opened property is read-only')
  }

  get opened () {
    const d = this.querySelector('div').style.display
    if (d === 'flex') return true
    else return false
  }

  toggle (opened, rad, sub, turn) {
    const div = this.querySelector('div')
    if (opened) {
      div.style.display = 'flex'
      this._oldPos = { left: div.style.left, top: div.style.top }
      clearTimeout(this._toggleTO)
      this._toggleTO = setTimeout(() => {
        this._positionElement(rad, sub, turn)
        div.style.opacity = 1
      }, 50)
    } else {
      div.style.left = this._oldPos.left
      div.style.top = this._oldPos.top
      div.style.opacity = 0
      const time = utils.getVal('--menu-fades-time')
      clearTimeout(this._toggleTO)
      this._toggleTO = setTimeout(() => {
        div.style.display = 'none'
      }, time)
    }
  }

  update (opts, time) {
    time = time || 0
    const t = `${time}ms`
    const div = this.querySelector('div')
    div.style.transition = `all ${t} var(--sarah-ease)`
    // trigger transition
    setTimeout(() => {
      // NOTE: width && height should alwasy be set before left, top, etc
      // if props called in other order than _css won't render right
      for (const prop in opts) this._css(prop, opts[prop])
      setTimeout(() => { div.style.transition = 'none' }, time)
    }, 25)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸ PRIVATE METHODS
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸

  _css (prop, val) {
    const p = ['top', 'right', 'bottom', 'left']
    const s = ['width', 'height']
    const div = this.querySelector('div')
    if (s.includes(prop)) {
      div.style[prop] = (typeof val === 'number') ? `${val}px` : val
    } else if (p.includes(prop)) {
      if (prop === 'left' || prop === 'right') {
        const width = parseInt(div.style.width)
          ? parseInt(div.style.width) : this.width
        const left = (prop === 'left')
          ? val : window.innerWidth - val - width
        div.style.left = `${left}px`
      } else { // top || bottom
        const height = parseInt(div.style.height)
          ? parseInt(div.style.height) : this.height
        const top = (prop === 'top')
          ? val : window.innerHeight - val - height
        div.style.top = `${top}px`
      }
    } else {
      div.style[prop] = val
    }
  }

  _positionTriangle (i) {
    const div = this.querySelector('div')
    const tri = this.querySelector('div > div')
    const offset = {
      x: parseInt(div.style.width) / 2 - parseInt(tri.style.width) / 2,
      y: parseInt(div.style.height) / 2 - parseInt(tri.style.height) / 2
    }
    const radius = parseInt(div.style.width) * 0.55
    tri.style.top = -Math.cos(i) * radius + offset.y + 'px'
    tri.style.left = -Math.sin(i) * radius + offset.x + 'px'
    tri.style.transform = `rotate(${-i}rad)`
  }

  _positionElement (rad, sub, turn) {
    const div = this.querySelector('div')
    // rad = radius of circle (default 100px)
    // sub = fraction of circle to draw (default full circle)
    // turn = spin/turn the circle (default no turn)
    const items = [...this.parentNode.children]
    const index = items.indexOf(this)
    const radius = rad || 100
    const arc = (Math.PI * 2) * (sub || 1)
    const i = index * (arc / items.length) + (turn || 0)
    div.style.top = Math.cos(i) * radius + Number(this.offset) + 'px'
    div.style.left = Math.sin(i) * radius + Number(this.offset) + 'px'
    this._positionTriangle(i)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* attributes + properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  static get observedAttributes () {
    return ['title', 'icon', 'offset']
  }

  syncProps2Attr () {
    if (this.constructor.observedAttributes &&
      this.constructor.observedAttributes.length) {
      this.constructor.observedAttributes.forEach(attr => {
        Object.defineProperty(this, attr, {
          get () { return this.getAttribute(attr) },
          set (v) {
            if (v !== null || typeof v !== 'undefined') this.setAttribute(attr, v)
            else this.removeAttribute(attr)
          }
        })
      })
    }
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (newVal !== oldVal) this[attrName] = newVal
  }
}

window.customElements.define('menu-item', MenuItem)
