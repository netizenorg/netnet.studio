/* global HTMLElement */
class SvgCssAnimated extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
    this.looping = null
    this.start()
  }

  _restartAnim () {
    const anim = this.querySelector('#svgCssAnim')
    anim.endElement()
    const svg = this.querySelector('svg')
    if (svg && typeof svg.setCurrentTime === 'function') svg.setCurrentTime(0)
    svg.unpauseAnimations()
    anim.beginElement()
  }

  start () {
    this._restartAnim()
    this.looping = setInterval(() => this._restartAnim(), 11000)
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
          x="47"
          y="7"
          font-family="fira-sans-regular, sans-serif"
          font-size="3"
          opacity="0"
          fill="${this.c[0]}">
          declaration block
          <animate
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="svgCssAnim.begin+5s"/>
        </text>
        <path
          d="M59,11 h0 v0 M59,11 v0 M59,11 h0 v0"
          fill="none"
          stroke="${this.c[0]}"
          stroke-width="0.1"
          stroke-linecap="butt"
          stroke-linejoin="miter">
          <animate
            attributeName="d" dur="0.75s"
            values="
              M59,11 h0 v0 M59,11 v0 M59,11 h0 v0;
              M59,11 h33 v0 M59,11 v0 M59,11 h-36.5 v0;
              M59,11 h33 v3 M59,11 v-3 M59,11 h-36.5 v3;
            "
            keyTimes="0; 0.5; 1"
            calcMode="linear"
            fill="freeze" begin="svgCssAnim.begin+5s"/>
        </path>
        <text
          x="10"
          y="7"
          font-family="fira-sans-regular, sans-serif"
          font-size="3"
          opacity="0"
          fill="${this.c[0]}">
          selector
          <animate
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="svgCssAnim.begin+8s"/>
        </text>
        <path
          d="M16,11 h0 v0 M16,11 v0 M16,11 h0 v0"
          fill="none"
          stroke="${this.c[0]}"
          stroke-width="0.1"
          stroke-linecap="butt"
          stroke-linejoin="miter">
          <animate
            attributeName="d" dur="0.75s"
            values="
              M16,11 h0 v0 M16,11 v0 M16,11 h0 v0;
              M16,11 h5 v0 M16,11 v0 M16,11 h-5 v0;
              M16,11 h5 v3 M16,11 v-3 M16,11 h-5 v3;
            "
            keyTimes="0; 0.5; 1"
            calcMode="linear"
            fill="freeze" begin="svgCssAnim.begin+8s"/>
        </path>
        <text
          x="12"
          y="22"
          font-family="fira-sans-regular, sans-serif"
          font-size="8"
          opacity="0"
          fill="${this.c[1]}">
          h1
          <animate
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="svgCssAnim.begin+8s"/>
        </text>
        <text
          x="22"
          y="22"
          font-family="fira-sans-regular, sans-serif"
          font-size="8"
          opacity="0"
          fill="${this.c[2]}">
          {
          <animate
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="svgCssAnim.begin+5s"/>
        </text>
        <text
          x="27"
          y="22"
          font-family="fira-sans-regular, sans-serif"
          font-size="8"
          fill="${this.c[3]}">
          font-size
          <animate
            id="svgCssAnim"
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="indefinite"/>
        </text>
        <path
          d="M43,28 h0 v0 M43,28 v0 M43,28 h0 v0"
          fill="none"
          stroke="${this.c[0]}"
          stroke-width="0.1"
          stroke-linecap="butt"
          stroke-linejoin="miter">
          <animate
            attributeName="d" dur="0.75s"
            values="
              M43,28 h0 v0 M43,28 v0 M43,28 h0 v0;
              M43,28 h-16 v0 M43,28 v0 M43,28 h16 v0;
              M43,28 h-16 v-3 M43,28 v3 M43,28 h16 v-3;
            "
            keyTimes="0; 0.5; 1"
            calcMode="linear"
            fill="freeze" begin="svgCssAnim.begin+0.75s"/>
        </path>
        <text
          x="38"
          y="34"
          font-family="fira-sans-regular, sans-serif"
          font-size="3"
          opacity="0"
          fill="${this.c[0]}">
          property
          <animate
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="svgCssAnim.begin+1.5s"/>
        </text>
        <text
          x="59"
          y="22"
          font-family="fira-sans-regular, sans-serif"
          font-size="8"
          opacity="0"
          fill="${this.c[2]}">
          :
          <animate
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="svgCssAnim.begin+0.75s"/>
        </text>
        <text
          x="64"
          y="22"
          font-family="fira-sans-regular, sans-serif"
          font-size="8"
          opacity="0"
          fill="${this.c[4]}">
          100px
          <animate
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="svgCssAnim.begin+0.75s"/>
        </text>
        <path
          d="M75,28 h0 v0 M75,28 v0 M75,28 h0 v0"
          fill="none"
          stroke="${this.c[0]}"
          stroke-width="0.1"
          stroke-linecap="butt"
          stroke-linejoin="miter">
          <animate
            attributeName="d" dur="0.75s"
            values="
              M75,28 h0 v0 M75,28 v0 M75,28 h0 v0;
              M75,28 h-10 v0 M75,28 v0 M75,28 h10 v0;
              M75,28 h-10 v-3 M75,28 v3 M75,28 h10 v-3;
            "
            keyTimes="0; 0.5; 1"
            calcMode="linear"
            fill="freeze" begin="svgCssAnim.begin+1.5s"/>
        </path>
        <text
          x="71"
          y="34"
          font-family="fira-sans-regular, sans-serif"
          font-size="3"
          opacity="0"
          fill="${this.c[0]}">
          value
          <animate
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="svgCssAnim.begin+1.75s"/>
        </text>
        <text
          x="86"
          y="22"
          font-family="fira-sans-regular, sans-serif"
          font-size="8"
          opacity="0"
          fill="${this.c[2]}">
          ;
          <animate
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="svgCssAnim.begin+0.75s"/>
        </text>
        <text
          x="90"
          y="22"
          font-family="fira-sans-regular, sans-serif"
          font-size="8"
          opacity="0"
          fill="${this.c[2]}">
          }
          <animate
            attributeName="opacity"
            from="0" to="1" dur="0.75s"
            calcMode="spline" keySplines="0 0 0.58 1"
            fill="freeze" begin="svgCssAnim.begin+5s"/>
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

window.customElements.define('svg-css-animated', SvgCssAnimated)
