/* global
  StateManager, Netitor,
  TutorialManager, WindowManager, MenuManager,
  NetitorErrorHandler, NetitorEduInfoHandler
*/
window.greetings.loader()

const STORE = new StateManager({
  log: true
})

const NNE = new Netitor({
  ele: '#nn-editor',
  render: '#nn-output',
  background: false,
  code: window.greetings.starterCode
})

window.NNT = new TutorialManager()
window.NNW = new WindowManager()
window.NNM = new MenuManager()

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* EVENT LISTENERS

NNE.on('lint-error', (e) => {
  // if (e.length > 0) {
  //   catchError = JSON.stringify({ rule: e[0].rule, message: e[0].message })
  //   console.log(catchError);
  // }
  const errz = NetitorErrorHandler.parse(e)
  if (errz) STORE.dispatch('SHOW_ERROR_ALERT', errz)
  else if (!errz && STORE.is('SHOWING_ERROR')) STORE.dispatch('CLEAR_ERROR')
})

NNE.on('cursor-activity', (e) => {
  if (STORE.is('SHOWING_EDU_ALERT')) STORE.dispatch('HIDE_EDU_ALERT')
  window.localStorage.setItem('code', NNE._encode(NNE.code))
})

NNE.on('edu-info', (e) => {
  const edu = NetitorEduInfoHandler.parse(e)
  if (edu) {
    if (STORE.is('SHOWING_EDU_TEXT')) STORE.dispatch('SHOW_EDU_TEXT', edu)
    else STORE.dispatch('SHOW_EDU_ALERT', edu)
  }
})

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

window.addEventListener('DOMContentLoaded', (e) => {
  // does the user have an error exceptions saved
  const erx = window.localStorage.getItem('error-exceptions')
  if (erx) JSON.parse(erx).forEach(e => NNE.addErrorException(e))
  // if there is code saved in the URL's hash or localStorage...
  const cde = window.localStorage.getItem('code')
  if (NNE.hasCodeInHash) {
    window.utils.clearProjectData()
    NNE.loadFromHash()
  } else if (cde) {
    if (cde === 'eJyzUXTxdw6JDHBVyCjJzbEDACErBIk=' ||
    cde === 'eJyzUXTxdw6JDHBVyCjJzbHjAgAlvgST') {
      window.greetings.injectStarterCode()
    } else NNE.code = NNE._decode(cde)
  }
  // if their are URL parameters...
  const url = new URL(window.location)
  // ...check for short code
  const shc = url.searchParams.get('c')
  if (!NNE.hasCodeInHash && shc) window.NNW.expandShortURL(shc)
  // ...check for a tutorial
  const tut = url.searchParams.get('tutorial')
  if (tut) window.NNT.load(tut)
  // ...check for a layout
  const lay = url.searchParams.get('layout')
  const lSl = window.localStorage.getItem('layout')
  if (lay || lSl) {
    const l = lay || lSl
    STORE.dispatch('CHANGE_LAYOUT', l)
    if (l !== 'welcome') {
      window.NNW._whenCSSTransitionFinished(() => window.greetings.welcome())
    }
  }
  // ...check for an opacity
  const opa = url.searchParams.get('opacity')
  if (opa) STORE.dispatch('CHANGE_OPACITY', opa)
  // ...check for a theme
  const the = url.searchParams.get('theme')
  const lSt = window.localStorage.getItem('theme')
  if (the) STORE.dispatch('CHANGE_THEME', the)
  else if (lSt) STORE.dispatch('CHANGE_THEME', lSt)
  // ...check for redirect from GitHub auth process
  const paf = window.localStorage.getItem('pre-auth-from')
  if (paf) window.utils.handleLoginRedirect()
})

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) { // s
    e.preventDefault()
    STORE.dispatch('OPEN_WIDGET', 'functions-menu')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 79) { // o
    e.preventDefault()
    window.WIDGETS['functions-menu'].openFile()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 190) { // >
    e.preventDefault()
    STORE.dispatch('NEXT_LAYOUT')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 188) { // <
    e.preventDefault()
    STORE.dispatch('PREV_LAYOUT')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 59) { // :
    e.preventDefault()
    STORE.dispatch('OPEN_WIDGET', 'tutorials-menu')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 222) { // "
    e.preventDefault()
    STORE.dispatch('OPEN_WIDGET', 'widgets-menu')
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 191) { // ?
    e.preventDefault()
    STORE.dispatch('CHANGE_OPACITY', 1)
  } else if (e.keyCode === 27) { // esc
    if (window.NNM.search.opened) window.NNM.search.close()
    else window.utils.closeTopMostWidget()
  } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 80) {
    e.preventDefault() // CTRL/CMD+SHIFT+P
    e.stopPropagation() // TODO... not working :(
    window.NNM.search.open()
    return false
  }
})

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

// NOTE: this is temporary until i work out the a-frame tutorial
// probably also want to think about how to dynamically do this when
// netnet notices the inclusion of the a-frame library in any project
window.fetch('api/data/aframe', { method: 'GET' })
  .then(res => res.json())
  .then(data => {
    NNE.addCustomElements(data.elements)
    NNE.addCustomAttributes(data.attributes)
    NNE.addErrorException('{"rule":{"id":"attr-whitespace","description":"All attributes should be separated by only one space and not have leading/trailing whitespace.","link":"https://github.com/thedaviddias/HTMLHint/wiki/attr-whitespace"},"message":"The attributes of [ animation ] must be separated by only one space."}')
  })
