/* global WIDGETS, NNW, nn, utils */
window.CONVOS['git-push'] = (self) => {
  const updateCommitMessage = (e, t) => {
    const v = t.$('input').value
    if (v.length < 1) e.goTo('message-too-short')
    else if (v.length > 72) e.goTo('message-too-long')
    else {
      self._commitMessage = v
      self.$('button[name="run"]').innerHTML = 'run'
      self.$('.git-push-widget__cli').innerHTML = `git commit -m "${v}"`
      e.goTo('git-commit2')
      utils.afterLayoutTransition(() => self.$('button[name="run"]').focus())
    }
  }

  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', reightEye: 'ŏ', lookAtCursor: false
    })
  }

  const f12 = nn.platformInfo().platform.includes('Mac') ? 'Fn + F12' : 'F12'
  const safari = nn.platformInfo().name === 'Safari'

  // return the actual array of conversation objects
  return [{
    id: 'start-not-ready',
    content: 'You\'ll need to create a new "project" before using this widget.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'start-not-ready2',
    content: 'Nothing has changed since your last "commit", which means we have nothing to "push" (aka back up) to GitHub. Try making and saving a change to your code first.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'start-ready',
    content: 'Let\'s version our changes by creating a new "commit"! Click the <code>run</code> button in the Terminal of the Version Control widget to get started.',
    options: {
      'the terminal?': (e) => e.goTo('explain-terminal'),
      'version? commit? what\'s that?': (e) => e.goTo('explain-version-control')
    }
  }, {
    id: 'explain-terminal',
    content: 'A terminal is a text-only CLI (command line interface) where you tell your computer what to do by entering commands instead of clicking buttons or other visual elements in a GUI (graphical user interface). It\'s very common for developers to run programs, navigate folders, and manage files from the command line. While it\'s possible to use graphical programs for version control, the terminal remains one of the most universal ways to use git. But don\'t worry, I won\'t throw you into the CLI on your own, I\'ll walk you through it.',
    options: {
      'I see': (e) => e.hide(),
      'ok, and what\'s version control?': (e) => e.goTo('explain-version-control')
    }
  }, {
    id: 'explain-version-control',
    content: 'When working on a project, "saving" changes simply stores your edits temporarily in your browser. Creating a "commit", on the other hand, snapshots those changes into your git history. This lets you track, share, collaborate and even revert those changes later, sort of like a "save point" in a video game. Keeping a history of commits using git is one example of "version control", the practice of tracking how a project\'s code changes rather than simply saving over what was there before.',
    options: {
      'I see': (e) => e.hide(),
      'ok, and what\'s a terminal?': (e) => e.goTo('explain-terminal')
    }
  }, {
    id: 'pre-stage',
    content: 'In order to create a new "commit" and save any changes you make permanently you\'ll need to "push" them GitHub, which is what this widget is for. However, nothing has changed since your last "commit", which means we have nothing to push. Try making and saving a change to your code first.',
    options: { 'I see': (e) => e.hide() }
  }, {
    id: 'git-stage',
    content: 'Here is a list of all the changes since your last commit. The colors indicate what kind of change was made, whether that\'s an <span style="color:var(--netizen-number)">update</span> to an existing file, the <span style="color:var(--netizen-attribute)">creation</span> of a new file or the <span style="color:red">removal</span> of another. Select the changes you would like to "commit" and "push" to GitHub, then click the <code>run</code> button again to add the changes you want to your stage.',
    options: { 'got it': (e) => e.hide() }
  }, {
    id: 'empty-stage',
    content: 'You need to add at least one of your changes to the stage, otherwise you have nothing to commit',
    options: { 'I see': (e) => e.hide() }
  }, {
    id: 'git-commit',
    content: `${self.include.length === WIDGETS['project-files'].changes.length ? 'All the changes' : 'The specific files you selected'} have been added to your "stage" and now await your commit. Write a short message describing the changes included in this commit. Then click <code>run</code> to commit it.<br><input style="width:350px" placeholder="what has changed since last commit?">`,
    options: {
      'ok, ready to commit': (e, t) => updateCommitMessage(e, t),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'message-too-short',
    content: 'You forgot to inclue a message. Before I can "push" your changes to GitHub you\'ll need to leave a short message (one sentence) explainig what changed <input style="width:350px" placeholder="what has changed since last commit?">',
    options: {
      'ok, try now': (e, t) => updateCommitMessage(e, t)
    }
  }, {
    id: 'message-too-long',
    content: 'That\'s is too long for a commit message, I need you to keep it below 72 characters <input style="width:350px" placeholder="what has changed since last commit?">',
    options: {
      'ok, try now': (e, t) => updateCommitMessage(e, t),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'git-commit2',
    content: 'Perfect, you should now see your message in the terminal, click <code>run</code> again to create your commit.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'git-push',
    content: 'Great! We\'ve created a new commit, but it only exists temporarily here in your browser. To make this permanent we\'ll need to click the <code>run</code> button to "push" these changes over to the repository (or "repo" for short) in your GitHub account.',
    options: { 'got it': (e) => e.hide() }
  }, {
    id: 'git-updated',
    content: 'Your GitHub repo has been updated! You can download a copy of your updated project locally if you\'d like, but remember this will only reflect the current commit. If you\'d like to work on your project locally in your own code editor, it would be best to "clone" your repo, this way you not only download the latest code, but the entire history of changes as well.',
    options: {
      'got it': (e) => e.hide(),
      'clone to my own editor?': (e) => e.hide() // TODO
    }
  }, {
    id: 'oh-no-error',
    after: () => errorFace(),
    content: 'Oh dang! seems there was a server error... sorry about that...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => e.hide(),
      'what was the error?': (e) => e.goTo('explain-error')
    }
  }, {
    id: 'explain-error',
    content: `The details are beyond my awareness, but if you're feeling curious you can investigate the issue yourself by pressing <code>${f12}</code> to open your browser developer tools ${safari ? '(You\'re using Safari, so you may need to enable you developer tools first)' : ''} and you could <a href="https://github.com/netizenorg/netnet.studio/issues/new" target="_blank">open an issue</a> on the netizen.org GitHub to let us know what you found!`,
    options: { ok: (e) => e.hide() }
  }]
}
