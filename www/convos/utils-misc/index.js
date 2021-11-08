/* global utils, WIDGETS, NNE, NNW */
window.CONVOS['utils-misc'] = (self) => {
  const a = (() => {
    const c = window.localStorage.getItem('gh-auth-temp-code')
    const gh = window.utils.url.github
    if (c) {
      window.localStorage.removeItem('gh-auth-temp-code')
      return c.split('.com/')[1].split('/')
    } else if (gh) return window.utils.url.github.split('/')
    else return []
  })()

  const gh = (() => {
    const u = window.localStorage.getItem('username')
    const o = window.localStorage.getItem('owner')
    const p = window.localStorage.getItem('opened-project')
    return { u, o, p, url: `https://github.com/${o}/${p}` }
  })()

  return [{
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
    id: 'remix-github-project-logged-in-as-owner',
    content: `Welcome back ${gh.u}! Seems you followed your own share link for your <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> project. Are you just experimenting or did you want to open and keep working on this project?`,
    options: {
      'just experimenting': (e) => e.hide(),
      'let\'s open it!': (e) => {
        e.hide()
        WIDGETS['functions-menu']._openProject(a[1])
      }
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
  }, {
    id: 'netnet-title-bar',
    content: `Every web project begins with a folder, you named yours <code>${gh.p}</code>. The first HTML file we always create in that folder is called <code>index.html</code>, the file you're working on right now. I'm here to help you learn and create, but I don't store this data on my server, instead this file is being hosted on your personal <a href="${gh.url}" target="_blank">GitHub repo</a>`,
    options: {
      'cool!': (e) => e.hide(),
      'can I work on another file?': (e) => e.goTo('netnet-title-bar-2')
    }
  }, {
    id: 'netnet-title-bar-2',
    before: () => {
      WIDGETS['functions-menu'].open()
      WIDGETS['functions-menu'].toggleSubMenu('func-menu-my-project', 'open')
    },
    content: 'Maybe eventually, the folks at <a href="https://netizen.org" target="_blank">netizen.org</a> are constantly working on <a href="https://github.com/netizenorg/netnet.studio" target="_blank">my code</a>, but at the moment the <code>index.html</code> page is the only one you can work on. That said, if you\'d like to upload images or any other files to your project, click <code>uploadAssets()</code> in the <b>Fnctions Menu</b>',
    options: {
      'got it.': (e) => e.hide()
    }
  }]
}
