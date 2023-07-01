/* global Widget, Convo, NNE, NNW, utils */
class JsReference extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'js-reference'
    this.listed = false // TODO make true when cheatsheets are finished
    this.keywords = ['js', 'javascript', 'reference'] // TODO add cheatsheets when finsihed
    this.resizable = false

    this.title = 'JavaScript Reference'

    // this.on('close', () => { this.slide.updateSlide(this.mainOpts) })

    utils.get('./widgets/js-reference/data/edu-supplement.json', (json) => { this.data = json })

    utils.get('./widgets/js-reference/data/main-slide.html', (html) => {
      // options objects for <widget-slide> .updateSlide() method
      this.mainOpts = {
        name: 'js-reference-main',
        widget: this,
        ele: this._createMainSlide(html)
      }

      this._createHTML()

      NNW.on('theme-change', () => { this._createHTML() })
    }, true)

    // NNW.on('theme-change', () => { this._createHTML() })
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
    if (!utils.customElementReady('widget-slide')) {
      setTimeout(() => this._createHTML(), 100)
      return
    }

    this.slide = document.createElement('widget-slide')
    this.innerHTML = this.slide

    this.ele.style.padding = '8px 5px 10px'
    this.ele.querySelector('.widget__top').style.padding = '0px 15px 0px'
    this.ele.querySelector('.widget__inner-html').style.padding = '10px 0px'

    this.slide.updateSlide(this.mainOpts)
  }

  _createMainSlide (html) {
    const div = document.createElement('div')
    div.innerHTML = html
    return div
  }
}

window.JsReference = JsReference
