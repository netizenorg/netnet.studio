/* global Widget */
class StreamVideo extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'stream-video'
    this.listed = false
    this.rtcOpts = { audio: false, video: true }

    // here's some more example code...
    this.title = 'streeeeeeamz'
    this._createHTML(opts)
  }

  // -------------------------- [ view ] ---------------------------------------

  _createHTML (opts) {
    this.innerHTML = `
      <video style="width: 100%;display:none;" autoplay playsinline></video>
      <button>start streaming</button>
    `
    this.$('button').addEventListener('click', (e) => this._init(e))
  }

  // -------------------------- [ WebRTC ] ------------------------------------
  async _init (e) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(this.rtcOpts)
      this._handleSuccess(stream)
      // e.target.disabled = true
      this.$('video').style.display = 'inline'
      e.target.style.display = 'none'
    } catch (e) { this._handleError(e) }
  }

  _handleSuccess (stream) {
    const video = this.$('video')
    const videoTracks = stream.getVideoTracks()
    console.log('Got stream with constraints:', this.rtcOpts)
    console.log(`Using video device: ${videoTracks[0].label}`)
    window.stream = stream // make variable available to browser console
    video.srcObject = stream
  }

  _handleError (e) {
    window.alert('error! see console')
    console.log(e)
  }
}

window.StreamVideo = StreamVideo
