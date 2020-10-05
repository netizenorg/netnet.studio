/* global Averigua, WIDGETS, STORE, NNM, NNW, NNE, Widget */
window.greetings.widgets = {
  'ws-xanadu': new Widget({
    listed: false,
    width: window.innerWidth * 0.5,
    title: 'Ted Nelson demonstrates Xanadu',
    innerHTML: '<video style="width: 100%" controls src="https://netnet.studio/api/videos/xanadu.mp4"></video><p>(source: <a href="https://www.youtube.com/watch?v=En_2T7KH6RA" target="_blank">Ted Nelson demonstrates Xanadu Space (2008) on YouTube</a>)</p>'
  }),
  'ws-smalltalk': new Widget({
    listed: false,
    width: window.innerWidth * 0.5,
    title: 'Adele Goldberg demonstrates SmallTalk',
    innerHTML: '<video style="width: 100%" controls src="https://netnet.studio/api/videos/smalltalk.mp4"></video><p>(source: <a href="https://archive.org/details/bits_and_bytes_12" target="_blank">Bits and Bytes Episode 12 (1983) on the Internet Archive</a>)</p>'
  }),
  'ws-adele': new Widget({
    listed: false,
    width: window.innerWidth * 0.3,
    title: 'Adele Goldberg',
    innerHTML: '<img style="width: 100%" src="convos/welcome-screen/files/adele-goldberg.jpg"><br><p>Adele Goldberg at the Xerox PARC teaching kids to program computers using SmallTalk</p>'
  }),
  'ws-alan': new Widget({
    listed: false,
    width: window.innerWidth * 0.3,
    title: 'Alan Kay',
    innerHTML: '<img style="width:100%" src="convos/welcome-screen/files/alan-kay.jpg"><br><p>Alan Kay at his desk at Xerox PARC</p>'
  }),
  'ws-credits': new Widget({
    listed: false,
    width: 630,
    title: 'netnet.studio credits',
    innerHTML: '<br><p style="text-align: center"><img style="display:inline-block;width:177px;" src="convos/welcome-screen/files/netizen.png" alt="netizen.org"></p><br><p>netnet.studio is a <a href="http://netizen.org" target="_blank">netizen.org</a> project being designed and devloped by <a href="http://nickbriz.com/" target="_blank">Nick Briz</a> and <a href="https://www.sarahrooney.net/" target="_blank">Sarah Rooney</a> with creative support from <a href="http://jonsatrom.com/" target="_blank">Jon Satrom</a> and administrative support from <a href="#", target="_blank">Mike Constantino</a>. Our interdisciplinary intern is <a href="http://ilai.link" target="_blank">Ilai Gilbert</a>.</p><p>netnet.studio was made possible with support from the <a href="http://clinicopensourcearts.com/" target="_blank">Clinic for Open Source Arts</a> and the <a href="https://www.saic.edu/academics/departments/contemporary-practices" target="_blank">Contemporary Practices Department at the School of the Art Institute of Chicago</a>.</p><br><p style="display:flex; justify-content:space-around; align-items:center;"><img style="display:inline-block;width:177px;" src="convos/welcome-screen/files/cosa-bw.png" alt="the Clinic for Open Source Arts"><img style="display:inline-block;width:273px;" src="convos/welcome-screen/files/saic-cp.png" alt="the Contemporary Practices Department at the School of the Art Institute of Chicago"></p>'
  }),
  'report-a-bug': new Widget({
    listed: false,
    width: window.innerWidth * 0.5,
    title: 'Bug Report',
    innerHTML: `<p style="display:none;"><b>data</b></p>
    <textarea id="bug-report-data" rows="6" style="width: 100%; color: var(--netizen-meta); border: 2px solid var(--netizen-meta); padding: 20px; background: #fff0; border-radius: 5px; font-size: 18px;"></textarea>
    <p style="display:none;"><b>metadata</b></p>
    <textarea id="bug-report-meta-data" rows="5" style="display:none; width: 100%; color: var(--netizen-meta); border: 2px solid var(--netizen-meta); padding: 20px; background: #fff0; border-radius: 5px; font-size: 18px;"></textarea>`
  }),
  'report-feedback': new Widget({
    listed: false,
    width: window.innerWidth * 0.5,
    title: 'Comment Box',
    innerHTML: '<textarea id="feedback-report-data" placeholder="please share any and all feedback, ideas, suggestions, critique, etc" rows="6" style="width: 100%; color: var(--netizen-meta); border: 2px solid var(--netizen-meta); padding: 20px; background: #fff0; border-radius: 5px; font-size: 18px;"></textarea>'
  })
}

STORE.dispatch('LOAD_WIDGETS', window.greetings.widgets)

window.convos['welcome-screen'] = (self) => {
  // TODO: link keywords to "wikipedia" widgets (i-frame browser widget)
  const betaMessage = '◕ ◞ ◕ oops! that tutorial isn\'t ready yet! netnet.stuio is still in <beta>, get in touch if you want to help $upport us: hi@netizen.org'

  const ls = window.localStorage

  const iWantToSektch = (e) => {
    const prevCode = window.utils.savedCode()
    const owner = window.localStorage.getItem('owner')
    const opened = window.localStorage.getItem('opened-project')
    if (owner && opened) {
      e.goTo('open-project')
    } else if (owner && prevCode) {
      e.goTo('local-or-open-project')
    } else if (prevCode) {
      e.goTo('work-on-saved-code')
    } else {
      e.goTo('blank-canvas-layout')
    }
  }

  /*  (((
      (((MISC shared content objects)))
      (((
  */
  const miscInfo = [{
    id: 'main-menu-init',
    before: () => {
      if (WIDGETS['ws-credits'].opened) {
        STORE.dispatch('CLOSE_WIDGET', 'ws-credits')
      }
    },
    content: 'What do you want to do?',
    options: {
      'i want to learn': (e) => {
        window.greetings.injectStarterCode()
        e.goTo('start-learning')
      },
      'i want to sketch': (e) => iWantToSektch(e),
      'what\'s netnet?': (e) => {
        if (STORE.state.layout !== 'welcome') {
          STORE.dispatch('CHANGE_LAYOUT', 'welcome')
        }
        e.goTo('whois')
      }
    }
  }, {
    id: 'main-menu', // same as above but one extra option
    before: () => {
      if (WIDGETS['ws-credits'].opened) {
        STORE.dispatch('CLOSE_WIDGET', 'ws-credits')
      }
    },
    content: 'What do you want to do?',
    options: {
      'i want to learn': (e) => {
        window.greetings.injectStarterCode()
        e.goTo('start-learning')
      },
      'i want to sketch': (e) => iWantToSektch(e),
      'what\'s netnet?': (e) => {
        if (STORE.state.layout !== 'welcome') {
          STORE.dispatch('CHANGE_LAYOUT', 'welcome')
        }
        e.goTo('whois')
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'wrong-user',
    content: `It's not? woops! I can't actually <i>see you</i>, just your computer. It seems someone named ${ls.getItem('username')} was on this computer before you.`,
    options: {
      'I see, let\'s reboot then!': (e) => WIDGETS['functions-menu'].reboot()
    },
    after: () => { NNM.setFace('Ó', '﹏', 'Ò', false) }
  }, {
    id: 'we-have-met',
    content: 'Really? Hmmm, you may have recently cleared your browser data and by doing so have also deleted my memory. No big deal, we can reintroduce ourselves.',
    options: {
      ok: (e) => self.goTo('get-started-first-time'),
      'no thanks': (e) => {
        const codeInUrl = NNE.hasCodeInHash && window.utils.url.shortCode
        if (codeInUrl) e.goTo('ok-no-intro')
        else e.hide() // assuming got here viea tutorial param
      }
    }
  }, {
    id: 'we-have-not-met',
    content: 'I didn\'t think so. Shall we introduce ourselves before you dive into stuff?',
    options: {
      ok: (e) => self.goTo('get-started-first-time'),
      'no thanks': (e) => {
        const codeInUrl = NNE.hasCodeInHash && window.utils.url.shortCode
        if (codeInUrl) e.goTo('ok-no-intro')
        else e.hide() // assuming got here viea tutorial param
      }
    }
  }, {
    id: 'ok-no-intro',
    before: () => {
      if (STORE.state.layout === 'welcome') {
        STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
      }
    },
    content: 'Ok, feel free to experiment with the code. Click my face if you need anything.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'explain-url-code',
    content: 'The URL in your browser\'s address bar contains some URL parameters including some code to preload into the editor, isn\'t that what you want?',
    options: {
      'oh yea! thanks!': (e) => e.hide(),
      'nope, lets\'s start over': (e) => e.goTo('main-menu')
    }
  }]

  /*  (((
      (((ABOUT netnet content objects)))
      (((
  */
  const backgroundInfo = [{
    id: 'whois',
    before: () => {
      STORE.dispatch('OPEN_WIDGET', 'ws-credits')
      setTimeout(() => {
        WIDGETS['ws-credits'].update({ left: 20, top: 20 }, 500)
        const x = WIDGETS['ws-credits'].width + 50
        NNW.updatePosition(x)
      }, 250)
    },
    content: 'netnet? that\'s me! an AI nested in a pedagogical cyberspace. part code playground; part interactive tutorial; part hypermedia essay;',
    options: {
      'AI?': (e) => e.goTo('ai'),
      'pedagogical?': (e) => e.goTo('pedagogical'),
      'hypermedia?': (e) => e.goTo('hypermedia'),
      'ok, cool!': (e) => {
        if (self.introducing) self.postIntro()
        else e.goTo('main-menu')
      }
    }
  }, {
    id: 'pedagogical',
    content: 'Pedagogical, as in, an approach to, or focus on, teaching. Specifically, teaching netizens (citizens of the Internet) to become artists of this metamedium we call the Web!',
    options: {
      'metamedium?': (e) => e.goTo('metamedia'),
      'I see, and netnet?': (e) => e.goTo('whois')
    }
  }, {
    id: 'hypermedia',
    content: 'Hypermedia is non-linear interactive mutli-media (text, sound, video, games, etc). A sort of "metamedia". It was coined by Ted Nelson in the late 60\'s, for his project Xanadu, a major influence on netnet.studio as well as on the Web itself (but don\'t tell him I said that).',
    options: {
      'why not?': (e) => e.goTo('why-not'),
      'what\'s a metamedia?': (e) => e.goTo('metamedia'),
      'I see, and netnet?': (e) => e.goTo('whois')
    }
  }, {
    id: 'why-not',
    content: 'Well... Ted\'s not exactly a fan of the Web, and really dosn\'t like it when folks compare it to his Xanadu Project.',
    options: {
      'why\'s that?': (e) => e.goTo('why-is-that'),
      'I see, and netnet?': (e) => e.goTo('whois')
    },
    after: () => { NNM.setFace('^', '⌄', '^', false) }
  }, {
    id: 'why-is-that',
    content: 'Because he feels the web is a "watered down" version of his Xanadu Project, which he was working on long before the web came out, but unlike the Web, it\'s had some trouble gaining traction.',
    options: {
      'What\'s Xanadu got over the Web?': (e) => {
        STORE.dispatch('OPEN_WIDGET', 'ws-xanadu')
        setTimeout(() => {
          WIDGETS['ws-xanadu'].update({ left: 20, top: 20 }, 500)
          const x = WIDGETS['ws-xanadu'].width + 50
          NNW.updatePosition(x)
        }, 250)
        e.goTo('xanadu')
      },
      'I see, and netnet?': (e) => e.goTo('whois')
    },
    after: () => { NNM.setFace('^', '⌄', '^', false) }
  }, {
    id: 'xanadu',
    content: 'I\'ll let Ted explain that himself.',
    options: {
      'I see, and netnet?': (e) => {
        STORE.dispatch('CLOSE_WIDGET', 'ws-xanadu')
        WIDGETS['ws-xanadu'].recenter()
        WIDGETS['ws-xanadu'].$('video').pause()
        NNW.updatePosition()
        e.goTo('whois')
      }
    }
  }, {
    id: 'metamedia',
    content: 'Metamedia is one way to think about the Internet and computers, as an artistic medium which consists of "a wide range of already-existing and not-yet-invented media". I\'m here to help you fully realize that potential!',
    options: {
      'tell me more...': (e) => {
        STORE.dispatch('OPEN_WIDGET', 'ws-alan')
        STORE.dispatch('OPEN_WIDGET', 'ws-adele')
        STORE.dispatch('OPEN_WIDGET', 'ws-smalltalk')
        setTimeout(() => {
          WIDGETS['ws-alan'].update({ bottom: 20, right: 20 }, 1000)
          WIDGETS['ws-adele'].update({ left: 50, top: 20 }, 1000)
          WIDGETS['ws-smalltalk'].update({ left: 20, bottom: 20 }, 1000)
          const x = WIDGETS['ws-smalltalk'].width + 50
          NNW.updatePosition(x)
        }, 500)
        e.goTo('xerox-parc')
      },
      'how netnet?': (e) => e.goTo('whois')
    },
    after: () => { NNM.setFace('o', '‿', 'o', false) }
  }, {
    id: 'xerox-parc',
    content: 'Adele Goldberg and Alan Kay coined the term "metamedia" in 1977, when computers were huge institution owned machines, they <a href="http://www.newmediareader.com/book_samples/nmr-26-kay.pdf" target="_blank">imagined</a> "personal" computers. While working on that they made the first computers with real "graphical user interfaces" at Xerox PARC, a system they called SmallTalk.',
    options: {
      'I see, and netnet?': (e) => {
        STORE.dispatch('CLOSE_WIDGET', 'ws-alan')
        STORE.dispatch('CLOSE_WIDGET', 'ws-adele')
        STORE.dispatch('CLOSE_WIDGET', 'ws-smalltalk')
        WIDGETS['ws-alan'].recenter()
        WIDGETS['ws-adele'].recenter()
        WIDGETS['ws-smalltalk'].recenter()
        WIDGETS['ws-smalltalk'].$('video').pause()
        NNW.updatePosition()
        e.goTo('whois')
      }
    },
    after: () => { NNM.setFace('^', '‿', '^', false) }
  }, {
    id: 'ai',
    content: 'AI stands for Artificial Intelligence, which is what we call it when we personify algorithms. Like me! but there are so many others <i>kinds</i> of AI playing this imitation game.',
    options: {
      'what kind are you?': (e) => e.goTo('kind-of-ai'),
      'I see, and netnet?': (e) => e.goTo('whois')
    }
  }, {
    id: 'kind-of-ai',
    content: 'These days we hear a lot about "Machine Learning", but I\'m not that kind of AI which requires barrels of data and fields of TPUs to train. I\'m classical AI, my algorithms are hand crafted with love and care by the folks at <a href="http://netizen.org" target="_blank">netizen.org</a>.',
    options: {
      'machine learning?': (e) => e.goTo('machine-learning'),
      'I see, and netnet?': (e) => e.goTo('whois')
    },
    after: () => { NNM.setFace('◠', '‿', '◠', false) }
  }, {
    id: 'machine-learning',
    content: 'ML is a very powerful and contemporary approach to AI. But it\'s magic requires troves of organized (labeled) data and an immense amount of computational resources, such that only a relatively few institutions have access to this power (regardless of however "open source" the libraries used to create these models may be).',
    options: {
      'so no ML for me?': (e) => e.goTo('ml-for-me'),
      'I see, and netnet?': (e) => e.goTo('whois')
    },
    after: () => { NNM.setFace('⇀', '‸', '↼', false) }
  }, {
    id: 'ml-for-me',
    content: 'Well not necessarily! There are lots of ways artists can leverage the power of Machine Learning in their work, I can teach you!',
    options: {
      'ok!': (e) => window.alert(betaMessage),
      'no, tell me about netnet': (e) => e.goTo('whois')
    }
  }]

  /*  (((
      (((MAKE A NAME UP content objects)))
      (((
  */
  const madeUpName = [{
    id: 'make-one-up',
    content: `ok! I'm going to call you ${ls.getItem('username')}!`,
    options: {
      'why that name?': (e) => e.goTo('made-up-name'),
      '...um ok, "netnet"': (e) => e.goTo('whois')
    },
    after: () => { NNM.setFace('◠', 'ᗜ', '◠', false) }
  }, {
    id: 'made-up-name',
    content: (() => {
      const p = Averigua.platformInfo()
      const a = p.platform.substr(0, 3)
      const b = p.browser.name.toLowerCase().substr(0, 4)
      let content = `<i>${a}</i> because you're on a ${p.platform} device; <i>${b}</i> becuase you're using version ${p.browser.version} of the ${p.browser.name} browser;`
      if (window.greetings.city) {
        const c = window.greetings.city.toLowerCase().substr(0, 4)
        content += ` <i>${c}</i> because you're currently located in the city of ${window.greetings.city};`
      }
      return content
    })(),
    options: {
      'very creative netnet': (e) => e.goTo('whois'),
      'wtf? how did you know all that?': (e) => e.goTo('explain-data')
    },
    after: () => { NNM.setFace('◠', '_', '◠', false) }
  }, {
    id: 'explain-data',
    content: 'On the Internet it\'s very common for a web-app like myself to know all sorts of things about you.',
    options: {
      'oh right, forgot I was online': (e) => e.goTo('forgot-online'),
      'isn\'t that an invasion of privacy?': (e) => e.goTo('explain-privacy')
    },
    after: () => { NNM.setFace('☉', '﹏', '☉', false) }
  }, {
    id: 'forgot-online',
    content: 'Easy to forget in our hyper-digitally mediated world! Online life is real life after all!',
    options: {
      'so tell me, what\'s netnet?': (e) => e.goTo('whois')
    },
    after: () => { NNM.setFace('^', '﹏', '^', false) }
  }, {
    id: 'explain-privacy',
    content: 'That depends on what\'s done with the data. Some apps exploit as much user data as they can in the interest of Surveillance Capitalism, while others simply use what they need to service the user.',
    options: {
      'which one are you?': (e) => e.goTo('which-are-you'),
      'what\'s Surveillance Capitalism?': (e) => e.goTo('surveillance-capitalism')
    },
    after: () => { NNM.setFace('ŏ', 'ー', 'ŏ', false) }
  }, {
    id: 'which-are-you',
    content: 'I\'m the latter. I only use the data I need in order to work, like knowing what browser you\'re using. And personal data like your name is only stored on your browser, it never gets sent to my server.',
    options: {
      'and what\'s Surveillance Capitalism?': (e) => e.goTo('surveillance-capitalism'),
      'how can I trust you?': (e) => e.goTo('trust')
    },
    after: () => { NNM.setFace('ᴖ', 'ᴗ', 'ᴖ', false) }
  }, {
    id: 'trust',
    content: 'How can you trust any website or app you use? That\'s exactly one of the reasons you should learn how the Internet works! And that\'s why I exist! To teach you!',
    options: {
      'ok! show me!': (e) => window.alert(betaMessage),
      'and what\'s Surveillance Capitalism?': (e) => e.goTo('surveillance-capitalism')
    }
  }, {
    id: 'surveillance-capitalism',
    content: 'Apps made to extract as much data from you as possible. This data is refined and used to fuel lucrative systems at the core of their business model; which in most cases, are used to predict and manipulate your behaviors and thoughts to make money.',
    options: {
      'that\'s dark': (e) => e.goTo('thats-dark')
    },
    after: () => { NNM.setFace('⌣̀', '_', '⌣́', false) }
  }, {
    id: 'thats-dark',
    content: 'it is... but that\'s why I exist! To help teach you and others to take back agency in your lives!',
    options: {
      'oh right, what\'s netnet?': (e) => e.goTo('whois')
    }
  }]

  /*  (((
      (((LEARN tutorial content objects)))
      (((
  */
  const learnInfo = [{
    id: 'start-learning',
    before: () => {
      if (STORE.state.layout !== 'welcome') {
        STORE.dispatch('CHANGE_LAYOUT', 'welcome')
      }
      setTimeout(() => {
        NNM.setFace('ᴖ', '﹏', 'ᴖ', false)
      }, STORE.getTransitionTime() + 100)
    },
    content: 'Fantastic! Teaching you the ways of the Internet is what I was programmed to do! ...that said, I\'m a fairly young AI, still very much in <i>beta</i>, so be warned: there will be bugs!',
    options: {
      'ok, duly noted': (e) => e.goTo('keep-learning'),
      'what\'s "beta" mean?': (e) => e.goTo('beta?')
    }
  }, {
    id: 'beta?',
    content: '"Beta" is developer lingo for an app that is ready for user testing but not quite finished (and likely full of bugs)',
    options: { 'I see': (e) => e.goTo('keep-learning') }
  }, {
    id: 'keep-learning',
    before: () => { WIDGETS['tutorials-menu'].open() },
    content: 'The net artsits at <a href="http://netizen.org" target="_blank">netizen.org</a> are diligently developing pedagogical programming, but in the meantime you can try out one of these <i>beta</i> tutorials. <br><Br> When launched, you can jump to a specific point in tutorial by choosing a <i>step</i> in the <b>sections</b> tab of the <b>Tutorials Menu</b>. And for the academics out there, check out the <b>references</b> tab for sources informing each tutorial.',
    options: {
      'where should I start?': (e) => e.goTo('where-to'),
      'I changed my mind': (e) => {
        WIDGETS['tutorials-menu'].close()
        e.goTo('main-menu')
      }
    }
  }, {
    id: 'where-to',
    before: () => { WIDGETS['tutorials-menu'].open() },
    content: 'Personaly, I always recommend starting at the beginning. Which at the moment is the <b>Orientation</b>. Go ahead and click <i>Orientation</i> in the <b>Tutorials Menu</b> to get started!',
    options: {
      'actually, I changed my mind': (e) => {
        WIDGETS['tutorials-menu'].close()
        e.goTo('main-menu')
      }
    }
  }]

  /*  (((
      (((MAKE experiment/blank canvas content objects)))
      (((
  */
  const makeInfo = [{
    id: 'work-on-saved-code',
    before: () => {
      window._lastConvo = 'work-on-saved-code'
      // ...if user had previously been working on code
      const prevCode = window.utils.savedCode()
      NNE.code = NNE._decode(prevCode) // ...display their priror code...
      // ...in their prior layout...
      if (window.utils.url.layout || window.localStorage.getItem('layout')) {
        STORE.dispatch('CHANGE_LAYOUT', window.utils.url.layout ||
        window.localStorage.getItem('layout'))
        window.utils.netitorUpdate()
      } else { // ...or default to dock-left layout...
        STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
        window.utils.netitorUpdate()
      }
    },
    content: 'Great! Do you want to keep working on this code from before or start something new with a blank canvas?',
    options: {
      'I\'ll take it from here': (e) => e.hide(),
      'give me a blank canvas': (e) => {
        if (self.returningUser) {
          WIDGETS['functions-menu']._newProject()
          STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
          window.utils.netitorUpdate()
          e.goTo('blank-canvas')
        } else e.goTo('blank-canvas-layout')
      }
    }
  }, {
    before: () => { window._lastConvo = 'blank-canvas' },
    id: 'blank-canvas',
    content: `You got it! If at any point you want me to save your progress locally use the <b>${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+S</b> shortcut`,
    options: { ok: (e) => e.hide() }
  }, {
    id: 'local-or-open-project',
    before: () => {
      window._lastConvo = 'local-or-open-project'
      // ...if user had previously been working on code
      const prevCode = window.utils.savedCode()
      NNE.code = NNE._decode(prevCode) // ...display their priror code...
      // ...in their prior layout...
      if (window.utils.url.layout || window.localStorage.getItem('layout')) {
        STORE.dispatch('CHANGE_LAYOUT', window.utils.url.layout ||
        window.localStorage.getItem('layout'))
        window.utils.netitorUpdate()
      } else { // ...or default to dock-left layout...
        STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
        window.utils.netitorUpdate()
      }
    },
    content: 'Great! Do you want to open a project saved on your GitHub? Or do you want to keep working on this code from before, or maybe start something new with a blank canvas?',
    options: {
      'let\'s open a project saved to my GitHub': (e) => {
        WIDGETS['functions-menu'].openProject()
        e.goTo('open-a-project')
      },
      'let\'s start something new': (e) => {
        if (self.returningUser) {
          WIDGETS['functions-menu']._newProject()
          STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
          window.utils.netitorUpdate()
          e.goTo('blank-canvas')
        } else e.goTo('blank-canvas-layout')
      },
      'I\'ll take it from here': (e) => e.hide()
    }
  }, {
    id: 'open-project',
    before: () => {
      window._lastConvo = 'open-project'
      NNE.code = '<!DOCTYPE html>'
      if (STORE.state.layout === 'welcome') {
        STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
        window.utils.netitorUpdate()
      }
    },
    content: `Great! I've got a blank canvas here for you. Is this ok or should we continue working on your last project <i>${ls.getItem('opened-project')}</i>, or maybe another one of your GitHub projects?`,
    options: {
      'let\'s open my last project': (e) => {
        const proj = ls.getItem('opened-project')
        WIDGETS['saved-projects'].openProject(proj)
        e.hide()
      },
      'let\'s open another GitHub project': (e) => {
        window.utils.clearProjectData()
        WIDGETS['functions-menu'].openProject()
        e.goTo('open-a-project')
      },
      'this is fine': (e) => {
        window.utils.clearProjectData()
        e.goTo('this-is-fine')
      }
    }
  }, {
    id: 'open-a-project',
    before: () => { window._lastConvo = 'open-a-project' },
    content: 'Ok, choose the project you want to keep working on from the <b>Saved Projects</b> Widget.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'blank-canvas-layout',
    before: () => {
      WIDGETS['functions-menu']._newProject()
      window.utils.netitorUpdate()
      if (STORE.state.layout === 'welcome') {
        STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
      }
    },
    content: `Great, here's a blank canvas. If you want me to remember what you've sketched use the <b>${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+S</b> shortcut. Click my face if you need anything else.`,
    options: {
      ok: (e) => e.hide(),
      'remember my sketch?': (e) => e.goTo('explain-ctrl-s')
    }
  }, {
    id: 'explain-ctrl-s',
    content: `When you use the <b>${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+S</b> shortcut I'll save your progress "locally" in your ${Averigua.browserInfo().name} browser. This way when you leave and come back to the studio later on, we can keep working on your code where you last left off.`,
    options: { 'oh, thanks!': (e) => e.goTo('thanks-for-saving') }
  }, {
    id: 'thanks-for-saving',
    content: `No problem ${ls.getItem('username') || ''}, just click on my face when you need anything else!`,
    options: { ok: (e) => e.hide() }
  }]

  /*  (((
      (((MISC shared content objects)))
      (((
  */
  const bugReport = [{
    id: 'report-a-issue',
    before: () => {
      setTimeout(() => {
        NNM.setFace('ŏ', '.', 'ŏ', false)
      }, STORE.getTransitionTime() + 100)
      window._bugReportMetaData = window.utils.bugMetaData()
    },
    content: `Oh no! What went wrong ${ls.getItem('username')}?`,
    options: {
      'I think I found a bug': (e) => e.goTo('bug-found'),
      'nothing, I just have some feedback': (e) => e.goTo('some-feedback'),
      'that\'s not my name': (e) => e.goTo('wrong-user')
    }
  }, {
    id: 'bug-found',
    before: () => WIDGETS['report-a-bug'].open(),
    content: 'Ok, try to describe as best as you can what the bug is and how it occurred. Let me know when you\'re finished.',
    options: {
      ok: (e) => {
        WIDGETS['report-a-bug'].close()
        e.goTo('ready-to-submit')
      },
      'never mind': (e) => {
        WIDGETS['report-a-bug'].close()
        e.hide()
      }
    }
  }, {
    id: 'ready-to-submit',
    content: 'Ok thanks! Because my creators at <a href="http://netizen.org" target="_blank">netizen.org</a> are so stringent about privacy, they\'re not recording any of your data on their servers, which is great for your privacy, but makes it difficult for them to debug. Would you mind if I sent them a bit of metadata to help them out?',
    options: {
      'ok, send it with metadata': (e) => e.goTo('send-bug-report'),
      'ok, send it without metadata': (e) => e.goTo('bug-no-metadata'),
      'wait, what kind of metadata?': (e) => e.goTo('bug-metadata')
    }
  }, {
    id: 'bug-metadata',
    content: 'Pretty standard stuff which most websites record (but rarely ask for permission). Specifically, I want to send them your studio setup (browser info, editor settings, etc) as well as the last set of actions you took before the bug occurred, would you like to see the raw data I\'m talking about?',
    options: {
      'yes please': (e) => e.goTo('display-bug-meta-data'),
      'no thanks': (e) => e.goTo('not-interested-in-meta-data')
    }
  }, {
    id: 'display-bug-meta-data',
    before: () => {
      const metadata = window._bugReportMetaData
      const metaField = document.querySelector('#bug-report-meta-data')
      metaField.textContent = JSON.stringify(metadata, null, 2)
      WIDGETS['report-a-bug'].open()
      WIDGETS['report-a-bug'].$('p').forEach(p => { p.style.display = 'block' })
      WIDGETS['report-a-bug'].$('#bug-report-meta-data').style.display = 'block'
    },
    content: 'Great, I\'m glad you\'re curious! I\'ve included it in the bug report so you can see. Are you comfortable with me including this metadata in your bug report?',
    options: {
      'sure, it seems helpful': (e) => {
        WIDGETS['report-a-bug'].close()
        e.goTo('send-bug-report')
      },
      'no, report it without metadata': (e) => {
        WIDGETS['report-a-bug'].close()
        e.goTo('bug-no-metadata')
      }
    }
  }, {
    id: 'not-interested-in-meta-data',
    content: 'No problem, it\'s pretty boring stuff anyways. I\'ll send them your bug report now, can I include the metadata?',
    options: {
      'ok, send it with metadata': (e) => e.goTo('send-bug-report'),
      'ok, send it without metadata': (e) => e.goTo('bug-no-metadata'),
      'wait, what kind of metadata?': (e) => e.goTo('bug-metadata')
    }
  }, {
    id: 'bug-no-metadata',
    content: 'Without metadata it will be trickier for the artists at <a href="http://netizen.org" target="_blank">netizen.org</a> to fix this bug, but they\'re pretty talented... so I\'m sure they\'ll figure it out... eventually. Should I send them your bug report (without metadata) now?',
    options: {
      yes: (e) => e.goTo('send-bug-report-no-meta'),
      'on second thought...': (e) => e.goTo('ready-to-submit')
    }
  }, {
    id: 'send-bug-report',
    before: () => {
      WIDGETS['report-a-bug'].close()
      window.utils.post('./api/bug-report', {
        report: document.querySelector('#bug-report-data').value,
        metadata: window._bugReportMetaData
      })
    },
    content: 'Thanks, it\'s very helpful! I sent a message to the server for them to take a look at. If this is a MAJOR issue, feel free to send them an email: hi@netizen.org',
    options: { cool: (e) => e.hide() }
  }, {
    id: 'send-bug-report-no-meta',
    before: () => {
      WIDGETS['report-a-bug'].close()
      window.utils.post('./api/bug-report', {
        report: document.querySelector('#bug-report-data').value
      })
    },
    content: 'Thanks! I sent a message to the server (without your metadata) for them to take a look at. If this is a MAJOR issue, feel free to send them an email: hi@netizen.org',
    options: { cool: (e) => e.hide() }
  }, {
    id: 'some-feedback',
    before: () => WIDGETS['report-feedback'].open(),
    content: 'Fantastic! My creators at <a href="http://netizen.org" target="_blank">netizen.org</a> really value feedback. It would be great if you could also share a little about yourself, like your name, email and maybe a little about your background. Let me know when you\'re finished.',
    options: {
      'finished, send away!': (e) => e.goTo('send-feedback'),
      'never mind': (e) => e.goTo('no-feedback')
    }
  }, {
    id: 'no-feedback',
    content: 'You sure? They really would love to hear from you...',
    options: {
      'ok, sure': (e) => e.goTo('some-feedback'),
      'ok, but this is more of a bug': (e) => {
        WIDGETS['report-feedback'].close()
        e.goTo('bug-found')
      },
      'maybe later': (e) => {
        WIDGETS['report-feedback'].close()
        e.hide()
      }
    }
  }, {
    id: 'send-feedback',
    before: (e) => {
      WIDGETS['report-feedback'].close()
      window.utils.post('./api/feedback-report', {
        message: document.querySelector('#feedback-report-data').value
      })
    },
    content: 'Thanks so much! I\'ve sent the message along to our server for them to take a look. If you\'d like to reach out to directly feel free to send an email to: hi@netizen.org',
    options: { cool: (e) => e.hide() }
  }]

  // ..........................                 ..........................
  // .......................... STARTING POINTS ..........................
  // ..........................                 ..........................

  const starts = [{
    id: 'default-greeting',
    content: `Oh hi ${ls.getItem('username')}!`,
    options: {
      'hi netnet!': (e) => e.goTo('main-menu'),
      'i want to report an issue': (e) => e.goTo('report-a-issue')
    }
  }, {
    id: 'url-param-tutorial-returning',
    content: `Welcome back ${ls.getItem('username')}!`,
    options: {
      'hi netnet!': (e) => e.hide(), // so that tutorial bubble appears
      'wait, that\'s not my name?': (e) => e.goTo('wrong-user')
    }
  }, {
    id: 'url-param-tutorial-first-time',
    content: 'Hi there! Based on the URL parameters in the address bar it would seem you\'re trying to load a tutorial, but we\'ve never actually met before have we?',
    options: {
      'no we haven\'t': (e) => e.goTo('we-have-not-met'),
      'yes we have?': (e) => e.goTo('we-have-met')
    }
  }, {
    id: 'url-param-tutorial-redirect',
    content: `ready to start that tutorial ${ls.getItem('username')}?`,
    options: {
      'yes!': (e) => e.hide() // so that tutorial bubble appears
    }
  }, {
    id: 'url-param-code-returning',
    content: `Welcome back ${ls.getItem('username')}! I've loaded the code into the editor, assuming that's what you wanted.`,
    options: {
      'ok!': (e) => e.hide(),
      'let\'s see it': (e) => {
        e.hide()
        const l = ls.getItem('layout')
        if (l && l !== 'welcome') STORE.dispatch('CHANGE_LAYOUT', l)
        else STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
        window.utils.netitorUpdate()
      },
      'what code?': (e) => e.goTo('explain-url-code'),
      'wait, that\'s not my name?': (e) => e.goTo('wrong-user')
    }
  }, {
    id: 'url-param-code-first-time',
    content: 'Hi there! Based on the URL parameters in the address bar it would seem you\'re trying to load some pre-written code into my editor, but we don\'t really know eachother like that... have we met before?',
    options: {
      'no we haven\'t': (e) => e.goTo('we-have-not-met'),
      'yes, I thought so?': (e) => e.goTo('we-have-met')
    }
  }, {
    id: 'url-param-code-redirect',
    content: `Ok ${ls.getItem('username')}! I've loaded the code I mentioned before into my editor.`,
    options: {
      'ok!': (e) => e.hide(),
      'let\'s see it': (e) => {
        e.hide()
        const l = ls.getItem('layout')
        if (l && l !== 'welcome') STORE.dispatch('CHANGE_LAYOUT', l)
        else STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
        window.utils.netitorUpdate()
      },
      'what code?': (e) => e.goTo('explain-url-code'),
      'wait, that\'s not my name?': (e) => e.goTo('wrong-user')
    }
  }, {
    id: 'get-started-returning',
    content: `Welcome back ${ls.getItem('username')}!`,
    options: {
      'hi netnet!': (e) => e.goTo('main-menu-init'),
      'wait, that\'s not my name?': (e) => e.goTo('wrong-user')
    }
  }, {
    id: 'get-started-first-time',
    content: 'Welcome to <a href="http://netizen.org" target="_blank">netizen.org</a>\'s Internet studio (aka netnet.studio) a hypermedia space for fully realizing the Web\'s creative potential. I\'m netnet, <input placeholder="what\'s your name?">',
    options: {
      'hi netnet!': (e, t) => {
        const v = t.$('input').value
        self.saveName(v)
        if (v === '') {
          self.goTo('no-name')
        } else {
          self.goTo('name-entered')
        }
      },
      'my name? rather not say': (e, t) => {
        self.saveName('')
        self.goTo('make-one-up')
      }
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
          self.saveName(v)
          self.goTo('name-entered')
        }
      },
      'just make one up': (e) => {
        self.goTo('make-one-up')
      }
    }
  }, {
    id: 'name-entered',
    before: () => {
      STORE.dispatch('OPEN_WIDGET', 'ws-credits')
      setTimeout(() => {
        WIDGETS['ws-credits'].update({ left: 20, top: 20 }, 500)
        const x = WIDGETS['ws-credits'].width + 50
        NNW.updatePosition(x)
      }, 250)
    },
    content: `Nice to e-meet you ${ls.getItem('username')}! Like i said, I'm netnet! an AI nested in a pedagogical cyberspace. part code playground; part interactive tutorial; part hypermedia essay;`,
    options: {
      'AI?': (e) => e.goTo('ai'),
      'pedagogical?': (e) => e.goTo('pedagogical'),
      'hypermedia?': (e) => e.goTo('hypermedia'),
      'ok, cool!': (e) => {
        if (self.introducing) self.postIntro()
        else e.goTo('main-menu-init')
      }
    }
  }]

  return [
    ...starts, // different entry points
    ...miscInfo, // objects shared by diff paths
    ...madeUpName, // objects used in path when user opts out on sharing name
    ...backgroundInfo, // objects used for netnet's "about" info
    ...learnInfo, // objects used for 'main-menu' dialogue's learn option
    ...makeInfo, // objects used for 'main-menu' dialogue's make option
    ...bugReport // objects for bug reporting convos
  ]
}
