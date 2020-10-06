/* global Averigua, NNE, STORE */
window.convos['functions-menu'] = (self) => {
  const hotkey = Averigua.platformInfo().platform.includes('Mac')
    ? 'CMD' : 'CTRL'
  return [{
    id: 'user-needs-login-to-save',
    content: 'In order to save a project you need to be logged in with a GitHub account. Or I could generate a share link for you instead?',
    options: {
      'ok, I\'ll login': () => self._githubAuth('save'),
      'what\'s GitHub?': (e) => {
        self._redirectToGitHubFrom = 'save'
        e.goTo('github')
      },
      'I\'ll take that share link instead': () => self.shareLink()
    }
  }, {
    id: 'github',
    content: '<a href="https://github.com/" target="_blank">GitHub</a> is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio". I can save your projects to GitHub for you, but I need to know your GitHub account.',
    options: {
      'ok, how\'s that work?': (e) => e.goTo('how-github'),
      'what if I don\'t have a GitHub': (e) => e.goTo('what-if-no-github'),
      'oh, never mind then': (e) => e.hide()
    }
  }, {
    id: 'how-github',
    content: 'I\'ll send you over to GitHub, from there you can let them know you want to authorize me to save and upload projects to your account. After that they\'ll send you back here and we\'ll take it from there.',
    options: {
      'ok, let\'s do it!': (e) => self._githubAuth(self._redirectToGitHubFrom),
      'what if I don\'t have a GitHub': (e) => e.goTo('what-if-no-github'),
      'actually, never mind': (e) => e.hide()
    }
  }, {
    id: 'what-if-no-github',
    content: 'Not a problem, when I send you over to GitHub they\'ll walk you through the process of creating a new account. Once you\'ve got that setup, you can authorize me to so save and upload projects and then GitHub should send you back over here so we can keep working together.',
    options: {
      'ok, let\'s do it!': (e) => self._githubAuth(self._redirectToGitHubFrom),
      'actually, never mind': (e) => e.hide()
    }
  }, {
    id: 'user-needs-login-to-open',
    content: 'In order to open a previously saved project you need to be logged in with a GitHub account.',
    options: {
      'ok, I\'ll login': () => self._githubAuth('open'),
      'what\'s GitHub?': (e) => {
        self._redirectToGitHubFrom = 'open'
        e.goTo('github')
      },
      'ah, never mind then': (e) => e.hide()
    }
  }, {
    id: 'share-saved-project',
    content: `You're currently working on a project you have saved on <a href="https://github.com/${window.localStorage.getItem('owner')}/${window.localStorage.getItem('opened-project')}" target="_blank">your GitHub</a>, so I can't generate the usual URL encoded share link for you. But we could ask GitHub to "host" it so anyone can view it online?`,
    options: {
      ok: () => self._publishProject(),
      'what does that mean?': (e) => e.goTo('hosting'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'hosting',
    content: 'Essentially, we\'re asking GitHub to act as your web server so that when Internet users "request" the site, GitHub will "serve" it to them',
    options: {
      'ok let\'s do that': () => self._publishProject(),
      'what\'s a request?': (e) => e.goTo('req'),
      'oh, never mind then': (e) => e.hide()
    }
  }, {
    id: 'req',
    content: 'A "request" is a packet of data sent from an Internet user\'s device to the server, in this case GitHub, asking for a copy of the site so they can see it on their web browser.',
    options: {
      'ok let\'s do it': () => self._publishProject(),
      'oh, never mind then': (e) => e.hide()
    }
  }, {
    id: 'share-sketch',
    content: 'The URL has been udpated to include your sketches data! Copy the URL from your browser\'s address bar to share it It\'s long because it contains all your code, but if you\'d like we can generate a short URL for you?',
    options: {
      'no, that\'s alright': (e) => e.hide(),
      'yes please': self._shortenURL()
    }
  }, {
    id: 'url-shortened',
    content: `Ok! here's your shortened URL: <input value="${window.localStorage.getItem('project-url')}"><br>If you want me to hide when you share this sketch use this URL: <input value="${window.localStorage.getItem('project-url')}&opacity=0"><br>My URL shortener is still a <i>beta</i> feature, so I'd also recommend running the <code>downloadCode()</code> function to save a copy of your sketch on your own computer.`,
    options: { 'thanks!': (e) => e.hide() }
  }, {
    id: 'create-new-project',
    content: 'What would you like this project to be called? <input placeholder="project-name">',
    options: {
      'save it!': (c, t) => {
        const v = t.$('input').value.replace(/\s/g, '-')
        const p = /^(\w|\.|-)+$/
        if (!p.test(v)) c.goTo('explain-proj-name')
        else self._createNewRepo(c, t, v)
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'explain-proj-name',
    content: 'Project names can not contain any special characters, try a different name. <input placeholder="project-name">',
    options: {
      'save it!': (c, t) => {
        const v = t.$('input').value.replace(/\s/g, '-')
        const p = /^(\w|\.|-)+$/
        if (!p.test(v)) c.goTo('explain')
        else self._createNewRepo(c, t, v)
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'new-project-created',
    content: `Your project "<a href="https://github.com/${window.localStorage.getItem('owner')}/${window.localStorage.getItem('opened-project')}" target="_blank">${window.localStorage.getItem('opened-project')}</a>" has been saved to <a href="https://github.com/${window.localStorage.getItem('owner')}" target="_blank">your GitHub account</a>`,
    options: {
      'cool!': (e) => e.hide()
    }
  }, {
    id: 'project-already-exists',
    content: 'GitHub just told me that you already have a project with that name on your account, want to try a different name?',
    options: {
      ok: () => self.saveProject(),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'save-newish-project',
    content: 'The last time you saved this project was when you first created it, from now on everytime I "push" updates to your GitHub account you\'ll need to leave a short message (one sentence) explainnig what changed: <input placeholder="what\'s new?">',
    options: {
      ok: (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('again')
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
      }
    }
  }, {
    id: 'again-too-long',
    content: 'That message is too long, I need you to keep it below 72 characters <input placeholder="what\'s new?">',
    options: {
      ok: (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('again-too-long')
        else self._updateProject(v)
      }
    }
  }, {
    id: 'save-open-project',
    content: `The last time you saved your progress you said, "${window.localStorage.getItem('last-commit-msg')}", what has changed since then? <input placeholder="what's new?">`,
    options: {
      ok: (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('again-too-long')
        else self._updateProject(v)
      }
    }
  }, {
    id: 'project-saved',
    content: 'Your project has been saved!',
    options: { 'great!': (e) => e.hide() }
  }, {
    id: 'start-new-project',
    content: `Ok, I'll go ahead and close the "${window.localStorage.getItem('opened-project')}" project. You can use the <code>openProject()</code> function later if you'd like to reopen it.`,
    options: {
      ok: (e) => {
        self._newProject()
        e.hide()
      },
      'never mind, i\'ll keep working on this': (e) => e.hide()
    }
  }, {
    id: 'unsaved-changes',
    content: `You have unsaved changes to your current project "${window.localStorage.getItem('opened-project')}". You should save those first.`,
    options: {
      ok: (e) => self.saveProject(),
      'no, i\'ll discard the changes': (e) => {
        self._newProject()
        e.hide()
      },
      'actually, i\'ll keep working on this': (e) => e.hide()
    }
  }, {
    id: 'reboot-netnet',
    content: 'This won\'t just refresh the browser, this will also clear all your current settings. You sure you want to reboot me?',
    options: {
      'yes, lets do it!': () => window.utils.clearAllData(),
      'no, never mind.': (e) => e.hide(),
      'wait, explain that': (e) => e.goTo('explain-reboot')
    }
  }, {
    id: 'explain-reboot',
    content: 'Specifically, it will reset the current layout and color theme back to their defaults, close any running tutorials, unstar any stared-widgets, close any open projets and clear any code in my editor. It\'ll be like we just met. Should i reboot?',
    options: {
      'yes, lets do it!': () => window.utils.clearAllData(),
      'no, never mind.': (e) => e.hide()
    }
  }, {
    id: 'publish-to-ghpages',
    content: `Your project is live at <a href="${window.localStorage.getItem('project-url')}" target="_blank">${window.localStorage.getItem('project-url')}</a> (note: it might take a few minutes before that link works)`,
    options: {
      'great!': (e) => e.hide(),
      'can I change that URL?': (e) => e.goTo('custom-url')
    }
  }, {
    id: 'custom-url',
    content: 'Yes! As matter of fact you can, you\'ll first need to pay for and register a custom domain from a site like <a href="https://www.namecheap.com/" target="_blank">namecheap</a>, then you\'ll need to follow GitHub\'s instructions for <a href="https://docs.github.com/en/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site" target="_blank">configuring your custom domain</a>.',
    options: { 'ok, thanks!': (e) => e.hide() }
  }, {
    id: 'exit-tutorial',
    content: 'Pressing that button right now will quit the tutorial we\'re currently having, you sure you want to do that?',
    options: {
      'No, never mind': (e) => e.hide(),
      'Yes, I\'ll return to the tutorial later.': (e) => {
        self.close()
        const code = NNE._encode(NNE.code)
        if (code !== NNE._encode(window.greetings.getStarterCode()) &&
        code !== 'eJyzUXTxdw6JDHBVyCjJzbEDACErBIk=' &&
        code !== 'eJyzUXTxdw6JDHBVyCjJzbHjAgAlvgST') {
          window.localStorage.setItem('code', code)
        }
        STORE.dispatch('TUTORIAL_FINISHED')
        window.greetings.startMenu()
      }
    }
  }, {
    id: 'errors-reset-confirmation',
    content: 'Your previously ignored errors have been reset, i\'ll <i>bug</i> you about all the default errors from now on.',
    options: { cool: (e) => e.hide() }
  }, {
    id: 'confirm-errors-reset',
    content: 'If you run this function I\'ll forget about every "error" you\'ve ever asked me to ignore. You sure you want to erase that part of my memory?',
    options: {
      'let\'s do it': (e) => {
        self._resetErrors()
        e.hide()
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'refresh-netnet',
    content: 'Ok, I\'ll refresh the browser for you, or you could refresh it yourself, surly your browser has a refresh button?',
    options: {
      'I like it when you do it': (e) => {
        window.location = window.location.origin
      },
      'never mind, I\'ll do it': (e) => e.hide()
    }
  }, {
    id: 'no-need-to-update',
    content: 'You\'ve got <code>autoUpdate(true)</code> so there\'s no need to manually <code>runUpdate()</code>, I\'ll update the output for you soon as you make a change to your code.',
    options: { 'ah, ok': (e) => e.hide() }
  }, {
    id: 'need-to-update',
    content: `When <code>autoUpdate</code> is set to <code>false</code> you'll need to manually run the update to see your changes. You can click the <code>runUpdate()</code> button in the Functions Menu or press ${hotkey}+Enter`,
    options: { 'ah, ok': (e) => e.hide() }
  }, {
    id: 'temp-disclaimer',
    content: 'Sorry, at the moment you can only upload HTML files.',
    options: { 'ah, ok': (e) => e.hide() }
  }, {
    id: 'oh-no-error',
    content: 'Oh no! ...seems there was an error',
    options: {
      'dang!': (e) => {
        window.NNM.setFace('◕', '◞', '◕')
        e.hide()
      }
    }
  }]
}
