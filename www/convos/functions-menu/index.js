/* global Averigua, WIDGETS, NNW */
window.CONVOS['functions-menu'] = (self) => {
  const hotkey = Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
  const hotkeyname = hotkey === 'CMD' ? 'command' : 'control'
  const shareURL = (opts) => {
    opts = opts || {}
    const root = window.location.protocol + '//' + window.location.host
    if (opts.layout && opts.short) {
      return `${root}/?c=${opts.short}&layout=${opts.layout}`
    } else if (opts.layout) {
      return `${root}/?layout=${opts.layout}${window.location.hash}`
    } else if (opts.short) {
      return `${root}/?c=${opts.short}`
    } else return `${root}/${window.location.hash}`
  }

  return [{
    id: 'need-to-update',
    content: `When <code>autoUpdate</code> is set to <code>false</code> you'll need to manually run the update to see your changes. You can click the <code>runUpdate()</code> button in the Functions Menu or press <b>${hotkey}+S</b>`,
    options: { 'got it': (e) => e.hide() }
  }, {
    id: 'temp-disclaimer',
    content: 'Sorry, at the moment you can only upload HTML files.',
    options: { 'ah, ok': (e) => e.hide() }
  }, {
    id: 'session-saved',
    content: 'I\'ve saved the current state of the studio to <b>Your Session Data</b>. If you quit now and come back later I\'ll give you the option to pick back up where you left off.',
    options: {
      'session data?': () => WIDGETS.open('student-session'),
      'ok thanks!': (e) => e.hide()
    }
  }, {
    id: 'blank-canvas-ready',
    content: 'Great! Here\'s a relatively blank canvas. Click on my face if you need me, or double click on any piece of code if you want me to explain it to you.',
    options: {
      'will do, thanks!': (e) => e.hide()
    }
  },
  // ...
  // ...share sketch URL convos...
  // ...
  {
    id: 'generated-sketch-url',
    content: `The URL has been updated with your sketches data! <input value="${shareURL()}" style="display: inline-block; width: 100%"> Your sketch isn't <i>saved</i> anywhere, in the traditional sense; it exists solely in your browser's URL. Copy+paste the current URL to share your sketch with anyone on the Internet. I'll hide from view so that your masterpiece remains unobstructed.`,
    options: {
      'great, thanks!': (e) => e.hide(),
      'why is it so long?': (e) => e.goTo('why-so-long'),
      'hide from view?': (e) => e.goTo('hide-from-view-long')
    }
  }, {
    id: 'why-so-long',
    content: 'Because it contains a compressed version of all the code you\'ve typed into my editor, that way I can decode and inject it back into my editor when you share it with someone else. But I can shorten it for you if you\'d like?',
    options: {
      'let\'s shorten it!': (e) => e.goTo('confirm-shorten-url'),
      'no thanks': (e) => e.hide()
    }
  }, {
    id: 'confirm-shorten-url',
    content: 'Sure thing! But first, you should know that in order for me to shorten the URL I need to store your code on my server\'s database which means the folks at <a href="http://netizen.org" target="_blank">netizen.org</a> will be able to see it and share it with others. But it\'ll be saved anonymously, the only thing I technically need to store in order for the shortener to work is the code itself.',
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
    content: `Great! here's your shortened URL: <input value="${shareURL({ short: self._tempCode || null })}" style="display: inline-block; width: 100%"> Copy+paste that URL to share it with others. I'll hide from view so that your masterpiece remains unobstructed.`,
    options: {
      'got it, thanks!': (e) => e.hide(),
      'hide from view?': (e) => e.goTo('hide-from-view-short')
    }
  }, {
    id: 'hide-from-view-long',
    content: `I'm assuming you don't want me showing up on the other end when you share this link? <input value="${shareURL()}" style="display: inline-block; width: 100%"> I'll still be accessible via shortcuts, like <b>${hotkey}+'</b> (<i>${hotkeyname} quote</i>) to open my search bar, but if you'd prefer your code to be present when you share your sketch I can modify the URL to do so?`,
    options: {
      'no thanks, i prefer you stay hidden': (e) => e.hide(),
      'yes please, i want my code present': (e) => self._shareLongCodeWithLayout()
    }
  }, {
    id: 'no-hide-long',
    content: `Sure thing, here's a new URL that'll display the code alongside your work <input value="${shareURL({ layout: NNW.layout })}" style="display: inline-block; width: 100%">`,
    options: {
      'great thanks!': (e) => e.hide(),
      'why is the URL so long though?': (e) => e.goTo('why-so-long')
    }
  }, {
    id: 'hide-from-view-short',
    content: `I'm assuming you don't want me showing up on the other end when you share this link? <input value="${shareURL({ short: self._tempCode || null })}" style="display: inline-block; width: 100%"> I'll still be accessible via shortcuts, like <b>${hotkey}+'</b> (<i>${hotkeyname} quote</i>) to open my search bar, but if you'd prefer your code to be present when you share your sketch I can modify the URL to do so?`,
    options: {
      'no thanks, i prefer you stay hidden': (e) => e.hide(),
      'yes please, i want my code present': (e) => self._shortenURL(true)
    }
  }, {
    id: 'no-hide-short',
    content: `Sure thing, here's a new URL that'll display the code alongside your work <input value="${shareURL({ layout: NNW.layout, short: self._tempCode || null })}" style="display: inline-block; width: 100%">`,
    options: {
      'great thanks!': (e) => e.hide()
    }
  }, {
    id: 'ok-processing',
    content: 'Ok ...processing...',
    options: {}
  }, {
    id: 'oh-no-error',
    content: 'Oh dang! seems there was a server error... sorry about that...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => e.hide()
    },
    after: () => NNW.menu.setFace('default')
  }, {
    id: 'coming-soon',
    content: 'Sorry, that feature is still being refactored, should be ready soon.',
    options: { 'ah, ok': (e) => e.hide() }
  }]
}
