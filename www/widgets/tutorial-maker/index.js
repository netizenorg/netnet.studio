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
      } else if (type === 'tut-mkr-get-data') { // get tutorial data
        const data = this._getData()
        this._messagePopup('tut-mkr-data', data)
      } else if (type === 'tut-mkr-update-metadata') { // new metadata
        this._updateMetadata(payload)
      } else if (type === 'tut-mkr-get-metadata') { // asked for metadata
        this._messagePopup('tut-mkr-metadata', this.hvp.data.metadata)
      } else if (type === 'tut-mkr-update-video') { // new video data
        this._updateVideo(payload)
      } else if (type === 'tut-mkr-keyframe-click') { // keyframe marker click
        this.hvp.seek(payload)
        const kf = this.hvp.data.keyframes.find(k => k.timecode === payload)
        this._messagePopup('tut-mkr-keyframe', kf)
      } else if (type === 'tut-mkr-keylog-click') { // keylog marker click
        this.hvp.seek(payload)
        const kl = this.hvp.data.keylogs.find(k => k.timecode === payload)
        this._messagePopup('tut-mkr-keylog', kl)
      } else if (type === 'tut-mkr-update-keyframe') { // create/update keyframe
        const kf = this._updateFrame('keyframes', payload)
        this._messagePopup('tut-mkr-keyframe', kf)
      } else if (type === 'tut-mkr-update-keylog') { // create/update keylog
        const kl = this._updateFrame('keylogs', payload)
        this._messagePopup('tut-mkr-keylog', kl)
      } else if (type === 'tut-mkr-get-keyframe') { // asked for keyframe
        const kf = this.hvp.data.keyframes.find(k => k.timecode === payload)
        this._messagePopup('tut-mkr-keyframe', kf)
      } else if (type === 'tut-mkr-get-keylog') { // asked for keylog
        const kl = this.hvp.data.keylogs.find(k => k.timecode === payload)
        this._messagePopup('tut-mkr-keylog', kl)
      } else if (type === 'tut-mkr-seek') { // scrubbed playhead
        this.hvp.seek(payload)
        const kl = this.hvp.data.keylogs.find(k => k.timecode === payload)
        if (kl) this._messagePopup('tut-mkr-keylog', kl)
        const kf = this.hvp.data.keyframes.find(k => k.timecode === payload)
        if (kf) this._messagePopup('tut-mkr-keyframe', kf)
      } else if (type === 'tut-mkr-toggle') { // toggle start/stop
        this.hvp.toggle()
      } else if (type === 'tut-mkr-update-widget') { // update widget
        this._updateWidget(payload.widget, payload.remove)
      } else if (type === 'tut-mkr-update-widget-state') {
        this._updateWidgetState(payload.widget)
      } else if (type === 'tut-mkr-open-widget') {
        this._openWidget(payload.widget, payload.open)
      } else if (type === 'tut-mkr-get-widget') {
        const wig = this.hvp.data.widgets[payload.key]
        this._messagePopup('tut-mkr-edit-widget', wig)
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
      this.hvp.data.id = data.metadata.id
      this.hvp._loadTutorial()
      this._setCustomRenderer()
      this.hvp.video.on('timeupdate', () => this._onVideoTimeUpdate())
    })
  }

  _quitTutorial () {
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

  _updateVideo (blob) {
    if (this.hvp.video.src.includes('videos/screen-saver')) {
      // then we can assume this is the first time we're updating the video
      this.hvp.video.on('loadeddata', () => {
        this._messagePopup('tut-mkr-video-duration', this.hvp.duration)
      })
      this.hvp.data.videoBlob = blob
      this.hvp.updateVideo()
    } else {
      console.error('Tutorial Maker: You can only create a video once per tutorial')
    }
  }

  _updateFrame (type, data) {
    const { timecode, name, netitor } = data
    let frame = this.hvp.data[type].find(k => k.timecode === timecode)
    if (type === 'keyframes') {
      if (data?.remove) { // delete keyframe
        if (frame) {
          this.hvp.data[type].splice(this.hvp.data[type].indexOf(frame), 1)
          return { frame, remove: true }
        } else {
          const error = `Failed to remove keyframe. No keyframe found for: ${timecode} seconds`
          console.error(error)
          return { error }
        }
      } else if (!frame) { // create keyframe
        frame = {
          timecode,
          name: name ?? '',
          video: this._getSizeAndPosition(this.hvp),
          widgets: this._getCurrentWidgets(),
          netitor: this._getNetitorData(netitor),
          netnet: this._getNetNetPos()
        }
        this.hvp.data[type].push(frame)
        this.hvp.data[type].sort((a, b) => a.timecode - b.timecode)
        return { frame, add: true }
      } else { // update keyframe
        frame.name = name ?? ''
        frame.video = this._getSizeAndPosition(this.hvp)
        frame.widgets = this._getCurrentWidgets()
        frame.netitor = this._getNetitorData(netitor)
        frame.netnet = this._getNetNetPos()
      }
    } else if (type === 'keylogs') {
      // TODO
    }
    return { frame }
  }

  _getData () {
    const keyframes = this.hvp.data.keyframes
    const keylogs = this.hvp.data.keylogs
    const video = this.hvp.video.src
    const widgets = this.hvp.data.widgets
    return { keyframes, keylogs, widgets, video }
  }

  _addSpotlight (ls) {
    if ((Array.isArray(ls) && ls.length <= 0) || !ls) {
      NNE.spotlight(null)
    } else {
      const lines = []
      ls.forEach(l => {
        if (l.includes('-')) {
          const [start, end] = l.split('-').map(Number)
          for (let i = start; i <= end; i++) {
            lines.push(i)
          }
        } else lines.push(Number(l))
      })
      NNE.spotlight(lines)
    }
  }

  _openWidget (widget, open) {
    const { key, title, innerHTML } = widget
    if (WIDGETS[key] && open) WIDGETS[key].open()
    else if (WIDGETS[key] && !open) WIDGETS[key].close()
    else if (open) {
      WIDGETS.create({ key, title, innerHTML })
      WIDGETS[key].open()
    }
  }

  // update widget in HVP
  _updateWidget (widget, remove) {
    const { key, title, innerHTML, type } = widget
    if (remove) { // remove widget
      delete this.hvp.data.widgets[key]
      WIDGETS.delete(key)
    } else if (widget.oldKey) { // save over existent widget
      this.hvp.data.widgets[widget.oldKey] = { key, title, innerHTML, type }
    } else { // create new widget
      this.hvp.data.widgets[key] = { key, title, innerHTML, type }
    }
  }

  // updates widgets state in netnet (WIDGETS)
  _updateWidgetState (widget) {
    const { key, title, innerHTML } = widget
    const k = widget.oldKey || key
    if (widget.oldKey && widget.oldKey !== key && WIDGETS[k]) {
      // remove old widget and open new widget if key changed
      WIDGETS.delete(k)
      WIDGETS.create({ key, title, innerHTML })
      WIDGETS[key].open()
    } else if (WIDGETS[k]) {
      WIDGETS[k].key = key
      WIDGETS[k].title = title
      WIDGETS[k].innerHTML = innerHTML
    } else {
      WIDGETS.create({ key, title, innerHTML })
      WIDGETS[key].open()
    }
  }

  // ............................ helpers ......................................

  _openPopup (type, payload) {
    const url = 'widgets/tutorial-maker/popups/index.html'
    this.popup = window.open(url, 'tut-mkr-widget', 'width=485,height=167')
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
    // NOTE: all <button> eles automatically try to call a convo
    // see "msg('tut-mkr-explain', btn.getAttribute('name'))" in main.js
    // so we want to avoid calling new Convo unless it actually exists
    const exists = this.convos?.find(o => o.id === id)
    if (!exists) return

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

  _getNetitorData (data) {
    const s = NNE.cm.getScrollInfo()
    if (data?.code) {
      return {
        code: NNE.code,
        scrollTo: data.scrollTo ? { x: s.left, y: s.top } : null,
        spotlight: data.spotlight ?? [],
        layout: NNW.layout
      }
    } else {
      return { code: null, scrollTo: null, spotlight: [], layout: NNW.layout }
    }
  }

  _getNetNetPos () {
    if (['welcome', 'separate-window'].includes(NNW.layout)) {
      return this._getSizeAndPosition(NNW)
    } else return {}
  }
}

window.TutorialMaker = TutorialMaker
