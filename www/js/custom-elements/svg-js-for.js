/* global HTMLElement NNE */

class SvgJSFor extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 864 273">
    <text transform="translate(298.22 185.7)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(685.76 166.89)"
      style="isolation:isolate;font-size:68.0999984741211px;font-family:'fira-sans-regular', sans-serif">
    </text>
    <text transform="translate(125.43 29.64)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.005003312247234312em">ke</tspan>
      <tspan x="24.23" y="0">ywo</tspan>
      <tspan x="65.87" y="0" style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="74.3" y="0">d</tspan>
    </text>
    <text transform="translate(295.15 29.64)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">dec
      <tspan x="37.44" y="0" style="letter-spacing:-0.005003312247234312em">l</tspan>
      <tspan x="44.15" y="0">a</tspan>
      <tspan x="56.67" y="0" style="letter-spacing:-0.019992226668570718em">r</tspan>
      <tspan x="65.1" y="0">e</tspan>
    </text>
    <polyline points="238.33 69.4 238.33 55.5 333.86 55.5 428.5 55.5 428.5 69.4"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="333.86" y1="38.4" x2="333.86" y2="54.4"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <polyline points="125.43 68.9 125.43 55 169.34 55 213.07 55 213.07 68.9"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="169.34" y1="37.9" x2="169.34" y2="53.9"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <text transform="translate(129.19 254.26)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">}</text>
    <text transform="translate(129.19 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.009989792695378018em">f</tspan>
      <tspan x="18.57" y="0">or</tspan>
    </text>
    <text transform="translate(217.95 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(455.66 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(486.53 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">&lt;</text>
    <text transform="translate(530.27 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif">10</text>
    <text transform="translate(688.24 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)
      {</text>
    <text transform="translate(237.15 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">l
      <tspan x="16.51" y="0" style="letter-spacing:-0.000008545588276627903em">et</tspan>
      </text>
    <text transform="translate(320.55 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(350.67 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">=</text>
    <text transform="translate(394.34 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif">0</text>
    <text transform="translate(426.33 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">;</text>
    <text transform="translate(586.84 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">;</text>
    <text transform="translate(615.85 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(631.79 117.13)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">++</text>
    <polyline points="440.87 69.4 440.87 55.5 520.34 55.5 599.06 55.5 599.06 69.4"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="520.34" y1="38.4" x2="520.34" y2="54.4"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <polyline points="611.43 69.4 611.43 55.5 648.52 55.5 685.27 55.5 685.27 69.4"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="648.52" y1="38.4" x2="648.52" y2="54.4"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <text transform="translate(470.33 29.64)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.015009936741702938em">c</tspan>
      <tspan x="10.75" y="0">ondition</tspan>
    </text>
    <text transform="translate(158.97 185.7)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">al
      <tspan x="47.02" y="0" style="letter-spacing:-0.000008545588276627903em">ert</tspan>
      </text>
    <text transform="translate(279.59 185.7)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(313.94 185.7)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)</text>
    <text transform="translate(596.33 29.64)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">inc
      <tspan x="30.96" y="0" style="letter-spacing:-0.019992226668570718em">r</tspan>
      <tspan x="39.39" y="0">ement</tspan>
    </text>
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
