/* global Widget, WIDGETS, NNE, NNW, Convo, utils */
class HyperVideoPlayer extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'hyper-video-player'
    this.listed = false
    this.duration = null

    this.keyframes = {}
    this.timecodes = []

    this.on('close', () => {
      if (!this.video.paused) this.pause()
      const tg = WIDGETS['tutorials-guide']
      const tm = WIDGETS['tutorial-maker']
      if (tm && tm.opened) tm.close()
      else if (tg && tg.metadata) {
        tg.quit(); tg.open()
        // tg.update({ bottom: 20, right: 20 }, 500)
        if (this.logger) this.logger.reset()
      }
      NNE.cm.setOption('readOnly', false)
      if (window.convo.id === 'introducing-tutorial') window.convo.hide()
    })

    opts = opts || {}
    this.title = opts.title || 'HyperVideo Player'
    this._createHTML(opts)
  }

  // .....

  get volume () { return this.video.volume }
  set volume (v) { this.video.volume = v }

  get src () { return this.video.src }
  set src (v) { this.video.src = v }

  updateVideo (name, folder) {
    const path = folder ? `tutorials/${folder}` : 'videos'
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
    const tg = WIDGETS['tutorials-guide']
    const play = (e) => {
      if (e) e.hide()
      this.$('.hvp-pause-screen').style.display = 'none'
      this.$('.hvp-toggle > span').classList.remove('play')
      this.$('.hvp-toggle > span').classList.add('pause')
      this.video.play()
      const kf = this._mostRecentKeyframe()
      const b = kf ? this.keyframes[kf.timecode].editable : false
      this._editable(b)
    }

    const mid = tg && tg.metadata && this.video.currentTime > 0
    if (mid) { // if in the middle of a tutorial
      // const frame = this._mostRecentKeyframe().frame
      if (typeof this._tempCode === 'string' && this._tempCode !== NNE.code) {
        window.convo = new Convo({
          id: 'careful-will-loose-code',
          content: 'It looks like you edited some of the code in my editor, which is great! I\'m glad you\'re experimenting, but don\'t forget that during tutorials your edits will be lost once you continue playing. I can download the current sketch for you if you want to save a copy.',
          options: {
            'that\'s ok, let\'s continue': (e) => {
              if (this._tempCode !== NNE.code) NNE.code = this._tempCode
              play(e)
            },
            'yes, please download': (e) => {
              e.hide()
              WIDGETS['functions-menu'].downloadCode()
              if (this._tempCode !== NNE.code) NNE.code = this._tempCode
            }
          }
        })
      } else play()
    } else play()
    // if it's the first time we press play hide netnet's bubble
    if (window.convo && window.convo.id === 'introducing-tutorial') {
      window.convo.hide()
    }
  }

  pause () {
    this._updatePauseClock()
    this.$('.hvp-pause-screen').style.display = 'block'
    this.$('.hvp-toggle > span').classList.remove('pause')
    this.$('.hvp-toggle > span').classList.add('play')
    this.video.pause()

    this._tempCode = NNE.code
    setTimeout(() => {
      this._tempCode = NNE.code
    }, NNE.updateDelay)

    this._editable(true)
    this._generatePauseScreen()
  }

  toggle () {
    if (this.video.paused) this.play()
    else this.pause()
  }

  seek (time) {
    this.video.currentTime = Number(time)
  }

  // .....  .....   .....   .....  .....  .....   .....   .....  .....
  // ..... RENDER KEYFRAME  .....  ..... RENDER KEYFRAME  .....  .....
  // .....  .....   .....   .....  .....  .....   .....   .....  .....

  loadKeyframes (frames) {
    this.keyframes = frames
    this.timecodes = Object.keys(frames).sort((a, b) => a - b)
    for (const tc in this.keyframes) this.keyframes[tc].ran = false
    // load keylogger data && add them to keyframes
    if (!WIDGETS.loaded.includes('NetitorLogger.js')) {
      WIDGETS.load('NetitorLogger.js', (logger) => {
        this.logger = logger
        this._loadKeyLoggerData()
      })
    } else this._loadKeyLoggerData()
  }

  renderKeyframe () {
    const mrkf = this._mostRecentKeyframe()
    const kf = mrkf ? mrkf.frame : null
    if (kf && !kf.ran) { // render it if it hasn't yet
      // POSITOIN HYPER VIDEO PLAYER
      if (this._videoNeedsUpdate(kf.video)) {
        const obj = JSON.parse(JSON.stringify(kf.video))
        const t = obj.transition || 500
        if (obj.transition) delete obj.transition
        this.update(obj, t)
      }
      // POSITION WIDGETS
      const opened = kf.widgets.map(obj => obj.key) // keep these opened
      opened.push('hyper-video-player')
      if (WIDGETS['tutorial-maker']) opened.push('tutorial-maker')
      // open missing widgets ++ position widgets
      kf.widgets.forEach(obj => {
        obj = JSON.parse(JSON.stringify(obj))
        const key = obj.key
        const t = obj.transition || 500
        // delete these so wig.update doesn't bugout w/unexpected props
        delete obj.key
        if (obj.transition) delete obj.transition
        const wig = WIDGETS[key]
        if (!wig) WIDGETS.open(key, null, (wig) => wig.update(obj, t))
        else {
          if (!wig.opened) { wig.open(); wig.recenter() }
          wig.update(obj, t)
        }
      })
      // close any widgets that shouldn't be open
      WIDGETS.list().filter(w => w.opened)
        .filter(w => !opened.includes(w.key))
        .forEach(w => w.close())

      if (kf.code && kf.code !== NNE.code) {
        NNE.code = kf.code
        if (this._scrollNeedsUpdate(kf.scrollTo)) this._updateScrollBar()
      }

      if (!this.video.paused) this._editable(kf.editable)

      // UPDATE NETNET'S LAYOUT
      const prevLayout = NNW.layout
      const posLayouts = ['welcome', 'separate-window']
      if (posLayouts.includes(kf.layout)) {
        const t = kf.video.transition || 500
        if (kf.layout && kf.layout !== prevLayout) {
          NNW.layout = kf.layout
          utils.afterLayoutTransition(() => NNW.update(kf.netnet, t))
        } else NNW.update(kf.netnet, t)
      } else if (kf.layout && kf.layout !== prevLayout) {
        NNW.layout = kf.layout
      }
      this._updateScrollBar()

      // UPDATE NETNET'S SPOT/HIGHLIGHT
      const lines = NNE.code.split('\n')
      const hasCode = lines.length > 1 || lines[0] !== ''
      if (kf.layout !== 'welcome' && hasCode) {
        NNE.highlight(null); NNE.highlight(kf.highlight)
        NNE.spotlight(kf.spotlight)
      }
      // ... COMPLETED RENDER ...
      kf.ran = true
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods

  _createHTML (opts) {
    this.video = document.createElement('video')
    this.video.setAttribute('preload', 'auto')
    this.video.style.display = 'block'
    this.video.style.width = '100%'
    this.video.addEventListener('loadeddata', () => this.keepInFrame())
    const name = (typeof opts.video === 'string') ? opts.video : 'screen-saver'
    this.updateVideo(name)

    const pauseScreen = document.createElement('div')
    pauseScreen.className = 'hvp-pause-screen'
    pauseScreen.innerHTML = `
      <span>PAUSED</span>
      <span>PAUSED</span>
      <span>PAUSED</span>
      <span>00:00:00</span>
      <span>00:00:00</span>
      <span>00:00:00</span>`

    this.controls = document.createElement('div')
    this.controls.className = 'hvp-controls'
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

    const wrap = document.createElement('div')
    wrap.className = 'hvp-wrap'
    wrap.appendChild(pauseScreen)
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

    this.on('open', () => {
      setTimeout(() => { this.$('.hvp-controls').style.opacity = 0 }, 250)
    })
    this.on('close', () => this.pause())

    this.video.addEventListener('ended', () => {
      // this.video.currentTime = 0
      this._resetKeyframeStatus(true)
      this.pause()
    })
    this.video.addEventListener('timeupdate', () => {
      this._updateProgressBar()
      this.renderKeyframe()
    })

    this.video.addEventListener('loadedmetadata', () => {
      this.duration = this.video.duration
    })

    this.$('.progress').addEventListener('click', (e) => {
      const margin = 30
      const off = this.ele.offsetLeft + this.$('.progress').offsetLeft + margin
      const pos = (e.clientX - off) / this.$('.progress').offsetWidth
      this.video.currentTime = pos * this.duration
      this.pause()
      this._updateProgressBar()
      this._resetKeyframeStatus()
      if (window.convo.id === 'introducing-tutorial') {
        utils.afterLayoutTransition(() => window.convo.hide())
      }
    })

    this.$('.hvp-toggle > span').classList.remove('pause')
    this.$('.hvp-toggle > span').classList.add('play')
  }

  _updateProgressBar () {
    const ct = this.video.currentTime
    const percentage = Math.round((100 / this.duration) * ct)
    if (typeof percentage !== 'number' || isNaN(percentage)) return
    this.$('.progress').value = percentage
    this.$('.progress').innerHTML = percentage + '%'
  }

  _updatePauseClock () {
    const c1 = this.$('.hvp-pause-screen > span:nth-child(4)')
    const c2 = this.$('.hvp-pause-screen > span:nth-child(5)')
    const c3 = this.$('.hvp-pause-screen > span:nth-child(6)')
    const t = this.video.currentTime
    const h = '00'
    let m = Math.floor(t / 60)
    let s = Math.round(t % 60)
    if (m < 10) m = '0' + m
    if (s < 10) s = '0' + s
    const dur = Math.round((this.duration / 60) * 10) / 10
    c1.textContent = `${h}:${m}:${s} / ${dur} mins`
    c2.textContent = `${h}:${m}:${s} / ${dur} mins`
    c3.textContent = `${h}:${m}:${s} / ${dur} mins`
    return t
  }

  _updateScrollBar () {
    const kf = this._mostRecentKeyframe().frame
    if (kf.scrollTo) {
      const { x, y } = kf.scrollTo
      if (x || y) NNE.cm.scrollTo(x, y)
    }
  }

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
        let ran = Math.floor(Math.random() * len)
        if (ran === bytes[idx]) ran = Math.floor(Math.random() * len)
        if (ran === bytes[idx]) ran = Math.floor(Math.random() * len)
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
    if (!this.canvas) this.canvas = document.createElement('canvas')
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

  _editable (bool) {
    const tg = WIDGETS['tutorials-guide']
    if (tg && tg.metadata) NNE.cm.setOption('readOnly', !bool)
  }

  _videoNeedsUpdate (video) {
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

  _scrollNeedsUpdate (obj) {
    let update = false
    if (!obj) return update
    const s = NNE.cm.getScrollInfo()
    if (obj.x && obj.x !== s.left) { update = true }
    if (obj.y && obj.y !== s.top) { update = true }
    return update
  }

  _mostRecentKeyframe (time) {
    const ct = time || this.video.currentTime
    const tc = this.timecodes.filter(tc => ct >= tc)
      .sort((a, b) => a - b).reverse()[0]
    const kf = this.keyframes[tc]
    if (kf) {
      return { frame: kf, timecode: tc, index: this.timecodes.indexOf(ct) }
    } else return null
  }

  _mostRecentKeylog () {
    const keyframe = this._mostRecentKeyframe() // last keyframe
    const priorKeyframe = this.timecodes // first keyframe w/same log script
      .map(tc => { return { timecode: tc, frame: this.keyframes[tc] } })
      .find(kf => kf.frame.keylog === this.logger.running)

    const key = this.logger.running || keyframe.frame.keylog
    const tc = this.logger.running ? priorKeyframe.timecode : keyframe.timecode

    const rec = this.logger.recordings[key]
    if (key && rec) {
      const vidDelta = this.video.currentTime - tc
      let logDelta = 0
      let index = 0
      for (let i = 0; i < rec.length; i++) {
        const d = (rec[i].time - rec[0].time) / 1000
        if (d > vidDelta) break
        logDelta = d
        index = i
      }
      const delta = (vidDelta - logDelta) * 1000
      return { code: rec[index].code, time: rec[index].time, index, delta }
    }
  }

  _resetKeyframeStatus (skipRender) {
    for (const tc in this.keyframes) this.keyframes[tc].ran = false
    if (!skipRender) this.renderKeyframe()
  }

  _mergeKeyLoggerDataWithKeyframes () {
    if (Object.keys(this.logger.recordings).length === 0) {
      console.log('again')
      setTimeout(() => this._mergeKeyLoggerFrames(), 100)
    } else {
      const newKF = []
      this.timecodes // keyframes with logs
        .filter(tc => this.keyframes[tc].keylog)
        .map(tc => { return { timecode: tc, frame: this.keyframes[tc] } })
        .forEach(obj => {
          const kl = obj.frame.keylog
          const logs = this.logger.recordings[kl]
          const start = logs[0].time
          logs.forEach(log => {
            const newTC = ((log.time - start) / 1000) + Number(obj.timecode)
            if (this.keyframes[newTC]) {
              this.keyframes[newTC].code = log.code
            } else {
              const kf = this._mostRecentKeyframe(newTC)
              const st = kf.frame.scrollTo
                ? JSON.parse(JSON.stringify(kf.frame.scrollTo)) : null
              newKF.push({
                tc: newTC,
                netnet: JSON.parse(JSON.stringify(kf.frame.netnet)),
                video: JSON.parse(JSON.stringify(kf.frame.video)),
                widgets: JSON.parse(JSON.stringify(kf.frame.widgets)),
                layout: kf.frame.layout,
                scrollTo: st,
                code: log.code,
                ran: false
              })
            }
          })
        })
      newKF.forEach(kf => { this.keyframes[kf.tc] = kf })
      this.loadKeyframes(this.keyframes)
      // ...
      this._resetKeyframeStatus()
      this.renderKeyframe()
    }
  }

  _loadKeyLoggerData () {
    const tg = WIDGETS['tutorials-guide']
    if (!tg || !tg.metadata) return
    // only run code below if we're in a tutorial (not when making them)
    if (tg.metadata.keylogs) {
      utils.get(`tutorials/${tg.metadata.id}/keylogs.json`, (json) => {
        this.logger._loadData(json)
        this._mergeKeyLoggerDataWithKeyframes()
      })
    }
  }
}

window.HyperVideoPlayer = HyperVideoPlayer
