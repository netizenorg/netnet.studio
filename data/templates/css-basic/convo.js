/* global WIDGETS */
window.CONVOS['template-css-basic'] = (self) => {
  return [
    {
      id: 'starter-html',
      layout: 'dock-bottom',
      before: () => {
        WIDGETS['template-toc'].update({ right: 20 }, 500)
      },
      graph: { id: 1, x: 100, y: 100 },
      content: 'We\'ll start this template with the code from the <b>Basic HTML</b> template and build on it using some of what we learned in the <b>Guided Intro to CSS</b>',
      options: {
        'go on': (e) => e.goTo('html'),
        'I\'m not familiar with this template?': (e) => e.goTo('what-basic-html'),
        'What guided intro to CSS?': (e) => e.goTo('what-css-guide')
      }
    },
    {
      id: 'html',
      graph: { id: 3, x: 100, y: 250 },
      content: 'As we learned in the guide for this HTML template, our "root" <code>&lt;html&gt;</code> element usually contains two children: the <code>&lt;head&gt;</code>, which is where you put information <i>about</i> the page, and the <code>&lt;body&gt;</code>, where you put the actual content people see on the page.',
      options: {
        'go on': (e) => e.goTo('style-ele'),
        'go back': (e) => e.goTo('starter-html')
      }
    },
    {
      id: 'what-basic-html',
      graph: { id: 4, x: 300, y: 50 },
      content: 'The basic HTML template explains all the HTML code you see here by building it up line by line. Do you want to start there to better understand this HTML structure or should we continue from here and style this template with CSS?',
      options: {
        'let\'s continue with CSS': (e) => e.goTo('html'),
        'let\'s go back to the basic HTML': (e) => {
          WIDGETS['template-projects'].cancel()
          WIDGETS.load('template-projects', w => w.loadTemplate('html-basic'))
        }
      }
    },
    {
      id: 'what-css-guide',
      graph: { id: 5, x: 300, y: 200 },
      content: 'If you\'re new to CSS I can guide you through an introduction to the basic concepts first and then we can return to this guided template afterwards?',
      options: {
        'no thanks, let\'s continue here': (e) => e.goTo('html'),
        'ok, let\'s do the CSS intro first': (e) => {
          WIDGETS['template-projects'].cancel()
          WIDGETS.open('css-reference', (w) => w.toggleIntroPresentation())
        }
      }
    },
    {
      id: 'style-ele',
      graph: { id: 6, x: 100, y: 400 },
      content: 'When structuring an HTML page this way, we typically place the <code>&lt;style&gt;</code> element we discussed in the <b>CSS Intro</b> within the <code>&lt;head&gt;</code>. This is where we\'ll write our CSS code.',
      options: {
        'go on': (e) => e.goTo('style-attr'),
        'go back': (e) => e.goTo('html')
      }
    },
    {
      id: 'style-attr',
      graph: { id: 7, x: 100, y: 550 },
      content: 'That said, we could add CSS code to any element in our <code>&lt;body&gt;</code> directly. We could do this by adding a <code>style</code> <i>attribute</i> to any element, like our <code>&lt;h1&gt;</code> for example. This is great for quick hacks, but it\'s not considered best practice.',
      options: {
        'go on': (e) => e.goTo('more-content'),
        'why not?': (e) => e.goTo('best-style'),
        'go back': (e) => e.goTo('style-ele')
      }
    },
    {
      id: 'best-style',
      graph: { id: 8, x: 275, y: 625 },
      content: 'Using the <code>style</code> attribute works, but it\'s not best practice because it mixes structure and design, making your HTML harder to read and maintain, and it forces you to repeat the same styles over and over when something changes. It also removes many of CSS\'s strengths, like reusable rules and hover effects (which we\'ll get to soon), so instead of having a flexible styling system, you end up with lots of one-off instructions that are harder to keep consistent.',
      options: {
        'I see': (e) => e.goTo('more-content'),
        'go back': (e) => e.goTo('style-attr')
      }
    },
    {
      id: 'more-content',
      graph: { id: 9, x: 100, y: 700 },
      content: 'Before we write our CSS rules within our <code>&lt;style&gt;</code> <i>element</i>, let\'s add a little more content to our HTML so that our style changes become more noticeable. I\'ll add some <a href="https://en.wikipedia.org/wiki/Lorem_ipsum" target="_blank">lorem ipsum</a> text to our paragraph as well as a couple more links in our <code>&lt;nav&gt;</code>.',
      options: {
        'go on': (e) => e.goTo('body-rule'),
        'go back': (e) => e.goTo('style-attr')
      }
    },
    {
      id: 'body-rule',
      graph: { id: 10, x: 100, y: 850 },
      content: 'We\'ll start our CSS by creating a new rule for the <code>&lt;body&gt;</code> element. In it I\'ll assign a new <code>font-family</code>. Notice how I have three different fonts listed, each separated by a comma, this is called a "font stack."',
      options: {
        'go on': (e) => e.goTo('generic-font'),
        'go back': (e) => e.goTo('more-content')
      }
    },
    {
      id: 'generic-font',
      graph: { id: 11, x: 100, y: 1000 },
      content: 'We could instead just list a generic font family name like <code>serif</code>, <code>monospace</code>, or <code>sans-serif</code>, which points to a general style of font rather than a specific typeface. However, if we want something more specific, like Helvetica, we can list that too.',
      options: {
        'go on': (e) => e.goTo('helvetica'),
        'go back': (e) => e.goTo('body-rule')
      }
    },
    {
      id: 'helvetica',
      graph: { id: 12, x: 100, y: 1150 },
      content: 'Helvetica is a very common font, there\'s even an entire <a href="https://www.imdb.com/title/tt0847817/" target="_blank">documentary</a> about it, but specific fonts like this will only load if the person visiting your site already has them installed on their computer. Since not all operating systems come with Helvetica, we\'ve listed Arial as a backup. If they don\'t have either, the browser will fall back to whatever generic <code>sans-serif</code> font they have.',
      options: {
        'go on': (e) => e.goTo('body-props'),
        'can I load my own fonts?': (e) => e.goTo('custom-fonts'),
        'go back': (e) => e.goTo('generic-font')
      }
    },
    {
      id: 'body-props',
      graph: { id: 13, x: 100, y: 1300 },
      content: 'Next I\'ll add a new <code>line-height</code> and <code>color</code>. Notice how this rule affects all of the body\'s child elements: the <code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code>, and <code>&lt;a&gt;</code> elements all receive the body\'s font-family and line-height. This is because child elements "inherit" many of their parent\'s properties as they "cascade" down.',
      options: {
        'go on': (e) => e.goTo('inherit'),
        'go back': (e) => e.goTo('helvetica')
      }
    },
    {
      id: 'custom-fonts',
      graph: { id: 14, x: 300, y: 1225 },
      content: 'Yes, you can! It\'s a little more advanced, but it is possible to use a very specific font that users probably don\'t already have by importing your own font files. This is something we\'ll discuss in other CSS templates and demos in the Learning Guide. For now, let\'s keep reviewing the basics.',
      options: {
        'go on': (e) => e.goTo('body-props'),
        'go back': (e) => e.goTo('helvetica')
      }
    },
    {
      id: 'inherit',
      graph: { id: 15, x: 100, y: 1450 },
      content: 'Not all properties are inherited, though. Notice that while the <code>&lt;h1&gt;</code> and <code>&lt;p&gt;</code> inherited their parent\'s color, the <code>&lt;a&gt;</code> elements did not. This is because of "specificity", <code>&lt;a&gt;</code> elements have a specific default color that takes precedence over what they would otherwise inherit.',
      options: {
        'go on': (e) => e.goTo('type-sele'),
        'go back': (e) => e.goTo('body-props')
      }
    },
    {
      id: 'type-sele',
      graph: { id: 16, x: 100, y: 1600 },
      content: 'That said, we can create a rule <i>specifically</i> for the <code>&lt;a&gt;</code> element, and because this rule is more "specific" than a default, it will override the element\'s default color as well as the font-family it had inherited which "cascaded" down from the <code>&lt;body&gt;</code>.',
      options: {
        'go on': (e) => e.goTo('display-prop'),
        'go back': (e) => e.goTo('inherit')
      }
    },
    {
      id: 'display-prop',
      graph: { id: 17, x: 100, y: 1750 },
      content: 'Next, I want to discuss the <code>display</code> property, which controls how elements behave in the layout. To demonstrate this, I\'ll create another CSS rule, this time for all our <code>&lt;h1&gt;</code> elements.',
      options: {
        'go on': (e) => e.goTo('more-specific'),
        'go back': (e) => e.goTo('type-sele')
      }
    },
    {
      id: 'more-specific',
      graph: { id: 18, x: 100, y: 1900 },
      content: 'Here again it\'s worth noting that the <code>&lt;h1&gt;</code> element\'s styles come from two different CSS rules: the color, border, and width are set in the <code>h1</code> rule, while the font-family and line-height are inherited from its parent, the <code>body</code> rule. Both rules define a value for <code>color</code>, but the <code>h1</code> rule takes precedence because it is more specific than inheritance.',
      options: {
        'go on': (e) => e.goTo('a-inline'),
        'go back': (e) => e.goTo('display-prop')
      }
    },
    {
      id: 'a-inline',
      graph: { id: 19, x: 100, y: 2050 },
      content: 'Let\'s modify the rule we created for our <code>a</code> type selector, and instead give them the same properties we gave our <code>h1</code>. You\'ll notice that the color and border apply, but not the width. This is because <code>&lt;a&gt;</code> elements are "inline" by default, whereas <code>&lt;h1&gt;</code> elements are "block."',
      options: {
        'go on': (e) => e.goTo('block-v-inline'),
        'go back': (e) => e.goTo('more-specific')
      }
    },
    {
      id: 'block-v-inline',
      graph: { id: 20, x: 100, y: 2200 },
      content: 'Block elements (like <code>&lt;p&gt;</code> or <code>&lt;h1&gt;</code>) start on a new line and take up the full width of their container, while inline elements (like <code>&lt;a&gt;</code> or <code>&lt;input&gt;</code>) stay inside the line of text and only take up as much space as their content, which is why block elements stack vertically and inline elements flow along with words in a sentence.',
      options: {
        'go on': (e) => e.goTo('display-prop2'),
        'go back': (e) => e.goTo('a-inline')
      }
    },
    {
      id: 'display-prop2',
      graph: { id: 21, x: 100, y: 2350 },
      content: 'Like any aspect of an element\'s style, this can be changed in CSS. We could give our <code>&lt;a&gt;</code> elements a <code>display</code> of <code>block</code>, and they would start behaving like block elements, at which point the width we defined earlier would apply.',
      options: {
        'go on': (e) => e.goTo('class-sele'),
        'go back': (e) => e.goTo('block-v-inline')
      }
    },
    {
      id: 'class-sele',
      graph: { id: 22, x: 100, y: 2500 },
      content: 'What if we only wanted to apply this change to one specific <code>&lt;a&gt;</code> element? We can do that using a class selector. In CSS, a "class" is a selector that begins with a <code>.</code> and uses a name we choose. I\'ve called this one "big-link".',
      options: {
        'go on': (e) => e.goTo('type-v-class'),
        'go back': (e) => e.goTo('display-prop2')
      }
    },
    {
      id: 'type-v-class',
      graph: { id: 23, x: 100, y: 2650 },
      content: 'Unlike <i>type</i> selectors, which apply to every element of that type, a <i>class</i> selector is applied by adding a <code>class</code> attribute to a specific HTML element. Now only that one <code>&lt;a&gt;</code> element will be displayed as a block.',
      options: {
        'go on': (e) => e.goTo('multi-class'),
        'go back': (e) => e.goTo('class-sele')
      }
    },
    {
      id: 'multi-class',
      graph: { id: 24, x: 100, y: 2800 },
      content: 'The same class can be applied to as many elements as you\'d like. To demonstrate, I\'ve added it to one of the <code>&lt;a&gt;</code> elements in the paragraph as well as the <code>&lt;h1&gt;</code> element, which is already a block so there\'s no visible change.',
      options: {
        'go on': (e) => e.goTo('the-cascade'),
        'go back': (e) => e.goTo('type-v-class')
      }
    },
    {
      id: 'the-cascade',
      graph: { id: 25, x: 100, y: 2950 },
      content: 'Understanding how the CSS cascade works, and which selectors are more "specific" than others, takes some getting used to. Whenever you need a reference, you can view <span class="link" onclick="WIDGETS.open(\'css-reference\', w => w.openDocs(\'cascadeOpts\'))">The Cascade</span> Docs in the CSS section of the Learning Guide.',
      options: {
        'go on': (e) => e.goTo('bit-messy'),
        'go back': (e) => e.goTo('multi-class')
      }
    },
    {
      id: 'bit-messy',
      graph: { id: 26, x: 100, y: 3100 },
      content: 'This is starting to look a little messy, so let\'s remove some of this demo code and create a new class we\'ll actually use. I\'ve called it <code>wrap</code> because it will wrap our page\'s main content.',
      options: {
        'go on': (e) => e.goTo('div-wrap'),
        'go back': (e) => e.goTo('the-cascade')
      }
    },
    {
      id: 'div-wrap',
      graph: { id: 27, x: 100, y: 3250 },
      content: 'I\'ll do this by creating a new generic <code>&lt;div&gt;</code> element to act as a container with this "wrap" class applied to it, and I\'ll place the <code>&lt;h1&gt;</code> and <code>&lt;p&gt;</code> elements inside it.',
      options: {
        'go on': (e) => e.goTo('center-col'),
        'go back': (e) => e.goTo('bit-messy')
      }
    },
    {
      id: 'center-col',
      graph: { id: 28, x: 100, y: 3400 },
      content: 'We\'ll use this new rule to transform our content into a centered single-column layout using a simple and common responsive design convention: <code>max-width</code> to limit how wide the content can grow, and <code>margin: auto</code> to keep it centered as the screen size changes.',
      options: {
        'go on': (e) => e.goTo('even-more-specific'),
        'responsive design?': (e) => e.goTo('rwd'),
        'how does that center it?': (e) => e.goTo('how-center'),
        'go back': (e) => e.goTo('div-wrap')
      }
    },
    {
      id: 'even-more-specific',
      graph: { id: 29, x: 100, y: 3800 },
      content: 'We\'ve discussed "type" and "class" selectors for CSS rules, but we can get even more specific, not only defining <i>which</i> elements we want to style but also <i>when</i> we want those styles to be applied.',
      options: {
        'go on': (e) => e.goTo('hover'),
        'go back': (e) => e.goTo('center-col')
      }
    },
    {
      id: 'rwd',
      graph: { id: 30, x: 300, y: 3400 },
      content: 'Responsive design is a way of building websites so they automatically adapt to different screen sizes and devices, making sure the content always fits well and is easy to read and use.',
      options: {
        'go on': (e) => e.goTo('rwd2'),
        'go back': (e) => e.goTo('center-col')
      }
    },
    {
      id: 'rwd2',
      graph: { id: 31, x: 450, y: 3400 },
      content: 'Responsive design is especially important on the web because, unlike physically printed material, websites can be viewed on many different screen sizes and devices. This idea was developed in the early days of web design and was most famously articulated in <a href="https://alistapart.com/article/dao/" target="_blank">The Dao of Web Design</a> by John Allsopp (2000), which encourages us to let content adapt and flow naturally instead of forcing it into one fixed layout.',
      options: {
        'go on': (e) => e.goTo('rwd3'),
        'go back': (e) => e.goTo('rwd')
      }
    },
    {
      id: 'rwd3',
      graph: { id: 32, x: 600, y: 3400 },
      content: 'This use of <code>max-width</code> is an example of responsive design because it lets the layout be wide on large screens but still shrink on small screens, whereas using a fixed <code>width</code> would lock the layout to one size and cause horizontal scrolling on phones when the screen is narrower than that width.',
      options: {
        'ok, I get it': (e) => e.goTo('re-route'),
        'but why\'s it centered?': (e) => e.goTo('how-center'),
        'go back': (e) => e.goTo('rwd2')
      }
    },
    {
      id: 're-route',
      graph: { id: 33, x: 300, y: 3600 },
      content: 'Ok, returning now to where we left off centering our <i>wrap</i> element. Should we continue, or would you like me to clarify anything else?',
      options: {
        'ok, let\'s move on': (e) => e.goTo('even-more-specific'),
        'what\'s responsive design': (e) => e.goTo('rwd'),
        'explain the centering': (e) => e.goTo('how-center')
      }
    },
    {
      id: 'how-center',
      graph: { id: 34, x: 450, y: 3700 },
      content: 'Using <code>margin: auto</code> on a block element tells the browser to evenly distribute the extra horizontal space on both sides, which causes the element to sit in the center of its container instead of being pushed to the left or right. This is a very common way to center block elements, though there are other techniques as well.',
      options: {
        'ok, I get it': (e) => e.goTo('re-route'),
        'what other techniques?': (e) => e.goTo('more-center'),
        'go back': (e) => e.goTo('rwd3')
      }
    },
    {
      id: 'more-center',
      graph: { id: 35, x: 600, y: 3700 },
      content: 'I\'ll show you! I\'ll start by adding another <code>&lt;h1&gt;</code> element with its own special class above our <code>wrap</code> element to demonstrate some other approaches to centering.',
      options: {
        'go on': (e) => e.goTo('text-align'),
        'go back': (e) => e.goTo('how-center')
      }
    },
    {
      id: 'text-align',
      graph: { id: 36, x: 750, y: 3700 },
      content: 'If, for example, what you want to center is text, you could use <code>text-align: center</code>. As the property name suggests, this centers the text, not the element itself. If we give this <code>&lt;h1&gt;</code> a border, we can see that it still has its default width of 100%.',
      options: {
        'go on': (e) => e.goTo('mod-width'),
        'go back': (e) => e.goTo('more-center')
      }
    },
    {
      id: 'mod-width',
      graph: { id: 37, x: 900, y: 3700 },
      content: 'If we change the element\'s width, it no longer appears centered. The text remains centered inside it, but the element itself is still anchored to the left, which is the default for block elements.',
      options: {
        'go on': (e) => e.goTo('center-ele'),
        'go back': (e) => e.goTo('text-align')
      }
    },
    {
      id: 'center-ele',
      graph: { id: 38, x: 1050, y: 3700 },
      content: 'To center an element, we have a few options. In the early days of HTML, people often used the <code>&lt;center&gt;</code> element, which would center anything placed inside it, like this <code>&lt;h1&gt;</code>. However, <code>&lt;center&gt;</code> is now considered "obsolete" and may not work in all browsers. The modern web prefers to separate structure and meaning (HTML) from presentation and layout (CSS).',
      options: {
        'go on': (e) => e.goTo('container'),
        'go back': (e) => e.goTo('mod-width')
      }
    },
    {
      id: 'container',
      graph: { id: 39, x: 1200, y: 3700 },
      content: 'Knowing this, we can replace the obsolete <code>&lt;center&gt;</code> element with a more general-purpose <code>&lt;div&gt;</code> and give it a class such as <code>container</code>.',
      options: {
        'go on': (e) => e.goTo('flex-container'),
        'go back': (e) => e.goTo('center-ele')
      }
    },
    {
      id: 'flex-container',
      graph: { id: 40, x: 1350, y: 3700 },
      content: 'We can then make this <code>&lt;div&gt;</code> a <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank">flexbox</a> container by changing its <code>display</code> to <code>flex</code>. By default not much changes, but it unlocks a set of special properties that control how the container\'s children (in this case just our <code>&lt;h1&gt;</code>) are laid out.',
      options: {
        'go on': (e) => e.goTo('justify-div'),
        'go back': (e) => e.goTo('container')
      }
    },
    {
      id: 'justify-div',
      graph: { id: 41, x: 1500, y: 3700 },
      content: 'We can add <code>justify-content: center</code> to center the content horizontally with only a couple lines of CSS.',
      options: {
        'go on': (e) => e.goTo('height-div'),
        'go back': (e) => e.goTo('flex-container')
      }
    },
    {
      id: 'align-div',
      graph: { id: 42, x: 1800, y: 3700 },
      content: 'However, if we add the flex property <code>align-items: center</code>, the container\'s children will now be centered vertically as well.',
      options: {
        'go on': (e) => e.goTo('no-flex'),
        'go back': (e) => e.goTo('height-div')
      }
    },
    {
      id: 'no-flex',
      graph: { id: 43, x: 1950, y: 3700 },
      content: 'However, if all we want is to center this <code>&lt;h1&gt;</code> horizontally, we don\'t need a parent or flexbox at all, we can just use margins as we did earlier with our "wrap". By giving the <code>&lt;h1&gt;</code> margin properties, we\'re adding space around it.',
      options: {
        'go on': (e) => e.goTo('div-auto'),
        'go back': (e) => e.goTo('align-div')
      }
    },
    {
      id: 'div-auto',
      graph: { id: 44, x: 2100, y: 3700 },
      content: 'When we use the special value <code>auto</code> for the left and right margins, the browser automatically calculates the remaining space and splits it evenly, which centers the element.',
      options: {
        'go on': (e) => e.goTo('one-liner'),
        'go back': (e) => e.goTo('no-flex')
      }
    },
    {
      id: 'one-liner',
      graph: { id: 45, x: 2100, y: 3575 },
      content: 'We can write this as a one-liner by using the <code>margin</code> property to apply the same value to all four sides.',
      options: {
        'go on': (e) => e.goTo('re-route'),
        'go back': (e) => e.goTo('div-auto')
      }
    },
    {
      id: 'hover',
      graph: { id: 46, x: 100, y: 3950 },
      content: 'For example, we can create a CSS rule for our <code>&lt;a&gt;</code> element using the <code>:hover</code> pseudo-class. Setting <code>text-decoration: none</code> removes the underline, but because this rule only applies on <code>:hover</code>, the underline disappears only when the user moves their mouse over a link. Try hovering over a link to see for ourself.',
      options: {
        'go on': (e) => e.goTo('pseudo-classes'),
        'go back': (e) => e.goTo('even-more-specific')
      }
    },
    {
      id: 'pseudo-classes',
      graph: { id: 47, x: 100, y: 4100 },
      content: 'There are other pseudo-classes we can use in CSS rules. For example, <code>a:visited</code> applies only to links you\'ve already visited, and <code>a:active</code> applies only while a link is being clicked.',
      options: {
        'go on': (e) => e.goTo('child-sele'),
        'go back': (e) => e.goTo('hover')
      }
    },
    {
      id: 'child-sele',
      graph: { id: 48, x: 100, y: 4250 },
      content: 'The last part I want to work on are the links inside the <code>&lt;nav&gt;</code>. I want them to look different from the links in our paragraph. We can target these links specifically using a "child selector" with the <code>&gt;</code> symbol.',
      options: {
        'go on': (e) => e.goTo('dir-child'),
        'go back': (e) => e.goTo('pseudo-classes')
      }
    },
    {
      id: 'dir-child',
      graph: { id: 49, x: 100, y: 4400 },
      content: 'As I add styles to this rule, you\'ll notice they only apply to <code>&lt;a&gt;</code> elements that are direct children of the <code>&lt;nav&gt;</code>, not the ones inside our <code>&lt;p&gt;</code>.',
      options: {
        'go on': (e) => e.goTo('nav-hover'),
        'go back': (e) => e.goTo('child-sele')
      }
    },
    {
      id: 'nav-hover',
      graph: { id: 50, x: 100, y: 4550 },
      content: 'We\'ll also add another rule for when a visitor hovers over one of the <code>&lt;a&gt;</code> elements inside the <code>&lt;nav&gt;</code>. Most selectors are simple, but they can become more complex like this. Remember, you can double-click any selector in the editor and I\'ll do my best to explain which elements on the page are effected by it. You can also view the <span class="link" onclick="WIDGETS.open(\'css-reference\', w => w.openDocs(\'selectorListOpts\'))">Selectors List</span> in the Learning Guide for more examples.',
      options: {
        'go on': (e) => e.goTo('link-tree'),
        'go back': (e) => e.goTo('dir-child')
      }
    },
    {
      id: 'link-tree',
      graph: { id: 51, x: 100, y: 4700 },
      content: 'I want these links to appear as a centered column, like a "link tree," so I\'ll create one last rule for the <code>&lt;nav&gt;</code> that turns it into a CSS "<a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank">flexbox</a>" container.',
      options: {
        'go on': (e) => e.goTo('flexbox'),
        'go back': (e) => e.goTo('nav-hover')
      }
    },
    {
      id: 'flexbox',
      graph: { id: 52, x: 100, y: 4850 },
      content: 'By setting its <code>display</code> to <code>flex</code>, we unlock a set of special <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank">flexbox</a> properties that control how the container\'s children (our <code>&lt;a&gt;</code> elements) are laid out.',
      options: {
        'go on': (e) => e.goTo('space-around'),
        'go back': (e) => e.goTo('link-tree')
      }
    },
    {
      id: 'space-around',
      graph: { id: 53, x: 100, y: 5000 },
      content: 'For example, <code>justify-content: space-around</code> evenly spaces the links horizontally, and this spacing adjusts as the browser size changes. Other values like <code>space-between</code> or <code>center</code> give us different layouts.',
      options: {
        'go on': (e) => e.goTo('flex-column'),
        'go back': (e) => e.goTo('flexbox')
      }
    },
    {
      id: 'flex-column',
      graph: { id: 54, x: 100, y: 5150 },
      content: 'By default, a flex container lays out its children in a row, but we can turn it into a vertical column using <code>flex-direction: column</code>.',
      options: {
        'go on': (e) => e.goTo('align-center'),
        'go back': (e) => e.goTo('space-around')
      }
    },
    {
      id: 'align-center',
      graph: { id: 55, x: 100, y: 5300 },
      content: 'This aligns the links to the left, so we can center them on this axis using <code>align-items: center</code>.',
      options: {
        'go on': (e) => e.goTo('spec-width'),
        'go back': (e) => e.goTo('flex-column')
      }
    },
    {
      id: 'spec-width',
      graph: { id: 56, x: 100, y: 5450 },
      content: 'Finally, I\'ll give each link a specific width and center its text so they appear more uniform.',
      options: {
        'go on': (e) => e.goTo('end-guide'),
        'go back': (e) => e.goTo('align-center')
      }
    },
    {
      id: 'height-div',
      graph: { id: 57, x: 1650, y: 3700 },
      content: 'Let\'s give this container a border and a larger height, just so that we can easily see what we\'re working with. You\'ll notice that the header streatches to its parent container\'s height while the text stays aligned to the top.',
      options: {
        'go on': (e) => e.goTo('align-div'),
        'go back': (e) => e.goTo('justify-div')
      }
    },
    {
      id: 'end-guide',
      layout: 'dock-left',
      graph: { id: 2, x: 100, y: 5600 },
      content: 'This is a good place for me to stop. Feel free to change or reformat any of it. If you create additional HTML pages you should definitely migrate the styles into their own CSS file once you create a project. Shall we start a new project?',
      options: {
        'yes, let\'s start a new project': (e) => {
          WIDGETS['template-projects'].preNewRepoFromTemplate()
        },
        'no, I\'ll experiment a bit first': (e) => {
          WIDGETS['template-projects']._experimentWithCode()
          e.hide()
        }
      }
    }
  ]
}
