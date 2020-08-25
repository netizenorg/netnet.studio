/* global NNE, STORE, Maths */
window.convos = {}
window.utils = {

  get: function (url, cb) {
    window.fetch(url, { method: 'GET' })
      .then(res => res.json())
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
      .then(res => cb(res))
      .catch(err => console.error(err))
  },

  // ~ ~ ~ project data

  clearAllData: () => {
    window.localStorage.clear()
    window.utils.get('./api/clear-cookie', (res) => {
      window.location = window.location.origin
    })
  },

  clearProjectData: () => {
    window.localStorage.removeItem('opened-project')
    window.localStorage.removeItem('last-commit-msg')
    window.localStorage.removeItem('last-commit-code')
    window.localStorage.removeItem('index-sha')
    window.localStorage.removeItem('project-url')
    NNE.addCustomRoot(null)
  },

  setProjectData: (data) => {
    const ls = window.localStorage
    if (data.name) ls.setItem('opened-project', data.name)
    if (data.message) ls.setItem('last-commit-msg', data.message)
    if (data.code) ls.setItem('last-commit-code', data.code)
    if (data.sha) ls.setItem('index-sha', data.sha)
    if (data.url) ls.setItem('project-url', data.url)
  },

  updateRoot: () => {
    const owner = window.localStorage.getItem('owner')
    const repo = window.localStorage.getItem('opened-project')
    if (owner && repo) {
      const path = `https://raw.githubusercontent.com/${owner}/${repo}/master/`
      NNE.addCustomRoot(path)
    } else {
      NNE.addCustomRoot(null)
    }
  },

  // ~ ~ ~ widget helpers

  loadConvoData: (path, cb) => {
    const s = document.createElement('script')
    s.setAttribute('src', `convos/${path}/index.js`)
    s.setAttribute('type', 'text/javascript')
    s.onerror = (e) => { console.error(`loadConvo: failed to load ${path}`) }
    s.onload = () => { if (cb) cb() }
    document.body.appendChild(s)
  },

  processingFace: false,

  _runProcessingFace: () => {
    const face = window.NNM.getFace()
    if (face[0] === '☉') window.NNM.setFace('◉', '⌄', '☉')
    else if (face[0] === '◉') window.NNM.setFace('☉', '⌄', '◉')
    setTimeout(() => {
      if (window.utils.processingFace) window.utils._runProcessingFace()
      else window.NNM.setFace('◕', '◞', '◕')
    }, 250)
  },

  runProcessingFace: () => {
    window.NNM.setFace('☉', '⌄', '◉')
    window.utils.processingFace = true
    window.utils._runProcessingFace()
  },

  updateShadow (e, self) {
    if (STORE.state.theme === 'light') {
      self.ele.style.boxShadow = 'none'
      return
    } // no shadows for light theme
    const center = {
      x: self.ele.getBoundingClientRect().left,
      y: self.ele.getBoundingClientRect().top
    }
    const x = e.clientX < center.x
      ? Maths.map(e.clientX, 0, center.x, 33, 0)
      : Maths.map(e.clientX, center.x, window.innerWidth, 0, -33)
    const y = e.clientY < center.y
      ? Maths.map(e.clientY, 0, center.y, 33, 0)
      : Maths.map(e.clientY, center.y, window.innerHeight, 0, -33)
    self.ele.style.boxShadow = `${x}px ${y}px 33px -9px rgba(0, 0, 0, 0.75)`
  },

  // ~ ~ ~ main.js helpers

  openProjectPrompt: () => {
    const opened = window.localStorage.getItem('opened-project')
    if (opened) {
      window.utils.updateRoot()
      window.convo = new window.Convo({
        content: `Do you want to continue working on "${opened}"?`,
        options: {
          yes: (e) => e.hide(),
          'no, let\'s start a new project': () => {
            window.WIDGETS['functions-menu'].newProject()
          }
        }
      })
    }
  },

  handleLoginRedirect: () => {
    if (window.WIDGETS['functions-menu']) {
      const from = window.localStorage.getItem('pre-auth-from')
      window.localStorage.removeItem('pre-auth-from')
      if (from === 'save') window.WIDGETS['functions-menu'].saveProject()
      else if (from === 'open') window.WIDGETS['functions-menu'].openProject()
    } else setTimeout(window.utils.handleLoginRedirect, 250)
  },

  closeTopMostWidget: () => {
    const arr = []
    const W = window.WIDGETS
    for (const w in W) if (W[w].opened) arr.push(W[w])
    arr.sort((a, b) => parseFloat(b.z) - parseFloat(a.z))
    if (arr[0]) arr[0].close()
  }
}
