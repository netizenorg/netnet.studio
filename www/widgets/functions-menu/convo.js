/* global nn, WIDGETS, NNW, NNE, utils */
window.CONVOS['functions-menu'] = (self) => {
  const hotkey = nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
  const shareGhURL = (opts) => {
    opts = opts || {}
    const repo = window.sessionStorage.getItem('opened-project')
    const owner = window.localStorage.getItem('owner')
    const branch = window.sessionStorage.getItem('branch')
    const root = window.location.protocol + '//' + window.location.host
    return `${root}/?gh=${owner}/${repo}/${branch}`
  }

  const a = (() => {
    if (NNE._root && NNE._root.includes('.com')) {
      return NNE._root.split('.com/')[1].split('/')
    } else return []
  })()

  const createNewRepo = (c, t) => {
    const v = t.$('input').value.replace(/\s/g, '-')
    const p = /^(\w|\.|-)+$/
    if (!p.test(v)) c.goTo('explain-proj-name')
    else { c.hide(); self._createNewRepo(c, t, v) }
  }

  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', reightEye: 'ŏ', lookAtCursor: false
    })
  }

  const repoSelectionList = (() => {
    const ss = WIDGETS['student-session']
    if (ss && ss.data.github.repos) {
      let str = '<select>'
      const list = ss.data.github.repos.split(', ')
      list.forEach(r => { str += `<option value="${r}">${r}</option>` })
      str += '</select>'
      return str
    }
  })()

  const sessionSaveOpts = () => {
    const opts = {
      'ok thanks!': (e) => e.hide(),
      'Can I download this sketch?': (e) => {
        e.hide()
        self.downloadCode()
      },
      'Can I share this sketch?': (e) => self.shareSketch()
    }
    if (window.localStorage.getItem('owner')) {
      opts['can I create a new project?'] = () => self.saveProject()
    }
    opts['session data?'] = () => WIDGETS.open('student-session')
    return opts
  }

  return [{
    id: 'need-to-update',
    content: `When <code>autoUpdate</code> is set to <code>false</code> you'll need to manually run the update to see your changes. You can click the <code>runUpdate()</code> button in the Functions Menu or press <b>${hotkey}+Enter</b>`,
    options: { 'got it': (e) => e.hide() }
  }, {
    id: 'temp-disclaimer',
    content: 'Sorry, at the moment you can only upload HTML files.',
    options: { 'ah, ok': (e) => e.hide() }
  }, {
    id: 'session-saved',
    content: 'I\'ve saved the current state of the studio to <b>Your Session Data</b>. If you quit now and come back later I\'ll give you the option to pick back up where you left off.',
    options: sessionSaveOpts()
  }, {
    id: 'blank-canvas-ready',
    content: 'Great! Here\'s a relatively blank canvas. Click on my face if you need me, or double click on any piece of code if you want me to explain it to you.',
    options: {
      'will do, thanks!': (e) => e.hide()
    }
  }, {
    id: 'chatty-level-low',
    content: 'Ok, I\'ll stop explaining everything you double click on and I won\'t <i>bug</i> you about issues anymore. I\'m still here if you need me for anything else though.',
    options: { 'ok, thanks!': (e) => e.hide() }
  }, {
    id: 'chatty-level-medium',
    content: 'Ok, I\'ll stop explaining everything you double click on, but I\'ll still mark any potential issues I spot in your code.',
    options: { 'ok, thanks!': (e) => e.hide() }
  }, {
    id: 'chatty-level-high',
    content: 'Great! I\'ll let you know when I notice any potential issues in your code by marking lines with a red or yellow dot. I\'ll also explain any piece of code in the editor you double click on.',
    options: { 'ok, thanks!': (e) => e.hide() }
  },
  // ...
  // ...GitHub convos...
  // ...
  // ... saving new projs...
  {
    id: 'unsaved-changes-b4-fork-proj',
    content: `It appears you've got  <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> by <a href="https://github.com/${a[0]}" target="_blank">${a[0]}</a> open. If you want to remix this project I can now create a "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" for you?`,
    options: {
      'yea let\'s remix it!': (e) => e.goTo('agree-to-fork'),
      'no let\'s create a new project?': (e) => e.goTo('create-new-project')
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
    id: 'unsaved-changes-b4-new-proj',
    content: `You have unsaved changes in your current project "${window.sessionStorage.getItem('opened-project')}". You should save those first.`,
    options: {
      ok: (e) => self.saveProject('new-project'),
      'no, i\'ll discard the changes': (e) => e.goTo('create-new-project'),
      'actually, i\'ll keep working on this': (e) => e.hide()
    }
  }, {
    id: 'clear-code?',
    content: 'It appears you\'ve got some code in the editor, do you want this to be the start of your new project or should we delete this and start from scratch?',
    options: {
      'I want to keep it': (e) => e.goTo('create-new-project'),
      'let\'s start from scratch': (e) => {
        NNE.code = ''
        e.goTo('create-new-project')
      }
    }
  }, {
    id: 'create-new-project',
    before: () => { WIDGETS['student-session'].clearProjectData() },
    content: 'What would you like this new project to be called? <input placeholder="project-name">',
    options: {
      'save it!': (c, t) => createNewRepo(c, t),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'explain-proj-name', // if createNewRepo receives a bad name value
    content: 'Project names can not contain any special characters, try a different name. <input placeholder="project-name">',
    options: {
      'save it!': (c, t) => createNewRepo(c, t),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'project-already-exists',
    after: () => errorFace(),
    content: 'GitHub just told me that you already have a project with that name on your account, want to try a different name?',
    options: {
      ok: (e) => e.goTo('create-new-project'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'new-project-created',
    content: `Your project "<a href="https://github.com/${window.localStorage.getItem('owner')}/${WIDGETS['student-session'].getData('opened-project')}" target="_blank">${WIDGETS['student-session'].getData('opened-project')}</a>" has been saved to <a href="https://github.com/${WIDGETS['student-session'].getData('owner')}" target="_blank">your GitHub account</a>. If you'd like to upload images or any other assets to use in your project, click on my face to find the <b>Project Files</b> widget, or click <code>uploadAssets()</code> in the <b>Functions Menu</b>`,
    options: {
      'cool!': (e) => e.hide()
    }
  },
  // ... save open project
  {
    id: 'save-newish-project',
    content: 'The last time you saved this project was when you first created it, from now on everytime I "push" updates to your GitHub you\'ll need to leave a short message (one sentence) explainig what changed: <input placeholder="what\'s new?">',
    options: {
      ok: (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('again-too-long')
        else self._updateProject(v)
      },
      'why?': (e) => e.goTo('explain-versions')
    }
  }, {
    id: 'explain-versions',
    content: 'Instead of overwritting your previous HTML file, GitHub keeps track of all previous "versions" each time you save your project and so it needs some message to associate with each version as your project evolves',
    options: { 'I see.': (e) => e.goTo('save-version') }
  }, {
    id: 'save-version',
    content: 'So, what\'s changed since you first created this project? <input placeholder="what\'s new?">',
    options: {
      ok: (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('again-too-long')
        else self._updateProject(v)
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'save-open-project',
    content: `The last time you saved your progress you said, "${window.sessionStorage.getItem('last-commit-msg')}", what has changed since then? <input placeholder="what's new?">`,
    options: {
      'ok, commit and push this update': (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('again-too-long')
        else self._updateProject(v)
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'again-too-long',
    content: 'That message is too long, I need you to keep it below 72 characters <input placeholder="what\'s new?">',
    options: {
      'ok, try now': (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('again-too-long')
        else self._updateProject(v)
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'pushing-updates',
    before: () => NNW.menu.switchFace('processing'),
    content: '...sending data to GitHub...',
    options: {}
  }, {
    id: 'project-saved',
    content: 'Your project has been saved!',
    options: {
      'great, thanks!': (e) => e.hide(),
      'can I share it?': (e) => e.goTo('share-project')
    }
  },
  // ... opening old projects
  {
    id: 'unsaved-changes-b4-open-proj',
    content: `You have unsaved changes in your current project "${window.sessionStorage.getItem('opened-project')}". You should save those first.`,
    options: {
      ok: (e) => self.saveProject('open-project'),
      'no, i\'ll discard the changes': (e) => e.goTo('open-project'),
      'actually, i\'ll keep working on this': (e) => e.hide()
    }
  }, {
    id: 'open-project',
    content: `Choose the project you want me to open ${repoSelectionList}`,
    options: {
      'ok, this one': (e, t) => {
        const repo = t.$('select').value
        self._openProject(repo)
      },
      'actually, never mind': (e) => e.hide()
    }
  }, {
    id: 'opening-project',
    before: () => NNW.menu.switchFace('processing'),
    content: '...asking GitHub for data...',
    options: {}
  }, {
    id: 'not-a-web-project',
    content: 'I can only help you work on Web projects and this repo doesn\'t seem to have an <code>index.html</code> file in it\'s root directory. Want to try opening another project?',
    options: {
      ok: (e) => e.goTo('open-project'),
      'no, never mind': (e) => e.hide()
    }
  }, {
    id: 'project-opened',
    content: 'Here ya go! If you\'d like to upload images or any other assets to use in your project, click on my face to find the <b>Project Files</b> widget, or click <code>uploadAssets()</code> in the <b>Functions Menu</b>',
    options: {
      ok: (e) => e.hide()
      // 'submit to BrowserFest': (e) => {
      //   if (WIDGETS['browser-fest']) {
      //     WIDGETS['browser-fest'].submit()
      //   } else {
      //     WIDGETS.load('browser-fest', (w) => w.submit())
      //   }
      // }
    }
    // ,
    // after: () => {
    //   document.querySelector('.text-bubble-options > button:nth-child(2)')
    //     .classList.add('opt-rainbow-bg')
    // }
  },
  // ... share gh project
  {
    id: 'cant-share-project',
    content: 'You don\'t have a GitHub project open. Do you want to share the code in my editor as a sketch? Or would you like to save a new project?',
    options: {
      'save a new project': (e) => self.newProject(),
      'share as a sketch': (e) => self.shareSketch(),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'cant-publish-project',
    content: 'You don\'t have a GitHub project open for me to publish. Do you want me to save a new project for you?',
    options: {
      'yes please': (e) => self.newProject(),
      'no, never mind': (e) => e.hide()
    }
  }, {
    id: 'share-project',
    content: 'I can generate the usual share-link, but I could also publish your project to the Web for you?',
    options: {
      'I\'ll take that share link': (e) => e.goTo('share-gh-url'),
      'publish on the Web?': (e) => e.goTo('publish-to-web?')
    }
  }, {
    id: 'share-gh-url',
    content: `Sure thing, here's a URL that'll display the code alongside your work in the studio. <input value="${shareGhURL()}" style="display: inline-block; width: 100%" onclick="utils.copyLink(this)" readonly="readonly"><br><br> If you prefer your code not be present consider publishing your project on the Web.`,
    options: {
      'great thanks!': (e) => e.hide(),
      'publish on the Web?': (e) => e.goTo('publish-to-web?')
    }
  }, {
    id: 'publish-to-web?',
    content: `You could always <a href="https://github.com/${window.localStorage.getItem('owner')}/${WIDGETS['student-session'].getData('opened-project')}/${WIDGETS['student-session'].getData('branch')}.zip" target="_blank">download your project</a> and upload it to your preferred Web host. But, because you have your project saved to your GitHub I can also generate a public URL for you by enabling <a href="https://pages.github.com/" target="_blank">ghpages</a> on your repo. Would you like me to do that?`,
    options: {
      'yes please!': (e) => self.publishProject(),
      'oh, no thanks': (e) => e.hide()
    }
  }, {
    id: 'published-to-ghpages',
    content: `Your project is live at <a href="${window.sessionStorage.getItem('ghpages')}" target="_blank">${window.sessionStorage.getItem('ghpages')}</a> (note: it might take a few minutes before that link works)`,
    options: {
      'great!': (e) => e.hide(),
      'can I create a custom URL?': (e) => e.goTo('custom-url')
    }
  }, {
    id: 'custom-url',
    content: 'Yes! As matter of fact you can, you\'ll first need to pay for and register a custom domain from a site like <a href="https://www.namecheap.com/" target="_blank">namecheap</a>, then you\'ll need to follow GitHub\'s instructions for <a href="https://docs.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site" target="_blank">configuring your custom domain</a>.',
    options: { 'ok, thanks!': (e) => e.hide() }
  }, {
    id: 'ok-processing',
    content: 'Ok ...processing...',
    options: {}
  }, {
    id: 'oh-no-error',
    after: () => errorFace(),
    content: 'Oh dang! seems there was a server error... sorry about that...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => e.hide()
    }
  }, {
    id: 'coming-soon',
    content: 'Sorry, that feature is still being refactored, should be ready again soon.',
    options: { 'ah, ok': (e) => e.hide() }
  }]
}
