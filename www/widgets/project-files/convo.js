/* global NNW, NNE, WIDGETS, nn, utils */
window.CONVOS['project-files'] = (self) => {
  const hotkey = nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
  const f12 = nn.platformInfo().platform.includes('Mac') ? 'Fn + F12' : 'F12'
  const safari = nn.platformInfo().name === 'Safari'

  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', rightEye: 'ŏ', lookAtCursor: false
    })
  }

  const a = (() => {
    if (utils.url.github) {
      return utils.url.github.split('/')
    } else if (self.projectData.name) {
      return [WIDGETS['student-session'].getData('owner'), self.projectData.name]
    } else return []
  })()

  const gh = (() => {
    const u = WIDGETS['student-session'].getData('username')
    const o = WIDGETS['student-session'].getData('owner')
    const p = self.projectData.name
    return { u, o, p, url: `https://github.com/${o}/${p}` }
  })()

  const fn = (path) => {
    if (!path) return ''
    const parts = path.split('/')
    return parts[parts.length - 1]
  }

  const createNewRepo = (c, t) => {
    const v = t.$('input').value.replace(/\s/g, '-').toLowerCase()
    const p = /^(\w|\.|-)+$/
    if (!p.test(v)) c.goTo('explain-proj-name')
    else { c.hide(); self._postNewRepo(c, t, v) }
  }

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
    const v = t.$('input').value
    tempName = v
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

  const quitProject = (e) => {
    if (NNW.title.dataset.unsaved) e.goTo('confirm-quit-unsaved')
    else if (self.changes.length > 0) e.goTo('confirm-quit-changes')
    else { self.closeProject(); e.hide() }
  }

  const helpInfoOptions = () => {
    const opts = {
      'got it': (e) => e.hide(),
      'where is this saved?': (e) => e.goTo('where-is-this-saved'),
      'how do I create new files?': (e) => e.goTo('how-do-new-files'),
      'what\'s a file path?': (e) => e.goTo('file-path')
    }

    if (self.viewing?.toLowerCase() === 'index.html') {
      opts['why is this called index.html'] = (e) => e.goTo('netnet-title-ex-index')
    } else if (self.viewing?.toLowerCase() === 'readme.md') {
      opts['why is this called README.md?'] = (e) => e.goTo('netnet-title-ex-readme')
    }

    if (NNW.title.dataset.unsaved) {
      opts['what does the circle mean?'] = (e) => e.goTo('netnet-title-save')
    }

    opts['what\'s that Y icon below the X?'] = (e) => e.goTo('explain-github')
    return opts
  }

  const addCircleToBubble = () => {
    const d = nn.getAll('.text-bubble-options button')
      .filter(b => b.textContent.indexOf('what does the circle mean') === 0)[0]
    if (d) d.innerHTML = 'what does <span class="save-circ-ex">the</span> circle mean?'
  }

  // ...
  return [{
    id: 'explain',
    content: 'The <b>Project Files</b> widget let\'s you manage all the individual files in your project. Click a folder to expand it, click a file to open it. To create or upload a new file, right-click the folder where you want the file to live and choose the option to upload or create a new file or folder',
    options: {
      cool: (e) => e.hide(),
      'how?': (e) => e.goTo('explain2'),
      'beta?': (e) => e.goTo('beta')
    }
  }, {
    id: 'explain2',
    content: 'For example, you could upload additional assets to your project. In the <b>Project Files</b> widget, right-click the folder where you want the file to live and choose the option to create or upload a file. Say you have an image called <code>cat.jpg</code> on your computer, you could upload that file to include it in your project, and then in your HTML code you could write something like <code>&lt;img src="cat.jpg"&gt;</code> to embed that image into your page.',
    options: {
      'I see': (e) => e.hide(),
      'beta?': (e) => e.goTo('beta')
    }
  },
  // ------------- explain title bar
  {
    id: 'netnet-title-bar',
    content: 'The <b>Project Files</b> widget let\'s you manage all the individual files in your project. Click a folder to expand it, click a file to open it. To create or upload a new file, right-click the folder where you want the file to live and choose the option to upload or create a new file or folder. <b style="color:var(--netizen-variable)">Keep in mind, this widget is still in <i>beta</i> (there may be bugs! we\'re still working on it).</b>',
    options: {
      ok: (e) => e.hide(),
      'help, I\'m confused!': (e) => e.goTo('help-info'),
      'what does "beta" mean?': (e) => e.goTo('beta'),
      'download this project': (e) => self.downloadProject(),
      'quit this project': (e) => quitProject(e)
    }
  },
  {
    id: 'help-info',
    content: `You're currently working on a project called <b>${self.projectData.name}</b>, this is also the name of the folder which stores all your website's files. The file you are currently viewing in my editor is <code>${self.viewing}</code>, as noted in the file path at the top of my editor next to the "Files" button which opens this widget. Visit the <a href="${window.location.origin}/docs/students/coding.html" target="_blank">docs</a> to learn more.`,
    options: helpInfoOptions(),
    after: () => addCircleToBubble()
  }, {
    id: 'where-is-this-saved',
    content: `When you create a new project, the initial files get created on your <a href="https://github.com/${a[0]}" target="_blank">GitHub account</a>, in the repo you named <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a>, before getting loaded here. As you work on your project, any changes you make and new files you create or upload get stored right here in your browser. Keep in mind this is only <b>temporary</b>, as you make changes I will color-code these temporary <span style="color: var(--netizen-attribute);">new</span> and <span style="color: var(--netizen-number);">edited</span> files to remind you that these will eventually need to get "pushed" to your Github in order to save these changes permanently on your account. Alternatively, you can <span class="link" onclick="WIDGETS['project-files'].downloadProject()">download</span> your project locally at anytime.`,
    options: {
      'got it.': (e) => e.hide(),
      'ok, download it now': (e) => self.downloadProject(),
      'what\'s GitHub?': (e) => e.goTo('explain-github'),
      'can you auto-save?': (e) => e.goTo('auto-save')
    }
  }, {
    id: 'auto-save',
    content: `Technically I could, but then I'd be making you reliant on me. The reality is, once you start using professional code editors you will not only be expected to "save" to see your changes reflected, but you'll also have to manually create commits and push your code. That might seem tedious, but the convention ensures you maintain control over your code, and I'm here to help introduce you to these conventions and build good habits. So make sure to press <code>${hotkey}+S</code> to save and render your changes often, and select <b>git push</b> from the <b>git menu</b> every time you've added new working feature to your site so you don't loose it.`,
    options: {
      'got it.': (e) => e.hide(),
      'git menu?': (e) => e.goTo('git-menu')
    }
  }, {
    id: 'git-menu',
    content: 'To ope the <i>git menu</i> click the git icon, the Y-looking shape at the top-right of the <span class="link" onclick="WIDGETS.open(\'project-files\')">Project Files</span> widget. There you can click the <i>git</i> icon and select <i>git push</i> to create a new "commit" (save point for recent changes) and send your updates to GitHub, <i>git pull</i> to download any updates on your GitHub repo locally here or <i>web publish</i> to publish your project on the web.',
    options: {
      'got it.': (e) => e.hide()
    }
  }, {
    id: 'how-do-new-files',
    content: `In the <b>Project Files</b> widget you should see a folder named after your project <b>${self.projectData.name}</b>, click on it to expand the folder and view the files stored within it, then click it again to close it (same with any other folder). To upload or create a new file right-click the folder where you want the file to live to open a drop-down "context menu" then choose the desired option. The right-click context menu can also be used to rename, delete and move files.`,
    options: {
      'got it.': (e) => e.hide()
    }
  }, {
    id: 'netnet-title-ex-index',
    content: `Every web project starts with a folder. You named yours <b>${self.projectData.name}</b>. This main folder is also called your project’s “root directory.” The first HTML file you create in this folder should be named <code>index.html</code>. This is a common convention that tells web servers which file to load first when someone visits your website. Each folder in a project can have its own <code>index.html</code>, which acts as the default page for that folder.`,
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'netnet-title-ex-readme',
    content: `When you create a project on GitHub (often called a “repository” or “repo”), it’s customary to include a file named <code>README.md</code> in the project’s root directory, the "${self.projectData.name}" folder. This file contains information <i>about</i> your project. It’s usually the first thing people see when they view your repository on <a href="${gh.url}" target="_blank">GitHub</a>. I’ve created this file for you with some starter instructions, but you can edit it however you like using a simple formatting language called <a href="https://www.markdownguide.org/basic-syntax" target="_blank">Markdown</a>.`,
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'cmd-enter-save-info',
    content: `The <code>${hotkey}+Enter</code> shortcut is used to render <b>sketches</b> when the <i>auto-update</i> setting is false. You are currently working on a <b>project</b>, so instead you'll need to use <code>${hotkey}+S</code> to save and render those changes. Keep in mind, this only saves changes locally and temporarily, to make these changes permanent you'll need to push them to GitHub.`,
    options: {
      ok: (e) => e.hide(),
      'GitHub?': (e) => e.goTo('explain-github'),
      'can\'t you auto save?': (e) => e.goTo('auto-save'),
      'what does the circle mean?': (e) => e.goTo('netnet-title-save')
    },
    after: () => addCircleToBubble()
  }, {
    id: 'netnet-title-save',
    content: `If you see a circle next to the file's name that means that you have some unsaved changes in your code. When working on a "project" you need to manually save your changes in order to see the rendered results. You can do this by clicking "save changes" below or by using the shortcut <code>${hotkey}+S</code><br><br>Now remember, these changes are only being saved temporarily in your browser. To save changes permanently you'll also need to push them to your <a href="${gh.url}" target="_blank">GitHub repo</a> by selecting the the "git push" option in the <i>git menu</i>.`,
    options: {
      'got it': (e) => e.hide(),
      'can you auto save?': (e) => e.goTo('auto-save'),
      'what\'s the git menu?': (e) => e.goTo('git-menu'),
      'ok, save changes now': (e) => {
        self.saveCurrentFile()
        e.goTo('netnet-title-save2')
      }
    }
  }, {
    id: 'netnet-title-save2',
    content: 'I\'ve saved your changes locally, but this is only temporary while you\'re working on the project. You\'ll need to <b>"push"</b> (aka upload) your updates to your GitHub using the <span class="link" onclick="WIDGETS.open(\'git-push\')">Version Control</span> widget in order to save them permanently.',
    options: {
      ok: (e) => e.hide()
    }
  },
  {
    id: 'confirm-quit-unsaved',
    content: 'It looks like you have some unsaved changes in this file, are you sure you want to quit this project? You will loose any unsaved changes.',
    options: {
      'oh, never mind': (e) => e.hide(),
      'yes, quit project anyways': (e) => {
        self.closeProject()
        e.hide()
      }
    }
  },
  {
    id: 'confirm-quit-changes',
    content: 'It looks like you have some changes that you\'ve saved locally, but haven\'t yet backed up to GitHub. Do you want to push your local changes to GitHub first?',
    options: {
      'oh, sure!': (e) => {
        e.hide()
        self._launchGit()
      },
      'no, just quit': (e) => {
        self.closeProject()
        e.hide()
      }
    }
  }, {
    id: 'explain-github',
    content: 'GitHub is an online platform where coders share their projects and collaborate with others. It\'s named after <a href="https://en.wikipedia.org/wiki/Git" target="_blank">git</a>, the open-source tool GitHub uses to "version" your progress. After making a change to your code, select "git push" from that menu to create a "commit" (like a save-point in a video game) and then backup your changes to GitHub.',
    options: {
      'optional hosting?': (e) => e.goTo('hosting'),
      'got it': (e) => e.hide()
    }
  }, {
    id: 'hosting',
    content: 'A web "host" is just a computer connected to the Internet, running a server with your project on it. When someone visits your site, their browser asks that server for it, and gets your site back. You could host it anywhere, even <a href="https://homebrewserver.club/" target="_blank">yourself</a>, the web is an open platform after all, but since your project already lives on GitHub, the easiest option is <a href="https://pages.github.com/" target="_blank">ghpages</a>, GitHub\'s free hosting, which I can enable for you.',
    options: {
      'how do I host on GitHub?': (e) => e.goTo('how-host'),
      'download my project': (e) => self.downloadProject(),
      'got it': (e) => e.hide()
    }
  }, {
    id: 'how-host',
    content: 'While working on a project, select the <i>web publish</i> option from the <i>git menu</i>. You\'ll be given the option to enable the ghpages web server. You only need to do this one time, once enabled all you need to do is "push" your updates to GitHub, and your public website will be updated within minutes.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'download-project',
    content: 'I\'ve started downloading the current version of your project to your computer. All your files will be stored in a <a href="https://en.wikipedia.org/wiki/ZIP_(file_format)" target="_blank">zip file</a> named after your project\'s root folder. You should see the zip file in your downloads folder shortly.',
    options: {
      ok: (e) => e.hide()
    }
  },
  // -------------------------- creating a new project -------------------------
  {
    id: 'unsaved-changes-b4-fork-proj',
    content: `It appears you've got  <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a> by <a href="https://github.com/${a[0]}" target="_blank">${a[0]}</a> open. If you want to remix this project I can now create a "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" for you?`,
    options: {
      'yea let\'s remix it!': (e) => e.goTo('agree-to-fork'),
      'no, let\'s create something new': (e) => self.new(),
      'oh, never mind': (e) => e.hide()
    }
  }, {
    before: () => { if (NNW.layout === 'welcome') NNW.layout = 'dock-left' },
    id: 'agree-to-fork',
    content: 'How exciting! In order to create your own remix of this project I\'m going to "<a href="https://guides.github.com/activities/forking/" target="_blank">fork</a>" it to your GitHub. Forking creates an associated copy onto your account. Sounds good?',
    options: {
      'let\'s do it!': (e) => utils.forkRepo(),
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'unsaved-changes-b4-own-proj',
    content: `It appears you're experimenting with one of your own projects, <a href="https://github.com/${a[0]}/${a[1]}" target="_blank">${a[1]}</a>. I'll have to clear this code out in order to start a new project, is that ok?`,
    options: {
      'yes, let\'s start something new': (e) => {
        NNE.code = ''
        e.goTo('create-new-project')
      },
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'unsaved-changes-b4-new-proj',
    content: `You've saved changes to your current project "${self.projectData.name}" which have not been backed up to GitHub. You should commit and push those first using the <i>git menu</i>.`,
    options: {
      'ok, I will': (e) => e.hide(),
      'git menu?': (e) => e.goTo('git-menu'),
      'no, I\'ll discard the changes': (e) => e.goTo('create-new-project'),
      'actually, I\'ll keep working on this': (e) => e.hide()
    }
  }, {
    id: 'clear-code?',
    content: 'It appears you\'ve got some code in the editor, do you want this to be the start of your new project or should we delete this and start from scratch?',
    options: {
      'I want to keep it': (e) => {
        self._keepCode = NNE.code
        e.goTo('create-new-project')
      },
      'let\'s start from scratch': (e) => {
        NNE.code = ''
        e.goTo('create-new-project')
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'create-new-project',
    before: () => {
      self.closeProject()
      NNW.menu.switchFace('default')
      if (self._keepCode) NNE.code = self._keepCode
      self._keepCode = null
    },
    after: () => {
      nn.get('text-bubble input').focus()
    },
    content: 'What would you like this new project to be called? <input placeholder="project-name">',
    options: {
      'create it!': (c, t) => createNewRepo(c, t),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'explain-proj-name', // if createNewRepo receives a bad name value
    after: () => {
      nn.get('text-bubble input').focus()
    },
    content: 'Project names can not contain any special characters, try a different name. <input placeholder="project-name">',
    options: {
      'save it!': (c, t) => createNewRepo(c, t),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'project-already-exists',
    after: () => NNW.menu.switchFace('error'),
    content: 'GitHub just told me that you already have a project with that name on your account, want to try a different name?',
    options: {
      ok: (e) => e.goTo('create-new-project'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'new-project-created',
    content: `Your project "<a href="https://github.com/${WIDGETS['student-session'].getData('owner')}/${self.projectData.name}" target="_blank">${self.projectData.name}</a>" has been saved to <a href="https://github.com/${WIDGETS['student-session'].getData('owner')}" target="_blank">your GitHub account</a>. You can now upload and create additional files as a part of this project.`,
    options: {
      'cool!': (e) => e.hide()
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
    id: 'open-from-local-or-github',
    content: `I noticed you have unpushed local changes for <b>${self._pendingOpenRepo}</b>. Would you like me to open your most recent local save, or pull this fresh copy from GitHub? <br><br><i>Heads up: pulling from GitHub will discard your unpushed local changes.</i>`,
    options: {
      'open my local save': (e) => {
        const repo = self._pendingOpenRepo
        self._pendingOpenRepo = null
        self._openFromLocal(repo)
      },
      'pull fresh from GitHub': (e) => {
        const repo = self._pendingOpenRepo
        self._pendingOpenRepo = null
        self._openFromGitHub(repo)
      },
      'never mind': (e) => { self._pendingOpenRepo = null; e.hide() }
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
    content: 'Here ya go! Use the <span class="link" onclick="WIDGETS.open(\'project-files\')">Project Files</span> widget to manage your project, including creating or uploading new files (images, fonts, etc) to use in your project. Don\'t forget to save your progress as you work! Feel free to close this widget and re-open it anytime by clicking the "Files" button in the title bar.',
    options: {
      ok: (e) => e.hide(),
      'beta?': (e) => e.goTo('beta')
    }
  }, {
    id: 'files-truncated',
    content: self.truncatedReason === 'depth'
      ? 'Sorry, I wasn\'t able to open this project because its folder structure is nested more than <b>5 levels deep</b>, which is beyond what I can safely work with here. You can still access and edit this project directly on GitHub, just keep in mind that deeply nested folders can make web projects tricky to manage. Consider reorganizing your project so there aren\'t as many folders in folders in folders.'
      : 'Sorry, I wasn\'t able to open this project because it contains more than <b>300 files</b>, which is beyond what I can safely work with here. You can still access and edit this project directly on GitHub. This limit is in place for security, but feel free to open up an <a href="https://github.com/netizenorg/netnet.studio/issues" target="_blank">issue</a> if you think we should reconsider this limit/approach.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'max-files-reached',
    content: 'Your project has reached the <b>300 file limit</b> for netnet.studio. You won\'t be able to add any more files here, though you can still add files directly on GitHub and/or work in another code editor. This limit is in place for security, but feel free to open up an <a href="https://github.com/netizenorg/netnet.studio/issues" target="_blank">issue</a> if you think we should reconsider this limit/approach.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'max-depth-reached',
    content: 'Your project\'s folders are already nested <b>5 levels deep</b>, which is the limit for netnet.studio. You can\'t create another folder here, though you can still add folders elsewhere, like in the root (aka main project folder). Consider reorganizing your folder structure if you need more depth.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'beta',
    content: `This is the first version of the <b>Project Files</b> widget, it's still in "beta", meaning we're still actively developing it, so keep any eye out for bugs. If you run into issues or have any thoughts or suggestions, we appreciate constructive feedback, <a href="${window.location.origin}/docs/contributors/bug-report.html" target="_blank">submit an issue!</a>`,
    options: {
      ok: (e) => e.hide()
    }
  }, { // ---------------------------------------------------- folder stuff ----
    id: 'new-folder',
    content: namingConvos('new-f', 'folder'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-blank',
    content: namingConvos('f-name-blank', 'folder', self._rename),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-too-long',
    content: namingConvos('f-name-too-long', 'folder'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-has-spaces',
    content: namingConvos('f-name-has-spaces', 'folder'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-name-has-uppercase',
    content: namingConvos('f-name-has-uppercase', 'folder'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-hidden',
    content: namingConvos('f-name-is-hidden', 'folder'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'yes, save it!': (c, t) => self._postNew(tempName, 'folder'),
      'no, oops!': (e) => e.goTo('new-folder')
    }
  }, {
    id: 'folder-dot',
    content: namingConvos('fldr-has-dot', 'folder'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'folder-rename',
    content: namingConvos('f-rename', 'folder', self._rename),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'folder', true),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'copy-relative-path',
    content: `I've copied the relative path from the file you're editing, <i>"${fn(self.viewing)}"</i>, to the file you selected, <i>"${fn(self._rightClicked?.dataset.path)}"</i>, onto your clipboard, press <code>${hotkey}+V</code> to paste it.`,
    options: {
      ok: (e) => e.hide(),
      'what\'s a file path?': (e) => e.goTo('file-path')
    }
  }, {
    id: 'copy-relative-path2',
    content: `Your working on a JavaScript file, paths written here are relative to the HTML file you've imported this file into. Assuming that's the file you are currently rendering, <i>"${fn(self.rendering)}"</i>, I've copied the relative path from that file to the file you selected, <i>"${fn(self._rightClicked?.dataset.path)}"</i>, onto your clipboard, press <code>${hotkey}+V</code> to paste it.`,
    options: {
      ok: (e) => e.hide(),
      'what\'s a file path?': (e) => e.goTo('file-path')
    }
  }, {
    id: 'file-path',
    content: 'A file path is how you write directions that tells your browser where to find a file or asset. In HTML you use it in tags like <code>&lt;img src="images/photo.jpg"&gt;</code>, <code>&lt;link href="css/styles.css" rel="stylesheet"&gt;</code>, and <code>&lt;script src="js/app.js"&gt;</code>. In CSS code you find paths inside <code>url(...)</code> for backgrounds or fonts, and in JavaScript you assign it to certain variables like <code>img.src</code> or pass it to functions like <code>fetch()</code>. Paths can be written a few different ways, like relative or absolute.',
    options: {
      ok: (e) => e.hide(),
      'relative? absolute?': (e) => e.goTo('relative-absolute-path')
    }
  }, {
    id: 'relative-absolute-path',
    content: 'Relative paths define directions to a given file starting from the file you\'re currently editing. For example, <code>images/photo.jpg</code> looks in an "images" folder next to your current file, while <code>../css/styles.css</code> goes up (or back) one folder then into the "css" folder. <br><br>Absolute paths always start with a leading <code>/</code> or include a full URL. A slash means "from my site’s root directory" aka your project\'s main folder, like <code>/project/images/photo.jpg</code>. To point to a file somewhere else on the Web you can use a full URL like <code>https://example.com/images/photo.jpg</code>',
    options: {
      ok: (e) => e.hide(),
      'when do I use each?': (e) => e.goTo('relative-absolute-path2')
    }
  }, {
    id: 'relative-absolute-path2',
    content: 'Relative paths adapt if you move folders, while absolute paths always load the same file no matter where your code runs. Use relative paths to point to files and assets inside your project and absolute paths when you need a fixed location or external link.',
    options: {
      ok: (e) => e.hide(),
      'can\'t I make them all absolute?': (e) => e.goTo('relative-absolute-path3')
    }
  }, {
    id: 'relative-absolute-path3',
    content: 'Yes, you could simply write everything as an absolute path starting with a <code>/</code> from your root, but this may break once you publish your work to the Web, especially when using GitHub Pages. This is because GitHub will create a URL for you which looks like "https://username.github.io/project-name" which means your code will no longer be in the "root" realative to that URL, but rather in a sub-folder named after your project. That said, if you use your own custom URL that wouldn\'t be an issue.',
    options: {
      ok: (e) => e.hide()
    }
  }, { // ---------------------------------------------------- file stuff ------
    id: 'new-file',
    content: namingConvos('new-f', 'file'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-blank',
    content: namingConvos('f-name-blank', 'file'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-too-long',
    content: namingConvos('f-name-too-long', 'file'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-has-spaces',
    content: namingConvos('f-name-has-spaces', 'file'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-name-has-uppercase',
    content: namingConvos('f-name-has-uppercase', 'file'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-rename',
    content: namingConvos('f-rename', 'file', self._rename),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', true),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-new-missing-ext',
    content: namingConvos('f-ext', 'file'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', self._rename),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-rename-missing-ext',
    content: namingConvos('f-ext', 'file'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', true),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-invalid-ext',
    content: namingConvos('invalid-f-ext', 'file'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'save it!': (c, t) => validateFName(c, t, 'file', true),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'file-new-hidden',
    content: namingConvos('f-name-is-hidden', 'file'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
    options: {
      'yes, save it!': (c, t) => self._postNew(tempName, 'file'),
      'no, oops!': (e) => e.goTo('new-file')
    }
  }, {
    id: 'file-rename-hidden',
    content: namingConvos('f-name-is-hidden', 'file'),
    after: () => {
      nn.get('text-bubble input').focus()
    },
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
    id: 'duplicate-upload-file',
    content: `You already have a file called <code>${self._duplicate}</code> in your project. Uploading this file will replace the one you currently have, is that what you want?`,
    options: {
      'yes, replace it': (e) => {
        e.hide()
        self._postUpload(true)
      },
      'no, never mind': (e) => {
        self._uploadedFile = {}
        e.hide()
      }
    }
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
    content: `Unfortunately that's not a file I know how to open, if you think this is a mistake you should let my creators know by filing an <a href="${window.location.origin}/docs/contributors/bug-report.html" target="_blank">issue</a>.`,
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
    content: `Nothing has changed since your last "commit", which means we have nothing to "push" (aka back up) to your <a href="https://github.com/${WIDGETS['student-session'].getData('owner')}/${self.projectData.name}/network" target="_blank">timeline</a> on your <a href="https://github.com/${WIDGETS['student-session'].getData('owner')}/${self.projectData.name}" target="_blank">GitHub repo</a>. Try saving changes locally first <code>${utils.hotKey()} + S</code>.`,
    options: {
      'ok thanks!': (e) => e.hide()
    }
  }, {
    id: 'oh-no-error',
    before: () => errorFace(),
    content: 'Oh dang! seems there was a server error... sorry about that...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => {
        e.hide(); NNW.menu.switchFace('default')
      },
      'what was the error?': (e) => e.goTo('explain-error')
    }
  }, {
    id: 'explain-error',
    before: () => NNW.menu.switchFace('default'),
    content: `The details are beyond my awareness, but if you're feeling curious you can investigate the issue yourself by pressing <code>${f12}</code> to open your browser developer tools ${safari ? '(You\'re using Safari, so you may need to enable you developer tools first)' : ''} and check the "Console". Then <a href="${window.location.origin}/docs/contributors/bug-report.html" target="_blank">report an issue</a> on our GitHub to let us know what you found!`,
    options: { ok: (e) => e.hide() }
  }]
}
