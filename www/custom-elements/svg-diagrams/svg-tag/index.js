/* global HTMLElement NNE */
class SvgTag extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  transitionTo (stage) {
    const stages = [
      {}
    ]
  }

  updateHTML () {
    this.innerHTML = `<svg version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 35"
      style="width:100%;margin:0 auto;display:block;">

      <text
        id="opening-tag"
        x="10"
        y="14"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">tag</tspan>&gt;
      </text>

      <text
        id="content"
        x="33"
        y="14"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        content
      </text>

      <text
        id="closing-tag"
        x="64"
        y="14"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;/<tspan fill="${this.c[1]}">tag</tspan>&gt;
      </text>

      <text
        id="label"
        x="36"
        y="31"
        font-family="fira-sans-regular, sans-serif"
        font-size="5"
        fill="${this.c[2]}">
        an element
      </text>

      <path
        id="lines"
        d="
          M10,18
          v4
          H48
          v4
          v-4
          h39
          v-4
        "
        fill="none"
        stroke="${this.c[2]}"
        stroke-width="0.25"
        stroke-linecap="butt"
        stroke-linejoin="miter"/>
    </svg>`
  }

  get colors () {
    return this.c
  }

  set colors (val) {
    if (val instanceof Array) val = val.join(',')
    this.setAttribute('colors', val)
    this.c = val.split(',')
    this.updateHTML()
  }

  static get observedAttributes () {
    return ['colors']
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (newVal !== oldVal) this[attrName] = newVal
  }

  // .....................................................
}

window.customElements.define('svg-tag', SvgTag)
