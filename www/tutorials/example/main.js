window.TUTORIAL = {
  steps: [
    {
      content: 'HTML isn\'t the only type of markup language.',
      options: {
        'oh no? what others are there?': (e) => { e.next() }
      }
    },
    {
      content: 'There\'s <a href="https://developer.mozilla.org/en-US/docs/Web/MathML" target="_blank">MathML</a> and <a href="https://developer.mozilla.org/en-US/docs/Web/SVG" target="_blank">SVG</a>.',
      options: {
        'you don\'t say! Are there more?': (e) => { e.next() },
        'wait a sec, go back.': (e) => { e.prev() }
      }
    },
    {
      content: 'Oh yes! Artists like the Graffiti Research Lab have even made their own.',
      options: {
        'really? What\'s it called?': (e) => { e.next() },
        'wait a sec, go back.': (e) => { e.prev() }
      }
    },
    {
      content: 'It\'s called GML or <a href="https://en.wikipedia.org/wiki/Graffiti_Markup_Language" target="_blank">Graffiti Markup Language</a>.',
      options: {
        'wait a sec, go back.': (e) => { e.prev() },
        'cool thnx for the info!': () => {
          STORE.dispatch('TUTORIAL_FINISHED')
        }
      }
    }
  ]
}
