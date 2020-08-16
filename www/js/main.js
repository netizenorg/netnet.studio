/* global
  StateManager, Netitor,
  TutorialManager, WindowManager, MenuManager,
  NetitorErrorHandler, NetitorEduInfoHandler
*/

const STORE = new StateManager({
  log: true
})

const NNE = new Netitor({
  ele: '#nn-editor',
  render: '#nn-output',
  background: false,
  code: `<!DOCTYPE html>
<style>
  @keyframes animBG {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }

  body {
    background: linear-gradient(230deg, #81c994, #dacb8e, #515199);
    background-size: 300% 300%;
    animation: animBG 30s infinite;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
  `
})

window.NNT = new TutorialManager()
window.NNW = new WindowManager()
window.NNM = new MenuManager()

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* EVENT LISTENERS

NNE.on('lint-error', (e) => {
  const errz = NetitorErrorHandler.parse(e)
  if (errz) STORE.dispatch('SHOW_ERROR_ALERT', errz)
  else if (!errz && STORE.is('SHOWING_ERROR')) STORE.dispatch('CLEAR_ERROR')
})

NNE.on('cursor-activity', (e) => {
  if (STORE.is('SHOWING_EDU_ALERT')) STORE.dispatch('HIDE_EDU_ALERT')
})

NNE.on('edu-info', (e) => {
  const edu = NetitorEduInfoHandler.parse(e)
  if (edu) STORE.dispatch('SHOW_EDU_ALERT', edu)
})

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

window.addEventListener('DOMContentLoaded', (e) => {
  // if there is code saved in the URL's hash, load it to the netitor
  if (NNE.hasCodeInHash) NNE.loadFromHash()
  // if their are URL parameters...
  const url = new URL(window.location)
  // ...check for a tutorial
  const tut = url.searchParams.get('tutorial')
  if (tut) window.NNT.load(tut)
  // ...check for a layout
  const lay = url.searchParams.get('layout')
  if (lay) STORE.dispatch('CHANGE_LAYOUT', lay)
  // ...check for an opacity
  const opa = url.searchParams.get('opacity')
  if (opa) STORE.dispatch('CHANGE_OPACITY', opa)
  // ...check for a theme
  const the = url.searchParams.get('theme')
  if (the) STORE.dispatch('CHANGE_THEME', the)
})

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) { // s
    e.preventDefault()
    STORE.dispatch('SHARE_URL')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 190) { // >
    e.preventDefault()
    STORE.dispatch('NEXT_LAYOUT')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 188) { // <
    e.preventDefault()
    STORE.dispatch('PREV_LAYOUT')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 59) { // :
    e.preventDefault()
    STORE.dispatch('DECREASE_OPACITY', 0.05)
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 222) { // "
    e.preventDefault()
    STORE.dispatch('INCREASE_OPACITY', 0.05)
  }
})
