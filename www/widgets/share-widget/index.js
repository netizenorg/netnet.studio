/* global Widget, WIDGETS, NNE, NNW, Convo, utils, QRious */
class ShareWidget extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'share-widget'
    this.keywords = ['share', 'link', 'url', 'save']
    this.title = 'Share Sketch'
    this.width = 582

    this.shortCode = null
    this.layoutsSel = null
    this.qrcode = null
    this._createHTML(opts)

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    const firstConvo = () => {
      if (this.convos) {
        window.convo = new Convo(this.convos, 'generate-sketch-url')
      } else setTimeout(() => firstConvo(), 100)
    }

    this.on('open', (eve) => {
      firstConvo()
      this.layoutsSel.value = NNW.layout
      this.$('[name="sketch-qr-code"]').style.display = 'none'
      this.qrcode = null
      this.$('[name="share-url"]').value = this._shareURL(true)
    })

    NNE.on('code-update', () => {
      if (this._codeUpdate) clearTimeout(this._codeUpdate)
      this._codeUpdate = setTimeout(() => {
        this.$('[name="sketch-qr-code"]').style.display = 'none'
        this.qrcode = null
        this.$('[name="share-url"]').value = this._shareURL(true)
      }, 1000)
    })
  }

  _creatOption (value, parent) {
    const o = document.createElement('option')
    o.setAttribute('value', value)
    o.textContent = value
    parent.appendChild(o)
  }

  _createHTML (opts) {
    opts = opts || {}
    this.innerHTML = `
      <div class="share-widget">
        <p>Click the encoded URL below to copy it to your clipboard.</p>
        <input name="share-url" value="${this._shareURL()}" style="display: inline-block; width: 100%" onclick="WIDGETS['share-widget']._copyURL()" readonly="readonly">
        <div class="share-widget__section">
          <button class="share-widget__qr-btn" name="qr-btn" title="show QR code">
            <span class="share-widget__qr-icon"></span>
          </button>
          <button class="pill-btn pill-btn--secondary" name="shorten-url">Shorten URL</button>
        </div>
        <div class="share-widget__section">
          <label style="margin-left: 65px;">
            netnet layout
            <select class="dropdown dropdown--invert" name="share-layout-select"></select>
          </label>
          <button class="pill-btn pill-btn--secondary" name="layout-info">?</button>
        </div>
        <div name="sketch-qr-code" class="share-widget__qr-code"></div>
        <p name="qr-warning" style="display:none; font-size: 0.85em; text-align: center;"><b>NOTE:</b> There may be too much data in this QR code for your phone camera to decode.</p>
      </div>
    `

    this.$('[name="qr-btn"]').addEventListener('click', () => this._toggleQRCode())

    const qrIcon = this.$('.share-widget__qr-icon')
    utils.get('/assets/images/icons/qr-code.svg', (svg) => {
      if (typeof svg === 'string') qrIcon.innerHTML = svg
    }, true)

    this.layoutsSel = this.$('[name="share-layout-select"]')
    NNW.layouts.forEach(l => this._creatOption(l, this.layoutsSel))
    this._creatOption('hidden', this.layoutsSel)
    this.layoutsSel.value = NNW.layout
    this.layoutsSel.addEventListener('change', (e) => {
      this.$('[name="share-url"]').value = this._shareURL()
      if (window.convo) window.convo.hide()
    })

    this.$('button').forEach(b => b.addEventListener('click', (e) => {
      if (e.target.name === 'shorten-url') {
        window.convo = new Convo(this.convos, 'shortener-retired')
      } else if (e.target.name === 'layout-info') {
        window.convo = new Convo(this.convos, 'layout-info')
      }
    }))
  }

  _toggleQRCode () {
    const container = this.$('[name="sketch-qr-code"]')
    const url = this.$('[name="share-url"]').value
    if (!this.qrcode) {
      this.qrcode = new QRious({
        element: container,
        background: '#ffffff',
        backgroundAlpha: 0,
        foreground: utils.getVal('--netizen-meta'),
        foregroundAlpha: 1,
        level: 'H',
        size: 200,
        value: url
      })
      if (!this.qrcode.canvas.parentElement) {
        container.appendChild(this.qrcode.canvas)
      }
    } else {
      this.qrcode.value = url
    }
    const visible = window.getComputedStyle(container).display !== 'none'
    container.style.display = visible ? 'none' : 'flex'
    const warning = this.$('[name="qr-warning"]')
    if (warning) warning.style.display = (!visible && url.length > 100) ? 'block' : 'none'
  }

  _copyURL () {
    utils.copyLink(this.$('[name="share-url"]'))
    if (window.convo) window.convo.hide()
  }

  _shareURL (onOpen) {
    const hash = NNE.generateHash()
    if (onOpen && this.shortCode && hash !== this._lastHash) {
      this.shortCode = null
    }
    const root = window.location.protocol + '//' + window.location.host
    const layout = this.layoutsSel ? this.layoutsSel.value : NNW.layout
    let url

    if (layout !== 'hidden' && this.shortCode) {
      url = `${root}/?c=${this.shortCode}&layout=${layout}`
    } else if (layout !== 'hidden') {
      url = `${root}/?layout=${layout}${hash}`
    } else if (layout === 'hidden' && this.shortCode) {
      url = `${root}/?c=${this.shortCode}`
    } else url = `${root}/${hash}`

    this._lastHash = hash
    return url
  }

}

window.ShareWidget = ShareWidget
