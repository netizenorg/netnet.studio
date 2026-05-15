/* global utils, WIDGETS, NNW, nn */
window.CONVOS['utils-misc'] = (self) => {
  // TODO: consider moving these all into Widget convos
  // Maybe mostly to new Project Files (&& others, ex: Coding Menu, StudentSession)
  const a = (() => {
    let c = window.localStorage.getItem('gh-auth-temp-code')
    const gh = window.utils.url.github
    if (c) {
      window.localStorage.removeItem('gh-auth-temp-code')
      c = c.replace('__GH__', '')
      return c.split('/')
    } else if (gh) return window.utils.url.github.split('/')
    else return []
  })()

  const gh = (() => {
    const u = WIDGETS['student-session'].getData('username')
    const o = WIDGETS['student-session'].getData('owner')
    return { u, o }
  })()

  const f12 = nn.platformInfo().platform.includes('Mac') ? 'Fn + F12' : 'F12'
  const safari = nn.platformInfo().name === 'Safari'
  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', rightEye: 'ŏ', lookAtCursor: false
    })
  }

  return [{
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
        e.hide(); WIDGETS.load('project-files', (w) => w.openProject(a[1]))
      },
      'I\'m just experimenting': (e) => {
        e.hide()
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
    content: 'How exciting! In order to create your own remix of this project I\'m going to "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" it to your GitHub. Forking creates an associated copy in your account. One thing to keep in mind is that I\'ll be downloading this project\'s code and running it in your browser, so make sure you trust the creator of this repo. Sounds good?',
    options: {
      'I trust it, let\'s do it!': (e) => utils.forkRepo(),
      'trust?': (e) => e.goTo('trust-code'),
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'trust-code',
    content: 'You didn\'t write this code, so it\'s important to trust the person who did. This is true anytime you run someone else\'s code in your environment, this could mean importing a library someone else wrote into your own project, installing a new extention in your browser or even installing an app you downloaded to your computer. If you didn\'t write the code, always make sure it\'s coming from a tusted source!',
    options: {
      'I trust it, let\'s fork!': (e) => utils.forkRepo(),
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'gh-redirected',
    content: `Great! I'm connected to your GitHub account, so you can now create projects! Unlike sketches, a project can include other assets (files like images, videos, audio tracks, etc) all of which get saved to your GitHub account as a repository. Read more about it on our <a href="${window.location.origin}/docs/students/coding.html" target="_blank">docs</a>.`,
    options: {
      'cool!': (e) => e.hide(),
      'create a new project?': (e) => e.goTo('gh-create-proj')
    }
  }, {
    id: 'gh-create-proj',
    content: 'You can access all the code related actions in the <b>Coding Menu</b> which you can open by clicking on my face. There you\'ll be able to save, open and create new sketchs or projects.',
    options: {
      'cool!': (e) => e.hide()
    }
  }, {
    id: 'oh-no-error',
    after: () => errorFace(),
    content: 'Oh dang! seems there was a server error... sorry about that...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => {
        e.hide()
        NNW.menu.switchFace('default')
      },
      'what was the error?': (e) => e.goTo('explain-error')
    }
  }, {
    id: 'explain-error',
    content: `The details are beyond my awareness, but if you're feeling curious you can investigate the issue yourself by pressing <code>${f12}</code> to open your browser developer tools ${safari ? '(You\'re using Safari, so you may need to enable you developer tools first)' : ''} and check the "Console". Then <a href="${window.location.origin}/docs/contributors/bug-report.html" target="_blank">report the issue</a> to let us know what you found!`,
    options: {
      ok: (e) => {
        e.hide()
        NNW.menu.switchFace('default')
      }
    }
  }]
}
