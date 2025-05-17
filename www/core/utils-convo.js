/* global utils, WIDGETS, NNW, nn */
window.CONVOS['utils-misc'] = (self) => {
  if (!self._crErr) self._crErr = {}

  const Mac = nn.platformInfo().platform.includes('Mac')

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
      'let\'s open it!': (e) => {
        e.hide()
        e.hide(); WIDGETS.load('project-files', (w) => w.openProject(a[1]))
      },
      'just experimenting': (e) => e.hide()
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
    id: 'custom-renderer-error',
    content: `<i>Your browser passed me this error</i>:<br><span style="font-family: fira-code, inconsolata, monospace">${self._crErr.message}</span>`,
    options: {
      'ok, I\'ll fix it': (e) => e.hide(),
      'what does that mean?': (e) => e.goTo('custom-renderer-error2'),
      'my browser did?': (e) => e.goTo('custom-renderer-error3')
    }
  }, {
    id: 'custom-renderer-error2',
    content: 'When I review your code for mistakes I try to explain them in a clear way, but this isn\'t an issue I caught. This was an error your browser informed me of after we ran your code, and the browser errors aren\'t always easy to make sense of, but your browser might have more info which could help!',
    options: {
      ok: (e) => e.hide(),
      'my browser did?': (e) => e.goTo('custom-renderer-error3')
    }
  }, {
    id: 'custom-renderer-error3',
    content: `Your browser converts the code you write into the rendered output we see. When it does this, it also catches any errors I missed before rendering and displays them in the <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools" target="_blank">developer tools</a>. To open them press <code>${Mac ? 'Fn + ' : ''}F12</code> and then switch to the "Console" tab. You can learn more about the error there.`,
    options: {
      ok: (e) => e.hide()
    }
  }]
}
