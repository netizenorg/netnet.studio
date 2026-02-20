/* global nn */
const timeline = {
  mkrs: 'use[href^="#"][href$="-marker"], use[xlink\\:href^="#"][xlink\\:href$="-marker"]',
  scrubbing: false,
  onScrub: null,

  init: () => {
    const svg = nn.get('svg#timeline')
    const scrub = nn.get('#playhead-marker')

    const toSvgX = clientX => {
      const pt = svg.createSVGPoint()
      pt.x = clientX
      const { x } = pt.matrixTransform(svg.getScreenCTM().inverse())
      return Math.max(0, Math.min(100, x)) // clamp
    }

    const onMove = e => {
      if (!timeline.scrubbing) return
      e.preventDefault()
      const x = toSvgX(e.clientX)
      timeline.updatePlayhead(x)
      if (timeline.onScrub) timeline.onScrub(x)
    }

    const onUp = (e) => {
      if (!timeline.scrubbing) return
      timeline.scrubbing = false
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      const x = parseFloat(scrub.style.left) / nn.width * 100
      if (timeline.onScrub) timeline.onScrub(x)
    }

    // jump to timeline
    svg.addEventListener('click', (e) => {
      if (e.target !== svg) return // clicked a child element → ignore
      const x = toSvgX(e.clientX)
      timeline.updatePlayhead(x)
      if (timeline.onScrub) timeline.onScrub(x)
    })

    // scrub timeline
    scrub.addEventListener('pointerdown', e => {
      e.preventDefault()
      e.stopPropagation() // don’t trigger the svg background click
      timeline.scrubbing = true
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    })
    scrub.addEventListener('click', e => e.stopPropagation())

    timeline.updateMarkers()
    timeline.placeLabels()
    timeline.updatePlayhead(0)
  },

  updatePlayhead: (x) => {
    nn.get('#playhead-marker').css('left', nn.width * (x / 100))
    nn.get('svg #playhead').set('x1', x)
    nn.get('svg #playhead').set('x2', x)
  },

  placeLabels: () => {
    const svg = nn.get('svg#timeline')
    const vb = svg.viewBox.baseVal
    const sy = svg.clientHeight / vb.height
    nn.get('.labels > div:nth-child(1)').css({ top: 30 * sy })
    nn.get('.labels > div:nth-child(2)').css({ top: 60 * sy })
  },

  updateMarkers: () => {
    const svg = nn.get('svg#timeline')
    const vb = svg.viewBox.baseVal
    const sx = svg.clientWidth / vb.width
    const sy = svg.clientHeight / vb.height

    svg.querySelectorAll(timeline.mkrs).forEach(u => {
      const x = parseFloat(u.dataset.x || '0')
      const y = parseFloat(u.dataset.y || '0')
      const px = parseFloat(u.dataset.size || '8') // pixels
      // order: translate (last), size, counter-scale, rotate (first)
      const t = [
        `translate(${x} ${y})`,
        `scale(${px} ${px})`,
        `scale(${1 / sx} ${1 / sy})`,
        'rotate(45)'
      ].join(' ')

      u.setAttribute('transform', t)
    })
  },

  clearSelections: (a) => {
    const svg = nn.get('svg#timeline')
    svg.querySelectorAll(timeline.mkrs).forEach(u => {
      u.setAttribute('fill', 'var(--bg-color)')
    })
  },

  selectMarker: (e, callback) => {
    const u = e instanceof window.Element ? e : e.target
    if (!u) return
    const a = u.getAttribute('name').split('-')
    timeline.clearSelections(a)
    const fill = a[0] === 'keyframe' ? 'var(--netizen-tag)' : 'var(--netizen-attribute)'
    u.setAttribute('fill', fill)

    // if there's a sibling frame, keep that selected too
    const s = a[0] === 'keyframe' ? 'keylog' : 'keyframe'
    const c = s === 'keyframe' ? 'var(--netizen-tag)' : 'var(--netizen-attribute)'
    const sibling = nn.get('svg#timeline').querySelector(`[name="${s}-${a[1]}"]`)
    if (sibling) sibling.setAttribute('fill', c)

    if (callback) callback(e, parseFloat(a[1]))
  },

  createMarker: (x, t, type, callback) => {
    const svg = nn.get('svg#timeline')
    const SVG = 'http://www.w3.org/2000/svg'
    const XLINK = 'http://www.w3.org/1999/xlink'
    const y = type === 'keyframe' ? 30 : 60
    const u = document.createElementNS(SVG, 'use')
    u.setAttribute('href', `#${type}-marker`)
    u.setAttributeNS(XLINK, 'xlink:href', `#${type}-marker`)
    u.setAttribute('name', `${type}-${t}`)
    u.dataset.x = x
    u.dataset.y = y
    u.setAttribute('data-size', '8')
    svg.appendChild(u)
    // u.addEventListener('click', (e) => timeline.selectMarker(e, callback))
    if (callback) u.addEventListener('click', (e) => callback(t))
  },

  getAllMarkers: (type) => {
    const svg = nn.get('svg#timeline')
    let arr = [...svg.querySelectorAll(timeline.mkrs)]
    arr = arr.map(u => {
      const n = u.getAttribute('name').split('-')
      return { marker: u, type: n[0], timecode: parseFloat(n[1]) }
    })
    if (type === 'keyframes') {
      return arr.filter(o => o.type === 'keyframe')
    } else if (type === 'keylogs') {
      return arr.filter(o => o.type === 'keylog')
    } else {
      return arr
    }
  },

  getNextMarker: (time, type) => {
    const t = Number(time)
    const list = timeline.getAllMarkers(type)
      .slice()
      .sort((a, b) => Number(a.timecode) - Number(b.timecode))

    for (let i = 0; i < list.length; i++) {
      if (Number(list[i].timecode) > t) return list[i]
    }
    return null
  },

  getPrevMarker: (time, type) => {
    const t = Number(time)
    const list = timeline.getAllMarkers(type)
      .slice()
      .sort((a, b) => Number(a.timecode) - Number(b.timecode))

    for (let i = list.length - 1; i >= 0; i--) {
      if (Number(list[i].timecode) < t) return list[i]
    }
    return null
  },

  removeMarker: (time, type) => {
    const t = Number(time)
    const m = nn.get(`[name="${type}-${t}"]`)
    if (m) {
      m.remove()
      timeline.updateMarkers()
    } else {
      console.error(`Failed to remove marker. No Marker found for: ${time} seconds`)
    }
  }
}

window.timeline = timeline
