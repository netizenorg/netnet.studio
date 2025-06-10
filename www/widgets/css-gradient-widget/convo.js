/* global  */
window.CONVOS['css-gradient-widget'] = (self) => {
  return [{
    id: 'gradient-gen-intro',
    content: 'The CSS Gradient Generator helps you create <code>linear-gradient()</code>, <code>radial-gradient()</code> and <code>conic-gradient()</code> CSS functions which you can pass as the value to the <code>background</code> or <code>background-image</code> properties. Edit the "mad lib" style description and notice how the gradient, as well as the generated code snippet below it, changes (NOTE: this widget is still a work in progress).',
    options: {
      ok: (e) => e.hide(),
      'beta?': (e) => e.goTo('progress')
    }
  }, {
    id: 'progress',
    content: 'This widget is still a work in progress, which means there will likey be bugs. That said, the Internet is full of CSS generators, including many which help you generate gradients, just search for <a href="https://duckduckgo.com/?q=css+gradient+generator&ia=web" target="_blank">CSS gradient generators</a>.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'stops',
    content: 'You need at least 2 colors to create a gradient. Click on the color boxes and sliders at the bottom of the widget to change the color value and color stop location/percentage.',
    options: {
      ok: (e) => e.hide()
    }
  }]
}
