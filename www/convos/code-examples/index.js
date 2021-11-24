/* global utils */
window.CONVOS['code-examples'] = (self) => {
  return [{
    id: 'example-info',
    content: 'You can edit this example in the <b style="font-weight:bold;text-decoration:underline;">code</b> tab, switch to the <b style="font-weight:bold;text-decoration:underline;">result</b> tab to see your changes. Click <b style="font-weight:bold;text-decoration:underline;">reset code</b> to reset the example, or click <b style="font-weight:bold;text-decoration:underline;">copy+paste</b> if you\'d like me to copy the example into my editor',
    options: {
      cool: (e) => e.hide()
    }
  }, {
    id: 'nothing-to-reset',
    content: 'You haven\'t edited the example code, but you can! You can press <b style="font-weight:bold;text-decoration:underline;">reset code</b> at any point and I\'ll reset this example to the way it was before you started editing it.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'reset-code',
    content: 'Ok, I\'ve reset the example back to the way it was before you started editing it.',
    options: {
      thanks: (e) => e.hide()
    }
  }, {
    id: 'before-loading-example',
    content: 'Opening this example will get rid of all the code currently in my editor, is that alright with you?',
    options: {
      sure: (e) => {
        utils.loadExample(self.lastClickedExample.key, 'widget')
        e.hide()
      },
      'no, never mind': (e) => e.hide()
    }
  }]
}
