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
    ]
  }
}
