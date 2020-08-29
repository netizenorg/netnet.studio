/* global Convo, Averigua, STORE, NNE */
window.greetings = {
  convos: null,
  city: null,
  loaded: { widgets: false, tutorials: false },
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

  loader: () => {
    const self = window.greetings
    window.utils.loadConvoData('welcome-screen', () => {
      self.convos = window.convos['welcome-screen'](self)
      STORE.subscribe('tutorials', (tuts) => {
        self.loaded.tutorials = true
        self.ready()
      })
      STORE.subscribe('widgets', (wigs) => {
        if (wigs.length > Object.keys(self.widgets).length) {
          self.loaded.widgets = true
          self.ready()
        }
      })
    })
  },

  ready: () => {
    const self = window.greetings
    if (self.loaded.widgets && self.loaded.tutorials) {
      document.querySelector('#loader').style.opacity = '0'
      setTimeout(() => {
        document.querySelector('#loader').style.display = 'none'
      }, 1000) // NOTE this should match #loader transition-duration
    }
  },

  injectStarterCode: () => {
    NNE.code = window.greetings.starterCode
  },

  welcome: () => {
    const self = window.greetings
    self.convos = window.convos['welcome-screen'](self)
    if (window.localStorage.getItem('username')) {
      if (STORE.history.actions.length <= 6) {
        // NOTE: 6 is based on the amount of actions that fire on launch
        // if that number has changed, we need to update it here.
        window.convo = new Convo(self.convos['get-started-returning'])
      } else {
        window.convo = new Convo(self.convos['face-click'])
      }
    } else {
      window.convo = new Convo(self.convos['get-started-first-time'])
    }
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
  }
}
