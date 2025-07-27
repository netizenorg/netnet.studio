/* global Extwee, panzoom */
// TODO: enable/disable shortcut keys (don't force them by default)
class QuiltGraph {
  constructor (options) {
    if (typeof options === 'string') {
      options = { container: options }
    }

    this.container = options.container

    this.cardSize = options.cardSize || 97
    this.gridSize = options.stepSize || 25
    this.curveIntensity = options.curveIntensity || 0.15
    this.connectionColor = options.connectionColor || '#666'
    if (typeof options.gridColor === 'number') {
      this.gridColor = { h: options.gridColor, s: 90, l: 90, a: 1 }
    } else if (typeof options.gridColor === 'object') {
      this.gridColor = {
        h: options.gridColor.hue || 212,
        s: options.gridColor.saturation || 90,
        l: options.gridColor.lightness || 90,
        a: options.gridColor.alpha || 1
      }
    } else {
      this.gridColor = { h: 212, s: 90, l: 90, a: 1 }
    }

    this.data = options.data || []
    this.connections = []
    this.cards = {}

    this.filename = null

    this.minZoom = (options.minCardSize || 8) / this.cardSize
    this.maxZoom = (options.maxCardSize || this.cardSize) / this.cardSize
    this.zoomSpeed = 0.01 // pinch to zoom

    this.events = {
      open: [],
      new: [],
      delete: [],
      selected: [],
      unselected: [],
      dblclick: []
    }

    this.initMenu(options.menu)
    this.init()
  }

  init () {
    this.initContainer()
    this.createContentLayer()
    this.createSVG()
    this.createDefinitions()
    this.setupPanzoom()
    this.initSelection()
    this.update()
  }

  update () {
    this.connections = []
    this.createCards()
    this.updateConnectionsData(this.data)
    this.updateConnections()
  }

  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖ GRAPH + VIEW CREATION ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖

  initMenu (opts) {
    if (opts && opts.zoom) {
      const el = typeof opts.zoom === 'string'
        ? document.querySelector(opts.zoom)
        : opts.zoom
      if (!el) {
        throw new Error(`Zoom slider '${opts.zoom}' not found`)
      }
      this.slider = el
      this.slider.min = this.minZoom
      this.slider.max = this.maxZoom
      this.slider.step = 0.01
      this.slider.value = this.minZoom

      this.slider.addEventListener('input', e => {
        this.setZoom(parseFloat(e.target.value))
      })
    }

    if (opts && opts.new) {
      document.querySelector(opts.new)
        .addEventListener('click', () => this.newPassage())
    }

    if (opts && opts.delete) {
      document.querySelector(opts.delete)
        .addEventListener('click', () => {
          const ps = this.getSelectedPassages()
          if (ps) ps.forEach(p => this.deletePassage(p.id))
        })
    }

    if (opts && opts.open) {
      document.querySelector(opts.open)
        .addEventListener('click', () => this.open())
    }

    if (opts && opts.save) {
      document.querySelector(opts.save)
        .addEventListener('click', () => this.save())
    }

    // window.addEventListener('keydown', (e) => {
    //   const selected = this.getSelectedPassages()
    //   if (e.key === 'Backspace' && selected) {
    //     selected.forEach(p => this.deletePassage(p.id))
    //   }
    // })
  }

  initContainer () {
    let c = document.querySelector(this.container)
    if (!c) c = document.getElementById(this.container)
    if (!c) throw new Error(`No element with "${this.container}" id or other selector found`)
    this.container = c
    Object.assign(c.style, {
      position: 'relative',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    })

    this.container.addEventListener('wheel', e => {
      // prevent Mac "swipe back" function
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) e.preventDefault()
    }, { passive: false, capture: true })

    this.container.addEventListener('mousedown', e => {
      if (!e.target.classList.contains('selected')) {
        document.querySelectorAll('.quilt-card').forEach(ele => {
          ele.classList.remove('selected')
          this.emit('unselected', this.getPassageByCard(ele))
        })
      }
    })
  }

  createContentLayer () {
    this.content = document.createElement('div')
    // make it big enough that at minZoom it still fills the container
    const pct = 100 / this.minZoom
    Object.assign(this.content.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: `${pct}%`,
      height: `${pct}%`,
      transformOrigin: '0 0',
      zIndex: 1,
      // backgroundImage: 'url(graph-paper-light.svg)',
      backgroundRepeat: 'repeat',
      backgroundSize: '100px 100px'
    })
    this.updateGridColor()
    this.container.appendChild(this.content)
  }

  createSVG () {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    this.svg.id = 'connections'
    Object.assign(this.svg.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: '0'
    })

    this.content.appendChild(this.svg)
  }

  createDefinitions () {
    const ns = 'http://www.w3.org/2000/svg'
    const defs = document.createElementNS(ns, 'defs')

    const arrows = [
      { id: '__QG-connection-arrow-end', orient: 'auto', d: 'M1,1 L7,4 L1,7 Z' },
      { id: '__QG-connection-arrow-start', orient: 'auto-start-reverse', d: 'M1,1 L7,4 L1,7 Z' }
    ]

    arrows.forEach(obj => {
      const marker = document.createElementNS(ns, 'marker')
      marker.setAttribute('id', obj.id)
      Object.entries({
        viewBox: '0 0 8 8',
        refX: '6',
        refY: '4',
        markerWidth: '8',
        markerHeight: '8',
        orient: obj.orient
      }).forEach(([k, v]) => marker.setAttribute(k, v))
      const pathEnd = document.createElementNS(ns, 'path')
      Object.entries({ d: obj.d, fill: this.connectionColor || '#666' })
        .forEach(([k, v]) => pathEnd.setAttribute(k, v))
      marker.appendChild(pathEnd)
      defs.appendChild(marker)
    })

    this.svg.appendChild(defs)
  }

  createCards () {
    this.data.forEach(data => {
      const id = data.id
      const el = document.createElement('div')
      el.id = `card${id}`
      el.textContent = data.name || `Card ${id}`
      el.classList.add('quilt-card')
      el.style.setProperty('--card-size', `${this.cardSize}px`)

      if (data.text) {
        const p = document.createElement('p')
        p.textContent = data.text
        p.style.pointerEvents = 'none'
        el.appendChild(p)
      } else {
        el.classList.add('temp-card')
      }

      const baseX = data.x != null ? data.x : this.gridSize * id
      const baseY = data.y != null ? data.y : this.gridSize * id
      const x = Math.round(baseX / this.gridSize) * this.gridSize
      const y = Math.round(baseY / this.gridSize) * this.gridSize
      el.style.left = `${x}px`
      el.style.top = `${y}px`

      this.content.appendChild(el)
      this.cards[id] = el
      this.makeDraggable(el, data)

      if (data.connections) this.connections.push({ from: id, to: data.connections })
    })
  }

  makeDraggable (el) {
    let offsetX = 0
    let offsetY = 0
    let isGroup = false
    let groupInfo = null

    const onMouseDown = e => {
      // compute pointer→content coords
      const { scale, x: panX, y: panY } = this.panzoom.getTransform()
      const cr = this.container.getBoundingClientRect()
      const cx = (e.clientX - cr.left - panX) / scale
      const cy = (e.clientY - cr.top - panY) / scale

      // decide single vs group
      let selectedEls = Array.from(document.querySelectorAll('.quilt-card.selected'))
      if (!selectedEls.includes(el)) {
        document.querySelectorAll('.quilt-card').forEach(c => {
          c.classList.remove('selected')
          this.emit('unselected', this.getPassageByCard(c))
        })
        el.classList.add('selected')
        this.emit('selected', this.getPassageByCard(el))
        selectedEls = [el]
      }
      isGroup = selectedEls.length > 1
      // store group start positions
      const masterStart = { el, x: el.offsetLeft, y: el.offsetTop }
      const others = selectedEls
        .filter(c => c !== el)
        .map(c => ({ el: c, x: c.offsetLeft, y: c.offsetTop }))
      groupInfo = { masterStart, others }

      offsetX = cx - el.offsetLeft
      offsetY = cy - el.offsetTop

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = e => {
      const { scale, x: panX, y: panY } = this.panzoom.getTransform()
      const cr = this.container.getBoundingClientRect()
      const cx = (e.clientX - cr.left - panX) / scale
      const cy = (e.clientY - cr.top - panY) / scale

      // snapped master coords
      const rawX = cx - offsetX
      const rawY = cy - offsetY
      let mx = Math.round(rawX / this.gridSize) * this.gridSize
      let my = Math.round(rawY / this.gridSize) * this.gridSize
      const maxX = this.content.clientWidth - this.cardSize
      const maxY = this.content.clientHeight - this.cardSize
      mx = Math.min(Math.max(0, mx), maxX)
      my = Math.min(Math.max(0, my), maxY)

      if (isGroup) {
        // delta from master
        const dx = mx - groupInfo.masterStart.x
        const dy = my - groupInfo.masterStart.y

        // update master data + DOM
        const masterId = parseInt(el.id.replace('card', ''))
        const master = this.getPassageById(masterId)
        master.x = mx
        master.y = my
        el.style.left = mx + 'px'
        el.style.top = my + 'px'

        // update others data + DOM
        groupInfo.others.forEach(item => {
          const id = parseInt(item.el.id.replace('card', ''))
          const p = this.getPassageById(id)
          const nx = Math.min(Math.max(0, item.x + dx), maxX)
          const ny = Math.min(Math.max(0, item.y + dy), maxY)
          p.x = nx
          p.y = ny
          item.el.style.left = nx + 'px'
          item.el.style.top = ny + 'px'
        })

        this.updateConnections()
        return
      }

      // single-card move
      const id = parseInt(el.id.replace('card', ''))
      const p = this.getPassageById(id)
      p.x = mx
      p.y = my
      el.style.left = mx + 'px'
      el.style.top = my + 'px'
      this.updateConnections()
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    el.addEventListener('mousedown', onMouseDown)
    const p = this.getPassageByCard(el)
    el.addEventListener('dblclick', () => this.emit('dblclick', p))
  }

  initSelection () {
    this.selectionBox = document.createElement('div')
    this.selectionBox.classList.add('selection-box')
    Object.assign(this.selectionBox.style, {
      position: 'absolute',
      border: '1px dashed #999',
      background: 'rgba(200,200,200,0.2)',
      display: 'none',
      pointerEvents: 'none',
      zIndex: 2
    })
    this.container.appendChild(this.selectionBox)
    this.container.addEventListener('mousedown', this.onSelectionStart.bind(this))
  }

  onSelectionStart (e) {
    // only start if you clicked the background, not a card
    if (e.target.closest('.quilt-card')) return
    e.preventDefault()
    this.isSelecting = true
    const rect = this.container.getBoundingClientRect()
    this.selStartX = e.clientX - rect.left
    this.selStartY = e.clientY - rect.top
    Object.assign(this.selectionBox.style, {
      left: this.selStartX + 'px',
      top: this.selStartY + 'px',
      width: '0px',
      height: '0px',
      display: 'block'
    })
    this.onSelMove = this.onSelectionMove.bind(this)
    this.onSelEnd = this.onSelectionEnd.bind(this)
    document.addEventListener('mousemove', this.onSelMove)
    document.addEventListener('mouseup', this.onSelEnd)
  }

  onSelectionMove (e) {
    if (!this.isSelecting) return
    const rect = this.container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const x0 = Math.min(this.selStartX, x)
    const y0 = Math.min(this.selStartY, y)
    const w = Math.abs(x - this.selStartX)
    const h = Math.abs(y - this.selStartY)
    Object.assign(this.selectionBox.style, {
      left: x0 + 'px',
      top: y0 + 'px',
      width: w + 'px',
      height: h + 'px'
    })
    const box = { left: x0, top: y0, right: x0 + w, bottom: y0 + h }
    document.querySelectorAll('.quilt-card').forEach(card => {
      const cr = card.getBoundingClientRect()
      const cx = cr.left - rect.left
      const cy = cr.top - rect.top
      const cw = cr.width
      const ch = cr.height
      const hit = !(cx > box.right || cx + cw < box.left || cy > box.bottom || cy + ch < box.top)
      if (hit) {
        card.classList.add('selected')
      } else {
        card.classList.remove('selected')
        this.emit('unselected', this.getPassageByCard(card))
      }
    })
  }

  onSelectionEnd (e) {
    this.isSelecting = false
    this.selectionBox.style.display = 'none'
    Array.from(document.querySelectorAll('.selected')).forEach(card => {
      this.emit('selected', this.getPassageByCard(card))
    })
    document.removeEventListener('mousemove', this.onSelMove)
    document.removeEventListener('mouseup', this.onSelEnd)
  }

  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖ PAN / ZOOM ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖

  setupPanzoom () {
    this.panzoom = panzoom(this.content, {
      minZoom: this.minZoom,
      maxZoom: this.maxZoom,
      bounds: false,
      boundsPadding: 0,
      beforeMouseDown: () => true,
      beforeWheel: () => true,
      initialZoom: this.minZoom,
      initialX: 0,
      initialY: 0
    })

    this.content.addEventListener('wheel', e => {
      const { scale } = this.panzoom.getTransform()
      // pinch‐to‐zoom (ctrl + trackpad)
      if (e.ctrlKey) {
        e.preventDefault()
        const factor = 1 - e.deltaY * this.zoomSpeed
        const targetScale = scale * factor
        const selected = this.getSelectedPassages()
        if (selected && selected.length) this.zoomToSelected(targetScale)
        else this.setZoom(targetScale)
        return
      }
      // normal two-finger scroll ⇒ pan
      if (scale <= this.minZoom) return
      e.preventDefault()
      this.panzoom.moveBy(-e.deltaX, -e.deltaY)
    }, { passive: false })

    this.panzoom.on('transform', () => {
      this._clampPanzoom()
      this.updateConnections()
      if (this.slider) { this.slider.value = this.panzoom.getTransform().scale }
    })

    this.content.addEventListener('wheel', e => {
      const { scale } = this.panzoom.getTransform()
      if (e.ctrlKey || scale <= this.minZoom) return
      e.preventDefault()
      this.panzoom.moveBy(-e.deltaX, -e.deltaY)
    }, { passive: false })
  }

  _clampPanzoom () {
    const { scale, x, y } = this.panzoom.getTransform()
    const { width, height } = this.container.getBoundingClientRect()
    const baseW = width / this.minZoom
    const baseH = height / this.minZoom
    const effW = baseW * scale
    const effH = baseH * scale
    const minX = width - effW
    const minY = height - effH
    const cx = Math.min(0, Math.max(minX, x))
    const cy = Math.min(0, Math.max(minY, y))
    if (cx !== x || cy !== y) this.panzoom.moveTo(cx, cy)
  }

  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖ CONNECTION METHODS ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖

  drawSelfLoop (id) {
    const a = this.cards[id]
    if (!a) return
    const { scale, x: panX, y: panY } = this.panzoom.getTransform()
    const cont = this.container.getBoundingClientRect()
    const rect = a.getBoundingClientRect()
    const cx = (rect.left + rect.width / 2 - cont.left - panX) / scale
    const cy = (rect.top + rect.height / 2 - cont.top - panY) / scale

    // tweak radius / offset as desired
    const r = 40
    const startX = cx
    const startY = cy
    const endX = cx
    const endY = cy - 50

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', `M${startX},${startY} A${r},${r} 0 1 1 ${endX},${endY}`)
    path.setAttribute('fill', 'none')
    path.setAttribute('stroke', this.connectionColor || '#666')
    path.setAttribute('stroke-width', '2')
    // use the “start” marker so the arrowhead is at the loop’s tip
    path.setAttribute('marker-end', 'url(#__QG-connection-arrow-start)')
    this.svg.appendChild(path)
  }

  updateConnections () {
    const { scale, x: panX, y: panY } = this.panzoom.getTransform()
    // remove old paths
    Array.from(this.svg.querySelectorAll('path')).forEach(p => {
      if (
        p.parentElement.id !== '__QG-connection-arrow-end' &&
        p.parentElement.id !== '__QG-connection-arrow-start'
      ) p.remove()
    })

    // dedupe reciprocal links into edges
    const edges = []
    this.connections.forEach(conn => {
      const from = conn.from
      const toList = Array.isArray(conn.to) ? conn.to : [conn.to]
      toList.forEach(to => {
        if (to === from) {
          edges.push({ from, to, self: true })
          return
        }
        const isReciprocal = this.connections.some(c => {
          if (c.from !== to) return false
          return Array.isArray(c.to) ? c.to.includes(from) : c.to === from
        })
        if (isReciprocal) {
          if (from < to) edges.push({ from, to, bidirectional: true })
        } else {
          edges.push({ from, to, bidirectional: false })
        }
      })
    })

    // draw each edge
    edges.forEach(edge => {
      if (edge.self || edge.from === edge.to) {
        this.drawSelfLoop(edge.from)
        return
      }

      const a = this.cards[edge.from]
      const b = this.cards[edge.to]
      if (!a || !b) return

      const rectA = a.getBoundingClientRect()
      const rectB = b.getBoundingClientRect()
      const cont = this.container.getBoundingClientRect()

      // true centers
      const centerAX = (rectA.left + rectA.width / 2 - cont.left - panX) / scale
      const centerAY = (rectA.top + rectA.height / 2 - cont.top - panY) / scale
      const centerBX = (rectB.left + rectB.width / 2 - cont.left - panX) / scale
      const centerBY = (rectB.top + rectB.height / 2 - cont.top - panY) / scale

      // line vector
      const dxRaw = centerBX - centerAX
      const dyRaw = centerBY - centerAY

      // intersection factor
      const hw = this.cardSize / 2
      const hh = hw
      const t = Math.min(hw / Math.abs(dxRaw) || Infinity, hh / Math.abs(dyRaw) || Infinity)

      // edge points
      const x1 = centerAX + dxRaw * t
      const y1 = centerAY + dyRaw * t
      const x2 = centerBX - dxRaw * t
      const y2 = centerBY - dyRaw * t

      // curve control
      const dx = x2 - x1
      const dy = y2 - y1
      const dist = Math.hypot(dx, dy)
      const dr = dist * this.curveIntensity
      const sign = dxRaw <= 0 ? 1 : -1
      const px = -dy / dist * dr * sign
      const py = dx / dist * dr * sign
      const cx1 = x1 + dx * 0.3 + px
      const cy1 = y1 + dy * 0.3 + py
      const cx2 = x1 + dx * 0.7 + px
      const cy2 = y1 + dy * 0.7 + py

      // draw path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`)
      path.setAttribute('fill', 'none')
      path.setAttribute('stroke', this.connectionColor || '#666')
      path.setAttribute('stroke-width', '2')
      if (edge.bidirectional) {
        path.setAttribute('marker-start', 'url(#__QG-connection-arrow-start)')
        path.setAttribute('marker-end', 'url(#__QG-connection-arrow-end)')
      } else {
        path.setAttribute('marker-end', 'url(#__QG-connection-arrow-end)')
      }

      this.svg.appendChild(path)
    })
  }

  updateConnectionsData (passages) {
    this.connections = []
    passages.forEach(obj => {
      const links = this.parsePassageLinks(obj)
      const from = this.getPassageById(obj.id)
      from.connections = []
      const connection = { from: from.id, to: [] }
      links.forEach(lnk => {
        const targ = this.getPassageByName(lnk.target)
        if (targ && !from.connections.includes(targ.id)) {
          connection.to.push(targ.id)
          from.connections.push(targ.id)
        }
      })
      this.connections.push(connection)
    })
    this.updateConnections()
  }
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖ PUBLIC METHODS ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖

  // -------------------------------------------------------------- Passage Data
  getPassageByName (name) {
    return this.data.find(obj => obj.name === name)
  }

  getPassageById (id) {
    return this.data.find(obj => obj.id === id)
  }

  getPassageByCard (el) {
    const pid = parseInt(el.id.split('card')[1])
    return this.getPassageById(pid)
  }

  getSelectedPassages () {
    const cards = Array.from(document.querySelectorAll('.quilt-card.selected'))
    if (cards.length === 0) return null
    return cards.map(ele => {
      const id = parseInt(ele.id.split('card')[1])
      return this.getPassageById(id)
    })
  }

  parsePassageLinks (obj) {
    const text = obj.text
    const regex = /\[\[([^\]]+?)\]\]/g
    const links = []
    let match
    while ((match = regex.exec(text)) !== null) {
      const inner = match[1].trim()
      const [label, target] = inner.split('->').map(s => s.trim())
      links.push({ label, target: target || label })
    }
    return links
  }

  updatePassage (id, data) {
    // clear old cards && connections
    document.querySelectorAll('.quilt-card').forEach(e => e.remove())
    const passage = this.getPassageById(id)
    if (typeof data.name === 'string') passage.name = data.name
    if (typeof data.text === 'string') passage.text = data.text
    if (typeof data.x === 'number') passage.x = data.x
    if (typeof data.y === 'number') passage.y = data.y
    this.update()
  }

  newPassage (name, text, x, y) {
    const id = this.data.length > 0
      ? Math.max(...this.data.map(d => d.id)) + 1
      : 1
    name = name || 'untitled'
    text = text != null ? text : null
    if (x == null || y == null) {
      const { scale, x: panX, y: panY } = this.panzoom.getTransform()
      const contRect = this.container.getBoundingClientRect()
      const viewLeft = -panX / scale
      const viewTop = -panY / scale
      const viewHeight = contRect.height / scale
      const centerY = viewTop + viewHeight / 2
      const candidateX = viewLeft + this.gridSize
      let newX = Math.round(candidateX / this.gridSize) * this.gridSize
      const newY = Math.round(centerY / this.gridSize) * this.gridSize
      const taken = new Set(this.data.map(d => `${d.x},${d.y}`))
      while (taken.has(`${newX},${newY}`)) {
        newX += this.gridSize
      }
      x = newX
      y = newY
    }

    const passage = { id, name, text, x, y, connections: [] }
    this.data.push(passage)
    document.querySelectorAll('.quilt-card').forEach(e => e.remove())
    this.update()
    this.emit('new', passage)
    return passage
  }

  deletePassage (identifier) {
    let passage
    if (typeof identifier === 'number') {
      passage = this.getPassageById(identifier)
    } else {
      passage = this.getPassageByName(identifier)
    }
    if (!passage) {
      console.warn('No passage found for', identifier)
      return
    }
    const idToRemove = passage.id
    const copyPassage = JSON.parse(JSON.stringify(passage))
    this.data = this.data.filter(obj => obj.id !== idToRemove)
    document.querySelectorAll('.quilt-card').forEach(e => e.remove())
    this.update()
    this.emit('delete', copyPassage)
  }

  on (eve, cb) {
    if (!this.events[eve]) { this.events[eve] = [] }
    this.events[eve].push(cb)
  }

  emit (eve, data) {
    if (this.events[eve] instanceof Array) {
      this.events[eve].forEach((cb, i) => {
        data.unsubscribe = () => { this.events[eve].splice(i, 1) }
        cb(data)
      })
    }
  }

  // ------------------------------------------------------------------------ UI

  setZoom (z) {
    z = Math.min(this.maxZoom, Math.max(this.minZoom, z))
    const { x, y } = this.panzoom.getTransform()
    this.panzoom.zoomAbs(x, y, z)
    this._clampPanzoom()
    if (this.slider) this.slider.value = z
  }

  zoomToSelected (scaleOverride) {
    const selected = this.getSelectedPassages()
    if (!selected || selected.length === 0) return

    // pick first selected passage
    const passage = selected[0]
    const el = this.cards[passage.id]
    const containerRect = this.container.getBoundingClientRect()
    const centerX = containerRect.width / 2
    const centerY = containerRect.height / 2

    // figure out new scale
    const cur = this.panzoom.getTransform().scale
    const target = scaleOverride != null
      ? scaleOverride
      : cur
    const z = Math.min(this.maxZoom, Math.max(this.minZoom, target))

    // compute content‐coords of the card center
    const cx = el.offsetLeft + this.cardSize / 2
    const cy = el.offsetTop + this.cardSize / 2

    // pan so that (cx,cy)×z lands at the screen‐center
    const x = centerX - cx * z
    const y = centerY - cy * z

    // apply zoom & pan
    this.panzoom.zoomAbs(0, 0, z)
    this.panzoom.moveTo(x, y)

    if (this.slider) this.slider.value = z
    this.updateConnections()
  }

  updateGridColor (h, s, l, a, s1, s2) {
    h = typeof h === 'number' ? h : this.gridColor.h
    s = typeof s === 'number' ? s : this.gridColor.s
    l = typeof l === 'number' ? l : this.gridColor.l
    a = typeof a === 'number' ? a : this.gridColor.a || 1
    const l2 = l - 10 > 0 ? l - 10 : 0

    s1 = typeof s1 === 'number' ? s1 : 1
    s2 = typeof s2 === 'number' ? s2 : 2

    const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg width="100" height="100" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <line x1="25" y1="0" x2="25" y2="100" style="stroke:hsla(${h}, ${s}%, ${l}%, ${a});stroke-width:${s1}"/>
      <line x1="50" y1="0" x2="50" y2="100" style="stroke:hsla(${h}, ${s}%, ${l}%, ${a});stroke-width:${s1}"/>
      <line x1="75" y1="0" x2="75" y2="100" style="stroke:hsla(${h}, ${s}%, ${l}%, ${a});stroke-width:${s1}"/>
      <line x1="0" y1="25" x2="100" y2="25" style="stroke:hsla(${h}, ${s}%, ${l}%, ${a});stroke-width:${s1}"/>
      <line x1="0" y1="50" x2="100" y2="50" style="stroke:hsla(${h}, ${s}%, ${l}%, ${a});stroke-width:${s1}"/>
      <line x1="0" y1="75" x2="100" y2="75" style="stroke:hsla(${h}, ${s}%, ${l}%, ${a});stroke-width:${s1}"/>
      <line x1="0" y1="100" x2="100" y2="100" style="stroke:hsla(${h}, ${s}%, ${l2}%, ${a});stroke-width:${s2}"/>
      <line x1="100" y1="0" x2="100" y2="100" style="stroke:hsla(${h}, ${s}%, ${l2}%, ${a});stroke-width:${s2}"/>
    </svg>`
    const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22')
    this.content.style.backgroundImage = `url("data:image/svg+xml;charset=UTF-8,${encoded}")`
    this.gridColor = { h, s, l, a }
  }

  // ------------------------------------------------------- OPEN / SAVE Project

  loadJSON (json) { // NOTE: this is specifically twison data
    if (this.data.length > 0) {
      const check = window.confirm('You currently have a story open, are you sure you want to open a new one? Any unsaved changes will be lost.')
      if (!check) return
    }

    // clear old cards && connections
    document.querySelectorAll('.quilt-card').forEach(e => e.remove())
    // parse passage data
    const passages = json.passages.map((p, i) => {
      const { x, y } = p.position
      return { id: Number(p.pid), name: p.name, text: p.text, x, y }
    })
    this.data = passages
    this.update()
    this.emit('open', { type: 'json', passages })
  }

  loadTwee (txt) {
    if (this.data.length > 0) {
      const check = window.confirm('You currently have a story open, are you sure you want to open a new one? Any unsaved changes will be lost.')
      if (!check) return
    }
    // clear old cards && connections
    document.querySelectorAll('.quilt-card').forEach(e => e.remove())
    // parse twee data
    const story = Extwee.parseTwee(txt)
    const passages = story.passages.map((p, i) => {
      const pos = p.metadata.position.split(',').map(p => Number(p))
      return { id: i + 1, name: p.name, text: p.text, x: pos[0], y: pos[1] }
    })

    this.data = passages
    this.update()
    this.emit('open', { type: 'twee', passages })
  }

  open () {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.twee,.json'
    input.style.display = 'none'

    input.addEventListener('change', async e => {
      const file = e.target.files[0]
      if (!file) return

      this.filename = file.name.split('.')[0]

      const ext = file.name.split('.').pop().toLowerCase()
      const text = await file.text()

      if (ext === 'json') {
        let data
        try {
          data = JSON.parse(text)
        } catch (err) {
          console.error('Invalid JSON file', err)
          return
        }
        // handle the parsed JSON object
        this.loadJSON(data)
      } else if (ext === 'twee') {
        // handle the raw Twee text
        this.loadTwee(text)
      } else {
        console.warn('Unsupported file type:', ext)
      }

      // clean up
      document.body.removeChild(input)
    })

    document.body.appendChild(input)
    input.click()
  }

  save () {
    const regex = /\[\[([^\]]+?)\]\]/g
    const passages = this.data.map(obj => {
      const links = []
      let match
      while ((match = regex.exec(obj.text)) !== null) {
        const inner = match[1].trim()
        const [label, target] = inner.split('->').map(s => s.trim())
        links.push({
          name: label,
          link: target || label
        })
      }
      return {
        text: obj.text,
        links,
        name: obj.name,
        pid: String(obj.id),
        position: {
          x: String(obj.x),
          y: String(obj.y)
        }
      }
    })
    const data = { passages }
    const str = JSON.stringify(data, null, 2)
    const blob = new window.Blob([str], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${this.filename}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // -------------------------------------------------- EVALUATION + CORRECTIONS

  clearEmptyPassages () {
    document.querySelectorAll('.temp-card').forEach(temp => {
      const p = this.getPassageByCard(temp)
      const a = this.data.filter(c => c.connections.includes(p.id))
      if (a.length === 0) {
        const idx = this.data.indexOf(p)
        this.data.splice(idx, 1)
        temp.remove()
      }
    })
  }

  createMissingPassages (passage) {
    const createLinkCard = (from, lnk) => {
      const b = Math.round((this.cardSize + this.gridSize) / this.gridSize) * this.gridSize
      const x = from.x + (from.connections.length * b)
      const y = from.y + b
      this.newPassage(lnk.target, null, x, y)
    }

    const checkPassage = (obj) => {
      const links = this.parsePassageLinks(obj)
      const from = this.getPassageById(obj.id)
      links.forEach(lnk => {
        const p = this.getPassageByName(lnk.target)
        if (!p) createLinkCard(from, lnk)
      })
    }

    if (passage) checkPassage(passage)
    else this.data.forEach(checkPassage)
  }

  evaluate () {
    const report = {
      deadendPassages: [],
      deadends: [],
      empty: [],
      badNames: []
    }

    // cache all passage names for quick lookup
    const names = this.data.map(p => p.name)
    const badName = (n) => n === 'untitled' || n === 'Untitled Passage' || n === 'null' || !n

    this.data.forEach(p => {
      if (!p.text) report.empty.push(p)
      if (badName(p.name)) report.badNames.push(p)

      const links = this.parsePassageLinks(p)
      // find any targets that don't exist
      const bad = links.filter(l => !names.includes(l.target))
      if (bad.length) {
        report.deadendPassages.push(p)
        report.deadends.push(...bad.map(l => l.target))
      }
    })

    return report
  }
}

window.QuiltGraph = QuiltGraph
