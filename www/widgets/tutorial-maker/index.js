/* global Convo Widget WIDGETS nn NNW NNE */
class TutorialMaker extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'tutorial-maker'
    this.listed = true
    this.keywords = ['create', 'make', 'lecture']
    this.title = 'Tutorial Maker'
    this.hidden = true

    this.popup = null // reference to popup
    this.hvp = null // reference to hyper-video-player

    Convo.load(this.key, () => this._openConvo('opened'))

    this.on('open', () => {
      if (!this.popup) this._openPopup()
    })

    // listen for netitor changes to udpate index.html in db for ServiceWorker
    this._boundEditWatcher = this._editWatcher.bind(this)
    NNE.cm.on('change', this._boundEditWatcher)

    // messages from popup
    nn.on('message', e => {
      const { type, payload } = e.data
      if (e.origin !== window.location.origin) return // for security
      if (type === 'tut-mkr-opened-tutorial') { // opened tutorial from zip
        this._loadTutorial(payload)
      } else if (type === 'tut-mkr-update-metadata') { // new metadata
        this._updateMetadata(payload)
      } else if (type === 'tut-mkr-get-metadata') { // asked for metadata
        this._messagePopup('tut-mkr-metadata', this.hvp.data.metadata)
      } else if (type === 'tut-mkr-update-video') { // new video data
        this._updateVideo()
      } else if (type === 'tut-mkr-keyframe-click') { // keyframe marker click
        this.hvp.seek(payload)
        const kf = this.hvp.data.keyframes.find(k => k.timecode === payload)
        this._messagePopup('tut-mkr-keyframe', kf)
      } else if (type === 'tut-mkr-keylog-click') { // keylog marker click
        this.hvp.seek(payload)
        const kl = this.hvp.data.keylogs.find(k => k.timecode === payload)
        this._messagePopup('tut-mkr-keylog', kl)
      } else if (type === 'tut-mkr-get-keyframe') { // asked for keyframe
        const kf = this._updateFrame('keyframes', payload)
        this._messagePopup('tut-mkr-keyframe', kf)
      } else if (type === 'tut-mkr-get-keylog') { // asked for keylog
        const kl = this._updateFrame('keylogs', payload)
        this._messagePopup('tut-mkr-keylog', kl)
      } else if (type === 'tut-mkr-seek') { // scrubbed playhead
        this.hvp.seek(payload)
        const kl = this.hvp.data.keylogs.find(k => k.timecode === payload)
        if (kl) this._messagePopup('tut-mkr-keylog', kl)
        const kf = this.hvp.data.keyframes.find(k => k.timecode === payload)
        if (kf) this._messagePopup('tut-mkr-keyframe', kf)
      } else if (type === 'tut-mkr-toggle') {
        this.hvp.toggle()
      } else if (type === 'tut-mkr-explain') { // clicked on (?) explainer button
        this._openConvo(payload)
      }
    })

    // if we quit or refresh the netnet tab, we should also close the popup
    nn.on('beforeunload', () => {
      if (this.popup && !this.popup.closed) this.popup.close()
    })
  }

  // ......................... load + quit .....................................

  _loadTutorial (data) {
    // load the hyper-vide-player in "making" mode
    WIDGETS.open('hyper-video-player', (widget) => {
      this.hvp = widget
      this.hvp.making = true
      this.hvp.data = data
      this.hvp._loadTutorial(data)
      this._setCustomRenderer()
      this.hvp.video.on('timeupdate', () => this._onVideoTimeUpdate())
      // let the service worker know we're in "tutorial mode"
      // so it properly routes any requests from the iframe as it does
      // other tutorial requests (ie. the HVP video file + widget assets)
      // turn ON tutorial mode for this tab
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller
          .postMessage({ type: 'SET_TUTORIAL_MODE', slug: data.id, enabled: true })
      } else console.error('Tutorial Maker: iframe SW CFG was not properly set')
    })
  }

  _quitTutorial () {
    // let the service worker know to return to it's default behavior
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller
        .postMessage({ type: 'SET_TUTORIAL_MODE', enabled: false })
    } else console.error('Tutorial Maker: failed to reset iframe SW to default')
    // clear edit watcher
    NNE.cm.off('change', this._boundEditWatcher)
    // quit hyper video player so it runs the "reset"
    if (this.hvp) this.hvp.quit()
    this.hvp = null
  }

  // ........................... update data ...................................

  _updateMetadata (metadata) {
    if (!this.hvp) {
      // first time running updateMetadata
      WIDGETS.open('hyper-video-player', (widget) => {
        this.hvp = widget
        this.hvp.making = true
        this.hvp.data = {
          id: metadata.id,
          metadata: JSON.parse(JSON.stringify(metadata)),
          widgets: {},
          keyframes: [],
          keylogs: []
        }
        this.hvp.video.on('timeupdate', () => this._onVideoTimeUpdate())
      })
    } else {
      this.hvp.data.metadata = JSON.parse(JSON.stringify(metadata))
      this.hvp.title = this.hvp.data.metadata.title
    }
  }

  _updateVideo () {
    if (this.hvp.video.src.includes('videos/screen-saver')) {
      // then we can assume this is the first time we're updating the video
      const name = this.hvp.data.id
      this.hvp.updateVideo(name, name)
      this._messagePopup('tut-mkr-video-duration', this.hvp.duration)
    } else {
      console.error('Tutorial Maker: You can only create a video once per tutorial')
    }
  }

  _updateFrame (type, time) {
    let frame = this.hvp.data[type].find(k => k.timecode === time)
    if (type === 'keyframes') {
      if (!frame) { // create keyframe
        frame = {
          timecode: time,
          name: null,
          video: this._getSizeAndPosition(this.hvp),
          widgets: this._getCurrentWidgets(),
          netitor: this._getNetitorData(),
          netnet: this._getNetNetPos()
        }
        this.hvp.data[type].push(frame)
        this.hvp.data[type].sort((a, b) => a.timecode - b.timecode)
      } else { // update keyframe
        // frame.name = ... // TODO get from popup
        frame.video = this._getSizeAndPosition(this.hvp)
        frame.widgets = this._getCurrentWidgets()
        frame.netitor = this._getNetitorData()
        frame.netnet = this._getNetNetPos()
      }
    } else if (type === 'keylogs') {
      // TODO
    }
    return frame
  }

  // ............................ helpers ......................................

  _openPopup (type, payload) {
    const url = 'widgets/tutorial-maker/popups/index.html'
    this.popup = window.open(url, 'example-widget', 'width=200,height=200')
    // keep an eye on the pop up to see if it closed
    this.popupWatcher = setInterval(() => {
      if (this.popup && this.popup.closed) {
        clearInterval(this.popupWatcher)
        this.popup = null
        this._quitTutorial()
      }
    }, 500)
  }

  _messagePopup (type, payload) {
    if (!this.popup) return
    this.popup.postMessage({ type, payload }, window.origin)
  }

  _openConvo (id) {
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, id)
  }

  _editWatcher () {
    this._messagePopup('tut-mkr-code-update', NNE.code)
  }

  _setCustomRenderer () {
    // custom renderer so that the iframe gets resolved by the ServiceWorker
    const ready = navigator.serviceWorker.controller && this.hvp?.data
    NNE.customRender = (eve) => {
      if (ready) {
        eve.iframe.src = `/TUTORIAL_MAKER/${this.hvp.data.id}/index.html`
      } else eve.update(eve.code)
    }
  }

  _onVideoTimeUpdate () {
    const tc = this.hvp.currentTime
    const payload = {
      time: tc,
      keyframe: this.hvp.data.keyframes.find(k => k.timecode === tc),
      keylog: this.hvp.data.keylogs.find(k => k.timecode === tc)
    }
    this._messagePopup('tut-mkr-time-update', payload)
  }

  // NOTE: may not need this now, but if ever we need to delay a call to another
  // function until a keyframe has finished rendering (ex: after calling hvp.seek)
  // this function calculates how long it takes for that keyframe to render given
  // the timecode of that particular keyframe
  _delayTime (tc) {
    const time = this.hvp._tt // default delay time
    let wigTime = 0 // calculate widget delay time
    const frame = this.hvp.data.keyframes.find(k => k.timecode === tc)
    if (frame && frame.widgets.length > 0) {
      let wt = this._do
      frame.widgets.forEach(w => {
        const wig = WIDGETS[w.key]
        if (!wig.opened) { // mirrors renderKeyframe timing logic
          wigTime += wt * 2 + 50
          wt += this._da
        }
      })
    }
    if (wigTime > time) return time + (wigTime - time)
    else return time
  }

  _getSizeAndPosition (w) {
    const data = (w !== NNW)
      ? { key: w.key, width: w.width, height: w.height } : {}

    if (w.left < w.right) data.left = w.left
    else data.right = w.right

    if (w.top < w.bottom) data.top = w.top
    else data.bottom = w.bottom

    if (w !== NNW) data.zIndex = w.zIndex
    if (w === NNW && NNW.layout === 'separate-window') {
      data.width = NNW.width
      data.height = NNW.height
    }
    return data
  }

  _getCurrentWidgets () {
    return WIDGETS.list()
      .filter(w => w.opened)
      .filter(w => w.key !== 'hyper-video-player')
      .map(w => this._getSizeAndPosition(w))
  }

  _getNetitorData () {
    const s = NNE.cm.getScrollInfo()
    return {
      code: NNE.code,
      scrollTo: { x: s.left, y: s.top },
      spotlight: null, // TODO: need to send data from popup
      layout: NNW.layout
    }
  }

  _getNetNetPos () {
    if (['welcome', 'separate-window'].includes(NNW.layout)) {
      return this._getSizeAndPosition(NNW)
    } else return {}
  }
}

window.TutorialMaker = TutorialMaker
