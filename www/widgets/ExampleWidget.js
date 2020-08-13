/* global Widget */
/*
  -----------
     info
  -----------

  Explain what this widget is for and what it does...

  -----------
     usage
  -----------

  const w = new ExampleWidget({
    quote: 'motivational quote' // (required) quote to display as content
    author: 'Nick Briz',        // (optional) quote attribution
    x: 20,                      // (optional) left position
    y: 20,                      // (optional) top positon
    z: 100,                     // (optional) z-index
    width: 500,                 // (optional) widget's width
    height: 500                 // (optional) widget's height
  })

  w.content = element
  w.title = 'settings'
  w.x = 20
  w.y = '50vh'
  w.z = 100
  w.width = '50vw'
  w.height = '50vh'

  w.position(x, y, z)     // update position
  w.resize(width, height) // update size
  w.open()                // display
  w.close()               // hide

*/
class ExampleWidget extends Widget {
  constructor (opts) {
    super(opts)

    if (!opts.quote) {
      console.error('ExampleWidget: options object requires a "quote" property')
    }

    this.title = 'Quote File'
    this._createContent(opts.quote, opts.author)
  }

  _createContent (quote, author) {
    const attribution = author || 'Anonymous'
    this.content = `
      <blockquote>
        ${quote}
        <span>—${attribution}</span>
      </blockquote>
    `
  }
}

window.ExampleWidget = ExampleWidget
