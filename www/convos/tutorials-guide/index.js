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
  }, {
    id: '<examples>',
    content: 'This widget contains a collection of interactive code demos you can explore and experiment with. In some cases I can walk you through the example and explain how it works.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: '<docs>',
    content: 'These widgets contain foundational info on the core web coding languages as well as appendices containing lists of all the core components for reference. These also include links to further documentation online.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: '<tutorials>',
    content: 'These are a collection of interactive hypermedia tutorials which will introduce you to both the craft and the culture of HTML and CSS. You can click the (i) to read more about each individual tutorial, or click (play) to launch right into it.',
    options: {
      ok: (e) => e.hide()
    }
  }]
}
