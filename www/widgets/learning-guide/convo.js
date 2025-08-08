/* global */
window.CONVOS['learning-guide'] = (self) => {
  const name = self.metadata ? self.metadata.author.name : ''
  const title = self.metadata ? self.metadata.title : ''

  const menuOpts = () => {
    return {
      'ok!': (e) => e.hide(),
      'Learning Guide?': (e) => e.goTo('nfo-lg'),
      'Coding Menu?': (e) => e.goTo('nfo-fm'),
      'Search Bar?': (e) => e.goTo('nfo-sb')
    }
  }

  return [{
    id: 'guide-open',
    content: 'Here you go! Click on my face when you need me!',
    options: {
      'thanks!': (e) => e.hide(),
      'how does this work?': (e) => e.goTo('explain')
    }
  }, {
    id: 'toc',
    content: 'Click on an item in the <b>Table of Contents</b> to jump to it, you can also scroll through the guide to explore each section.',
    options: {
      'thanks!': (e) => e.hide(),
      'how does this work?': (e) => e.goTo('explain')
    }
  }, {
    id: 'explain',
    content: 'Scroll through the learning guide to find interactive tutorials, examples and references. If you\'d like to jump straight to coding your own sketch just click on my face and say <img src="images/menu/hi.png" class="learning-guide__d-icons"> anytime, or you can click on the <img src="images/menu/code.png" class="learning-guide__d-icons"> <b>Coding Menu</b>, or the <img src="images/menu/tutorials.png" class="learning-guide__d-icons"> <b>Learning Guide</b> or the <img src="images/menu/search.png" class="learning-guide__d-icons"> <b>Search Bar</b>.',
    options: menuOpts()
  }, {
    id: 'nfo-lg',
    content: `The <img src="images/menu/tutorials.png" class="learning-guide__d-icons"> <b>Learning Guide</b> widget contains interactive tutorials, examples and references. It's still in "BETA", which means there may be bugs because we're regularly working on it and adding more content (if you come acorss an issue <a href="https://github.com/netizenorg/netnet.studio/issues" target="_blank">let us know</a>). You can also open the Guide using the <code>${utils.hotKey()} + L</code> key.`,
    options: menuOpts()
  }, {
    id: 'nfo-fm',
    content: `The <img src="images/menu/code.png" class="learning-guide__d-icons"> <b>Coding Menu</b> widget controls my code editor settings and other details having to do with your sketch. It also lets you connect me (login) to your GitHub so you can create and publish projects (or "repositories") to the World Wide Web. You can also open it using the <code>${utils.hotKey()} + ;</code> key (<i>${utils.hotKey()} semicolon</i>).`,
    options: menuOpts()
  }, {
    id: 'nfo-sb',
    content: `The <img src="images/menu/search.png" class="learning-guide__d-icons"> <b>Search Bar</b> looks through all of the features, widgets and content in the studio. If you're not sure where to find something you came across earlier, the search bar's here to help. You can also open the Search using the <code>${utils.hotKey()} + '</code> key (<i>${utils.hotKey()} quote</i>).`,
    options: menuOpts()
  }, {
    id: 'introducing-tutorial',
    content: `I've just loaded a tutorial by ${name} called "${title}", press the video players's <i>play</i> button to begin. Press the video player's <i>X</i> button at anytime to quit.`,
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: '<examples>',
    content: 'This widget contains a collection of interactive code demos you can explore and experiment with. In some cases I can walk you through the example and explain how it works.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: '<docs>',
    content: 'These widgets contain foundational info on the core web coding languages as well as appendices containing lists of all the core components for reference. These also include links to further documentation online.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: '<tutorials>',
    content: 'These are a collection of interactive hypermedia tutorials which will introduce you to both the craft and the culture of HTML and CSS. You can click the (i) to read more about each individual tutorial, or click (play) to launch right into it.',
    options: {
      ok: (e) => e.hide()
    }
  }]
}
