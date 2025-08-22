/* global WIDGETS, NNE */
window.CONVOS['demo-sketches'] = (self) => {
  return [
    {
      id: 'intro',
      graph: { id: 5, x: 25, y: 25 },
      content: 'This widget contains a variety of creative code "demos" which showcase the generative, interactive, expressive and otherwise poetic possibilities of the Web. Click on the <span class="link" onclick="WIDGETS[\'demo-sketches\'].$(\'.demo-search input\').focus();window.convo.hide()">search field</span> to explore.',
      options: {
        'what\'s a demo?': (e) => e.goTo('demoscene'),
        'thanks!': (e) => e.hide()
      }
    },
    {
      id: 'demoscene',
      graph: { id: 6, x: 25, y: 150 },
      content: 'A "demo" is a code sketch that demonstrates a creative concept with the least amount of code possible. It\'s also a reference to the "<a href="https://en.wikipedia.org/wiki/Demoscene" target="_blank">demoscene</a>", an outsider art subculture where creators compete at events called "demo parties". These creators usually collaborate in "crews" to showcase their technical prowess, often times pushing computers (usually retro PCs) to their limits!',
      options: {
        'cool!': (e) => e.hide()
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
          NNE.code = ''
          NNE.update()
          self._openInNewTab()
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
          NNE.code = ''
          NNE.update()
          self._openInNewTab()
        },
        'ok thanks': (e) => e.hide()
      }
    }
  ]
}
