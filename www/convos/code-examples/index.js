/* global utils, NNW */
window.CONVOS['code-examples'] = (self) => {
  return [{
    id: 'example-info',
    content: 'You can edit this example in the <b style="font-weight:bold;text-decoration:underline;">code</b> tab, switch to the <b style="font-weight:bold;text-decoration:underline;">result</b> tab to see your changes. Click <b style="font-weight:bold;text-decoration:underline;">explain</b> if you\'d like me to copy the example into my editor and walk you through it.',
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
  },
  // {
  //   id: 'before-loading-example', // OLD WARNING; NO-LONGER IN USE
  //   content: 'Opening this example will get rid of all the code currently in my editor, is that alright with you?',
  //   options: {
  //     sure: (e) => {
  //       utils.loadExample(self.exData.key, 'widget')
  //       e.hide()
  //     },
  //     'no, never mind': (e) => e.hide()
  //   }
  // },
  {
    id: 'before-loading-example-no-info',
    content: 'I\'m not trained on this particular example yet, so I won\'t be able to explain it to you, but I can copy+paste the code for you into my editor so you can experiment with it. Just keep in mind that I\'ll get rid of all the code currently in my editor, is that alright with you?',
    options: {
      sure: (e) => {
        utils.loadExample(self.exData.key, 'widget')
        e.hide()
      },
      'no, never mind': (e) => e.hide()
    }
  }, {
    id: 'before-loading-example-info',
    content: 'I\'ll be happy to take you through this example step by step, but in order to do this I\'ll need to copy+paste the code into my editor which will get rid of all the code currently in my editor. Is that alright with you?',
    options: {
      sure: (e) => {
        utils.loadExample(self.exData.key, 'widget')
        if (NNW.layout === 'welcome') {
          utils.afterLayoutTransition(() => {
            setTimeout(() => e.hide(), 100)
          })
        } else e.hide()
      },
      'no, never mind': (e) => e.hide()
    }
  }, {
    before: () => {
      const m = document.querySelector('.netitor-gutter-marker')
      m.style.animation = 'bgshift 2s infinite'
    },
    id: 'after-loading-example-info',
    content: 'Great! Click on the glowing dot on line 1 (or any of the green dots) when you want me to begin my explanation. You can also open the <span class="link" onclick="WIDGETS[\'code-examples\'].open()">Code Examples</span> widget to view the list of steps for this example.',
    options: {
      'got it, thanks!': (e) => e.hide()
    }
  }]
}
