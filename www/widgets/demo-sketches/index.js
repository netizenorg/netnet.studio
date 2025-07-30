/* global WIDGETS, Widget, Convo, nn, utils */
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

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    utils.get('api/examples', (res) => {
      this.examples = res.data
      Object.entries(this.examples).forEach(a => this._createDemoItem(a))
    })

    utils.get(`./widgets/${this.key}/demoscene/index.html`, html => {
      this.demoscene = WIDGETS.create({
        key: 'the-demoscene',
        listed: true,
        title: 'the demoscene',
        innerHTML: html
      })
    }, true)

    this._createHTML()

    this.on('open', () => {
      // this.$('.demo-search input').focus()
      // TODO convo that explains the widget
    })

    this.on('close', () => {
      if (this._expanded) this.expand()
      this.$('.demo-search input').value = ''
      this._hideResults()
    })

    this.on('movestart', () => {
      window.cancelAnimationFrame(this._bgAnimCall)
      this.$('.demo-icon-rotating').classList.add('demo-paused')
      this.$('.demo-icon-bg').classList.add('demo-paused')
    })
    this.on('moveend', () => {
      this._bgAnimation()
      this.$('.demo-icon-rotating').classList.remove('demo-paused')
      this.$('.demo-icon-bg').classList.remove('demo-paused')
    })
  }

  _createHTML () {
    this.innerHTML = `
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

    // TODO:
    //   text-shadow: -4px -2px 3px rgba(0,0,0,0.8);
    // generate shadows for icon && title dynamically
    // const c = nn.hex2rgb(utils.getVal('--bg-color'))

    this._setupBGAnimation()

    this.$('.demo-search input')
      .addEventListener('input', (e) => this._filterResults(e))
    this.$('.demo-search input')
      .addEventListener('focus', () => this._showResults())
    // this.$('.demo-search input')
    //   .addEventListener('unfocus', () => this._hideResults())
  }

  // ------------------------------------------------------------------------

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

  // ------------------------------------------------------------------------

  _createDemoItem (arr) {
    const o = arr[1]
    let tags = []
    if (typeof o.tags === 'string') {
      o.tags.split(' ').forEach(t => { if (!tags.includes(t)) tags.push(t) })
    } else tags = o.tags
    tags = tags.filter(t => t !== '').map(t => t.toLowerCase())

    nn.create('span')
      .content(o.name)
      .set({ class: 'highlight' })
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
    console.log(o);
  }

  // ------------------------------------------------------------------------

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
}

window.DemoSketches = DemoSketches
