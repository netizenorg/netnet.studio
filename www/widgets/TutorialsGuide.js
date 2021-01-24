/* global Widget, WIDGETS, utils, Convo */
class TutorialsGuide extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'tutorials-guide'
    this.keywords = [
      'tutorials', 'guide', 'lesson', 'how to', 'how', 'to', 'learn', 'reference'
    ]

    // this.convoStack = []

    this.on('open', () => { this.update({ left: 20, top: 20 }, 500) })

    // currently loaded tutorial data
    this.metadata = null
    this.data = null
    this.loaded = null
    this.width = 500
    this.height = 300

    this.title = 'Learning Guide'
    this._createHTML()
  }

  load (name) {
    utils.get(`tutorials/${name}/metadata.json`, (json) => {
      this.metadata = json
      this.loaded = name
      utils.get(`tutorials/${name}/data.json`, (json) => {
        this.data = json
        this._loadVideoPlayer()
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

  _createHTML () {
    this.innerHTML = `
      <style>
        @keyframes tutorial-guide-title {
          0% { color: var(--netizen-string) }
          50% { color: var(--netizen-number) }
          100% { color: var(--netizen-keyword) }
        }
        .tutorials-guide {
          overflow-y: auto;
          padding: 0px 15px 0px 25px;
          scrollbar-color: var(--netizen-meta) rgba(0,0,0,0);
          scrollbar-width: thin;
          height: 100%;
        }
        .tutorials-guide__pre-title {
          text-align: center;
          margin-bottom: 5px;
        }
        .tutorials-guide__title {
          text-align: center;
          line-height: 34px;
          margin-top: 0px;
          animation: tutorial-guide-title 10s infinite;
        }
        .tutorials-guide__sub-title,
        .tutorials-guide__sub-title2 {
          padding-bottom: 8px;
          border-bottom: 2px solid var(--netizen-atom);
        }
        .tutorials-guide__sub-title2 {
          margin: 0px 0px 20px 0px;
        }
        .tutorials-guide__table {
          display: flex;
          justify-content: space-around;
          align-items: baseline;
          margin-bottom: 35px;
        }
        .tutorials-guide__list {
          /* display: block; */
        }
        .tutorials-guide__link {
          position: relative;
          color: var(--netizen-meta);
          text-decoration: none;
          transition: color .5s ease, border .5s ease;
          /*underline*/
          border-bottom: 1px solid var(--netizen-meta);
          text-shadow: -2px 2px var(--bg-color), 0px 2px var(--bg-color), -1px 2px var(--bg-color), 1px 1px var(--bg-color);
        }
        .tutorials-guide__link:hover {
          color: var(--netizen-match-color);
          border-bottom: 1px solid var(--netizen-match-color);
          cursor: pointer;
        }
        .tutorials-guide__link:active {
          color: var(--netizen-attribute);
        }
      </style>
      <div class="tutorials-guide">
        <h3 class="tutorials-guide__pre-title">welcome to</h3>
        <h1 class="tutorials-guide__title">The Learning Guide</h1>
        <section class="tutorials-guide__table">
          <div>
            <h2 class="tutorials-guide__sub-title2">Tutorials</h2>
            <div class="tutorials-guide__list"></div>
          </div>
          <div>
            <h2 class="tutorials-guide__sub-title2">References</h2>
            <div>
              <p><span class="tutorials-guide__link" name="html-ref">HTML Reference</span></p>
              <p><span class="tutorials-guide__link" name="html-eles">HTML Elements List</span></p>
              <p><span class="tutorials-guide__link" name="html-attr">HTML Attributes List</span></p>
            </div>
          </div>
        </section>
        <h2 class="tutorials-guide__sub-title">Disclaimer</h2>
        <p>Here you'll find an evolving list of interactive tutorials and references. These are a work in progress and are constantly changing as we continue to craft netnet. We hope to someday be beyond beta, but for the time being, best be prepared for bugs. Questions, comments, feedback welcome: h<span></span>i@net<span></span>izen.org</p>
        <h2 class="tutorials-guide__sub-title">Thnx</h2>
        <p>netnet.studio is a <a href="http://netizen.org" target="_blank">netizen.org</a> project being designed and devloped by <a href="http://nickbriz.com/" target="_blank">Nick Briz</a> and <a href="https://www.sarahrooney.net/" target="_blank">Sarah Rooney</a> with creative support from <a href="http://jonsatrom.com/" target="_blank">Jon Satrom</a> and administrative support from <a href="#", target="_blank">Mike Constantino</a>. Our interdisciplinary intern is <a href="http://ilai.link" target="_blank">Ilai Gilbert</a>.</p><p>netnet.studio was made possible with support from the <a href="http://clinicopensourcearts.com/" target="_blank">Clinic for Open Source Arts</a>, the <a href="https://www.saic.edu/academics/departments/contemporary-practices" target="_blank">Contemporary Practices Department at the School of the Art Institute of Chicago</a> and <a href="https://cms.uchicago.edu/undergraduate/major-minor/minor-media-arts-and-design" target="_blank">Media Arts and Design at the University of Chicago</a>.</p>
        <div style="height:40px;"><!-- some padding --></div>
      </div>
    `

    this.ele.style.padding = '5px 5px 10px'
    this.ele.querySelector('.w-top-bar').style.padding = '0px 15px 0px'
    this.ele.querySelector('.w-innerHTML').style.padding = '10px 0px'
    this.ele.querySelector('.w-innerHTML').style.height = '100%'

    const html = WIDGETS['html-reference']
    this.$('[name="html-ref"]').addEventListener('click', () => {
      html.slide.updateSlide(html.mainOpts); html.open()
    })
    this.$('[name="html-eles"]').addEventListener('click', () => {
      html.slide.updateSlide(html.eleListOpts); html.open()
    })
    this.$('[name="html-attr"]').addEventListener('click', () => {
      html.slide.updateSlide(html.attrListOpts); html.open()
    })

    utils.get('tutorials/list.json', (json) => {
      json.listed.forEach(t => {
        const div = document.createElement('div')
        const span = document.createElement('span')
        span.className = 'tutorials-guide__link'
        span.textContent = t.txt
        span.addEventListener('click', () => this.load(t.dir))
        div.appendChild(span)
        this.$('.tutorials-guide__list').appendChild(div)
      })
    })
  }

  _loadVideoPlayer () {
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
    })
  }
}

window.TutorialsGuide = TutorialsGuide
