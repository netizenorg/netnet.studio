/* global Widget, WIDGETS, TUTORIAL, STORE, Maths, Averigua, NNE, NNT */
window.TUTORIAL = {
  onload: () => { window.greetings.injectStarterCode() },

  steps: [{
    id: 'getting-started',
    content: 'Great! The first thing to note is that my tutorials are non-linear, this means that while the general lessons will be the same for everyone, the details will be different depending on how you respond to me?',
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
    content: 'Widgets are windows which might contain, images, videos or any number of interactive components. You can move them around by clicking and dragging them by their title bars. You can close the Widget by clicking on the <b>✖</b>.',
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
      STORE.dispatch('CHANGE_LAYOUT', 'separate-window')
    },
    content: 'Throughout my tutorials I\'ll also be teaching you how to code by collaboratively writing HTML, CSS and JavaScript together in my editor. The code below is generating the gradient behind me.',
    options: { 'great!': (e) => e.goTo('pre-blank') }
  }, {
    id: 'pre-blank',
    content: 'There\'s a lot of code to talk about there, so let\'s start with a blank canvas.',
    options: { ok: (e) => e.goTo('blank') }
  }, {
    id: 'blank',
    before: () => {
      NNE.addErrorException('{"rule":{"id":"doctype-first","description":"Doctype must be declared first.","link":"https://github.com/thedaviddias/HTMLHint/wiki/doctype-first"},"message":"Doctype must be declared first."}')
      NNE.code = ''
    },
    content: 'Go ahead and write a message into my editor!',
    options: { ok: (e) => e.goTo('realtime') }
  }, {
    id: 'realtime',
    content: 'Did you notice how the content in the browser behind me changed? That\'s because my editor updates the browser\'s content in "realtime", so you can experiment and improvise with it.',
    options: { nice: (e) => e.goTo('html-editor') }
  }, {
    id: 'html-editor',
    content: 'Anything you type into my editor is interpreted as <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank">HTML</a> code, which is the defacto language of the World Wide Web (aka the Web), it\'s the language we use to structure the content of web pages and apps.',
    options: { ok: (e) => e.goTo('markup') }
  }, {
    id: 'markup',
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
      TUTORIAL.genMarkupCode(1)
    },
    content: 'HTML structures data/content by placing it inside of "elements". Every element has a name, like "article" for example. In <a href="https://en.wikipedia.org/wiki/Markup_language" target="_blank">Markup Languages</a> an element consists of an "opening tag" like <code>&lt;article&gt;</code>, and a "closing tag" like <code>&lt;/article&gt;</code>.',
    options: { ok: (e) => e.goTo('html-tags') }
  }, {
    id: 'html-tags',
    before: () => {
      WIDGETS['html-diagram1'].open()
      WIDGETS['html-diagram1'].update({ right: 20, bottom: 20 }, 500)
    },
    content: 'Both the opening and closing tags are identifiable by the (less-than and greater-than) brackets. The closing tag differentiates itself by including a backslash before the element\'s name. This is very common code "syntax" on the Web (aka Cyberspace). I\'ll leave this widget open for a bit (feel free to close it yourself if you\'d like)',
    options: { ok: (e) => e.goTo('html-tags2') }
  }, {
    id: 'html-tags2',
    before: () => { TUTORIAL.genMarkupCode(2) },
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
      WIDGETS['html-diagram2'].update({ right: 40, bottom: 40 }, 500)
    },
    content: 'Elements can also include optional "attributes", which are special keywords you can use to change the details of a particular element. You place them within the opening tag itself and usually assign specific values to them by writing the value in quotes after an equal sign that follows directly after the attribute name.',
    options: { ok: (e) => e.goTo('html-attr2') }
  }, {
    id: 'html-attr2',
    content: 'Like the element names, you can double click the attributes if you want me to tell you more about any in particular.',
    options: { 'ok, what\'s next?': (e) => e.goTo('future-tuts') }
  }, {
    id: 'future-tuts',
    before: () => {
      WIDGETS['html-diagram1'].close()
      WIDGETS['html-diagram2'].close()
    },
    content: 'My creators at netizen.org are working hard on proper "Internet Art Tutorials" which will not only cover HTML in more detail but also demonstrate how <a href="https://en.wikipedia.org/wiki/Internet_art" target="_blank">net artists</a> have used this code to make art on the Web (aka the Gallery for the Global Village).',
    options: { 'exciting! when can I start?': (e) => e.goTo('future-tuts2') }
  }, {
    id: 'future-tuts2',
    content: 'It is! There are a couple of "beta" tutorials for you to try out already. If you\'re ascii is getting antsy I can take you straight to those tutorials now, or I could show you how to navigate around the studio a bit first?',
    options: {
      'ok, let\'s finish here first': (e) => e.goTo('finish-here'),
      'let\'s check out those tutorials now': (e) => e.goTo('leave-tutorial')
    }
  }, {
    id: 'leave-tutorial',
    before: () => { STORE.subscribe('widgets', TUTORIAL.waitForTutMenu) },
    content: 'Ok, click on my face to open the main menu and then click on the check-mark icon to open the Tutorial\'s Menu.',
    options: {}
  }, {
    id: 'leave-tutorial2',
    before: () => { STORE.unsubscribe('widgets', TUTORIAL.waitForTutMenu) },
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
    content: 'Great! I\'ve got a few more tricks up my sleeve, changing my appearance for example! wanna try a new look?',
    options: {
      '[light theme]': (e) => e.goTo('light-theme'),
      '[monokai theme]': (e) => e.goTo('monokai-theme'),
      'I like this look': (e) => e.goTo('same-theme')
    }
  }, {
    id: 'light-theme',
    before: () => {
      STORE.dispatch('CHANGE_THEME', 'light')
      STORE.subscribe('widgets', TUTORIAL.waitForFuncMenu)
    },
    content: 'nice choice! minimal, bright, clean. This is one of my favorite outfits. I\'ll show you how I changed themes, click on my face to open up the main menu and then click on the <code>(...)</code> icon to open the Functions Menu.',
    options: {}
  }, {
    id: 'monokai-theme',
    before: () => {
      STORE.dispatch('CHANGE_THEME', 'monokai')
      STORE.subscribe('widgets', TUTORIAL.waitForFuncMenu)
    },
    content: 'classic! I wear this outfit when I\'m hanging out with the other code editors (I borrowed this color scheme from Sublime Text). I\'ll show you how I changed themes, click on my face to open up the main menu and then click on the <code>(...)</code> icon to open the Functions Menu.',
    options: {}
  }, {
    id: 'same-theme',
    before: () => { STORE.subscribe('widgets', TUTORIAL.waitForFuncMenu) },
    content: 'Me too! But, I\'ll show you how to change themes in case you change your mind later. Click on my face to open up the main menu and then click on the <code>(...)</code> icon to open the Functions Menu.',
    options: {}
  }, {
    id: 'jump-to-theme',
    before: () => {
      STORE.subscribe('widgets', TUTORIAL.waitForFuncMenu)
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
      TUTORIAL.genMarkupCode(1)
    },
    content: 'Now I\'ll show you how to change themes and other settings. Click on my face to open up the main menu and then click on the <code>(...)</code> icon to open the Functions Menu.',
    options: {}
  }, {
    id: 'func-menu',
    before: () => { STORE.unsubscribe('widgets', TUTORIAL.waitForFuncMenu) },
    content: 'This menu has all sorts of "Functions" which can be used to edit settings and save projects. Click on the "editor settings", there you\'ll find the function I use to change my "theme", as well as other details. Want me to explain any of these?',
    options: {
      'tidyCode?': (e) => e.goTo('tidyCode'),
      'runUpdate?': (e) => e.goTo('runUpdate'),
      'autoUpdate?': (e) => e.goTo('autoUpdate'),
      'changeLayout?': (e) => e.goTo('changeLayout'),
      'changeOpacity?': (e) => e.goTo('changeOpacity'),
      'that\'s ok, I get it': (e) => e.goTo('i-get-func-menu')
    }
  }, {
    id: 'tidyCode',
    content: 'With a few exceptions, most coding languages don\'t care how you space out your code, but there are some conventions for how HTML, CSS and JavaScript code should spaced and indented. This is the function I use to clean up your code when the indentation and spacing gets too messy.',
    options: { 'I see, thanks!': (e) => e.goTo('clarify-func-menu') }
  }, {
    id: 'runUpdate',
    content: `When <code>autoUpdate</code> is set to <code>false</code> then you can run this function to update the browser behind me with the code in my editor (you could also use the ${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+S shortcut key)`,
    options: { 'I see, thanks!': (e) => e.goTo('clarify-func-menu') }
  }, {
    id: 'autoUpdate',
    content: `When <code>autoUpdate</code> is set to <code>true</code> then I'll update the browser behind me in "realtime", soon as I noticed you changed code in my editor (assuming I don't notice any bugs of course). When set to <code>false</code> you'll need to update manually via <code>runUpdate</code> (or ${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+S).`,
    options: { 'I see, thanks!': (e) => e.goTo('clarify-func-menu') }
  }, {
    id: 'changeLayout',
    content: 'I\'ve got a few different layout modes I like to switch between, feel free to switch between them yourself.',
    options: { 'I see, thanks!': (e) => e.goTo('clarify-func-menu') }
  }, {
    id: 'changeOpacity',
    content: 'Sometimes when I\'m working on some experimental graphics I like to switch to the light theme, change my layout to full-screen and lower the opacity a bit. Perfect for performing realtime visuals at an <a href="https://en.wikipedia.org/wiki/Algorave" target="_blank">algorave</a>.',
    options: {
      'I see, thanks!': (e) => e.goTo('clarify-func-menu'),
      'algorave? show me!': (e) => e.goTo('algorave')
    }
  }, {
    id: 'algorave',
    code: '[TODO: algorave example]',
    before: () => {
      STORE.dispatch('CHANGE_THEME', 'light')
      STORE.dispatch('CHANGE_OPACITY', 0.4)
      STORE.dispatch('CHANGE_LAYOUT', 'full-screen')
    },
    content: 'Sure, here\'s something I was working on last week, what do you think? As always, feel free to remix it, I love collaborating.',
    options: { 'very cool!': (e) => e.goTo('clarify-func-menu') }
  }, {
    id: 'i-get-func-menu',
    content: 'Yea, I guess they\'re pretty self-explanatory. A good function name should always make clear what it\'s going to do when you run it.',
    options: { 'what\'s next?': (e) => e.goTo('my-project') }
  }, {
    id: 'clarify-func-menu',
    content: 'No problem! Anything else you want me to clarify?',
    options: {
      'tidyCode?': (e) => e.goTo('tidyCode'),
      'runUpdate?': (e) => e.goTo('runUpdate'),
      'autoUpdate?': (e) => e.goTo('autoUpdate'),
      'changeLayout?': (e) => e.goTo('changeLayout'),
      'changeOpacity?': (e) => e.goTo('changeOpacity'),
      'that\'s ok, what\'s next': (e) => e.goTo('my-project')
    }
  }, {
    id: 'my-project',
    before: () => {
      STORE.dispatch('CHANGE_OPACITY', 1)
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
      if (!WIDGETS['functions-menu'].opened) WIDGETS['functions-menu'].open()
    },
    content: 'Click on "my project" section. There you\'ll find different ways to save and share the work you make in this cyberstudio. Should I expand on that?',
    options: {
      'shareLink?': (e) => e.goTo('shareLink'),
      'downloadCode?': (e) => e.goTo('downloadCode'),
      'uploadCode?': (e) => e.goTo('uploadCode'),
      'saveProject?': (e) => e.goTo('saveProject'),
      'openProject?': (e) => e.goTo('openProject'),
      'newProject?': (e) => e.goTo('newProject'),
      'that\'s ok, what\'s next': (e) => e.goTo('last-func-items')
    }
  }, {
    id: 'clarify-proj-menu',
    content: 'No problem! Anything else you want me to clarify?',
    options: {
      'shareLink?': (e) => e.goTo('shareLink'),
      'downloadCode?': (e) => e.goTo('downloadCode'),
      'uploadCode?': (e) => e.goTo('uploadCode'),
      'saveProject?': (e) => e.goTo('saveProject'),
      'newProject?': (e) => e.goTo('newProject'),
      'that\'s ok, what\'s next': (e) => e.goTo('last-func-items')
    }
  }, {
    id: 'shareLink',
    content: 'When you run this function I\'ll update the browser\'s URL so that it contains a compressed version of the code in my editor, it\'s a way of "encoding" your sketch into a single string of text you can share or save anywhere.',
    options: { 'I see, thanks!': (e) => e.goTo('clarify-proj-menu') }
  }, {
    id: 'downloadCode',
    content: 'I\'m not gonna horde our collaborations. If you run this function I\'ll download a copy of the code so you can do whatever you want with it, like run it in other browsers or edit it in other code editors.',
    options: { 'I see, thanks!': (e) => e.goTo('clarify-proj-menu') }
  }, {
    id: 'uploadCode',
    content: 'I\'d love to see what you\'re working on! If you\'ve got an HTML file you want to show me you can run this function to load it up into my editor.',
    options: { 'I see, thanks!': (e) => e.goTo('clarify-proj-menu') }
  }, {
    id: 'saveProject',
    content: '<code>saveProject()</code> can be used to save anything you make here onto your GitHub while <code>openProject()</code> can be used to open a project from your GitHub. I\'ll come back to this in a little bit, let\'s finish discussing the rest of this menu first.',
    options: { 'I see, thanks!': (e) => e.goTo('clarify-proj-menu') }
  }, {
    id: 'newProject',
    content: 'If at any point you need a blank canvas, simply run this function.',
    options: { 'I see, thanks!': (e) => e.goTo('clarify-proj-menu') }
  }, {
    id: 'last-func-items',
    content: 'The "reset options" section has some other stuff. And lastly, if you ever want to start over, press "hi netnet" and I\'ll pretend you just got here (let\'s not press that now though, I\'ve got a couple more things to show you).',
    options: {
      ok: (e) => e.goTo('wig-menu'),
      'what\'s in the reset options?': (e) => e.goTo('reset-opts')
    }
  }, {
    id: 'reset-opts',
    content: 'Dang, I was hoping you wouldn\'t ask about that one. This section has a few functions that erase portions of my memory. My creators at netizen.org believe in "user agency" and felt you should be able to clear any and all data.',
    options: {
      'you\'re recording my data?': (e) => e.goTo('rec-data'),
      'could you explain these?': (e) => e.goTo('ex-reset'),
      'I see, let\'s move on then.': (e) => e.goTo('wig-menu')
    }
  }, {
    id: 'rec-data',
    content: 'We don\'t store anything beyond basic server logs (and I mean real basic, we don\'t use google analytics or any other surveillance capitalist spyware). But I don\'t want to forget who you are, so I store my AI memory inside your personal browser\'s localStorage so only you and I can access it.',
    options: {
      'I see': (e) => e.goTo('id'),
      'and these reset options?': (e) => e.goTo('ex-reset')
    }
  }, {
    id: 'ex-reset',
    content: 'Ok, which function would you like me to clarify?',
    options: {
      'resetErrors?': (e) => e.goTo('resetErrors'),
      'refresh?': (e) => e.goTo('refresh'),
      'reboot?': (e) => e.goTo('reboot'),
      'let\'s move on': (e) => e.goTo('wig-menu')
    }
  }, {
    id: 'resetErrors',
    content: 'I\'m a pretty picky coder, if I notice you making any mistakes or even bad technique I\'m going to correct you, but if there are particular things you want me to stop <i>bugging</i> you about I\'ll remember to do so... unless you run this function.',
    options: { 'I see': (e) => e.goTo('ex-reset') }
  }, {
    id: 'refresh',
    content: 'This will run a basic browser refresh, which will disorient me, I\'ll loose my short term memory and think you just got here.',
    options: { 'I see': (e) => e.goTo('ex-reset') }
  }, {
    id: 'reboot',
    content: 'This is a FULL reboot, this will wipe my entire memory... gone... forever.',
    options: { 'I see': (e) => e.goTo('ex-reset') }
  }, {
    id: 'wig-menu',
    before: () => { STORE.subscribe('widgets', TUTORIAL.waitForWigMenu) },
    content: 'Ok, now click on my face again, but this time open the "widgets menu" by clicking the puzzle piece icon.',
    options: {}
  }, {
    id: 'wig-menu2',
    before: () => { STORE.unsubscribe('widgets', TUTORIAL.waitForWigMenu) },
    content: 'This is were I keep any widgets I think you might want to reuse. These will change a bit depending on which tutorial you\'re on, but you can "star" most of these widgets when you have them open if you\'d prefer I always keep them in this menu.',
    options: { ok: (e) => e.goTo('color-wig') }
  }, {
    id: 'color-wig',
    code: '<h1 style="color: #ff00cc;">Hi There</h1>',
    content: 'The Color Widget is a good example of the kinds of widgets my creators are working on right now. I\'ll show you how it works. I\'ve added a style attribute to an element in my editor. The style attribute takes as it\'s value some CSS code, which will allow us to change the appearance of our element. I\'ve added a color "property" with a special "hex code" value.',
    options: { ok: (e) => e.goTo('color-wig2') }
  }, {
    id: 'color-wig2',
    before: () => { STORE.subscribe('widgets', TUTORIAL.waitForColorWig) },
    content: 'To open the Color Widget you can either double click on the color hex code and I\'ll give you the option to open it from there, or you can click "Color Widget" in the Widgets Menu... try it out!',
    options: {}
  }, {
    id: 'color-wig3',
    before: () => { STORE.unsubscribe('widgets', TUTORIAL.waitForColorWig) },
    content: 'Let me know when you\'re done experimenting with the Color Widget and I\'ll explain the last couple "Upload Assets" and "Saved Projects".',
    options: { 'ok, I\'m done': (e) => e.goTo('upload-assets') }
  }, {
    id: 'upload-assets',
    content: 'HTML is a "metamedia" file format, you can include images, videos, 3D files, etc. "Upload Assets" is where I\'ll put any files you upload to your project for the purpose of including it in your HTML sketch.',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
  }, {
    id: '',
    content: '',
    options: { ok: (e) => e.goTo('id') }
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

  waitForFuncMenu: () => {
    if (WIDGETS['functions-menu'].opened) {
      NNT.goTo('func-menu')
    }
  },

  waitForTutMenu: () => {
    if (WIDGETS['tutorials-menu'].opened) {
      NNT.goTo('leave-tutorial2')
    }
  },

  waitForWigMenu: () => {
    if (WIDGETS['widgets-menu'].opened) {
      NNT.goTo('wig-menu2')
    }
  },

  waitForColorWig: () => {
    if (WIDGETS['color-widget'].opened) {
      NNT.goTo('color-wig3')
    }
  },

  starterText: null,
  genMarkupCode: (n) => {
    let txt
    if (!TUTORIAL.starterText) {
      const d = document.createElement('div')
      d.innerHTML = NNE.code
      txt = d.textContent !== '' && !d.textContent.includes('@keyframes')
        ? d.textContent : 'Hello Internet!'
      TUTORIAL.starterText = txt
    } else { txt = TUTORIAL.starterText }

    if (n === 1) {
      NNE.code = `<article>${txt}</article>`
    } else if (n === 2) {
      NNE.code = NNE.code = `<article>
  <h1>15 Interesting things sure to grab your attention</h1>
  <p>
    For starters, ${txt}. Isn't that interesting?
  </p>
</article>`
    } else if (n === 3) {
      const search = txt.split(' ').join('+')
      NNE.code = NNE.code = `<article title="main article">
  <h1>15 Interesting things sure to grab your attention</h1>
  <p>
    For starters, ${txt}. Isn't that interesting?
    Let's see what <a href="https://en.wikipedia.org/wiki?search=${search}" target="_blank">Wikipedia</a> has to say about that!
  </p>
</article>`
    }
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
  }
}

// {
//   id: 'experiment',
//   content: 'Change the code in my editor! Don\'t worry about messing anything up, I\'ll warn you if you make a mistake.',
//   options: { 'anything else I should know?': (e) => e.goTo('experiment-2') }
// }, {
//   id: 'experiment-2',
//   content: 'Double click any piece of code if you want me to explain it to you. You can also click on my face at any point to open my menu. Sound good?',
//   options: { cool: (e) => e.hide() }
// }

// const funcMenuListener = () => {
//   window.convo = new Convo(window.convos['welcom-screen'], 'opened-tutorials')
// }
// {
//  id: 'keep-learning',
//  before: () => { STORE.subscribe('widgets', funcMenuListener) },
//  content: 'Click on my face to open up the menu options, then click on the check-mark icon to open the Tutorials Menu to view the lesson\'s we currently have up.',
//  options: { }
// }, {
//  before: () => {
//    console.log('BEFORE', STORE.listeners['widgets'])
//    STORE.unsubscribe('widgets', funcMenuListener)
//    console.log('AFTER', STORE.listeners['widgets'])
//  },
//  id: 'opened-tutorials',
//  content: 'You did it!',
//  options: { cool: (e) => e.hide() }
// }
