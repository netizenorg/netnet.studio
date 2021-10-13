/* global utils */
window.CONVOS['tutorials-guide'] = (self) => {
  const name = self.metadata ? self.metadata.author.name : ''
  const title = self.metadata ? self.metadata.title : ''
  return [{
    id: 'introducing-tutorial',
    content: `I've just loaded a tutorial by ${name} called "${title}", press the video players's <i>play</i> button to begin. Press the video player's <i>X</i> button at anytime to quit.`,
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'before-loading-example',
    content: 'Opening this example will get rid of all the code currently in my editor, is that alright with you?',
    options: {
      sure: (e) => {
        utils.loadExample(self.lastClickedExample.key)
        e.hide()
      },
      'no, never mind': (e) => e.hide()
    }
  }]
}
