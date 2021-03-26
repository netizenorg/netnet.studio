/* global utils, WIDGETS, NNE, NNW */
window.CONVOS['utils-misc'] = (self) => {
  // ... TODO: convo for "forking" when a ?gh= is present/loaded
  const a = (() => {
    const c = window.localStorage.getItem('gh-auth-temp-code')
    const gh = window.utils.url.github
    if (c) {
      window.localStorage.removeItem('gh-auth-temp-code')
      return c.split('.com/')[1].split('/')
    } else if (gh) return window.utils.url.github.split('/')
    else return []
  })()
  return [{
    id: 'num-helper',
    content: 'Ok, I\'ll increase the value when you press the up arrow key and decrease it when you press the down arrow key. I\'ll adjust it by 10 if you hold the shift key. Press enter when you\'re finished adjusting the value.',
    options: {
      ok: (e) => { NNE.spotlight(null); utils.numHelper(false); e.hide() }
    }
  }, {
    id: 'demo-example',
    content: 'Check out this example I made! Try editing and experimenting with the code. Double click any piece of code you don\'t understand and I\'ll do my best to explain it to you.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'tutorial-pause-to-edit',
    content: 'Pause the video before you start editing and experimenting with the code.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'remix-github-project-logged-out',
    content: `Check out this project <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> by <a href="https://github.com/${a[0]}" target="_blank">${a[0]}</a>. If you connect me to your GitHub I can create a "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" for you so you can create your own remix from it.`,
    options: {
      'no thanks': (e) => e.hide(),
      'GitHub account?': (e) => { WIDGETS['student-session'].chatGitHubAuth() }
    }
  }, {
    id: 'remix-github-project-logged-in',
    content: `Check out this project <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> by <a href="https://github.com/${a[0]}" target="_blank">${a[0]}</a>. If you want to remix this project I can create a "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" for you?`,
    options: {
      'no thanks': (e) => e.hide(),
      'let\'s remix it!': (e) => e.goTo('agree-to-fork')
    }
  }, {
    id: 'remix-github-project-auth-redirect',
    content: `Great, we're connected to GitHub now! Before we did that, you were checking out this project <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> by <a href="https://github.com/${a[0]}" target="_blank">${a[0]}</a>. If you want to remix this project I can now create a "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" for you?`,
    options: {
      'no thanks': (e) => e.hide(),
      'yea let\'s remix it!': (e) => e.goTo('agree-to-fork'),
      'can I create a new project?': (e) => e.goTo('gh-create-proj')
    }
  }, {
    before: () => { if (NNW.layout === 'welcome') NNW.layout = 'dock-left' },
    id: 'agree-to-fork',
    content: 'How exciting! In order to create your own remix of this project I\'m going to "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" it to your GitHub. Forking creates an associated copy onto your account. Sounds good?',
    options: {
      'let\'s do it!': (e) => utils.forkRepo(),
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'gh-redirected',
    content: 'Great! I\'m connected to your GitHub account, so you can now create projects! Unlike sketches, a project can include other assets (files like images, videos, audio tracks, etc) all of which get saved to your GitHub account as a repository.',
    options: {
      'cool!': (e) => e.hide(),
      'create a new project?': (e) => e.goTo('gh-create-proj')
    }
  }, {
    id: 'gh-create-proj',
    content: 'You can access all the project related functions in my <b>Functions Menu</b> which you can open by clicking on my face. There you\'ll be able to create, save and open projects as well as upload assets like images, video or audio files.',
    options: {
      'cool!': (e) => e.hide()
    }
  }]
}
