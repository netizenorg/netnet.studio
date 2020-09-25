/* global Widget, TUTORIAL, HyperVidPlayer, STORE, WIDGETS, NNW, NNE, NNT */
window.TUTORIAL = {
  steps: [{
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'welcome')
      const x = window.innerWidth - window.NNW.win.offsetWidth - 20
      const y = window.innerHeight - window.NNW.win.offsetHeight - 20
      NNW.updatePosition(x, y)
    },
    content: 'The scene you see behind me was created using HTML code and a WebVR library called <a href="https://aframe.io/" target="_blank">a-frame</a>. Click and drag it with your mouse. I can show you how it was made, but first let\'s talk about virtual reality or VR!'
  }, {
    before: () => {
      TUTORIAL.introVideos()
      NNW.updatePosition()
    },
    content: 'Our VR story begins, like the Web itself, in the early 1990s. Let me know when you\'ve finished watching this introduction I\'ve prepared for you.',
    options: { 'ok, what\'s next?': (e) => e.goTo('vr-history') }
  }, {
    before: () => {
      TUTORIAL.autoStopClose([
        'vr-cc', 'vr-abc', 'vr-cyberpunk', 'video-chats', 'video-bowls'
      ])
      NNW.updatePosition()
    },
    id: 'vr-history',
    content: 'As "techno journalist" Linda Jacobson mentioned, VR has been around a long time, we chose to start our story in the late 80s and early 90s because that\'s when artists and other creatives really began to experiment and develop ideas that resonate to today.',
    options: {
      'when did it start?': (e) => e.goTo('origins'),
      'tell me about the 90s': (e) => e.goTo('the-90s'),
      'what\'s going on today?': (e) => e.goTo('vr-today'),
      next: (e) => e.goTo('terminology') // e.goTo('art-and-vr')
    }
  }, {
    id: 'origins',
    code: `<!DOCTYPE html>
<style>
body { margin: 0; overflow: hidden; }
iframe { width: 100vw; height: 100vh }
</style>
<iframe src="https://www.360visio.com/wp-content/uploads/v2/20b-Milano360/20h-1-Chiese/5-AltreChiese/3sEustorgio/3m463e-sEustorgioTorelli/output/index.html"></iframe>`,
    content: 'In some sense, artists have always used their work to transport viewers into another reality. Consider the 16th century frescos for example. The term "virtual reality" actually predates the technology itself. It was used by French avant-garde artists in the 1930s to describe the "réalité virtuelle" of the theatre.',
    options: { next: (e) => e.goTo('origins2') }
  }, {
    id: 'origins2',
    before: () => {
      TUTORIAL.autoPlayOpen('origins-stereoscope', { left: 30, top: 30 })
      TUTORIAL.autoPlayOpen('origins-gifs', { left: 90, top: 330 })
      TUTORIAL.autoPlayOpen('origins-sutherland', { right: 40, top: 40 })
      TUTORIAL.autoPlayOpen('origins-sensorama', { right: 100, bottom: 40 })
    },
    content: 'Like all great ideas, VR doesn\'t have a single point of origin. It evolved from various different technologies.',
    options: {
      'good point': (e) => {
        TUTORIAL.autoStopClose([
          'origins-stereoscope',
          'origins-gifs',
          'origins-sutherland',
          'origins-sensorama'
        ])
        NNE.code = TUTORIAL.bgCode
        e.goTo('vr-history')
      }
    }
  }, {
    id: 'the-90s',
    content: 'The VR renaissance came in the late 80s and early 90s when the technology found its way into the mainstream and the underground, like the "Cyberpunk" counterculture. A wave of new technologies were developed, like The Cave in Chicago and VR art, like Osmose by Char Davies, found it\'s way into major art museums. Virtual dreams were becoming a reality, until nauseating commercial failures of consumer devices, like Nintendo\'s Virtual Boy, ruined the public\'s appetite.',
    options: {
      'The Cave?': (e) => {
        WIDGETS['90s-the-cave'].open()
        WIDGETS['90s-the-cave'].play()
        WIDGETS['90s-cyberpunk'].pause()
        WIDGETS['90s-osmose'].pause()
        TUTORIAL.wigMove('90s-the-cave', { right: 40, top: 40 })
      },
      'Char Davies?': (e) => {
        WIDGETS['90s-char-davies'].open()
        TUTORIAL.wigMove('90s-char-davies', { left: 40, top: 40 })
        WIDGETS['90s-osmose'].open()
        WIDGETS['90s-osmose'].play()
        WIDGETS['90s-cyberpunk'].pause()
        WIDGETS['90s-the-cave'].pause()
        TUTORIAL.wigMove('90s-osmose', { left: 100, bottom: 20 })
      },
      'Cyberpunk?': (e) => {
        WIDGETS['90s-cyberpunk'].open()
        WIDGETS['90s-cyberpunk'].play()
        WIDGETS['90s-osmose'].pause()
        WIDGETS['90s-the-cave'].pause()
        TUTORIAL.wigMove('90s-cyberpunk', { right: 80, bottom: 40 })
      },
      back: (e) => {
        e.goTo('vr-history')
        TUTORIAL.autoStopClose([
          '90s-the-cave', '90s-char-davies', '90s-osmose', '90s-cyberpunk'
        ])
        NNW.updatePosition()
      }
    }
  }, {
    id: 'vr-today',
    before: () => {
      // TODO: make an "open && play" method
      TUTORIAL.autoPlayOpen('vr-vive', { top: 10, left: 10 }, true)
      TUTORIAL.autoPlayOpen('vr-quest', {
        top: window.innerHeight * 0.5, left: window.innerWidth * 0.3
      })
    },
    content: 'Today VR is going through it\'s second renaissance, with more powerful and affordable consumer devices on the market by companies like <a href="https://www.vive.com/us/" target="_blank">HTC</a>, <a href="https://www.oculus.com/" target="_blank">Oculus</a>, <a href="https://arvr.google.com/daydream/" target="_blank">Google</a> and others, the tech has never been more accessible to artists, designers and developers. With a piece of <a href="https://arvr.google.com/cardboard/" target="_blank">cardboard</a> and some cheap lenses we can even turn our smartphones into VR headsets.',
    options: {
      next: (e) => {
        e.goTo('vr-today2')
        TUTORIAL.autoStopClose(['vr-vive', 'vr-quest'])
        NNW.updatePosition()
      }
    }
  }, {
    id: 'vr-today2',
    before: () => {
      TUTORIAL.autoPlayOpen('today-phi', { top: 10, left: 10 }, true)
      TUTORIAL.autoPlayOpen('today-dimoda', { bottom: 50, left: 20 })
      TUTORIAL.autoPlayOpen('today-keanu', { bottom: 80, right: 80 })
    },
    content: 'Today it\'s being used in everything from <a target="_blank" href="https://www.youtube.com/watch?v=zGGVYT0cMHg">education</a>, to <a target="_blank" href="https://www.youtube.com/watch?v=mZStQT3o5xc&amp;feature=youtu.be">surgical training</a>, as <a target="_blank" href="https://www.youtube.com/watch?v=GiJuPB7S2I4">evidence in court cases</a>, for <a target="_blank" href="https://youtu.be/sDc5lIj1VbY?t=731">physical therapy</a> and <a target="_blank" href="https://www.youtube.com/watch?v=GMttQHMjbJo">mental health</a>. Contemporary VR art, like Jordan Wolfson\'s controversial piece "<a target="_blank" href="https://www.newyorker.com/culture/cultural-comment/confronting-the-shocking-virtual-reality-artwork-at-the-whitney-biennial">Real Violence</a>" has been exhibited in major shows like the Whitney Biennial. Artists Alfredo Salazar-Caro and William Robertson have even started an entirely VR museum for new media art called <a target="_blank" href="https://dimoda.art/">DiMoDA</a>.',
    options: {
      back: (e) => {
        e.goTo('vr-history')
        TUTORIAL.autoStopClose(['today-phi', 'today-dimoda', 'today-keanu'])
        NNW.updatePosition()
      }
    }
  }, {
    id: 'terminology',
    before: () => {
      WIDGETS['xr-spectrum'].open()
      WIDGETS['xr-spectrum'].recenter()
      TUTORIAL.wigMove('xr-spectrum', { bottom: 40 })
    },
    content: 'We should clarify some terms before we get started making stuff. The larger umbrella term "mixed" or "extended" reality (XR) represents a spectrum from simply <i>augmenting</i> our view of the physical world with virtual objects (AR) to complete immersion in a <i>virtual</i> world (VR). We\'ll be experimenting with the latter.',
    options: {
      'got it!': (e) => {
        WIDGETS['xr-spectrum'].close()
        e.goTo('art-tool-vs-medium')
      }
    }
  }, {
    id: 'art-tool-vs-medium',
    before: () => {
      WIDGETS['today-keanu'].open()
      WIDGETS['today-keanu'].recenter()
      WIDGETS['today-keanu'].$('video').play()
      TUTORIAL.wigMove('today-keanu', { left: 40 })
      WIDGETS['li-alin'].open()
      WIDGETS['li-alin'].recenter()
      TUTORIAL.wigMove('li-alin', { right: 40 })
    },
    content: 'Another clarification we should make is the difference between VR as a tool (part of the process) and VR as a medium (the work itself). For example, Keanu Reeves uses VR as a tool to design his motorcycles, while Li Alin uses VR as a medium for transporting her audience into a fictional cyber-feminist reality',
    options: {
      'go on...': (e) => {
        e.goTo('art-tool-vs-medium2')
        TUTORIAL.autoStopClose(['li-alin', 'today-keanu'])
      }
    }
  }, {
    id: 'art-tool-vs-medium2',
    before: () => {
      TUTORIAL.autoPlayOpen('vr-norman', {
        left: 20, top: window.innerHeight * 0.5
      })
      TUTORIAL.autoPlayOpen('vr-quill', {
        left: window.innerWidth * 0.25, bottom: 20
      })
      TUTORIAL.autoPlayOpen('vr-tilt-brush-residency', {
        right: 20, bottom: 20
      })
      const x = window.innerWidth / 2 - NNW.win.offsetWidth - 20
      NNW.updatePosition(x, 1)
    },
    content: 'As an art tool, there are VR apps for making 3D drawings (<a href="https://www.tiltbrush.com/" target="_blank">Tilt Brush</a> or <a href="https://aframe.io/a-painter/" target="_blank">A-Painter</a>), 3D objects (<a href="https://vr.google.com/blocks/" target="_blank">Blocks</a>, <a href="https://supermedium.com/supercraft/" target="_blank">Supercraft</a> or <a href="https://www.gravitysketch.com/" target="_blank">Gravity Sketch</a>) and 3D animations (<a href="https://quill.fb.com/" target="_blank">Quill</a>). Some artists like <a href="https://www.creativeapplications.net/js/norman-webvr-tool-to-create-frame-by-frame-animations-in-3d/" target="_blank">James Paterson</a> and <a href="https://www.creativeapplications.net/membersonly/inside-the-artists-headset-sterling-crispins-cyber-paint/" target="_blank">Sterling Crispin</a>, have even made their own custom tools.',
    options: {
      'I see': (e) => {
        e.goTo('art-tool-vs-medium3')
        TUTORIAL.autoStopClose([
          'vr-tilt-brush-residency', 'vr-norman', 'vr-quill'
        ])
        NNW.updatePosition()
      }
    }
  }, {
    id: 'art-tool-vs-medium3',
    before: () => {
      TUTORIAL.autoPlayOpen('mattia-casalegno', { bottom: 80, right: 80 })
      TUTORIAL.autoPlayOpen('vr-radiance', { bottom: 50, left: 20 })
      TUTORIAL.autoPlayOpen('vr-dust', { top: 10, left: 10 }, true)
    },
    content: 'That said, we\'ll be approaching VR as a creative medium in and of itself. The way multidisciplinary artist Mattia Casalegno uses it to create immersive dining experience that plays with your taste perception. Or like the piece Dust, a collaboration between digital artists and dancers which uses VR to experience contemporary dance in a whole new way.',
    options: {
      'let\'s do it!': (e) => {
        e.goTo('code-start')
        TUTORIAL.autoStopClose(['mattia-casalegno', 'vr-radiance', 'vr-dust'])
      }
    }
  }, {
    id: 'code-start',
    edit: false,
    content: 'We\'ll be crafting our own corner of cyberspace in HTML code using a WebVR library called <a href="https://aframe.io/" target="_blank">a-frame</a>, which, as I mentioned earlier, is how the virtual space behind me was created.',
    options: {
      'let\'s see the code!': (e) => {
        e.goTo('code-reveal')
        STORE.dispatch('CHANGE_LAYOUT', 'separate-window')
        NNE.autoUpdate = false
        window.utils.netitorUpdate()
      }
    }
  }, {
    id: 'code-reveal',
    edit: false,
    content: 'I know I know, there\'s a lot of code to talk about here, but if you take a minute to read through it, I bet you could figure out what most of the code does. You can also <i>double-click</i> on pieces of code you want to learn more about and I\'ll epxlain it to you.',
    options: {
      'so how do I make something like this?': (e) => e.goTo('code-reduced'),
      'why can\'t I edit this code?': (e) => e.goTo('code-not-editable')
    }
  }, {
    id: 'code-not-editable',
    edit: false,
    content: 'I disabled editing for a second because there\'s a bit more we should talk about before you dive in.',
    options: {
      'but I want to play!': (e) => e.goTo('code-not-editable2'),
      'Oh, ok.': (e) => e.goTo('code-reduced')
    }
  }, {
    id: 'code-not-editable2',
    edit: false,
    before: () => { NNE.autoUpdate = true },
    content: 'Ok ok, remixing can be fun and educational, so why not? One thing you should know is that I\'m going to update the output as soon as I notice you\'ve changed something in the editor (so long as I don\'t spot any errors of course)...',
    options: { ok: (e) => e.goTo('code-not-editable3') }
  }, {
    id: 'code-not-editable3',
    edit: false,
    content: '...and the a-frame library can weigh on your processor if it\'s rebuilding too often. So if you notice things getting laggy, you might want to set <code>autoUpdate(false)</code> in the editor settings of the Functions Menu.',
    options: {
      'how do I do that?': (e) => e.goTo('explain-func-menu'),
      'sounds good.': (e) => e.goTo('code-remix')
    }
  }, {
    id: 'explain-func-menu',
    edit: true,
    content: 'Just click on my face and choose the Functions Menu and it\'ll pop right up!',
    options: { 'sounds good.': (e) => e.goTo('code-remix') }
  }, {
    id: 'code-remix',
    edit: true,
    content: 'Great! have at it! Let me know when you\'re done poking around and I\'ll guide you through how it all works.',
    options: { 'ok, I\'m done!': (e) => e.goTo('code-reduced') }
  }, {
    id: 'code-reduced',
    edit: false,
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
      window.utils.netitorUpdate()
      setTimeout(() => {
        NNE.highlight({
          startLine: 32, endLine: 52, color: 'rgba(255, 255, 255, 0.15)'
        })
      }, STORE.getTransitionTime())
    },
    content: 'Ok, I\'ll show you how to craft some cyberspace! But we should start from scratch, so let\'s remove all the code related to the bust first.',
    options: { next: (e) => e.goTo('code-reduced1') }
  }, {
    id: 'code-reduced1',
    edit: false,
    before: () => {
      NNE.autoUpdate = true
      NNW._whenCSSTransitionFinished(() => {
        const path = './tutorials/virtual-reality/samples/reduced1.html'
        window.utils.get(path, (res) => {
          NNE.code = res
          NNE.highlight({
            startLine: 14, endLine: 25, color: 'rgba(255, 255, 255, 0.15)'
          })
        }, true)
      })
    },
    content: 'Next we\'ll remove the code for the pink palm trees.',
    options: { next: (e) => e.goTo('code-reduced2') }
  }, {
    id: 'code-reduced2',
    edit: false,
    before: () => {
      NNW._whenCSSTransitionFinished(() => {
        const path = './tutorials/virtual-reality/samples/reduced2.html'
        window.utils.get(path, (res) => {
          NNE.code = res
          NNE.highlight({
            startLine: 7, endLine: 10, color: 'rgba(255, 255, 255, 0.15)'
          })
        }, true)
      })
    },
    content: 'Then we\'ll get rid of the checkered floor...',
    options: { next: (e) => e.goTo('code-reduced3') }
  }, {
    id: 'code-reduced3',
    edit: false,
    before: () => {
      NNW._whenCSSTransitionFinished(() => {
        const path = './tutorials/virtual-reality/samples/reduced3.html'
        window.utils.get(path, (res) => {
          NNE.code = res
          NNE.highlight({
            startLine: 5, color: 'rgba(255, 255, 255, 0.15)'
          })
        }, true)
      })
    },
    content: '...now the sky...',
    options: { next: (e) => e.goTo('code-reduced4') }
  }, {
    id: 'code-reduced4',
    edit: false,
    before: () => {
      NNW._whenCSSTransitionFinished(() => {
        const path = './tutorials/virtual-reality/samples/reduced4.html'
        window.utils.get(path, (res) => {
          NNE.code = res
          NNE.highlight({
            startLine: 3, endLine: 5, color: 'rgba(255, 255, 255, 0.15)'
          })
        }, true)
      })
    },
    content: '..then the scene itself...',
    options: { next: (e) => e.goTo('code-reduced5') }
  }, {
    id: 'code-reduced5',
    edit: false,
    before: () => {
      NNW._whenCSSTransitionFinished(() => {
        const path = './tutorials/virtual-reality/samples/reduced5.html'
        window.utils.get(path, (res) => {
          NNE.code = res
          NNE.highlight({
            startLine: 2, color: 'rgba(255, 255, 255, 0.15)'
          })
        }, true)
      })
    },
    content: '...and lastly, the a-frame library.',
    options: { next: (e) => e.goTo('code-reduced6') }
  }, {
    id: 'code-reduced6',
    edit: false,
    before: () => {
      NNW._whenCSSTransitionFinished(() => {
        const path = './tutorials/virtual-reality/samples/reduced6.html'
        window.utils.get(path, (res) => { NNE.code = res }, true)
      })
    },
    content: 'We\'re left with a simple doctype, declaring our intention to create an HTML page. A blank canvas. Ready to start the next tutorial?',
    options: {
      'let\'s do it!': (e) => {
        // NNT.load()
        NNT.load('webvr-basics')
      }
    }
  }],

  onload: () => {
    window.utils.setupAframeEnv()
    NNE.addCustomRoot('tutorials/virtual-reality/')
    NNE.code = TUTORIAL.bgCode
    STORE.dispatch('CHANGE_LAYOUT', 'welcome')
  },

  bgCode: `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene renderer="antialias: true">
  <a-assets>
    <a-asset-item id="palm-obj" src="models/QueenPalmTree.obj"></a-asset-item>
    <a-asset-item id="bust1" src="models/bust1.obj"></a-asset-item>
    <a-asset-item id="bust2" src="models/bust2.obj"></a-asset-item>
    <a-asset-item id="bust3" src="models/bust3.obj"></a-asset-item>
    <a-asset-item id="bust4" src="models/bust4.obj"></a-asset-item>
    <a-mixin id="bust" material="color: #e7e5c9; opacity: 0.7" position="0.63 0 -2.38" rotation="0 -59 0" scale="0.1 0.1 0.1"></a-mixin>
  </a-assets>
  <a-sky src="images/bg.jpg"></a-sky>

  <a-entity id="floor"
    geometry="primitive: plane; width: 6; height: 6;"
    material="src: images/tile.png; opacity: 0.5"
    position="0 0 -4" rotation="-90 0 0"></a-entity>

  <a-entity
    obj-model="obj: #palm-obj"
    material="color: #c76ebc; wireframe: true;"
    position="-0.62 0 -3.7"
    rotation="21 -64 -7"
    scale="0.18 0.18 0.18"></a-entity>

  <a-entity
    obj-model="obj: #palm-obj"
    material="color: #c76ebc; wireframe: true;"
    position="-0.47 0 -3.9"
    scale="0.25 0.25 0.25"></a-entity>

  <a-entity
    obj-model="obj: #bust1"
    animation="property: position; to: 0.63 0.1 -2.38;
      dir: alternate; dur: 2000; easing: easeInOutQuad; loop: true;"
    mixin="bust"></a-entity>

  <a-entity
    obj-model="obj: #bust2"
    animation="property: position; to: 0.63 0.1 -2.38;
      dir: alternate; dur: 2200; easing: easeInOutQuad; loop: true;"
    mixin="bust"></a-entity>

  <a-entity
    obj-model="obj: #bust3"
    animation="property: position; to: 0.63 0.1 -2.38;
      dir: alternate; dur: 2400; easing: easeInOutQuad; loop: true;"
    mixin="bust"></a-entity>

  <a-entity
    obj-model="obj: #bust4"
    mixin="bust"></a-entity>

</a-scene>
`,

  widgets: {
    'vr-cc': new HyperVidPlayer({
      video: 'api/videos/vr1-computer-chronicles.mp4',
      width: window.innerWidth * 0.375,
      title: 'Computer Chronicles (1992)',
      source: {
        url: 'https://archive.org/details/virtualreali',
        text: 'Computer Chronicles episdoe on Virtual Reality'
      }
    }),
    'vr-abc': new HyperVidPlayer({
      video: 'api/videos/vr2-abc-news.mp4',
      width: window.innerWidth * 0.375,
      title: 'ABC Primetime (1991)',
      source: {
        url: 'https://www.youtube.com/watch?v=rVn3H93Ysag',
        text: 'ABC Primetime report on Virtual Reality Sept 19, 1991'
      }
    }),
    'vr-cyberpunk': new HyperVidPlayer({
      video: 'api/videos/vr4-cyberpunk.mp4',
      width: window.innerWidth * 0.4,
      title: 'Cyberpunk (1990)',
      text: '"Jack into the Matrix!", this doc by Marianne Trench explores the cyberpunk culture of the late 80s and early 90s, for which Virtual Reality is only one aspect.',
      source: {
        url: 'https://archive.org/details/cyberpunk_201410',
        text: 'Cyberpunk documentary by Marianne Trench'
      }
    }),
    'video-chats': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'Video Chats (2020)',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/tech-ceos.png"><br><p><a href="https://www.theguardian.com/technology/video/2020/jul/30/too-much-power-key-moments-as-tech-ceos-face-historic-us-hearing-video" target="_blank">Congress video chats with top tech CEOs</a> amidst the Corona Virus pandemic in 2020. As Timothy Leary (and others) predicted, today we do not have to "leave home with our bodies to go to work"</p>'
    }),
    'video-bowls': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'HTC Vive VR (2016)',
      innerHTML: '<video style="width: 100%" loop src="api/videos/vr-fish-bowls.mp4"></video><p>Today you can play the HTC Vive\'s free VR demo "<a href="https://www.youtube.com/watch?v=RtR-0waVOIA" target="_blank">The Lab</a>" which implements the exact same "fish bowl" metaphor Jaron Lanier describes</p>'
    }),
    'origins-stereoscope': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'Stereoscope (1800s)',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/stereoscope.jpg">'
    }),
    'origins-gifs': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'Stereoscope Images converted to Gifs',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/origins-gifs-1.gif"><br><button onclick="TUTORIAL.nextGif(\'origins-gifs\', 6)">next</button>'
    }),
    'origins-sutherland': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'The Sword of Damocles (1960s)',
      innerHTML: '<video style="width: 100%" loop src="api/videos/sword-of-damocles.mp4"></video><p>Famed computer scientist Ivan Sutherland\'s early experiments in mixed reality</p>'
    }),
    'origins-sensorama': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'Sensorama (1962)',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/sensorama.jpg"><br><p>The "Sensorama" by filmmaker Morton Heilig</p>'
    }),
    '90s-the-cave': new HyperVidPlayer({
      video: 'api/videos/the-cave.mp4',
      width: window.innerWidth * 0.375,
      title: 'The Cave, University of Illinois Chicago (1990s)',
      text: 'The cave is an immersive virtual reality environment developed in Chicago by legendary computer researcher/artists Carolina Cruz-Neira, Dan Sandin, and Tom DeFanti. "The name of the environment alludes to the famous cave allegory introduced by Greek philosopher Plato in his Republic. Plato used the image of prisoners in a cave who define the basis of their reality through the shadows of fire dancing on the walls of the cave to develop concepts of reality, representation, and human perception." Christiane Paul (Curator of New Media Arts at the Whitney Museum of American Art)',
      source: {
        url: 'https://www.youtube.com/watch?v=aKL0urEdtPU',
        text: 'CAVE - A Virtual Reality Theater - 1992'
      }
    }),
    '90s-char-davies': new Widget({
      width: window.innerWidth * 0.4,
      listed: false,
      title: 'Char Davies and her seminal VR piece Osmose',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/char-davies.jpg"><br><p><a href="https://en.wikipedia.org/wiki/Char_Davies" target="_blank">Char Davies</a> is a Canadian contemporary aritist known for creating immersive virtual reality artworks.</p>'
    }),
    '90s-osmose': new HyperVidPlayer({
      video: 'api/videos/char-davies.mp4',
      width: window.innerWidth * 0.25,
      title: 'Osmose by Char Davies (1995)',
      text: 'This video is a 2min excerpt of a 30min mini-documentary of the Osmose installation at the Museum of Contemporary Art Montreal as part of the Sixth International Symposium on Electronic Art (<a href="http://www.isea-web.org/" target="_blank">ISEA</a>). Montreal continues to be a center for VR art today, cultural spaces like <a href="https://phi-centre.com/en" target="_blank">PHI Centre</a> curate contemporary VR shows.',
      source: {
        url: 'https://www.youtube.com/watch?v=bsT59fp8LpY',
        text: 'Osmose (1995) - Mini-documentary'
      }
    }),
    '90s-cyberpunk': new HyperVidPlayer({
      video: 'api/videos/cyberpunk.mp4',
      width: window.innerWidth * 0.375,
      title: 'Cyberpunk Documentary (1990)',
      text: '"Jack into the Matrix!", This video is a 6min edit of an hour long doc by Marianne Trench explores the cyberpunk culture of the late 80s and early 90s, from virtual reality to "cyber arts" to mind machines. It contains some great interviews, including William Gibson (cyberpunk author), Timothy Leary (the notorious LSD evangelist), Jaron Lanier (VR pioneer turned digital rights advocate) among others.',
      source: {
        url: 'https://archive.org/details/cyberpunk_201410',
        text: 'Cyberpunk documentary by Marianne Trench'
      }
    }),
    'xr-spectrum': new Widget({
      width: window.innerWidth * 0.5,
      listed: false,
      title: 'VR to AR: Mixed/Extended Reality (XR) spectrum',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/spectrum.png">'
    }),
    'vr-vive': new Widget({
      width: window.innerWidth * 0.5,
      listed: false,
      title: 'HTC Vive (2016)',
      innerHTML: '<video style="width: 100%" loop src="api/videos/vr-today-vive.mp4"></video>'
    }),
    'vr-quest': new Widget({
      width: window.innerWidth * 0.3,
      listed: false,
      title: 'Oculus Quest (2019)',
      innerHTML: '<video style="width: 100%" loop src="api/videos/vr-today-quest.mp4"></video>'
    }),
    'today-dimoda': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'Digital Museum of Digital Art (DiMoDA)',
      innerHTML: '<video style="width: 100%" loop src="api/videos/dimoda.mp4"></video><p>In 2013 new media artists turned VR curators Alfredo Salazar-Caro and William Robertson launched <a href="https://dimoda.art/" target="_blank">DiMoDA</a>, dedicated to commissioning, preserving and exhibiting cutting edge VR artworks.</p>'
    }),
    'today-phi': new Widget({
      width: window.innerWidth * 0.5,
      listed: false,
      title: 'Phi Centre',
      innerHTML: '<video style="width: 100%" loop src="api/videos/phi-centre.mp4"></video><p>The <a href="https://phi-centre.com/en/" target="_blank">Phi Centre</a> in Montreal is a multidisciplinary arts and culture organization with multiple galleries devoted to exhibiting VR art works.</p>'
    }),
    'today-keanu': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'Keanu Reeves\'s ARCH Motorcycle',
      innerHTML: '<video style="width: 100%" loop src="api/videos/keanu-vr-motorcycles.mp4"></video><p>Keanu Reeves (who knows a thing or two about Cyberspace having starred in films like Johnny Mnemonic and the Matrix) uses VR in the design process at his company <a href="https://www.archmotorcycle.com/" target="_blank">ARCH Motorcycle</a>.</p>'
    }),
    'vr-quill': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'Quill by Facebook',
      innerHTML: '<video style="width: 100%" loop src="api/videos/quill.mp4"></video><p>This piece by <a href="https://www.youtube.com/watch?v=EzsG1uqfDTQ" target="_blank">Goro Fujita</a> was created in an VR app called <a href="https://quill.fb.com/" target="_blank">Quill </a>(created by Facebook)</p>'
    }),
    'vr-tilt-brush-residency': new HyperVidPlayer({
      video: 'api/videos/tilt-brush-residency.mp4',
      width: window.innerWidth * 0.5,
      title: 'Tilt Brush by Google',
      text: 'Google invited 60 artists to participate in their Artist in Residence (AiR) a research and development (R&D) program to help them develop their popular VR painting tool Tilt Brush. There is a long history of tech companies hosting artists in residence to aid the development of new technologies. There\'s a great documentary on Lillian Schwartz called <a href="https://www.youtube.com/watch?v=DVeIU2taC0M" target="_blank">the Artist and the Computer</a> which depicts her time as as artist in residence at the infamous Bell Labs (which developed many ground breaking technologies).',
      source: {
        url: 'https://www.youtube.com/watch?v=LBJPIgNXUDI',
        text: 'Tilt Brush Artist in Residence'
      }
    }),
    'li-alin': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'Enter Me Tonight by Li Alin (2016)',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/li-alin.jpg"><br><p>Exhibition view THE UNFRAMED WORLD at HeK Basel. Enter Me Tonight by <a href="http://www.lialin.net/" target="_blank">Li Alin</a>, 2016 (Installation and VR experience) / Photo by Franz Wamhof</p>'
    }),
    'vr-norman': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'Norman by James Paterson',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/vr-norman-3.gif"><p>"Norman is the animation tool that I’ve always wanted. I built it in JavaScript, it runs in a web browser and lets me animate naturally in 3D using VR controllers." <a href="https://normanvr.com/" target="_blank">James Paterson</a></p><p><button onclick="TUTORIAL.nextGif(\'vr-norman\', 4)">next</button> (source: <a href="https://www.creativeapplications.net/js/norman-webvr-tool-to-create-frame-by-frame-animations-in-3d/" target="_blank">Creative Applications</a>)</p>'
    }),
    'mattia-casalegno': new Widget({
      width: window.innerWidth * 0.3,
      listed: false,
      title: 'Aerobanquets RMX by Mattia Casalegno (2018)',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/mattia-casalegno.jpg"><br><p><a href="http://www.mattiacasalegno.net/aerobanquets-rmx/#4" target="_blank">The Aerobanquets RMX</a> is a series of immersive dining experiences focussed on taste perception. Loosely based on the Futurist Cookbook, the (in)famous Italian book of surreal recipes and fantastical dinners published in 1932, the project is a multi sensorial journey experienced in Mixed Reality.</p>'
    }),
    'vr-radiance': new Widget({
      width: window.innerWidth * 0.3,
      listed: false,
      title: 'radiancevr.co',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/radiance.png"><br><p><a href="https://www.radiancevr.co/" target="_blank">Radiance</a> is an research platform and online database for VR art. </p>'
    }),
    'vr-dust': new Widget({
      width: window.innerWidth * 0.5,
      listed: false,
      title: 'Dust by Mária Júdová and Andrej Boleslavský (2016)',
      innerHTML: '<video style="width: 100%" loop src="api/videos/dust-vr.mp4"></video><p><a href="https://www.youtube.com/watch?v=EzsG1uqfDTQ" target="_blank">Dust</a>, by Mária Júdová and Andrej Boleslavský, is a Virtual Reality piece which invites the audience to experience dance performance from the perspective of eternal particle travelling in space.</p>'
    })
  },

  wigMove: (id, spot, nn) => {
    setTimeout(() => {
      WIDGETS[id].update(spot, 500)
      const x = WIDGETS[id].width + 50
      if (nn) NNW.updatePosition(x)
    }, 250)
  },

  autoPlayOpen: (id, spot, nn) => {
    WIDGETS[id].open()
    if (WIDGETS[id].play) WIDGETS[id].play()
    else if (WIDGETS[id].$('video')) WIDGETS[id].$('video').play()
    TUTORIAL.wigMove(id, spot, nn)
  },

  autoStopClose: (arr) => {
    arr.forEach(id => {
      if (WIDGETS[id].pause) WIDGETS[id].pause()
      else if (WIDGETS[id].$('video')) WIDGETS[id].$('video').pause()
      WIDGETS[id].close()
    })
  },

  nextGif: (id, max) => {
    const img = WIDGETS[id].$('img')
    const num = Number(img.src.split(id)[1].substr(1, 1))
    const idx = num + 1 > max ? 1 : num + 1
    img.src = `tutorials/virtual-reality/images/${id}-${idx}.gif`
  },

  introVideos: () => {
    WIDGETS['vr-cc'].open()
    WIDGETS['vr-cc'].play()
    TUTORIAL.wigMove('vr-cc', { left: 20, top: 20 }, true)

    WIDGETS['vr-cc'].at('38.5', () => {
      WIDGETS['vr-cc'].src = 'api/videos/vr3-computer-chronicles.mp4'
      WIDGETS['vr-cc'].play()
      WIDGETS['vr-abc'].open()
      WIDGETS['vr-abc'].play()
      TUTORIAL.wigMove('vr-abc', { left: 50, bottom: 20 }, true)

      WIDGETS['vr-abc'].at('28.3', () => {
        WIDGETS['vr-cc'].bring2front()
      })
    })

    WIDGETS['vr-cc'].at('44', () => {
      WIDGETS['vr-cyberpunk'].open()
      WIDGETS['vr-cc'].bring2front()
      WIDGETS['vr-cyberpunk'].play()
      TUTORIAL.wigMove('vr-cyberpunk', { right: 20, top: 20 }, true)
      WIDGETS['vr-cyberpunk'].at('161.6', () => {
        WIDGETS['video-bowls'].open()
        WIDGETS['video-bowls'].$('video').play()
        TUTORIAL.wigMove('video-bowls', {
          left: window.innerWidth * 0.4, bottom: 20
        })
      })
      WIDGETS['vr-cyberpunk'].at('231', () => {
        WIDGETS['video-chats'].open()
        TUTORIAL.wigMove('video-chats', {
          left: window.innerWidth * 0.45, bottom: 40
        })
      })
      WIDGETS['vr-cyberpunk'].at('306.9', () => {
        WIDGETS['vr-cc'].src = 'api/videos/vr5-computer-chronicles.mp4'
        WIDGETS['vr-cc'].bring2front()
        WIDGETS['vr-cc'].play()
        WIDGETS['vr-cc'].at('39.7', () => {
          WIDGETS['vr-cc'].close()
          WIDGETS['vr-abc'].close()
          WIDGETS['vr-cyberpunk'].close()
          WIDGETS['video-chats'].close()
          WIDGETS['video-bowls'].close()
          STORE.dispatch('TUTORIAL_GOTO', 'vr-history')
        })
      })
    })
  }
}
