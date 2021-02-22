/* global Widget, WIDGETS, utils, Convo, NNE */
class TutorialsGuide extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Learning Guide (BETA-2.0)'
    this.key = 'tutorials-guide'
    this.keywords = [
      'tutorials', 'guide', 'lesson', 'how to', 'how', 'to', 'learn', 'reference', 'browser', 'browserfest'
    ]

    this.on('open', () => { this.update({ left: 20, top: 20 }, 500) })
    this.resizable = false

    // currently loaded tutorial data
    this.metadata = null
    this.data = null
    this.loaded = null

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this._createPage('mainOpts', 'learning-guide-main.html', null, (div) => {
      // setup all the click listeners for the main page
      div.querySelectorAll('[name^="page"]').forEach(span => {
        const page = span.getAttribute('name').split(':')[1]
        span.addEventListener('click', () => this.slide.updateSlide(this[page]))
      })

      div.querySelector('#bf-submission').addEventListener('click', () => {
        window.convo = new Convo(this.convos, 'browserfest')
      })

      // create sub pages
      this._createPage('aboutOpts', 'learning-guide-about.html', this.mainOpts)

      this._createPage('tutsOpts', 'learning-guide-tuts.html', this.mainOpts, (div) => {
        div.querySelectorAll('[name^="tut"]').forEach(ele => {
          const tut = ele.getAttribute('name').split(':')[1]
          ele.addEventListener('click', () => this.load(tut))
        })
      })

      this._createPage('exOpts', 'learning-guide-exs.html', this.mainOpts, (div) => {
        // div.querySelectorAll('[name^="ex"]').forEach(ele => {
        //   const key = ele.getAttribute('name').split(':')[1]
        //   ele.addEventListener('click', () => utils.loadExample(key))
        // })
        const ex = div.querySelector('.learning-guide__examples')
        utils.get('api/examples', (res) => this._createExamplesList(ex, res))
      })

      this._createPage('refsOpts', 'learning-guide-refs.html', this.mainOpts, (div) => {
        div.querySelectorAll('[name^="ref"]').forEach(ele => {
          const arr = ele.getAttribute('name').split(':')
          const widget = `${arr[1]}-reference`
          ele.addEventListener('click', () => {
            WIDGETS.open(widget, null, (w) => w.slide.updateSlide(w[arr[2]]))
          })
        })
      })

      // initial HTML
      this._createHTML()
    })
  }

  load (name) {
    utils.get(`tutorials/${name}/metadata.json`, (json) => {
      this.metadata = json
      this.loaded = name
      if (WIDGETS['student-session'].getData('opened-project')) {
        WIDGETS['student-session'].clearProjectData()
      }
      NNE.addCustomRoot(`tutorials/${name}/`)
      utils.get(`tutorials/${name}/data.json`, (json) => {
        this.data = json
        this._loadTutorial(name)
      })
    })
  }

  quit () {
    WIDGETS.list().filter(w => w.opened).forEach(w => w.close())
    this.metadata = null
    this.data = null
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods

  _createPage (type, page, b, cb) {
    utils.get(`./data/${page}`, (html) => {
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

    this.ele.style.padding = '8px 5px 10px'
    this.ele.querySelector('.w-top-bar').style.padding = '0px 15px 0px'
    this.ele.querySelector('.w-innerHTML').style.padding = '10px 0px'

    this.slide.updateSlide(this.mainOpts)
  }

  _createExamplesList (ele, res) {
    if (res.success) {
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
          span.className = 'learning-guide--link'
          span.textContent = o.name
          span.addEventListener('click', () => utils.loadExample(o.key))
          div.appendChild(span)
          div.appendChild(document.createElement('br'))
        })
        ele.appendChild(div)
      }
    } else {
      console.error('TutorialsGuide:', res)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••. tutorial loading logic

  _loadTutorial (name) {
    WIDGETS.open('hyper-video-player', null, () => {
      if (this.metadata.keylogs) {
        utils.get(`tutorials/${this.loaded}/keylogs.json`, (json) => {
          WIDGETS['hyper-video-player'].logger._loadData(json)
        })
      }

      WIDGETS['hyper-video-player'].video.onloadeddata = () => {
        window.convo = new Convo({
          id: 'introducing-tutorial',
          content: `I've just loaded a tutorial by ${this.metadata.author.name} called "${this.metadata.title}", press the video players's <i>play</i> button to begin. Press the video player's <i>X</i> button at anytime to quit.`
        })
        this.close() // close the tutorials guide && setup first keyframe
        WIDGETS['hyper-video-player'].renderKeyframe()
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
