/* global WIDGETS utils */
window.CONVOS['learning-guide'] = (self) => {
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
    content: 'The <b>Hyperlinks</b> section is a the Learning Guie\'s <i>table of Contents</i>. Click on any item to jump to it, you can also scroll through the guide to explore each section.',
    options: {
      'thanks!': (e) => e.hide(),
      'how does this work?': (e) => e.goTo('explain')
    }
  }, {
    id: 'explain',
    content: 'Scroll through the Learning Guide to find interactive tutorials, examples and references. If you\'d like to jump straight to coding your own sketch just click on my face and say <img src="images/menu/hi.png" class="learning-guide__d-icons"> anytime. You can also click on the <img src="images/menu/code.png" class="learning-guide__d-icons"> <b>Coding Menu</b>, or the <img src="images/menu/tutorials.png" class="learning-guide__d-icons"> <b>Learning Guide</b> or the <img src="images/menu/search.png" class="learning-guide__d-icons"> <b>Search Bar</b>.',
    options: menuOpts()
  }, {
    id: 'nfo-lg',
    content: `The <img src="images/menu/tutorials.png" class="learning-guide__d-icons"> <b>Learning Guide</b> widget contains interactive tutorials, code demos, templates and references. You can also open the Learning Guide using the <code>${utils.hotKey()} + L</code> key.`,
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
  }, {
    id: 'js-intro',
    content: 'If you\'d like to read through a written guide, I can open the JavaScript Reference Guide for you, but I think the best way to learn the basics of JavaScript is with an example project. I suggest you jump right into the 10print Template, want me to guide you through it?',
    options: {
      'Ok, let\'s try it!': (e) => {
        e.hide()
        WIDGETS.load('template-projects', w => w.startGuide('js-10print'))
      },
      'I want to read the docs': (e) => {
        e.hide()
        WIDGETS.open('js-reference')
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'coming-soon',
    content: '<b>This is Under Construction!</b> If you\'d like to help get this done, consider <a href="/docs" target="_blank">supporting us</a>! I\'m constantly evolving and always seeking financial support from individuals and institutions who benefit from open access to this platform and who support our mission!',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'coming-soon-units',
    content: 'My creators are still working on those docs, but in the meantime you can check out MDN\'s <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units" target="_blank">CSS values and units</a> page for more info on that topic.',
    options: {
      ok: (e) => e.hide()
    }
  }]
}
