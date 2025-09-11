/* global Widget, WIDGETS, NNE, NNW, Convo, utils, nn */
class HyperVideoPlayer extends Widget {
  constructor (opts) {
    super(opts)
    opts = opts || {}
    this.title = opts.title || 'Hyper-Video Player'
    this.key = 'hyper-video-player'
    this.listed = false

    this.data = null
    this.making = false // set to true when using Tutorial Maker

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this._boundEditWatcher = this._editWatcher.bind(this)
    NNE.cm.on('keydown', this._boundEditWatcher)

    this.on('open', () => {
      setTimeout(() => {
        if (this.controls) this.controls.css({ opacity: 0 })
      }, 250)
    })

    this.on('close', () => {
      if (!this.video.paused) this.pause()
      // TODO: will need to check if "pop up is opened" not maker widget itself
      if (WIDGETS['tutorial-maker']?.opened) {
        // TODO: call some logic for quitting the tutorial marker
      } else if (this.data) {
        this.quit()
        NNE.cm.off('keydown', this._boundEditWatcher)
      }
      NNE.readOnly = false
    })

    const pause = () => { if (this.video && !this.video.paused) this.pause() }

    WIDGETS['coding-menu'].on('open', () => pause())
    NNW.menu.search.on('open', () => pause())
    // if learning-guide is opened, also pauses (handled in learning-guide)

    this._createHTML(opts)
  }

  // .....

  get volume () { return this.video.volume }
  set volume (v) { this.video.volume = v }

  get src () { return this.video.src }
  set src (v) { this.video.src = v }

  get duration () { return this.video.duration }
  set duration (v) { console.error('HyperVideoPlayer: duration is read-only') }

  get currentTime () { return this.video.currentTime }
  set currentTime (v) { console.error('HyperVideoPlayer: use seek() to set time') }

  load (name, time) {
    nn.get('load-curtain').show('tutorial.html')
    utils.get(`tutorials/${name}/tutorial.json`, (json) => {
      this.data = json
      this._startTime = time || 0

      const openProj = WIDGETS['project-files']?.projectData.name
      if (openProj) {
        const unSaved = WIDGETS['project-files'].changes.length > 0
        if (unSaved) window.convo = new Convo(this.convos, 'working-on-unsaved-project')
        else window.convo = new Convo(this.convos, 'working-on-project')
        setTimeout(() => nn.get('load-curtain').hide(), 250)
        return
      }

      if (NNE.code !== utils.starterCode() && NNE.code.length > 0) {
        if (!this.convos) this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'clear-code')
        setTimeout(() => nn.get('load-curtain').hide(), 250)
        return
      }

      this._loadTutorial(name, time)
    })
  }

  quit () {
    this.data = null
    utils.updateURL()
    utils.setCustomRenderer(null)

    WIDGETS.list().filter(w => w.opened).forEach(w => w.close())

    if (WIDGETS['student-session'].getData('auto-update') === 'false') {
      NNE.autoUpdate = false
    }

    nn.get('load-curtain').hide()
    if (window.convo.id === 'introducing-tutorial') window.convo.hide()
  }

  // ----------------------------- video controls ------------------------------

  updateVideo (name, folder) {
    const tutRoot = this.making ? 'TUTORIAL_MAKER' : 'tutorials'
    const path = folder ? `${tutRoot}/${folder}` : 'videos'

    const updateMetadata = () => {
      this._videoMetaDataListener = true
      if (this.data?.metadata) {
        this.data.metadata.duration = this.video.duration
      } else setTimeout(() => updateMetadata(), 100)
    }
    if (path !== 'videos' && !this._videoMetaDataListener) {
      this.video.on('loadeddata', updateMetadata)
    }

    if (this.video.canPlayType('video/mp4') !== '') {
      this.video.setAttribute('src', `${path}/${name}.mp4`)
    } else if (this.video.canPlayType('video/webm') !== '') {
      this.video.setAttribute('src', `${path}/${name}.webm`)
    } else if (this.video.canPlayType('video/ogg') !== '') {
      this.video.setAttribute('src', `${path}/${name}.ogv`)
    } else {
      console.error('HyperVideoPlayer: this browser can\'t play videos')
    }
  }

  removeVideo () {
    this.video.removeAttribute('src')
    this.video.load()
  }

  play () {
    if (WIDGETS['student-session'].getData('auto-update') === 'false') {
      NNE.autoUpdate = true
    }

    const play = (e) => {
      if (e) e.hide()
      this.$('.hvp-pause-screen').style.display = 'none'
      this.$('.hvp-toggle > span').classList.remove('play')
      this.$('.hvp-toggle > span').classList.add('pause')
      this.video.play()
      if (!this.making) NNE.readOnly = true
    }

    // if we're in the middle of a tutorial
    if (!this.making && this.currentTime > 0) {
      if (typeof this._tempCode === 'string' && this._tempCode !== NNE.code) {
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'careful-will-loose-code')
      } else play()
    } else play()

    // if it's the first time we press play hide netnet's bubble
    if (window.convo && window.convo.id === 'introducing-tutorial') {
      window.convo.hide()
    }
  }

  pause () {
    this._updatePauseClock()

    if (WIDGETS['student-session'].getData('auto-update') === 'false') {
      NNE.autoUpdate = false
    }

    this.$('.hvp-pause-screen').style.display = 'block'
    this.$('.hvp-toggle > span').classList.remove('pause')
    this.$('.hvp-toggle > span').classList.add('play')
    this.video.pause()

    this._tempCode = NNE.code
    setTimeout(() => { this._tempCode = NNE.code }, NNE.updateDelay)

    NNE.readOnly = false
    this._generatePauseScreen()
  }

  toggle () {
    if (this.video.paused) this.play()
    else this.pause()
  }

  seek (time) {
    const p = this.video.paused
    if (!p) this.pause()
    this.video.currentTime = Number(time)
    this._updateProgressBar()
    this._resetKeyframes()
    this._tempCode = NNE.code
    this.play()
    if (p) this.pause()
  }

  skip (time) {
    const newTime = this.video.currentTime + Number(time)
    this.seek(newTime)
  }

  // ----------------------------- public keyframe/log methods -----------------

  getKeyframeByTC (timecode) { // TODO: move this to Tutorial Maker (not needed here)
    return this.data.keyframes.find(kf => kf.timecode === timecode)
  }

  getMostRecentKeyframe (time) {
    const ct = time || this.currentTime
    return this.data.keyframes
      .filter(kf => ct >= kf.timecode)
      .sort((a, b) => a.timecode - b.timecode).reverse()[0]
  }

  getMostRecentKeylog (time) {
    const ct = time || this.currentTime
    return this.data.keylogs
      .filter(kl => ct >= kl.timecode)
      .sort((a, b) => a.timecode - b.timecode).reverse()[0]
  }

  renderKeyframe () {
    const kf = this.getMostRecentKeyframe()
    const kl = this.getMostRecentKeylog()
    this._tt = 500 // transition time
    this._do = 100 // delay open for first widget
    this._da = 200 // amount to add to delay for subsequant widget

    if (kl && !kl.ran) {
      if (kl.code !== NNE.code) {
        this._updateCode(kl.code) // TODO check if working correctly
        this._updateScrollBar() // TODO check if working correctly
      }
    }

    if (kf && !kf.ran) { // render it if it hasn't yet
      // 1.
      // POSITION HYPER VIDEO PLAYER
      if (this._vidPositionNeedsUpdate(kf.video)) {
        const obj = JSON.parse(JSON.stringify(kf.video))
        this.update(obj, this._tt)
      }

      // 2.
      // UPDATE WIDGETS (OPEN + CLOSE + POSITION)
      const opened = kf.widgets.map(obj => obj.key) // keep these opened
      opened.push('hyper-video-player')
      kf.widgets.forEach(obj => {
        obj = JSON.parse(JSON.stringify(obj))
        const key = obj.key
        delete obj.key // delete so wig.update doesn't bugout w/unexpected props
        const wig = WIDGETS[key]
        if (!wig) WIDGETS.open(key, wig => wig.update(obj, this._tt))
        else {
          wig.update(obj)
          if (!wig.opened) {
            setTimeout(() => {
              wig.update(obj)
              setTimeout(() => wig.open(), this._do + 50)
            }, this._do)
            this._do += this._da
          }
        }
      })
      // close any widgets that shouldn't be open
      WIDGETS.list().filter(w => w.opened)
        .filter(w => !opened.includes(w.key))
        .forEach(w => w.close())

      // 3.
      // UPDATE NETITOR
      // ...code
      const c = kf.netitor.code === 'DEFAULT'
        ? utils.starterCode() : kf.netitor.code
      if (c && c !== NNE.code) {
        this._updateCode(c) // TODO check if working correctly
        this._updateScrollBar(kf.scrollTo) // TODO check if working correctly
      }
      // ...layout
      const prevLayout = NNW.layout
      const newLayout = kf.netitor.layout
      const posLayouts = ['welcome', 'separate-window']
      if (posLayouts.includes(newLayout)) {
        if (newLayout && newLayout !== prevLayout) {
          NNW.layout = newLayout
          utils.afterLayoutTransition(() => NNW.update(kf.netnet, this._tt))
        } else NNW.update(kf.netnet, this._tt)
      } else if (newLayout && newLayout !== prevLayout) {
        NNW.layout = newLayout
        // correct for scrubbing (if delayed call to update from prev frame)
        utils.afterLayoutTransition(() => { NNW.layout = newLayout })
      }
      this._updateScrollBar() // TODO check if working correctly
      // ...spotlight
      const lines = NNE.code.split('\n')
      const hasCode = lines.length > 1 || lines[0] !== ''
      if (newLayout !== 'welcome' && hasCode) {
        NNE.spotlight(kf.netitor.spotlight)
      }

      // 4.
      // ... COMPLETED RENDER ...
      kf.ran = true
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods

  _loadTutorial () {
    const name = this.data.id
    const time = this._startTime

    this.title = this.data.metadata.title

    utils.cancelAllNetitorUses('hyper-video-player')

    if (!this.making) {
      utils.updateURL(`?tutorial=${this.data.id}`)
      utils.setCustomRenderer(`tutorials/${name}/`)
    }

    this._instantiateMissingWidgets()

    this._resetKeyframes(true)

    if (this.data.metadata.jsfile) {
      const file = this.making
        ? `TUTORIAL_MAKER/${name}/init.js`
        : `tutorials/${name}/init.js`
      utils.loadFile(file, () => window.TUTORIAL.init())
    }

    this.video.oncanplay = () => {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'introducing-tutorial')
      this.renderKeyframe()
      this.open()

      setTimeout(() => {
        if (time) this.seek(time)
        this.video.oncanplay = null
        nn.get('load-curtain').hide()
      }, utils.getVal('--layout-transition-time'))
    }

    this.updateVideo(this.data.id, this.data.id)
  }

  _instantiateMissingWidgets () {
    for (const key in this.data.widgets) {
      if (!WIDGETS.instantiated.includes(key)) {
        WIDGETS.create(this.data.widgets[key])
      }
    }
  }

  // ................................................ keyframe helpers .........

  _resetKeyframes (skipRender) {
    this.data.keyframes.forEach(kf => { kf.ran = false })
    this.data.keylogs.forEach(kl => { kl.ran = false })
    if (!skipRender) this.renderKeyframe()
  }

  _updateCode (code) {
    const top = NNE.cm.getScrollInfo().top
    NNE.code = code // TODO: maybe type it out? using utils.autoType
    const s = NNE.cm.getScrollInfo()
    if (s.top !== top) NNE.cm.scrollTo(s.left, top)
  }

  _updateScrollBar (obj) {
    const update = this._scrollNeedsUpdate(obj)
    if (typeof update.y !== 'undefined') {
      NNE.cm.scrollTo(update.x, update.y)
    } else if (typeof update === 'number') {
      const n = update + 1 > NNE.cm.lineCount() ? update : update + 1
      utils.scrollToLines([n])
    }
  }

  _scrollNeedsUpdate (o) {
    let update = false
    if (o) {
      const s = NNE.cm.getScrollInfo()
      update = (o.x && o.x !== s.left) || (o.y && o.y !== s.top) ? o : false
    } else {
      const kf = this.getMostRecentKeyframe()
      const idx = this.data.keyframes[kf]
      if (idx > 0) {
        const pf = this.data.keyframes[idx - 1] // previous keyframe
        if (kf.netitor.code && pf.netitor.code) {
          const codeArrA = pf.netitor.code.split('\n')
          const codeArrB = kf.netitor.code.split('\n')
          const diffs = codeArrA.filter(c => !codeArrB.includes(c))
          const line = codeArrA.indexOf(diffs[0])
          if (line >= 0) { update = line }
        }
      }
    }
    return update
  }

  _vidPositionNeedsUpdate (video) {
    let update = false
    if (video.width && video.width !== this.width) { update = true }
    if (video.height && video.height !== this.height) { update = true }
    if (video.top && video.top !== this.top) { update = true }
    if (video.bottom && video.bottom !== this.bottom) { update = true }
    if (video.left && video.left !== this.left) { update = true }
    if (video.right && video.right !== this.right) { update = true }
    if (video.zIndex && video.zIndex !== this.zIndex) { update = true }
    return update
  }

  _editWatcher () {
    if (this?.opened && NNE.readOnly) {
      window.convo = new Convo(this.convos, 'tutorial-pause-to-edit')
    }
  }

  // ................................................ HVP HTML .................

  _createHTML (opts) {
    this.ele.querySelector('.widget__inner-html').style.padding = '14px 0 0'

    this.video = nn.create('video')
      .set('preload', 'auto')
      .css({ display: 'block', width: '100%', borderRadius: 10 })
      .on('loadeddata', () => {
        this.keepInFrame()
        this._generatePauseScreen()
      })

    if (typeof opts.video === 'string') this.updateVideo(opts.video)
    else this.updateVideo('screen-saver')

    const pauseScreen = nn.create('div')
      .set('class', 'hvp-pause-screen')
      .content('<span>PAUSED</span><span>00:00:00</span>')

    this.controls = nn.create('div').set('class', 'hvp-controls')
    this.controls.innerHTML = `
      <div class="hvp-toggle">
        <span class="pause"></span>
      </div>
      <progress class="progress" min="0" max="100" value="0">0%</progress>
      <div class="hvp-vol-wrap">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="500" height="500" viewBox="0 0 75 75">
          <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" style="stroke:white;stroke-width:5;stroke-linejoin:round;fill:white;transition:all .5s ease;"/>
          <path class="sound" d="M48,27.6a19.5,19.5 0 0 1 0,21.4" style="fill:none;stroke:white;stroke-width:5;stroke-linecap:round;transition:stroke .5s ease;"/>
          <path class="sound" d="M55.1,20.5a30,30 0 0 1 0,35.6" style="fill:none;stroke:white;stroke-width:5;stroke-linecap:round;transition:stroke .5s ease;"/>
        </svg>
        <input type="range" min="0" max="1" step="0.1" value="1" class="hvp-vol">
      </div>`

    const buffer = nn.create('div').set('class', 'hvp-buffer')
    buffer.innerHTML = `
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
   viewBox="0 0 58.7 58.7" style="enable-background:new 0 0 58.7 58.7;" xml:space="preserve">
        <style type="text/css">
          .st0{stroke-miterlimit:10;}
        </style>
        <path class="st0 loading-bar" d="M38.9,21.6l-3.6-3c-0.5-0.4-0.6-1.1-0.1-1.7l6.1-7.2c0.4-0.5,1.2-0.6,1.7-0.2l3.6,3c0.5,0.4,0.6,1.1,0.1,1.7
  l-6.1,7.2C40.1,21.9,39.4,22,38.9,21.6z"/>
        <path class="st0 loading-bar" d="M41.7,29.5L40.9,25c-0.1-0.6,0.3-1.2,1-1.3l9.3-1.6c0.6-0.1,1.3,0.3,1.4,0.9l0.8,4.6c0.1,0.6-0.3,1.2-1,1.3
          L43,30.5C42.4,30.6,41.8,30.2,41.7,29.5z"/>
        <path class="st0 loading-bar" d="M38.7,37.4l2.3-4c0.3-0.6,1-0.8,1.6-0.4l8.2,4.7c0.5,0.3,0.8,1,0.4,1.6l-2.3,4c-0.3,0.6-1,0.8-1.6,0.4L39.1,39
          C38.5,38.7,38.3,38,38.7,37.4z"/>
        <path class="st0 loading-bar" d="M31.3,41.5l4.4-1.6c0.6-0.2,1.3,0.1,1.5,0.7l3.2,8.9c0.2,0.6-0.1,1.3-0.7,1.5l-4.4,1.6
          c-0.6,0.2-1.3-0.1-1.5-0.7L30.6,43C30.4,42.4,30.7,41.7,31.3,41.5z"/>
        <path class="st0 loading-bar" d="M23,39.9l4.4,1.6c0.6,0.2,0.9,0.9,0.7,1.5l-3.2,8.9c-0.2,0.6-0.9,0.9-1.5,0.7L19,51c-0.6-0.2-0.9-0.9-0.7-1.5
          l3.2-8.9C21.8,40,22.4,39.7,23,39.9z"/>
        <path class="st0 loading-bar" d="M17.7,33.4l2.3,4c0.3,0.6,0.2,1.3-0.4,1.6l-8.2,4.7c-0.5,0.3-1.3,0.1-1.6-0.4l-2.3-4c-0.3-0.6-0.2-1.3,0.4-1.6
          l8.2-4.7C16.7,32.6,17.4,32.8,17.7,33.4z"/>
        <path class="st0 loading-bar" d="M17.8,25L17,29.5c-0.1,0.6-0.7,1.1-1.4,0.9l-9.3-1.6c-0.6-0.1-1.1-0.7-1-1.3l0.8-4.6c0.1-0.6,0.7-1.1,1.4-0.9
          l9.3,1.6C17.5,23.7,17.9,24.3,17.8,25z"/>
        <path class="st0 loading-bar" d="M23.3,18.6l-3.6,3c-0.5,0.4-1.2,0.4-1.7-0.2l-6.1-7.2c-0.4-0.5-0.4-1.2,0.1-1.7l3.6-3c0.5-0.4,1.2-0.4,1.7,0.2
          l6.1,7.2C23.9,17.5,23.8,18.2,23.3,18.6z"/>
        <path class="st0 loading-bar" d="M31.7,17.2H27c-0.6,0-1.2-0.5-1.2-1.2V6.6c0-0.6,0.5-1.2,1.2-1.2h4.6c0.6,0,1.2,0.5,1.2,1.2v9.4
  C32.8,16.7,32.3,17.2,31.7,17.2z"/>
      </svg>
    `

    const wrap = nn.create('div').set('class', 'hvp-wrap')
    wrap.appendChild(pauseScreen)
    wrap.appendChild(buffer)
    this._generatePauseScreen()
    wrap.appendChild(this.video)
    wrap.appendChild(this.controls)
    this.innerHTML = wrap

    this._setupListeners()
  }

  _setupListeners () {
    this.$('.hvp-toggle').addEventListener('click', () => this.toggle())

    this.$('.hvp-vol').addEventListener('change', () => {
      this.video.volume = this.$('.hvp-vol').value
      if (this.video.volume <= 0.1) {
        this.$('.hvp-vol-wrap').classList.remove('half')
        this.$('.hvp-vol-wrap').classList.add('zero')
      } else if (this.video.volume <= 0.5) {
        this.$('.hvp-vol-wrap').classList.remove('zero')
        this.$('.hvp-vol-wrap').classList.add('half')
      } else {
        this.$('.hvp-vol-wrap').classList.remove('half')
        this.$('.hvp-vol-wrap').classList.remove('zero')
      }
    })

    this.ele.addEventListener('mouseover', () => {
      this.$('.hvp-controls').style.opacity = 1
    })
    this.ele.addEventListener('mouseout', () => {
      this.$('.hvp-controls').style.opacity = 0
    })

    this.video.addEventListener('ended', () => {
      this._resetKeyframes(true)
      this.pause()
    })
    this.video.addEventListener('timeupdate', () => {
      this._updateProgressBar()
      this.renderKeyframe()
      this.$('.hvp-buffer').style.display = 'none'
    })

    this.video.addEventListener('loadedmetadata', () => {
      this._updateProgressBar()
      this._updatePauseClock()
    })

    this.video.addEventListener('waiting', () => {
      this.$('.hvp-buffer').style.display = 'block'
    })

    this.$('.progress').addEventListener('click', (e) => {
      const margin = 30
      const off = this.ele.offsetLeft + this.$('.progress').offsetLeft + margin
      const pos = (e.clientX - off) / this.$('.progress').offsetWidth
      this.video.currentTime = pos * this.duration
      this.pause()
      this._updateProgressBar()
      this._resetKeyframes()
      if (window.convo.id === 'introducing-tutorial') {
        utils.afterLayoutTransition(() => window.convo.hide())
      }
    })

    this.$('.hvp-toggle > span').classList.remove('pause')
    this.$('.hvp-toggle > span').classList.add('play')
  }

  _updateProgressBar () {
    const ct = this.currentTime
    const percentage = Math.round((100 / this.duration) * ct)
    if (typeof percentage !== 'number' || isNaN(percentage)) return
    this.$('.progress').value = percentage
    this.$('.progress').innerHTML = percentage + '%'
  }

  _updatePauseClock () {
    const c = this.$('.hvp-pause-screen > span:nth-child(2)')
    const h = '00'
    let m = Math.floor(this.currentTime / 60)
    let s = Math.round(this.currentTime % 60)
    if (m < 10) m = '0' + m
    if (s < 10) s = '0' + s
    const dur = Math.round((this.duration / 60) * 10) / 10
    c.textContent = `${h}:${m}:${s} / ${dur} mins`
    return this.currentTime
  }

  // ................................... glitchy pause screen ..................
  _glitchIt (base64) {
    const jpg = 'data:image/jpeg;base64,'
    base64 = base64.substr(jpg.length)
    const binaryString = window.atob(base64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    // loop through JPEG Data to find huffman table marker
    for (let i = 0; i < bytes.length; i++) {
      if (bytes[i].toString(16) === 'ff' && bytes[i + 1].toString(16) === 'c4') {
        const idx = i + 24 // few bytes into the huffman codes
        const huf = (bytes[i + 21] === 0) ? 'DC' : 'AC'
        const len = (huf === 'DC') ? 16 : 255
        let ran = Math.floor(this.random(0, len))
        if (ran === bytes[idx]) ran = Math.floor(this.random(0, len))
        if (ran === bytes[idx]) ran = Math.floor(this.random(0, len))
        bytes[idx] = ran
        break
      }
    }
    return bytes
  }

  _Uint8ToString (u8a) {
    // via: https://stackoverflow.com/a/12713326/1104148
    const CHUNK_SZ = 0x8000
    const c = []
    for (let i = 0; i < u8a.length; i += CHUNK_SZ) {
      c.push(String.fromCharCode.apply(null, u8a.subarray(i, i + CHUNK_SZ)))
    }
    return c.join('')
  }

  _generatePauseScreen (type) {
    // while most values glitch on Firefox/Mac,
    // only these values seem to create glitches on Chrome/Mac
    const gvals = [7, 19, 35, 45, 46, 79, 86, 87, 90, 96]
    this.updateSeed(nn.random(gvals))

    if (!this.canvas) this.canvas = nn.create('canvas')
    this.canvas.width = this.video.offsetWidth
    this.canvas.height = this.video.offsetHeight
    if (!this.ctx) this.ctx = this.canvas.getContext('2d')
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)

    const data = this.canvas.toDataURL('image/jpeg')
    const bytes = this._glitchIt(data)
    const b64 = window.btoa(this._Uint8ToString(bytes))
    let url = `data:image/jpeg;base64,${b64}`
    const img = new window.Image()
    img.onload = () => {
      this.ctx.globalCompositeOperation = 'saturation'
      this.ctx.drawImage(img, 0, 0)
      this.ctx.globalCompositeOperation = 'lighten'
      this.ctx.drawImage(img, 0, 0)
      url = this.canvas.toDataURL('image/jpeg')
      this.$('.hvp-pause-screen').style.backgroundImage = `url(${url})`
    }
    img.src = url
  }

  // ........................... seeded random used for glitchy pause above ....
  // mulberry32 generator factory
  _mulberry32 (a) {
    return () => {
      a |= 0
      a = (a + 0x6D2B79F5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  // exactly the same API as nn: random(), random(max), random(min, max)
  random (min, max) {
    const r = this._rand()
    if (min === undefined) {
      return r
    } else if (max === undefined) {
      max = min
      min = 0
    }
    return r * (max - min) + min
  }

  updateSeed (seed) {
    this._seed = seed
    this._rand = this._mulberry32(this._seed)
  }
}

window.HyperVideoPlayer = HyperVideoPlayer
