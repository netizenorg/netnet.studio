/* global Widget */
class TutorialsGuide extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'tutorials-guide'
    this.keywords = [
      'tutorials', 'guide', 'lesson', 'how to', 'how', 'to', 'learn', 'reference'
    ]

    this.convoStack = []

    this.title = 'Learning Guide'
    this._createHTML()
  }

  _createHTML () {
    this.innerHTML = `
      <style>
        .tutorials-guide__message {
          text-transform: uppercase;
        }
      </style>
      <div class="tutorials-guide">
        <h1 class="tutorials-guide__title">it's time to learn baby!</h1>
        <span class="tutorials-guide__message">(TBD still being refactored TBD)</span>
      </div>
    `
  }
}

window.TutorialsGuide = TutorialsGuide
