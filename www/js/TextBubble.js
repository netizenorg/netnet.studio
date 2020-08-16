/* global Maths, NNW */
/*
  -----------
     info
  -----------

  This class is used to create netnet's speach/text bubble. While it can
  technically be instantiated multiple times, it's really designed to be used
  by the main menu, which only ever creates a single instance. (b/c there
  should really only ever be one text bubble present at any given time)

  NOTE: this class is dependent on a couple of outside variables, see globals
  in the comment on the fist line for global JS variables it references

  -----------
     usage
  -----------

  const tb = new TextBubble()

  tb.ele // the actual html element, needs to be injected into the DOM
  tb.opened // read-only property, true/false

  tb.update(c) // update's the [c]ontent of the text bubble

  // the content argument should be an object which looks like:
  {
     content: '<b>hi</b>', // (required) either html string or HTMLElement
     options: {            // (optinoal) buttons to add to the message
       'ok': (e) => { }    // key = button content, value = click function
     },
     scope: window         // the scope of the event object returned
                           // by the option callbacks
  }

  tb.updateOptions(o, scope) // updates the text bubbles options, which are the
                      // optional buttons to include below the content
                      // the options object should have properties (named as
                      // you would like the button to appear) with callback
                      // funcitons as values (which will run when clicked).

  // other methods...

  tb.fadeIn()
  tb.fadeOut()
  tb.updatePosition()

*/
class TextBubble {
  constructor (opts) {
    opts = opts || {}

    const t = window.getComputedStyle(document.documentElement)
      .getPropertyValue('--menu-fades-time')
    this.transitionTime = t.includes('ms') ? parseInt(t) : parseInt(t) * 1000

    this._setupBubble(opts.content || '', opts.options)

    // ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ .  event listeners

    window.addEventListener('mousemove', (e) => this._updateShadow(e))
    window.addEventListener('DOMContentLoaded', (e) => {
      this._updateShadow({ clientX: 0, clientY: 0 })
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  get opened () {
    return Number(this.ele.style.opacity) > 0
  }

  set opened (v) {
    return console.error('TextBubble: opened property is read only')
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•.¸ public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  update (o) {
    if (typeof o.content === 'string') {
      this.nfo.innerHTML = o.content
    } else {
      this.nfo.innerHTML = ''
      this.nfo.appendChild(o.content)
    }

    this.updateOptions(o.options, o.scope)

    if (!this.opened) this.fadeIn()
    else this.updatePosition()
  }

  updateOptions (opts, scope) {
    const self = scope || this
    this.opt.innerHTML = ''
    for (const key in opts) {
      const ele = document.createElement('button')
      ele.textContent = key
      ele.onclick = () => { opts[key](self) }
      this.opt.appendChild(ele)
    }
  }

  fadeIn () {
    this.ele.style.transition = 'opacity var(--menu-fades-time) ease-out'
    this.ele.style.display = 'block'
    this.updatePosition()
    setTimeout(() => { this.ele.style.opacity = 1 }, 100)
  }

  fadeOut (ms, callback) {
    this.ele.style.transition = 'opacity var(--menu-fades-time) ease-out'
    setTimeout(() => { this.ele.style.opacity = 0 }, 10)
    setTimeout(() => { this.ele.style.display = 'none' }, this.transitionTime)
  }

  updatePosition () {
    if (NNW.layout === 'dock-left') {
      const offY = 29 + this.ele.offsetHeight
      this.ele.style.transform = `translate(362px, ${offY}px)`
      this.tri.style.top = '13px'
      this.tri.style.left = '-17px'
      this.tri.style.right = null
      this.tri.style.bottom = null
      this.tri.style.transform = 'rotate(270deg)'
    } else if (NNW.layout === 'full-screen') {
      const offY = 92 + this.ele.offsetHeight
      this.ele.style.transform = `translate(-20px, ${offY}px)`
      this.tri.style.top = '-18px'
      this.tri.style.left = null
      this.tri.style.right = '22px'
      this.tri.style.bottom = null
      this.tri.style.transform = 'rotate(0deg)'
    } else {
      this.ele.style.transform = 'translate(0,0)'
      this.tri.style.top = null
      this.tri.style.left = null
      this.tri.style.right = '40px'
      this.tri.style.bottom = '-17px'
      this.tri.style.transform = 'rotate(180deg)'
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _setupBubble (content, options) {
    this.ele = document.createElement('div')
    this.ele.className = 'text-bubble'
    this.ele.innerHTML = `
      <section>
        ${content}
      </section>
      <div class="text-bubble-options"></div>
      <div class="text-bubble-triangle"></div>
    `
    this.nfo = this.ele.querySelector('section')
    this.tri = this.ele.querySelector('.text-bubble-triangle')
    this.opt = this.ele.querySelector('.text-bubble-options')
    this.updatePosition()
    if (!content) {
      this.ele.style.display = 'none'
      this.ele.style.opacity = '0'
    }
    if (options) this.updateOptions(options)
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

window.TextBubble = TextBubble
