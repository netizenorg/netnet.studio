/* global WIDGETS NNE */
window.CONVOS['template-css-minimalist'] = (self) => {
  return [
    {
      id: 'minimalist-intro',
      graph: { id: 1, x: 350, y: 25 },
      content: 'Here is a modern and minimalist starting point for a simple web page. I\'ll assume you\'re already familiar with some intermediate CSS concepts like CSS variables and media queries and focus this guide on some of the style choices specific to this template.',
      options: {
        'go on': (e) => e.goTo('html'),
        'I\'m not familiar with those?': (e) => e.goTo('landing-page')
      }
    },
    {
      id: 'landing-page',
      graph: { id: 2, x: 225, y: 175 },
      content: 'Oh, in that case I would consider checking out my guided walkthrough of the CSS Landing Page template before diving into this one.',
      options: {
        'I\'ll get to it later': (e) => e.goTo('style'),
        'Ok, let\'s jump to that one': (e) => {
          WIDGETS['template-projects'].startGuide('css-landing-page')
        },
        'go back': (e) => e.goTo('minimalist-intro')
      }
    },
    {
      id: 'html',
      graph: { id: 3, x: 150, y: 50 },
      content: 'We\'ll start with HTML that\'s very similar to the HTML5 Template, except that our body consists of a <code>main</code> element with a <code>p</code> tag containing "<a href="https://www.lipsum.com/" target="_blank">Lorem ipsum</a>". This is what designers call gibberish placeholder text that mimics real paragraphs without meaningful content. We use it here to preview typography, spacing, and link styling so you can judge the layout before adding real copy.',
      options: {
        'go on': (e) => e.goTo('style'),
        'go back': (e) => e.goTo('minimalist-intro')
      }
    },
    {
      id: 'style',
      graph: { id: 4, x: 25, y: 175 },
      content: 'I\'ll be writing the CSS in a <code>style</code> element because at the moment this is just a single HTML page, but if you decide to create a project with multiple HTML pages, I would recommend placing the CSS in it\'s own style sheet.',
      options: {
        'go on': (e) => e.goTo('universal'),
        'go back': (e) => e.goTo('html')
      }
    },
    {
      id: 'universal',
      graph: { id: 5, x: 25, y: 325 },
      content: 'As a common "reset", we\'ll start by creating a rule for our <code>*</code>, or "universal" selector, as well as a universal <code>::before</code> and <code>::after</code> which sets <code>box-sizing</code> to <code>border-box</code> so that padding and borders are included inside the declared width and height of all elements, making layout more predictable and easier to manage.',
      options: {
        'go on': (e) => e.goTo('root-vars'),
        'go back': (e) => e.goTo('style')
      }
    },
    {
      id: 'root-vars',
      graph: { id: 6, x: 25, y: 625 },
      content: 'Next we\'ll define a few design values on <code>:root</code> using CSS variables (aka "<a href="https://css-tricks.com/a-complete-guide-to-custom-properties/" target="_blank">custom properties</a>"). This will be a place to place our global "settings" for colors, spacing, and measurements across the entire page.',
      options: {
        'go on': (e) => e.goTo('brand'),
        'go back': (e) => e.goTo('universal')
      }
    },
    {
      id: 'brand',
      graph: { id: 7, x: 175, y: 625 },
      content: 'I\'ll call our first variable <code>--brand</code> and store a primary accent color. We\'ll use it for links and selection so interactive elements feel consistent.',
      options: {
        'go on': (e) => e.goTo('bg-fg'),
        'go back': (e) => e.goTo('root-vars')
      }
    },
    {
      id: 'bg-fg',
      graph: { id: 8, x: 325, y: 625 },
      content: '<code>--bg</code> and <code>--fg</code> set the default background and foreground (text) colors. We\'ll apply them to the body rule later which will make theming simple.',
      options: {
        'go on': (e) => e.goTo('alt-palette'),
        'go back': (e) => e.goTo('brand')
      }
    },
    {
      id: 'alt-palette',
      graph: { id: 9, x: 475, y: 625 },
      content: '<code>--alt</code>, <code>--alt-bg</code>, and <code>--alt-fg</code> define an alternate palette we can swap to for dark or inverted themes, which we\'ll get to soon.',
      options: {
        'go on': (e) => e.goTo('space-measure'),
        'go back': (e) => e.goTo('bg-fg')
      }
    },
    {
      id: 'space-measure',
      graph: { id: 10, x: 625, y: 625 },
      content: '<code>--space</code> is our basic rhythm unit, and <code>--measure</code> (in <code>ch</code> or "character" units) will cap our line lengths for comfortable reading.',
      options: {
        'go on': (e) => e.goTo('prefers-dark'),
        'go back': (e) => e.goTo('alt-palette')
      }
    },
    {
      id: 'prefers-dark',
      graph: { id: 11, x: 775, y: 625 },
      content: 'Now we\'ll define our "Dark mode" theme, which is set in the browser settings by users who prefers light text on a dark background. When this media query detects that setting it will swap our variables <code>--bg</code>, <code>--fg</code>, and <code>--brand</code> to the alternative pallette values.',
      options: {
        'go on': (e) => e.goTo('selection'),
        'go back': (e) => e.goTo('space-measure')
      }
    },
    {
      id: 'selection',
      graph: { id: 12, x: 775, y: 775 },
      content: '"Selection" is the highlight you see when you select text (try clicking and dragging your mouse over the text behind me). The <code>::selection</code> pseudo-element lets us style that highlight, here we use <code>--brand</code> for the highlight color and <code>--bg</code> for the selected text so it matches the theme and stays readable.',
      options: {
        'go on': (e) => e.goTo('focus-visible'),
        'go back': (e) => e.goTo('prefers-dark')
      }
    },
    {
      id: 'focus-visible',
      graph: { id: 13, x: 775, y: 925 },
      content: '<code>:focus-visible</code> shows a focus ring only for keyboard-style focus, when you <i>Tab</i> throught page, so mouse users don’t see it while people navigating without a mouse do. A clear outline is an accessibility cue that helps users track where they are and aligns with WCAG guidance for a visible focus indicator. <code>outline-offset</code> pulls the ring slightly away from text/controls so it stays crisp and readable.',
      options: {
        'go on': (e) => e.goTo('html-fonts'),
        'go back': (e) => e.goTo('selection')
      }
    },
    {
      id: 'html-fonts',
      graph: { id: 14, x: 775, y: 1075 },
      content: 'I\'ll set our font to a modern "system ui" font stack which uses the OS’s built-in interface font. It renders instantly, no web-font downloads or layout shift and feels native across platforms. <code>sans-serif</code> is a small fallback for older browser versions. Of course, when you start your own project, feel free to replace this with your preferred <a href="https://modernfontstacks.com/" target="_blank">modern font stack</a>.',
      options: {
        'go on': (e) => e.goTo('html-lineheight'),
        'go back': (e) => e.goTo('focus-visible')
      }
    },
    {
      id: 'html-lineheight',
      graph: { id: 15, x: 625, y: 1075 },
      content: 'I find the default line height a bit too tight, I\'ve bumped it a bit to improve readability. I\'m using a unitless <code>line-height: 1.5</code> which scales naturally with the font size.',
      options: {
        'go on': (e) => e.goTo('text-adjust'),
        'go back': (e) => e.goTo('html-fonts')
      }
    },
    {
      id: 'text-adjust',
      graph: { id: 16, x: 475, y: 1075 },
      content: 'On iOS Safari, the browser may "inflate" text on small screens to improve legibility, which can disrupt spacing and cause layout shifts. <code>-webkit-text-size-adjust: 100%</code> tells Safari to render text at exactly the sizes you set (100%) instead of auto-enlarging. This doesn\'t block pinch-zoom or the user\'s page zoom, it just prevents surprise resizing.',
      options: {
        'go on': (e) => e.goTo('body-basics'),
        'what\'s -webkit-?': (e) => e.goTo('vendors'),
        'go back': (e) => e.goTo('html-lineheight')
      }
    },
    {
      id: 'vendors',
      graph: { id: 31, x: 325, y: 1075 },
      content: 'That\'s a <a href="https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix" target="_blank">vendor prefixes</a>, a browser-specific label added to CSS properties for experimental or special behavior. Common prefixes include <code>-webkit-</code>, <code>-moz-</code> and <code>-ms-</code>. The <code>-webkit-</code> targets WebKit (Safari/iOS) and is also understood by Chrome for compatibility. I\'m using it here for iOS Safari quirks like <code>-webkit-text-size-adjust</code>, it likely won\'t be the last time you run into one of these.',
      options: {
        'I see': (e) => e.goTo('body-basics')
      }
    },
    {
      id: 'body-basics',
      graph: { id: 17, x: 475, y: 1225 },
      content: 'Browsers give <code>body</code> a default margin (often 8px), which adds unintended whitespace around the page. We reset it to <code>0</code> for a consistent baseline across browsers, much like our box-sizing reset, this is a very common "reset" in web design. We\'ll add some spacing intentionally later on.',
      options: {
        'go on': (e) => e.goTo('body-tokens'),
        'go back': (e) => e.goTo('text-adjust')
      }
    },
    {
      id: 'body-tokens',
      graph: { id: 18, x: 325, y: 1225 },
      content: 'We set page colors explicitly on <code>body</code> so our CSS variables actually renders the background (which is technically "transparent" by default) and modifies our text color to a shade slightly lighter than the default black.',
      options: {
        'go on': (e) => e.goTo('body-colors'),
        'go back': (e) => e.goTo('body-basics')
      }
    },
    {
      id: 'body-colors',
      graph: { id: 19, x: 175, y: 1225 },
      content: 'You may recall that our "dark mode" media query swaps <code>--bg</code>/<code>--fg</code> on <code>:root</code>, and because <code>body</code> uses those variables, the whole page gets inverted automatically.',
      options: {
        'go to': (e) => e.goTo('overflow-wrap'),
        'go back': (e) => e.goTo('body-tokens')
      }
    },
    {
      id: 'overflow-wrap',
      graph: { id: 20, x: 25, y: 1225 },
      content: 'Lastly, <code>overflow-wrap: anywhere</code> lets very long words "wrap" instead of breaking the layout on small screens.',
      options: {
        'go on': (e) => e.goTo('media-fluid'),
        'go back': (e) => e.goTo('body-colors')
      }
    },
    {
      id: 'media-fluid',
      graph: { id: 21, x: 25, y: 1375 },
      content: 'This template doesn\'t include images or videos yet, but I\'ll prep for them just in case. Setting <code>max-width: 100%</code> and <code>height: auto</code> makes media shrink to fit its container (no overflow) while keeping the aspect ratio. Adding <code>display: block</code> removes the tiny baseline gap inline elements create, so layouts snap cleanly. When you add media later, it will be responsive by default.',
      options: {
        'go on': (e) => e.goTo('a-color'),
        'go back': (e) => e.goTo('overflow-wrap')
      }
    },
    {
      id: 'a-color',
      graph: { id: 22, x: 25, y: 1525 },
      content: 'Here we replace the browser\'s default link blue with our brand\'s color. I chose thse colors for accessibility: <code>#b94bac</code> meets WCAG AA on white (light mode), and we swap to <code>#c76ebc</code> in dark mode, which meets AA on our dark background. Though some desginers prefer to remove the links default underline, I\'ve kept it so links are identifiable without relying on color alone.',
      options: {
        'go on': (e) => e.goTo('a-visited'),
        'WCAG? AA?': (e) => e.goTo('wcag-aa'),
        'go back': (e) => e.goTo('media-fluid')
      }
    },
    {
      id: 'wcag-aa',
      graph: { id: 23, x: 200, y: 1575 },
      content: 'WCAG (<a href="https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines" target="_blank">Web Content Accessibility Guidelines</a>) is the W3C standard for making the web usable for more people. Level AA is the usual baseline: it covers things like readable text, keyboard access, and visible focus. For color contrast, AA means at least 4.5:1 for normal text and 3:1 for large/bold text. You can use resources like <a href="https://accessibleweb.com/color-contrast-checker/" target="_blank">AccessibleWeb Contrast Checker</a> and <a href="https://www.a11yproject.com/checklist" target="_blank">The A11Y Project Checklist</a> to ensure you code stays up accessible.',
      options: {
        'go on': (e) => e.goTo('a-visited'),
        'go back': (e) => e.goTo('a-color')
      }
    },
    {
      id: 'a-visited',
      graph: { id: 24, x: 25, y: 1675 },
      content: 'A subtle visited state (<code>opacity: 0.9</code>) differentiates previously followed links without heavy restyling.',
      options: {
        'go on': (e) => e.goTo('a-hover'),
        'go back': (e) => e.goTo('a-color')
      }
    },
    {
      id: 'a-hover',
      graph: { id: 25, x: 25, y: 1825 },
      content: 'It\'s pretty common to create a <code>:hover</code> and <code>:focus</code> rule for our links to give it a subtle change in those instances. Often this is a color change, here instead I thicken the underline to <code>2px</code> instead of the default <code>1px</code>, a non-color cue that remains accessible.',
      options: {
        'go on': (e) => e.goTo('wrap'),
        'go back': (e) => e.goTo('a-visited')
      }
    },
    {
      id: 'wrap',
      graph: { id: 26, x: 25, y: 1975 },
      content: 'Designers commonly create a "wrap" class, somtimes also called "container", to keep content readable on any screen. It\'s a neutral utility that caps line length, centers the block, and adds small side gutters. That makes it responsive by default, on narrow screens it stretches to the viewport with padding as gutters and on wide screens it stops at a comfortable measure instead of becoming a super-wide line.',
      options: {
        'go on': (e) => e.goTo('wrap-max'),
        'go back': (e) => e.goTo('a-hover')
      }
    },
    {
      id: 'wrap-max',
      graph: { id: 27, x: 175, y: 1975 },
      content: 'To accomplish this we first limit the line length to our ideal reading measure (~65ch). On phones it can still default to the full width but on large screens it stops growing so lines stay comfortable to read.',
      options: {
        'go on': (e) => e.goTo('wrap-center'),
        'go back': (e) => e.goTo('wrap')
      }
    },
    {
      id: 'wrap-center',
      graph: { id: 28, x: 325, y: 1975 },
      content: '<code>margin-inline: auto</code> centers the container on the inline axis, this is a newer <a href="https://css-tricks.com/css-logical-properties-and-values/" target="_blank">logical properties</a> version of the classic <code>margin: 0 auto</code> I\'ve mentioned elsewhere. Because it\'s direction-aware, it works for left-to-right, right-to-left, and even vertical writing modes.',
      options: {
        'go on': (e) => e.goTo('wrap-padding'),
        'go back': (e) => e.goTo('wrap-max')
      }
    },
    {
      id: 'wrap-padding',
      graph: { id: 29, x: 475, y: 1975 },
      content: 'Lastly, this padding adds side gutters so text never hugs the edge of the screen. It\'s tied to our spacing scale, which keeps rhythm consistent. On small screens it acts as the responsive buffer on wide screens it\'s just comfortable breathing room which is a little less noticble.',
      options: {
        'go on': (e) => e.goTo('end-guide'),
        'go back': (e) => e.goTo('wrap-center')
      }
    },
    {
      id: 'end-guide',
      graph: { id: 30, x: 475, y: 2125 },
      content: 'That\'s all there is to a minimalist CSS template. As I said earlier, feel free to change or reformat any of it. If you create additional HTML pages you should definitely migrate the styles into their own CSS file once you create a project. Shall we start a new project?',
      options: {
        'yes, let\'s start a new project': (e) => {
          WIDGETS['template-projects'].preNewRepoFromTemplate()
        },
        'no, I\'ll experiment a bit first': (e) => {
          WIDGETS['template-projects']._experimentWithCode()
          e.hide()
        },
        'go back': (e) => e.goTo('wrap-padding')
      }
    }
  ]
}
