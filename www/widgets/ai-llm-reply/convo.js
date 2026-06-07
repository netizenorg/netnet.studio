window.CONVOS['ai-llm-reply'] = (self) => {
  return [{
    id: 'reply-copied',
    content: 'Copied to clipboard!',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'reply-no-code',
    content: 'You must first trace the code to practice writing it yourself before you can copy it. Type over the code exactly as it\'s written in the widget, then press "copy code" again.',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'reply-not-copied',
    content: 'The code you typed doesn\'t match. The differences are highlighted in red. Fix the highlighted sections and try again.',
    options: { ok: (e) => e.hide() }
  }]
}
