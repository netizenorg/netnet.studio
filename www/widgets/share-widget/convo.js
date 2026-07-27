/* global NNW */
window.CONVOS['share-widget'] = (self) => {
  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', rightEye: 'ŏ', lookAtCursor: false
    })
  }

  return [{
    id: 'generate-sketch-url',
    content: 'Ok, here\'s a URL for your sketch! Your sketch isn\'t <i>saved</i> anywhere, in the traditional sense; the data itself is encoded in the URL displayed in the <b>Share Sketch Widget</b>. Copy+paste the URL to share your sketch with anyone on the Internet.',
    options: {
      'great, thanks!': (e) => e.hide()
    }
  }, {
    id: 'shortener-retired',
    content: 'In earlier "beta" versions I would optionally shorten URLs, but this required storing user sketches in a database of shortcodes. Call us extreme, but when it comes to <span class="link" onclick="WIDGETS.open(\'privacy-policy\')">user privacy</span> we\'d prefer not to store any user data, and instead let you decide where/when and with who to share your data, including these sketches.',
    options: {
      'got it, thanks': (e) => e.hide(),
      'what about my old short-URLs?': (e) => e.goTo('shortener-archive'),
      'what if I need it shorter?': (e) => e.goTo('shortener-alternative')
    }
  }, {
    id: 'shortener-archive',
    content: 'Your work is not lost! If you\'re looking for a sketch you previously shared with a shortened link, email us at <a href="mailto:hi@netizen.org">hi@netizen.org</a> with your short code and we\'ll manually look it up from our private off-line archive.',
    options: {
      'got it, thanks': (e) => e.hide()
    }
  }, {
    id: 'shortener-alternative',
    content: 'Fortunetly, there are loads of third-party URL shorteners, like <a href="https://is.gd/" target="_blank">is.gd</a>, you could use instead.',
    options: {
      'got it, thanks': (e) => e.hide()
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
