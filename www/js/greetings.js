/* global Convo, Averigua, STORE, NNE, NNT, NNM, NNW, WIDGETS */
window.greetings = {
  convos: null,
  city: null,
  loaded: { widgets: false, tutorials: false },
  greeted: false, // has user been greeted yet
  introducing: false, // see postIntro below
  returningUser: window.localStorage.getItem('username'),
  widgets: {}, // NOTE: created in www/convos/welcome-screen/index.js
  starterEncoded: 'eJyFkEFLw0AQhe/5FSOloNBgYgw0aSilKh714KXHTXaSHZrsyu62IZb+dzfZoiiIhx1m33wM701x9fjy8LZ7fQJhu3YdFMYOLa4DgM0eh1qzDg0wSd32GU5OBYjmcIKSVftGq4Pk4bsyZEnJfJyk7p0nLP2bi6Mf5PT9f+U5cKVUfLj4+OZzaEki02GjGSeU9vouiTg2C5gt4yrL7l3DWVUu0TVpnMZZdrP6tSM09IE5JKOXsfj5GJx5J5cbJJEBkjVJsuiZnrgVU6hj7xWB1AjrJeEldURdt6rPQRDnKFdToOL269qf3xBxIA==',
  getStarterCode: () => {
    const de = window.getComputedStyle(document.documentElement)
    const clr1 = de.getPropertyValue('--netizen-string')
    const clr2 = de.getPropertyValue('--netizen-number')
    const clr3 = de.getPropertyValue('--netizen-keyword')
    return `<!DOCTYPE html>
<style>
  @keyframes animBG {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }

  body {
    background: linear-gradient(230deg, ${clr1}, ${clr2}, ${clr3});
    background-size: 300% 300%;
    animation: animBG 30s infinite;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
    `
  },

  injectStarterCode: () => {
    NNE.code = window.greetings.getStarterCode()
  },

  startMenu: () => {
    setTimeout(() => {
      NNM.setFace('◠', '◡', '◠', false)
    }, STORE.getTransitionTime() + 100)
    window.convo = new Convo(window.greetings.convos, 'default-greeting')
  },

  mainMenu: () => {
    window.convo = new Convo(window.greetings.convos, 'main-menu')
  },

  loader: () => {
    const self = window.greetings
    window.utils.runFaviconUpdate()
    window.utils.loadConvoData('welcome-screen', () => {
      self.convos = window.convos['welcome-screen'](self)
      STORE.subscribe('tutorials', (tuts) => {
        if (!self.loaded.tutorials) {
          self.loaded.tutorials = true
          self.ready()
        }
      })
      NNW.onWidgetLoaded((keys) => {
        if (!self.loaded.widgets &&
          keys.length > Object.keys(self.widgets).length) {
          self.loaded.widgets = true
          self.ready()
        }
      })
    })
  },

  ready: () => {
    const self = window.greetings
    const loader = document.querySelector('#loader')
    const loadScreenStillUp = loader.style.display !== 'none'
    const allLoaded = self.loaded.widgets && self.loaded.tutorials
    if (allLoaded && loadScreenStillUp) {
      /*
            AFTER EVERYTHING HAS LOADED
            ...BEGIN INTRO LOGIC...
      */
      const tut = window.utils.url.tutorial

      // check for opacity in URL parameters
      const opc = window.utils.url.opacity
      if (opc) STORE.dispatch('CHANGE_OPACITY', opc)
      // check for theme in URL param or user picked theme in localStorage
      const thm = window.utils.url.theme || window.localStorage.getItem('theme')
      if (thm) STORE.dispatch('CHANGE_THEME', thm)
      // does the user have any error exceptions saved locally
      const erx = window.localStorage.getItem('error-exceptions')
      if (erx) JSON.parse(erx).forEach(e => NNE.addErrorException(e))

      // if there is some prior code to display
      const prevCode = window.utils.savedCode()
      const shortCode = window.utils.url.shortCode
      const redirect = window.localStorage.getItem('pre-auth-from')
      if (!tut && redirect) { // ...if redirected here via GitHub auth
        // ...pick up where they left off...
        const layout = window.localStorage.getItem('layout')
        if (layout) STORE.dispatch('CHANGE_LAYOUT', layout)
        self.handleLoginRedirect()
      } else if (!tut && shortCode) { // ...if there's a ?c=[code] URL param
        window.utils.clearProjectData()
        self.netnetToCorner()
        window.NNW.expandShortURL(shortCode, () => {
          NNE.loadFromHash()
          self.welcome()
        })
      } else if (!tut && NNE.hasCodeInHash) { // ...if there's a #code/... URL hash
        window.utils.clearProjectData()
        self.netnetToCorner()
        NNE.loadFromHash()
        self.welcome()
      } else if (!tut && prevCode && self.returningUser) {
        // inserting code into editor && setting prev-layout is handled in convo
        // ... 'I want to sketch' > 'work-on-saved-code'
        window.greetings.injectStarterCode()
        self.welcome() // ...&& welcome them.
      } else if (!tut) { // ...otherwise ...
        window.greetings.injectStarterCode()
      }

      // if URL has a tutorial param, jump right into welcome
      if (tut) {
        if (STORE.state.layout !== 'welcome') {
          STORE.dispatch('CHANGE_LAYOUT', 'welcome')
        }
        self.welcome()
      }

      window.utils.netitorUpdate()
      // When any layout or other transition finishes remove loader...
      window.NNW._whenCSSTransitionFinished(() => {
        const auth = window.localStorage.getItem('beta-pw-auth')
        if (auth === 'true') return self.enterStudio()
        const pw = document.querySelector('#loader > div:nth-child(2)')
        const ld = document.querySelector('#loader > div:nth-child(1)')
        pw.addEventListener('keydown', (e) => {
          if (e.keyCode === 13) {
            if (e.target.value === 'adalovelace') {
              self.enterStudio()
              window.localStorage.setItem('beta-pw-auth', 'true')
            } else {
              e.target.value = ''
              window.alert('woops wrong password! If you want to be a beta tester send us an email hi@netizen.org')
            }
          }
        })
        ld.style.display = 'none'
        pw.style.display = 'block'
      })
    }
  },

  enterStudio: () => {
    const self = window.greetings
    document.querySelector('#loader').style.opacity = '0'
    setTimeout(() => {
      document.querySelector('#loader').style.display = 'none'
      const delay = window.localStorage.getItem('username') ? 100 : 5000
      setTimeout(() => {
        if (!STORE.is('SHOWING')) self.welcome()
      }, delay)
    }, 1000) // NOTE this ms should match #loader transition-duration
  },

  welcome: () => {
    const self = window.greetings
    // self.convos = window.convos['welcome-screen'](self)
    const urlHasCode = NNE.hasCodeInHash || window.utils.url.shortCode
    const urlHasTutorial = window.utils.url.tutorial

    if (urlHasTutorial) {
      //
      //  TUTORIAL WELCCOME
      //
      NNT.load(urlHasTutorial, () => {
        setTimeout(() => {
          const oUsr = 'url-param-tutorial-returning'
          const nUsr = 'url-param-tutorial-first-time'
          if (!self.returningUser) self.introducing = 'tutorial'
          if (self.returningUser) window.convo = new Convo(self.convos, oUsr)
          else window.convo = new Convo(self.convos, nUsr)
          WIDGETS['tutorials-menu'].open()
        }, STORE.getTransitionTime())
      })
    } else if (urlHasCode) {
      //
      //  PRELOADED CODE WELCOME
      //
      if (self.returningUser) {
        window.convo = new Convo(self.convos, 'url-param-code-returning')
      } else {
        self.introducing = 'code-hash'
        window.convo = new Convo(self.convos, 'url-param-code-first-time')
      }
    } else if (self.returningUser) {
      //
      //  DEFAULT WELCOME
      //
      // if (STORE.history.actions.length <= 6) {
      if (self.greeted) {
        window.convo = new Convo(self.convos, 'default-greeting')
      } else {
        window.convo = new Convo(self.convos, 'get-started-returning')
      }
    } else {
      //
      //  NEW USER WELCOME
      //
      window.convo = new Convo(self.convos, 'get-started-first-time')
    }
    self.greeted = true
  },

  netnetToCorner: () => {
    const x = window.innerWidth - window.NNW.win.offsetWidth - 20
    const y = window.innerHeight - window.NNW.win.offsetHeight - 20
    window.NNW.updatePosition(x, y)
  },

  saveName: (name) => {
    const self = window.greetings
    if (name === '') {
      const p = Averigua.platformInfo()
      const a = p.platform.substr(0, 3)
      const b = p.browser.name.toLowerCase().substr(0, 4)
      window.localStorage.setItem('username', a + b)
      window.utils.get('./api/user-geo', (res) => {
        if (res.success && res.data.city) {
          self.city = res.data.city
          const c = res.data.city.toLowerCase().substr(0, 4)
          window.localStorage.setItem('username', a + b + c)
        }
      })
    } else {
      window.localStorage.setItem('username', name)
    }
  },

  goTo: (redirect) => {
    const self = window.greetings
    setTimeout(() => {
      self.convos = window.convos['welcome-screen'](self)
      window.convo = new Convo(self.convos, redirect)
    }, STORE.getTransitionTime())
  },

  postIntro: () => {
    // if the user lands on the page with a URL param for a tutorial or a
    // shortCode/code-hash, && netnet's never met them, they will be prompted
    // to introduce themselves, if they do, this redirects them after they've
    // finished their introductions
    if (WIDGETS['ws-credits'].opened) {
      WIDGETS['ws-credits'].close()
    }
    const self = window.greetings
    if (self.introducing === 'tutorial') {
      self.goTo('url-param-tutorial-redirect')
    } else if (self.introducing === 'code-hash') {
      self.goTo('url-param-code-redirect')
      self.netnetToCorner()
    }
  },

  handleLoginRedirect: () => {
    function waitForOwner (d) {
      if (window.localStorage.getItem('owner')) {
        NNT.load(d.tutorial, (e) => {
          window._tempAuthFrom = d.status
          e.goTo(d.id)
        })
      } else setTimeout(() => waitForOwner(d), 250)
    }

    if (WIDGETS['functions-menu']) {
      const prevCode = window.utils.savedCode() || NNE._encode('<!DOCTYPE html>')
      const from = window.localStorage.getItem('pre-auth-from')
      if (from === 'save' || from === 'open') window._lastConvo = from
      // if redirected from a-frame tutorial, make sure to re-setup a-frame
      if (NNE.code.includes('aframe.js"') ||
        NNE.code.includes('aframe.min.js"')) {
        window.utils.setupAframeEnv()
      }
      if (from === 'save') {
        NNE.code = NNE._decode(prevCode)
        WIDGETS['functions-menu'].saveProject()
      } else if (from === 'open') {
        NNE.code = NNE._decode(prevCode)
        WIDGETS['functions-menu'].openProject()
      } else { // assume tutorial
        waitForOwner(JSON.parse(from))
      }
      window.localStorage.removeItem('pre-auth-from')
    } else setTimeout(window.utils.handleLoginRedirect, 250)
  }
}
