/* global HTMLElement NNE */

class SvgJSStatement extends SvgDiagramBase {
  updateHTML () {
    this.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 864 218.26">
    <text transform="translate(460.84 147.14)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif">2</text>
    <text transform="translate(210 147.14)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[1]};font-family:'fira-sans-regular', sans-serif;letter-spacing:-0.004990623553550695em">l
      <tspan x="16.51" y="0" style="letter-spacing:-0.000008545588276627903em">et</tspan>
      </text>
    <text transform="translate(293.35 147.14)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[2]};font-family:'fira-sans-regular', sans-serif">sum</text>
    <text transform="translate(416.45 147.14)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">=</text>
    <text transform="translate(825.27 238.5)"
      style="isolation:isolate;font-size:68.0999984741211px;font-family:'fira-sans-regular', sans-serif">
    </text>
    <text transform="translate(347.56 22.03)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">sta
      <tspan x="31.75" y="0" style="letter-spacing:-0.015009936741702938em">t</tspan>
      <tspan x="39.79" y="0">ement</tspan>
    </text>
    <text transform="translate(472.33 74.44)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">ope
      <tspan x="39.81" y="0" style="letter-spacing:-0.01997120434820419em">r</tspan>
      <tspan x="48.24" y="0" style="letter-spacing:-0.000021022320366530724em">a</tspan>
      <tspan x="60.76" y="0" style="letter-spacing:-0.014988914421336407em">t</tspan>
      <tspan x="68.8" y="0">or</tspan>
    </text>
    <polyline points="598.93 155.98 598.93 169.88 526.24 169.88 454.2 169.88 454.2 155.98"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="526.23" y1="186.98" x2="526.23" y2="170.98"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <polyline points="201.95 61.28 201.95 47.38 400.81 47.38 598.93 47.38 598.93 61.28"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="400.81" y1="30.28" x2="400.81" y2="46.28"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <text transform="translate(547.77 147.14)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[6]};font-family:'fira-sans-regular', sans-serif">5</text>
    <text transform="translate(503.81 147.14)"
      style="isolation:isolate;font-size:57.13840103149414px;fill:${this.c[3]};font-family:'fira-sans-regular', sans-serif">+</text>
    <text transform="translate(469.27 208.13)"
      style="isolation:isolate;font-size:23.2268009185791px;fill:${this.c[5]};font-family:'fira-sans-regular', sans-serif">
      <tspan style="letter-spacing:-0.005003312247234312em">e</tspan>
      <tspan x="12.52" y="0">xp</tspan>
      <tspan x="37.4" y="0" style="letter-spacing:-0.019992226668570718em">r</tspan>
      <tspan x="45.83" y="0">e</tspan>
      <tspan x="58.46" y="0" style="letter-spacing:-0.009985602174102095em">s</tspan>
      <tspan x="69.08" y="0">sion</tspan>
    </text>
    <polyline points="498.13 113.73 498.13 99.83 517.94 99.83 537.66 99.83 537.66 113.73"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
    <line x1="517.94" y1="82.73" x2="517.94" y2="98.73"
      style="fill:none;stroke:${this.c[5]};stroke-width:2px" />
  </svg>
    `
  }
}

window.customElements.define('svg-js-statement', SvgJSStatement)
