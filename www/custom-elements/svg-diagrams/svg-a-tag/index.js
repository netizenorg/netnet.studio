/* global HTMLElement NNE */
class SvgATag extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 852 182" xml:space="preserve" style="width:100%;margin:10px auto;display:block;">
      <text
         xml:space="preserve"
         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:${this.c[0]};fill-opacity:1;stroke:none"
         x="271.40799"
         y="80.012978"
         id="text1626"><tspan
           sodipodi:role="line"
           id="tspan1624"
           x="271.40799"
           y="80.012978"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:70.5px;font-family:'fira-sans-regular', sans-serif;-inkscape-font-specification:''fira-sans-regular', sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start;writing-mode:lr-tb;text-anchor:start;fill:${this.c[1]};fill-opacity:1">content</tspan></text>
      <text
         xml:space="preserve"
         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:${this.c[0]};fill-opacity:1;stroke:none"
         x="116.34052"
         y="80.022591"
         id="text1626-7"><tspan
           sodipodi:role="line"
           id="tspan1624-6"
           x="130.34052"
           y="80.022591"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:70.5px;font-family:'fira-sans-regular', sans-serif;-inkscape-font-specification:''fira-sans-regular', sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start;writing-mode:lr-tb;text-anchor:start;fill:${this.c[2]};fill-opacity:1">&lt;<tspan style="fill:${this.c[0]};">a</tspan>&gt;</tspan></text>
      <text
         xml:space="preserve"
         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:${this.c[0]};fill-opacity:1;stroke:none"
         x="534.07092"
         y="80.035011"
         id="text1626-7-8"><tspan
           sodipodi:role="line"
           id="tspan1624-6-4"
           x="534.07092"
           y="80.035011"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:70.5px;font-family:'fira-sans-regular', sans-serif;-inkscape-font-specification:''fira-sans-regular', sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start;writing-mode:lr-tb;text-anchor:start;fill:${this.c[2]};fill-opacity:1">&lt;/<tspan style="fill:${this.c[0]};">a</tspan>&gt;</tspan></text>
      <text
         xml:space="preserve"
         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:${this.c[0]};fill-opacity:1;stroke:none"
         x="125.76182"
         y="147.96144"
         id="text1626-8"><tspan
           sodipodi:role="line"
           id="tspan1624-9"
           x="125.76182"
           y="147.96144"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:18.66666603px;font-family:'fira-sans-regular', sans-serif;-inkscape-font-specification:''fira-sans-regular', sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start;writing-mode:lr-tb;text-anchor:start;fill:${this.c[3]};fill-opacity:1">opening 'a' tag</tspan></text>
      <text
         xml:space="preserve"
         style="font-style:normal;font-weight:normal;font-size:40px;line-height:1.25;font-family:sans-serif;letter-spacing:0px;word-spacing:0px;fill:${this.c[0]};fill-opacity:1;stroke:none"
         x="554.56836"
         y="147.97653"
         id="text1626-8-1"><tspan
           sodipodi:role="line"
           id="tspan1624-9-9"
           x="554.56836"
           y="147.97653"
           style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:18.66666603px;font-family:'fira-sans-regular', sans-serif;-inkscape-font-specification:''fira-sans-regular', sans-serif, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-feature-settings:normal;text-align:start;writing-mode:lr-tb;text-anchor:start;fill:${this.c[3]};fill-opacity:1">closing 'a' tag</tspan></text>
      <path
         style="fill:none;stroke:${this.c[3]};stroke-width:2;stroke-linecap:square;stroke-linejoin:miter;stroke-opacity:1;stroke-miterlimit:4;stroke-dasharray:none"
         d="m 536.60786,87.062857 v 22.669283 h 75.31071 v 21.3 -21.3 h 68.92072 V 87.062857"
         id="path1783"
         inkscape:connector-curvature="0" />
      <path
         style="fill:none;stroke:${this.c[3]};stroke-width:1.81995499;stroke-linecap:square;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="m 124.75714,87.182501 v 22.669279 h 62.36172 v 21.3 -21.3 h 57.07043 V 87.182501"
         id="path1783-8"
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

window.customElements.define('svg-a-tag', SvgATag)
