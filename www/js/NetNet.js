/* global NNE, Menu, Color, utils */
class NetNet {
  constructor () {
    this.layouts = [
      'welcome', 'separate-window', 'dock-left', 'full-screen', 'dock-bottom'
    ]

    this.events = {
      moved: [],
      'theme-change': [],
      'layout-change': []
    }

    this.themeConfig = {
      dark: { background: false, shadow: true },
      light: { background: true, shadow: false },
      monokai: { background: true, shadow: false }
    }

    this.rndr = document.querySelector('#nn-output')
    this.win = document.querySelector('#nn-window')
    this.edtr = document.querySelector('#nn-editor')
    this.menu = new Menu(this.win) // document.querySelector('#nn-menu')
    this.canv = this._createCanvas()
    // ...canvas background visible when theme { background: false }

    this.layout = 'welcome'

    NNE.on('render-update', () => this._bubbleUpiFrameEvents())
    window.addEventListener('mousemove', (e) => this._mouseMove(e), true)
    window.addEventListener('mouseup', (e) => this._mouseUp(e), true)
    window.addEventListener('mousedown', (e) => this._mouseDown(e), true)
    window.addEventListener('resize', (e) => this._canvasResize(e))
    window.addEventListener('DOMContentLoaded', (e) => {
      this.updateTheme()
      this._bubbleUpiFrameEvents()
      if (this.layout === 'welcome') this._showEditor(false)
    })
  }

  err (m) {
    if (m.type === 'invalid-prop-value') {
      console.error('NetNet:', `invalid ${m.prop} value, must be: ${m.opts}`)
    } else console.error('NetNet:', m)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  get layout () { return this._layout }
  set layout (v) {
    if (!this.layouts.includes(v)) {
      const options = this.layouts.join(', ')
      return this.err({
        type: 'invalid-prop-value', prop: 'layout', opts: options
      })
    } else this._adjustLayout(v)
  }

  get theme () { return NNE.theme }
  set theme (v) { this.updateTheme(v) }

  get width () {
    const options = this.menu.textBubble.$('.text-bubble-options').offsetWidth
    const nnwindow = this.win.offsetWidth
    const textBubble = this.menu.textBubble.offsetWidth
    const width = nnwindow > textBubble
      ? nnwindow : textBubble > options
        ? textBubble : options
    return width
  }

  get height () {
    const options = this.menu.textBubble.$('.text-bubble-options').offsetHeight
    const nnwindow = this.win.offsetHeight
    const textBubble = this.menu.textBubble.offsetHeight
    const margin = 4
    return nnwindow + margin + options + textBubble
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•. public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

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

  nextLayout () {
    let idx = this.layouts.indexOf(this.layout)
    idx = idx < this.layouts.length - 1 ? idx + 1 : 0
    this.layout = this.layouts[idx]
  }

  prevLayout () {
    let idx = this.layouts.indexOf(this.layout)
    idx = idx > 0 ? idx - 1 : this.layouts.length - 1
    this.layout = this.layouts[idx]
  }

  updateTheme (theme, background) {
    const old = NNE.theme
    NNE.theme = theme || 'dark'
    NNE.background = background || false
    if (!background) { NNE.background = this.themeConfig[NNE.theme].background }
    const de = document.documentElement
    const fg = window.getComputedStyle(de).getPropertyValue('--netizen-tag')
    document.documentElement.style.setProperty('--fg-color', fg)
    const bg = window.getComputedStyle(de).getPropertyValue('--netizen-background')
    document.documentElement.style.setProperty('--bg-color', bg.substr(0, 7))
    this._calcCanvasColors()
    this._canvasResize()
    this._canvasUpdate(0, 0)
    this.menu.updateFace()
    this.emit('theme-change', { old, new: NNE.theme })
  }

  getThemeColors () {
    const de = document.documentElement
    const fg = window.getComputedStyle(de).getPropertyValue('--fg-color')
    const bg = window.getComputedStyle(de).getPropertyValue('--bg-color')
    return { fg, bg }
  }

  update (opts, time) {
    time = time || 0
    const t = `${time}ms`
    this.win.style.transition = `all ${t} var(--sarah-ease)`
    // trigger transition
    setTimeout(() => {
      for (const prop in opts) this._css(prop, opts[prop])
      setTimeout(() => {
        this.win.style.transition = 'none'
        this.keepInFrame()
      }, time)
    }, 25)
  }

  recenter (time) {
    time = time || 0
    const t = `${time}ms`
    this.win.style.transition = `all ${t} var(--sarah-ease)`
    if (this.layout !== 'welcome' && this.layout !== 'separate-window') return
    this.win.style.display = 'block'
    if (this._centerTO) clearTimeout(this._centerTO)
    this._centerTO = setTimeout(() => {
      this.win.style.left = window.innerWidth / 2 - this.width / 2 + 'px'
      this.win.style.top = window.innerHeight / 2 - this.height / 2 + 'px'
      this.win.style.opacity = 1
      setTimeout(() => {
        this.win.style.transition = 'none'
        this.keepInFrame()
      }, time)
    }, 10)
  }

  keepInFrame () { // ensure that the textBubble is always readable in frame
    setTimeout(() => {
      // 35 is the "bottom =" offset +a little extra, see NNW.menu.updatePosition()
      const offset = this.win.offsetTop - this.menu.textBubble.offsetHeight - 35
      if (offset < 0) {
        this.win.style.transition = 'top .5s var(--sarah-ease)'
        setTimeout(() => {
          const t = this.win.offsetTop + Math.abs(offset)
          this.win.style.top = `${t + 10}px` // +10 for a little space
          setTimeout(() => { this.win.style.transition = 'none' }, 500)
        }, 10)
      }
      // check if text-bubbles are going off-frame left
      if (this.layout === 'welcome' || this.layout === 'separate-window') {
        const winRight = this.win.offsetLeft + this.win.offsetWidth
        let tbWidth = 0
        const btns = this.menu.textBubble.$('.text-bubble-options > button')
        // +5 button margin
        if (btns && btns.length > 0) btns.forEach(b => { tbWidth += b.offsetWidth + 5 })
        else if (btns) { tbWidth += btns.offsetWidth + 5 }
        // 0.8 b/c .text-bubble-options width:80%;
        // divided by 2, b/c .text-bubble-options translateX(-50%)
        const nudge = (this.menu.textBubble.offsetWidth -
          (this.menu.textBubble.offsetWidth * 0.8)) / 2
        if (tbWidth + nudge > winRight) {
          this.win.style.transition = 'top .5s var(--sarah-ease)'
          setTimeout(() => {
            let l = this.win.offsetLeft
            l += tbWidth + nudge - winRight
            this.win.style.left = `${l + 20}px` // +20 for a little space
            setTimeout(() => { this.win.style.transition = 'none' }, 500)
          }, 10)
        }
      }
    }, utils.getVal('--layout-transition-time'))
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ window drag/move via mouse

  _mouseMove (e) {
    // e.preventDefault()
    this._canvasMouseMove(e)

    if (!this.themeConfig[NNE.theme].shadow) {
      this.win.style.boxShadow = 'none'
    } else {
      const opac = this.layout === 'welcome' ? 0.5 : 0.75
      utils.updateShadow(e, this.win, opac)
    }

    this._updateCursor(e)
    if (this.mousedown) this._resizeWindow(e)
    if (this.cursor === 'move') this._moveWindow(e)
  }

  _mouseUp () {
    this.mousedown = false
    this.cursor = 'auto'
    this.winOff = null
    utils.selecting(true)
  }

  _mouseDown (e) {
    const mw = (this.layout === 'separate-window' || this.layout === 'welcome')
    if (e.target.id === 'nn-window') this.mousedown = true
    else if (e.target.id === 'nn-menu' && mw) {
      this.mousedown = true
      this.cursor = 'move'
      this.win.style.cursor = this.cursor
    }
  }

  _updateCursor (e) {
    if (this.layout === 'dock-bottom') this.cursor = 'row-resize'
    else if (this.layout === 'dock-left') this.cursor = 'col-resize'
    else if (this.layout === 'separate-window') {
      const offX = this.win.offsetWidth + this.win.offsetLeft - 45
      const offY = this.win.offsetHeight + this.win.offsetTop - 45
      if (e.clientX > offX && e.clientY > offY) this.cursor = 'se-resize'
      if (e.target.id === 'nn-menu') {
        if (this.mousedown) this.cursor = 'move'
        else this.cursor = 'grab'
      }
    }

    const mv = this.cursor === 'move' || this.cursor === 'grab'
    if (e.target.id !== 'nn-window' && !mv) this.cursor = 'auto'

    if (this.cursor === 'auto') utils.selecting(true)
    else utils.selecting(false)

    this.win.style.cursor = this.cursor
  }

  _resizeWindow (e) {
    const tbWasOpened = this.menu.textBubble && this.menu.textBubble.opened
    if (tbWasOpened) this.menu.updatePosition()

    if (this.layout === 'dock-bottom') {
      this.win.style.height = window.innerHeight - e.clientY + 'px'
      this.rndr.style.height = e.clientY + 'px'
    } else if (this.layout === 'dock-left') {
      this.win.style.width = e.clientX + 'px'
      const w = window.innerWidth - e.clientX
      this.rndr.style.width = w + 'px'
      this.rndr.style.left = e.clientX + 'px'
      this.menu.updatePosition()
    } else if (this.layout === 'separate-window' && this.cursor !== 'move') {
      this.win.style.width = e.clientX - parseInt(this.win.style.left) + 'px'
      this.win.style.height = e.clientY - parseInt(this.win.style.top) + 'px'
      this.menu.updatePosition()
    }
    // NNE.code = NNE.cm.getValue() << old comment
    this._canvasResize(e)
  }

  _moveWindow (e) {
    if (!this.winOff || typeof this.winOff === 'undefined') {
      this.winOff = {
        x: e.clientX - this.win.offsetLeft,
        y: e.clientY - this.win.offsetTop
      }
    }
    this.win.style.left = e.clientX - this.winOff.x + 'px'
    this.win.style.top = e.clientY - this.winOff.y + 'px'

    this.emit('moved', {
      old: {
        left: parseInt(this.win.style.left),
        top: parseInt(this.win.style.top)
      },
      new: {
        left: e.clientX - this.winOff.x,
        top: e.clientY - this.winOff.y
      }
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸ adjusting layout/orientation

  _toggleTransition (bool) {
    if (bool) {
      this.win.style.transition = 'all var(--layout-transition-time)'
      this.menu.ele.style.transition = 'all var(--layout-transition-time)'
      this.rndr.style.transition = 'all var(--layout-transition-time)'
    } else {
      this.win.style.transition = 'none'
      this.menu.ele.style.transition = 'none'
      this.rndr.style.transition = 'none'
    }
  }

  _css (prop, val) {
    const l = (this.layout !== 'welcome' || this.layout !== 'separate-window')
    const p = ['top', 'right', 'bottom', 'left']
    const s = ['width', 'height']
    const bw = this.menu.textBubble.$('.text-bubble-options').offsetWidth
    const ww = this.win.offsetWidth
    const bh = this.menu.textBubble.$('.text-bubble-options').offsetHeight +
      this.menu.textBubble.offsetHeight
    if (s.includes(prop)) {
      if (!l) return
      this.win.style[prop] = (typeof val === 'number') ? `${val}px` : val
    } else if (p.includes(prop)) {
      if (!l) return
      if (prop === 'left' || prop === 'right') {
        val = bw > ww ? val + (bw - ww) : val
        const left = (prop === 'left')
          ? val : window.innerWidth - val - this.win.offsetWidth
        this.win.style.left = `${left}px`
      } else { // top || bottom
        const top = (prop === 'top')
          ? val + bh : window.innerHeight - val - this.win.offsetHeight
        this.win.style.top = `${top}px`
      }
    } else {
      this.win.style[prop] = val
    }
  }

  _adjustLayout (v) {
    if (v === this._layout) return
    const old = this._layout
    this._toggleTransition(true)
    this._layout = v
    this.menu.updateFace()
    this.menu.toggleMenu(false)
    // this.opacity = STORE.state.opacity

    const tbWasOpened = this.menu.textBubble && this.menu.textBubble.opened
    if (tbWasOpened) this.menu.textBubble.fadeOut(10)

    const after = () => {
      this._toggleTransition(false)
      this._canvasResize()
      this.menu.updatePosition()
      if (tbWasOpened) this.menu.textBubble.fadeIn()
      this.emit('layout-change', { old, new: v })
    }

    if (v === 'welcome') {
      this.rndr.style.width = '100%'
      this.rndr.style.height = '100%'
      this.rndr.style.left = '0px'
      this.rndr.style.top = '0px'
      this.win.style.width = '430px'
      this.win.style.height = '295px'
      this.win.style.left = 'calc(-170px + 50vw)'
      this.win.style.top = 'calc(-135px + 50vh)'
      this.win.style.bottom = null
      this.win.style.borderRadius = '25px 25px 1px 1px'
      this.canv.style.borderRadius = '15px 15px 1px 1px'
      this._showEditor(false)
      utils.afterLayoutTransition(() => after())
    } else if (v === 'dock-bottom') {
      this.rndr.style.width = '100%'
      this.rndr.style.height = window.innerHeight / 2 + 'px'
      this.rndr.style.left = '0px'
      this.rndr.style.top = '0px'
      this.win.style.width = '100%'
      this.win.style.height = window.innerHeight / 2 + 'px'
      this.win.style.left = '0px'
      this.win.style.top = null
      this.win.style.bottom = '0px'
      this.win.style.borderRadius = '25px 25px 1px 1px'
      this.canv.style.borderRadius = '15px 15px 1px 1px'
      this._showEditor(true)
      utils.afterLayoutTransition(() => after())
    } else if (v === 'dock-left') {
      this.rndr.style.width = window.innerWidth / 2 + 'px'
      this.rndr.style.height = '100%'
      this.rndr.style.left = window.innerWidth / 2 + 'px'
      this.rndr.style.top = '0px'
      this.win.style.width = window.innerWidth / 2 + 'px'
      this.win.style.height = '100%'
      this.win.style.left = '0px'
      this.win.style.top = '0px'
      this.win.style.bottom = null
      this.win.style.borderRadius = '1px 25px 25px 1px'
      this.canv.style.borderRadius = '1px 15px 15px 1px'
      this._showEditor(true)
      utils.afterLayoutTransition(() => after())
    } else if (v === 'full-screen') {
      this.rndr.style.width = '100%'
      this.rndr.style.height = '100%'
      this.rndr.style.left = '0px'
      this.rndr.style.top = '0px'
      this.win.style.width = '100%'
      this.win.style.height = '100%'
      this.win.style.left = '0px'
      this.win.style.top = '0px'
      this.win.style.bottom = null
      this.win.style.borderRadius = '1px 1px 1px 1px'
      this.canv.style.borderRadius = '1px 1px 1px 1px'
      this._showEditor(true)
      utils.afterLayoutTransition(() => after())
    } else if (v === 'separate-window') {
      this._showEditor(true)
      this.rndr.style.width = '100%'
      this.rndr.style.height = '100%'
      this.rndr.style.left = '0px'
      this.rndr.style.top = '0px'
      const wf = window.innerWidth / 2
      const eh = NNE.code.split('\n').length * 25
      const hf = window.innerHeight / 2 < eh + 75
        ? window.innerHeight / 2 : eh + 75
      this.win.style.width = wf + 'px'
      this.win.style.height = hf + 'px'
      this.win.style.left = window.innerWidth / 2 - wf / 2 + 'px'
      this.win.style.top = window.innerHeight / 2 - hf / 2 + 'px'
      this.win.style.bottom = null
      this.win.style.borderRadius = '25px 25px 1px 1px'
      this.canv.style.borderRadius = '15px 15px 1px 1px'
      utils.afterLayoutTransition(() => after())
    }
  }

  // + + + + NETITOR STUFF + + + +

  _showEditor (show) {
    const face = document.querySelector('#face')
    if (show) {
      this.edtr.style.display = 'block'
      if (face) face.style.fontSize = 'inherit'
      if (face) face.style.margin = '0'
      this.menu.ele.style.alignItems = 'flex-end'
      // this.menu.ele.style.width = 'auto'
      this.menu.ele.style.margin = 'auto'
      this.menu.ele.style.height = 'auto'
      // this.menu.ele.style.cursor = 'auto'
    } else {
      this.edtr.style.display = 'none'
      if (face) face.style.fontSize = '44px'
      if (face) face.style.margin = '95px auto'
      this.menu.ele.style.alignItems = 'center'
      // this.menu.ele.style.width = '60%'
      this.menu.ele.style.margin = 'none'
      this.menu.ele.style.height = '100%'
      // this.menu.ele.style.cursor = 'grab'
    }
  }

  _bubbleUpiFrameEvents () {
    // see: https://stackoverflow.com/a/38442439/1104148
    const callback = (event, type) => {
      const boundingClientRect = NNE.iframe.getBoundingClientRect()
      const o = { bubbles: true, cancelable: false }
      const e = new window.CustomEvent(type, o)
      e.clientX = event.clientX + boundingClientRect.left
      e.clientY = event.clientY + boundingClientRect.top
      e.keyCode = event.keyCode
      e.ctrlKey = event.ctrlKey
      e.metaKey = event.metaKey
      NNE.iframe.dispatchEvent(e)
    }
    NNE.iframe.contentWindow
      .addEventListener('mousemove', (e) => callback(e, 'mousemove'))
    NNE.iframe.contentWindow
      .addEventListener('mouseup', (e) => callback(e, 'mouseup'))
    NNE.iframe.contentWindow
      .addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) e.preventDefault()
        callback(e, 'keydown')
      })
    // match the page's background color to that of the iframe's backgroundColor
    // w/out it the netnet's rounded border's create a white space
    const iframeBody = NNE.iframe.contentDocument.body
    if (iframeBody) {
      const bg = window.getComputedStyle(iframeBody).backgroundColor
      document.body.style.backgroundColor = bg
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.• canvas gradient && window shadow

  _createCanvas () {
    this.canv = document.createElement('canvas')
    this.canv.style.position = 'absolute'
    this.canv.style.top = '0px'
    this.canv.style.left = '0px'
    this.canv.style.width = '100%'
    this.canv.style.height = '100%'
    this.canv.style.zIndex = '-10'
    this.win.prepend(this.canv)
    this._calcCanvasColors()
    this._canvasResize()
    this._canvasUpdate(0, 0)
    this._canvasMouseMove({ clientX: 0, clientY: 0 })
    return this.canv
  }

  _calcCanvasColors () {
    const bg = window.getComputedStyle(document.documentElement)
      .getPropertyValue('--netizen-background').substr(0, 7)
    const c = Color.hex2hsv(bg)
    const v0 = c.v + 10 <= 100 ? c.v + 10 : 100
    const v1 = c.v - 10 >= 0 ? c.v - 10 : 0
    this.grad0 = Color.hsv2hex(c.h, c.s, v0)
    this.grad1 = Color.hsv2hex(c.h, c.s, v1)
  }

  _canvasUpdate (x, y) {
    const ctx = this.canv.getContext('2d')
    if (NNE.background) {
      // if background is present, just match the color, avoid the maths below
      const bg = window.getComputedStyle(document.documentElement)
        .getPropertyValue('--netizen-background').substr(0, 7)
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, this.canv.width, this.canv.height)
      return
    }
    const rad = (this.canv.width > this.canv.height)
      ? this.canv.width : this.canv.height
    const g = ctx.createRadialGradient(x, y, 1, x, y, rad)
    ctx.clearRect(0, 0, this.canv.width, this.canv.height)
    g.addColorStop(0, this.grad0)
    g.addColorStop(1, this.grad1)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, this.canv.width, this.canv.height)
  }

  _canvasResize (e) {
    e = e || {}
    const x = (e.clientX || 0) - this.win.offsetLeft
    const y = (e.clientY || 0) - this.win.offsetTop
    this.canv.width = this.win.offsetWidth
    this.canv.height = this.win.offsetHeight
    this._canvasUpdate(x, y)
  }

  _canvasMouseMove (e) {
    const ex = e.clientX
    const ey = e.clientY
    let x = ex - this.win.offsetLeft
    let y = ey - this.win.offsetTop
    if (ex < this.win.offsetLeft) x = 0
    else if (ex > this.win.offsetLeft + this.win.offsetWidth) x = this.canv.width
    if (ey < this.win.offsetTop) y = 0
    else if (ey > this.win.offsetTop + this.win.offsetHeight) y = this.canv.height
    this._canvasUpdate(x, y)
  }
}

window.WindowManager = NetNet
