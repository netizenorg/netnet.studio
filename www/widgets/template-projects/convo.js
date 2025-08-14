/* global utils */
window.CONVOS['template-projects'] = (self) => {
  return [{
    id: 'start',
    content: 'This widget contains a collection of templates which serve as starting points for new web projects.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'buttons',
    content: 'Clicking on "Jump to Template" will display the full template, ready for remixing. If instead you click "Begin Guide", I\'ll type out the code for you line by line, explaining the purpose of each piece as we code.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'remix',
    content: `Here's the full <i>${self._getTemplateName()}</i> template! Feel free to remix it and make it your own. If you do, don't forget to save your progress using the shortcut key <code>${utils.hotKey()} + S</code>`,
    options: {
      ok: (e) => e.hide()
    }
  }]
}
