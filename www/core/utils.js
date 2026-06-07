/* global WIDGETS, nn, Convo, NNW, NNE  */
window.utils = {

  get: (url, cb, text, timeoutMs = 60000) => {
    // timeoutMs guards against silent hangs (slow network, stalled server) which
    // would otherwise leave callers (eg. loadGithub) waiting forever.
    const controller = new window.AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    window.fetch(url, { method: 'GET', signal: controller.signal })
      .then(res => {
        if (text) return res.text()
        else return res.json()
      })
      .then(res => cb(res))
      .catch(err => {
        console.error(err)
        const errObj = { success: false, error: err }
        if (cb) cb(errObj)
      })
      .finally(() => clearTimeout(timer))
  },

  post: (url, data, cb, timeoutMs = 60000) => {
    // timeoutMs guards against silent hangs (slow network, stalled server) which
    // would otherwise leave callers (eg. load-curtain) waiting forever.
    const controller = new window.AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    const opts = {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    }
    opts.body = data ? JSON.stringify(data) : undefined
    window.fetch(url, opts)
      .then(res => res.json())
      .then(res => { if (cb) cb(res) })
      .catch(err => {
        console.error(err)
        const errObj = { success: false, error: err }
        if (cb) cb(errObj)
      })
      .finally(() => clearTimeout(timer))
  },

  getSync: async (url, text = false, timeoutMs = 60000) => {
    const controller = new window.AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await window.fetch(url, { method: 'GET', signal: controller.signal })
      if (!res.ok) throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`)
      return text ? res.text() : res.json()
    } finally {
      clearTimeout(timer)
    }
  },

  postSync: async (url, data, text = false, timeoutMs = 60000) => {
    const controller = new window.AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await window.fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: data != null ? JSON.stringify(data) : undefined,
        signal: controller.signal
      })
      if (!res.ok) throw new Error(`POST ${url} failed: ${res.status} ${res.statusText}`)
      return text ? res.text() : res.json()
    } finally {
      clearTimeout(timer)
    }
  },

  btoa: (str) => {
    return window.btoa(unescape(encodeURIComponent(str)))
  },

  atob: (str) => {
    return decodeURIComponent(escape(window.atob(str)))
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
    const wigs = WIDGETS.list()
      .filter(w => w.opened)
      .sort((a, b) => Number(b.zIndex) - Number(a.zIndex))
    if (wigs[0]) wigs[0].close()
  },

  // NOTE: this is no longer in use (keeping it here in case we need it back)
  // was used in main.js > nn.on('resize') (but now handled in widget's 'resize')
  keepWidgetsInFrame: () => {
    WIDGETS.list().forEach(w => {
      const maxLeft = window.innerWidth - w.ele.offsetWidth
      const maxTop = window.innerHeight - w.ele.offsetHeight
      if (w.ele.offsetLeft > maxLeft) {
        w.update({ right: 20 })
      } else if (w.ele.offsetTop > maxTop) {
        w.update({ bottom: 20 })
      }
    })
  },

  isVisible: (el) => {
    const s = window.getComputedStyle(el)
    if (s.display === 'none' || s.visibility === 'hidden') return false
    if (el.offsetParent === null && s.position !== 'fixed') return false
    const isDisplayed = el.getClientRects().length > 0

    const r = el.getBoundingClientRect()
    const vw = window.innerWidth || document.documentElement.clientWidth
    const vh = window.innerHeight || document.documentElement.clientHeight
    const isVis = r.bottom > 0 && r.right > 0 && r.left < vw && r.top < vh

    return isVis && isDisplayed
  },

  windowResize: () => {
    NNW._resizeWindow({
      clientX: window.NNW.win.offsetWidth,
      clientY: window.NNW.win.offsetHeight
    })
  },

  starterCode: () => {
    const clr1 = window.utils.getVal('--fg-color')
    const clr2 = window.utils.getVal('--netizen-comment')
    // const clr3 = window.utils.getVal('--bg-color')
    const sc = `<!DOCTYPE html>
<!--
  ( ◕ ◞ ◕ )つ You've found a secret easter egg,
  this is the code for netnet's background!
  explore the code/comments below to better
  understand how it all works!
-->
<style>
  /* netnet default bg */
  body {
    position: relative;
    z-index: 1;

    height: 100vh;
    margin: 0;
    overflow: hidden;

    background-image:
      linear-gradient(${clr2}a8 2px, transparent 1px),
      linear-gradient(90deg, ${clr2}a8 2px, transparent 1px),
      linear-gradient(0deg, ${clr1}a8, ${clr2}a8);
    background-size:
      50px 50px,
      50px 50px,
      auto;
  }
</style>
<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js"></script>
<script>
  /* global nn */

  function updateBG (mouse) {
    if (reduceMotion() || window.nomotion) return
    const d = -33 // max amount to shift background
    const x = nn.map(mouse.x, 0, nn.width, 0, d)
    const y = nn.map(mouse.y, 0, nn.height, 0, d)
    const p = \`\${x}px \${y}px\`
    nn.get('body').css({
      backgroundPosition: \`\${p}, \${p}, 0 0\`
    })
  }

  function comms (e) {
    // listen for mouse movements on netnet's face/editor
    // and for changes to "reduce motion" setting in code menu
    const { type, data } = e.data
    if (type === 'netnet') {
      updateBG(data)
      if (typeof data.nomotion === 'string') {
        window.nomotion = data.nomotion === 'true'
      }
    }
  }

  function bgmovement (e) {
    // send mousemovments back up to netnet
    // '*' required: iframe may be sandboxed (null origin)
    window.top.postMessage({
      type: 'netnet-bg',
      data: { x: e.x, y: e.y }
    }, '*')
  }

  function reduceMotion () {
    // check if user "prefers redueced motion"
    const cssQuery = '(prefers-reduced-motion: reduce)'
    const queryList = window.matchMedia(cssQuery)
    return queryList.matches
  }

  nn.on('message', comms)
  nn.on('mousemove', bgmovement)
  nn.on('mousemove', updateBG)
</script>`
    window.utils.starterCodeB64 = window.utils.btoa(sc)
    return sc
  },

  netnetBGComms: (e) => {
    // used to send messages to the iframe (when default bg is present)
    const viewingDefaultBG = NNE.code.includes('/* netnet default bg */')
    if (!viewingDefaultBG) return
    const nomotion = WIDGETS['student-session']?.getData('nomotion')
    NNE.iframe.contentWindow.postMessage({
      type: 'netnet',
      data: { x: e.x, y: e.y, nomotion }
    }, '*')
  },

  forkRepo: () => {
    NNW.menu.switchFace('processing')
    const a = window.utils.url.github.split('/')
    const data = { owner: a[0], repo: a[1], branch: a[2] }
    window.utils.post('./api/github/fork', data, (json) => {
      if (!json.success) {
        console.error(json)
        return window.utils._Convo('oh-no-error')
      }
      WIDGETS.open('project-files', (w) => w.openProject(json.data.name))
    })
  },

  hotKey: () => {
    return nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
  },

  _Convo: (id, err) => {
    if (id === 'oh-no-error') console.error(err)
    Convo.load('/core/utils-convo.js', () => {
      const convos = window.CONVOS['utils-misc'](window.utils)
      window.convo = new Convo(convos, id)
    })
  },

  copyLink: (ele, msg) => {
    ele.focus()
    ele.select()
    navigator.clipboard.writeText(ele.value)
    const pos = ele.getBoundingClientRect()
    const note = document.createElement('div')
    msg = msg || 'Copied URL!'
    note.innerHTML = `<span>${msg}</span>`
    note.style.display = 'flex'
    note.style.justifyContent = 'center'
    note.style.alignItems = 'center'
    note.style.background = 'grey'
    note.style.position = 'absolute'
    note.style.left = `${pos.x}px`
    note.style.top = `${pos.y}px`
    note.style.zIndex = 1000
    note.style.width = `${pos.width}px`
    note.style.height = `${pos.height}px`
    note.style.backgroundColor = 'var(--bg-color)'
    note.style.color = 'var(--fg-color)'
    note.style.padding = '4px 20px'
    note.style.opacity = '1'
    note.style.transition = 'opacity 2s'
    document.body.appendChild(note)
    setTimeout(() => {
      note.style.opacity = 0
      setTimeout(() => note.remove(), 2200)
    }, 500)
  },

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*• NETNET ON LOAD stuff
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  loaderSetup: async (initWidgets) => {
    window.loading = {
      queue: [],
      total: 1,
      faces: ['ᴖ', '﹏', '^', '⌄', '◉', '_', '☉', '︵', '⇀', '‸', '◑', '◡', '-', '◞', '◕', '‿', 'ŏ', 'ᗜ', '◠', 'ᴗ', '✖', 'mouth-dot']
    }

    let idx = 0
    const animFace = (face) => {
      nn.get('#loader .loader-face').content('')
      const l = window.loading.faces.length
      const i = face ? 0 : idx % l
      const f = face || window.loading.faces
      const s = (i) => `images/faces/${f[i]}.svg`
      nn.create('img').set('src', s(i)).addTo('#loader .loader-face')
      nn.create('img').set('src', s((i + 1) % l)).addTo('#loader .loader-face')
      nn.create('img').set('src', s((i + 2) % l)).addTo('#loader .loader-face')
      idx++
    }
    animFace()

    const data = await window.utils.getSync('/api/custom-elements')
    window.loading.total += initWidgets.length
    window.loading.total += data.length
    window.loading.animFace = animFace
    window.loading.anim = setInterval(animFace, 150)
    window.utils.registerColor('--load-bg1', '#fff')
    window.utils.registerColor('--load-bg2', '#fff')
  },

  loaderUpdate: (msg) => {
    window.loading.queue.push(msg)
    window.utils.setVal('--load-mod', JSON.stringify(msg))
    const slots = 10 // 10 boxes total
    const len = window.loading.queue.length
    const total = window.loading.total
    const progress = Math.max(0, Math.min(1, len / total))
    const filled = Math.round(progress * slots)
    const empty = slots - filled
    const str = 'loading ' + '■  '.repeat(filled) + '□  '.repeat(empty)
    window.utils.setVal('--load-bar', JSON.stringify(str))
    if (slots === filled) {
      clearInterval(window.loading.anim)
      window.loading.animFace(['◕', '◞', '◕'])
      window.utils.setVal('--load-win', window.utils.getVal('--bg-color'))
      window.utils.setVal('--load-clr', window.utils.getVal('--fg-color'))
      window.utils.setVal('--load-bg1', window.utils.getVal('--fg-color') + 'a8')
      window.utils.setVal('--load-bg2', window.utils.getVal('--netizen-comment') + 'a8')
    }
  },

  whenLoaded: (eles, wigs, callback) => {
    const textBubbleLoaded = NNW.menu.textBubble
    const faceLoaded = NNW.menu.faceLoaded
    const wigsloaded = wigs.filter(file => WIDGETS.loaded.includes(file))
    const loadedCoreWidgets = wigsloaded.length === wigs.length
    const elesloaded = eles.map(e => e.split('/')[1])
      .filter(e => window.utils.customElementReady(e))
    const loadedCustomElements = elesloaded.length === eles.length

    if (faceLoaded && textBubbleLoaded && loadedCoreWidgets && loadedCustomElements) {
      setTimeout(() => callback(), window.utils.getVal('--menu-fades-time'))
    } else {
      setTimeout(() => window.utils.whenLoaded(eles, wigs, callback), 100)
    }
  },

  updateURL: (path) => {
    if (!path) path = ''
    const p = window.location.protocol
    const h = window.location.host
    // window.location = `${p}//${h}/${path}`
    window.history.pushState(null, null, `${p}//${h}/${path}`)
    window.utils.url = {
      shortCode: new URL(window.location).searchParams.get('c'),
      example: new URL(window.location).searchParams.get('ex'), // legacy
      demo: new URL(window.location).searchParams.get('demo'),
      template: new URL(window.location).searchParams.get('template'),
      tutorial: new URL(window.location).searchParams.get('tutorial'),
      time: new URL(window.location).searchParams.get('t'),
      layout: new URL(window.location).searchParams.get('layout'),
      github: new URL(window.location).searchParams.get('gh'),
      widget: new URL(window.location).searchParams.get('w')
    }
  },

  url: {
    shortCode: new URL(window.location).searchParams.get('c'),
    example: new URL(window.location).searchParams.get('ex'), // legacy
    demo: new URL(window.location).searchParams.get('demo'),
    template: new URL(window.location).searchParams.get('template'),
    tutorial: new URL(window.location).searchParams.get('tutorial'),
    time: new URL(window.location).searchParams.get('t'),
    layout: new URL(window.location).searchParams.get('layout'),
    github: new URL(window.location).searchParams.get('gh'),
    widget: new URL(window.location).searchParams.get('w')
  },

  mobile: () => {
    const url = window.utils.url
    if (window.location.hash.includes('#code/')) {
      window.utils.loadFromCodeHash()
    } else if (url.github) {
      window.utils.loadGithub(url.github, null, () => {
        NNW.win.style.display = 'none'
        NNW.rndr.style.width = '100%'
        NNW.rndr.style.height = '100%'
        NNW.rndr.style.left = '0px'
        NNW.rndr.style.top = '0px'
      })
    } else if (url.shortCode) {
      window.utils.loadShortCode(url.shortCode)
    } else {
      const msg = 'It appears you\'re on a mobile device. netnet.studio requires a computer with a mouse, keyboard and a reasonably sized screen in order to work properly. Please come back on your laptop or desktop computer!'
      window.utils.get('/curtain.html', (html) => {
        document.open()
        document.write(html.replace('{{MESSAGE}}', msg))
        document.close()
      }, true)
    }
  },

  _acceptSafari: false,
  warnSafari: () => {
    return nn.browserInfo().name === 'Safari' && !window.utils._acceptSafari
  },

  checkURL: () => {
    const ghAuth = window.localStorage.getItem('gh-auth-temp-code')
    const url = window.utils.url

    // const hash = window.location.hash
    if (nn.isMobile()) return window.utils.mobile()

    if (nn.browserInfo().name === 'Safari' && !window.utils._acceptSafari) {
      window.utils.loadDefault()
      return 'safari'
    }

    if (url.widget) {
      if (url.widget.includes('/')) {
        const arr = url.widget.split('/')
        WIDGETS.open(arr[0], (wig) => wig.openDocs(arr[1], arr[2]))
      } else WIDGETS.open(url.widget)
    }
    if (typeof ghAuth === 'string') {
      window.utils.loadGHRedirect()
      return 'gh-redirect'
    } else if (url.tutorial) {
      window.utils.loadTutorial(url.tutorial, url.time)
      return 'tutorial'
    } else if (window.location.hash.includes('#code/')) {
      window.utils.loadFromCodeHash(url.layout)
      return 'code'
    } else if (window.location.hash.includes('#example')) { // legacy
      window.utils.loadCustomDemo(url.layout)
      return 'sketch'
    } else if (window.location.hash.includes('#demo')) { // legacy
      window.utils.loadCustomDemo(url.layout)
      return 'annoted-sketch'
    } else if (window.location.hash.includes('#sketch')) {
      window.utils.loadBlankSketch()
      return 'sketch'
    } else if (url.github) {
      window.utils.loadGithub(url.github, url.layout)
      return 'github'
    } else if (url.shortCode) {
      window.utils.loadShortCode(url.shortCode, url.layout)
      return 'code'
    } else if (url.example) { // legacy
      window.utils.loadDemo(url.example)
      return 'example'
    } else if (url.demo) {
      window.utils.loadDemo(url.demo)
      return 'demo'
    } else if (url.template) {
      window.utils.loadTemplate(url.template)
      return 'template'
    } else {
      return 'none'
    }
  },

  fadeOutLoader: (hide) => {
    if (hide) {
      NNW.win.style.opacity = '0'
      NNW.win.style.display = 'none'
    }
    NNW.menu.updatePosition() // HACK: sometimes textBubble doesn't position properly on load
    document.querySelector('#loader').style.opacity = '0'
    setTimeout(() => {
      document.querySelector('#loader').style.display = 'none'
    }, window.utils.getVal('--layout-transition-time'))
  },

  loadDefault: () => {
    NNE.code = window.utils.starterCode()
    // make sure we at least update the first time
    if (!NNE.autoUpdate) NNE.update()
    const t = NNE.updateDelay
    setTimeout(() => window.utils.fadeOutLoader(false), t)
    setTimeout(() => WIDGETS['student-session'].greetStudent(), t + 700)
  },

  loadTutorial: (tutorial, time) => {
    WIDGETS.load('hyper-video-player', (w) => w.load(tutorial, time))
    if (!NNE.autoUpdate) window.utils.afterLayoutTransition(() => NNE.update())
    window.utils.fadeOutLoader(false)
  },

  loadBlankSketch: () => {
    NNW.layout = 'dock-left'
    window.utils.afterLayoutTransition(() => {
      NNE.code = ''
      window.utils.fadeOutLoader(false)
      setTimeout(() => NNE.cm.refresh(), 10)
    })
  },

  loadFromCodeHash: (layout) => {
    NNE.iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-modals allow-pointer-lock')
    NNE.code = ''
    if (layout) NNW.layout = layout
    window.utils.afterLayoutTransition(() => {
      NNE.loadFromHash()
      setTimeout(() => NNE.cm.refresh(), 10)
      if (!NNE.autoUpdate) NNE.update()
      window.utils.fadeOutLoader(!layout)
    })
  },

  loadShortCode: (code, layout) => {
    window.utils.post('./api/expand-url', { key: code }, (json) => {
      window.location.hash = json.hash
      window.utils.loadFromCodeHash(layout)
    })
  },

  loadCustomDemo: (layout) => {
    // an example created by anyone saved in the URL hash
    const hash = window.location.hash.split('#demo/')[1]
    const json = JSON.parse(NNE._decode(hash))
    window.utils.loadDemo(json, 'custom')
  },

  loadDemo: (key, type) => {
    WIDGETS.load('demo-toc', w => {
      w.load(key, type)
      if (nn.get('#loader').style.opacity === '0') return
      // if loaded from the URL, make sure to fadeout loader when done
      window.utils.afterLayoutTransition(() => window.utils.fadeOutLoader(false))
    })
  },

  loadTemplate: (name) => {
    NNE.code = window.utils.starterCode()
    WIDGETS.load('template-projects', w => {
      w.loadTemplate(name)
      if (nn.get('#loader').style.opacity === '0') return
      // if loaded from the URL, make sure to fadeout loader when done
      window.utils.afterLayoutTransition(() => window.utils.fadeOutLoader(false))
    })
  },

  loadGithub: (github, layout, callback) => {
    const a = github.split('/')
    if (a.length < 3 || a[2] === '') a[2] = 'main'
    const base = `https://raw.githubusercontent.com/${a[0]}/${a[1]}/${a[2]}/`
    const proto = window.location.protocol
    const host = window.location.host
    const proxy = `${proto}//${host}/api/github/proxy?url=${base}/`
    const rawHTML = `${proxy}index.html`
    window.utils.get(rawHTML, (html) => {
      if (typeof html !== 'string' || html === '{"error":"not_found"}') {
        window.utils.fadeOutLoader(false)
        window.utils._Convo('oh-no-error')
        return
      }
      // sandbox only when the repo belongs to someone else
      const o = WIDGETS['student-session'].getData('owner')
      const isOwner = o && o === a[0]
      if (isOwner) {
        NNE.iframe.removeAttribute('sandbox')
      } else {
        NNE.iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-modals allow-pointer-lock')
      }
      window.utils.setCustomRenderer(base, proxy)

      NNE.code = ''
      if (layout) { NNW.layout = layout } else { NNW.layout = 'dock-left' }
      window.utils.afterLayoutTransition(() => {
        NNE.code = html
        setTimeout(() => {
          NNE.cm.refresh()
          if (!NNE.autoUpdate) NNE.update()
        }, 10)
        window.utils.fadeOutLoader(false)
        if (isOwner) {
          window.utils._Convo('remix-github-project-logged-in-as-owner')
        } else if (o) {
          window.utils._Convo('remix-github-project-logged-in')
        } else { window.utils._Convo('remix-github-project-logged-out') }
        if (callback) callback()
      })
    }, true)
  },

  loadGHRedirect: () => {
    // code set by WIDGETS['student-session'].authGitHubSession()
    let code = window.localStorage.getItem('gh-auth-temp-code')
    // code might be an encoded hash, or a template or a gh root URL
    if (code.includes('__TEMP__')) {
      code = code.replace('__TEMP__', '')
      window.utils.loadTemplate(code)
      window.localStorage.removeItem('gh-auth-temp-code')
    } else if (code.includes('__GH__')) {
      code = code.replace('__GH__', '')
      window.utils.loadGithub(code, window.utils.url.layout)
      window.localStorage.removeItem('gh-auth-temp-code')
    } else {
      // if they had some code they were working on in the editor
      // before they got redirected over to GitHub to auth...
      const decoded = NNE._decode(code.substr(6))
      window.utils.setCustomRenderer(null)
      NNE.iframe.removeAttribute('sandbox')
      NNE.code = decoded
      NNW.layout = 'dock-left'
      window.utils.afterLayoutTransition(() => {
        setTimeout(() => {
          NNE.cm.refresh()
          if (!NNE.autoUpdate) NNE.update()
        }, 10)
        window.utils.fadeOutLoader(false)
        window.localStorage.removeItem('gh-auth-temp-code')
        window.utils._Convo('gh-redirected')
      })
    }
  },

  // CSS related stuff
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  loadStyleSheet: (path) => {
    if (document.querySelector(`link[href="${path}"]`)) return
    const link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', `${path}`)
    document.head.appendChild(link)
  },

  afterLayoutTransition: (callback) => {
    const prop = '--layout-transition-time'
    const de = document.documentElement
    let t = window.getComputedStyle(de).getPropertyValue(prop)
    const unit = t.includes('ms') ? 'ms' : 's'
    t = Number(t.substr(0, t.indexOf(unit)))
    if (unit === 's') t *= 1000
    t += 200 // little extra to avoid bugs
    setTimeout(() => { callback() }, t)
  },

  registerColor: (name, initial) => {
    if (window.CSS && window.CSS.registerProperty) {
      try {
        window.CSS.registerProperty({
          name,
          syntax: '<color>',
          inherits: true,
          initialValue: initial
        })
      } catch (e) { /* ignore if already registered */ }
    }
  },

  getVal: (prop) => { // get value of a CSS variable
    const p = (prop.indexOf('--') === 0) ? prop : `--${prop}`
    const de = document.documentElement
    const t = window.getComputedStyle(de).getPropertyValue(p)
    return t.includes('ms') ? parseInt(t) : t.includes('s')
      ? parseInt(t) * 1000 : t
  },

  setVal: (prop, val) => { // set value of a CSS variable
    const p = (prop.indexOf('--') === 0) ? prop : `--${prop}`
    document.documentElement.style.setProperty(p, val)
  },

  // apply an object of CSS declarations to an element's styles
  css: (ele, obj) => { for (const key in obj) ele.style[key] = obj[key] },

  reduceMotion: function () {
    // check if user "prefers redueced motion"
    const cssQuery = '(prefers-reduced-motion: reduce)'
    const queryList = window.matchMedia(cssQuery)
    return queryList.matches
  },

  updateShadow: (e, ele) => {
    const opac = (!NNW.themeConfig[NNW.theme].shadow) ? 0 : 0.15

    // if user wants reduced motion
    if (WIDGETS['student-session']?.getData('nomotion') === 'true') {
      ele.style.boxShadow = `rgba(0, 0, 0, ${opac}) 8px 12px 6px`
      return
    }

    const box = ele.getBoundingClientRect()
    const center = {
      x: box.left + (box.width / 2),
      y: box.top + (box.height / 2)
    }
    const x = e.clientX < center.x
      ? nn.map(e.clientX, 0, center.x, 33, 0)
      : nn.map(e.clientX, center.x, window.innerWidth, 0, -33)
    const y = e.clientY < center.y
      ? nn.map(e.clientY, 0, center.y, 33, 0)
      : nn.map(e.clientY, center.y, window.innerHeight, 0, -33)
    ele.style.boxShadow = `rgba(0, 0, 0, ${opac}) ${x}px ${y}px 6px`
  },

  updateAllShadows: (e) => {
    const o = { clientX: e.data.data.x, clientY: e.data.data.y }
    // update any open widget shadows
    WIDGETS.list().forEach(w => {
      if (w.opened) window.utils.updateShadow(o, w.ele)
    })
    // update netnet shadow + eyes
    window.utils.updateShadow(o, NNW.win)
    NNW.menu._moveEyes(o)
    // update netnet bubble
    if (NNW.menu.textBubble.opened) {
      window.utils.updateShadow(o, NNW.menu.textBubble.querySelector('div'))
    }
  },

  selecting: (bool) => {
    if (bool) {
      document.body.classList.add('selecting')
    } else {
      document.body.classList.remove('selecting')
    }
  },

  // netitor stuff
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  cancelAllNetitorUses: (exception) => {
    // remove security (would have been added if they loaded external sketch)
    NNE.iframe.removeAttribute('sandbox')

    const hasException = (s) => {
      if (exception instanceof Array) {
        return exception.includes(s)
      } else if (typeof exception === 'string') {
        return s === exception
      } else return false
    }

    // cancel everything below (unless it's in the exception list)

    if (!hasException('demo-toc')) {
      if (WIDGETS['demo-toc']?.demoKey) WIDGETS['demo-toc'].cancel(true)
    }

    if (!hasException('template-projects')) {
      if (WIDGETS['template-projects']) WIDGETS['template-projects'].cancel()
    }

    if (!hasException('hyper-video-player')) {
      if (WIDGETS['hyper-video-player']?.opened) {
        WIDGETS['hyper-video-player'].close()
      }
    }

    if (!hasException('learning-guide')) {
      if (WIDGETS['learning-guide'] && WIDGETS['learning-guide'].opened) {
        WIDGETS['learning-guide'].close()
      }
    }

    const introGuides = ['html-reference', 'css-reference', 'js-reference']
    introGuides.forEach(guide => {
      if (!hasException(guide)) {
        if (WIDGETS[guide]?.opened) WIDGETS[guide].close()
      }
    })

    if (!hasException('project-files')) {
      if (WIDGETS['project-files']?.projectData.name) {
        WIDGETS['project-files'].closeProject()
      }
    }
  },

  // main.js listens for these errors + sends them to 'code-review' widget
  setCustomRenderer: (base, proxy) => {
    const errMsgr = `<script>
      window.addEventListener('error', function (e) {
        if (e.message) window.parent.postMessage({ type: 'iframe-error', message: e.message, source: e.filename, lineno: e.lineno }, '*')
      }, true)
      var _nnW = new WeakSet()
      function _nnRes (n) { if (n.nodeType !== 1 || _nnW.has(n)) return; var s = n.src || n.href; if (!s) return; _nnW.add(n); n.addEventListener('error', function () { window.parent.postMessage({ type: 'iframe-error', src: n.src || n.href }, '*') }) }
      new MutationObserver(function (ms) { ms.forEach(function (m) { if (m.type === 'childList') m.addedNodes.forEach(_nnRes); else _nnRes(m.target) }) }).observe(document.documentElement || document, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'href'] })
      window.addEventListener('unhandledrejection', function (e) {
        if (e.reason && (e.reason.name === 'NotAllowedError' || e.reason.name === 'SecurityError')) {
          window.parent.postMessage({ type: 'iframe-sensor-blocked' }, '*')
        }
      })
    </script>`
    if (!base) {
      NNE.customRender = function (event) { event.update(errMsgr + event.code) }
    } else {
      NNE.customRender = function (event) {
        let newCode = `<base href="${base}">` + errMsgr + event.code
        if (proxy) newCode = NNE.prependProxyURL(newCode, proxy)
        event.update(newCode)
      }
    }
  },

  hideConvoIf: () => { // on cursor activity, hide convo if it's one of these
    const ids = ['returning-student', 'what-to-do', 'blank-canvas-ready', 'how-to-code', 'demo-example', 'remix-github-project-logged-in', 'remix-github-project-logged-in-as-owner', 'remix-github-project-logged-out', 'remix-github-project-auth-redirect', 'gh-redirected']
    if (window.convo && ids.includes(window.convo.id)) {
      window.convo.hide()
    }
  },

  diff: (a, b) => {
    const aLines = a.split('\n')
    const bLines = b.split('\n')
    // ---------- LCS matrix ----------
    const m = aLines.length
    const n = bLines.length
    const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1))
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (aLines[i - 1] === bLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
        }
      }
    }
    // ---------- Backtrack to find diff ----------
    const removed = []
    const added = []
    let i = m
    let j = n
    while (i > 0 && j > 0) {
      if (aLines[i - 1] === bLines[j - 1]) { // Same line – move diagonally
        i--; j--
      } else if (dp[i - 1][j] >= dp[i][j - 1]) { // Line i in A was removed
        removed.push({ line: i, text: aLines[i - 1] }); i--
      } else { // Line j in B was added
        added.push({ line: j, text: bLines[j - 1] }); j--
      }
    }
    while (i > 0) { // Anything left at the start of either str is also a diff
      removed.push({ line: i, text: aLines[i - 1] }); i--
    }
    while (j > 0) { // Reverse because we built the arrays backwards
      added.push({ line: j, text: bLines[j - 1] }); j--
    }
    removed.reverse()
    added.reverse()
    return { removed, added }
  },

  autoType: (opts = {}) => {
    /*
      opts = {
        id: id, // object id
        template: 'string with {{code}}',
        code: 'code to type out',
        speed: 60, // how fast to type the characters out
        buffer: 0 // number of lines to leave above code (if we need to scroll to find it)
        callback: func // callback function after typing is complete
      }
    */
    const normalize = s => (s || '')
      .replace(/\\t/g, '\t')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')

    // turn escaped sequences into real chars
    let src = normalize(opts.code)
    let tpl = normalize(opts.template)

    // b/c the netitor does not indent with tabs
    // -> NNE.cm.getOption('indentWithTabs') === fasle
    const i = NNE.cm.getOption('indentUnit') || 2
    const tab = ' '.repeat(i)
    src = src.replace(/\t/g, tab)
    tpl = tpl.replace(/\t/g, tab)

    // ensure typing code is always visible
    const startLine = tpl.split('\n').findIndex(str => str.includes('{{code}}'))
    // ...this function ensures "line" is at the top...
    const scrollToLineT = (line) => {
      const lineHeight = NNE.cm.defaultTextHeight()
      const buffer = (opts.buffer) ? opts.buffer * lineHeight : 0
      const coords = NNE.cm.charCoords({ line, ch: 0 }, 'local')
      // NNE.cm.getScrollerElement().scrollTop = coords.top - buffer
      NNE.cm.getScrollerElement().scrollTo({
        top: coords.top - buffer,
        behavior: 'smooth'
      })
    }
    // ...while this one ensures "line" is at the bottom...
    const scrollToLineB = (line) => {
      const info = NNE.cm.getScrollInfo()
      const lineHeight = NNE.cm.defaultTextHeight()
      const coords = NNE.cm.charCoords({ line, ch: 0 }, 'local')
      const targ = coords.top - (info.clientHeight - lineHeight)
      const targetScrollTop = Math.max(0, targ)
      // NNE.cm.getScrollerElement().scrollTop = targetScrollTop
      NNE.cm.getScrollerElement().scrollTo({
        top: targetScrollTop, behavior: 'smooth'
      })
    }

    // instead of using "NNE.code = ..." b/c it clashes with scrollToLine()
    const setValuePreserveView = value => {
      const info = NNE.cm.getScrollInfo()
      const sels = NNE.cm.listSelections()
      NNE.cm.operation(() => {
        NNE.cm.setValue(value)
        NNE.cm.setSelections(sels)
        NNE.cm.scrollTo(info.left, info.top)
      })
    }

    let idx = 0
    const chars = Array.from(src)
    const type = () => {
      const cstr = chars.slice(0, idx).join('')
      const newVal = tpl ? tpl.replace('{{code}}', cstr) : cstr
      setValuePreserveView(newVal)
      // if line is not visible
      const hasCode = startLine !== -1
      if (hasCode) {
        const lastLine = startLine + src.split('\n').length
        const v = NNE.getVisibleRange()
        const vLen = v.bottom - v.top
        const cLen = lastLine - startLine
        const fitsInView = cLen <= vLen // entire "code" block fits in view
        const startNotInFrame = startLine >= v.bottom || startLine < v.top
        const lastNotInFrame = lastLine >= v.bottom || lastLine < v.top
        if (startNotInFrame && fitsInView) {
          scrollToLineT(startLine)
        } else if (lastNotInFrame) {
          scrollToLineB(lastLine)
        }
      }
      // if we've got more chars, set timer for next key stroke
      if (idx <= chars.length) {
        window.utils.cancelAutoType()
        window.utils._autoTypeTimer = setTimeout(type, opts.speed || 60)
      } else {
        if (opts.callback) opts.callback(opts.id)
      }
      idx++
    }

    type()
  },

  cancelAutoType: () => {
    if (window.utils._autoTypeTimer) clearTimeout(window.utils._autoTypeTimer)
  },

  scrollToLines: (arr, ch) => {
    ch = ch || 0
    // center vertical scroll on an array of line numbers
    const c = NNE.cm.lineCount()
    const s = NNE.cm.getScrollInfo() // scroll object
    const h = s.height / c // line height
    const t = Math.round(s.clientHeight / h) // total viewable lines
    const a = arr[arr.length - 1] - arr[0] + 1 // span of lines in array
    const d = (t / 2) - (a / 2) // diff offset
    const l = (a >= t) // if space is too tight
      ? (arr[0] - 1) + (t - 1) // make arr[0] first viewable line
      : Math.round(arr[arr.length - 1] + d) - 1 // otherwise center it
    const target = l >= c ? c - 1 : l
    NNE.cm.scrollIntoView({ line: 0, ch })
    NNE.cm.scrollIntoView({ line: target, ch })
  },

  numChange: (e) => {
    const keys = [38, 40]
    const str = NNE.cm.getSelection()
    const val = parseInt(str)
    if (keys.includes(e.keyCode) && !isNaN(val)) {
      e.preventDefault()
      if (NNW.speaking) window.convo.hide()
      const unt = str.replace(val, '')
      const inc = e.shiftKey ? 10 : 1
      const num = e.keyCode === 38 ? val + inc : val - inc
      const from = NNE.cm.getCursor('from')
      const to = NNE.cm.getCursor('to')
      const newStr = num + unt
      NNE.cm.replaceSelection(newStr)
      const t = { line: to.line, ch: from.ch + newStr.length }
      NNE.cm.setSelection(from, t)
      NNE.spotlight(from.line + 1)
    } else if (e.keyCode === 13 && !isNaN(val)) {
      if (NNW.speaking) window.convo.hide()
      e.preventDefault()
      const from = NNE.cm.getCursor('from')
      NNE.cm.setSelection(from, from)
      NNE.spotlight(null)
    }
  },

  // dev testing utilities
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  netitorToString: () => {
    const html = NNE.code
    const lines = String(html).replace(/\r\n?/g, '\n').split('\n')

    const escaped = lines.map(line => {
      // turn leading spaces into \t per two spaces
      const m = line.match(/^ +/)
      let head = ''
      if (m) {
        const n = m[0].length
        head = '\\t'.repeat(Math.floor(n / 2)) + (n % 2 ? ' ' : '')
        line = line.slice(n)
      }
      // escape only double quotes; leave backslashes alone
      return head + line.replace(/"/g, '\\"')
    })

    // join with literal \n between lines
    console.log(escaped.join('\\n'))
  },

  testConvo: (convoName) => {
    convoName = convoName || 'example-widget'
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

/*
  handle messaging from iframe, for ex:
  NOTE: keep in mind iframe error messanger (see setCustomRenderer, customRenderError)

  window.top.postMessage({
    type: 'dialogue',
    data: [
      { content: 'hello world' },
      { content: 'how are u?' }
    ]
  })

  https://netnet.studio/?layout=dock-left#code/eJxtj8EKgzAQRM/NV+wtCqJ3UfsFPfVYekiTxUrTrE02iIj/3lBz7FyGmX2wTPeIzOQGxsBdk4PogvbTzIMQJ0M6vtFx/Yno1yta1Ey+kAcqy5qctpN+QQ9FCf0Am4CkZXKGlppprmcKfMEQ1IjFcQTgdcYWpJmUpTGirHJvFKsWbjkBbKDJcXqf4CdaS7CQt0bCXv1naAHlEeI5IZm4/3wvk+1CdE3e9gVLy0qk

*/
// window.onmessage = function (e) {
//   const obj = e.data
//   if (!obj) return
//   if (obj.type === 'dialogue') {
//     new Convo(obj.data)
//   } else if (obj.type === 'widget') {
//     WIDGETS.open(obj.data)
//   }
// }
