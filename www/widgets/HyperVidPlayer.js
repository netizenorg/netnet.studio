/* global Widget */
/*
  -----------
     info
  -----------

  Explain what this widget is for and what it does...

  -----------
     usage
  -----------

  // it's important that the file-name matches the class-name because
  // this widget is instantiated by the WindowManager as...

  WIDGETS['Example Widget'] = new HyperVidPlayer({
    video: 'api/videos/vr1-computer-chronicles.mp4',
    width: window.innerWidth * 0.375,
    title: 'Computer Chronicles (1992)',
    source: {
      url: 'https://archive.org/details/virtualreali',
      text: 'Computer Chronicles episode on Virtual Reality'
    }
  })

  // this class inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js to see what those are
  // or take a look at the wiki...
  // https://github.com/netizenorg/netnet.studio/wiki/Creating-Widgets
*/
class HyperVidPlayer extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'hyper-vid-player'
    this.listed = false

    this.keyframes = []

    this.title = opts.title || 'hyperVideoPlayer'
    this._createCSS()
    this._createHTML(opts)
  }

  static get skipAutoInstantiation () { return true }

  get volume () { return this.$('video').volume }
  set volume (v) { this.$('video').volume = v }

  get src () { return this.$('video').src }
  set src (v) { this.$('video').src = v }

  play () {
    this.$('.hvp-pause-screen').style.display = 'none'
    this.$('.hvp-toggle > span').classList.remove('play')
    this.$('.hvp-toggle > span').classList.add('pause')
    this.$('video').play()
    this._loop()
  }

  pause () {
    this._updatePauseClock()
    this.$('.hvp-pause-screen').style.display = 'block'
    this.$('.hvp-toggle > span').classList.remove('pause')
    this.$('.hvp-toggle > span').classList.add('play')
    this.$('video').pause()
  }

  toggle () {
    if (this.$('video').paused) this.play()
    else this.pause()
  }

  at (time, callback) {
    this.keyframes.push({ time, callback, ran: false })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods

  _createCSS () {
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = `
      div.hvp-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #0007;
        transition: opacity 0.25s;
      }
      div.hvp-controls > .hvp-toggle {
        cursor: pointer
      }
    `
    document.getElementsByTagName('head')[0].appendChild(style)
  }

  _createHTML (opts) {
    this.innerHTML = `
      <div class="hvp-wrap">
        <div class="hvp-pause-screen">
          <span>PAUSE ▌▌</span>
          <span>PAUSE ▌▌</span>
          <span>PAUSE ▌▌</span>
          <span>00:00:00</span>
          <span>00:00:00</span>
          <span>00:00:00</span>
        </div>
        <video style="display:block; width:100%" src="${opts.video}"></video>
        <div class="hvp-controls">
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
          </div>
        </div>
      </div>
      <div style="font-size:12px">
        <a href="${opts.video}" target="_blank">download video</a>
        ${opts.source ? `
            (source:<a href="${opts.source.url}" target="_blank">
              ${opts.source.text}
            </a>)` : ''}
      </div>
      ${opts.text ? '<p class="hvp-copy">' + opts.text + '</p>' : ''}
    `
    this.$('.hvp-toggle').addEventListener('click', () => this.toggle())
    this.$('.hvp-vol').addEventListener('change', () => {
      this.$('video').volume = this.$('.hvp-vol').value
      if (this.$('video').volume <= 0.1) {
        this.$('.hvp-vol-wrap').classList.remove('half')
        this.$('.hvp-vol-wrap').classList.add('zero')
      } else if (this.$('video').volume <= 0.5) {
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

    this.$('video').addEventListener('ended', () => {
      this.$('video').currentTime = 0
      this.pause()
    })

    this.$('.hvp-toggle > span').classList.remove('pause')
    this.$('.hvp-toggle > span').classList.add('play')
  }

  _updatePauseClock () {
    const c1 = this.$('.hvp-pause-screen > span:nth-child(4)')
    const c2 = this.$('.hvp-pause-screen > span:nth-child(5)')
    const c3 = this.$('.hvp-pause-screen > span:nth-child(6)')
    const t = this.$('video').currentTime
    const h = '00'
    let m = Math.floor(t / 60)
    let s = Math.round(t % 60)
    if (m < 10) m = '0' + m
    if (s < 10) s = '0' + s
    c1.textContent = h + ':' + m + ':' + s
    c2.textContent = h + ':' + m + ':' + s
    c3.textContent = h + ':' + m + ':' + s
    return t
  }

  _loop () {
    if (!this.$('video').paused) {
      window.requestAnimationFrame(() => this._loop())
    }
    const ct = this.$('video').currentTime
    const kfs = this.keyframes.filter(kf => ct > kf.time && !kf.ran)
    kfs.forEach(kf => {
      kf.callback(this)
      kf.ran = true
    })

    this._updateProgress(ct)
  }

  _updateProgress (_ct) {
    const progressBar = this.$('.progress')
    const percentage = Math.floor((100 / this.$('video').duration) * _ct)
    if (!percentage || isNaN(percentage)) return
    progressBar.value = percentage
    progressBar.innerHTML = percentage + '%'
  }
}

window.HyperVidPlayer = HyperVidPlayer
