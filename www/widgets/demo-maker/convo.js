/* global NNW, NNE */
window.CONVOS['demo-maker'] = (self) => {
  return [{
    id: 'clear-code?',
    before: () => NNW.menu.switchFace('default'),
    content: 'It appears you\'ve got some code in the editor, do you want to keep it or should we clear it to start this new demo from scratch?',
    options: {
      'keep the code': (e) => {
        self._resumeNewDemo()
        e.hide()
      },
      'start from scratch': (e) => {
        NNE.code = ''
        self._resumeNewDemo()
        e.hide()
      }
    }
  }, {
    id: 'save-info',
    content: 'Clicking the <b>shareable link</b> button will create a URL you can use to share the annotated demo you made. Alternatively, if you\'d like to contribute this demo to our <span class="link" onclick="WIDGETS.open(\'demo-sketches\')">Code Demos</span> widget or simply download it for future editing click <b>download</b>.',
    options: {
      'got it!': (e) => e.hide(),
      'how do I contribute?': (e) => e.goTo('contribute')
    }
  }, {
    id: 'edit-info',
    content: 'Click on <b>new</b> to start working on a new annotated sketch, aka a "demo". To work on an existing demo from our <span class="link" onclick="WIDGETS.open(\'demo-sketches\')">Code Demos</span> widget click <b>edit</b>, or to make changes to a demo you had previously downloaded to your computer click on <b>upload</b>.',
    options: {
      'got it!': (e) => e.hide()
    }
  }, {
    id: 'contribute',
    content: 'Checkout the <a href="https://netnet.studio/docs/contributors/code-demos.html" target="_blank">Creating a Demo</a> section of the <a href="https://netnet.studio/docs/contributors/index.html" target="_blank">Contributors Docs</a> where you\'ll find detailed instructions.',
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
    id: 'demo-info',
    content: 'This isn\'t necessary if you\'re sharing your demo using the generated link, but if you want to download a json file you\'ll need to decide what to name it first. Keep the name lower case and avoid spaces. If you want to contribute your demo file to our <span class="link" onclick="WIDGETS.open(\'demo-sketches\')">Code Demos</span> widget consider also adding "tags", these will make it easier to find in my search bar',
    options: {
      ok: (e) => e.hide(),
      'how do I contribute?': (e) => e.goTo('contribute')
    }
  }, {
    id: 'note-info',
    content: 'This is where we create the "notes" (what I display in my speech bubble) for our annotated demo. Each note should have a title and some content. You can additionally "spotlight" specific code if you want to focus on it when this note appears.',
    options: {
      'got it!': (e) => e.hide(),
      'spotlight?': (e) => e.goTo('focus-info')
    }
  }, {
    id: 'focus-info',
    content: 'You can specify certain lines of code to focus on when I display this note (all others will fade away momentarily). To do this, select/highlight the lines (or even just part of a line) you want to spotlight in the main editor, then click <b>+ add selection</b>. You can add multiple selections to build up the spotlight, or click <b>clear</b> to remove them all and spotlight the whole note again.',
    options: {
      'got it!': (e) => e.hide()
    }
  }]
}
