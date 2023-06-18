/* global HTMLElement */
class LoadCurtain extends HTMLElement {
  connectedCallback (opts) {
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = 'hello'
  }
}

window.customElements.define('load-curtain', LoadCurtain)
