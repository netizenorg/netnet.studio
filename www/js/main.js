/* global Netitor, NetNet, utils, WIDGETS, NNW */

const NNE = new Netitor({
  ele: '#nn-editor',
  render: '#nn-output',
  background: false,
  renderWithErrors: true,
  code: ''
})

window.NNW = new NetNet()

const coreWidgets = [
  'FunctionsMenu.js',
  'StudentSession.js',
  'HTMLReference.js',
  'CSSReference.js',
  'JSReference.js',
  'CodeReview.js'
]
coreWidgets.forEach(file => WIDGETS.load(file))

utils.get('/api/custom-elements', (elements) => {
  elements.forEach(file => utils.loadFile(`js/custom-elements/${file}`))

  utils.whenLoaded(elements, coreWidgets, () => { // when everythings loaded...
    // ...check URL for params, && fade out load screen when ready
    const param = utils.checkURL()
    if (param === 'none') WIDGETS['student-session'].greetStudent()
  })
})

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* EVENT LISTENERS

NNE.on('cursor-activity', (e) => {
  if (NNE._spotlighting) NNE.spotlight(null)
})

NNE.on('lint-error', (e) => {
  WIDGETS['code-review'].updateIssues(e)
})

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

window.addEventListener('keydown', (e) => {
  // console.log(e.keyCode);
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) { // s
    e.preventDefault()
    if (!NNE.autoUpdate) NNE.update()
    WIDGETS['functions-menu'].saveSketch()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 79) { // o
    e.preventDefault()
    // TODO if user logged in .openProject() else .uploadCode()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 190) { // >
    e.preventDefault()
    NNW.nextLayout()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 188) { // <
    e.preventDefault()
    NNW.prevLayout()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 76) { // l
    e.preventDefault()
    // WIDGETS['tutorials-menu'].open()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 59) { // :
    e.preventDefault()
    WIDGETS.open('functions-menu')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 222) { // "
    e.preventDefault()
    NNW.menu.search.open()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) { // enter
    // ...
  } else if (e.keyCode === 27) { // esc
    if (NNW.menu.search.opened) NNW.menu.search.close()
    else utils.closeTopMostWidget()
  } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 80) {
    e.preventDefault() // CTRL/CMD+SHIFT+P
    e.stopPropagation() // TODO... not working :(
    window.event.cancelBubble = true
    NNW.menu.search.open()
    return false
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 49) { // 1
    // TEMP... open video streaming widget
    WIDGETS.open('stream-video')
  }
})
