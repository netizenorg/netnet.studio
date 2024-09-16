/* global NNE */
window.CONVOS['demo-example-maker'] = (self) => {
    return [{
      id: 'before-loading-json',
      content: 'Looks like you want to upload a new example. Are you sure you want to overwrite your current session?',
      options: {
        'yes!': (e) => {
          self._uploadJSON(self.loaded)
          e.hide()
        },
        'load it in a new tab': (e) => {
          const l = window.location
          const str = JSON.stringify(self.loaded)
          const url = `${l.protocol}//${l.host}/?dem=true#example/${NNE._encode(str)}`
          window.open(url, '_blank')
        },
        'oops, no thank you': (e) => e.hide()
      }
    }]
  }