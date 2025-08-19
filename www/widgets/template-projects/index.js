/* global Widget Convo NNW NNE utils nn WIDGETS */
class TemplateProjects extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'template-projects'
    this.keywords = ['templates', 'starter', 'projects', 'examples', 'boilterplate', 'forks']

    this.title = 'Template Starter Projects'
    this.width = 550

    this.list = {} // dict of tempaltes
    this.bld = {} // dict of which templates build on others
    this.state = {} // details of opened template

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

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
    window.convo = new Convo(this.convos, 'notes-click')
  }

  cancel () {
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
      NNE.update()
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
      // update title bar && URL
      utils.setCustomRenderer(null)
      utils.updateURL(`?template=${this.state.name}`)
      const t = `${this._getTemplateName(this.state.name)} Template`
      NNW.updateTitleBar(t)
      // TODO: maybe show path (for multi file templates?)
      NNW.title.dataset.template = true
    })
  }

  async displayTemplate (name) {
    if (!name && this.state.name) name = this.state.name
    // TODO: might need to update this when a template is a "project"
    // so that we can open the necessary directories
    // maybe there's an alt convo to "remix"

    // TODO: in case of "mutli-file" would need to let them know somehow
    // "this template has multiple files, create new project to view them"

    window.convo.hide()
    this.cancel()
    this.close()

    if (!this.codeEdit) this._setupCodeUpdateListener()

    const res = await utils.getSync(`/api/template/${name}`)
    this.state = { // also used for convo's "self" object
      name: name,
      files: Object.fromEntries(res.data.files.map(k => [k, null]))
    }

    const index = await utils.getSync(`/templates/${name}/files/index.html`, true)
    NNE.code = this.state.files['index.html'] = index
    NNE.update()

    if (NNW.layout !== 'dock-left') {
      NNW.layout = 'dock-left'
      await nn.sleep(utils.getVal('--layout-transition-time'))
    }

    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'remix')
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
    const hvp = WIDGETS['hyper-video-player']
    if (utils.tutorialOpen() || (hvp && hvp.opened)) {
      hvp.close()
      setTimeout(() => WIDGETS['learning-guide'].close(), 100)
    }
    // check for an open project
    const openProj = WIDGETS['student-session'].getData('opened-project')
    if (openProj && WIDGETS['project-files']) {
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

  _postGuideConvo () {
    // TODO: start new project with files?
    window.convo = new Convo(this.convos, 'end-guide')
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

  async _newRepoFromTemplate () { // TODO: ... finished
    try {
      const changes = []
      const paths = Object.keys(this.state.files)
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        const obj = { action: 'create', path }
        if (typeof this.state.files[path] === 'string') {
          obj.content = this.state.files[path]
        } else {
          obj.content = await this._pathToBase64(path)
          obj.isBinary = true
        }
        changes.push(obj)
      }

      console.log(changes);

      // TODO: create a readme for each template? maybe using some basic tempalte && their description?
      // TODO: then send to ...

      const res = await utils.postSync('/api/github/push', {
        owner, repo, branch,
        commitMessage: 'add image',
        changes: [{ action: 'create', path: 'images/pic.png', content: png64, isBinary: true }]
      })

      console.log(res);

      // const resp = await utils.postSync('/api/github/new-repo-from-files', {
      //   name: 'my-new-project',
      //   user: 'your-github-username',
      //   files,
      //   commitMessage: 'initial import'
      // })

      // if (resp.success) {
      //   console.log('Repo created:', resp.url)
      //   console.log('Branch:', resp.branch)
      //   console.log('Files:', resp.files)
      // } else {
      //   console.error('Failed:', resp.message, resp.error)
      // }
    } catch (err) {
      console.error('Request error:', err.message)
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
      Object.entries(this.list).forEach(([name, desc]) => {
        const div = nn.create('div')
        div.innerHTML = `
          <h3>${this._transformName(name)}</h3>
          <p>${desc}</p>
          <div class="template-proj__btns">
            <button name="guide" class="pill-btn pill-btn--secondary">Begin Guide</button>
            <button name="skip" class="pill-btn pill-btn--secondary">Jump to Template</button>
            <button name="explain" class="pill-btn pill-btn--secondary">?</button>
          </div>
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
