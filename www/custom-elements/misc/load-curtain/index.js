/* global HTMLElement */
class LoadCurtain extends HTMLElement {
  show (filename, opts) {
    window.utils.get(`/custom-elements/misc/load-curtain/data/${filename}`, (html) => {
      this.setAttribute('id', 'curtain-loading-screen')
      if (opts) {
        for (const key in opts) {
          html = html.replace(`{{${key}}}`, opts[key])
        }
      }
      this.innerHTML = html
    }, true)
  }

  hide () {
    this.innerHTML = ''
  }

  set showing (val) {
    console.warn('LoadCurtain: "showing" is read-only, use .show(filename, opts)')
  }

  get showing () {
    return this.innerHTML !== ''
  }
}

window.customElements.define('load-curtain', LoadCurtain)

// create a <load-curatin> element automatically
// so that other widgets can show/hide it when neede be
document.body.appendChild(document.createElement('load-curtain'))
