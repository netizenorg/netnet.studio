/* global Averigua, WIDGETS, NNE */
window.CONVOS['code-review'] = (self) => {
  const hotkey = Averigua.platformInfo().platform.includes('Mac') ? 'CMD' : 'CTRL'
  const type = 'sketch' // TODO check if in GH project, change to "tab" or "file"
  const codeReview = WIDGETS['code-review']
  const done = (e) => { codeReview.close(); e.hide() }

  return [{
    id: 'error-free',
    content: `The code in this ${type} looks good to me. I've got no comments or critique for you.`,
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
        codeReview.undoTidy()
        codeReview.close()
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
    content: `No problem, you can always use the <code>tidyCode()</code> function in the <b>Functions Menu</b> whenever you want me to automatically clean your indentation, and <b>${hotkey}+Z</b> to undo it.`,
    options: {
      'ok thanks': (e) => done(e)
    }
  }, {
    id: 'found-errors',
    content: `I found ${codeReview.issues.length} issues with your code. Click the individual issues in my Code Review Widget to learn more about each, but keep in mind that like all AI I'm biased. Some of the things I consider "issues" might not be from your vector view.`,
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
    content: 'Like all AIs I reflect the world views of the folks who programmed me. A lot of modern AI developed through a process known as <a href="https://www.youtube.com/watch?v=zl9y8tg7MA0&feature=emb_title" target="_blank">Machine Learning</a> often reflect the bias of the data set they were trained on. As classical AI, my opinions were hand coded by the folks at <a href="https://netizen.org" target="_blank">netizen.org</a>. They based their decisions on modern web development conventions. Not everything I consider an "issue" will cause a "bug", and even when it does, you might be instigating that bug for creative purposes.',
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
  }]
}
