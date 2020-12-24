/* global NNE, NNW, utils */
/*

Convo.load('example-convo', () => {
  const convoArray = window.CONVOS['example-convo']()
  const convoInstance = new Convo(convoArray)
})
*/

window.CONVOS = {} // global convos object, contains all loaded convo functions

class Convo {
  constructor (data, start) {
    if (typeof data !== 'object' && !(data instanceof Array)) {
      return console.error('Convo: constructor expects an object or array')
    }
    if (data instanceof Array) this.data = this._mapData(data)
    else this.data = this._mapData([data])
    this.id = start || Object.keys(this.data)[0]
    this._update(this.id)
  }

  /*
    // inside another class
    this.convo = null
    Convo.load('example-convo', () => {
      // NOTE: need to rerun this everytime a convo which relies on
      // localStorage data is going to launch (to ensure latest data)
      this.convos = window.CONVOS['example-convo'](this)
    })

    // inside a method w/in that class
    this.convos = window.CONVOS['example-convo'](this)
    window.convo = new Convo(this.convos['convo-object-key'])
  */

  static load (name, cb) {
    const s = document.createElement('script')
    s.setAttribute('src', `convos/${name}/index.js`)
    s.setAttribute('type', 'text/javascript')
    s.onerror = (e) => { console.error(`Convo.load: failed to load ${name}`) }
    s.onload = () => { if (cb) cb() }
    document.body.appendChild(s)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•.¸ public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  next () { this._update(Number(this.id) + 1) }

  prev () { this._update(Number(this.id) - 1) }

  goTo (id) { this._update(id) }

  hide () { NNW.menu.textBubble.fadeOut() }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _update (id) {
    this.id = id
    const time = utils.getVal('--menu-fades-time')
    const obj = this.data[this.id]

    // pre hoook
    if (typeof obj.before === 'function') obj.before(this, obj.scope)

    // update
    NNW.menu.textBubble.update({
      content: obj.content,
      options: obj.options,
      scope: obj.scope
    })

    if (NNW.layout === 'welcome' || NNW.layout === 'separate-window') {
      NNW.keepInFrame()
    }

    setTimeout(() => {
      if (typeof obj.code === 'string') {
        NNE.code = obj.code
        setTimeout(() => { NNE.cm.refresh() }, 10)
      }

      if (typeof obj.edit === 'boolean') {
        if (obj.edit) NNE.cm.setOption('readOnly', false)
        else NNE.cm.setOption('readOnly', true)
      }

      if (obj.highlight) {
        NNE.highlight()
        const t = typeof obj.highlight
        if (t === 'number' || t === 'object') NNE.highlight(obj.highlight)
      }

      if (typeof obj.layout === 'string') {
        NNW.layout = obj.layout
        if (NNW.layout === 'welcome' || NNW.layout === 'separate-window') {
          NNW.keepInFrame()
        }
      }

      // post hook
      if (typeof obj.after === 'function') obj.after(this, obj.scope)
    }, time)
  }

  _mapData (steps) {
    const dict = {}
    const linear = this._isLinear(steps)
    steps.forEach((o, i) => {
      if (!o.content) {
        console.error(`Convo: index ${i} is missing it's content property`)
      }
      o.scope = this
      o.id = o.id || i
      o.options = o.options ? o.options
        : linear ? this._defaultLinearOpts(i, steps)
          : this._defaultNonLinearOpts(i, steps)
      dict[o.id] = o
    })
    return dict
  }

  _isLinear (arr) {
    let linear = true
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id) { linear = false; break }
    }
    return linear
  }

  _defaultLinearOpts (i, arr) {
    const opts = {}
    if (i > 0) opts.previous = (e) => e.prev()
    if (i < arr.length - 1) opts.next = (e) => e.next()
    if (i === arr.length - 1) opts.ok = (e) => e.hide()
    return opts
  }

  _defaultNonLinearOpts (i, arr) {
    const opts = {}
    if (i > 0) {
      const id = arr[i - 1].id || i - 1
      opts.previous = (e) => e.goTo(id)
    }
    if (i < arr.length - 1) {
      const id = arr[i + 1].id || i + 1
      opts.next = (e) => e.goTo(id)
    }
    if (i === arr.length - 1) opts.ok = (e) => e.hide()
    return opts
  }
}

window.Convo = Convo
