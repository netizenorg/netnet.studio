/* global utils, NNW */
window.CONVOS['ai-api-conduit'] = (self) => {
  return [{
    id: 'start',
    before: () => NNW.menu.switchFace('default'),
    content: 'Most folks interact with LLMs through some online interface, usually a "chatbot" of somekind. This widget lets you go one level deeper, bypassing the consumer facing UI and interacting directly with the LLM provider\'s API.',
    options: {
      cool: (e) => e.hide()
    }
  }, {
    id: 'req-body',
    content: 'This is the <b>request body</b>, it\'s the JSON data we send to the LLM provider\'s API. Click on the <b>systemPrompt</b>, <b>userInput</b>, or <b>schema</b> links to view and edit those parts individually.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'no-key',
    before: () => NNW.menu.switchFace('upset'),
    content: 'Looks like you haven\'t entered your API key yet! You\'ll need one from your chosen provider (OpenAI or Anthropic) to make requests. Paste it into the "Your API Key" field up top.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'no-input',
    before: () => NNW.menu.switchFace('upset'),
    content: 'You haven\'t written anything in the <b>Test</b> tab yet! That\'s where you type the question or prompt you want to send to the LLM. Switch to the <b>Test</b> tab and write something first.',
    options: {
      ok: (e) => {
        e.hide()
        self.switchTab('test')
      }
    }
  }]
}
