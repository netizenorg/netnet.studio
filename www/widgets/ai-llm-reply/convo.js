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
    id: 'delete-message',
    content: 'Are you sure you want to delete this message from our conversation\'s history? It won\'t be sent with any future requests.',
    options: {
      'yes, delete it': (e) => {
        self.deleteMessage()
        e.hide()
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'edited-model-message',
    content: 'You just changed what the LLM "said". The next time you send a question in this conversation, the model will see your version as if it had written it. That\'s because LLMs don\'t actually remember anything, their "memory" is just the history of messages we send along with each request, and that history is ours to change.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'reply-not-copied',
    content: 'The code you typed doesn\'t match. The differences are highlighted in red. Fix the highlighted sections and try again.',
    options: { ok: (e) => e.hide() }
  }]
}
