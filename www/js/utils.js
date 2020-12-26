/* global WIDGETS, Maths, Convo, NNE */
window.utils = {

  get: (url, cb, text) => {
    window.fetch(url, { method: 'GET' })
      .then(res => {
        if (text) return res.text()
        else return res.json()
      })
      .then(res => cb(res))
      .catch(err => console.error(err))
  },

  post: (url, data, cb) => {
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      }
    }
    opts.body = data ? JSON.stringify(data) : undefined
    window.fetch(url, opts)
      .then(res => res.json())
      .then(res => { if (cb) cb(res) })
      .catch(err => console.error(err))
  },

  loadFile: (path, callback) => {
    const s = document.createElement('script')
    s.setAttribute('src', path)
    if (callback) s.onload = () => callback()
    document.body.appendChild(s)
  },

  customElementReady: (name) => {
    return document.createElement(name).constructor !== window.HTMLElement
  },

  closeTopMostWidget: () => {
    const wigs = Object.keys(WIDGETS)
      .filter(w => WIDGETS[w].opened)
      .sort((a, b) => Number(WIDGETS[b].zIndex) - Number(WIDGETS[a].zIndex))
    if (wigs[0]) WIDGETS[wigs[0]].close()
  },

  // Netitor related stuff
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  spotlighting: false,
  spotLightCode: (lines) => {
    const editorLines = document.querySelectorAll('.CodeMirror-code > div')
    if (typeof lines === 'number') lines = [lines - 1]
    else if (lines instanceof Array) lines = lines.map(n => n - 1)
    editorLines.forEach((d, i) => {
      d.style.transition = 'opacity var(--menu-fades-time) var(--sarah-ease)'
      if (!(lines instanceof Array)) setTimeout(() => { d.style.opacity = 1 })
      else if (!lines.includes(i)) setTimeout(() => { d.style.opacity = 0.25 })
      else setTimeout(() => { d.style.opacity = 1 })
    })
    if (lines instanceof Array && lines.length > 0) {
      window.utils.spotlighting = true
    } else window.utils.spotlighting = false
  },

  markErrors: (arr) => {
    NNE.marker(null)
    // TODO: include callback functions on markers that launch netnet convo
    // which explains they can launch the CodeReview widget to learn more
    arr.forEach(e => {
      if (e.type === 'warning') NNE.marker(e.line, 'yellow')
      else NNE.marker(e.line, 'red')
    })
  },

  // CSS related stuff
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  afterLayoutTransition: (callback) => {
    const prop = '--layout-transition-time'
    const de = document.documentElement
    let t = window.getComputedStyle(de).getPropertyValue(prop)
    const unit = t.includes('ms') ? 'ms' : 's'
    t = Number(t.substr(0, t.indexOf(unit)))
    if (unit === 's') t *= 1000
    setTimeout(() => { callback() }, t + 100) // little extra to avoid bugs
  },

  getVal: (prop) => { // get value of a CSS variable
    const de = document.documentElement
    const t = window.getComputedStyle(de).getPropertyValue(prop)
    return t.includes('ms') ? parseInt(t) : t.includes('s')
      ? parseInt(t) * 1000 : t
  },

  // apply an object of CSS declarations to an element's styles
  css: (ele, obj) => { for (const key in obj) ele.style[key] = obj[key] },

  updateShadow: (e, ele, o) => {
    const opac = (typeof o === 'undefined') ? 0.75 : o
    const center = {
      x: ele.getBoundingClientRect().left,
      y: ele.getBoundingClientRect().top
    }
    const x = e.clientX < center.x
      ? Maths.map(e.clientX, 0, center.x, 33, 0)
      : Maths.map(e.clientX, center.x, window.innerWidth, 0, -33)
    const y = e.clientY < center.y
      ? Maths.map(e.clientY, 0, center.y, 33, 0)
      : Maths.map(e.clientY, center.y, window.innerHeight, 0, -33)
    ele.style.boxShadow = `${x}px ${y}px 33px -9px rgba(0, 0, 0, ${opac})`
  },

  selecting: (bool) => {
    if (bool) {
      document.body.style.userSelect = 'auto'
      document.body.style.webkitUserSelect = 'auto'
    } else {
      document.body.style.userSelect = 'none'
      document.body.style.webkitUserSelect = 'none'
    }
  },

  // dev testing utilities
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  testConvo: (convoName) => {
    convoName = convoName || 'example-convo'
    Convo.load(convoName, () => {
      const convoArray = window.CONVOS[convoName]()
      const convoInstance = new Convo(convoArray)
      console.log(convoInstance)
    })
  },

  testWidget: (opts) => {
    opts = (typeof opts === 'object') ? opts : {}
    if (!opts.key) opts.key = `test-${Date.now()}`
    if (!opts.innerHTML) opts.innerHTML = '<p> Hello! This is a test :) </p>'
    const wig = WIDGETS.create(opts)
    wig.open()
    return wig
  }
}
