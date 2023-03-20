/* global HTMLElement NNE */

class SvgJSInvokeAndAssign extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 864 133.7">
    <text transform="translate(356.77 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">squa
      <tspan x="124.05" y="0" style="letter-spacing:-0.019988130979032664em">r</tspan>
      <tspan x="144.79" y="0">e</tspan>
    </text>
    <text transform="translate(820.27 159.65)"
      style="isolation:isolate;font-size:68.0999984741211px;font-family:'fira-sans-regular', sans-serif">
    </text>
    <text transform="translate(43.78 24.44)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">new
      <tspan x="48.89" y="0" style="letter-spacing:-0.005003312247234312em">v</tspan>
      <tspan x="60.2" y="0">ariab</tspan>
      <tspan x="114.16" y="0" style="letter-spacing:-0.005003312247234312em">l</tspan>
      <tspan x="120.87" y="0">e will </tspan>
      <tspan x="182.54" y="0" style="letter-spacing:-0.015009936741702938em">c</tspan>
      <tspan x="193.29" y="0">ontain the </tspan>
      <tspan x="307.84" y="0" style="letter-spacing:-0.005003312247234312em">va</tspan>
      <tspan x="331.56" y="0" style="letter-spacing:0.00004204464073306145em">lue that squa
      </tspan>
      <tspan x="469.85" y="0" style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="478.28" y="0">e </tspan>
      <tspan x="497.07" y="0" style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="505.5" y="0">eturns</tspan>
    </text>
    <polyline points="182.09 63.7 182.09 49.8 242.66 49.8 302.94 49.8 302.94 63.7"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="242.66" y1="32.7" x2="242.66" y2="48.7"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <text transform="translate(532.7 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(551.24 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">l
      <tspan x="16.51" y="0" style="letter-spacing:-0.000008545588276627903em">ength</tspan>
      </text>
    <text transform="translate(715.38 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)</text>
    <text transform="translate(29.45 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.01499750742548197em">c</tspan>
      <tspan x="26.46" y="0">onst</tspan>
    </text>
    <text transform="translate(184.81 116.88)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[2]};font-family:'fira-sans-regular', sans-serif">a
      <tspan x="30.8" y="0" style="letter-spacing:-0.019988130979032664em">r</tspan>
      <tspan x="51.54" y="0" style="letter-spacing:-0.004999169141827323em">e</tspan>
      <tspan x="82.34" y="0">a</tspan>
    </text>
    <text transform="translate(313.14 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">=</text>
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

window.customElements.define('svg-js-invoke-and-assign', SvgJSInvokeAndAssign)
