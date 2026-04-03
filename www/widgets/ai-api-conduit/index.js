/* global NNE, WIDGETS, Widget, Convo, utils, nn */
class AiApiConduit extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'ai-api-conduit'
    this.keywords = ['ai', 'artificial', 'intelligence', 'api', 'llm', 'conduit']
    this.title = 'LLM-API Conduit'
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.width = 638
    this.height = 535

    this.on('open', () => this._createHTML(opts))
  }

  convo (key) {
    window.convo = new Convo(this.convos, key)
  }

  _createHTML (opts) {
    utils.get(`./widgets/${this.key}/index.html`, html => {
      this.innerHTML = html
      this.convo('start')
    }, true)
  }
}

window.AiApiConduit = AiApiConduit
