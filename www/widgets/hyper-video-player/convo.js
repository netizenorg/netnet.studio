/* global NNE WIDGETS */
window.CONVOS['hyper-video-player'] = (self) => {
  const name = self.data?.metadata ? self.data.metadata.author : ''
  const title = self.data?.metadata ? self.data.metadata.title : ''

  const play = (e) => {
    if (e) e.hide()
    self.$('.hvp-pause-screen').style.display = 'none'
    self.$('.hvp-toggle > span').classList.remove('play')
    self.$('.hvp-toggle > span').classList.add('pause')
    self.video.play()
    if (!self.making) NNE.readOnly = true
  }

  return [{
    id: 'clear-code',
    graph: { id: 6, x: 25, y: 150 },
    content: 'It appears you\'ve got some code in the editor, I\'ll have to remove that code before I can load this tutorial, is that ok?',
    options: {
      'yes, that\'s ok': (e) => {
        self._loadTutorial()
      },
      'no, never mind': (e) => e.hide()
    }
  }, {
    id: 'working-on-project',
    content: 'It looks like you\'re working on a project. I\'ll need to close the project you\'re working on before I can load this tutorial.',
    options: {
      'oh, never mind then': (e) => e.hide(),
      'ok, close it and load the tutorial': (e) => {
        WIDGETS['project-files'].closeProject()
        self._loadTutorial()
      }
    }
  },
  {
    id: 'working-on-unsaved-project',
    content: 'It looks like you\'re working on a project with unsaved changes. I\'ll need to close the project you\'re working on before opening this tutorial. I\'d recommend that you "git push" the changes you made first by clicking the <i>git</i> icon at the top-right of the <span class="link" onclick="WIDGETS.open(\'project-files\')">Project Files</span> widget',
    options: {
      'let\'s save it first': (e) => WIDGETS['project-files']._launchGit(),
      'I know, load the tutorial anyway': (e) => {
        WIDGETS['project-files'].closeProject()
        self._loadTutorial()
      }
    }
  }, {
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
  }, {
    id: 'interrupt',
    content: 'You\'re currently in the middle of an interactive tutorial. Would you like to continue or do you want to quit the tutorial?',
    options: {
      'let\'s continue': (e) => {
        self.play()
        e.hide()
      },
      'let\'s quit': (e) => {
        self.close()
        e.hide()
      }
    }
  }]
}
