/* global WIDGETS NNW nn Convo NNE utils */
window.CONVOS['template-css-landing-page'] = (self) => {
  let colorWheel = WIDGETS['css-template-color-wheel']

  const widthUpdate = (width) => {
    NNW.menu.textBubble.fadeOut(null, () => {
      NNW.update({ width }, 1000)
      setTimeout(() => {
        NNW.menu.updatePosition()
        NNW.menu.textBubble.fadeIn(null, () => NNW.menu.textBubble.focusOption())
      }, 1000)
    })
  }

  if (!colorWheel) {
    colorWheel = WIDGETS.create({
      key: 'css-template-color-wheel',
      title: 'Color Wheel',
      innerHTML: `
        <div style="display:flex;justify-content:center;align-items:center;height:100vh">
          <div style="
                position:absolute;
                top: 26px;
                width:200px;height:200px;
                border-radius:50%;
                background:conic-gradient(red,orange,yellow,lime,cyan,blue,violet,magenta,red);
                font-family:sans-serif;
                font-size:14px;
                text-align:center;
                line-height:1;
                color: var(--netizen-meta);
              ">
            <!-- 0° (top) -->
            <div style="
                  position:absolute;top:-1.4em;left:50%;transform:translateX(-50%);
                ">0°</div>
            <!-- 180° (bottom) -->
            <div style="
                  position:absolute;bottom:-1.4em;left:50%;transform:translateX(-50%);
                ">180°</div>
            <!-- 90° (right) -->
            <div style="
                  position:absolute;right:-2.2em;top:50%;transform:translateY(-50%);
                ">90°</div>
            <!-- 270° (left) -->
            <div style="
                  position:absolute;left:-2.2em;top:50%;transform:translateY(-50%);
                ">270°</div>
          </div>
        </div>`
    })

    /*
    bgcolor -> line: 26, ch: 26-33
    acolor -> line: 31, ch: 15-22
    */
    let curColorWig = 'bgcolor'

    const colorWigConvo = () => {
      const convo = {}
      if (curColorWig === 'bgcolor') {
        convo.content = 'Use the color widget to choose a new background color, press the <b>insert</b> button when you\'ve found one you like, feel free to experiment with <code>rgb()</code> and <code>hsl()</code> functions as well. Let me know when you\'re ready to move on.'
      } else {
        convo.content = 'Now choose a new accent color for the links, something that stands out from the black text as well as the new background color. Let me know when you\'re ready to move on.'
      }
      convo.options = {
        'ok, let\'s move on': (e) => {
          curColorWig = (curColorWig === 'bgcolor') ? 'acolor' : 'bgcolor'
          if (curColorWig === 'acolor') {
            NNE.cm.setSelection({ line: 31, ch: 15 }, { line: 31, ch: 22 })
            colorWigConvo()
          } else {
            e.hide()
            const info = NNE.cm.getScrollInfo()
            NNE.cm.setSelection({ line: 0, ch: 0 }, { line: 0, ch: 0 })
            NNE.cm.scrollTo(info.left, info.top)
            WIDGETS['color-widget'].close()
          }
        }
      }
      window.convo = new Convo(convo)
    }

    const colorUpdateListener = (c) => {
      const t = WIDGETS['template-projects']?.state?.name
      if (t === 'css-landing-page') {
        let hex = nn.rgb2hex(c.r, c.g, c.b)
        const a = nn.alpha2hex(c.a)
        if (a < 1) hex += a
        WIDGETS['template-projects'].state.vars[curColorWig] = hex
      }
    }

    const colorCloseListener = () => {
      const t = WIDGETS['template-projects']?.state?.name
      if (t === 'css-landing-page') {
        const s = WIDGETS['template-projects'].state
        window.convo = new Convo(s.convos, 'post-color-widget')
        window.convo.on('update', (c) => WIDGETS['template-projects']._typeTemplateCode(c.id))
      }
    }

    if (WIDGETS.instantiated.includes('color-widget')) {
      WIDGETS['color-widget'].on('update-color', colorUpdateListener)
      WIDGETS['color-widget'].on('close', colorCloseListener)
      WIDGETS['color-widget'].on('open', colorWigConvo)
    } else {
      WIDGETS.load('color-widget', (clrWig) => {
        clrWig.on('update-color', colorUpdateListener)
        clrWig.on('close', colorCloseListener)
        clrWig.on('open', colorWigConvo)
      })
    }
  }

  return [
    {
      id: 'start-guide',
      graph: { id: 1, x: 200, y: 25 },
      layout: 'dock-left',
      after: () => {
        // scroll after initial template gets rendered
        setTimeout(() => NNE.scrollTo(26), 100)
      },
      content: 'Ok, we\'ll start this template with the code from our previous HTML5 templates, including the extra meta tags.',
      options: {
        'go on': (e) => e.goTo('footer-html1'),
        'what HTML?': (e) => e.goTo('what-html')
      }
    },
    {
      id: 'what-html',
      graph: { id: 2, x: 25, y: 75 },
      content: 'Oh, if you\'re new to HTML we might want to start with an introduction to that language first. Or if you\'re familiar with HTML but not this template, maybe I should start by explaining this code?',
      options: {
        'never mind, continue': (e) => e.goTo('footer-html1'),
        'what\'s HTML?': (e) => {
          WIDGETS.open('html-reference', (w) => w.toggleIntroPresentation())
        },
        'let\'s see the HTML template': (e) => {
          WIDGETS.load('template-projects', w => w.loadTemplate('html-basic'))
        }
      }
    },
    {
      id: 'footer-html1',
      graph: { id: 3, x: 200, y: 150 },
      layout: 'dock-bottom',
      after: () => {
        NNW.update({
          height: nn.height - 250
        }, 1000)
      },
      content: 'Before we write any CSS, we\'ll add a bit more HTML to this template, a <code>footer</code> at the bottom with a few social <code>img</code> icons.',
      options: {
        'go on': (e) => e.goTo('footer-html2'),
        'go back': (e) => e.goTo('start-guide')
      }
    },
    {
      id: 'footer-html2',
      graph: { id: 4, x: 200, y: 275 },
      content: 'Then we\'ll wrap each of the <code>img</code> in an <code>a</code> element so that they become clickable links, the first with a "mailto:" <code>href</code>, the rest pointing to profile pages on other platforms.',
      options: {
        'go on': (e) => e.goTo('start-guide2'),
        'go back': (e) => e.goTo('footer-html1')
      }
    },
    {
      id: 'start-guide2',
      graph: { id: 5, x: 200, y: 400 },
      content: 'In the guided intro to the CSS basics I mentioned that there were actually three different ways to apply CSS to our HTML. Let\'s start by going over all three.',
      options: {
        'go on': (e) => e.goTo('in-line1'),
        'CSS intro?': (e) => e.goTo('what-css-intro'),
        'go back': (e) => e.goTo('footer-html2')
      }
    },
    {
      id: 'in-line1',
      graph: { id: 6, x: 200, y: 525 },
      content: 'As you know, in order to change the font of text you set the CSS <code>font-family</code> property to the desired value. You can apply this directly to an element using its <code>style</code> attribute, this approach is known as <b>inline styling</b>.',
      options: {
        'go on': (e) => e.goTo('in-line2'),
        'go back': (e) => e.goTo('start-guide2')
      }
    },
    {
      id: 'what-css-intro',
      graph: { id: 7, x: 25, y: 425 },
      content: 'If you haven\'t gone through my guided introduction to the CSS basics, where I review CSS syntax, terminology and "the box model", you might want to start there before jumping into this template.',
      options: {
        'never mind, continue': (e) => e.goTo('in-line1'),
        'explain the CSS basics': (e) => {
          WIDGETS.open('css-reference', (w) => w.toggleIntroPresentation())
        }
      }
    },
    {
      id: 'in-line2',
      graph: { id: 8, x: 200, y: 650 },
      content: 'Let\'s change the font of our <code>a</code> tags to "sans-serif", by applying a CSS declaration to each tags <code>style</code> attributes. This approach is called <i>inline styling</i> because we apply the CSS declaration on the same <i>line</i> of code as the HTML element we want to style.',
      options: {
        'go on': (e) => e.goTo('in-line3'),
        'go back': (e) => e.goTo('in-line1')
      }
    },
    {
      id: 'in-line3',
      graph: { id: 9, x: 200, y: 775 },
      content: 'Inline styling is useful for quick, one-off tweaks, but it doesn\'t scale well. As our site grows, we\'re likely to add more <code>a</code> elements, and if we ever want to change their font, hunting down each one can take time and leave room for mistakes.',
      options: {
        'go on': (e) => e.goTo('style-ele1'),
        'go back': (e) => e.goTo('in-line2')
      }
    },
    {
      id: 'style-ele1',
      graph: { id: 10, x: 350, y: 775 },
      content: 'There are also certain CSS features you can\'t really take advantage of when using inline styling. For all these reasons we have a second method for applying CSS, the one I introduced in my guided intro to CSS: the <code>style</code> element.',
      options: {
        'go on': (e) => e.goTo('style-ele2'),
        'go back': (e) => e.goTo('in-line3')
      }
    },
    {
      id: 'style-ele2',
      graph: { id: 11, x: 500, y: 100 },
      content: 'For larger projects it\'s better to keep styles in one centralized place, making them much easier to manage and update. Inline styling also blocks us from using certain CSS features. That\'s why we have a second method for applying CSS: the <code>style</code> element (not to be confused with the <i>style</i> attribute), which we place inside the <code>head</code> of our page.',
      options: {
        'go on': (e) => e.goTo('style-block'),
        'go back': (e) => e.goTo('style-ele1')
      }
    },
    {
      id: 'style-block',
      graph: { id: 12, x: 500, y: 225 },
      content: 'Unlike most HTML elements, the <code>style</code> element holds CSS code instead of nested content. This lets us define rules in one place rather than scattering declarations across individual elements. For example, I\'ve written a CSS <i>rule</i> for my <code>a</code> elements that changes the font and color while also removing the default underline browsers add to links.',
      options: {
        'go on': (e) => e.goTo('h-p-blocks'),
        'go back': (e) => e.goTo('style-ele2')
      }
    },
    {
      id: 'h-p-blocks',
      graph: { id: 13, x: 500, y: 350 },
      content: 'Now let\'s add a couple more rules for our <code>h1</code> and <code>p</code> elements. Both of these rules use <b>type selectors</b>, which means the selector is simply the HTML tag name, like <code>h1</code> or <code>a</code>. A type selector applies to every element of that type, so both of our <code>a</code> tags now share the same new styles.',
      options: {
        'go on': (e) => e.goTo('font-redundancy'),
        'go back': (e) => e.goTo('style-block')
      }
    },
    {
      id: 'font-redundancy',
      graph: { id: 14, x: 500, y: 475 },
      content: 'While this is more efficient than applying a <code>style</code> attribute inline to each element, there\'s still some redundancy in our CSS. We\'re repeating the same <code>font-family</code> declaration in multiple rules.',
      options: {
        'go on': (e) => e.goTo('comma-selectors'),
        'go back': (e) => e.goTo('h-p-blocks')
      }
    },
    {
      id: 'comma-selectors',
      graph: { id: 15, x: 500, y: 600 },
      content: 'To clean this up, we can group selectors together using a comma. For example, writing <code>h1, p, a</code> as the selector lets us set the <code>font-family</code> once, and that rule will apply to all three element types.',
      options: {
        'go on': (e) => e.goTo('body-rule'),
        'go back': (e) => e.goTo('font-redundancy')
      }
    },
    {
      id: 'body-rule',
      graph: { id: 16, x: 500, y: 725 },
      content: 'We can take this even further by using the cascading nature of CSS. Since the <code>h1</code>, <code>p</code>, and <code>a</code> are all children of the <code>body</code>, we can declare the <code>font-family</code> in the <code>body</code> rule instead. This way every element inside the page automatically inherits the font, without us needing to repeat it.',
      options: {
        'go on': (e) => e.goTo('the-cascade1'),
        'go back': (e) => e.goTo('comma-selectors')
      }
    },
    {
      id: 'the-cascade1',
      graph: { id: 17, x: 500, y: 850 },
      content: 'It\'s worth noting that not every style cascades down from a parent element. While some properties are inherited automatically, others are not, so there will still be times when you need to set styles directly on specific elements.',
      options: {
        'go on': (e) => e.goTo('typography'),
        'tell me more': (e) => e.goTo('the-cascade2'),
        'go back': (e) => e.goTo('body-rule')
      }
    },
    {
      id: 'the-cascade2',
      graph: { id: 18, x: 700, y: 850 },
      content: 'Some styles do cascade naturally. For example, setting <code>font-family</code> or <code>color</code> on the <code>body</code> usually passes down to headings, paragraphs, and links. But there are exceptions: <code>font-size</code> from the body won\'t affect <code>h1</code> elements because they have their own default sizes, and <code>color</code> won\'t affect links because browsers give <code>a</code> elements their own default colors.',
      options: {
        'go on': (e) => e.goTo('the-cascade3'),
        'go back': (e) => e.goTo('the-cascade1')
      }
    },
    {
      id: 'the-cascade3',
      graph: { id: 19, x: 850, y: 850 },
      content: 'Other styles don\'t cascade at all. Box model properties like <code>margin</code>, <code>border</code>, <code>padding</code>, <code>width</code>, and <code>height</code> only apply where you set them. If you want those on child elements, you\'ll need to declare them directly.',
      options: {
        'go on': (e) => e.goTo('the-cascade4'),
        'go back': (e) => e.goTo('the-cascade2')
      }
    },
    {
      id: 'the-cascade4',
      graph: { id: 20, x: 850, y: 975 },
      content: 'Understanding how styles flow from parents to children can feel tricky at first, but the more CSS you write the more intuitive it becomes. To learn more, refer to my basic introduction to <i>The Cascade</i> in the CSS section of the Learning Guide.',
      options: {
        'go on': (e) => e.goTo('typography'),
        'go back': (e) => e.goTo('the-cascade3')
      }
    },
    {
      id: 'typography',
      graph: { id: 21, x: 500, y: 975 },
      content: 'Generic <code>font-family</code> names like <code>serif</code>, <code>monospace</code> or <code>sans-serif</code>, which we had set before, point to a general style of font, not one specific typeface. A name like Helvetica, on the other hand, is specific.',
      options: {
        'go on': (e) => e.goTo('generic-font'),
        'go back': (e) => e.goTo('the-cascade1')
      }
    },
    {
      id: 'generic-font',
      graph: { id: 22, x: 500, y: 1100 },
      content: 'Helvetica is a very common font, there\'s even an entire <a href="https://www.imdb.com/title/tt0847817/" target="_blank">documentary</a> about it, but specific fonts like this will only load if the user already has them installed on their computer. Since not all operating systems come with Helvetica, it\'s best to follow it with a generic family name, like <code>sans-serif</code>, as a fallback.',
      options: {
        'go on': (e) => e.goTo('font-stack'),
        'go back': (e) => e.goTo('typography')
      }
    },
    {
      id: 'font-stack',
      graph: { id: 23, x: 500, y: 1225 },
      content: 'Adding a comma <code>,</code> after a font name followed by another font name is called a CSS <i>font stack</i>. You can include as many fonts in the stack as you want. The browser will always try the first one, and if it isn\'t available, move down the list. That\'s why you should always end with a generic family name. You can see more <a href="https://modernfontstacks.com/" target="_blank">examples of font stacks here</a>.',
      options: {
        'go on': (e) => e.goTo('background-color'),
        'can I load my own fonts?': (e) => e.goTo('load-font-q'),
        'go back': (e) => e.goTo('generic-font')
      }
    },
    {
      id: 'load-font-q',
      graph: { id: 24, x: 650, y: 1275 },
      content: 'Yes you can! If you want to use a very specific font that users probably don\'t already have, you can load your own font files, we\'ll come back to this a little later.',
      options: {
        'go on': (e) => e.goTo('background-color'),
        'go back': (e) => e.goTo('font-stack')
      }
    },
    {
      id: 'background-color',
      graph: { id: 25, x: 500, y: 1350 },
      before: () => {
        WIDGETS['template-projects'].state.vars.bgcolor = '#ecddd7'
        WIDGETS['template-projects'].state.vars.acolor = '#35748a'
      },
      content: 'Let\'s change our link color and add a <code>background-color</code> to our <code>body</code>. We could use simple <a href="https://colorkit.co/html-color-names/" target="_blank">color names</a> like "black," "red," or even "salmon," but I\'m going to set the background to a creamy hue that has no name. Not every color has a name, in these instances we make use of CSS color functions or hex color codes like this one.',
      options: {
        'go on': (e) => e.goTo('post-color-widget'),
        'wait, hex codes? CSS functions?': (e) => e.goTo('hex-values'),
        'go back': (e) => e.goTo('font-stack')
      }
    },
    {
      id: 'hex-values',
      graph: { id: 26, x: 650, y: 1450 },
      content: 'These hex color codes are a rare instance of machine code appearing in CSS. While we can read and write CSS easily, those hex codes aren\'t necessarily meant for humans to craft by hand. For this reason we also have a couple of CSS functions we can use to generate these colors, the <code>rgb()</code> function and the <code>hsl()</code> function.',
      options: {
        'go on': (e) => e.goTo('css-functions'),
        'go back': (e) => e.goTo('background-color')
      }
    },
    {
      id: 'css-functions',
      graph: { id: 27, x: 800, y: 1450 },
      content: 'In code, <b>functions</b> are like mini-programs stored in keywords, usually followed by parentheses <code>()</code>. Inside the parentheses we pass in "arguments" that change how the function works. The <code>rgb()</code> function takes three numbers between 0 and 255 for red, green, and blue—for example, <code>rgb(255, 0, 0)</code> makes pure red.',
      options: {
        'go on': (e) => e.goTo('rgb-function'),
        'go back': (e) => e.goTo('hex-values')
      }
    },
    {
      id: 'rgb-function',
      graph: { id: 28, x: 950, y: 1450 },
      before: () => {
        colorWheel.close()
      },
      content: 'I\'ve replaced the hex color codes with <code>rgb()</code> functions that generate the same colors. The colors won\'t change, <code>rgb()</code> is just another way of writing them. The difference is that instead of cryptic codes like <code>#ff0000</code>, you now see numbers that directly show how much red, green, and blue are mixed to make each color.',
      options: {
        'go on': (e) => e.goTo('hsl-function'),
        'go back': (e) => e.goTo('css-functions')
      }
    },
    {
      id: 'hsl-function',
      graph: { id: 29, x: 1100, y: 1500 },
      before: () => {
        colorWheel.update({
          width: 300,
          height: 300,
          top: nn.height / 2 - 100,
          left: nn.width / 2 - 100
        })
        colorWheel.open()
      },
      content: 'Now I\'ve replaced them with the <code>hsl()</code> functions which take three arguments as well: hue, saturation, and lightness, which work a little differently. Hue is a degree on the color wheel from 0 to 360, saturation is a percentage that controls how intense the color is, and lightness is a percentage that sets how dark or bright it looks.',
      options: {
        'go on': (e) => e.goTo('alpha-color'),
        'go back': (e) => e.goTo('rgb-function')
      }
    },
    {
      id: 'alpha-color',
      graph: { id: 30, x: 950, y: 1575 },
      before: () => {
        colorWheel.close()
      },
      content: 'There are also variations of the <code>rgb()</code> and <code>hsl()</code> functions called <code>rgba()</code> and <code>hsla()</code>. These work the same way as the originals but add a fourth argument called "alpha," which controls transparency. An alpha value of <code>1</code> is fully solid, while <code>0</code> is fully transparent—for example, <code>rgba(255, 0, 0, 0.5)</code> gives us a half-transparent red.',
      options: {
        'go on': (e) => e.goTo('color-functions'),
        'go back': (e) => e.goTo('hsl-function')
      }
    },
    {
      id: 'color-functions',
      graph: { id: 31, x: 800, y: 1625 },
      before: () => {
        if (WIDGETS['color-widget']?.opened) WIDGETS['color-widget'].close()
      },
      content: 'With <code>rgb()</code> you control how much of each base color is mixed, while <code>hsl()</code> describes colors by hue, which artists often find more intuitive. Both functions make colors easier to understand than hex codes, though they tend to be more common, so I\'ll switch back to those. But if colors still seem confusing, try using the <b>Color Widget</b> to experiment a little.',
      options: {
        'go on': (e) => e.goTo('post-color-widget'),
        'let\'s try the Color Widget': (e) => {
          NNE.cm.setSelection({ line: 26, ch: 26 }, { line: 26, ch: 33 })
          WIDGETS.open('color-widget')
        },
        'go back': (e) => e.goTo('alpha-color')
      }
    },
    {
      id: 'post-color-widget',
      graph: { id: 32, x: 500, y: 1475 },
      content: 'I\'m going to move forward with these colors for now, but later when you\'re editing this code yourself you can change them manually, or open the <b>Color Widget</b> by double-clicking any CSS color value in the editor and choose a new color that way.',
      options: {
        'go on': (e) => e.goTo('img-width'),
        'go back': (e) => e.goTo('background-color')
      }
    },
    {
      id: 'img-width',
      graph: { id: 33, x: 500, y: 1600 },
      content: 'You may have noticed our social icons are way too big. <code>img</code> elements are as large as the files we load into them by default, but we can change this by adjusting their <code>width</code>. In this case, I\'ve set them to <code>32px</code> so they display at a much smaller size.',
      options: {
        'go on': (e) => e.goTo('footer-img'),
        'go back': (e) => e.goTo('post-color-widget')
      }
    },
    {
      id: 'footer-img',
      graph: { id: 34, x: 500, y: 1725 },
      content: 'If we just write <code>img { width: 32px; }</code>, that rule will shrink every image on the page. That\'s not ideal, since we may add other images later that we don\'t want to resize. To be more specific, we can write <code>footer img</code>, which only targets images that live inside the <code>footer</code>.',
      options: {
        'go on': (e) => e.goTo('left-side-default'),
        'a "child" selector?': (e) => e.goTo('child-selectors'),
        'go back': (e) => e.goTo('img-width')
      }
    },
    {
      id: 'child-selectors',
      graph: { id: 35, x: 650, y: 1775 },
      content: 'Actually it\'s called a "descendant" selector. This is a "child" selector <code>footer > img</code>, which means "only images that are direct children of the <code>footer</code>." But in our case, each image is wrapped in an <code>a</code> tag, so they\'re not direct children. That\'s why <code>footer img</code> works, but <code>footer > img</code> would not.',
      options: {
        'go on': (e) => e.goTo('left-side-default'),
        'go back': (e) => e.goTo('footer-img')
      }
    },
    {
      id: 'left-side-default',
      graph: { id: 36, x: 500, y: 1850 },
      content: 'By default, everything in HTML sits on the left side of the page, but I\'d prefer to keep things more centered. Adjusting layout is one of the key purposes of CSS. There are many ways to position elements, and in this template we\'ll use more than one technique, starting with text alignment.',
      options: {
        'go on': (e) => e.goTo('text-align-center'),
        'go back': (e) => e.goTo('footer-img')
      }
    },
    {
      id: 'text-align-center',
      graph: { id: 37, x: 500, y: 1975 },
      content: 'Adding <code>text-align: center;</code> to these new rules is a good start, but it only goes so far. I also want to shift my <code>h1</code> down a bit, and the <code>p</code> looks awkward stretched all the way across the page. The <code>footer</code> with its icons also doesn\'t look quite right bunched together.',
      options: {
        'go on': (e) => e.goTo('border-for-testing'),
        'go back': (e) => e.goTo('left-side-default')
      }
    },
    {
      id: 'border-for-testing',
      graph: { id: 38, x: 500, y: 2100 },
      content: 'In my <i>Introduction to CSS</i> I explained the "<a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model" target="_blank">box model</a>," which describes how every element is essentially a rectangle. Let\'s add a <code>border</code> to a few elements so we can actually see their boxes temporarily as we make a few adjustments.',
      options: {
        'go on': (e) => e.goTo('margin-top'),
        'go back': (e) => e.goTo('text-align-center')
      }
    },
    {
      id: 'margin-top',
      graph: { id: 39, x: 500, y: 2225 },
      layout: 'dock-bottom',
      after: () => {
        NNW.update({
          height: nn.height - 250
        }, 1000)
      },
      content: 'Let\'s start by adding some margin to the top of the <code>h1</code>. Margin is the space outside a box, and you can apply it to one side at a time, for example <code>margin-top</code> adds space above the heading.',
      options: {
        'go on': (e) => e.goTo('fixed-width'),
        'go back': (e) => e.goTo('border-for-testing')
      }
    },
    {
      id: 'fixed-width',
      graph: { id: 40, x: 500, y: 2350 },
      layout: 'dock-left',
      before: () => {
        utils.afterLayoutTransition(() => {
          WIDGETS['template-projects'].state.vars.leftMargin = Math.round((nn.width - NNW.width) / 2 - 223.5)
        })
      },
      content: 'Next, let\'s give the <code>p</code> a specific <code>width</code>. This stops the text from stretching across the whole page and makes it easier to read, but the element itself is still stuck to the left. <code>text-align</code> only affects the text inside, which works for our <code>h1</code> but not for centering the <code>p</code> element itself',
      options: {
        'go on': (e) => e.goTo('margin-left'),
        'go back': (e) => e.goTo('margin-top')
      }
    },
    {
      id: 'margin-left',
      graph: { id: 41, x: 500, y: 2475 },
      after: () => {
        widthUpdate(nn.width / 2)
      },
      content: 'We could try adding a left margin to push the <code>p</code> toward the center, and at first it seems to work...',
      options: {
        'go on': (e) => e.goTo('not-responsive'),
        'go back': (e) => e.goTo('fixed-width')
      }
    },
    {
      id: 'not-responsive',
      graph: { id: 42, x: 500, y: 2600 },
      layout: 'dock-left',
      after: () => {
        widthUpdate(nn.width - 460)
      },
      content: '...but because we never know how wide the visitor\'s browser will be, fixed pixel values can cause problems on different screen sizes.',
      options: {
        'go on': (e) => e.goTo('margin-auto'),
        'go back': (e) => e.goTo('margin-left')
      }
    },
    {
      id: 'margin-auto',
      graph: { id: 43, x: 500, y: 2725 },
      layout: 'dock-left',
      after: () => {
        widthUpdate(nn.width / 2.25)
      },
      content: 'Instead, we can make the layout more responsive by using <code>auto</code> for the left and right margins. This tells the browser to fill the extra space evenly on both sides, keeping the element centered as the page resizes.',
      options: {
        'go on': (e) => e.goTo('margin-auto2'),
        'go back': (e) => e.goTo('not-responsive')
      }
    },
    {
      id: 'margin-auto2',
      graph: { id: 44, x: 500, y: 2850 },
      content: 'As I explained in my <i>Introduction to CSS</i>, we can also use the <code>margin</code> shorthand to set multiple sides in one line. With two values, the first number applies to the top and bottom, and the second applies to the left and right. For example, <code>margin: 0 auto;</code> means no margin on top or bottom, and automatic centering on the left and right sides.',
      options: {
        'go on': (e) => e.goTo('max-width'),
        'go back': (e) => e.goTo('margin-auto')
      }
    },
    {
      id: 'max-width',
      graph: { id: 45, x: 500, y: 2975 },
      content: 'To make the layout more <i>responsive</i>, we can use <code>max-width</code> instead of <code>width</code>. This sets an upper limit, an element won\'t grow wider than the value, but it can shrink on smaller screens. That way it looks the same on large displays without causing horizontal scrolling on mobile.',
      options: {
        'go on': (e) => e.goTo('too-much'),
        'go back': (e) => e.goTo('margin-auto2')
      }
    },
    {
      id: 'too-much',
      graph: { id: 46, x: 500, y: 3100 },
      before: () => {
        if (WIDGETS['template-projects'].state.editor.selected !== 'index.html') {
          WIDGETS['template-projects'].updateEditor({
            selected: 'index.html',
            language: 'html',
            renderer: null
          })
        }
      },
      content: 'Our CSS is starting to get long, so this is a good time to look at the third and final way of applying CSS to HTML. Using the <code>style</code> element is more efficient than inline styling, but if we add more HTML pages we\'d have to update each one every time we make a change.',
      options: {
        'go on': (e) => e.goTo('separate-file'),
        'go back': (e) => e.goTo('max-width')
      }
    },
    {
      id: 'separate-file',
      graph: { id: 47, x: 500, y: 3225 },
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'css/styles.css',
          language: 'css',
          renderer: 'pre-link'
        })
      },
      content: 'Instead, we can put our CSS in a separate file. You can name it anything as long as it ends with <code>.css</code>. I\'ll call this one <code>styles.css</code> and place it in a <code>css</code> folder for future stylesheets. Once it\'s in its own file, we connect it to our HTML with the <code>link</code> element.',
      options: {
        'go on': (e) => e.goTo('link-ele'),
        'go back': (e) => e.goTo('too-much')
      }
    },
    {
      id: 'link-ele',
      graph: { id: 48, x: 500, y: 3350 },
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'index.html',
          language: 'html',
          renderer: 'pre-link'
        })
      },
      content: 'Back in our <i>index.html</i> file, we can add the <code>link</code> element to our head. Not to be confused with the <code>a</code> tag (for creating click-able links), the <code>link</code> tag connects external resources to the page. We specify the type of resource with the <code>rel</code> attribute. In this case set to "stylesheet" which is another name for a CSS file.',
      options: {
        'go on': (e) => e.goTo('link-href'),
        'go back': (e) => e.goTo('separate-file')
      }
    },
    {
      id: 'link-href',
      graph: { id: 49, x: 500, y: 3475 },
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'index.html',
          language: 'html',
          renderer: 'added-link'
        })
      },
      content: 'Next, we use the <code>href</code> attribute to specify the path to the CSS file we want to connect. With that in place, our styles are applied to the page again. As we build more HTML pages, we can reuse the same styles by adding the same <code>link</code> element inside each page\'s <code>head</code>.',
      options: {
        'go on': (e) => e.goTo('css-return'),
        'go back': (e) => e.goTo('link-ele')
      }
    },
    {
      id: 'css-return',
      graph: { id: 50, x: 500, y: 3625 },
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'css/styles.css',
          language: 'css',
          renderer: 'post-link'
        })
      },
      content: 'Let\'s return now to our stylesheet to keep working on our layout, specifically our social image links, by leveraging a powerful set of CSS properties collectively known as <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank">Flexbox</a>',
      options: {
        'go on': (e) => e.goTo('display-flex'),
        'go back': (e) => e.goTo('link-href')
      }
    },
    {
      id: 'display-flex',
      graph: { id: 51, x: 650, y: 3625 },
      content: 'In our code, we set the <code>footer</code> to <code>display: flex;</code>. This turns the footer into a flex container, giving us more precise control over how its child elements are arranged. They already appeared in a row by default, but that was just the browser\'s handling of inline elements.',
      options: {
        'go on': (e) => e.goTo('space-around'),
        'go back': (e) => e.goTo('css-return')
      }
    },
    {
      id: 'space-around',
      graph: { id: 52, x: 800, y: 3625 },
      content: 'When we set <code>display: flex;</code> we unlock new properties for dynamically controlling the layout, like <code>justify-content</code> which we can set to <code>space-around</code> which tells the browser to spread it\'s child elements evenly across its width, making the layout responsive to different screen sizes.',
      options: {
        'go on': (e) => e.goTo('position-prop1'),
        'go back': (e) => e.goTo('display-flex')
      }
    },
    {
      id: 'position-prop1',
      graph: { id: 53, x: 950, y: 3625 },
      content: 'By default every block level element shows up just below the previous one, but I want my footer positioned at the bottom of my page, regardless how many other elements I have on the page. There\'s a special property we can use to pull this element out of it\'s normal "flow" called <code>position</code>',
      options: {
        'go on': (e) => e.goTo('position-prop2'),
        'go back': (e) => e.goTo('space-around')
      }
    },
    {
      id: 'position-prop2',
      graph: { id: 54, x: 1100, y: 3625 },
      content: 'If I change an element\'s default <code>position</code> value I can then use the <code>top</code> or <code>bottom</code> and <code>left</code> or <code>right</code> properties to place the element in a specific spot. For example, I can place the <code>footer</code> at the bottom of my page this way.',
      options: {
        'go on': (e) => e.goTo('position-fixed'),
        'go back': (e) => e.goTo('position-prop1')
      }
    },
    {
      id: 'position-fixed',
      graph: { id: 55, x: 1250, y: 3625 },
      content: 'Here the value <code>fixed</code> means it won\'t move, even as I scroll through the page, and setting <code>bottom</code> to <code>40px</code> means I want it placed <i>40px from the bottom of the page</i> at all times.',
      options: {
        'go on': (e) => e.goTo('viewport'),
        'go back': (e) => e.goTo('position-prop2')
      }
    },
    {
      id: 'viewport',
      graph: { id: 56, x: 1400, y: 3625 },
      content: 'You probably noticed how setting a <code>position</code> adjusted the element\'s width to match it\'s content, rather than being 100% of it\'s parent as it was before. But we can fix that by explicitly stating a <code>width</code>. Here I\'m using a special unit "vw" which means "viewport width", <code>100vw</code> translates to 100% of our entire "viewport" or window.',
      options: {
        'go on': (e) => e.goTo('dec-order1'),
        'go back': (e) => e.goTo('position-fixed')
      }
    },
    {
      id: 'dec-order1',
      graph: { id: 57, x: 1550, y: 3625 },
      content: 'Notice how I\'ve arranged my declarations in this rule, grouping together my position properties first, then my display properties and then box model. This is just a convention. You can arrange your declarations however you like, but it helps to keep things consistent.',
      options: {
        'go on': (e) => e.goTo('dec-order2'),
        'go back': (e) => e.goTo('viewport')
      }
    },
    {
      id: 'dec-order2',
      graph: { id: 58, x: 1700, y: 3625 },
      content: 'For example, I\'ll add some text properties to my <code>p</code> rule and keep them grouped together separated from the box model properties above them. Notice I\'m also using a new CSS unit here, <code>rem</code> for my <code>font-size</code> and <code>line-height</code>.',
      options: {
        'go on': (e) => e.goTo('rem'),
        'go back': (e) => e.goTo('dec-order1')
      }
    },
    {
      id: 'rem',
      graph: { id: 59, x: 1800, y: 3475 },
      content: 'The unit <code>rem</code> stands for “root em.” It sizes things based on the font size of the root element, which is usually the <code>html</code> tag. This makes it especially good for text, because if a user changes their default font size in the browser, all text using <code>rem</code> will scale up or down consistently. Think of it like a unit for keeping your text "responsive" to the user\'s settings.',
      options: {
        'go on': (e) => e.goTo('ch'),
        'go back': (e) => e.goTo('dec-order2')
      }
    },
    {
      id: 'ch',
      graph: { id: 60, x: 1900, y: 3325 },
      content: 'Another edit we can make to keep things looking consistent is changing our <code>max-width</code> from <code>448px</code> to <code>50ch</code> or 50 "characters" long. This way the width of our element will be responsive to changes in font size.',
      options: {
        'go on': (e) => e.goTo('nav-layout1'),
        'go back': (e) => e.goTo('rem')
      }
    },
    {
      id: 'nav-layout1',
      graph: { id: 61, x: 2000, y: 3175 },
      content: 'The layout is looking pretty good, although there\'s one element we\'ve been neglecting, the <code>nav</code> with our two text links, let\'s give our <code>a</code> tags a border and some margin to space them out a bit.',
      options: {
        'go on': (e) => e.goTo('nav-layout2'),
        'go back': (e) => e.goTo('ch')
      }
    },
    {
      id: 'nav-layout2',
      graph: { id: 62, x: 2100, y: 3025 },
      content: 'Next let\'s create a rule for our <code>nav</code>, we\'ll give that a border too, so we can see what we\'re working with, as well as some margin to space it out from the <code>p</code> above it.',
      options: {
        'go on': (e) => e.goTo('nav-flex1'),
        'go back': (e) => e.goTo('nav-layout1')
      }
    },
    {
      id: 'nav-flex1',
      graph: { id: 63, x: 2200, y: 2875 },
      content: 'Applying the same Flexbox properties we used for our <code>footer</code> wouldn\'t look too bad here, but I\'d actually prefer that they not be spaced out so much. So instead I\'ll set the <code>justify-content</code> property to <code>center</code>.',
      options: {
        'go on': (e) => e.goTo('nav-flex2'),
        'go back': (e) => e.goTo('nav-layout2')
      }
    },
    {
      id: 'nav-flex2',
      graph: { id: 64, x: 2300, y: 2725 },
      content: 'If we compare our <code>nav</code> to our <code>footer</code> we can clearly see the difference between these two values, <code>center</code> and <code>space-around</code>. We might also notice that we\'ve accidentally added borders and margin to our icons as well, because they\'re also inside <code>a</code> tags.',
      options: {
        'go on': (e) => e.goTo('class-sel1'),
        'go back': (e) => e.goTo('nav-flex1')
      }
    },
    {
      id: 'class-sel1',
      graph: { id: 65, x: 2400, y: 2575 },
      content: 'It\'s generally a good idea to use type selectors when creating our CSS rules because it keeps all elements of the same type looking consistent. But there are situations where you have styles you only want applied on a specific set of elements.',
      options: {
        'go on': (e) => e.goTo('class-sel2'),
        'go back': (e) => e.goTo('nav-flex2')
      }
    },
    {
      id: 'class-sel2',
      graph: { id: 66, x: 2500, y: 2425 },
      content: 'In these instances you can use a <b>class selector</b>, which is a CSS rule we can give any arbitrary name to, so long as we don\'t include any spaces (use dashes instead) and always begin with a dot <code>.</code> which identifies it as a <i>class</i> selector.',
      options: {
        'go on': (e) => e.goTo('class-sel3'),
        'go back': (e) => e.goTo('class-sel1')
      }
    },
    {
      id: 'class-sel3',
      graph: { id: 67, x: 2600, y: 2275 },
      before: () => {
        if (WIDGETS['template-projects'].state.editor.selected !== 'css/styles.css') {
          WIDGETS['template-projects'].updateEditor({
            selected: 'css/styles.css',
            language: 'css',
            renderer: 'post-link'
          })
        }
      },
      content: 'I\'ll relocate the margin and border declarations to this new class, but by default this rule won\'t be applied to any elements, which is why our links have lost their margins and borders. I have to specify which I want to apply this to using an HTML <code>class</code> attribute.',
      options: {
        'go on': (e) => e.goTo('class-attr1'),
        'go back': (e) => e.goTo('class-sel2')
      }
    },
    {
      id: 'class-attr1',
      graph: { id: 68, x: 2750, y: 2275 },
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'index.html',
          language: 'html',
          renderer: 'boxy-link'
        })
      },
      content: 'Returning back to our HTML page, I\'ll add this new "boxy-link" class to our two text links by assigning the class name (just the name, without the dot) to their individual <code>class</code> attributes. They now have their margins and borders back.',
      options: {
        'go on': (e) => e.goTo('class-attr2'),
        'go back': (e) => e.goTo('class-sel3')
      }
    },
    {
      id: 'class-attr2',
      graph: { id: 69, x: 2750, y: 2400 },
      before: () => {
        if (WIDGETS['template-projects'].state.editor.selected !== 'index.html') {
          WIDGETS['template-projects'].updateEditor({
            selected: 'index.html',
            language: 'html',
            renderer: 'boxy-link'
          })
        }
      },
      content: 'In this case I happen to be applying this class to two elements of the same type, but what\'s nice about CSS classes is that I can assign the same class to as many elements of any types as I want.',
      options: {
        'go on': (e) => e.goTo('boxy-link-pad'),
        'go back': (e) => e.goTo('class-attr1')
      }
    },
    {
      id: 'boxy-link-pad',
      graph: { id: 70, x: 2750, y: 2525 },
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'css/styles.css',
          language: 'css',
          renderer: 'post-boxy'
        })
      },
      content: 'Returning back to my CSS file now, I\'ll also add some <code>padding</code> within the boxes and a <code>border-radius</code> so these look a bit more like buttons.',
      options: {
        'go on': (e) => e.goTo('boxy-hover'),
        'go back': (e) => e.goTo('class-attr2')
      }
    },
    {
      id: 'boxy-hover',
      graph: { id: 71, x: 2750, y: 2650 },
      content: 'We can add a new rule for these elements using the <code>:hover</code> pseudo-class. A pseudo-class in CSS starts with a colon <code>:</code> followed by its name, in this case <i>hover</i>. If defined on its own it would apply to every element, so we attach it to another selector, in this case <code>.boxy-link</code>, to target only those.',
      options: {
        'go on': (e) => e.goTo('boxy-hover-styles'),
        'go back': (e) => e.goTo('boxy-link-pad')
      }
    },
    {
      id: 'boxy-hover-styles',
      graph: { id: 72, x: 2750, y: 2775 },
      content: 'I\'ll add a couple of declarations to this rule swapping the background and text colors, but they won\'t affect the links until we hover over them. The <code>:hover</code> rule applies only while the user\'s cursor is on the element and is removed as soon as they move away. Try hovering over the links now to see it in action.',
      options: {
        'go on': (e) => e.goTo('vars1'),
        'go back': (e) => e.goTo('boxy-hover')
      }
    },
    {
      id: 'vars1',
      graph: { id: 73, x: 2750, y: 2900 },
      content: 'At this point we\'re starting to repeat ourselves again, which developers generally try to avoid. The same two color codes are written in multiple places, and as we add more elements we could end up duplicating them even more. This means that if we ever want to change a color, we\'d have to update it everywhere it appears.',
      options: {
        'go on': (e) => e.goTo('vars2'),
        'go back': (e) => e.goTo('boxy-hover-styles')
      }
    },
    {
      id: 'vars2',
      graph: { id: 74, x: 2750, y: 3025 },
      content: 'To avoid repetition, we can assign these color values to <b>variables</b>. A core concept in coding, variables are names you define and assign values to. You can choose any name as long as it doesn\'t contain spaces, and in CSS a variable name must start with two dashes <code>--</code>.',
      options: {
        'go on': (e) => e.goTo('vars-root'),
        'go back': (e) => e.goTo('vars1')
      }
    },
    {
      id: 'vars-root',
      graph: { id: 75, x: 2750, y: 3150 },
      content: 'I\'ve declared these variables at the top of my stylesheet inside the <code>:root</code> pseudo-class, which makes them available to all CSS rules. If they were declared inside a specific rule, they would only be accessible within that rule.',
      options: {
        'go on': (e) => e.goTo('var-func'),
        'go back': (e) => e.goTo('vars2')
      }
    },
    {
      id: 'var-func',
      graph: { id: 76, x: 2750, y: 3275 },
      content: 'To use a variable\'s value in another CSS property, we call the <code>var()</code> function. This function takes the variable name as its argument inside the parentheses. I\'ve replaced every instance of both color codes with this function, look at the code and take note of where and how these variables are now being used.',
      options: {
        'go on': (e) => e.goTo('var-change'),
        'function?': (e) => e.goTo('var-func-ex'),
        'go back': (e) => e.goTo('vars-root')
      }
    },
    {
      id: 'var-func-ex',
      graph: { id: 77, x: 2950, y: 3350 },
      content: 'In programming, a <b>function</b> is like a small reusable command that performs a specific task. It has a name, followed by parentheses <code>()</code>, where you pass in information called “arguments.” When the <code>var()</code> function runs with a given argument, it\'s as if the variable\'s value were written directly into that spot in the CSS.',
      options: {
        'go on': (e) => e.goTo('var-change'),
        'go back': (e) => e.goTo('var-func')
      }
    },
    {
      id: 'var-change',
      graph: { id: 78, x: 2750, y: 3400 },
      content: 'Now, if we want to change one of these colors, we only need to update the single line at the top of the page, and every property using that variable will update automatically. Variables can store any CSS value, not just colors, so if you find yourself reusing a value in multiple places, it\'s a good idea to assign it to a variable for easier large-scale changes later.',
      options: {
        'go on': (e) => e.goTo('transform1'),
        'go back': (e) => e.goTo('var-func')
      }
    },
    {
      id: 'transform1',
      graph: { id: 79, x: 2750, y: 3525 },
      content: 'Let\'s make things more interesting by adding the <code>transform</code> property. This powerful CSS property can change elements in many ways using different CSS functions. Here, we\'ll use the <code>translateY()</code> function to shift our <code>boxy-link</code> tags up by 3 pixels on the Y-axis.',
      options: {
        'go on': (e) => e.goTo('transform2'),
        'transform? functions?': (e) => e.goTo('transform-func'),
        'go back': (e) => e.goTo('var-change')
      }
    },
    {
      id: 'transform-func',
      graph: { id: 80, x: 2950, y: 3525 },
      content: 'In code, <b>functions</b> are like little programs built into CSS keywords, usually followed by parentheses <code>()</code>. The parentheses hold "arguments" that tell the function exactly how to run. In this case, <code>translateY()</code> shifts an element up or down by the number of pixels we give it, positive numbers move it down the Y-axis, and negative numbers move it up.',
      options: {
        'go on': (e) => e.goTo('transform-level'),
        'go back': (e) => e.goTo('transform1')
      }
    },
    {
      id: 'transform-level',
      graph: { id: 81, x: 3100, y: 3525 },
      content: 'One important detail is that transforms only work on block-level elements, not on inline ones like our links. Normally we\'d need to change the links to <code>display: block;</code> or <code>inline-block</code> to make the transform apply. But in this case, because our links are already inside a Flexbox layout, the browser treats them as flex items, which behave like blocks so it works just fine.',
      options: {
        'go on': (e) => e.goTo('transform-func-other'),
        'go back': (e) => e.goTo('transform-func')
      }
    },
    {
      id: 'transform-func-other',
      graph: { id: 82, x: 3100, y: 3650 },
      content: '<code>translateY()</code> is just one of many transform functions. Others let us move elements horizontally <code>translateX()</code>, rotate them <code>rotate()</code>, make them bigger or smaller <code>scale()</code>, or even slant their shape <code>skew()</code>. We\'ll explore these more in other demos in the <b>Learning Guide</b>',
      options: {
        'go on': (e) => e.goTo('transform2'),
        'go back': (e) => e.goTo('transform-level')
      }
    },
    {
      id: 'transform2',
      graph: { id: 83, x: 2750, y: 3650 },
      content: 'Because our transform shift is so small (3 pixels) and happens instantly when we hover, it isn\'t as noticeable as the color changes. We can make it stand out more by adding a <i>transition</i> to smooth out the movement.',
      options: {
        'go on': (e) => e.goTo('media-queries'),
        'transition?': (e) => e.goTo('transition-hover'),
        'go back': (e) => e.goTo('transform1')
      }
    },
    {
      id: 'transition-hover',
      graph: { id: 84, x: 2950, y: 3775 },
      content: 'There are many ways to change the value of a CSS property, on <code>:hover</code> is just one of them. Typically these changes happen instantly, but we can <code>transition</code> the property to have these changes happen slowly over a fixed period of time.',
      options: {
        'go on': (e) => e.goTo('transition-props1'),
        'go back': (e) => e.goTo('transform2')
      }
    },
    {
      id: 'transition-props1',
      graph: { id: 85, x: 3100, y: 3775 },
      content: 'We start by setting two values: <code>transition-property</code> and <code>transition-duration</code>. The first tells the browser which CSS property should change slowly, and the second sets how long that change should take, usually in seconds.',
      options: {
        'go on': (e) => e.goTo('transition-props2'),
        'go back': (e) => e.goTo('transition-hover')
      }
    },
    {
      id: 'transition-props2',
      graph: { id: 86, x: 3250, y: 3775 },
      content: 'There are a couple of other transition settings worth knowing. <code>transition-delay</code> lets you wait before the change begins, and <code>transition-timing-function</code> controls the speed of change over time with a <a href="https://htmldog.com/examples/transitions3.html" target="_blank">CSS timing function</a>.',
      options: {
        'go on': (e) => e.goTo('transition-shorthand'),
        'go back': (e) => e.goTo('transition-props1')
      }
    },
    {
      id: 'transition-shorthand',
      graph: { id: 87, x: 3400, y: 3775 },
      content: 'Because these are used together so often, CSS also gives us a shorthand. The <code>transition</code> property can hold the property name, the duration, and even timing and delay all in one line.',
      options: {
        'go on': (e) => e.goTo('transition-all'),
        'go back': (e) => e.goTo('transition-props2')
      }
    },
    {
      id: 'transition-all',
      graph: { id: 88, x: 3400, y: 3925 },
      content: 'If we set <code>transition-property</code> to <code>all</code>, then every style change on hover will transition smoothly over 0.3 seconds instead of switching instantly. Try hovering over the links now to see the difference.',
      options: {
        'go on': (e) => e.goTo('transition-final'),
        'go back': (e) => e.goTo('transition-shorthand')
      }
    },
    {
      id: 'transition-final',
      graph: { id: 89, x: 3250, y: 3925 },
      content: 'In this case I only want to transition the <code>transform</code> property, since I prefer the colors to change right away. I\'ll also use the transition shorthand to set both the property and duration on a single line.',
      options: {
        'go on': (e) => e.goTo('media-queries'),
        'go back': (e) => e.goTo('transition-all')
      }
    },
    {
      id: 'media-queries',
      graph: { id: 90, x: 2750, y: 3875 },
      after: () => {
        if (NNW.win.offsetWidth !== nn.width / 2) {
          widthUpdate(nn.width / 2)
        }
      },
      content: 'Just like we can update property values on hover, we can also adjust them based on screen size using media queries. In this example, I\'ve added a media query that changes the <code>nav</code> Flexbox properties so the items appear in a centered column instead of the default row.',
      options: {
        'go on': (e) => e.goTo('id-sel'),
        'media query?': (e) => e.goTo('mq-explain'),
        'go back': (e) => e.goTo('transform2')
      }
    },
    {
      id: 'mq-explain',
      graph: { id: 91, x: 3050, y: 4075 },
      after: () => {
        widthUpdate(nn.width - 460)
      },
      content: 'Right now, our <code>nav</code> is set to <code>display: flex;</code> with <code>justify-content: center;</code>. That means all the links inside line up in a row, and the browser centers the row horizontally. This looks good on desktop, but might feel tight on a mobile screen, especially if we add another link or two later.',
      options: {
        'go on': (e) => e.goTo('mq-condition'),
        'go back': (e) => e.goTo('media-queries')
      }
    },
    {
      id: 'mq-condition',
      graph: { id: 92, x: 3200, y: 4075 },
      content: 'The new code I\'ve added is called a media query. The line <code>@media (max-width: 450px)</code> tells the browser: “Only apply the following rules if the screen is 450 pixels wide or smaller.” In programming this is called conditional logic: rules that run only when certain conditions are true.',
      options: {
        'go on': (e) => e.goTo('mq-child-rule'),
        'go back': (e) => e.goTo('mq-explain')
      }
    },
    {
      id: 'mq-child-rule',
      graph: { id: 93, x: 3350, y: 4075 },
      content: 'Inside the media query we have another <code>nav</code> rule which only applies in this condition. The first change is <code>flex-direction: column;</code>, which tells Flexbox to stack the links vertically instead of placing them side by side.',
      options: {
        'go on': (e) => e.goTo('mq-align-items'),
        'go back': (e) => e.goTo('mq-condition')
      }
    },
    {
      id: 'mq-align-items',
      graph: { id: 94, x: 3350, y: 4225 },
      after: () => {
        if (NNW.win.offsetWidth !== nn.width - 450) {
          widthUpdate(nn.width - 450)
        }
      },
      content: 'The second change is <code>align-items: center;</code>. When Flexbox is in column mode, this centers the items horizontally within the nav, so the stacked links are neatly centered on the page.',
      options: {
        'go on': (e) => e.goTo('mq-final'),
        'go back': (e) => e.goTo('mq-child-rule')
      }
    },
    {
      id: 'mq-final',
      graph: { id: 95, x: 3200, y: 4225 },
      after: () => {
        widthUpdate(nn.width / 2)
      },
      content: 'Together, these adjustments make the navigation responsive. On larger screens the links appear in a centered row, but on small screens, like mobile devices, they switch to a centered column that fit nicer and avoids introducing a horizontal scroll.',
      options: {
        'go on': (e) => e.goTo('id-sel'),
        'go back': (e) => e.goTo('mq-align-items')
      }
    },
    {
      id: 'id-sel',
      graph: { id: 96, x: 2750, y: 4125 },
      layout: 'dock-left',
      content: 'Now I\'m going replace the <code>h1</code> type selector in this rule with a name, I\'ll call it <i>main-title</i>. This is called an ID selector, and it\'s very similar to my class selector, except it starts with a <code>#</code> instead of a <code>.</code>, and is used a little differently.',
      options: {
        'go on': (e) => e.goTo('id-specific'),
        'go back': (e) => e.goTo('media-queries')
      }
    },
    {
      id: 'id-specific',
      graph: { id: 97, x: 2750, y: 4250 },
      layout: 'dock-bottom',
      before: () => {
        if (WIDGETS['template-projects'].state.editor.selected !== 'css/styles.css') {
          WIDGETS['template-projects'].updateEditor({
            selected: 'css/styles.css',
            language: 'css',
            renderer: 'post-boxy'
          })
        }
      },
      content: 'An ID is a way to give one specific element on the page a unique name. Unlike a class, which you can reuse on many elements, an ID should only be used once in the whole page. That makes it perfect for styling something like the main title in our <code>h1</code>, since we may add other <code>h1</code> later but only this first one deserves its own unique style.',
      options: {
        'go on': (e) => e.goTo('id-attr'),
        'go back': (e) => e.goTo('id-sel')
      }
    },
    {
      id: 'id-attr',
      graph: { id: 98, x: 2750, y: 4375 },
      layout: 'dock-bottom',
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'index.html',
          language: 'html',
          renderer: 'main-title'
        })
      },
      content: 'Just like our classes, ID selectors will only apply to the element you assign them to in your HTML. Back in our HTML page, we can do this with the <code>id</code> attribute, written inside the opening tag of our <code>h1</code> element. That attribute gives the element its unique name, which we can then target in your CSS with <code>#main-title</code>.',
      options: {
        'go on': (e) => e.goTo('css-rule-order'),
        'go back': (e) => e.goTo('id-specific')
      }
    },
    {
      id: 'css-rule-order',
      graph: { id: 99, x: 2750, y: 4500 },
      layout: 'dock-left',
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'css/styles.css',
          language: 'css',
          renderer: 'post-main-title'
        })
      },
      content: 'Before we add anymore to our rule, I\'m going to move my <code>#main-title</code> and <code>.boxy-link</code> rules to the bottom of our CSS file. It\'s a good practice to keep type selectors like <code>body</code> and <code>a</code> near the top, and put class and ID rules below them. This way the stylesheet is organized from general rules to more specific ones, making it easier to read and ensuring the right styles take priority.',
      options: {
        'go on': (e) => e.goTo('rmv-border'),
        'go back': (e) => e.goTo('id-attr')
      }
    },
    {
      id: 'rmv-border',
      graph: { id: 100, x: 2750, y: 4625 },
      content: 'This is probably also a good time to hide all our borders. With the exception of the border applied to the <code>.boxy-link</code>, I had only been using these to visualize our "boxes" while working on our layout. But now that our general layout is finished we don\'t need these anymore.',
      options: {
        'go on': (e) => e.goTo('comment-out'),
        'go back': (e) => e.goTo('css-rule-order')
      }
    },
    {
      id: 'comment-out',
      graph: { id: 101, x: 2750, y: 4750 },
      content: 'But instead of removing these border directions from my code, I\'ll comment them out, which prevents the browser from rendering it while keeping it handy in case I need to quickly bring them back later. This is a common practice when we\'re unsure about permanently removing code.',
      options: {
        'go on': (e) => e.goTo('custom-font1'),
        'go back': (e) => e.goTo('rmv-border')
      }
    },
    {
      id: 'custom-font1',
      graph: { id: 102, x: 2750, y: 4875 },
      before: () => {
        if (WIDGETS['template-projects'].state.editor.selected !== 'css/styles.css') {
          WIDGETS['template-projects'].updateEditor({
            selected: 'css/styles.css',
            language: 'css',
            renderer: 'post-main-title'
          })
        }
      },
      content: 'Now I\'m going to add a few more properties to change the color, style, size and weight of my text. I\'ve also added a <code>font-family</code> with the value set to <a href="https://forthehearts.net/playfair/" target="_blank">Playfair Display</a>, an open source font by typeface designer <a href="https://forthehearts.net/about/" target="_blank">Claus Eggers Sørensen</a>.',
      options: {
        'go on': (e) => e.goTo('custom-font2'),
        'go back': (e) => e.goTo('comment-out')
      }
    },
    {
      id: 'custom-font2',
      graph: { id: 103, x: 2750, y: 5000 },
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'index.html',
          language: 'html',
          renderer: 'custom-font'
        })
      },
      content: 'This is a custom font that we\'ll need to add to our project, I\'ve uploaded the actual font <code>.woff2</code> files to the project, those will be available to you when you create your own project from this template. We\'ll need to load those files into our page by adding another stylesheet to our HTML page. I\'ve called this one <code>fonts.css</code> and placed it in the same <b>css</b> folder as our <b>styles.css</b> file.',
      options: {
        'go on': (e) => e.goTo('title-mq'),
        'fonts.css? custom fonts?': (e) => e.goTo('cf-intro'),
        'go back': (e) => e.goTo('custom-font1')
      }
    },
    {
      id: 'cf-intro',
      graph: { id: 104, x: 2900, y: 5000 },
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'css/styles.css',
          language: 'css',
          renderer: 'post-main-title'
        })
      },
      content: 'When you want a specific font, you can declare a <code>font-stack</code> like we did for our <code>body</code> element, but that doesn\'t guarantee our top choice gets rendered, it depends on what the user has installed on their computer.',
      options: {
        'go on': (e) => e.goTo('cf-import'),
        'go back': (e) => e.goTo('custom-font2')
      }
    },
    {
      id: 'cf-import',
      graph: { id: 105, x: 3050, y: 5000 },
      content: 'If we want a font the user probably doesn\'t have, we need to load it explicitly. One common way is to use the CSS <code>@import</code> rule with a <code>url()</code> function that pulls in a stylesheet from a font service like <a href="https://fonts.google.com/" target="_blank">Google Fonts</a>.',
      options: {
        'go on': (e) => e.goTo('cf-privacy'),
        'go back': (e) => e.goTo('cf-intro')
      }
    },
    {
      id: 'cf-privacy',
      graph: { id: 106, x: 3200, y: 5000 },
      content: 'The downside is that this makes your site dependent on that service and its policies, which can change at any time. Surveillance capitalism services like Google also collect data such as the IP address and browser of everyone who visits your site if you use their hosted fonts.',
      options: {
        'go on': (e) => e.goTo('cf-file'),
        'go back': (e) => e.goTo('cf-import')
      }
    },
    {
      id: 'cf-file',
      graph: { id: 107, x: 3200, y: 5125 },
      before: () => {
        if (WIDGETS['template-projects'].state.editor.selected !== 'css/styles.css') {
          WIDGETS['template-projects'].updateEditor({
            selected: 'css/styles.css',
            language: 'css',
            renderer: 'post-main-title'
          })
        }
      },
      content: 'Some developers are fine with that trade-off, but I prefer protecting my visitors\' privacy. That\'s why I\'ve included Sørensen\'s font files directly in my project\'s assets and written my own <code>fonts.css</code> to import them. Would you like me to show you how that CSS works?',
      options: {
        'Yes please, show me fonts.css': (e) => e.goTo('cf-font-face'),
        'no, let\'s get back to our styles.css': (e) => e.goTo('title-mq'),
        'go back': (e) => e.goTo('cf-privacy')
      }
    },
    {
      id: 'cf-font-face',
      graph: { id: 108, x: 3350, y: 5125 },
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'css/fonts.css',
          language: 'css',
          renderer: 'fonts-file'
        })
      },
      content: 'We start with an <code>@font-face</code> rule which lets us load our own font files into a webpage. In this example, we give the font the name <i>\'Playfair Display\'</i> with <code>font-family</code>, this is the name we\'ll use later when referencing it in our other CSS rules.',
      options: {
        'go on': (e) => e.goTo('cf-src'),
        'go back': (e) => e.goTo('cf-file')
      }
    },
    {
      id: 'cf-src',
      graph: { id: 109, x: 3500, y: 5125 },
      content: 'The <code>src</code> property tells the browser where to find the file. Here it\'s looking inside a folder called <code>fonts</code> for <code>playfair-display-v39-latin-regular.woff2</code>. The <code>format(\'woff2\')</code> part tells the browser what kind of file it is, so it knows how to read it.',
      options: {
        'go on': (e) => e.goTo('cf-basic'),
        'go back': (e) => e.goTo('cf-font-face')
      }
    },
    {
      id: 'cf-basic',
      graph: { id: 110, x: 3650, y: 5125 },
      content: 'This is technically all you need to load a font and start using it on your site! But we can go a little further with this one because Sørensen didn\'t just design one version of Playfair Display, he created custom drawings for each weight and each italic. Take a look at his font <a href="https://fonts.google.com/specimen/Playfair+Display" target="_blank">Playfair Display on Google Fonts</a> to see the different versions.',
      options: {
        'go on': (e) => e.goTo('cf-weight-style1'),
        'go back': (e) => e.goTo('cf-src')
      }
    },
    {
      id: 'cf-weight-style1',
      graph: { id: 111, x: 3800, y: 5125 },
      content: 'I\'ve only included the regular version here, so I\'ve now added declarations for <code>font-weight</code> and <code>font-style</code> to make that explicit. These tell the browser to use this regular font file whenever an element\'s CSS asks for this font with that combination of style and weight.',
      options: {
        'go on': (e) => e.goTo('cf-swap'),
        'go back': (e) => e.goTo('cf-basic')
      }
    },
    {
      id: 'cf-swap',
      graph: { id: 112, x: 3800, y: 5300 },
      content: 'I\'ve also added <code>font-display: swap;</code>, which tells the browser to show a fallback font right away and then swap in Playfair Display once it\'s loaded, so visitors don\'t see a blank gap where text should be.',
      options: {
        'go on': (e) => e.goTo('cf-other-ff'),
        'go back': (e) => e.goTo('cf-weight-style1')
      }
    },
    {
      id: 'cf-other-ff',
      graph: { id: 113, x: 3650, y: 5300 },
      content: 'Next, I\'ll create additional <code>@font-face</code> rules for the other versions of Playfair Display Sørensen designed, each setting the corresponding weights and style which match that particular font file.',
      options: {
        'go on': (e) => e.goTo('cf-code'),
        'go back': (e) => e.goTo('cf-swap')
      }
    },
    {
      id: 'cf-code',
      graph: { id: 114, x: 3500, y: 5300 },
      content: 'It\'s a lot of code, but you\'ll notice each block is very similar: they load a specific font file and set its weight and style so the browser knows exactly which version of Playfair Display to apply when those values are requested in CSS.',
      options: {
        'go on': (e) => e.goTo('cf-helper'),
        'go back': (e) => e.goTo('cf-other-ff')
      }
    },
    {
      id: 'cf-helper',
      graph: { id: 115, x: 3350, y: 5300 },
      content: 'And just to be clear, I didn\'t actually write all of these by hand. I used an open-source tool by <a href="https://mranftl.com/" target="_blank">Mario Ranftl</a> called <a href="https://gwfh.mranftl.com/fonts" target="_blank">Google Web Fonts Helper</a> to download the font files and generate the CSS automatically. It saves a lot of time and makes sure everything is written correctly.',
      options: {
        'go on': (e) => e.goTo('title-mq'),
        'go back': (e) => e.goTo('cf-code')
      }
    },
    {
      id: 'title-mq',
      graph: { id: 116, x: 2750, y: 5275 },
      before: () => {
        WIDGETS['template-projects'].updateEditor({
          selected: 'css/styles.css',
          language: 'css',
          renderer: 'post-font'
        })
      },
      content: 'Our <code>#main-title</code> now has much nicer and custom typography, our layout is looking pretty good too, at least on Desktop. On mobile devices that top margin might be a little too much. Here again we can create a <i>media query</i>, just like we did for our <code>nav</code>.',
      options: {
        'go on': (e) => e.goTo('title-mq-margin'),
        'go back': (e) => e.goTo('custom-font2')
      }
    },
    {
      id: 'title-mq-margin',
      graph: { id: 117, x: 2750, y: 5400 },
      content: 'This new media query will adjust the <code>margin-top</code> of our <code>#main-title</code> to 50px on screens that are less than 450px wide, and keep it at 150px for screens larger than 450px.',
      options: {
        'go on': (e) => e.goTo('animation'),
        'remind me how @media works': (e) => e.goTo('mq-recap1'),
        'go back': (e) => e.goTo('title-mq')
      }
    },
    {
      id: 'mq-recap1',
      graph: { id: 118, x: 2900, y: 5400 },
      content: 'The new code I\'ve added is called a media query. The line <code>@media (max-width: 450px)</code> tells the browser: “Only apply the following rules if the screen is 450 pixels wide or smaller.” In programming this is called conditional logic: rules that run only when certain conditions are true.',
      options: {
        'go on': (e) => e.goTo('mq-recap2'),
        'go back': (e) => e.goTo('title-mq-margin')
      }
    },
    {
      id: 'mq-recap2',
      graph: { id: 119, x: 2900, y: 5550 },
      content: 'Inside the media query we have another <code>#main-title</code> rule which only applies in this condition which makes our design more "responsive" or "adaptive". Larger screens will see the larger margin of 150px, but on small screens, like mobile devices, will render the smaller 50px margin.',
      options: {
        'go on': (e) => e.goTo('animation'),
        'go back': (e) => e.goTo('mq-recap1')
      }
    },
    {
      id: 'animation',
      graph: { id: 120, x: 2750, y: 5550 },
      content: 'Lastly, I\'m going to create a CSS animation to our <code>#main-title</code> to give the page a tiny bit more flare. My goal is a subtle upward motion for the title that echoes the same upward motif we used on the links, and it should run right when the page loads.',
      options: {
        'go on': (e) => e.goTo('end-guide'),
        'CSS animation?': (e) => e.goTo('anim-pre'),
        'go back': (e) => e.goTo('title-mq-margin')
      }
    },
    {
      id: 'anim-pre',
      graph: { id: 121, x: 2900, y: 5700 },
      content: 'I added <code>transform: translateY(10px)</code> and <code>opacity: 0</code> to my <code>#main-title</code> so that it would slightly shifted downwards and be transparent to start when the page first loads.',
      options: {
        'go on': (e) => e.goTo('anim-keyframes'),
        'go back': (e) => e.goTo('animation')
      }
    },
    {
      id: 'anim-keyframes',
      graph: { id: 122, x: 3050, y: 5700 },
      content: 'We can create CSS animations with the <code>@keyframes</code> rule which defines how a property changes over time. I\'ve named this one <code>fadeIn</code> and included only a single keyframe <code>100%</code> with <code>translateY(0)</code> and <code>opacity: 1</code>, so the title rises into place and fades in.',
      options: {
        'go on': (e) => e.goTo('anim-100'),
        'go back': (e) => e.goTo('anim-pre')
      }
    },
    {
      id: 'anim-100',
      graph: { id: 123, x: 3200, y: 5700 },
      content: 'The <code>100%</code> in a <code>@keyframes</code> rule means “the end of the animation.” In our <code>fadeIn</code> example, that\'s the point when the title has fully moved into place and become visible. If we only define <code>100%</code>, the browser assumes the starting point is whatever styles the element already has.',
      options: {
        'go on': (e) => e.goTo('anim-other-kf'),
        'go back': (e) => e.goTo('anim-keyframes')
      }
    },
    {
      id: 'anim-other-kf',
      graph: { id: 124, x: 3350, y: 5700 },
      content: 'But we can add more steps if we want. Here, <code>0%</code> marks the start, <code>50%</code> is the middle, and <code>100%</code> is the end. This gives us a little bounce before the element settles into place.',
      options: {
        'go on': (e) => e.goTo('anim-props1'),
        'go back': (e) => e.goTo('anim-100')
      }
    },
    {
      id: 'anim-props1',
      graph: { id: 125, x: 3500, y: 5700 },
      content: 'To apply a keyframes animation, we must first set <code>animation-name</code> of the keyframes we want to apply to this element as well as how long we want that animation to take with <code>animation-duration</code>.',
      options: {
        'go on': (e) => e.goTo('anim-props2'),
        'go back': (e) => e.goTo('anim-other-kf')
      }
    },
    {
      id: 'anim-props2',
      graph: { id: 126, x: 3650, y: 5700 },
      content: 'Two optional settings make this feel better. <code>animation-fill-mode: forwards</code> tells the browser to keep the final style after the animation finishes, without this it would return to it\'s initial transparent state. Then <code>animation-delay: 0.25s</code> adds a brief pause before it runs when the page loads.',
      options: {
        'go on': (e) => e.goTo('anim-shorthand'),
        'go back': (e) => e.goTo('anim-props1')
      }
    },
    {
      id: 'anim-shorthand',
      graph: { id: 127, x: 3650, y: 5825 },
      content: 'Once that\'s working, we can combine everything into the shorthand <code>animation</code> property. Writing <code>animation: fadeIn 1s forwards 0.25s</code> sets the name, duration, fill mode, and delay in one line, keeping the CSS tidy while producing the same effect.',
      options: {
        'go on': (e) => e.goTo('end-guide'),
        'go back': (e) => e.goTo('anim-props2')
      }
    },
    {
      id: 'end-guide',
      graph: { id: 128, x: 2750, y: 5925 },
      layout: 'dock-left',
      before: () => {
        if (WIDGETS['template-projects'].state.editor.selected !== 'css/styles.css') {
          WIDGETS['template-projects'].updateEditor({
            selected: 'css/styles.css',
            language: 'css',
            renderer: 'post-font'
          })
        }

        const clrWig = WIDGETS['color-widget']
        clrWig.events['update-color'] = clrWig.events['update-color'].filter(e => e.name !== 'colorUpdateListener')
        clrWig.events.close = clrWig.events.close.filter(e => e.name !== 'colorCloseListener')
        clrWig.events.open = clrWig.events.open.filter(e => e.name !== 'colorWigConvo')
      },
      content: 'Now that our template is complete. Our CSS code is less than 100 lines but takes advantage of many of the language\'s powerful features, from adaptive layouts using Flexbox and media queries to interactive transitions on link hovers and even a bit of animation. But you can obviously take these principles much further, this is just a starting point!',
      options: {
        'great, let\'s start a new project': (e) => {
          WIDGETS['template-projects'].preNewRepoFromTemplate()
        },
        'I\'ll experiment a bit first': (e) => {
          NNE.readyOnly = false
          e.hide()
        },
        'go back': (e) => e.goTo('animation')
      }
    }
  ]
}
