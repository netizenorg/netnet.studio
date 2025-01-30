/* global NNE, NNW */
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
  }, {
    id: 'save-info',
    content: 'Clicking the <b>generate link</b> button will create a URL you can use to share the annotated demo you made. Alternatively, if you\'d like to contribute this demo as an official code example in our "Learning Guide" you can click <b>download json</b>. To make changes to an existing demo you\'ve saved to a file click on <b>upload json</b> to load it here.',
    options: {
      'got it!': (e) => e.hide(),
      'how do I contribute?': (e) => e.goTo('contribute')
    }
  }, {
    id: 'contribute',
    content: 'Visit our <a href="https://github.com/netizenorg/netnet.studio" target="_blank">GitHub</a> to fork our repository. Then checkout our docs for more info on how to contribute.',
    options: {
      'got it!': (e) => e.hide()
    }
  }, {
    id: 'layout-info',
    content: `I can be set to different layouts, currently i'm in the "${NNW.layout}" layout. If you'd like this example to be laid out differently you can specify that here.`,
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'toc-info',
    content: 'By checking this box you can optionally choose to display a "table of contents" alongside your demo, which will display a list of links for each of the steps in your example.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'name-info',
    content: 'This isn\'t necessary if you\'re sharing your demo using the generated link, but if you want to download a json file you\'ll need to decide what to name it first. Keep the name lower case and avoid spaces.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'tags-info',
    content: 'If you plan to contribute your demo as an official example in our "Learning Guide" it\'s a good idea to add a comma separated list of tags so that others can easily find it when using the search bar.',
    options: {
      'got it!': (e) => e.hide(),
      'how do I contribute?': (e) => e.goTo('contribute')
    }
  }]
}
