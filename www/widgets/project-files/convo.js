/* global NNW, WIDGETS */
window.CONVOS['project-files'] = (self) => {
  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', reightEye: 'ŏ', lookAtCursor: false
    })
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
    content: 'Here ya go! Use the <span class="link" onclick="WIDGETS.open(\'project-files\')">Project Files</span> widget to manage your project, including creating or uploading new files (including assets, like images or fonts) to use in your project. Don\'t forget to save your progress as you work!',
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
  },
  // -------------------------- creating / deleting / modifying files ----------
  {
    id: 'confirm-delete',
    content: `Are you sure you want to delete <code>${self._delete}</code> from your project?`,
    options: {
      yes: (e) => { self._postDeletion(); e.hide() },
      'no, never mind': (e) => e.hide()
    }
  }, {
    id: 'duplicate-file',
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
  }]
}
