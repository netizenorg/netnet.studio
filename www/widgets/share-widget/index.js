/* global Widget, WIDGETS, NNE, NNW, Convo, utils, QRious */
class ShareWidget extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'share-widget'
    this.keywords = ['share', 'link', 'url', 'save']
    this.title = 'Share Sketch'
    this.width = 547

    this.shortCode = null
    this.layoutsSel = null
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
      this._toggleQRCode('none')
      this.$('[name="share-url"]').value = this._shareURL(true)
    })

    NNE.on('code-update', () => {
      if (this._codeUpdate) clearTimeout(this._codeUpdate)
      this._codeUpdate = setTimeout(() => {
        this._toggleQRCode('none')
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
          <button class="pill-btn" name="shorten-url">Shorten URL</button>
          <button class="pill-btn pill-btn--secondary" name="url-shortner">?</button>
        </div>
        <div class="share-widget__section">
          <label>
            select netnet layout
            <select class="dropdown dropdown--invert" name="share-layout-select"></select>
          </label>
          <button class="pill-btn pill-btn--secondary" name="layout-info">?</button>
        </div>
        <br><br>
        <p>
          <span class="inline-link">Generate a QRCode</span> to easily view it on a mobile device.
        </p>
        <div class="qr-code" name="sketch-qr-code" style="display:none;">
          <p name="qr-warning"><b>NOTE:</b> There may be too much data in this QR code for your phone camera to decode, try shortening the URL to generate a simpler QR code<p>
        </div>
      </div>
    `
    this.qrcode = new QRious({
      element: this.$('[name="sketch-qr-code"]'),
      background: '#ffffff',
      backgroundAlpha: 0,
      foreground: utils.getVal('--netizen-meta'),
      foregroundAlpha: 1,
      level: 'H',
      size: 256,
      value: this.$('[name="share-url"]').value
    })

    if (!this.qrcode.canvas.parentElement) {
      // BUG: QRious doesn't seem to be adding the QR code to the parnet elment?
      this.qrcode.element.appendChild(this.qrcode.canvas)
    }

    this.$('.inline-link').addEventListener('click', () => this._toggleQRCode())

    this.layoutsSel = this.$('[name="share-layout-select"]')
    NNW.layouts.forEach(l => this._creatOption(l, this.layoutsSel))
    this._creatOption('hidden', this.layoutsSel)
    this.layoutsSel.value = NNW.layout
    this.layoutsSel.addEventListener('change', (e) => {
      this.$('[name="share-url"]').value = this._shareURL()
      if (window.convo) window.convo.hide()
    })

    this.$('button').forEach(b => b.addEventListener('click', (e) => {
      if (e.target.name === 'url-shortner') {
        window.convo = new Convo(this.convos, 'why-so-long')
      } else if (e.target.name === 'shorten-url') {
        window.convo = new Convo(this.convos, 'confirm-shorten-url')
      } else if (e.target.name === 'layout-info') {
        window.convo = new Convo(this.convos, 'layout-info')
      }
    }))
  }

  _toggleQRWarning (url) {
    url = url || this.$('[name="share-url"]').value
    if (url.length > 100) {
      this.$('[name="qr-warning"]').style.display = 'block'
    } else {
      this.$('[name="qr-warning"]').style.display = 'none'
    }
  }

  _toggleQRCode (state) {
    const qr = this.$('[name="sketch-qr-code"]')
    if (state) qr.style.display = state
    else qr.style.display = (qr.style.display === 'none') ? 'flex' : 'none'
    this._toggleQRWarning()
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

    if (this.qrcode) {
      this.qrcode.value = url
      this._toggleQRWarning(url)
    }

    this._lastHash = hash
    return url
  }

  _shortenURL (layout) {
    NNE.spotlight(null)
    NNW.menu.switchFace('processing')
    window.convo = new Convo(this.convos, 'ok-processing')
    const time = utils.getVal('--layout-transition-time')
    setTimeout(() => {
      const data = { hash: NNE.generateHash() }
      utils.post('./api/shorten-url', data, (res) => {
        if (!res.success) {
          NNW.menu.switchFace('upset')
          console.error(res.error)
          window.convo = new Convo(this.convos, 'oh-no-error')
        } else {
          NNW.menu.switchFace('default')
          this.shortCode = res.key
          this.$('[name="share-url"]').value = this._shareURL()
          this.convos = window.CONVOS['share-widget'](this)
          window.convo = new Convo(this.convos, 'shorten-url')
        }
      })
    }, time)
  }

  _demonstrateCreditComment () {
    const name = WIDGETS['student-session'].getData('username') || 'me'
    const credit = `<!-- this code was hand crafted by ${name} -->\n`
    NNE.cm.setSelection({ line: 0, ch: 0 })
    NNE.cm.replaceSelection(credit)
    setTimeout(() => {
      NNE.spotlight(1)
      window.convo = new Convo(this.convos, 'show-me-how-to-comment')
    }, utils.getVal('--menu-fades-time'))
  }
}

window.ShareWidget = ShareWidget
