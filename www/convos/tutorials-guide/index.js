/* global  */
window.CONVOS['tutorials-guide'] = (self) => {
  const name = self.metadata ? self.metadata.author.name : ''
  const title = self.metadata ? self.metadata.title : ''
  return [{
    id: 'introducing-tutorial',
    content: `I've just loaded a tutorial by ${name} called "${title}", press the video players's <i>play</i> button to begin. Press the video player's <i>X</i> button at anytime to quit.`,
    options: {
      ok: (e) => e.hide()
    }
  }]
}
