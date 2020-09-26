/* global Widget, WIDGETS, TUTORIAL, STORE, Maths, Averigua, NNE, NNT, NNM */
window.TUTORIAL = {
  onload: () => {
    NNE.addErrorException('{"rule":{"id":"doctype-first","description":"Doctype must be declared first.","link":"https://github.com/thedaviddias/HTMLHint/wiki/doctype-first"},"message":"Doctype must be declared first."}')
    STORE.dispatch('CHANGE_THEME', 'dark')
    STORE.dispatch('CHANGE_LAYOUT', 'welcome')
    window.utils.get('tutorials/orientation/trails.html', (html) => {
      if (Object.keys(TUTORIAL._menusChecked).length === 0) NNE.code = html
    }, true)
  },

  steps: [{
    id: 'getting-started',
    before: () => { TUTORIAL.beforeSectionStart('welcome') },
    content: 'Great! The first thing to note is that my tutorials are non-linear, this means that while the general lessons will be the same for everyone, the details will be different depending on how you respond to me.',
    options: {
      'I noticed!': (e) => e.goTo('pre-widget'),
      'respond to you?': (e) => e.goTo('a-response')
    }
  }, {
    id: 'a-response',
    content: 'A response is when you choose an option in response to something I\'ve said, exactly how you just did when you clicked on <i>respond to you?</i>',
    options: { 'I see': (e) => e.goTo('pre-widget') }
  }, {
    id: 'pre-widget',
    content: 'Throughout the tutorials I\'ll occasionally open up what we call "Widgets", wanna see one?',
    options: { ok: (e) => e.goTo('widget') }
  }, {
    id: 'widget',
    before: () => {
      WIDGETS['example-widget'].open()
      WIDGETS['example-widget'].update({ left: 20, top: 20 }, 500)
    },
    content: 'Widgets are windows which might contain images, videos, or any number of interactive components. You can move them around by clicking and dragging them by their title bars. You can close the Widget by clicking on the <b>✖</b>.',
    options: { cool: (e) => e.goTo('move-netnet') }
  }, {
    id: 'move-netnet',
    before: () => { WIDGETS['example-widget'].close() },
    content: 'You could also grab and move me just like you did with the Widget, try it out!',
    options: { nice: (e) => e.goTo('cyberpunk') }
  }, {
    id: 'cyberpunk',
    before: () => { TUTORIAL.openCyberPunkGifs() },
    content: 'Sometimes I\'m going to open up lots of Widgets, but don\'t get overwhelmed. You don\'t need to close these all yourself, I\'ll usually tidy up the screen before moving on to the next step. Leave the widgets where they are and click a response to see.',
    options: {
      ok: (e) => e.goTo('no-back'),
      'what\'s cyberpunk?': (e) => e.goTo('cyberpunk?')
    }
  }, {
    id: 'cyberpunk?',
    before: () => { TUTORIAL.closeCyberPunkGifs() },
    content: 'Cyberpunk is one of my favorite digital sub-cultures, I\'ll tell you all about it in the next tutorial, but let\'s get our bearings here first.',
    options: { ok: (e) => e.goTo('no-back') }
  }, {
    id: 'no-back',
    before: () => { TUTORIAL.closeCyberPunkGifs() },
    content: 'Now, keep in mind, there\'s no "back" button, so it\'s best not to choose a response until you\'ve finished reading, watching or otherwise interacting with the widgets.',
    options: {
      'got it.': (e) => e.goTo('code-editor'),
      'what if I want to go back?': (e) => e.goTo('how-to-go-back')
    }
  }, {
    id: 'how-to-go-back',
    content: 'I\'ll show you how you can return to previous steps in a tutorial as well as open up certain widgets after they\'ve been closed, but let\'s not get ahead of ourselves, there\'s a couple of other things I want to show you first.',
    options: { ok: (e) => e.goTo('code-editor') }
  }, {
    id: 'code-editor',
    before: () => {
      TUTORIAL.beforeSectionStart('separate-window')
      window.utils.netitorUpdate()
    },
    edit: false,
    content: 'Throughout my tutorials I\'ll also be teaching you how to code by collaboratively writing HTML, CSS and JavaScript together in my editor. The code below is generating the sketch behind me.',
    options: { 'great!': (e) => e.goTo('pre-blank') }
  }, {
    id: 'pre-blank',
    edit: false,
    content: 'I know I know, that\'s a lot of code! ...so let\'s start with a blank canvas.',
    options: { ok: (e) => e.goTo('blank') }
  }, {
    id: 'blank',
    before: () => {
      NNE.code = ''
      NNE.on('code-update', TUTORIAL.waitForEditorUpdate)
    },
    content: 'Go ahead and write a message into my editor!',
    options: { }
  }, {
    id: 'realtime',
    before: () => { NNE.remove('code-update', TUTORIAL.waitForEditorUpdate) },
    content: 'Did you notice how the content in the browser behind me changed? That\'s because my editor updates the browser\'s content in "realtime", so you can experiment and improvise with it.',
    options: { nice: (e) => e.goTo('html-editor') }
  }, {
    id: 'html-editor',
    content: 'Anything you type into my editor is interpreted as <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank">HTML</a> (Hypertext Markup Lnguage) code, which is the defacto language of the World Wide Web (aka the Web), it\'s the language we use to structure the content of web pages and apps.',
    options: { ok: (e) => e.goTo('markup') }
  }, {
    id: 'markup',
    before: () => {
      TUTORIAL.beforeSectionStart('separate-window')
      TUTORIAL.genMarkupCode(1)
      window.utils.netitorUpdate()
    },
    content: 'HTML structures data/content by placing it inside of "elements". Every element has a name, like "article" for example. In <a href="https://en.wikipedia.org/wiki/Markup_language" target="_blank">Markup Languages</a> an element consists of an "opening tag" like <code>&lt;article&gt;</code>, and a "closing tag" like <code>&lt;/article&gt;</code>.',
    options: { ok: (e) => e.goTo('html-tags') }
  }, {
    id: 'html-tags',
    before: () => {
      WIDGETS['html-diagram1'].open()
      WIDGETS['html-diagram1'].update({ right: 40, bottom: 40 }, 500)
    },
    content: 'Both the opening and closing tags are identifiable by the <code>&lt;</code> and <code>&gt;</code>brackets. The closing tag differentiates itself by including a backslash <code>&lt;/</code> before the element\'s name. You\'ll come to learn this "syntax" is common on the Web (aka Cyberspace). I\'ll leave this widget open for a bit (feel free to close it yourself if you\'d like)',
    options: { ok: (e) => e.goTo('html-tags2') }
  }, {
    id: 'html-tags2',
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
      TUTORIAL.genMarkupCode(2)
    },
    content: 'We also build structure by placing elements within other elements. There are loads of HTML elements. You can even create your own! I\'ve added some examples in my editor. Double click the tag names with your mouse if you want me to tell you more about them. Feel free to edit/remix the code too, don\'t worry about messing anything up, I\'ll warn you if you make a mistake.',
    options: {
      'ok, what\'s next?': (e) => e.goTo('html-attr'),
      'how can I make my own elements?': (e) => e.goTo('custom-elements')
    }
  }, {
    id: 'custom-elements',
    content: 'HTML tags are created by the <a href="https://www.w3.org/" target="_blank">W3C</a> which is a "standards organization" which anyone can join (there are <a href="https://www.w3.org/Consortium/Member/List" target="_blank">400 member groups</a> in total) which design and define how the Web (aka the People\'s Platform) should work, including which HTML elements should exist. But you don\'t have to wait for the W3C\'s approval, you can actually create your own <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements" target="_blank">custom element</a> with JavaScript, but we\'ll save that for a more advanced tutorial.',
    options: { 'fair enough': (e) => e.goTo('html-attr') }
  }, {
    id: 'html-attr',
    before: () => {
      TUTORIAL.genMarkupCode(3)
      WIDGETS['html-diagram2'].open()
      WIDGETS['html-diagram2'].update({ right: 80, bottom: 80 }, 500)
    },
    content: 'Elements can also include optional "attributes", which are special keywords you can use to change the details of a particular element. You place them within the opening tag itself and usually assign specific values to them by writing the value in quotes after an equal sign that follows directly after the attribute name. Like the element names, you can double click the attributes if you want me to tell you more about any in particular.',
    options: { ok: (e) => e.goTo('html-attr2') }
  }, {
    id: 'html-attr2',
    before: () => {
      TUTORIAL.genMarkupCode(4)
      STORE.subscribe('widgets', TUTORIAL.waitForColorWig)
    },
    content: 'In some cases I\'ve got interactive widgets to help you edit and generate code, double click on body\'s background-color "hex" value <code>82ccd7</code> and I\'ll tell you more about it. Then open the <b>Color Widget</b>.',
    options: {}
  }, {
    id: 'done-with-color',
    before: () => {
      STORE.unsubscribe('widgets', TUTORIAL.waitForColorWig)
      if (WIDGETS['html-diagram1'].opened) WIDGETS['html-diagram1'].close()
      if (WIDGETS['html-diagram2'].opened) WIDGETS['html-diagram2'].close()
    },
    content: 'Let me know when you\'re done experimenting with the Color Widget and we\'ll move on.',
    options: { 'ok, I\'m done': (e) => e.goTo('future-tuts') }
  }, {
    id: 'future-tuts',
    before: () => { WIDGETS['color-widget'].close() },
    content: 'My creators at netizen.org are working hard on proper "Internet Art Tutorials" which will not only cover HTML, CSS and JavaScript in more depth but also demonstrate how <a href="https://en.wikipedia.org/wiki/Internet_art" target="_blank">net artists</a> have used this code to make art on the Web (aka the Gallery for the Global Village).',
    options: { 'exciting! when can I start?': (e) => e.goTo('future-tuts2') }
  }, {
    id: 'future-tuts2',
    content: 'Very exciting! There are a couple of "beta" tutorials for you to try out already. If you\'re ascii is getting antsy I can take you straight to those tutorials now, or I could show you how to navigate around the studio a bit first?',
    options: {
      'show me more of the studio first': (e) => e.goTo('finish-here'),
      'let\'s check out those tutorials now': (e) => e.goTo('leave-tutorial')
    }
  }, {
    id: 'leave-tutorial',
    before: () => { STORE.subscribe('widgets', TUTORIAL.waitForPreTutMenu) },
    content: 'Ok, click on my face to open the main menu and then to open the Tutorial\'s Menu click <img src="images/menu/tutorials.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; position: relative; top: 10px;">',
    options: {}
  }, {
    id: 'leave-tutorial2',
    before: () => { STORE.unsubscribe('widgets', TUTORIAL.waitForPreTutMenu) },
    content: 'Because we\'re currently in the middle of a Tutorial, this menu display\'s the lesson\'s metadata, you can also switch to the "sections" tab which will let you navigate to past and future steps in this tutorial. At the bottom of the Information tab you\'ll find a button for "quitting" the tutorial, when you <b>click quit</b> you\'ll be able to choose another tutorial.',
    options: {
      'If I quit, will I be able to get back?': (e) => e.goTo('get-back'),
      'Never mind, let\'s finish here first': (e) => e.goTo('finish-here')
    }
  }, {
    id: 'get-back',
    content: 'Sure, you can open up the tutorials menu and switch over at any point, just click on my face again to get to the main menu.',
    options: {
      'Never mind, let\'s finish here first': (e) => e.goTo('finish-here')
    }
  }, {
    id: 'finish-here',
    before: () => { WIDGETS['tutorials-menu'].close() },
    content: 'Great! I\'ve got a few more tricks in my source code, changing my appearance for example! wanna try a new look?',
    options: {
      'something light': (e) => e.goTo('light-theme'),
      'something classic': (e) => e.goTo('monokai-theme'),
      'I like this look': (e) => e.goTo('same-theme')
    }
  }, {
    id: 'light-theme',
    before: () => {
      TUTORIAL._themePicked = 'light'
      STORE.dispatch('CHANGE_THEME', 'light')
      TUTORIAL.setupMenuListeners()
    },
    content: 'nice choice! minimal, bright, clean. This is one of my favorite outfits. You can use my main menu to change my settings, load tutorials and open widgets. Just click on my face!',
    options: {}
  }, {
    id: 'monokai-theme',
    before: () => {
      TUTORIAL._themePicked = 'monokai'
      STORE.dispatch('CHANGE_THEME', 'monokai')
      TUTORIAL.setupMenuListeners()
    },
    content: 'solid choice! I wear this outfit when I go to hack-a-thons. You can use my main menu to change my settings, load tutorials and open widgets. Just click on my face!',
    options: {}
  }, {
    id: 'same-theme',
    before: () => {
      TUTORIAL.setupMenuListeners()
    },
    content: 'Me too! But, if you even change your mind you can use my main menu to change my settings, load tutorials and open widgets. Just click on my face!',
    options: {}
  }, {
    id: 'pre-func-menu',
    before: () => {
      TUTORIAL.beforeSectionStart('dock-bottom')
      TUTORIAL.genMarkupCode(5)
      TUTORIAL._menusChecked.func = false
      TUTORIAL.setupMenuListeners()
    },
    content: 'To launch the <b>Functions Menu</b> just click on my face and then click on the <img src="images/menu/functions.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; position: relative; top: 10px;">',
    options: {}
  }, {
    id: 'func-menu',
    before: () => {
      TUTORIAL._menusChecked.func = true
      STORE.unsubscribe('widgets', TUTORIAL.waitForFuncMenu)
    },
    content: 'This menu has all sorts of "Functions" which can be used to edit settings and save projects. Want me to explain a particular set?',
    options: {
      'hi netnet?': (e) => e.goTo('hi-netnet'),
      'my project?': (e) => e.goTo('my-project'),
      'editor settings?': (e) => e.goTo('editor-settings'),
      'reset options?': (e) => e.goTo('reset-options'),
      'no thanks, I get it': (e) => {
        WIDGETS['functions-menu'].close()
        if (TUTORIAL.allMenusChecked()) e.goTo('finished-menus')
        else e.goTo('another-menu')
      }
    }
  }, {
    id: 'func-menu2',
    content: 'Want me to explain any other particular set of Functions?',
    options: {
      'hi netnet?': (e) => e.goTo('hi-netnet'),
      'my project?': (e) => e.goTo('my-project'),
      'editor settings?': (e) => e.goTo('editor-settings'),
      'reset options?': (e) => e.goTo('reset-options'),
      'no thanks, I get it': (e) => {
        WIDGETS['functions-menu'].close()
        if (TUTORIAL.allMenusChecked()) e.goTo('finished-menus')
        else e.goTo('another-menu')
      }
    }
  }, {
    id: 'hi-netnet',
    before: () => {
      if (!WIDGETS['functions-menu'].opened) WIDGETS['functions-menu'].open()
    },
    content: 'If you ever want to restart things from the beginning, press "hi netnet" and I\'ll pretend you just got here (let\'s not press that now though, I\'ve got a couple more things to show you).',
    options: { ok: (e) => e.goTo('func-menu2') }
  }, {
    id: 'my-project',
    before: () => {
      if (!WIDGETS['functions-menu'].opened) WIDGETS['functions-menu'].open()
      TUTORIAL.openSubMenu('func-menu-my-project')
    },
    content: 'Here you\'ll find different ways to save and share the work you make in this cyberstudio.',
    options: {
      'tell, me more': (e) => e.goTo('my-project2'),
      'ok, I get it': (e) => e.goTo('func-menu2')
    }
  }, {
    id: 'my-project2',
    before: () => {
      if (!WIDGETS['functions-menu'].opened) WIDGETS['functions-menu'].open()
      TUTORIAL.openSubMenu('func-menu-my-project')
    },
    content: 'Which function would you like me to explain?',
    options: {
      'shareLink?': (e) => e.goTo('shareLink'),
      'downloadCode?': (e) => e.goTo('downloadCode'),
      'uploadCode?': (e) => e.goTo('uploadCode'),
      'saveProject?': (e) => {
        if (!window.localStorage.getItem('owner')) e.goTo('saveProject')
        else e.goTo('saveProject-authed')
      },
      'newProject?': (e) => e.goTo('newProject'),
      'ok, I get it': (e) => e.goTo('func-menu2')
    }
  }, {
    id: 'shareLink',
    content: 'When you run this function I\'ll update the browser\'s URL so that it contains a compressed version of the code in my editor, it\'s a way of "encoding" your sketch into a single string of text you can share or save anywhere.',
    options: { ok: (e) => e.goTo('my-project2') }
  }, {
    id: 'downloadCode',
    content: 'I\'m not gonna horde our collaborations. If you run this function I\'ll download a copy of the code so you can do whatever you want with it, like run it in other browsers or edit it in other code editors.',
    options: { ok: (e) => e.goTo('my-project2') }
  }, {
    id: 'uploadCode',
    content: 'I\'d love to see what you\'re working on! If you\'ve got an HTML file you want to show me you can run this function to load it up into my editor.',
    options: { ok: (e) => e.goTo('my-project2') }
  }, {
    id: 'saveProject-authed',
    content: 'Now that I\'m connected to your GitHub, you can use run <code>saveProject()</code> to save anything you make here onto your GitHub while <code>openProject()</code> can be used to open a project from your GitHub.',
    options: { ok: (e) => e.goTo('my-project2') }
  }, {
    id: 'saveProject',
    content: '<code>saveProject()</code> can be used to save anything you make here onto your GitHub while <code>openProject()</code> can be used to open a project from your GitHub. But you\'ll need to connect your GitHub account before you can use these functions.',
    options: {
      'how\'s that work?': (e) => {
        const f = {
          tutorial: 'orientation',
          id: 'post-auth-func-menu',
          status: TUTORIAL._menusChecked
        }
        TUTORIAL._toGHfrom = JSON.stringify(f)
        e.goTo('github')
      },
      'ok, I\'ll do that later': (e) => e.goTo('my-project2')
    }
  }, {
    id: 'newProject',
    content: 'If at any point you need a blank canvas, simply run this function.',
    options: { ok: (e) => e.goTo('my-project2') }
  }, {
    id: 'editor-settings',
    before: () => {
      if (!WIDGETS['functions-menu'].opened) WIDGETS['functions-menu'].open()
      TUTORIAL.openSubMenu('func-menu-editor-settings')
    },
    content: 'Here you\'ll find the function I use to change my "theme", as well as other details. Want me to explain any of these?',
    options: {
      'tell, me more': (e) => e.goTo('editor-settings2'),
      'ok, I get it': (e) => e.goTo('func-menu2')
    }
  }, {
    id: 'editor-settings2',
    before: () => {
      if (!WIDGETS['functions-menu'].opened) WIDGETS['functions-menu'].open()
      TUTORIAL.openSubMenu('func-menu-editor-settings')
    },
    content: 'Which function would you like me to explain?',
    options: {
      'tidyCode?': (e) => e.goTo('tidyCode'),
      'runUpdate?': (e) => e.goTo('runUpdate'),
      'autoUpdate?': (e) => e.goTo('autoUpdate'),
      'changeLayout?': (e) => e.goTo('changeLayout'),
      'changeOpacity?': (e) => e.goTo('changeOpacity'),
      'ok, I get it': (e) => e.goTo('func-menu2')
    }
  }, {
    id: 'tidyCode',
    content: 'With a few exceptions, most coding languages don\'t care how you space out your code, but there are some conventions for how HTML, CSS and JavaScript code should spaced and indented. This is the function I use to clean up your code when the indentation and spacing gets too messy.',
    options: { ok: (e) => e.goTo('editor-settings2') }
  }, {
    id: 'runUpdate',
    content: `When <code>autoUpdate</code> is set to <code>false</code> then you can run this function to update the browser behind me with the code in my editor (you could also use the ${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+S shortcut key)`,
    options: { ok: (e) => e.goTo('editor-settings2') }
  }, {
    id: 'autoUpdate',
    content: `When <code>autoUpdate</code> is set to <code>true</code> then I'll update the browser behind me in "realtime", soon as I noticed you changed code in my editor (assuming I don't notice any bugs of course). When set to <code>false</code> you'll need to update manually via <code>runUpdate</code> (or ${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+S).`,
    options: { ok: (e) => e.goTo('editor-settings2') }
  }, {
    id: 'changeLayout',
    content: 'I\'ve got a few different layout modes I like to switch between, feel free to switch between them yourself.',
    options: { ok: (e) => e.goTo('editor-settings2') }
  }, {
    id: 'changeOpacity',
    content: 'Sometimes when I\'m working on some experimental graphics I like to switch to the light theme, change my layout to full-screen and lower the opacity a bit. Perfect for performing realtime visuals at an <a href="https://en.wikipedia.org/wiki/Algorave" target="_blank">algorave</a>.',
    options: {
      ok: (e) => e.goTo('editor-settings2'),
      'algorave? show me!': (e) => e.goTo('algorave')
    }
  }, {
    id: 'algorave',
    before: () => {
      window.utils.get('tutorials/orientation/algorave.html', (html) => {
        NNE.code = html
      }, true)
      WIDGETS['functions-menu'].close()
      STORE.dispatch('CHANGE_THEME', 'light')
      STORE.dispatch('CHANGE_OPACITY', 0.4)
      STORE.dispatch('CHANGE_LAYOUT', 'full-screen')
    },
    content: 'Sure, here\'s something I was working on last week, what do you think? As always, feel free to remix it, I love collaborating. Try chaning some of the number values for example. Let me know when you\'re done experimenting and we\'ll move on.',
    options: {
      'ok I\'m done': (e) => {
        STORE.dispatch('CHANGE_THEME', TUTORIAL._themePicked)
        STORE.dispatch('CHANGE_OPACITY', 1)
        STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
        TUTORIAL.genMarkupCode(5)
        e.goTo('editor-settings2')
      }
    }
  }, {
    id: 'reset-options',
    before: () => {
      if (!WIDGETS['functions-menu'].opened) WIDGETS['functions-menu'].open()
      TUTORIAL.openSubMenu('func-menu-reset-options')
    },
    content: 'Dang, I was hoping you wouldn\'t ask about that one. This section has a few functions that erase portions of my memory. My creators at netizen.org believe in "user agency" and felt you should be able to clear any and all data.',
    options: {
      'you\'re recording my data?': (e) => e.goTo('rec-data'),
      'tell, me more': (e) => e.goTo('reset-options2'),
      'ok, I get it': (e) => e.goTo('func-menu2')
    }
  }, {
    id: 'rec-data',
    content: 'We don\'t store anything beyond basic server logs (and I mean real basic, we don\'t use google analytics or any other surveillance capitalist spyware). But I don\'t want to forget who you are, so I store my AI memory inside your personal browser\'s localStorage so only you and I can access it.',
    options: { 'I see': (e) => e.goTo('reset-options2') }
  }, {
    id: 'reset-options2',
    before: () => {
      if (!WIDGETS['functions-menu'].opened) WIDGETS['functions-menu'].open()
      TUTORIAL.openSubMenu('func-menu-reset-options')
    },
    content: 'Which function would you like me to explain?',
    options: {
      'resetErrors?': (e) => e.goTo('resetErrors'),
      'refresh?': (e) => e.goTo('refresh'),
      'reboot?': (e) => e.goTo('reboot'),
      'ok, I get it': (e) => e.goTo('func-menu2')
    }
  }, {
    id: 'resetErrors',
    content: 'I\'m a pretty picky coder, if I notice you making any mistakes or even bad technique I\'m going to correct you, but if there are particular things you want me to stop <i>bugging</i> you about I\'ll remember to do so... unless you run this function.',
    options: { ok: (e) => e.goTo('reset-options2') }
  }, {
    id: 'refresh',
    content: 'This will run a basic browser refresh, which will disorient me, I\'ll loose my short term memory and think you just got here.',
    options: { ok: (e) => e.goTo('reset-options2') }
  }, {
    id: 'reboot',
    content: 'This is a FULL reboot, this will wipe my entire memory... gone... forever.',
    options: { ok: (e) => e.goTo('reset-options2') }
  }, {
    id: 'pre-wig-menu',
    before: () => {
      TUTORIAL.beforeSectionStart('dock-bottom')
      TUTORIAL.genMarkupCode(5)
      TUTORIAL._menusChecked.wig = false
      TUTORIAL.setupMenuListeners()
    },
    content: 'To launch the <b>Widgets Menu</b> just click on my face and then click on the <img src="images/menu/widget.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; position: relative; top: 10px;">',
    options: {}
  }, {
    id: 'wig-menu',
    before: () => {
      TUTORIAL._menusChecked.wig = true
      STORE.unsubscribe('widgets', TUTORIAL.waitForWigMenu)
    },
    content: 'This is where I keep any widgets I think you might want to reuse. These will change a bit depending on which tutorial you\'re on, but you can "star" most of these widgets when you have them open if you\'d prefer I always keep them in this menu.',
    options: { ok: (e) => e.goTo('wig-menu2') }
  }, {
    id: 'wig-menu2',
    content: 'You\'ll notice that the <b>Color Widget</b> from earlier in the tutorial can be found here, as well as a couple of others, like <b>Saved Projects</b> and <b>Upload Assets</b> ',
    options: {
      ok: (e) => {
        if (!window.localStorage.getItem('owner')) e.goTo('wig-menu3')
        else e.goTo('wig-menu3-authed')
      }
    }
  }, {
    id: 'wig-menu3-authed',
    content: 'Now that I\'m connected to your GitHub, I\'m able to list all of your projects in the <b>Saved Projects</b> widget, and if you open a project I\'ll be able to display that project\'s assets in the <b>Upload Assets</b> widget.',
    options: {
      ok: (e) => {
        WIDGETS['widgets-menu'].close()
        if (TUTORIAL.allMenusChecked()) e.goTo('finished-menus')
        else e.goTo('another-menu')
      },
      'assets?': (e) => e.goTo('assets')
    }
  }, {
    id: 'wig-menu3',
    content: '<b>Upload Assets</b> is where I\'ll put any files you upload to your project for the purpose of including it in your HTML sketch. <b>Saved Projects</b> is like a sketchbook where I\'ll keep all your saved projects. But you\'ll need to connect your GitHub account before using these widgets.',
    options: {
      'how\'s that work?': (e) => {
        const f = {
          tutorial: 'orientation',
          id: 'post-auth-wig-menu',
          status: TUTORIAL._menusChecked
        }
        TUTORIAL._toGHfrom = JSON.stringify(f)
        e.goTo('github')
      },
      'ok, I\'ll do that later': (e) => {
        WIDGETS['widgets-menu'].close()
        if (TUTORIAL.allMenusChecked()) e.goTo('finished-menus')
        else e.goTo('another-menu')
      }
    }
  }, {
    id: 'assets',
    content: 'HTML is a "metamedia" file format, you can include images, videos, 3D files, etc. These other media files which make up parts of your web project are generally referred to as "assets" in this context.',
    options: {
      ok: (e) => {
        if (!window.localStorage.getItem('owner')) e.goTo('wig-menu3')
        else e.goTo('wig-menu3-authed')
      }
    }
  }, {
    id: 'pre-tut-menu',
    before: () => {
      TUTORIAL.beforeSectionStart('dock-bottom')
      TUTORIAL.genMarkupCode(5)
      TUTORIAL._menusChecked.tut = false
      TUTORIAL.setupMenuListeners()
    },
    content: 'To launch the <b>Tutorials Menu</b> just click on my face and then click on the <img src="images/menu/tutorials.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; position: relative; top: 10px;">',
    options: {}
  }, {
    id: 'tut-menu',
    before: () => {
      TUTORIAL._menusChecked.tut = true
      STORE.unsubscribe('widgets', TUTORIAL.waitForTutMenu)
    },
    content: 'Because we\'re currently in the middle of a Tutorial, this menu display\'s the lesson\'s metadata, you can also switch to the "sections" tab which will let you navigate to past and future steps in this tutorial. At the bottom of the Information tab you\'ll find a button for restarting and quitting the tutorial. When you quit the tutorial this menu will instead display the list of all available tutorials.',
    options: {
      ok: (e) => {
        WIDGETS['tutorials-menu'].close()
        if (TUTORIAL.allMenusChecked()) e.goTo('finished-menus')
        else e.goTo('another-menu')
      }
    }
  }, {
    id: 'pre-search-bar',
    before: () => {
      TUTORIAL.beforeSectionStart('dock-bottom')
      TUTORIAL.genMarkupCode(5)
      TUTORIAL._menusChecked.search = false
      TUTORIAL.setupMenuListeners()
    },
    content: 'My search algorithms are still being polished, but feel free to take them for a test drive. To launch a universal "fuzzy search" that searches everything in the studio just click on my face and then click on the <img src="images/menu/search.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; position: relative; top: 10px;">',
    options: {}
  }, {
    id: 'search-bar',
    content: 'This is the universal "fuzzy search" that searches everything in the studio. My search algorithms are still being polished, but feel free to take them for a test drive.',
    options: {
      ok: (e) => {
        if (TUTORIAL.allMenusChecked()) e.goTo('finished-menus')
        else e.goTo('another-menu')
      }
    }
  }, {
    id: 'github',
    content: 'These days, most developers save their work on their personal GitHub profiles. We figured we\'d help you start establishing your coder cred and save any of our collaborations on your GitHub account for you. So you\'ll first need to create a GitHub account and then let GitHub know you\'ve given me permission to collaborate with you.',
    options: {
      'cool! let\'s do it': (e) => e.goTo('conf-github'),
      'GitHub?': (e) => e.goTo('ex-github'),
      'do I have to?': (e) => e.goTo('skip-github')
    }
  }, {
    id: 'ex-github',
    content: '<a href="https://github.com/" target="_blank">GitHub</a> is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio". Want to get that setup?',
    options: {
      'ok! let\'s do it': (e) => e.goTo('conf-github'),
      'do I have to?': (e) => e.goTo('skip-github')
    }
  }, {
    id: 'skip-github',
    content: 'Nope, you can learn and experiment in the studio without ever saving anything you make. But just remember that if/when you want to save something you\'ve worked on, you\'ll need to set this up then.',
    options: {
      'ok, I\'ll just do it now': (e) => e.goTo('conf-github'),
      'that\'s fine, I\'ll do it later': (e) => e.goTo('conf-skip-github')
    }
  }, {
    id: 'conf-github',
    content: 'Great, I\'ll send you over to GitHub so you can get that all sorted out and when you\'re done GitHub will send you back over here and we\'ll pick up where we left off.',
    options: {
      'ok bye!': (e) => {
        WIDGETS['functions-menu']._githubAuth(TUTORIAL._toGHfrom)
      }
    }
  }, {
    id: 'conf-skip-github',
    content: 'No problem, you can come back to the the <code>saveProject()</code> function in the Functions Menu or the <b>Saved Projects</b> widget  in the Widgets Menu later at any point.',
    options: {
      'what\'s that?': (e) => {
        const o = JSON.parse(TUTORIAL._toGHfrom)
        if (o.id.includes('func-menu')) e.goTo('func-menu2')
        else e.goTo('wig-menu2')
      }
    }
  }, {
    id: 'post-auth-func-menu',
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
      TUTORIAL._menusChecked = window._tempAuthFrom
      WIDGETS['functions-menu'].open()
      TUTORIAL.setupMenuListeners()
      NNE.code = NNE._decode(window.utils.savedCode())
    },
    content: `Welcome back! ${window.localStorage.getItem('username')} or should I say <i>${window.localStorage.getItem('owner')}</i>, now that I know your GitHub account you can use the <code>saveProject()</code> and <code>openProject()</code> functions in the Functions Menu (keep in mind, I'm still in <i>beta</i> so there may be bugs)`,
    options: { cool: (e) => e.goTo('func-menu2') }
  }, {
    id: 'post-auth-wig-menu',
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
      TUTORIAL._menusChecked = window._tempAuthFrom
      WIDGETS['widgets-menu'].open()
      TUTORIAL.setupMenuListeners()
      NNE.code = NNE._decode(window.utils.savedCode())
    },
    content: `Welcome back! ${window.localStorage.getItem('username')} or should I say <i>${window.localStorage.getItem('owner')}</i>, now that I know your GitHub account you can use the <b>Saved Projects</b> and <b>Upload Assets</b> widgets in the Widgets Menu (keep in mind, I'm still in <i>beta</i> so there may be bugs)`,
    options: {
      cool: (e) => {
        if (TUTORIAL.allMenusChecked()) e.goTo('finished-menus')
        else e.goTo('another-menu')
      }
    }
  }, {
    id: 'another-menu',
    content: 'Ok, click on my face and choose a different menu item this time.',
    options: {}
  }, {
    id: 'finished-menus',
    content: 'So that\'s pretty much it! The folks at netizen.org are actively working on fleshing out this studio, adding more widgets and creating more tutorials, which is really what this is all about. I\'ve been programmed to teach you how to navigate and get creative with the Web (aka The Information Super Highway aka The Creative Coders Contemporary Canvas)',
    options: { ok: (e) => e.goTo('finished-menus2') }
  }, {
    id: 'finished-menus2',
    content: 'If you\'d like, we can jump right into our first tutorial? Keep in mind I\'m still very much in beta so send any/all feedback to my creators via email to hi@netizen.org',
    options: {
      'let\'s do it!': (e) => NNT.load('virtual-reality'),
      'no thanks': (e) => {
        e.end()
        window.greetings.mainMenu()
      }
    }
  }],

  widgets: {
    'example-widget': new Widget({
      width: window.innerWidth * 0.25,
      listed: false,
      title: 'This is a Widget!',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/internet.gif"><p>This is an example of a Widget</p>'
    }),
    'cyberpunk-1': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/1.gif">'
    }),
    'cyberpunk-2': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/2.gif">'
    }),
    'cyberpunk-3': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/3.gif">'
    }),
    'cyberpunk-4': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/4.gif">'
    }),
    'cyberpunk-5': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/5.gif">'
    }),
    'cyberpunk-6': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/6.gif">'
    }),
    'cyberpunk-7': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/7.gif">'
    }),
    'cyberpunk-8': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/8.gif">'
    }),
    'cyberpunk-9': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/9.gif">'
    }),
    'cyberpunk-10': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/10.gif">'
    }),
    'cyberpunk-11': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/11.gif">'
    }),
    'cyberpunk-12': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/12.gif">'
    }),
    'cyberpunk-13': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/13.gif">'
    }),
    'cyberpunk-14': new Widget({
      width: 250,
      listed: false,
      title: 'Cyberpunk Gif',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/cyberpunk/14.gif">'
    }),
    'html-diagram1': new Widget({
      width: window.innerWidth * 0.5,
      listed: false,
      title: 'Anatomy of an HTML Element',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/html1.png">'
    }),
    'html-diagram2': new Widget({
      width: window.innerWidth * 0.5,
      listed: false,
      title: 'Anatomy of an HTML Element',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/orientation/images/html2.png">'
    })
  },

  beforeSectionStart: (layout) => {
    Object.keys(TUTORIAL.widgets)
      .filter(w => w.indexOf('cyber') === 0)
      .forEach(w => WIDGETS[w].close())
    STORE.dispatch('CHANGE_LAYOUT', layout)
  },

  waitForColorWig: () => {
    if (WIDGETS['color-widget'].opened) {
      NNT.goTo('done-with-color')
    }
  },

  waitForEditorUpdate: () => {
    NNT.goTo('realtime')
  },

  waitForPreTutMenu: () => {
    if (WIDGETS['tutorials-menu'].opened) {
      NNT.goTo('leave-tutorial2')
    }
  },

  waitForFuncMenu: () => {
    if (WIDGETS['functions-menu'].opened) {
      NNT.goTo('func-menu')
    }
  },

  waitForWigMenu: () => {
    if (WIDGETS['widgets-menu'].opened) {
      NNT.goTo('wig-menu')
    }
  },

  waitForTutMenu: () => {
    if (WIDGETS['tutorials-menu'].opened) {
      NNT.goTo('tut-menu')
    }
  },

  setupMenuListeners: () => {
    const ch = TUTORIAL._menusChecked
    STORE.unsubscribe('widgets', TUTORIAL.waitForFuncMenu)
    STORE.unsubscribe('widgets', TUTORIAL.waitForWigMenu)
    STORE.unsubscribe('widgets', TUTORIAL.waitForTutMenu)
    if (!ch.func) STORE.subscribe('widgets', TUTORIAL.waitForFuncMenu)
    if (!ch.wig) STORE.subscribe('widgets', TUTORIAL.waitForWigMenu)
    if (!ch.tut) STORE.subscribe('widgets', TUTORIAL.waitForTutMenu)
    if (!ch.search) {
      NNM.search.onopen = () => {
        TUTORIAL._menusChecked.search = true
        NNM.search.onopen = null
        NNT.goTo('search-bar')
      }
    }
  },

  _menusChecked: {},

  allMenusChecked: () => {
    return TUTORIAL._menusChecked.func &&
      TUTORIAL._menusChecked.wig &&
      TUTORIAL._menusChecked.tut &&
      TUTORIAL._menusChecked.search
  },

  starterText: null,
  genCodeInit4: null,
  genMarkupCode: (n) => {
    let txt
    if (!TUTORIAL.starterText) {
      const d = document.createElement('div')
      d.innerHTML = NNE.code
      txt = d.textContent !== '' && !d.textContent.includes('@keyframes')
        ? d.textContent : 'Hello Internet!'
      TUTORIAL.starterText = txt
    } else { txt = TUTORIAL.starterText }

    if (n === 0) {
      const de = document.documentElement
      const clr = window.getComputedStyle(de).getPropertyValue('--netizen-tag')
      NNE.code = `<body style="background-color: ${clr}"></body>`
    } else if (n === 1) {
      NNE.code = `<body>${txt}</body>`
    } else if (n === 2) {
      NNE.code = NNE.code = `<!DOCTYPE html>
<body>
  <h1>${txt}</h1>
  <p>
    A work by ${window.localStorage.getItem('username')}
  </p>
</body>`
    } else if (n === 3) {
      NNE.code = `<!DOCTYPE html>
<body title="art">
  <h1>${txt}</h1>
  <p>
    A work by ${window.localStorage.getItem('username')}, the great
    <a href="https://en.wikipedia.org/wiki/Internet_art" target="_blank">Internet artist</a>
  </p>
</body>`
    } else if (n === 4) {
      TUTORIAL.genCodeInit4 = NNE.code = `<!DOCTYPE html>
<body title="art" style="background-color: #82ccd7;">
  <h1>${txt}</h1>
  <p>
    A work by ${window.localStorage.getItem('username')}, the great
    <a href="https://en.wikipedia.org/wiki/Internet_art" target="_blank">Internet artist</a>
  </p>
</body>`
    } else if (n === 5) {
      NNE.code = TUTORIAL.genCodeInit4 || `<!DOCTYPE html>
<body title="art" style="background-color: #82ccd7;">
  <h1>Hello Internet!</h1>
  <p>
    A work by ${window.localStorage.getItem('username')}, the great
    <a href="https://en.wikipedia.org/wiki/Internet_art" target="_blank">Internet artist</a>
  </p>
</body>`
    }
  },

  openSubMenu: (id) => {
    const ids = [
      'func-menu-my-project',
      'func-menu-editor-settings',
      'func-menu-reset-options'
    ]
    ids.forEach(i => WIDGETS['functions-menu'].toggleSubMenu(i, 'close'))
    WIDGETS['functions-menu'].toggleSubMenu(id)
  },

  genStyleCode: () => {
    const t = TUTORIAL.starterText || 'Hello Internet!'
    return `<h1 style="color: #ff00cc;">${t}</h1>`
  },

  openCyberPunkGifs: () => {
    for (let i = 1; i < 15; i++) {
      const w = WIDGETS[`cyberpunk-${i}`]
      w.open()
      setTimeout(() => {
        const spot = {}
        if (Math.random() > 0.5) {
          spot.left = Math.random() * window.innerWidth - w.width
        } else {
          spot.right = Math.random() * (window.innerWidth - w.width)
        }
        if (Math.random() > 0.5) {
          spot.top = Math.random() * window.innerHeight - w.height
        } else {
          spot.bottom = Math.random() * (window.innerHeight - w.height)
        }
        if (Math.random() > 0.25) {
          spot.width = Maths.randomInt(250, 400)
        }
        w.update(spot, 500)
      }, 250)
    }
  },

  closeCyberPunkGifs: () => {
    for (let i = 1; i < 15; i++) WIDGETS[`cyberpunk-${i}`].close()
  },

  _themePicked: 'dark'
}
