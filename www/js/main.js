/* global Netitor, NetNet, utils, WIDGETS */

const NNE = new Netitor({
  ele: '#nn-editor',
  render: '#nn-output',
  background: false,
  renderWithErrors: true,
  displayTitle: true,
  code: ''
})

window.NNW = new NetNet()

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

NNE.cm.on('keydown', (cm, e) => {
  utils.netitorInput(e)
  utils.numChange(e)
})

NNE.on('edu-info', (e, eve) => {
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
  utils.get('/api/custom-elements', (elements) => {
    elements.forEach(file => utils.loadFile(`js/custom-elements/${file}`))

    utils.whenLoaded(elements, initWidgets, () => { // when everythings loaded...
      WIDGETS['student-session'].clearProjectData()
      // ...check URL for params, && fade out load screen when ready
      const param = utils.checkURL()
      if (param === 'none') {
        NNE.code = utils.starterCode()
        WIDGETS['student-session'].greetStudent()
      }
    })
  })
})

window.addEventListener('beforeunload', () => {
  WIDGETS['student-session'].clearProjectData()
})

// NOTE: KeyboardShortcuts Widget sets up keyboard event listeners
