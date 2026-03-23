/* global WIDGETS Widget utils NNE NNW Convo nn */
class DemoToc extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'demo-toc'
    this.listed = false
    this.title = 'Sketch Demo Guide'
    this.left = 150
    // this.top = 50
    this.bottom = 20

    this.code = null
    this.codeLength = 0
    this.demoKey = null
    this.layout = null
    this.info = null
    this.selected = null

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.ele.querySelector('.widget__inner-html').classList.add('demo-toc')
    this.innerHTML = `
      <div>
        <p class="demo-toc--ex-edit1">⚠️ It looks like you've edited some of the code, that's great! It's important to experiment! But keep in mind some of netnet's annotated explanations might be off for the parts you've changed.</p>
        <p class="demo-toc--ex-edit2">⚠️ It looks like you've either added or removed a line of code. That's great, it's important to experiment!<br><br>Feel free to close this widget by pressing the "✖" or <code>${utils.hotKey()}+S</code> to save this as your own sketch or project.<br><br>Otherwise, you can press <code>${utils.hotKey()}+Z</code> if you want to undo your change and revert back to the annotated version. </p>
      </div>
      <div class="demo-toc-progress" role="group" aria-label="lesson progress"></div>
      <div class="demo-toc-note-title"></div>
    `

    NNE.on('code-update', () => this._editorChange())

    this.on('open', () => {
      const { x, y, w } = this._openSpot()
      // this.update({ top: y, left: x, width: w }, 500)
      this.update({ bottom: y, left: x, width: w }, 500)
    })
  }

  load (code, type) {
    const num = Number(code)
    const isNum = (typeof code === 'number' || (typeof num === 'number' && !isNaN(num)))

    if (isNum) {
      utils.get(`./api/demo/${num}`, json => {
        if (json.success === false) return utils._Convo('oh-no-error', json)
        this._load(json, type)
      })
    } else if (typeof code === 'object' && typeof code.code === 'string') {
      this._load(code, type)
    }
  }

  cancel (force) {
    if (this.opened || force) {
      this.code = null
      this.codeLength = 0
      this.demoKey = null
      this.layout = null
      this.info = null

      if (utils.url.demo) utils.updateURL(null)
      NNW.updateTitleBar(null)
      NNE.spotlight(null)
      NNE.marker(null)

      this.close()
    }
  }

  explainTitleBar () {
    if (this.info) {
      window.convo = new Convo(this.convos, 'loaded-annotated-demo')
    } else {
      window.convo = new Convo(this.convos, 'loaded-demo')
    }
    if (!this.opened) this.open()
  }

  // ---------------------------------------------------------------------------

  _load (obj, type) {
    if (typeof window.CONVOS[this.key] !== 'function') {
      setTimeout(() => this._load(obj, type), 250)
      return
    }

    this.convos = window.CONVOS[this.key](this)

    this.demoType = type
    this.demoName = obj.name || 'untitled demo'
    this.demoKey = obj.key
    this.code = NNE._decode(obj.code.substr(6))
    this.codeLength = this.code.split('\n').length
    this.layout = obj.layout
    this.info = obj.info

    const isStarterCode = NNE.code === utils.starterCode()
    if (isStarterCode) return this._displayDemo()

    const openProj = WIDGETS['project-files']?.projectData.name
    if (openProj) {
      const unSaved = WIDGETS['project-files'] && WIDGETS['project-files'].changes.length > 0
      if (unSaved) window.convo = new Convo(this.convos, 'working-on-unsaved-project')
      else window.convo = new Convo(this.convos, 'working-on-project')
      return
    }

    const userCodeIsDemo = typeof utils.url.demo === 'string'
    if (userCodeIsDemo) return this._displayDemo()

    if (NNW.layout !== 'welcome') {
      window.convo = new Convo(this.convos, 'working-on-something') // too cautious?
    } else {
      this._displayDemo()
    }
  }

  _displayDemo () {
    utils.cancelAllNetitorUses('demo-toc')

    NNE.code = this.code

    const needsTransition = (this.layout && NNW.layout !== this.layout) ||
        (!this.layout && NNW.layout !== 'dock-left')

    if (this.layout) NNW.layout = this.layout
    else NNW.layout = 'dock-left'

    if (WIDGETS['demo-sketches'] && WIDGETS['demo-sketches'].opened) {
      WIDGETS['demo-sketches'].close()
    }

    utils.setCustomRenderer(null)
    if (this.demoType !== 'custom') utils.updateURL(`?demo=${this.demoKey}`)
    NNW.updateTitleBar(this.demoName)

    NNE.update()

    let startDemo // start function

    function escapeHTML (str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    }

    if (this.info) {
      this.$('.demo-toc-progress').innerHTML = `
        <div class="bar" style="--progress: 0;">
          <div class="track"></div>
          <div class="fill"></div>
          <div class="note-markers"></div>
        </div>`
      // add "Notes" button in title bar
      NNW.title.dataset.demo = true
      // create progress bar markers
      this.info.forEach(note => {
        nn.create('button')
          .set('aria-label', escapeHTML(note.title))
          .on('click', () => this._explainerClick(note))
          .on('mouseout', () => {
            nn.get('.demo-toc-note-title')
              .content(this.info[this.selected].title)
              .css('color', 'var(--netizen-meta)')
          })
          .on('mouseover', () => {
            nn.get('.demo-toc-note-title')
              .content(note.title)
              .css('color', 'var(--netizen-attribute)')
          })
          .addTo('.demo-toc-progress .note-markers')
      })
      this.selected = 0
      nn.get('.demo-toc-progress .bar').style = '--progress: 0'
      nn.get('.demo-toc-note-title').content(this.info[0].title)

      // add netitor markers
      const occupiedLines = []
      const addMarker = (o, i) => {
        const l = (i === 0 && !o.focus) ? 1 : o.focus ? o.focus[0] : null
        if (l && !occupiedLines.includes(l)) {
          const m = NNE.marker(l, 'green', () => this._explainerClick(o))
          m.setAttribute('title', o.title)
          occupiedLines.push(l)
        }
      }
      // start function for annotated demos
      startDemo = () => {
        this.info.forEach((o, i) => addMarker(o, i))
        WIDGETS['code-review'].addIssueMarkers()
        if (!this.opened) this.open()
        window.convo = new Convo(this.convos, 'loaded-annotated-demo')
      }
    } else { // if this isn't an annoted demo
      this.$('.demo-toc-progress').innerHTML = '<p>this demo has no annotations</p>'
      if (this.opened) this.close()
      startDemo = () => { window.convo = new Convo(this.convos, 'loaded-demo') }
    }

    if (!needsTransition) startDemo()
    else utils.afterLayoutTransition(() => startDemo())
  }

  _explainerClick (o) {
    const idx = this.info.indexOf(o)

    this.selected = idx
    const p = (idx / (this.info.length - 1)) * 100
    nn.get('.demo-toc-progress .bar').style = `--progress: ${p}`
    nn.get('.demo-toc-note-title').content(o.title)

    if (idx === 0) {
      const m = nn.get('.netitor-gutter-marker')
      if (m && m.style.animation) m.style.animation = null
    }

    let options = {}
    const next = () => this._explainerClick(this.info[idx + 1])
    const previous = () => this._explainerClick(this.info[idx - 1])
    if (idx === 0) {
      options = { next }
    } else if (idx === this.info.length - 1) {
      options = { done: e => e.hide(), previous }
    } else {
      options = { next, previous }
    }
    if (!options.done) { options.done = e => e.hide() }

    // window.convo = new Convo({ content: `${idx + 1}: ${o.text}`, options })
    window.convo = new Convo({ content: `${o.text}`, options })

    if (o.focus instanceof Array) {
      utils.scrollToLines(o.focus)
      setTimeout(() => NNE.spotlight(o.focus), 500)
    } else NNE.spotlight(null)
  }

  _editorChange () {
    if (!this.demoKey) return
    const diffC = NNE.code !== this.code // false
    const len = NNE.cm.lineCount()
    const diffL = len !== this.codeLength
    // const A = diffL || diffC ? 'none' : 'block'
    const B = diffC && !diffL ? 'block' : 'none'
    const C = diffL ? 'block' : 'none'
    const D = diffL ? 'none' : 'block'
    if (!this.$('.demo-toc-progress')) return
    // this.$('.demo-toc--ex-intro').style.display = A
    this.$('.demo-toc--ex-edit1').style.display = B
    this.$('.demo-toc--ex-edit2').style.display = C
    this.$('.demo-toc-progress').style.display = D
    this.$('.demo-toc-note-title').style.display = D
    // reset URL && title bar
    if (diffL) {
      if (window.convo) window.convo.hide()
      utils.updateURL(null)
      NNW.updateTitleBar(null)
    } else if (this.demoName) {
      if (this.demoType !== 'custom') utils.updateURL(`?demo=${this.demoKey}`)
      NNW.updateTitleBar(this.demoName)
      if (this.info) NNW.title.dataset.demo = true
    }
    if (this.info) {
      WIDGETS['demo-toc'].update({ bottom: 20 }, 500)
    }
  }

  _openSpot () {
    const pt = nn.get('#proj-title')
    const pad = pt.style.padding.split(' ').map(v => parseInt(v))
    const cx = pt.x + ((pt.width - (pad[1] + pad[3])) / 2) + pad[3]
    let x = cx - this.width / 2
    let y = pt.y + pt.height
    let w = 490
    if (this.info?.length > 0) {
      w = nn.get('#nn-window').width * 0.75
      x = nn.get('#nn-window').width * 0.125
      y = 20
    }
    return { x, y, w }
  }
}

window.DemoToc = DemoToc
