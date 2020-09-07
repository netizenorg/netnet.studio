/* global Widget, TUTORIAL, HyperVidPlayer, STORE, WIDGETS, NNW, NNE */
window.TUTORIAL = {
  steps: [{
    content: 'The scene you see behind me was created using HTML code and a WebVR library called <a href="https://aframe.io/" target="_blank">a-frame</a>. Click and drag it with your mouse. I can show you how it was made, but first let\'s talk about Virtual Reality or VR!'
  }, {
    before: () => { TUTORIAL.introVideos() },
    content: 'Our VR story begins, like the Web itself, in the early 1990s',
    options: { next: (e) => e.goTo('vr-history') }
  }, {
    before: () => {
      WIDGETS['vr-cc'].close()
      WIDGETS['vr-abc'].close()
      WIDGETS['vr-cyberpunk'].close()
      WIDGETS['video-chats'].close()
      WIDGETS['video-bowls'].close()
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
<iframe src="http://www.360visio.com/wp-content/uploads/v2/20b-Milano360/20h-1-Chiese/5-AltreChiese/3sEustorgio/3m463e-sEustorgioTorelli/output/index.html"></iframe>`,
    content: 'In some sense, artists have always used their work to transport viewers into another reality. Consider the 16th century frescos for example. The term "virtual reality" actually predates the technology itself. It was used by French avant-garde artists in the 1930s to describe the "réalité virtuelle" of the theatre.',
    options: { next: (e) => e.goTo('origins2') }
  }, {
    id: 'origins2',
    before: () => {
      WIDGETS['origins-stereoscope'].open()
      TUTORIAL.wigMove('origins-stereoscope', { left: 30, top: 30 })
      WIDGETS['origins-gifs'].open()
      TUTORIAL.wigMove('origins-gifs', { left: 90, top: 330 })
      WIDGETS['origins-sutherland'].open()
      WIDGETS['origins-sutherland'].$('video').play()
      TUTORIAL.wigMove('origins-sutherland', { right: 40, top: 40 })
      WIDGETS['origins-sensorama'].open()
      TUTORIAL.wigMove('origins-sensorama', { right: 100, bottom: 40 })
    },
    content: 'Like all great ideas, VR doesn\'t have a single point of origin. It evolved from various different technologies.',
    options: {
      'good point': (e) => {
        WIDGETS['origins-stereoscope'].close()
        WIDGETS['origins-gifs'].close()
        WIDGETS['origins-sutherland'].close()
        WIDGETS['origins-sensorama'].close()
        WIDGETS['origins-sutherland'].$('video').pause()
        NNE.code = TUTORIAL.bgCode
        e.goTo('vr-history')
      }
    }
  }, {
    id: 'the-90s',
    content: 'The VR renaissance came in the late 80s and early 90s when the technology found it\'s way into the mainstream and the underground, like the "Cyberpunk" counterculture. A wave of new technologies were developed, like The Cave in Chicago and VR art, like Osmose by Char Davies, found it\'s way into major art museums. Virtual dreams were becoming a reality, until nauseating commercial failures of consumer devices, like Nintendo\'s Virtual Boy, ruined the public\'s appetite.',
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
        WIDGETS['90s-the-cave'].close()
        WIDGETS['90s-char-davies'].close()
        WIDGETS['90s-osmose'].close()
        WIDGETS['90s-cyberpunk'].close()
        NNW.updatePosition()
      }
    }
  }, {
    id: 'vr-today',
    before: () => {
      // https://www.youtube.com/watch?v=2VkO-Kc3vks
      // https://www.youtube.com/watch?v=TckqNdrdbgk
    },
    content: 'Today VR is going through it\'s second renaissance, with more powerful and affordable consumer devices on the market by companies like <a href="https://www.vive.com/us/" target="_blank">HTC</a>, <a href="https://www.oculus.com/" target="_blank">Oculus</a>, <a href="https://arvr.google.com/daydream/" target="_blank">Google</a> and others, the tech has never been more accessible to artists, designers and developers. With a piece of <a href="https://arvr.google.com/cardboard/" target="_blank">cardboard</a> and some cheap lenses we can even turn our smartphones into VR headsets.',
    options: { next: (e) => e.goTo('vr-today2') }
  }, {
    id: 'vr-today2',
    before: () => {
      // DiMoDA? ...something else?
    },
    content: 'Today it\'s being used in everything from <a target="_blank" href="https://www.youtube.com/watch?v=zGGVYT0cMHg">education</a>, to <a target="_blank" href="https://www.youtube.com/watch?v=mZStQT3o5xc&amp;feature=youtu.be">surgical training</a>, as <a target="_blank" href="https://www.youtube.com/watch?v=GiJuPB7S2I4">evidence in court cases</a>, for <a target="_blank" href="https://youtu.be/sDc5lIj1VbY?t=731">physical therapy</a> and <a target="_blank" href="https://www.youtube.com/watch?v=GMttQHMjbJo">mental health</a>. Contemporary VR art, like Jordan Wolfson\'s controversial piece "<a target="_blank" href="https://www.newyorker.com/culture/cultural-comment/confronting-the-shocking-virtual-reality-artwork-at-the-whitney-biennial">Real Violence</a>" has been exhibited in major shows like the Whitney Biennial. Artists Alfredo Salazar-Caro and William Robertson have even started an entirely VR museum for new media art called <a target="_blank" href="https://dimoda.art/">DiMoDA</a>.',
    options: { back: (e) => e.goTo('vr-history') }
  }],

  onload: () => {
    window.utils.get('api/data/aframe', (data) => {
      NNE.addCustomElements(data.elements)
      NNE.addCustomAttributes(data.attributes)
      NNE.addErrorException('{"rule":{"id":"attr-whitespace","description":"All attributes should be separated by only one space and not have leading/trailing whitespace.","link":"https://github.com/thedaviddias/HTMLHint/wiki/attr-whitespace"},"message":"The attributes of [ animation ] must be separated by only one space."}')
      NNE.code = TUTORIAL.bgCode
    })
  },

  bgCode: `<!DOCTYPE html>
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<a-scene>
  <a-sky src="tutorials/virtual-reality/images/bg.jpg"></a-sky>

  <a-entity id="floor"
  geometry="primitive: plane; width: 6; height: 6;"
  material="src: tutorials/virtual-reality/images/tile.png;"
  position="0 0 -4" rotation="-90 0 0"></a-entity>
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
      text: '"Jack into the Matrix!", this doc by Marianne Trench explores the cyberpunk culture of the late 80s and early 90s',
      source: {
        url: 'https://archive.org/details/cyberpunk_201410',
        text: 'Cyberpunk documentary by Marianne Trench'
      }
    }),
    'video-chats': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'Video Chats (2020)',
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/tech-ceos.png"><br><p>Congress video chats with top tech CEOs amidst the Corona Virus pandemic in 2020. As Timothy Leary (and others) predicted, today we do not have to "leave home with our bodies to go to work"</p>'
    }),
    'video-bowls': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'HTC Vive VR (2016)',
      innerHTML: '<video style="width: 100%" loop src="api/videos/vr-fish-bowls.mp4"></video><p>Today you can play the HTC Vive\'s free VR demo "The Lab" which implements the exact same "fish bowl" metaphor Jaron Lanier describes</p>'
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
      innerHTML: '<img style="width:100%" src="tutorials/virtual-reality/images/stereoscope1.gif"><br><button onclick="TUTORIAL.nextGif()">next</button>'
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
      title: 'The Cave, University of Illinois Chicago (1990s)',
      text: 'This video is a 2min excerpt of a 30min mini-documentary of the Osmose installation at the Museum of Contemporary Art Montreal as part of the Sixth International Symposium on Electronic Art (<a href="http://www.isea-web.org/" target="_blank">ISEA</a>). Montreal continues to be a center for VR art today, cultural spaces like <a href="https://phi-centre.com/en" target="_blank">PHI Centre</a> curate contemporary VR shows.',
      source: {
        url: 'https://www.youtube.com/watch?v=bsT59fp8LpY',
        text: 'Osmose (1995) - Mini-documentary'
      }
    }),
    '90s-cyberpunk': new HyperVidPlayer({
      video: 'api/videos/cyberpunk.mp4',
      width: window.innerWidth * 0.375,
      title: 'The Cave, University of Illinois Chicago (1990s)',
      text: '"Jack into the Matrix!", This video is a 6min edit of an hour long doc by Marianne Trench explores the cyberpunk culture of the late 80s and early 90s, from Virtual Reality to "cyber arts" to mind machines. It contains some great interviews, including William Gibson (cyberpunk author), Timothy Leary (the notorious LSD evangelist), Jaron Lanier (VR pioneer turned digital rights advocate) among others.',
      source: {
        url: 'https://archive.org/details/cyberpunk_201410',
        text: 'Cyberpunk documentary by Marianne Trench'
      }
    })
  },

  wigMove: (id, spot, nn) => {
    setTimeout(() => {
      WIDGETS[id].update(spot, 500)
      const x = WIDGETS[id].width + 50
      if (nn) NNW.updatePosition(x)
    }, 250)
  },

  nextGif: () => {
    const img = WIDGETS['origins-gifs'].$('img')
    const num = Number(img.src.split('stereoscope')[1].substr(0, 1))
    const idx = num + 1 > 6 ? 1 : num + 1
    img.src = `tutorials/virtual-reality/images/stereoscope${idx}.gif`
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
      WIDGETS['vr-cyberpunk'].at('185', () => {
        WIDGETS['video-bowls'].open()
        WIDGETS['video-bowls'].$('video').play()
        TUTORIAL.wigMove('video-bowls', { left: 20, bottom: 20 })
      })
      WIDGETS['vr-cyberpunk'].at('250', () => {
        WIDGETS['video-chats'].open()
        TUTORIAL.wigMove('video-chats', { left: 40, bottom: 40 })
      })
      WIDGETS['vr-cyberpunk'].at('321.5', () => {
        WIDGETS['vr-cc'].src = 'api/videos/vr5-computer-chronicles.mp4'
        WIDGETS['vr-cc'].bring2front()
        WIDGETS['vr-cc'].play()
        WIDGETS['vr-cc'].at('39', () => {
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
