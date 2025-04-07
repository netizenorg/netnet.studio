/* global WIDGETS, Widget, Convo, NNE, NNW, Netitor, utils, Fuse */
class CodeExamples extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'code-examples'
    this.keywords = ['ex', 'code', 'examples', 'snippets', 'demos']
    this.title = 'Code Examples'
    this.height = 471
    this.expandable = true

    this.editor = null // netitor instance
    this.exData = { key: null, code: null, name: null }

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('resize', (e) => this._resizeIt(e))
    this.on('open', () => {
      this._resizeIt({ width: this.width, height: this.height })
    })
    this.on('close', () => {
      const render = this.$('.code-examples--render')
      if (render && render.style.visibility !== 'hidden') this.back()
    })

    utils.get('api/examples', (res) => {
      this.mainOpts = {
        name: 'code-examples-main',
        widget: this,
        ele: this._createMainSlide(res),
        cb: () => {
          this._resizeWidget(612, 471)
          if (window.convo) window.convo.hide()
          NNE.remove('code-update', this._editorChange)
          NNE.marker(null)
          this.title = 'Code Examples'
        }
      }

      this._createHTML()

      // NNW.on('theme-change', () => { this._createHTML() })
    })
  }

  back () {
    this.slide.updateSlide(this.mainOpts)
  }

  newExData (data) {
    this.exData = { key: null, code: null, name: null }
    for (const p in this.exData) { if (data[p]) this.exData[p] = data[p] }
    if (data.hash) this.exData.hash = data.hash
    if (data.hash && !this.exData.code) this.exData.code = data.hash
    if (data.info) this.exData.info = data.info
    if (data.layout) this.exData.layout = data.layout
  }

  displayEx (o) {
    this.ele.querySelector('.reference-widget').style.padding = '0px 25px 0px 7px'
    // display selected example in the Widget's editor
    const opts = this._createExOpts(o)
    this.slide.updateSlide(opts)
    this.newExData(o)
    window.utils.afterLayoutTransition(() => {
      this._updateEditor(o)
      this._updateListeners()
      this._resizeIt({ width: this.width, height: this.height })
    })
    window.convo = new Convo(this.convos, 'example-info')
  }

  loadExample (example, calledBy, dem) {
    if (!this.slide) {
      setTimeout(() => this.loadExample(example, calledBy, dem), 100)
      return
    }

    const checkB4Load = ['search', 'guide', 'guide-template']
    if (checkB4Load.includes(calledBy) && NNW.layout !== 'welcome') {
      const eNum = Number(example)
      const isNum = (typeof example === 'number' || (typeof eNum === 'number' && !isNaN(eNum)))
      if (isNum) this.exData.key = example
      window.convo = new Convo(this.convos, 'before-loading-example')
      return
    }

    const loadIt = (json) => {
      // if (calledBy === 'url' || NNW.layout === 'welcome') {
      //   NNW.layout = 'dock-left'
      // }
      if (WIDGETS['student-session'].getData('opened-project')) {
        WIDGETS['student-session'].clearProjectData()
      }
      if (!json.key) json.key = example
      this.newExData(json)
      utils.setCustomRenderer(null)
      const eNum = Number(example)
      const isNum = (typeof example === 'number' || (typeof eNum === 'number' && !isNaN(eNum)))
      if (isNum) utils.updateURL(`?ex=${this.exData.key}`)
      if (this.exData.layout) NNW.layout = this.exData.layout
      else NNW.layout = 'dock-left'
      setTimeout(() => NNE.cm.refresh(), 10)
      NNE.code = NNE._decode(json.hash.substr(6))
      if (dem) {
        //WIDGETS.load('DemoExampleMaker.js')
        WIDGETS.open('demo-example-maker')
      } else if (json.info) { // annotated
        this.explainExample()
        window.convo = new Convo(this.convos, 'loaded-explainer')
      } else {
        if (this.opened) this.close()
        window.convo = new Convo(this.convos, 'loaded-example')
      }
      if (calledBy === 'url') {
        window.utils.afterLayoutTransition(() => utils.fadeOutLoader(false))
      }
    }

    if (typeof example === 'object') {
      // if loaded via utils.loadCustomExample
      loadIt(example)
      return
    }

    if (WIDGETS['learning-guide'] && WIDGETS['learning-guide'].opened) {
      WIDGETS['learning-guide'].close()
    }
    // request example json data...
    window.utils.post('./api/example-data', { key: example }, json => loadIt(json))
  }

  explainExample () {
    this.exData.explaining = true
    const data = this.exData
    if (data.name) this.title = data.name
    if (!this.opened) this.open()
    // display table-of-contents slide in the widget
    const opts = this._createExplainerOpts()
    opts.cb = () => {
      this._resizeWidget(455, 330, 22, 22)
      NNE.code = NNE._decode(data.code.substr(6))
      data.length = NNE.cm.lineCount()
      NNE.update()
    }
    this.slide.updateSlide(opts)
    // add netitor markers
    const occupiedLines = []
    const addMarker = (o, i) => {
      const l = (i === 0 && !o.focus) ? 1 : o.focus ? o.focus[0] : null
      if (l && !occupiedLines.includes(l)) {
        const m = NNE.marker(l, 'green', () => this._explainerClick(data, o))
        m.setAttribute('title', o.title)
        occupiedLines.push(l)
      }
    }
    utils.afterLayoutTransition(() => {
      data.info.forEach((o, i) => addMarker(o, i))
      WIDGETS['code-review'].addIssueMarkers()
    })
  }

  startExplination () {
    if (this.exData && this.exData.info && this.exData.info[0]) {
      const first = this.exData.info[0]
      this._explainerClick(this.exData, first)
    }
  }

  cancelExample () {
    if (this.opened) {
      this.close()
      NNE.spotlight(null)
      NNE.marker(null)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML () {
    if (!utils.customElementReady('widget-slide')) {
      setTimeout(() => this._createHTML(), 100)
      return
    }

    this.slide = document.createElement('widget-slide')
    this.innerHTML = this.slide

    this.ele.querySelector('.widget__top').style.padding = '0px 15px 0px'
    this.ele.querySelector('.widget__inner-html').style.padding = '10px 0px'

    this.slide.updateSlide(this.mainOpts)
  }

  _createMainSlide (res) {
    if (res.success) {
      const ele = document.createElement('div')
      ele.innerHTML = `
        <div class="code-examples-index--tabs">
          <b data-tab="search">search all</b>
          <b data-tab="curated" class="ce--sel">curated collections</b>
        </div>
        <div class="code-examples-search" style="display: none">
          <nav>
            <input class="input input--lg" type="search" placeholder="search..."> filter by: &nbsp;
            <select class="dropdown dropdown--invert"><option value="all">[ALL TAGS]</option></select>
          </nav>
          <ul><!-- list searchable examlpes --></ul>
        </div>
        <div class="code-examples-curated"></div>
      `

      const tabSelect = (e) => {
        ele.querySelectorAll('.code-examples-index--tabs b').forEach(tab => {
          const selected = [...tab.classList].includes('ce--sel')
          if (selected) {
            tab.classList.remove('ce--sel')
            const div = ele.querySelector(`.code-examples-${tab.dataset.tab}`)
            div.style.display = 'none'
          } else {
            tab.classList.add('ce--sel')
            const div = ele.querySelector(`.code-examples-${tab.dataset.tab}`)
            div.style.display = 'grid'
          }
        })
      }

      ele.querySelectorAll('.code-examples-index--tabs b').forEach(tab => {
        tab.addEventListener('click', tabSelect)
      })

      const clk = (eve, o) => {
        const p = eve.target.parentNode
        const update = (pnt, s) => { // update styles
          pnt.querySelector('.ce__edit').style.display = s === 'a' ? 'none' : 'inline-block'
          pnt.querySelector('.ce__prev').style.display = s === 'a' ? 'none' : 'inline-block'
          pnt.querySelector('.ce__link').style.display = s === 'a' ? 'inline-block' : 'none'
        }
        if (p.querySelector('.ce__edit').style.display === 'none') {
          this.$('.ce__lnx').forEach(span => update(span, 'a')); update(p, 'b')
        } else {
          if (eve.target.classList.contains('ce__prev')) this.displayEx(o)
          else {
            this.exData.key = o.key
            this.convos = window.CONVOS[this.key](this)
            if (NNW.layout === 'welcome') this.loadExample(this.exData.key)
            else window.convo = new Convo(this.convos, 'before-loading-example')
          }
          update(p, 'a')
        }
      }

      const itemSetupHTML = (ele, o, tags) => {
        ele.className = 'ce__lnx'
        ele.innerHTML = `
          <span class="ce__link inline-link inline-link--secondary">${o.name}</span>
          <span class="ce__edit inline-link inline-link--secondary" style="display: none;">📝 edit</span>
          <span class="ce__prev inline-link inline-link--secondary" style="display: none;">👀 preview</span>
          ${tags ? '<span class="ce__tags"></span>' : ''}
        `
        ele.querySelector('.ce__link').addEventListener('click', e => clk(e, o))
        ele.querySelector('.ce__edit').addEventListener('click', e => clk(e, o))
        ele.querySelector('.ce__prev').addEventListener('click', e => clk(e, o))
        return ele
      }

      // ----------------------------------------------------------------
      // search examples sections
      // ----------------------------------------------------------------

      const sel = ele.querySelector('.code-examples-search select')
      const TAGS = []
      const DATA = res.data
      let SEARCH

      const onSelectChange = e => {
        const v = e.target.value
        const ul = ele.querySelector('.code-examples-search ul')
        if (!ul) return
        [...ul.children].forEach(ele => {
          if (v === 'all') ele.classList.remove('ce--hide')
          else {
            if (ele.getAttribute('name').split(' ').includes(v)) {
              ele.classList.remove('ce--hide')
            } else ele.classList.add('ce--hide')
          }
        })
      }

      const createItem = o => {
        let tags = []
        if (typeof o.tags === 'string') {
          o.tags.split(' ').forEach(t => { if (!tags.includes(t)) tags.push(t) })
        } else tags = o.tags
        tags = tags.filter(t => t !== '').map(t => t.toLowerCase())

        let li = document.createElement('li')
        li.setAttribute('name', tags.join(' '))
        li = itemSetupHTML(li, o, true)

        tags.forEach(t => {
          const s = document.createElement('span')
          s.textContent = s.value = t
          s.addEventListener('click', (e) => {
            sel.value = e.target.value; onSelectChange(e)
          })
          li.querySelector('.ce__tags').appendChild(s)
          if (TAGS.indexOf(t) < 0) TAGS.push(t)
        })

        ele.querySelector('.code-examples-search ul').appendChild(li)
      }

      const createSearch = json => {
        const arr = []

        const split = (tags) => {
          // legacy examples are space separated, but new ones are comma separated
          if (typeof tags === 'string') return tags.split(' ')
          else return tags
        }

        for (const i in json.data) {
          const ex = json.data[i]
          const tags = ex.tags ? split(ex.tags) : []
          const name = ex.name.split(' ').filter(s => !s.includes('element'))
          const keywords = [...tags, ...name]
          arr.push({
            word: ex.name,
            tags: keywords,
            example: ex
          })
        }

        SEARCH = new Fuse(arr, {
          ignoreLocation: true,
          includeScore: true,
          includeMatches: true,
          keys: [
            { name: 'word', weight: 1 },
            { name: 'tags', weight: 0.5 }
          ]
        })
      }

      const runSearch = e => {
        const res = SEARCH.search(e.target.value).filter(o => o.score < 0.5)
        ele.querySelector('.code-examples-search ul').innerHTML = ''
        if (e.target.value !== '') {
          res.forEach(obj => createItem(obj.item.example))
        } else {
          for (const k in DATA) createItem(DATA[k])
        }
      }

      //
      // .... setup ...
      //
      for (const k in res.data) createItem(res.data[k])
      TAGS.forEach(t => { // create select options
        const o = document.createElement('option')
        o.setAttribute('value', t)
        o.textContent = t
        sel.appendChild(o)
      })
      sel.addEventListener('input', onSelectChange)
      createSearch(res)
      ele.querySelector('.code-examples-search [type="search"]')
        .addEventListener('input', runSearch)

      // ----------------------------------------------------------------
      // cureated list sections
      // ----------------------------------------------------------------

      const sections = {}
      res.sections.forEach(sec => {
        sections[sec.name] = []
        sec.listed.forEach(id => {
          sections[sec.name].push(res.data[id])
        })
      })

      for (const sec in sections) {
        const div = document.createElement('div')
        const h2 = document.createElement('h2')
        h2.textContent = sec
        div.appendChild(h2)
        sections[sec].forEach(o => {
          let span = document.createElement('span')
          span = itemSetupHTML(span, o)
          div.appendChild(span)
          div.appendChild(document.createElement('br'))
        })
        ele.querySelector('.code-examples-curated').appendChild(div)
      }
      return ele
    } else {
      console.error('CodeExamples:', res)
    }
  }

  _createExOpts (o) {
    const name = 'test'
    const widget = this
    const back = this.mainOpts
    const ele = document.createElement('div')
    ele.className = 'code-examples--frame'
    ele.style.height = '376px'
    ele.style.overflow = 'hidden'
    ele.innerHTML = `
      <style>
        .code-examples--nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0;
        }
        .code-examples--nav > b {
          border-bottom: 1px solid transparent;
        }
        .code-examples--nav > b:hover {
          cursor: pointer;
          color: var(--netizen-match-color);
          border-bottom: 1px solid var(--netizen-match-color);
        }

        .code-examples--tabs {
          display: flex;
        }

        .code-examples--tabs > b {
          border: 1px solid var(--fg-color);
          border-radius: 8px 8px 0 0;
          border-bottom: none;
          padding: 4px 20px;
          background: var(--bg-color);
          color: var(--fg-color);
          cursor: pointer;
        }

        .code-examples--tabs > b.ce--sel {
          background: var(--fg-color);
          color: var(--bg-color);
        }

        .code-examples--editor,
        .code-examples--render {
          border: 1px solid var(--fg-color);
          height: 299px;
        }
        .code-examples--render {
          background: white;
          position: relative;
          top: -299px;
          z-index: 10;
          /* z-index: -1; */
          /* visibility: hidden; */
        }

      </style>
      <div class="code-examples--nav">
        <b class="code-examples--name">${o.name}</b>
        <b class="code-examples--explain">${o.info ? 'explain' : 'experiment'}</b>
      </div>
      <div class="code-examples--tabs">
        <b>code</b>
        <b class="ce--sel">result</b>
      </div>
      <div class="code-examples--editor"></div>
      <div class="code-examples--render"></div>
    `
    return { name, widget, back, ele }
  }

  _createExplainerOpts () { // TOC
    const data = this.exData
    const name = 'explainer'
    const widget = this
    const back = this.mainOpts
    const ele = document.createElement('div')
    ele.className = 'code-explainer--frame'
    // ele.style.height = '376px'
    // ele.style.overflow = 'hidden'
    ele.innerHTML = `
      <style>
        .code-examples--ex-intro,
        .code-examples--ex-edit1,
        .code-examples--ex-edit2 {
          padding-bottom: 10px;
        }
        .code-examples--ex-parts {
          display: flex;
          flex-direction: column;
        }
        .code-examples--ex-parts > li {
          padding: 2px 0px;
        }
        .code-examples--ex-edit1,
        .code-examples--ex-edit2 {
          display: none;
        }
      </style>
      <div>
        <!-- <p class="code-examples--ex-intro">Click on the parts below for it's explanation, or let netnet know if/when you want to hear the next or previous part.</p> -->
        <p class="code-examples--ex-edit1">⚠️ It looks like you've edited some of the code, that's great! It's important to experiment! But keep in mind some of netnet's explanations might be off for the parts you've changed.</p>
        <p class="code-examples--ex-edit2">⚠️ It looks like you've either added or removed a line of code. That's great, it's important to experiment!<br><br>Feel free to close this widget by pressing the "✖" or <code>${utils.hotKey()}+S</code> to save this as your own sketch or project.<br><br>Otherwise, you can press <code>${utils.hotKey()}+Z</code> if you didn't mean to do that and want to undo your change. You could also press "back" in this widget if you want to reload this or any other code example.</p>
      </div>
      <ol class="code-examples--ex-parts"></ol>
    `

    NNE.on('code-update', this._editorChange)

    data.info.forEach(part => {
      const link = document.createElement('span')
      link.className = 'inline-link inline-link--secondary'
      link.textContent = part.title
      link.addEventListener('click', () => this._explainerClick(data, part))
      const li = document.createElement('li')
      li.appendChild(link)
      ele.querySelector('.code-examples--ex-parts').appendChild(li)
    })

    return { name, widget, back, ele }
  }

  _explainerClick (data, o) {
    const idx = data.info.indexOf(o)
    if (idx === 0) {
      const m = document.querySelector('.netitor-gutter-marker')
      if (m && m.style.animation) m.style.animation = null
    }

    let options = {}
    const next = () => this._explainerClick(data, data.info[idx + 1])
    const previous = () => this._explainerClick(data, data.info[idx - 1])
    if (idx === 0) {
      options = { next }
    } else if (idx === data.info.length - 1) {
      options = { done: e => e.hide(), previous }
    } else {
      options = { next, previous }
    }
    if (!options.done) { options.done = e => e.hide() }

    window.convo = new Convo({ content: `${idx + 1}: ${o.text}`, options })

    if (o.focus instanceof Array) {
      utils.scrollToLines(o.focus)
      setTimeout(() => NNE.spotlight(o.focus), 500)
    } else NNE.spotlight(null)
  }

  // ---------------------------------------------------
  // ---------------------------------------------------
  // ---------------------------------------------------

  _editorChange () {
    const code = WIDGETS['code-examples'].exData.code.substr(6)
    const diffC = NNE.code !== NNE._decode(code)
    const len = NNE.cm.lineCount()
    const diffL = len !== WIDGETS['code-examples'].exData.length
    // const A = diffL || diffC ? 'none' : 'block'
    const B = diffC && !diffL ? 'block' : 'none'
    const C = diffL ? 'block' : 'none'
    const D = diffL ? 'none' : 'block'
    const s = WIDGETS['code-examples'].slide
    if (!s.querySelector('.code-examples--ex-parts')) return
    // s.querySelector('.code-examples--ex-intro').style.display = A
    s.querySelector('.code-examples--ex-edit1').style.display = B
    s.querySelector('.code-examples--ex-edit2').style.display = C
    s.querySelector('.code-examples--ex-parts').style.display = D
    if (window.convo && diffL) window.convo.hide()
  }

  _updateEditor (o) {
    this.editor = new Netitor({
      ele: '.code-examples--editor',
      render: '.code-examples--render',
      renderWithErrors: true,
      background: NNE.background,
      autoUpdate: false,
      theme: NNE.theme,
      code: NNE._decode(o.code.substr(6))
    })

    this.editor.on('cursor-activity', (e) => {
      window.convo.hide()
    })

    this.editor.on('edu-info', (e, eve) => {
      if (e.language === 'html') WIDGETS['html-reference'].textBubble(e)
      if (e.language === 'css') WIDGETS['css-reference'].textBubble(e)
      else if (e.language === 'javascript') WIDGETS['js-reference'].textBubble(e)
    })
  }

  _updateListeners () {
    const name = this.ele.querySelector('.code-examples--name')
    name.addEventListener('click', () => {
      window.convo = new Convo(this.convos, 'example-info')
    })

    const explain = this.ele.querySelector('.code-examples--explain')
    explain.addEventListener('click', () => {
      this.convos = window.CONVOS[this.key](this)
      if (NNW.layout === 'welcome') this.loadExample(this.exData.key)
      else window.convo = new Convo(this.convos, 'before-loading-example')
    })

    const render = this.ele.querySelector('.code-examples--render')
    const ctab = this.ele.querySelector('.code-examples--tabs > b:nth-child(1)')
    const rtab = this.ele.querySelector('.code-examples--tabs > b:nth-child(2)')

    ctab.addEventListener('click', () => {
      ctab.classList.add('ce--sel')
      rtab.classList.remove('ce--sel')
      render.style.zIndex = '-1'
      render.style.visibility = 'hidden'
    })

    rtab.addEventListener('click', () => {
      this.editor.update()
      ctab.classList.remove('ce--sel')
      rtab.classList.add('ce--sel')
      render.style.zIndex = '10'
      render.style.visibility = 'visible'
    })
  }

  _resizeWidget (w, h, r, b) {
    setTimeout(() => {
      const obj = { width: w, height: h }
      if (r) obj.right = r
      if (b) obj.bottom = b
      this.update(obj, 500)
      this.emit('resize', obj)
    }, utils.getVal('--menu-fades-time') + 600)
  }

  _resizeIt (e) {
    const top = 172 // widget's initial height (471) - editor height (299)
    const lef = 52 // widget's initial width (612) - editor width (560)
    const wst = 71 // widget's initial height (471) - widget-slide (400)
    const wsl = 12 // widget's initial width (612) - widget-slide (600)
    const frt = 95 // widget's initial height (471) - frame height (376)
    const rws = this.ele.querySelector('.reference-widget__slide')
    const nav = this.ele.querySelector('.reference-widget__nav')
    const frm = this.ele.querySelector('.code-examples--frame')
    const edi = this.ele.querySelector('.code-examples--editor')
    const rdr = this.ele.querySelector('.code-examples--render')
    const ces = this.ele.querySelector('.code-examples-search')
    if (this.slide) this.slide.style.maxHeight = `${e.height - wst}px`
    if (this.slide) this.slide.style.width = `${e.width - wsl}px`
    if (rws) rws.style.height = `${e.height - wst}px`
    if (frm) frm.style.height = `${e.height - frt}px`
    if (edi) edi.style.height = `${e.height - top}px`
    if (ces) ces.style.height = `${e.height - top}px`
    if (rdr) rdr.style.height = `${e.height - frt}px`
    if (rws) rws.style.width = `${e.width - lef}px`
    if (nav) nav.style.width = `${e.width + 8}px`
    if (frm) frm.style.width = `${e.width - lef}px`
    if (edi) edi.style.width = `${e.width - lef}px`
    if (rdr) rdr.style.width = `${e.width - lef}px`
    if (rdr) rdr.style.top = `-${e.height - top}px`
  }
}

window.CodeExamples = CodeExamples
