/* global HTMLElement */
class SvgTagAnimated extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
    this.looping = null
    this.start()
  }

  _restartAnim () {
    this.updateHTML()
    const anim = this.querySelector('#svgTagAnim')
    anim.beginElement()
  }

  start () {
    this._restartAnim()
    this.looping = setInterval(() => this._restartAnim(), 23000)
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
        x="26"
        y="23"
        font-style="italic"
        font-family="fira-sans-regular, sans-serif"
        font-size="17"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">tag</tspan>&gt;
        <animate
          id="svgTagAnim"
          attributeName="y"
          from="23" to="20" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
        <animate
          attributeName="font-size"
          from="17" to="8" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+0.5s"/>
        <animate
          attributeName="x"
          from="26" to="38" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+0.5s"/>
        <animate
          attributeName="x"
          from="38" to="15" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+4.5s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.25s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
      </text>
      <text
        x="10"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        opacity="0"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">a</tspan>&gt;
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.15s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
      </text>
      <text
        x="10"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        opacity="0"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">a</tspan>
        <animate
          id="svgTagAnim"
          attributeName="font-size"
          from="8" to="4.5" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
        <animate
          attributeName="x"
          from="10" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
      </text>
      <text
        x="7"
        y="20"
        opacity="0"
        font-family="fira-sans-regular, sans-serif"
        font-size="4.5"
        fill="${this.c[0]}">
        <tspan style="fill:${this.c[4]};">href</tspan><tspan style="fill:${this.c[0]};">=</tspan><tspan style="fill:${this.c[5]};">&quot;https://netizen.org&quot;</tspan>
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+14s"/>
      </text>
      <text
        x="18.7"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        opacity="0"
        fill="${this.c[0]}">
        &gt;
        <animate
          attributeName="font-size"
          from="8" to="4.5" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
        <animate
          attributeName="x"
          from="18.7" to="60" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
      </text>
      <text
        x="36"
        y="20"
        opacity="0"
        font-style="italic"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        content
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+5s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
      </text>
      <text
        x="27"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        opacity="0"
        fill="${this.c[3]}">
        my web site
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
        <animate
          attributeName="font-size"
          from="8" to="4.5" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
        <animate
          attributeName="x"
          from="27" to="64.5" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
      </text>
      <text
        x="38"
        y="20"
        opacity="0"
        font-style="italic"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;/<tspan fill="${this.c[1]}">tag</tspan>&gt;
        <animate
          attributeName="x"
          from="38" to="65" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+4.5s"/>
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+4.5s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
      </text>
      <text
        x="74"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        opacity="0"
        fill="${this.c[0]}">
        &lt;/<tspan fill="${this.c[1]}">a</tspan>&gt;
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
        <animate
          attributeName="font-size"
          from="8" to="4.5" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
        <animate
          attributeName="x"
          from="74" to="90" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
      </text>
      <path
        d="M48,9 h0 v0 M48,9 v0 M48,9 h0 v0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M48,9 h0 v0 M48,9 v0 M48,9 h0 v0;
            M48,9 h-10 v0 M48,9 v0 M48,9 h10 v0;
            M48,9 h-10 v3 M48,9 v-3 M48,9 h10 v3;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgTagAnim.begin+1.5s"/>
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M48,9 h-10 v3 M48,9 v-3 M48,9 h10 v3;
            M48,9 h-32 v3 M48,9 v-3 M48,9 h41 v3;
          "
          keyTimes="0; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgTagAnim.begin+4.5s"/>
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M48,9 h-32 v3 M48,9 v-3 M48,9 h41 v3;
            M48,9 h-38 v3 M48,9 v-3 M48,9 h43 v3;
          "
          keyTimes="0; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgTagAnim.begin+7s"/>
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M48,9 h-38 v3 M48,9 v-3 M48,9 h43 v3;
            M48,9 h-47 v3 M48,9 v-3 M48,9 h51 v3;
          "
          keyTimes="0; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgTagAnim.begin+13s"/>
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M48,9 h-47 v3 M48,9 v-3 M48,9 h51 v3;
            M48,9 h-47 v0 M48,9 v0 M48,9 h51 v0;
            M48,9 h0 v0 M48,9 v0 M48,9 h0 v0;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgTagAnim.begin+18s"/>
      </path>
      <text
        x="41"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        an element
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+1.5s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
      </text>
      <text
        x="40"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        an <tspan font-style="italic" fill="${this.c[1]}">a</tspan> element
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+18s"/>
      </text>
      <path
        d="M39,15 v0 h0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="0.5s"
          values="
            M39,15 v0 h0;
            M39,15 v-3 h0;
            M39,15 v-3 h10;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze" begin="svgTagAnim.begin+19s"/>
      </path>
      <text
        x="50"
        y="13"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        the attribute's value
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+19.5s"/>
      </text>
      <path
        d="M11,15 v0 h0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="0.5s"
          values="
            M11,15 v0 h0;
            M11,15 v-9 h0;
            M11,15 v-9 h38;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze" begin="svgTagAnim.begin+19s"/>
      </path>
      <text
        x="50"
        y="7"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        the attribute's name
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+19.5s"/>
      </text>
      <path
        d="M48,26 h0 v0 M48,26 v0 M48,26 h0 v0"
        fill="none"
        opacity="1"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M48,26 h0 v0 M48,26 v0 M48,26 h0 v0;
            M48,26 h-21 v0 M48,26 v0 M48,26 h21 v0;
            M48,26 h-21 v-3 M48,26 v3 M48,26 h21 v-3;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgTagAnim.begin+7s"/>
      <animate
        attributeName="opacity"
        from="1" to="0" dur="0.5s"
        calcMode="spline" keySplines="0 0 0.58 1"
        fill="freeze" begin="svgTagAnim.begin+13s"/>
      </path>
      <text
        x="42"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        content
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
      </text>
      <path
        d="M18,26 h0 v0 M18,26 v0 M18,26 h0 v0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M18,26 h0 v0 M18,26 v0 M18,26 h0 v0;
            M18,26 h-8 v0 M18,26 v0 M18,26 h7 v0;
            M18,26 h-8 v-3 M18,26 v3 M18,26 h7 v-3;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgTagAnim.begin+7s"/>
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M18,26 h-8 v-3 M18,26 v3 M18,26 h7 v-3;
            M32,26 h-24.5 v-3 M32,26 v3 M32,26 h27.5 v-3;
          "
          keyTimes="0; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgTagAnim.begin+13s">
      </path>
      <text
        x="9"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        opening tag
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
      </text>
      <text
        x="14"
        y="32"
        opacity="0"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        fill="${this.c[2]}">
        the <tspan font-style="italic" fill="${this.c[1]}">a</tspan> element's <tspan font-style="italic" fill="${this.c[4]}">href</tspan> attribute
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+14s"/>
      </text>
      <path
        d="M83,26 h0 v0 M81,26 v0 M83,26 h0 v0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M83,26 h0 v0 M81,26 v0 M83,26 h0 v0;
            M83,26 h-12 v0 M81,26 v0 M83,26 h8 v0;
            M83,26 h-12 v-3 M81,26 v3 M83,26 h8 v-3;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgTagAnim.begin+7s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
      </path>
      <text
        x="74"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        closing tag
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+7s"/>
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgTagAnim.begin+13s"/>
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

window.customElements.define('svg-tag-animated', SvgTagAnimated)
