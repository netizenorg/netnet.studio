/* global HTMLElement CustomEvent nn */
class SvgCssAnimated extends HTMLElement {
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
    if (s === 3) {
      this._toutID = setTimeout(() => this._propNames(), 500)
    } else {
      // default animation logic
      this.clearTimers()
      const anim = this.querySelector('#svgAnim')
      const anims = this.querySelectorAll('animate')
      if (anim) anim.beginElement()
      else if (anims) anims.forEach(a => a.beginElement())
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

  _propNames () {
    let idx = 0
    let delta = -0.05
    const words = nn.shuffle(['box-shadow', 'background-color', 'background-image', 'filter', 'mix-blend-mode', 'opacity', 'clip-path', 'mask-image', 'transform', 'animation', 'font-family', 'font-style', 'line-height', 'letter-spacing', 'word-spacing', 'text-shadow', 'cursor'])
    const text = this.querySelector('#svgPropName')
    text.style.opacity = 1
    const loop = () => {
      const o = Number(text.style.opacity) + delta
      text.style.opacity = o
      if (o <= 0) { // fade down to 0
        text.style.opacity = 0
        idx = (idx + 1) % words.length
        text.textContent = words[idx]
        delta = 0.05
        this._loopID = window.requestAnimationFrame(loop)
      } else if (o >= 1) { // hold at 1 for 1s
        this._toutID = setTimeout(() => {
          delta = -0.05
          this._loopID = window.requestAnimationFrame(loop)
        }, 750)
      } else { // fade back up to 1
        this._loopID = window.requestAnimationFrame(loop)
      }
    }
    this._loopID = window.requestAnimationFrame(loop)
  }

  stage (num) {
    if (num === 0) {
      return `<text
        x="4"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="6"
        fill="${this.c[5]}">
        &lt;<tspan fill="${this.c[1]}">h1</tspan>&gt;
      </text>
      <text
        x="17"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="6"
        fill="${this.c[2]}">
        Hello World Wide Web
      </text>
      <text
        x="78"
        y="20"
        font-family="fira-sans-regular, sans-serif"
        font-size="6"
        fill="${this.c[5]}">
        &lt;/<tspan fill="${this.c[1]}">h1</tspan>&gt;
      </text>`
    } else if (num === 1) {
      return `<text
        x="27"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        color
      </text>`
    } else if (num === 2) {
      return `<text
        x="27"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        font-size
      </text>`
    } else if (num === 3) {
      return `<text
        id="svgPropName"
        x="27"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        font-size
      </text>`
    } else if (num === 4) {
      return `<text
        x="27"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        font-size
        <animate
          id="svgAnim"
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
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
          fill="freeze" begin="svgAnim.begin+1.5s">
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
          fill="freeze" begin="svgAnim.begin+1.75s">
      </text>
      <text
        x="59"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        opacity='0'
        fill="${this.c[2]}">
        :
        <animate
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="svgAnim.begin+0.75s">
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
          fill="freeze" begin="svgAnim.begin+0.75s">
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
          fill="freeze" begin="svgAnim.begin+0.75s">
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
          fill="freeze" begin="svgAnim.begin+1.5s">
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
          fill="freeze" begin="svgAnim.begin+0.75s">
      </text>`
    } else if (num === 5) {
      return `<text
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
          fill="freeze" begin="svgAnim.begin+1.5s">
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
          fill="freeze" begin="svgAnim.begin+0.75s">
      </path>
      <text
        x="22"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        opacity: 0;
        fill="${this.c[2]}">
        {
        <animate
          id="svgAnim"
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </text>
      <text
        x="27"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        font-size
      </text>
      <path
        d="M43,28 h-16 v-3 M43,28 v3 M43,28 h16 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="38"
        y="34"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[0]}">
        property
      </text>
      <text
        x="59"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[2]}">
        :
      </text>
      <text
        x="64"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[4]}">
        100px
      </text>
      <path
        d="M75,28 h-10 v-3 M75,28 v3 M75,28 h10 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="71"
        y="34"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[0]}">
        value
      </text>
      <text
        x="86"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[2]}">
        ;
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
          fill="freeze" begin="svgAnim.begin+0s">
      </text>`
    } else if (num === 6) {
      return `<text
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
          fill="freeze" begin="svgAnim.begin+1.5s">
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
          fill="freeze" begin="svgAnim.begin+0.75s">
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
          id="svgAnim"
          attributeName="opacity"
          from="0" to="1" dur="0.75s"
          calcMode="spline" keySplines="0 0 0.58 1"
          fill="freeze" begin="indefinite">
      </text>
      <text
        x="47"
        y="7"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[0]}">
        declaration block
      </text>
      <path
        d="M59,11 h33 v3 M59,11 v-3 M59,11 h-36.5 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="22"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[2]}">
        {
      </text>
      <text
        x="27"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        font-size
      </text>
      <path
        d="M43,28 h-16 v-3 M43,28 v3 M43,28 h16 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="38"
        y="34"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[0]}">
        property
      </text>
      <text
        x="59"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[2]}">
        :
      </text>
      <text
        x="64"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[4]}">
        100px
      </text>
      <path
        d="M75,28 h-10 v-3 M75,28 v3 M75,28 h10 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="71"
        y="34"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[0]}">
        value
      </text>
      <text
        x="86"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[2]}">
        ;
      </text>
      <text
        x="90"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[2]}">
        }
      </text>`
    } else if (num === 7) {
      return `<text
        x="10"
        y="7"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[0]}">
        selector
      </text>
      <path
        d="M16,11 h5 v3 M16,11 v-3 M16,11 h-5 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="12"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[1]}">
        h1</tspan>
      </text>
      <text
        x="47"
        y="7"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[0]}">
        declaration block
      </text>
      <path
        d="M59,11 h33 v3 M59,11 v-3 M59,11 h-36.5 v3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="22"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[2]}">
        {
      </text>
      <text
        x="27"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[3]}">
        font-size
      </text>
      <path
        d="M43,28 h-16 v-3 M43,28 v3 M43,28 h16 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="38"
        y="34"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[0]}">
        property
      </text>
      <text
        x="59"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[2]}">
        :
      </text>
      <text
        x="64"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[4]}">
        100px
      </text>
      <path
        d="M75,28 h-10 v-3 M75,28 v3 M75,28 h10 v-3"
        fill="none"
        stroke="${this.c[0]}"
        stroke-width="0.1"
        stroke-linecap="butt"
        stroke-linejoin="miter">
      </path>
      <text
        x="71"
        y="34"
        font-family="fira-sans-regular, sans-serif"
        font-size="3"
        opacity="1"
        fill="${this.c[0]}">
        value
      </text>
      <text
        x="86"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[2]}">
        ;
      </text>
      <text
        x="90"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        fill="${this.c[2]}">
        }
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

window.customElements.define('svg-css-animated', SvgCssAnimated)
