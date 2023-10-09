/* global utils, NNW */
window.CONVOS['code-examples'] = (self) => {
  return [{
    id: 'example-info',
    content: 'You can edit this example in the <b style="font-weight:bold;text-decoration:underline;">code</b> tab, switch to the <b style="font-weight:bold;text-decoration:underline;">result</b> tab to see your changes. Click <b style="font-weight:bold;text-decoration:underline;">explain</b> if you\'d like me to copy the example into my editor and walk you through it.',
    options: {
      cool: (e) => e.hide()
    }
  }, {
    id: 'before-loading-example',
    content: 'Would you like me to get rid of the code currently in my editor and load up this example here, or would you prefer I open it up in a new tab?',
    options: {
      'load it here': (e) => {
        utils.updateURL(`?ex=${self.exData.key}`)
        self.loadExample(self.exData.key)
      },
      'load it in a new tab': (e) => {
        const l = window.location
        const url = `${l.protocol}//${l.host}/?ex=${self.exData.key}`
        window.open(url, '_blank')
      },
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'loaded-example',
    content: 'Check out this example! Try editing and experimenting with the code. Double click any piece of code you don\'t understand and I\'ll do my best to explain it to you.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'loaded-explainer',
    content: 'I can walk you through this example if you\'d like me to explain the different parts, just click on the green dots or the links in the widget. Otherwise feel free to edit and experiment with the code yourself. You can also double click any piece of code you don\'t understand and I\'ll do my best to explain that bit to you.',
    options: {
      'great thanks!': (e) => e.hide(),
      'walk me through it': (e) => {
        self.startExplination()
      }
    }
  }]
}
