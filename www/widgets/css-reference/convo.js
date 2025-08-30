/* global nn NNW NNE utils WIDGETS */
/* eslint no-template-curly-in-string: "off" */
window.CONVOS['css-reference'] = (self) => {
  return [
    {
      id: 'confirm-start',
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
      edit: true,
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
        self.$('svg-css-animated').updateHTML(1)
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
        self.$('svg-css-animated').updateHTML(2)
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
        self.$('svg-css-animated').updateHTML(3)
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
        self.$('svg-css-animated').updateHTML(4)
      },
      content: 'In order to see this code in context we\'ll need introduce some of CSS\'s <i>syntax</i>, first a colon <code>;</code>. This is what we use to assign a value to a property. The value must always be followed by a semi-colon <code>;</code>. Together, a line of CSS code like this is called a "declaration", because we\'ve "declared" what we want our font-size to be.',
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
        'I see': (e) => e.goTo('declaration')
      }
    },
    {
      id: 'declaration-block',
      graph: { id: 12, x: 25, y: 925 },
      before: () => {
        self.$('svg-css-animated').updateHTML(5)
      },
      content: 'Now we just need to decide which HTML elements we want to apply this CSS declaration to. There are few different ways to do this, which I\'ll cover in the <i>Basic CSS Template</i>, so for now we\'ll go with the most common which starts with placing our declaration inside a <i>block</i>, which means between <code>{</code> and <code>}</code> brackets.',
      options: {
        'go on': (e) => e.goTo('css-selector'),
        'go back': (e) => e.goTo('declaration')
      }
    },
    {
      id: 'css-selector',
      graph: { id: 13, x: 25, y: 1050 },
      before: () => {
        self.$('svg-css-animated').updateHTML(6)
      },
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
        self.$('svg-css-animated').updateHTML(7)
      },
      content: 'Notice how the <code>h1</code> behind me is now bigger than it was by default, it\'s 100 pixels to be exact. Most of the times you see numbers written in CSS they\'re accompanied by some <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units" target="_blank">unit</a>, in this case <code>px</code>.',
      options: {
        'go on': (e) => e.goTo('other-units'),
        'go back': (e) => e.goTo('css-selector')
      }
    },
    {
      id: 'other-units',
      graph: { id: 15, x: 25, y: 1300 },
      content: 'There are other units we can use to change the size of something in CSS, and depending on your goals <code>px</code> might not be the best approach, but it is straight forward, so we\'ll still to it for the rest of this lesson and save exploring other units for later.',
      options: {
        'go on': (e) => e.goTo('review-terms'),
        'go back': (e) => e.goTo('h1-size')
      }
    },
    {
      id: 'review-terms',
      graph: { id: 16, x: 25, y: 1425 },
      content: 'Let\'s review our terminology. We\'ve now got a CSS <i>selector</i> followed by a CSS <i>block</i> with a CSS <i>declaration</i> inside of it. This declaration consists of the CSS "font-size" <i>property</i> with a <i>value</i> set to <code>100px</code> or one-hundred pixels. Together, this entire snippet of code is called a <i>CSS rule</i>. Now that we\'ve covered the basic terminology and syntax, let\'s see this in context.',
      options: {
        'go-on': (e) => e.goTo('in-context'),
        'go back': (e) => e.goTo('other-units')
      }
    },
    {
      id: 'in-context',
      graph: { id: 17, x: 25, y: 1550 },
      content: 'Here\'s that same CSS Rule, now written in my code editor. Notice that in addition to our <code>h1</code> element, I\'ve also defined a <code>style</code> element. This is a special element which we can use to include CSS code directly into our HTML file, by writing our CSS between the <code>style</code> element\'s opening and closing tag.',
      options: {
        'go on': (e) => e.goTo('css-gui'),
        'go back': (e) => e.goTo('review-terms')
      }
    },
    {
      id: 'css-gui',
      graph: { id: 18, x: 25, y: 1675 },
      content: 'A CSS rule can contain as many declarations as you want to apply to given selector. Here I\'ve added a few more for modifying the typography, use the sliders to experiment with those values. The sliders in this GUI (graphical user interface) have a minimum and maximum value which is an inherent limitation of graphical interfaces like these. However, once you start writing your own CSS code you can experiment with values as large or as small as you like.',
      options: {
        'go on': (e) => e.goTo('the-box-model'),
        'go back': (e) => e.goTo('in-context')
      }
    },
    {
      id: 'the-box-model',
      graph: { id: 19, x: 25, y: 1800 },
      content: 'While not immediately apparent, most HTML elements, including this <code>h1</code>, are rectangular boxes by default. An element\'s content, which can be text like this but can also be other HTML elements, is always contained within this rectangle, what\'s known in CSS as "<a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model" target="_blank">the box model</a>".',
      options: {
        'go on': (e) => e.goTo('background-color'),
        'go back': (e) => e.goTo('css-gui')
      }
    },
    {
      id: 'background-color',
      graph: { id: 20, x: 25, y: 1925 },
      content: 'We can\'t see this box by default, but if we add some <code>background-color</code> to our element the shape of this rectangular box becomes visible. By default <code>h1</code> elements are as wide as their parent element (in this case the body of our entire page) and as tall as the content within it.',
      options: {
        'go on': (e) => e.goTo('css-colors'),
        'go back': (e) => e.goTo('the-box-model')
      }
    },
    {
      id: 'css-colors',
      graph: { id: 21, x: 25, y: 2050 },
      content: 'I\'ve added a color selection list in the GUI (graphical user interface) in the CSS Reference widget for you to experiment with. It contains all the CSS color names. There are of course colors that don\'t have names and these can be written using hex values and special CSS functions, but we\'ll save that for another lesson.',
      options: {
        'go on': (e) => e.goTo('width-height'),
        'go back': (e) => e.goTo('background-color')
      }
    },
    {
      id: 'width-height',
      graph: { id: 22, x: 25, y: 2175 },
      content: 'We can change any element\'s default <code>width</code> and <code>height</code> using these CSS properties. Feel free to adjust the values using the new sliders I\'ve added to the GUI (graphical user interface) in the widget.',
      options: {
        'go on': (e) => e.goTo('border-props'),
        'go back': (e) => e.goTo('css-colors')
      }
    },
    {
      id: 'border-props',
      graph: { id: 23, x: 25, y: 2300 },
      content: 'There are other aspects of the element\'s box-model we can adjust with CSS. For example using the <code>border-width</code>, <code>border-style</code>, and <code>border-color</code> properties we can add a visible border to our element. Feel free to adjust the values with the GUI.',
      options: {
        'go on': (e) => e.goTo('border-shorthand'),
        'go back': (e) => e.goTo('width-height')
      }
    },
    {
      id: 'border-shorthand',
      graph: { id: 24, x: 25, y: 2425 },
      content: 'Because most developers prefer not to write more code than they have to, it\'s much more common to see this written using the shorthand <code>border</code> property which takes all three values for the border\'s width, style and color (in that order) on the same line separated by spaces.',
      options: {
        'gon on': (e) => e.goTo('margin'),
        'go back': (e) => e.goTo('border-props')
      }
    },
    {
      id: 'margin',
      graph: { id: 25, x: 25, y: 2550 },
      content: 'We can also add a <i>margin</i> around our box which can help to separate it from other elements around it using the <code>margin-top</code>, <code>margin-right</code>, <code>margin-bottom</code> and <code>margin-left</code> properties.',
      options: {
        'go on': (e) => e.goTo('margin-shorthand'),
        'go back': (e) => e.goTo('border-shorthand')
      }
    },
    {
      id: 'margin-shorthand',
      graph: { id: 26, x: 25, y: 2675 },
      content: 'Here again we can shorten it by applying all 4 values into a single <code>margin</code> property, starting with the value for <i>top</i> then going through the rest of the sides clock-wise, first <i>right</i>, then <i>bottom</i> and lastly <i>left</i>.',
      options: {
        'go on': (e) => e.goTo('padding'),
        'go back': (e) => e.goTo('margin')
      }
    },
    {
      id: 'padding',
      graph: { id: 27, x: 25, y: 2800 },
      content: 'The same is true for padding, which is space within the box between the content and it\'s border. Padding can be declared individually with <code>padding-top</code>, <code>padding-right</code>, <code>padding-bottom</code> and <code>padding-left</code> but can also be written on a single line in that same order.',
      options: {
        'go on': (e) => e.goTo('no-more-props'),
        'go back': (e) => e.goTo('margin-shorthand')
      }
    },
    {
      id: 'no-more-props',
      graph: { id: 28, x: 25, y: 2925 },
      content: 'That\'s all the CSS properties we\'ll cover in this lesson. After you finish, you can consult the complete list linked at the bottom of the CSS Reference widget whenever you need a refresher. Because there are far more properties than anyone could memorize, most developers focus on memorizing the ones they use most often and simply look up the rest as needed.',
      options: {
        'go on': (e) => e.goTo('css-comments'),
        'go back': (e) => e.goTo('padding')
      }
    },
    {
      id: 'css-comments',
      graph: { id: 29, x: 25, y: 3050 },
      content: 'I\'ve added some comments to our CSS Rule, just like HTML (and virtually every coding language) we can leave comments in our CSS code which the browser will ignore, but serve as useful references for us and other folks who might look at our code. In this case I\'m using comments to separate out these two sections of our CSS propertites in our CSS rule.',
      options: {
        'go on': (e) => e.goTo('any-order'),
        'go back': (e) => e.goTo('no-more-props')
      }
    },
    {
      id: 'any-order',
      graph: { id: 30, x: 25, y: 3175 },
      before: () => {
        self.$('svg-css-animated').updateHTML(7)
      },
      content: 'You can place CSS properties in whatever order you want when creating CSS rules, but it\'s a convention to place your box-model properties above any typography properties, which is why I\'ve done so here.',
      options: {
        'go on': (e) => e.goTo('end-of-css'),
        'go back': (e) => e.goTo('css-comments')
      }
    },
    {
      id: 'end-of-css',
      graph: { id: 31, x: 250, y: 3175 },
      before: () => {
        self.$('svg-css-animated').updateHTML(7)
      },
      content: 'Feel free to keep experimenting with the GUI in the CSS reference widget to update my code. When you\'re ready to start coding yourself let me know and we can start working on a basic CSS template.',
      options: {
        ok: (e) => {
          e.hide()
          NNE.code = ''
          NNW.layout = 'dock-left'
          self.close()
          utils.afterLayoutTransition(() => {
            WIDGETS.load('template-projects', w => w.startGuide('css-basic'))
          })
        },
        'go back': (e) => e.goTo('any-order')
      }
    }
  ]
}
