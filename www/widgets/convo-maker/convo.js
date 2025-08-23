/* global  */
/* eslint no-template-curly-in-string: "off" */
window.CONVOS['convo-maker'] = (self) => {
  return [
    {
      id: 'start',
      content: 'The Convo Maker widget is a sort of "meta" widget used to edit any of my conversation passages (including this one!) as well as create new convo files with passages for other widgets. Check out our <a href="/docs" target="_blank">developer docs</a> to learn more!',
      options: {
        'great!': (e) => e.hide()
      }
    }
  ]
}
