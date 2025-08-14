/* global Widget Convo NNW NNE utils nn */
class TemplateProjects extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'template-projects'
    this.keywords = ['templates', 'starter', 'projects', 'examples', 'boilterplate', 'forks']

    this.title = 'Template Starter Projects'
    this.width = 550

    this.list = {} // dict of tempaltes
    this.state = {} // details of opened template

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    utils.get('/api/templates', (res) => {
      if (res.success) this.list = res.data
      this._createHTML()
    })
  }

  explainTitleBar () {
    const s = this.state
    window.convo = new Convo(s.convos, s.curPassage)
  }

  cancel () {
    // TODO consider adding template to URL
    // if (utils.url.demo) utils.updateURL(null)
    NNW.updateTitleBar(null)
    NNE.spotlight(null)
    NNE.marker(null)
  }

  async startGuide (name) {
    this.cancel()
    this.close()

    this.state = { // also used for convo's "self" object
      name: name,
      curPassage: null,
      vars: this.list[name].vars,
      lines: this.list[name].lines
    }

    NNE.code = ''
    NNE.update()

    if (NNW.layout !== 'dock-left') {
      NNW.layout = 'dock-left'
      await nn.sleep(utils.getVal('--layout-transition-time'))
    }

    // load the template's convo file
    Convo.load(`template-projects/templates/${this.state.name}`, () => {
      const cn = `template-${this.state.name}`
      this.state.convos = window.CONVOS[cn](this.state)
      const first = window.CONVOS[cn]()[0].id
      window.convo = new Convo(this.state.convos, first)
      window.convo.on('update', (c) => this._typeTemplateCode(c.id))
      this._typeTemplateCode(first)
      // update title bar
      utils.setCustomRenderer(null)
      // TODO consider adding template to URL
      // if (this.demoType !== 'custom') utils.updateURL(`?demo=${this.demoKey}`)
      NNW.updateTitleBar(this.state.name)
      NNW.title.dataset.template = true
    })
  }

  displayTemplate (name) {
    // TODO: might need to update this when a template is a "project"
    // so that we can open the necessary directories
    // maybe there's an alt convo to "remix"
    const path = `/widgets/template-projects/templates/${name}/index.html`
    utils.get(path, async (html) => {
      window.convo.hide()
      this.cancel()
      this.close()
      this.state = { name: name }

      NNE.code = html
      NNE.update()

      if (NNW.layout !== 'dock-left') {
        NNW.layout = 'dock-left'
        await nn.sleep(utils.getVal('--layout-transition-time'))
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'remix')
      }
    }, true)
  }

  // --------------------------------------------------- PRIVATE METHODS -------

  _getTemplateName () {
    return this._transformName(this.state.name || 'untitled')
  }

  _typeTemplateCode (id) {
    this.state.curPassage = id
    let line = this.state.lines[id]
    if (!line) return
    line = this._transformLine(line)
    if (line.template) utils.autoType(line.code, line.template)
    else utils.autoType(line.code)
  }

  _transformName (str) {
    return str
      .split('-')
      .filter(Boolean) // trick to filter out multiple '--' which become ''
      .map(word => {
        const w = word.toLowerCase()
        if (w === 'html' || w === 'css' || w === 'js') return w.toUpperCase()
        if (w === 'javascript') return 'JavaScript'
        return w.charAt(0).toUpperCase() + w.slice(1)
      })
      .join(' ')
  }

  _transformLine (line) { // replace any "vars" with their values
    const normalize = s => (s || '')
      .replace(/\\t/g, '\t')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
    let c = normalize(line.code)
    let t = normalize(line.template)
    // b/c the netitor does not indent with tabs
    // -> NNE.cm.getOption('indentWithTabs') === fasle
    const i = NNE.cm.getOption('indentUnit') || 2
    const tab = ' '.repeat(i)
    c = c.replace(/\t/g, tab)
    t = t.replace(/\t/g, tab)
    Object.entries(this.state.vars).forEach(([key, val]) => {
      c = c.replace(`{{${key}}}`, val)
      t = t.replace(`{{${key}}}`, val)
    })
    return { code: c, template: t }
  }

  _createHTML () {
    if (this.list.length === 0) {
      this.innerHTML = '<p>ERROR LOADING TEMPLATES ŏ︵ŏ</p>'
    } else {
      this.innerHTML = '<div class="template-proj"></div>'
      Object.entries(this.list).forEach(([name, obj]) => {
        const div = nn.create('div')
        div.innerHTML = `
          <h3>${this._transformName(name)}</h3>
          <p>${obj.description}</p>
          <div class="template-proj__btns">
            <button name="guide" class="pill-btn pill-btn--secondary">Begin Guide</button>
            <button name="skip" class="pill-btn pill-btn--secondary">Jump to Template</button>
            <button name="explain" class="pill-btn pill-btn--secondary">?</button>
          </div>
        `
        div.querySelector('button[name="guide"]')
          .addEventListener('click', () => this.startGuide(name))
        div.querySelector('button[name="skip"]')
          .addEventListener('click', () => this.displayTemplate(name))
        div.querySelector('button[name="explain"]')
          .addEventListener('click', () => { window.convo = new Convo(this.convos, 'buttons') })
        this.$('.template-proj').appendChild(div)
      })
    }
  }

  // here's an example of a "private" method
  _startConvo () {
    // this is referencing a convo key from the convo.js file
    window.convo = new Convo(this.convos, 'start')
  }
}

window.TemplateProjects = TemplateProjects
