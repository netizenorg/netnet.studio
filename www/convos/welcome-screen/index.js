/* global Averigua, WIDGETS, STORE, NNM, NNW, Widget */
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
    title: 'netnet.studio',
    innerHTML: '<p>netnet is a netizen.org project being designed and devloped by Nick Briz and Sarah Rooney with creative support from Jon Satrom and administrative support form Mike Constantino.</p><p>netizen.org is a collective of new media artists and activists on a mission to reestablish human agency in the information age through community and digital programming. Geolocated in Chicago, Illinois—at the intersection of digital literacy and net art—netizen.org transforms users into netizens, which are critically engaged citizens of the net.</p><p>netnet.studio was made possible with support from the <a href="http://clinicopensourcearts.com/" target="_blank">Clinic for Open Source Arts</a> and the <a href="https://www.saic.edu/academics/departments/contemporary-practices" target="_blank">Contemporary Practices Department at the School of the Art Institute of Chicago</a>.</p><p style="display:flex; justify-content:space-around; align-items:center;"><img style="display:inline-block;width:177px;" src="convos/welcome-screen/files/cosa-bw.png" alt="the Clinic for Open Source Arts"><img style="display:inline-block;width:273px;" src="convos/welcome-screen/files/saic-cp.png" alt="the Contemporary Practices Department at the School of the Art Institute of Chicago"></p>'
  })
}
STORE.dispatch('LOAD_WIDGETS', window.greetings.widgets)
window.convos['welcome-screen'] = (self) => {
  // TODO: link keywords to "wikipedia" widgets (i-frame browser widget)
  const betaMessage = '◕ ◞ ◕ oops! that tutorial isn\'t ready yet! netnet.stuio is still in <beta>, get in touch if you want to help $upport us: hi@netizen.org'
  const ls = window.localStorage
  // NOTE: avoiding using username in any of the backgroundInfo
  // b/c these paths are used by various of the below starting points.
  // best to keep backgroundInfos generic
  const backgroundInfo = [{
    id: 'main-menu',
    content: 'What do you want to do now?',
    options: {
      'learn to make Internet Art': (e) => {
        // NOTE: THIS IS TEMPORARY
        window.greetings.injectStarterCode()
        setTimeout(() => {
          NNM.setFace('ᴖ', '﹏', 'ᴖ', false)
        }, STORE.getTransitionTime() + 100)
        e.goTo('start-learning')
        // TODO: once we've got the orientation tutorial && a couple
        // of others, we should say something like:
        // want to get oriented? or try one of our beta-tutorials
        // (maybe even a "what's beta mean?" to explain status of project)
      },
      'give me a blank canvas': (e) => {
        e.goTo('blank-canvas-layout')
        if (STORE.state.layout === 'welcome') {
          STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
        }
        WIDGETS['functions-menu'].newProject()
      },
      'open my last project': (e) => window.utils.openProjectPrompt(),
      'what\'s netnet': (e) => {
        if (STORE.state.layout !== 'welcome') {
          STORE.dispatch('CHANGE_LAYOUT', 'welcome')
        }
        STORE.dispatch('OPEN_WIDGET', 'ws-credits')
        setTimeout(() => {
          WIDGETS['ws-credits'].update({ left: 20, top: 20 }, 500)
          const x = WIDGETS['ws-credits'].width + 50
          NNW.updatePosition(x)
        }, 250)
        e.goTo('whois')
      }
    }
  }, {
    id: 'blank-canvas-layout',
    content: 'Is this layout ok? Want me to change the theme or anything?',
    options: {
      'this is fine': (e) => e.goTo('this-is-fine'),
      'that would be nice': (e) => e.goTo('layout-help')
    }
  }, {
    id: 'this-is-fine',
    content: 'great, just click my face if you need anything.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'layout-help',
    content: 'You can change all of my editor settings in my "Functions" menu, just click my face to launch the menu options.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'start-learning',
    content: 'Fantastic! ...except that the tutorials aren\'t ready yet. In the mean time you can experiment with the code generating this pretty background?',
    options: {
      'ok!': (e) => {
        if (STORE.state.layout === 'welcome') {
          STORE.dispatch('CHANGE_LAYOUT', 'separate-window')
        }
        e.goTo('experiment')
      },
      'tell me about netnet': (e) => e.goTo('whois')
    }
  }, {
    id: 'experiment',
    content: 'Change the code in my editor! Don\'t worry about messing anything up, I\'ll warn you if you make a mistake.',
    options: { 'anything else I should know?': (e) => e.goTo('experiment-2') }
  }, {
    id: 'experiment-2',
    content: 'Double click any piece of code if you want me to explain it to you. You can also click on my face at any point to open my menu. Sound good?',
    options: { cool: (e) => e.hide() }
  }, {
    id: 'whois',
    content: 'netnet? that\'s me! an AI nested in a pedagogical cyberspace. part code playground; part interactive tutorial; part hypermedia essay;',
    options: {
      'cool!': (e) => e.goTo('main-menu'),
      'AI?': (e) => e.goTo('ai'),
      'pedagogical?': (e) => e.goTo('pedagogical'),
      'hypermedia?': (e) => e.goTo('hypermedia')
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
    }
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
    }
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
    }
  }, {
    id: 'xerox-parc',
    content: 'Nope, Adele Goldberg and Alan Kay did. At a time (1977) when computers where huge institution owned machines, they <a href="http://www.newmediareader.com/book_samples/nmr-26-kay.pdf" target="_blank">imagined</a> "personal" computers. While working on that they made the first computers with real "graphical user interfaces" at Xerox PARC, a system they called SmallTalk.',
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
    }
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
    }
  }, {
    id: 'machine-learning',
    content: 'ML is a very powerful and contemporary approach to AI. But it\'s magic requires troves of organized (labeled) data and an immense amount of computational resources, such that only a relatively few institutions have access to this power (regardless of however "open source" the libraries used to create these models may be).',
    options: {
      'so no ML for me?': (e) => e.goTo('ml-for-me'),
      'I see, and netnet?': (e) => e.goTo('whois')
    }
  }, {
    id: 'ml-for-me',
    content: 'Well not necessarily! There are lots of ways artists can leverage the power of Machine Learning in their work, I can teach you!',
    options: {
      'ok!': (e) => window.alert(betaMessage),
      'no, tell me about netnet': (e) => e.goTo('whois')
    }
  }]
  return {
    'quick-menu': [{
      content: 'What do you want to do?',
      options: {
        'learn to make Internet Art': (e) => {
          WIDGETS['functions-menu'].close()
          // NOTE: THIS IS TEMPORARY
          window.greetings.injectStarterCode()
          setTimeout(() => {
            NNM.setFace('ᴖ', '﹏', 'ᴖ', false)
          }, STORE.getTransitionTime() + 100)
          e.goTo('start-learning')
          // TODO: once we've got the orientation tutorial && a couple
          // of others, we should say something like:
          // want to get oriented? or try one of our beta-tutorials
          // (maybe even a "what's beta mean?" to explain status of project)
        },
        'give me a blank canvas': (e) => {
          WIDGETS['functions-menu'].close()
          e.hide()
          if (STORE.state.layout === 'welcome') {
            STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
          }
          WIDGETS['functions-menu'].newProject()
        },
        'open my last project': (e) => {
          WIDGETS['functions-menu'].close()
          window.utils.openProjectPrompt()
        },
        'tell me about netnet': (e) => {
          WIDGETS['functions-menu'].close()
          if (STORE.state.layout !== 'welcome') {
            STORE.dispatch('CHANGE_LAYOUT', 'welcome')
          }
          STORE.dispatch('OPEN_WIDGET', 'ws-credits')
          setTimeout(() => {
            WIDGETS['ws-credits'].update({ left: 20, top: 20 }, 500)
            const x = WIDGETS['ws-credits'].width + 50
            NNW.updatePosition(x)
          }, 250)
          e.goTo('whois')
        },
        'never mind': (e) => e.hide()
      }
    }, ...backgroundInfo],
    'face-click': [{
      content: `Oh hi ${ls.getItem('username')}!`,
      options: {
        'hi netnet!': (e) => e.goTo('main-menu'),
        'wait, that\'s not my name?': (e) => e.goTo('wrong-user')
      }
    }, ...backgroundInfo],
    'get-started-returning': [{
      content: `Welcome back ${ls.getItem('username')}!`,
      options: {
        'hi netnet!': (e) => e.goTo('main-menu'),
        'wait, that\'s not my name?': (e) => e.goTo('wrong-user')
      }
    }, {
      id: 'wrong-user',
      content: `It's not? woops! I can't actually <i>see you</i>, just your computer. It seems someone named ${ls.getItem('username')} was on this computer before you.`,
      options: {
        'I see, let\'s reboot then!': (e) => WIDGETS['functions-menu'].reboot()
      }
    }, ...backgroundInfo],
    'get-started-first-time': {
      content: 'Welcome to <a href="http://netizen.org" target="_blank">netizen.org</a>\'s Internet studio (aka netnet.studio) a hypermedia space for fully realizing the Web\'s creative potential. I\'m netnet, <input placeholder="what\'s your name?">',
      options: {
        'hi netnet!': (e, t) => {
          const v = t.$('input').value
          self.saveName(v)
          if (v === '') {
            e.hide()
            self.goTo('no-name')
          } else {
            e.hide()
            self.goTo('name-entered')
          }
        },
        'my name? rather not say': (e, t) => {
          self.saveName('')
          e.hide()
          self.goTo('make-one-up')
        },
        'whois netnet?': (e, t) => {
          const v = t.$('input').value
          self.saveName(v)
          if (v === '') {
            e.hide()
            self.goTo('no-name')
          } else {
            e.hide()
            self.goTo('whois')
            STORE.dispatch('OPEN_WIDGET', 'ws-credits')
            setTimeout(() => {
              WIDGETS['ws-credits'].update({ left: 20, top: 20 }, 500)
              const x = WIDGETS['ws-credits'].width + 50
              NNW.updatePosition(x)
            }, 250)
          }
        }
      }
    },
    'no-name': {
      content: 'Wait a sec, I didn\'t get your name. Should i make one up? or did you forget to tell me: <input placeholder="type your preferred name here">',
      options: {
        'here you go': (e, t) => {
          const v = t.$('input').value
          if (v === '') {
            window.alert('◕ ◞ ◕ the input field is still empty... just click "make one up" if you don\'t want to enter your name')
          } else {
            self.saveName(v)
            e.hide()
            self.goTo('name-entered')
          }
        },
        'just make one up': (e) => {
          e.hide()
          self.goTo('make-one-up')
        }
      }
    },
    'name-entered': [{
      content: `Nice to e-meet you ${ls.getItem('username')}! Like i said, I'm netnet! an AI nested in a pedagogical cyberspace. part code playground; part interactive tutorial; part hypermedia essay;`,
      options: {
        'cool!': (e) => e.goTo('main-menu'),
        'AI?': (e) => e.goTo('ai'),
        'pedagogical?': (e) => e.goTo('pedagogical'),
        'hypermedia?': (e) => e.goTo('hypermedia')
      }
    }, ...backgroundInfo],
    'make-one-up': [{
      content: `ok! I'm going to call you ${ls.getItem('username')}!`,
      options: {
        'why that name?': (e) => e.goTo('made-up-name'),
        '...um ok, netnet': (e) => e.goTo('whois')
      }
    }, {
      id: 'made-up-name',
      content: (() => {
        const p = Averigua.platformInfo()
        const a = p.platform.substr(0, 3)
        const b = p.browser.name.toLowerCase().substr(0, 4)
        let content = `<i>${a}</i> because you're on a ${p.platform} device; <i>${b}</i> becuase you're using version ${p.browser.version} of the ${p.browser.name} browser;`
        if (window.greetings.city) {
          const c = window.greetings.city.substr(0, 4)
          content += `<i>${c}</i> because you're currently located in the city of ${window.greetings.city};`
        }
        return content
      })(),
      options: {
        'i see, very creative': (e) => e.goTo('main-menu'),
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
        'so tell me, what\'s netnet?': (e) => e.goTo('whois')
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
      content: 'I\'m the later. I only use the data I need in order to work, like knowing what browser you\'re using. And personal data like your name is only stored on your browser, it neves gets sent to my server.',
      options: {
        'and what\'s Surveillance Capitalism?': (e) => e.goTo('surveillance-capitalism'),
        'how can I trust you?': (e) => e.goTo('trust')
      }
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
      }
    }, {
      id: 'thats-dark',
      content: 'it is... but that\'s why I exist! To help teach you and others to take back agency in their your lives!',
      options: {
        'oh right, what\'s netnet?': (e) => e.goTo('whois')
      }
    }, ...backgroundInfo]
  }
}
