/* global nn, WIDGETS, NNW, NNE, utils */
window.CONVOS['functions-menu'] = (self) => {
  const hotkey = nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
  const shareGhURL = (opts) => {
    opts = opts || {}
    const repo = WIDGETS['student-session'].getData('opened-project')
    const owner = WIDGETS['student-session'].getData('owner')
    const branch = WIDGETS['student-session'].getData('branch')
    const root = window.location.protocol + '//' + window.location.host
    return `${root}/?gh=${owner}/${repo}/${branch}`
  }

  const a = (() => {
    const ss = WIDGETS['student-session']
    if (utils.url.github) {
      return utils.url.github.split('/')
    } else if (ss.getData('opened-project')) {
      return [ss.getData('owner'), ss.getData('opened-project')]
    } else return []
  })()

  const createNewRepo = (c, t) => {
    const v = t.$('input').value.replace(/\s/g, '-')
    const p = /^(\w|\.|-)+$/
    if (!p.test(v)) c.goTo('explain-proj-name')
    else { c.hide(); self._createNewRepo(c, t, v) } // TODO: MARK FOR DELETION
    // TODO: need to replace _createNewRepo with something else
  }

  // const repoSelectionList = (() => {
  //   const ss = WIDGETS['student-session']
  //   if (ss && ss.data.github.repos) {
  //     let str = '<select class="dropdown dropdown--invert">'
  //     const list = ss.data.github.repos.split(', ')
  //     list.forEach(r => { str += `<option value="${r}">${r}</option>` })
  //     str += '</select>'
  //     return str
  //   }
  // })()

  const sessionSaveOpts = () => {
    const opts = {
      'ok thanks!': (e) => e.hide(),
      'Can I download this sketch?': (e) => {
        e.hide()
        self.downloadCode()
      },
      'Can I share this sketch?': (e) => WIDGETS.open('share-widget')
    }
    if (window.localStorage.getItem('owner')) {
      opts['can I create a new project?'] = () => self._newProject()
    }
    opts['session data?'] = () => WIDGETS.open('student-session')
    return opts
  }

  return [{
    id: 'need-to-update',
    content: `When <code>auto-update</code> is set to <code>false</code> you'll need to manually run the update to see changes you make to your sketch by pressing the <b>${hotkey}+Enter</b> keys on your keyboard`,
    options: { 'got it': (e) => e.hide() }
  }, {
    id: 'need-to-update2',
    content: `The <code>auto-update</code> setting only applies when working on a "sketch". At the moment you're working on a "project", so you can simply run <b>${hotkey}+S</b> to save your code and update the rendering`,
    options: {
      'got it': (e) => e.hide(),
      'what\'s the difference?': (e) => e.goTo('proj-or-sketch-diff-optHide')
    }
  }, {
    id: 'proj-or-sketch-diff-optHide',
    content: 'By default I\'m designed to help you work on a single <a href="http://luckysoap.com/statements/handmadeweb.html" target="_blank">hand-crafted</a> HTML page, what we call a "sketch." These can be shared using URLs (we don\'t save your sketch on our servers, the data itself is encoded in the URL). But if you\'d like to work on a web page that involves other files or assets (like fonts, images or videos) then you can create a "project." Again, we don\'t store your code on our server, but you can connect me to your GitHub account and I can save your work there for you. We can also use GitHub\'s servers (via <a href="https://pages.github.com/" target="_blank">GitHub Pages</a>) to publish your project on the web.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'temp-disclaimer',
    content: 'Sorry, at the moment you can only upload HTML files.',
    options: { 'ah, ok': (e) => e.hide() }
  }, {
    id: 'session-saved',
    content: 'I\'ve saved the current state of the studio to <b>Your Session Data</b>. If you quit now and come back later to sketch, I\'ll give you the option to pick back up where you left off.',
    options: sessionSaveOpts()
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
    id: 'new-proj-or-sketch',
    content: 'Would you like to start from scratch with a blank <b>sketch</b>? Or are you interested in starting a new <b>project</b>?',
    options: {
      'new sketch': (e) => {
        if (WIDGETS['project-files']?.changes.length > 0) return e.goTo('save-reminder-b4-sketch')
        WIDGETS['student-session'].clearProjectData()
        if (NNE.code === '') e.goTo('already-blank-sketch')
        else self._newSketch()
      },
      'new project': (e) => {
        if (WIDGETS['project-files']?.changes.length > 0) return e.goTo('save-reminder-b4-proj')
        WIDGETS['student-session'].clearProjectData()
        self._newProject()
      },
      'what\'s the difference?': (e) => e.goTo('proj-or-sketch-diff-optNew'),
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'new-proj-or-sketch2',
    content: 'You\'re currently working on a project, if you\'d like to create a new file or folder in that project use the <span class="link" onclick="WIDGETS.open(\'project-files\')">Project Files</span>. Otherwise, if you\'d like to start working on something new, we can create a blank <b>sketch</b>? Or maybe you\'re interested in starting a new <b>project</b>?',
    options: {
      'new sketch': (e) => {
        if (WIDGETS['project-files'].changes.length > 0) return e.goTo('save-reminder-b4-sketch')
        WIDGETS['student-session'].clearProjectData()
        if (NNE.code === '') e.goTo('already-blank-sketch')
        else self._newSketch()
      },
      'new project': (e) => {
        if (WIDGETS['project-files'].changes.length > 0) return e.goTo('save-reminder-b4-proj')
        WIDGETS['student-session'].clearProjectData()
        self._newProject()
      },
      'what\'s the difference?': (e) => e.goTo('proj-or-sketch-diff-optNew'),
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'save-reminder-b4-sketch',
    content: `It looks like ${WIDGETS['project-files']?.changes.length} of your files ${WIDGETS['project-files']?.changes.length > 1 ? 'have' : 'has'} been created or updated since you last "pushed" your files to GitHub. If you start a new sketch now, those changes will be lost. Click the <code>git push</code> button in the <span class="link" onclick="WIDGETS.open('project-files')">Project Files</span> widget to backup your work.`,
    options: {
      'ok, I will': (e) => e.hide(),
      'that\'s ok, I don\'t need to save it.': (e) => {
        WIDGETS['student-session'].clearProjectData()
        if (NNE.code === '') e.goTo('already-blank-sketch')
        else self._newSketch()
      }
    }
  }, {
    id: 'save-reminder-b4-proj',
    content: `It looks like ${WIDGETS['project-files']?.changes.length} of your files ${WIDGETS['project-files']?.changes.length > 1 ? 'have' : 'has'} been created or updated since you last "pushed" your files to GitHub. If you start a new project now, those changes will be lost. Click the <code>git push</code> button in the <span class="link" onclick="WIDGETS.open('project-files')">Project Files</span> widget to backup your work.`,
    options: {
      'ok, I will': (e) => e.hide(),
      'that\'s ok, I don\'t need to save it.': (e) => {
        WIDGETS['student-session'].clearProjectData()
        self._newProject()
      }
    }
  }, {
    id: 'already-blank-sketch',
    content: 'Great! There isn\'t any code in my editor yet, so you\'ve essentially got a blank canvas to start sketching! If you\'re looking for some inspiration check out the <span class="link" onclick="WIDGETS.open(\'code-examples\')">Code Examples</span> widget!',
    options: {
      'got it': (e) => e.hide()
    }
  },
  {
    id: 'proj-or-sketch-diff-optNew',
    content: 'By default I\'m designed to help you work on a single <a href="http://luckysoap.com/statements/handmadeweb.html" target="_blank">hand-crafted</a> HTML page, what we call a "sketch." These can be shared using URLs (we don\'t save your sketch on our servers, the data itself is encoded in the URL). But if you\'d like to work on a web page that involves other files or assets (like fonts, images or videos) then you can create a "project." Again, we don\'t store your code on our server, but you can connect me to your GitHub account and I can save your work there for you. We can also use GitHub\'s servers (via <a href="https://pages.github.com/" target="_blank">GitHub Pages</a>) to publish your project on the web.',
    options: {
      'got it': (e) => e.goTo('new-proj-or-sketch')
    }
  },
  {
    id: 'viewing-prev-saved-proj',
    content: `It appears you're experimenting with your project <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a>. Would you like me to open it so you can continue working on it?`,
    options: {
      'yes open it': (e) => self.openFile(),
      'no, let\'s create something new': (e) => self.new(),
      'oh, never mind then': (e) => e.hide()
    }
  },
  {
    id: 'unsaved-changes-b4-fork-proj-logged-out',
    content: `It appears you've got  <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> by <a href="https://github.com/${a[0]}" target="_blank">${a[0]}</a> open. If you connect me to your GitHub I can create a "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" for you so you can create your own remix from it.`,
    options: {
      'GitHub account?': (e) => { WIDGETS['student-session'].chatGitHubAuth() },
      'no, let\'s create something new': (e) => self.new(),
      'oh, never mind then': (e) => e.hide()
    }
  },
  {
    id: 'unsaved-changes-b4-fork-proj',
    content: `It appears you've got  <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> by <a href="https://github.com/${a[0]}" target="_blank">${a[0]}</a> open. If you want to remix this project I can now create a "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" for you?`,
    options: {
      'yea let\'s remix it!': (e) => e.goTo('agree-to-fork'),
      'no, let\'s create something new': (e) => self.new(),
      'oh, never mind then': (e) => e.hide()
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
    content: `You have unsaved changes in your current project "${WIDGETS['student-session'].getData('opened-project')}". You should save those first.`,
    options: {
      ok: (e) => self.saveProject('new-project'), // TODO: must update (some method in PF)
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
    after: () => NNW.menu.switchFace('error'),
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
    content: `The last time you saved your progress you said, "${WIDGETS['student-session'].getData('last-commit-msg')}", what has changed since then? <input placeholder="what's new?">`,
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
    id: 'open-logged-out',
    content: 'If you connect me to GitHub we could open any web projects you\'ve saved there, otherwise we could load an HTML file you have saved on your computer?',
    options: {
      'login to GitHub': (e) => {
        e.hide(); self._login()
      },
      'open file from computer': (e) => {
        e.hide(); self.uploadCode()
      }
    }
  },
  {
    id: 'open-logged-in',
    content: 'Would you like to open a project you were working on from GitHub or load an HTML file from your computer?',
    options: {
      'open a GitHub project': (e) => {
        e.hide(); WIDGETS.load('project-files', (w) => w.openProject())
      },
      'open an HTML file': (e) => {
        e.hide(); self.uploadCode()
      },
      'neither, never mind': (e) => e.hide()
    }
  },
  {
    id: 'open-logged-in-proj',
    content: `You currently have your project "${WIDGETS['student-session'].getData('opened-project')}" open, do you want to close it and open a new one? Remember, you can only work on 1 project at a time (if you have project opened on another tab, there will be bugs).`,
    options: {
      'no, never mind': (e) => e.hide(),
      'yes, open a new one': (e) => {
        if (WIDGETS['project-files']?.changes.length > 0) e.goTo('save-reminder-b4-open')
        else { e.hide(); WIDGETS.load('project-files', (w) => w.openProject()) }
      }
    }
  },
  {
    id: 'save-reminder-b4-open',
    content: `It looks like ${WIDGETS['project-files']?.changes.length} of your files ${WIDGETS['project-files']?.changes.length > 1 ? 'have' : 'has'} been created or updated since you last "pushed" your files to GitHub. If you open a new project now, those changes will be lost. Click the <code>git push</code> button in the <span class="link" onclick="WIDGETS.open('project-files')">Project Files</span> widget to backup your work.`,
    options: {
      'ok, I will': (e) => e.hide(),
      'that\'s ok, I don\'t need to save it.': (e) => {
        e.hide(); WIDGETS.load('project-files', (w) => w.openProject())
      }
    }
  },
  {
    id: 'unsaved-changes-b4-open-proj',
    content: `You have unsaved changes in your current project "${WIDGETS['student-session'].getData('opened-project')}". You should save those first.`,
    options: {
      ok: (e) => self.saveProject('open-project'), // TODO: must update
      'no, i\'ll discard the changes': (e) => e.goTo('open-project'),
      'actually, i\'ll keep working on this': (e) => e.hide()
    }
  },
  // ... share gh project
  {
    id: 'cant-share-project', // TODO: MARK FOR DELETION
    content: 'You don\'t have a GitHub project open. Do you want to share the code in my editor as a sketch? Or would you like to save a new project?',
    options: {
      'save a new project': (e) => self.newProject(),
      'share as a sketch': (e) => WIDGETS.open('share-widget'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'cant-publish-project', // TODO: MARK FOR DELETION
    content: 'You don\'t have a GitHub project open for me to publish. Do you want me to save a new project for you?',
    options: {
      'yes please': (e) => self.newProject(),
      'no, never mind': (e) => e.hide()
    }
  }, {
    id: 'share-project',
    content: 'I can generate a share-link to netnet.studio, but I could also publish your project to the Web for you?',
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
    id: 'share-my-gh-project',
    content: `It appears you're viewing your project <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a>. Which you can share with others with this link <input value="https://netnet.studio/?gh=${utils.url.github}" style="display: inline-block; width: 100%" onclick="utils.copyLink(this)" readonly="readonly"> but if you open this project we could also publish it on the web so you could share a public URL instead of sending them to netnet.`,
    options: {
      'ok thanks': (e) => e.hide(),
      'can I open this project?': (e) => self.openFile()
    }
  }, {
    id: 'share-other-gh-project',
    content: `Your viewing ${utils.url.github ? utils.url.github.split('/')[0] : ''}'s project, if you'd like to share it with others here in the studio you can use this link <input value="https://netnet.studio/?gh=${utils.url.github}" style="display: inline-block; width: 100%" onclick="utils.copyLink(this)" readonly="readonly">`,
    options: {
      'great thanks!': (e) => e.hide()
    }
  }, {
    id: 'publish-to-web?',
    content: `You could always <a href="https://github.com/${window.localStorage.getItem('owner')}/${WIDGETS['student-session'].getData('opened-project')}/${WIDGETS['student-session'].getData('branch')}.zip" target="_blank">download your project</a> and upload it to your preferred Web host. But, because you have your project saved to your GitHub I can also generate a public URL for you by enabling <a href="https://pages.github.com/" target="_blank">ghpages</a> on your repo. Would you like me to do that?`,
    options: {
      'yes please!': (e) => WIDGETS['project-files'].publishProject(),
      'oh, no thanks': (e) => e.hide()
    }
  }, { // TODO: should be part of new Project Files widget
    id: 'published-to-ghpages', // TODO: MARK FOR DELETION (only referenced in 1 function marked for deletion)
    content: `Your project is live at <a href="${WIDGETS['student-session'].getData('ghpages')}" target="_blank">${WIDGETS['student-session'].getData('ghpages')}</a> (note: it might take a few minutes before that link works)`,
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
    after: () => NNW.menu.switchFace('error'),
    content: 'Oh dang! seems there was a server error, sorry about that... try refreshing this page, if that doesn\'t work consider logging out and logging back in again.',
    options: {
      'let\'s reboot!': (e) => window.location.reload(),
      'how do I log out?': (e) => {
        if (!self.opened) self.open()
        NNW.menu.switchFace('default')
        e.goTo('how2-logout')
      },
      'it\'s ok, never mind': (e) => {
        NNW.menu.switchFace('default')
        e.hide()
      }
    }
  }, {
    id: 'how2-logout',
    content: 'Press the "lougout" button in then <b>Functions Menu</b>, the press "login" to log back in with your GitHub account.',
    options: { 'got it!': (e) => e.hide() }
  }, {
    id: 'coming-soon',
    content: 'Sorry, that feature is still being refactored, should be ready again soon.',
    options: { 'ah, ok': (e) => e.hide() }
  }]
}
