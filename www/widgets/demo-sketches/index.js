/* global Netitor, NNE, WIDGETS, Widget, Convo, nn, utils */
class DemoSketches extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'demo-sketches'
    this.listed = true
    this.keywords = ['ex', 'code', 'examples', 'snippets', 'sketch', 'demo', 'remix']
    this.title = 'Code Demos'
    this.width = 612
    this.height = 471
    this.expandable = true
    this.viewingDemo = false

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    utils.get('api/demos', (res) => {
      this.demos = res.data
      Object.entries(this.demos).forEach(a => this._createDemoItem(a))
    })

    this._createHTML()

    this.on('open', () => {
      if (this.convos instanceof Array) window.convo = new Convo(this.convos, 'intro')
    })

    this.on('resize', () => {
      this._resizePreview()
    })

    this.on('close', async () => {
      if (this._expanded) this.expand()
      if (this.viewingDemo) {
        this.slide.updateSlide(this.mainSlideOpts)
        await nn.sleep(utils.getVal('--menu-fades-time'))
        this.$('.demo-search input').value = ''
        this._hideResults()
      } else {
        this.$('.demo-search input').value = ''
        this._hideResults()
      }
    })

    this.on('movestart', () => {
      if (this.slide.getName() === 'demo') return
      window.cancelAnimationFrame(this._bgAnimCall)
      this.$('.demo-icon-rotating').classList.add('demo-paused')
      this.$('.demo-icon-bg').classList.add('demo-paused')
    })
    this.on('moveend', () => {
      if (this.slide.getName() === 'demo') return
      this._bgAnimation()
      this.$('.demo-icon-rotating').classList.remove('demo-paused')
      this.$('.demo-icon-bg').classList.remove('demo-paused')
    })
  }

  random () {
    const demo = nn.random(Object.values(this.demos))
    this._displayDemo(demo)
  }

  // ---------------------------------------------------------- CREATE HTML VIEW

  _createHTML () {
    if (!utils.customElementReady('widget-slide')) {
      setTimeout(() => this._createHTML(), 100)
      return
    }

    // main slide...............
    this.mainSlideOpts = {
      name: 'main',
      widget: this,
      ele: this._createMainEle(),
      cb: () => { this.viewingDemo = false }
    }
    this.slide = nn.create('widget-slide')
    this.slide.updateSlide(this.mainSlideOpts)
    this.innerHTML = this.slide

    this._setupBGAnimation()

    this.$('.demo-search input')
      .addEventListener('input', (e) => this._filterResults(e))
    this.$('.demo-search input')
      .addEventListener('focus', () => this._showResults())
    this.$('.demo-search button')
      .addEventListener('focus', () => this.random())
  }

  _createMainEle () {
    // TODO:
    //   text-shadow: -4px -2px 3px rgba(0,0,0,0.8);
    // generate shadows for icon && title dynamically
    // const c = nn.hex2rgb(utils.getVal('--bg-color'))
    const ele = nn.create('div')
    ele.innerHTML = `
      <div class="demo-scene">
        <div class="demo-title">DEMOS</div>
        <div class="demo-icon-bg"></div>
        <div class="demo-icon-rotating">&lt;/&gt;</div>
      </div>
      <canvas id="demo-tunnel"></canvas>
      <div class="demo-sub-title">
        a collection of example code sketches to remix and learn from
      </div>
      <div class="demo-search">
        <div>
          <input type="text" placeholder="search demos">
          <button class="pill-btn pill-btn--secondary">random demo</button>
        </div>
      </div>
      <div class="demos-list">
        <!-- demos listed here -->
      </div>
    `
    return ele
  }

  _createDemoEle (o) {
    const ele = nn.create('div')
    const a = o.info ? 'block' : 'none'
    const f = this.width <= 612 ? 'block' : 'none'
    ele.innerHTML = `
      <div class="demo-sec-header">
        <div class="demo-sec-title">${o.name}</div>
        <div>
          <button class="pill-btn pill-btn--secondary">open</button>
          <select class="pill-btn pill-btn--secondary">
            <option value="same">in this window</option>
            <option value="tab">in a new tab</option>
          </select>
        </div>
      </div>
      <div class="demo-sec-tips">
        <p style="display: ${f};">Click the <span class="demo-fs-icon"></span> icon to view this full screen</p>
        <p style="display: ${a};">This demo has <i>●</i> annotations, open it to view them</p>
      </div>
      <div class="demo-preview--toggle">hide code</div>
      <div id="demo-preview">
        <div class="demo-preview--render"></div>
        <div class="demo-preview--editor"></div>
      </div>
    `

    ele.querySelector('.demo-sec-header button')
      .addEventListener('click', () => {
        const type = ele.querySelector('.demo-sec-header select').value
        if (type === 'same') utils.loadDemo(o.key)
        else {
          const l = window.location
          const url = `${l.protocol}//${l.host}?demo=${o.key}`
          window.open(url, '_blank', 'noopener,noreferrer')
        }
      })

    ele.querySelector('.demo-preview--toggle').addEventListener('click', (e) => {
      const editor = this.$('.demo-preview--editor')
      if (editor.style.display === 'none') {
        e.target.textContent = 'hide code'
        editor.style.display = 'block'
      } else {
        e.target.textContent = 'show code'
        editor.style.display = 'none'
      }
    })

    return ele
  }

  _updateEditor (code) {
    this.editor = new Netitor({
      ele: '.demo-preview--editor',
      render: '.demo-preview--render',
      renderWithErrors: true,
      background: false,
      autoUpdate: true,
      theme: NNE.theme,
      code: NNE._decode(code.substr(6))
    })

    this.editor.on('cursor-activity', (e) => {
      window.convo.hide()
    })

    this.editor.on('edu-info', (e, eve) => {
      if (e.language === 'html') WIDGETS['html-reference'].textBubble(e)
      if (e.language === 'css') WIDGETS['css-reference'].textBubble(e)
      else if (e.language === 'javascript') WIDGETS['js-reference'].textBubble(e)
    })

    const c = nn.hex2rgb(utils.getVal('--bg-color'))
    const bg = `rgba(${c.r}, ${c.g}, ${c.b}, 0.9)`
    this.$('.demo-preview--editor').style.background = bg
  }

  _resizePreview () {
    const preview = this.$('#demo-preview')
    if (!preview) return
    const render = this.$('.demo-preview--render')
    const toggle = this.$('.demo-preview--toggle')
    const p = 78
    const n = this.$('.reference-widget__nav').offsetHeight
    const h = this.$('.demo-sec-header').offsetHeight
    const t = this.$('.demo-sec-tips').offsetHeight
    preview.style.height = this.height - n - h - t - p + 'px'
    render.style.height = this.height - n - h - t - p - 2 + 'px'
    toggle.style.top = preview.offsetTop - 27 + 'px'
  }

  // -------------------------------------------------------------- LIST RESULTS

  _createDemoItem (arr) {
    const o = arr[1]
    let tags = []
    if (typeof o.tags === 'string') {
      o.tags.split(' ').forEach(t => { if (!tags.includes(t)) tags.push(t) })
    } else tags = o.tags
    tags = tags.filter(t => t !== '').map(t => t.toLowerCase())

    const css = o.info ? 'highlight annotated' : 'highlight'

    nn.create('span')
      .content(o.name)
      .set({ class: css })
      .set({ name: tags.join(' ') })
      .addTo(this.$('.demos-list'))
      .on('click', () => this._displayDemo(o))
  }

  _filterResults (e) {
    const v = e.target.value
    const ele = this.$('.demos-list')
    const res = [...ele.children]
    res.forEach(ele => {
      if (v === '') ele.classList.remove('demo--hide')
      else {
        let pass = false
        if (ele.getAttribute('name').split(' ').includes(v)) pass = true
        if (ele.textContent.trim().includes(v)) pass = true
        if (pass) {
          ele.classList.remove('demo--hide')
        } else ele.classList.add('demo--hide')
      }
    })
  }

  _displayDemo (o) {
    const callback = () => {
      this.viewingDemo = true
      setTimeout(() => {
        this._resizePreview()
        this._updateEditor('#code/eJzT09PLyU9MycxL19PTAwAbtAPz') // loading text
        utils.get(`api/demo/${o.key}`, (demo) => {
          this.editor.code = NNE._decode(demo.code.substr(6))
        })
      }, 500)
    }
    this.demoSlideOpts = {
      name: 'demo',
      widget: this,
      back: this.mainSlideOpts,
      ele: this._createDemoEle(o),
      class: 'demo-sec',
      cb: callback
    }
    this.slide.updateSlide(this.demoSlideOpts)
  }

  // ------------------------------------------------------- UPDATE RESULTS VIEW

  _showResults () {
    window.cancelAnimationFrame(this._bgAnimCall)

    nn.get(this.$('.demo-title')).css({ opacity: 0 })
    nn.get(this.$('.demo-icon-bg')).css({ opacity: 0 })
    nn.get(this.$('.demo-icon-rotating')).css({ opacity: 0 })

    nn.get(this.$('.demo-search')).css({
      paddingTop: '94px',
      top: '0px'
    })
    nn.get(this.$('.demo-sub-title')).css({
      padding: '20px 70px',
      top: '0px'
    })

    nn.get(this.$('#demo-tunnel')).css({ opacity: 0.3 })
    nn.get(this.$('.demos-list')).css({ display: 'grid' })
    setTimeout(() => {
      nn.get(this.$('.demos-list')).css({ opacity: 1 })
    }, 100)

    const delay = parseInt(utils.getVal('--demo-screen-tt'))
    setTimeout(() => {
      nn.get(this.$('.demo-title')).css({ display: 'none' })
      nn.get(this.$('.demo-icon-bg')).css({ display: 'none' })
      nn.get(this.$('.demo-icon-rotating')).css({ display: 'none' })
    }, delay)
  }

  _hideResults () {
    this._bgAnimation()

    nn.get(this.$('.demo-title')).css({ display: 'block' })
    nn.get(this.$('.demo-icon-bg')).css({ display: 'block' })
    nn.get(this.$('.demo-icon-rotating')).css({ display: 'block' })

    nn.get(this.$('.demos-list')).css({ opacity: 0 })
    nn.get(this.$('#demo-tunnel')).css({ opacity: 1 })

    nn.get(this.$('.demo-search')).css({
      paddingTop: '137px',
      top: 'calc(100% / 2)'
    })
    nn.get(this.$('.demo-sub-title')).css({
      padding: '60px 70px',
      top: 'calc(100% / 2)'
    })

    setTimeout(() => {
      nn.get(this.$('.demo-title')).css({ opacity: 1 })
      nn.get(this.$('.demo-icon-bg')).css({ opacity: 1 })
      nn.get(this.$('.demo-icon-rotating')).css({ opacity: 1 })
    }, 100)

    const delay = parseInt(utils.getVal('--demo-screen-tt'))
    setTimeout(() => {
      nn.get(this.$('.demos-list')).css({ display: 'none' })
    }, delay)
  }

  // ----------------------------------------- MAIN SLIDE DEMO TUNNEL BACKGROUND

  _setupBGAnimation () {
    const canvas = this.$('#demo-tunnel')
    const ctx = canvas.getContext('2d')
    const tunnel = []
    const maxDepth = 100
    const rings = 30
    const segments = 30
    const speed = 0.04

    const resize = () => {
      const padding = 40
      canvas.width = this.width - padding
      canvas.height = this.height - padding
    }

    const setup = () => {
      for (let i = 0; i < rings; i++) {
        const depth = i * (maxDepth / rings)
        tunnel.push({ z: depth })
      }
      resize()
    }

    this._bgAnimation = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const c = nn.hex2rgb(utils.getVal('--netizen-meta'))
      ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, 0.25)`
      ctx.lineWidth = 1
      ctx.translate(canvas.width / 2, canvas.height / 2)

      tunnel.forEach(ring => {
        ring.z -= speed
        if (ring.z < 1) ring.z = maxDepth

        const radius = 2000 / ring.z
        for (let i = 0; i < segments; i++) {
          const angle1 = (i / segments) * Math.PI * 2
          const angle2 = ((i + 1) / segments) * Math.PI * 2

          const x1 = Math.cos(angle1) * radius
          const y1 = Math.sin(angle1) * radius
          const x2 = Math.cos(angle2) * radius
          const y2 = Math.sin(angle2) * radius

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      })

      // draw lines connecting rings
      for (let i = 0; i < segments; i++) {
        ctx.beginPath()
        for (let j = 0; j < tunnel.length; j++) {
          const ring = tunnel[j]
          const radius = 2000 / ring.z
          const angle = (i / segments) * Math.PI * 2
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          if (j === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      this._bgAnimCall = window.requestAnimationFrame(() => this._bgAnimation())
    }

    this.on('resize', resize)
    setup()
    this._bgAnimation()
  }
}

window.DemoSketches = DemoSketches
