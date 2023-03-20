/* global HTMLElement NNE */

class SvgJSInvokeFunction extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 864 186.56">
    <text transform="translate(215.94 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">al
      <tspan x="47.02" y="0" style="letter-spacing:-0.000008545588276627903em">ert</tspan>
      </text>
    <text transform="translate(379.16 24.44)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">i
      <tspan x="6.41" y="0" style="letter-spacing:-0.0069794103616882em">n</tspan>
      <tspan x="19.7" y="0" style="letter-spacing:-0.003994240869640838em">v</tspan>
      <tspan x="31.03" y="0">o</tspan>
      <tspan x="44.6" y="0" style="letter-spacing:-0.005003312247234312em">c</tspan>
      <tspan x="55.58" y="0">ation</tspan>
    </text>
    <text transform="translate(435.84 175.9)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">a
      <tspan x="12.52" y="0" style="letter-spacing:-0.015009936741702938em">r</tspan>
      <tspan x="21.07" y="0" style="letter-spacing:-0.004982289926867782em">g</tspan>
      <tspan x="33.03" y="0" style="letter-spacing:-0.000021022320366530724em">uments
      </tspan>
    </text>
    <polyline points="626.08 125.24 626.08 139.14 491.83 139.14 357.59 139.14 357.59 125.24"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="491.83" y1="156.24" x2="491.83" y2="140.34"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <polyline points="215.47 63.7 215.47 49.8 434.55 49.8 652.65 49.8 652.65 63.7"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="434.55" y1="32.7" x2="434.55" y2="48.7"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <text transform="translate(336.55 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(355.07 116.97)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[4]};font-family:'fira-sans-regular', sans-serif">‘
      <tspan x="13.03" y="0" style="letter-spacing:-0.009998338283654646em">W</tspan>
      <tspan x="59.65" y="0">e</tspan>
      <tspan x="90.73" y="0" style="letter-spacing:-0.004990623553550695em">l</tspan>
      <tspan x="107.25" y="0" style="letter-spacing:-0.015006053013758597em">c</tspan>
      <tspan x="133.7" y="0" style="letter-spacing:0.000008545588276627903em">ome!’</tspan>
    </text>
    <text transform="translate(628.58 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)</text>
    <polyline points="336.96 125.24 336.96 139.14 276.21 139.14 215.47 139.14 215.47 125.24"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="276.21" y1="156.24" x2="276.21" y2="140.34"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <text transform="translate(247.46 175.9)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">name</text>
  </svg>
    `
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

window.customElements.define('svg-js-invoke-function', SvgJSInvokeFunction)
