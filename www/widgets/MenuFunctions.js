/* global Widget, STORE, NNW, NNE, NNM, FileUploader */
/*
  -----------
     info
  -----------

  the main menu's Functions sub-menu

  -----------
     usage
  -----------

  // this widget is instantiated by the WindowManager as...
  WIDGETS['functions-menu'] = new MenuFunctions()

  // it has the following methods
  WIDGETS['functions-menu'].shareLink()
  WIDGETS['functions-menu'].openFile()
  WIDGETS['functions-menu'].tidyCode()
  WIDGETS['functions-menu'].changeLayout()
  WIDGETS['functions-menu'].changeTheme()
  WIDGETS['functions-menu'].changeOpacity()

  // as well as the props/methods it inherites from the base Widget class

  WIDGETS['functions-menu'].innerHTML = element
  WIDGETS['functions-menu'].title = 'settings'
  WIDGETS['functions-menu'].x = 20
  WIDGETS['functions-menu'].y = '50vh'
  WIDGETS['functions-menu'].z = 100
  WIDGETS['functions-menu'].width = '50vw'
  WIDGETS['functions-menu'].height = '50vh'

  WIDGETS['functions-menu'].position(x, y, z)     // update position
  WIDGETS['functions-menu'].resize(width, height) // update size
  WIDGETS['functions-menu'].open()                // display
  WIDGETS['functions-menu'].close()               // hide

*/
class MenuFunctions extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Functions Menu'
    this._createContent()
    this._initValues()
    this._setupListeners()
  }

  shareLink () {
    STORE.dispatch('CLOSE_WIDGET', 'functions-menu')
    STORE.dispatch('SHARE_URL')
    let m = 'The URL has been udpated to include your sketches data!'
    m += ' Copy the URL from your browser\'s address bar to share it.'
    m += ' It\'s long because it contains all your code, '
    m += 'but if you\'d like we can generate a short URL for you?'
    STORE.dispatch('SHOW_EDU_TEXT', {
      content: m,
      options: {
        'no, that\'s alright': () => { STORE.dispatch('HIDE_EDU_TEXT') },
        'yes please': this._shortenURL()
      }
    })
  }

  saveProject () {
    STORE.dispatch('CLOSE_WIDGET', 'functions-menu')
    let m = 'I can\'t actually save a project online for you just yet '
    m += '(though the folks at netizen.org are working on that).'
    m += ' In the meantime you can download this HTML sketch to your '
    m += 'comptuer to save it "locally", or we can save the data to a URL'
    m += ' for you?'
    STORE.dispatch('SHOW_EDU_TEXT', {
      content: m,
      options: {
        'I\'d like it downloaded': () => {
          this.downloadFile()
          STORE.dispatch('HIDE_EDU_TEXT')
        },
        'I\'d like that share url': () => { this.shareLink() },
        'never mind': () => { STORE.dispatch('HIDE_EDU_TEXT') }
      }
    })
  }

  openFile () {
    STORE.dispatch('CLOSE_WIDGET', 'functions-menu')
    this.fu.input.click()
  }

  downloadFile () {
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

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createContent (quote, author) {
    this.innerHTML = `
      <div>
        <button id="func-menu-save">saveProject()</button>
        <button id="func-menu-share">shareLink()</button>
        <button id="func-menu-download">downloadFile()</button>
        <button id="func-menu-open">openFile()</button>
        <button id="func-menu-tidy">tidyCode()</button>
        <button id="func-menu-layouts">
          changeLayout(<select id="func-menu-layout-select"></select>)
        </button>
        <button id="func-menu-themes">
          changeTheme(<select id="func-menu-themes-select"></select>)
        </button>
        <button id="func-menu-opacity">
          changeOpacity(<input id="func-menu-opacity-input"
            type="number" min="0" max="1" step="0.1">)
        </button>
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
      click: '#func-menu-open',
      drop: '#nn-window',
      filter: (type) => {
        if (type !== 'text/html') return false
        else return true // TODO: later allow CSS && JS
      },
      dropping: (e) => { STORE.dispatch('CHANGE_OPACITY', 0.5) },
      dropped: (e) => { STORE.dispatch('CHANGE_OPACITY', 1) },
      ready: (file) => {
        STORE.dispatch('CLOSE_WIDGET', 'functions-menu')
        const data = file.data.split('data:text/html;base64,')[1]
        NNE.code = window.atob(data)
      },
      error: (err) => { console.error(err) }
    })

    // setup event listenters
    this.$('button').forEach(btn => {
      const b = btn.id.split('-menu-')[1]
      this.$(`#func-menu-${b}`)
        .addEventListener('click', (e) => {
          if (b === 'save') this.saveProject()
          else if (b === 'share') this.shareLink()
          else if (b === 'download') this.downloadFile()
          // else if (b === 'open') this.openFile() // handled by FileUploader
          else if (b === 'tidy') this.tidyCode()
          else if (b === 'layouts') this.changeLayout()
          else if (b === 'themes') this.changeTheme()
          else if (b === 'opacity') this.changeOpacity()
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
        NNM.setFace('☉', '⌄', '◉')
        this._processingFace = true
        this._runProcessingFace()
        setTimeout(() => {
          window.fetch('./api/shorten-url', {
            method: 'POST',
            headers: {
              Accept: 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hash: window.location.hash })
          }).then(res => res.json())
            .then(json => {
              if (json.error) this._urlShortner('error', json)
              else this._urlShortner('success', json)
            }).catch(err => this._urlShortner('error', err))
        }, time)
      }, time)
    }
  }

  _runProcessingFace () {
    const face = NNM.getFace()
    if (face[0] === '☉') NNM.setFace('◉', '⌄', '☉')
    else if (face[0] === '◉') NNM.setFace('☉', '⌄', '◉')
    setTimeout(() => {
      if (this._processingFace) this._runProcessingFace()
      else NNM.setFace('◕', '◞', '◕')
    }, 250)
  }

  _urlShortner (type, data) {
    if (type === 'error') {
      console.error(data)
      let m = 'Oh dang! looks like the server had an issue shortening the URL.'
      m += ' Check the JavaScript console for more info.'
      STORE.dispatch('SHOW_EDU_TEXT', {
        content: m, options: { ok: () => { STORE.dispatch('HIDE_EDU_TEXT') } }
      })
      this._processingFace = false
    } else {
      const time = STORE.getTransitionTime()
      const waitForDramaticEffect = time < 2000 ? 2000 : time
      setTimeout(() => {
        let m = `Ok! here's your shortened URL: <input value="${data.url}">`
        m += '<br>And here\'s one with the code hidden: '
        m += `<input value="${data.url}&opacity=0">`
        STORE.dispatch('SHOW_EDU_TEXT', {
          content: m,
          options: { 'thanks!': () => { STORE.dispatch('HIDE_EDU_TEXT') } }
        })
        this._processingFace = false
      }, waitForDramaticEffect)
    }
  }
}

window.MenuFunctions = MenuFunctions
