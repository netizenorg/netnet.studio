/* global WIDGETS Widget NNE Convo nn */
class TemplateToc extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'template-toc'
    this.listed = false
    this.title = 'Project Template Guide'
    this.left = 150
    this.bottom = 20

    this.selected = null
    this.info = []

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.ele.querySelector('.widget__inner-html').classList.add('template-toc')
    this.innerHTML = `
      <div>
        <p class="template-toc-disclaimer">This Widget will display a progress bar with keyframes you can use to skip to different notes in a guided template. You are not currently viewing a template, so there is nothing to see here, but you can choose to launch a guided template using the <span class="link" onclick="WIDGETS.open('template-projects')">Template Projects</span> widget.</p>
      </div>
      <div class="template-toc-progress" role="group" aria-label="lesson progress"></div>
      <div class="template-toc-note-title"></div>
    `

    this.on('open', () => {
      this.updateView()
      const { x, y, w } = this._openSpot()
      // this.update({ top: y, left: x, width: w }, 500)
      this.update({ bottom: y, left: x, width: w }, 500)
    })
  }

  updateView () {
    const tp = WIDGETS['template-projects']
    if (!tp?.state?.lines) {
      this.info = []
      this.selected = null
      this.$('.template-toc-progress').innerHTML = ''
      this.$('.template-toc-note-title').innerHTML = ''
      nn.get('.template-toc-disclaimer').css('display', 'block')
    } else {
      nn.get('.template-toc-disclaimer').css('display', 'none')
      if (typeof this.selected === 'number') {
        this.updateProgress()
      } else this._createProgressBar()
    }
  }

  updateProgress (o, i) {
    if (!o) {
      const curPassage = WIDGETS['template-projects'].state.curPassage
      o = WIDGETS['template-projects'].state.lines[curPassage]
    }

    const idx = this.info.indexOf(o)
    if (idx < 0) return

    this.selected = idx >= 0 ? idx : i
    const p = (idx / (this.info.length - 1)) * 100
    nn.get('.template-toc-progress .bar').style = `--progress: ${p}`
    nn.get('.template-toc-note-title').content(o.title)
  }

  // ---------------------------------------------------------------------------

  _createProgressBar () {
    function escapeHTML (str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
    }

    this.info = Object.values(WIDGETS['template-projects'].state.lines) || []
    if (this.info.length === 0) {
      console.log('WIDGETS: template-toc: tried to load progress bar, but no template data found')
      return
    }
    // only include lines with titles in progress bar
    this.info = this.info.filter(line => line.title)

    this.$('.template-toc-progress').innerHTML = `
      <div class="bar" style="--progress: 0;">
        <div class="track"></div>
        <div class="fill"></div>
        <div class="note-markers"></div>
      </div>`

    // create progress bar markers
    this.info.forEach(note => {
      nn.create('button')
        .set('aria-label', escapeHTML(note.title))
        .on('click', () => {
          WIDGETS['template-projects']._skipTo(note.title)
          this.updateProgress(note)
        })
        .on('mouseout', () => nn.get('.template-toc-note-title').content(this.info[this.selected].title))
        .on('mouseover', () => nn.get('.template-toc-note-title').content(note.title))
        .addTo('.template-toc-progress .note-markers')
    })
    this.selected = 0
    nn.get('.template-toc-progress .bar').style = '--progress: 0'
    nn.get('.template-toc-note-title').content(this.info[0].title)
  }

  _openSpot () {
    const pt = nn.get('#proj-title')
    const pad = pt.style.padding.split(' ').map(v => parseInt(v))
    const cx = pt.x + ((pt.width - (pad[1] + pad[3])) / 2) + pad[3]
    let x = cx - this.width / 2
    let y = pt.y + pt.height
    let w = 490

    if (this.info.length > 0) {
      w = nn.get('#nn-window').width * 0.75
      x = nn.get('#nn-window').width * 0.125
      y = 20
    }
    return { x, y, w }
  }
}

window.TemplateToc = TemplateToc
