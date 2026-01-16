/* global Widget, WIDGETS, utils, Convo, NNE, NNW, nn, WidgetCard */
class LearningGuide extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Learning Guide'
    this.key = 'learning-guide'
    this.keywords = [
      'tutorials', 'guide', 'lesson', 'how to', 'how', 'to', 'learn', 'reference'
    ]
    this.resizable = false

    // animation related props
    this._runningStar = false
    this._raf = 0
    this._svgTimer = null

    this.cards = [] // collect WidgetCards
    this.tutCards = {} // collect current tutorial thumbnail cards

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    // load widget card class
    utils.loadFile('widgets/learning-guide/data/widget-card.js', () => {
      this._createPage('mainOpts', 'main-slide.html', null, (div) => {
        // div.querySelector('#bf-submission').addEventListener('click', () => {
        //   WIDGETS['coding-menu'].BrowserFest()
        // })

        // create sub pages
        this.subpages = [
          { id: 'aboutOpts', file: 'about.html', back: this.mainOpts }
          // {
          //   id: 'theNetOpts', file: 'the-internet.html', back: this.mainOpts,
          //   subs: [
          //     { id: 'theNetCultOpts', file: 'the-internet-cultural.html' },
          //     { id: 'theNetHistOpts', file: 'the-internet-historical.html' },
          //     { id: 'theNetTechOpts', file: 'the-internet-technical.html' }
          //   ]
          // },
          // { id: 'theWebOpts', file: 'the-web.html', back: this.mainOpts },
        ]
        this.subpages.forEach(p => {
          this._createPage(p.id, p.file, p.back, () => { // create sub-subpages
            if (p.subs) p.subs.forEach(s => this._createPage(s.id, s.file, this[p.id]))
          })
        })

        this._createHTML()

        this.update({ left: 40, top: 65 })

        this.on('close', () => this._applyVisibility())
        this.on('open', () => {
          if (this.width !== 638 || this.height !== 473) {
            this.update({ width: 638, height: 473 })
          }
          this.update({ left: 40, top: 65 }, 500)
          this._applyVisibility()
          if (WIDGETS['hyper-video-player']) WIDGETS['hyper-video-player'].pause()
        })
      })
    })

    WIDGETS['coding-menu'].on('theme-change', () => {
      const src = this.ele.querySelector('iframe').src
      this.ele.querySelector('iframe').src = src
    })
  }

  loadTemplate (name) {
    WIDGETS.load('template-projects', w => {
      if (this.opened) this.close()
      w.loadTemplate(name)
    })
  }

  scrollTo (sec) {
    if (typeof sec === 'number') {
      return this.ele.querySelector('widget-slide').scrollTo({ top: sec, behavior: 'smooth' })
    }

    const el = this.slide.querySelector(`#learning-guide-${sec}`)
    const offset = 50
    const top = el.getBoundingClientRect().top - this.slide.getBoundingClientRect().top + this.slide.scrollTop - offset
    this.slide.scrollTo({ top, behavior: 'smooth' })

    if (sec === 'toc') {
      window.convo = new Convo(this.convos, 'toc')
      NNW.menu.switchFace('happy')
    } else {
      if (window.convo) window.convo.hide()
      NNW.menu.switchFace('default')
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createPage (type, page, b, cb) {
    utils.get(`./widgets/learning-guide/data/${page}`, (html) => {
      const div = document.createElement('div')
      div.innerHTML = html

      if (page === 'the-web.html') { // update dynamic [PARTS] for "the Web" info page
        html = html.replace('[YOUR-BROWSER]', nn.platformInfo().browser.name)
        html = html.replace('[YOUR-HOTKEY]', nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL')
        utils.get('/api/user-geo', res => {
          if (res.success && res.data.city) {
            html = html.replace('[YOUR-LOCATION]', `in ${res.data.city}`)
          } else {
            html = html.replace('[YOUR-LOCATION]', '')
          }
          div.innerHTML = html
        })
      }

      const name = page.split('.')[0]
      // options objects for <widget-slide> .updateSlide() method
      this[type] = { name: name, widget: this, back: b, ele: div }
      if (type === 'mainOpts') {
        this.mainOpts.cb = () => setTimeout(() => {
          // this._createStarField()
          // this._svgAnimations()
        }, utils.getVal('--menu-fades-time'))
      }
      if (cb) cb(div)
    }, true)
  }

  _createHTML () {
    if (!utils.customElementReady('widget-slide')) {
      setTimeout(() => this._createHTML(), 100)
      return
    }

    this.slide = document.createElement('widget-slide')
    this.innerHTML = this.slide
    this.slide.addEventListener('scroll', () => this._applyVisibility())

    // this.ele.style.padding = '8px 5px 10px'
    this.ele.querySelector('.widget__top').style.padding = '0px 15px 0px'
    this.ele.querySelector('.widget__inner-html').style.padding = '0 0 10px 0'

    this.slide.updateSlide(this.mainOpts)

    this._highlightTitles()
    this._createTutorialCards()
    this._createDemoTemplateCards()
    this._enableSubPagesLinks()
    this._enableAppendixLinks()

    this.slide.addEventListener('scroll', () => {
      const t = this.slide.scrollTop
      let select = null
      this.slide.querySelectorAll('[id^="learning-guide-"]').forEach(el => {
        const top = el.getBoundingClientRect().top - // 50 === scrollTo "offset"
          this.slide.getBoundingClientRect().top + this.slide.scrollTop - 50
        if (Math.abs(t - top) <= 25) { select = el }
        el.classList.remove('is-hover')
      })
      if (select) select.classList.add('is-hover')
    })

    this.slide.style.overflowX = 'hidden'
  }

  _jsIntroConvo () {
    window.convo = new Convo(this.convos, 'js-intro')
  }

  _comingSoon (type) {
    if (type === 'units') {
      window.convo = new Convo(this.convos, 'coming-soon-units')
    } else {
      window.convo = new Convo(this.convos, 'coming-soon')
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _highlightTitles () {
    const c = nn.hex2rgb(utils.getVal('--netizen-number'))
    const m = nn.hex2rgb(utils.getVal('--netizen-meta'))
    this.ele.querySelectorAll('h2, h3').forEach(ele => {
      ele.style.textShadow = `rgba(${c.r}, ${c.g}, ${c.b}, 0.6) -1px -1px 6px, rgba(${m.r}, ${m.g}, ${m.b}, 0.6) 1px 1px 6px`
    })
  }

  _createTutThumb (sec, id, appear) {
    const data = this.tutorials[sec].find(o => o.id === id)
    const click = () => WIDGETS.load('hyper-video-player', w => w.load(data.id))
    const ele = `.learning-guide__tut-thumbs-${sec}`
    nn.get(ele).set('name', id).innerHTML = ''

    this.tutCards[sec] = []
    let delay = 0

    const cards = []
    const w = 549 // width of card stage (in leaerning guide)
    const h = 300 // should match min-height of card-stage
    const pos = [
      { x: nn.random(0, w * 0.25), y: nn.random(0, h * 0.25) }, // top left
      { x: nn.random(w / 2, w - 220), y: nn.random(0, h * 0.25) }, // top right
      { x: nn.random(0, w * 0.25), y: nn.random(h / 2, h - 140) }, // bottom left
      { x: nn.random(w / 2, w - 220), y: nn.random(h / 2, h - 140) } // bottom right
    ]
    for (let i = 0; i < 4; i++) {
      const t = data.thumbnails[i]
      if (t) {
        const box = { w: 150, h: 100, x: pos[i].x, y: pos[i].y }
        const thumbnail = `/tutorials/${data.id}/${t}`
        cards.push({ ele, box, thumbnail, click, appear })
      }
    }
    cards.forEach(c => { // create thumbnail cards
      setTimeout(() => this.tutCards[sec].push(new WidgetCard(c)), delay)
      delay += 100
    })

    const thumbnail = `/tutorials/${data.id}/${data.id}.jpg`
    const vidCard = {
      ele, box: { w: 220, h: 140 }, thumbnail, click, appear, main: true
    } // create main video card
    setTimeout(() => this.tutCards[sec].push(new WidgetCard(vidCard)), delay)
  }

  _createTutorialCards () {
    this.tutorials = {}
    const promises = []

    // ........................
    // next|title|prev control functions
    // ........................

    const getTut = (sec) => {
      const sel = `.learning-guide__tut-thumbs-${sec}`
      const id = nn.get(sel).getAttribute('name')
      return WIDGETS['learning-guide'].tutorials[sec].find(t => t.id === id)
    }

    const updateTitle = (sec) => {
      const tut = getTut(sec)
      let title = tut.title
      if (tut.subtitle) title += ` <div style="font-size: 18px;">${tut.subtitle}</div>`
      if (tut.author) title += ` <div style="font-size: 14px;">by ${tut.author}</div>`
      nn.get(`.learning-guide__tut-cntrl[name="${sec}"] span.highlight`)
        .content(title)
    }

    const hoverOver = (sec) => {
      if (this._descTO) clearTimeout(this._descTO)
      const tut = getTut(sec)
      const desc = tut.description
        .replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\A')
      utils.setVal('--tut-desc', `"${desc}"`)
      utils.setVal('--tut-desc-display', 'block')
      this._descTO = setTimeout(() => utils.setVal('--tut-desc-opac', 1), 100)
    }

    const hoverOut = (sec) => {
      if (this._descTO) clearTimeout(this._descTO)
      utils.setVal('--tut-desc-opac', 0)
      this._descTO = setTimeout(() => {
        utils.setVal('--tut-desc-display', 'none')
        utils.setVal('--tut-desc', '')
      }, 500)
    }

    const selectTut = (sec) => {
      const tut = getTut(sec)
      WIDGETS.load('hyper-video-player', w => w.load(tut.id))
    }

    const stepTut = async (sec, dir = 1) => {
      const list = this.tutorials[sec]
      const curIdx = list.indexOf(getTut(sec))
      const nextIdx = (curIdx + dir + list.length) % list.length
      const target = list[nextIdx]
      // stagger-hide current cards
      for (const card of this.tutCards[sec]) {
        card.hide()
        await nn.sleep(100)
      }
      // small pause before bringing in the new one
      await nn.sleep(500)
      this._createTutThumb(sec, target.id, true)
      updateTitle(sec)
    }

    // ........................
    // when all the data below is loaded...
    // ........................
    const ready = () => {
      // ...create first set of thumbnail cards
      Object.entries(this.tutorials).forEach(([s, tut]) => {
        if (tut[0]) this._createTutThumb(s, tut[0].id)
      })

      // ...and setup controls
      Object.entries(this.tutorials).forEach(([s, tut]) => {
        if (tut.length > 1) {
          const sec = `.learning-guide__tut-cntrl[name="${s}"] span`
          nn.getAll(sec).forEach((span, i) => {
            if (i === 0) span.addEventListener('click', () => stepTut(s, -1))
            else if (i === 1) {
              updateTitle(s)
              span.addEventListener('click', () => selectTut(s))
              span.addEventListener('mouseover', () => hoverOver(s))
              span.addEventListener('mouseout', () => hoverOut(s))
            } else if (i === 2) span.addEventListener('click', () => stepTut(s, +1))
          })
        }
      })
    }

    // ........................
    // Load all the Tutorial Data the Learning Guide needs
    // ........................
    utils.get('tutorials/list.json', (json) => {
      Object.entries(json).forEach(([key, val]) => {
        this.tutorials[key] = []
        val.forEach(n => {
          promises.push(new Promise(resolve => {
            utils.get(`tutorials/${n}/tutorial.json`, t => {
              this.tutorials[key].push(t.metadata); resolve()
            })
          }))
        })
      })
      Promise.all(promises).then(ready)
    })
  }

  _createDemoTemplateCards () {
    // enable WidgetCards
    const cards = [
      {
        ele: '#learning-guide-demos',
        box: { w: 220, h: 140, x: 0, y: 40 },
        content: `<div>
          <div style="text-align: center; font-size:50px">&lt;/&gt;<div>
          <div style="text-align: center; font-size:24px; margin-top: 20px;">DEMOS<div>
        </div>`,
        click: () => WIDGETS.open('demo-sketches')
      },
      {
        ele: '#learning-guide-demos',
        box: { w: 220, h: 150, x: 270, y: 209 },
        content: `<div>
          <div class="lg-widget-folder-icon"></div>
          <div style="text-align: center; font-size:24px; margin-top: 20px;">TEMPLATES<div>
        </div>`,
        click: () => WIDGETS.open('template-projects')
      }
    ]

    cards.forEach(card => this.cards.push(new WidgetCard(card)))
  }

  _enableSubPagesLinks () {
    this.subpages.forEach(p => {
      // this is what happens when we click a <button> with a #page-* id
      // assuming it's also been defined in this.subpages above
      this.slide.querySelector(`#page-${p.id}`).addEventListener('click', () => {
        this.slide.updateSlide({
          ...this[p.id],
          cb: () => setTimeout(() => this._highlightTitles(), utils.getVal('--menu-fades-time'))
        })
        window.convo.hide()
      })
    })
  }

  _enableAppendixLinks () {
    this.slide.querySelectorAll('[name^="ref"]').forEach(ele => {
      const arr = ele.getAttribute('name').split(':')
      const widget = `${arr[1]}-reference`
      ele.addEventListener('click', () => {
        window.convo.hide()
        WIDGETS.open(widget, w => w.slide.updateSlide(w[arr[2]]))
      })
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸. star field background && other animations
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _applyVisibility () {
    const visible = utils.isVisible(this.ele)
    if (visible) {
      this._startStarField()
    } else {
      this._stopStarField()
      this._stopSvgAnimations()
    }

    const animatedSvgs = [
      'svg-tag-animated', 'svg-css-animated', 'svg-js-animated'
    ]

    animatedSvgs.forEach(eleStr => {
      const svg = this.$(eleStr)
      const v = utils.isVisible(svg)
      if (v && !svg.looping) svg.start()
      else if (!v) svg.stop()
    })
  }

  _stopSvgAnimations () {
    const animatedSvgs = [
      'svg-tag-animated', 'svg-css-animated', 'svg-js-animated'
    ]
    animatedSvgs.forEach(svg => this.$(svg).stop())
  }

  /*
    NOTE: this is an alternative approach to the "internet-globe.html"
    apply this way:
    // this._globeFrame = 0
    // this._globeFrameCount = 124
    // this._globeFrameRate = 1000 / 10
    // this._animateGlobe()
  */
  // _animateGlobe () {
  //   // at the moment only frames for "dark" theme exist
  //   const img = this.slide.querySelector('#globe-animation-sequence')
  //   if (!img) return
  //   const f = this._globeFrame % this._globeFrameCount
  //   img.src = `widgets/learning-guide/data/assets/globes/${NNE.theme}/frame-${f}.png`
  //   this._globeFrame++
  //   setTimeout(() => this._animateGlobe(), this._globeFrameRate)
  // }
  _startStarField () {
    if (!this.slide) { setTimeout(() => this._startStarField(), 250); return }
    if (this._runningStar) return
    this._runningStar = true
    if (!this._canvas) this._initStarField()
    this._tickStarField()
  }

  _stopStarField () {
    if (!this._runningStar) return
    this._runningStar = false
    window.cancelAnimationFrame(this._raf)
  }

  _initStarField () {
    const canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    canvas.style.top = 0
    canvas.style.left = 0
    canvas.style.zIndex = 0
    canvas.width = this.ele.offsetWidth
    canvas.height = this.ele.offsetHeight
    this._canvas = canvas
    this._ctx = canvas.getContext('2d')
    this.slide.appendChild(canvas)

    // your existing star setup
    const mkStar = (star = {}) => {
      const w = canvas.width
      const h = canvas.height
      star.x = w / 2
      star.y = h / 2
      star.dx = Math.random() * 10 - 5
      star.dy = Math.random() * 10 - 5
      star.w = 1
      star.h = 1
      star.a = 0
      star.z = 500
      const s = (w > h) ? w : h
      star.x += star.dx * s / 10
      star.y += star.dy * s / 10
      return star
    }

    this._stars = []
    this._acc = 1
    for (let i = 0; i < 100; i++) this._stars.push(mkStar())
    this._mkStar = mkStar
  }

  _tickStarField () {
    if (!this._runningStar) return
    const { _canvas: canvas, _ctx: ctx } = this
    const w = canvas.width
    const h = canvas.height

    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = utils.getVal('--netizen-text') // set once per frame

    let newStars = 0
    this._stars.forEach(star => {
      star.x += star.dx
      star.y += star.dy
      star.a++

      const outX = star.x < 0 || star.x > w
      const outY = star.y < 0 || star.y > h
      if (outX && outY) {
        star.x = w / 2 + star.dx * 2
        star.y = h / 2 + star.dy * 2
        star.dx += star.dx / (50 / this._acc)
        star.dy += star.dy / (50 / this._acc)
        const max = 4
        if (star.dx < -max) star.dx = -max
        if (star.dx > max) star.dx = max
        if (star.dy < -max) star.dy = -max
        if (star.dy > max) star.dy = max
      }

      if (
        star.a === Math.floor(50 / this._acc) ||
        star.a === Math.floor(150 / this._acc) ||
        star.a === Math.floor(300 / this._acc)
      ) {
        star.w++
        star.h++
      }

      if (
        star.x + star.w < 0 || star.x > w ||
        star.y + star.h < 0 || star.y > h
      ) {
        const idx = this._stars.indexOf(star)
        this._stars.splice(idx, 1)
        newStars++
      }

      ctx.fillRect(star.x, star.y, 1, 1)
    })

    for (let i = 0; i < newStars; i++) this._stars.push(this._mkStar())

    this._raf = window.requestAnimationFrame(() => this._tickStarField())
  }
}

window.LearningGuide = LearningGuide
