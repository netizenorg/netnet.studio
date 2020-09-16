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
  WIDGETS['Example Widget'] = new HyperVidPlayer()

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
    this.$('.hvp-toggle').textContent = '□'
    this.$('video').play()
  }

  pause () {
    this.$('.hvp-toggle').textContent = 'ᐅ'
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
        transform: translateY(-100%);
        padding: 18px;
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
      <video style="width: 100%" src="${opts.video}"></video>
      <div class="hvp-controls">
        <div class="hvp-toggle">ᐅ</div>
        <input type="range" min="0" max="1" step="0.1" value="1" class="hvp-vol">
      </div>
      ${opts.text ? '<p>' + opts.text + '</p>' : ''}
      ${opts.source ? `<p>
          (source:<a href="${opts.source.url}" target="_blank">
            ${opts.source.text}
          </a>)
        </p>` : ''}
    `
    this.$('.hvp-toggle').addEventListener('click', () => this.toggle())
    this.$('.hvp-vol').addEventListener('change', () => {
      this.$('video').volume = this.$('.hvp-vol').value
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
    this._loop()
  }

  _loop () {
    window.requestAnimationFrame(() => this._loop())
    const ct = this.$('video').currentTime
    const kfs = this.keyframes.filter(kf => ct > kf.time && !kf.ran)
    kfs.forEach(kf => {
      kf.callback()
      kf.ran = true
    })
  }
}

window.HyperVidPlayer = HyperVidPlayer
