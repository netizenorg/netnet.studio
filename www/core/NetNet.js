/* global NetNetFaceMenu, NNE, WIDGETS, nn, utils */
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
      monokai: { background: true, shadow: false },
      'moz-dark': { background: true, shadow: false },
      'moz-light': { background: true, shadow: false }
    }

    this.rndr = document.querySelector('#nn-output')
    this.win = document.querySelector('#nn-window')
    this.edtr = document.querySelector('#nn-editor')
    this.menu = new NetNetFaceMenu(this.win) // document.querySelector('#nn-menu')
    this.canv = this._createCanvas()
    this.title = this._createTitleBar()
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

    this._preventAccidentalExit() // for Mac
  }

  err (m) {
    if (m.type === 'invalid-prop-value') {
      console.error('NetNet:', `invalid ${m.prop} value, must be: ${m.opts}`)
    } else console.error('NetNet:', m)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  get speaking () {
    return this.menu.textBubble.children[0].style.display === 'block'
  }

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

  get tbWidth () {
    const m = 5 // option bubble margin
    const stacked = ['dock-left', 'full-screen']
    const btns = this.menu.textBubble.$('.text-bubble-options > button')
    if (btns && btns.length && btns.length > 0) {
      if (stacked.includes(this.layout)) return [...btns][0].offsetWidth
      else return [...btns].map(b => b.offsetWidth).reduce((a, b) => a + b + m)
    } else return 0
  }

  get tbLeft () {
    const zeros = ['dock-left', 'full-screen', 'dock-bottom']
    const left = (zeros.includes(this.layout)) ? 0 : this.win.offsetLeft
    const nnw = this.win.offsetWidth
    const ro = (['dock-left', 'full-screen'].includes(this.layout)) ? 0 : 58
    const tbw = this.tbWidth + ro // + right offset
    return left - (tbw - nnw)
  }

  get width () {
    const ro = (['dock-left', 'full-screen'].includes(this.layout)) ? 0 : 58
    const options = this.tbWidth + ro // + right offset
    const nnw = this.win.offsetWidth
    const arr = (this.layout === 'dock-left') ? 27 : 0 // tb arrow width
    const textBubble = this.menu.textBubble.offsetWidth + arr
    const ignoreBubble = ['full-screen', 'dock-bottom']
    const maxWidth = ['separate-window', 'welcome']
    if (ignoreBubble.includes(this.layout)) return nnw
    else if (maxWidth.includes(this.layout)) {
      return Math.max(nnw, options, textBubble)
    } else { // dock-left
      return nnw + Math.max(options, textBubble)
    }
  }

  get height () {
    const options = this.menu.textBubble.$('.text-bubble-options').offsetHeight
    const nnwindow = this.win.offsetHeight
    const textBubble = this.menu.textBubble.offsetHeight
    const margin = 4
    return nnwindow + margin + options + textBubble
  }

  get left () {
    const nnw = this.win.offsetWidth
    const tbw = this.tbWidth + 58 // + right offset (~58)
    const zero = ['dock-left', 'full-screen', 'dock-bottom']
    if (zero.includes(this.layout)) return 0
    else if (['welcome', 'separate-window'].includes(this.layout)) {
      if (tbw > nnw) return this.tbLeft
      else return this.win.offsetLeft
    } else return this.win.offsetLeft
  }

  get right () {
    if (['full-screen', 'dock-bottom'].includes(this.layout)) return 0
    const fromLeft = this.left + this.width
    return window.innerWidth - fromLeft
  }

  get top () {
    const options = this.menu.textBubble.$('.text-bubble-options').offsetHeight
    const textBubble = this.menu.textBubble.offsetHeight
    const margin = 11 // 4
    const top = this.win.offsetTop - options - textBubble - margin
    if (['full-screen', 'dock-left'].includes(this.layout)) return 0
    else return top
  }

  get bottom () {
    const fromTop = this.top + this.height
    const bottom = window.innerHeight - fromTop
    const zero = ['dock-left', 'full-screen', 'dock-bottom']
    if (zero.includes(this.layout)) return 0
    else return bottom
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
    // const de = document.documentElement
    // const fg = window.getComputedStyle(de).getPropertyValue('--netizen-tag')
    // document.documentElement.style.setProperty('--fg-color', fg)
    utils.setVal('fg-color', utils.getVal('netizen-tag'))
    // const bg = window.getComputedStyle(de).getPropertyValue('--netizen-background')
    // document.documentElement.style.setProperty('--bg-color', bg.substr(0, 7))
    utils.setVal('bg-color', utils.getVal('netizen-background').substr(0, 7))
    this._calcCanvasColors()
    this._canvasResize()
    this._canvasUpdate(0, 0)
    this.menu.updateFace()
    this.emit('theme-change', { old, new: NNE.theme })
  }

  getThemeColors () {
    // const de = document.documentElement
    // const fg = window.getComputedStyle(de).getPropertyValue('--fg-color')
    // const bg = window.getComputedStyle(de).getPropertyValue('--bg-color')
    return { fg: utils.getVal('fg-color'), bg: utils.getVal('bg-color') }
  }

  update (opts, time) {
    time = time || 0
    const t = `${time}ms`
    this.win.style.transition = `all ${t} var(--sarah-ease)`
    this.rndr.style.transition = `all ${t} var(--sarah-ease)`
    // trigger transition
    setTimeout(() => {
      for (const prop in opts) this._css(prop, opts[prop])
      setTimeout(() => {
        this.win.style.transition = 'none'
        this.rndr.style.transition = 'none'
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
      this.win.style.top = window.innerHeight / 2 - this.win.offsetHeight / 2 + 'px'
      this.win.style.opacity = 1 // display if hidden via shared link URL
      const tbWasOpened = this.menu.textBubble && this.menu.textBubble.opened
      if (tbWasOpened) this.menu.updatePosition()
      this._canvasResize()
      setTimeout(() => {
        this.win.style.transition = 'none'
        this.keepInFrame()
      }, time)
    }, 10)
  }

  keepInFrame () {
    const pad = 10
    const time = utils.getVal('--layout-transition-time')
    if (['welcome', 'separate-window'].includes(this.layout)) {
      if (this.bottom < 0) this.update({ bottom: pad }, time)
      else if (this.top < 0) this.update({ top: pad }, time)
      if (this.left < 0) this.update({ left: pad }, time)
      else if (this.right < 0) this.update({ right: pad }, time)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ window drag/move via mouse

  _updateResizeBlocker (msg) {
    // NOTE: this creates a div over the #nn-output div (which has the iframe)
    // because when the mouse moves over an iframe it gets resizing stuck
    if (msg === 'remove') {
      if (this.blocker) this.blocker.remove()
      return
    } else if (msg === 'create') {
      const output = document.querySelector('#nn-output')
      const computedStyle = window.getComputedStyle(output)
      const zIndex = Number(computedStyle.zIndex) + 1
      this.blocker = document.createElement('div')
      this.blocker.style.position = 'absolute'
      // this.blocker.style.background = 'rgba(255, 0, 0, 0.5)'
      this.blocker.style.zIndex = zIndex
      document.body.appendChild(this.blocker)
    }

    if (!this.blocker) return
    const rbox = NNE.render.getBoundingClientRect()
    this.blocker.style.left = rbox.x + 'px'
    this.blocker.style.top = rbox.y + 'px'
    this.blocker.style.width = rbox.width + 'px'
    this.blocker.style.height = rbox.height + 'px'
  }

  _updateMouseDown (bool) {
    this.mousedown = bool
    if (bool) this._updateResizeBlocker('create')
    else this._updateResizeBlocker('remove')
  }

  _mouseMove (e) {
    // e.preventDefault()
    this._canvasMouseMove(e)

    if (!this.themeConfig[NNE.theme].shadow) {
      this.win.style.boxShadow = 'none'
    } else {
      utils.updateShadow(e, this.win)
    }

    this._updateCursor(e)
    if (this.mousedown) {
      this._toss('before', e)
      this._resizeWindow(e)
    }
    if (this.cursor === 'move') this._moveWindow(e)
  }

  _mouseUp (e) {
    if (this.mousedown) this._toss('after')
    if (this.mousedown) this.keepInFrame()
    this._updateMouseDown(false)
    this.cursor = 'auto'
    this.winOff = null
    utils.selecting(true)
  }

  _mouseDown (e) {
    const mw = (this.layout === 'separate-window' || this.layout === 'welcome')
    if (e.target.id === 'nn-window') this._updateMouseDown(true)
    else if (e.target.id === 'nn-menu' && mw) {
      this._updateMouseDown(true)
      this.cursor = 'move'
      utils.selecting(false)
      this.win.style.cursor = this.cursor
    }
  }

  _toss (when, e) {
    const mem = 3
    const max = 200
    if (this.layout !== 'welcome') return
    if (when === 'before') {
      if (!this._m) this._m = []
      else if (this._m.length > mem) this._m.shift()
      this._m.push({ x: e.clientX, y: e.clientY })
    } else if (when === 'after' && this._m) {
      const i = this._m.length - 1
      let x = Math.round(Math.pow(this._m[i].x - this._m[0].x, 2) / 50)
      let y = Math.round(Math.pow(this._m[i].y - this._m[0].y, 2) / 50)
      if (x > max) x = max
      if (y > max) y = max
      if (this._m[0].x > this._m[i].x) x = -x
      if (this._m[0].y > this._m[i].y) y = -y
      this.update({ left: this.left + x, top: this.top + y }, 500)
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

    this._canvasResize(e)
    this._updateResizeBlocker()
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

    const ro = (['dock-left', 'full-screen'].includes(this.layout)) ? 0 : 58
    const tbw = this.menu.textBubble.$('.text-bubble-options').offsetWidth
    const bw = Math.max(tbw, this.tbWidth + ro)
    const ww = this.win.offsetWidth

    const oh = this.menu.textBubble.$('.text-bubble-options').offsetHeight
    const tbh = this.menu.textBubble.offsetHeight
    const bt = oh + tbh + 11 // margin
    const bh = (['full-screen', 'dock-left'].includes(this.layout)) ? 0 : bt

    if (s.includes(prop)) { // changing size
      if (!l) return
      this.win.style[prop] = (typeof val === 'number') ? `${val}px` : val
      if (this.layout === 'dock-bottom') {
        this.rndr.style.height = window.innerHeight - parseFloat(val) + 'px'
      } else if (this.layout === 'dock-left') {
        const w = window.innerWidth - parseFloat(val)
        this.rndr.style.width = w + 'px'
        this.rndr.style.left = parseFloat(val) + 'px'
      }
    } else if (p.includes(prop)) { // chaning position
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
      NNE.cm.refresh()
      this.emit('layout-change', { old, new: v })
    }

    if (v === 'welcome') {
      this.title.style.display = 'none'
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
      if (this.title.textContent.length > 0) {
        this.title.style.display = 'block'
      }
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
      if (this.title.textContent.length > 0) {
        this.title.style.display = 'block'
      }
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
      if (this.title.textContent.length > 0) {
        this.title.style.display = 'block'
      }
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
      if (this.title.textContent.length > 0) {
        this.title.style.display = 'block'
      }
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
      this.menu.ele.style.margin = 'auto'
      this.menu.ele.style.height = 'auto'
      NNE.cm.refresh()
    } else {
      this.edtr.style.display = 'none'
      if (face) face.style.fontSize = '44px'
      if (face) face.style.margin = '95px auto'
      this.menu.ele.style.alignItems = 'center'
      this.menu.ele.style.margin = 'none'
      this.menu.ele.style.height = '100%'
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

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.• title bar for projets

  updateTitleBar (text, unsaved) {
    if (typeof text === 'string') {
      this.title.textContent = text
      if (unsaved) this.title.dataset.unsaved = true
      else delete this.title.dataset.unsaved
      this.title.style.display = 'block'
      this.title.onclick = () => {
        const path = this.title.textContent
        WIDGETS['project-files'].explainTitleBar(path)
      }
    } else {
      this.title.textContent = ''
      this.title.style.display = 'none'
    }
  }

  _createTitleBar () {
    const title = document.createElement('div')
    title.id = 'proj-title'
    // title.textContent = 'Title Of Project (index.html)'
    title.style.display = 'none'
    title.style.cursor = 'pointer'
    title.style.position = 'absolute'
    title.style.top = '0px'
    title.style.left = '0px'
    title.style.width = 'calc(100% - 110px)'
    title.style.zIndex = '2'
    title.style.padding = '15px 15px 15px 80px'
    title.style.color = 'var(--netizen-meta)'
    title.style.textDecoration = 'underline'
    title.style.textAlign = 'center'
    this.win.prepend(title)
    return title
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
    const c = nn.hex2hsv(bg)
    const v0 = c.v + 10 <= 100 ? c.v + 10 : 100
    const v1 = c.v - 10 >= 0 ? c.v - 10 : 0
    this.grad0 = nn.hsv2hex(c.h, c.s, v0)
    this.grad1 = nn.hsv2hex(c.h, c.s, v1)
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

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.• misc

  _preventAccidentalExit () {
    // NOTE: students on mac would often double-finger swipe back on their
    // trackpads (when trying to move their scroll bars) and this would trigger
    // Mac's "back" button, and thus they'd loose all their progress. Similarly,
    // if they accidentally refresh, they loose all their progress. This code,
    // along with the 'unload' event in main.js, prevents both from happening.

    // Prevent backward/forward navigation
    window.addEventListener('popstate', (event) => {
      window.history.pushState(null, '', window.location.href)
    })
    // Initialize history state to disable navigation
    window.history.pushState(null, '', window.location.href)
  }
}

window.WindowManager = NetNet
