/* global NNW */
window.CONVOS['demo-maker'] = (self) => {
  return [{
    id: 'save-info',
    content: 'Clicking the <b>shareable link</b> button will create a URL you can use to share the annotated demo you made. Alternatively, if you\'d like to contribute this demo to our "<span class="link" onclick="WIDGETS.open(\'demo-sketches\')">Code Demos</span>" widget or simply download it for future editing click <b>download</b>.',
    options: {
      'got it!': (e) => e.hide(),
      'how do I contribute?': (e) => e.goTo('contribute')
    }
  }, {
    id: 'edit-info',
    content: 'Click on <b>new</b> to start working on a new annotated sketch, aka a "demo". To work on an existing demo from our <span class="link" onclick="WIDGETS.open(\'demo-sketches\')">Code Demos</span>" widget click <b>edit</b>, or to make changes to a demo you had previously downloaded to your computer click on <b>upload</b>.',
    options: {
      'got it!': (e) => e.hide()
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
    id: 'demo-info',
    content: 'This isn\'t necessary if you\'re sharing your demo using the generated link, but if you want to download a json file you\'ll need to decide what to name it first. Keep the name lower case and avoid spaces. If you want to contribute your demo file to our "<span class="link" onclick="WIDGETS.open(\'demo-sketches\')">Code Demos</span>" widget consider also adding "tags", these will make it easier to find in my search bar',
    options: {
      ok: (e) => e.hide(),
      'how do I contribute?': (e) => e.goTo('contribute')
    }
  }, {
    id: 'note-info',
    content: 'This is where we create the "notes" for our annotated demo. Each note should have a name and some content. Additionally you can choose to spotlight specific lines of code by choosing which lines to "focus" on.',
    options: {
      'got it!': (e) => e.hide(),
      'what do you mean focus?': (e) => e.goTo('focus-info')
    }
  }, {
    id: 'focus-info',
    content: 'You can specify ceratin lines of code to focus on when I share this note (all others will fade away momentarily). To do this list the line numbers of the code you want to spotlight in the focus field. These should be a comma separted list of line numbers, like <code>2, 4, 8</code> or ranges like <code>2-16, 32-64</code>. If no line numbers are specified in the focus input field, then all lines will be in focus.',
    options: {
      'got it!': (e) => e.hide()
    }
  }]
}
