/* global NNE NNT NNW Widget WIDGETS HyperVidPlayer utils STORE greetings, TUTORIAL */
window.TUTORIAL = {
  onload: () => {
    NNE.addCustomRoot('tutorials/form-alism/')
    utils.get('tutorials/form-alism/files/bg.html', (txt) => {
      TUTORIAL.bg = txt
      NNE.code = txt
    }, true)
  },

  steps: [{
    before: () => {
      WIDGETS['Rachel-Greene-(from-"Web-Work")-quote-w0'].open()
      WIDGETS['Rachel-Greene-(from-"Web-Work")-quote-w0'].update({ left: 20, bottom: 20 }, 500)
      NNE.lint = false
      NNE.code = TUTORIAL.bg
    },
    id: 'jodi.org',
    content: 'No one has influenced the aesthetic of Internet art more than jodi.org. That\'s an opinion of course, but it\'s not a difficult argument to make. From minimalist ASCII art made entirely in text and distributed via emails, to maximalist desktop performances encompassing as many apps as their operating system could load into RAM, jodi.org managed to keep this aesthetic chaotically consistent.',
    options: { ok: (e) => e.goTo('nn-1') }
  }, {
    id: 'nn-1',
    content: 'And though browsing their work feels like perusing pure pandemonium, there\'s a consistent thematic thread running through their oeuvre. Whether their creating video game mods or authoring mysterious bot like social media profiles, their work is persistently asking: what is the true nature of the digital medium and what is (or should be) our relationship to it?',
    options: { ok: (e) => e.goTo('nn-2') }
  }, {
    before: () => {
      WIDGETS['Rachel-Greene-(from-"Web-Work")-quote-w0'].close()
      const x = window.innerWidth - 20 - NNW.win.offsetWidth
      NNW.updatePosition(x)
      WIDGETS['jodi-dot-org'].open()
      WIDGETS['jodi-dot-org'].update({ left: 20, top: 20 }, 500)
      WIDGETS['jodi-dot-org'].play()
      WIDGETS['jodi-dot-org'].at(158.5, (v) => {
        v.pause()
        NNT.goTo('nn-3')
      })
    },
    id: 'nn-2',
    content: 'I could go on, but I\'ll let jodi.org explain it themselves.',
    options: { ok: (e) => e.goTo('nn-3') }
  }, {
    before: () => {
      WIDGETS['jodi-dot-org'].update({ width: window.innerWidth * 0.25 }, 500)
      NNW.updatePosition()
    },
    id: 'nn-3',
    content: 'It\'s worth noting how rare, and somewhat bizarre, it is to hear jodi.org speak about their work so candidly. jodi.org rarely ever do interviews, and when they have they\'ve often been over e-mail, consisting mostly of incomprehensible noisy glitch ASCII art. They\'ve intentionally avoided writing a proper artist statement or artist bio (the kind every artist is forced to awkwardly write in the third person)',
    options: {
      'incomprehensible emails?': (e) => e.goTo('incomprehensible-emails'),
      ok: (e) => e.goTo('nn-9')
    }
  }, {
    before: () => {
      NNE.lint = false
      NNE.code = TUTORIAL.bg
    },
    id: 'incomprehensible-emails',
    content: 'Well, nearly incomprehensible. You really had to take your time to decipher exactly what it was they were saying in response. Their responses appeared as though a malfunctioning bot was responding for them.',
    options: { ok: (e) => e.goTo('incomprehensible-emails?-5') }
  }, {
    id: 'incomprehensible-emails?-5',
    content: 'The organizers of the first first <a href="http://gli.tc/h/" target="_blank">GLI.TC/H</a> conference in 2010 modeled their communications on jodi.org\'s glitchy online persona. Nick Briz, Jon Satrom (both <a href="https://netizen.org" target="_blank">netizen.org</a> founders), Rosa Menkman and Evan Meaney remained anonymous for most of the events planning, communicating with partipants and press simply as "the glitchbots".',
    options: { ok: (e) => e.goTo('incomprehensible-emails?-6') }
  }, {
    before: () => {
      WIDGETS['jodi-glitch-invite-w2'].open()
      WIDGETS['jodi-glitch-invite-w2'].update({ left: 20, top: 20 }, 500)
    },
    id: 'incomprehensible-emails?-6',
    content: 'These glitchy correspondences got particularly meta when they invited jodi.org to present work at the conference as well as give a virtual lecture to the conference audience in Chicago. Take a look a this email exchange.',
    options: { ok: (e) => e.goTo('incomprehensible-emails?-7') }
  }, {
    id: 'incomprehensible-emails?-7',
    content: 'Though jodi.org responded point by point to the glitchbots\' email invite, the organizers weren\'t actually sure if jodi.org was going to show up on skype until the moment of the actual lecture. At which point they showed up on stream <a href="https://www.youtube.com/watch?v=rGQEwYJZzqo&list=PL3228E09A837979FB&index=16" target="_blank">upside down</a>... classic jodi.org.',
    options: { ok: (e) => e.goTo('incomprehensible-emails?-8') }
  }, {
    before: () => {
      WIDGETS['jodi-glitch-404-w3'].open()
      WIDGETS['jodi-glitch-404-w3'].update({ left: 40, bottom: 20 }, 500)
    },
    id: 'incomprehensible-emails?-8',
    content: 'The following year the glitchbots invited jodi.org to collaborate with them to produce the conference\'s official 404 page, which was in part a conference "easter egg" but also an homage to jodi.org\'s classic 1998 net.art piece <a href="http://404.jodi.org/" target="_blank">404.jodi.org</a>. This collaboration took place entirely over e-mail, with the glitchbots and jodi.org discussing the details of the project in a nearly incomprehensible exchange.',
    options: { ok: (e) => e.goTo('nn-9') }
  }, {
    before: () => {
      WIDGETS['jodi-glitch-invite-w2'].close()
      WIDGETS['jodi-glitch-404-w3'].close()
      WIDGETS['Rafaël-Rozendaal-quote-w4'].open()
      WIDGETS['Rafaël-Rozendaal-quote-w4'].update({ left: 20, bottom: 20 }, 500)
    },
    id: 'nn-9',
    content: 'This carefully crafted online persona has always been a very intentional part of their practice, and as Internet artist Rafaël Rozendaal explained in <a href="https://youtu.be/YuxLGvkg-3k" target="_blank">his video tour of jodi.org\'s work</a>, it\'s also reflected in the way they\'ve chosen to share their work on their main homepage, the URL for which is also their collective name, <a href="http://jodi.org" target="_blank">jodi.org</a>',
    options: { ok: (e) => e.goTo('nn-10') }
  }, {
    before: () => {
      WIDGETS['Rafaël-Rozendaal-quote-w4'].close()
      WIDGETS['Rachel-Greene-(from-"Internet-Art")-quote-w5'].open()
      WIDGETS['Rachel-Greene-(from-"Internet-Art")-quote-w5'].update({ left: 40, bottom: 40 }, 500)
      NNE.lint = false
      utils.get('tutorials/form-alism/files/jodi-ascii.html', (txt) => {
        NNE.code = txt
      }, true)
    },
    id: 'nn-10',
    content: 'And so, they\'ve largely left it up to new media art curators and theorists to analyze their work, and as Dirk alluded to in the video, few works of net.art have been written about more than their piece <a href="https://wwwwwwwww.jodi.org/" target="_blank">wwwwwwwww.jodi.org</a> (1995) aka the "misconfigured ASCII drawing" which you see behind me.',
    options: { ok: (e) => e.goTo('nn-11') }
  }, {
    id: 'nn-11',
    content: 'This is one of many examples where jodi.org brings the code to the foreground. As Rachel Green described in her book <i>Internet Art</i>, this piece flips the traditional relationship between code input and rendered output. Where typically it\'s the former (the code) which is opaque to most netizens and the latter (the rendered page) which is "readable", here jodi.org turns our expectations upside down, as they often do.',
    options: { ok: (e) => e.goTo('nn-12') }
  }, {
    before: () => {
      WIDGETS['Rachel-Greene-(from-"Internet-Art")-quote-w5'].close()
      const x = window.innerWidth - 20 - NNW.win.offsetWidth
      NNW.updatePosition(x)
      setTimeout(() => {
        WIDGETS['jodi-dot-org'].$('video').currentTime = 158.5
        WIDGETS['jodi-dot-org'].play()
        WIDGETS['jodi-dot-org'].update({ width: window.innerWidth * 0.7 }, 500)
        WIDGETS['jodi-dot-org'].at(187.7, (v) => {
          v.pause()
          NNT.goTo('nn-13')
        })
      }, 3000)
    },
    id: 'nn-12',
    content: 'And while turning our exceptions upside down is classic jodi.org, this wasn\'t necessarily what jodi.org had set out to do as Dirk explains...',
    options: { ok: (e) => e.goTo('nn-13') }
  }, {
    id: 'nn-13',
    before: () => {
      WIDGETS['jodi-dot-org'].update({
        width: window.innerWidth * 0.25
      }, 500)
      NNW.updatePosition()
    },
    content: 'So, initially, they were actually working on an ASCII art drawing. It was meant to be a mysterious pseudo-scientific looking diagram, the first of many mysterious pages which you begin to discover after clicking on it (the entire drawing is a giant link).',
    options: { ok: (e) => e.goTo('nn-14') }
  }, {
    id: 'nn-14',
    content: 'But after making a mistake in their HTML code, what they got instead was abstract ASCII gibberish. As we discussed in the last tutorial, jodi.org is known for embracing their mistakes rather than "fixing them". In this case they felt the broken drawing helped add to the mystery, not detract from it, and so they kept it.',
    options: {
      'what\'s ASCII Art?': (e) => e.goTo('ascii-art'),
      ok: (e) => e.goTo('jodi-src-1')
    }
  }, {
    before: () => {
      NNE.lint = false
      utils.get('tutorials/form-alism/files/jodi-ascii.html', (txt) => {
        NNE.code = txt
      }, true)
    },
    id: 'ascii-art',
    content: 'Right! I should probably explain what ASCII Art is, seeing as how I\'ve referenced it a few times already. ASCII stands for the <a href="https://en.wikipedia.org/wiki/ASCII" target="_blank">American Standard Code for Information Interchange</a>, it\'s one of the earliest text encoding standards, established in 1960.',
    options: { ok: (e) => e.goTo('what\'s-ASCII?-16') }
  }, {
    id: 'what\'s-ASCII?-16',
    content: 'Computers only understand "machine code", the raw number values (usually represented in binary or hex) that make up all of the data and instructions inside the computer\'s memory. But because it\'s nearly impossible for humans to read and write raw binary code, standards were developed to map machine code values to specific textual symbols or "characters", ASCII is one such mapping.',
    options: { ok: (e) => e.goTo('what\'s-ASCII?-17') }
  }, {
    id: 'what\'s-ASCII?-17',
    content: 'In the early days of computers, before we had images, videos and other media types, all you ever saw on a computer screen were these ASCII characters. And so the earliest forms of art on the Internet where made entirely out of ASCII, hence the term ASCII art.',
    options: { ok: (e) => e.goTo('what\'s-ASCII?-18') }
  }, {
    id: 'what\'s-ASCII?-18',
    content: 'The first examples of ASCII art appeared on pre-Web Internet forums known as <a href="https://en.wikipedia.org/wiki/Bulletin_board_system" target="_blank">bulletin board systems</a> (BBS) and ranged from simple emoticons to elaborate compositions.',
    options: { ok: (e) => e.goTo('what\'s-ASCII?-19') }
  }, {
    id: 'what\'s-ASCII?-19',
    content: 'In the BBS days netizen folk artists formed groups known as "crews" to collaborate with each other and distribute their works via downloadable "art packs". Check out Internet archivst Jason Scott\'s documentary on BBSes to learn more about this early Internet <a href="https://www.youtube.com/watch?v=oQrBbm5ZMlo" target="_blank">ARTSCENE</a> which predates even the net.art movement.',
    options: { ok: (e) => e.goTo('what\'s-ASCII?-20') }
  }, {
    before: () => {
      WIDGETS['vuk-cosic-ascii-birds'].open()
      WIDGETS['vuk-cosic-ascii-birds'].update({ left: 20, top: 20 }, 500)

      WIDGETS['alexei-shulgin-goggles'].open()
      WIDGETS['alexei-shulgin-goggles'].volume = 0.5
      WIDGETS['alexei-shulgin-goggles'].update({ right: 20, bottom: 20 }, 500)
    },
    id: 'what\'s-ASCII?-20',
    content: 'In the 90s the net.art scene took ASCII art to a new level. Vuk Cosic made an etnire series of ASCII video remixes of classic films and Alexei Shulgin even made AR goggles for viewing the real world entirely in ASCII in realtime.',
    options: { ok: (e) => e.goTo('what\'s-ASCII?-21') }
  }, {
    id: 'what\'s-ASCII?-21',
    content: 'Even though it\'s one of the earliest Internet art sub-genres, artists like jodi.org still incorporate ASCII art into various aspects of their work today.',
    options: { ok: (e) => e.goTo('jodi-src-1') }
  }, {
    before: () => {
      WIDGETS['jodi-dot-org'].close()
      WIDGETS['vuk-cosic-ascii-birds'].close()
      WIDGETS['alexei-shulgin-goggles'].close()
      NNE.lint = false
      utils.get('tutorials/form-alism/files/jodi-ascii.html', (txt) => {
        NNE.code = txt
      }, true)
    },
    id: 'jodi-src-1',
    content: 'So what exactly was the "mistake" jodi.org made in their code? Let\'s take a look at their source code and see how this piece was made.',
    options: { ok: (e) => e.goTo('jodi-src-2') }
  }, {
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
      utils.netitorUpdate()
    },
    id: 'jodi-src-2',
    content: 'Taking a look at the source code reveals the "playful and riddling" hidden ASCII drawing Rachel Green alludes to in her quote from before. But before we address the ASCII, let\'s update some of jodi.org\'s code.',
    options: { ok: (e) => e.goTo('jodi-src-3') }
  }, {
    before: () => utils.netitorUpdate(),
    id: 'jodi-src-3',
    content: 'As I mentioned in the last tutorial when looking at Heath Bunting\'s code, because this was written in 1995, there are a few bits and bytes in jodi.org\'s code that would look different had it been written today.',
    options: { ok: (e) => e.goTo('jodi-src-4') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/jodi-ascii-2.html', (txt) => {
        NNE.code = txt
      }, true)
    },
    id: 'jodi-src-4',
    content: 'I\'ll go ahead and remove the ASCII drawing for now, so that we can focus on the HTML first.',
    options: { ok: (e) => e.goTo('jodi-src-5') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/jodi-ascii-3.html', (txt) => {
        NNE.code = txt
      }, true)
    },
    id: 'jodi-src-5',
    content: 'Next we\'ll tidy up the code and indent things properly. Having done that, it\'s immediately noticeable that jodi.org actually forgot a few closing brackets, specifically for their <code>&lt;font&gt;</code>, <code>&lt;center&gt;</code>, <code>&lt;blink&gt;</code>, <code>&lt;b&gt;</code> and <code>&lt;a&gt;</code> elements.',
    options: { ok: (e) => e.goTo('jodi-src-6') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/jodi-ascii-4.html', (txt) => {
        NNE.code = txt
      }, true)
    },
    id: 'jodi-src-6',
    content: 'The next thing we notice is the inconsistency in the capitalization of the tag names. As mentioned in the last tutorial, these are the sort of errors browsers will typically correct for you, but because we\'re here to learn the craft of code, let\'s edit these so they conform to modern HTML5 standards.',
    options: { ok: (e) => e.goTo('jodi-src-7') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/jodi-ascii-5.html', (txt) => {
        NNE.code = txt
      }, true)
    },
    id: 'jodi-src-7',
    content: 'Now that we\'ve got things cleaned up, let\'s talk about what\'s going on here. Many of the HTML elements and attributes jodi.org is using here are for the purpose of changing the look and feel of the ASCII. Today we use a separate coding language, CSS, to change the way things look and another, JavaScript, to change the way they behave.',
    options: { ok: (e) => e.goTo('jodi-src-8') }
  }, {
    id: 'jodi-src-8',
    content: 'But because this was written just before those two languages were invented, at the time this was all handled by HTML. For example, the attributes in the opening body tag are responsible for setting the colors. While these clearly still work, these days this would typically be handled by CSS.',
    options: { ok: (e) => e.goTo('jodi-src-9') }
  }, {
    id: 'jodi-src-9',
    content: 'The same goes for the <code>&lt;font&gt;</code> and <code>&lt;center&gt;</code> elements. The former is being used to change the font size while the later is being used to center align the text content within the element. I see a lot of artists still use <code>&lt;center&gt;</code> these days, but this too should "technically" be handled via CSS.',
    options: { ok: (e) => e.goTo('jodi-src-10') }
  }, {
    id: 'jodi-src-10',
    content: 'And then we have the <code>&lt;blink&gt;</code> element, a beautiful relic from the early days of the web. This element would slowly flash any of the contents within it, but because this sort of "behavior" is now handled via JavaScript or even CSS (using CSS "Animations") the W3C has deprecated it and it no longer works. If you had visited this piece in 1995 you would have been met with flashing ASCII... today, jodi.org\'s piece appears frozen, a fossil record of a vintage Web.',
    options: { ok: (e) => e.goTo('jodi-src-11') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/jodi-ascii-6.html', (txt) => {
        NNE.code = txt
      }, true)
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
      utils.netitorUpdate()
    },
    id: 'jodi-src-11',
    content: 'Let\'s return to the ASCII and jodi.org\'s classic "mistake". As we discussed in the last tutorial, the spaces and line breaks in our HTML code are purely for own sanity, so we can read our code clearly. The browser doesn\'t actually pay attention to spaces and line breaks, and so if you create a composition out of text which includes specific number of spaces and breaks (which is necessary when making ASCII art) it won\'t actually be displayed correctly.',
    options: { ok: (e) => e.goTo('jodi-src-12') }
  }, {
    id: 'jodi-src-12',
    content: 'We either need to place a <code>&lt;br&gt;</code> element in the specific spot we\'d like the browser to render a line break, or as Heath did in his Kings-X piece, we can place the content with a <code>&lt;pre&gt;</code>',
    options: { ok: (e) => e.goTo('jodi-src-13') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/jodi-ascii-7.html', (txt) => {
        NNE.code = txt
      }, true)
    },
    id: 'jodi-src-13',
    content: 'If we do that, we now see the ASCII art displayed as we intended. The lines you\'re seeing are a result of the fact that our element is inside of an <code>&lt;a&gt;</code> element, or a link, which browsers underline by default. Let\'s comment out this element for now.',
    options: { ok: (e) => e.goTo('jodi-src-14') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/jodi-ascii-7b.html', (txt) => {
        NNE.code = txt
      }, true)
    },
    id: 'jodi-src-13',
    content: 'I\'ve commented out both the <code>&lt;a&gt;</code> and <code>&lt;center&gt;</code> tags for now, to better see the ASCII drawing.',
    options: { ok: (e) => e.goTo('jodi-src-14') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/jodi-ascii-8.html', (txt) => {
        NNE.code = txt
      }, true)
    },
    id: 'jodi-src-14',
    content: 'Next we\'ll replace our ASCII skull with jodi.org\'s original ASCII drawing and voilà.',
    options: { ok: (e) => e.goTo('jodi-src-15') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/jodi-ascii-9.html', (txt) => {
        NNE.code = txt
      }, true)
      STORE.dispatch('CHANGE_LAYOUT', 'separate-window')
      WIDGETS['something-wrong'].open()
      WIDGETS['something-wrong'].update({ right: 20, bottom: 20 }, 500)
      WIDGETS['something-wrong'].play()
    },
    id: 'jodi-src-15',
    content: 'As Dirk explains, forgetting to use the <code>&lt;pre&gt;</code> tag was a "mistake", but it\'s one that they intentionally embraced when they discovered that result of this error was more interesting than their initial intentions.',
    options: { ok: (e) => e.goTo('nn-22') }
  }, {
    before: () => {
      WIDGETS['something-wrong'].close()
      STORE.dispatch('CHANGE_LAYOUT', 'welcome')
      WIDGETS['jodi-dot-org'].open()
      WIDGETS['jodi-dot-org'].update({ left: 20, top: 20 }, 500)
      WIDGETS['jodi-dot-org'].$('video').currentTime = 187.7
      WIDGETS['jodi-dot-org'].play()
      WIDGETS['jodi-dot-org'].update({
        width: window.innerWidth * 0.7
      }, 500)
      WIDGETS['jodi-dot-org'].$('video').addEventListener('ended', () => {
        WIDGETS['jodi-dot-org'].update({
          width: window.innerWidth * 0.25
        }, 500)
        NNW.updatePosition()
      })
    },
    id: 'nn-22',
    content: 'From today\'s perspective it might be hard to understand why Dirk would ask, "Could this harm someone?" How could abstract ASCII art be crossing any sort of ethical lines?',
    options: { ok: (e) => e.goTo('nn-23') }
  }, {
    before: () => {
      WIDGETS['jodi-dot-org'].close()
      NNW.updatePosition()
    },
    id: 'nn-23',
    content: 'But remember, in 1995, the most common way to get anything to appear on your personal computer was to either to prgram it yourself or to insert a CD you physically acquired from someone. For most folks, the Web was the first time anything appeared on their screen they didn\'t necessarily intend to put there themselves.',
    options: { ok: (e) => e.goTo('nn-24') }
  }, {
    before: () => {
      WIDGETS['email-of-complaint-w9'].open()
      WIDGETS['email-of-complaint-w9'].update({ left: 20, bottom: 20 }, 500)
    },
    id: 'nn-24',
    content: 'In this context, jodi.org\'s work often shocked and terrified netizens that worried their (very expensive) computers had caught a virus or been hacked! When you consider the fact jodi.org often modeled their aesthetic on computer viruses it\'s not surprising they received a lot of complaints like this.',
    options: { ok: (e) => e.goTo('nn-25') }
  }, {
    before: () => {
      WIDGETS['deep-web-video'].open()
      WIDGETS['deep-web-video'].update({ left: 20, top: 20 }, 500)
      WIDGETS['deep-web-video'].play()
      greetings.netnetToCorner()
    },
    id: 'nn-25',
    content: 'And though the web might no longer be what it was in 1995, it\'s exciting to see that even all these years later, when unsuspecting netizens stumble upon jodi.org\'s work today, it still manages to evoke shock, mystery and all sorts of glitchy delight.',
    options: { ok: (e) => e.goTo('form-art') }
  }, {
    id: 'form-art',
    before: () => {
      WIDGETS['deep-web-video'].close()
      WIDGETS['email-of-complaint-w9'].close()
      NNW.updatePosition()
      NNE.lint = false
      NNE.code = TUTORIAL.bg
    },
    content: 'Like ASCII art, another popular <i>form</i>alist net.art sub-genre of the time which explored the Web\'s inherent aesthetic was "form art". The term was coined by net.artist Alexei Shulgin and was, in part, a response to jodi.org\'s take on Web aesthetics.',
    options: { ok: (e) => e.goTo('nn-27') }
  }, {
    id: 'nn-27',
    content: 'Form art referred to net.art created predominantly from <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element#Forms" target="_blank">HTML form elements</a>. These are the HTML elements used to create things like buttons, drop down lists, check-boxes and text or password fields, as well other "form" components used in graphical applications.',
    options: { ok: (e) => e.goTo('nn-28') }
  }, {
    before: () => {
      WIDGETS['form-art-1-w11'].open()
      WIDGETS['form-art-1-w11'].update({ left: 20, top: 20 }, 500)
    },
    id: 'nn-28',
    content: 'Rather than using these elements for their intended use, form art was an "absurdist" take on these elements, where artists used them to make playful (often interactive) formal experiments which "transformed the most bureaucratic, functional, and unsolved aspects of the web into aesthetic, ludic elements".',
    options: { ok: (e) => e.goTo('nn-29') }
  }, {
    id: 'nn-29',
    content: 'As we\'ve discussed, the net.art movement\'s anti-establishment sentiments were one of it\'s defining characteristics. For these artists, one of the most exciting aspects of making work on the Internet is that they no longer needed the traditional art institutions to exhibit their work, they had the Web for that.',
    options: { ok: (e) => e.goTo('nn-30') }
  }, {
    before: () => {
      WIDGETS['Alexei-Shulgin-quote-w12'].open()
      WIDGETS['Alexei-Shulgin-quote-w12'].update({ right: 20, bottom: 20 }, 500)
    },
    id: 'nn-30',
    content: 'So, Form Art was also in part a response to art competitions, specifically the <a href="https://en.wikipedia.org/wiki/Prix_Ars_Electronica" target="_blank">Prix Ars Electronica</a> (which is like the Oscars or Grammys of new media art). Alexei first introduced the sub-genre in the form of a call for submissions to the "Form Art Competition".',
    options: { ok: (e) => e.goTo('nn-31') }
  }, {
    before: () => {
      WIDGETS['form-art-1-w11'].close()
      WIDGETS['Alexei-Shulgin-quote-w12'].close()
      WIDGETS['Choose-by-Kass Schmitt-w13'].open()
      WIDGETS['Choose-by-Kass Schmitt-w13'].update({ bottom: 20, left: 20 }, 500)
    },
    id: 'nn-31',
    content: 'One of the "winners" was <a href="http://easylife.org/form/competition/choose/choose.htm" target="_blank">Choose</a> (1997) by net.artist Kass Schmitt.',
    options: { ok: (e) => e.goTo('nn-32') }
  }, {
    id: 'nn-32',
    content: 'Form art wasn\'t the only satirical net.art "competition" at the time, Kass was also involved in organizing another satirical competition called <i>Mr.NetArt</i> with a group of cyberfeminists.',
    options: {
      'what\'s cyberfeminism?': (e) => e.goTo('cyberfeminism'),
      ok: (e) => e.goTo('nn-38')
    }
  }, {
    before: () => {
      NNE.lint = false
      NNE.code = TUTORIAL.bg
      WIDGETS['Choose-by-Kass Schmitt-w13'].close()

      WIDGETS['Cyberfeminist-International-3-w16'].open()
      WIDGETS['Cyberfeminist-International-3-w16'].update({ left: 20, top: 20 }, 500)

      WIDGETS['Cyberfeminist-International-1-w14'].open()
      WIDGETS['Cyberfeminist-International-1-w14'].update({
        left: 60, top: window.innerHeight / 2 - 100
      }, 500)

      WIDGETS['Cyberfeminist-International-2-w15'].open()
      WIDGETS['Cyberfeminist-International-2-w15'].update({ right: 20, bottom: 20 }, 500)
    },
    id: 'cyberfeminism',
    content: 'If I gave you a definition for cyberfeminism then I wouldn\'t be a good cyberfeminist. 1997, the year of the Form Art Competition, was also the year of the first <i>Cyberfeminist International</i>, it was organized by the <a href="https://www.obn.org/" target="_blank">Old Boys Network</a> a cyberfeminist alliance founded by net.artist <a href="http://www.artwarez.org/cv.0.html" target="_blank">Cornelia Sollfrank</a>.',
    options: { ok: (e) => e.goTo('what\'s-cyberfeminism?-34') }
  }, {
    id: 'what\'s-cyberfeminism?-34',
    content: 'The organizers of that first Cyberfeminist International decided they would resist defining the term, instead they wrote 100 Anti-Theses, which rather than defining what cyberfeminism <i>is</i> it defined what it <i>is not</i>. I realize that might not be a satifying anser to your question, so if you\'d like a more in depth one, refer to Cornelia\'s <a href="https://www.obn.org/reading_room/writings/html/truth.html" target="_blank">The Truth about Cyberfeminism</a>.',
    options: { ok: (e) => e.goTo('what\'s-cyberfeminism?-35') }
  }, {
    before: () => {
      WIDGETS['vns-matrix-w17'].open()
      WIDGETS['vns-matrix-w17'].update({ left: 20, bottom: 20 }, 500)
    },
    id: 'what\'s-cyberfeminism?-35',
    content: 'Cyberfeminism was around before these organized efforts however. In 1991 the cyberfeminist net.art collective VNS Matrix (pronounced <i>venus</i>) released their legendary <a href="https://anthology.rhizome.org/a-cyber-feminist-manifesto-for-the-21st-century" target="_blank">Cyberfeminist Manifesto</a>, and 6 years earlier Donna Haraway had published her classic <a href="https://en.wikipedia.org/wiki/A_Cyborg_Manifesto" target="_blank">Cyborg Manifesto</a>.',
    options: { ok: (e) => e.goTo('what\'s-cyberfeminism?-36') }
  }, {
    id: 'what\'s-cyberfeminism?-36',
    content: 'It was the year after the first Cyberfeminist International that Kass Schmitt, along with Rachel Baker, Cornelia Sollfrank and Josephine Bosma, organized that Mr.NetArt competition mentioned before, in which, as Rachel Greene described, "the individual notion of the male artist-genius was exposed to ridicule".',
    options: { ok: (e) => e.goTo('what\'s-cyberfeminism?-37') }
  }, {
    id: 'what\'s-cyberfeminism?-37',
    content: 'Kass, as well as many of the other net.artists we\'ve discussed, participated in other similar DIY gatherings of radical netizens discussing cyberspace, art and soclial issues like the <a href="https://archive.org/details/ArtServersUnlimiteddocumentaryvideo" target="_blank">Art Servers Unlimited</a> conference... but now we\'re getting way off topic, let\'s get back to her form art piece!',
    options: { ok: (e) => e.goTo('nn-38') }
  }, {
    before: () => {
      WIDGETS['Cyberfeminist-International-3-w16'].close()
      WIDGETS['Cyberfeminist-International-1-w14'].close()
      WIDGETS['Cyberfeminist-International-2-w15'].close()
      WIDGETS['vns-matrix-w17'].close()
      WIDGETS['Choose-by-Kass Schmitt-w13'].close()
      WIDGETS['Choose-w18'].open()
      WIDGETS['Choose-w18'].update({ left: 20, bottom: 20 }, 500)
      const x = (window.innerWidth * 0.6 + 40)
      NNW.updatePosition(x, 250)
    },
    id: 'nn-38',
    content: 'In a way, the form art "aesthetic" was in part informed by the artists that created these compositions and partly by the developers of web browsers, who are ultimately the ones defining what the <i>individual</i> form elements themselves look like.',
    options: { ok: (e) => e.goTo('nn-39') }
  }, {
    before: () => {
      WIDGETS['Choose-w18'].close()
      NNW.updatePosition()
      NNW.updatePosition(null, 250)

      WIDGETS['form-art-2a-w19'].open()
      WIDGETS['form-art-2a-w19'].update({ left: 10, top: 10 }, 500)

      const h = WIDGETS['form-art-2b-w20'].ele.offsetHeight
      WIDGETS['form-art-2b-w20'].open()
      WIDGETS['form-art-2b-w20'].update({
        left: window.innerWidth * 0.33 + 10,
        top: window.innerHeight / 2 - h / 2
      }, 500)

      WIDGETS['form-art-2c-w21'].open()
      WIDGETS['form-art-2c-w21'].update({ right: 10, bottom: 10 }, 500)
    },
    id: 'nn-39',
    content: 'In this way, form art is never static because browsers are never static, they\'re constantly evolving and changing. The form elements are often updated to match the graphic design styles of the UI (user interface) of any given platform (the latest versions of Windows, Mac, Android, iOS or Linux).',
    options: { ok: (e) => e.goTo('nn-40') }
  }, {
    before: () => {
      WIDGETS['form-art-2a-w19'].close()
      WIDGETS['form-art-2b-w20'].close()
      WIDGETS['form-art-2c-w21'].close()

      WIDGETS['form-art-3a-w22'].open()
      WIDGETS['form-art-3a-w22'].update({ left: 10, top: 10 }, 500)

      const h = WIDGETS['form-art-3b-w23'].ele.offsetHeight
      WIDGETS['form-art-3b-w23'].open()
      WIDGETS['form-art-3b-w23'].update({
        left: window.innerWidth * 0.33 + 10,
        top: window.innerHeight / 2 - h / 2
      }, 500)

      WIDGETS['form-art-3c-w24'].open()
      WIDGETS['form-art-3c-w24'].update({ right: 10, bottom: 10 }, 500)

      WIDGETS['Alexei-Shulgin-quote-w25'].open()
      WIDGETS['Alexei-Shulgin-quote-w25'].update({ right: 20, top: 20 }, 500)
    },
    id: 'nn-40',
    content: 'And so, while the original HTML code has remained hosted on Alexei\'s server unedited since 1997, the rendered result of what that page looks like in the browser has continued to change over the years each time browsers have updated.',
    options: { ok: (e) => e.goTo('nn-41') }
  }, {
    before: () => {
      WIDGETS['form-art-3a-w22'].close()
      WIDGETS['form-art-3b-w23'].close()
      WIDGETS['form-art-3c-w24'].close()

      WIDGETS['Checkboxes-Ball-w26'].open()
      WIDGETS['Checkboxes-Ball-w26'].update({ left: 20, top: 20 }, 500)

      WIDGETS['389-w27'].open()
      WIDGETS['389-w27'].update({ left: 100, bottom: 100 }, 500)

      WIDGETS['Interface-Painter-w28'].open()
      WIDGETS['Interface-Painter-w28'].update({
        left: window.innerWidth / 2, top: window.innerHeight / 2
      }, 500)
    },
    id: 'nn-41',
    content: 'On the one hand Form Art (in caps) refers to this particular "competition" and the series of works created in 1997, but because artists have continued to play with form elements this way ever since form art has also become an Internet art sub-genre.',
    options: { ok: (e) => e.goTo('in-&lt;/closing&gt;') }
  }, {
    before: () => {
      NNE.lint = false
      NNW.updatePosition()
      WIDGETS['Alexei-Shulgin-quote-w25'].close()
      WIDGETS['Checkboxes-Ball-w26'].close()
      WIDGETS['389-w27'].close()
      WIDGETS['Interface-Painter-w28'].close()
    },
    id: 'in-&lt;/closing&gt;',
    content: 'Soon we\'ll start discussing CSS, but before we do there\'s one last "pure HTML" Internet art piece I\'d like to show you. In 2011 new media artists Evan Roth asked a conceptual question, what would it look like if he put every HTML element inside of every other HTML element in alphabetical order?',
    options: { ok: (e) => e.goTo('nn-43') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/all-html.html', (txt) => {
        NNE.code = txt
        STORE.dispatch('CHANGE_LAYOUT', 'separate-window')
      }, true)
    },
    id: 'nn-43',
    content: 'This was the result, a form-art-esque abstraction he called <a href="http://all-html.net/" target="_blank">all-html.net</a> which, in some sense, is a portrait of HTML itself a snapshot of it\'s "pure aesthetic" at the particular time and context (platform/browser) you view it in.',
    options: { ok: (e) => e.goTo('nn-44') }
  }, {
    id: 'nn-44',
    content: 'Try to create a <i>form</i>alist net.art work yourself.',
    options: { ok: (e) => e.goTo('nn-45') }
  }, {
    before: () => {
      utils.get('tutorials/form-alism/files/ascii-art.html', (txt) => {
        NNE.code = txt
        NNE.lint = true
      }, true)
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
    },
    id: 'nn-45',
    content: 'Create a composition using only text, <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element" target="_blank">HTML Elements</a> and <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes" target="_blank">attributes</a>. Here\'s a simple a example to get you started.',
    options: { ok: (e) => e.goTo('nn-46') }
  }, {
    id: 'nn-46',
    content: 'When you\'re finished don\'t forget to either download your code, or save your project to your GitHub.',
    options: {}
  }],

  widgets: {
    'Rachel-Greene-(from-"Web-Work")-quote-w0': new Widget({
      width: window.innerWidth * 0.45,
      title: 'Web Work: A History of Internet Art',
      innerHTML: '<blockquote style="font-size: 22px; line-height: 25px;">"in 1993, at the start of the "dot com" boom, two European artists, Joan Heemskerk and Dirk Paesmans, paid a visit to California\'s Silicon Valley. When they returned home, they created jodi.org, a Web-site-as-art-work whose scrambled green text and flashing images seem to deconstruct the visual language of the Web. Heemskerk and Paesmans remixed found images and HTML scripts much as Dada artists played with the photographic imagery and typography of magazines and newspapers. Jodi.org changed the way many people think about the Internet, demonstrating that it didn\'t just provide a new way to publish information; it could also be an art medium like oil painting, photography, or video. Like other works of New Media art, jodi.org exploited an emerging technology for artistic purposes. </blockquote><div style="text-align:right; font-size: 22px; line-height: 25px;">—Rachel Greene</div>'
    }),
    'jodi-dot-org': new HyperVidPlayer({
      video: 'api/videos/jodi.mp4',
      width: window.innerWidth * 0.7,
      title: 'jodi.org',
      source: {
        text: 'Motherboard | VICE',
        url: 'https://www.vice.com/en/article/gvvndq/jodi-something-wrong-is-nothing-wrong'
      }
    }),
    'jodi-glitch-invite-w2': new Widget({
      width: window.innerWidth * 0.33,
      title: 'GLI.TC/H invites jodi.org',
      innerHTML: '<img style="width: 100%" alt="jodi glitch invite" src="tutorials/form-alism/images/jodi-email-invite.png"><p>screenshot of jodi.org\'s response to an invitation to share work and present a virtual lecture at the GLI.TC/H festival in Chicago, 2010</p>'
    }),
    'jodi-glitch-404-w3': new Widget({
      width: window.innerWidth * 0.33,
      title: '404: GLI.TC/H + jodi.org',
      innerHTML: '<img style="width: 100%" alt="jodi glitch 404" src="tutorials/form-alism/images/jodi-404-collab.png"><p>This e-meail exchange is partly documented in <a href="https://netnet.studio/tutorials/form-alism/files/glitch-404.pdf" target="_blank">4040404040404</a>, from the 20111 <a href="http://gli.tc/h/READERROR/GLITCH_READERROR_20111-v3BWs.pdf" target="_blank">GLI.TC/H  READER[ROR]</a>.</p>'
    }),
    'Rafaël-Rozendaal-quote-w4': new Widget({
      width: window.innerWidth * 0.45,
      title: 'Rafaël Rozendaal browsing JODI',
      innerHTML: '<blockquote style="font-size: 22px; line-height: 25px;">"Most artists start with a homepage with a resume and information, maybe a picture of the artist, and a list of works organized by category, and jodi never did that. They always said the web is a medium for art, it\'s not a medium for documentation" </blockquote><div style="text-align:right; font-size: 22px; line-height: 25px;">—Rafaël Rozendaal</div>'
    }),
    'Rachel-Greene-(from-"Internet-Art")-quote-w5': new Widget({
      width: window.innerWidth * 0.5,
      title: 'Rachel Greene (from "Internet Art") quote',
      innerHTML: '<blockquote style="font-size: 22px; line-height: 25px;">"The front page is confusing, repetitive, discordant and alphanumeric, but the compositional effects are not what they seem: for behind this web page lies source code which reveals a cascade of traditional images and diagrams that are almost scientific or astrological. [...] Hiding coherent images in source code seems playful and riddling, a means of separating instructions (the HTML) from the completed task (the front page). This surreptitious divide of the browser is accomplished by radicalizing the source code into the pictorial, and radicalizing the executed task into the unreadable. </blockquote><div style="text-align:right; font-size: 22px; line-height: 25px;">—Rachel Greene (from "Internet Art")</div>'
    }),
    'something-wrong': new HyperVidPlayer({
      video: 'api/videos/jodi-mistakes.mp4',
      width: window.innerWidth * 0.33,
      title: 'there\'s nothing wrong with something wrong'
    }),
    'vuk-cosic-ascii-birds': new HyperVidPlayer({
      video: 'api/videos/the-birds-vuk-cosic.mp4',
      width: window.innerWidth * 0.33,
      title: 'Vuk Cosic ASCII videos (1998)',
      text: 'The Birds by Vuk Cosic (1998), "Vuk Cosic combined programming and formal analysis to create projects that elaborated the pictoral possibilities and aesthetics already established. He coded tow freeware players that convert moving images into ASCII text and speech." —<i>Rachel Greene (from "Internet Art")'
    }),
    'alexei-shulgin-goggles': new HyperVidPlayer({
      video: 'api/videos/alexei-shulgin-ascii-goggles.mp4',
      width: window.innerWidth * 0.33,
      title: 'Super-i® by Alexei Shulgin (2007)',
      text: 'Super-i® by Alexei Shulgin (2007) are AR goggles which convert the real world in ASCII an other realtime filtered effects as well'
    }),
    'email-of-complaint-w9': new Widget({
      width: window.innerWidth * 0.5,
      title: 'email of complaint',
      innerHTML: '<img style="width: 100%" alt="email-of-complaint" src="tutorials/form-alism/images/jodi-email.png">'
    }),
    'deep-web-video': new HyperVidPlayer({
      video: 'api/videos/deep-web-youtuber-jodi.mp4',
      width: window.innerWidth * 0.65,
      title: 'YouTuber browsing the deep web',
      text: 'A <a href="https://www.youtube.com/watch?v=JMC7w8kXbUs&feature=youtu.be&t=25m40s" target="_blank">YouTuber/streamer</a> wonders onto jodi.org\'s classic piece while streaming himself diving through the deep web. After spending nearly 10mins navigating through the piece, the last thing he says with a smile on his face is "I\'m so confused, I\'m really really confused, I don\'t know what to say I\'m scared", which in many ways, is exactly what jodi.org had hoped for (even all these years later)'
    }),
    'form-art-1-w11': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Form Art by Alexei Shulgin',
      innerHTML: '<img style="width: 100%" alt="form art 1" src="tutorials/form-alism/images/form-art-1.jpg"><p>a piece of form art by Alexei Shulgin from the original Form Art Competition website</p>'
    }),
    'Alexei-Shulgin-quote-w12': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Alexei Shulgin quote',
      innerHTML: '<blockquote style="font-size: 22px; line-height: 25px;">"I was absolutely sure that art after the internet would never be the same and that an artist does not need to play traditional career games, including maintaining his or her own style. </blockquote><div style="text-align:right; font-size: 22px; line-height: 25px;">—Alexei Shulgin</div>'
    }),
    'Choose-by-Kass Schmitt-w13': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Choose by Kass Schmitt',
      innerHTML: '<img style="width: 100%" alt="Choose-by-Kass Schmitt" src="tutorials/form-alism/images/choose-1997.jpg">'
    }),
    'Cyberfeminist-International-1-w14': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Cyberfeminist International',
      innerHTML: '<img style="width: 100%" alt="Cyberfeminist-International-1" src="tutorials/form-alism/images/cyberfeminist-international.jpg">'
    }),
    'Cyberfeminist-International-2-w15': new Widget({
      width: window.innerWidth * 0.25,
      title: 'Cyberfeminist International',
      innerHTML: '<img style="width: 100%" alt="Cyberfeminist-International-2" src="tutorials/form-alism/images/cyberfeminist-international-2.jpg">'
    }),
    'Cyberfeminist-International-3-w16': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Cyberfeminist International',
      innerHTML: '<img style="width: 100%" alt="Cyberfeminist-International-3" src="tutorials/form-alism/images/cyberfeminist-international-3.jpg">'
    }),
    'vns-matrix-w17': new Widget({
      width: window.innerWidth * 0.33,
      title: 'VNS Matrix',
      innerHTML: '<img style="width: 100%" alt="vns matrix" src="tutorials/form-alism/images/vns-matrix.jpg"><p>VNS Matrix\'s Cyberfeminist Manifesto on a billboard in Sydney Australia, where the collective was based</p>'
    }),
    'Choose-w18': new Widget({
      width: window.innerWidth * 0.6,
      title: 'Choose (then and now)',
      innerHTML: '<img style="width: 100%" alt="Choose" src="tutorials/form-alism/images/choose-then-and-now.png"><p><a href="http://easylife.org/form/competition/choose/choose.htm" target="_blank">Choose</a> by Kass Schmitt. On the left as it appeared on Internet Explorer (Mac) in the late 90s, on the right as it appears on Firefox (Linux) in 2020</p>'
    }),
    'form-art-2a-w19': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Form Art (~1997)',
      innerHTML: '<img style="width: 100%" alt="form art 2a" src="tutorials/form-alism/images/form-art-90s.png"><p><a href="http://easylife.org/form/" target="_blank">Form Art</a> by Alexei Shulgin as it appeared in Netscape (Windows) in the late 90s.</p>'
    }),
    'form-art-2b-w20': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Form Art (~2010)',
      innerHTML: '<img style="width: 100%" alt="form art 2b" src="tutorials/form-alism/images/form-art-2010.png"><p><a href="http://easylife.org/form/" target="_blank">Form Art</a> by Alexei Shulgin as it appeared in unidentified (Mac) browser in ~2010.</p>'
    }),
    'form-art-2c-w21': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Form Art (2020)',
      innerHTML: '<img style="width: 100%" alt="form art 2c" src="tutorials/form-alism/images/form-art-today.png"><p><a href="http://easylife.org/form/" target="_blank">Form Art</a> by Alexei Shulgin as it appears in Firefox (Mac) in 2020.</p>'
    }),
    'form-art-3a-w22': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Form Art (~1997)',
      innerHTML: '<img style="width: 100%" alt="form art 3a" src="tutorials/form-alism/images/form-art-2-90s.jpg"><p><a href="http://easylife.org/form/index1.html?" target="_blank">Form Art</a> by Alexei Shulgin as it appeared in Netscape (Mac) in the late 90s.</p>'
    }),
    'form-art-3b-w23': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Form Art (~2010)',
      innerHTML: '<img style="width: 100%" alt="form art 3b" src="tutorials/form-alism/images/form-art-2-2010.png"><p><a href="http://easylife.org/form/index1.html?" target="_blank">Form Art</a> by Alexei Shulgin as it appeared in Chrome (Mac) in ~2010.</p>'
    }),
    'form-art-3c-w24': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Form Art (~2020)',
      innerHTML: '<img style="width: 100%" alt="form art 3c" src="tutorials/form-alism/images/form-art-2-today.png"><p><a href="http://easylife.org/form/index1.html?" target="_blank">Form Art</a> by Alexei Shulgin as it appears in Firefox (Linux) in 2020.</p>'
    }),
    'Alexei-Shulgin-quote-w25': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Alexei Shulgin quote',
      innerHTML: '<blockquote style="font-size: 22px; line-height: 25px;">"bringing them [form elements] in focus was a declaration of the fact that a computer interface is not a \'transparent\' invisible layer to be taken for granted, [...] but something that defines the way we are forced to work and even think.  </blockquote><div style="text-align:right; font-size: 22px; line-height: 25px;">—Alexei Shulgin</div>'
    }),
    'Checkboxes-Ball-w26': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Checkboxes Ball by mr.doob',
      innerHTML: '<img style="width: 100%" alt="Checkboxes Ball" src="tutorials/form-alism/images/mrdoob.png"><p><a href="https://mrdoob.com/lab/javascript/checkboxes/" target="_blank">Checkboxes Ball</a> by mr.doob (aka Ricardo Cabello) (~2010) as it appears on Firefox (Mac) in 2020</p>'
    }),
    '389-w27': new Widget({
      width: window.innerWidth * 0.33,
      title: '389 by Andrej Yasev',
      innerHTML: '<img style="width: 100%" alt="389" src="tutorials/form-alism/images/389-2009.png"><p>A still from the 389 series by Andrej Yasev as it appeared on Safari (Mac) in 2009 (the works are no longer online but they have <a href="https://web.archive.org/web/20120401021522/http://the389.com/" target="_blank">been archived</a> by the Internet Archive and there is also <a href="https://vimeo.com/yazev" target="_blank">video documentation</a> on Vimeo)</p>'
    }),
    'Interface-Painter-w28': new Widget({
      width: window.innerWidth * 0.45,
      title: 'Interface Painter by Pox',
      innerHTML: '<img style="width: 100%" alt="Interface Painter" src="tutorials/form-alism/images/interface-painter.png"><p><a href="http://poxparty.com/InterFacePainter/index.html" target="_blank">Interface Painter</a> by Pox (Ben Syverson and Jon Satrom) a photoshop-like "artware" application for creating form art.</p>'
    }),
    'all-html-net-w29': new Widget({
      width: window.innerWidth * 0.33,
      title: 'all-html.net by Evan Roth',
      innerHTML: '<img style="width: 100%" alt="all html net" src="tutorials/form-alism/images/all-html-output.png"><p><a href="http://all-html.net/" target="_blank">all-html.net</a> by Evan Roth as it appears on Firefox (Linux) in 2020</p>'
    }),
    'all-html-net-2-w30': new Widget({
      width: window.innerWidth * 0.33,
      title: 'all-html.net (source code)',
      innerHTML: '<img style="width: 100%" alt="all html net 2" src="tutorials/form-alism/images/all-html-code.png"><p>A screenshot of all-html.net\'s source code</p>'
    })
  }
}
