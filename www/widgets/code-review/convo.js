/* global nn, NNE */
window.CONVOS['code-review'] = (self) => {
  const Mac = nn.platformInfo().platform.includes('Mac')
  const hotkey = Mac ? 'CMD' : 'CTRL'
  const done = (e) => { self.close(); e.hide() }

  return [{
    id: 'error-free',
    content: 'The code in this file looks good to me. I\'ve got no comments or critique for you. However, your browser may catch other errors after rendering your code. If it does, I\'ll mark the line causing the error with a red dot for you to click to learn more.',
    options: {
      'great!': (e) => done(e)
    }
  }, {
    id: 'could-indent',
    content: 'I didn\'t find any obvious issues with your code, although, personally I\'d indent things a little different from how you have it, want me to "tidy" your code?',
    options: {
      'yes please': (e) => {
        NNE.tidy()
        e.goTo('indent-review')
      },
      'no thanks': (e) => e.goTo('review-tidy')
    }
  }, {
    id: 'indent-review',
    content: 'This is my preference, but like all AI I\'m biased. I\'m partial to a certain conventional approach to code indentation, if you prefer the way you had it I can revert things back?',
    options: {
      'this looks good to me': (e) => done(e),
      'revert back to how it was': (e) => {
        self.undoTidy()
        self.close()
        e.goTo('revert-tidy')
      }
    }
  }, {
    id: 'revert-tidy',
    content: 'No problem. There\'s no truly right or wrong way to indent code, the most important thing is to make sure your code is easy to read and that you remain consistent.',
    options: {
      'ok thanks': (e) => done(e)
    }
  }, {
    id: 'review-tidy',
    content: `No problem, you can always use the <code>tidyCode()</code> function in the <b>Coding Menu</b> whenever you want me to automatically clean your indentation, and <b>${hotkey}+Z</b> to undo it.`,
    options: {
      'ok thanks': (e) => done(e)
    }
  }, {
    id: 'found-errors',
    content: `I found ${self.issues.length} issue${self.issues.length > 1 ? 's' : ''} with your code. Click the individual issues in my Code Review Widget to learn more about each, but keep in mind that like all AI I'm biased, you might not agree that these are all "issues".`,
    options: {
      'What\'s a Code Review?': (e) => e.goTo('explain-code-review'),
      'What do you mean biased?': (e) => e.goTo('explain-bias')
    }
  }, {
    id: 'explain-code-review',
    content: 'A code review is when another coder looks over your code to give you feedback and/or to learn from your work. Code reviews are one way to build a sense of community on collaborative projects, as they also become a space to have meta conversations about the code. When teams of coders work on large software projects it often becomes part of their QA (quality assurance) workflow, to ensure that there aren\'t any potential bugs or inconsistencies.',
    options: {
      'I see': (e) => e.goTo('explain-code-review-2')
    }
  }, {
    id: 'explain-code-review-2',
    content: 'I\'m an AI of course, so my review is automated but that doesn\'t mean it isn\'t opinionated.',
    options: {
      'opinionated?': (e) => e.goTo('explain-bias'),
      'ok thanks': (e) => e.hide()
    }
  }, {
    id: 'explain-bias',
    content: 'Like all AIs I reflect the views of the folks who programmed me. A lot of modern AI, developed through a process known as <a href="https://www.youtube.com/watch?v=zl9y8tg7MA0&feature=emb_title" target="_blank">Machine Learning</a>, often reflect the bias of the data set they were trained on. As classical AI, my opinions were hand coded by the folks at <a href="https://netizen.org" target="_blank">netizen.org</a>. They based their decisions on modern web development conventions and "best practices". Not everything I consider an "issue" will cause a "bug", and even when it does, you might be instigating that bug for creative purposes.',
    options: {
      'I see': (e) => e.goTo('explain-bias-2')
    }
  }, {
    id: 'explain-bias-2',
    content: 'It\'s up to you to decide which of these issues you need to address and which you want to dismiss. If you\'re not sure, search the web for more info on any particular issue so that you can make a more informed decision. If and when your collaborating with other coders, it\'s not uncommon to decide on a "code style" to make some of these decisions collectively, before any code reviews.',
    options: {
      'code review?': (e) => e.goTo('explain-code-review'),
      'ok thanks': (e) => e.hide()
    }
  }, {
    id: 'explain-line-numbers',
    content: 'When reviewing errors in your code, developer tools will often display the filename followed by the line number and column number (how many characters from the left) it thinks the error occurred. It\'s not always 100% accurate, but usually means there\'s an issue somewhere on that line, or maybe on the line before or after it.',
    options: {
      'ok thanks': (e) => e.hide()
    }
  }, {
    id: 'good-bye',
    content: 'Good Bye!',
    options: {
      'ok thanks': (e) => done(e)
    }
  },
  // console error convos
  {
    id: 'custom-renderer-error',
    content: `<i>Your browser passed me this error</i>:<br><span style="font-family: fira-code, inconsolata, monospace">${self.error.message}</span>`,
    options: {
      'ok, I\'ll fix it': (e) => e.hide(),
      'what does that mean?': (e) => e.goTo('custom-renderer-error2'),
      'my browser did?': (e) => e.goTo('custom-renderer-error3')
    }
  }, {
    id: 'custom-renderer-error2',
    content: 'When I review your code for mistakes I try to explain them in a clear way, but this isn\'t an issue I caught. This was an error your browser informed me of after we ran your code, and the browser errors aren\'t always easy to make sense of, but your browser might have more info which could help!',
    options: {
      ok: (e) => e.hide(),
      'my browser did?': (e) => e.goTo('custom-renderer-error3')
    }
  }, {
    id: 'custom-renderer-error3',
    content: `Your browser converts the code you write into the rendered output we see. When it does this, it also catches any errors I missed before rendering and displays them in the <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Tools_and_setup/What_are_browser_developer_tools" target="_blank">developer tools</a>. To open them press <code>${Mac ? 'Fn + ' : ''}F12</code> and then switch to the "Console" tab. You can learn more about the error there.`,
    options: {
      ok: (e) => e.hide()
    }
  }]
}
