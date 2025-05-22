/* global NNW, WIDGETS, nn, utils */
window.CONVOS['project-files'] = (self) => {
  const hotkey = nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'

  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', reightEye: 'ŏ', lookAtCursor: false
    })
  }

  const gh = (() => {
    const u = WIDGETS['student-session'].getData('username')
    const o = WIDGETS['student-session'].getData('owner')
    const p = WIDGETS['student-session'].getData('opened-project')
    return { u, o, p, url: `https://github.com/${o}/${p}` }
  })()

  const repoSelectionList = (() => {
    const ss = WIDGETS['student-session']
    if (ss && ss.data.github.repos) {
      let str = '<select class="dropdown dropdown--invert">'
      const list = ss.data.github.repos.split(', ')
      list.forEach(r => { str += `<option value="${r}">${r}</option>` })
      str += '</select>'
      return str
    }
  })()

  const pathSelect = (() => {
    const allFiles = Object.keys(self.files)
    const dirPaths = new Set()
    allFiles.forEach(fp => {
      const idx = fp.lastIndexOf('/')
      if (idx === -1) return
      // start with the immediate parent
      let dir = fp.slice(0, idx)
      // add this dir *and* all its ancestors
      while (true) {
        dirPaths.add(dir)
        const slash = dir.lastIndexOf('/')
        if (slash === -1) break
        dir = dir.slice(0, slash)
      }
    })
    let str = '<select class="dropdown dropdown--invert">'
    const list = Array.from(dirPaths).sort((a, b) => a.localeCompare(b))
    list.unshift('[root directory]')
    list.forEach(r => { str += `<option value="${r}">${r}</option>` })
    str += '</select>'
    return str
  })()

  let tempName = null
  const validateFName = (c, t, f, rename) => {
    const v = tempName = t.$('input').value
    const a = v.split('.')
    const e = a[a.length - 1]
    const validExt = Object.keys(self.mimeTypes).includes(e)

    if (v.length < 1) c.goTo(f + '-name-blank')
    else if (v.length > 72) c.goTo(f + '-name-too-long')
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
    } else if (f === 'file' && v.indexOf('.') > 0 && !validExt) {
      c.goTo('file-invalid-ext')
    } else {
      if (rename) self._postRenameFile(v)
      else self._postNew(v, f)
    }
  }

  const namingConvos = (c, f, n) => {
    const convos = {
      'new-f': `what would you like your new ${f} to be called? <input placeholder="${f}-name?">`,
      'f-name-blank': `You left the ${f} name blank, please type the name you want in the field below <input placeholder="${f}-name?">`,
      'f-name-too-long': `That ${f} name is too long, I need you to keep it below 72 characters, try another name <input placeholder="${f}-name?">`,
      'f-name-has-spaces': `It's bad practice to include spaces in your ${f} name because on the Web <a href="https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20" target="_blank">a space isn't always a space</a>. Try removing the spaces or replace them with a <code>-</code> (dash) or <code>_</code> (underscore) <input placeholder="${f}-name?">`,
      'f-name-has-uppercase': `It's bad practice to include uppercase characters in your ${f} name because we often write paths which include our ${f} names in our code, and because file paths are "<a href="https://www.merriam-webster.com/dictionary/case-sensitive" target="_blank">case sensative</a>" keeping names lowercase helps minimize errors <input placeholder="${f}-name?">`,
      'f-rename': `How would you like to rename the ${f} <code>${n}</code>? <input placeholder="${f}-name?">`,
      'f-ext': `Your ${f} name is missing its extention, what type of file is this? If it's an HTML file you should add <code>.html</code> to the end of its name, if it's a CSS file add <code>.css</code> or <code>.js</code> for JavaScript, or <code>.md</code> for Markdown, etc. <input placeholder="${f}-name?">`,
      'f-name-is-hidden': `You've got a <code>.</code> at the start of your ${f} name, in most systems this will be interpreted as a "hidden" ${f}, was that intentional?`,
      'fldr-has-dot': `You've got a <code>.</code> in your folder name, this is common when adding extensions to your file names (like <code>.html</code> or <code>.css</code>) but not when creating folder names. If you were trying to create a "hidden" folder, then you should place the <code>.</code> at the start of the folder's name  <input placeholder="${f}-name?">`,
      'invalid-f-ext': `The extention you gave this ${f} is either invalid or something I don't support, please give your file a valid extention like ${['html', 'css', 'js', 'md', 'txt', 'json', 'csv', 'xml', 'svg'].map(e => `<code>.${e}</code>`).join(', ')} <input placeholder="${f}-name?">`
    }
    return convos[c]
  }

  const titleBarOpts = () => {
    const opts = { 'I see': (e) => e.hide() }
    if (NNW.title.dataset.unsaved) {
      opts['what does the circle mean?'] = (e) => e.goTo('netnet-title-save')
    }
    return opts
  }

  // ...
  return [{
    id: 'explain',
    content: 'The <b>Project Files</b> let\'s you manage all the individual files in your project.',
    options: {
      cool: (e) => e.hide(),
      'how?': (e) => e.goTo('explain2')
    }
  }, {
    id: 'explain2',
    content: 'For example, you could upload additional assets to your project, say you have an image called <code>cat.jpg</code> on your computer, you could upload that file to include it in your project using the <b>Project Files</b> widget and then in your HTML code you could write something like <code>&lt;img src="cat.jpg"&gt;</code> to embed that image into your page.',
    options: {
      'I see': (e) => e.hide()
    }
  },
  // ------------- explain title bar
  {
    id: 'netnet-title-bar-index',
    content: `Every web project begins with a folder, you named yours <code>${gh.p}</code> (this main folder is also known as your project's "root directory"), the first HTML file we always create in that folder is called <code>index.html</code>, the file you're working on right now. The other files in your project's root directory can be accessed in the <span class="link" onclick="WIDGETS.open('project-files')">Project Files</span> widget. But remember, I won't be saving these files on my server, instead you'll push them to your <a href="${gh.url}" target="_blank">GitHub repo</a>.`,
    options: titleBarOpts()
  }, {
    id: 'netnet-title-bar-readme',
    content: `When you create a versioned code project on GitHub (aka a "repository" or "repo" for short) it's customary to include a file called <code>README.md</code> in your project's "root directory" (your project's main folder <code>${gh.p}</code>), this file is "metadata", meaning it's information <i>about</i> your project. You can write whatever you want here using a simple markup language called <a href="https://www.markdownguide.org/basic-syntax" target="_blank">markdown</a>, this is the first thing someone will see when they checkout your code on <a href="${gh.url}" target="_blank">GitHub</a>.`,
    options: titleBarOpts()
  }, {
    id: 'netnet-title-bar-misc',
    content: `Every web project begins with a folder, you named yours <code>${gh.p}</code>. A project's main folder is also called its "root directory", you can access all the files in your project using the <span class="link" onclick="WIDGETS.open('project-files')">Project Files</span> widget. But remember, I won't be saving these files on my server, instead you'll push them to your <a href="${gh.url}" target="_blank">GitHub repo</a>.`,
    options: titleBarOpts()
  }, {
    id: 'netnet-title-save',
    content: `If you see a circle next to the file's name that means that you have some unsaved changes in your code. When working on a "project" you need to manually save your changes in order to see the rendered results. You can do this by clicking "save changes" below or by using the shortcut <code>${hotkey}+S</code>`,
    options: {
      'got it': (e) => e.hide(),
      'save changes': (e) => {
        self.saveCurrentFile()
        e.goTo('netnet-title-save2')
      }
    }
  }, {
    id: 'netnet-title-save2',
    content: 'I\'ve saved your changes locally, but this is only temporary while you\'re working on the project. You\'ll need to <b>"push"</b> (aka upload) your updates to your GitHub using the <span class="link" onclick="WIDGETS.open(\'project-files\')">Project Files</span> widget in order to save them permanently.',
    options: {
      ok: (e) => e.hide()
    }
  },
  // -------------------------- opening project --------------------------------
  {
    id: 'open-project',
    content: `Choose the project you want me to open ${repoSelectionList}`,
    options: {
      'ok, this one': (e, t) => {
        const repo = t.$('select').value
        self.openProject(repo)
      },
      'actually, never mind': (e) => e.hide()
    }
  }, {
    id: 'opening-project',
    before: () => NNW.menu.switchFace('processing'),
    content: '...asking GitHub for data...',
    options: {}
  }, {
    id: 'not-a-web-project',
    content: 'I can only help you work on Web projects and this repo doesn\'t seem to have an <code>index.html</code> file in it\'s root directory. Want to try opening another project?',
    options: {
      ok: (e) => e.goTo('open-project'),
      'index? root directory?': (e) => e.goTo('whats-a-web-project'),
      'no, never mind': (e) => e.hide()
    }
  }, {
    id: 'whats-a-web-project',
    content: 'There\'s all sorts of coding languages you can create digital work with and GitHub is a place for sharing any sort of open source project. When we\'re specifically working on a web page or web app we need at least one HTML file in the root directory (aka main project folder) called "index.html" to start with.',
    options: {
      'ok, let\'s open a one': (e) => e.goTo('open-project'),
      'i see, never mind': (e) => e.hide()
    }
  },
  {
    id: 'project-opened',
    content: 'Here ya go! Use the <span class="link" onclick="WIDGETS.open(\'project-files\')">Project Files</span> widget to manage your project, including creating or uploading new files (images, fonts, etc) to use in your project. Don\'t forget to save your progress as you work!',
    options: {
      ok: (e) => e.hide()
      // 'submit to BrowserFest': (e) => {
      //   if (WIDGETS['browser-fest']) {
      //     WIDGETS['browser-fest'].submit()
      //   } else {
      //     WIDGETS.load('browser-fest', (w) => w.submit())
      //   }
      // }
    }
    // ,
    // after: () => {
    //   document.querySelector('.text-bubble-options > button:nth-child(2)')
    //     .classList.add('opt-rainbow-bg')
    // }
  }, { // ---------------------------------------------------- folder stuff ----
    id: 'new-folder',
    content: namingConvos('new-f', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-blank',
    content: namingConvos('f-name-blank', 'folder', self._rename),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-too-long',
    content: namingConvos('f-name-too-long', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-has-spaces',
    content: namingConvos('f-name-has-spaces', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-has-uppercase',
    content: namingConvos('f-name-has-uppercase', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-hidden',
    content: namingConvos('f-name-is-hidden', 'folder'),
    options: {
      'yes, save it!': (c, t) => self._postNew(tempName, 'folder'),
      'no, oops!': (e) => e.goTo('new-folder')
    }
  }, {
    id: 'folder-dot',
    content: namingConvos('fldr-has-dot', 'folder'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-rename',
    content: namingConvos('f-rename', 'folder', self._rename),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', true),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'copy-relative-path',
    content: `I've copied the relative path to this file to your clipboard, press <code>${hotkey}+V</code> to paste it. <br><br>A relative path shows how to locate a file from your current file’s folder: each <code>../</code> goes up one level, and each folder name followed by a <code>/</code> dives into that subfolder until you reach the target file.`,
    options: { ok: (e) => e.hide() }
  }, { // ---------------------------------------------------- file stuff ------
    id: 'new-file',
    content: namingConvos('new-f', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-blank',
    content: namingConvos('f-name-blank', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-too-long',
    content: namingConvos('f-name-too-long', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-has-spaces',
    content: namingConvos('f-name-has-spaces', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-has-uppercase',
    content: namingConvos('f-name-has-uppercase', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-rename',
    content: namingConvos('f-rename', 'file', self._rename),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', true),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-new-missing-ext',
    content: namingConvos('f-ext', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', self._rename),
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
    id: 'file-invalid-ext',
    content: namingConvos('invalid-f-ext', 'file'),
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', true),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-new-hidden',
    content: namingConvos('f-name-is-hidden', 'file'),
    options: {
      'yes, save it!': (c, t) => self._postNew(tempName, 'file'),
      'no, oops!': (e) => e.goTo('new-file')
    }
  }, {
    id: 'file-rename-hidden',
    content: namingConvos('f-name-is-hidden', 'file'),
    options: {
      'yes, save it!': (c, t) => self._postRenameFile(tempName),
      'no, oops!': (e) => e.goTo('file-rename')
    }
  },
  // -------------------------- creating / deleting / modifying files ----------
  {
    id: 'confirm-delete',
    content: `Are you sure you want to delete <code>${self._delete}</code> from your project?`,
    options: {
      yes: (e) => { self._postDeletion(self._delete); self._delete = null; e.hide() },
      'no, never mind': (e) => { e.hide(); self._delete = null }
    }
  }, {
    id: 'no-delete-index',
    content: `You can not delete the <code>index.html</code> file from your root directory. Every website needs at least one HTML file named <i>index</i> in it's "root" (aka your project's main folder <i>${gh.p}</i>).`,
    options: { ok: (e) => e.hide() }
  }, {
    id: 'can-no-delete',
    content: `The <code>${self._delete}</code> folder has files in it. You must delete all the files inside a folder before I can remove the folder itself.`,
    options: { ok: (e) => e.hide() }
  }, {
    id: 'duplicate-file',
    content: `You already have a file called <code>${self._duplicate}</code> in that folder. You must either delete the older <i>${self._duplicate}</i> or give this new file another name.`,
    options: { ok: (e) => e.hide() }
  }, {
    id: 'duplicate-folder',
    content: `There is already a folder named <code>${self._duplicate}</code> in that parent folder. You must either delete the older <i>${self._duplicate}</i> folder or give this folder another name.`,
    options: { ok: (e) => e.hide() }
  }, {
    id: 'text-file-too-big',
    content: `The file you want to upload is <code>${self._uploadedFile.smb} MB</code>. That's pretty large for a file containing text/code, a little too large for me to display in my editor for you to edit. That said, if this is a library or a data file (JSON/CSV/XML) you can still reference it in your code. Would you still like me to upload it?`,
    options: {
      'yes, please upload it': (e) => {
        e.hide(); self._postUpload()
      },
      'oh, never mind': (e) => e.hide(),
      'how small does it have to be?': (e) => e.goTo('text-file-size')
    }
  }, {
    id: 'file-pretty-big',
    content: `The file you want to upload is <code>${self._uploadedFile.smb} MB</code>. That might not seem that large, but on the web that could actually take a few seconds for your visitor to load (as it gets sent over the Internet, from the computer hosting your code, to their computer). I just want to warn you in advance, I can still upload it if you want though?`,
    options: {
      'yes, please upload it': (e) => {
        e.hide(); self._postUpload()
      },
      'oh, never mind': (e) => e.hide(),
      'how small does it have to be?': (e) => e.goTo('size')
    }
  }, {
    id: 'file-too-big',
    content: `Wow! <code>${self._uploadedFile.smb} MB</code> that's a big file! Unfortunately, I have a file size limit of <code>50 MB</code>, so I won't be able to upload that for you. While it is possible to host a file that large on your own website, I would recommend finding a separate hosting storage solution for a file that large and simply reference it's URL to use it in your code.`,
    options: {
      ok: (e) => e.hide(),
      'how small does it have to be?': (e) => e.goTo('text-file-size')
    }
  }, {
    id: 'text-file-size',
    content: 'Sure, at the moment I\'m limited to <code>1 MB</code> file sizes for any text/code files. Or <code>50 MB</code> for other media files and assetts, although I would try to keep those much smaller than that.',
    options: {
      ok: (e) => e.hide(),
      'how much smaller?': (e) => e.goTo('size')
    }
  }, {
    id: 'size',
    content: 'There\'s no specific number, it really depends on your audience\'s Internet speeds. As of <a href="https://www.speedtest.net/global-index" target="_blank">Feb 2025</a> average global download speeds were 98.31 Mbps or ~12.4 MB a second. So assuming you don\'t want your page to take longer than a second to load, I\'d try to keep assets under <code>5 MB</code>',
    options: {
      ok: (e) => e.hide(),
      'Can I upload files larger than that?': (e) => e.goTo('text-file-size')
    }
  },
  {
    id: 'move-no-other-path',
    content: 'You haven\'t created any sub-folders (other folders within your main project folders), so there isn\'t anywhere else to move this file. If you\'d like you can create a new folder and then you can move or create new files in it.',
    options: {
      'I see': (e) => e.hide()
    }
  },
  {
    id: 'move-update-path',
    content: `Below is every file path in your project, where each <code>/</code> dives you into a deeper folder. "The root directory" (aka project folder) is your top‐level directory that contains everything else. Use the list below to select which directory path you want to move this to ${pathSelect}`,
    options: {
      'ok, this one': (e, t) => self._postMoveFile(t.$('select').value),
      'actually, never mind': (e) => e.hide()
    }
  },
  {
    id: 'move-folder-denied',
    content: 'That directory (aka folder) already has a folder in it with the same name as the one you are trying to move there.',
    options: { ok: (e) => e.hide() }
  },
  {
    id: 'move-file-denied',
    content: 'That directory (aka folder) already has a file in it with the same name as the one you are trying to move there.',
    options: { ok: (e) => e.hide() }
  },
  {
    id: 'move-folder-same',
    content: 'That\'s the same directory (aka folder) that the folder you are trying to move is already located in. Moving it there won\'t change anything.',
    options: { ok: (e) => e.hide() }
  },
  {
    id: 'move-file-same',
    content: 'That\'s the same directory (aka folder) that the file you are trying to move is already located in. Moving it there won\'t change anything.',
    options: { ok: (e) => e.hide() }
  },
  {
    id: 'move-folder-self',
    content: 'That\'s the same directory (aka folder) that you\'re trying to move. You can\'t move a folder into itself.',
    options: { ok: (e) => e.hide() }
  },
  // -------------------------- viewing / opening files ----------
  {
    id: 'will-loose-data',
    content: `You haven't saved your changes to your current file, you must save them first (${hotkey}+S) or you will loose your changes.`,
    options: {
      'ok thanks!': (e) => e.hide(),
      'I don\'t want to save it': (e) => { self.openFile(self._opening, true); e.hide() }
    }
  }, {
    id: 'unknown-format',
    content: 'Unfortunately that\'s not a file I know how to open, if you think this is a mistake you should let my creators know by filing an <a href="https://github.com/netizenorg/netnet.studio/issues" target="_blank">issue</a>.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'unknown-format2',
    content: `Unfortunately that's not a file I know how to open here, but we could try to <a href="${self._openingCode}" target="_blank">open it in a new tab</a>?`,
    options: {
      'ok, never mind': (e) => e.hide()
    }
  }, {
    id: 'cname',
    content: 'A <a href="https://en.wikipedia.org/wiki/CNAME_record" target="_blank">CNAME</a> is a file used by the Domain Name System when mapping domain names to the IP address of the computer serving the website files associated with a given domain name. If a CNAME file showed up in your project it\'s likely because you published your project on GitHub and added a "<a href="https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site" target="_blank">custom domain</a>". GitHub creates a URL for you by default when you publish a website on its platform and it uses this CNAME record to associated that URL with your custom domain.',
    options: {
      'I see': (e) => e.hide()
    }
  }, {
    id: 'gitignore',
    content: 'A <code>.gitignore</code> file tells Git which files or folders to ignore so they don\'t get tracked or uploaded when you commit changes to your project. It\'s especially useful for keeping sensitive files, temporary files, or system-specific stuff (like log files or local config files) out of your version control. You can read more about <a href="https://git-scm.com/docs/gitignore" target="_blank">how .gitignore works here</a>.',
    options: {
      'I see': (e) => e.hide()
    }
  }, {
    id: 'license',
    content: 'A software license dictates the terms of use, because we\'re hosting our code on GitHub it\'s common to include an open source license dictating the terms of use for any web app/site hosted there. As an open source project myself, I\'m licensed under the <a href="https://github.com/netizenorg/netnet.studio/blob/main/LICENSE" target="_blank">GPL-3.0</a> license. You can visit this page to <a href="https://choosealicense.com/licenses/" target="_blank">learn more about open source licenses</a>.',
    options: {
      'I see': (e) => e.hide()
    }
  }, {
    id: 'txt-too-big',
    content: 'The file you want to view is larger than <code>1 MB</code>, while you can reference this file in your code (for example loading data via JavaScript) I can\'t display it\'s content in my editor (at least not without running into memory issues and bugging out).',
    options: {
      'I see': (e) => e.hide()
    }
  }, {
    id: 'js-too-big',
    content: `It looks like this JavaScript file was too large to load from GitHub. If this was a library or framework it's unlikely that you want to view and edit that file directly, however if you simply want to view the data stored in this file you can <a href="${self._jsLibPath}" target="_blank">view it in a new tab</a>.`,
    options: {
      'ok thanks!': (e) => e.hide()
    }
  }, {
    id: 'misc-too-big',
    content: `It looks like that file was too large to load from GitHub. If this was a library or a large data file it's unlikely that you want to edit that file directly in my editor anyway, however if you simply want to view the data stored in this file you can <a href="${self._jsLibPath}" target="_blank">view it in a new tab</a>.`,
    options: {
      'ok thanks!': (e) => e.hide()
    }
  },
  // -------------------------- misc ----------
  {
    id: 'git-push-not-ready',
    content: 'Nothing has changed since your last "commit", which means we have nothing to "push" (aka back up) to GitHub. Try making and saving a change to your code first.',
    options: {
      'ok thanks!': (e) => e.hide()
    }
  }, {
    id: 'oh-no-error',
    after: () => errorFace(),
    content: 'Oh dang! seems there was a server error... sorry about that...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => e.hide()
    }
  }]
}
