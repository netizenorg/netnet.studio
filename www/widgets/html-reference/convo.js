/* global nn NNW NNE utils WIDGETS */
/* eslint no-template-curly-in-string: "off" */
window.CONVOS['html-reference'] = (self) => {
  return [
    {
      id: 'start-guide',
      graph: { id: 1, x: 200, y: 25 },
      layout: 'welcome',
      before: () => {
        NNW.menu.switchFace('default')
      },
      after: () => {
        utils.afterLayoutTransition(() => {
          NNW.update({
            top: nn.height / 2 - NNW.height / 2,
            left: nn.width / 2 - NNW.width
          }, 500)
        })
      },
      code: '<!DOCTYPE html>\n<style>\n  /* netnet default bg */\n  body {\n    margin: 0;\n    background-image: linear-gradient(#515199a8 2px, transparent 1px),\n      linear-gradient(90deg, #515199a8 2px, transparent 1px);\n    background-size: 50px 50px;\n    position: relative;\n    z-index: 1;\n    overflow: hidden;\n    transition: background 2s ease;\n  }\n\n  body::before {\n    content: "";\n    position: absolute;\n    z-index: -1;\n    width: 100vw;\n    height: 100vh;\n    background: linear-gradient(0deg, #c76ebca8, #515199a8);\n    transition: opacity 2s ease; /* fade effect */\n  }\n\n  /* When faded */\n  body.fade-white {\n    background: white;\n  }\n  body.fade-white::before {\n    opacity: 0;\n  }\n</style>\n\n<script>\n  setTimeout(() => {\n    document.body.classList.add(\'fade-white\')\n  }, 1000)\n</script>\n',
      edit: true,
      content: 'The most foundational coding language of the Web is Hypertext Markup Language or HTML. Like all markup langauges, HTML is defined by a collection of <i>elements</i>. The widget below displays an example of what an element looks like.',
      options: {
        'go on': (e) => e.goTo('syntax'),
        'there are other markup languages?': (e) => e.goTo('other-markup')
      }
    },
    {
      id: 'other-markup',
      graph: { id: 3, x: 125, y: 150 },
      content: 'Yes, for example <a href="https://developer.mozilla.org/en-US/docs/Web/MathML" target="_blank">MathML</a> and <a href="https://svg-tutorial.com/" target="_blank">SVG</a> which you\'ll surely run into at some point in your journey. There are even artist made markup languages like <a href="https://en.wikipedia.org/wiki/Graffiti_Markup_Language" target="_blank">GML</a> (Graffiti Markup Language) by the <a href="https://www.evan-roth.com/~/works/graffiti-research-lab-g-r-l/#hemisphere=west&ratio=0.177&strand=106" target="_blank">Graffiti Research Lab</a>',
      options: {
        'I see': (e) => e.goTo('syntax')
      }
    },
    {
      id: 'syntax',
      graph: { id: 2, x: 275, y: 150 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(0)
      },
      content: 'All markup languages share the same <i>syntax</i>, a <code>&lt;</code> bracket followed by the name of the element and then a <code>&gt;</code> bracket',
      options: {
        'go on': (e) => e.goTo('names'),
        'what\'s syntax?': (e) => e.goTo('syntax2'),
        'go back': (e) => e.goTo('start-guide')
      }
    },
    {
      id: 'syntax2',
      graph: { id: 6, x: 425, y: 150 },
      content: 'In code, <i>syntax</i> is like the grammar and punctuation rules of a programming language. It’s the specific way you have to write code so the computer can understand and run it.',
      options: {
        'I see': (e) => e.goTo('names')
      }
    },
    {
      id: 'hr',
      graph: { id: 4, x: 275, y: 450 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(1)
      },
      code: '<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js"></script>\n<script>\n/* global nn */\n\nfunction animate () {\n  setTimeout(animate, 100)\n  const hrs = nn.getAll(\'hr\').length\n  if (hrs < nn.height / 11) nn.create(\'hr\').addTo(\'body\')\n}\nnn.on(\'load\', animate)\n\n</script>',
      edit: true,
      content: 'One example of a real element is the <code>hr</code> element, or the "horizontal rule", which creates a horizontal line across the page. Each new <code>hr</code> you add to your code creates a new line. I just added a whole bunch behind me!',
      options: {
        'go on': (e) => e.goTo('meta'),
        'go back': (e) => e.goTo('names')
      }
    },
    {
      id: 'names',
      graph: { id: 5, x: 275, y: 300 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(0)
      },
      code: '<!-- nothing -->',
      edit: true,
      content: 'There isn\'t actually an element named "element", this is just an example to demonstrate HTML syntax. Let\'s review a few actual HTML element names.',
      options: {
        'go on': (e) => e.goTo('hr'),
        'go back': (e) => e.goTo('syntax')
      }
    },
    {
      id: 'meta',
      graph: { id: 7, x: 275, y: 600 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(2)
      },
      code: '<meta>',
      edit: true,
      content: 'Not all elements get visibly rendered on your page. For example, the <code>meta</code> element is used to create "metadata" or information about your page. Instead of showing up on your page, this data appears in other places like web search results.',
      options: {
        'go on': (e) => e.goTo('input'),
        'go back': (e) => e.goTo('hr')
      }
    },
    {
      id: 'input',
      graph: { id: 8, x: 475, y: 300 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(3)
      },
      code: '<input style="font-size: 24px">',
      edit: true,
      content: 'Other elements appear differently depending on how you write them, consider this <code>input</code> element, by default it creates a text input, the kind you can click on and type text into. I just added one to the page behind me at the top left, try it out!',
      options: {
        'go on': (e) => e.goTo('input-default'),
        'go back': (e) => e.goTo('meta')
      }
    },
    {
      id: 'input-default',
      graph: { id: 9, x: 475, y: 450 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(4)
        setTimeout(() => self.$('svg-tag-presentation').updateHTML(5), 1000)
        setTimeout(() => self.$('svg-tag-presentation').updateHTML(6), 2000)
      },
      code: '<input style="font-size: 24px">',
      edit: true,
      content: 'We can specify the <i>type</i> of <code>input</code> we want by adding a bit more code to our element.',
      options: {
        'go on': (e) => e.goTo('attr-intro'),
        'go back': (e) => e.goTo('input')
      }
    },
    {
      id: 'attr-intro',
      graph: { id: 10, x: 475, y: 600 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(7)
      },
      code: '<input style="font-size: 24px">',
      edit: true,
      content: 'To do this we need some new syntax. We must define an HTML <i>attribute</i>, in this case the <code>input</code> element\'s <code>type</code> attribute. This won\'t change the appearance of the input field behind me, because as I mentioned earlier, <i>text</i> is the default <i>type</i> of <code>input</code>.',
      options: {
        'go on': (e) => e.goTo('attr2'),
        'go back': (e) => e.goTo('input-default')
      }
    },
    {
      id: 'attr2',
      graph: { id: 11, x: 675, y: 300 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(8)
      },
      code: '<input style="font-size: 24px">',
      edit: true,
      content: 'An HTML <i>attribute</i> requires special syntax and consists of two parts, it\'s <i>name</i>, in this case <code>type</code>, and it\'s <i>value</i>, in this case <code>"text"</code>. The name is always followed by an equal sign <code>=</code> and the value should always have quotes <code>" "</code> around it.',
      options: {
        'go-on': (e) => e.goTo('other-types'),
        'go-back': (e) => e.goTo('attr-intro')
      }
    },
    {
      id: 'other-types',
      graph: { id: 12, x: 675, y: 450 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(9)
        setTimeout(() => self.$('svg-tag-presentation').updateHTML(10), 1000)
      },
      code: '<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js"></script>\n<script>\n  /* global nn */\n\n  function animate() {\n    setTimeout(animate, 100)\n    const types = [\'text\', \'number\', \'color\', \'range\', \'checkbox\', \'radio\']\n    const t = nn.random(types)\n    const x = nn.random(nn.width - 100)\n    const y = nn.random(nn.height - 50)\n    const e = nn.create(\'input\')\n      .set(\'type\', t)\n      .css(\'width\', 50)\n      .position(x, y)\n      .addTo(\'body\')\n    if (t !== \'color\' && nn.random() > 0.5) e.click()\n  }\n  nn.on(\'load\', animate)\n</script>',
      edit: true,
      content: 'We can change this default <i>type</i> by assigning different values to the <code>input</code> element\'s <code>type</code> attribute. I\'m adding lots more <code>input</code> elements to the page behind me with a different <code>type</code> each time.',
      options: {
        'go on': (e) => e.goTo('singleton'),
        'go back': (e) => e.goTo('attr2')
      }
    },
    {
      id: 'singleton',
      graph: { id: 13, x: 675, y: 600 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(11)
      },
      code: '<!-- nothing -->',
      edit: true,
      content: 'So far, we\'ve only looked at elements which consist of a single <i>tag</i>, these are known as "singleton" or "void" elements.',
      options: {
        'go on': (e) => e.goTo('tags'),
        'go back': (e) => e.goTo('other-types')
      }
    },
    {
      id: 'tags',
      graph: { id: 14, x: 875, y: 300 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(12)
      },
      content: 'Most elements actually consist of two <i>tags</i>, the purpose of which is to annotate some <i>content</i> by placing it within the element\'s tags.',
      options: {
        'go on': (e) => e.goTo('element-parts'),
        'go back': (e) => e.goTo('singleton')
      }
    },
    {
      id: 'element-parts',
      graph: { id: 15, x: 875, y: 450 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(13)
      },
      code: '<h1>my web site</h1>',
      edit: true,
      content: 'When an element consists of two tags, we refer to the first tag as the <i>opening tag</i> and the second as it\'s <i>closing tag</i> which is differentiated by the <code>/</code> slash before the element\'s name.',
      options: {
        'go on': (e) => e.goTo('h1-ele'),
        'go back': (e) => e.goTo('tags')
      }
    },
    {
      id: 'h1-ele',
      graph: { id: 16, x: 875, y: 600 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(14)
      },
      code: '<h1>my web site</h1>',
      edit: true,
      content: 'I\'ve added an <code>h1</code> element to the page, also known as a "level 1 header". It\'s not uncommon to refer to this code as an h1 <i>tag</i>, although technically it\'s an h1 <i>element</i>, as the element consists of both an opening and a closing tag as well as its content (in this case the text <i>my web site</i>).',
      options: {
        'go on': (e) => e.goTo('p-ele'),
        'go back': (e) => e.goTo('element-parts')
      }
    },
    {
      id: 'p-ele',
      graph: { id: 17, x: 875, y: 750 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(15)
      },
      code: '<p>my web site</p>',
      edit: true,
      content: 'Here is another one, the <code>p</code> or "paragraph" element. I\'ve given it the same content as the prior <code>h1</code> element, but you\'ll notice that the text behind me appears smaller now. This is because the <i>header</i> element renders it\'s content larger than the <i>paragraph</i> element does.',
      options: {
        'go on': (e) => e.goTo('a-ele'),
        'go back': (e) => e.goTo('h1-ele')
      }
    },
    {
      id: 'a-ele',
      graph: { id: 18, x: 875, y: 900 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(16)
      },
      code: '<a>my web site</a>',
      edit: true,
      content: 'Here\'s an <code>a</code> or "anchor" element. By default it looks just like the "paragraph" element did.',
      options: {
        'go on': (e) => e.goTo('href'),
        'go back': (e) => e.goTo('p-ele')
      }
    },
    {
      id: 'href',
      graph: { id: 19, x: 875, y: 1075 },
      before: () => {
        self.$('svg-tag-presentation').updateHTML(17)
      },
      code: '<a href="https://netizen.org">my web site</a>',
      edit: true,
      content: 'But if we give our <code>a</code> element an <code>href</code> attribute, it now looks like a clickable link. This is because the purpose of the "anchor" element is to create links to other web pages. Click on the link to try it out!',
      options: {
        'go on': (e) => e.goTo('end'),
        'why is it called anchor?': (e) => e.goTo('anchor'),
        'go back': (e) => e.goTo('a-ele')
      }
    },
    {
      id: 'anchor',
      graph: { id: 20, x: 1100, y: 1125 },
      code: '<a href="https://netizen.org">my web site</a>',
      edit: true,
      content: 'It\'s called "anchor" because, although it\'s most common use is to jump to another web page, it can also be used to jump to a specific <i>anchored</i> section of the same web page. The <code>a</code> element could be used to create a hyperlink to other files, email addresses and phone numbers as well.',
      options: {
        'how do we do that?': (e) => e.goTo('anchor2')
      }
    },
    {
      id: 'anchor2',
      graph: { id: 21, x: 1100, y: 975 },
      code: '<a href="https://netizen.org">my web site</a>',
      edit: true,
      content: 'That\'s a bit too in the weeds for now. We\'ll cover that in another tutorial once we start writing our own code. Speaking of which, now that you know the basics of HTML shall we try writing our first web page?',
      options: {
        'let\'s do it!': (e) => WIDGETS.load('template-projects', w => w.loadTemplate('html-basic')),
        'go back': (e) => e.goTo('href')
      }
    },
    {
      id: 'end',
      graph: { id: 22, x: 875, y: 1225 },
      code: '<a href="https://netizen.org">my web site</a>',
      edit: true,
      content: 'While there are plenty more HTML <i>elements</i> as well as plenty more <i>attributes</i> we can apply to those <i>elements</i>, there isn\'t really much more to know about HTML syntax. The rest is all about how we piece them together.',
      options: {
        'ok, let\'s write some code!': (e) => {
          e.hide()
          NNE.code = ''
          NNW.layout = 'dock-left'
          self.close()
          utils.afterLayoutTransition(() => {
            WIDGETS.load('template-projects', w => w.startGuide('html-basic'))
          })
        },
        'go back': (e) => e.goTo('href')
      }
    },
    {
      id: 'confirm-start',
      graph: { id: 23, x: 50, y: 25 },
      content: 'Seems like you might be working on some code, I\'ll be replacing the code in my editor once we start this guide, are you sure you want to do that?',
      options: {
        'yes, go ahead': (e) => {
          self._toggleIntroPresentation()
        },
        'oh, never mind': (e) => e.hide()
      }
    }
  ]
}
