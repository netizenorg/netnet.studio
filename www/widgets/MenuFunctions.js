/* global Widget, WIDGETS, STORE, NNW, NNE, NNM, FileUploader, Convo */
/*
  -----------
     info
  -----------

  the main menu's Functions sub-menu

  -----------
     usage
  -----------

  // this widget is instantiated by the WindowManager as...
  WIDGETS['Functions Menu'] = new MenuFunctions()

  // it has the following methods
  WIDGETS['Functions Menu'].shareLink()
  WIDGETS['Functions Menu'].downloadCode()
  WIDGETS['Functions Menu'].uploadCode()
  WIDGETS['Functions Menu'].saveProject()
  WIDGETS['Functions Menu'].openProject()
  WIDGETS['Functions Menu'].newProject()
  WIDGETS['Functions Menu'].tidyCode()
  WIDGETS['Functions Menu'].changeLayout()
  WIDGETS['Functions Menu'].changeTheme()
  WIDGETS['Functions Menu'].changeOpacity()
  WIDGETS['Functions Menu'].reboot()

  // also inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js

*/
class MenuFunctions extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Functions' // shows up in title bar
    this.key = 'Functions Menu' // used for: WIDGETS[key] = new MenuFunctions()
    this.resizable = false
    this.listed = false // make sure it doesn't show up in Widgets Menu
    this.keywords = { // for search bar
      subs: ['shareLink', 'saveProject', 'save', 'openProject', 'open', 'new', 'newProject', 'project', 'uploadCode', 'downloadCode', 'tidyCode', 'changeLayout', 'changeTheme', 'changeOpacity', 'reset', 'reboot'],
      alts: ['settings', 'configure', 'configuration', 'options', 'edit', 'file']
    }
    this._createContent()
    this._initValues()
    this._setupListeners()

    this.convos = null
    window.utils.loadConvoData('functions-menu', () => {
      // NOTE: need to rerun this everytime a convo which relies on
      // localStorage data is going to launch (to ensure latest data)
      this.convos = window.convos['functions-menu'](this)
    })
  }

  shareLink () {
    if (!this.convos) window.alert('on sec, loading data') // TODO loading
    STORE.dispatch('CLOSE_WIDGET', 'Functions Menu')
    const opened = window.localStorage.getItem('opened-project')
    if (opened) {
      this.convos = window.convos['functions-menu'](this)
      window.convo = new Convo(this.convos['share-saved-project'])
    } else {
      STORE.dispatch('SHARE_URL')
      window.convo = new Convo(this.convos['share-sketch'])
    }
  }

  saveProject () {
    STORE.dispatch('CLOSE_WIDGET', 'Functions Menu')
    window.utils.get('./api/github/auth-status', (res) => {
      if (res.success) { // if user is authenticated
        if (window.localStorage.getItem('opened-project')) {
          if (window.localStorage.getItem('last-commit-msg') === 'init') {
            window.convo = new Convo(this.convos['save-newish-project'])
          } else {
            this.convos = window.convos['functions-menu'](this)
            window.convo = new Convo(this.convos['save-open-project'])
          }
        } else { // if this is a new project ...
          window.convo = new Convo(this.convos['create-new-project'])
        }
        window.utils.updateRoot()
      } else { // if user has not authenticated
        window.utils.updateRoot()
        window.convo = new Convo(this.convos['user-needs-login-to-save'])
      }
    })
  }

  openProject () {
    STORE.dispatch('CLOSE_WIDGET', 'Functions Menu')
    window.utils.get('./api/github/auth-status', (res) => {
      if (res.success) WIDGETS['saved-projects'].open()
      else window.convo = new Convo(this.convos['user-needs-login-to-open'])
    })
  }

  _newProject () {
    // TODO: new project from a set of templates? templates widget?
    NNE.code = '<!DOCTYPE html>'
    window.utils.clearProjectData()
  }

  newProject () {
    STORE.dispatch('CLOSE_WIDGET', 'Functions Menu')
    if (!window.localStorage.getItem('opened-project')) this._newProject()
    else {
      const lastCode = window.localStorage.getItem('last-commit-code')
      const currCode = window.localStorage.getItem('code')
      if (lastCode === currCode) {
        this.convos = window.convos['functions-menu'](this)
        window.convo = new Convo(this.convos['start-new-project'])
      } else {
        this.convos = window.convos['functions-menu'](this)
        window.convo = new Convo(this.convos['unsaved-changes'])
      }
    }
  }

  uploadCode () {
    STORE.dispatch('CLOSE_WIDGET', 'Functions Menu')
    this.fu.input.click()
  }

  downloadCode () {
    const uri = `data:text/html;base64,${window.btoa(NNE.code)}`
    const a = document.createElement('a')
    a.setAttribute('download', 'index.html')
    a.setAttribute('href', uri)
    a.click()
    a.remove()
  }

  tidyCode () {
    NNE.tidy()
  }

  changeLayout () {
    STORE.dispatch('CHANGE_LAYOUT', this.layoutsSel.value)
  }

  changeTheme () {
    STORE.dispatch('CHANGE_THEME', this.themesSel.value)
  }

  changeOpacity () {
    STORE.dispatch('CHANGE_OPACITY', Number(this.opacityInp.value))
  }

  reboot () {
    STORE.dispatch('CLOSE_WIDGET', 'Functions Menu')
    window.convo = new Convo(this.convos['reboot-netnet'])
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createContent (quote, author) {
    this.innerHTML = `
      <div id="func-menu-content">
        <button id="func-menu-share">shareLink()</button><br>
        <hr>
        <button id="func-menu-download">downloadCode()</button><br>
        <button id="func-menu-upload">uploadCode()</button><br>
        <hr>
        <button id="func-menu-save">saveProject()</button><br>
        <button id="func-menu-open">openProject()</button><br>
        <button id="func-menu-new">newProject()</button><br>
        <hr>
        <button id="func-menu-tidy">tidyCode()</button><br>
        <button id="func-menu-layouts">
          changeLayout(<select id="func-menu-layout-select"></select>)
        </button><br>
        <button id="func-menu-themes">
          changeTheme(<select id="func-menu-themes-select"></select>)
        </button><br>
        <button id="func-menu-opacity">
          changeOpacity(<input id="func-menu-opacity-input"
            type="number" min="0" max="1" step="0.1">)
        </button><br>
        <hr>
        <button id="func-menu-reboot">reboot()</button><br>
      </div>
    `
  }

  _creatOption (value, parent) {
    const o = document.createElement('option')
    o.setAttribute('value', value)
    o.textContent = value
    parent.appendChild(o)
  }

  _initValues () {
    this.layoutsSel = this.$('#func-menu-layout-select')
    NNW.layouts.forEach(l => this._creatOption(l, this.layoutsSel))
    this.themesSel = this.$('#func-menu-themes-select')
    Object.keys(NNE.themes).forEach(l => this._creatOption(l, this.themesSel))
    this.opacityInp = this.$('#func-menu-opacity-input')
    this.opacityInp.value = STORE.state.opacity
    this.layoutsSel.value = STORE.state.layout
    this.themesSel.value = STORE.state.theme
  }

  _setupListeners () {
    // setup FileUploader
    this.fu = new FileUploader({
      click: '#func-menu-upload',
      drop: '#nn-window',
      filter: (type) => {
        if (type !== 'text/html') return false
        else return true // TODO: later allow CSS && JS
      },
      dropping: (e) => { STORE.dispatch('CHANGE_OPACITY', 0.5) },
      dropped: (e) => { STORE.dispatch('CHANGE_OPACITY', 1) },
      ready: (file) => {
        STORE.dispatch('CLOSE_WIDGET', 'Functions Menu')
        const data = file.data.split('data:text/html;base64,')[1]
        NNE.code = window.atob(data)
      },
      error: (err) => {
        window.convo = new Convo(this.convos['temp-disclaimer'])
        console.error('MenuFunctions:', err)
      }
    })

    // setup event listenters
    this.$('button').forEach(btn => {
      const b = btn.id.split('-menu-')[1]
      this.$(`#func-menu-${b}`)
        .addEventListener('click', (e) => {
          if (b === 'share') this.shareLink()
          else if (b === 'download') this.downloadCode()
          // else if (b === 'upload') this.uploadCode() // handled by FileUploader
          else if (b === 'save') this.saveProject()
          else if (b === 'open') this.openProject()
          else if (b === 'new') this.newProject()
          else if (b === 'tidy') this.tidyCode()
          else if (b === 'layouts') this.changeLayout()
          else if (b === 'themes') this.changeTheme()
          else if (b === 'opacity') this.changeOpacity()
          else if (b === 'reboot') this.reboot()
        })
    })

    // setup STORE listeners
    STORE.subscribe('layout', (data) => {
      this.layoutsSel.value = data
    })
    STORE.subscribe('theme', (data) => {
      this.themesSel.value = data
    })
    STORE.subscribe('opacity', (data) => {
      this.opacityInp.value = data
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _shortenURL () {
    return () => {
      STORE.dispatch('SHOW_EDU_TEXT', { content: 'Ok, ...processing...' })
      const time = STORE.getTransitionTime()
      setTimeout(() => {
        window.utils.runProcessingFace()
        setTimeout(() => {
          const data = { hash: window.location.hash }
          window.utils.post('./api/shorten-url', data, (res) => {
            if (!res.success) {
              console.error(res.error)
              window.convo = new Convo(this.convos['oh-no-error'])
              setTimeout(() => NNM.setFace('ŏ', '︵', 'ŏ', false), time)
            } else {
              const waitForDramaticEffect = time < 2000 ? 2000 : time
              setTimeout(() => {
                window.localStorage.setItem('project-url', res.url)
                this.convos = window.convos['functions-menu'](this)
                window.convo = new Convo(this.convos['url-shortened'])
                window.utils.processingFace = false
              }, waitForDramaticEffect)
            }
          })
        }, time)
      }, time)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // github methods

  _githubAuth (from) {
    // keep a refernce for where the user was redirected from
    // ('save' or 'open') so netnet knows what dialogue to present
    // when they get redirected back.
    window.localStorage.setItem('pre-auth-from', from)
    const id = 'client_id=af0f317a19fc4fd571be'
    const scope = 'scope=public_repo'
    const url = `https://github.com/login/oauth/authorize?${id}&${scope}`
    const a = document.createElement('a')
    a.setAttribute('download', 'index.html')
    a.setAttribute('href', url)
    a.click()
  }

  _createNewRepo (c, t, v) {
    window.utils.runProcessingFace()
    t.$('section').innerHTML = '...saving to GitHub...'
    NNM.textBubble.updatePosition()
    const time = STORE.getTransitionTime()
    const data = { name: v, data: window.btoa(NNE.code) }
    window.utils.post('./api/github/new-repo', data, (res) => {
      window.utils.processingFace = false
      if (res.error) { // if there's an error creating the repo
        console.error(res.error)
        if (res.error.errors[0].message.includes('name already exists')) {
          window.convo = new Convo(this.convos['project-already-exists'])
        } else {
          window.convo = new Convo(this.convos['oh-no-error'])
        }
        setTimeout(() => NNM.setFace('ŏ', '︵', 'ŏ', false), time)
      } else { // otherwise let the user know it's all good!
        const code = NNE._encode(NNE.code)
        window.utils.setProjectData({
          name: res.name,
          code: code,
          sha: res.data.content.sha,
          message: 'init'
        })
        WIDGETS['saved-projects'].add(res.name)
        this.convos = window.convos['functions-menu'](this)
        window.convo = new Convo(this.convos['new-project-created'])
      }
    })
  }

  _publishProject () {
    STORE.dispatch('SHOW_EDU_TEXT', {
      content: '...publishing to GitHub Pages...'
    })
    const time = STORE.getTransitionTime()
    setTimeout(() => { window.utils.runProcessingFace() }, time)
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: window.localStorage.getItem('opened-project')
    }
    window.utils.post('./api/github/gh-pages', data, (res) => {
      if (!res.success) {
        window.convo = new Convo(this.convos['oh-no-error'])
        setTimeout(() => NNM.setFace('ŏ', '︵', 'ŏ', false), time)
      } else {
        window.localStorage.setItem('project-url', res.data.html_url)
        this.convos = window.convos['functions-menu'](this)
        window.convo = new Convo(this.convos['publish-to-ghpages'])
      }
    })
  }

  _updateProject (message) {
    STORE.dispatch('SHOW_EDU_TEXT', { content: '...saving to GitHub...' })
    const time = STORE.getTransitionTime()
    setTimeout(() => { window.utils.runProcessingFace() }, time)
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: window.localStorage.getItem('opened-project'),
      sha: window.localStorage.getItem('index-sha'),
      path: 'index.html',
      message: message,
      code: window.btoa(NNE.code)
    }
    window.utils.post('./api/github/save-project', data, (res) => {
      if (!res.success) {
        window.convo = new Convo(this.convos['oh-no-error'])
        setTimeout(() => NNM.setFace('ŏ', '︵', 'ŏ', false), time)
      } else {
        window.localStorage.setItem('index-sha', res.data.content.sha)
        window.localStorage.setItem('last-commit-msg', res.data.commit.message)
        window.localStorage.setItem('last-commit-code', NNE._encode(NNE.code))
        window.convo = new Convo(this.convos['project-saved'])
      }
    })
  }
}

window.MenuFunctions = MenuFunctions
