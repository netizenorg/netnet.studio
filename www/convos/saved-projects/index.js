window.convos['saved-projects'] = (self) => {
  return {
    'open-project': [
      {
        content: 'At the moment I can only open static net art projects, and that project doesn\'t have an "index.html" in it\'s root directory.',
        options: {
          ok: (e) => e.hide(),
          'what\'s a "root directory"?': (e) => e.goTo('root')
        }
      },
      {
        id: 'root',
        content: 'When talking about file structures a directory just means a "folder" and root means directly inside that folder (as opposed to inside a sub-folder).',
        options: { 'good to know': (e) => e.hide() }
      }
    ],
    'save-help': [{
      content: 'I can save your projects to GitHub for you, but I need to know your GitHub account.',
      options: {
        ok: (e) => window.WIDGETS['functions-menu'].saveProject(),
        'never mind': (e) => e.hide(),
        'what\'s GitHub?': (e) => e.goTo('github')
      }
    }, {
      id: 'github',
      content: '<a href="https://github.com/" target="_blank">GitHub</a> is a platform where coders share their open source projects and collaborate with each other. Your GitHub account is sort of like your code "portfolio".',
      options: {
        ok: (e) => window.WIDGETS['functions-menu'].saveProject(),
        'oh, never mind then': (e) => e.hide()
      }
    }]
  }
}
