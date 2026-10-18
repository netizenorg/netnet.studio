window.CONVOS['ai-code-tracer'] = (self) => {
  // NOTE: ids start with "llm-possessed" to keep netnet's possessed look,
  // "ok" returns to the possessed convo's current step
  return [{
    id: 'llm-possessed-snippet-copied',
    content: 'Copied to clipboard!',
    options: { ok: (e) => self._backToReply() }
  }, {
    id: 'llm-possessed-snippet-no-code',
    content: 'It\'s important that our use of LLMs supports our learning rather than undermines it, so it\'s a good idea to type out any AI-generated code yourself. That\'s why the "copy code" button only works once you\'ve <i>traced</i> (typed over) the code exactly as it\'s written in the widget.',
    options: {
      ok: (e) => self._backToReply(),
      'copy anyway': (e) => self._copyAnyway()
    }
  }, {
    id: 'llm-possessed-snippet-not-copied',
    content: 'The code you typed doesn\'t match the snippet. The differences are highlighted in red. Fix the highlighted sections and try again.',
    options: { ok: (e) => self._backToReply() }
  }]
}
