/* global NNE Widget WIDGETS HyperVidPlayer, utils, TUTORIAL, NNW, STORE */
window.TUTORIAL = {
  onload: () => {
    NNE.addCustomRoot('tutorials/css-intro/')
    utils.get('tutorials/css-intro/david-khourshid.html', (txt) => {
      NNE.lint = false
      NNE.code = txt
    }, true)
  },

  steps: [{
    id: 'a-new-language',
    before: () => {
      NNE.lint = false
      utils.get('tutorials/css-intro/david-khourshid.html', (txt) => {
        if (NNE.code !== txt) {
          NNE.lint = false
          NNE.code = txt
        }
      }, true)
      STORE.dispatch('CHANGE_LAYOUT', 'welcome')
      NNW._whenCSSTransitionFinished(() => {
        NNW.updatePosition(null, window.innerHeight - NNW.win.offsetHeight - 40)
      })
    },
    content: 'Around the same time that the first net.artists were creating their first HTML experiments, the creators of the Web were discussing the creation of a new coding language to accompany HTML.',
    options: {
      'creators of the web?': (e) => e.goTo('creators-of-the-web?-2'),
      ok: (e) => e.goTo('nn-8')
    }
  }, {
    id: 'creators-of-the-web?-2',
    content: 'The Web, and it\'s core language HTML, was first proposed by Tim Berners-Lee in 1989. But HTML is really only just an "idea" until there was some browser that could actually interpret code written in that language. So a year later Tim, with the help of his collaborators Robert Cailliau and Nicola Pellow, created the first web browsers.',
    options: { ok: (e) => e.goTo('creators-of-the-web?-3') }
  }, {
    id: 'creators-of-the-web?-3',
    content: 'But Tim didn\'t want to be the only person dictating what the Web would become. Having seen the value of openness, collaboration and decentralization in the evolution of the Internet, he figured if the Web was to become the Net\'s defacto hypermedia platform, it too needed to be open and collaborative.',
    options: { ok: (e) => e.goTo('creators-of-the-web?-4') }
  }, {
    id: 'creators-of-the-web?-4',
    content: 'So he started the <a href="https://www.w3.org/" target="_blank">The World Wide Web Consortium</a>, or W3C for short, which is a "standards organization" that anyone can join (there are over <a href="https://www.w3.org/Consortium/Member/List" target="_blank">400 member groups</a> in total) which discuss and define how the Web should work. They\'re constantly coming up with new ideas for things we should be able to do on the Web and so HTML and CSS are constantly evolving.',
    options: { ok: (e) => e.goTo('creators-of-the-web?-5') }
  }, {
    id: 'creators-of-the-web?-5',
    content: 'They release these rules and designs in technical documents known as specifications, or "specs" for short. Programmers developing browsers, like Chrome or Firefox, use these specs as guides or blueprints for how the HTML code you and I write needs to be interpreted and displayed, or "rendered", onto the screen.',
    options: {
      'what does a spec look like?': (e) => e.goTo('creators-of-the-web?-6'),
      ok: (e) => e.goTo('creators-of-the-web?-7')
    }
  }, {
    id: 'creators-of-the-web?-6',
    content: 'They\'re very technical and written for programmers developing Web browsers, but I always find it interesting to see what those sort of things look like even if I don\'t understand it all, here\'s the spec for the <a href="https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element" target="_blank">img</a> element for example.',
    options: { ok: (e) => e.goTo('creators-of-the-web?-7') }
  }, {
    id: 'creators-of-the-web?-7',
    content: 'Before releasing a spec the W3C members usually discuss their ideas over email or on GitHub, both of which are intentionally published openly online for any curious netizen to read. Here\'s a discussion on <a href="https://github.com/w3c/csswg-drafts/issues/5608" target="_blank">how img width and heights</a> should work, and here\'s another discussing <a href="https://github.com/w3c/csswg-drafts/issues/4770" target="_blank">the future of CSS!</a>.',
    options: { 'fascinating!': (e) => e.goTo('nn-8') }
  }, {
    id: 'nn-8',
    content: 'At a Web conference in Chicago in 1994, Håkon W Lie debuted the first draft of what would eventually become a coding language called Cascading Style Sheets or CSS.',
    options: { ok: (e) => e.goTo('nn-9') }
  }, {
    id: 'nn-9',
    content: 'The goal behind CSS was to separate a project\'s "presentation", the way it looks, from it\'s structured content, all the HTML elements.',
    options: { ok: (e) => e.goTo('nn-10') }
  }, {
    id: 'nn-10',
    content: 'The separation of a document’s content and its presentation is a popular tech-design philosophy. It means you can display the same content (HTML) in different ways (ie. with different "styles") for different contexts: laptops, smart phones, in print, on a braille tactile device, etc.',
    options: { 'seems useful': (e) => e.goTo('nn-11') }
  }, {
    id: 'nn-11',
    content: 'It also means a text-to-speech app can understand what\'s "content" and what\'s not. Additionally, Web reader-views/apps can override the default CSS and use alternative "presentations".',
    options: { 'that also sounds important': (e) => e.goTo('nn-12') }
  }, {
    id: 'nn-12',
    content: 'Depending on how you implement your CSS, it also enables you to make site-wide changes in a single document which can make updating a site, or even redesigning the entire aesthetic, drastically easier.',
    options: { convenient: (e) => e.goTo('nn-13') }
  }, {
    id: 'nn-13',
    content: 'Technically a web-page doesn\'t <i>require</i> CSS. As we\'ve noticed in our previous HTML-only experiments, our web-page will always look like something. But if we ever want to change any aspect of how our HTML page looks, that\'s where CSS comes in.',
    options: { ok: (e) => e.goTo('nn-14') }
  }, {
    id: 'nn-14',
    before: () => {
      WIDGETS['idea-channel'].open()
      WIDGETS['idea-channel'].update({ left: 20, top: 20 }, 500)

      WIDGETS['-Idea-Channel-quote-w1'].open()
      WIDGETS['-Idea-Channel-quote-w1'].update({ right: 20, top: 20 }, 500)
    },
    content: 'As artists, writing CSS is about more than just changing "the defaults" however. As Internet culture video essayists "Idea Channel" explain, if the HTML default look is like a web-page\'s "clothes" CSS, in all it\'s expressive potential, is like "fashion". Take a few mins to watch their video to hear more on that.',
    options: { 'ok, let\'s move on': (e) => e.goTo('css-art') }
  }, {
    id: 'css-art',
    before: () => {
      utils.get('tutorials/css-intro/david-khourshid.html', (txt) => {
        if (NNE.code !== txt) {
          NNE.lint = false
          NNE.code = txt
        }
      }, true)
      STORE.dispatch('CHANGE_LAYOUT', 'welcome')
      NNW._whenCSSTransitionFinished(() => {
        NNW.updatePosition(null, window.innerHeight - NNW.win.offsetHeight - 40)
      })
      WIDGETS['idea-channel'].close()
      WIDGETS['-Idea-Channel-quote-w1'].close()
    },
    content: 'Though CSS is typically understood to be the stylistic layer of a project, handling layout, color and typography, today it has grown into an incredibly expressive language.',
    options: { 'how so?': (e) => e.goTo('nn-16') }
  }, {
    id: 'nn-16',
    content: 'Because CSS is now capable of handling all sorts of interactions and animations, for artists in the "CSS Art" scene it has become the central focus of the work itself.',
    options: { 'CSS Art?': (e) => e.goTo('nn-17') }
  }, {
    id: 'nn-17',
    content: 'The piece you see behind me, called "<a href="https://codepen.io/davidkpiano/pen/Xempjq" target="_blank">Cat Swinging on String</a>", was produced by CSS artist <a href="https://codepen.io/davidkpiano" target="_blank">David Khourshid</a>. This was done entirely with HTML and CSS, including the animation.',
    options: { wow: (e) => e.goTo('nn-18') }
  }, {
    id: 'nn-18',
    content: 'Typically things like interaction and animations are handled via programming languages like JavaScript, but CSS artists intentionally make it a point to avoid JavaScript in favor of producing work entirely out of CSS code, simply because they can.',
    options: { 'I see': (e) => e.goTo('nn-19') }
  }, {
    id: 'nn-19',
    before: () => {
      WIDGETS['the-mine-w2'].open()
      WIDGETS['the-mine-w2'].update({ left: 20, top: 20 }, 500)
    },
    content: 'Creating interactive animations is arguably much easier using a programming language like JavaScript, but the CSS artists are motivated by the challenge of pushing CSS to it\'s limits. For example, artist <a href="https://codepen.io/jcoulterdesign" target="_blank">Jamie Coulter</a> created an entire 8-bit style video game with CSS called <a href="https://codepen.io/jcoulterdesign/pen/NOMeEb" target="_blank">The Mine</a>',
    options: { ok: (e) => e.goTo('nn-20') }
  }, {
    id: 'nn-20',
    content: 'CSS artists often congregate and share their work on site\'s like <a href="https://codepen.io/trending" target="_blank">CodePen</a> where they will often tag their work with "CSS only", "Pure CSS" or "No JS" to emphasize this point.',
    options: { ok: (e) => e.goTo('nn-21') }
  }, {
    id: 'nn-21',
    before: () => {
      WIDGETS['the-mine-w2'].close()
      // WIDGETS['Single-Element-MacBook-w3'].open()
      // WIDGETS['Single-Element-MacBook-w3'].update({ left: 20, top: 20 }, 500)
      STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
      utils.get('tutorials/css-intro/joshua-hibbert.html', (txt) => {
        TUTORIAL.bg = txt
        NNE.lint = true
        NNE.code = txt
      }, true)
    },
    content: 'Some go even further and create CSS compositions limiting themselves to a single HTML element, like this <a href="https://codepen.io/joshnh/pen/JCGoF" target="_blank">Single Element Pure CSS MacBook Pro</a> by Joshua Hibbert.',
    options: { 'single element?': (e) => e.goTo('nn-22') }
  }, {
    id: 'nn-22',
    content: 'Besides the style tag containing the CSS code, the only HTML tags on this page belong to a single <code>&lt;i&gt;</code> element. Scroll to the bottom of my editor and see for yourself.',
    options: { wow: (e) => e.goTo('nn-22-b') }
  }, {
    id: 'nn-22-b',
    content: 'Feel free to experiment a bit with his code if you\'re curious to see how it works. Let me know when you\'re finished playing with it and we\'ll move on',
    options: { 'ok, let\'s move on': (e) => e.goTo('nn-23') }
  }, {
    id: 'nn-23',
    code: `<!DOCTYPE html>
<style>
  html {
    background-image: linear-gradient(#8b9da9, #fff6e4);
    box-shadow: inset 0 0 100px hsla(0, 0%, 0%, 0.3);
    min-height: 100%;
  }
</style>
`,
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'welcome')
      WIDGETS['Diana-Smith-Interview'].open()
      WIDGETS['Diana-Smith-Interview'].update({ left: 20, top: 20 }, 500)
      WIDGETS['Diana-Smith-Interview'].play()
      NNW._whenCSSTransitionFinished(() => {
        const x = window.innerWidth - window.NNW.win.offsetWidth - 20
        const y = window.innerHeight - window.NNW.win.offsetHeight - 20
        NNW.updatePosition(x, y)
      })
    },
    content: 'While Joshua\'s piece is an unquestionably clever and creative use of CSS, the CSS thrown belongs to <a href="https://diana-adrianne.com/" target="_blank">Diana A Smith</a>, the greatest CSS virtuoso of all time (in this humble bots opinion).',
    options: { amazing: (e) => e.goTo('nn-24') }
  }, {
    id: 'nn-24',
    before: () => {
      WIDGETS['Diana-Smith-Interview'].close()
      NNW.updatePosition()

      WIDGETS['Francine-by-Diana-A-Smith-w8'].open()
      WIDGETS['Francine-by-Diana-A-Smith-w8'].update({ left: 20, top: 20 }, 500)

      WIDGETS['Pure-CSS-Gaze-by-Diana-A-Smith-w5'].open()
      WIDGETS['Pure-CSS-Gaze-by-Diana-A-Smith-w5'].update({ left: 288, top: 164 }, 500)

      WIDGETS['Pure-CSS-Lace-by-Diana-A-Smith-w6'].open()
      WIDGETS['Pure-CSS-Lace-by-Diana-A-Smith-w6'].update({ left: 114, top: 407 }, 500)

      WIDGETS['Pure-CSS-Pink-by-Diana-A-Smith-w7'].open()
      WIDGETS['Pure-CSS-Pink-by-Diana-A-Smith-w7'].update({ left: 590, top: 391 }, 500)

      NNW.updatePosition(window.innerWidth - NNW.win.offsetWidth - 20)
    },
    content: 'Her works defy the browser\'s limitations and (must) baffle even the Web\'s creators. In order to pull off some complex compositions using only HTML and CSS Diana makes use of the most modern CSS properties available... which has an interesting side effect.',
    options: { 'like what?': (e) => e.goTo('nn-25') }
  }, {
    id: 'nn-25',
    content: 'When the W3C creates new CSS properties, these only exist in theory, until the browser vendors actually build the new functionality into browsers. This usually takes some time, browsers like Chrome and Firefox are quick to implement these updates, but other browsers like Safari and Internet Explorer often lag behind.',
    options: { 'I see': (e) => e.goTo('nn-26') }
  }, {
    id: 'nn-26',
    before: () => {
      WIDGETS['Francine-by-Diana-A-Smith-w8'].close()
      WIDGETS['Pure-CSS-Gaze-by-Diana-A-Smith-w5'].close()
      WIDGETS['Pure-CSS-Lace-by-Diana-A-Smith-w6'].close()
      WIDGETS['Pure-CSS-Pink-by-Diana-A-Smith-w7'].close()

      WIDGETS['Francine-(Windows-98-IE-7)-w12'].open()
      WIDGETS['Francine-(Windows-98-IE-7)-w12'].update({ left: 20, top: 20 }, 500)

      WIDGETS['Francine-(Chrome-9)-w9'].open()
      WIDGETS['Francine-(Chrome-9)-w9'].update({ left: 353, top: 116 }, 500)

      WIDGETS['Francine-(Windows-7-IE-11)-w11'].open()
      WIDGETS['Francine-(Windows-7-IE-11)-w11'].update({ left: 100, top: 356 }, 500)

      WIDGETS['Francine-(Mac-Opera)-w10'].open()
      WIDGETS['Francine-(Mac-Opera)-w10'].update({ left: 537, top: 399 }, 500)
    },
    content: 'Like the "form art" we discussed in the last lesson, this means that Diana\'s pieces will inevitably display differently in different browsers. The result of which are unintentional modernist remixes of her otherwise Renaissance style works.',
    options: { interesting: (e) => e.goTo('css-basics') }
  }, {
    id: 'css-basics',
    code: `<!DOCTYPE html>
<style>
  html {
    background-image: linear-gradient(#8b9da9, #fff6e4);
    box-shadow: inset 0 0 100px hsla(0, 0%, 0%, 0.3);
    min-height: 100%;
  }
</style>
`,
    before: () => {
      WIDGETS['Francine-(Windows-98-IE-7)-w12'].close()
      WIDGETS['Francine-(Chrome-9)-w9'].close()
      WIDGETS['Francine-(Windows-7-IE-11)-w11'].close()
      WIDGETS['Francine-(Mac-Opera)-w10'].close()
      STORE.dispatch('CHANGE_LAYOUT', 'welcome')
      NNW._whenCSSTransitionFinished(() => {
        NNW.updatePosition()
      })
      NNE.lint = true
    },
    content: 'Before we can create our own CSS art masterpieces, we\'ll need to get acquainted with the basics.',
    options: { ok: (e) => e.goTo('nn-28') }
  }, {
    id: 'nn-28',
    before: () => {
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
    },
    code: `<!DOCTYPE html>
<div style="font-size: 50px; color: green;"> hello! </div>
    `,
    content: 'CSS consists of a list of <b>properties</b> which can be assigned different <b>values</b> to change various characteristics of your HTML elements. You can apply CSS properties to a specific element on your page by writing some CSS code in that element\'s <code>style</code> attribute like this.',
    options: { ok: (e) => e.goTo('nn-29') }
  }, {
    id: 'nn-29',
    content: 'Here I\'ve created a <code>&lt;div&gt;</code> and changed the font-size to 50px and it\'s color to green. Notice that the property is always followed by a <code>:</code> (colon) and the value is always followed by a <code>;</code> (semi-colon). These are the two main pieces of syntax for a CSS "<b>declaration</b>" which is what we call a CSS property and value pair.',
    options: { ok: (e) => e.goTo('nn-30') }
  }, {
    id: 'nn-30',
    content: 'This is known as "inline styling", because we\'re writing the CSS directly in the same line of code as the HTML element. We typically don\'t write our CSS declarations inline though. What\'s more common is creating CSS <b>rules</b>.',
    options: { ok: (e) => e.goTo('nn-31') }
  }, {
    id: 'nn-31',
    code: `<!DOCTYPE html>
<style>
  /* CSS rules go here */
</style>
<div> hello! </div>
    `,
    content: 'Let\'s create a pair of <code>&lt;style&gt;</code> tags above our <code>&lt;div&gt;</code> and remove the <code>style</code> attribute from the element.',
    options: { ok: (e) => e.goTo('nn-32') }
  }, {
    id: 'nn-32',
    code: `<!DOCTYPE html>
<style>
  div {
    font-size: 50px;
    color: green;
  }
</style>
<div> hello! </div>
    `,
    before: () => {
      WIDGETS['css-rule-w13'].open()
      WIDGETS['css-rule-w13'].update({ right: 20, bottom: 20 }, 500)
    },
    content: 'In there we can declare a CSS rule, which contains two parts, a <b>selector</b> which specifies which element(s) the rules will be applied to, and a <code>{</code> <b>declaration block</b> <code>}</code>, surrounded by curly brackets, which contains the CSS property/value pairs, or "<b>declarations</b>", specifying how the element should be styled.',
    options: { ok: (e) => e.goTo('css-selectors') }
  }, {
    id: 'css-selectors',
    code: `<!DOCTYPE html>
<style>
  div {
    font-size: 50px;
    color: green;
  }
</style>
<div> hello! </div>
    `,
    before: () => {
      NNE.lint = true
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
    },
    content: 'There are different ways of writing CSS <b>selectors</b>, in this example we have what\'s called a <i>type</i> selector, because it\'s specifying a type of element, in this case any and all <code>div</code> elements.',
    options: { ok: (e) => e.goTo('nn-34') }
  }, {
    id: 'nn-34',
    code: `<!DOCTYPE html>
<style>
  div {
    font-size: 50px;
    color: green;
  }
</style>
<div> hello! </div>
<div> how are you? </div>
    `,
    content: 'If we add another <code>&lt;div&gt;</code> to our page it will also have that CSS rule applied because it matches the <b>selector</b>.',
    options: { ok: (e) => e.goTo('nn-35') }
  }, {
    id: 'nn-35',
    code: `<!DOCTYPE html>
<style>
  div {
    font-size: 50px;
    color: green;
  }
</style>
<div> hello! </div>
<div> how are you? </div>
<section> goodbye! </section>
    `,
    content: 'But, notice that if we add a <code>&lt;section&gt;</code> element to our page, the CSS rule we defined does not apply to it, because it does not match the <b>selector</b>.',
    options: { ok: (e) => e.goTo('nn-36') }
  }, {
    id: 'nn-36',
    code: `<!DOCTYPE html>
<style>
  div, section {
    font-size: 50px;
    color: green;
  }
</style>
<div> hello! </div>
<div> how are you? </div>
<section> goodbye! </section>
    `,
    content: 'If we did want that particular rule to apply not only to <code>div</code> elements but also to <code>section</code> elements, then we could add that element name to our <b>selector</b>, separated by a comma. This is how we apply the same rule set to different selectors.',
    options: { ok: (e) => e.goTo('nn-37') }
  }, {
    id: 'nn-37',
    content: 'There are many other kinds of selectors which give you different ways of targeting specific elements to apply your CSS rules to. The most common selector is likely to be the <i>class</i> selector which targets any element whose class attribute\'s value matches that of the class name.',
    options: { ok: (e) => e.goTo('nn-38') }
  }, {
    id: 'nn-38',
    code: `<!DOCTYPE html>
<style>
  .fancy-font {
    font-family: fantasy;
  }
  div, section {
    font-size: 50px;
    color: green;
  }
</style>
<div class="fancy-font"> hello! </div>
<div> how are you? </div>
<section> goodbye! </section>
    `,
    content: 'Say for example we wanted to change the <code>font-family</code> (aka the typeface) of only the first <code>div</code> and not the second one. We could create a new CSS rule with a <i>class</i> selector and apply it only to that <code>div</code> using it\'s <code>class</code> attribute.',
    options: { ok: (e) => e.goTo('nn-39') }
  }, {
    id: 'nn-39',
    code: `<!DOCTYPE html>
<style>
  .fancy-font {
    font-family: fantasy;
  }
  div, section {
    font-size: 50px;
    color: green;
  }
</style>
<div class="fancy-font"> hello! </div>
<div> how are you? </div>
<section> goodbye! </section>
<p class="fancy-font">see ya soon!</p>
    `,
    content: 'We can apply a class to as many different elements as we want. Here you can see I applied it to a <code>p</code> tag. This new element has its default <code>font-family</code> changed, but not it\'s size or color because those declarations are part of the <code>div, section</code> rule set which do not apply to <code>p</code> elements.',
    options: { ok: (e) => e.goTo('nn-40') }
  }, {
    id: 'nn-40',
    code: `<!DOCTYPE html>
<style>
  .fancy-font {
    font-family: fantasy;
  }
  div, section {
    font-size: 50px;
    color: green;
  }
  div.fancy-font+div {
    font-style: italic;
    background-color: pink;
  }
</style>
<div class="fancy-font"> hello! </div>
<div> how are you? </div>
<section> goodbye! </section>
<p class="fancy-font">see ya soon!</p>
    `,
    content: 'There\'s loads of other ways to write selectors. You can get real crafty and specific with them, for example if we wanted to target that second div only we could write a selector like this <code>div.fancy-font+div</code>.',
    options: { ok: (e) => e.goTo('nn-41') }
  }, {
    id: 'nn-41',
    content: 'Anytime you see a selector you don\'t understand you can double click it and I\'ll explain it to you. But if you\'re curious to learn more about the various types of selectors take a look at these <a href="https://github.com/netizenorg/netnet.studio/blob/master/www/tutorials/css-intro/selectors.md" target="_blank">selector notes</a>.',
    options: { ok: (e) => e.goTo('nn-42') }
  }, {
    id: 'nn-42',
    code: `<!DOCTYPE html>
<style>
  .fancy-font {
    font-family: fantasy;
  }
  div, section {
    font-size: 50px;
    color: green;
  }
  .greet {
    font-style: italic;
    background-color: pink;
  }
</style>
<div class="fancy-font"> hello! </div>
<div class="greet"> how are you? </div>
<section> goodbye! </section>
<p class="fancy-font">see ya soon!</p>
    `,
    content: 'Generally speaking, you can do 99% of what you want using only type selectors and class selectors. I could have just as easily done this, instead of using that fancy selector, and gotten the same effect.',
    options: { ok: (e) => e.goTo('nn-43') }
  }, {
    id: 'nn-43',
    content: 'But there are certain situations where you might need fancier logic in determining which elements you want to apply the CSS to, especially if, for example, you don\'t have access to the HTML itself and thus can\'t add a class attribute as I just did here.',
    options: { ok: (e) => e.goTo('nn-44') }
  }, {
    id: 'nn-44',
    content: 'This might be the case if and when you\'re creating a web scraper or a browser extention/add-on... but those are topics for another lesson. For now, just know that there are lots of ways to write <b>selectors</b> and if you\'d like to learn more about them you can take a look at these <a href="https://github.com/netizenorg/netnet.studio/blob/master/www/tutorials/css-intro/selectors.md" target="_blank">selector notes</a>.',
    options: { ok: (e) => e.goTo('nn-45') }
  }, {
    id: 'nn-45',
    content: 'There is one last common bit of selector syntax I\'d like to share with you though. Let\'s start with a new sketch for this one...',
    options: { ok: (e) => e.goTo('nn-46') }
  }, {
    id: 'nn-46',
    code: `<!DOCTYPE html>
<style>
  p {
    font-family: sans-serif;
  }
</style>
<p>
  To learn more about CSS selectors check out these
  <a href="https://github.com/netizenorg/netnet.studio/blob/master/www/tutorials/css-intro/selectors.md" target="_blank">selector notes</a>,
  and for an even deeper dive, refer to the
  <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors" target="_blank">Mozilla Developer Network's CSS selectors</a> page.
</p>
    `,
    content: 'It\'s very common to change the default styles of links, or <code>a</code> elements, on your page.',
    options: { ok: (e) => e.goTo('nn-47') }
  }, {
    id: 'nn-47',
    code: `<!DOCTYPE html>
<style>
  a {
    color: #c76ebc;
    text-decoration: none;
  }
  p {
    font-family: sans-serif;
  }
</style>
<p>
  To learn more about CSS selectors check out these
  <a href="https://github.com/netizenorg/netnet.studio/blob/master/www/tutorials/css-intro/selectors.md" target="_blank">selector notes</a>,
  and for an even deeper dive, refer to the
  <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors" target="_blank">Mozilla Developer Network's CSS selectors</a> page.
</p>
    `,
    content: 'This is one of the first things web-developers will add to their CSS code. It\'s very common to use two properties in particular, changing that default blue <code>color</code> to something else as well as removing the default underline, which is a <code>text-decoration</code>.',
    options: { ok: (e) => e.goTo('nn-48') }
  }, {
    id: 'nn-48',
    content: 'There\'s something called a <b>pseudo-class</b> which can be added to any selector by adding a <code>:</code> to the end. These specify alternative rules to be applied to that element when it is in a particular state.',
    options: { ok: (e) => e.goTo('nn-49') }
  }, {
    id: 'nn-49',
    code: `<!DOCTYPE html>
<style>
  a {
    color: #c76ebc;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  p {
    font-family: sans-serif;
  }
</style>
<p>
  To learn more about CSS selectors check out these
  <a href="https://github.com/netizenorg/netnet.studio/blob/master/www/tutorials/css-intro/selectors.md" target="_blank">selector notes</a>,
  and for an even deeper dive, refer to the
  <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors" target="_blank">Mozilla Developer Network's CSS selectors</a> page.
</p>
    `,
    content: 'For example, here we\'ve created a CSS rule for the <code>a</code> selector\'s <code>:hover</code> state. This CSS rule will only apply to an <code>a</code> tag if and when you hover over it with your mouse.',
    options: { ok: (e) => e.goTo('the-"cascade"') }
  }, {
    id: 'the-"cascade"',
    code: `<!DOCTYPE html>
<style>
  a {
    color: #c76ebc;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  p {
    font-family: sans-serif;
  }
</style>
<p>
  To learn more about CSS selectors check out these
  <a href="https://github.com/netizenorg/netnet.studio/blob/master/www/tutorials/css-intro/selectors.md" target="_blank">selector notes</a>,
  and for an even deeper dive, refer to the
  <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors" target="_blank">Mozilla Developer Network's CSS selectors</a> page.
</p>
    `,
    before: () => {
      NNE.lint = true
      STORE.dispatch('CHANGE_LAYOUT', 'dock-bottom')
    },
    content: 'You may have also noticed that the link\'s default font-family also changed even though we didn\'t explicitly specify that in the <code>a</code> selector\'s CSS rules.',
    options: { ok: (e) => e.goTo('nn-51') }
  }, {
    id: 'nn-51',
    content: 'This is because the <code>a</code> elements are all inside of the <code>p</code> element, and the <code>p</code> CSS rule has changed the default font-family from <code>serif</code> to <code>sans-serif</code>.',
    options: { ok: (e) => e.goTo('nn-52') }
  }, {
    id: 'nn-52',
    code: `<!DOCTYPE html>
<style>
  a {
    color: #c76ebc;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  p {
    font-family: sans-serif;
  }
</style>
<p>
  To learn more about CSS selectors check out these
  <a href="https://github.com/netizenorg/netnet.studio/blob/master/www/tutorials/css-intro/selectors.md" target="_blank">selector notes</a>,
  and for an even deeper dive, refer to the
  <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors" target="_blank">Mozilla Developer Network's CSS selectors</a> page.
</p>
<a href="https://github.com/netizenorg/netnet.studio/blob/master/www/tutorials/css-intro/the-cascade.md">the cascade</a>
    `,
    content: 'But if we were to add an <code>a</code> element after, and thus outside, our <code>p</code> it will not have that <code>sans-serif</code> font applied to it.',
    options: { ok: (e) => e.goTo('nn-53') }
  }, {
    id: 'nn-53',
    content: 'This effect, the fact that an element inherits certain styles from it\'s parent element, is part of how CSS rules "cascade". The effect of the cascade is often a point of confusion for beginners so I\'ve put together some <a href="https://github.com/netizenorg/netnet.studio/blob/master/www/tutorials/css-intro/the-cascade.md" target="_blank">notes on that here</a>.',
    options: { ok: (e) => e.goTo('nn-54') }
  }, {
    id: 'nn-54',
    content: 'Don\'t feel pressured to memorize all that now, like everything else, getting a feel for the logic of CSS comes with time and practice.',
    options: { ok: (e) => e.goTo('nn-55') }
  }, {
    id: 'nn-55',
    content: 'CSS is a very unique language. It starts off feeling deceivingly simple, until you start to realize it\'s actually frustratingly complex. But if you stick with it long enough, and take time to experiment with it, perhaps even push it to extremes like CSS artists do, you\'ll find it\'s incredibly expressive.',
    options: { ok: (e) => e.goTo('nn-56') }
  }, {
    id: 'nn-56',
    content: 'That\'s it! Those are the basics! Now it\'s just a matter of experimenting with all the various properties CSS has to offer! You can check out <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference" target="_blank">a full list</a> on the Mozilla Developer Network.',
    options: { }
  }],

  widgets: {
    'idea-channel': new HyperVidPlayer({
      video: 'api/videos/css-idea-channel.mp4',
      width: window.innerWidth * 0.33,
      title: 'Is CSS and Website Design a Fashion Statement? | Idea Channel | PBS Digital Studios'
    }),
    '-Idea-Channel-quote-w1': new Widget({
      width: window.innerWidth * 0.33,
      title: ' Idea Channel quote',
      innerHTML: '<blockquote style="font-size: 22px; line-height: 25px;">""..an eye catching stylesheet, that\'s something different, that is fashion [...] clothing is functional, but fashion is used to purposely express something which is not explicitly stated otherwise" </blockquote><div style="text-align:right; font-size: 22px; line-height: 25px;">— Idea Channel</div>'
    }),
    'the-mine-w2': new Widget({
      width: window.innerWidth * 0.33,
      title: 'The Mine by Jamie Coulter',
      innerHTML: '<img style="width: 100%" alt="the-mine" src="tutorials/css-intro/images/the-mine.png">'
    }),
    'Single-Element-MacBook-w3': new Widget({
      width: window.innerWidth * 0.33,
      title: 'Single Element MacBook by Joshua Hibbert',
      innerHTML: '<img style="width: 100%" alt="Single-Element-MacBook" src="tutorials/css-intro/images/mac-book.png">'
    }),
    'Diana-Smith-Interview': new HyperVidPlayer({
      video: 'api/videos/diana-smith-css-art.mp4',
      width: window.innerWidth * 0.5,
      title: 'Diana Smith | VICE Interview'
    }),
    'Pure-CSS-Gaze-by-Diana-A-Smith-w5': new Widget({
      width: 385,
      title: 'Pure CSS Gaze by Diana A Smith',
      innerHTML: '<img style="width: 100%" alt="Pure-CSS-Gaze-by-Diana-A-Smith" src="tutorials/css-intro/images/smith-1.jpg"><p><a href="https://diana-adrianne.com/purecss-gaze/" target="_blank">open in new tab</a></p>'
    }),
    'Pure-CSS-Lace-by-Diana-A-Smith-w6': new Widget({
      width: 379,
      title: 'Pure CSS Lace by Diana A Smith',
      innerHTML: '<img style="width: 100%" alt="Pure-CSS-Lace-by-Diana-A-Smith" src="tutorials/css-intro/images/smith-2.jpg"><p><a href="https://diana-adrianne.com/purecss-lace/" target="_blank">open in new tab</a></p>'
    }),
    'Pure-CSS-Pink-by-Diana-A-Smith-w7': new Widget({
      width: 379,
      title: 'Pure CSS Pink by Diana A Smith',
      innerHTML: '<img style="width: 100%" alt="Pure-CSS-Pink-by-Diana-A-Smith" src="tutorials/css-intro/images/smith-3.jpg"><p><a href="https://diana-adrianne.com/purecss-pink/" target="_blank">open in new tab</a></p>'
    }),
    'Francine-by-Diana-A-Smith-w8': new Widget({
      width: 330,
      title: 'Francine by Diana A Smith',
      innerHTML: '<img style="width: 100%" alt="Francine-by-Diana-A-Smith" src="tutorials/css-intro/images/Francine.png"><p><a href="https://diana-adrianne.com/purecss-francine/" target="_blank">open in new tab</a></p>'
    }),
    'Francine-(Chrome-9)-w9': new Widget({
      width: 316,
      title: 'Francine (Chrome 9)',
      innerHTML: '<img style="width: 100%" alt="Francine-(Chrome-9)" src="tutorials/css-intro/images/Francine-Chrome-9.png">'
    }),
    'Francine-(Mac-Opera)-w10': new Widget({
      width: 530,
      title: 'Francine (Mac Opera)',
      innerHTML: '<img style="width: 100%" alt="Francine-(Mac-Opera)" src="tutorials/css-intro/images/Francine-Mac-Opera.png">'
    }),
    'Francine-(Windows-7-IE-11)-w11': new Widget({
      width: 330,
      title: 'Francine (Windows 7 IE 11)',
      innerHTML: '<img style="width: 100%" alt="Francine-(Windows-7-IE-11)" src="tutorials/css-intro/images/Francine-Windows-7-IE-11.png">'
    }),
    'Francine-(Windows-98-IE-7)-w12': new Widget({
      width: 347,
      title: 'Francine (Windows 98 IE 7)',
      innerHTML: '<img style="width: 100%" alt="Francine-(Windows-98-IE-7)" src="tutorials/css-intro/images/Francine-Windows-98-IE-7.png">'
    }),
    'css-rule-w13': new Widget({
      width: window.innerWidth * 0.33,
      title: 'CSS Rule',
      innerHTML: '<img style="width: 100%" alt="css-rule" src="tutorials/css-intro/images/css-rule.png">'
    })
  }
}
