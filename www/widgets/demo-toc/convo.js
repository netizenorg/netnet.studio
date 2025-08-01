/* global  WIDGETS */
window.CONVOS['demo-toc'] = (self) => {
  return [
    {
      id: 'working-on-something',
      graph: { id: 1, x: 100, y: 225 },
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
      content: 'It looks like you\'re working on a project, I can open this demo in my editor but you\'ll loose any unsaved changes. Alternatively I could open this demo in a new tab and leave your project open on this one?',
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
      id: 'loaded-demo',
      graph: { id: 2, x: 675, y: 400 },
      before: () => WIDGETS['student-session'].clearProjectData(),
      content: 'Check out this example! Try editing and experimenting with the code. Double click any piece of code you don\'t understand and I\'ll do my best to explain it to you.',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: 'loaded-annotated-demo',
      graph: { id: 3, x: 825, y: 250 },
      content: 'I can walk you through this demo if you\'d like me to explain the different parts, just click on the green dots or the links in the Annotations widget.<br><br>Otherwise feel free to edit and experiment with the code yourself. You can also double click any piece of code you don\'t understand and I\'ll do my best to explain that bit to you.',
      options: {
        'great thanks!': (e) => e.hide(),
        'walk me through it': (e) => {
          self.close()
          if (self.code && self.info && self.info[0]) {
            self._explainerClick(self.info[0])
          }
        }
      }
    }
  ]
}
