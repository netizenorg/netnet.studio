/* global Widget, Convo */
// the comment above is just to let the standardJS linter know which global
// variables we're going to use if your widget is going to interact with other
// netnet global variables like NNE, NNW, utils, etc. make sure to list them above
class ExampleWidget extends Widget {
  constructor (opts) {
    super(opts)

    // NOTE: your key name must match your Widget's folder name and class name,
    // for example, a class called MyWidget (written in camel-case) should have 
    // a key of 'my-widget' and be saved within a folder called 'my-widget'
    this.key = 'example-widget'
    // NOTE: this.key is only meant for single-use widgets. if this widget class
    // is used to instantiate multiple instances of itself (like a more traditional 
    // OOP class), then you should leave this.key null and set the
    // skipAutoInstantiation (below) to true. The assumption then is that elsewhere
    // in the studio (say in a tutorial for example or via interacting with another
    // widget) the instances will be created and named, for example:
    // WIDGETS['example-1'] = new ExampleWidget()

    // if for whatever reason you don't want this showing up in the
    // SearchBar's search results you can set listed to false
    // (otherwise you can remove this, the default is 'true')
    this.listed = false

    // If you want this widget to show up in the SearchBar results it helps
    // (but is not required) to create a keywords array of related words
    // (NOTE: for search result API purposes, this must be written on one line)
    this.keywords = ['example', 'demo', 'template']

    // this title will show up in the widget's title bar
    this.title = 'This is an Example Title'

    // if this widget uses netnet's dialogue system to say things to the user
    // via netnet's speech bubbles you should create a convo.js file in this
    // folder, and include the following line to load it:
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    // this is an optional function used to create the widget's inner HTML content
    this._createHTML(opts)
  }

  // most widgets are meant to be instantiated only once (automatically on load
  // as mentioned above), if that's the case remove this line (or keep it set to
  // false). However, if this widget class is meant to be used to instantiate
  // mulitple instances of itself (at some point after it's been loaded),
  // then this should return true (to avoid being auto-instantiated on load)
  static get skipAutoInstantiation () { return false }

  _createHTML (opts) {
    // if this widget is meant to be instantiated multiple times (and thus has
    // skipAutoInstantiation returning "true" and no this.key set) you can pass
    // an options object to it when instantiating, here's an example of how you
    // might use that.
    opts = opts || {}
    const message = opts.message || 'hello there!'

    // here we define the HTML content of our widget
    // the CSS classes are defined in the styles.css file
    // which should be saved in this same folder. the <button>
    // also makes use of styles in the /core/styles/buttons.css
    this.innerHTML = `
      <div class="example-widget">
        <p class="example-widget__message">${message}</p>
        <button class="pill-btn pill-btn--secondary">say hello</button>
      </div>
    `

    // alternatively, you can save an index.html file in this folder
    // and load it up using the utils.get() method
    // utils.get(`./widgets/${this.key}/index.html`, html => { this.innerHTML = html }, true)

    // we can use the $ method to query select elements in our widget
    this.$('button').addEventListener('click', () => this._startConvo())
  }

  // here's an example of a "private" method
  _startConvo () {
    // this is referencing a convo key from the convo.js file
    window.convo = new Convo(this.convos, 'start')
  }
}

window.ExampleWidget = ExampleWidget
