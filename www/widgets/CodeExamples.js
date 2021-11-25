/* global WIDGETS, Widget, Convo, NNW, NNE, Netitor, utils */
class CodeExamples extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'code-examples'
    this.keywords = ['ex', 'code', 'examples', 'snippets', 'demos']
    this.title = 'Code Examples'

    this.editor = null // netitor instance
    this.lastClickedExample = { key: null, code: null }
    this.height = 471

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.on('resize', (e) => this._resizeIt(e))
    this.on('open', () => {
      this._resizeIt({ width: this.width, height: this.height })
    })
    this.on('close', () => this._createHTML())

    utils.get('api/examples', (res) => {
      this.mainOpts = {
        name: 'code-examples-main',
        widget: this,
        ele: this._createMainSlide(res)
      }

      this._createHTML()

      NNW.on('theme-change', () => { this._createHTML() })
    })
  }

  beforeLoadingEx () {
    window.convo = new Convo(this.convos, 'before-loading-example')
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

    this.ele.style.padding = '8px 5px 10px'
    this.ele.querySelector('.w-top-bar').style.padding = '0px 15px 0px'
    this.ele.querySelector('.w-innerHTML').style.padding = '10px 0px'

    this.slide.updateSlide(this.mainOpts)
  }

  _createMainSlide (res) {
    if (res.success) {
      const ele = document.createElement('div')
      ele.style.display = 'grid'
      ele.style.gridTemplateColumns = '1fr 1fr'
      ele.style.gridGap = '10px'
      ele.style.marginTop = '-24px'
      ele.innerHTML = `
        <style>
          .code-examples--link {
            position: relative;
            color: var(--netizen-meta);
            text-decoration: none;
            transition: color .5s ease, border .5s ease;
            line-height: 28px;
            /*underline*/
            border-bottom: 1px solid var(--netizen-meta);
            text-shadow: -2px 2px var(--bg-color), 0px 2px var(--bg-color), -1px 2px var(--bg-color), 1px 1px var(--bg-color);
          }

          .code-examples--link:hover {
            color: var(--netizen-match-color);
            border-bottom: 1px solid var(--netizen-match-color);
            cursor: pointer;
          }

          .code-examples--link:active {
            color: var(--netizen-attribute);
          }
        </style>
      `

      const sections = {}
      for (const key in res.data) {
        const obj = res.data[key]
        obj.key = key
        if (!sections[obj.type]) { sections[obj.type] = [] }
        sections[obj.type].push(obj)
      }

      for (const sec in sections) {
        const div = document.createElement('div')
        const h2 = document.createElement('h2')
        h2.textContent = sec
        div.appendChild(h2)
        sections[sec].forEach(o => {
          const span = document.createElement('span')
          span.className = 'code-examples--link'
          span.textContent = o.name
          span.addEventListener('click', () => {
            const opts = this._createExOpts(o)
            this.slide.updateSlide(opts)
            this.lastClickedExample = o
            window.utils.afterLayoutTransition(() => {
              this._updateEditor(o)
              this._updateListeners()
              this._resizeIt({ width: this.width, height: this.height })
            })
            window.convo = new Convo(this.convos, 'example-info')
          })
          div.appendChild(span)
          div.appendChild(document.createElement('br'))
        })
        ele.appendChild(div)
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
          z-index: -1;
          visibility: hidden;
        }

      </style>
      <div class="code-examples--nav">
        <b class="code-examples--name">${o.name}</b>
        <b class="code-examples--reset">reset code</b>
        <b class="code-examples--copy">copy+paste</b>
      </div>
      <div class="code-examples--tabs">
        <b class="ce--sel">code</b>
        <b>result</b>
      </div>
      <div class="code-examples--editor"></div>
      <div class="code-examples--render"></div>
    `
    return { name, widget, back, ele }
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
    const reset = this.ele.querySelector('.code-examples--reset')
    const copy = this.ele.querySelector('.code-examples--copy')

    name.addEventListener('click', () => {
      window.convo = new Convo(this.convos, 'example-info')
    })

    reset.addEventListener('click', () => {
      const code = this.lastClickedExample.code.substr(6)
      const curExCode = NNE._encode(this.editor.code)
      if (code === curExCode) {
        window.convo = new Convo(this.convos, 'nothing-to-reset')
      } else {
        this.editor.code = NNE._decode(code)
        this.editor.update()
        window.convo = new Convo(this.convos, 'reset-code')
      }
    })

    copy.addEventListener('click', () => this.beforeLoadingEx())

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

  _resizeIt (e) {
    const top = 172 // widget's initial height (471) - editor height (299)
    const lef = 52 // widget's initial width (612) - editor width (560)
    const wst = 71 // widget's initial height (471) - widget-slide (400)
    const wsl = 12 // widget's initial width (612) - widget-slide (600)
    const frt = 95 // widget's initial height (471) - frame height (376)
    const rws = this.ele.querySelector('.reference-widget--slide')
    const nav = this.ele.querySelector('.reference-widget--nav')
    const frm = this.ele.querySelector('.code-examples--frame')
    const edi = this.ele.querySelector('.code-examples--editor')
    const rdr = this.ele.querySelector('.code-examples--render')
    if (this.slide) this.slide.style.maxHeight = `${e.height - wst}px`
    if (this.slide) this.slide.style.width = `${e.width - wsl}px`
    if (rws) rws.style.height = `${e.height - wst}px`
    if (frm) frm.style.height = `${e.height - frt}px`
    if (edi) edi.style.height = `${e.height - top}px`
    if (rdr) rdr.style.height = `${e.height - top}px`
    if (rws) rws.style.width = `${e.width - lef}px`
    if (nav) nav.style.width = `${e.width + 8}px`
    if (frm) frm.style.width = `${e.width - lef}px`
    if (edi) edi.style.width = `${e.width - lef}px`
    if (rdr) rdr.style.width = `${e.width - lef}px`
    if (rdr) rdr.style.top = `-${e.height - top}px`
  }
}

window.CodeExamples = CodeExamples
