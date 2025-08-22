/* global Widget Convo NNW NNE utils nn WIDGETS */
class TemplateProjects extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'template-projects'
    this.keywords = ['templates', 'starter', 'projects', 'examples', 'boilterplate', 'forks']

    this.title = 'Template Starter Projects'
    this.width = 550
    this.height = 400
    this.resizable = false

    this.list = {} // dict of tempaltes
    this.bld = {} // dict of which templates build on others
    this.state = {} // details of opened template

    Convo.load(this.key, () => {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'start')
    })

    utils.get('/api/templates', (res) => {
      if (res.success) {
        this.list = res.data.list
        this.bld = res.data.buildOn
      }
      this._createHTML()
    })

    this.codeEdit = null // runs on code update when template is open
  }

  explainTitleBar () {
    if (this.state.curPassage) {
      window.convo = new Convo(this.convos, 'notes-click')
    } else {
      window.convo = new Convo(this.convos, 'title-click-from-template')
    }
  }

  cancel () {
    utils.setCustomRenderer(null)
    if (utils.url.template) utils.updateURL(null)
    NNW.updateTitleBar(null)
    NNE.spotlight(null)
    NNE.marker(null)
    this.state = {}
    const i = NNE.events['code-update'].indexOf(this.codeEdit)
    if (i !== -1) NNE.events['code-update'].splice(i, 1)
  }

  loadTemplate (name) {
    this.state = { name }
    this._tempName = name

    if (!this.codeEdit) this._setupCodeUpdateListener()
    if (typeof window.CONVOS[this.key] !== 'function') {
      Convo.load(this.key, () => {
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'load-template')
      })
    } else {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'load-template')
    }
  }

  async preNewRepoFromTemplate () {
    // when choosing "start new project" after clicking title bar on a fully loaded template
    // or when choosing to "save" + "new project" (redirected from project-files)
    const name = this.state.name
    const res = await utils.getSync(`/api/template/${name}`)
    const owner = WIDGETS['student-session'].getData('owner')

    if (owner) {
      window.convo = new Convo(this.convos, 'new-project-from-template')
    } else if (res.data.multifile) {
      window.convo = new Convo(this.convos, 'display-template-multi-file-no-auth')
    } else {
      window.convo = new Convo(this.convos, 'display-template-single-file-no-auth')
    }
  }

  // .........................................

  async startGuide (name) {
    this.cancel()
    this.close()
    if (!this.codeEdit) this._setupCodeUpdateListener()

    const template = await utils.getSync(`/api/template/${name}`)
    const prevName = this.state.name
    const preVars = this.state.vars
      ? JSON.parse(JSON.stringify(this.state.vars)) : null

    this.state = { // also used for convo's "self" object
      name: name,
      curPassage: null,
      files: Object.fromEntries(template.data.files.map(k => [k, null])),
      lines: template.data.lines
    }

    if (this.bld[name]?.includes(prevName)) {
      // if building off a previous template, transfer vars over
      this.state.vars = preVars
    } else {
      // if not, use the template's default vars
      this.state.vars = template.data.vars
      // && clear code from netitor
      NNE.code = ''
    }

    this.state.files['index.html'] = NNE.code

    if (NNW.layout !== 'dock-left') {
      NNW.layout = 'dock-left'
      await nn.sleep(utils.getVal('--layout-transition-time'))
    }

    // load the template's convo file
    Convo.load(`/templates/${this.state.name}/convo.js`, () => {
      // setup guide convo
      const cn = `template-${this.state.name}`
      this.state.convos = window.CONVOS[cn](this.state)
      // pre-guide convo passage
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'start-guide')
      // setup base path
      if (!template.data.multifile) utils.setCustomRenderer(null)
      else utils.setCustomRenderer(`/templates/${name}/files/`)
      // update title bar && URL
      utils.updateURL(`?template=${this.state.name}`)
      const t = `${this._getTemplateName(this.state.name)} Template`
      NNW.updateTitleBar(t)
      // TODO: maybe show path (for multi file templates?)
      NNW.title.dataset.template = true
    })
  }

  async displayTemplate (name) {
    if (!name && this.state.name) name = this.state.name

    window.convo.hide()
    this.cancel()
    this.close()

    if (!this.codeEdit) this._setupCodeUpdateListener()

    const res = await utils.getSync(`/api/template/${name}`)
    this.state = { // also used for convo's "self" object
      name: name,
      files: Object.fromEntries(res.data.files.map(k => [k, null]))
    }

    // setup base path
    if (!res.data.multifile) utils.setCustomRenderer(null)
    else utils.setCustomRenderer(`/templates/${name}/files/`)

    // update title bar && URL
    utils.updateURL(`?template=${this.state.name}`)
    const t = `${this._getTemplateName(this.state.name)} Template`
    NNW.updateTitleBar(t)
    NNW.title.dataset.template = true

    // load code
    const index = await utils.getSync(`/templates/${name}/files/index.html`, true)
    NNE.code = this.state.files['index.html'] = index
    if (!NNE.autoUpdate) NNE.update()

    if (NNW.layout !== 'dock-left') {
      NNW.layout = 'dock-left'
      await nn.sleep(utils.getVal('--layout-transition-time'))
    }

    this.convos = window.CONVOS[this.key](this)
    const owner = WIDGETS['student-session'].getData('owner')

    if (res.data.multifile) {
      if (owner) window.convo = new Convo(this.convos, 'display-template-multi-file')
      else window.convo = new Convo(this.convos, 'display-template-multi-file-no-auth')
    } else {
      if (owner) window.convo = new Convo(this.convos, 'display-template-single-file')
      else window.convo = new Convo(this.convos, 'display-template-single-file-no-auth')
    }
  }

  // --------------------------------------------------- PRIVATE METHODS -------

  _getTemplateName () {
    return this._transformName(this.state.name || 'untitled')
  }

  _setupCodeUpdateListener () {
    const codeEdit = () => {
      const selected = 'index.html' // TODO switch when swapping diff files
      this.state.files[selected] = NNE.code
    }

    this.codeEdit = codeEdit

    NNE.on('code-update', codeEdit)
  }

  _templateConvo (first) {
    const cnv = `template-${this.state.name}`
    const psg = first ? window.CONVOS[cnv]()[0].id : this.state.curPassage
    window.convo = new Convo(this.state.convos, psg)
    window.convo.on('update', (c) => this._typeTemplateCode(c.id))
    if (first) this._typeTemplateCode(psg)
  }

  _continueGuide () {
    const s = this.state
    window.convo = new Convo(s.convos, s.curPassage)
    window.convo.on('update', (c) => this._typeTemplateCode(c.id))
  }

  _typeTemplateCode (id) {
    this.state.curPassage = id
    let line = this.state.lines[id]
    if (!line) return
    line = this._transformLine(line)
    if (line.template) utils.autoType(line.code, line.template)
    else utils.autoType(line.code)
  }

  _preCodeCheckConvo (name, type) {
    this._tempName = name
    this._tempType = type
    this.convos = window.CONVOS[this.key](this)

    // close an open tutorial
    if (WIDGETS['hyper-video-player']?.opened) {
      WIDGETS['hyper-video-player'].close()
    }
    // check for an open project
    const openProj = WIDGETS['project-files']?.projectData.name
    if (openProj) {
      const unSaved = WIDGETS['project-files'] && WIDGETS['project-files'].changes.length > 0
      if (unSaved) window.convo = new Convo(this.convos, 'clear-code-unsaved-proj')
      else window.convo = new Convo(this.convos, 'clear-code-opened-proj')
      return
    }

    if (NNE.code !== utils.starterCode() && NNE.code.length > 0) {
      window.convo = new Convo(this.convos, 'clear-code')
      return
    }

    if (type === 'guide') this.startGuide(name)
    else if (type === 'skip-guide') this.displayTemplate(name)
  }

  async _postGuideConvo () {
    const name = this.state.name
    const res = await utils.getSync(`/api/template/${name}`)
    const owner = WIDGETS['student-session'].getData('owner')

    if (res.data.multifile) {
      if (owner) window.convo = new Convo(this.convos, 'display-template-multi-file')
      else window.convo = new Convo(this.convos, 'display-template-multi-file-no-auth')
    } else {
      if (owner) window.convo = new Convo(this.convos, 'display-template-single-file')
      else window.convo = new Convo(this.convos, 'display-template-single-file-no-auth')
    }
  }

  async _pathToBase64 (relPath) {
    const fullPath = `/templates/${this.state.name}/files/${relPath}`

    const res = await window.fetch(fullPath)
    if (!res.ok) throw new Error(`Failed to fetch ${fullPath}: ${res.status} ${res.statusText}`)

    const blob = await res.blob()
    const base64 = await new Promise((resolve, reject) => {
      const reader = new window.FileReader()
      reader.onerror = reject
      reader.onloadend = () => {
        const dataUrl = reader.result
        resolve(String(dataUrl).split(',')[1])
      }
      reader.readAsDataURL(blob)
    })

    return base64
  }

  async _newRepoFromTemplate (name) {
    const user = WIDGETS['student-session'].getData('owner')
    const message = `stared new repo from netnet ${this.state.name} template`
    nn.get('load-curtain').show('github.html', { filename: `${user}/${name}` })

    try {
      // create files object
      const files = {}
      const paths = Object.keys(this.state.files)
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        if (typeof this.state.files[path] === 'string') {
          files[path] = this.state.files[path]
        } else {
          files[path] = { base64: await this._pathToBase64(path) }
        }
      }

      let README = await utils.getSync('api/github/readme-template')
      README = README.message
        .replace(/\[project-title\]/g, name)
        .replace(/\[user-name\]/g, user)
      files['README.md'] = README

      // send to backend
      const res = await utils.postSync('/api/github/new-repo-from-template', {
        user, name, message, files
      })

      if (res.success) {
        console.log('Repo created:', res.url)
        this.cancel()
        WIDGETS.load('project-files', w => w.openProject(name))
      } else {
        window.convo = new Convo(this.convos, 'oh-no-error')
        console.error('Failed:', res.message, res.error)
        setTimeout(() => nn.get('load-curtain').hide(), 500)
      }
    } catch (err) {
      window.convo = new Convo(this.convos, 'oh-no-error')
      console.error('Request error:', err.message)
      setTimeout(() => nn.get('load-curtain').hide(), 500)
    }
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
        const type = obj.multifile ? 'multiple files' : 'single file'
        div.innerHTML = `
          <h3>
            ${this._transformName(name)}
            <span class="template-proj__file-type">${type}</span>
          </h3>
          <p>${obj.description}</p>
          <div class="template-proj__btns">
            <button name="guide" class="pill-btn pill-btn--secondary">Begin Guide</button>
            <button name="skip" class="pill-btn pill-btn--secondary">Open Completed Template</button>
            <button name="explain" class="pill-btn pill-btn--secondary">?</button>
          </div>
          <br>
        `
        div.querySelector('button[name="guide"]')
          .addEventListener('click', () => this._preCodeCheckConvo(name, 'guide'))
        div.querySelector('button[name="skip"]')
          .addEventListener('click', () => this._preCodeCheckConvo(name, 'skip-guide'))
        div.querySelector('button[name="explain"]')
          .addEventListener('click', () => { window.convo = new Convo(this.convos, 'buttons') })
        this.$('.template-proj').appendChild(div)
      })
    }
  }
}

window.TemplateProjects = TemplateProjects
