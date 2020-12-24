/* global Averigua */
window.CONVOS['functions-menu'] = (self) => {
  const hotkey = Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'

  return [{
    id: 'need-to-update',
    content: `When <code>autoUpdate</code> is set to <code>false</code> you'll need to manually run the update to see your changes. You can click the <code>runUpdate()</code> button in the Functions Menu or press ${hotkey}+S`,
    options: { 'got it': (e) => e.hide() }
  }, {
    id: 'temp-disclaimer',
    content: 'Sorry, at the moment you can only upload HTML files.',
    options: { 'ah, ok': (e) => e.hide() }
  }, {
    id: 'coming-soon',
    content: 'Sorry, that feature is still being refactored, should be ready soon.',
    options: { 'ah, ok': (e) => e.hide() }
  }]
}
