/* global WIDGETS NNE nn */
window.CONVOS['template-css-art'] = (self) => {
  // other widgets
  let cssArtGallery = WIDGETS['css-art-gallery']
  let anastasia = WIDGETS['css-art-anastasia']
  let diana = WIDGETS['css-art-diana']

  if (!cssArtGallery) {
    cssArtGallery = WIDGETS.create({
      key: 'css-art-gallery',
      title: 'CSS Art Gallery',
      innerHTML: `
        <a href="https://netart.rocks/css-art-gallery/" target="_blank">
          <img src="https://netart.rocks/images/notes/css-art-gallery.png" alt="css art gallery wall" style="width: 100%; border: 10px solid white">
        </a>
        <p>
          Check out Nick's curated collection of <a href="https://netart.rocks/css-art-gallery/" target="_blank">CSS Art</a> for more examples.
        </p>
      `
    })

    anastasia = WIDGETS.create({
      key: 'css-art-anastasia',
      title: 'Anastasia Goodwin',
      innerHTML: `
        <a href="https://codepen.io/agoodwin" target="_blank">
        <div style="overflow: hidden; height: 395px">
        <iframe src="https://cdpn.io/agoodwin/fullpage/ypeWYE?anon=true&view=fullpage" style="border:none; width:100%; height: calc(100% + 130px); transform: translateY(-130px);"></iframe>
          </div>
        </a>
        <p style="margin-top: 10px;">
          Check out more of <a href="https://codepen.io/agoodwin" target="_blank">Anastasia Goodwin</a>'s work.
        </p>
      `
    })

    diana = WIDGETS.create({
      key: 'css-art-diana',
      title: 'Diana Smith',
      innerHTML: `
        <video src="https://netart.rocks/files/diana-smith-css-art.mp4" style="width:100%" controls></video>
        <p style="margin-top: 10px;">
          Check out more of <a href="https://codepen.io/agoodwin" target="_blank">Diana Smith</a>'s work.
        </p>
      `
    })
  }

  return [
    {
      id: 'css-art-intro',
      graph: { id: 1, x: 100, y: 100 },
      before: () => {
        cssArtGallery.update({ width: 377, height: 511, left: nn.width / 2 - 377 / 2, bottom: 50 }, 500)
        setTimeout(() => cssArtGallery.open(), 550)
      },
      content: 'Though CSS is usually thought of as the presentation layer, handling layout, color, and typography, it has grown into a much more expressive language. Today you can use CSS to create animations, interactions, and even full illustrations. Instead of simply styling a web page or app, artists in the <a href="https://www.vice.com/en/article/painting-made-with-code-html-pure-css-browser-art-diana-smith/" target="_blank">CSS Art scene</a> use it to render creative compositions with subtle motion and surprising detail.',
      options: {
        'go on': (e) => e.goTo('css-art2')
      }
    },
    {
      id: 'css-art2',
      graph: { id: 2, x: 100, y: 225 },
      before: () => {
        anastasia.update({ width: 609, height: 505, left: 46, top: 82 }, 500)
        setTimeout(() => anastasia.open(), 550)
        diana.update({ width: 535, height: 399, right: 33, bottom: 30 }, 500)
        setTimeout(() => diana.open(), 750)
      },
      content: 'CSS art varies widely in style, from the playful cartoons of <a href="https://codepen.io/agoodwin" target="_blank">Anastasia Goodwin</a> to the intricate, painting-like works of <a href="https://www.vice.com/en/article/painting-made-with-code-html-pure-css-browser-art-diana-smith/" target="_blank">Diana Smith</a>. The point isn\'t always the finished image but the challenge: pushing CSS beyond what it was designed for and, in the process, mastering the craft.',
      options: {
        'go on': (e) => e.goTo('minimal'),
        'go back': (e) => e.goTo('css-art-intro')
      }
    },
    {
      id: 'minimal',
      graph: { id: 3, x: 100, y: 350 },
      before: () => {
        cssArtGallery.close()
        setTimeout(() => anastasia.close(), 200)
        setTimeout(() => diana.close(), 400)
      },
      content: 'The HTML behind a CSS art piece is often minimal. Sometimes the only element is a <code>style</code> tag, meaning the artwork is generated entirely with CSS. This is called "no div" CSS art, where even the common <code>div</code> element is avoided, like in <a href="https://codepen.io/ShadowShahriar/pen/pobqepZ" target="_blank">this piece</a> by S. Shahriar.',
      options: {
        'go on': (e) => e.goTo('no-body'),
        'go back': (e) => e.goTo('css-art2')
      }
    },
    {
      id: 'no-body',
      graph: { id: 4, x: 100, y: 475 },
      content: 'How is that possible? Every page must have a <code>body</code>, and if you don\'t declare one, the browser creates it automatically. That means we can still style it, even if it\'s missing from the code.',
      options: {
        'go on': (e) => e.goTo('pixels'),
        'go back': (e) => e.goTo('minimal')
      }
    },
    {
      id: 'pixels',
      graph: { id: 5, x: 100, y: 600 },
      content: 'Here\'s a common CSS art trick: <code>box-shadow</code> can be written so it looks like a solid box of color. Since you can stack an unlimited number of shadows, you can use them like "pixels" to build pixel art. The <code>width</code> and <code>height</code> of the body sets the pixel size, and each shadow entry defines a position (X and Y) and color. A <code>transform</code> can then center the whole composition.',
      options: {
        'go on': (e) => e.goTo('single-ele'),
        'go back': (e) => e.goTo('no-body')
      }
    },
    {
      id: 'single-ele',
      graph: { id: 6, x: 100, y: 725 },
      content: 'A similar idea is "single element" CSS art. Here the <code>body</code> is styled for background and layout, while the artwork itself is built from one element, often a <code>div</code>. Like this piece by <a href="https://codepen.io/joshnh" target="_blank">Joshua Hibbert</a>.',
      options: {
        'go on': (e) => e.goTo('pseudo'),
        'go back': (e) => e.goTo('pixels')
      }
    },
    {
      id: 'pseudo',
      graph: { id: 7, x: 100, y: 850 },
      content: 'This technique often relies on the <code>::before</code> and <code>::after</code> pseudo-elements. These act like extra elements attached to the original one, allowing CSS artists to produce surprisingly complex results from a single element.',
      options: {
        'go on': (e) => e.goTo('many-divs'),
        'go back': (e) => e.goTo('single-ele')
      }
    },
    {
      id: 'many-divs',
      graph: { id: 8, x: 100, y: 975 },
      content: 'Most CSS art, however, uses multiple elements, usually <code>div</code> tags, that are transformed and positioned into elements of a composition. These are often placed inside a primary container, centered on the page, like this "Flat Forest" by <a href="https://codepen.io/nicolasraube" target="_blank">Nicolas Raube</a>.',
      options: {
        'go on': (e) => e.goTo('frame'),
        'go back': (e) => e.goTo('pseudo')
      }
    },
    {
      id: 'frame',
      graph: { id: 9, x: 100, y: 1100 },
      content: 'To begin our CSS Art template, we\'ll create a <code>div</code> with a class of "frame", this will function as our container.',
      options: {
        'go on': (e) => e.goTo('relative'),
        'go back': (e) => e.goTo('many-divs')
      }
    },
    {
      id: 'relative',
      graph: { id: 10, x: 100, y: 1225 },
      content: 'We\'ll give it <code>position: relative;</code> so that any child elements stay positioned relative to it. You can read more about positioning <a href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Positioning" target="_blank">here</a>.',
      options: {
        'go on': (e) => e.goTo('box'),
        'go back': (e) => e.goTo('frame')
      }
    },
    {
      id: 'box',
      graph: { id: 11, x: 100, y: 1350 },
      content: 'Next, we\'ll assign the frame a specific <code>width</code> and <code>height</code>. Think of this as our canvas size, you can adjust these values later, but avoid making them larger than a typical screen. We\'ll also add a <code>border</code> so the canvas edges are visible as we work. You can remove it, if you\'d like, once the piece is finished.',
      options: {
        'go on': (e) => e.goTo('reset'),
        'go back': (e) => e.goTo('relative')
      }
    },
    {
      id: 'reset',
      graph: { id: 12, x: 100, y: 1475 },
      content: 'Next, I\'ll create a CSS rule for our <code>body</code> which removes the default margin browsers often inject and ensures that our height is at least the height of the page, which is default on some browsers, but not all.',
      options: {
        'go on': (e) => e.goTo('flexbox'),
        'go back': (e) => e.goTo('box')
      }
    },
    {
      id: 'flexbox',
      graph: { id: 13, x: 100, y: 1600 },
      content: 'Then we\'ll convert our body into a <a href="https://css-tricks.com/snippets/css/a-guide-to-flexbox/" target="_blank">CSS Flexbox</a> container which will allow us to center its child, the frame element, both vertically and horizontally on the page.',
      options: {
        'go on': (e) => e.goTo('universal'),
        'go back': (e) => e.goTo('reset')
      }
    },
    {
      id: 'universal',
      graph: { id: 14, x: 100, y: 1725 },
      content: 'The last CSS rule we\'ll create uses the <code>*</code>, or "universal" selector. This selector targets every element on the page. We\'ll use it to set one important property: <code>box-sizing</code>. By default, an element\'s <code>width</code> and <code>height</code> only account for its content, while padding and borders get added on top, making the element take up more space than you might expect. Setting <code>box-sizing: border-box;</code> changes this so that padding and borders are included inside the declared width and height, making layout more predictable and easier to manage.',
      options: {
        'go on': (e) => e.goTo('more'),
        'what?': (e) => e.goTo('box-sizing'),
        'go back': (e) => e.goTo('flexbox')
      }
    },
    {
      id: 'box-sizing',
      graph: { id: 37, x: 200, y: 1875 },
      content: 'By default, CSS uses <code>content-box</code> sizing, which means an element’s <code>width</code> only measures the content, and any padding or borders get added on top. For example, if you set a <code>div</code> to <code>width: 200px;</code> with <code>20px</code> of padding and a <code>2px</code> border, the total width is actually 244px (not 200px as you might expect). With <code>box-sizing: border-box;</code>, the width includes the content, padding, and border all together, so the same <code>div</code> would stay exactly 200px wide, making layouts more predictable.',
      options: {
        'I see': (e) => e.goTo('more'),
        'go back': (e) => e.goTo('universal')
      }
    },
    {
      id: 'more',
      graph: { id: 15, x: 300, y: 1725 },
      content: 'At this point we\'re ready to start creating our CSS art. You can add additional <code>div</code> elements inside the frame and create new rules for each one. If you\'ve got another minute, I\'ll show you what I might do next and demonstrate a few more CSS art tricks.',
      options: {
        'show me more': (e) => e.goTo('balloon'),
        'I\'ll take it from here': (e) => {
          WIDGETS['template-projects'].preNewRepoFromTemplate()
        },
        'go back': (e) => e.goTo('universal')
      }
    },
    {
      id: 'balloon',
      graph: { id: 16, x: 400, y: 100 },
      content: 'Great! Let\'s make a red balloon. We\'ll start by adding a new element inside the frame with a class name that describes what it will become.',
      options: {
        'go on': (e) => e.goTo('balloon-rule'),
        'go back': (e) => e.goTo('more')
      }
    },
    {
      id: 'balloon-rule',
      graph: { id: 17, x: 500, y: 225 },
      content: 'Then I\'ll define a rule for it. Because CSS art divs usually don\'t have text content, we need to give them a set <code>width</code>, <code>height</code>, and <code>background</code>, otherwise they won\'t be visible.',
      options: {
        'go on': (e) => e.goTo('fancy-border'),
        'go back': (e) => e.goTo('balloon')
      }
    },
    {
      id: 'fancy-border',
      graph: { id: 18, x: 500, y: 350 },
      content: 'By default, elements are boxes, but we can reshape them in different ways. A common approach is adjusting <code>border-radius</code>. The value I used might look complex, but I generated it with this <a href="https://9elements.github.io/fancy-border-radius/" target="_blank">CSS tool</a>.',
      options: {
        'go on': (e) => e.goTo('after-div'),
        'go back': (e) => e.goTo('balloon-rule')
      }
    },
    {
      id: 'after-div',
      graph: { id: 19, x: 500, y: 475 },
      content: 'Next I\'ll use the trick I mentioned earlier: creating another rule with the <code>::after</code> selector to attach a pseudo-element to the balloon div. Like before, I\'ll give it a <code>width</code>, <code>height</code>, and <code>background</code>.',
      options: {
        'go on': (e) => e.goTo('block'),
        'go back': (e) => e.goTo('fancy-border')
      }
    },
    {
      id: 'block',
      graph: { id: 20, x: 500, y: 600 },
      content: 'Unlike my "red-balloon" div, this pseudo-element won\'t appear at first. That\'s because pseudo-elements need a <code>content</code> property (even just an empty string) and a <code>display: block</code> value before we can style them.',
      options: {
        'go on': (e) => e.goTo('string'),
        'go back': (e) => e.goTo('after-div')
      }
    },
    {
      id: 'string',
      graph: { id: 21, x: 500, y: 725 },
      content: 'Once it\'s visible, I\'ll add a <code>transform</code> to offset its position so it looks like the balloon\'s string. This already works as a "flat" design, but CSS artists often add depth with gradients and shadows.',
      options: {
        'go on': (e) => e.goTo('gradient1'),
        'go back': (e) => e.goTo('block')
      }
    },
    {
      id: 'gradient1',
      graph: { id: 22, x: 500, y: 850 },
      content: 'I\'ll replace the background color with a <code>radial-gradient()</code> function. These can be written in many different ways. You can use my built-in Gradient Generator widget or any number of CSS generators online to learn more about it.',
      options: {
        'go on': (e) => e.goTo('gradient2'),
        'go back': (e) => e.goTo('string')
      }
    },
    {
      id: 'gradient2',
      graph: { id: 23, x: 500, y: 975 },
      content: 'For now, I\'ll pass <code>circle at 30% 30%</code> as the first argument, which creates a circular gradient starting near the top-left. Then I\'ll pass <code>#fcc</code> as the second argument to set the center color stop to a light red, and finally <code>#f00</code> as the third argument to make the outer edge a solid red.',
      options: {
        'go on': (e) => e.goTo('shadow1'),
        'go back': (e) => e.goTo('gradient1')
      }
    },
    {
      id: 'shadow1',
      graph: { id: 24, x: 500, y: 1100 },
      content: 'Next I\'ll give it a bit of a shadow using the <code>box-shadow</code> property, you can also find loads of CSS box shadow generators online as well.',
      options: {
        'go on': (e) => e.goTo('shadow2'),
        'go back': (e) => e.goTo('gradient2')
      }
    },
    {
      id: 'shadow2',
      graph: { id: 25, x: 500, y: 1225 },
      content: 'Remember, you can stack multiple shadows on a single element. I\'ll add another with the <code>inset</code> keyword to act as a highlight. CSS artists often use shadows this way, turning them into highlights for extra dimension.',
      options: {
        'go on': (e) => e.goTo('position'),
        'go back': (e) => e.goTo('shadow1')
      }
    },
    {
      id: 'position',
      graph: { id: 26, x: 500, y: 1350 },
      content: 'Right now, the balloon is stuck in the top-left corner of the frame. To move it, I\'ll set its <code>position</code> to <code>absolute</code>. That way I can place it with <code>top</code>/<code>bottom</code> and <code>left</code>/<code>right</code>. Later, when we add more elements, we can also use <code>z-index</code> to control which ones appear in front or behind.',
      options: {
        'go on': (e) => e.goTo('animation'),
        'go back': (e) => e.goTo('shadow2')
      }
    },
    {
      id: 'animation',
      graph: { id: 27, x: 500, y: 1475 },
      content: 'Let\'s add an animation to give it that final touch of CSS art. I\'ll write a <code>@keyframes</code> rule called "float" and give it three keyframes, one at the start <code>0%</code> one at the middle of it\'s timeline <code>50%</code> and one at the end <code>100%</code>.',
      options: {
        'go on': (e) => e.goTo('keyframes'),
        'go back': (e) => e.goTo('position')
      }
    },
    {
      id: 'keyframes',
      graph: { id: 28, x: 500, y: 1600 },
      content: 'At the start of the animation <code>0%</code>, I\'ll set the <code>transform</code> so the balloon\'s vertical position is <code>0</code>, leaving it in place. At the halfway point <code>50%</code>, I\'ll pass <code>20px</code> to shift it down on the Y-axis. At the end <code>100%</code>, I\'ll set the value back to <code>0</code> so it returns to its original position.',
      options: {
        'go on': (e) => e.goTo('anim-props'),
        'go back': (e) => e.goTo('animation')
      }
    },
    {
      id: 'anim-props',
      graph: { id: 29, x: 500, y: 1725 },
      content: 'Defining the animation isn\'t enough, we still need to apply it. Using animation properties, we can attach it to the balloon, set how long it runs, add a <a href="https://easings.net/" target="_blank">timing function</a> to smooth the motion, and loop it forever with an "infinite" iteration count.',
      options: {
        'go on': (e) => e.goTo('single-line'),
        'go back': (e) => e.goTo('keyframes')
      }
    },
    {
      id: 'single-line',
      graph: { id: 30, x: 500, y: 1850 },
      content: 'And since CSS artists prefer clean code, we\'ll replace the longhand properties with the shorthand <code>animation</code> property to write everything in a single line.',
      options: {
        'go on': (e) => e.goTo('frame-bg'),
        'go back': (e) => e.goTo('anim-props')
      }
    },
    {
      id: 'frame-bg',
      graph: { id: 31, x: 500, y: 1975 },
      content: 'Don\'t forget, the frame isn\'t just a container, it can be part of the artwork too. Let\'s give it a background.',
      options: {
        'go on': (e) => e.goTo('frame-circle'),
        'go back': (e) => e.goTo('single-line')
      }
    },
    {
      id: 'frame-circle',
      graph: { id: 32, x: 500, y: 2100 },
      content: 'Since it\'s a box by default, we can turn it into a circle by adding <code>border-radius</code> of <code>50%</code>.',
      options: {
        'go on': (e) => e.goTo('hidden'),
        'go back': (e) => e.goTo('frame-bg')
      }
    },
    {
      id: 'hidden',
      graph: { id: 33, x: 500, y: 2225 },
      content: 'Notice how the balloon now looks like it\'s escaping the frame. To contain it, we could set <code>overflow: hidden;</code>.',
      options: {
        'go on': (e) => e.goTo('clip-path'),
        'go back': (e) => e.goTo('frame-circle')
      }
    },
    {
      id: 'clip-path',
      graph: { id: 34, x: 500, y: 2350 },
      content: 'Alternatively, we could use the <code>clip-path</code> property with a function like <code>circle()</code>. This property can cut any element into all sorts of shapes, not just circles. Check out this <a href="https://bennettfeely.com/clippy/" target="_blank">clip-path generator</a> for other examples.',
      options: {
        'go on': (e) => e.goTo('pre-end-guide'),
        'go back': (e) => e.goTo('hidden')
      }
    },
    {
      id: 'pre-end-guide',
      graph: { id: 35, x: 500, y: 2475 },
      content: 'Personally, I like the balloon overflowing, so I\'ll leave it as is. I hope you like my CSS art! I can either leave you with this artwork or reset the frame template so you can start building your own composition.',
      options: {
        'let\'s reset': (e) => e.goTo('end-guide'),
        'I\'ll experiment with this': (e) => {
          NNE.readyOnly = false
          e.hide()
        },
        'go back': (e) => e.goTo('clip-path')
      }
    },
    {
      id: 'end-guide',
      graph: { id: 36, x: 650, y: 2475 },
      before: () => {
        cssArtGallery.close()
        setTimeout(() => anastasia.close(), 200)
        setTimeout(() => diana.close(), 400)
      },
      content: 'Here\'s the blank template, before I added the balloon. Would you like to start a new project or just experiment a bit?',
      options: {
        'start a new project': (e) => {
          WIDGETS['template-projects'].preNewRepoFromTemplate()
        },
        'I\'ll experiment a bit first': (e) => {
          WIDGETS['template-projects']._experimentWithCode()
          e.hide()
        },
        'go back': (e) => e.goTo('pre-end-guide')
      }
    }
  ]
}
