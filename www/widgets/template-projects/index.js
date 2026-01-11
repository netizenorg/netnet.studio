/* global Widget Convo NNW NNE utils nn WIDGETS */
class TemplateProjects extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'template-projects'
    this.keywords = ['templates', 'starter', 'projects', 'examples', 'boilterplate', 'forks']

    this.title = 'Template Starter Projects'
    this.width = 560
    this.height = 400
    this.resizable = false

    this.list = {} // dict of tempaltes
    this.bld = {} // dict of which templates build on others
    this.state = {} // details of opened template

    Convo.load(this.key, () => {
      this.convos = window.CONVOS[this.key](this)
      if (window.convo?.id === 'load-template') return
      window.convo = new Convo(this.convos, 'template-widget-open')
    })

    utils.get('/api/templates', (res) => {
      if (res.success) {
        this.list = res.data.list
        this.bld = res.data.buildOn
      }
      this._createHTML()
    })

    this._boundEditWatcher = this._editWatcher.bind(this)
    this.on('close', () => {
      if (!this.state.curPassage) NNE.cm.off('keydown', this._boundEditWatcher)
    })

    this.codeEdit = null // runs on code update when template is open
  }

  explainTitleBar () {
    if (this.state.curPassage) {
      window.convo = new Convo(this.convos, 'notes-click')
    } else {
      window.convo = new Convo(this.convos, 'notes-click-pre-guide')
    }
    if (!WIDGETS['template-toc'].opened) WIDGETS.open('template-toc')
  }

  cancel () {
    utils.setCustomRenderer(null)
    if (utils.url.template) utils.updateURL(null)
    NNW.updateTitleBar(null)
    NNE.spotlight(null)
    NNE.marker(null)
    this.state = {}
    NNE.update(NNE.code)
    NNE.off('code-update', this.codeEdit)
    NNE.readOnly = false
    NNE.cm.off('keydown', this._boundEditWatcher)
    NNE.language = 'html'
    NNE.wrap = WIDGETS['student-session'].getData('wrap') === 'true'
    NNE.autoUpdate = WIDGETS['student-session'].getData('auto-update') === 'true'
    if (WIDGETS['template-toc']) {
      WIDGETS['template-toc'].updateView()
      WIDGETS['template-toc'].close()
    }
  }

  updateEditor (opts = {}) {
    const info = NNE.cm.getScrollInfo()
    const sel = this.state.editor.selected

    const readStatus = NNE.readOnly
    if (opts.selected) {
      this.state.editor.selected = opts.selected
      this._updateTitleBar()
    }

    if (opts.language) {
      this.state.editor.language = opts.language
      NNE.language = opts.language
      NNE.cm.on('keydown', this._boundEditWatcher)
      NNE.readOnly = readStatus
    }

    if (opts.renderer) this.state.editor.renderer = opts.renderer
    else if (opts.renderer === null) {
      this.state.editor.renderer = null
      NNE.update(NNE.code)
    }

    if (typeof opts.readOnly === 'boolean') {
      NNE.readOnly = opts.readOnly
    }

    if (sel === this.state.editor.selected) {
      NNE.cm.scrollTo(info.left, info.top)
    }

    // this was causing strainge spotlight/scrolling offfset bugs
    // so instead we'll make sure to revert to normal on "cancel"
    // NNE.wrap = WIDGETS['student-session'].getData('wrap')
  }

  loadTemplate (name) {
    this.state = { name }
    this._tempName = name

    if (typeof window.CONVOS[this.key] !== 'function') {
      Convo.load(this.key, () => {
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'load-template')
      })
    } else {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'load-template')
    }

    if (!NNE.autoUpdate) NNE.update()
  }

  async preNewRepoFromTemplate (n) {
    // when choosing "start new project" after clicking title bar on a fully loaded template
    // or when choosing to "save" + "new project" (redirected from project-files)
    // or when choosing "new project from template" in widget list
    // or when called at the end of a template's convo
    const name = n || this.state.name
    const res = await utils.getSync(`/api/template/${name}`)
    const multifile = res.data.files.length > 1
    const owner = WIDGETS['student-session'].getData('owner')

    if (!this.state.files) {
      this.state = { // also used for convo's "self" object
        name: name,
        title: res.data.title,
        vars: res.data.vars,
        templates: res.data.templates,
        files: Object.fromEntries(res.data.files.map(k => [k, null]))
      }
    }

    if (owner && multifile) {
      window.convo = new Convo(this.convos, 'new-project-from-template')
    } else if (owner) {
      window.convo = new Convo(this.convos, 'new-proj-single-file')
    } else if (multifile) {
      window.convo = new Convo(this.convos, 'new-proj-multi-file-no-auth')
    } else {
      window.convo = new Convo(this.convos, 'new-proj-single-file-no-auth')
    }
  }

  async loadIndexAsSketch () {
    const name = this.state.name
    utils.cancelAllNetitorUses('template-projects')
    this.cancel()
    this.close()

    const index = await utils.getSync(`/templates/${name}/files/index.html`, true)
    NNE.code = index

    if (NNW.layout !== 'dock-left') {
      NNW.layout = 'dock-left'
      let wait = utils.getVal('--layout-transition-time')
      if (NNW.menu.textBubble.opened) wait += utils.getVal('--menu-fades-time')
      await nn.sleep(wait)
    }

    window.convo.hide()
    if (!NNE.autoUpdate) NNE.update()
  }

  // .........................................

  async startGuide (name) {
    utils.cancelAllNetitorUses('template-projects')

    if (!name) name = this.state.name
    const template = await utils.getSync(`/api/template/${name}`)
    const prevName = this.state.name
    const preVars = this.state.vars
      ? JSON.parse(JSON.stringify(this.state.vars)) : null

    this.cancel()
    this.close()

    if (!this.codeEdit || !NNE.events['code-update'].includes(this.codeEdit)) {
      this._setupCodeUpdateListener()
    }

    NNE.readOnly = true
    NNE.autoUpdate = true
    NNE.cm.on('keydown', this._boundEditWatcher)

    this.state = { // also used for convo's "self" object
      name: name,
      title: template.data.title,
      curPassage: null,
      editor: {
        selected: 'index.html',
        language: 'html',
        renderer: null // render template from data.renderers
      },
      templates: template.data.templates,
      files: Object.fromEntries(template.data.files.map(k => [k, null])),
      lines: template.data.lines,
      renderers: template.data.renderers
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

    this._hydrateTemplateFiles('renderers') // populate renderer vars

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
      const multifile = template.data.files.length > 1
      if (!multifile) utils.setCustomRenderer(null)
      else utils.setCustomRenderer(`/templates/${name}/files/`)

      // update title bar && URL
      utils.updateURL(`?template=${this.state.name}`)
      this._updateTitleBar()

      // open the templates-toc (Notes progress bar)
      WIDGETS.open('template-toc', (w) => w.updateView())
    })
  }

  // --------------------------------------------------- PRIVATE METHODS -------

  _editWatcher () {
    if (NNE.readOnly) {
      if (window.convo.id !== 'on-edit') {
        this._lastConvo = window.convo.id
      }
      window.convo = new Convo(this.convos, 'on-edit')
    }
  }

  _getTemplateName () {
    return this.state.title || this._transformName(this.state.name || 'untitled')
  }

  _updateTitleBar () {
    const sel = this.state.editor?.selected
    const tname = this._getTemplateName()
    const t = sel !== 'index.html' ? `${tname}: ${sel}` : tname
    NNW.updateTitleBar(t)
    NNW.title.dataset.template = true
  }

  _setupCodeUpdateListener () {
    const codeEdit = () => {
      if (Object.keys(this.state).length < 0) return this.cancel()
      const s = this.state.editor?.selected || 'index.html'
      this.state.files[s] = NNE.code
    }

    this.codeEdit = codeEdit

    NNE.on('code-update', codeEdit)
  }

  _templateConvo (first) {
    const cnv = `template-${this.state.name}`
    const psg = first ? window.CONVOS[cnv]()[0].id : this.state.curPassage
    window.convo = new Convo(this.state.convos, psg)
    window.convo.on('update', (c) => {
      this._typeTemplateCode(c.id)
      WIDGETS['template-toc'].updateProgress()
    })
    // if (first) this._typeTemplateCode(psg) // TODO: check if we still need this?
  }

  _experimentWithCode () {
    this._prevWrap = NNE.wrap
    NNE.readOnly = false
    NNE.autoUpdate = WIDGETS['student-session'].getData('auto-update') === 'true'
    NNE.wrap = WIDGETS['student-session'].getData('wrap') === 'true'
  }

  _continueGuide () {
    NNE.readOnly = true
    NNE.autoUpdate = true
    NNE.wrap = this._prevWrap
    const s = this.state
    window.convo = new Convo(s.convos, s.curPassage)
    window.convo.on('update', (c) => {
      this._typeTemplateCode(c.id)
      WIDGETS['template-toc'].updateProgress()
    })
  }

  _skipTo (title) { // NOTE: used by WIDGETS['template-toc']
    const s = this.state
    const key = Object.keys(s.lines).find(function (key) {
      return s.lines[key] && s.lines[key].title === title
    })
    if (key) {
      window.convo = new Convo(s.convos, key)
      window.convo.on('update', (c) => {
        this._typeTemplateCode(c.id)
        WIDGETS['template-toc'].updateProgress()
      })
    } else {
      console.log('WIDGETS: template-projects: could not skip to ', title)
    }
  }

  _skipToEnd () {
    const s = this.state
    window.convo = new Convo(s.convos, 'end-guide')
    window.convo.on('update', (c) => {
      this._typeTemplateCode(c.id)
      WIDGETS['template-toc'].updateProgress()
    })
  }

  _typeTemplateCode (id) {
    // this runs on convo update
    NNE.spotlight(null)
    this.state.curPassage = id

    const getLine = () => {
      if (!this.state.lines) return null
      const line = this.state.lines[this.state.curPassage]
      if (!line) return null
      else return this._transformLine(line)
    }

    const injectTemplate = (opts) => {
      utils.cancelAutoType()
      const info = NNE.cm.getScrollInfo()
      NNE.code = opts.template
      NNE.cm.scrollTo(info.left, info.top)
      if (opts.callback) opts.callback(opts.id)
    }

    // ............................................
    // if this convo has a {template, code} line...
    // ............................................
    const line = getLine()
    if (!line) return

    const opts = { id }
    opts.buffer = 4 // padded lines above target "code" (when scroll is needed)
    if (line.template) opts.template = line.template
    if (line.code) opts.code = line.code

    // setup callback: if line has spotlight (or needs custom renderer)
    opts.callback = (id) => { // only run callback if it's for the current id
      if (this.state.curPassage !== id) return
      const line = getLine()
      if (!line) return

      const rndr = this.state.editor?.renderer
      if (rndr) {
        const template = this.state.renderers[rndr]
        NNE.update(template)
      }
      if (line.spotlight) {
        this._spotTO = setTimeout(() => NNE.spotlight(line.spotlight), 500)
      }
    }

    // if there's a "template" but no "code" to type,
    if (opts.template && !opts.code) { // then simply inject template
      injectTemplate(opts)
    } else { // ...otherwise, scroll to "code" area && begin autoType
      utils.autoType(opts)
      // NOTE: don't think we need this now that autotype also "smooth" scrolls
      // if (this._scrollToNextCode(opts)) {
      //   setTimeout(() => utils.autoType(opts), 500)
      // } else utils.autoType(opts)
    }
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
    // else if (type === 'skip-guide') this.displayTemplate(name)
    else if (type === 'skip-guide') this.preNewRepoFromTemplate(name)
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
      this._hydrateTemplateFiles('templates')
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]
        const dict = this.state.templates || this.state.files
        if (typeof dict[path] === 'string') {
          if (path === this.state.editor.selected) { // use current verstion
            files[path] = NNE.code
          } else { // used the template or state version
            files[path] = dict[path].includes('\t') // clean up tabs (if present)
              ? dict[path].replace(/\t/g, '  ') : dict[path]
          }
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
        this.close()
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

  _hydrateTemplateFiles (type) {
    // store unhydrated tempalted data
    if (!this._originalData) {
      this._originalData = {
        renderers: JSON.parse(JSON.stringify(this.state.renderers || {})),
        templates: JSON.parse(JSON.stringify(this.state.templates || {}))
      }
    }
    // create new hydrated state from original data
    const obj = this._originalData[type]
    for (const tmp in obj) {
      let str = obj[tmp]
      Object.entries(this.state.vars).forEach(([key, val]) => {
        str = str.replaceAll(`{{${key}}}`, val)
      })
      this.state[type][tmp] = str
    }
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
    Object.entries(this.state.vars || {}).forEach(([key, val]) => {
      c = c.replaceAll(`{{${key}}}`, val)
      t = t.replaceAll(`{{${key}}}`, val)
    })
    return { code: c, template: t, spotlight: line.spotlight }
  }

  // NOTE: don't think we need this now that autoType also "smooth" scrolls
  // _scrollToNextCode (opts) {
  //   const lines = opts.template.split('\n')
  //   const idx = lines.indexOf(lines.find(l => l.includes('{{code}}')))
  //   const v = NNE.getVisibleRange()
  //   if (idx <= v.top || idx >= v.bottom) {
  //     const buffer = opts.buffer || 0 // extra buffer lines above target line
  //     const lineHeight = NNE.cm.defaultTextHeight()
  //     const coords = NNE.cm.charCoords({ line: idx, ch: 0 }, 'local')
  //     NNE.cm.getScrollerElement().scrollTo({
  //       top: coords.top - (buffer * lineHeight),
  //       behavior: 'smooth'
  //     })
  //     return true
  //   } else {
  //     return false
  //   }
  // }

  _createHTML () {
    if (this.list.length === 0) {
      this.innerHTML = '<p>ERROR LOADING TEMPLATES ŏ︵ŏ</p>'
    } else {
      this.innerHTML = '<div class="template-proj"></div>'
      Object.entries(this.list).forEach(([name, obj]) => {
        const ex = name.split('-')[0]
        const fileTypes = ex === 'js' ? 'html, css, js' : ex === 'css' ? 'html, css' : 'html'
        const div = nn.create('div')
        div.innerHTML = `
          <h3>
            ${obj.title || this._transformName(name)}
            <span class="template-proj__file-types">${fileTypes}</span>
          </h3>
          <div class="template-proj__btns">
            <button name="preview" class="pill-btn pill-btn--secondary">Preview</button>
            <button name="guide" class="pill-btn pill-btn--secondary">Guided Walkthrough</button>
            <button name="skip" class="pill-btn pill-btn--secondary">New Project From Template</button>
            <button name="explain" class="pill-btn pill-btn--secondary">?</button>
          </div>
          <p>${obj.description}</p>
          <pre class="template-proj__tree">${this._drawDirTree(obj.files, name)}</pre>
          <br>
        `
        div.querySelector('button[name="preview"]')
          .addEventListener('click', () => {
            const url = `/templates/${name}/files/index.html`
            window.open(url, '_blank', 'noopener,noreferrer')
          })
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

  _drawDirTree (paths, proj) {
    const IMAGE_THRESHOLD = 3
    const FONT_THRESHOLD = 3
    const rootLabel = 'Project Files'
    const root = { name: rootLabel, path: '', children: new Map(), isFile: false }

    const seen = new Set()
    for (const raw of paths || []) {
      if (!raw) continue
      const full = String(raw).trim().replace(/\\/g, '/')
      if (!full || seen.has(full)) continue
      seen.add(full)

      const parts = full.split('/').filter(Boolean)
      let node = root
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (!node.children.has(part)) {
          // compute this child's path relative to the (virtual) root
          const subPath = parts.slice(0, i + 1).join('/')
          node.children.set(part, { name: part, path: subPath, children: new Map(), isFile: false })
        }
        node = node.children.get(part)
        if (i === parts.length - 1) {
          // mark leaf as file unless the input explicitly ends with '/'
          node.isFile = !full.endsWith('/')
        }
      }
    }

    const sortKids = kids => {
      return kids.sort((a, b) => {
        if (a.isFile !== b.isFile) return a.isFile ? 1 : -1
        return a.name.localeCompare(b.name, undefined, { numeric: true })
      })
    }

    const isImage = ext => ['jpg', 'jpeg', 'gif', 'png', 'svg'].includes(ext)
    const isFont = ext => ['woff2'].includes(ext)

    const getEmoji = (node) => {
      if (!node.isFile) return '📁'
      const ext = node.name.split('.').pop().toLowerCase()
      if (isImage(ext)) return '🏞️'
      if (['txt', 'csv', 'json', 'md', 'html', 'js', 'css'].includes(ext)) return '📄'
      if (isFont(ext)) return '🔠'
      return '📄'
    }

    const countByType = (children) => {
      let images = 0
      let fonts = 0
      for (const child of children) {
        if (!child.isFile) continue
        const ext = child.name.split('.').pop().toLowerCase()
        if (isImage(ext)) images++
        if (isFont(ext)) fonts++
      }
      return { images, fonts }
    }

    const encodePathForUrl = (p) => {
      // encode *segments* so slashes survive
      return p.split('/').map(encodeURIComponent).join('/')
    }

    const hrefFor = (proj, node, isDir = false) => {
      // if isDir is true, we link to the folder itself
      const base = `/templates/${proj}/files/`
      const rel = encodePathForUrl(node.path || '')
      // if linking to a folder, make sure it ends with a slash (if your server expects it)
      return isDir ? base + (rel ? rel + '/' : '') : base + rel
    }

    const lines = []
    if (rootLabel) lines.push(`📁 <b>${rootLabel}</b>`)

    const render = (node, prefix) => {
      let children = sortKids(Array.from(node.children.values()))
      const { images, fonts } = countByType(children)

      // collapse images if over threshold
      if (images > IMAGE_THRESHOLD) {
        children = children.filter(c => {
          const ext = c.name.split('.').pop().toLowerCase()
          return !isImage(ext)
        })
        const url = hrefFor(proj, node, true) // link to this folder
        const name = `<a class="multi-files" href="${url}" target="_blank">${images} images</a>`
        children.push({ name, isFile: true, children: new Map(), emoji: '🏞️', forceLabel: true })
      }

      // collapse fonts if over threshold
      if (fonts > FONT_THRESHOLD) {
        children = children.filter(c => {
          const ext = c.name.split('.').pop().toLowerCase()
          return !isFont(ext)
        })
        const url = hrefFor(proj, node, true) // link to this folder
        const name = `<a class="multi-files" href="${url}" target="_blank">${fonts} fonts</a>`
        children.push({ name, isFile: true, children: new Map(), emoji: '🔠', forceLabel: true })
      }

      children.forEach((child, i) => {
        const isLast = i === children.length - 1
        const connector = isLast ? '└── ' : '├── '
        const emoji = child.forceLabel ? child.emoji : getEmoji(child)

        // if this is a synthetic summary node, its name already contains an <a>
        let labelHtml
        if (child.forceLabel) {
          labelHtml = child.name
        } else {
          const isDir = !child.isFile
          const url = hrefFor(proj, child, isDir)
          labelHtml = `<a href="${url}" target="_blank">${child.name}</a>`
        }

        lines.push(prefix + connector + emoji + ' ' + labelHtml)

        if (!child.isFile && child.children.size > 0) {
          const nextPrefix = prefix + (isLast ? '    ' : '│   ')
          render(child, nextPrefix)
        }
      })
    }

    render(root, '')
    return lines.join('\n')
  }
}

window.TemplateProjects = TemplateProjects
