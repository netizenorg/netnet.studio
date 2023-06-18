/* global Widget, WIDGETS, utils, Convo, NNE, SNT, nn */
class LearningGuide extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Learning Guide (BETA-2.0)'
    this.key = 'learning-guide'
    this.keywords = [
      'tutorials', 'guide', 'lesson', 'how to', 'how', 'to', 'learn', 'reference'
    ]

    this.on('open', () => {
      this.update({ left: 392, top: 20 }, 500)
      this._openConvo()
    })

    this.resizable = false
    // currently loaded tutorial data
    this.metadata = null
    this.data = null
    this.loaded = null

    if (!WIDGETS.loaded.includes('code-examples')) {
      WIDGETS.load('code-examples')
    }

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this._createPage('mainOpts', 'main-slide.html', null, (div) => {
      // div.querySelector('#bf-submission').addEventListener('click', () => {
      //   WIDGETS['functions-menu'].BrowserFest()
      // })

      // create sub pages
      this._createPage('aboutOpts', 'about.html', this.mainOpts)

      // initial HTML
      this._createHTML()
      const icon = '<img src="images/menu/tutorials.png" style="height:19px; margin-right: 11px;">'
      this.title = `${icon} Learning Guide (BETA-2.0)`
    })

    WIDGETS['functions-menu'].on('theme-change', () => {
      const src = this.ele.querySelector('iframe').src
      this.ele.querySelector('iframe').src = src
    })
  }

  load (name, time) {
    setTimeout(() => {
      document.querySelector('load-curtain').show('tutorial.html')
    }, 100)

    utils.get(`tutorials/${name}/metadata.json`, (json) => {
      this.metadata = json
      this.loaded = name
      if (WIDGETS['student-session'].getData('opened-project')) {
        WIDGETS['student-session'].clearProjectData()
      }
      NNE.addCustomRoot(`tutorials/${name}/`)
      utils.get(`tutorials/${name}/data.json`, (json) => {
        this.data = json
        this._loadTutorial(name, time)
      })
    })
    SNT.post(SNT.dataObj('TUT-select', { name }))
  }

  quit () {
    WIDGETS.list().filter(w => w.opened).forEach(w => w.close())
    this.metadata = null
    this.data = null
    document.querySelector('load-curtain').hide()
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods

  _openConvo () {
    if (!this.convos) {
      setTimeout(() => this._openConvo(), 100)
      return
    }
    window.convo = new Convo(this.convos, 'guide-open')
  }

  _createPage (type, page, b, cb) {
    utils.get(`./widgets/learning-guide/data/${page}`, (html) => {
      const div = document.createElement('div')
      div.innerHTML = html
      const name = page.split('.')[0]
      // options objects for <widget-slide> .updateSlide() method
      this[type] = { name: name, widget: this, back: b, ele: div }
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

    // this.ele.style.padding = '8px 5px 10px'
    this.ele.querySelector('.w-top-bar').style.padding = '0px 15px 0px'
    this.ele.querySelector('.w-innerHTML').style.padding = '0 0 10px 0'

    this.slide.updateSlide(this.mainOpts)

    // this._enableExamplesButton()
    this._listTutorials()
    this._enableAppendixLinks()

    // const canvas = this.ele.querySelector('canvas')
    const canvas = document.createElement('canvas')
    this._createStarField(canvas)
    this.slide.appendChild(canvas)

    this._highlightTitles()

    this.slide.style.overflowX = 'hidden'

    // this.ele.querySelectorAll('h3').forEach(e => {
    //   e.addEventListener('click', () => {
    //     window.convo = new Convo(this.convos, e.textContent)
    //   })
    // })
  }

  // _enableExamplesButton () {
  //   this.slide.querySelector('#ex-open-btn')
  //     .addEventListener('click', () => {
  //       WIDGETS.open('code-examples')
  //       this.close()
  //       window.convo.hide()
  //     })
  // }

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

  _listTutorials () {
    const tutHTML = (t, i) => {
      const div = document.createElement('div')
      div.className = 'learning-guide__tut'
      div.dataset.id = t.id
      div.innerHTML = `
        <div>
          <div>
            <h2>${t.title}</h2>
            <b>${t.subtitle}</b>
          </div>
          <div class="learning-guide__dotted-line"></div>
          <div>
            <button name="tut:${t.id}">play</button>
            <button name="i:${t.id}">i</button>
          </div>
        </div>
        <p name="nfo:${t.id}">${t.description}</p>
      `
      return div
    }

    const tutorials = {}
    const tutzReady = () => {
      for (const sec in tutorials) {
        tutorials[sec] // when all are loaded, append tutorial <div> to guide
          .sort((a, b) => parseFloat(a.index) - parseFloat(b.index))
          .forEach(obj => {
            const div = document.querySelector(`.learning-guide__tut-${sec}`)
            if (div) div.appendChild(obj.html)
          })
      }
      this._enableLearningGuideEventListeners()
    }

    utils.get('tutorials/list.json', (json) => {
      let count = 0
      let total = 0
      for (const sec in json) { total += json[sec].length }
      for (const sec in json) {
        tutorials[sec] = []
        json[sec].forEach((name, i) => {
          utils.get(`tutorials/${name}/metadata.json`, (tut) => {
            tutorials[sec].push({
              index: json[sec].indexOf(name), html: tutHTML(tut, i)
            })
            count++
            if (count === total) tutzReady()
          })
        })
      }
    })
  }

  _enableLearningGuideEventListeners () {
    this.slide.querySelector('#page-aboutOpts')
      .addEventListener('click', () => {
        this.slide.updateSlide(this.aboutOpts)
        window.convo.hide()
      })

    // enable "play" buttons
    this.ele.querySelectorAll('[name^="tut"]').forEach(ele => {
      const tut = ele.getAttribute('name').split(':')[1]
      ele.addEventListener('click', () => this.load(tut))
    })

    // hover over tutorials
    this.ele.querySelectorAll('.learning-guide__tut')
      .forEach(div => {
        div.addEventListener('mouseover', () => {
          const vid = document.createElement('video')
          vid.id = 'tut-preview-video'
          vid.src = `/tutorials/${div.dataset.id}/preview.mp4`
          vid.style.position = 'absolute'
          vid.style.left = 0
          vid.style.top = 0
          vid.style.zIndex = 1
          vid.style.border = 'none'
          vid.style.width = '600px'
          vid.style.height = '440px'
          vid.style.opacity = 0.15
          this.slide.appendChild(vid)
          vid.muted = true
          vid.play()
        })

        div.addEventListener('mouseout', () => {
          this.slide.querySelector('#tut-preview-video').remove()
        })
      })

    // calc <p> heights && hide them
    this.ele.querySelectorAll('[name^="nfo"]').forEach(p => {
      p.dataset.height = p.offsetHeight
      p.style.height = '0px'
      p.style.display = 'none'
    })

    // enable "info" buttons
    this.ele.querySelectorAll('[name^="i"]').forEach(ele => {
      const t = ele.getAttribute('name').split(':')[1]
      ele.addEventListener('click', () => {
        const p = this.ele.querySelector(`[name="nfo:${t}"]`)
        if (ele.textContent === 'i') {
          p.style.display = 'block'
          ele.textContent = 'x'
          setTimeout(() => {
            p.style.height = p.dataset.height + 'px'
            p.style.paddingTop = '8px'
          }, 10)
        } else {
          p.style.height = '0px'
          p.style.paddingTop = '0px'
          ele.textContent = 'i'
          setTimeout(() => { p.style.display = 'none' }, 1000)
        }
      })
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••. tutorial loading logic

  _loadTutorial (name, time) {
    WIDGETS.open('hyper-video-player', () => {
      WIDGETS['hyper-video-player'].video.oncanplay = () => {
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'introducing-tutorial')
        this.close() // close the tutorials guide && setup first keyframe
        WIDGETS['hyper-video-player'].renderKeyframe()

        setTimeout(() => {
          utils.hideCurtain('tutorial.html')
          if (time) WIDGETS['hyper-video-player'].seek(time)
          WIDGETS['hyper-video-player'].video.oncanplay = null
        }, utils.getVal('--layout-transition-time'))
      }

      WIDGETS['hyper-video-player'].title = this.metadata.title
      WIDGETS['hyper-video-player'].loadKeyframes(this.data.keyframes)
      WIDGETS['hyper-video-player'].updateVideo(this.metadata.videofile, this.metadata.id)

      for (const key in this.data.widgets) {
        if (!WIDGETS.instantiated.includes(key)) {
          WIDGETS.create(this.data.widgets[key])
        }
      }

      if (this.metadata.duration) {
        WIDGETS['hyper-video-player'].duration = Number(this.metadata.duration)
      }

      if (this.metadata.jsfile) {
        const file = `tutorials/${name}/${this.metadata.jsfile}`
        utils.loadFile(file, () => window.TUTORIAL.init())
      }
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••. star field background

  _createStarField (ele) {
    const self = this

    const canvas = ele
    canvas.style.position = 'absolute'
    canvas.style.top = 0
    canvas.style.left = 0
    canvas.style.zIndex = 0
    canvas.width = self.ele.offsetWidth
    canvas.height = self.ele.offsetHeight
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

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

    // SETUP
    const stars = []
    const acc = 1 // acceleration
    for (let i = 0; i < 100; i++) stars.push(mkStar())

    // DRAW
    const animate = () => {
      setTimeout(() => animate(), 1000 / 60)
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      let newStars = 0
      stars.forEach((star, i) => {
        ctx.fillStyle = utils.getVal('--netizen-text')

        star.x += star.dx
        star.y += star.dy
        star.a++

        const outdX = star.x < 0 || star.x > w
        const outdY = star.y < 0 || star.y > h
        if (outdX && outdY) {
          star.x = w / 2 + star.dx * 2
          star.y = h / 2 + star.dy * 2
          star.dx += star.dx / (50 / acc)
          star.dy += star.dy / (50 / acc)
          const max = 4
          if (star.dx < -max) star.dx = -max
          if (star.dx > max) star.dx = max
          if (star.dy < -max) star.dy = -max
          if (star.dy > max) star.dy = max
        }

        if (star.a === Math.floor(50 / acc) |
            star.a === Math.floor(150 / acc) |
            star.a === Math.floor(300 / acc)) {
          star.w++
          star.h++
        }

        if (star.x + star.w < 0 || star.x > w ||
        star.y + star.h < 0 | star.y > h) {
          const idx = stars.indexOf(star)
          stars.splice(idx, 1)
          newStars++
        }

        if (isNaN(star.x)) console.log('nan', stars.indexOf(star))
        ctx.fillRect(star.x, star.y, 1, 1)
      })

      for (let i = 0; i < newStars; i++) stars.push(mkStar())
    }

    animate()
  }

  _highlightTitles () {
    const c = nn.hex2rgb(utils.getVal('--netizen-number'))
    const m = nn.hex2rgb(utils.getVal('--netizen-meta'))
    this.ele.querySelectorAll('h2, h3').forEach(ele => {
      ele.style.textShadow = `rgba(${c.r}, ${c.g}, ${c.b}, 0.6) -1px -1px 6px, rgba(${m.r}, ${m.g}, ${m.b}, 0.6) 1px 1px 6px`
    })
  }
}

window.LearningGuide = LearningGuide
