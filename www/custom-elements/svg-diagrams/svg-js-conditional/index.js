/* global HTMLElement NNE */

class SvgJSConditional extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 864 279.5">
    <text transform="translate(110.17 124.2)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif">if</text>
    <text transform="translate(160.17 124.2)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(763.12 166.89)"
      style="isolation:isolate;font-size:68.0999984741211px;font-family:'fira-sans-regular', sans-serif">
    </text>
    <text transform="translate(85.05 25.33)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.005003312247234312em">ke</tspan>
      <tspan x="24.23" y="0">ywo</tspan>
      <tspan x="65.87" y="0" style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="74.3" y="0">d</tspan>
    </text>
    <text transform="translate(233.93 24.68)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">question</text>
    <text transform="translate(110.17 261.01)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">}</text>
    <text transform="translate(140.36 192.45)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">al
      <tspan x="47.02" y="0" style="letter-spacing:-0.000008545588276627903em">ert</tspan>
      </text>
    <g style="isolation:isolate">
      <text transform="translate(635 180.21)"
        style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
        <tspan style="letter-spacing:-0.015009936741702938em">c</tspan>
        <tspan x="10.75" y="0">ondition</tspan>
        <tspan x="99.69" y="0" style="letter-spacing:-0.004982289926867782em">a</tspan>
        <tspan x="112.09" y="0" style="letter-spacing:-0.000021022320366530724em">l b
        </tspan>
        <tspan x="138.69" y="0" style="letter-spacing:-0.005003312247234312em">l</tspan>
        <tspan x="145.4" y="0">ock</tspan>
      </text>
    </g>
    <text transform="translate(178.39 124.2)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[7]};font-family:'fira-sans-regular', sans-serif">age</text>
    <text transform="translate(284.69 124.2)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">&gt;</text>
    <text transform="translate(328.23 124.2)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.024995845709136617em">2
      <tspan x="26.85" y="0" style="letter-spacing:0.000008545588276627903em">1</tspan>
      </text>
    <text transform="translate(380.23 124.2)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)
      {</text>
    <text transform="translate(260.98 192.45)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">(</text>
    <text transform="translate(278.98 192.45)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[4]};font-family:'fira-sans-regular', sans-serif">‘
      <tspan x="13.03" y="0" style="letter-spacing:-0.009998338283654646em">W</tspan>
      <tspan x="59.65" y="0">e</tspan>
      <tspan x="90.73" y="0" style="letter-spacing:-0.004990623553550695em">l</tspan>
      <tspan x="107.25" y="0" style="letter-spacing:-0.015006053013758597em">c</tspan>
      <tspan x="133.7" y="0" style="letter-spacing:0.000008545588276627903em">ome!’</tspan>
    </text>
    <text transform="translate(552.98 192.45)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[0]};font-family:'fira-sans-regular', sans-serif">)</text>
    <polyline points="95.36 73.87 95.36 51.86 128.82 51.86 162.14 51.86 162.14 73.87"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="128.82" y1="31.71" x2="128.82" y2="51.86"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="180.68 73.87 180.68 51.86 280.37 51.86 379.65 51.86 379.65 73.87"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="280.37" y1="31.71" x2="280.37" y2="51.86"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="581.84 79.63 603.84 79.63 603.84 174.4 603.84 268.78 581.84 268.78"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="624" y1="174.4" x2="603.84" y2="174.4"
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

window.customElements.define('svg-js-conditional', SvgJSConditional)
