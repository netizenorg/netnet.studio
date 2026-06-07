window.CONVOS['ai-code-tracer'] = (self) => {
  return [{
    id: 'llm-possessed-snippet-copied',
    content: 'Copied to clipboard!',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'llm-possessed-snippet-no-code',
    content: 'You must first trace the code to practice writing this yourself before you can copy it. In the <b>LLM Code Snippets</b> widget, type over the code exactly as it\'s written, then press "copy code" again',
    options: { ok: (e) => e.hide() }
  }, {
    id: 'llm-possessed-snippet-not-copied',
    content: 'The code you typed doesn\'t match the snippet. The differences are highlighted in red. Fix the highlighted sections and try again.',
    options: { ok: (e) => e.hide() }
  }]
}
