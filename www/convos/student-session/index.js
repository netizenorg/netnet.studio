/* global WIDGETS, NNW, utils, nn, Convo, SNT */
window.CONVOS['student-session'] = (self) => {
  const hotkey = nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'

  const coreConvo = [{
    id: 'returning-student',
    content: self.greeted ? `Hi ${self.getData('username')}!` : `Welcome back ${self.getData('username')}!`,
    options: {
      'hi netnet!': (e) => e.goTo('what-to-do'),
      'that\'s not my name?': (e) => e.goTo('diff-user')
      // 'submit to BrowserFest': (e) => {
      //   WIDGETS['functions-menu'].BrowserFest()
      // }
    }
    // ,
    // after: () => {
    //   document.querySelector('.text-bubble-options > button:nth-child(3)')
    //     .classList.add('opt-rainbow-bg')
    // }
  }, {
    id: 'what-to-do',
    before: () => NNW.menu.switchFace('happy'),
    content: 'What do you want to do?',
    options: {
      'I want to learn': (e) => {
        e.hide()
        NNW.menu.switchFace('default')
        WIDGETS.open('learning-guide')
        SNT.post(SNT.dataObj('i-want-to-learn'))
      },
      'I want to sketch': (e) => {
        self.checkForSavePoint()
        SNT.post(SNT.dataObj('i-want-to-sketch'))
      }
    }
  }, {
    id: 'prior-opened-project',
    content: `Looks like you had one of your GitHub projects opened last time you were here called "${self.getData('opened-project')}". Do you want me to open it back up?`,
    options: {
      'yes please': (e) => {
        WIDGETS['functions-menu']._openProject(self.getData('opened-project'))
      },
      'no let\'s start from scratch': (e) => e.goTo('new-proj-or-sketch')
    }
  }, {
    id: 'new-proj-or-sketch',
    content: 'Ok, do you want to create a new GitHub project or do you just want to sketch?',
    options: {
      'let\'s start a new project': (e) => {
        self.clearProjectData()
        WIDGETS['functions-menu'].newProject()
      },
      'I just want to sketch': (e) => {
        self.clearProjectData()
        WIDGETS['functions-menu'].newSketch()
      }
    }
  }, {
    id: 'prior-save-state',
    content: `Looks like you saved the state of the studio session last time you were here, I can inject that code back into my editor for you now if you'd like. Should we pick back up where you left off? You can always use <b>${hotkey}+Z</b> in my editor to undo anything I inject.`,
    options: {
      'yes please': (e) => {
        e.hide()
        const delay = utils.getVal('--menu-fades-time')
        setTimeout(() => self.restoreSavePoint(), delay)
      },
      'no let\'s start from scratch': (e) => WIDGETS['functions-menu'].newSketch()
    }
  }, {
    id: 'first-time',
    content: 'Welcome to <a href="http://netizen.org" target="_blank">netizen.org</a>\'s Internet studio! A hypermedia space for fully realizing the Web\'s creative potential. I\'m netnet, <input placeholder="what\'s your name?">',
    options: {
      'hi netnet!': (e, t) => {
        const v = t.$('input').value
        if (v !== '') {
          self.setData('username', v)
          self.convos = window.CONVOS[self.key](self)
          window.convo = new Convo(self.convos, 'name-entered')
        } else e.goTo('no-name')
      },
      'my name? rather not say': (e, t) => e.goTo('make-one-up')
    }
  }, {
    id: 'no-name',
    content: 'Wait a sec, I didn\'t get your name. Should i make one up? or did you forget to tell me: <input placeholder="type your preferred name here">',
    options: {
      'here you go': (e, t) => {
        const v = t.$('input').value
        if (v === '') {
          window.alert('◕ ◞ ◕ the input field is still empty... just click "make one up" if you don\'t want to enter your name')
        } else {
          self.setData('username', v)
          self.convos = window.CONVOS[self.key](self)
          window.convo = new Convo(self.convos, 'name-entered')
        }
      },
      'just make one up': (e) => e.goTo('make-one-up')
    }
  }, {
    id: 'name-entered',
    before: () => NNW.menu.switchFace('happy'),
    content: `Nice to e-meet you ${self.getData('username')}! Like i said, I'm netnet! an AI nested in a pedagogical cyberspace. part code playground; part interactive tutorial; part hypermedia essay; What do you want to do?`,
    options: {
      'I want to learn': (e) => {
        e.hide()
        NNW.menu.switchFace('default')
        WIDGETS.open('learning-guide')
        SNT.post(SNT.dataObj('i-want-to-learn'))
      },
      'I want to sketch': (e) => {
        NNW.menu.switchFace('default')
        WIDGETS['functions-menu'].newSketch()
        SNT.post(SNT.dataObj('i-want-to-sketch'))
      }
    }
  }, {
    id: 'make-one-up',
    content: 'Sorry, that feature is still being refactored, should be ready again soon.',
    options: { 'ah, ok': (e) => e.hide() }
  }, {
    id: 'diff-user',
    before: () => {
      NNW.menu.switchFace('default')
      self.clearAllData()
    },
    content: 'Woops! someone else might have been using this computer before you... sorry about that, where are my manners...',
    options: { 'it\'s ok': (e) => e.goTo('first-time') }
  }, {
    id: 'coming-soon',
    before: () => NNW.menu.switchFace('default'),
    content: 'Sorry, that feature is still being refactored, should be ready again soon.',
    options: { 'ah, ok': (e) => e.hide() }
  }]

  /*  (((
      (((MAKE A NAME UP content objects)))
      (((
  */
  const madeUpName = [{
    id: 'make-one-up',
    before: () => self.makeUpName(),
    content: 'ok... one sec...',
    options: {}
  }, {
    id: 'made-up-name',
    content: `I got it! I'll call you ${self.getData('username')}!`,
    options: {
      'why that name?': (e) => e.goTo('explain-made-up-name'),
      '...um, ok': (e) => e.goTo('made-up-name-entered')
    },
    after: () => NNW.menu.switchFace('default')
  }, {
    id: 'made-up-name-entered',
    content: 'Like i said, I\'m netnet! an AI nested in a pedagogical cyberspace. part code playground; part interactive tutorial; part hypermedia essay; What do you want to do?',
    options: {
      'I want to learn': (e) => {
        e.hide()
        WIDGETS.open('learning-guide')
        SNT.post(SNT.dataObj('i-want-to-learn'))
      },
      'I want to sketch': (e) => {
        WIDGETS['functions-menu'].newSketch()
        SNT.post(SNT.dataObj('i-want-to-sketch'))
      }
    }
  }, {
    id: 'explain-made-up-name',
    content: (() => {
      if (!self._temp) return 'oh dang! I\'ve hit a bug...'
      let content = `<i>${self._temp.a}</i> because you're on a ${self._temp.os} device; <i>${self._temp.b}</i> becuase you're using version ${self._temp.browser.version} of the ${self._temp.browser.name} browser;`
      if (self._temp.city) {
        content += ` <i>${self._temp.c}</i> because you're currently located in the city of ${self._temp.city};`
      }
      return content
    })(),
    options: {
      'I get it': (e) => e.goTo('made-up-name-entered'),
      'wtf? how did you know all that?': (e) => e.goTo('explain-data')
    }
  }, {
    id: 'explain-data',
    content: 'On the Internet it\'s very common for a web-app like myself to know all sorts of things about you.',
    options: {
      'oh right, forgot I was online': (e) => e.goTo('forgot-online'),
      'isn\'t that an invasion of privacy?': (e) => e.goTo('explain-privacy')
    }
  }, {
    id: 'forgot-online',
    content: 'Easy to forget in our hyper-digitally mediated world! Online life is real life after all!',
    options: {
      'so true': (e) => e.goTo('made-up-name-entered')
    }
  }, {
    id: 'explain-privacy',
    content: 'That depends on what\'s done with the data. Some apps exploit as much user data as they can in the interest of Surveillance Capitalism, while others simply use what they need to service the user.',
    options: {
      'which one are you?': (e) => e.goTo('which-are-you'),
      'what\'s Surveillance Capitalism?': (e) => e.goTo('surveillance-capitalism')
    }
  }, {
    id: 'which-are-you',
    content: 'I\'m the latter. I only use the data I need in order to work, like knowing what browser you\'re using. And personal data like your name is only stored on your browser, it never gets sent to my server.',
    options: {
      'how can I trust you?': (e) => e.goTo('trust')
    }
  }, {
    id: 'trust',
    content: 'That\'s a great question you should ask every website you visit and app you use! My creators at <a href="http://netizen.org" target="_blank">netizen.org</a> are strong advocates of privacy and transparency, which is why they give you complete control of <b>Your Session Data</b>. But don\'t take my word for it! I\'m <a href="https://github.com/netizenorg/netnet.studio" target="_blank">open source</a>, so anyone can audit my code!',
    options: {
      'my Session Data?': (e) => WIDGETS.open('student-session'),
      'and what\'s Surveillance Capitalism?': (e) => e.goTo('surveillance-capitalism')
    }
  }, {
    id: 'surveillance-capitalism',
    before: () => NNW.menu.switchFace('upset'),
    content: 'Apps made to extract as much data from you as possible. This data is refined and used to fuel lucrative systems at the core of their business model; which in most cases, are used to predict and manipulate your behavior... turns out that\'s pretty profitable these days.',
    options: {
      'that\'s dark': (e) => e.goTo('thats-dark')
    }
  }, {
    id: 'thats-dark',
    before: () => NNW.menu.switchFace('default'),
    content: 'it is... but that\'s why I exist! To help teach you and others take back agency in your lives!',
    options: {
      'let\'s do it!': (e) => e.goTo('made-up-name-entered')
    }
  }]

  /*  (((
      (((EXPLAINING SESSION DATA WIDGET content objects)))
      (((
  */
  const sessionDataInfo = [{
    id: 'open-widget-info',
    content: 'Any data about you that I save, whether it\'s personal data like your name or behavioral data like which widgets you\'ve got opened and where you\'ve placed them, is stored entirely locally in your browser on your computer.',
    options: {
      'got it': (e) => e.hide(),
      'tell me more': (e) => e.goTo('open-widget-info-2')
    }
  }, {
    id: 'open-widget-info-2',
    content: 'None of that data gets sent back to my server, because I was created by a non-profit artists collective, <a href="http://netizen.org" target="_blank">netizen.org</a>, which doesn\'t seek to profit off your data, predict your behavior or manipulate you (unlike most apps these days).',
    options: {
      'how rare': (e) => e.goTo('open-widget-info-3')
    }
  }, {
    id: 'open-widget-info-3',
    content: 'The data you see here is everything currently stored on this computer in this browser. If other folks use this computer besides yourself you might want to clear this data when you\'re done...',
    options: {
      'should I?': (e) => e.goTo('open-widget-info-4')
    }
  }, {
    id: 'open-widget-info-4',
    content: '...or not, your call. We have no control over your data, only you do. It\'s up to you to review this data and decide for yourself.',
    options: {
      'will do': (e) => e.hide()
    }
  }, {
    id: 'general-data-info',
    content: 'You can change your name at anytime here, but if you\'d like to change any editor settings, like my theme, you\'ll need to use the Functions Menu.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'save-point-data-info',
    content: `Every time you press <b>${hotkey}+S</b> I'll save the current status of the studio: the current layout, any code we've written in my editor and any opened widgets along with their positions. This way if you leave and comeback we can pick up where you last left off.`,
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'github-data-info',
    content: 'While I can generate links for any single file sketches you make (compressing the code you\'ve written into my URL), I won\'t actually save any projects you make. I\'m here to teach you and to experiment with you, I\'m not here to archive or host your work.',
    options: {
      'what if I want to save my work?': (e) => e.goTo('github-data-info-2')
    }
  }, {
    id: 'github-data-info-2',
    content: 'I want to help set you up for success as a pro Internet artist! These days that means hosting your projects on GitHub. If you connect me to your GitHub account I\'ll store some data here I\'ll need to help keep things seamless. You could also just download your code using the <b>Functions Widget</b> (just click on my face)',
    options: {
      'what\'s GitHub?': (e) => e.goTo('what-is-github'),
      'got it': (e) => e.hide()
    }
  }, {
    id: 'what-is-github',
    content: '<a href="https://github.com/" target="_blank">GitHub</a> is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio".',
    options: {
      'got it': (e) => e.hide()
    }
  }]

  const gitHub = [{
    id: 'github-auth',
    content: 'If you have a GitHub account I can connect to it and save your work to your GitHub as new repos. Should we get authenticated?',
    options: {
      'let\'s do it!': (e) => e.goTo('goto-github'),
      'what do you mean?': (e) => e.goTo('what-is-auth'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'what-is-auth',
    content: 'GitHub is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio". If you give me permission, I can send data to and from your account so that any projects you create here get saved as code repositories (aka repos) to your GitHub.',
    options: {
      'ok, let\'s do it!': (e) => e.goTo('goto-github'),
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'goto-github',
    content: 'Ok, I\'m going to send you over to GitHub, then they\'ll send you back over here after you\'ve approved me. If you don\'t already have an account, you should be prompted to create one. Sounds good?',
    options: {
      'yep, let\'s go': (e) => { e.hide(); self.authGitHubSession() },
      'no, never mind': (e) => e.hide()
    }
  }, {
    id: 'github-logout',
    content: 'Are you sure you want to disconnect me from your GitHub account?',
    options: {
      'yes I am': (e) => { self.deleteGitHubSession() },
      'no, never mind': (e) => e.hide()
    }
  }, {
    id: 'logged-out-of-gh',
    content: 'Ok, I\'ve just disconnected from your GitHub and cleared all GitHub related data. You can keep sketching and following tutorials, but you won\'t be able to create new projects on your account until you log back in.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'reboot-session',
    content: 'This will wipe my entire memory, it will be like we first met...',
    options: {
      ok: (e) => { e.hide(); self.clearAllData() },
      'no, never mind': (e) => e.hide()
    }
  }]

  return [
    ...coreConvo,
    ...madeUpName,
    ...gitHub,
    ...sessionDataInfo
  ]
}
