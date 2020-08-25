window.convos['upload-assets'] = (self) => {
  return {
    'confirm-delete': [{
      content: `Are you sure you want to delete <code>${self._delete}</code> from your project?`,
      options: {
        yes: (e) => {
          self._postDeletion()
          e.hide()
        },
        'no, never mind': (e) => e.hide()
      }
    }],
    'duplicate-file': {
      content: `You've already have a file called <code>${self._upload}</code> uploaded to your project. Click the ✖ next to it's name to delete it before uploading a new version of it.`,
      options: { ok: (e) => e.hide() }
    },
    'upload-help': [{
      content: 'In order for me to keep track of any assets you want to use in your project (like images and 3D files) I need to know which one of your GitHub projects to upload them to.',
      options: {
        ok: (e) => e.goTo('save'),
        'never mind': (e) => e.hide(),
        'what\'s GitHub?': (e) => e.goTo('github')
      }
    }, {
      id: 'github',
      content: '<a href="https://github.com/" target="_blank">GitHub</a> is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio".',
      options: {
        ok: (e) => e.goTo('save'),
        'oh, never mind then': (e) => e.hide()
      }
    }, {
      id: 'save',
      content: 'Do you want to save what your working on as a new project? Or do you want to discard this and open up an old project?',
      options: {
        'Let\'s save this': () => {
          window.WIDGETS['functions-menu'].saveProject()
        },
        'Let\'s open an old one': () => {
          window.WIDGETS['functions-menu'].openProject()
        }
      }
    }]
  }
}
