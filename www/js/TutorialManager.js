/* global TUTORIAL, STORE */
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

  load (tut) {
    const root = (tut.indexOf('http') === 0) ? tut : `tutorials/${tut}`
    const url = (tut.indexOf('http') === 0)
      ? `${tut}/metadata.json` : `tutorials/${tut}/metadata.json`
    window.fetch(url, { method: 'GET' })
      .then(res => res.json())
      .then(json => this._loadScript(json, root))
  }

  next () {
    // TODO
  }

  prev () {
    // TODO
  }

  goTo (id) {
    console.log(id)
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

  _loadScript (json, root) {
    this.metadata = json // TODO: validate metadata....
    const s = document.createElement('script')
    s.setAttribute('src', `${root}/${json.main}`)
    s.onerror = (e) => { this._err('main') }
    s.onload = () => this._updateState()
    document.body.appendChild(s)
  }

  _updateState () {
    if (typeof TUTORIAL === 'object') {
      if (!(TUTORIAL.steps instanceof Array)) return this._err('steps')
      const first = this._createStartObj()
      TUTORIAL.steps = [first, ...TUTORIAL.steps]
      const steps = this._mapData(TUTORIAL.steps)

      // const key = TUTORIAL.steps[0].id || '0'
      // this.state.video = TUTORIAL.steps[0].video || null // TODO...
      const editable = (typeof TUTORIAL.steps[0].edit === 'boolean')
        ? TUTORIAL.steps[0].edit : true

      STORE.dispatch('TUTORIAL_DATA', { steps, key: '___START___', editable })
    } else this._err('tutObj')
  }

  _createStartObj () {
    const m = this.metadata
    return {
      id: '___START___',
      content: `I've loaded a tutorial by ${m.author}
      called ${m.title}, ${m['sub-title']}, shall we get started?`,
      options: {
        'yes, let\'s do it!': (e) => { e.goTo('start') },
        'no, i changed my mind': (e) => { e.goTo('end') }
      },
      scope: this
    }
  }

  _isLinear (arr) {
    let linear = true
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id) { linear = false; break }
    }
    return linear
  }

  _mapData (steps) {
    let dict = {}
    if (this._isLinear(steps)) {
      dict = { length: steps.length }
      steps.forEach((o, i) => { o.scope = this; dict[i] = o })
    } else {
      dict = {}
      steps.forEach((o, i) => {
        const key = o.id || i
        o.scope = this
        dict[key] = o
      })
    }
    return dict
  }
}

window.TutorialManager = TutorialManager
