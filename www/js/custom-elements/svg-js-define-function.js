/* global HTMLElement NNE */

class SvgJSDefineFunction extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 864 313.62">
    <text transform="translate(172.32 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif">function</text>
    <text transform="translate(402.54 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[2]};font-family:'fira-sans-regular', sans-serif">squa
      <tspan x="124.05" y="0" style="letter-spacing:-0.019988130979032664em">r</tspan>
      <tspan x="144.79" y="0">e </tspan>
    </text>
    <text transform="translate(825.27 159.65)"
      style="isolation:isolate;font-size:68.0999984741211px;font-family:'fira-sans-regular', sans-serif">
    </text>
    <text transform="translate(239.96 21.44)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.005003312247234312em">ke</tspan>
      <tspan x="24.23" y="0">ywo</tspan>
      <tspan x="65.87" y="0" style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="74.3" y="0">d</tspan>
    </text>
    <text transform="translate(460.23 22.44)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">name</text>
    <text transform="translate(259.67 302.1)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="8.43" y="0" style="letter-spacing:-0.000021022320366530724em">eturn sta
      </tspan>
      <tspan x="103.06" y="0" style="letter-spacing:-0.015009936741702938em">t</tspan>
      <tspan x="111.09" y="0">ement</tspan>
    </text>
    <text transform="translate(593.69 116.95)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(611.68 116.64)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[2]};font-family:'fira-sans-regular', sans-serif">x</text>
    <text transform="translate(639.41 116.64)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)
      {</text>
    <text transform="translate(172.32 253.77)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">}</text>
    <text transform="translate(202.5 185.21)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.019988130979032664em">r
      <tspan x="20.74" y="0" style="letter-spacing:-0.000008545588276627903em">eturn</tspan>
      </text>
    <text transform="translate(378.13 185.21)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[8]};font-family:'fira-sans-regular', sans-serif">x</text>
    <text transform="translate(461.14 185.21)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[8]};font-family:'fira-sans-regular', sans-serif">x</text>
    <text transform="translate(420.86 195.21)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">*</text>
    <text transform="translate(568.64 22.44)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">a
      <tspan x="12.52" y="0" style="letter-spacing:-0.015009936741702938em">r</tspan>
      <tspan x="21.07" y="0" style="letter-spacing:-0.004982289926867782em">g</tspan>
      <tspan x="33.03" y="0" style="letter-spacing:-0.000021022320366530724em">uments
      </tspan>
    </text>
    <polyline points="174.89 71.55 174.89 49.55 283.66 49.55 392 49.55 392 71.55"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="283.66" y1="29.39" x2="283.66" y2="49.55"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="400.36 71.55 400.36 49.55 489.72 49.55 578.71 49.55 578.71 71.55"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="489.72" y1="29.39" x2="489.72" y2="49.55"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="624.74" y1="29.39" x2="624.74" y2="71.55"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="498.81 189.92 498.81 211.93 348.29 211.93 198.38 211.93 198.38 189.92"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="348.29" y1="280.3" x2="348.29" y2="211.93"
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

window.customElements.define('svg-js-define-function', SvgJSDefineFunction)
