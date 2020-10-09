/* global TUTORIAL, STORE, WIDGETS, NNW */
/*
  -----------
     info
  -----------

  This class is responsible for much of the interactive tutorials logic.
  It can load tutorial data by passing a tutorial name into it's `.load()`
  method. It can also load tutorials hosted elsewhere on the Internet by
  passing it a URL (to a directory with a `metadata.json` file). It can
  also launch a tutorial on page load by passing netnet a `tutorial` URL
  parameter, ex: `http://netnet.studio/?tutorial=tutorial-name-or-url`.

  NOTE: This class is only meant to be instantiated once... so why not just make it
  a global object? ...b/c i like JS's class syntax better than that of global
  objects. It's also dependent on the external STORE (StateManager).

  -----------
     usage
  -----------

  const NNT = new TutorialManager()

  NNT.metadata // object w/meta data (after a tutorial is loaded)

  NNT.load(tutorial) // could be a name or URL to externally hosted tutorial

  NNT.next() // jump to next step
  NNT.prev() // jump to previous step
  NNT.goTo(id) // to jump to a specific step in the tutorial

*/
class TutorialManager {
  constructor () {
    this.metadata = null // info from the tutorial's metadata.json
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•.¸ public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  load (tut, cb) {
    const root = (tut.indexOf('http') === 0) ? tut : `tutorials/${tut}`
    const url = (tut.indexOf('http') === 0)
      ? `${tut}/metadata.json` : `tutorials/${tut}/metadata.json`
    window.fetch(url, { method: 'GET' })
      .then(res => res.json())
      .then(json => this._loadScript(json, root, cb))
  }

  next () {
    const index = Number(STORE.state.tutorial.id)
    this._resetVideos()
    STORE.dispatch('TUTORIAL_NEXT_STEP', index + 1)
  }

  prev () {
    const index = Number(STORE.state.tutorial.id)
    this._resetVideos()
    STORE.dispatch('TUTORIAL_PREV_STEP', index - 1)
  }

  goTo (id) {
    this._resetVideos()
    STORE.dispatch('TUTORIAL_GOTO', id)
  }

  hide () { STORE.dispatch('HIDE_TUTORIAL_TEXT') }

  open (name) { WIDGETS[name].open() }

  close (name) { WIDGETS[name].close() }

  quit () {
    this.closeWidgets()
    NNW.removeWidgets(TUTORIAL.widgets)
    STORE.dispatch('TUTORIAL_FINISHED')
  }

  end () { this.quit() }

  fin () { this.quit() }

  closeWidgets () {
    Object.keys(TUTORIAL.widgets)
      .filter(key => STORE.state.widgets.includes(key))
      .forEach(key => WIDGETS[key].close())
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _err (t) {
    const errz = {
      main: 'could not load tutorial\'s main JS file',
      tutObj: 'tutorial\'s main JS file is missing the TUTORIAL object',
      steps: 'the TUTORIAL object is missing the steps Array'
    }
    console.error(`TutorialManager: ${errz[t]}`)
  }

  _resetVideos () {
    for (const w in TUTORIAL.widgets) {
      const v = TUTORIAL.widgets[w].$('video')
      if (v) v.currentTime = 0
    }
  }

  _loadScript (json, root, cb) {
    this.metadata = json // TODO: validate metadata....
    const s = document.createElement('script')
    if (root.indexOf('tutorials/') === 0) {
      // internally hosted
      s.setAttribute('src', `${root}/${json.main}`)
      s.setAttribute('type', 'text/javascript')
      s.onerror = (e) => { this._err('main') }
      s.onload = () => this._updateState(root, cb)
      document.body.appendChild(s)
    } else {
      // externally hosted
      window.fetch(`${root}/${json.main}`, { method: 'GET' })
        .then(res => res.text())
        .then(text => {
          s.innerHTML = text
          document.body.appendChild(s)
          this._updateState(root, cb)
        })
    }
  }

  _updateState (url, func) {
    if (typeof TUTORIAL === 'object') {
      // update tutorial data
      if (!(TUTORIAL.steps instanceof Array)) return this._err('steps')
      const steps = this._mapData(TUTORIAL.steps)
      steps.__START__ = this._createStartObj()
      // this.state.video = TUTORIAL.steps[0].video || null // TODO...
      const editable = (typeof TUTORIAL.steps[0].edit === 'boolean')
        ? TUTORIAL.steps[0].edit : true
      STORE.dispatch('TUTORIAL_DATA', { url, steps, id: '__START__', editable })

      // update global widgets
      if (typeof TUTORIAL.widgets === 'object') {
        // NOTE: this will only load tutorials for which there are existing
        // classes in www/widgets. if a new widget class type needs to be
        // added to the page use window.utils.loadWidgetClass(path, filename)
        NNW.loadWidgets(TUTORIAL.widgets)
      }

      // run tutorial's onload event
      if (typeof TUTORIAL.onload === 'function') TUTORIAL.onload()

      // run optional callback
      if (func) func(this)
      else this.goTo('__START__')
      //
    } else this._err('tutObj')
  }

  _createStartObj () {
    const m = this.metadata
    const i = TUTORIAL.steps[0].id || 0
    const options = {
      'yes, let\'s do it!': (e) => {
        e.goTo(i)
        WIDGETS['tutorials-menu'].close()
      },
      'no, i changed my mind': (e) => {
        this.quit()
        window.greetings.injectStarterCode()
        window.greetings.mainMenu()
      }
    }
    if (!WIDGETS['tutorials-menu'].opened) {
      options['open tutorials menu'] = (e) => {
        WIDGETS['tutorials-menu'].open()
      }
    }
    return {
      id: '___START___',
      content: `Ok, I've loaded a tutorial called ${m.title}:
      ${m.subtitle}; shall we get started?`,
      options: options,
      scope: this
    }
  }

  _mapData (steps) {
    const dict = {}
    const linear = this._isLinear(steps)
    steps.forEach((o, i) => {
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
    if (i === arr.length - 1) opts.ok = (e) => e.end()
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
    if (i === arr.length - 1) opts.ok = (e) => e.end()
    return opts
  }
}

window.TutorialManager = TutorialManager
