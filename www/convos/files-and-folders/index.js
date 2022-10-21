/* global NNW */
window.CONVOS['files-and-folders'] = (self) => {
  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', reightEye: 'ŏ', lookAtCursor: false
    })
  }
  const gh = (() => {
    const u = window.localStorage.getItem('username')
    const o = window.localStorage.getItem('owner')
    const p = window.sessionStorage.getItem('opened-project')
    return { u, o, p, url: `https://github.com/${o}/${p}` }
  })()

  let tempName = null

  const validateFName = (c, t, f, rename) => {
    const v = tempName = t.$('input').value
    if (v.length < 1 || v.length > 72) c.goTo(f + '-name-too-long')
    else if (v.includes(' ')) c.goTo(f + '-name-has-spaces')
    else if (v.match(/[A-Z]/) instanceof Array) c.goTo(f + '-name-has-uppercase')
    else if (f === 'folder' && v.includes('.')) {
      if (v.indexOf('.') === 0) c.goTo('folder-hidden')
      else if (v.indexOf('.') > 0) c.goTo('folder-dot')
    } else if (f === 'file' && v.indexOf('.') < 0) {
      if (rename) c.goTo('file-rename-missing-ext')
      else c.goTo('file-new-missing-ext')
    } else if (f === 'file' && v.indexOf('.') === 0) {
      if (rename) c.goTo('file-rename-hidden')
      else c.goTo('file-new-hidden')
    } else {
      if (rename) self._postRenameFile(v)
      else if (f === 'folder') self._postNewFolder(v)
      else if (f === 'file') self._postNewFile(v)
    }
  }

  const namingConvos = (c, f) => {
    const convos = {
      'new-f': `what would you like your new ${f} to be called? <input placeholder="folder-name?">`,
      'f-name-too-long': `That ${f} name is too long, I need you to keep it below 72 characters, try another name <input placeholder="${f}-name?">`,
      'f-name-has-spaces': `It's bad practice to include spaces in your ${f} name because on the Web <a href="https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20" target="_blank">a space isn't always a space</a>. Try removing the spaces or replace them with a <code>-</code> (dash) or <code>_</code> (underscore) <input placeholder="${f}-name?">`,
      'f-name-has-uppercase': `It's bad practice to include uppercase characters in your ${f} name because we often write paths which include our ${f} names in our code, and because file paths are "<a href="https://www.merriam-webster.com/dictionary/case-sensitive" target="_blank">case sensative</a>" keeping names lowercase helps minimize errors <input placeholder="${f}-name?">`,
      'f-rename': `What would you like to rename this ${f} to? <input placeholder="${f}-name?">`,
      'f-ext': `Your ${f} name is missing its extention, what type of file is this? If it's an HTML file you should add <code>.html</code> to the end of its name, if it's a CSS file add <code>.css</code> or <code>.js</code> for JavaScript, or <code>.md</code> for Markdown, etc. <input placeholder="${f}-name?">`,
      'f-name-is-hidden': `You've got a <code>.</code> at the start of your ${f} name, in most systems this will be interpreted as a "hidden" ${f}, was that intentional?`,
      'fldr-has-dot': `You've got a <code>.</code> in your folder name, this is common when adding extensions to your file names (like <code>.html</code> or <code>.css</code>) but not when creating folder names. If you were trying to create a "hidden" folder, then you should place the <code>.</code> at the start of the folder's name  <input placeholder="${f}-name?">`
    }
    return convos[c]
  }
  // ...
  return [{
    id: 'opened',
    content: `In the <b>Files And Folders</b> widget are the files which currently make up your project. Click on one to open it in my editor, you can also create or upload new files. I'm here to help you learn and create, but I don't store this data on my server, instead these files are being hosted on your personal <a href="${gh.url}" target="_blank">GitHub repo</a>`,
    options: {
      cool: (e) => e.hide(),
      'new files?': (e) => e.goTo('explain')
    }
  }, {
    id: 'explain',
    content: 'The <b>Files And Folders</b> widget let\'s you create new files as well as upload assets like images or other files for you to use in your project. Right-mouse click a file in the <b>Files And Folders</b> widget to open the "context menu". After creating or uploading a new file you can reference it in your code.',
    options: {
      cool: (e) => e.hide(),
      'how?': (e) => e.goTo('explain2')
    }
  }, {
    id: 'explain2',
    content: 'Say you uploaded an image called <code>cat.jpg</code> for example, in your HTML code you could write something like <code>&lt;img src="cat.jpg"&gt;</code>',
    options: {
      ok: (e) => e.hide()
    }
  }, { // ---------------------------------------------------- folder stuff ----
    id: 'new-folder',
    content: namingConvos('new-f', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-too-long',
    content: namingConvos('f-name-too-long', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-has-spaces',
    content: namingConvos('f-name-has-spaces', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-has-uppercase',
    content: namingConvos('f-name-has-uppercase', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-hidden',
    content: namingConvos('f-name-is-hidden', 'folder'),
    options: {
      'yes, save it!': (c, t) => self._postNewFolder(tempName),
      'no, oops!': (e) => e.goTo('new-folder')
    }
  }, {
    id: 'folder-dot',
    content: namingConvos('fldr-has-dot', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-rename',
    content: namingConvos('f-rename', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', true),
      'never mind': (e) => e.hide()
    }
  }, { // ---------------------------------------------------- file stuff ------
    id: 'new-file',
    content: namingConvos('new-f', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-too-long',
    content: namingConvos('f-name-too-long', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-has-spaces',
    content: namingConvos('f-name-has-spaces', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-has-uppercase',
    content: namingConvos('f-name-has-uppercase', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-rename',
    content: namingConvos('f-rename', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', true),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-new-missing-ext',
    content: namingConvos('f-ext', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-rename-missing-ext',
    content: namingConvos('f-ext', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', true),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-new-hidden',
    content: namingConvos('f-name-is-hidden', 'file'),
    options: {
      'yes, save it!': (c, t) => self._postNewFile(tempName),
      'no, oops!': (e) => e.goTo('new-file')
    }
  }, {
    id: 'file-rename-hidden',
    content: namingConvos('f-name-is-hidden', 'file'),
    options: {
      'yes, save it!': (c, t) => self._postRenameFile(tempName),
      'no, oops!': (e) => e.goTo('file-rename')
    }
  }, {
    id: 'confirm-delete',
    content: `Are you sure you want to delete <code>${self._delete}</code> from your project?`,
    options: {
      yes: (e) => { self._postConfirmDeletion(); e.hide() },
      'no, never mind': (e) => e.hide()
    }
  }, { // ----------------------------------------------------------------------
    id: 'duplicate-file', // TODO: give them option to "replace" or suggest deleting it
    content: `You already have a file called <code>${self._upload}</code> uploaded to your project. Click the trash icon next to it's name to delete it before uploading a new version of that file.`,
    options: { ok: (e) => e.hide() }
  }, {
    id: 'file-too-big',
    content: 'I\'m gonna have to stop you right there. That files a bit too big to be including it in a Web project. Try and see if you can get the file size to be smaller',
    options: {
      ok: (e) => e.hide(),
      'how small does it have to be?': (e) => e.goTo('size')
    }
  }, {
    id: 'size',
    content: 'There\'s no specific number, it really depends on your audience\'s Internet speeds. As of <a href="https://www.speedtest.net/global-index" target="_blank">July 2020</a> average global download speeds were 34Mbps or ~4.3MB a second. So assuming you don\'t want your page to take longer than a second to load, I\'d try to keep assets under 5MB',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'oh-no-error',
    after: () => errorFace(),
    content: 'Oh dang! seems there was a server error... sorry about that...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => e.hide()
    }
  }, {
    id: 'unknown-format',
    content: 'Unfortunately that\'s not a file I know how to open, if you think this is a mistake you should let my creators know by filing an <a href="https://github.com/netizenorg/netnet.studio/issues" target="_blank">issue</a>.',
    options: {
      'I see.': (e) => e.hide()
    }
  }]
}
