/* global Convo, Averigua, STORE, NNE, WIDGETS */
window.greetings = {
  convos: null,
  city: null,
  loaded: { widgets: false, tutorials: false },
  greeted: false, // has user been greeted yet
  returningUser: window.localStorage.getItem('username'),
  widgets: {}, // NOTE: created in www/convos/welcome-screen/index.js
  starterCode: `<!DOCTYPE html>
<style>
  @keyframes animBG {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }

  body {
    background: linear-gradient(230deg, #81c994, #dacb8e, #515199);
    background-size: 300% 300%;
    animation: animBG 30s infinite;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
  `,

  injectStarterCode: () => {
    NNE.code = window.greetings.starterCode
  },

  startMenu: () => {
    window.convo = new Convo(window.greetings.convos['default-greeting'])
  },

  loader: () => {
    const self = window.greetings
    window.utils.loadConvoData('welcome-screen', () => {
      self.convos = window.convos['welcome-screen'](self)
      STORE.subscribe('tutorials', (tuts) => {
        if (!self.loaded.tutorials) {
          self.loaded.tutorials = true
          self.ready()
        }
      })
      STORE.subscribe('widgets', (wigs) => {
        if (!self.loaded.widgets &&
          wigs.length > Object.keys(self.widgets).length) {
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

      // if there is some prior code to display
      const prevCode = window.utils.savedCode()
      const shortCode = window.utils.url.shortCode
      const redirect = window.localStorage.getItem('pre-auth-from')
      if (redirect) { // ...if redirected here via GitHub auth
        // ...pick up where they left off...
        if (prevCode) NNE.code = NNE._decode(prevCode)
        const layout = window.localStorage.getItem('layout')
        if (layout) STORE.dispatch('CHANGE_LAYOUT', layout)
        self.handleLoginRedirect()
      } else if (shortCode) { // ...if there's a ?c=[code] URL param
        window.utils.clearProjectData()
        self.netnetToCorner()
        window.NNW.expandShortURL(shortCode, () => {
          NNE.loadFromHash()
          self.welcome()
        })
      } else if (NNE.hasCodeInHash) { // ...if there's a #code/... URL hash
        window.utils.clearProjectData()
        self.netnetToCorner()
        NNE.loadFromHash()
        self.welcome()
      } else if (prevCode && self.returningUser) {
        // ...if user had previously been working on code
        NNE.code = NNE._decode(prevCode) // ...display their priror code...
        // ...in their prior layout...
        if (window.utils.url.layout || window.localStorage.getItem('layout')) {
          STORE.dispatch('CHANGE_LAYOUT', window.utils.url.layout ||
          window.localStorage.getItem('layout'))
        } else { // ...or default to dock-left layout...
          STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
        }
        self.welcome() // ...&& welcome them.
      } else { // ...otherwise ...
        window.greetings.injectStarterCode()
      }

      // check for opacity in URL parameters
      const opc = window.utils.url.opacity
      if (opc) STORE.dispatch('CHANGE_OPACITY', opc)
      // check for theme in URL param or user picked theme in localStorage
      const thm = window.utils.url.theme || window.localStorage.getItem('theme')
      if (thm) STORE.dispatch('CHANGE_THEME', thm)
      // does the user have any error exceptions saved locally
      const erx = window.localStorage.getItem('error-exceptions')
      if (erx) JSON.parse(erx).forEach(e => NNE.addErrorException(e))

      // if URL has a tutorial param, jump right into welcome
      if (window.utils.url.tutorial) self.welcome()

      window.utils.netitorUpdate()
      // When any layout or other transition finishes remove loader...
      window.NNW._whenCSSTransitionFinished(() => {
        document.querySelector('#loader').style.opacity = '0'
        setTimeout(() => {
          document.querySelector('#loader').style.display = 'none'
          if (!STORE.is('SHOWING')) self.faceClickHint()
        }, 1000) // NOTE this ms should match #loader transition-duration
      })
    }
  },

  welcome: () => {
    const self = window.greetings
    // self.convos = window.convos['welcome-screen'](self)
    clearTimeout(self._faceHint)
    const urlHasCode = NNE.hasCodeInHash || window.utils.url.shortCode
    const urlHasTutorial = window.utils.url.tutorial

    if (urlHasTutorial) {
      //
      //  TUTORIAL WELCCOME
      //
      window.NNT.load(urlHasTutorial, () => {
        setTimeout(() => {
          const oldUser = self.convos['url-param-tutorial-returning']
          const newUser = self.convos['url-param-tutorial-first-time']
          if (self.returningUser) window.convo = new Convo(oldUser)
          else window.convo = new Convo(newUser)
        }, STORE.getTransitionTime())
      })
    } else if (urlHasCode) {
      //
      //  PRELOADED CODE WELCOME
      //
      if (self.returningUser) {
        window.convo = new Convo(self.convos['url-param-code-returning'])
      } else {
        window.convo = new Convo(self.convos['url-param-code-first-time'])
      }
    } else if (self.returningUser) {
      //
      //  DEFAULT WELCOME
      //
      // if (STORE.history.actions.length <= 6) {
      if (self.greeted) {
        window.convo = new Convo(self.convos['default-greeting'])
      } else {
        window.convo = new Convo(self.convos['get-started-returning'])
      }
    } else {
      //
      //  NEW USER WELCOME
      //
      window.convo = new Convo(self.convos['get-started-first-time'])
    }
    self.greeted = true
  },

  faceClickHint: () => {
    window.greetings._faceHint = setTimeout(() => {
      window.convo = new window.Convo({
        content: 'pssst, click on my face', options: {}
      })
      window.NNM.setFace('^', '‿', '^', false)
    }, 5 * 1000)
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
          const c = res.data.city.substr(0, 4)
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
      window.convo = new Convo(self.convos[redirect])
    }, STORE.getTransitionTime())
  },

  handleLoginRedirect: () => {
    if (WIDGETS['functions-menu']) {
      const from = window.localStorage.getItem('pre-auth-from')
      window.localStorage.removeItem('pre-auth-from')
      if (from === 'save') WIDGETS['functions-menu'].saveProject()
      else if (from === 'open') WIDGETS['functions-menu'].openProject()
    } else setTimeout(window.utils.handleLoginRedirect, 250)
  }
}
