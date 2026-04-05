/* global utils, NNW, Convo  */
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
    content: 'You haven\'t written anything in the <b>POST Request</b> tab yet! That\'s where you type the question or prompt you want to send to the LLM. Switch to the <b>POST Request</b> tab and write something first.',
    options: {
      ok: (e) => {
        e.hide()
        self.switchTab('post')
      }
    }
  }, {
    id: 'llm-possessed-processing',
    content: '...LLM taking over...',
    after: () => self._getPossessed(),
    options: {}
  }, {
    id: 'restate-query',
    content: 'Try restating your question differently in the <b>Post Request</b> tab, then press "send request" to try agian.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'oh-no-error',
    after: () => {
      NNW.menu.updateFace({
        leftEye: 'ŏ', mouth: '︵', rightEye: 'ŏ', lookAtCursor: false
      })
    },
    content: 'Oh dang! seems your LLM provider had a server error...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => {
        e.hide()
        NNW.menu.switchFace('default')
      },
      'what was the error?': (e) => {
        Convo.load('/core/utils-convo.js', () => {
          const convos = window.CONVOS['utils-misc'](window.utils)
          window.convo = new Convo(convos, 'explain-error')
        })
      }
    }
  }]
}
