/* global WIDGETS */
window.CONVOS['template-html-meta-tags'] = (self) => {
  return [
    {
      id: 'intro',
      graph: { id: 1, x: 25, y: 25 },
      content: 'This template begins where the <i>HTML Basic Template</i> left off. We\'ll be adding more metadata tags to the <code>head</code> of our page for controlling how our site (or app) appears in other contexts, like social media posts and mobile device home screens.',
      options: {
        'go on': (e) => e.goTo('split-off-mobile'),
        'HTML Basic?': (e) => e.goTo('html-basic')
      }
    },
    {
      id: 'html-basic',
      graph: { id: 2, x: 175, y: 125 },
      content: 'The <i>HTML Basic Template</i> goes over the initial structure you see here now. If this is new for you, maybe you should consider starting with that template before going through this one?',
      options: {
        'no, go on': (e) => e.goTo('split-off-mobile'),
        'ok, let\'s do that one instead': (e) => {
          WIDGETS['template-projects'].loadTemplate('html-basic')
        }
      }
    },
    {
      id: 'split-off-mobile',
      graph: { id: 3, x: 25, y: 175 },
      content: 'We\'ll start by splitting off this <i>viewport</i> <code>meta</code> tag from the others, since this is specifically related to mobile devices and we\'ve got a few more to add in that category.',
      options: {
        'go on': (e) => e.goTo('favicon'),
        'go back': (e) => e.goTo('intro')
      }
    },
    {
      id: 'favicon',
      graph: { id: 4, x: 25, y: 325 },
      content: 'Before returning to the mobile tags, let\'s add a <i>favicon</i> (short for "favorite icon") by including a <code>link</code> tag with a <code>rel="icon"</code>. The favicon sets the small picture you see in the browser book marks and in the browser tab next to your page\'s title.',
      options: {
        'go on': (e) => e.goTo('favicon2'),
        'go back': (e) => e.goTo('split-off-mobile')
      }
    },
    {
      id: 'favicon2',
      graph: { id: 5, x: 150, y: 400 },
      content: 'A favicon should be fairly small, around 32px wide by 32px tall. If you choose to start a new project at the end of this guide based on this template, I\'ll include this <code>favicon.png</code> example image in the <code>images</code> folder fo your project for reference.',
      options: {
        'go on': (e) => e.goTo('theme-color'),
        'go back': (e) => e.goTo('favicon')
      }
    },
    {
      id: 'theme-color',
      graph: { id: 6, x: 25, y: 475 },
      content: 'Returning now to the metadata for mobile devices, this <code>theme-color</code> meta tag changes the color of the browser interface to match your site. For example, on Android it can tint the address bar and task switcher card background, giving your page a more branded feel.',
      options: {
        'go on': (e) => e.goTo('apple-touch-icon'),
        'go back': (e) => e.goTo('favicon2')
      }
    },
    {
      id: 'apple-touch-icon',
      graph: { id: 7, x: 25, y: 625 },
      content: 'This <code>apple-touch-icon</code> link tells iPhones and iPads what icon to use if someone saves your site to their home screen. Without it, iOS will try to auto-generate an icon, often just a letter, so providing a custom PNG looks much better.',
      options: {
        'go on': (e) => e.goTo('apple-touch-icon2'),
        'go back': (e) => e.goTo('theme-color')
      }
    },
    {
      id: 'apple-touch-icon2',
      graph: { id: 8, x: 175, y: 700 },
      content: 'This icon should ideally be 180px wide by 180px tall. As with the other images in this template, if you choose to start a new project at the end of this guide, I\'ll include an example image in the project for reference.',
      options: {
        'go on': (e) => e.goTo('apple-webapp-capable'),
        'go back': (e) => e.goTo('apple-touch-icon')
      }
    },
    {
      id: 'apple-webapp-capable',
      graph: { id: 9, x: 25, y: 775 },
      content: 'Adding the <code>name="apple-mobile-web-app-capable"</code> tag with the <code>content</code> value set to <i>yes</i> lets your page run like a standalone app when launched from the home screen. That means Safari\'s usual address bar and controls are hidden, and your site fills the whole screen.',
      options: {
        'go on': (e) => e.goTo('apple-status-bar-style'),
        'go back': (e) => e.goTo('apple-touch-icon2')
      }
    },
    {
      id: 'apple-status-bar-style',
      graph: { id: 10, x: 25, y: 925 },
      content: 'The <code>apple-mobile-web-app-status-bar-style</code> tag decides what the iOS status bar looks like in that fullscreen mode. The default shows a normal bar, while options like <i>black</i> or <i>black-translucent</i> can make it blend differently with your design.',
      options: {
        'go on': (e) => e.goTo('social-tags'),
        'go back': (e) => e.goTo('apple-webapp-capable')
      }
    },
    {
      id: 'social-tags',
      graph: { id: 11, x: 400, y: 750 },
      content: 'Now we\'ll start a new section here for our <a href="https://ogp.me/" target="_blank">open graph</a> <code>meta</code> tags . These are used to create the content in those <i>cards</i> that show up on social platforms when someone shares a link to your page.',
      options: {
        'go on': (e) => e.goTo('og-title'),
        'go back': (e) => e.goTo('apple-status-bar-style')
      }
    },
    {
      id: 'og-title',
      graph: { id: 12, x: 400, y: 900 },
      content: 'This first one is the <code>og:title</code> tag, which sets the title of the social card. It\'s usually displayed in bold above the preview image, so think of it as the "headline" for your link.',
      options: {
        'go on': (e) => e.goTo('og-description'),
        'go back': (e) => e.goTo('social-tags')
      }
    },
    {
      id: 'og-description',
      graph: { id: 13, x: 400, y: 1050 },
      content: 'The <code>og:description</code> tag adds a short summary underneath the title in social previews. This could match the content of your <code>name="description"</code> tag. It should be kept short and clear.',
      options: {
        'go on': (e) => e.goTo('og-image'),
        'go back': (e) => e.goTo('og-title')
      }
    },
    {
      id: 'og-image',
      graph: { id: 14, x: 400, y: 1200 },
      content: 'The <code>og:image</code> tag specifies the picture that appears when your page is shared. Unlike the small favicon and apple-touch-icon, this one should be a large, high-quality image, ideally 1200px wide by 630px tall.',
      options: {
        'go on': (e) => e.goTo('og-url'),
        'go back': (e) => e.goTo('og-description')
      }
    },
    {
      id: 'og-url',
      graph: { id: 15, x: 400, y: 1350 },
      content: 'The <code>og:url</code> tag declares the "official" address of your page. This helps social networks avoid treating different URLs (like with tracking codes) as separate pages, and makes sure shares all point back to the same place.',
      options: {
        'go on': (e) => e.goTo('og-url2'),
        'go back': (e) => e.goTo('og-image')
      }
    },
    {
      id: 'og-url2',
      graph: { id: 16, x: 400, y: 1475 },
      content: 'You\'ll notice that like the <code>og:image</code> URL, this must point to a publically hosted page. So it\'s best to include these only after you\'ve published your page and have a publically accessible URL.',
      options: {
        'go on': (e) => e.goTo('og-type'),
        'go back': (e) => e.goTo('og-url')
      }
    },
    {
      id: 'og-type',
      graph: { id: 17, x: 400, y: 1600 },
      content: 'Lastly, the <code>og:type</code> tag tells social media platforms what kind of thing your page represents. Setting it to <i>website</i> is the most common choice for homepages or general pages, but there are also more specific types like <i>article</i>, <i>video</i>, or <i>music</i>. You can learn more about the open graph standard on their website <a href="https://ogp.me/" target="_blank">ogp.me</a>',
      options: {
        'go on': (e) => e.goTo('end-guide'),
        'go back': (e) => e.goTo('og-url2')
      }
    },
    {
      id: 'end-guide',
      graph: { id: 18, x: 400, y: 1725 },
      content: 'There are HTML purists that prefer to keep their pages like this, raw HTML only, but most folks prefer to add some <i>style</i> to their page with CSS code. Would you like to build on this template by adding some CSS or we can start a new project from here?',
      options: {
        'Let\'s add some CSS': (e) => {
          WIDGETS['template-projects'].startGuide('css-landing-page')
        },
        'What\'s CSS?': (e) => e.goTo('pre-closer'),
        'I\'ll take it from here': (e) => {
          WIDGETS['template-projects'].preNewRepoFromTemplate()
        },
        'go back': (e) => e.goTo('og-type')
      }
    },
    {
      id: 'pre-closer',
      content: 'CSS, or Cascading Style Sheets, is how we chang the look and feel of our HTML. It handles things like layout, color and fonts, and can also add some interactive effects and animations to our page. If you\'ve never written any CSS but would like to learn I suggest starting with my Introduction to CSS before diving into your first CSS tempate.',
      options: {
        'Ok, let\'s do the CSS intro': (e) => {
          WIDGETS.open('css-reference', (w) => w.toggleIntroPresentation())
        },
        'go back': (e) => e.goTo('end-guide')
      }
    }
  ]
}
