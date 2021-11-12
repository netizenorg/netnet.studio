/* global Widget, WIDGETS, utils, Convo, NNE */
class TutorialsGuide extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Learning Guide (BETA-2.0)'
    this.key = 'tutorials-guide'
    this.keywords = [
      'tutorials', 'guide', 'lesson', 'how to', 'how', 'to', 'learn', 'reference'
    ]

    this.on('open', () => {
      this.update({ left: 20, top: 20 }, 500)
      this._openConvo()
    })

    this.resizable = false
    // currently loaded tutorial data
    this.metadata = null
    this.data = null
    this.loaded = null

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this._createPage('mainOpts', 'learning-guide-main.html', null, (div) => {
      // div.querySelector('#bf-submission').addEventListener('click', () => {
      //   WIDGETS['functions-menu'].BrowserFest()
      // })

      // create sub pages
      this._createPage('aboutOpts', 'learning-guide-about.html', this.mainOpts)

      // initial HTML
      this._createHTML()
      this.title = 'Learning Guide (BETA-2.0)'
    })
  }

  load (name, time) {
    setTimeout(() => {
      utils.showCurtain('tutorial.html')
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
  }

  quit () {
    WIDGETS.list().filter(w => w.opened).forEach(w => w.close())
    this.metadata = null
    this.data = null
    utils.hideCurtain('tutorial.html')
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
    utils.get(`./data/learning-guide/${page}`, (html) => {
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

    this._listTutorials()
  }

  _listTutorials () {
    const tutHTML = (t) => {
      const div = document.createElement('div')
      div.className = 'learning-guide__tut'
      div.innerHTML = `
        <div>
          <div>
            <h2>${t.title}</h2>
            <b>${t.subtitle}</b>
          </div>
          <div>
            <button name="tut:${t.id}">play</button>
            <button name="i:${t.id}">i</button>
          </div>
        </div>
        <p name="nfo:${t.id}">${t.description}</p>
      `
      return div
    }

    const tutorials = []
    const div = this.ele.querySelector('.learning-guide__tut-list')

    utils.get('tutorials/list.json', (json) => {
      let count = 0
      json.listed.forEach(name => {
        utils.get(`tutorials/${name}/metadata.json`, (tut) => {
          tutorials.push({ // create tutorial <div>
            index: json.listed.indexOf(name), html: tutHTML(tut)
          })
          count++
          // ...
          if (count === json.listed.length) {
            tutorials // when all are loaded, append tutorial <div> to guide
              .sort((a, b) => parseFloat(a.index) - parseFloat(b.index))
              .forEach(obj => div.appendChild(obj.html))

            this._enableTutorialEventListeners(div)
          }
          // ...
        })
      })
    })
  }

  _enableTutorialEventListeners (div) {
    // enable examples "open" button
    this.slide.querySelector('#ex-open-btn')
      .addEventListener('click', () => {
        WIDGETS.open('code-examples')
        window.convo.hide()
      })

    this.slide.querySelector('#page-aboutOpts')
      .addEventListener('click', () => {
        this.slide.updateSlide(this.aboutOpts)
        window.convo.hide()
      })

    // enable "play" buttons
    div.querySelectorAll('[name^="tut"]').forEach(ele => {
      const tut = ele.getAttribute('name').split(':')[1]
      ele.addEventListener('click', () => this.load(tut))
    })

    // calc <p> heights && hide them
    div.querySelectorAll('[name^="nfo"]').forEach(p => {
      p.dataset.height = p.offsetHeight
      p.style.height = '0px'
      p.style.display = 'none'
    })

    // enable "info" buttons
    div.querySelectorAll('[name^="i"]').forEach(ele => {
      const t = ele.getAttribute('name').split(':')[1]
      ele.addEventListener('click', () => {
        const p = div.querySelector(`[name="nfo:${t}"]`)
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

    // enable appendix links
    this.slide.querySelectorAll('[name^="ref"]').forEach(ele => {
      const arr = ele.getAttribute('name').split(':')
      const widget = `${arr[1]}-reference`
      ele.addEventListener('click', () => {
        window.convo.hide()
        WIDGETS.open(widget, null, (w) => w.slide.updateSlide(w[arr[2]]))
      })
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••. tutorial loading logic

  _loadTutorial (name, time) {
    WIDGETS.open('hyper-video-player', null, () => {
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
}

window.TutorialsGuide = TutorialsGuide
