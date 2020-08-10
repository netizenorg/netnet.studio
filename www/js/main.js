/* global Netitor, WindowManager, MenuManager, Widget, NetitorEventParser */

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

const NNW = new WindowManager({
  layout: 'separate-window'
})

const NNM = new MenuManager({
  ele: '#nn-menu',
  radius: 100,
  items: {
    search: {
      path: 'images/menu/search.png',
      click: () => { window.alert('open search') }
    },
    settings: {
      path: 'images/menu/settings.png',
      click: new Widget({ title: 'settings' })
    },
    save: {
      path: 'images/menu/save.png',
      click: () => { NNE.saveToHash() }
    },
    open: {
      path: 'images/menu/open.png',
      click: () => { window.alert('open project') }
    }
  }
})

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* EVENT LISTENERS

NNE.on('lint-error', (eve) => {
  NNM.clearAlerts()
  NNE.marker(null)
  NNE.highlight(null)
  if (NNM.opened && NNM.opened.type === 'textbubble') NNM.hideTextBubble()
  if (eve.length > 0) {
    const err = eve[0]
    const clr = err.type === 'error' ? 'red' : 'yellow'
    const clr2 = err.type === 'error'
      ? 'rgba(255,0,0,0.25)' : 'rgba(255, 255, 0, 0.25)'
    NNE.marker(err.line, clr)
    const content = (eve.length > 1)
      ? NetitorEventParser.toContentArray(eve)
      : {
        content: err.friendly || err.message,
        highlight: err.line,
        highlightColor: clr2
      }
    NNM.showAlert(err.type, content)
  }
})

NNE.on('edu-info', (eve) => {
  if (!eve) {
    if (NNM.opened && NNM.opened.sub === 'information') NNM.hideAlert()
  } else if (eve.nfo) {
    const nfo = NetitorEventParser.toHTMLStr(eve)
    NNM.showAlert('information', nfo)
  }
})

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

window.addEventListener('DOMContentLoaded', (e) => {
  // if there is code saved in the URL load it to the editor
  if (NNE.hasCodeInHash) NNE.loadFromHash()
})

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) { // s
    e.preventDefault()
    NNE.saveToHash()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 190) { // >
    e.preventDefault()
    NNW.nextLayout()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 188) { // <
    e.preventDefault()
    NNW.prevLayout()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 59) { // :
    e.preventDefault()
    NNW.opacity = NNW.opacity > 0 ? NNW.opacity - 0.05 : 0
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 222) { // "
    e.preventDefault()
    NNW.opacity = NNW.opacity < 1 ? NNW.opacity + 0.05 : 1
  }
})
