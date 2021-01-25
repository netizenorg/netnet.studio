/* global Widget, Convo, NNE, NNW, utils */
class JSReference extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'js-reference'
    this.listed = false // TODO make true when cheatsheets are finished
    this.keywords = ['js', 'javascript'] // TODO add cheatsheets when finsihed

    utils.get('./data/js-reference.json', (json) => { this.data = json })

    // NNW.on('theme-change', () => { this._createHTML() })

    this.title = 'JavaScript Reference'
    this._createHTML()
  }

  textBubble (eve) {
    if (!eve || !eve.nfo) return

    const more = () => {
      const url = eve.nfo.url
      const a = document.createElement('a')
      a.setAttribute('download', 'index.html')
      a.setAttribute('href', url)
      a.setAttribute('target', '_blank')
      a.click()
      a.remove()
    }

    const options = {
      'tell me more': () => more(),
      ok: (e) => { e.hide() }
    }

    const extras = this.data[eve.data]
    const content = (extras && extras.bubble)
      ? `<p>${this.data[eve.data].bubble}</p>`
      : `<p>${eve.nfo.description.html}</p>`

    // TODO: update HTML to display corresponding cheatsheet

    window.convo = new Convo({ content, options }, null, true)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML () {
    // TODO: create "cheatsheets" for diff core js objects, ex: canvas, Math, Date, etc
    // see NNE.edu.js
    // this.innerHTML = ''
    // utils.loadStyleSheet(this.key)
  }
}

window.JSReference = JSReference
