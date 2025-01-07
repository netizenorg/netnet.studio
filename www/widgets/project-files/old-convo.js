/* global NNW */
window.CONVOS['project-files'] = (self) => {
  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', reightEye: 'ŏ', lookAtCursor: false
    })
  }
  // ...
  return [{
    id: 'explain',
    content: 'The <b>Project Files</b> widget let\'s you upload assets like images or other files for you to use in your project. After uploading a file you can reference it in your code.',
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
  }, {
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
