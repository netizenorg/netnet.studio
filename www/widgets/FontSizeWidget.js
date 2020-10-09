/* global GenWidget */

class FontSizeWidget extends GenWidget {
  constructor (opts) {
    super(opts)
    this.key = 'font-size-widget'
    this.title = 'Font Size Widget'
    this.data = '24px'
    this._createHTML()

    this.on('data-update', (val) => {
      this.data = val
      this.codeField.value = `font-size: ${val};`
      this.fontSlider.value = window.parseInt(val)
    })
  }

  _codeFieldUpdate (e) {
    const css = this.parceCSS(e.target.value)
    this.emit('data-update', css.value[0])
  }

  _fontSliderUpdate (e) {
    this.emit('data-update', e.target.value + 'px')
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
window.ExampleWidget = FontSizeWidget
