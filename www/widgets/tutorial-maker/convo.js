window.CONVOS['tutorial-maker'] = (self) => {
  return [{
    id: 'opened',
    content: 'You just opened the <span>Tutorial Maker</span>! Here you can make interactive tutorials using all sorts of useful tools.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'nav-infos',
    content: 'Some explination about the nav buttons and how it works',
    options: {
      ok: (e) => e.hide()
    }
  }]
}
