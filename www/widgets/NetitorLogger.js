/* global Widget, NNE */
class NetitorLogger extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'netitor-logger'
    this.listed = false

    // recording
    this.recordings = {}
    this.log = [] // current recording
    // playback
    this.idx = 0 // render index
    this.run = null // render loop
    this.running = null // current key

    this.title = 'Netitor KeyLogger'
    this._createHTML(opts)

    NNE.cm.on('change', () => this._addLog())
  }

  get selectedRecording () {
    const val = this.$('.__netr-lgr-sel').value
    if (val && val !== 'NONE') return this.recordings[val]
    else return null
  }

  reset () {
    this.recordings = {}
    this.log = []
    this.idx = 0
    if (this.run) clearTimeout(this.run)
    this.running = null
  }

  download (type) {
    const txt = JSON.stringify(this.recordings)
    const a = document.createElement('a')
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt))
    a.setAttribute('download', 'keylogs.json')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  play (key, delta) {
    key = key || this.$('.__netr-lgr-sel').value
    const rec = this.recordings[key]

    if (!rec) {
      window.alert(`${key} is not a valide keylog recording`)
      return
    }

    if (this.running) {
      this._nextFrame(rec, this.idx, delta)
    } else {
      if (this.run) clearTimeout(this.run)
      this.running = key
      this._nextFrame(rec, 0)
    }
    this.$('.__netr-lgr-ply-bck').textContent = 'pause'
  }

  pause () {
    if (this.run) clearTimeout(this.run)
    this.$('.__netr-lgr-ply-bck').textContent = 'play'
  }

  stop () {
    this.running = null
    if (this.run) clearTimeout(this.run)
    this.idx = 0
    this.$('.__netr-lgr-ply-bck').textContent = 'play'
  }

  startRecording () {
    this.recording = true
    this.log.push({ time: Date.now(), code: NNE.code })
  }

  stopRecording () {
    this.recording = false
    const name = window.prompt('give this recording a name')
    this.recordings[name] = [...this.log]
    this.log = []
    this._createSelection()
  }

  _addLog () {
    if (this.recording) this.log.push({ time: Date.now(), code: NNE.code })
  }

  _nextFrame (rec, i, delta) {
    if (this.run) clearTimeout(this.run)
    const s = NNE.cm.getScrollInfo()
    this.idx = i
    if (i + 1 < rec.length) {
      NNE.code = rec[i].code
      const time = rec[i + 1].time - rec[i].time
      const delay = delta ? time - delta : time
      this.run = setTimeout(() => { this._nextFrame(rec, i + 1) }, delay)
    } else {
      this.$('.__netr-lgr-ply-bck').textContent = 'play'
      NNE.code = rec[i].code
      this.stop()
    }
    NNE.cm.scrollTo(s.left, s.top)
  }

  _createHTML (opts) {
    this.innerHTML = `
      <style>
        @keyframes __netr-lgr-rec {
          0% { background: rgba(255, 0, 0, 0); }
          50% { background: rgba(255, 0, 0, 1);}
          100% { background: rgba(255, 0, 0, 0); }
        }
        .__netr-lgr-rec-btn {
          text-align: center;
        }
      </style>
      <section>
        <button class="__netr-lgr-rec-btn">start recording</button>
        <span> | </span>
        <select class="__netr-lgr-sel"><option value="NONE">NONE</option></select>
        <button class="__netr-lgr-ply-bck">play</button>
        <button class="__netr-lgr-stop">stop</button>
        <span> | </span>
        <button class="__netr-lgr-upload">load json</button>
        <button class="__netr-lgr-download">download</button>
      </section>
    `

    this.ele.style.minHeight = '110px'
    this.ele.style.height = '110px'

    this.$('.__netr-lgr-rec-btn').addEventListener('click', (e) => {
      if (e.target.textContent === 'start recording') {
        e.target.textContent = 'stop recording'
        e.target.style.animation = '__netr-lgr-rec 1s infinite'
        this.startRecording()
      } else {
        e.target.textContent = 'start recording'
        e.target.style.animation = 'none'
        this.stopRecording()
      }
    })

    this.$('.__netr-lgr-ply-bck').addEventListener('click', (e) => {
      if (e.target.textContent === 'play') this.play()
      else { e.target.textContent = 'play'; this.pause() }
    })

    this.$('.__netr-lgr-stop').addEventListener('click', (e) => this.stop())

    this._createFileReader()

    this.$('.__netr-lgr-download')
      .addEventListener('click', (e) => this.download())
    this.$('.__netr-lgr-upload')
      .addEventListener('click', (e) => this.uploader.click())
  }

  _createSelection () {
    const sel = this.$('.__netr-lgr-sel')
    sel.innerHTML = '<option value="NONE">NONE</option>'
    Object.keys(this.recordings).forEach(key => {
      const opt = document.createElement('option')
      opt.value = key
      opt.textContent = key
      sel.appendChild(opt)
    })
  }

  _loadData (data) {
    this.recordings = data
    this._createSelection()
  }

  _createFileReader () {
    this.uploader = document.createElement('input')
    this.uploader.setAttribute('type', 'file')
    this.uploader.setAttribute('hidden', true)
    document.body.appendChild(this.uploader)
    this.uploader.addEventListener('change', (e) => {
      const file = this.uploader.files[0]
      const reader = new window.FileReader()
      reader.onload = (e) => {
        if (file.name.includes('.json')) {
          const b64 = e.target.result.split('base64,')[1]
          this._loadData(JSON.parse(window.atob(b64)))
        } else {
          console.error('NetitorLogger: requires a json file')
        }
      }
      reader.readAsDataURL(file)
    })
  }
}

window.NetitorLogger = NetitorLogger
