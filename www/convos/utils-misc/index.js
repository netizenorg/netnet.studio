/* global utils, WIDGETS, NNW */
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
    const p = window.sessionStorage.getItem('opened-project')
    return { u, o, p, url: `https://github.com/${o}/${p}` }
  })()

  return [{
    id: 'demo-example',
    content: 'Check out this example! Try editing and experimenting with the code. Double click any piece of code you don\'t understand and I\'ll do my best to explain it to you.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'demo-explainer',
    content: 'Check out this example! I can walk you through it if you\'d like me to explain the different parts? Otherwise feel free to edit and experiment with the code yourself. You can also double click any piece of code you don\'t understand and I\'ll do my best to explain that bit to you.',
    options: {
      'yes, please walk me through it!': (e) => {
        WIDGETS['code-examples'].explainExample()
        e.hide()
      },
      'no thanks, I\'m just experimenting': (e) => e.hide()
    }
  }, {
    id: 'demo-ex-from-list',
    content: 'I\'ve copied the example into my editor, remix it and make it your own!',
    options: { thanks: (e) => e.hide() }
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
    content: `Welcome back ${gh.u}! Seems you followed your own share link for your <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> project. Would you like me to open it so you can keep working on this project, or are you just experimenting?`,
    options: {
      'let\'s open it!': (e) => {
        e.hide()
        WIDGETS['functions-menu']._openProject(a[1])
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
    id: 'netnet-title-bar-index',
    before: () => WIDGETS.open('files-and-folders'),
    content: `Every web project begins with a folder, you named yours <code>${gh.p}</code>, the first HTML file we always create in that folder is called <code>index.html</code>, the file you're working on right now. The other files in your project's "root directory" (the <code>${gh.p}</code> folder) can be accessed in the <b>Files And Folders</b> widget. But remember, I'm not saving these files on my server, instead they're being saved on your <a href="${gh.url}" target="_blank">GitHub repo</a>.`,
    options: {
      'cool!': (e) => e.hide(),
      'can I work on another file?': (e) => e.goTo('netnet-title-bar-2'),
      ok: (e) => e.hide()
    }
  }, {
    id: 'netnet-title-bar-readme',
    before: () => WIDGETS.open('files-and-folders'),
    content: `When you create a versioned code project on GitHub (aka a "repository" or "repo" for short) it's customary to include a file called <code>README.md</code> in your project's "root directory" (your project's main folder <code>${gh.p}</code>), this file is "metadata", meaning it's information <i>about</i> your project. You can write whatever you want here using a simple markup language called <a href="https://www.markdownguide.org/basic-syntax" target="_blank">markdown</a>, this is the first thing someone will see when they checkout your code on <a href="${gh.url}" target="_blank">GitHub</a>.`,
    options: {
      'I see.': (e) => e.hide()
    }
  }]
}
