/* global WIDGETS, Widget */
// TODO: explore: https://webrtc.github.io/samples/src/content/getusermedia/record/
class StreamVideo extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'stream-video'
    this.listed = false

    this.rtcOpts = {
      audio: { echoCancellation: true },
      video: { width: 720, height: 480 }
    }
    this.data = []
    this.recorder = null

    if (!WIDGETS.loaded.includes('netitor-logger')) {
      WIDGETS.load('netitor-logger')
    }

    this.on('close', () => {
      if (window.stream) window.stream.getTracks().forEach(t => t.stop())
      this._reset()
    })

    this.title = 'Live Streeeeeeamz'
    this._createHTML(opts)
  }

  startRecording (keylogger) {
    this.data = []
    // NOTE: in future might want to use .isTypeSupported
    // to check for supported types, like:
    // 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
    // 'video/webm;codecs=vp9,opus'
    // 'video/webm;codecs=vp8,opus'
    const opts = { mimeType: 'video/webm' }
    this.recorder = new window.MediaRecorder(window.stream, opts)
    this.recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) this.data.push(e.data)
    }
    this.recorder.onerror = (e) => { this._handleError(e) }
    this.recorder.onstop = (e) => {
      window.stream.getTracks().forEach(t => t.stop())
      this._displayRecording()
      if (keylogger) WIDGETS['netitor-logger'].stopRecording()
      this._tempFilename = window.prompt('name your video file')
    }
    this.recorder.start()
    if (keylogger) WIDGETS['netitor-logger'].startRecording()
  }

  stopRecording () {
    this.recorder.stop()
    // this.download()
  }

  download () {
    const blob = new window.Blob(this.data, { type: 'video/webm' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    a.href = url
    a.download = `${this._tempFilename || 'netnet-recording'}.webm`
    a.click()
    window.URL.revokeObjectURL(url)
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)
  }

  // -------------------------- [ view ] ---------------------------------------

  _createHTML (opts) {
    this.innerHTML = `
      <video name="vid-stream" style="width: 100%;display:none;" autoplay playsinline muted></video>
      <div class="rec-opts av-strm-row">
        <button class="pill-btn" name="stream">stream only</button>
        <button class="pill-btn" name="record">stream + record</button>
      </div>
      <div class="recorded-videos av-strm-row">
        <!-- <div style="margin-top: 15px; text-align: center;">
          <p>⚠️ WARNING!!! AUDIO FEEDBACK ⚠️</p>
          <p>(mute your audio or use headphones)</p>
        </div> -->
      </div>
      <div class="av-strm-controls">
        <button class="pill-btn pill-btn--secondary" name="start-rec">start recording</button>
        <div>
          <input type="checkbox" name="av-keylog-sync"> include keylogger
        </div>
      </div>
      <div class="av-str-post-msg" style="margin-top: 15px">
        <button name="dl-kl">download</button>
      </div>
    `
    this.$('[name="stream"]').addEventListener('click', (e) => this._init(e))
    this.$('[name="record"]').addEventListener('click', (e) => this._init(e, true))
    this.$('[name="start-rec"]').addEventListener('click', (e) => {
      if (e.target.textContent === 'start recording') {
        e.target.textContent = 'stop'
        const k = this.$('[name="av-keylog-sync"]').checked
        e.target.style.animation = 'av-strm-rec 1s infinite'
        this.startRecording(k)
      } else {
        e.target.textContent = 'start recording'
        e.target.style.animation = 'none'
        this.stopRecording()
      }
    })

    this.$('[name="dl-kl"]').addEventListener('click', () => {
      this.download()
      const k = this.$('[name="av-keylog-sync"]').checked
      if (k) WIDGETS['netitor-logger'].download()
    })
  }

  // -------------------------- [ WebRTC ] ------------------------------------

  _reset () {
    this.$('.av-str-post-msg').style.display = 'none'
    this.$('[name="vid-stream"]').style.display = 'none'
    this.$('.av-strm-controls').style.display = 'none'
    this.$('.rec-opts').style.display = 'flex'
    this.$('.recorded-videos').innerHTML = `
    <div style="margin-top: 15px; text-align: center;">
      <p>⚠️ WARNING!!! AUDIO FEEDBACK ⚠️</p>
      <p>(mute your audio or use headphones)</p>
    </div>
    `
    this.keepInFrame()
  }

  _displayRecording () {
    this.$('[name="vid-stream"]').style.display = 'none'
    const video = document.createElement('video')
    video.controls = true
    const blob = new window.Blob(this.data, { type: 'video/webm' })
    video.src = window.URL.createObjectURL(blob)
    this.$('.recorded-videos').appendChild(video)
    this.$('.av-strm-controls').style.display = 'none'
    this.$('.av-str-post-msg').style.display = 'block'
    this.keepInFrame()
  }

  async _init (e, rec) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(this.rtcOpts)
      this._handleSuccess(stream)
      // e.target.disabled = true
      this.$('[name="vid-stream"]').style.display = 'inline'
      this.$('.rec-opts').style.display = 'none'
      this.$('.recorded-videos').innerHTML = ''
      if (rec) this.$('.av-strm-controls').style.display = 'flex'
    } catch (e) { this._handleError(e) }
  }

  _handleSuccess (stream) {
    const video = this.$('[name="vid-stream"]')
    const videoTracks = stream.getVideoTracks()
    console.log('Got stream with constraints:', this.rtcOpts)
    console.log(`Using video device: ${videoTracks[0].label}`)
    window.stream = stream // make variable available to browser console
    video.onloadeddata = () => this.keepInFrame()
    video.srcObject = stream
  }

  _handleError (e) {
    window.alert('error! see console')
    console.error(e)
  }
}

window.StreamVideo = StreamVideo
