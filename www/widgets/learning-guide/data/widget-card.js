/* global nn */
class WidgetCard {
  constructor (o) {
    this.parent = nn.get(o.ele)

    this.state = {
      targetRx: 0,
      targetRy: 0,
      rx: 0,
      ry: 0,
      shineX: 50,
      shineY: 20
    }

    this.maxTilt = o.maxTilt || 18 // degrees of rotation at the edges
    this.pop = o.pop || 32 // translateZ to enhance parallax
    this.ease = o.ease || 0.12 // smaller = more floaty easing

    this.w = typeof o.box?.w !== 'undefined' ? o.box?.w : 250
    this.h = typeof o.box?.h !== 'undefined' ? o.box?.h : 150
    this.x = typeof o.box?.x !== 'undefined' ? o.box?.x : `calc(50% - ${this.w / 2}px)`
    this.y = typeof o.box?.y !== 'undefined' ? o.box?.y : `calc(50% - ${this.h / 2}px)`

    this.parent.classList.add('lg-widget-card-stage')

    this.card = nn.create('div').set('class', 'lg-widget-card')
      .css({
        width: this.w,
        height: this.h,
        left: this.x,
        top: this.y
      })
      .content(o.content || '')
      .addTo(this.parent)

    if (o.click) this.card.on('click', () => o.click())

    this.parent.on('mousemove', (e) => {
      this.updateTargetFromMouse(e.pageX, e.pageY)
      this.animate()
    })
    this.parent.on('mouseleave', () => this.reset())
  }

  setDepth (val) {
    this.pop = val
  }

  reset () {
    // TODO: transition: box-shadow 0.2s ease, transform 0.2s ease;
    this.state.targetRx = 0
    this.state.targetRy = 0
    this.state.rx = 0
    this.state.ry = 0
    this.state.shineX = 50
    this.state.shineY = 20
    this.animate()
  }

  updateTargetFromMouse (pageX, pageY) {
    // get card bounds
    const rect = this.card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    // mouse offset from card center, normalized to [-1, 1]
    const nx = (pageX - cx) / (rect.width / 2)
    const ny = (pageY - cy) / (rect.height / 2)

    // clamp so we don't go wild off-card
    const x = nn.clamp(nx, -1, 1)
    const y = nn.clamp(ny, -1, 1)

    // rotateY follows horizontal, rotateX follows vertical (invert for natural feel)
    this.state.targetRy = x * this.maxTilt
    this.state.targetRx = -y * this.maxTilt

    // move sheen opposite to the tilt for a “light from above” feel
    this.state.shineX = nn.map(x, -1, 1, 80, 20)
    this.state.shineY = nn.map(y, -1, 1, 10, 60)
  }

  animate () {
    // ease current angles toward targets
    this.state.rx += (this.state.targetRx - this.state.rx) * this.ease
    this.state.ry += (this.state.targetRy - this.state.ry) * this.ease

    // subtle depth pop based on how steep the tilt is
    const depth = this.pop * nn.norm(
      Math.hypot(this.state.rx, this.state.ry),
      0,
      this.maxTilt * Math.SQRT2
    )

    this.card.style.transform =
      `rotateX(${this.state.rx.toFixed(3)}deg) ` +
      `rotateY(${this.state.ry.toFixed(3)}deg) ` +
      `translateZ(${depth.toFixed(2)}px)`

    // drive the sheen position via CSS variables
    this.card.style.setProperty('--lgwc-shine-x', `${this.state.shineX}%`)
    this.card.style.setProperty('--lgwc-shine-y', `${this.state.shineY}%`)

    // punch up shadow slightly when tilted
    const glow = 0.08 + 0.24 * nn.norm(depth, 0, this.pop)
    const bs1 = `0 10px 30px rgba(0, 0, 0, ${0.45 + glow})`
    const bs2 = '0 0 0 1px rgba(255,255,255,0.03) inset'
    this.card.style.boxShadow = `${bs1}, ${bs2}`
  }
}

window.WidgetCard = WidgetCard
