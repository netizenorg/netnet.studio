/* global utils, NNW */
window.CONVOS['ai-api-conduit'] = (self) => {
  return [{
    id: 'start',
    before: () => NNW.menu.switchFace('default'),
    content: 'Most folks interact with LLMs through some online interface, usually a "chatbot" of somekind. This widget lets you go one level deeper, bypassing the consumer facing UI and interacting directly with the LLM provider\'s API.',
    options: {
      cool: (e) => e.hide()
    }
  }]
}
