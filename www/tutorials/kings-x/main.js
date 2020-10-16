/* global WIDGETS, TUTORIAL, Widget, STORE, NNE, utils, Averigua */
window.TUTORIAL = {
  onload: () => {
    NNE.addCustomRoot('tutorials/kings-x/')
    NNE.code = `<!DOCTYPE html>
<style>
  @font-face {
    font-family: "retro windows";
    src: url(fonts/px_sans_nouveaux.woff2) format("woff2"),
      url(fonts/px_sans_nouveaux.woff) format("woff"),
      url(fonts/px_sans_nouveaux.ttf);
  }

  body {
    background: #81c994;
  }

  a { text-decoration: none; }

  .icons {
    display: grid;
    grid-template-rows: 1fr 1fr 1fr;
    height: 100px
  }

  .icons-sub {
    display: flex;
  }

  .icons img {
    width: 56px;
  }

  .icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100px;
    margin: 10px;
  }

  .filename {
    font-family: "retro windows";
    font-size: 12px;
    color: #000;
    word-break: break-all
  }

  .start-menu {
    position: fixed;
    bottom: 0px;
    left: 0px;
    width: 100vw;
    height: 58px;
    display: grid;
    grid-template-columns: 152px auto 319px;
  }

  .start-menu-1 {
    background-image: url(images/icons/start-menu-1.png);
  }

  .start-menu-2 {
    background-image: url(images/icons/start-menu-2.png);
  }

  .start-menu-3 {
    background-image: url(images/icons/start-menu-3.png);
  }

  .clock {
    font-family: "retro windows";
    font-size: 18px;
    display: inline-block;
    transform: translate(175px, 15px);
  }
</style>
<section class="icons">
  <div class="icons-sub">
    <span class="icon">
      <img src="images/icons/computer.png" alt="computer icon">
      <span class="filename">My Computer</span>
    </span>
    <a href="https://archive.org/details/msdos_dos_manager_1999" target="_blank" class="icon">
      <img src="images/icons/dos.png" alt="dos icon">
      <span class="filename">DOS</span>
    </a>
  </div>
  <div class="icons-sub">
    <a href="https://www.windows93.net/" target="_blank" class="icon">
      <img src="images/icons/floppy.png" alt="windows floppy icon">
      <span class="filename">Windows 93 - by Jenkenpopp</span>
    </a>
  </div>
  <div class="icons-sub">
    <a href="http://www.irational.org/heath/treasures/photo/heath_bunting/porlock_fishing_boat_heath_bunting_kayle_brandon.jpg" target="_blank" class="icon">
      <img src="images/icons/image.png" alt="image icon">
      <span class="filename">porlock_fishing_boat_heath_bunting_kayle_brandon.jpg</span>
    </a>
  </div>
</section>
<section class="start-menu">
  <div class="start-menu-1"></div>
  <div class="start-menu-2"></div>
  <div class="start-menu-3">
    <span class="clock">20:48</span>
  </div>
</section>
<script>
  function clock () {
    setTimeout(clock, 1000)
    const c = document.querySelector('.clock')
    const d = new Date()
    const hh = d.getHours()
    let m = d.getMinutes()
    let s = d.getSeconds()
    let dd = 'AM'
    let h = hh
    if (h >= 12) { h = hh - 12; dd = 'PM' }
    if (h === 0) h = 12
    h = h < 10 ? "0" + h : h
    m = m < 10 ? "0" + m : m
    s = s < 10 ? "0" + s : s
    c.textContent = h + ':' + m + ':' + s + ' ' + dd
  }
  clock()
</script>
`
  },

  steps: [{
    id: 'intro',
    before: () => TUTORIAL.startSetup(),
    content: 'The year is 1994, though the Web had been around for a couple of years, a browser called Mosaic (which would later evolve into Netscape Navigator) had just been developed at the University of Illinois ushering in the Internet boom of the 1990s, it was now easier than ever to access the Internet and, perhaps more importantly, understand it\'s potential.',
    options: { 'oh, vintage Internet': (e) => e.goTo('intro2') }
  }, {
    id: 'intro2',
    before: () => {
      WIDGETS['heath-and-kayle'].open()
      WIDGETS['heath-and-kayle'].update({ right: 20, bottom: 20 }, 500)
    },
    content: 'Vintage indeed! It\'s easy to take the Web\'s self-publishing nature for granted  today, but for "artivists" (artists activists) and "<a href="https://en.wikipedia.org/wiki/Hacktivism" target="_blank">hacktivists</a>" (hacker activists) like Heath Bunting and Kayle Brandon, this was revolutionary. They could publish work considered too radical for traditional outlets and reach a much wider audience than was previously possible via other DIY methods.',
    options: { 'how so?': (e) => e.goTo('intro3') }
  }, {
    id: 'intro3',
    before: () => {
      WIDGETS['mosaic-browser'].close()
      NNE.code = '<!DOCTYPE html><iframe src="http://irational.org/borderxing/home.html" style="position: absolute; top:0; left:0; border:none; width: 100vw; height: 100vh;"></iframe>'
    },
    content: 'For example, in Heath and Kayle\'s legendary project <a href="http://irational.org/borderxing/home.html" target="_blank">BorderXing Guide</a> (2002) a collection of instructions and documentation for how to surreptitiously cross European borders. For these artists the Internet is a means to an end; an online intervention for instigating offline situations.',
    options: { wow: (e) => e.goTo('intro4') }
  }, {
    id: 'intro4',
    before: () => {
      NNE.code = '<!DOCTYPE html><iframe src="http://irational.org/heath/borderxing/fr.it/" style="position: absolute; top:0; left:0; border:none; width: 100vw; height: 100vh;"></iframe>'
    },
    content: 'The project contained routes and instructions for crossing various European borders undetected and without a passport. The site also included documentation from Heath and Kayle\'s own attempts at crossing these borders, with notes like "Spring and Autumn crossing recommended. Route has been used by refugees before successfully. Take enough food for 10 hour walk."',
    options: { rad: (e) => e.goTo('intro5') }
  }, {
    id: 'intro5',
    before: () => {
      WIDGETS['heath-and-kayle'].close()
      NNE.lint = false
      NNE.code = TUTORIAL.kingsX
      utils.netitorUpdate()
    },
    content: 'This way of using the Web is a theme across most of Heath\'s work, for example his project <a href="https://anthology.rhizome.org/communication-creates-conflict" target="_blank">Communication Creates Conflict</a> (1995) or this piece you see behind me <a href="http://www.irational.org/cybercafe/xrel.html" target="_blank">King\'s Cross Phone In</a> (1994).',
    options: { cool: (e) => e.goTo('kingsx') }
  }, {
    id: 'kingsx',
    content: 'This piece is technically very simple, but conceptually very exciting. Heath published the phone numbers to public telephone booths at London\'s King\'s Cross railway station along side instructions for how and when to call in, converting the heavily trafficked commuter hub into a "social and musical spectacle" for a day.',
    options: { 'how\'s it made?': (e) => e.goTo('kingsx-b') }
  }, {
    id: 'kingsx-b',
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'separate-window')
      utils.netitorUpdate()
    },
    content: 'If we take a look at this canonical work\'s source code we can see that the 62 lines of code are as simple and straight forward as the concept itself.',
    options: { ok: (e) => e.goTo('kingsx-c') }
  }, {
    id: 'kingsx-c',
    content: 'It\'s made using 9 of the most common HTML elements, <code>&lt;title&gt;</code>, <code>&lt;img&gt;</code>, <code>&lt;h1&gt;</code>, <code>&lt;h3&gt;</code>, <code>&lt;b&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;a&gt;</code>, <code>&lt;pre&gt;</code>, <code>&lt;br&gt;</code> and <code>&lt;hr&gt;</code>.',
    options: {
      'HTML elements?': (e) => e.goTo('html-info'),
      ok: (e) => e.goTo('remix0')
    }
  },
  // ------------------------------- [HTML ASIDE START] ------------------------
  {
    id: 'html-info',
    before: () => {
      NNE.lint = false
      NNE.code = TUTORIAL.kingsX
      utils.netitorUpdate()
      STORE.dispatch('CHANGE_LAYOUT', 'separate-window')
    },
    content: 'Anything you type into my editor is interpreted by the browser as <a href="https://developer.mozilla.org/en-US/docs/Web/HTML" target="_blank">HTML</a> (Hypertext Markup Language) code, which is the defacto language of the World Wide Web, it\'s the language we use to structure the content of Web pages and Web apps.',
    options: { cool: (e) => e.goTo('markup') }
  }, {
    id: 'markup',
    content: 'HTML structures content by placing it inside of "elements". Every element has a name, for example <b>title</b>. In <a href="https://en.wikipedia.org/wiki/Markup_language" target="_blank">Markup Languages</a> an element consists of an "opening tag" like <code>&lt;title&gt;</code>, and a "closing tag" like <code>&lt;/title&gt;</code>.',
    options: { ok: (e) => e.goTo('html-tags') }
  }, {
    id: 'html-tags',
    before: () => {
      WIDGETS['html-diagram1'].open()
      WIDGETS['html-diagram1'].update({ right: 40, bottom: 40 }, 500)
    },
    content: 'Both the opening and closing tags are identifiable by the <code>&lt;</code> and <code>&gt;</code> brackets. The closing tag differentiates itself by including a backslash <code>&lt;/</code> before the element\'s name. You\'ll come to learn this "syntax" is common on the Web.',
    options: { ok: (e) => e.goTo('html-tags2') }
  }, {
    id: 'html-tags2',
    content: 'We build structure by placing elements within other elements. There are loads of HTML elements. You can even create your own! You can double click any element in my editor at anytime if you want me to tell you  ore about it specifically, but if you\'re curious, you can find a full list of <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element" target="_blank">HTML elements here</a>.',
    options: {
      'how can I make my own elements?': (e) => e.goTo('custom-elements'),
      ok: (e) => e.goTo('html-attr')
    }
  }, {
    id: 'custom-elements',
    content: 'HTML tags are created by the <a href="https://www.w3.org/" target="_blank">W3C</a> which is a "standards organization" which anyone can join (there are <a href="https://www.w3.org/Consortium/Member/List" target="_blank">400 member groups</a> in total) which design and define how the Web (aka the People\'s Platform) should work, including which HTML elements should exist. But you don\'t have to wait for the W3C\'s approval, you can actually create your own <a href="https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements" target="_blank">custom element</a> with JavaScript, but we\'ll save that for a more advanced tutorial.',
    options: { 'fair enough': (e) => e.goTo('html-attr') }
  }, {
    id: 'html-attr',
    before: () => {
      WIDGETS['html-diagram2'].open()
      WIDGETS['html-diagram2'].update({ right: 80, bottom: 80 }, 500)
    },
    content: 'Elements can also include optional "attributes", which are special keywords you can use to change the details of a particular element. You place them within the opening tag itself and usually assign specific values to them by writing the value in quotes after an equal sign that follows directly after the attribute name. Like the element names, you can double click the attributes if you want me to tell you more about any in particular.',
    options: { ok: (e) => e.goTo('html-end') }
  }, {
    id: 'html-end',
    before: () => {
      WIDGETS['html-diagram2'].close()
      WIDGETS['html-diagram1'].close()
    },
    content: 'I\'ll show you some specific attributes as well as some more HTML elements as we explore the code of <i>King\'s Cross Phone In</i>',
    options: { 'ok, let\'s do it!': (e) => e.goTo('remix0') }
  },
  // -------------------------------- [HTML ASIDE END] -------------------------
  {
    id: 'remix0',
    before: () => {
      NNE.code = TUTORIAL.codeStep(0)
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
    },
    content: 'Let\'s recreate it piece by piece, element by element, making some slight adjustments along the way in order to conform to modern web standards. For example, in 1994 Web pages didn\'t have <a href="https://developer.mozilla.org/en-US/docs/Glossary/Doctype" target="_blank">doctypes</a>, but these days it\'s important to let the browser know which era of HTML we created our work in, so we\'ll specify an HTML5 doctype.',
    options: { ok: (e) => e.goTo('remix1') }
  }, {
    id: 'remix1',
    before: () => { NNE.code = TUTORIAL.codeStep(1) },
    content: 'Next we\'ll add the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title" target="_blank">title</a> element. Like most elements, it consists of an "opening tag" <code>&lt;title&gt;</code> and a "closing tag" <code>&lt;/title&gt;</code> surrounding the content we wish to denote as the "title" of our work.',
    options: { ok: (e) => e.goTo('remix1b') }
  }, {
    id: 'remix1b',
    content: 'Like the title of any work of art, this doesn\'t appear within the work itself, but rather is part of the piece\'s "didactic text", as we say in the art world, or "metadata" as we say in the computer world. This is what appears in web search results or social media cards when shared on platforms like Facebook or Twitter. It\'s also the title that shows up the browser tab or your browsers bookmarks.',
    options: { ok: (e) => e.goTo('remix1c') }
  }, {
    id: 'remix1c',
    content: 'In Heath\'s original work he wrote the <code>&lt;TITLE&gt;</code> tag in all caps, which was the convention back then, but today we write all element tag names in lower case, so we\'ll write ourse like this <code>&lt;title&gt;</code>',
    options: { ok: (e) => e.goTo('remix2') }
  }, {
    id: 'remix2',
    before: () => {
      NNE.addErrorException(JSON.stringify({ rule: 'alt-require' }))
      NNE.code = TUTORIAL.codeStep(2)
    },
    content: 'The first element that visually appears in the work is the "cybercafe" logo. When we want to embed an image into an HTML page we use the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img" target="_blank">img</a> element. Unlike most elements the <code>&lt;img&gt;</code> element has no closing tag. When an element consists only of an opening tag it\'s referred to as a "void element" or "singleton".',
    options: {
      'cybercafe?': (e) => e.goTo('cybercafe-tease'),
      ok: (e) => e.goTo('remix2b')
    }
  }, {
    id: 'cybercafe-tease',
    content: ' <a href="http://www.irational.org/cybercafe/" target="_blank">Cybercafe</a> is the name of Heath\'s own custom server! That\'s an interesting story actually, but we\'re getting a little ahead of ourselves, I\'ll come back to that a little later.',
    options: { ok: (e) => e.goTo('remix2b') }
  }, {
    id: 'remix2b',
    content: 'When we want to change specific details of any given element we do this by adding the necessary <a href="https://developer.mozilla.org/en-US/docs/Glossary/Attribute" target="_blank">attribute</a>, an attribute is always written as <code>name="value"</code>. Like <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element" target="_blank">HTML Elements</a>, you can check out a full list of <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes" target="_blank">HTML Attributes</a> if you\'re curious.  Here we\'ve added a <b>src</b> attribute to specify that we want to use the image tag to embed the specific image file <b>cclogo.gif</b>.',
    options: { ok: (e) => e.goTo('remix2c') }
  }, {
    id: 'remix2c',
    content: 'Because this image file is saved in the same folder that our HTML file is saved in, we only need to specify the filename, but had it been saved anywhere else, we would need to specify the file\'s path.',
    options: {
      'file paths?': (e) => e.goTo('file-path1'),
      ok: (e) => e.goTo('remix3')
    }
  },
  // ----------------------------- [PATHS ASIDE START] -------------------------
  {
    id: 'file-path1',
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
      const err = JSON.stringify({ rule: 'alt-require' })
      if (!NNE._errExceptions.includes(err)) NNE.addErrorException(err)
      NNE.code = TUTORIAL.codeStep(2)
    },
    content: 'A "<a href="https://en.wikipedia.org/wiki/Path_(computing)" target="_blank">file path</a>" is computer lingo for a particular file\'s location in a computer\'s hard drive. Typically you start by writing a <code>/</code> which designates a project or drive\'s "root" directory, which is it\'s first or "top most" folder. From there we write the names of the folders we need to enter in order, each separated by a <code>/</code> until we\'ve reached the folder with the file we want, for example  <code>/Desktop/images/cats/lilbub.jpg</code>',
    options: { ok: (e) => e.goTo('file-path2') }
  },
  {
    id: 'file-path2',
    content: 'Images, like any file on the Web including HTML pages themselves, need to be saved on a computer connected to the Internet. That computer needs to be running a program called a "<a href="https://en.wikipedia.org/wiki/Server_(computing)" target="_blank">server</a>" which listens to requests coming from browsers (aka a "<a href="https://en.wikipedia.org/wiki/Client_(computing)" target="_blank">client</a>") on other computers. When a server receives a request it sends the file over the Internet to the client (aka browser) running on your computer.',
    options: { ok: (e) => e.goTo('file-path3') }
  },
  {
    id: 'file-path3',
    content: 'Any time we use the <b>src</b> attribute on an HTML element, our browser creates a request for that file and sends it over the Internet to a server. You can write an "absolute path" as your <b>src</b> value which is the direct address to that file. Or you could write a "relative path", which is the path to the file <i>relative</i> to the HTML file we\'re working on.',
    options: {
      'relative path?': (e) => e.goTo('file-path-relative'),
      'absolute path?': (e) => e.goTo('file-path-absolute'),
      'got it': (e) => e.goTo('remix3')
    }
  },
  {
    id: 'file-path-relative',
    before: () => { NNE.code = TUTORIAL.codeStep(2) },
    content: 'What we\'ve got here is a relative path, because this image file is saved in the same folder as our HTML file on my server, we only need to write it\'s name. But had it been saved in a subfolder called "images" for example, then the relative path would be <code>images/cclogo.gif</code>',
    options: {
      'and absolute paths?': (e) => e.goTo('file-path-absolute'),
      'got it': (e) => e.goTo('remix3')
    }
  },
  {
    id: 'file-path-absolute',
    content: 'An absolute path includes not only the path to the file on that server, but also the domain name for the server itself which in this case is "https://netnet.studio". The absolute path for this file is <b>https://netnet.studio/tutorials/kings-x/cclogo.gif</b>',
    options: {
      'and relative paths?': (e) => e.goTo('file-path-relative'),
      'got it': (e) => e.goTo('remix3')
    }
  },
  // ------------------------------- [PATHS ASIDE END] -------------------------
  {
    id: 'remix3',
    before: () => {
      NNE.code = TUTORIAL.codeStep(3)
      NNE.removeErrorException(JSON.stringify({ rule: 'alt-require' }))
    },
    content: 'Another modification we should make to Heath\'s original code is the addition of a second attribute for this image, an <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/alt" target="_blank">alt</a> attribute describing what this is an image of.',
    options: { ok: (e) => e.goTo('remix3b') }
  }, {
    id: 'remix3b',
    content: 'There are lots more people online today than there was in 1994, and in order to make sure our work is accessible to the widest and diverse group of netizens possible there are certain code considerations to keep in mind. In this case, <b>alt</b> attributes are used by screen-readers, and other assistive technologies, to read aloud the description of the image to someone who is visually impaired for example.',
    options: { 'good to know!': (e) => e.goTo('remix4') }
  }, {
    id: 'remix4',
    before: () => {
      NNE.addErrorException(JSON.stringify({ rule: 'tag-pair' }))
      NNE.code = TUTORIAL.codeStep(4)
    },
    content: 'The next element in Heath\'s original code is a <code>&lt;p&gt;</code> which we use to denote a paragraph of information. However, Heath has a total of 9 opening <code>&lt;p&gt;</code> tags throughout his code, in places they don\'t belong, all of which are missing their corresponding closing <code>&lt;/p&gt;</code> tags!',
    options: { 'really?!': (e) => e.goTo('mistakes0') }
  }, {
    id: 'mistakes0',
    content: '...even the most influential net artists make plenty of coding mistakes.',
    options: { humbling: (e) => e.goTo('mistakes1') }
  }, {
    id: 'mistakes1',
    before: () => {
      const err = JSON.stringify({ rule: 'tag-pair' })
      if (!NNE._errExceptions.includes(err)) NNE.addErrorException(err)
      NNE.code = TUTORIAL.codeStep(4)
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
    },
    content: 'Every coding language has specific rules defining how they need to be written. When a rule is broken the computer will usually present you with an <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors" target="_blank">error message</a> like this JavaScript error for example: "<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Identifier_after_number" target="_blank">SyntaxError: identifier starts immediately after numeric literal</a>"',
    options: {
      'who makes the rules?': (e) => e.goTo('w3c'),
      ok: (e) => e.goTo('mistakes2')
    }
  },
  // ------------------------------- [START W3C ASIDE] -------------------------
  {
    id: 'w3c',
    before: () => {
      const err = JSON.stringify({ rule: 'tag-pair' })
      if (!NNE._errExceptions.includes(err)) NNE.addErrorException(err)
      NNE.code = TUTORIAL.codeStep(4)
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
    },
    content: 'Important question! HTML and CSS are designed by the <a href="https://www.w3.org/" target="_blank">The World Wide Web Consortium</a>, or W3C for short, which is a "standards organization" that anyone can join (there are over <a href="https://www.w3.org/Consortium/Member/List" target="_blank">400 member groups</a> in total) which discuss and define how the Web should work. They\'re constantly coming up with new ideas for things we should be able to do on the Web and so these languages are constantly evolving.',
    options: { 'I see': (e) => e.goTo('w3c2') }
  }, {
    id: 'w3c2',
    content: 'They release these rules and designs in technical documents known as specifications, or "specs" for short. Programmers developing browsers, like Chrome or Firefox, use these specs as guides or blueprints for how the HTML code you and I write needs to be interpreted and displayed, or "rendered", onto the screen.',
    options: {
      'I see': (e) => e.goTo('w3c4'),
      'what do specs look like?': (e) => e.goTo('w3c3')
    }
  }, {
    id: 'w3c3',
    content: 'I\'ll show you! They\'re very technical and written for programmers developing Web browsers, but I always find it interesting to see what those sort of things look like even if I don\'t understand it all, here\'s the spec for the <a href="https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element" target="_blank">img</a> element for example.',
    options: { interesting: (e) => e.goTo('w3c4') }
  }, {
    id: 'w3c4',
    content: 'Before releasing a spec the W3C members usually discuss their ideas over email or on GitHub, both of which are intentionally published openly online for any curious netizen to read. Here\'s a discussion on <a href="https://github.com/w3c/csswg-drafts/issues/5608" target="_blank">how img width and heights</a> should work, and here\'s another discussing <a href="https://github.com/w3c/csswg-drafts/issues/4770" target="_blank">the future of CSS!</a>.',
    options: { 'cool!': (e) => e.goTo('w3c5') }
  }, {
    id: 'w3c5',
    content: 'Yes, very cool indeed! So the W3C makes the rules, as Internet artists we do our best to follow the rules when coding our projects and, typically, the program interpreting our code (browsers in our case) warn us with error messages if and when we break the rules.',
    options: { 'got it': (e) => e.goTo('mistakes2') }
  },
  // --------------------------------- [END W3C ASIDE] -------------------------
  {
    id: 'mistakes2',
    content: 'But in the case of languages like HTML and CSS, rather than presenting an error message Web browsers do their best to correct your mistakes, based on what they think you <i>meant</i> to do. This is why Heath\'s piece displays perfectly even though he made plenty of mistakes in his code. This unique characteristic of coding on the Web is both a blessing and a curse for artists.',
    options: { 'how so?': (e) => e.goTo('mistakes3') }
  }, {
    id: 'mistakes3',
    before: () => {
      WIDGETS['jodi-my-desktop'].open()
      WIDGETS['jodi-my-desktop'].update({ left: 20, top: 20 }, 500)
    },
    content: 'On the one hand, mistakes are often great sources of inspiration and ideation. Internet artists like Joan Heemskerk and Dirk Paesmans (aka <a href="https://en.wikipedia.org/wiki/Jodi_(art_collective)" target="_blank">jodi.org</a>) defined their entire art career around embracing mistakes in computer systems. The fact that browsers do their best to render our broken code, rather than simply displaying an error message, makes them a rich space for, what new media artist <a href="http://jonsatrom.com/" target="_blank">Jon Satrom</a> calls, "creative problem creating."',
    options: { hmmm: (e) => e.goTo('mistakes4') }
  }, {
    id: 'mistakes4',
    before: () => WIDGETS['jodi-my-desktop'].close(),
    content: 'On the other hand, browsers auto-fixing mistakes means you might not realize you ever made a mistake, which means you might continue making those mistakes... until you\'ve made so many the browser is unable to auto-correct. Knowing that you made a mistake is helpful information, especially for artists learning to code for the first time.',
    options: { sure: (e) => e.goTo('mistakes5') }
  }, {
    id: 'mistakes5',
    content: 'So I\'m here to help! When you start writing your own HTML code in a little bit, I\'ll make sure to warn you if you make a mistake. And don\'t worry, I realize techy lingo like <i>"SyntaxError: identifier starts immediately after numeric literal"</i> istn\'t particularly helpful, so I\'ll do my best to translate things into human-friendly language.',
    options: { ok: (e) => e.goTo('mistakes6') }
  }, {
    id: 'mistakes6',
    before: () => {
      WIDGETS['jodi-quote'].open()
      WIDGETS['jodi-quote'].update({ right: 20, top: 20 }, 500)
    },
    content: 'But like jodi.org has taught us, mistakes can often be a good thing. So if there\'s ever a "mistake" you\'d like me to purposely ignore, you can just let me know and we\'ll opt to embrace the error together!',
    options: { 'I\'ll keep that in mind!': (e) => e.goTo('mistakes7') }
  }, {
    id: 'mistakes7',
    before: () => {
      WIDGETS['jodi-quote'].close()
    },
    content: 'So, with that said, we\'ll skip this <code>&lt;p&gt;</code> tag and fix Heath\'s mistakes as we go.',
    options: { ok: (e) => e.goTo('remix5') }
  }, {
    id: 'remix5',
    before: () => {
      NNE.code = TUTORIAL.codeStep(5)
      NNE.removeErrorException(JSON.stringify({ rule: 'tag-pair' }))
    },
    content: 'Next we have a level 1 <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements" target="_blank">heading element</a> or <code>&lt;h1&gt;</code> which are used to denote the start of a new section of an HTML document, for example the title of a news article.',
    options: { ok: (e) => e.goTo('remix6') }
  }, {
    id: 'remix6',
    before: () => { NNE.code = TUTORIAL.codeStep(6) },
    content: 'Following that, we have a level 3 <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements" target="_blank">heading element</a> or <code>&lt;h3&gt;</code> notice that the default font size is smaller than that of the code>&lt;h1&gt;</code>. There are 6 levels of heading elements, each one\'s default font size being a big smaller than the next.',
    options: { ok: (e) => e.goTo('remix7') }
  }, {
    id: 'remix7',
    before: () => { NNE.code = TUTORIAL.codeStep(7) },
    content: 'Then a <code>&lt;b&gt;</code> element which is used to "<b>b</b>ring attention to" a particular piece of content on our page. You might notice that while browsers render these elements in the default font size of 16px (pixels) it changes it\'s default font weight from "normal" to "bold".',
    options: { ok: (e) => e.goTo('remix8') }
  }, {
    id: 'remix8',
    before: () => { NNE.code = TUTORIAL.codeStep(8) },
    content: 'Next we have a couple of paragraphs, which we\'ll denote by correctly placing them in opening <code>&lt;p&gt;</code> and closing <code>&lt;/p&gt;</code> tags.',
    options: { ok: (e) => e.goTo('remix8b') }
  }, {
    id: 'remix8b',
    content: 'You might notice that despite the line break at the end of each of those lines in our code, the browser renders both paragraphs as one long line. This is because browsers ignore line breaks, these exist purely for the sake of the coder.',
    options: { ok: (e) => e.goTo('remix8c') }
  }, {
    id: 'remix8c',
    content: 'We could just as easily write all our code on a single line and it wouldn\'t make a difference to the browser... but it would make a difference to us, it\'s not very comfortable to work on a file made of a single long line.',
    options: { ok: (e) => e.goTo('remix9') }
  }, {
    id: 'remix9',
    before: () => { NNE.code = TUTORIAL.codeStep(9) },
    content: 'What Heath did in order to force line breaks in the specific spots he wanted was to use the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/br" target="_blank">line break element</a> or <code>&lt;br&gt;</code>, which like the <b>img</b> element is a "singleton", meaning it has no closing tag.',
    options: { ok: (e) => e.goTo('remix9b') }
  }, {
    id: 'remix9b',
    content: 'That said, there is one element that will visually render any line breaks you include within it\'s opening and closing tag, the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre" target="_blank">preformatted text element</a> or <code>&lt;pre&gt;</code>.',
    options: { ok: (e) => e.goTo('remix10') }
  }, {
    id: 'remix10',
    before: () => { NNE.code = TUTORIAL.codeStep(10) },
    content: 'Heath uses the <code>&lt;pre&gt;</code> element to list out the phone numbers for the King\'s Cross station phone booths. The London station had phone booths on either side of the lobby and Heath wanted to visually present them in the same order, and on the same side, as they appear in the station so that it would also function as a sort of map or overhead perspective of the telephones in the station.',
    options: { ok: (e) => e.goTo('remix10b') }
  }, {
    id: 'remix10b',
    content: 'You might notie that in addition to rendering any line breaks or spaces exactly as they appear in our code, the <code>&lt;pre&gt;</code> tags also display the content between them in a "monospace" typeface, rather than the default "serif" typeface of all the other elements.',
    options: { ok: (e) => e.goTo('remix10c') }
  }, {
    id: 'remix10c',
    content: 'Safe to assume this was intentional on Heath\'s part, as the uniformity of "monospace" typefaces also helps keep things aligned neatly, contributing to that "map" or "diagram" aesthetic.',
    options: { ok: (e) => e.goTo('remix11') }
  }, {
    id: 'remix11',
    before: () => { NNE.code = TUTORIAL.codeStep(11) },
    content: 'Reminiscent of the instruction sets written by <a href="https://en.wikipedia.org/wiki/Fluxus" target="_blank">Fluxus</a> and <a href="https://en.wikipedia.org/wiki/Conceptual_art" target="_blank">Conceptual</a> artists, like <a href="https://en.wikipedia.org/wiki/Yoko_Ono" target="_blank">Yoko Ono</a>  and others, the next section of this piece are the directions for any interested in participating in the performance which took play on Friday, August 5th 1994.',
    options: { ok: (e) => e.goTo('remix12') }
  }, {
    id: 'remix12',
    before: () => { NNE.code = TUTORIAL.codeStep(12) },
    content: 'Heath manually numbered the instructions but he could also have used an <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol" target="_blank">Ordered List element</a> or <code>&lt;ol&gt;</code>. By placing each instruction within a list elements, or <code>&lt;li&gt;</code> and placing those list elements within an ordered list element, the browsers know to automatically number each item.',
    options: { ok: (e) => e.goTo('remix12b') }
  }, {
    id: 'remix12b',
    content: 'This has the added benefit of handling the line breaks for us in addition to the automatic numbering. If we later decided to remove or add an additional step we wouldn\'t need to manually renumber each because the browser takes care of that for us.',
    options: { ok: (e) => e.goTo('remix12c') }
  }, {
    id: 'remix12c',
    content: 'If we had placed our <code>&lt;li&gt;</code> within an <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ul" target="_blank">Unordered List element</a>, or <code>&lt;ul&gt;</code> then our items would be listed as bulleted points instead of numbers.',
    options: { ok: (e) => e.goTo('remix13') }
  }, {
    id: 'remix13',
    before: () => { NNE.code = TUTORIAL.codeStep(13) },
    content: 'Finishing of the document, Heath adds another singleton element, the <code>&lt;hr&gt;</code> tag or <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr" target="_blank">Horizontal Rule</a>, also known as a "thematic break", which renders a Horizontal line across the page, below which he includes his contact email address.',
    options: { ok: (e) => e.goTo('remix14') }
  }, {
    id: 'remix14',
    before: () => { NNE.code = TUTORIAL.codeStep(14) },
    content: 'He places his email within one of the most important HTML elements of all, the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a" target="_blank">Anchor element</a> or <code>&lt;a&gt;</code> tag. The anchor tag can be used a variety of different ways depending on what you specify in it\'s <b>href</b> attribute.',
    options: { ok: (e) => e.goTo('remix14b') }
  }, {
    id: 'remix14b',
    content: 'When we have a long HTML page, anchor tags can be used to create links which jump up or down to specific sections of an HTML page, rather than having to endlessly scroll. Anchor tags can also be used to automatically launch the mail app on a computer or smartphone which is how Heath is using it here.',
    options: { ok: (e) => e.goTo('remix14c') }
  }, {
    id: 'remix14c',
    content: 'By writing his email address as the value for the <b>href</b> attribute preceeded by the phrase "mailto:", when a user clicks on this link it will launch the mail app with his email address already included in the "send to" field of the app.',
    options: { ok: (e) => e.goTo('remix14d') }
  }, {
    id: 'remix14d',
    content: 'However, the most common use of the anchor tag is creating hyperlinks to other web pages hosted on the same site or elsewhere on the web. If we were to replace "mailto:heath@cybercafe.org" with a web address like "http://netizen.org" the clicking the link would redirect us to that website.',
    options: { ok: (e) => e.goTo('remix15') }
  }, {
    id: 'remix15',
    before: () => { NNE.code = TUTORIAL.codeStep(15) },
    content: 'One last detail I should mention. Though the way I\'ve written the code here is the most common, Heath actually wrote it a little different. Instead of placing his entire email within the opening <code>&lt;a&gt;</code> and closing <code>&lt;/a&gt;</code> tags, he only included the word "cyber" within the link and actually places the rest of his email address outside the anchor element.',
    options: { ok: (e) => e.goTo('remix15b') }
  }, {
    id: 'remix15b',
    content: 'It\'s a tiny detail, but tiny details matter in art.',
    options: { ok: (e) => e.goTo('remix15c') }
  }, {
    id: 'remix15c',
    before: () => {
      WIDGETS['greene-quote'].open()
      WIDGETS['greene-quote'].update({ left: 20, top: 20 }, 500)
    },
    content: 'EOF! we\'ve completed our remix, or "refactor" as we say in code lingo, of Heath Bunting\'s classic net.art piece <a href="http://www.irational.org/cybercafe/xrel.html" target="_blank">King\'s Cross Phone In</a>.',
    options: { awesome: (e) => e.goTo('prompt') }
  }, {
    id: 'prompt',
    before: () => {
      WIDGETS['greene-quote'].close()
      const prevCode = utils.getUserData('code')
      if (prevCode) NNE.code = NNE._decode(prevCode)
      else NNE.code = TUTORIAL.codeStep(14)
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
      WIDGETS['arab-spring'].open()
      WIDGETS['arab-spring'].update({ left: 20, top: 20 }, 500)
    },
    content: 'In our era of social media, for better or worse, the Internet is regularly used to organize, mobilize and instigate offline activities, from the role Twitter played in the <a href="https://www.twitterandteargas.org/" target="_blank">Arab Spring</a> to the role Facebook played in the <a href="https://www.nytimes.com/2018/10/15/technology/myanmar-facebook-genocide.html" target="_blank">Myanmar genocide</a>.',
    options: { hmmm: (e) => e.goTo('prompt2') }
  }, {
    id: 'prompt2',
    before: () => { WIDGETS['arab-spring'].close() },
    content: 'Because these apps impose a specific structure around how information is shared as well as mediate the distribution of that information via their algorithmic feeds, anytime we use a social media platform to organize a call to action, we are (consciously or not) allowing the special interests of these platforms to influence various details of our work and it\'s distribution.',
    options: { true: (e) => e.goTo('prompt3') }
  }, {
    id: 'prompt3',
    content: 'But these platforms are themselves built on top of the Internet\'s original hypertext platform, the people\'s platform, the World Wide Web! Unlike social media services the Web has no ulterior motive and so it doesn\'t attempt to control or influence the way you use it.',
    options: { right: (e) => e.goTo('prompt4') }
  }, {
    id: 'prompt4',
    content: 'Rather than presenting you with a form to fill out, carefully crafted to provide the illusion of self-expression while also ensure data is collected in a manner that is organized for the explicit digestion of surveillance capitalist systems, the Web presents you with a blank canvas and a set of elements, building blocks to be organized in whatever way suits your specific interests.',
    options: { hmmm: (e) => e.goTo('prompt5') }
  }, {
    id: 'prompt5',
    content: 'Given this blank canvas, how might you create your own call to action for distribution on this global network? How might you craft HTML towards "artivist" ends? Use Heath\'s piece as a starting point in your own proposition for online and/or offline participation, and don\'t forget to consider the details.',
    options: { 'ok!': (e) => e.goTo('prompt6') }
  }, {
    id: 'prompt6',
    content: `Go ahead and start editing the code in the editor. Use the <b>${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+S</b> shortcut at any point if you want me to store your progress in your local ${Averigua.browserInfo().name} browser's memory so you can pick back up later. Let me know when you're finished and we'll publish your call to action on the Internet.`,
    options: { ok: (e) => e.goTo('prompt7') }
  }, {
    id: 'prompt7',
    content: 'Ready to get this masterpiece online?',
    options: {
      'yea!': (e) => {
        TUTORIAL.wantToPublish = true
        e.goTo('hosting1')
      },
      'give me aminute': (e) => e.goTo('one-min'),
      'I rather not': (e) => e.goTo('no-publish')
    }
  }, {
    id: 'one-min',
    content: `Take your time! Don't forget to hit  <b>${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+S</b> every once in a while. Let me know when you're finished and we'll publish your call to action on the Internet.`,
    options: { 'ok ready!': (e) => e.goTo('prompt7') }
  },
  // ............................ FINISHED ................. CODING ............
  {
    id: 'no-publish',
    content: 'That\'s ok, I\'m not here to coerce into "sharing" any data you don\'t want to. But I\'d love to tell you a little about the process in case you ever decide publish some work in the future.',
    options: { ok: (e) => e.goTo('first-download') }
  }, {
    id: 'first-download',
    content: 'First and foremost, you should download a copy of what we\'ve made here to your computer, in case you want to reference or work on it later.',
    options: {
      'how do I do that?': (e) => e.goTo('download-it')
    }
  }, {
    id: 'download-it',
    content: `To download this HTML file you can use my <code>downloadCode()</code> function, which you can find in the <b>my project</b> menu by clicking my face and then clicking <img src="images/menu/functions.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; margin-bottom: -14px;">. Alternatively, you can search for the <i>downloadCode</i> function using the search bar by clicking <img src="images/menu/search.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; margin-bottom: -14px;"> after clicking my face, or use the <b>${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+"</b> (that's ${Averigua.platformInfo().platform.includes('Mac') ? 'command' : 'control'} quote) shortcut key.`,
    options: {
      ok: (e) => {
        if (TUTORIAL.ratherNotGitHub) e.goTo('in-closing')
        else e.goTo('hosting1')
      }
    }
  }, {
    id: 'hosting1',
    content: 'As we\'ve discussed, the Internet is just a bunch of computers connected together, so anytime you visit a website, scroll through social media or stream a video, those are files and packets of data being sent to your computer from other computers on the Internet running special apps called <a href="https://en.wikipedia.org/wiki/Server_(computing)" target="_blank">servers</a>. Servers wait and listen for requests coming from other computers online running special apps called <a href="https://en.wikipedia.org/wiki/Client_(computing)" target="_blank">clients</a>. Your Web browser, mail app and social media apps are all examples of "clients".',
    options: { ok: (e) => e.goTo('hosting2') }
  }, {
    id: 'hosting2',
    content: 'Heath created his own server running on a computer in his kitchen and called it <a href="http://www.irational.org/cybercafe/" target="_blank">cybercafe</a>. Initially it was a BBS or <a href="https://en.wikipedia.org/wiki/Bulletin_board_system" target="_blank">Bulletin Board System</a> which were text-only Internet forums that were popular before the Web.',
    options: { cool: (e) => e.goTo('hosting3') }
  }, {
    id: 'hosting3',
    content: 'Creating your own server is a little trickier than creating a Web page or app, so Heath had help from some of his friends, specifically <a href="http://www.irational.org/tm/baker_cv.html" target="_blank">Rachel Baker</a>, <a href="https://www.furtherfield.org/about-us/team/" target="_blank">Marc Garrett</a> and <a href="https://en.wikipedia.org/wiki/Ivan_Pope" target="_blank">Ivan Pope</a>. Anarchists, hackers, and artists posted all sorts messages to the server including events, poetry and code tutorials for things like creating computer viruses! What an array of rabble-rousers!',
    options: { ha: (e) => e.goTo('hosting4') }
  }, {
    id: 'hosting4',
    before: () => {
      WIDGETS['eva-and-franco'].open()
      WIDGETS['eva-and-franco'].update({ left: 20, top: 20 }, 500)
    },
    content: 'Most net artists don\'t create their own servers, instead they "host" their files (HTML files, image files, etc) on servers run by other organizations. That said, creating your own server can be an exciting creative venture to explore. For example, in 2000 net art duo Eva and Franco Mattes (aka <a href="http://0100101110101101.org/" target="_blank">0100101110101101.org/</a>) turned their own personal computer into a server so that anyone on the Internet could access any of their personal files, a pretty radical commentary on online life!',
    options: {
      ok: (e) => {
        if (TUTORIAL.wantToPublish) {
          if (utils.getUserData('github').owner) e.goTo('save-it')
          else e.goTo('go-github')
        } else e.goTo('in-closing')
      }
    }
  },
  // ----------------------------- [ START GITHUB ] ----------------------------
  {
    id: 'go-github',
    before: () => WIDGETS['eva-and-franco'].close(),
    content: 'So, while it\'s totally possible to make your own server, that\'s a bit beyond the scope of this tutorial. Instead we\'ll host our files on servers run by a company called <a href="https://github.com/" target="_blank">GitHub</a>',
    options: {
      ok: (e) => e.goTo('how-github'),
      'what\'s GitHub?': (e) => e.goTo('github'),
      'I rather not': (e) => e.goTo('rather-not')
    }
  }, {
    id: 'rather-not',
    content: 'That\'s cool, my folks at <a href="https://netizen.org">netizen.org</a> like GitHub because we\'re all fans of open source culture (the fact that it\'s free is a nice plus). But personally, I prefer self hosting. You can totally download this HTML file and later transfer it to whatever host you\'d like.',
    options: {
      ok: (e) => {
        TUTORIAL.ratherNotGitHub = true
        e.goTo('download-it')
      },
      '...actually, explain GitHub again': (e) => e.goTo('github')
    }
  }, {
    id: 'github',
    content: '<a href="https://github.com/" target="_blank">GitHub</a> is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio". I can save your projects to GitHub for you, but I need to know your GitHub account.',
    options: {
      'ok, how\'s that work?': (e) => e.goTo('how-github'),
      'what if I don\'t have a GitHub': (e) => e.goTo('what-if-no-github'),
      'oh, never mind then': (e) => e.goTo('rather-not')
    }
  }, {
    id: 'how-github',
    content: 'I\'ll send you over to GitHub, from there you can let them know you want to authorize me to save and upload projects to your account. After that they\'ll send you back here and we\'ll take it from there.',
    options: {
      'ok, let\'s do it!': (e) => {
        const str = JSON.stringify({
          tutorial: 'kings-x', id: 'create-new-project-redirect' // TODO
        })
        WIDGETS['functions-menu']._githubAuth(str)
      },
      'what if I don\'t have a GitHub': (e) => e.goTo('what-if-no-github'),
      'actually, never mind': (e) => e.goTo('rather-not')
    }
  }, {
    id: 'what-if-no-github',
    content: 'Not a problem, when I send you over to GitHub they\'ll walk you through the process of creating a new account. Once you\'ve got that setup, you can authorize me to so save and upload projects and then GitHub should send you back over here so we can keep working together.',
    options: {
      'ok, let\'s do it!': (e) => {
        const str = JSON.stringify({
          tutorial: 'kings-x', id: 'create-new-project-redirect'
        })
        WIDGETS['functions-menu']._githubAuth(str)
      },
      'actually, never mind': (e) => e.goTo('rather-not')
    }
  },
  // ----------------------------- [ END GITHUB ] ------------------------------
  {
    id: 'create-new-project-redirect',
    before: () => {
      // TODO
    },
    content: `Welcome back ${window.localStorage.getItem('username')} or should I say <i>${window.localStorage.getItem('owner')}</i>, now that I know your GitHub account you can use the <code>saveProject()</code> and <code>openProject()</code> functions in the Functions Menu (keep in mind, I'm still in <i>beta</i> so there may be bugs)`,
    options: { 'duly noted': (e) => e.goTo('save-it') }
  }, {
    id: 'save-it',
    content: `To save your project to GitHub you can use my <code>saveProject()</code> function, which you can find in the <b>my project</b> menu by clicking my face and then clicking <img src="images/menu/functions.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; margin-bottom: -14px;">. Alternatively, you can search for the <i>saveProject</i> function using the search bar by clicking <img src="images/menu/search.png" style="width: 31px; background-color: var(--netizen-tag); padding: 4px; border-radius: 50%; margin-bottom: -14px;"> after clicking my face, or use the <b>${Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'}+"</b> (that's ${Averigua.platformInfo().platform.includes('Mac') ? 'command' : 'control'} quote) shortcut key.`,
    options: { ok: (e) => e.goTo('publish-it') }
  }, {
    id: 'publish-it',
    content: 'After you\'ve saved your work to your GitHub portfolio, we can use their servers to publicly host our Internet art for the world to see. In that same <b>my project</b> menu (or via the search) you\'ll find a <code>shareLink()</code> function which you can use to publish your work. After you run that I\'ll be able to generate a URL for your GitHub hosted project.',
    options: { ok: (e) => e.goTo('in-closing') }
  }, {
    id: 'in-closing',
    before: () => {
      WIDGETS['eva-and-franco'].close()
    },
    content: 'That\'s where I\'ll end this tutorial!',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'test',
    content: 'test',
    options: { ok: (e) => e.goTo('test') }
  }],

  widgets: {
    'mosaic-browser': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Mosaic Web Browser',
      innerHTML: '<img style="width: 100%" alt="Mosaic Web Browser" src="tutorials/kings-x/images/mosaic-headless.jpg">'
    }),
    'heath-and-kayle': new Widget({
      width: window.innerWidth * 0.33,
      title: 'http://irational.org/',
      innerHTML: '<img style="width: 100%" alt="Mosaic Web Browser" src="tutorials/kings-x/images/bunting-brandon.jpg"><p>This Selfie, taken by Kayle Brandon of herself and collaborator Heath Bunting, documents the artists illegally crossing the border between <a href="http://irational.org/heath/borderxing/it.fr/" target="_blank">Pigna, Italy and Soarge, France</a> as part of their project <a href="http://irational.org/borderxing/home.html" target="_blank">BorderXing Guide</a></p>'
    }),
    'html-diagram1': new Widget({
      width: window.innerWidth * 0.5,
      title: 'Anatomy of an HTML Element',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/kings-x/images/html1.png">'
    }),
    'html-diagram2': new Widget({
      width: window.innerWidth * 0.5,
      title: 'HTML Element Attributes',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/kings-x/images/html2.png">'
    }),
    'jodi-quote': new Widget({
      width: 817,
      listed: false,
      title: 'mistakes, code and art',
      innerHTML: '<blockquote style="font-size: 22px; line-height: 25px;">"The mistake is nothing wrong, the computer keeps working. Something wrong still works, there\'s nothing wrong with something wrong"</blockquote><div style="text-align:right; font-size: 22px; line-height: 25px;">—jodi.org</div>'
    }),
    'greene-quote': new Widget({
      width: 817,
      listed: false,
      title: 'from Web Work: A History of Internet Art',
      innerHTML: '<blockquote style="font-size: 22px; line-height: 25px;">"The calls created a musical intervention that disrupted the daily routine of the urban transportation hub, as commuters circulating through the station chatted with strangers from around the world who were ringing up to say hello. Network functionality was understood on the level of the friendly phone call, as public space was reconfigured aurally and socially. Bunting\'s modus operandi since 1994 has been to create works/events that ware as facile, low-tech, and straightforward as graffiti: simple subversions backed by anarchic conviction. To netizens he is something of a folk hero."</blockquote><div style="text-align:right; font-size: 22px; line-height: 25px;">—Rachel Greene</div>'
    }),
    'jodi-my-desktop': new Widget({
      width: window.innerWidth * 0.5,
      title: 'My%Desktop by jodi.org (MoMA)',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/kings-x/images/jodi-my-desktop.png"><p>JODI recorded various versions of My%Desktop in front of live audiences, connecting their Macintosh to a camcorder and capturing their interactions with the user-friendly OS 9 operating system. The resulting “desktop performances,” as the artists call them, look at ways that seemingly rational computer systems may provoke irrational behavior in people, whether because they are overwhelmed by an onslaught of online data, or inspired by possibilities for play. What appear to be computer glitches are actually the chaotic actions of a user. “The computer is a device to get into someone’s mind,” JODI explained, adding, “We put our own personality there.”</p>'
    }),
    'arab-spring': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Twitter and the Arab Spring',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/kings-x/images/arab-spring.jpg"><p>Egyptians use their mobile phones to record celebrations in Cairo\'s Tahrir Square, the epicenter of the popular revolt that drove Hosni Mubarak from power in 2011. Twitter was often used to record happenings during the Arab Spring. Image: Mohammed Abed/AFP/Getty Images</p>'
    }),
    'eva-and-franco': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Life Sharing by Eva and Franco Mattes',
      innerHTML: '<img style="width: 100%" alt="the Internt" src="tutorials/kings-x/images/life-sharing.jpg"><p>"For three years, the couple made the contents of their home computer accessible to the public. All of the contents–including files, emails, bank statements, and so on–were available in real time to be read, copied, and downloaded. Life Sharing was a proto-typical meditation on living online. Made long before social media’s widespread influence, the work pointed towards the blurring of the public and private spheres that characterize our current moment. " (source: <a href="https://anthology.rhizome.org/life-sharing" target="_blank">Net Art Anthology</a>)</p>'
    })
  },

  startSetup: () => {
    if (STORE.state.layout !== 'welcome') {
      STORE.dispatch('CHANGE_LAYOUT', 'welcome')
    }
    WIDGETS['tutorials-menu'].close()
    WIDGETS['mosaic-browser'].open()
    TUTORIAL.styleMosaicWidget()
    WIDGETS['mosaic-browser'].update({ left: 132, top: 60 }, 500)
  },

  styleMosaicWidget: () => {
    WIDGETS['mosaic-browser'].ele.style.padding = '0'
    WIDGETS['mosaic-browser'].ele.querySelector('.w-top-bar').style.padding = '10px 15px'
    WIDGETS['mosaic-browser'].ele.querySelector('.w-top-bar').style.marginBottom = '0'
    WIDGETS['mosaic-browser'].ele.querySelector('.w-innerHTML').style.padding = '0'
  },

  codeStep: (n) => {
    const c = [
      '<!DOCTYPE html>',
      '<title>Cybercafe Net Art Projects - kings X Press Release.</title>',
      '<img>',
      '<img src="cclogo.gif">',
      '<img src="cclogo.gif" alt="the cybercafe logo">',
      '<img src="cclogo.gif" alt="the cybercafe logo"><p>', // 5
      '<h1>@ kings x</h1>',
      '<h3>phone in</h3>',
      '<b>RELEASE</b>', // 8
`<p>
  During the day of Friday 5th August 1994
  the telephone booth area behind the destination board
  at kings X British Rail station will be borrowed
  and used for a temporary cybercafe.
</p>

<p>
  It would be good to concentrate activity around 18:00 GMT,
  but play as you will.
</p>`, // 9
`<p>
  During the day of Friday 5th August 1994<br>
  the telephone booth area behind the destination board<br>
  at kings X British Rail station will be borrowed<br>
  and used for a temporary cybercafe.
</p>

<p>
  It would be good to concentrate activity around 18:00 GMT,<br>
  but play as you will.
</p>`, // 10
`TELEPHONE Nos.
<pre>
0171 278 2207 ....................... 0171 387 1736
0171 278 2208 ....................... 0171 387 1756
0171 837 6028 ....................... 0171 387 1823
0171 837 5193 ....................... 0171 278 2179
0171 837 6417 ....................... 0171 278 2163
0171 278 4290 ....................... 0171 278 2083
0171 837 1034 ....................... 0171 387 1362
0171 837 7959 ....................... 0171 278 2017
0171 837 1644 ....................... 0171 387 1569
0171 837 7234 ....................... 0171 387 1526
0171 837 1481 ....................... 0171 387 1587
0171 837 0867 ....................... 0171 837 0298
0171 278 7259 ....................... 0171 837 0399
0171 278 2502 ....................... 0171 837 1768
0171 278 2501 ....................... 0171 387 1398
0171 278 2275 ....................... 0171 837 3758
0171 278 2217 ....................... 0171 837 0933
0171 278 2260 ....................... 0171 837 0499
</pre>`, // 11
`<p>
  Please do any combination of the following:
</p>

<p>
  (1) call no./nos. and let the phone ring a short while and then hang up<br>
  (2) call these nos. in some kind of pattern<br>
  (the nos. are listed as a floor plan of the booth)<br>
  (3) call and have a chat with an expectant or unexpectant person<br>
  (4) go to Kings X station watch public reaction/answer the phones and chat<br>
  (5) do something different
</p>

<p>
  This event will be publicised worldwide
</p>

<p>
  I will write a report stating that:<br>
  (1) no body rang<br>
  (2) a massive techno crowd assembled
  and danced to the sound of ringing telephones<br>
  (3) something unexpected happened
</p>

<p>
  No refreshments will be provided/please bring pack lunch
</p>`, // 12
`<p>
  Please do any combination of the following:
</p>

<ol>
  <li>call no./nos. and let the phone ring a short while and then hang up</li>
  <li>call these nos. in some kind of pattern</li>
  <li>(the nos. are listed as a floor plan of the booth)</li>
  <li>call and have a chat with an expectant or unexpectant person</li>
  <li>go to Kings X station watch public reaction/answer the phones and chat</li>
  <li>do something different</li>
</ol><p>
  This event will be publicised worldwide
</p>

<p>
  I will write a report stating that:
  <ol>
    <li>no body rang</li>
    <li>a massive techno crowd assembled and danced to the sound of ringing telephones</li>
    <li>something unexpected happened</li>
  </ol>
</p>

<p>
  No refreshments will be provided/please bring pack lunch
</p>`, // 13
'<hr>',
'<a href="mailto:heath@cybercafe.org">heath@cybercafe.org</a>',
'heath@<a href="mailto:heath@cybercafe.org">cyber</a>cafe.org' // 16
    ]

    function combine (arr) {
      const str = []
      arr.forEach(i => str.push(c[i]))
      return str.join('\n')
    }

    if (n === 0) return combine([0])
    else if (n === 1) return combine([0, 1])
    else if (n === 2) return combine([0, 1, 3])
    else if (n === 3) return combine([0, 1, 4])
    else if (n === 4) return combine([0, 1, 5])
    else if (n === 5) return combine([0, 1, 4, 6])
    else if (n === 6) return combine([0, 1, 4, 6, 7])
    else if (n === 7) return combine([0, 1, 4, 6, 7, 8])
    else if (n === 8) return combine([0, 1, 4, 6, 7, 8, 9])
    else if (n === 9) return combine([0, 1, 4, 6, 7, 8, 10])
    else if (n === 10) return combine([0, 1, 4, 6, 7, 8, 10, 11])
    else if (n === 11) return combine([0, 1, 4, 6, 7, 8, 10, 11, 12])
    else if (n === 12) return combine([0, 1, 4, 6, 7, 8, 10, 11, 13])
    else if (n === 13) return combine([0, 1, 4, 6, 7, 8, 10, 11, 13, 14])
    else if (n === 14) return combine([0, 1, 4, 6, 7, 8, 10, 11, 13, 14, 15])
    else if (n === 15) return combine([0, 1, 4, 6, 7, 8, 10, 11, 13, 14, 16])
  },

  kingsX: `<TITLE>Cybercafe Net Art Projects - kings X Press Release.</TITLE>

<IMG ALIGN = bottom src="cclogo.gif"><p>

<h1>@ kings x</h1>

<h3>phone in</h3>

<b>RELEASE</b><p>

During the day of Friday 5th August 1994<br>
the telephone booth area behind the destination board<br>
at kings X British Rail station will be borrowed<br>
and used for a temporary cybercafe.<p>

It would be good to concentrate activity around 18:00 GMT,<br>
but play as you will.<p>

TELEPHONE Nos.
<PRE>
0171 278 2207 ....................... 0171 387 1736
0171 278 2208 ....................... 0171 387 1756
0171 837 6028 ....................... 0171 387 1823
0171 837 5193 ....................... 0171 278 2179
0171 837 6417 ....................... 0171 278 2163
0171 278 4290 ....................... 0171 278 2083
0171 837 1034 ....................... 0171 387 1362
0171 837 7959 ....................... 0171 278 2017
0171 837 1644 ....................... 0171 387 1569
0171 837 7234 ....................... 0171 387 1526
0171 837 1481 ....................... 0171 387 1587
0171 837 0867 ....................... 0171 837 0298
0171 278 7259 ....................... 0171 837 0399
0171 278 2502 ....................... 0171 837 1768
0171 278 2501 ....................... 0171 387 1398
0171 278 2275 ....................... 0171 837 3758
0171 278 2217 ....................... 0171 837 0933
0171 278 2260 ....................... 0171 837 0499
</PRE>

Please do any combination of the following:<p>
(1) call no./nos. and let the phone ring a short while and then hang up<br>
(2) call these nos. in some kind of pattern<br>
(the nos. are listed as a floor plan of the booth)<br>
(3) call and have a chat with an expectant or unexpectant person<br>
(4) go to Kings X station watch public reaction/answer the phones and chat<br>
(5) do something different<p>

This event will be publicised worldwide<p>

I will write a report stating that:<br>
(1) no body rang<br>
(2) a massive techno crowd assembled
and danced to the sound of ringing telephones<br>
(3) something unexpected happened<p>

No refreshments will be provided/please bring pack lunch<p>

<hr>

heath@<A HREF="mailto:heath@cybercafe.org">cyber</a>cafe.org<br>
`
}
