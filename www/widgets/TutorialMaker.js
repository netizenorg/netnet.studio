/* global Widget, WIDGETS, utils, NNE, NNW */
class TutorialMaker extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'tutorial-maker'
    this.listed = false

    this.keyframes = {}
    this.widgets = {}
    this.metadata = {
      id: '', // folder name (lowercase, no spaces)
      title: '',
      subtitle: '',
      author: { name: '', preferred: '', url: '' },
      videofile: '',
      keylogs: false,
      description: '',
      keywords: [],
      checkpoints: {}, // TODO
      references: [] // TODO
    }

    this._tempHighlight = null
    this._tempSpotlight = null

    this.title = 'Tutorial Maker'
    this._createHTML(opts)

    this.on('open', () => {
      if (window.convo) window.convo.hide()
      WIDGETS.open('hyper-video-player', null, () => {
        this.video = WIDGETS['hyper-video-player'].video
        this.video.addEventListener('timeupdate', () => this._timeUpdate())
      })
      const time = utils.getVal('--menu-fades-time')
      this.update({ top: 20, left: 20 }, time)
    })
  }

  upload () {
    this.uploader.click()
  }

  download (type) {
    const obj = type === 'metadata' ? this.metadata : {}
    if (type === 'data') {
      const tcs = Object.keys(this.keyframes).sort((a, b) => a - b)
      obj.keyframes = {}
      tcs.forEach(tc => { obj.keyframes[tc] = this.keyframes[tc] })
      obj.widgets = this.widgets
    }
    const txt = JSON.stringify(obj, null, 2)
    const a = document.createElement('a')
    const filename = type === 'metadata' ? 'metadata.json' : 'data.json'
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt))
    a.setAttribute('download', filename)
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  createKeyframe () {
    const idx = this.video.currentTime
    this.keyframes[idx] = {
      video: this._getWigDetails(WIDGETS['hyper-video-player']),
      widgets: this._getCurrentWidgets(),
      code: NNE.code,
      highlight: this._tempHighlight,
      spotlight: this._tempSpotlight,
      layout: NNW.layout,
      netnet: this._getNetNetPos(),
      scrollTo: this._getScrollPos(),
      keylog: this._getKeylog()
    }
    if (this.keyframes[idx].keylog) {
      this.metadata.keylogs = true
      this.keyframes[idx].code = null
    }
    WIDGETS['hyper-video-player'].loadKeyframes(this.keyframes)
    this._updateView()
  }

  removeKeyframe () {
    const idx = this.video.currentTime
    delete this.keyframes[idx]
    WIDGETS['hyper-video-player'].loadKeyframes(this.keyframes)
    this._updateView(true)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸ html content methods

  _metadataHTML () {
    const ele = document.createElement('section')
    ele.style.display = 'flex'
    ele.style.flexDirection = 'column'
    ele.innerHTML = `
      <button name="load-metadata" style="margin-top: 5px">load metadata.json</button>
      <h1 style="text-align: center">Tutorial Metadata</h1>
      <input type="text" name="id" placeholder="id (folder name, lowercase, no spaces)"><br>
      <input type="text" name="title" placeholder="Tutorial Title"><br>
      <input type="text" name="subtitle" placeholder="Tutorial Subtitle"><br>
      <input type="text" name="author-name" placeholder="Author's Full Name"><br>
      <input type="text" name="author-preferred" placeholder="Author's Preferred Name"><br>
      <input type="text" name="author-url" placeholder="Author's Homepage"><br>
      <input type="text" name="description" placeholder="A description of what the tutorial is about..."><br>
      <input type="text" name="videofile" placeholder="video filename (without extention)"><br>
      <input type="text" name="keywords" placeholder="comma, seperated, keywords"><br><br>
      <button name="update-metadata" style="margin: 5px 0px">enter</button>`

    ele.querySelector('button[name="update-metadata"]')
      .addEventListener('click', () => this._updateMetadata())

    ele.querySelector('button[name="load-metadata"]')
      .addEventListener('click', () => this.upload())

    return ele
  }

  _tutorialToolsHTML () {
    this.ele.querySelector('.w-innerHTML').style.padding = 0
    const ele = document.createElement('section')
    ele.style.display = 'flex'
    ele.style.flexDirection = 'column'
    ele.innerHTML = `
      <style>
        .__tut-maker-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0px !important;
        }
        .__tut-maker-label {
          font-size: 12px;
        }
        .__tut-maker-row > input {
          width: 70px !important;
        }
        .__tut-maker-row > span {
          cursor: pointer;
        }
        .__tut-maker-btn {
          display: block;
          margin: 5px 0px;
        }
        .__tut-maker-row > input.ti {
          width: 34px !important;
        }
      </style>
      <button class="__tut-maker-btn" name="netitor-logger">load keylogs.json</button>
      <button class="__tut-maker-btn" name="load-data">load data.json</button><br>
      <hr style="width: 100%">
      <div class="__tut-maker-row" name="t">
        <div class="__tut-maker-label">seconds :&nbsp;</div>
        <span>❮❮</span>
        <input type="text" name="seconds" value="0">
        <span>❯❯</span>
      </div>
      <div class="__tut-maker-row" name="kf">
        <div class="__tut-maker-label" style="margin-top: 0px;">keyframe:&nbsp;</div>
        <span>❮❮</span>
        <input type="text" name="keyframes">
        <span>❯❯</span>
      </div>
      <button class="__tut-maker-btn" name="edit-keyframe">create keyframe</button>
      <hr style="width: 100%">
      <button class="__tut-maker-btn" name="edit-widgets">add/edit widget</button>
      <br>
      <div class="__tut-maker-row hl" style="margin-top: 10px !important;">
        <input type="text" class="ti" placeholder="sl" title="start line number">
        <input type="text" class="ti" placeholder="sc" title="start column number">
        <input type="text" class="ti" placeholder="el" title="end line number">
        <input type="text" class="ti" placeholder="ec" title="end column number">
      </div>
      <input type="text" style="width: 172px;" placeholder="color" title="highlight color">
      <div class="__tut-maker-row hl">
        <button class="__tut-maker-btn" name="n-highlight">highlight code</button>
        <button class="__tut-maker-btn" name="clear-highlight">clear</button>
      </div>
      <input type="text" placeholder="line numbers (comma separated)" style="width: 172px;">
      <div class="__tut-maker-row">
        <button class="__tut-maker-btn" name="n-spotlight">spotlight code</button>
        <button class="__tut-maker-btn" name="clear-spotlight">clear</button>
      </div>
      <div class="__tut-maker-label">keylog recordings</div>
      <select style="margin-top: 10px !important;" title="keylog recordings"></select>
      <hr style="width: 100%">
      <button class="__tut-maker-btn" name="download-data">DOWNLOAD DATA</button>`

    ele.querySelector('button[name="edit-keyframe"]')
      .addEventListener('click', (e) => {
        if (e.target.textContent === 'create keyframe') this.createKeyframe()
        else this.removeKeyframe()
      })

    ele.querySelector('button[name="load-data"]')
      .addEventListener('click', () => this.upload())

    const time = ele.querySelector('.__tut-maker-row[name="t"]')
    time.children[1].addEventListener('click', () => this._goTo('time', -1))
    time.children[2].addEventListener('change', (e) => this._goTo('time', e))
    time.children[3].addEventListener('click', () => this._goTo('time', 1))

    const keyframe = ele.querySelector('.__tut-maker-row[name="kf"]')
    keyframe.children[1].addEventListener('click', () => this._goTo('keyframe', -1))
    keyframe.children[2].addEventListener('change', (e) => this._goTo('keyframe', e))
    keyframe.children[3].addEventListener('click', () => this._goTo('keyframe', 1))

    ele.querySelector('button[name="edit-widgets"]')
      .addEventListener('click', () => WIDGETS.open('widget-maker'))

    ele.querySelector('button[name="n-highlight"]')
      .addEventListener('click', () => {
        NNE.highlight(null)
        this._tempHighlight = null
        const obj = {}
        const ins = ele.querySelectorAll('.__tut-maker-row.hl > input')
        const props = ['startLine', 'startCol', 'endLine', 'endCol']
        ins.forEach((inp, i) => {
          if (inp.value !== '' && !isNaN(Number(inp.value))) {
            obj[props[i]] = Number(inp.value)
          }
        })
        const clr = ele.querySelector('input[title="highlight color"]')
        if (clr.value !== '') obj.color = clr.value
        if (obj.startLine) {
          this._tempHighlight = obj
          NNE.highlight(obj)
        }
      })
    ele.querySelector('[name="clear-highlight"]')
      .addEventListener('click', () => {
        const ins = ele.querySelectorAll('.__tut-maker-row.hl > input')
        ins.forEach((inp, i) => { inp.value = '' })
        ele.querySelector('input[title="highlight color"]').value = ''
        NNE.highlight(null)
        this._tempHighlight = null
      })

    ele.querySelector('button[name="n-spotlight"]')
      .addEventListener('click', () => {
        NNE.spotlight(null)
        this._tempSpotlight = null
        const q = 'input[placeholder="line numbers (comma separated)"]'
        const v = ele.querySelector(q).value.split(',').map((v) => Number(v))
        if (!isNaN(v[0]) && v[0] !== 0) {
          this._tempSpotlight = v
          NNE.spotlight(v)
        }
      })
    ele.querySelector('[name="clear-spotlight"]')
      .addEventListener('click', () => {
        NNE.spotlight(null)
        this._tempSpotlight = null
        const q = 'input[placeholder="line numbers (comma separated)"]'
        ele.querySelector(q).value = ''
      })

    ele.querySelector('button[name="netitor-logger"]')
      .addEventListener('click', () => { this.uploader.click() })

    ele.querySelector('button[name="download-data"]')
      .addEventListener('click', () => {
        this.download('metadata')
        this.download('data')
      })

    return ele
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
        if (file.name === 'metadata.json') {
          const b64 = e.target.result.split('base64,')[1]
          this._loadMetadata(JSON.parse(utils.atob(b64)))
        } else if (file.name === 'data.json') {
          const b64 = e.target.result.split('base64,')[1]
          this._loadData(JSON.parse(utils.atob(b64)))
        } else if (file.name === 'keylogs.json') {
          const b64 = e.target.result.split('base64,')[1]
          const data = JSON.parse(utils.atob(b64))
          this._loadKeylog(data)
          const nt = WIDGETS['netitor-logger']
          if (nt) WIDGETS['netitor-logger']._loadData(data)
          else WIDGETS.load('NetitorLogger.js', (w) => w._loadData(data))
        } else {
          console.error('TutorialMaker: seems you tried to open the wrong file')
        }
      }
      reader.readAsDataURL(file)
    })
  }

  _createHTML (opts) {
    this._createFileReader()
    this.metadataHTML = this._metadataHTML()
    this.toolsHTML = this._tutorialToolsHTML()
    this.innerHTML = this.metadataHTML
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.• data && metadata methods

  _loadData (data) {
    this.keyframes = data.keyframes
    this.widgets = data.widgets
    // NNE.addCustomRoot(`tutorials/${this.metadata.id}/`)
    WIDGETS['hyper-video-player'].loadKeyframes(this.keyframes)
    if (this.metadata.duration) {
      WIDGETS['hyper-video-player'].duration = Number(this.metadata.duration)
    }
    for (const key in this.widgets) {
      if (!WIDGETS.instantiated.includes(key)) {
        WIDGETS.create(this.widgets[key])
      }
    }
    if (this.metadata.jsfile) {
      const file = `tutorials/${this.metadata.id}/${this.metadata.jsfile}`
      utils.loadFile(file, () => window.TUTORIAL.init())
    }
    this._updateView()
  }

  _loadKeylog (data) {
    const sel = this.$('[title="keylog recordings"]')
    sel.innerHTML = '<option value="NONE">NONE</option>'
    Object.keys(data).forEach(key => {
      const opt = document.createElement('option')
      opt.value = key
      opt.textContent = key
      sel.appendChild(opt)
    })
  }

  _loadMetadata (data) {
    this.metadata = data
    NNE.addCustomRoot(`tutorials/${data.id}/`)
    this.metadataHTML.querySelectorAll('input').forEach(e => {
      const name = (e.name.includes('author')) ? e.name.split('-') : [e.name]
      if (e.name === 'keywords') e.value = this.metadata.keywords.join(', ')
      else if (name.length > 1) e.value = this.metadata[name[0]][name[1]]
      else e.value = this.metadata[name[0]]
    })
  }

  _updateMetadata () { // when "enter" pressed
    this.metadataHTML.querySelectorAll('input').forEach(e => {
      const name = (e.name.includes('author')) ? e.name.split('-') : [e.name]
      if (e.name === 'keywords') this.metadata.keywords = e.value.split(',').map(s => s.trim())
      else if (name.length > 1) this.metadata[name[0]][name[1]] = e.value
      else this.metadata[name[0]] = e.value
    })

    const hvp = WIDGETS['hyper-video-player']
    hvp.title = this.metadata.title
    hvp.video.addEventListener('loadedmetadata', () => {
      this.metadata.duration = Number(hvp.video.duration)
    })
    if (this.metadata.videofile && this.metadata.videofile !== '') {
      hvp.updateVideo(this.metadata.videofile, this.metadata.id)
    } else {
      hvp.updateVideo('screen-saver')
    }
    this.innerHTML = this.toolsHTML
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• keyframe methods

  _timeUpdate () {
    const ct = this.video.currentTime
    this.$('input[name="seconds"]').value = Math.round(ct * 100) / 100
    this._updateView()
  }

  _updateView (skipRender) {
    const kf = this.keyframes[this.video.currentTime]

    // update keframe UI
    const kfUI = this.$('input[name="keyframes"]')
    if (kf) {
      kfUI.style.backgroundColor = 'var(--netizen-tag)'
      const ts = this.video.currentTime.toString()
      kfUI.value = Object.keys(this.keyframes).sort((a, b) => a - b).indexOf(ts)
      this.$('button[name="edit-keyframe"]').textContent = 'remove keyframe'
    } else if (kfUI.style.backgroundColor !== 'var(--netizen-meta)') {
      kfUI.style.backgroundColor = 'var(--netizen-meta)'
      kfUI.value = ''
      this.$('button[name="edit-keyframe"]').textContent = 'create keyframe'
    }

    // update highlight UI
    const hlUI = this.$('[title="start line number"]')
    if (kf && kf.highlight) {
      const h = kf.highlight
      const ins = this.$('.__tut-maker-row.hl > input')
      const props = ['startLine', 'startCol', 'endLine', 'endCol']
      ins.forEach((inp, i) => {
        if (h[props[i]]) inp.value = h[props[i]]
        else inp.value = ''
      })
      if (h.color) this.$('[title="highlight color"]').value = h.color
      else this.$('[title="highlight color"]').value = ''
    } else if (hlUI.value !== '') {
      this.$('[name="clear-highlight"]').click()
    }

    // update spotlight UI
    const slUI = this.$('[placeholder="line numbers (comma separated)"]')
    if (kf && kf.spotlight) {
      slUI.value = kf.spotlight.join(',')
    } else if (slUI.value !== '') {
      this.$('[name="clear-spotlight"]').click()
    }

    // update keylog selection
    const klUI = this.$('[title="keylog recordings"]')
    if (kf && kf.keylog) {
      klUI.value = kf.keylog
    } else if (klUI.value !== 'NONE') {
      klUI.value = 'NONE'
    }

    // update studio
    if (!skipRender) WIDGETS['hyper-video-player'].renderKeyframe()
  }

  // .............. jumping around via Tutorial Maker GUI

  _goTo (type, d) {
    const n = (typeof d === 'object') ? Number(d.target.value) : d
    if (type === 'time') {
      if (isNaN(n)) {
        d.target.value = this.video.currentTime
        this._updateView()
      } else if (typeof d === 'object') this._goToTime(n)
      else this._goToTime(this.video.currentTime + n)
    } else if (type === 'keyframe') {
      const f = (d === 1) ? this._findKeyframe('next')
        : (d === -1) ? this._findKeyframe('prev')
          : this._confirmKeyframe(n)
      if (f === null) {
        this._updateView()
      } else this._goToKeyframe(f)
    }
  }

  _goToTime (v) {
    WIDGETS['hyper-video-player'].pause()
    if (v < this.video.duration && v >= 0) this.video.currentTime = v
    else if (v < 0) this.video.currentTime = 0
    else this.video.currentTime = this.video.duration - 0.01
    this.$('input[name="seconds"]').value = this.video.currentTime
    WIDGETS['hyper-video-player']._updatePauseClock()
    WIDGETS['hyper-video-player']._resetKeyframeStatus()
    this._updateView()
  }

  _goToKeyframe (frame) {
    if (!frame) return
    if (frame.index === -1) return window.alert('no keyframes yet')
    WIDGETS['hyper-video-player'].pause()
    this.$('input[name="keyframes"]').value = frame.index
    this.video.currentTime = frame.time
    WIDGETS['hyper-video-player']._updatePauseClock()
    WIDGETS['hyper-video-player']._resetKeyframeStatus()
    this._updateView()
  }

  _confirmKeyframe (num) {
    const secs = Object.keys(this.keyframes).sort((a, b) => a - b)
    if (num >= 0 && num < secs.length) {
      return { time: secs[num], index: num }
    } else return null
  }

  _findKeyframe (dir) {
    if (Object.keys(this.keyframes).length === 0) {
      window.alert('no keyframes yet')
      return
    }
    let found = false
    let secs = Object.keys(this.keyframes).sort((a, b) => a - b)
    if (dir === 'prev') secs = secs.reverse()
    for (var i = 0; i < secs.length; i++) {
      const s = secs[i]
      if (dir === 'next' && s > this.video.currentTime) {
        found = s; break
      } else if (dir === 'prev' && s < this.video.currentTime) {
        found = s; break
      }
    }

    if (!found) found = secs[secs.length - 1]
    const idx = Object.keys(this.keyframes)
      .sort((a, b) => a - b).indexOf(found.toString())
    return { time: found, index: idx }
  }

  // ................. generate data for keyframe object

  _getKeylog () {
    const kl = this.$('[title="keylog recordings"]').value
    if (kl !== 'NONE') return kl
    else return null
  }

  _getNetNetPos () {
    if (['welcome', 'separate-window'].includes(NNW.layout)) {
      return this._getSizeAndPosition(NNW)
    } else return {}
  }

  _getScrollPos () {
    const s = NNE.cm.getScrollInfo()
    return { x: s.left, y: s.top }
  }

  _getWigDetails (w) {
    return this._getSizeAndPosition(w)
  }

  _getCurrentWidgets () {
    const ignore = [
      'tutorial-maker', 'widget-maker', 'hyper-video-player', 'netitor-logger'
    ]
    return WIDGETS.list()
      .filter(w => w.opened)
      .filter(w => !ignore.includes(w.key))
      .map(w => this._getWigDetails(w))
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
}

window.TutorialMaker = TutorialMaker
