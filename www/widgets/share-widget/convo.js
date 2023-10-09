/* global NNW */
window.CONVOS['share-widget'] = (self) => {
  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', reightEye: 'ŏ', lookAtCursor: false
    })
  }

  return [{
    id: 'generate-sketch-url',
    content: 'Ok, here\'s a URL for your sketch! Your sketch isn\'t <i>saved</i> anywhere, in the traditional sense; the data itself is encoded in the URL displayed in the <b>Share Sketch Widget</b>. Copy+paste the URL to share your sketch with anyone on the Internet.',
    options: {
      'great, thanks!': (e) => e.hide()
    }
  }, {
    id: 'why-so-long',
    content: 'You may have noticed the share URL is fairly long. That\'s because it contains a compressed version of all the code you\'ve typed into my editor, that way I can decode and inject it back into my editor when you share it with someone else. But I can shorten it for you if you\'d like?',
    options: {
      'let\'s shorten it!': (e) => e.goTo('confirm-shorten-url'),
      'no thanks': (e) => e.hide()
    }
  }, {
    id: 'confirm-shorten-url',
    content: 'In order for me to shorten the URL I need to store your code on my server\'s database which means the folks at <a href="http://netizen.org" target="_blank">netizen.org</a> will be able to see it and share it with others. But it\'ll be saved anonymously, the only thing I technically need to store in order for the shortener to work is the code itself.',
    options: {
      'fine with me, let\'s shorten it!': (e) => self._shortenURL(),
      'what if i want to be credited?': (e) => e.goTo('what-if-i-want-credit'),
      'oh, never mind then': (e) => e.hide()
    }
  }, {
    id: 'what-if-i-want-credit',
    content: 'Just leave a comment in your source code with your attribution!',
    options: {
      'oh yea! just did, let\'s shorten that URL': (e) => self._shortenURL(),
      'can you show me how?': (e) => self._demonstrateCreditComment()
    }
  }, {
    id: 'show-me-how-to-comment',
    content: 'Sure thing! I\'ve just added a comment at the to of your sketch, feel free to change it to whatever you\'d like.',
    options: {
      'thanks! let\'s shorten that URL now!': (e) => self._shortenURL()
    }
  }, {
    id: 'shorten-url',
    content: 'Great! I\'ve generated a shortened URL for you. Click the URL in the <b>Share Sketch Widget</b> to copy it and share it with others.',
    options: {
      'got it, thanks!': (e) => e.hide()
    }
  }, {
    id: 'layout-info',
    content: `When someone opens your share URL they'll see exactly what you see, including the code in the editor in the current "<i>${NNW.layout}</i>" layout, but you can change this by specifying the layout you want. If you'd perfer to hide the code and only share your output choose the "hidden" option.`,
    options: {
      'got it, thanks!': (e) => e.hide()
    }
  }, {
    id: 'ok-processing',
    content: 'Ok ...processing...',
    options: {}
  }, {
    id: 'oh-no-error',
    after: () => errorFace(),
    content: 'Oh dang! seems there was a server error... sorry about that...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => e.hide()
    }
  }]
}
