/* global WIDGETS, NNE */
window.CONVOS['demo-toc'] = (self) => {
  return [
    {
      id: 'working-on-something',
      graph: { id: 1, x: 350, y: 100 },
      content: 'Would you like me to get rid of the code currently in my editor and open this demo here, or would you prefer I open it up in a new tab?',
      options: {
        'open it here': (e) => {
          self._displayDemo()
        },
        'open it in a new tab': (e) => {
          const proto = window.location.protocol
          const host = window.location.host
          const url = `${proto}//${host}?demo=${self.demoKey}`
          window.open(url, '_blank', 'noopener,noreferrer')
        },
        'oh, never mind': (e) => e.hide()
      }
    },
    {
      id: 'working-on-project',
      graph: { id: 4, x: 100, y: 100 },
      content: 'It looks like you\'re working on a project. I\'ll need to close the project you\'re working on before I open any demos.',
      options: {
        'oh, never mind then': (e) => e.hide(),
        'ok, close it and open the demo': (e) => {
          WIDGETS['project-files'].closeProject()
          self._displayDemo()
        }
      }
    },
    {
      id: 'working-on-unsaved-project',
      graph: { id: 5, x: 225, y: 100 },
      content: 'It looks like you\'re working on a project with unsaved changes. I\'ll need to close the project you\'re working on before opening this demo. I\'d recommend that you "git push" the changes you made before opening this demo.',
      options: {
        'let\'s save it first': (e) => WIDGETS.open('git-push'),
        'I know, open the demo anyway': (e) => {
          WIDGETS['project-files'].closeProject()
          self._displayDemo()
        },
        'ok thanks': (e) => e.hide()
      }
    },
    {
      id: 'loaded-demo',
      graph: { id: 2, x: 100, y: 250 },
      before: () => {
        if (WIDGETS['project-files']) WIDGETS['project-files'].closeProject()
      },
      content: 'Check out this demo! Try editing and experimenting with the code. Double click any piece of code you don\'t understand and I\'ll do my best to explain it to you.',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: 'loaded-annotated-demo',
      graph: { id: 3, x: 225, y: 250 },
      content: 'I can walk you through this demo if you\'d like me to explain the different parts, just click on the green dots or use the <b>Sketch Demo Guide</b> widget.<br><br>Otherwise feel free to edit and experiment with the code yourself. You can also double click any piece of code you don\'t understand and I\'ll do my best to explain that bit to you.',
      options: {
        'great thanks!': (e) => e.hide(),
        'walk me through it': (e) => {
          self.close()
          if (self.code && self.info && self.info[0]) {
            self._explainerClick(self.info[0])
          }
        },
        'I want to quit this guide': (e) => {
          self.cancel()
          e.goTo('quit-demo')
        }
      }
    }, {
      id: 'quit-demo',
      graph: { id: 3, x: 225, y: 250 },
      content: 'Sure thing! Would you like me to leave the code so you can experiment with it, or should we start from scratch with a blank canvas?',
      options: {
        'start from scratch': (e) => {
          NNE.code = ''
          e.hide()
        },
        'keep the code': (e) => e.hide()
      }
    }
  ]
}
