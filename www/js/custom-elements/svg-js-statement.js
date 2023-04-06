/* global HTMLElement NNE */

class SvgJSStatement extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 864 244.81">
    <text transform="translate(460.85 159.8)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif">2</text>
    <text transform="translate(210 159.8)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">l
      <tspan x="16.51" y="0" style="letter-spacing:-0.000008545588276627903em">et</tspan>
      </text>
    <text transform="translate(293.35 159.8)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[2]};font-family:'fira-sans-regular', sans-serif">sum</text>
    <text transform="translate(416.45 159.8)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">=</text>
    <text transform="translate(825.27 251.16)"
      style="isolation:isolate;font-size:68.0999984741211px;font-family:'fira-sans-regular', sans-serif">
    </text>
    <text transform="translate(347.56 21.02)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">sta
      <tspan x="31.75" y="0" style="letter-spacing:-0.015009936741702938em">t</tspan>
      <tspan x="39.79" y="0">ement</tspan>
    </text>
    <text transform="translate(472.33 85.03)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">ope
      <tspan x="39.81" y="0" style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="48.24" y="0" style="letter-spacing:-0.000021022320366530724em">a</tspan>
      <tspan x="60.76" y="0" style="letter-spacing:-0.014988914421336407em">t</tspan>
      <tspan x="68.8" y="0">or</tspan>
    </text>
    <polyline points="201.9 68.96 201.9 46.95 400.8 46.95 598.9 46.95 598.9 68.96"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="400.8" y1="26.8" x2="400.8" y2="46.95"
      style="fill:none;stroke:${this.c[5]}" />
    <text transform="translate(547.77 159.8)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif">5</text>
    <text transform="translate(503.81 159.8)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">+</text>
    <text transform="translate(464.27 234.8)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.005003312247234312em">e</tspan>
      <tspan x="12.52" y="0">xp</tspan>
      <tspan x="37.4" y="0" style="letter-spacing:-0.019992226668570718em">r</tspan>
      <tspan x="45.83" y="0">e</tspan>
      <tspan x="58.46" y="0" style="letter-spacing:-0.009985602174102095em">s</tspan>
      <tspan x="69.08" y="0">sion</tspan>
    </text>
    <line x1="517.31" y1="89.52" x2="517.31" y2="121.58"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="585.77 169.95 585.77 191.95 519.85 191.95 454.2 191.95 454.2 169.95"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="519.85" y1="212.11" x2="519.85" y2="191.95"
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

window.customElements.define('svg-js-statement', SvgJSStatement)
