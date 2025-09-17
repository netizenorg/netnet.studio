/* global Widget, Convo, nn, NNE, NNW, utils */
class DemoMaker extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'demo-maker'
    this.listed = true
    this.keywords = ['demos', 'sketch', 'annotations', 'notes', 'example', 'create', 'lesson']
    this.title = 'Demo Maker'
    this.hidden = true

    this.popup = null // reference to pop up widget
    this.demos = {} // directory of demos
    this.demo = null // data for demo being worked on

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('open', () => {
      if (!this.popup) this._openPopup()
    })

    utils.get('api/demos', (res) => {
      this.demos = res.data
      this._messagePopup('demo-list', this.demos)
    })

    nn.on('message', e => {
      if (e.origin !== window.location.origin) return // for security
      if (e.data.type === 'demo-mkr-opened') {
        this._messagePopup('demo-list', this.demos)
        if (this.demo) {
          this._messagePopup('demo-data', this.demo)
        }
      } else if (e.data.type === 'demo-mkr-edit-file') {
        utils.get(`api/demo/${e.data.payload}`, (demo) => {
          this.demo = demo
          this._messagePopup('demo-data', this.demo)
          this._loadData(this.demo)
        })
      } else if (e.data.type === 'demo-mkr-open-file') {
        this.demo = JSON.parse(e.data.payload)
        this._messagePopup('demo-data', this.demo)
        this._messagePopup('demo-list', this.demos)
        this._loadData(this.demo)
      } else if (e.data.type === 'demo-mkr-preview') {
        this._preview(e.data.payload)
      } else if (e.data.type === 'demo-mkr-loaded-note') {
        if (NNW.menu.textBubble.opened) {
          this._preview(e.data.payload)
        }
      } else if (e.data.type === 'demo-mkr-update') {
        if (!this.demo || !this.demo.key) {
          if (NNW.layout === 'welcome') NNW.layout = 'dock-left'
          utils.afterLayoutTransition(() => window.convo.hide())
          NNE.code = ''
        }
        const demo = JSON.parse(e.data.payload)
        demo.info = demo.info.map(o => { delete o.id; return o })
        this.demo = demo
      } else if (e.data.type === 'demo-mkr-download') {
        this._downloadJSON()
      } else if (e.data.type === 'demo-mkr-gen-url') {
        this._generateURL()
      } else if (e.data.type === 'explain') {
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, e.data.payload)
      }
    })

    nn.on('beforeunload', () => {
      if (this.popup && !this.popup.closed) this.popup.close()
    })
  }

  _openPopup (type, payload) {
    const url = 'widgets/demo-maker/popups/index.html'
    this.popup = window.open(url, 'example-widget', 'width=760,height=470')
    // keep an eye on the pop up to see if it closed
    this.popupWatcher = setInterval(() => {
      if (this.popup && this.popup.closed) {
        clearInterval(this.popupWatcher)
        this.popup = null
      }
    }, 500)
  }

  _messagePopup (type, payload) {
    if (!this.popup) return
    this.popup.postMessage({ type, payload }, window.origin)
  }

  _loadData (demo) {
    NNE.code = NNE._decode(demo.code.split('#code/').pop())
    NNW.layout = demo.layout || 'dock-left'
    if (window.convo) window.convo.hide()
  }

  _preview (noteIdx) {
    NNE.spotlight(null)
    const note = this.demo.info[noteIdx]
    window.convo = new Convo({
      content: note.text,
      spotlight: note.focus
    })
  }

  _getData () {
    const data = {
      key: this.demo.key,
      name: this.demo.name,
      tags: this.demo.tags,
      layout: this.demo.layout,
      code: NNE.generateHash()
    }

    const hasInfo = this.demo.info &&
        this.demo.info.length > 0 &&
        this.demo.info[0].text !== '...'
    if (hasInfo) data.info = this.demo.info

    return data
  }

  _generateURL () {
    const data = this._getData()
    const str = JSON.stringify(data)
    const loc = window.location
    const l = data.layout !== 'dock-left' ? `?layout=${data.layout}` : ''
    const url = `${loc.protocol}//${loc.host}/${l}#demo/${NNE._encode(str)}`
    this._messagePopup('generated-url', url)
  }

  _downloadJSON () {
    const data = this._getData()
    const str = JSON.stringify(data, null, 2)
    const uri = `data:application/json;base64,${utils.btoa(str)}`
    const name = data.name.toLowerCase().replace(/\s/g, '_')
    const a = document.createElement('a')
    a.setAttribute('download', `${data.key}--${name}.json`)
    a.setAttribute('href', uri)
    a.click()
    a.remove()
  }
}

window.DemoMaker = DemoMaker
