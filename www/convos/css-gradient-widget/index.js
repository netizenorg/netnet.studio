/* global  */
window.CONVOS['css-gradient-widget'] = (self) => {
  return [{
    id: 'gradient-gen-intro',
    content: 'The CSS Gradient Generator helps you create <code>linear-gradient()</code>, <code>radial-gradient()</code> and <code>conic-gradient()</code> CSS functions which you can pass as the value to the <code>background</code> or <code>background-image</code> properties. Edit the "mad lib" style description and notice how the gradient, as well as the generated code snippet below it, changes.',
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
