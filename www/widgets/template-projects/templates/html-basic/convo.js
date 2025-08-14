/* global utils */
window.CONVOS['template-html-basic'] = (self) => {
  return [
    {
      id: 'doctype',
      graph: { id: 1, x: 25, y: 25 },
      edit: true,
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
        'go on': (e) => e.goTo('lang-attr')
      }
    },
    {
      id: 'lang-attr',
      graph: { id: 1, x: 25, y: 25 },
      content: 'The <code>lang</code> attribute tells the browser (and assistive technologies like screen readers) what language the text on your page is written in. This helps improve accessibility by allowing screen readers to use the correct pronunciation rules, and it also helps search engines understand and index your content more accurately.',
      options: {
        'go on': (e) => e.goTo('head-and-body'),
        'what if I\'ve got many langauges?': (e) => e.goTo('lang-attr2')
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
        'child elements?': (e) => e.goTo('children')
      }
    },
    {
      id: 'head-ele',
      graph: { id: 7, x: 25, y: 525 },
      content: 'The <code>head</code> is where our "metadata" goes. This is information about your page, rather than the page\'s content itself. I\'ve left a comment in there so you don\'t forget.',
      options: {
        'go on': (e) => e.goTo('title-ele'),
        'a comment?': (e) => e.goTo('comment')
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
      content: 'For example, your page\'s <code>title</code>, this won\'t appear on your page but it will appear elsewhere, like in the browser tab or browser\'s history. This is also the title that will show up in web search results and social media cards when folks share a link to your page on other platforms. <input placeholder="what should our title be?" style="display:inline; width:230px;">',
      options: {
        'go on': (e, t) => {
          const v = t.$('input').value
          self.vars.title = v || 'Your Page Title'
          if (!v) e.goTo('temp-title')
          else e.goTo('your-title')
        }
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
        'go on': (e) => e.goTo('meta-ele')
      }
    },
    {
      id: 'your-title',
      graph: { id: 12, x: 550, y: 200 },
      content: 'Great, I\'ve added that as the <code>title</code> element\'s content.',
      options: {
        'go on': (e) => e.goTo('meta-ele')
      }
    },
    {
      id: 'meta-ele',
      after: () => {
        console.log('HI');
        console.log(self);
      },
      graph: { id: 13, x: 475, y: 325 },
      content: 'These <code>meta</code> tags add extra details about your page. The author tag credits who made it, and the description tag gives a short summary of what it’s about. Like the <code>title</code> element, these are useful for search engines and when your page is shared.',
      options: {
        'go on': (e) => e.goTo('viewport')
      }
    },
    {
      id: 'viewport',
      graph: { id: 14, x: 475, y: 450 },
      content: 'This next meta tag is for mobile devices, without it your page would look teeny-tiny on their smaller screens. Check out this <a href="https://stackoverflow.com/questions/10892463/how-is-the-meta-viewport-tag-used-and-what-does-it-do" target="_blank">stackoverflow conversation</a> to learn more about it.',
      options: {

      }
    }
  ]
}
