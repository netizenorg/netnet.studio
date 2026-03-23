/* global nn */
class WidgetCard {
  constructor (o) {
    this.parent = nn.get(o.ele)

    this.state = {
      targetRx: 0,
      targetRy: 0,
      rx: 0,
      ry: 0,
      targetShineX: 50,
      targetShineY: 20,
      shineX: 50,
      shineY: 20,
      scale: o.appear ? 0 : 1,
      targetScale: o.appear ? 1 : 1
    }

    this.maxTilt = o.maxTilt || 18
    this.pop = o.pop || 32
    this.ease = o.ease || 0.12
    this.shineEase = o.shineEase || 0.12

    this._animating = false
    this._raf = null

    this.w = typeof o.box?.w !== 'undefined' ? o.box?.w : 250
    this.h = typeof o.box?.h !== 'undefined' ? o.box?.h : 150
    this.x = typeof o.box?.x !== 'undefined' ? o.box?.x : `calc(50% - ${this.w / 2}px)`
    this.y = typeof o.box?.y !== 'undefined' ? o.box?.y : `calc(50% - ${this.h / 2}px)`

    this.parent.classList.add('lg-widget-card-stage')

    this.card = nn.create('div').set('class', 'lg-widget-card')
      .content(o.content || '')
      .addTo(this.parent)

    if (o.main) this.card.classList.add('main')

    if (o.appear) {
      this.card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px) scale(0)'
      setTimeout(() => this.appear(), 100)
    }

    const css = { width: this.w, height: this.h, left: this.x, top: this.y }
    if (o.thumbnail) {
      css.background = `url(${o.thumbnail}) no-repeat center center`
      css.backgroundSize = 'cover'
    }
    this.card.css(css)

    if (o.click) this.card.on('click', () => o.click())

    this.parent.on('mousemove', (e) => {
      this.updateTargetFromMouse(e.pageX, e.pageY)
      this.start()
    })
    this.parent.on('mouseleave', () => this.reset())
  }

  setDepth (val) {
    this.pop = val
  }

  start () {
    if (this._animating) return
    this._animating = true
    const tick = () => {
      if (!this._animating) return
      const stillMoving = this.animate()
      if (stillMoving) {
        this._raf = window.requestAnimationFrame(tick)
      } else {
        this._animating = false
        this._raf = null
      }
    }
    this._raf = window.requestAnimationFrame(tick)
  }

  stop () {
    this._animating = false
    if (this._raf) window.cancelAnimationFrame(this._raf)
    this._raf = null
  }

  reset () {
    // ease back to neutral — only set targets
    this.state.targetRx = 0
    this.state.targetRy = 0
    this.state.targetShineX = 50
    this.state.targetShineY = 20
    this.start()
  }

  appear () {
    this.state.targetScale = 1
    this.start()
  }

  hide () {
    this.state.targetScale = 0
    this.start()
  }

  updateTargetFromMouse (pageX, pageY) {
    const rect = this.card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const nx = (pageX - cx) / (rect.width / 2)
    const ny = (pageY - cy) / (rect.height / 2)

    const x = nn.clamp(nx, -1, 1)
    const y = nn.clamp(ny, -1, 1)

    this.state.targetRy = x * this.maxTilt
    this.state.targetRx = -y * this.maxTilt

    this.state.targetShineX = nn.map(x, -1, 1, 80, 20)
    this.state.targetShineY = nn.map(y, -1, 1, 10, 60)
  }

  animate () {
    // ease current toward targets
    this.state.rx += (this.state.targetRx - this.state.rx) * this.ease
    this.state.ry += (this.state.targetRy - this.state.ry) * this.ease
    this.state.shineX += (this.state.targetShineX - this.state.shineX) * this.shineEase
    this.state.shineY += (this.state.targetShineY - this.state.shineY) * this.shineEase
    this.state.scale += (this.state.targetScale - this.state.scale) * this.ease

    const depth = this.pop * nn.norm(
      Math.hypot(this.state.rx, this.state.ry),
      0,
      this.maxTilt * Math.SQRT2
    )

    this.card.style.transform =
      `rotateX(${this.state.rx.toFixed(3)}deg) ` +
      `rotateY(${this.state.ry.toFixed(3)}deg) ` +
      `translateZ(${depth.toFixed(2)}px)` +
      `scale(${this.state.scale.toFixed(3)})`

    this.card.style.setProperty('--lgwc-shine-x', `${this.state.shineX.toFixed(2)}%`)
    this.card.style.setProperty('--lgwc-shine-y', `${this.state.shineY.toFixed(2)}%`)

    const glow = 0.08 + 0.24 * nn.norm(depth, 0, this.pop)
    const bs1 = `0 10px 30px rgba(0, 0, 0, ${0.45 + glow})`
    const bs2 = '0 0 0 1px rgba(255,255,255,0.03) inset'
    this.card.style.boxShadow = `${bs1}, ${bs2}`

    // stop when we're effectively at rest
    const nearRot = Math.abs(this.state.targetRx - this.state.rx) < 0.01 &&
      Math.abs(this.state.targetRy - this.state.ry) < 0.01
    const nearShine = Math.abs(this.state.targetShineX - this.state.shineX) < 0.05 &&
      Math.abs(this.state.targetShineY - this.state.shineY) < 0.05

    const nearScale = Math.abs(this.state.targetScale - this.state.scale) < 0.002
    return !(nearRot && nearShine && nearScale)
  }
}

window.WidgetCard = WidgetCard
