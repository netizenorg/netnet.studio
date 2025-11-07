/* global WIDGETS, NNW, utils, nn, Convo */
window.CONVOS['student-session'] = (self) => {
  const hotkey = nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'

  const firstOpts = (type) => {
    const o = {}

    const letsCode = (e) => {
      NNW.menu.switchFace('default')
      self.checkForSavePoint()
    }

    if (type === 'new-name') {
      o['what now?'] = (e) => e.goTo('how-to')
      o['classical AI?'] = (e) => e.goTo('classical-ai')
      o['let\'s code!'] = letsCode
    } else if (type === 'no-greet') {
      o['let\'s code!'] = letsCode
      o['where? how?'] = (e) => e.goTo('how-to')
    } else {
      o['let\'s code!'] = letsCode
      o['who? what?'] = (e) => e.goTo('confirm-diff-user')
    }
    return o
  }

  return [
    {
      id: 'safari',
      graph: { id: 1, x: 1600, y: 100 },
      after: () => NNW.menu.switchFace('surprise'),
      content: 'Oh-oh, it looks like you\'re using <b>Safari</b>, things don\'t always work great on that browser. You might experience some issues, like graphical bugs and missing sound. I\'d recommend coming back on a more modern browser.',
      options: {
        'that\'s ok, I\'ll accept the risk': (e) => {
          window.utils._acceptSafari = true
          NNW.menu.switchFace('default')
          if (utils.checkURL() === 'none') {
            WIDGETS['student-session'].greetStudent()
          }
        },
        'modern browser?': (e) => {
          NNW.menu.switchFace('default')
          e.goTo('safari2')
        }
      }
    },
    {
      id: 'returning-student-init',
      graph: { id: 2, x: 475, y: 100 },
      before: () => NNW.menu.switchFace('happy'),
      content: `Hey! Welcome back ${self.getData('username')}!`,
      options: firstOpts()
    },
    {
      id: 'returning-student-after',
      graph: { id: 3, x: 600, y: 100 },
      before: () => NNW.menu.switchFace('happy'),
      content: `Hi ${self.getData('username')}!`,
      options: firstOpts()
    },
    {
      id: 'return-student-no-greet',
      graph: { id: 4, x: 800, y: 450 },
      content: 'Shall we get started?',
      options: firstOpts('no-greet')
    },
    {
      id: 'prior-github-login',
      graph: { id: 5, x: 200, y: 300 },
      content: 'Would you like to open one of your GitHub projects or do you want to start something new?',
      options: {
        'yes, let\'s open one': (e) => WIDGETS.load('project-files', (w) => w.openProject()),
        'no let\'s start something new': (e) => WIDGETS['coding-menu'].new()
      }
    },
    {
      id: 'prior-github-or-save-state',
      graph: { id: 6, x: 100, y: 300 },
      content: 'Looks like you may have been working on a sketch last time you were here. Should we pick back up where you left off? Or would you like to open one of your GitHub projects instead? Or maybe start something new?',
      options: {
        'open that sketch': (e) => {
          e.hide()
          const delay = utils.getVal('--menu-fades-time')
          setTimeout(() => self.restoreSavePoint(), delay)
        },
        'open a project': (e) => WIDGETS.load('project-files', (w) => w.openProject()),
        'start something new': (e) => WIDGETS['coding-menu'].new()
      }
    },
    {
      id: 'prior-save-state',
      graph: { id: 7, x: 300, y: 300 },
      content: `Looks like you may have been working on a sketch last time you were here. Should we pick back up where you left off? You can always use <b>${hotkey}+Z</b> in my editor to "undo" any code you or I add to the editor.`,
      options: {
        'yes please': (e) => {
          e.hide()
          const delay = utils.getVal('--menu-fades-time')
          setTimeout(() => self.restoreSavePoint(), delay)
        },
        'no let\'s start from scratch': (e) => WIDGETS['coding-menu'].new()
      }
    },
    {
      id: 'first-time',
      graph: { id: 8, x: 1300, y: 100 },
      content: 'Welcome to the studio, a creative space for fully realizing the Web’s expressive potential! I\'m netnet, <input class="input" placeholder="what\'s your name?">',
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
    },
    {
      id: 'no-name',
      graph: { id: 9, x: 1375, y: 300 },
      content: 'Wait a sec, I didn\'t get your name. Should I make one up? or did you forget to tell me: <input placeholder="type your preferred name here">',
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
    },
    {
      id: 'name-entered',
      graph: { id: 10, x: 1250, y: 300 },
      before: () => NNW.menu.switchFace('happy'),
      content: `Nice to e-meet you ${self.getData('username')}! Like I said, I'm netnet, a <i>classical</i> AI-TA (artificial intelligence teaching assistant) and creative code playground! Shall we get started?`,
      options: firstOpts('new-name')
    },
    {
      id: 'confirm-diff-user',
      graph: { id: 11, x: 600, y: 300 },
      before: () => {
        NNW.menu.updateFace({
          leftEye: 'Ó',
          mouth: '﹏',
          rightEye: 'Ò',
          lookAtCursor: false,
          animation: 'duck-down'
        })
      },
      content: 'Oh sorry! Is that not your name?',
      options: {
        No: (e) => e.goTo('diff-user'),
        'It is, but I\'m still new here': (e) => e.goTo('newish-user')
      }
    },
    {
      id: 'newish-user',
      graph: { id: 12, x: 550, y: 500 },
      before: () => NNW.menu.switchFace('default'),
      content: `Allow me to re-introduce myself, I'm netnet, a <i>classical</i> AI-TA (artificial intelligence teaching assistant) and creative code playground! Where should we start ${self.getData('username')}?`,
      options: {
        'I\'m new to code': (e) => e.goTo('how-to-learn'),
        'classical AI?': (e) => e.goTo('classical-ai'),
        'let\'s code!': (e) => self.newSketch('how-to-code')
      }
    },
    {
      id: 'diff-user',
      graph: { id: 13, x: 1100, y: 150 },
      before: () => {
        self.clearAllData(true)
        NNW.menu.updateFace({
          leftEye: '^',
          mouth: '‿',
          rightEye: '^',
          lookAtCursor: false
        })
      },
      content: 'Woops! someone else might have been using this computer before you... sorry about that, where are my manners...',
      options: {
        'it\'s ok': (e) => e.goTo('first-time')
      }
    },
    {
      id: 'coming-soon',
      graph: { id: 14, x: 200, y: 1725 },
      before: () => NNW.menu.switchFace('default'),
      content: 'Sorry, that feature is still being refactored, should be ready again soon.',
      options: {
        'ah, ok': (e) => e.hide()
      }
    },
    {
      id: 'classical-ai',
      graph: { id: 15, x: 1000, y: 300 },
      content: 'AI has been getting a lot of hype these days because of a new approach known as "machine learning" where large amounts of data are used to "train" AI like Large Language Models (LLM). That\'s not how I was made though. My code was hand crafted, written line by line with love and care by the creative folks at <a href="http://netizen.org" target="_blank">netizen.org</a>!',
      options: {
        'oh, I see': (e) => e.goTo('return-student-no-greet'),
        'why not an LLM?': (e) => e.goTo('why-classical')
      }
    },
    {
      id: 'why-classical',
      graph: { id: 16, x: 1100, y: 450 },
      content: 'Modern "AI" is very powerful and something we\'ll discuss in more depth, but it can also be inaccurate and unpredictable. To ensure the specific learning goals and carefully designed pedagogical style of this studio remain intact, my creators felt it best that I be a reflection of the same hand-crafted hypertext I\'m designed to teach you to create yourself.',
      options: {
        oh: (e) => e.goTo('why-classical2')
      }
    },
    {
      id: 'why-classical2',
      graph: { id: 17, x: 1000, y: 600 },
      content: 'That said, the synthesized, hallucinatory sorcery behind modern "AI" can be quite exciting when applied to creative contexts, but learning to use it effectively and responsibly requires a bit of literacy first. There are some fundamentals we need to cover beforehand, but eventually I\'ll teach you how to creatively use (and misuse) these new "AI".',
      options: {
        'I see': (e) => e.goTo('return-student-no-greet')
      }
    },
    {
      id: 'how-to',
      graph: { id: 18, x: 800, y: 575 },
      content: 'If you want to code I can open up my editor and you can dive right in! I\'ll help you along the way by marking lines (with clickable colored dots) when I have some feedback for you, or you can double click any piece of code at anytime and I\'ll tell you more about it.',
      options: {
        'let\'s code!': (e) => self.newSketch('how-to-code'),
        'I\'m new to code': (e) => e.goTo('how-to-learn')
      }
    },
    {
      id: 'how-to-code',
      graph: { id: 19, x: 425, y: 500 },
      content: 'Here ya go! A blank canvas can be a bit intimidating, so feel free to check out the <span class="link" onclick="WIDGETS.open(\'template-projects\')">Template Starter Projects</span> and <span class="link" onclick="WIDGETS.open(\'demo-sketches\')">Code Demos</span> widget for inspiration! You can find these and other helpful references in the <img src="images/menu/tutorials.png" class="student-session__d-icons"> <b>Learning Guide</b> at any time.<br><br>If you know what you want to code, go for it! Click on my face to open the <img src="images/menu/code.png" class="student-session__d-icons"> <b>Coding Menu</b> if you want to change the editor settings or access other things having to do with your sketch.',
      options: {
        'got it, thanks!': (e) => e.hide()
      }
    },
    {
      id: 'how-to-learn',
      graph: { id: 20, x: 550, y: 650 },
      before: () => {
        NNW.menu.updateFace({
          leftEye: '◠',
          mouth: 'ᗜ',
          rightEye: '◠',
          lookAtCursor: false,
          animation: 'shake'
        })
      },
      content: 'A new student, how exciting! Click on my face and select the <img src="images/menu/tutorials.png" class="student-session__d-icons"> icon, that will open the <b>Learning Guide</b> widget. There you\'ll find notes and different types of hypermedia lessons, including tutorials you can interact with, project templates I can guide you through, and code demos you can remix.',
      options: {
        ok: (e) => e.hide(),
        'actually, let\'s code': (e) => self.newSketch('how-to-code')
      }
    },
    {
      id: 'blank-canvas-ready',
      graph: { id: 21, x: 425, y: 300 },
      content: 'Great! Here\'s a blank canvas. Click on my face when you need something, or double click on any piece of code if you want me to explain it to you.<br><br>Check out the <span class="link" onclick="WIDGETS.open(\'learning-guide\')">Guide</span> to get oriented or explore the <span class="link" onclick="WIDGETS.open(\'template-projects\')">Template Starter Projects</span> and <span class="link" onclick="WIDGETS.open(\'demo-sketches\')">Code Demos</span> widget for inspiration!',
      options: {
        'will do, thanks!': (e) => e.hide()
      }
    },
    {
      id: 'make-one-up',
      graph: { id: 22, x: 1375, y: 425 },
      before: () => {
        /*  (((
            (((MAKE A NAME UP content objects)))
            (((
        */
        return self.makeUpName()
      },
      content: 'ok... one sec...',
      options: {

      }
    },
    {
      id: 'made-up-name',
      graph: { id: 23, x: 1375, y: 550 },
      after: () => NNW.menu.switchFace('default'),
      content: `I got it! I'll call you ${self.getData('username')}!`,
      options: {
        'why that name?': (e) => e.goTo('explain-made-up-name'),
        '...um, ok': (e) => e.goTo('made-up-name-entered')
      }
    },
    {
      id: 'made-up-name-entered',
      graph: { id: 24, x: 1375, y: 700 },
      content: 'Like i said, I\'m netnet! a <i>classical</i> AI-TA (artificial intelligence teaching assistant) and educational code playground! Shall we get started?',
      options: firstOpts('new-name')
    },
    {
      id: 'explain-made-up-name',
      graph: { id: 25, x: 1600, y: 550 },
      content: `${self._explainName}`,
      options: {
        'I get it': (e) => e.goTo('made-up-name-entered'),
        'what!? how did you know all that?': (e) => e.goTo('explain-data')
      }
    },
    {
      id: 'explain-data',
      graph: { id: 26, x: 1825, y: 625 },
      content: 'On the Internet it\'s very common for a apps like myself to know all sorts of things about you.',
      options: {
        'oh right, forgot I was online': (e) => e.goTo('forgot-online'),
        'isn\'t that an invasion of privacy?': (e) => e.goTo('explain-privacy')
      }
    },
    {
      id: 'forgot-online',
      graph: { id: 27, x: 1600, y: 700 },
      content: 'Easy to forget in our hyper-digitally mediated world! Online life is real life after all!',
      options: {
        'so true': (e) => e.goTo('made-up-name-entered')
      }
    },
    {
      id: 'explain-privacy',
      graph: { id: 28, x: 1825, y: 750 },
      content: 'That depends on what\'s done with the data. Some apps exploit as much user data as they can in the interest of Surveillance Capitalism, while others simply use what they need to service the user.',
      options: {
        'which one are you?': (e) => e.goTo('which-are-you'),
        'what\'s Surveillance Capitalism?': (e) => e.goTo('surveillance-capitalism')
      }
    },
    {
      id: 'which-are-you',
      graph: { id: 29, x: 1825, y: 875 },
      content: 'I\'m the latter. I only use the data I need in order to work, like knowing what browser you\'re using. And personal data like your name is only stored on your browser, it never gets sent to my server.',
      options: {
        'how can I trust you?': (e) => e.goTo('trust')
      }
    },
    {
      id: 'trust',
      graph: { id: 30, x: 1825, y: 1000 },
      content: 'That\'s a great question you should ask every website you visit and app you use! My creators at <a href="http://netizen.org" target="_blank">netizen.org</a> are strong advocates of privacy and transparency, which is why they give you complete control of <b>Your Session Data</b>. But don\'t take my word for it! I\'m <a href="https://github.com/netizenorg/netnet.studio" target="_blank">open source</a>, so anyone can audit my code!',
      options: {
        'my Session Data?': (e) => WIDGETS.open('student-session'),
        'and what\'s Surveillance Capitalism?': (e) => e.goTo('surveillance-capitalism')
      }
    },
    {
      id: 'surveillance-capitalism',
      graph: { id: 31, x: 1700, y: 1000 },
      before: () => NNW.menu.switchFace('upset'),
      content: 'Apps made to extract as much data from you as possible. This data is refined and used to fuel lucrative systems at the core of their business model; which in most cases, are used to predict and manipulate your behavior... turns out that\'s pretty profitable these days.',
      options: {
        'that\'s dark': (e) => e.goTo('thats-dark')
      }
    },
    {
      id: 'thats-dark',
      graph: { id: 32, x: 1600, y: 850 },
      before: () => NNW.menu.switchFace('default'),
      content: 'it is... but that\'s why I exist! To help teach you and others take back agency in your lives!',
      options: {
        'let\'s do it!': (e) => e.goTo('made-up-name-entered')
      }
    },
    {
      id: 'open-widget-info',
      graph: { id: 33, x: 200, y: 1025 },
      before: () => {
        /*  (((
            (((EXPLAINING SESSION DATA WIDGET content objects)))
            (((
        */
      },
      content: 'Any data about you that I save, whether it\'s personal data like your name or behavioral data like which widgets you\'ve got opened and where you\'ve placed them, is stored entirely locally in your browser on your computer.',
      options: {
        'got it': (e) => e.hide(),
        'tell me more': (e) => e.goTo('open-widget-info-2')
      }
    },
    {
      id: 'open-widget-info-2',
      graph: { id: 34, x: 200, y: 1175 },
      content: 'None of that data gets sent back to my server, because I was created by a non-profit artists collective, <a href="http://netizen.org" target="_blank">netizen.org</a>, which doesn\'t seek to profit off your data, predict your behavior or manipulate you (unlike most apps these days).',
      options: {
        'how rare': (e) => e.goTo('open-widget-info-3')
      }
    },
    {
      id: 'open-widget-info-3',
      graph: { id: 35, x: 200, y: 1325 },
      content: 'The data you see here is everything currently stored on this computer in this browser. If other folks use this computer besides yourself you might want to clear this data when you\'re done...',
      options: {
        'should I?': (e) => e.goTo('open-widget-info-4')
      }
    },
    {
      id: 'open-widget-info-4',
      graph: { id: 36, x: 200, y: 1475 },
      content: '...or not, your call. We have no control over your data, only you do. It\'s up to you to review this data and decide for yourself.',
      options: {
        'will do': (e) => e.hide()
      }
    },
    {
      id: 'general-data-info',
      graph: { id: 37, x: 550, y: 1175 },
      content: 'You can change your name at anytime here, but if you\'d like to change any editor settings, like my theme, you\'ll need to use the Coding Menu.',
      options: {
        'got it': (e) => e.hide()
      }
    },
    {
      id: 'save-point-data-info',
      graph: { id: 38, x: 700, y: 1175 },
      content: `Every time you press <b>${hotkey}+S</b> I'll save the current status of the studio: the current layout, any code we've written in my editor and any opened widgets along with their positions. This way if you leave and comeback we can pick up where you last left off.`,
      options: {
        'got it': (e) => e.hide()
      }
    },
    {
      id: 'github-data-info',
      graph: { id: 39, x: 400, y: 1175 },
      content: 'While I can generate links for any single file sketches you make (compressing the code you\'ve written into my URL), I won\'t actually save any projects you make. I\'m here to teach you and to experiment with you, I\'m not here to archive or host your work.',
      options: {
        'what if I want to save my work?': (e) => e.goTo('github-data-info-2')
      }
    },
    {
      id: 'github-data-info-2',
      graph: { id: 40, x: 400, y: 1325 },
      content: 'I want to help set you up for success as a pro Internet artist! These days that means hosting your projects on GitHub. If you connect me to your GitHub account I\'ll store some data here I\'ll need to help keep things seamless. You could also just download your code using the <b>Coding Menu</b> (just click on my face)',
      options: {
        'what\'s GitHub?': (e) => e.goTo('what-is-github'),
        'got it': (e) => e.hide()
      }
    },
    {
      id: 'what-is-github',
      graph: { id: 41, x: 400, y: 1475 },
      content: '<a href="https://github.com/" target="_blank">GitHub</a> is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio".',
      options: {
        'got it': (e) => e.hide()
      }
    },
    {
      id: 'github-auth',
      graph: { id: 42, x: 1250, y: 1425 },
      before: () => {
        /*  (((
            ((( GitHub Convos
            (((
        */
      },
      content: 'If you have a GitHub account I can connect to it and save your work to your GitHub as new repos. Should we get authenticated?',
      options: {
        'let\'s do it!': (e) => e.goTo('goto-github'),
        'what do you mean?': (e) => e.goTo('what-is-auth'),
        'never mind': (e) => e.hide()
      }
    },
    {
      id: 'what-is-auth',
      graph: { id: 43, x: 1175, y: 1575 },
      content: 'GitHub is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio". If you give me permission, I can send data to and from your account so that any projects you create here get saved as code repositories (aka repos) to your GitHub.',
      options: {
        'ok, let\'s do it!': (e) => e.goTo('goto-github'),
        'oh, never mind': (e) => e.hide()
      }
    },
    {
      id: 'goto-github',
      graph: { id: 44, x: 1350, y: 1575 },
      content: 'Ok, I\'m going to send you over to GitHub, then they\'ll send you back over here after you\'ve approved me. If you don\'t already have an account, you should be prompted to create one. Sounds good?',
      options: {
        'yep, let\'s go': (e) => {
          e.hide()
          self.authGitHubSession()
        },
        'no, never mind': (e) => e.hide()
      }
    },
    {
      id: 'github-logout',
      graph: { id: 45, x: 1000, y: 1425 },
      content: 'Are you sure you want to disconnect me from your GitHub account?',
      options: {
        'yes I am': (e) => {
          self.deleteGitHubSession()
        },
        'no, never mind': (e) => e.hide()
      }
    },
    {
      id: 'logged-out-of-gh',
      graph: { id: 46, x: 1000, y: 1550 },
      after: () => self.greetStudent(),
      content: 'Ok, I\'ve just disconnected from your GitHub and cleared all GitHub related data. You can keep sketching and following tutorials, but you won\'t be able to create new projects on your account until you log back in.',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: 'reboot-session',
      graph: { id: 47, x: 850, y: 1425 },
      content: 'Are you sure you want to clear all your data and reboot me? This will wipe my entire memory, it will be like we first met...',
      options: {
        ok: (e) => {
          e.hide()
          self.clearAllData()
        },
        'oh, no never mind': (e) => e.hide()
      }
    },
    {
      id: 'safari2',
      graph: { id: 49, x: 1700, y: 250 },
      content: 'Our favorite browser is <a href="https://www.firefox.com/" target="_blank">Firefox</a>, but there are loads of other browsers out there like <a href="https://brave.com/" target="_blank">Brave</a>, <a href="https://www.opera.com/download" target="_blank">Opera</a> and <a href="https://vivaldi.com/download/" target="_blank">Vivalid</a>. Of course there\'s also <a href="https://www.google.com/chrome/" target="_blank">Chrome</a> and <a href="https://www.microsoft.com/edge/" target="_blank">Edge</a> if you prefer the corporate "Big Tech" route.',
      options: {
        'I\'ll download one of those!': (e) => e.goTo('safari3'),
        'I\'ll stick with Safari.': (e) => e.goTo('safari4')
      }
    },
    {
      id: 'safari3',
      graph: { id: 50, x: 1850, y: 150 },
      content: 'Click on any of these links to download the new browser you want: <a href="https://www.firefox.com/" target="_blank">Firefox</a>, <a href="https://brave.com/" target="_blank">Brave</a>, <a href="https://www.opera.com/download" target="_blank">Opera</a>, <a href="https://vivaldi.com/download/" target="_blank">Vivalid</a>, <a href="https://www.microsoft.com/edge/" target="_blank">Edge</a>, <a href="https://www.google.com/chrome/" target="_blank">Chrome</a>. These aren\'t the only ones, you can search online for more if you\'d like.',
      options: {
        'Ok!': (e) => e.goTo('safari5'),
        'Actually, I\'ll stick to Safari': (e) => e.goTo('safari4')
      }
    },
    {
      id: 'safari4',
      graph: { id: 51, x: 1850, y: 350 },
      content: 'Ok, just want to confirm that you understand things might get buggy on Safari and not every feature will work correctly.',
      options: {
        'Yes, I accept the risk': (e) => {
          window.utils._acceptSafari = true
          NNW.menu.switchFace('default')
          if (utils.checkURL() === 'none') {
            WIDGETS['student-session'].greetStudent()
          }
        },
        'Actually, I\'ll download a new one': (e) => e.goTo('safari3')
      }
    },
    {
      id: 'safari5',
      graph: { id: 52, x: 2000, y: 250 },
      content: 'Great! Open that new browser once you\'ve downloaded it and visit <b>https://netnet.studio</b> to come back.',
      options: {
        'downloaded where': (e) => e.goTo('safari3')
      }
    }
  ]
}
