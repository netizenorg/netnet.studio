/* global NNE, STORE, Maths, WIDGETS, Convo */
window.convos = {}
window.utils = {

  get: function (url, cb, text) {
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
      .then(res => cb(res))
      .catch(err => console.error(err))
  },

  loadWidgetClass: (path, filename) => {
    window.utils.get('api/widgets', (res) => {
      const s = document.createElement('script')
      s.setAttribute('src', `${path}/${filename}`)
      s.onload = () => {
        const className = filename.split('.')[0]
        const widget = new window[className]()
        if (widget.key) {
          const data = {}
          data[widget.key] = widget
          STORE.dispatch('LOAD_WIDGETS', data)
        } else {
          // NOTE: the widget class itself has been injected into the page,
          // but it has not been instantiated because it was missing it's key.
          // the ommission of the key may be don intentionally if this
          // widget is meant to be instantiated elsewhere later.
        }
      }
      document.body.appendChild(s)
    })
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
    if (data.sha) ls.setItem('index-sha', data.sha)
    if (data.url) ls.setItem('project-url', data.url)
    if (data.code) {
      // for some reason GitHub adds a '\n' at the end of the base64 string?
      const c = (data.code.indexOf('\n') === data.code.length - 1)
        ? data.code.substr(0, data.code.length - 1) : data.code
      ls.setItem('last-commit-code', c)
    }
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

  updateShadow: (e, self) => {
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

  keepWidgetsInFrame: () => {
    STORE.state.widgets.forEach(w => {
      const maxLeft = window.innerWidth - w.ref.ele.offsetWidth
      const maxTop = window.innerHeight - w.ref.ele.offsetHeight
      if (w.ref.ele.offsetLeft > maxLeft) {
        w.ref.update({ right: 20 })
      } else if (w.ref.ele.offsetTop > maxTop) {
        w.ref.update({ bottom: 20 })
      }
    })
  },

  closeTopMostWidget: () => {
    const arr = []
    const W = WIDGETS
    for (const w in W) if (W[w].opened) arr.push(W[w])
    arr.sort((a, b) => parseFloat(b.z) - parseFloat(a.z))
    if (arr[0]) arr[0].close()
  },

  // ~ ~ ~ misc && main.js helpers

  windowResize: () => {
    window.NNW._resizeWindow({
      clientX: window.NNW.win.offsetWidth,
      clientY: window.NNW.win.offsetHeight
    })
  },

  localSave: () => {
    if (STORE.is('SHOWING_ERROR')) {
      window.convo = new Convo({
        content: 'I want to avoid saving any buggy code, fix the issue I noticed before trying to save it again, or ask me to ignore this particular issue if you don\'t want me to keep bugging you about it.'
      })
    } else {
      window.localStorage.setItem('code', NNE._encode(NNE.code))
      if (NNE.autoUpdate) {
        const m = 'Ok, I\'ll remember this sketch for you, in case you decide to leave the studio and come back later and want to keep working on it.'
        const n = 'Of course, but you\'ll need to use the <code>saveProject()</code> function for that. Click on my face to open the <b>Functions Menu</b> &gt; <b>my project</b>'
        const a = { ok: (e) => e.hide() }
        const b = Object.assign({ 'can I save this to my GitHub?': (e) => e.goTo('gh') }, a)
        let cnt
        if (window.localStorage.getItem('owner')) {
          cnt = [{ content: m, options: b }, { id: 'gh', content: n, options: a }]
        } else {
          cnt = [{ content: m, options: a }]
        }
        window.convo = new Convo(cnt)
      }
    }
  },

  savedCode: () => {
    const code = window.localStorage.getItem('code')
    if (code !== NNE._encode(window.greetings.getStarterCode()) &&
    code !== 'eJyzUXTxdw6JDHBVyCjJzbEDACErBIk=' &&
    code !== 'eJyzUXTxdw6JDHBVyCjJzbHjAgAlvgST') return code
    else return false
  },

  netitorUpdate: () => {
    // HACK: for some reason, sometimes the netitor doesn't reflect
    // the actual the current code in it's value, but reassigning it does
    window.NNW._whenCSSTransitionFinished(() => {
      NNE.code = NNE.cm.getValue()
    })
  },

  _libs: [],
  checkForLibs: (type, err) => {
    if (type === 'aframe') return window.utils.checkAframeEnv(err)
  },

  url: {
    shortCode: new URL(window.location).searchParams.get('c'),
    tutorial: new URL(window.location).searchParams.get('tutorial'),
    opacity: new URL(window.location).searchParams.get('opacity'),
    layout: new URL(window.location).searchParams.get('layout'),
    theme: new URL(window.location).searchParams.get('theme')
  },

  // ~ ~ ~ 3rd party lib helpers

  checkAframeEnv: (err) => {
    function done (e) {
      e.hide()
      // show the convo netnet tried to show before this func consumed it
      const last = window._lastConvo
      if (last === 'save') { // go here via save >> GH redirect
        const obj = WIDGETS['functions-menu'].convos['create-new-project']
        window.convo = new Convo(obj)
      } else if (last === 'open') { // go here via open >> GH redirect
        WIDGETS['saved-projects'].open()
      } else if (last && window.greetings.convos) {
        // go here via 'i want to sketch' in welcome screen
        window.convo = new Convo(window.greetings.convos, last)
      }
    }
    if (window.utils._libs.includes('aframe')) return
    if (NNE.code.includes('aframe.js"') ||
      NNE.code.includes('aframe.min.js"')) {
      window.convo = new Convo({
        content: 'It appears you\'re using the <a href="https://aframe.io/" target="_blank">A-Frame</a> library, would you like me to load the A-Frame widgets, helpers and Error exceptions?',
        options: {
          'yes, that be great!': (e) => {
            window.utils.setupAframeEnv()
            done(e)
          },
          'no, you\'re mistaken.': (e) => done(e)
        }
      })
      return true
    } else if (err.message.indexOf('<a-') === 0) {
      window.convo = new Convo([{
        content: 'It appears you\'re trying to use a custom element from the <a href="https://aframe.io/" target="_blank">A-Frame</a> library, but the library is not present in your code? You must <a href="https://aframe.io/docs/1.0.0/introduction/installation.html#include-the-js-build" target="_blank">include it in a script tag</a>',
        options: {
          'ok I will': (e) => done(e),
          'could you include it for me?': (e) => e.goTo('include')
        }
      }, {
        id: 'include',
        content: 'Sure, place your cursor at the place in my editor where you would like me to insert the code. Let me know when you\'re ready.',
        options: {
          'ok, ready!': (e) => {
            NNE.cm.replaceSelection('<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>')
            done(e)
          }
        }
      }])
      return true
    }
  },

  setupAframeEnv: () => {
    window.utils.get('api/data/aframe', (data) => {
      NNE.addCustomElements(data.elements)
      NNE.addCustomAttributes(data.attributes)
      WIDGETS['aframe-component-widget'].listed = true
      for (const attr in data.attributes) {
        NNE.addErrorException(`{"rule":{"id":"attr-whitespace","description":"All attributes should be separated by only one space and not have leading/trailing whitespace.","link":"https://github.com/thedaviddias/HTMLHint/wiki/attr-whitespace"},"message":"The attributes of [ ${attr} ] must be separated by only one space."}`)
        NNE.addErrorException(`{"rule":{"id":"attr-value-not-empty","description":"All attributes must have values.","link":"https://github.com/thedaviddias/HTMLHint/wiki/attr-value-not-empty"},"message":"The attribute [ ${attr} ] must have a value."}`)
      }
    })
    window.utils._libs.push('aframe')
  }

}
