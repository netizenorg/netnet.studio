/* global HTMLElement NNE */

class SvgJSWhile extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 864 484.52">
    <text transform="translate(424.44 135.32)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif">0</text>
    <text transform="translate(659.19 158.73)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.015009936741702938em">c</tspan>
      <tspan x="10.75" y="0">ondition</tspan>
    </text>
    <text transform="translate(266.48 410.06)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">}</text>
    <text transform="translate(266.48 272.92)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif">whi
      <tspan x="89.82" y="0" style="letter-spacing:-0.004999169141827323em">l</tspan>
      <tspan x="106.33" y="0">e</tspan>
    </text>
    <text transform="translate(419.23 272.92)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(437.46 272.92)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(468.33 272.92)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">&lt;</text>
    <text transform="translate(512.07 272.92)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif">10</text>
    <text transform="translate(568.82 272.92)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)
      {</text>
    <text transform="translate(296.25 341.49)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(312.25 341.49)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">++</text>
    <text transform="translate(229.78 27.63)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">dec
      <tspan x="37.44" y="0" style="letter-spacing:-0.005003312247234312em">l</tspan>
      <tspan x="44.15" y="0">a</tspan>
      <tspan x="56.67" y="0" style="letter-spacing:-0.019992226668570718em">r</tspan>
      <tspan x="65.1" y="0">e i</tspan>
      <tspan x="90.3" y="0" style="letter-spacing:-0.015009936741702938em">t</tspan>
      <tspan x="98.34" y="0">e</tspan>
      <tspan x="110.98" y="0" style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="119.41" y="0">a</tspan>
      <tspan x="131.93" y="0" style="letter-spacing:-0.015009936741702938em">t</tspan>
      <tspan x="139.96" y="0">or </tspan>
      <tspan x="168.58" y="0" style="letter-spacing:-0.004982289926867782em">v</tspan>
      <tspan x="179.89" y="0">ariab</tspan>
      <tspan x="233.84" y="0" style="letter-spacing:-0.005003312247234312em">l</tspan>
      <tspan x="240.56" y="0">e</tspan>
    </text>
    <text transform="translate(208.84 474.23)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">inc
      <tspan x="30.96" y="0" style="letter-spacing:-0.019992226668570718em">r</tspan>
      <tspan x="39.39" y="0">ement </tspan>
      <tspan x="112.39" y="0" style="letter-spacing:-0.004982289926867782em">va</tspan>
      <tspan x="136.11" y="0">lue </tspan>
      <tspan x="175.08" y="0" style="letter-spacing:-0.004982289926867782em">b</tspan>
      <tspan x="188.58" y="0">y one</tspan>
    </text>
    <text transform="translate(266.62 135.32)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">l
      <tspan x="16.51" y="0" style="letter-spacing:-0.000008545588276627903em">et</tspan>
      </text>
    <text transform="translate(349.9 135.32)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[2]};font-family:'fira-sans-regular', sans-serif">i</text>
    <text transform="translate(381.15 135.32)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">=</text>
    <polyline points="254.79 80.07 254.79 58.06 355.52 58.06 455.84 58.06 455.84 80.07"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="355.52" y1="37.91" x2="355.52" y2="58.06"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="432 214.03 432 192.03 501.69 192.03 571.11 192.03 571.11 214.03"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="649.21 152.47 501.69 152.47 501.69 192.03"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="370.62 349.57 370.62 371.58 331.73 371.58 293 371.58 293 349.57"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="331.73" y1="444.4" x2="331.73" y2="371.58"
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

window.customElements.define('svg-js-while', SvgJSWhile)
