/* global HTMLElement NNE */
class SvgTag extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 852 182" xml:space="preserve" style="width:100%;margin:8px auto 30px auto;display:block;">
      <text
         xml:space="preserve"
         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill-opacity:1;stroke:none"
         x="293.96558"
         y="80.012978"
         id="text1626"><tspan
           sodipodi:role="line"
           id="tspan1624"
           x="293.96558"
           y="80.012978"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:70.5px;font-family:'fira-sans-regular', sans-serif;-inkscape-font-specification:''fira-sans-regular', sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start;writing-mode:lr-tb;text-anchor:start;fill-opacity:1;fill:${this.c[3]};">content</tspan></text>
      <text
         xml:space="preserve"
         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill-opacity:1;stroke:none;fill:${this.c[0]};"
         x="90.340523"
         y="80.022591"
         id="text1626-7"><tspan
           sodipodi:role="line"
           id="tspan1624-6"
           x="90.340523"
           y="80.022591"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:70.5px;font-family:'fira-sans-regular', sans-serif;-inkscape-font-specification:''fira-sans-regular', sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start;writing-mode:lr-tb;text-anchor:start;fill-opacity:1">&lt;<tspan
       id="tspan5" style="fill:${this.c[1]};">tag</tspan>&gt;</tspan></text>
      <text
         xml:space="preserve"
         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill-opacity:1;stroke:none;fill:${this.c[0]}"
         x="548.07092"
         y="80.035011"
         id="text1626-7-8"><tspan
           sodipodi:role="line"
           id="tspan1624-6-4"
           x="548.07092"
           y="80.035011"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:70.5px;font-family:'fira-sans-regular', sans-serif;-inkscape-font-specification:''fira-sans-regular', sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start;writing-mode:lr-tb;text-anchor:start;fill-opacity:1">&lt;/<tspan
       id="tspan9" style="fill:${this.c[1]};">tag</tspan>&gt;</tspan></text>
      <text
         xml:space="preserve"
         style="font-style:normal;font-weight:normal;font-size:18.43792725px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill-opacity:1;stroke:none;stroke-width:0.4609482"
         x="339.54401"
         y="178.05511"
         id="text1626-2"><tspan
           sodipodi:role="line"
           id="tspan1624-5"
           x="339.54401"
           y="178.05511"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:34.41746521px;font-family:'fira-sans-regular', sans-serif;-inkscape-font-specification:''fira-sans-regular', sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start;writing-mode:lr-tb;text-anchor:start;fill-opacity:1;stroke-width:0.4609482;fill:${this.c[2]};">an element</tspan></text>
      <path
         style="fill:none;stroke:${this.c[2]};stroke-width:2;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none"
         d="m 92.849951,102.84221 v 22.24976 H 424.45692 v 20.53823 -20.53823 h 331.60696 v -22.24976"
         id="path851"
         inkscape:connector-curvature="0" />
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
}

window.customElements.define('svg-tag', SvgTag)
