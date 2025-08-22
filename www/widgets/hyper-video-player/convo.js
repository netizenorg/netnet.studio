/* global NNE WIDGETS */
window.CONVOS['hyper-video-player'] = (self) => {
  const name = self.metadata ? self.metadata.author.name : ''
  const title = self.metadata ? self.metadata.title : ''

  const play = (e) => {
    if (e) e.hide()
    self.$('.hvp-pause-screen').style.display = 'none'
    self.$('.hvp-toggle > span').classList.remove('play')
    self.$('.hvp-toggle > span').classList.add('pause')
    self.video.play()
    const kf = self._mostRecentKeyframe()
    const b = kf ? self.keyframes[kf.timecode].editable : false
    self._editable(b)
  }

  return [{
    id: 'introducing-tutorial',
    content: `I've just loaded a tutorial by ${name} called "${title}", press the video players's <i>play</i> button to begin. Press the video player's <i>X</i> button at anytime to quit.`,
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'tutorial-pause-to-edit',
    content: 'Pause the video before you start editing and experimenting with the code.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'careful-will-loose-code',
    content: 'It looks like you edited some of the code in my editor, which is great! I\'m glad you\'re experimenting, but don\'t forget that during tutorials your edits will be lost once you continue playing. I can download the current sketch for you if you want to save a copy.',
    options: {
      'that\'s ok, let\'s continue': (e) => {
        if (self._tempCode !== NNE.code) self._updateCode(self._tempCode)
        play(e)
      },
      'yes, please download': (e) => {
        e.hide()
        WIDGETS['coding-menu'].downloadCode()
        if (self._tempCode !== NNE.code) self._updateCode(self._tempCode)
      }
    }
  }]
}
