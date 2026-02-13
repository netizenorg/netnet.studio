/* global NNW NNE utils WIDGETS nn */
/* eslint no-template-curly-in-string: "off" */
window.CONVOS['css-reference'] = (self) => {
  return [
    {
      id: 'confirm-start',
      layout: 'welcome',
      graph: { id: 1, x: 25, y: 25 },
      content: 'Seems like you might be working on some code, I\'ll be replacing the code in my editor once we start this guide, are you sure you want to do that?',
      options: {
        'yes, go ahead': (e) => {
          self._toggleIntroPresentation()
        },
        'oh, never mind': (e) => e.hide()
      }
    },
    {
      id: 'start-guide',
      graph: { id: 2, x: 25, y: 175 },
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
      content: 'As you already know, HTML is used to create the structure of a web page by defining different <i>elements</i>. These elements all have a default UI (user interface) and typically get presented on the page in the order that you\'ve declared them in your code. We can change this default presentation using CSS.',
      options: {
        'go on': (e) => e.goTo('style'),
        'I didn\'t know that?': (e) => e.goTo('did-not-know-html')
      }
    },
    {
      id: 'style',
      graph: { id: 3, x: 25, y: 300 },
      code: '<h1>Hello World Wide Web</h1>',
      content: 'I\'ve placed an <code>h1</code> element on this page, it has the same default style as the ones from our <i>HTML templates</i>, but soon we\'ll change that using CSS or Cascading Style Sheets. CSS is the language we use to <i>style</i> our web pages and apps. Like HTML, and any other coding language, CSS has it\'s own syntax and vocabulary.',
      options: {
        'go on': (e) => e.goTo('vocabulary'),
        'I know this already': (e) => e.goTo('i-know-css-already'),
        'go back': (e) => e.goTo('start-guide')
      }
    },
    {
      id: 'did-not-know-html',
      graph: { id: 4, x: 175, y: 225 },
      content: 'Oh! In that case we might be jumping ahead, you should probably review the core concepts of HTML before diving any deeper into CSS.',
      options: {
        'never mind, continue': (e) => e.goTo('style'),
        'ok, let\'s do HTML first': (e) => {
          WIDGETS['css-reference'].close()
          WIDGETS.open('html-reference', (w) => w.toggleIntroPresentation())
        }
      }
    },
    {
      id: 'vocabulary',
      graph: { id: 5, x: 25, y: 425 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(1)
      },
      content: 'Just as HTML\'s vocabulary is defined by a list of <i>elements</i> and <i>attributes</i>, CSS\'s vocabulary is also defined by it\'s own list of special keywords called <i>properties</i>. Here\'s one example, the <code>color</code> property defines the color we want to apply to some text.',
      options: {
        'go on': (e) => e.goTo('dash'),
        'go back': (e) => e.goTo('style')
      }
    },
    {
      id: 'i-know-css-already',
      graph: { id: 6, x: 175, y: 375 },
      content: 'Oh, ok if you\'re already familiar with CSS syntax and it\'s vocabulary shall we just skip to the end so you can experiment with a CSS rule for the <code>h1</code> or would you like to jump ahead to the basic template and start writing a web page with some CSS?',
      options: {
        'never mind, continue': (e) => e.goTo('vocabulary'),
        'skip to the end': (e) => e.goTo('end-of-css'),
        'jump to the template': (e) => {
          WIDGETS.load('template-projects', w => w.loadTemplate('css-basic'))
        }
      }
    },
    {
      id: 'dash',
      graph: { id: 7, x: 25, y: 550 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(2)
      },
      content: 'We can also change the size of text using the <code>font-size</code> property, notice how this property name contains two words. In CSS when a property name contains more than one word, each must be connected using a <i>dash</i> <code>-</code>',
      options: {
        'go on': (e) => e.goTo('text-props'),
        'go back': (e) => e.goTo('vocabulary')
      }
    },
    {
      id: 'text-props',
      graph: { id: 8, x: 25, y: 675 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(3)
      },
      content: 'There are loads of other properties we can use to change the <i>style</i> of some text. Without showing you what this code does, assuming you speak English, you could probably guess what these other properties are going to do.',
      options: {
        'go on': (e) => e.goTo('declaration'),
        'only english?': (e) => e.goTo('only-english'),
        'go back': (e) => e.goTo('dash')
      }
    },
    {
      id: 'declaration',
      graph: { id: 9, x: 25, y: 800 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(4)
      },
      content: 'To see this code in context, we first need to cover a bit of CSS syntax. A property and its value are separated by a colon <code>:</code>, and followed by a semicolon <code>;</code>, for example, <code>font-size: 100px;</code>. A line of CSS code like this is called a <i>declaration</i>, because it "declares" a desired style.',
      options: {
        'go on': (e) => e.goTo('declaration-block'),
        'go back': (e) => e.goTo('text-props')
      }
    },
    {
      id: 'only-english',
      graph: { id: 10, x: 175, y: 675 },
      content: 'CSS, like so many other coding languages, has an English bias, meaning the code itself contains English words in its vocabulary. This makes languages like CSS very intuitive for native English speakers, but much more difficult for others. It\'s an important reminder that all technology, even code, have their bias. Usually embedded, consciously or not, by the context and creators of that technology.',
      options: {
        'that\'s bad': (e) => e.goTo('thats-bad')
      }
    },
    {
      id: 'thats-bad',
      graph: { id: 11, x: 175, y: 800 },
      content: 'Like the humans that create them, all technology have their biases. Whether those are good or bad depends heavily on the context and use case. What\'s most important is that we are aware of our technology\'s bias so that we can approach them critically. Understanding a technology\'s bias means we can ask <i>what\'s at stake?</i> and <i>what are the risks?</i> when applying it to any given context.',
      options: {
        understood: (e) => e.goTo('declaration')
      }
    },
    {
      id: 'declaration-block',
      graph: { id: 12, x: 25, y: 925 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(5)
      },
      content: 'Now we just need to decide which HTML elements we want to apply this CSS declaration to. There are a couple of ways to do this, which I\'ll cover in the <i>Basic CSS Template</i>, so for now we\'ll go with the most common which starts with placing our declaration inside a <i>block</i>, which means between <code>{</code> and <code>}</code> brackets.',
      options: {
        'go on': (e) => e.goTo('css-selector'),
        'go back': (e) => e.goTo('declaration')
      }
    },
    {
      id: 'css-selector',
      graph: { id: 13, x: 25, y: 1050 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(6)
      },
      code: '<style>\n  h1 {\n    font-size: 100px;\n  }\n</style>\n\n<h1>Hello World Wide Web</h1>',
      content: 'Then we need to specify which element(s) we want to apply this CSS to by writing a <i>selector</i> before the block. We can write CSS <i>selectors</i> a few different ways. The simplest is a <i>type selector</i>, which is when we write the name of the HTML element we want to apply this CSS block to. Here we\'ve chosen to apply it to our <code>h1</code>.',
      options: {
        'go on': (e) => e.goTo('h1-size'),
        'go back': (e) => e.goTo('declaration-block')
      }
    },
    {
      id: 'h1-size',
      graph: { id: 14, x: 25, y: 1175 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(7)
      },
      content: 'Notice how the <code>h1</code> behind me is now bigger than it was by before, it now has a font-size of 100 pixels. Usually, when you see numbers written in CSS they\'re accompanied by some <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units" target="_blank">unit</a>, in this case <code>px</code> for "pixels".',
      options: {
        'go on': (e) => e.goTo('other-units'),
        'go back': (e) => e.goTo('css-selector')
      }
    },
    {
      id: 'other-units',
      graph: { id: 15, x: 25, y: 1300 },
      content: 'CSS offers several <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units" target="_blank">units</a> for sizing, and while <code>px</code> isn’t always the optimal choice, it’s straightforward. We’ll stick with pixels for this lesson and explore other units later.',
      options: {
        'go on': (e) => e.goTo('review-terms'),
        'go back': (e) => e.goTo('h1-size')
      }
    },
    {
      id: 'review-terms',
      layout: 'welcome',
      graph: { id: 16, x: 25, y: 1425 },
      content: 'Let\'s review our terminology. We\'ve now got a CSS <i>selector</i> followed by a CSS <i>block</i> with a CSS <i>declaration</i> inside of it. This declaration consists of the CSS <code>font-size</code> <i>property</i> with a <i>value</i> set to <code>100px</code>. Together, this entire snippet of code is called a <i>CSS rule</i>. Now that we\'ve covered the basic terminology and syntax, let\'s see this in context.',
      options: {
        'go-on': (e) => e.goTo('in-context'),
        'go back': (e) => e.goTo('other-units')
      }
    },
    {
      id: 'in-context',
      graph: { id: 17, x: 25, y: 1550 },
      layout: 'dock-left',
      before: () => {
        self.$('svg-css-presentation').updateHTML(7)
      },
      code: '<style>\n\n  h1 { font-size: 100px; }\n\n</style>\n\n<h1>Hello World Wide Web</h1>',
      content: 'Here\'s that same CSS Rule, now written in my code editor. Notice that in addition to our <code>h1</code> element, I\'ve also defined a <code>style</code> element. This is a special element which we can use to include CSS code directly into our HTML file, by writing our CSS between the <code>style</code> element\'s opening and closing tag.',
      options: {
        'go on': (e) => e.goTo('css-gui'),
        'go back': (e) => e.goTo('review-terms')
      }
    },
    {
      id: 'css-gui',
      graph: { id: 18, x: 25, y: 1675 },
      layout: 'dock-left',
      before: () => {
        self.$('svg-css-presentation').updateHTML(8)
      },
      content: 'A CSS rule can hold any number of declarations for its selector. In this example I’ve added a few typographic properties. Use the sliders below to change the CSS values in the code. Sliders have fixed minimum and maximum limits, but when you write CSS code yourself you can overcome those limitations and experiment with any values you want.',
      options: {
        'go on': (e) => e.goTo('css-fonts'),
        'go back': (e) => e.goTo('in-context')
      }
    },
    {
      id: 'the-box-model',
      graph: { id: 19, x: 25, y: 1925 },
      content: 'While not immediately apparent, most HTML elements, including this <code>h1</code>, are rectangular boxes by default. An element\'s content, which can be text like this but can also be other HTML elements, is always contained within this rectangle, what\'s known in CSS as "<a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model" target="_blank">the box model</a>".',
      options: {
        'go on': (e) => e.goTo('background-color'),
        'go back': (e) => e.goTo('css-fonts')
      }
    },
    {
      id: 'background-color',
      graph: { id: 20, x: 25, y: 2050 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(9)
      },
      content: 'We can\'t see this box by default, but if we add some <code>background-color</code> to our element the shape of this rectangular box becomes visible. By default <code>h1</code> elements are as wide as their parent element (in this case the body of our entire page) and as tall as the content within it.',
      options: {
        'go on': (e) => e.goTo('css-colors'),
        'go back': (e) => e.goTo('the-box-model')
      }
    },
    {
      id: 'css-colors',
      graph: { id: 21, x: 25, y: 2175 },
      content: 'I\'ve added a color section in the GUI (graphical user interface) in the CSS Reference widget. It contains all the CSS color names. There are of course colors that don\'t have names and these can be written using hex values and special CSS functions, but we\'ll save that for another lesson.',
      options: {
        'go on': (e) => e.goTo('width-height'),
        'go back': (e) => e.goTo('background-color')
      }
    },
    {
      id: 'width-height',
      graph: { id: 22, x: 25, y: 2300 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(10)
      },
      content: 'We can change any element\'s default <code>width</code> and <code>height</code> using these CSS properties. Feel free to adjust the values using the new sliders I\'ve added to the GUI in the widget.',
      options: {
        'go on': (e) => e.goTo('border-props'),
        'go back': (e) => e.goTo('css-colors')
      }
    },
    {
      id: 'border-props',
      graph: { id: 23, x: 25, y: 2425 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(11)
      },
      content: 'There are other aspects of the element\'s box-model we can adjust with CSS. For example using the <code>border-width</code>, <code>border-style</code>, and <code>border-color</code> properties we can add a visible border to our element. Feel free to adjust the values with the GUI.',
      options: {
        'go on': (e) => e.goTo('border-shorthand'),
        'go back': (e) => e.goTo('width-height')
      }
    },
    {
      id: 'border-shorthand',
      graph: { id: 24, x: 25, y: 2550 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(12)
      },
      content: 'Because most developers prefer not to write more code than they have to, it\'s much more common to see this written using the shorthand <code>border</code> property which takes all three values for the border\'s width, style and color (in that order) on the same line separated by spaces.',
      options: {
        'gon on': (e) => e.goTo('margin'),
        'go back': (e) => e.goTo('border-props')
      }
    },
    {
      id: 'margin',
      graph: { id: 25, x: 25, y: 2675 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(13)
      },
      content: 'We can also add a <i>margin</i> around our box which can help to separate it from other elements around it using the <code>margin-top</code>, <code>margin-right</code>, <code>margin-bottom</code> and <code>margin-left</code> properties.',
      options: {
        'go on': (e) => e.goTo('margin-shorthand'),
        'go back': (e) => e.goTo('border-shorthand')
      }
    },
    {
      id: 'margin-shorthand',
      graph: { id: 26, x: 25, y: 2800 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(14)
      },
      content: 'Here again we can shorten it by applying all 4 values into a single <code>margin</code> property, starting with the value for <i>top</i> then going through the rest of the sides clock-wise, first <i>right</i>, then <i>bottom</i> and lastly <i>left</i>.',
      options: {
        'go on': (e) => e.goTo('padding'),
        'go back': (e) => e.goTo('margin')
      }
    },
    {
      id: 'padding',
      graph: { id: 27, x: 25, y: 2925 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(15)
      },
      content: 'The same is true for padding, which is space within the box between the content and its border. Padding can be declared individually with <code>padding-top</code>, <code>padding-right</code>, <code>padding-bottom</code> and <code>padding-left</code> but can also be written on a single line in that same order.',
      options: {
        'go on': (e) => e.goTo('no-more-props'),
        'go back': (e) => e.goTo('margin-shorthand')
      }
    },
    {
      id: 'no-more-props',
      graph: { id: 28, x: 25, y: 3050 },
      before: () => {
        self.$('svg-css-presentation').updateHTML(16)
      },
      content: 'That\'s all the CSS properties we\'ll cover in this lesson. After you finish, you can consult the complete list linked in the CSS section of the Learning Guide whenever you need a refresher. Because there are far more properties than anyone could memorize, most developers focus on memorizing the ones they use most often and simply look up the rest as needed.',
      options: {
        'go on': (e) => e.goTo('css-comments'),
        'go back': (e) => e.goTo('padding')
      }
    },
    {
      id: 'css-comments',
      graph: { id: 29, x: 25, y: 3175 },
      content: 'I\'ve added some comments to our CSS rule. Just like HTML (and virtually every coding language) we can leave comments in our CSS code which the browser will ignore, but serve as useful references for us and other folks who might look at our code. In this case I\'m using comments to separate out these three sections of propertites in our CSS rule.',
      options: {
        'go on': (e) => e.goTo('any-order'),
        'go back': (e) => e.goTo('no-more-props')
      }
    },
    {
      id: 'any-order',
      graph: { id: 30, x: 25, y: 3300 },
      content: 'You can place CSS properties in whatever order you want when creating CSS rules, there are some conventions but what\'s most important is that you keep things consistent as you start adding other CSS rule blocks.',
      options: {
        'go on': (e) => e.goTo('end-of-css'),
        'go back': (e) => e.goTo('css-comments')
      }
    },
    {
      id: 'end-of-css',
      graph: { id: 31, x: 250, y: 3300 },
      layout: 'dock-left',
      before: () => {
        self.$('svg-css-presentation').updateHTML(16)
      },
      content: 'Feel free to keep experimenting with the GUI in the CSS reference widget to update my code. When you\'re ready to start adding additional CSS rules let me know and we can start working on a basic CSS template.',
      options: {
        'let\'s move on': (e) => {
          e.hide()
          NNE.code = ''
          NNW.layout = 'dock-left'
          self.close()
          utils.afterLayoutTransition(() => {
            WIDGETS.load('template-projects', w => w.startGuide('css-basic'))
          })
        },
        'go back': (e) => e.goTo('any-order'),
        'i\'m going to experiment with this a bit': (e) => e.hide()
      }
    },
    {
      id: 'css-fonts',
      graph: { id: 32, x: 25, y: 1800 },
      content: 'In addition to those value sliders, the GUI (graphical user interface) in the CSS Reference widget also contains a select menu for changing the <code>font-family</code> to any generic family name. You can include specific typefaces and even upload your own fonts when designing websites, but we\'ll save that for another lesson.',
      options: {
        'go on': (e) => e.goTo('the-box-model'),
        'go back': (e) => e.goTo('css-gui')
      }
    },
    {
      id: 'no-edit',
      graph: { id: 33, x: 150, y: 25 },
      content: 'You can\'t edit the code directly during this guided lesson, you\'ll have the use the GUI I create in the CSS Reference widget or you can click "end guided intro" to exit this guide.',
      options: {
        ok: (e) => {
          if (self._lastConvo && self._lastConvo !== 'no-edit') e.goTo(self._lastConvo)
          else e.hide()
        }
      }
    }
  ]
}
