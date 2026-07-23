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

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* EVENT LISTENERS

NNE.on('code-update', () => {
  if (NNE.iframe) utils.setupOutputScrollTracking()
})

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

// NOTE: KeyboardShortcuts Widget sets up keyboard event listeners

nn.on('resize', (e) => {
  utils.windowResize()
})

// the <iframe> messanger is injected into the rendered html pages, handled in:
// setCustomRenderer or files-db-service-worker.js (when working on projects)
nn.on('message', (e) => {
  if (e.data.type === 'iframe-error') WIDGETS['code-review'].review({ error: e })
  else if (e.data.type === 'netnet-bg') utils.updateAllShadows(e)
  else if (e.data.type === 'iframe-sensor-blocked') WIDGETS['code-review'].handleSensorBlocked()
})

// update default background on mouse movement
nn.on('mousemove', (e) => {
  utils.netnetBGComms(e)
})

// warn the user about accidental navigation attempts
nn.on('beforeunload', (e) => {
  e.preventDefault(); e.returnValue = ''
})

nn.on('load', async () => {
  await utils.loaderSetup(initWidgets)
  // load custom elements
  const elements = await utils.getSync('/api/custom-elements')
  elements.forEach(ele => {
    utils.loadFile(`/custom-elements/${ele.path}/index.js`)
    if (ele.css) utils.loadStyleSheet(`/custom-elements/${ele.path}/styles.css`)
    utils.loaderUpdate(ele.path.split('/')[1])
  })
  // load initial widgets
  initWidgets.forEach(f => WIDGETS.load(f, w => utils.loaderUpdate(w.key)))
  // when everythings loaded...
  utils.whenLoaded(elements.map(e => e.path), initWidgets, () => {
    utils.loaderUpdate('ready')
    // setup custom renderer to catch errors (see on "message" below)
    utils.setCustomRenderer(null)
    // ...check URL for params, && fade out load screen when ready
    if (utils.checkURL() === 'none') utils.loadDefault()
  })
})
