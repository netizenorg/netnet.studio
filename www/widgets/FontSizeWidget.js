/* global GenWidget */

class FontSizeWidget extends GenWidget {
  constructor (opts) {
    super(opts)
    this.key = 'font-size-widget'
    this.title = 'Font Size Widget'
    this.data = '24px'
    this._createHTML()
  }

  _codeFieldUpdate (e) {
    const css = this.parceCSS(e.target.value)
    this.fontSlider.value = window.parseInt(css.value[0])
  }

  _fontSliderUpdate (e) {
    this.data = Number(e.target.value)
    this.codeField.value = `font-size: ${this.data}px;`
  }

  _createHTML () {
    this.codeField = this.createCodeField({
      value: 'font-size: 24px;',
      change: (e) => this._codeFieldUpdate(e)
    })

    this.fontSlider = this.createSlider({
      background: '#f00',
      min: 0,
      max: 100,
      label: 'PX',
      change: (e) => this._fontSliderUpdate(e)
    })

    const sec = document.createElement('section')
    sec.appendChild(this.fontSlider)
    sec.appendChild(this.codeField)
    this.innerHTML = sec
  }
}
window.FontSizeWidget = FontSizeWidget
