/* global HTMLElement, WIDGETS */
class SvgNeuralNet extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.nomotion = WIDGETS['student-session']?.getData('nomotion')
    this.nomotion = this.nomotion === 'true'
    this._setupListeners()
    this.updateHTML()
  }

  _setupListeners () {
    if (this._listenersSet) return
    WIDGETS['coding-menu'].on('motion-change', (data) => {
      this.nomotion = WIDGETS['student-session']?.getData('nomotion')
      this.nomotion = this.nomotion === 'true'
      this.updateHTML()
    })
    this._listenersSet = true
  }

  updateHTML () {
    const points = {
      input: [
        { x: 130, y: 60 },
        { x: 130, y: 140 },
        { x: 130, y: 220 }
      ],
      hidden: [
        { x: 350, y: 20 },
        { x: 350, y: 140 },
        { x: 350, y: 260 }
      ],
      output: [
        { x: 590, y: 80 },
        { x: 590, y: 200 }
      ]
    }

    const nodeRadius = 24
    const viewBox = this.getAttribute('viewbox') || '0 0 700 300'

    const edge = (id, from, to) => {
      return `<path id="${id}" d="M${from.x} ${from.y} L${to.x} ${to.y}" fill="none" stroke="${this.c[2]}" stroke-width="1.5" stroke-linecap="round"/>`
    }

    const node = (point) => {
      return `<circle cx="${point.x}" cy="${point.y}" r="${nodeRadius}" fill="${this.c[3]}" stroke="${this.c[0]}" stroke-width="2"/>`
    }

    const flowNumber = (value, pathId, dur, begin) => {
      if (this.nomotion) return ''

      return `
        <text font-family="fira-sans-regular, sans-serif" font-size="14" font-weight="700" fill="${this.c[0]}">${value}
          <animateMotion dur="${dur}" repeatCount="indefinite" begin="${begin}">
            <mpath href="#${pathId}"/>
          </animateMotion>
          <animate attributeName="opacity" values="0;1;1;0" dur="${dur}" repeatCount="indefinite" begin="${begin}"/>
        </text>
      `
    }

    const pulseRing = (point, begin) => {
      if (this.nomotion) return ''

      return `
        <circle cx="${point.x}" cy="${point.y}" r="${nodeRadius}" fill="none" stroke="${this.c[0]}" stroke-width="3" opacity="0.15">
          <animate attributeName="r" values="${nodeRadius};${nodeRadius + 6};${nodeRadius}" dur="1.8s" repeatCount="indefinite" begin="${begin}"/>
          <animate attributeName="opacity" values="0.15;0.35;0.15" dur="1.8s" repeatCount="indefinite" begin="${begin}"/>
        </circle>
      `
    }

    const edges = [
      edge('e1', points.input[0], points.hidden[0]),
      edge('e2', points.input[0], points.hidden[1]),
      edge('e3', points.input[0], points.hidden[2]),

      edge('e4', points.input[1], points.hidden[0]),
      edge('e5', points.input[1], points.hidden[1]),
      edge('e6', points.input[1], points.hidden[2]),

      edge('e7', points.input[2], points.hidden[0]),
      edge('e8', points.input[2], points.hidden[1]),
      edge('e9', points.input[2], points.hidden[2]),

      edge('e10', points.hidden[0], points.output[0]),
      edge('e11', points.hidden[0], points.output[1]),

      edge('e12', points.hidden[1], points.output[0]),
      edge('e13', points.hidden[1], points.output[1]),

      edge('e14', points.hidden[2], points.output[0]),
      edge('e15', points.hidden[2], points.output[1])
    ].join('')

    const nodes = [
      ...points.input.map(node),
      ...points.hidden.map(node),
      ...points.output.map(node)
    ].join('')

    const animatedNumbers = [
      flowNumber('0.8', 'e1', '2.4s', '0s'),
      flowNumber('0.5', 'e2', '2.4s', '0.2s'),
      flowNumber('0.2', 'e3', '2.4s', '0.4s'),
      flowNumber('0.9', 'e4', '2.4s', '0.3s'),
      flowNumber('0.6', 'e5', '2.4s', '0.5s'),
      flowNumber('0.3', 'e6', '2.4s', '0.7s'),
      flowNumber('0.7', 'e7', '2.4s', '0.6s'),
      flowNumber('0.4', 'e8', '2.4s', '0.8s'),
      flowNumber('0.1', 'e9', '2.4s', '1s'),

      flowNumber('1.2', 'e10', '2s', '1.1s'),
      flowNumber('0.8', 'e11', '2s', '1.3s'),
      flowNumber('1.5', 'e12', '2s', '1.4s'),
      flowNumber('1.0', 'e13', '2s', '1.6s'),
      flowNumber('0.9', 'e14', '2s', '1.7s'),
      flowNumber('1.3', 'e15', '2s', '1.9s')
    ].join('')

    const pulseRings = [
      pulseRing(points.input[0], '0s'),
      pulseRing(points.hidden[1], '0.8s'),
      pulseRing(points.output[0], '1.6s')
    ].join('')

    this.innerHTML = `<svg
      width="700"
      height="290"
      viewBox="${viewBox}"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      style="width:100%;margin:0 auto;display:block;">

      ${edges}
      ${nodes}
      ${animatedNumbers}
      ${pulseRings}
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
}

window.customElements.define('svg-neural-net', SvgNeuralNet)
