/* global Widget, STORE, NNW, NNE, FileUploader */
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
    STORE.dispatch('SHARE_URL')
    // TODO, alert box letting folks know that URL was updated
    // TODO, provide system for URL shortening
  }

  openFile () {
    this.fu.input.click()
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
        const data = file.data.split('data:text/html;base64,')[1]
        NNE.code = window.atob(data)
      },
      error: (err) => { console.error(err) }
    })

    // setup event listenters
    const buttons = [
      'share', 'download', 'open', 'tidy', 'layouts', 'themes', 'opacity'
    ]
    buttons.forEach(b => {
      this.$(`#func-menu-${b}`)
        .addEventListener('click', (e) => {
          if (b === 'share') this.shareLink()
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
}

window.MenuFunctions = MenuFunctions
