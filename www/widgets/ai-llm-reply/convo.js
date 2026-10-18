window.CONVOS['ai-llm-reply'] = (self) => {
  return [{
    id: 'reply-copied',
    content: 'Copied to clipboard!',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'reply-no-code',
    content: 'It\'s important that our use of LLMs supports our learning rather than undermines it, so it\'s a good idea to type out any AI-generated code yourself. That\'s why the "copy code" button only works once you\'ve <i>traced</i> (typed over) the code exactly as it\'s written in the widget.',
    options: {
      ok: (e) => e.hide(),
      'copy anyway': (e) => self._copyAnyway()
    }
  }, {
    id: 'reply-not-copied',
    content: 'The code you typed doesn\'t match. The differences are highlighted in red. Fix the highlighted sections and try again.',
    options: { ok: (e) => e.hide() }
  }]
}
