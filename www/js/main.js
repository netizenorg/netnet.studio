/* global Netitor, NetNet */

const NNE = new Netitor({
  ele: '#nn-editor',
  render: '#nn-output',
  background: false,
  // code: window.greetings.getStarterCode()
  code: '<!DOCTYPE html>\n<h1>hello world wide web</h1>'
})

window.NNW = new NetNet()

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* EVENT LISTENERS
NNE.on('lint-error', (e) => {
  console.log(e);
})

NNE.on('cursor-activity', (e) => {

})

NNE.on('edu-info', (e) => {
  console.log(e);
})

window.utils.get('/api/custom-elements', (json) => {
  json.forEach(filename => {
    window.utils.loadFile(`js/custom-elements/${filename}`)
  })
})

window.addEventListener('keydown', (e) => {
  // console.log(e.keyCode);
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) { // s
    e.preventDefault()
    // if (!NNE.autoUpdate) NNE.update()
    // window.utils.localSave()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 79) { // o
    e.preventDefault()
    // window.WIDGETS['functions-menu'].openFile()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 190) { // >
    e.preventDefault()
    window.NNW.nextLayout()
    // STORE.dispatch('NEXT_LAYOUT')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 188) { // <
    e.preventDefault()
    window.NNW.prevLayout()
    // STORE.dispatch('PREV_LAYOUT')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 75) { // k
    e.preventDefault()
    // STORE.dispatch('CHANGE_OPACITY', 1)
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 76) { // l
    e.preventDefault()
    // window.WIDGETS['tutorials-menu'].open()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 59) { // :
    e.preventDefault()
    // window.WIDGETS['functions-menu'].open()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 222) { // "
    e.preventDefault()
    // window.NNM.search.open()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) { // enter
    // ...
  } else if (e.keyCode === 27) { // esc
    // if (window.NNM.search.opened) window.NNM.search.close()
    // else window.utils.closeTopMostWidget()
  } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 80) {
    // e.preventDefault() // CTRL/CMD+SHIFT+P
    // e.stopPropagation() // TODO... not working :(
    // window.NNM.search.open()
    // return false
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 49) { // 1
    // TEMP... open video streaming widget
    window.WIDGETS.open('stream-video')
  }
})
