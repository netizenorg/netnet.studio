/* global Averigua, WIDGETS, NNW, NNE */
window.CONVOS['functions-menu'] = (self) => {
  const hotkey = Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
  const hotkeyname = hotkey === 'CMD' ? 'command' : 'control'

  const shareURL = (opts) => {
    opts = opts || {}
    const repo = window.localStorage.getItem('opened-project')
    const owner = window.localStorage.getItem('owner')
    const branch = window.localStorage.getItem('branch')
    const gh = (repo) ? `&gh=${owner}/${repo}/${branch}` : ''
    const hash = NNE.generateHash()
    const root = window.location.protocol + '//' + window.location.host
    if (opts.layout && opts.short) {
      return `${root}/?c=${opts.short}&layout=${opts.layout}${gh}`
    } else if (opts.layout) {
      return `${root}/?layout=${opts.layout}${gh}${hash}`
    } else if (opts.short) {
      return `${root}/?c=${opts.short}${gh}`
    } else if (gh) {
      const agh = `?gh=${owner}/${repo}/${branch}`
      return `${root}/${agh}${hash}`
    } else return `${root}/${hash}`
  }

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

  return [{
    id: 'need-to-update',
    content: `When <code>autoUpdate</code> is set to <code>false</code> you'll need to manually run the update to see your changes. You can click the <code>runUpdate()</code> button in the Functions Menu or press <b>${hotkey}+S</b>`,
    options: { 'got it': (e) => e.hide() }
  }, {
    id: 'temp-disclaimer',
    content: 'Sorry, at the moment you can only upload HTML files.',
    options: { 'ah, ok': (e) => e.hide() }
  }, {
    id: 'session-saved',
    content: 'I\'ve saved the current state of the studio to <b>Your Session Data</b>. If you quit now and come back later I\'ll give you the option to pick back up where you left off.',
    options: {
      'ok thanks!': (e) => e.hide(),
      'Can I download it?': (e) => {
        e.hide()
        self.downloadCode()
      },
      'Can I share it': (e) => self.shareSketch(),
      'session data?': () => WIDGETS.open('student-session'),
      'submit to BROWSERFEST!!!': (e) => { e.hide() }
    },
    after: () => {
      NNW.menu.textBubble.$('.text-bubble-options > button:nth-child(5)').className = 'rainbow-bg'
    }
  }, {
    id: 'blank-canvas-ready',
    content: 'Great! Here\'s a relatively blank canvas. Click on my face if you need me, or double click on any piece of code if you want me to explain it to you.',
    options: {
      'will do, thanks!': (e) => e.hide()
    }
  },
  // ...
  // ...GitHub convos...
  // ...
  // ... saving new projs...
  {
    id: 'unsaved-changes-b4-new-proj',
    content: `You have unsaved changes in your current project "${window.localStorage.getItem('opened-project')}". You should save those first.`,
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
    content: `Your project "<a href="https://github.com/${window.localStorage.getItem('owner')}/${WIDGETS['student-session'].getData('opened-project')}" target="_blank">${WIDGETS['student-session'].getData('opened-project')}</a>" has been saved to <a href="https://github.com/${WIDGETS['student-session'].getData('owner')}" target="_blank">your GitHub account</a>. If you'd like to upload images or any other assets to use in your project, click on my face to find the <b>Project Files</b> widget, or click <code>uploadAssets()</code> in the <b>Fnctions Menu</b>`,
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
    content: `The last time you saved your progress you said, "${window.localStorage.getItem('last-commit-msg')}", what has changed since then? <input placeholder="what's new?">`,
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
    content: `You have unsaved changes in your current project "${window.localStorage.getItem('opened-project')}". You should save those first.`,
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
    options: { ok: (e) => e.hide() }
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
      'I\'ll take that share link': (e) => e.goTo('generate-sketch-url'),
      'publish on the Web?': (e) => e.goTo('publish-to-web?')
    }
  }, {
    id: 'publish-to-web?',
    content: 'Because you have your project hosted on GitHub I can generate a public URL for you by enabling <a href="https://pages.github.com/" target="_blank">ghpages</a> on your repo. Would you like me to do that?',
    options: {
      'yes please!': (e) => self.publishProject(),
      'oh, no thanks': (e) => e.hide()
    }
  }, {
    id: 'published-to-ghpages',
    content: `Your project is live at <a href="${window.localStorage.getItem('ghpages')}" target="_blank">${window.localStorage.getItem('ghpages')}</a> (note: it might take a few minutes before that link works)`,
    options: {
      'great!': (e) => e.hide(),
      'can I create a custom URL?': (e) => e.goTo('custom-url')
    }
  }, {
    id: 'custom-url',
    content: 'Yes! As matter of fact you can, you\'ll first need to pay for and register a custom domain from a site like <a href="https://www.namecheap.com/" target="_blank">namecheap</a>, then you\'ll need to follow GitHub\'s instructions for <a href="https://docs.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site" target="_blank">configuring your custom domain</a>.',
    options: { 'ok, thanks!': (e) => e.hide() }
  },
  // ...
  // ...share sketch URL convos...
  // ...
  {
    id: 'generate-sketch-url',
    content: `Ok, here's a URL for your sketch! <input value="${shareURL()}" style="display: inline-block; width: 100%" onclick="this.focus();this.select()" readonly="readonly"><br><br> Your sketch isn't <i>saved</i> anywhere, in the traditional sense; the data itself is encoded in this URL. Copy+paste the URL to share your sketch with anyone on the Internet. I'll hide from view so that your masterpiece remains unobstructed.`,
    options: {
      'great, thanks!': (e) => e.hide(),
      'why is it so long?': (e) => e.goTo('why-so-long'),
      'hide from view?': (e) => e.goTo('hide-from-view-long')
    }
  }, {
    id: 'why-so-long',
    content: 'Because it contains a compressed version of all the code you\'ve typed into my editor, that way I can decode and inject it back into my editor when you share it with someone else. But I can shorten it for you if you\'d like?',
    options: {
      'let\'s shorten it!': (e) => e.goTo('confirm-shorten-url'),
      'no thanks': (e) => e.hide()
    }
  }, {
    id: 'confirm-shorten-url',
    content: 'Sure thing! But first, you should know that in order for me to shorten the URL I need to store your code on my server\'s database which means the folks at <a href="http://netizen.org" target="_blank">netizen.org</a> will be able to see it and share it with others. But it\'ll be saved anonymously, the only thing I technically need to store in order for the shortener to work is the code itself.',
    options: {
      'fine with me, let\'s shorten it!': (e) => self._shortenURL(),
      'what if i want to be credited?': (e) => e.goTo('what-if-i-want-credit'),
      'oh, never mind then': (e) => e.hide()
    }
  }, {
    id: 'what-if-i-want-credit',
    content: 'Just leave a comment in your source code with your attribution!',
    options: {
      'oh yea! just did, let\'s shorten that URL': (e) => self._shortenURL(),
      'can you show me how?': (e) => self._demonstrateCreditComment()
    }
  }, {
    id: 'show-me-how-to-comment',
    content: 'Sure thing! I\'ve just added a comment at the to of your sketch, feel free to change it to whatever you\'d like.',
    options: {
      'thanks! let\'s shorten that URL now!': (e) => self._shortenURL()
    }
  }, {
    id: 'shorten-url',
    content: `Great! here's your shortened URL: <input value="${shareURL({ short: self._tempCode || null })}" style="display: inline-block; width: 100%" onclick="this.focus();this.select()" readonly="readonly"> Copy+paste that URL to share it with others. I'll hide from view so that your masterpiece remains unobstructed.`,
    options: {
      'got it, thanks!': (e) => e.hide(),
      'hide from view?': (e) => e.goTo('hide-from-view-short')
    }
  }, {
    id: 'hide-from-view-long',
    content: `I'm assuming you don't want me showing up on the other end when you share this link? <input value="${shareURL()}" style="display: inline-block; width: 100%" onclick="this.focus();this.select()" readonly="readonly"> I'll still be accessible via shortcuts, like <b>${hotkey}+'</b> (<i>${hotkeyname} quote</i>) to open my search bar, but if you'd prefer your code to be present when you share your sketch I can modify the URL to do so?`,
    options: {
      'no thanks, i prefer you stay hidden': (e) => e.hide(),
      'yes please, i want my code present': (e) => self._shareLongCodeWithLayout()
    }
  }, {
    id: 'no-hide-long',
    content: `Sure thing, here's a new URL that'll display the code alongside your work <input value="${shareURL({ layout: NNW.layout })}" style="display: inline-block; width: 100%" onclick="this.focus();this.select()" readonly="readonly">`,
    options: {
      'great thanks!': (e) => e.hide(),
      'why is the URL so long though?': (e) => e.goTo('why-so-long')
    }
  }, {
    id: 'hide-from-view-short',
    content: `I'm assuming you don't want me showing up on the other end when you share this link? <input value="${shareURL({ short: self._tempCode || null })}" style="display: inline-block; width: 100%" onclick="this.focus();this.select()" readonly="readonly"> I'll still be accessible via shortcuts, like <b>${hotkey}+'</b> (<i>${hotkeyname} quote</i>) to open my search bar, but if you'd prefer your code to be present when you share your sketch I can modify the URL to do so?`,
    options: {
      'no thanks, i prefer you stay hidden': (e) => e.hide(),
      'yes please, i want my code present': (e) => self._shortenURL(true)
    }
  }, {
    id: 'no-hide-short',
    content: `Sure thing, here's a new URL that'll display the code alongside your work <input value="${shareURL({ layout: NNW.layout, short: self._tempCode || null })}" style="display: inline-block; width: 100%" onclick="this.focus();this.select()" readonly="readonly">`,
    options: {
      'great thanks!': (e) => e.hide()
    }
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
