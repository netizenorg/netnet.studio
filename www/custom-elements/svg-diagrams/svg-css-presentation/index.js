/* global HTMLElement CustomEvent nn NNE utils */
class SvgCssPresentation extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.codeVals = {
      'font-size': 100,
      'font-weight': 300,
      'font-family': 'sans-serif',
      color: 'black',
      'background-color': 'pink',
      width: Math.round(nn.width / 2),
      height: 300,
      'border-width': 2,
      'border-style': 'solid',
      'border-color': 'black',
      'margin-top': 2,
      'margin-right': 2,
      'margin-bottom': 2,
      'margin-left': 2,
      'padding-top': 2,
      'padding-right': 2,
      'padding-bottom': 2,
      'padding-left': 2
    }
    this.shorthand = {
      border: ['border-width', 'border-style', 'border-color'],
      margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'],
      padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left']
    }
    this.codeTemplates = {
      type: `<style>

  h1 {
    font-size: {{font-size}}px;
    font-weight: {{font-weight}};
    font-family: {{font-family}};
  }

</style>

<h1>Hello World Wide Web</h1>`,
      box1: `<style>

  h1 {
    font-size: {{font-size}}px;
    font-weight: {{font-weight}};
    font-family: {{font-family}};
    color: {{color}};
    background-color: {{background-color}};
  }

</style>

<h1>Hello World Wide Web</h1>`,
      box2: `<style>

  h1 {
    font-size: {{font-size}}px;
    font-weight: {{font-weight}};
    font-family: {{font-family}};
    color: {{color}};
    background-color: {{background-color}};
    width: {{width}}px;
    height: {{height}}px;
  }

</style>

<h1>Hello World Wide Web</h1>`,
      box3: `<style>

  h1 {
    font-size: {{font-size}}px;
    font-weight: {{font-weight}};
    font-family: {{font-family}};
    color: {{color}};
    background-color: {{background-color}};
    width: {{width}}px;
    height: {{height}}px;
    border-width: {{border-width}}px;
    border-style: {{border-style}};
    border-color: {{border-color}};
  }

</style>

<h1>Hello World Wide Web</h1>`,
      box4: `<style>

  h1 {
    font-size: {{font-size}}px;
    font-weight: {{font-weight}};
    font-family: {{font-family}};
    color: {{color}};
    background-color: {{background-color}};
    width: {{width}}px;
    height: {{height}}px;
    border: {{border}};
  }

</style>

<h1>Hello World Wide Web</h1>`,
      box5: `<style>

  h1 {
    font-size: {{font-size}}px;
    font-weight: {{font-weight}};
    font-family: {{font-family}};
    color: {{color}};
    background-color: {{background-color}};
    width: {{width}}px;
    height: {{height}}px;
    margin-top: {{margin-top}}px;
    margin-right: {{margin-right}}px;
    margin-bottom: {{margin-bottom}}px;
    margin-left: {{margin-left}}px;
    border: {{border}};
  }

</style>

<h1>Hello World Wide Web</h1>`,
      box6: `<style>

  h1 {
    font-size: {{font-size}}px;
    font-weight: {{font-weight}};
    font-family: {{font-family}};
    color: {{color}};
    background-color: {{background-color}};
    width: {{width}}px;
    height: {{height}}px;
    margin: {{margin}};
    border: {{border}};
  }

</style>

<h1>Hello World Wide Web</h1>`,
      box7: `<style>

  h1 {
    font-size: {{font-size}}px;
    font-weight: {{font-weight}};
    font-family: {{font-family}};
    color: {{color}};
    background-color: {{background-color}};
    width: {{width}}px;
    height: {{height}}px;
    margin: {{margin}};
    border: {{border}};
    padding: {{padding}};
  }

</style>

<h1>Hello World Wide Web</h1>`,
      box8: `<style>

  h1 {
    /* typography */
    font-size: {{font-size}}px;
    font-weight: {{font-weight}};
    font-family: {{font-family}};
    /* colors */
    color: {{color}};
    background-color: {{background-color}};
    /* box model */
    width: {{width}}px;
    height: {{height}}px;
    margin: {{margin}};
    border: {{border}};
    padding: {{padding}};
  }

</style>

<h1>Hello World Wide Web</h1>`
    }

    this.updateHTML()
  }

  emit (type, detail) {
    const ev = new CustomEvent(type, { detail, bubbles: true, composed: true })
    this.dispatchEvent(ev)
  }

  updateHTML (s = 0) {
    const eles = this.stage(s)
    this.innerHTML = s < 8
      ? `<svg version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 35"
        style="width:100%;margin:0 auto;display:block;">
        ${eles}
        </svg>`
      : `<button class="pill-btn pill-btn--secondary css-ref-gui-toggle-btn"
            onclick="WIDGETS['css-reference'].togglePresentationConvo()">
          toggle guide
        </button>
        <div class="css-ref-gui">${eles}</div>`

    // special animation cases
    if (s === 3) {
      this._toutID = setTimeout(() => this._propNames(), 500)
    } else if (s >= 8) {
      utils.setVal('--css-ref-toggle-message', '""')
      this._updateCode(s)
      this._setupGUI(s)
    } else {
      // default animation logic
      this.clearTimers()
      const anim = this.querySelector('#svgCssPres')
      const anims = this.querySelectorAll('animate')
      if (anim) anim.beginElement()
      else if (anims) anims.forEach(a => a.beginElement())
    }

    // click event
    if (s < 8) {
      this.querySelector('svg').addEventListener('click', () => {
        this.emit('svg-click', { stage: s })
      })
      utils.setVal('--css-ref-toggle-message', '"click diagram to toggle guide"')
    }

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

  _updateCode (s, e) {
    utils.cancelAutoType()

    const hydrateTemplate = (template) => {
      const match = /{{\s*([^{}\s]+)\s*}}/g
      return template.replace(match, (_, k) => {
        if (typeof this.codeVals[k] !== 'undefined') {
          return this.codeVals[k]
        } else {
          const parts = this.shorthand[k]
          const renderedParts = parts.map(subKey => {
            const subVal = this.codeVals[subKey]
            return !isNaN(parseInt(subVal)) ? `${subVal}px` : `${subVal}`
          })
          return renderedParts.join(' ')
        }
      })
    }

    const replaceLines = (str, from, to = from, repl) => {
      const a = str.split('\n')
      a.splice(from, to - from + 1, ...(Array.isArray(repl) ? repl : [repl]))
      return a.join('\n')
    }

    const injectLines = (str, at, repl) => {
      const a = str.split('\n')
      a.splice(at, 0, repl)
      return a.join('\n')
    }

    const t = s === 8 ? 'type' : 'box' + (parseInt(s) - 8)

    // if run by an element's event listener, update the codeVals
    if (e) {
      const name = e.target.getAttribute('name')
      this.codeVals[name] = e.target.value
      // simply update code (don't type it)
      NNE.code = hydrateTemplate(this.codeTemplates[t])
      return
    } else if (s === 16) { // skip to end
      NNE.code = hydrateTemplate(this.codeTemplates[t])
      return
    }

    // ... otherwise, let's autoType

    // get next && previous templates
    const nextTemp = this.codeTemplates[t]
    const prevTemp = s < 9
      ? '<style>\n\n  h1 { font-size: 100px; }\n\n</style>\n\n<h1>Hello World Wide Web</h1>'
      : s === 9
        ? this.codeTemplates.type
        : this.codeTemplates['box' + (parseInt(s) - 9)]

    // diff them && convert into "template" && "code" format for autoType
    const diff = utils.diff(prevTemp, nextTemp)
    // conver line numbers to index values
    diff.added = diff.added.map(o => { o.line = o.line - 1; return o })
    diff.removed = diff.removed.map(o => { o.line = o.line - 1; return o })
    // create autoType template string
    const pa = diff.removed.length > 0 ? diff.removed[0].line : diff.added[0].line
    const pb = diff.removed.length > 0 ? diff.removed[diff.removed.length - 1].line : 0
    const newTemp = diff.removed.length > 0
      ? replaceLines(hydrateTemplate(prevTemp), pa, pb, '{{code}}')
      : injectLines(hydrateTemplate(prevTemp), pa, '{{code}}')

    // create autoType code string
    const na = diff.added[0].line
    const nb = diff.added[diff.added.length - 1].line + 1
    const code = hydrateTemplate(nextTemp).split('\n').slice(na, nb).join('\n')
    utils.autoType(code, newTemp)
  }

  _setupGUI (s) {
    const sliders = this.querySelectorAll('input[type="range"]')
    sliders.forEach(ele => ele.addEventListener('input', e => this._updateCode(s, e)))
    const selects = this.querySelectorAll('select')
    selects.forEach(ele => {
      const clr = this.codeVals[ele.getAttribute('name')]
      const opt = ele.querySelector(`option[value="${clr}"]`)
      if (opt) opt.setAttribute('selected', 'selected')
      ele.addEventListener('change', e => this._updateCode(s, e))
    })
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
          id="svgCssPres"
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
          fill="freeze" begin="svgCssPres.begin+0.75s">
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
          fill="freeze" begin="svgCssPres.begin+1.5s">
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
          fill="freeze" begin="svgCssPres.begin+0.75s">
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
          fill="freeze" begin="svgCssPres.begin+0.75s">
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
          fill="freeze" begin="svgCssPres.begin+1.5s">
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
          fill="freeze" begin="svgCssPres.begin+1.75s">
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
          fill="freeze" begin="svgCssPres.begin+0.75s">
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
          fill="freeze" begin="svgCssPres.begin+1.5s">
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
          fill="freeze" begin="svgCssPres.begin+0.75s">
      </path>
      <text
        x="22"
        y="22"
        font-family="fira-sans-regular, sans-serif"
        font-size="8"
        opacity="0";
        fill="${this.c[2]}">
        {
        <animate
          id="svgCssPres"
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
          fill="freeze" begin="svgCssPres.begin+0s">
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
          fill="freeze" begin="svgCssPres.begin+1.5s">
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
          fill="freeze" begin="svgCssPres.begin+0.75s">
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
          id="svgCssPres"
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
    } else if (num === 8) {
      return this._guiStr(num)
    } else if (num === 9) {
      return this._guiStr(num)
    } else if (num === 10) {
      return this._guiStr(num)
    } else if (num === 11) {
      return this._guiStr(num)
    } else if (num === 12) {
      return this._guiStr(num)
    } else if (num === 13) {
      return this._guiStr(num)
    } else if (num === 14) {
      return this._guiStr(num)
    } else if (num === 15) {
      return this._guiStr(num)
    } else if (num === 16) {
      return this._guiStr(num)
    }
  }

  _guiStr (s) {
    const v = this.codeVals
    let opts = ''
    Object.keys(NNE.edu.css.colors).forEach(c => {
      opts += `<option value="${c}">${c}</option>\n`
    })
    let bso = ''
    const bstyles = ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset']
    bstyles.forEach(b => { bso += `<option value="${b}">${b}</option>\n` })

    let str = ''
    if (s >= 10) { // box model
      str += '<section class="css-ref-gui-box"><label>box model</label>'
      if (s >= 15) { // padding
        str += `<div class="css-ref-gui-row">
          <span>padding-top</span>
          <input class="css-ref-gui-slider" type="range" value="${v['padding-top']}" min="0" max="100" step="1" name="padding-top">
        </div>
        <div class="css-ref-gui-row">
          <span>padding-right</span>
          <input class="css-ref-gui-slider" type="range" value="${v['padding-right']}" min="0" max="100" step="1" name="padding-right">
        </div>
        <div class="css-ref-gui-row">
          <span>padding-bottom</span>
          <input class="css-ref-gui-slider" type="range" value="${v['padding-bottom']}" min="0" max="100" step="1" name="padding-bottom">
        </div>
        <div class="css-ref-gui-row">
          <span>padding-left</span>
          <input class="css-ref-gui-slider" type="range" value="${v['padding-left']}" min="0" max="100" step="1" name="padding-left">
        </div>
        `
      }
      if (s >= 13) { // margin
        str += `<div class="css-ref-gui-row">
          <span>margin-top</span>
          <input class="css-ref-gui-slider" type="range" value="${v['margin-top']}" min="0" max="100" step="1" name="margin-top">
        </div>
        <div class="css-ref-gui-row">
          <span>margin-right</span>
          <input class="css-ref-gui-slider" type="range" value="${v['margin-right']}" min="0" max="100" step="1" name="margin-right">
        </div>
        <div class="css-ref-gui-row">
          <span>margin-bottom</span>
          <input class="css-ref-gui-slider" type="range" value="${v['margin-bottom']}" min="0" max="100" step="1" name="margin-bottom">
        </div>
        <div class="css-ref-gui-row">
          <span>margin-left</span>
          <input class="css-ref-gui-slider" type="range" value="${v['margin-left']}" min="0" max="100" step="1" name="margin-left">
        </div>
        `
      }
      if (s >= 11) { // border
        str += `<div class="css-ref-gui-row">
          <span>border-width</span>
          <input class="css-ref-gui-slider" type="range" value="${v['border-width']}" min="0" max="100" step="1" name="border-width">
        </div>
        <div class="css-ref-gui-row">
          <span>border-style</span><select value="${v['border-style']}" name="border-style">${bso}</select>
        </div>
        <div class="css-ref-gui-row">
          <span>border-color</span><select name="border-color">${opts}</select>
        </div>
        `
      }
      str += `<div class="css-ref-gui-row">
          <span>width</span>
          <input class="css-ref-gui-slider" type="range" value="${v.width}" min="0" max="1000" step="1" name="width">
        </div>
        <div class="css-ref-gui-row">
          <span>height</span>
          <input class="css-ref-gui-slider" type="range" value="${v.height}" min="0" max="1000" step="1" name="height">
        </div>
      </section>`
    }
    if (s >= 9) { // color
      str += `<section class="css-ref-gui-box">
        <label>color</label>
        <div class="css-ref-gui-row">
          <span>text</span>
          <select name="color">${opts}</select>
        </div>
        <div class="css-ref-gui-row">
          <span>background</span>
          <select name="background-color">${opts}</select>
        </div>
      </section>`
    }
    str += `<section class="css-ref-gui-box">
      <label>typography</label>
      <div class="css-ref-gui-row">
        <span>font-size</span>
        <input class="css-ref-gui-slider" type="range" value="${v['font-size']}" min="0" max="200" step="1" name="font-size">
      </div>
      <div class="css-ref-gui-row">
        <span>font-weight</span>
        <input class="css-ref-gui-slider" type="range" value="${v['font-weight']}" min="100" max="900" step="100" name="font-weight">
      </div>
      <div class="css-ref-gui-row">
        <span>font-family</span>
        <select name="font-family">
          <option value="sans-serif">sans-serif</option>
          <option value="serif">serif</option>
          <option value="monospace">monospace</option>
          <option value="fantasy">fantasy</option>
          <option value="cursive">cursive</option>
        </select>
      </div>
    </section>`
    return str
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

window.customElements.define('svg-css-presentation', SvgCssPresentation)
