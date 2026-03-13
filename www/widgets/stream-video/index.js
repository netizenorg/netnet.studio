/* global Widget */
class StreamVideo extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'stream-video'
    this.listed = false

    this.rtcOpts = {
      audio: { echoCancellation: true },
      video: { width: 720, height: 480 }
    }

    this.on('close', () => {
      if (window.stream) window.stream.getTracks().forEach(t => t.stop())
      this._reset()
    })

    this.title = 'Web Cam'
    this._createHTML(opts)
  }

  // -------------------------- [ view ] ---------------------------------------

  _createHTML (opts) {
    this.innerHTML = `
      <video name="vid-stream" style="width: 100%;display:none;" autoplay playsinline muted></video>
      <div class="rec-opts av-strm-row">
        <button class="pill-btn" name="stream">start stream</button>
      </div>
    `
    this.$('[name="stream"]').addEventListener('click', (e) => this._init(e))
  }

  // -------------------------- [ WebRTC ] ------------------------------------

  _reset () {
    this.$('[name="vid-stream"]').style.display = 'none'
    this.$('.rec-opts').style.display = 'flex'
    this.keepInFrame()
  }

  async _init (e) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(this.rtcOpts)
      this._handleSuccess(stream)
      this.$('[name="vid-stream"]').style.display = 'inline'
      this.$('.rec-opts').style.display = 'none'
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
