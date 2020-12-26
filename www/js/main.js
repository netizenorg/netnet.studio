/* global Netitor, NetNet, utils, WIDGETS, NNW */

const NNE = new Netitor({
  ele: '#nn-editor',
  render: '#nn-output',
  background: false,
  renderWithErrors: true,
  // code: window.greetings.getStarterCode()
  code: '<!DOCTYPE html>\n<h1>hello world wide web</h1>'
})

window.NNW = new NetNet()

WIDGETS.load('FunctionsMenu.js')

window.utils.get('/api/custom-elements', (json) => {
  json.forEach(filename => {
    window.utils.loadFile(`js/custom-elements/${filename}`)
  })
})

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* EVENT LISTENERS

NNE.on('cursor-activity', (e) => {
  if (utils.spotlighting) utils.spotLightCode('clear')
})

NNE.on('lint-error', (e) => {
  utils.markErrors(e)
})

NNE.on('edu-info', (e) => {
  console.log(e);
})

window.addEventListener('keydown', (e) => {
  // console.log(e.keyCode);
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) { // s
    e.preventDefault()
    // if (!NNE.autoUpdate) NNE.update()
    // window.utils.localSave()
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
    else window.utils.closeTopMostWidget()
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
