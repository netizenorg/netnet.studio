/* global Netitor, NetNet, utils, WIDGETS */

const NNE = new Netitor({
  ele: '#nn-editor',
  render: '#nn-output',
  background: false,
  renderWithErrors: true,
  code: ''
})

window.NNW = new NetNet()

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* INITIAL LOAD

const initWidgets = [
  'FunctionsMenu.js',
  'StudentSession.js',
  'HTMLReference.js',
  'CSSReference.js',
  'JSReference.js',
  'CodeReview.js',
  'KeyboardShortcuts.js'
]
initWidgets.forEach(file => WIDGETS.load(file))

utils.get('/api/custom-elements', (elements) => {
  elements.forEach(file => utils.loadFile(`js/custom-elements/${file}`))

  utils.whenLoaded(elements, initWidgets, () => { // when everythings loaded...
    // ...check URL for params, && fade out load screen when ready
    const param = utils.checkURL()
    if (param === 'none') WIDGETS['student-session'].greetStudent()
  })
})

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* EVENT LISTENERS

NNE.on('cursor-activity', (e) => {
  if (NNE._spotlighting) {
    NNE.spotlight(null)
    window.convo.hide()
  } else utils.hideConvoIf()
})

NNE.on('lint-error', (e) => {
  WIDGETS['code-review'].updateIssues(e)
})

NNE.cm.on('keydown', (e) => utils.netitorInput(e))

NNE.on('edu-info', (e) => {
  if (e.line && e.type) NNE.spotlight(e.line)
  if (e.language === 'html') WIDGETS['html-reference'].textBubble(e)
  if (e.language === 'css') WIDGETS['css-reference'].textBubble(e)
  else if (e.language === 'javascript') WIDGETS['js-reference'].textBubble(e)
})

window.addEventListener('resize', (e) => {
  utils.windowResize()
  utils.keepWidgetsInFrame()
})

window.addEventListener('load', () => {
  NNE.code = utils.starterCode()
})

// NOTE: KeyboardShortcuts Widget sets up keyboard event listeners
