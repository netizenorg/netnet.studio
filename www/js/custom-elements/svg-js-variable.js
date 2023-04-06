/* global HTMLElement NNE */

class SvgJSVariable extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 864 211.68">
    <text transform="translate(105.86 124.56)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.01499750742548197em">c</tspan>
      <tspan x="26.46" y="0">onst </tspan>
    </text>
    <text transform="translate(261.5 124.56)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[2]};font-family:'fira-sans-regular', sans-serif">user</text>
    <text transform="translate(389.05 124.56)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">=</text>
    <text transform="translate(390.85 127.25)"
      style="isolation:isolate;font-size:68.0999984741211px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">
    </text>
    <text transform="translate(432.94 124.56)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[2]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.02999501485096394em">‘</tspan>
      <tspan x="11.31" y="0">Ada </tspan>
      <tspan x="123.7" y="0" style="letter-spacing:-0.02498730012085999em">L</tspan>
      <tspan x="150.73" y="0" style="letter-spacing:-0.004990623553550695em">o</tspan>
      <tspan x="183.81" y="0" style="letter-spacing:-0.00399078972518523em">v</tspan>
      <tspan x="211.7" y="0" style="letter-spacing:-0.000008545588276627903em">e</tspan>
      <tspan x="242.78" y="0" style="letter-spacing:-0.004990623553550695em">l</tspan>
      <tspan x="259.29" y="0">a</tspan>
      <tspan x="290.09" y="0" style="letter-spacing:-0.01499750742548197em">c</tspan>
      <tspan x="316.54" y="0" style="letter-spacing:-0.009998338283654646em">e</tspan>
      <tspan x="347.06" y="0">’</tspan>
    </text>
    <text transform="translate(73.19 27.05)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">dec
      <tspan x="37.44" y="0" style="letter-spacing:-0.005003312247234312em">l</tspan>
      <tspan x="44.15" y="0">a</tspan>
      <tspan x="56.67" y="0" style="letter-spacing:-0.019992226668570718em">r</tspan>
      <tspan x="65.1" y="0">ation </tspan>
      <tspan x="125.59" y="0" style="letter-spacing:-0.005003312247234312em">ke</tspan>
      <tspan x="149.81" y="0">ywo</tspan>
      <tspan x="191.46" y="0" style="letter-spacing:-0.019992226668570718em">r</tspan>
      <tspan x="199.89" y="0">d</tspan>
    </text>
    <text transform="translate(356.65 27.05)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">ope
      <tspan x="39.81" y="0" style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="48.24" y="0" style="letter-spacing:-0.000021022320366530724em">a</tspan>
      <tspan x="60.76" y="0" style="letter-spacing:-0.014988914421336407em">t</tspan>
      <tspan x="68.8" y="0">or</tspan>
    </text>
    <text transform="translate(242.25 203.08)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.004982289926867782em">v</tspan>
      <tspan x="11.31" y="0">ariab</tspan>
      <tspan x="65.27" y="0" style="letter-spacing:-0.005003312247234312em">l</tspan>
      <tspan x="71.98" y="0">e name</tspan>
    </text>
    <text transform="translate(492.09 203.36)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.004982289926867782em">v</tspan>
      <tspan x="11.31" y="0">ariab</tspan>
      <tspan x="65.27" y="0" style="letter-spacing:-0.005003312247234312em">l</tspan>
      <tspan x="71.98" y="0">e </tspan>
      <tspan x="90.77" y="0" style="letter-spacing:-0.004982289926867782em">va</tspan>
      <tspan x="114.48" y="0">lue (string)</tspan>
    </text>
    <polyline points="101.89 76.02 101.89 54.01 179.1 54.01 256 54.01 256 76.02"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="179.1" y1="33.86" x2="179.1" y2="54.01"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="402.05" y1="33.86" x2="402.05" y2="76.02"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="378 132.56 378 154.56 316.88 154.56 256 154.56 256 132.56"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="316.88" y1="174.72" x2="316.88" y2="154.56"
      style="fill:none;stroke:${this.c[5]}" />
    <polyline points="785.96 132.56 785.96 154.56 605.62 154.56 426 154.56 426 132.56"
      style="fill:none;stroke:${this.c[5]}" />
    <line x1="605.62" y1="174.72" x2="605.62" y2="154.56"
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

window.customElements.define('svg-js-variable', SvgJSVariable)
