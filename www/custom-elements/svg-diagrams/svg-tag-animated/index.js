/* global HTMLElement CustomEvent */
class SvgTagAnimated extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  emit (type, detail) {
    const ev = new CustomEvent(type, { detail, bubbles: true, composed: true })
    this.dispatchEvent(ev)
  }

  updateHTML (s = 0) {
    const svg = this.stage(s)
    this.innerHTML = `<svg version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 35"
      style="width:100%;margin:0 auto;display:block;">
      ${svg}
      </svg>`

    // special animation cases
    if (s === 10) {
      this._toutID = setTimeout(() => this._attrValAnim(), 500)
    } else {
      // default animation logic
      this.clearTimers()
      const anim = this.querySelector('#svgAnim')
      const anims = this.querySelectorAll('animate')
      if (anim) anim.beginElement()
      else anims.forEach(a => a.beginElement())
    }

    // click event
    this.querySelector('svg').addEventListener('click', () => {
      this.emit('svg-click', { stage: s })
    })

    this.emit('svg-update', { stage: s })
  }

  noHTML () {
    this.innerHTML = ''
  }

  clearTimers () {
    if (this._loopID) window.cancelAnimationFrame(this._loopID)
    if (this._toutID) clearTimeout(this._toutID)
  }

  _attrValAnim () {
    let idx = 0
    let delta = -0.01
    const words = ['text', 'number', 'color', 'range', 'checkbox', 'radio']
    const xs = [66, 81, 71, 72, 86, 71]
    const text = this.querySelector('#svgAttrText')
    const bracket = this.querySelector('#svgCloseBracket')
    text.style.opacity = 1
    const loop = () => {
      const o = Number(text.style.opacity) + delta
      text.style.opacity = o
      if (o <= 0) { // fade down to 0
        text.style.opacity = 0
        idx = (idx + 1) % words.length
        text.textContent = words[idx]
        bracket.setAttribute('x', xs[idx])
        delta = 0.01
        this._loopID = window.requestAnimationFrame(loop)
      } else if (o >= 1) { // hold at 1 for 1s
        this._toutID = setTimeout(() => {
          delta = -0.01
          this._loopID = window.requestAnimationFrame(loop)
        }, 1000)
      } else { // fade back up to 1
        this._loopID = window.requestAnimationFrame(loop)
      }
    }
    this._loopID = window.requestAnimationFrame(loop)
  }

  stage (num) {
    if (num === 0) {
      return `<text
        x="10"
        y="23"
        font-style="italic"
        font-family="fira-sans-regular, sans-serif"
        font-size="17"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">element</tspan>&gt;
      </text>`
    } else if (num === 1) {
      return `  <text
        x="30"
        y="23"
        font-family="fira-sans-regular, sans-serif"
        font-size="17"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">hr</tspan>&gt;
      </text>`
    } else if (num === 2) {
      return `  <text
        x="20"
        y="23"
        font-family="fira-sans-regular, sans-serif"
        font-size="17"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">meta</tspan>&gt;
      </text>`
    } else if (num === 3) {
      return `  <text
        x="17"
        y="23"
        font-family="fira-sans-regular, sans-serif"
        font-size="17"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">input</tspan>&gt;
      </text>`
    } else if (num === 4) {
      return `  <text
        x="17"
        y="23"
        font-family="fira-sans-regular, sans-serif"
        font-size="17"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">input</tspan>&gt;
        <animate
          attributeName="font-size"
          from="17" to="8" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
        <animate
          attributeName="x"
          from="17" to="14" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
        <animate
          attributeName="y"
          from="23" to="20" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
      </text>`
    } else if (num === 5) {
      return `  <text
        x="14"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">input</tspan>
      </text>
      <text
        x="37"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &gt;
        <animate
          attributeName="x"
          from="37" to="79" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
      </text>`
    } else if (num === 6) {
      return `  <text
        x="14"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">input</tspan>
      </text>
      <text
        x="39"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        <tspan style="fill:${this.c[4]};"> type</tspan><tspan style="fill:${this.c[0]};">=</tspan><tspan style="fill:${this.c[5]};">&quot;text&quot;</tspan>
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
      </text>
      <text
        x="79"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &gt;
      </text>`
    } else if (num === 7) {
      return `   <text
        x="14"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">input</tspan>
      </text>
      <text
        x="39"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        <tspan style="fill:${this.c[4]};"> type</tspan><tspan style="fill:${this.c[0]};">=</tspan><tspan style="fill:${this.c[5]};">&quot;text&quot;</tspan>
      </text>
      <text
        x="79"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &gt;
      </text>
      <path
        d="M27,26 h-9 v-3 M27,26 v3 M27,26 h10 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          id="svgAnim"
          attributeName="d" dur="0.75s"
          values="
            M27,26 h0 v0 M27,26 v0 M27,26 h0 v0;
            M27,26 h-9 v0 M27,26 v0 M27,26 h10 v0;
            M27,26 h-9 v-3 M27,26 v3 M27,26 h10 v-3;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze" begin="indefinite">
      </path>
      <text
        x="15"
        y="33"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        the element's name
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0.75s">
      </text>
      <path
        d="M57,9 v0 h0 v0 M57,9 h0 v0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d" dur="0.75s"
          values="
            M57,9 v0 h0 v0 M57,9 h0 v0;
            M39,9 v0 h18 v0 M57,9 h22 v0;
            M39,12 v-3 h18 v-3 M57,9 h22 v3;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze" begin="svgAnim.begin+0s">
      </path>
      <text
        x="45"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        the element's attribute
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0.75s">
      </text>`
    } else if (num === 8) {
      return `   <text
        x="14"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">input</tspan>
      </text>
      <text
        x="39"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        <tspan style="fill:${this.c[4]};"> type</tspan><tspan style="fill:${this.c[0]};">=</tspan><tspan style="fill:${this.c[5]};">&quot;text&quot;</tspan>
      </text>
      <text
        x="79"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &gt;
      </text>
      <path
        d="M27,26 h-9 v-3 M27,26 v3 M27,26 h10 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          id="svgAnim"
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </path>
      <text
        x="15"
        y="33"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        the element's name
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s">
      </text>
      <path
        d="M39,12 v-3 h18 v-3 M57,9 h22 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="45"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        fill="${this.c[2]}">
        the element's attribute
      </text>
      <path
        d="M70,24 v0 h0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d" dur="0.75s"
          values="
            M70,24 v0 h0;
            M70,24 v7 h0;
            M70,24 v7 h-29;
          "
          keyTimes="0; 0.25; 1" calcMode="linear"
          fill="freeze" begin="svgAnim.begin+0.5s">
      </path>
      <text
        x="19"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        attribute value
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0.5s">
      </text>
      <path
        d="M47,24 v0 h0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d" dur="0.75s"
          values="
            M47,24 v0 h0;
            M47,24 v3 h0;
            M47,24 v3 h-6;
          "
          keyTimes="0; 0.25; 1" calcMode="linear"
          fill="freeze" begin="svgAnim.begin+0.5s">
      </path>
      <text
        x="19"
        y="28"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="0"
        fill="${this.c[2]}">
        attribute name
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0.5s">
      </text>`
    } else if (num === 9) {
      return `   <text
        x="14"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">input</tspan>
        <animate
          attributeName="x"
          from="14" to="4" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </text>
      <text
        x="39"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        <tspan style="fill:${this.c[4]};"> type</tspan><tspan style="fill:${this.c[0]};">=</tspan><tspan style="fill:${this.c[5]};">&quot;text&quot;</tspan>
        <animate
          attributeName="x"
          from="39" to="29" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </text>
      <text
        x="79"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &gt;
        <animate
          attributeName="x"
          from="79" to="69" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </text>
      <path
        d="M39,12 v-3 h18 v-3 M57,9 h22 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </path>
      <text
        x="45"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        fill="${this.c[2]}">
        the element's attribute
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </text>
      <path
        d="M70,24 v7 h-29"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </path>
      <text
        x="19"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        fill="${this.c[2]}">
        attribute value
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </text>
      <path
        d="M47,24 v3 h-6"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </path>
      <text
        x="19"
        y="28"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        fill="${this.c[2]}">
        attribute name
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </text>`
    } else if (num === 10) {
      return `<text
        x="4"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">input</tspan>
      </text>
      <text
        x="29"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        <tspan style="fill:${this.c[4]};"> type</tspan><tspan style="fill:${this.c[0]};">=</tspan><tspan style="fill:${this.c[5]};">&quot;</tspan>
      </text>
      <text
        id="svgAttrText"
        x="52"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[5]}">
        text
      </text>
      <text
        id="svgCloseBracket"
        x="66"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        <tspan style="fill:${this.c[5]};">&quot;</tspan>&gt;
      </text>`
    } else if (num === 11) {
      return `<text
        x="26"
        y="23"
        font-style="italic"
        font-family="fira-sans-regular, sans-serif"
        font-size="17"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">tag</tspan>&gt;
        <animate
          id="svgAnim"
          attributeName="y"
          from="23" to="20" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
        <animate
          attributeName="font-size"
          from="17" to="8" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0.5s"/>
        <animate
          attributeName="x"
          from="26" to="38" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0.5s"/>
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
          begin="svgAnim.begin+1.5s">
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
          fill="freeze" begin="svgAnim.begin+1.5s">
      </text>`
    } else if (num === 12) {
      return `<text
        x="38"
        y="20"
        font-style="italic"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">tag</tspan>&gt;
        <animate
          id="svgAnim"
          attributeName="x"
          from="38" to="15" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
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
          fill="freeze" begin="svgAnim.begin+0.75s"/>
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
          fill="freeze" begin="svgAnim.begin+0s"/>
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </text>
      <path
        d="M48,9 h-10 v3 M48,9 v-3 M48,9 h10 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
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
          begin="svgAnim.begin+0s">
      </path>
      <text
        x="41"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        an element
      </text>`
    } else if (num === 13) {
      return `<text
        x="15"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">h1</tspan>&gt;
        <animate
          attributeName="x"
          from="15" to="10" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
      </text>
      <text
        x="36"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        my web site
        <animate
          attributeName="x"
          from="36" to="27" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </text>
      <text
        x="65"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;/<tspan fill="${this.c[1]}">h1</tspan>&gt;
        <animate
          attributeName="x"
          from="65" to="71" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </text>
      <path
        d="M48,9 h-32 v3 M48,9 v-3 M48,9 h41 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
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
          begin="svgAnim.begin+0.75s">
      </path>
      <text
        x="40"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        an <tspan font-style="italic" fill="${this.c[1]}">h1</tspan> element
      </text>
      <path
        d="M48,26 h0 v0 M48,26 v0 M48,26 h0 v0"
        fill="none"
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
          begin="svgAnim.begin+0.75s">
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
          fill="freeze" begin="svgAnim.begin+0.75s"/>
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
          begin="svgAnim.begin+0.75s">
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
          fill="freeze" begin="svgAnim.begin+0.75s"/>
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
          begin="svgAnim.begin+0.75s">
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
          fill="freeze" begin="svgAnim.begin+0.75s"/>
      </text>`
    } else if (num === 14) {
      return `<text
        x="10"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">h1</tspan>&gt;
      </text>
      <text
        x="27"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        my web site
      </text>
      <text
        x="71"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;/<tspan fill="${this.c[1]}">h1</tspan>&gt;
      </text>
      <path
        d="M48,9 h-38 v3 M48,9 v-3 M48,9 h43 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="40"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        an <tspan font-style="italic" fill="${this.c[1]}">h1</tspan> element
      </text>
      <path
        d="M48,26 h-21 v-3 M48,26 v3 M48,26 h21 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="42"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        content
      </text>
      <path
        d="M18,26 h-8 v-3 M18,26 v3 M18,26 h7 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="9"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        opening tag
      </text>
      <path
        d="M83,26 h-12 v-3 M81,26 v3 M83,26 h8 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="74"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        closing tag
      </text>`
    } else if (num === 15) {
      return `<text
        x="10"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">p</tspan>&gt;
      </text>
      <text
        x="27"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        my web site
      </text>
      <text
        x="74"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;/<tspan fill="${this.c[1]}">p</tspan>&gt;
        <animate
          id="svgAnim"
          attributeName="x"
          from="71" to="74" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
      </text>
      <path
        d="M48,9 h-38 v3 M48,9 v-3 M48,9 h43 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="40"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        a <tspan font-style="italic" fill="${this.c[1]}">p</tspan> element
      </text>
      <path
        d="M48,26 h-21 v-3 M48,26 v3 M48,26 h22 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M48,26 h-21 v-3 M48,26 v3 M48,26 h21 v-3;
            M48,26 h-21 v-3 M48,26 v3 M48,26 h22 v-3;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgAnim.begin+0s">
      </path>
      <text
        x="42"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        content
      </text>
      <path
        d="M18,26 h-8 v-3 M17,26 v3 M18,26 h5 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M18,26 h-8 v-3 M18,26 v3 M18,26 h7 v-3;
            M18,26 h-8 v-3 M17,26 v3 M18,26 h5 v-3;
          "
          keyTimes="0; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgAnim.begin+0s">
      </path>
      <text
        x="9"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        opening tag
      </text>
      <path
        d="M83,26 h-9 v-3 M82,26 v3 M83,26 h8 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M83,26 h-12 v-3 M81,26 v3 M83,26 h8 v-3;
            M83,26 h-9 v-3 M82,26 v3 M83,26 h8 v-3;
          "
          keyTimes="0; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgAnim.begin+0s">
      </path>
      <text
        x="74"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        closing tag
      </text>`
    } else if (num === 16) {
      return `<text
        x="10"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">a</tspan>&gt;
      </text>
      <text
        x="27"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        my web site
      </text>
      <text
        x="74"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;/<tspan fill="${this.c[1]}">a</tspan>&gt;
      </text>
      <path
        d="M48,9 h-38 v3 M48,9 v-3 M48,9 h43 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="40"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        an <tspan font-style="italic" fill="${this.c[1]}">a</tspan> element
      </text>
      <path
        d="M48,26 h-21 v-3 M48,26 v3 M48,26 h22 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="42"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        content
      </text>
      <path
        d="M18,26 h-8 v-3 M17,26 v3 M18,26 h5 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="9"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        opening tag
      </text>
      <path
        d="M83,26 h-9 v-3 M82,26 v3 M83,26 h8 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="74"
        y="32"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        closing tag
      </text>`
    } else if (num === 17) {
      return `<text
        x="10"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">a</tspan>
        <animate
          id="svgAnim"
          attributeName="font-size"
          from="8" to="4.5" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite"/>
        <animate
          attributeName="x"
          from="10" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
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
          fill="freeze" begin="svgAnim.begin+1s"/>
      </text>
      <text
        x="18.7"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &gt;
        <animate
          attributeName="font-size"
          from="8" to="4.5" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
        <animate
          attributeName="x"
          from="18.7" to="60" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </text>
      <text
        x="27"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        my web site
        <animate
          attributeName="font-size"
          from="8" to="4.5" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
        <animate
          attributeName="x"
          from="27" to="64.5" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </text>
      <text
        x="74"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[0]}">
        &lt;/<tspan fill="${this.c[1]}">a</tspan>&gt;
        <animate
          attributeName="font-size"
          from="8" to="4.5" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
        <animate
          attributeName="x"
          from="74" to="90" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </text>
      <path
        d="M48,9 h-38 v3 M48,9 v-3 M48,9 h43 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
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
          begin="svgAnim.begin+0s">
      </path>
      <text
        x="40"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        an <tspan font-style="italic" fill="${this.c[1]}">a</tspan> element
      </text>
      <path
        d="M48,26 h-21 v-3 M48,26 v3 M48,26 h22 v-3"
        fill="none"
        opacity="1"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </path>
      <text
        x="41"
        y="32"
        opacity="1"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        fill="${this.c[2]}">
        content
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </text>
      <path
        d="M18,26 h-8 v-3 M17,26 v3 M18,26 h5 v-3"
        fill="none"
        opacity="1"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </path>
      <text
        x="9"
        y="32"
        opacity="1"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        fill="${this.c[2]}">
        opening tag
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </text>
      <path
        d="M83,26 h-9 v-3 M82,26 v3 M83,26 h8 v-3"
        fill="none"
        opacity="1"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </path>
      <text
        x="74"
        y="32"
        opacity="1"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        fill="${this.c[2]}">
        closing tag
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.5s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
      </text>
      <path
        d="M32,26 h0 v0 M32,26 v0 M32,26 h0 v0"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          attributeName="d"
          dur="0.75s"
          values="
            M32,26 h0 v0 M32,26 v0 M32,26 h0 v0;
            M32,26 h-24.5 v0 M32,26 v0 M32,26 h27.5 v0;
            M32,26 h-24.5 v-3 M32,26 v3 M32,26 h27.5 v-3;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze"
          begin="svgAnim.begin+1.25s">
      </path>
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
          fill="freeze" begin="svgAnim.begin+1.25s"/>
      </text>`
    } else if (num === 18) {
      return `<text
        x="1"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="4.5"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">a</tspan>
      </text>
      <text
        x="7"
        y="20"
        opacity="1"
        font-family="fira-sans-regular, sans-serif"
        font-size="4.5"
        fill="${this.c[0]}">
        <tspan style="fill:${this.c[4]};">href</tspan><tspan style="fill:${this.c[0]};">=</tspan><tspan style="fill:${this.c[5]};">&quot;https://netizen.org&quot;</tspan>
      </text>
      <text
        x="60"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="4.5"
        fill="${this.c[0]}">
        &gt;
      </text>
      <text
        x="64.5"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="4.5"
        fill="${this.c[3]}">
        my web site
      </text>
      <text
        x="90"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="4.5"
        fill="${this.c[0]}">
        &lt;/<tspan fill="${this.c[1]}">a</tspan>&gt;
      </text>
      <path
        d="M32,26 h-24.5 v-3 M32,26 v3 M32,26 h27.5 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="14"
        y="32"
        opacity="1"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        fill="${this.c[2]}">
        the <tspan font-style="italic" fill="${this.c[1]}">a</tspan> element's <tspan font-style="italic" fill="${this.c[4]}">href</tspan> attribute
      </text>
      <path
        d="M48,9 h-47 v3 M48,9 v-3 M48,9 h51 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
        <animate
          id="svgAnim"
          attributeName="d"
          dur="0.75s"
          values="
            M48,9 h-47 v3 M48,9 v-3 M48,9 h51 v3;
            M48,9 h-47 v0 M48,9 v0 M48,9 h51 v0;
            M48,9 h0 v0 M48,9 v0 M48,9 h0 v0;
          "
          keyTimes="0; 0.5; 1"
          calcMode="linear"
          fill="freeze"/>
      </path>
      <text
        x="40"
        y="4"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[2]}">
        an <tspan font-style="italic" fill="${this.c[1]}">a</tspan> element
        <animate
          attributeName="opacity"
          from="1" to="0" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0s"/>
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
          fill="freeze" begin="svgAnim.begin+1s"/>
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
          fill="freeze" begin="svgAnim.begin+1.5s"/>
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
          fill="freeze" begin="svgAnim.begin+1s"/>
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
          fill="freeze" begin="svgAnim.begin+1.5s"/>
      </text>`
    } else if (num === 19) {
      return `<text
        x="19"
        y="23"
        font-style="italic"
        font-family="fira-sans-regular, sans-serif"
        font-size="17"
        fill="${this.c[0]}">
        &lt;<tspan fill="${this.c[1]}">HTML</tspan>&gt;
      </text>`
    }
  }

  // ---------------------------------------------------------------------------

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
