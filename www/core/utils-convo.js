/* global utils, WIDGETS, NNW */
window.CONVOS['utils-misc'] = (self) => {
  const a = (() => {
    let c = window.localStorage.getItem('gh-auth-temp-code')
    const gh = window.utils.url.github
    if (c) {
      window.localStorage.removeItem('gh-auth-temp-code')
      c = c.replace('__TEMP__', '')
      return c.split('/')
    } else if (gh) return window.utils.url.github.split('/')
    else return []
  })()

  const gh = (() => {
    const u = WIDGETS['student-session'].getData('username')
    const o = WIDGETS['student-session'].getData('owner')
    const p = WIDGETS['student-session'].getData('opened-project')
    return { u, o, p, url: `https://github.com/${o}/${p}` }
  })()

  return [{
    id: 'tutorial-pause-to-edit',
    content: 'Pause the video before you start editing and experimenting with the code.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'remix-github-project-logged-out',
    content: `Check out this project <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> by <a href="https://github.com/${a[0]}" target="_blank">${a[0]}</a>. If you connect me to your GitHub I can create a "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" for you so you can create your own remix from it.`,
    options: {
      'no thanks': (e) => e.hide(),
      'GitHub account?': (e) => { WIDGETS['student-session'].chatGitHubAuth() },
      'something looks off...': (e) => e.goTo('remix-github-path-issues')
    }
  }, {
    id: 'remix-github-project-logged-in',
    content: `Check out this project <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> by <a href="https://github.com/${a[0]}" target="_blank">${a[0]}</a>. If you want to remix this project I can create a "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" for you?`,
    options: {
      'no thanks': (e) => e.hide(),
      'let\'s remix it!': (e) => e.goTo('agree-to-fork'),
      'something looks off...': (e) => e.goTo('remix-github-path-issues')
    }
  }, {
    id: 'remix-github-project-logged-in-as-owner',
    content: `Welcome back ${gh.u}! Seems you followed your own share link for your <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> project. Are you just experimenting or did you want to open and keep working on this project?`,
    options: {
      'let\'s open it!': (e) => {
        e.hide(); WIDGETS.load('project-files', (w) => w.openProject(a[1]))
      },
      'something looks off...': (e) => e.goTo('remix-github-path-issues'),
      'I\'m just experimenting': (e) => {
        WIDGETS['student-session'].clearProjectData()
        e.hide()
      }
    }
  }, {
    id: 'remix-github-path-issues',
    content: `That could mean this project contains relative paths to assets in sub-folders I'm having trouble requesting. In these instances I might not render the output properly when experimenting with the code, but you can ${gh.o === a[0] ? 'open' : 'fork'} the project in order to access all the files and appropriate paths which should fix that.`,
    options: {
      'ok, let\'s do it': (e) => {
        if (gh.o === a[0]) {
          e.hide(); WIDGETS.load('project-files', (w) => w.openProject(a[1]))
        } else e.goTo('agree-to-fork')
      },
      'no thanks, I\'ll keep experimenting': (e) => e.hide()
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
