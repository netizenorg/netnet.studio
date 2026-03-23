/* global Widget, Convo, Netitor, NNE, utils */
class VectorGraphics extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'vector-graphics'
    this.keywords = ['svg', 'code', 'maker', 'gui', 'illustrator', 'vector', 'shapes']
    this.title = 'Vector Graphics'
    this.width = 701

    this.state = {
      width: 300,
      height: 300,
      fill: 'none',
      stroke: utils.getVal('--netizen-attribute'),
      strokeWidth: 10,
      strokeLinecap: 'butt',
      strokeLinejoin: 'miter',
      shape: 'circle',
      x1: 100,
      x2: 200,
      y1: 100,
      y2: 200,
      // circle defaults
      cx: 150,
      cy: 150,
      r: 60,
      // rectangle defaults
      rectX: 80,
      rectY: 80,
      rectW: 120,
      rectH: 90
    }

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
    this._createHTML()

    this.editor = new Netitor({
      ele: '.vector-graphics__code',
      renderWithErrors: true,
      background: NNE.background,
      autoUpdate: false,
      hint: false,
      lint: false,
      readOnly: true,
      theme: NNE.theme,
      language: 'html',
      code: ''
    })

    this._updateSVG()
  }

  _updateSVG () {
    const baseSvg = this._createSVG()
    this.editor.code = baseSvg

    // augment display-only SVG with draggable control points
    const s = this.state
    let handles
    const VISIBLE = this._forceHandles ? 'visible' : ''
    if (s.shape === 'circle') {
      const strokeOn = this.$('[name="stroke-toggle"]').checked
      const strokeExt = strokeOn ? (Number(this.$('[name="stroke-width"]').value) / 2) : 0
      const hx = s.cx + s.r + strokeExt
      const hy = s.cy
      handles = `\n  <g class="vg-handles ${VISIBLE}" pointer-events="all">\n    <circle class="vg-handle-bg" data-for="p1" cx="${s.cx}" cy="${s.cy}" r="12"/>\n    <text data-handle="p1" class="vg-handle" x="${s.cx}" y="${s.cy}" dominant-baseline="middle" text-anchor="middle">⊕</text>\n    <circle class="vg-handle-bg" data-for="p2" cx="${hx}" cy="${hy}" r="12"/>\n    <text data-handle="p2" class="vg-handle" x="${hx}" y="${hy}" dominant-baseline="middle" text-anchor="middle">⊕</text>\n  </g>`
    } else if (s.shape === 'rectangle') {
      const strokeOn = this.$('[name="stroke-toggle"]').checked
      const strokeExt = strokeOn ? (Number(this.$('[name="stroke-width"]').value) / 2) : 0
      const hx = s.rectX + s.rectW + strokeExt
      const hy = s.rectY + (s.rectH / 2)
      const vx = s.rectX + (s.rectW / 2)
      const vy = s.rectY + s.rectH + strokeExt
      handles = `\n  <g class="vg-handles ${VISIBLE}" pointer-events="all">\n    <circle class="vg-handle-bg" data-for="p1" cx="${s.rectX}" cy="${s.rectY}" r="12"/>\n    <text data-handle="p1" class="vg-handle" x="${s.rectX}" y="${s.rectY}" dominant-baseline="middle" text-anchor="middle">⊕</text>\n    <circle class="vg-handle-bg" data-for="p2" cx="${hx}" cy="${hy}" r="12"/>\n    <text data-handle="p2" class="vg-handle" x="${hx}" y="${hy}" dominant-baseline="middle" text-anchor="middle">⊕</text>\n    <circle class="vg-handle-bg" data-for="p3" cx="${vx}" cy="${vy}" r="12"/>\n    <text data-handle="p3" class="vg-handle" x="${vx}" y="${vy}" dominant-baseline="middle" text-anchor="middle">⊕</text>\n  </g>`
    } else {
      handles = `\n  <g class="vg-handles ${VISIBLE}" pointer-events="all">\n    <circle class="vg-handle-bg" data-for="p1" cx="${s.x1}" cy="${s.y1}" r="12"/>\n    <text data-handle="p1" class="vg-handle" x="${s.x1}" y="${s.y1}" dominant-baseline="middle" text-anchor="middle">⊕</text>\n    <circle class="vg-handle-bg" data-for="p2" cx="${s.x2}" cy="${s.y2}" r="12"/>\n    <text data-handle="p2" class="vg-handle" x="${s.x2}" y="${s.y2}" dominant-baseline="middle" text-anchor="middle">⊕</text>\n  </g>`
    }
    const displaySvg = baseSvg.replace('</svg>', `${handles}\n</svg>`)
    this.$('.vector-graphics__svg').innerHTML = displaySvg
    this._attachHandleEvents()
  }

  _createSVG () {
    const s = this.state
    let svg = `<svg width="${s.width}" height="${s.height}">`

    const writeStrokeAndFill = () => {
      let attrs = ''
      // stroke
      if (this.$('[name="stroke-toggle"]').checked) {
        this.state.stroke = this.$('[name="stroke-color"]').value
        this.state.strokeWidth = Number(this.$('[name="stroke-width"]').value)
        this.state.strokeLinecap = this.$('[name="stroke-linecap"]').value
        this.state.strokeLinejoin = this.$('[name="stroke-linejoin"]').value
        attrs += `stroke="${this.state.stroke}"\n    stroke-width="${this.state.strokeWidth}"`
        if (this.state.strokeLinecap !== 'butt') {
          attrs += `\n    stroke-linecap="${this.state.strokeLinecap}"`
        }
        if (this.state.strokeLinejoin !== 'miter') {
          attrs += `\n    stroke-linejoin="${this.state.strokeLinejoin}"`
        }
      } else {
        this.state.stroke = 'none'
        attrs += 'stroke="none"'
      }
      // fill
      if (this.$('[name="fill-toggle"]').checked) {
        this.state.fill = this.$('[name="fill-color"]').value
        attrs += `\n    fill="${this.state.fill}"`
      } else {
        this.state.fill = 'none'
        attrs += '\n    fill="none"'
      }
      return attrs
    }

    if (s.shape === 'circle') {
      svg += `\n\t<circle\n    cx="${s.cx}"\n    cy="${s.cy}"\n    r="${s.r}"\n    `
      svg += writeStrokeAndFill()
      svg += '/>'
    } else if (s.shape === 'rectangle') {
      const x = s.rectX
      const y = s.rectY
      const w = Math.max(0, s.rectW)
      const h = Math.max(0, s.rectH)
      svg += `\n\t<rect\n    x="${x}"\n    y="${y}"\n    width="${w}"\n    height="${h}"\n    `
      svg += writeStrokeAndFill()
      svg += '/>'
    } else { // default to line
      svg += `\n\t<line\n    x1="${s.x1}"\n    y1="${s.y1}"\n    x2="${s.x2}"\n    y2="${s.y2}"\n    `
      svg += writeStrokeAndFill()
      svg += '/>'
    }

    svg += '\n</svg>'
    return svg
  }

  _enableFill () {

  }

  _enableStroke () {}

  _attachHandleEvents () {
    const svgEl = this.$('.vector-graphics__svg svg')
    if (!svgEl) return
    const p1 = svgEl.querySelector('text[data-handle="p1"]')
    const p2 = svgEl.querySelector('text[data-handle="p2"]')
    const p3 = svgEl.querySelector('text[data-handle="p3"]')
    const b1 = svgEl.querySelector('circle.vg-handle-bg[data-for="p1"]')
    const b2 = svgEl.querySelector('circle.vg-handle-bg[data-for="p2"]')
    const b3 = svgEl.querySelector('circle.vg-handle-bg[data-for="p3"]')
    const line = svgEl.querySelector('line')
    const circ = svgEl.querySelector('circle:not([data-handle])')
    const rect = svgEl.querySelector('rect')
    if (!p1 || !p2 || (!line && !circ && !rect)) return

    // indicate draggability
    p1.style.cursor = 'grab'
    p2.style.cursor = 'grab'
    if (p3) p3.style.cursor = 'grab'

    // if circle, normalize handle positions based on center and stroke width
    if (this.state.shape === 'circle' && circ) {
      const strokeOn = this.$('[name="stroke-toggle"]').checked
      const strokeExt = strokeOn ? (Number(this.$('[name="stroke-width"]').value) / 2) : 0
      p1.setAttribute('x', this.state.cx)
      p1.setAttribute('y', this.state.cy)
      if (b1) { b1.setAttribute('cx', this.state.cx); b1.setAttribute('cy', this.state.cy) }
      p2.setAttribute('x', this.state.cx + this.state.r + strokeExt)
      p2.setAttribute('y', this.state.cy)
      if (b2) { b2.setAttribute('cx', this.state.cx + this.state.r + strokeExt); b2.setAttribute('cy', this.state.cy) }
    } else if (this.state.shape === 'rectangle' && rect) {
      const strokeOn = this.$('[name="stroke-toggle"]').checked
      const strokeExt = strokeOn ? (Number(this.$('[name="stroke-width"]').value) / 2) : 0
      p1.setAttribute('x', this.state.rectX)
      p1.setAttribute('y', this.state.rectY)
      if (b1) { b1.setAttribute('cx', this.state.rectX); b1.setAttribute('cy', this.state.rectY) }
      // width handle at center of right border
      p2.setAttribute('x', this.state.rectX + this.state.rectW + strokeExt)
      p2.setAttribute('y', this.state.rectY + (this.state.rectH / 2))
      if (b2) { b2.setAttribute('cx', this.state.rectX + this.state.rectW + strokeExt); b2.setAttribute('cy', this.state.rectY + (this.state.rectH / 2)) }
      // height handle at center of bottom border
      if (p3) {
        p3.setAttribute('x', this.state.rectX + (this.state.rectW / 2))
        p3.setAttribute('y', this.state.rectY + this.state.rectH + strokeExt)
        if (b3) { b3.setAttribute('cx', this.state.rectX + (this.state.rectW / 2)); b3.setAttribute('cy', this.state.rectY + this.state.rectH + strokeExt) }
      }
    }

    const onPointerMove = (e) => {
      if (!this._dragHandle) return
      const { x, y } = this._clientToSvgCoords(e, svgEl)
      if (x == null || y == null) return
      if (this.state.shape === 'circle' && circ) {
        const strokeOn = this.$('[name="stroke-toggle"]').checked
        const strokeExt = strokeOn ? (Number(this.$('[name="stroke-width"]').value) / 2) : 0
        if (this._dragHandle === 'p1') {
          this.state.cx = Math.round(x)
          this.state.cy = Math.round(y)
          circ.setAttribute('cx', this.state.cx)
          circ.setAttribute('cy', this.state.cy)
          p1.setAttribute('x', this.state.cx)
          p1.setAttribute('y', this.state.cy)
          // update radius handle to remain on right edge
          p2.setAttribute('x', this.state.cx + this.state.r + strokeExt)
          p2.setAttribute('y', this.state.cy)
          if (b1) { b1.setAttribute('cx', this.state.cx); b1.setAttribute('cy', this.state.cy) }
          if (b2) { b2.setAttribute('cx', this.state.cx + this.state.r + strokeExt); b2.setAttribute('cy', this.state.cy) }
        } else if (this._dragHandle === 'p2') {
          const dx = x - this.state.cx
          const dy = y - this.state.cy
          const rr = Math.max(0, Math.round(Math.hypot(dx, dy) - strokeExt))
          this.state.r = rr
          circ.setAttribute('r', this.state.r)
          // lock handle to right edge of circle
          p2.setAttribute('x', this.state.cx + this.state.r + strokeExt)
          p2.setAttribute('y', this.state.cy)
          if (b2) { b2.setAttribute('cx', this.state.cx + this.state.r + strokeExt); b2.setAttribute('cy', this.state.cy) }
        }
      } else if (this.state.shape === 'rectangle' && rect) {
        const strokeOn = this.$('[name="stroke-toggle"]').checked
        const strokeExt = strokeOn ? (Number(this.$('[name="stroke-width"]').value) / 2) : 0
        if (this._dragHandle === 'p1') {
          this.state.rectX = Math.round(x)
          this.state.rectY = Math.round(y)
          rect.setAttribute('x', this.state.rectX)
          rect.setAttribute('y', this.state.rectY)
          p1.setAttribute('x', this.state.rectX)
          p1.setAttribute('y', this.state.rectY)
          if (b1) { b1.setAttribute('cx', this.state.rectX); b1.setAttribute('cy', this.state.rectY) }
          // update width/height handles centered on sides
          p2.setAttribute('x', this.state.rectX + this.state.rectW + strokeExt)
          p2.setAttribute('y', this.state.rectY + (this.state.rectH / 2))
          if (b2) { b2.setAttribute('cx', this.state.rectX + this.state.rectW + strokeExt); b2.setAttribute('cy', this.state.rectY + (this.state.rectH / 2)) }
          if (p3) {
            p3.setAttribute('x', this.state.rectX + (this.state.rectW / 2))
            p3.setAttribute('y', this.state.rectY + this.state.rectH + strokeExt)
            if (b3) { b3.setAttribute('cx', this.state.rectX + (this.state.rectW / 2)); b3.setAttribute('cy', this.state.rectY + this.state.rectH + strokeExt) }
          }
        } else if (this._dragHandle === 'p2') {
          // adjust width, keep handle centered on right border
          const w = Math.max(0, Math.round(x - strokeExt - this.state.rectX))
          this.state.rectW = w
          rect.setAttribute('width', this.state.rectW)
          p2.setAttribute('x', this.state.rectX + this.state.rectW + strokeExt)
          p2.setAttribute('y', this.state.rectY + (this.state.rectH / 2))
          if (b2) { b2.setAttribute('cx', this.state.rectX + this.state.rectW + strokeExt); b2.setAttribute('cy', this.state.rectY + (this.state.rectH / 2)) }
        } else if (this._dragHandle === 'p3') {
          // adjust height, keep handle centered on bottom border
          const h = Math.max(0, Math.round(y - strokeExt - this.state.rectY))
          this.state.rectH = h
          rect.setAttribute('height', this.state.rectH)
          if (p3) {
            p3.setAttribute('x', this.state.rectX + (this.state.rectW / 2))
            p3.setAttribute('y', this.state.rectY + this.state.rectH + strokeExt)
          }
          if (b3) { b3.setAttribute('cx', this.state.rectX + (this.state.rectW / 2)); b3.setAttribute('cy', this.state.rectY + this.state.rectH + strokeExt) }
        }
      } else if (line) {
        if (this._dragHandle === 'p1') {
          this.state.x1 = Math.round(x)
          this.state.y1 = Math.round(y)
          line.setAttribute('x1', this.state.x1)
          line.setAttribute('y1', this.state.y1)
          p1.setAttribute('x', this.state.x1)
          p1.setAttribute('y', this.state.y1)
          if (b1) { b1.setAttribute('cx', this.state.x1); b1.setAttribute('cy', this.state.y1) }
        } else if (this._dragHandle === 'p2') {
          this.state.x2 = Math.round(x)
          this.state.y2 = Math.round(y)
          line.setAttribute('x2', this.state.x2)
          line.setAttribute('y2', this.state.y2)
          p2.setAttribute('x', this.state.x2)
          p2.setAttribute('y', this.state.y2)
          if (b2) { b2.setAttribute('cx', this.state.x2); b2.setAttribute('cy', this.state.y2) }
        }
      }
      // update code as you drag (but do not re-render preview)
      this.editor.code = this._createSVG()
      e.preventDefault()
    }

    const stopDrag = (e) => {
      if (!this._dragHandle) return
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', stopDrag)
      window.removeEventListener('pointercancel', stopDrag)
      this._dragHandle = null
      // restore cursor on handles
      p1.style.cursor = 'grab'
      p2.style.cursor = 'grab'
    }

    const startDrag = (handle) => (e) => {
      this._dragHandle = handle
      e.preventDefault()
      try { e.target.setPointerCapture(e.pointerId) } catch {}
      // show grabbing cursor while dragging
      e.target.style.cursor = 'grabbing'
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', stopDrag)
      window.addEventListener('pointercancel', stopDrag)
    }

    p1.addEventListener('pointerdown', startDrag('p1'))
    p2.addEventListener('pointerdown', startDrag('p2'))
    if (p3) p3.addEventListener('pointerdown', startDrag('p3'))
  }

  _clientToSvgCoords (e, svgEl) {
    const rect = svgEl.getBoundingClientRect()
    const s = this.state
    const x = ((e.clientX - rect.left) / rect.width) * s.width
    const y = ((e.clientY - rect.top) / rect.height) * s.height
    const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
    const cx = clamp(x, 0, s.width)
    const cy = clamp(y, 0, s.height)
    if (Number.isNaN(cx) || Number.isNaN(cy)) return { x: null, y: null }
    return { x: cx, y: cy }
  }

  // Public method: animate state changes or defer to Widget.update
  async action (...args) {
    // dispatch to Widget.update if not called with (fromObj, toObj, duration)
    if (!(args.length === 3 && typeof args[0] === 'object' && typeof args[1] === 'object' && typeof args[2] === 'number')) {
      return super.update(...args)
    }

    const [from, to, duration] = args
    // cancel any in-flight animation
    if (this._animId) {
      window.cancelAnimationFrame(this._animId)
      this._animId = null
    }

    // derive start/end values for provided keys
    const keys = Array.from(new Set([...Object.keys(from || {}), ...Object.keys(to || {})]))
    const start = {}
    const end = {}
    keys.forEach(k => {
      const cur = this.state[k]
      start[k] = (from && typeof from[k] === 'number') ? from[k] : (typeof cur === 'number' ? cur : 0)
      end[k] = (to && typeof to[k] === 'number') ? to[k] : start[k]
    })

    // force control handles visible during animation
    this._forceHandles = true
    this._updateSVG()

    const svgEl = this.$('.vector-graphics__svg svg')
    const line = svgEl ? svgEl.querySelector('line') : null
    const circ = svgEl ? svgEl.querySelector('circle:not([data-handle])') : null
    const rect = svgEl ? svgEl.querySelector('rect') : null

    const p1 = svgEl ? svgEl.querySelector('text[data-handle="p1"]') : null
    const p2 = svgEl ? svgEl.querySelector('text[data-handle="p2"]') : null
    const p3 = svgEl ? svgEl.querySelector('text[data-handle="p3"]') : null
    const b1 = svgEl ? svgEl.querySelector('circle.vg-handle-bg[data-for="p1"]') : null
    const b2 = svgEl ? svgEl.querySelector('circle.vg-handle-bg[data-for="p2"]') : null
    const b3 = svgEl ? svgEl.querySelector('circle.vg-handle-bg[data-for="p3"]') : null

    const startTime = window.performance.now()
    const dur = Math.max(0, duration || 0)

    const tick = (now) => {
      const t = dur === 0 ? 1 : Math.min(1, (now - startTime) / dur)
      // lerp and assign
      keys.forEach(k => {
        const v = start[k] + (end[k] - start[k]) * t
        this.state[k] = Math.round(v)
      })

      // update code (kept live)
      this.editor.code = this._createSVG()

      // update preview shape + handles minimally without full re-render
      const strokeOn = this.$('[name="stroke-toggle"]').checked
      const strokeExt = strokeOn ? (Number(this.$('[name="stroke-width"]').value) / 2) : 0
      if (this.state.shape === 'circle' && circ && p1 && p2) {
        circ.setAttribute('cx', this.state.cx)
        circ.setAttribute('cy', this.state.cy)
        circ.setAttribute('r', this.state.r)
        p1.setAttribute('x', this.state.cx); p1.setAttribute('y', this.state.cy)
        if (b1) { b1.setAttribute('cx', this.state.cx); b1.setAttribute('cy', this.state.cy) }
        const hx = this.state.cx + this.state.r + strokeExt
        p2.setAttribute('x', hx); p2.setAttribute('y', this.state.cy)
        if (b2) { b2.setAttribute('cx', hx); b2.setAttribute('cy', this.state.cy) }
      } else if (this.state.shape === 'rectangle' && rect && p1 && p2) {
        rect.setAttribute('x', this.state.rectX)
        rect.setAttribute('y', this.state.rectY)
        rect.setAttribute('width', Math.max(0, this.state.rectW))
        rect.setAttribute('height', Math.max(0, this.state.rectH))
        p1.setAttribute('x', this.state.rectX); p1.setAttribute('y', this.state.rectY)
        if (b1) { b1.setAttribute('cx', this.state.rectX); b1.setAttribute('cy', this.state.rectY) }
        const hx = this.state.rectX + this.state.rectW + strokeExt
        const hy = this.state.rectY + (this.state.rectH / 2)
        p2.setAttribute('x', hx); p2.setAttribute('y', hy)
        if (b2) { b2.setAttribute('cx', hx); b2.setAttribute('cy', hy) }
        if (p3) {
          const vx = this.state.rectX + (this.state.rectW / 2)
          const vy = this.state.rectY + this.state.rectH + strokeExt
          p3.setAttribute('x', vx); p3.setAttribute('y', vy)
          if (b3) { b3.setAttribute('cx', vx); b3.setAttribute('cy', vy) }
        }
      } else if (this.state.shape === 'line' && line && p1 && p2) {
        line.setAttribute('x1', this.state.x1)
        line.setAttribute('y1', this.state.y1)
        line.setAttribute('x2', this.state.x2)
        line.setAttribute('y2', this.state.y2)
        p1.setAttribute('x', this.state.x1); p1.setAttribute('y', this.state.y1)
        if (b1) { b1.setAttribute('cx', this.state.x1); b1.setAttribute('cy', this.state.y1) }
        p2.setAttribute('x', this.state.x2); p2.setAttribute('y', this.state.y2)
        if (b2) { b2.setAttribute('cx', this.state.x2); b2.setAttribute('cy', this.state.y2) }
      }

      if (t < 1) {
        this._animId = window.requestAnimationFrame(tick)
      } else {
        this._animId = null
        // allow handles to hide again after animation (unless hovering)
        this._forceHandles = false
        this._updateSVG()
      }
    }

    this._animId = window.requestAnimationFrame(tick)
  }

  _createHTML () {
    this.innerHTML = `
      <div class="vector-graphics">
        <div class="vector-graphics__menu">
          <button class="pill-btn pill-btn--secondary" name="line">╲</button>
          <button class="pill-btn pill-btn--secondary" name="circle">○</button>
          <button class="pill-btn pill-btn--secondary" name="rectangle">□</button>
          <!-- <button class="pill-btn pill-btn--secondary" name="polyline">polyline</button>
          <button class="pill-btn pill-btn--secondary" name="polygon">polygon</button>
          <button class="pill-btn pill-btn--secondary" name="text">text</button> -->
        </div>
        <div class="vector-graphics__views">
          <div class="vector-graphics__code">
            <!-- <div class="code-copy-overlay">copied SVG code to clipboard and downloaded SVG file</div> -->
            <div class="code-copy-overlay">Use the GUI on the right to edit this code</div>
          </div>
          <div class="vector-graphics__svg"></div>
        </div>
        <div class="vector-graphics__styling">
          <span name="fill-block" style="opacity: 0.25">
            <span style="font-weight: bold">fill</span>
            <input type="checkbox" name="fill-toggle">
            <input type="color" name="fill-color" value="${utils.getVal('--netizen-number')}">
          </span>
          <span name="stroke-block" >
            <span style="font-weight: bold">stroke</span>
            <input type="checkbox" name="stroke-toggle" checked="true">
            <input type="color" name="stroke-color" value="${this.state.stroke}">
            <input type="number" name="stroke-width" class="pill-btn pill-btn--secondary" value="${this.state.strokeWidth}">
            <span>cap</span>
            <select name="stroke-linecap">
              <option value="butt">butt</option>
              <option value="round">round</option>
              <option value="square">square</option>
            </select>
            <span>join</span>
            <select name="stroke-linejoin">
              <option value="miter">miter</option>
              <option value="round">round</option>
              <option value="bevel">bevel</option>
            </select>
          </span>
        </div>
      </div>
    `

    this.$('[name="fill-block"] > span:nth-child(1)').addEventListener('click', (e) => {
      this.$('[name="fill-toggle"]').checked = !this.$('[name="fill-toggle"]').checked
      const val = this.$('[name="fill-toggle"]').checked
      if (val) this.$('[name="fill-block"]').style.opacity = 1
      else this.$('[name="fill-block"]').style.opacity = 0.25
      this._updateSVG()
    })

    this.$('[name="fill-toggle"]').addEventListener('change', (e) => {
      const val = e.target.checked
      if (val) this.$('[name="fill-block"]').style.opacity = 1
      else this.$('[name="fill-block"]').style.opacity = 0.25
      this._updateSVG()
    })

    this.$('[name="fill-color"]').addEventListener('input', (e) => this._updateSVG())

    // shape selection
    const setShape = (shape) => {
      this.state.shape = shape
      this._updateStylingVisibility()
      this._updateSVG()
    }
    this.$('button[name="line"]').addEventListener('click', () => setShape('line'))
    this.$('button[name="circle"]').addEventListener('click', () => setShape('circle'))
    this.$('button[name="rectangle"]').addEventListener('click', () => setShape('rectangle'))

    // stroke interactions (mirror fill behavior)
    this.$('[name="stroke-block"] > span:nth-child(1)').addEventListener('click', (e) => {
      this.$('[name="stroke-toggle"]').checked = !this.$('[name="stroke-toggle"]').checked
      const val = this.$('[name="stroke-toggle"]').checked
      this.$('[name="stroke-block"]').style.opacity = val ? 1 : 0.25
      this._updateSVG()
    })

    this.$('[name="stroke-toggle"]').addEventListener('change', (e) => {
      const val = e.target.checked
      this.$('[name="stroke-block"]').style.opacity = val ? 1 : 0.25
      this._updateSVG()
    })

    this.$('[name="stroke-color"]').addEventListener('input', () => this._updateSVG())
    this.$('[name="stroke-width"]').addEventListener('change', () => this._updateSVG())
    this.$('[name="stroke-linecap"]').addEventListener('change', () => this._updateSVG())
    this.$('[name="stroke-linejoin"]').addEventListener('change', () => this._updateSVG())

    // initialize visibility based on default shape
    this._updateStylingVisibility()

    // code copy overlay on click
    const codeBox = this.$('.vector-graphics__code')
    const overlay = codeBox.querySelector('.code-copy-overlay')
    codeBox.addEventListener('click', async () => {
      // show overlay
      overlay.classList.add('visible')
      setTimeout(() => overlay.classList.remove('visible'), 3000)

      // copy code
      const text = this.editor.code || ''
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text)
        } else {
          throw new Error('Clipboard API not available')
        }
      } catch (err) {
        // fallback
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        try { document.execCommand('copy') } catch {}
        document.body.removeChild(ta)
      }

      /*
      // also download SVG file
      try {
        const svgText = text
        if (svgText && typeof svgText === 'string') {
          const blob = new window.Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'vector-graphic.svg'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          setTimeout(() => URL.revokeObjectURL(url), 0)
        }
      } catch (e) {}
      */
    })
  }

  _updateStylingVisibility () {
    const shape = this.state.shape
    const fillBlock = this.$('[name="fill-block"]')
    const strokeBlock = this.$('[name="stroke-block"]')
    const capSelect = strokeBlock.querySelector('[name="stroke-linecap"]')
    const capLabel = capSelect ? capSelect.previousElementSibling : null
    const joinSelect = strokeBlock.querySelector('[name="stroke-linejoin"]')
    const joinLabel = joinSelect ? joinSelect.previousElementSibling : null

    // Fill: only for circle and rectangle
    const showFill = shape === 'circle' || shape === 'rectangle'
    fillBlock.style.display = showFill ? 'flex' : 'none'

    // Cap: only for line
    const showCap = shape === 'line'
    if (capSelect) capSelect.style.display = showCap ? 'inline-block' : 'none'
    if (capLabel) capLabel.style.display = showCap ? 'inline-block' : 'none'

    // Join: only for rectangle
    const showJoin = shape === 'rectangle'
    if (joinSelect) joinSelect.style.display = showJoin ? 'inline-block' : 'none'
    if (joinLabel) joinLabel.style.display = showJoin ? 'inline-block' : 'none'
  }
}

window.VectorGraphics = VectorGraphics
