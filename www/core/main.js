/* global nn, Netitor, NetNet, utils, WIDGETS */

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
  'coding-menu',
  'student-session',
  'html-reference',
  'css-reference',
  'js-reference',
  'code-review',
  'keyboard-shortcuts'
]
initWidgets.forEach(file => WIDGETS.load(file))

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* EVENT LISTENERS

NNE.on('cursor-activity', (e) => {
  if (NNE._spotlighting) {
    NNE.spotlight(null)
    if (window.convo) window.convo.hide()
  } else utils.hideConvoIf()
})

NNE.on('lint-error', (e) => {
  WIDGETS['code-review'].review({ issues: e })
})

NNE.cm.on('keydown', (cm, e) => {
  utils.netitorInput(e)
  utils.numChange(e)
})

NNE.on('edu-info', (e, eve) => {
  if (WIDGETS['student-session'].getData('chattiness') === 'high') {
    if (e.line && e.type) NNE.spotlight(e.line)
    if (e.language === 'html') WIDGETS['html-reference'].textBubble(e)
    if (e.language === 'css') WIDGETS['css-reference'].textBubble(e)
    else if (e.language === 'javascript') WIDGETS['js-reference'].textBubble(e)
  }
})

nn.on('resize', (e) => {
  utils.windowResize()
  utils.keepWidgetsInFrame()
})

nn.on('load', () => {
  utils.get('/api/custom-elements', (elements) => {
    elements.forEach(obj => {
      utils.loadFile(`/custom-elements/${obj.path}/index.js`)
      if (obj.css) utils.loadStyleSheet(`/custom-elements/${obj.path}/styles.css`)
    })
    // when everythings loaded...
    utils.whenLoaded(elements.map(e => e.path), initWidgets, () => {
      // setup custom renderer to catch errors (see on "message" below)
      utils.setCustomRenderer(null)
      // ...check URL for params, && fade out load screen when ready
      if (utils.checkURL() === 'none') utils.loadDefault()
    })
  })
})

// the <iframe> messanger is injected into the rendered html pages, handled in:
// setCustomRenderer or files-db-service-worker.js (when working on projects)
nn.on('message', (e) => {
  if (e.data.type === 'iframe-error') WIDGETS['code-review'].review({ error: e })
})

// warn the user about accidental navigation attempts
nn.on('beforeunload', (e) => {
  e.preDefault(); e.returnValue = ''
})

// NOTE: KeyboardShortcuts Widget sets up keyboard event listeners
