/* global HTMLElement NNE */

class SvgJSFor extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 864 288.35">
    <text transform="translate(298.22 201.04)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(685.76 182.23)"
      style="isolation:isolate;font-size:68.0999984741211px;font-family:'fira-sans-regular', sans-serif">
    </text>
    <text transform="translate(124.43 29.98)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.005003312247234312em">ke</tspan>
      <tspan x="24.23" y="0">ywo</tspan>
      <tspan x="65.87" y="0" style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="74.3" y="0">d</tspan>
    </text>
    <text transform="translate(294.15 29.98)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">dec
      <tspan x="37.44" y="0" style="letter-spacing:-0.005003312247234312em">l</tspan>
      <tspan x="44.15" y="0">a</tspan>
      <tspan x="56.67" y="0" style="letter-spacing:-0.019992226668570718em">r</tspan>
      <tspan x="65.1" y="0">e</tspan>
    </text>
    <text transform="translate(129.19 269.61)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">}</text>
    <text transform="translate(129.19 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.009989792695378018em">f</tspan>
      <tspan x="18.57" y="0">or</tspan>
    </text>
    <text transform="translate(217.95 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(455.66 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(486.53 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">&lt;</text>
    <text transform="translate(530.27 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif">10</text>
    <text transform="translate(688.24 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)
      {</text>
    <text transform="translate(237.15 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">l
      <tspan x="16.51" y="0" style="letter-spacing:-0.000008545588276627903em">et</tspan>
      </text>
    <text transform="translate(320.55 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[2]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(350.67 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">=</text>
    <text transform="translate(394.34 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif">0</text>
    <text transform="translate(426.33 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">;</text>
    <text transform="translate(586.84 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">;</text>
    <text transform="translate(615.85 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(631.79 132.48)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">++</text>
    <text transform="translate(475.33 30.98)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.015009936741702938em">c</tspan>
      <tspan x="10.75" y="0">ondition</tspan>
    </text>
    <text transform="translate(158.97 201.04)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">al
      <tspan x="47.02" y="0" style="letter-spacing:-0.000008545588276627903em">ert</tspan>
      </text>
    <text transform="translate(279.59 201.04)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(313.94 201.04)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)</text>
    <text transform="translate(595.33 29.98)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">inc
      <tspan x="30.96" y="0" style="letter-spacing:-0.019992226668570718em">r</tspan>
      <tspan x="39.39" y="0">ement</tspan>
    </text>
    <polyline points="125.62 80.35 125.62 58.34 168.54 58.34 211.3 58.34 211.3 80.35"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="168.54" y1="38.19" x2="168.54" y2="58.35"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="238.1 80.35 238.1 58.34 332.22 58.34 425.96 58.34 425.96 80.35"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="332.22" y1="38.19" x2="332.22" y2="58.35"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="445.16 80.35 445.16 58.34 525.13 58.34 604.78 58.34 604.78 80.35"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="525.13" y1="38.19" x2="525.13" y2="58.35"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="611.18 80.35 611.18 58.34 648.3 58.34 685.27 58.34 685.27 80.35"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="648.3" y1="38.19" x2="648.3" y2="58.35"
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

window.customElements.define('svg-js-for', SvgJSFor)
