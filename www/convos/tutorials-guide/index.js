/* global */
window.CONVOS['tutorials-guide'] = (self) => {
  const name = self.metadata ? self.metadata.author.name : ''
  const title = self.metadata ? self.metadata.title : ''
  return [{
    id: 'guide-open',
    content: 'Here you\'ll find an evolving list of interactive tutorials, examples and references. These are a work in progress and are constantly changing. We hope to someday be beyond beta, but for the time being, best be prepared for bugs.',
    options: {
      'got it': (e) => e.hide(),
      'who\'s working on this?': (e) => {
        self.slide.updateSlide(self.aboutOpts)
        e.hide()
      }
    }
  }, {
    id: 'introducing-tutorial',
    content: `I've just loaded a tutorial by ${name} called "${title}", press the video players's <i>play</i> button to begin. Press the video player's <i>X</i> button at anytime to quit.`,
    options: {
      ok: (e) => e.hide()
    }
  }]
}
