/* global WIDGETS, nn, Convo, NNW, NNE  */
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

  windowResize: () => {
    NNW._resizeWindow({
      clientX: window.NNW.win.offsetWidth,
      clientY: window.NNW.win.offsetHeight
    })
  },

  starterCode: () => {
    const clr1 = window.utils.getVal('--fg-color')
    const clr2 = window.utils.getVal('--netizen-comment')
    const sc = `<!DOCTYPE html>
<style>
  /* netnet default bg */
  body {
    margin: 0;
    background-image: linear-gradient(${clr2}a8 2px, transparent 1px),
      linear-gradient(90deg, ${clr2}a8 2px, transparent 1px);
    background-size: 50px 50px;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  body::before {
    content: "";
    position: absolute;
    z-index: -1;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(0deg, ${clr1}a8, ${clr2}a8);
  }
</style>
    `
    window.utils.starterCodeB64 = window.utils.btoa(sc)
    return sc
  },

  tutorialOpen: () => {
    const hvp = WIDGETS['hyper-video-player']
    const tg = WIDGETS['learning-guide']
    return (hvp && tg && tg.metadata !== null)
  },

  forkRepo: () => {
    NNW.menu.switchFace('processing')
    const a = window.utils.url.github.split('/')
    const data = { owner: a[0], repo: a[1] }
    window.utils.post('./api/github/fork', data, (json) => {
      WIDGETS['functions-menu']._openProject(json.data.name) // TODO: replace with new PF method
    })
  },

  hotKey: () => {
    return nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
  },

  _Convo: (id) => {
    Convo.load('/core/utils-convo.js', () => {
      const convos = window.CONVOS['utils-misc'](window.utils)
      window.convo = new Convo(convos, id)
    })
  },

  copyLink: (ele) => {
    ele.focus()
    ele.select()
    navigator.clipboard.writeText(ele.value)
    const pos = ele.getBoundingClientRect()
    const note = document.createElement('div')
    note.innerHTML = '<span>Copied URL!</span>'
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
      example: new URL(window.location).searchParams.get('ex'),
      tutorial: new URL(window.location).searchParams.get('tutorial'),
      time: new URL(window.location).searchParams.get('t'),
      layout: new URL(window.location).searchParams.get('layout'),
      github: new URL(window.location).searchParams.get('gh'),
      widget: new URL(window.location).searchParams.get('w'),
      dem: new URL(window.location).searchParams.get('dem')
    }
  },

  url: {
    shortCode: new URL(window.location).searchParams.get('c'),
    example: new URL(window.location).searchParams.get('ex'),
    tutorial: new URL(window.location).searchParams.get('tutorial'),
    time: new URL(window.location).searchParams.get('t'),
    layout: new URL(window.location).searchParams.get('layout'),
    github: new URL(window.location).searchParams.get('gh'),
    widget: new URL(window.location).searchParams.get('w'),
    dem: new URL(window.location).searchParams.get('dem')
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
      const ld = document.querySelector('#loader > div:nth-child(1)')
      ld.style.maxWidth = '1200px'
      ld.style.padding = '10px'
      ld.style.lineHeight = '32px'
      ld.innerHTML = 'It appears you\'re on a mobile device. netnet.studio requires a computer with a mouse, keyboard and a reasonably sized screen in order to work properly.<br><br>Learn more about <a href="http://netizen.org/netnet/" style="color: #fff;">netnet here</a>, or email us at h<span></span>i@net<span></span>izen.org'
    }
  },

  checkForDiffRoot: () => {
    if (typeof window.utils.url.github === 'string') {
      WIDGETS['student-session'].clearProjectData()
      const a = window.utils.url.github.split('/')
      const base = `https://raw.githubusercontent.com/${a[0]}/${a[1]}/${a[2]}/`
      const proto = window.location.protocol
      const host = window.location.host
      const proxy = `${proto}//${host}/api/github/proxy?url=${base}/`
      NNE.addCustomRoot({ base, proxy })
    }
  },

  checkURL: () => {
    const ghAuth = window.localStorage.getItem('gh-auth-temp-code')
    const url = window.utils.url
    // const hash = window.location.hash
    if (url.widget) WIDGETS.open(url.widget)
    if (nn.isMobile()) return window.utils.mobile()
    if (typeof ghAuth === 'string') {
      window.utils.loadGHRedirect()
      return 'gh-redirect'
    } else if (url.tutorial) {
      window.utils.loadTutorial(url.tutorial, url.time)
      return 'tutorial'
    } else if (window.location.hash.includes('#code/')) {
      window.utils.loadFromCodeHash(url.layout)
      return 'code'
    } else if (window.location.hash.includes('#example')) {
      if (url.dem) window.utils.loadCustomExample(url.layout, true)
      else window.utils.loadCustomExample(url.layout)
      return 'sketch'
    } else if (window.location.hash.includes('#sketch')) {
      window.utils.loadBlankSketch()
      return 'sketch'
    } else if (url.github) {
      window.utils.loadGithub(url.github, url.layout)
      return 'github'
    } else if (url.shortCode) {
      window.utils.loadShortCode(url.shortCode, url.layout)
      return 'code'
    } else if (url.example) {
      if (!WIDGETS['code-examples']) {
        WIDGETS.load('code-examples', w => w.loadExample(url.example, 'url'))
      } else { WIDGETS['code-examples'].loadExample(url.example, 'url') }
      return 'example'
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
    // make sure we at lead update the first time
    if (!NNE.autoUpdate) NNE.update()
    const t = NNE.updateDelay
    setTimeout(() => window.utils.fadeOutLoader(false), t)
    setTimeout(() => WIDGETS['student-session'].greetStudent(), t + 700)
  },

  loadTutorial: (tutorial, time) => {
    const tm = WIDGETS['learning-guide']
    if (!tm) WIDGETS.load('learning-guide', (w) => w.load(tutorial, time))
    else tm.load(tutorial, time)
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
    window.utils.checkForDiffRoot()
    NNE.code = ''
    window.utils.afterLayoutTransition(() => {
      NNE.loadFromHash()
      setTimeout(() => NNE.cm.refresh(), 10)
      if (!NNE.autoUpdate) NNE.update()
    })
    if (layout) {
      NNW.layout = layout
      window.utils.fadeOutLoader(false)
    } else window.utils.fadeOutLoader(true)
  },

  loadCustomExample: (layout, dem) => {
    // an example created by anyone saved in the URL hash
    const hash = window.location.hash.split('#example/')[1]
    const json = JSON.parse(NNE._decode(hash))
    const data = {
      name: json.name,
      hash: json.code,
      code: json.code,
      info: json.info,
      key: json.key
    }
    if (dem) WIDGETS.open('code-examples', w => w.loadExample(data, 'url', true))
    else WIDGETS.open('code-examples', w => w.loadExample(data, 'url'))
  },

  loadShortCode: (code, layout) => {
    window.utils.post('./api/expand-url', { key: code }, (json) => {
      window.utils.checkForDiffRoot()
      window.location.hash = json.hash
      NNE.code = ''
      window.utils.afterLayoutTransition(() => {
        NNE.loadFromHash()
        setTimeout(() => {
          NNE.cm.refresh()
          if (!NNE.autoUpdate) NNE.update()
        }, 10)
      })
      if (layout) {
        NNW.layout = layout
        window.utils.fadeOutLoader(false)
      } else window.utils.fadeOutLoader(true)
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
      NNE.addCustomRoot({ base, proxy })
      NNE.code = ''
      if (layout) { NNW.layout = layout } else { NNW.layout = 'dock-left' }
      window.utils.afterLayoutTransition(() => {
        NNE.code = html
        setTimeout(() => {
          NNE.cm.refresh()
          if (!NNE.autoUpdate) NNE.update()
        }, 10)
        window.utils.fadeOutLoader(false)
        const o = WIDGETS['student-session'].getData('owner')
        if (o && o === a[0]) {
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
    const code = window.localStorage.getItem('gh-auth-temp-code')
    // code might be an encoded hash, or a gh root URL
    if (code.includes('raw.githubusercontent.com')) {
      // if they were looking at someone else's GitHub poroject
      // before they got redirected over to GitHub for auth...
      const a = code.split('.com/')[1].split('/')
      const base = `https://raw.githubusercontent.com/${a[0]}/${a[1]}/${a[2]}/`
      const proto = window.location.protocol
      const host = window.location.host
      const proxy = `${proto}//${host}/api/github/proxy?url=${base}/`
      const rawHTML = `${proxy}index.html`
      window.utils.get(rawHTML, (html) => {
        NNE.addCustomRoot({ base, proxy })
        NNE.code = ''
        NNW.layout = 'dock-left'
        window.utils.afterLayoutTransition(() => {
          NNE.code = html
          setTimeout(() => {
            NNE.cm.refresh()
            if (!NNE.autoUpdate) NNE.update()
          }, 10)
          window.utils.fadeOutLoader(false)
          window.utils.updateURL(`?gh=${a[0]}/${a[1]}/${a[2]}`)
          window.utils._Convo('remix-github-project-auth-redirect')
          // removeItem('gh-auth-temp-code') called in Convo data
        })
      }, true)
    } else {
      // if they had some code they were working on in the editor
      // before they got redirected over to GitHub to auth...
      const decoded = NNE._decode(code.substr(6))
      NNE.addCustomRoot(null)
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

  updateShadow: (e, ele) => {
    const opac = (!NNW.themeConfig[NNW.theme].shadow) ? 0 : 0.15
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

  selecting: (bool) => {
    if (bool) {
      document.body.style.userSelect = 'auto'
      document.body.style.webkitUserSelect = 'auto'
    } else {
      document.body.style.userSelect = 'none'
      document.body.style.webkitUserSelect = 'none'
    }
  },

  // netitor stuff
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  netitorInput: (e) => {
    if (NNE.cm.isReadOnly()) window.utils._Convo('tutorial-pause-to-edit')
  },

  hideConvoIf: () => { // on cursor activity, hide convo if it's one of these
    const ids = ['returning-student', 'what-to-do', 'blank-canvas-ready', 'demo-example', 'browserfest', 'remix-github-project-logged-in', 'remix-github-project-logged-in-as-owner', 'remix-github-project-logged-out', 'remix-github-project-auth-redirect', 'gh-redirected']
    if (window.convo && ids.includes(window.convo.id)) {
      window.convo.hide()
    }
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

  window.top.postMessage({
    type: 'dialogue',
    data: [
      { content: 'hello world' },
      { content: 'how are u?' }
    ]
  })

  https://netnet.studio/?layout=dock-left#code/eJxtj8EKgzAQRM/NV+wtCqJ3UfsFPfVYekiTxUrTrE02iIj/3lBz7FyGmX2wTPeIzOQGxsBdk4PogvbTzIMQJ0M6vtFx/Yno1yta1Ey+kAcqy5qctpN+QQ9FCf0Am4CkZXKGlppprmcKfMEQ1IjFcQTgdcYWpJmUpTGirHJvFKsWbjkBbKDJcXqf4CdaS7CQt0bCXv1naAHlEeI5IZm4/3wvk+1CdE3e9gVLy0qk

*/
window.onmessage = function (e) {
  const obj = e.data
  if (!obj) return
  if (obj.type === 'dialogue') {
    new Convo(obj.data)
  } else if (obj.type === 'widget') {
    WIDGETS.open(obj.data)
  }
}
