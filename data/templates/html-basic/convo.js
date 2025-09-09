/* global utils WIDGETS */
window.CONVOS['template-html-basic'] = (self) => {
  return [
    {
      id: 'doctype',
      graph: { id: 1, x: 25, y: 25 },
      content: 'While not <i>technically</i> necessary, it\'s always a good idea to start every HTML file with a <code>DOCTYPE</code>',
      options: {
        'go on': (e) => e.goTo('html-ele'),
        'what\'s that?': (e) => e.goTo('explain-doctype')
      }
    },
    {
      id: 'explain-doctype',
      graph: { id: 2, x: 200, y: 100 },
      content: 'This tag is not an HTML element in the traditional sense. It is a "declaration" to the browser about what document type to expect. This helps the browser determine the best way to <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode" target="_blank">render</a> the page. There are different doctypes for code written at different points in history of HTML, we\'re currently in the era of HTML5, so any pages created now should have the HTML5 doctype which looks like this.',
      options: {
        'I see': (e) => e.goTo('html-ele')
      }
    },
    {
      id: 'html-ele',
      graph: { id: 3, x: 25, y: 150 },
      content: 'The <code>html</code> element</strong> represents the outer most or "top-level" element of an HTML document, so it is also referred to as the <em>root element</em>. All other elements must be descendants of this element.',
      options: {
        'go on': (e) => e.goTo('lang-attr'),
        'go back': (e) => e.goTo('doctype')
      }
    },
    {
      id: 'lang-attr',
      graph: { id: 4, x: 25, y: 275 },
      content: 'The <code>lang</code> attribute tells the browser (and assistive technologies like screen readers) what language the text on your page is written in. This helps improve accessibility by allowing screen readers to use the correct pronunciation rules, and it also helps search engines understand and index your content more accurately.',
      options: {
        'go on': (e) => e.goTo('head-and-body'),
        'what if I\'ve got many langauges?': (e) => e.goTo('lang-attr2'),
        'go back': (e) => e.goTo('html-ele')
      }
    },
    {
      id: 'lang-attr2',
      graph: { id: 5, x: 200, y: 325 },
      content: 'While the <code>lang</code> attribute is most often placed on the <code>html</code> element to declare the language for the entire page, you can also put it on any individual element to specify a different language for just that section of content.',
      options: {
        'I see': (e) => e.goTo('head-and-body')
      }
    },
    {
      id: 'head-and-body',
      graph: { id: 6, x: 25, y: 400 },
      content: 'Inside the <code>html</code> you should always have two elements, the <code>head</code> and the <code>body</code>. Another way of saying this is that the <i>html element</i> should only ever contain these two <i>child elements</i>.',
      options: {
        'go on': (e) => e.goTo('head-ele'),
        'child elements?': (e) => e.goTo('children'),
        'go back': (e) => e.goTo('lang-attr2')
      }
    },
    {
      id: 'head-ele',
      graph: { id: 7, x: 25, y: 525 },
      content: 'The <code>head</code> is where our "metadata" goes. This is information about your page, rather than the page\'s content itself. I\'ve left a comment in there so you don\'t forget.',
      options: {
        'go on': (e) => e.goTo('title-ele'),
        'a comment?': (e) => e.goTo('comment'),
        'go back': (e) => e.goTo('head-and-body')
      }
    },
    {
      id: 'children',
      graph: { id: 8, x: 200, y: 450 },
      content: 'Yes, in HTML parlance, when an element\'s content includes other elements, we refer to these as its "children", similarly we refer to the element that contains the others as their "parent", so here the <code>html</code> element is both the <code>head</code> and <code>body</code> element\'s parent.',
      options: {
        'I see': (e) => e.goTo('head-ele')
      }
    },
    {
      id: 'title-ele',
      graph: { id: 9, x: 25, y: 650 },
      content: 'For example, your page\'s <code>title</code>, this doesn’t show up on the page itself, but it appears in the browser tab, history, search results, and link previews when others share your page on on social media platforms.<input placeholder="what should our title be?" style="width: 300px;">',
      options: {
        'go on': (e, t) => {
          const v = t.$('input').value
          self.vars.title = v || 'Your Page Title'
          if (!v) e.goTo('temp-title')
          else e.goTo('your-title')
        },
        'go back': (e) => e.goTo('head-ele')
      }
    },
    {
      id: 'comment',
      graph: { id: 10, x: 200, y: 575 },
      content: `Comments are notes in your code that browsers ignore. In HTML, they start with <code>&lt;!--</code> and end with <code>--&gt;</code> . You can use them to explain your code, give credit, or temporarily disable parts of it. The shortcut key <code>${utils.hotKey()} + /</code> can be used to add or remove a comment.`,
      options: {
        'I see': (e) => e.goTo('title-ele')
      }
    },
    {
      id: 'temp-title',
      graph: { id: 11, x: 400, y: 200 },
      content: 'Ok, I\'ll just leave it as "Your Page Title" for now and you can change it later.',
      options: {
        'go on': (e) => e.goTo('meta-ele'),
        'go back': (e) => e.goTo('title-ele')
      }
    },
    {
      id: 'your-title',
      graph: { id: 12, x: 550, y: 200 },
      content: 'Great, I\'ve added that as the <code>title</code> element\'s content.',
      options: {
        'go on': (e) => e.goTo('meta-ele'),
        'go back': (e) => e.goTo('title-ele')
      }
    },
    {
      id: 'meta-ele',
      graph: { id: 13, x: 475, y: 325 },
      content: 'Let\'s add a couple of <code>meta</code> tags. These can store additional information about your page which, like the <i>title</i>, doesn\'t appear in the page\'s content, but instead show up in other places like search results and social media previews.',
      options: {
        'go on': (e) => e.goTo('author'),
        'go back': (e) => e.goTo('title-ele')
      }
    },
    {
      id: 'viewport',
      graph: { id: 14, x: 475, y: 975 },
      content: 'The last meta tag we\'ll add is for mobile devices. Without it your page would look teeny-tiny on their smaller screens. Check out this <a href="https://stackoverflow.com/questions/10892463/how-is-the-meta-viewport-tag-used-and-what-does-it-do" target="_blank">stackoverflow conversation</a> to learn more about it.',
      options: {
        'go on': (e) => e.goTo('body-ele'),
        'go back': (e) => e.goTo('meta-ele')
      }
    },
    {
      id: 'author',
      graph: { id: 15, x: 475, y: 450 },
      content: 'A <code>meta</code> tag with a <code>name</code> attribute of <i>author</i> is used to credit the creator of the page. <input placeholder="how would you like to be attributed?" style="width: 340px;">',
      options: {
        'go on': (e, t) => {
          const v = t.$('input').value
          self.vars.author = v || 'netnet'
          if (!v) e.goTo('temp-author')
          else e.goTo('your-author')
        },
        'go back': (e) => e.goTo('viewport')
      }
    },
    {
      id: 'temp-author',
      graph: { id: 16, x: 400, y: 575 },
      content: 'Ok, I\'ll just credit myself for now and you can change it later.',
      options: {
        'go on': (e) => e.goTo('description'),
        'go back': (e) => e.goTo('author')
      }
    },
    {
      id: 'description',
      graph: { id: 17, x: 475, y: 700 },
      content: 'We\'ll give this next <code>meta</code> tag a <code>name</code> attribue of <i>description</i>. As the attribute\'s value implies, this tag is used to add a short summary about the page. <input placeholder="how should we describe it?" style="width: 300px;">',
      options: {
        'go on': (e, t) => {
          const v = t.$('input').value
          self.vars.description = v || 'my first web page!'
          if (!v) e.goTo('temp-description')
          else e.goTo('your-description')
        },
        'go back': (e) => e.goTo('author')
      }
    },
    {
      id: 'your-author',
      graph: { id: 18, x: 550, y: 575 },
      content: 'Great, I\'ve added that to the <code>content</code> attribute for this meta tag.',
      options: {
        'go on': (e) => e.goTo('description'),
        'go back': (e) => e.goTo('author')
      }
    },
    {
      id: 'temp-description',
      graph: { id: 19, x: 400, y: 825 },
      content: 'Ok, I\'ll just write this short description for now and you can change it later.',
      options: {
        'go on': (e) => e.goTo('viewport'),
        'go back': (e) => e.goTo('description')
      }
    },
    {
      id: 'your-description',
      graph: { id: 20, x: 550, y: 825 },
      content: 'Great, I\'ve added your description to the <code>content</code> attribute for this meta tag.',
      options: {
        'go on': (e) => e.goTo('viewport'),
        'go back': (e) => e.goTo('description')
      }
    },
    {
      id: 'body-ele',
      graph: { id: 21, x: 475, y: 1100 },
      content: 'Now that our metadata is set up, let’s move on to the actual content. I’ve left a comment inside the <code>body</code> to remind you that this is where all the elements go that will actually get rendered (be displayed) on the page.',
      options: {
        'go on': (e) => e.goTo('h1-ele'),
        'go back': (e) => e.goTo('description')
      }
    },
    {
      id: 'h1-ele',
      graph: { id: 22, x: 475, y: 1225 },
      content: 'Here we\'ll place some of the elements we introduced in the <b>Guided Intro</b> of the HTML Reference Widget, starting with the <code>h1</code> element. <input placeholder="what should your heading say?" style="width: 300px;">',
      options: {
        'go on': (e, t) => {
          const v = t.$('input').value
          self.vars.h1 = v || 'Welcome to My Page!'
          e.goTo('p-ele')
        },
        'Guided Intro?': (e, t) => {
          const v = t.$('input').value
          self.vars.h1 = v || 'Welcome to My Page!'
          e.goTo('guided-intro')
        },
        'go back': (e) => e.goTo('body-ele')
      }
    },
    {
      id: 'guided-intro',
      graph: { id: 24, x: 300, y: 1100 },
      content: 'If you\'re brand new to HTML and haven\'t yet reviewed the core concepts, you can learn about those in the HTML Reference Widget. Should we go back to that and review those core concepts before returning to this template? Or should we continue building out this template?',
      options: {
        'let\'s continue': (e) => e.goTo('p-ele'),
        'let\'s go back to the basics': (e) => {
          WIDGETS['template-projects'].cancel()
          WIDGETS.open('html-reference', w => w.toggleIntroPresentation())
        }
      }
    },
    {
      id: 'p-ele',
      graph: { id: 25, x: 100, y: 1000 },
      content: 'Next we\'ll add a <code>p</code>, or "paragraph", element. <input placeholder="what should we write here?" style="width: 300px;">',
      options: {
        'go on': (e, t) => {
          const v = t.$('input').value
          self.vars.p = v || 'Welcome to my page! Take a look at my recent projects and interests below.'
          e.goTo('indentation-bad')
        },
        'go back': (e) => e.goTo('h1-ele')
      }
    },
    {
      id: 'indentation-bad',
      graph: { id: 26, x: 100, y: 1125 },
      content: 'You may have noticed that every time I create a new child element (an element inside another element) I\'ve added some spaces before the parent element\'s content, this is called <i>indentation</i>. In HTML, indentation isn’t technically required by the browser for your code to work. If I were to remove all the indentation and line breaks, you\'ll notice that the rendered page looks exactly the same, but the code is now much harder to read.',
      options: {
        'go on': (e) => e.goTo('indentation-good'),
        'go back': (e) => e.goTo('p-ele')
      }
    },
    {
      id: 'indentation-good',
      graph: { id: 27, x: 100, y: 1250 },
      content: 'Keeping good indentation makes the structure of our HTML much clearer. A good rule of thumb: if an element’s opening and closing tags are on separate lines, everything between them should be indented the same amount. While I\'ll do my best to automatically indent things as you write new lines of code, it\'s natural for things to get messy after a while. You can ask me to "tidy" your code at any time.',
      options: {
        'go on': (e) => e.goTo('nav-ele'),
        'how do I ask you to tidy?': (e) => e.goTo('tidy-code'),
        'go back': (e) => e.goTo('indentation-bad')
      }
    },
    {
      id: 'nav-ele',
      graph: { id: 28, x: 100, y: 1375 },
      before: () => {
        WIDGETS['coding-menu'].close()
      },
      content: 'The <code>nav</code> element is used to group navigation links, in this case, links to other pages. You don’t need <code>nav</code> for every single link, but when you have a set of links that help people move around your site, wrapping them in <code>nav</code> gives that group clear meaning. It’s not required for the code to work, but it’s good <a href="https://en.wikipedia.org/wiki/Semantic_Web" target="_blank">semantic</a> practice that helps with accessibility and search engines.',
      options: {
        'go on': (e) => e.goTo('a-ele'),
        'go back': (e) => e.goTo('indentation-good')
      }
    },
    {
      id: 'tidy-code',
      graph: { id: 29, x: 250, y: 1325 },
      before: () => {
        WIDGETS.open('coding-menu', w => w.toggleSubMenu('func-menu-my-code'))
      },
      content: 'Click my face at anytime to search "tidy code" in my search bar, or open the <b>Coding Menu</b> and in the <i>my code</i> section click the <i>tidy code</i> option.',
      options: {
        'go on': (e) => e.goTo('nav-ele')
      }
    },
    {
      id: 'a-ele',
      graph: { id: 30, x: 100, y: 1500 },
      content: 'You may recall the <code>a</code> element from my <b>Guided Intro to HTML</b>, a simple piece of code with some powerful implications. The <i>h</i> in its <code>href</code> stands for <a href="https://en.wikipedia.org/wiki/Hypertext" target="_blank">hypertext</a>, the breakthrough idea that made the Web different from older, linear media. The <i>ref</i> means "reference", in this case to a URL, another defining feature of the Web that lets any page connect directly to any other.',
      options: {
        'go on': (e) => e.goTo('a-modify'),
        'go back': (e) => e.goTo('nav-ele')
      }
    },
    {
      id: 'a-modify',
      graph: { id: 31, x: 100, y: 1625 },
      content: 'The <code>href</code> attribute controls where the link points to, and the text between the opening and closing tag is what people see and click on. Feel free to edit either of these and add others.',
      options: {
        'go on': (e) => e.goTo('end-guide'),
        'go back': (e) => e.goTo('a-ele')
      }
    },
    {
      id: 'end-guide',
      graph: { id: 32, x: 100, y: 1750 },
      content: 'That\'s all there is to a basic HTML5 template. We could add a bit more metadata though, to improve how our page appears in differernt context. Would you like to learn more about that? Or, if you prefer, I\'ll let you take it from here',
      options: {
        'Let\'s add some metadata first': (e) => {
          WIDGETS['template-projects'].startGuide('html-meta-tags')
        },
        'I\'ll take it from here': (e) => {
          WIDGETS['template-projects'].preNewRepoFromTemplate()
        },
        'go back': (e) => e.goTo('a-modify')
      }
    }
  ]
}
