/* global HTMLElement, NNW, utils */
class TextBubble extends HTMLElement {
  constructor () {
    super()
    this._fadeTimers = []
  }

  connectedCallback () {
    this.style.position = 'absolute'
    this.style.zIndex = 50
    this.style.display = 'block'

    const div = document.createElement('div')
    div.className = 'text-bubble'
    div.innerHTML = `
      <section class="text-bubble-content"><!-- content goes here --></section>
      <div class="text-bubble-options"></div>
      <div class="text-bubble-triangle"></div>
    `

    if (!this.content) {
      div.style.display = 'none'
      div.style.opacity = '0'
    }

    this.appendChild(div)
    this.updatePosition()
    window.addEventListener('mousemove', (e) => utils.updateShadow(e, div))
  }

  set opened (v) {
    console.error('text-bubble: opened property is read-only')
  }

  get opened () {
    const d = this.$('.text-bubble').style.display
    if (d === 'block') return true
    else return false
  }

  $ (selector) {
    const e = this.querySelectorAll(selector)
    if (e.length > 1) return e
    else return e[0]
  }

  update (o) {
    this.fadeOut(null, () => {
      this.updateContent(o.content)
      this.updateOptions(o.options, o.scope)
      this.fadeIn()
    })
  }

  updateContent (content) {
    const nfo = this.$('.text-bubble-content')
    if (typeof content === 'string') {
      nfo.innerHTML = content
    } else {
      nfo.innerHTML = ''
      nfo.appendChild(content)
    }
  }

  updateOptions (options, scope) {
    const self = scope || this
    const opt = this.$('.text-bubble-options')
    opt.innerHTML = ''
    for (const key in options) {
      const ele = document.createElement('button')
      ele.textContent = key
      ele.onclick = () => { options[key](self, this) }
      opt.appendChild(ele)
    }
  }

  updatePosition () {
    const tbo = this.$('.text-bubble-options')
    const tri = this.$('.text-bubble-triangle')
    if (NNW.layout === 'dock-left' || NNW.layout === 'full-screen') {
      tbo.style.flexDirection = 'column'
      tbo.style.left = '50%'
      tbo.style.width = '75%'
      tbo.querySelectorAll('button').forEach(b => { b.style.margin = '5px' })
    }
    if (NNW.layout === 'dock-left') {
      const offY = 46 + this.$('.text-bubble').offsetHeight
      this.$('.text-bubble').style.transform = `translate(455px, ${offY}px)`
      tri.style.top = '13px'
      tri.style.left = '-22px'
      tri.style.right = null
      tri.style.bottom = null
      tri.style.transform = 'rotate(270deg)'
    } else if (NNW.layout === 'full-screen') {
      const offY = 115 + this.$('.text-bubble').offsetHeight
      this.$('.text-bubble').style.transform = `translate(-20px, ${offY}px)`
      tri.style.top = '-19px'
      tri.style.left = null
      tri.style.right = '15px'
      tri.style.bottom = null
      tri.style.transform = 'rotate(0deg)'
    } else {
      tbo.style.flexDirection = 'row'
      tbo.style.left = '48%'
      tbo.style.width = '80%'
      tbo.querySelectorAll('button').forEach(b => { b.style.margin = '0 5px 0 0' })
      this.$('.text-bubble').style.transform = 'translate(0,0)'
      tri.style.top = null
      tri.style.left = null
      tri.style.right = '25px'
      tri.style.bottom = '-19px'
      tri.style.transform = 'rotate(180deg)'
    }
  }

  fadeIn (t) {
    const time = (typeof t === 'number') ? t : utils.getVal('--menu-fades-time')
    this._fadeDebounce()
    const tb = this.$('.text-bubble')
    tb.style.transition = 'opacity var(--menu-fades-time) ease-out'
    tb.style.display = 'block'
    this.updatePosition()
    const t1 = setTimeout(() => { tb.style.opacity = 1 }, 100)
    const t2 = setTimeout(() => {
      tb.querySelector('.text-bubble-options').style.transform = 'translateX(-50%) translateY(0)'
      tb.querySelector('.text-bubble-options').style.opacity = 1
    }, time)
    this._fadeTimers.push(t1)
    this._fadeTimers.push(t2)
  }

  fadeOut (t, cb) {
    const time = (typeof t === 'number') ? t : utils.getVal('--menu-fades-time')
    this._fadeDebounce()
    const tb = this.$('.text-bubble')
    tb.style.transition = 'opacity var(--menu-fades-time) ease-out'
    const t1 = setTimeout(() => {
      tb.querySelector('.text-bubble-options').style.transform = 'translateX(-50%) translateY(10px)'
      tb.querySelector('.text-bubble-options').style.opacity = 0
    }, 5)
    const t2 = setTimeout(() => { tb.style.opacity = 0 }, 10)
    const t3 = setTimeout(() => {
      tb.style.display = 'none'
      if (cb) cb()
    }, time)
    this._fadeTimers.push(t1)
    this._fadeTimers.push(t2)
    this._fadeTimers.push(t3)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸ PRIVATE METHODS
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸

  _fadeDebounce () {
    this._fadeTimers.forEach(t => { clearTimeout(t) })
  }
}

window.customElements.define('text-bubble', TextBubble)
