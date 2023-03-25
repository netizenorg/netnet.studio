/* global WIDGETS NNW */
window.CONVOS['git-stage'] = (self) => {
  const owner = WIDGETS['student-session'].getData('owner')
  const repo = WIDGETS['student-session'].getData('opened-project')
  const history = `https://github.com/${owner}/${repo}/network`

  return [{
    id: 'info',
    content: 'When "<b><i>versioning</i></b>" a project using git, we "<b><i>commit</i></b>" new changes first by adding the files we want to include in this commit to our "<b><i>stage</i></b>" and then committing those changes with a message describing what changed. Once you\'ve done that I\'ll "<b><i>push</i></b>" these committed changes up to your GitHub repo.',
    options: {
      'got it': (e) => e.hide(),
      'versioning?': (e) => e.goTo('versioning'),
      'stage?': (e) => e.goTo('stage'),
      'commit?': (e) => e.goTo('commit'),
      'push?': (e) => e.goTo('push')
    }
  }, {
    id: 'versioning',
    content: `Typically "saving" your progress means you're overwriting your previous files with new changes. But when we "version" a project using <b>git</b> we don't replace the previous files, we simply create a new "version", a "save point" in the <a href="${history}" target="_blank">history</a> of your projects development which you can return to in the future.`,
    options: {
      'I see': (e) => e.hide(),
      'stage?': (e) => e.goTo('stage'),
      'commit?': (e) => e.goTo('commit'),
      'push?': (e) => e.goTo('push')
    }
  }, {
    id: 'stage',
    content: 'You might not want to save every file you\'ve changed, maybe you want to disregard these changes or maybe you\'re still working on it and/or want to include those changes in a later commit under a different message. For this reason <b>git</b> first requires that you add the files you want to commit to the "stage" and later annotate this specific group of changes with a message.',
    options: {
      'I see': (e) => e.hide(),
      'versioning?': (e) => e.goTo('versioning'),
      'commit?': (e) => e.goTo('commit'),
      'push?': (e) => e.goTo('push')
    }
  }, {
    id: 'commit',
    content: `Instead of overwriting your previous files, <b>git</b> keeps track of all previous "versions" in your project's <a href="${history}" target="_blank">history</a>. Each time you commit the changed files on your stage <b>git</b> creates a new "version", a "save point" in the history of your projects development which you can return to in the future. We annotate each commit with a message describing what changed since the last time you made a commit.`,
    options: {
      'I see': (e) => e.hide(),
      'versioning?': (e) => e.goTo('versioning'),
      'stage?': (e) => e.goTo('stage'),
      'push?': (e) => e.goTo('push')
    }
  }, {
    id: 'push',
    content: `After you commit your changes I'll back-up your progress by "pushing" them to your GitHub repo. This means I'm not only uploading your new code but also the message you annotate these changes with so that GitHub knows that this update should be registered as a new  "commit" in your project's <a href="${history}" target="_blank">history</a>`,
    options: {
      'I see': (e) => e.hide(),
      'versioning?': (e) => e.goTo('versioning'),
      'stage?': (e) => e.goTo('stage'),
      'commit?': (e) => e.goTo('commit')
    }
  },
  // ------------------------- add to stage ------------------------------------
  {
    id: 'first-original-commit',
    content: 'The last time you saved this project was when you first created it, from now on everytime I "<b>push</b>" updates to your GitHub you\'ll first need to leave a short "<b>commit</b>" message (one sentence) explainig what changed: <input placeholder="what\'s new?">',
    options: {
      ok: (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('too-long')
        else self.pushChanges(v)
      },
      'why?': (e) => e.goTo('explain-versions')
    },
    after: () => document.querySelector('text-bubble input').focus()
  }, {
    id: 'new-commit',
    content: `The last time you saved your progress you said, "<i>${window.sessionStorage.getItem('last-commit-msg')}</i>", what has changed since then? <input placeholder="what's new?">`,
    options: {
      'ok, commit and push this update': (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('again-too-long')
        else self.pushChanges(v)
      },
      'never mind': (e) => e.hide()
    },
    after: () => document.querySelector('text-bubble input').focus()
  }, {
    id: 'explain-versions',
    content: `Instead of overwriting your previous files, <b>git</b> keeps track of all previous "versions" in your project's <a href="${history}" target="_blank">history</a> sort of like "save points" in a video game, and so it needs some message to associate with each point as your project evolves`,
    options: { 'I see.': (e) => e.goTo('save-version') }
  }, {
    id: 'save-version',
    content: 'So, what\'s changed since you first created this project? <input placeholder="what\'s new?">',
    options: {
      ok: (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('again-too-long')
        else self.pushChanges(v)
      },
      'never mind': (e) => e.hide()
    },
    after: () => document.querySelector('text-bubble input').focus()
  }, {
    id: 'too-long',
    content: 'That message is too long, I need you to keep it below 72 characters <input placeholder="what\'s new?">',
    options: {
      'ok, try now': (c, t) => {
        const v = t.$('input').value
        if (v.length < 1 || v.length > 72) c.goTo('too-long')
        else self.pushChanges(v)
      },
      'never mind': (e) => e.hide()
    },
    after: () => document.querySelector('text-bubble input').focus()
  }, {
    id: 'pushing-updates',
    before: () => NNW.menu.switchFace('processing'),
    content: '...sending data to GitHub...',
    options: {}
  }, {
    id: 'project-saved',
    content: 'Your changes have been saved and pushed to your GitHub repo!',
    options: {
      'great, thanks!': (e) => e.hide(),
      'can I share it?': (e) => e.goTo('share-project')
    }
  }]
}
