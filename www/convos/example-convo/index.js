/* global nn, NNW */
window.CONVOS['example-convo'] = (self) => {
  // setup some locally scoped variables for use in this conversation
  const hotkey = nn.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
  const newTheme = NNW.theme === 'dark' ? 'light' : 'dark'
  const oldTheme = NNW.theme

  NNW.layout = 'welcome'

  // return the actual array of conversation objects
  return [{
    id: 'start',
    content: 'Hello! The purpose of this convo is to test my conversation system.',
    options: {
      ok: (e) => e.goTo('explain')
    }
  }, {
    id: 'explain',
    content: 'It exists purely to test various aspects of my system.',
    options: {
      'let\'s test things out': (e) => e.goTo('go-left')
    }
  }, {
    /*
      TESTING the 'before' key
    */
    id: 'go-left',
    before: () => { NNW.theme = newTheme }, // do something before this new textBubble shows up
    content: 'I just changed my theme, want me to change the theme back?',
    options: {
      yes: (e) => e.goTo('change-theme-back'),
      no: (e) => e.goTo('leave-theme')
    }
  }, {
    id: 'leave-theme',
    content: 'Yea, I think this looks good too. Want to learn to change the layout?',
    options: {
      'sure thing': (e) => e.goTo('learn-to-change-layout'),
      'no thanks': (e) => e.goTo('change-on-own')
    }
  }, {
    id: 'change-theme-back',
    before: () => { NNW.theme = oldTheme },
    content: 'OK, here ya go. Want to learn to change the layout?',
    options: {
      'sure thing': (e) => e.goTo('learn-to-change-layout'),
      'no thanks': (e) => e.goTo('change-on-own')
    }
  }, {
    /*
      TESTING the 'code', 'highlight' and 'after' keys
    */
    id: 'change-on-own',
    content: 'That\'s alright, I\'ll change it for you.',
    // example code to inject into the netitor at this step
    code: `<!DOCTYPE html>
<h1>this is an example of some highlighted code</h1>
    `,
    highlight: {
      startLine: 2, // the line to start highlighting
      endLine: 2, // the line to end highlighting
      startCol: 31, // the column on that line to start at
      endCol: 42, // the column on that line to end at
      color: 'red' // the highlight color
    },
    options: {
      'ok, show me how you did that': (e) => e.goTo('learn-to-change-layout')
    },
    after: (e) => { NNW.layout = 'dock-left' } // do something after this new textBubble shows up
  }, {
    /*
      TESTING the use of locally scoped variabes && setting up event listeners
    */
    id: 'learn-to-change-layout',
    content: `If you would like to change the layout try the shortcut keys <code>${hotkey} &gt;</code> and <code>${hotkey} &lt;</code>.`,
    options: {}, // empty options array to avoid creating default prev/next options
    after: (e) => { // do something after this new textBubble shows up
      NNW.on('layout-change', (o) => {
        e.goTo('good-job')
        o.unsubscribe() // remove this 'layout-change' listener
      })
    }
  }, {
    id: 'good-job',
    content: 'good job!',
    options: {
      thnx: (e) => e.goTo('good-bye')
    }
  }, {
    id: 'good-bye',
    content: 'Bye now! It nice takling to you!',
    options: {
      bye: (e) => e.hide()
    }
  }]
}
