/* global Maths, nnw, nne, nnm */
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
  tb.empty // read-only property, true/false

  tb.update(c) // update's the [c]ontent of the text bubble

  // the content argument should be an object which looks like:
  {
     content: '<b>hi</b>', // (required) either html string or HTMLElement
     highlight: 1,         // (optinoal) number of line to highlight
     highlightColor: clr,  // (optinoal) color value of the highlight
     options: {            // (optinoal) buttons to add to the message
       'ok': () => { }     // key = button content, value = click function
     },
  }

  tb.updateOptions(o) // updates the text bubbles options, which are the
                      // optional buttons to include below the content
                      // the options object should have properties (named as
                      // you would like the button to appear) with callback
                      // funcitons as values (which will run when clicked).

  // if/when tb.update() is passed an array of content objects it will
  // automatically add "previous" and "next" options to each text bubble so
  // the can navigate between one item in the array and the next. it will also
  // add an "ok" option to the last text bubble so the user can close it.
  // you can override these default options by passing your own options param
  // in the content objects, these can call .next() && .prev() manually, ex:

  {
    content: 'what do u wanna do?',
    options: {
      'what is next?': (e) => { e.next() },
      'wait, go back': (e) => { e.prev() }
    }
  }

  // you can create non-lenear paths through text bubbles as well by including
  // an id property in the content object && then navigate between them by
  // calling the .goTo() method, passing it the id of the object you want to
  // navigate to, for ex:

  tb.update([
    {
      content: 'what do you want to know?',
      options: {
        'ur first name': (e) => { e.goTo('first-name') },
        'ur last name': (e) => { e.goTo('last-name') },
      }
    },
    {
      id: 'first-name',
      content: 'my first name is Nick',
      options: {
        'what about ur last name?': (e) => { e.goTo('last-name') },
        'ok, cool': (e) => { e.clear() },
      }
    },
    {
      id: 'last-name',
      content: 'my last name is Briz',
      options: {
        'what about ur first name?': (e) => { e.goTo('first-name') },
        'ok, cool': (e) => { e.clear() },
      }
    }
  ])

  // other methods...

  tb.fadeIn()
  tb.fadeOut()
  tb.updatePosition()

*/
class TextBubble {
  constructor (opts) {
    opts = opts || {}

    this.map = {} // when an Array of contents is passed to update
    this.idx = 0 // currently displayed index of list

    this._setupBubble(opts.content || '')

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

  get empty () {
    const empties = ['\n        \n      ', '']
    return empties.includes(this.nfo.innerHTML)
  }

  set empty (v) {
    return console.error('TextBubble: empty property is read only')
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•.¸ public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  update (o) {
    if (o instanceof Array) {
      this._createMap(o)
      this.update(o[0])
    } else {
      if (typeof o.content === 'string') {
        this.nfo.innerHTML = o.content
      } else {
        this.nfo.innerHTML = ''
        this.nfo.appendChild(o.content)
      }

      this.updateOptions(o.options)

      if (o.highlight) {
        const c = o.highlightColor || '#E6DB6F69'
        nne.highlight(o.highlight, c)
      } else nne.highlight(0)
    }

    if (!this.opened) this.fadeIn(250)
    else this.updatePosition()
  }

  updateOptions (opts) {
    this.opt.innerHTML = ''

    if (this.map.length > 0 && !opts) {
      opts = {}
      if (this._hasPrev()) opts.previous = () => { this.prev() }
      if (this._hasNext()) opts.next = () => { this.next() }
      if (this._onLast()) opts.ok = () => { nnm.hideTextBubble() }
    }

    for (const key in opts) {
      const ele = document.createElement('button')
      ele.textContent = key
      ele.onclick = () => { opts[key](this) }
      this.opt.appendChild(ele)
    }
  }

  goTo (id) {
    if (!this.map[id]) {
      let m = `TextBubble: there is no ${id} id in the current content map.`
      m += ` Did you maybe mean one of these: ${Object.keys(this.map).join(', ')}`
      return console.error(m)
    }
    this.update(this.map[id])
  }

  next () {
    if (this.map.length <= 0) {
      return console.error('TextBubble: there is nothing next')
    }
    this.idx++
    this.update(this.map[this.idx])
  }

  prev () {
    if (this.map.length <= 0) {
      return console.error('TextBubble: there is nothing prior')
    }
    this.idx--
    this.update(this.map[this.idx])
  }

  clear () {
    this.fadeOut(() => { this.nfo.innerHTML = '' })
  }

  fadeIn (ms) {
    const t = ms || 2000
    this.ele.style.transition = `opacity ${t}ms ease-out`
    this.ele.style.display = 'block'
    this.updatePosition()
    setTimeout(() => { this.ele.style.opacity = 1 }, 100)
  }

  fadeOut (ms, callback) {
    const t = ms || 250
    this.ele.style.transition = `opacity ${t}ms ease-out`
    setTimeout(() => { this.ele.style.opacity = 0 }, 10)
    setTimeout(() => {
      this.ele.style.display = 'none'
      if (callback) callback()
    }, 255)
  }

  updatePosition () {
    if (nnw.layout === 'dock-left') {
      const offY = 29 + this.ele.offsetHeight
      this.ele.style.transform = `translate(362px, ${offY}px)`
      this.tri.style.top = '13px'
      this.tri.style.left = '-17px'
      this.tri.style.right = null
      this.tri.style.bottom = null
      this.tri.style.transform = 'rotate(270deg)'
    } else if (nnw.layout === 'full-screen') {
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

  _hasPrev () { return this.map.length > 0 && this.idx > 0 }
  _hasNext () { return this.map.length > 0 && this.idx < this.map.length - 1 }
  _onFirst () { return this.idx === 0 }
  _onLast () { return this.idx === this.map.length - 1 }

  _setupBubble (content) {
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
  }

  _isLinear (arr) {
    let linear = true
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id) { linear = false; break }
    }
    return linear
  }

  _createMap (arr) {
    if (this._isLinear(arr)) {
      this.map = { length: arr.length }
      arr.forEach((o, i) => { this.map[i] = o })
    } else {
      this.map = {}
      arr.forEach(o => { this.map[o.id] = o })
    }
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
