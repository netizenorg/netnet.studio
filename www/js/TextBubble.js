/* global NNW */
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
    const wu = window.utils
    window.addEventListener('mousemove', (e) => wu.updateShadow(e, this))
    window.addEventListener('DOMContentLoaded', (e) => {
      wu.updateShadow({ clientX: 0, clientY: 0 }, this)
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

  $ (selector) {
    const e = this.ele.querySelectorAll(selector)
    if (e.length > 1) return e
    else return e[0]
  }

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
      ele.onclick = () => { opts[key](self, this) }
      this.opt.appendChild(ele)
    }
  }

  fadeIn () {
    this.ele.style.transition = 'opacity var(--menu-fades-time) ease-out'
    this.ele.style.display = 'block'
    this.updatePosition()
    setTimeout(() => { this.ele.style.opacity = 1 }, 100)
    setTimeout(() => {
      this.ele.querySelector('.text-bubble-options').style.transform = 'translateX(-50%) translateY(0)'
      this.ele.querySelector('.text-bubble-options').style.opacity = 1
    }, 600)
  }

  fadeOut (ms, callback) {
    this.ele.style.transition = 'opacity var(--menu-fades-time) ease-out'
    setTimeout(() => {
      this.ele.querySelector('.text-bubble-options').style.transform = 'translateX(-50%) translateY(10px)'
      this.ele.querySelector('.text-bubble-options').style.opacity = 0
    }, 5)
    setTimeout(() => { this.ele.style.opacity = 0 }, 10)
    setTimeout(() => { this.ele.style.display = 'none' }, this.transitionTime)
  }

  updatePosition () {
    const tbo = this.ele.querySelector('.text-bubble-options')
    if (NNW.layout === 'dock-left' || NNW.layout === 'full-screen') {
      tbo.style.flexDirection = 'column'
      tbo.style.left = '50%'
      tbo.style.width = '75%'
      tbo.querySelectorAll('button').forEach(b => { b.style.margin = '5px' })
    }
    if (NNW.layout === 'dock-left') {
      const offY = 46 + this.ele.offsetHeight
      this.ele.style.transform = `translate(455px, ${offY}px)`
      this.tri.style.top = '13px'
      this.tri.style.left = '-22px'
      this.tri.style.right = null
      this.tri.style.bottom = null
      this.tri.style.transform = 'rotate(270deg)'
    } else if (NNW.layout === 'full-screen') {
      const offY = 115 + this.ele.offsetHeight
      this.ele.style.transform = `translate(-20px, ${offY}px)`
      this.tri.style.top = '-19px'
      this.tri.style.left = null
      this.tri.style.right = '15px'
      this.tri.style.bottom = null
      this.tri.style.transform = 'rotate(0deg)'
    } else {
      tbo.style.flexDirection = 'row'
      tbo.style.left = '48%'
      tbo.style.width = '80%'
      tbo.querySelectorAll('button').forEach(b => { b.style.margin = '0 5px 0 0' })
      this.ele.style.transform = 'translate(0,0)'
      this.tri.style.top = null
      this.tri.style.left = null
      this.tri.style.right = '25px'
      this.tri.style.bottom = '-19px'
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
}

window.TextBubble = TextBubble
