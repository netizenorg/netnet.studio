/* global HTMLElement NNE */

class SvgJSInvokeFunction extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 864 220.11">
    <text transform="translate(215.94 127.11)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">al
      <tspan x="47.02" y="0" style="letter-spacing:-0.000008545588276627903em">ert</tspan>
      </text>
    <text transform="translate(372.16 24.6)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">i
      <tspan x="6.41" y="0" style="letter-spacing:-0.0069794103616882em">n</tspan>
      <tspan x="19.7" y="0" style="letter-spacing:-0.003994240869640838em">v</tspan>
      <tspan x="31.03" y="0">o</tspan>
      <tspan x="44.6" y="0" style="letter-spacing:-0.005003312247234312em">c</tspan>
      <tspan x="55.58" y="0">ation</tspan>
    </text>
    <text transform="translate(435.84 208.06)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">a
      <tspan x="12.52" y="0" style="letter-spacing:-0.015009936741702938em">r</tspan>
      <tspan x="21.07" y="0" style="letter-spacing:-0.004982289926867782em">g</tspan>
      <tspan x="33.03" y="0" style="letter-spacing:-0.000021022320366530724em">uments
      </tspan>
    </text>
    <text transform="translate(336.55 127.11)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(355.07 127.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[4]};font-family:'fira-sans-regular', sans-serif">‘
      <tspan x="13.03" y="0" style="letter-spacing:-0.009998338283654646em">W</tspan>
      <tspan x="59.65" y="0">e</tspan>
      <tspan x="90.73" y="0" style="letter-spacing:-0.004990623553550695em">l</tspan>
      <tspan x="107.25" y="0" style="letter-spacing:-0.015006053013758597em">c</tspan>
      <tspan x="133.7" y="0" style="letter-spacing:0.000008545588276627903em">ome!’</tspan>
    </text>
    <text transform="translate(628.58 127.11)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)</text>
    <text transform="translate(243.46 207.06)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">name</text>
    <polyline points="207 74.74 207 52.73 427.61 52.73 647.32 52.73 647.32 74.74"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="427.61" y1="32.58" x2="427.61" y2="52.73"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="338.84 146.58 338.84 168.58 272.79 168.58 207 168.58 207 146.58"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="272.79" y1="188.74" x2="272.79" y2="168.58"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="626.08 146.58 626.08 168.58 491.56 168.58 357.59 168.58 357.59 146.58"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="491.56" y1="188.74" x2="491.56" y2="168.58"
      style="fill:none;stroke:${this.c[5]}" />
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
