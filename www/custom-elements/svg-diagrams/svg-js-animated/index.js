/* global HTMLElement */
class SvgJsAnimated extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
    this.looping = null
    this.start()
  }

  _restartAnim () {
    const anim = this.querySelector('#svgJsAnim')
    anim.endElement()
    const svg = this.querySelector('svg')
    if (svg && typeof svg.setCurrentTime === 'function') svg.setCurrentTime(0)
    svg.unpauseAnimations()
    anim.beginElement()
  }

  start () {
    this._restartAnim()
    this.looping = setInterval(() => this._restartAnim(), 18000)
  }

  stop () {
    clearInterval(this.looping)
    this.looping = null
    const svg = this.querySelector('svg')
    svg.pauseAnimations()
  }

  updateHTML () {
    this.innerHTML = `<svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 35"
      style="width:100%;margin:0 auto;display:block;">
      <text
        x="12"
        y="15"
        font-family="fira-sans-regular, sans-serif"
        font-size="7"
        fill="${this.c[1]}">
        let <tspan style="fill:${this.c[0]};">user</tspan>
      </text>
      <text
        x="38"
        y="15"
        font-family="fira-sans-regular, sans-serif"
        font-size="7"
        opacity="0"
        fill="${this.c[3]}">
        <tspan style="fill:${this.c[2]};">=</tspan>
        ‘Ada Lovelace’
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+2.5s"/>
      </text>
      <text
        x="12"
        y="24"
        font-family="fira-sans-regular, sans-serif"
        font-size="7"
        opacity="0"
        fill="${this.c[4]}">
        alert<tspan style="fill:${this.c[0]};">(</tspan><tspan style="fill:${this.c[3]};">‘Welcome ’</tspan><tspan style="fill:${this.c[2]};"> + </tspan> user<tspan style="fill:${this.c[0]};">)</tspan>
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+8s"/>
      </text>

      <path
        d="M24,7 v-2 M24,7 h-12 v2 M24,7 h12 v2"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          id="svgJsAnim"
          attributeName="d"
          dur="3s"
          values="
            M24,7 v0 M24,7 h0 v0 M24,7 h0 v0;
            M24,7 v0 M24,7 h-12 v0 M24,7 h12 v0;
            M24,7 v-2 M24,7 h-12 v2 M24,7 h12 v2;
            M24,7 v-2 M24,7 h-12 v2 M24,7 h12 v2;
            M50,7 v-2 M50,7 h-38 v2 M50,7 h38 v2;
          "
          keyTimes="0; 0.125; 0.25; 0.70; 1"
          calcMode="linear"
          fill="freeze"/>
      </path>
      <text
        x="11.5"
        y="3.5"
        opacity="1"
        font-family="fira-sans-regular, sans-serif"
        font-size="2.5"
        fill="${this.c[0]}">
        a variable <tspan font-style="italic" fill="${this.c[1]}">declaration</tspan>
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+0s"/>
        <animate attributeName="x"
           from="11.5" to="37.5"
           dur="0.75s"
           begin="svgJsAnim.begin+2.20s"
           fill="freeze"
           calcMode="spline"
           keySplines="0 0 0.58 1"/>
      </text>
      <path
        d="M29,19 v0 M29,19 h0 v0 M29,19 h0 v0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="5s"
          values="
            M29,19 v0 M29,19 h0 v0 M29,19 h0 v0;
            M29,19 v0 M29,19 h-7 v0 M29,19 h7 v0;
            M29,19 v2 M29,19 h-7 v-2 M29,19 h7 v-2;
            M29,19 v2 M29,19 h-7 v-2 M29,19 h7 v-2;
            M29,19 v0 M29,19 h-7 v0 M29,19 h7 v0;
            M29,19 v0 M29,19 h0 v0 M29,19 h0 v0;
          "
          keyTimes="0; 0.125; 0.25; 0.75; 0.875; 1"
          begin="svgJsAnim.begin+2.5s"
          calcMode="linear"
          fill="freeze"/>
      </path>
      <text
        x="21"
        y="24"
        opacity="0"
        font-family="fira-sans-regular, sans-serif"
        font-size="2.5"
        fill="${this.c[0]}">
        variable name
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+2.5s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+7s"/>
      </text>
      <path
        d="M65,19 h0 v0 M65,19 v0 M65,19 h0 v0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="5s"
          values="
            M65,19 h0 v0 M65,19 v0 M65,19 h0 v0;
            M65,19 h-22 v0 M65,19 v2 M65,19 h22 v0;
            M65,19 h-22 v-2 M65,19 v2 M65,19 h22 v-2;
            M65,19 h-22 v-2 M65,19 v2 M65,19 h22 v-2;
            M65,19 h-22 v0 M65,19 v2 M65,19 h22 v0;
            M65,19 h0 v0 M65,19 v0 M65,19 h0 v0;
          "
          keyTimes="0; 0.125; 0.25; 0.75; 0.875; 1"
          begin="svgJsAnim.begin+2.5s"
          calcMode="linear"
          fill="freeze"/>
      </path>
      <text
        x="53"
        y="24"
        opacity="0"
        font-family="fira-sans-regular, sans-serif"
        font-size="2.5"
        fill="${this.c[0]}">
        variable value <tspan font-style="italic" fill="${this.c[3]}">(string)</tspan>
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+2.5s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+7s"/>
      </text>
      <path
        d="M19,28 h0 v0 M19,28 v0 M19,28 h0 v0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="5s"
          values="
            M19,28 h0 v0 M19,28 v0 M19,28 h0 v0;
            M19,28 h-7 v0 M19,28 v0 M19,28 h8 v0;
            M19,28 h-7 v-2 M19,28 v2 M19,28 h8 v-2;
            M19,28 h-7 v-2 M19,28 v2 M19,28 h8 v-2;
            M19,28 h-7 v0 M19,28 v0 M19,28 h8 v0;
            M19,28 h0 v0 M19,28 v0 M19,28 h0 v0;
          "
          keyTimes="0; 0.125; 0.25; 0.75; 0.875; 1"
          begin="svgJsAnim.begin+8s"
          calcMode="linear"
          fill="freeze"/>
      </path>
      <text
        x="11.5"
        y="33"
        opacity="0"
        font-family="fira-sans-regular, sans-serif"
        font-size="2.5"
        fill="${this.c[0]}">
        function name
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+8s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+12s"/>
      </text>
      <path
        d="M57,28 h0 v0 M57,28 v0 M57,28 h0 v0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="5s"
          values="
            M57,28 h0 v0 M57,28 v0 M57,28 h0 v0;
            M57,28 h-27 v0 M57,28 v0 M57,28 h27 v0;
            M57,28 h-27 v-2 M57,28 v2 M57,28 h27 v-2;
            M57,28 h-27 v-2 M57,28 v2 M57,28 h27 v-2;
            M57,28 h-27 v0 M57,28 v0 M57,28 h27 v0;
            M57,28 h0 v0 M57,28 v0 M57,28 h0 v0;
          "
          keyTimes="0; 0.125; 0.25; 0.75; 0.875; 1"
          begin="svgJsAnim.begin+8s"
          calcMode="linear"
          fill="freeze"/>
      </path>
      <text
        x="46"
        y="33"
        opacity="0"
        font-family="fira-sans-regular, sans-serif"
        font-size="2.5"
        fill="${this.c[0]}">
        function arguments
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+8s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+12s"/>
      </text>
      <path
        d="M50,28 h0 v0 M50,28 v0 M50,28 h0 v0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="1.5s"
          values="
            M50,28 h-0 v0 M50,28 v0 M50,28 h0 v0;
            M50,28 h-38 v0 M50,28 v0 M50,28 h38 v0;
            M50,28 h-38 v-2 M50,28 v2 M50,28 h38 v-2;
          "
          keyTimes="0; 0.75; 1"
          begin="svgJsAnim.begin+13s"
          calcMode="linear"
          fill="freeze"/>
      </path>
      <text
        x="39"
        y="33"
        opacity="0"
        font-family="fira-sans-regular, sans-serif"
        font-size="2.5"
        fill="${this.c[0]}">
        a function <tspan font-style="italic" fill="${this.c[4]}">invocation</tspan>
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgJsAnim.begin+13s"/>
      </text>
    </svg>`
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

  // .....................................................
}

window.customElements.define('svg-js-animated', SvgJsAnimated)
