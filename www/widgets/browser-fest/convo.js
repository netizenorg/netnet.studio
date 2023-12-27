/* global WIDGETS, Convo, NNE, NNW, utils */
window.CONVOS['browser-fest'] = (self) => {
  const ssw = WIDGETS['student-session']
  return [{
    id: 'browserfest',
    content: 'BrowserFest is an online competition and celebration of creative coding on the web! Submissions are open through April 5th. Submit your sketches and remix others’ in a chance to win prizes, fame, and glory. For workshops and other ways to connect, visit <a href="https://browserfest.netizen.org/" target="_blank">browserfest.netizen.org</a>',
    options: {
      'sounds cool!': (e) => e.hide()
    }
  }, {
    id: 'bf-no-login',
    content: 'To submit to <a href="https://browserfest.netizen.org/" target="_blank">BrowserFest</a>, you need to be logged into GitHub. Let\'s get connected to your GitHub account!',
    options: {
      'how do I do that?': (e) => {
        window.convo = new Convo(ssw.convos, 'github-auth')
      },
      'what\'s GitHub?': (e) => e.goTo('what-is-github')
    }
  }, {
    id: 'what-is-github',
    content: 'GitHub is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio"',
    options: {
      'cool, how do I get started?': (e) => {
        window.convo = new Convo(ssw.convos, 'goto-github')
      }
    }
  }, {
    id: 'req-project',
    content: 'To submit to <a href="https://browserfest.netizen.org/" target="_blank">BrowserFest</a>, you need to have a project open. Do you want to open a saved project or would you like to create a new one?',
    options: {
      'open a project I made earlier': (e) => {
        WIDGETS['functions-menu'].openProject()
      },
      'start a new project': (e) => {
        if (NNW.layout === 'welcome') {
          if (utils.btoa(NNE.code) === utils.starterCodeB64) { NNE.code = '' }
          NNW.layout = 'dock-left'
          window.utils.afterLayoutTransition(() => {
            setTimeout(() => NNE.cm.refresh(), 10)
            WIDGETS['functions-menu'].newProject()
          })
        }
      }
    }
  }]
}
