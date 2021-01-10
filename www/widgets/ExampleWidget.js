/* global Widget */
// the comment above is just to let the standardJS linter know which global
// variables we're going to use if your widget is going to interat with other
// netnet global variables like NNE, NNW, etc. make sure to list them above
class ExampleWidget extends Widget {
  constructor (opts) {
    super(opts)

    // NOTE: you key name must match your Widget's class name,
    // for example MyWidget should have a key of 'my-widget'
    this.key = 'example-widget'
    // However, if this widget class is meant to be used to instantiate mulitple
    // instances of itself, then you should leave this null and set the
    // skipAutoInstantiation to true. The assumption then is that elsewhere in
    // the studio (say in a tutorial for example or via interacting with another
    // widget) the instances will be created, for example:
    // WIDGETS['example-1'] = new ExampleWidget()

    // if for whatever reason you don't want this showing up in the
    // SearchBar results you can set listed to false
    this.listed = false

    // If you want this widget to show up in the SearchBar results it helps
    // (but is not required) to create a keywords array of related words
    // (NOTE: for search result API purposes, this must be written on one line)
    this.keywords = ['example', 'demo', 'template']

    // here's some more example code...
    this.title = 'This is an Example Title'
    this._createHTML(opts)
  }

  // most widgets are meant to be instantiated only once (automatically on load
  // as mentioned above), if that's the case remove this line (or keep it set to
  // false). However, if this widget class is meant to be used to instantiate
  // mulitple instances of itself (at some point after it's been loaded),
  // then this should return true (to avoid being auto-instantiated on load)
  static get skipAutoInstantiation () { return false }

  _createHTML (opts) {
    opts = opts || {}
    const message = opts.message || 'options object does not include a message'
    this.innerHTML = `
      <style>
        .example-widget__title {
          cursor: pointer;
        }
        .example-widget__message {
          text-transform: uppercase;
        }
      </style>
      <div class="example-widget">
        <h1 class="example-widget__title">A Very Important Message </h1>
        <span class="example-widget__message">${message}</span>
      </div>
    `

    this.$('.example-widget__title')
      .addEventListener('click', () => this._ranColor())
  }

  _ranColor () {
    const ranColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`
    this.$('.example-widget__title').style.color = ranColor
  }
}

window.ExampleWidget = ExampleWidget
