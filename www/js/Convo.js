/* global NNE, STORE */
/*
  -----------
     info
  -----------

  This class can be used to create linear and non-linear conversations with
  netnet. It works almost exactly like the TutorialManager (except without all
  the extra logic related to tutorials). the ArrayOfContentObjects you pass
  into the constructor should look exactly like that of the steps array of
  tutorials.

  NOTE: This class is dependent on the external STORE (StateManager) as well
  as the NNE (the netitor instance).

  -----------
     usage
  -----------

  // simplest convo is passed a single content object
  const chat = new Convo(contentObject)

  // when passed an array of content objects, the convo starts with
  // the first object in that array
  const chat = new Convo(ArrayOfContentObjects)

  // you can pass an optional second arg with the ID of a content object
  // in the array you'd prefer to start with (instead of the first one)
  const chat = new Convo(ArrayOfContentObjects, startID)

  // methods include...
  chat.next() // jump to next step
  chat.prev() // jump to previous step
  chat.goTo(id) // to jump to a specific step in the tutorial
  chat.hide() // hides text bubble

  // when creating custom options in a content object, you have access to both
  // the scope of the Convo instance, as well as the text bubble, the former
  // is useful for calling Convo methods (next, hide, etc) the latter is useful
  // for accessing the DOM of the text bubble, for example:

  window.convo = new Convo({
    content: 'Hey there, <input placeholder="what\'s new?">',
    options: {
      'that\'s what': (c, t) => {
        const v = t.$('input').value
        // do something with inptu value
      },
      'nothing much': (e) => e.hide()
    }
  })

*/
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

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•.¸ public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  next () { this._update(Number(this.id) + 1) }

  prev () { this._update(Number(this.id) - 1) }

  goTo (id) { this._update(id) }

  hide () { STORE.dispatch('HIDE_EDU_TEXT') }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _update (id) {
    this.id = id
    const time = STORE.getTransitionTime()
    const obj = this.data[this.id]

    // pre hoook
    if (typeof obj.before === 'function') obj.before()

    // update
    STORE.dispatch('SHOW_EDU_TEXT', {
      content: obj.content,
      options: obj.options,
      scope: obj.scope
    })
    setTimeout(() => {
      if (typeof obj.code === 'string') NNE.code = obj.code
      if (typeof obj.edit === 'boolean') {
        if (obj.edit) STORE.dispatch('ENABLE_EDITING')
        else STORE.dispatch('DISABLE_EDITING')
      }
      if (obj.highlight) {
        NNE.highlight()
        const t = typeof obj.highlight
        if (t === 'number' || t === 'object') NNE.highlight(obj.highlight)
      }
      if (typeof obj.layout === 'string') {
        STORE.dispatch('CHANGE_LAYOUT', obj.layout)
      }
      if (typeof obj.opacity === 'number') {
        STORE.dispatch('CHANGE_OPACITY', obj.opacity)
      }

      // post hook
      if (typeof obj.after === 'function') obj.after()
    }, time)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // ...these are identical to TutorialManager's

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
