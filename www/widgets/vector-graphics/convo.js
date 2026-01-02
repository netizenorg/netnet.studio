/* global utils, NNW */
window.CONVOS['vector-graphics'] = (self) => {

  return [{
    id: 'start',
    content: 'Hello! The purpose of this convo is to test my conversation system.',
    options: {
      ok: (e) => e.goTo('explain')
    }
  }]
}
