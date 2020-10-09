/* global Widget */
/*
  -----------
     info
  -----------

  Explain what this widget is for and what it does...

  -----------
     usage
  -----------

  // it's important that the file-name matches the class-name because
  // this widget is instantiated by the WindowManager as...
  WIDGETS['Example Widget'] = new ExampleWidget()

  // this class inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js to see what those are
  // or take a look at the wiki...
  // https://github.com/netizenorg/netnet.studio/wiki/Creating-Widgets
*/
class ExampleWidget extends Widget {
  constructor (opts) {
    super(opts)

    // NOTE: must have key if you want the WindowManager to automatically
    // instantiate it. Otherwise, the assumption is that it will be instantiated
    // later using NNW.loadWidget() or NNW.loadWidgets()
    // at which point it's key will be assigned based on the property name
    this.key = 'example-widget'

    // If you want this widget to show up in the fuzzy search results it helps
    // (but is not required) to create a keywords array of related words
    this.keywords = ['example', 'demo', 'template']

    // if for whatever reason you don't want this showing up
    // in the Widgets Menu or SearchBar results you can set listed to false
    this.listed = false

    // here's some more example code...
    this.title = 'This is an Example Title'
    this._exampleMethodForCreatingContent(opts)
  }

  // most widgets are meant to be instantiated only once at load time,
  // but if this is meant to be a reusuable widget (and so not immediately
  // instantiated, but rather instantiated some number of times at some point
  // later on, ex: during a tutorial) then we should set the following
  // static getter. Otherwise, you should remove this line.
  static get skipAutoInstantiation () { return true }

  _exampleMethodForCreatingContent (opts) {
    opts = opts || {}
    const quote = opts.quote || 'No quote was passed into the constructor.'
    const attribution = opts.author || 'Anonymous'
    this.innerHTML = `
      <blockquote>
        ${quote}
        <span>—${attribution}</span>
      </blockquote>
    `
  }
}

window.ExampleWidget = ExampleWidget
