/* global WIDGETS NNW nn */
window.CONVOS['template-projects'] = (self) => {
  const f12 = nn.platformInfo().platform.includes('Mac') ? 'Fn + F12' : 'F12'
  const safari = nn.platformInfo().name === 'Safari'

  const validateName = (c, t) => {
    const v = t.$('input').value
    const repos = WIDGETS['student-session'].getData('repos').split(', ')

    if (v.length < 1) c.goTo('new-proj-name-blank')
    else if (v.length > 72) c.goTo('new-proj-name-too-long')
    else if (v.includes(' ')) c.goTo('new-proj-name-has-spaces')
    else if (v.match(/[A-Z]/) instanceof Array) c.goTo('new-proj-name-has-uppercase')
    else if (v.includes('.')) c.goTo('new-proj-folder-dot')
    else if (repos.includes(v)) c.goTo('new-proj-name-exists')
    else self._newRepoFromTemplate(v, t)
  }

  return [
    {
      id: 'template-widget-open',
      graph: { id: 1, x: 25, y: 25 },
      content: 'This widget contains a collection of templates which serve as starting points for new web projects. Some contain only a single HTML file while others contain multiple files. Click "Begin Guide" if you\'d like me to explain it to you, or click "Open Completed Template" if you simply want to use it as the basis of a new project.',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: 'buttons',
      graph: { id: 2, x: 150, y: 25 },
      content: 'Clicking on "Open Completed Tempate" will display the full template, ready for remixing into your own work. If instead you click "Begin Guide", I\'ll type out the code for you line by line, explaining the purpose of each piece as we code.',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: 'load-template',
      graph: { id: 3, x: 25, y: 275 },
      content: `Would you like me to start the step-by-step guide for the <i>${self._getTemplateName()} Template</i> or would you prefer I just load the full template?`,
      options: {
        'guide me through it': (e) => {
          self.startGuide(self._tempName)
        },
        'load the full template': (e) => {
          self.displayTemplate(self._tempName)
        }
      }
    },
    {
      id: 'start-guide',
      graph: { id: 4, x: 150, y: 275 },
      content: `I'm going to walk you through creating the <i>${self._getTemplateName()} Template</i>. Feel free to experiment with the code at anytime, you can always click the <b>Notes</b> button at the top of the editor which will reset the code and return to the guided tour.`,
      options: {
        ok: (e) => {
          self._templateConvo(true) // first template convo
        }
      }
    },
    {
      id: 'notes-click',
      graph: { id: 5, x: 275, y: 275 },
      content: 'Would you like to continue where we left off, restart the guide from the start or skip to the end?',
      options: {
        'continue guide': (e) => {
          self._continueGuide()
        },
        'restart guide': (e) => {
          self.startGuide()
        },
        'skip to the end': (e) => {
          self.displayTemplate()
        }
      }
    },
    {
      id: 'clear-code',
      graph: { id: 6, x: 25, y: 150 },
      content: 'It appears you\'ve got some code in the editor, I\'ll have to remove that code before writing the template, is that ok?',
      options: {
        'yes, that\'s ok': (e) => {
          if (self._tempType === 'guide') self.startGuide(self._tempName)
          else self.displayTemplate(self._tempName)
        },
        'no, never mind': (e) => e.hide()
      }
    },
    {
      id: 'clear-code-unsaved-proj',
      graph: { id: 7, x: 275, y: 150 },
      content: 'It appears you\'re working on a project and have some changes which have not been committed. Are you sure you don\'t want to push those changes to your GitHub first before opening this template? These changes will be lost otherwise.',
      options: {
        'yes, let\'s save it first': (e) => {
          WIDGETS.open('git-push')
        },
        'no, we can discard my changes': (e) => {
          WIDGETS['project-files'].closeProject()
          if (self._tempType === 'guide') self.startGuide(self._tempName)
          else self.displayTemplate(self._tempName)
        },
        'oh, never mind': (e) => e.hide()
      }
    },
    {
      id: 'clear-code-opened-proj',
      graph: { id: 8, x: 150, y: 150 },
      content: 'It appears you\'re working on a project. Starting a new template will require closing this project, are you ok with that?.',
      options: {
        'yes, let\'s go ahead': (e) => {
          WIDGETS['project-files'].closeProject()
          if (self._tempType === 'guide') self.startGuide(self._tempName)
          else self.displayTemplate(self._tempName)
        },
        'oh, never mind': (e) => e.hide()
      }
    },
    {
      id: 'end-guide',
      graph: { id: 9, x: 600, y: 100 },
      content: 'Great, that ends the guide to this template. Would you like to continue working on this as a single page <i>sketch</i> or would you like to create a multi-file <i>project</i> hosted on GitHub?',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: 'display-template-single-file',
      graph: { id: 10, x: 500, y: 475 },
      content: `This is the complete <i>${self._getTemplateName()}</i> template! Would you like to create a new <i>project</i> from it on GitHub or do you just want to experiment with it as a <i>sketch</i>?`,
      options: {
        'let\'s create a new project': (e) => e.goTo('new-project-from-template'),
        'just experimenting': (e) => e.hide()
      }
    },
    {
      id: 'new-project-from-template',
      graph: { id: 12, x: 400, y: 625 },
      edit: true,
      content: 'Great, what would you like this new project to be called? <input placeholder="project-name" style="width: 300px;">',
      options: {
        'ready!': (e, t) => {
          validateName(e, t)
        },
        'never mind, i\'ll just experiment': (e) => e.goTo('just-experimenting')
      }
    },
    {
      id: 'new-proj-name-blank',
      graph: { id: 13, x: 200, y: 800 },
      content: 'You left the project name blank, please type the name you want to give your new project in the field below.  <input placeholder="project-name" style="width: 300px;">',
      options: {
        'ready!': (e, t) => {
          validateName(e, t)
        },
        'never mind, i\'ll just experiment': (e) => e.goTo('just-experimenting')
      }
    },
    {
      id: 'new-proj-name-too-long',
      graph: { id: 14, x: 325, y: 800 },
      content: 'That project name is too long, I need you to keep it below 72 characters, try another name. <input placeholder="project-name" style="width: 300px;">',
      options: {
        'ready!': (e, t) => {
          validateName(e, t)
        },
        'never mind, i\'ll just experiment': (e) => e.goTo('just-experimenting')
      }
    },
    {
      id: 'new-proj-name-has-spaces',
      graph: { id: 15, x: 450, y: 800 },
      content: 'It\'s bad practice to include spaces in your project name because on the Web <a href="https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20" target="_blank">a space isn\'t always a space</a>. Try removing the spaces or replace them with a <code>-</code> (dash) or <code>_</code> (underscore) <input placeholder="project-name" style="width: 300px;">',
      options: {
        'ready!': (e, t) => {
          validateName(e, t)
        },
        'never mind, i\'ll just experiment': (e) => e.goTo('just-experimenting')
      }
    },
    {
      id: 'new-proj-name-has-uppercase',
      graph: { id: 16, x: 575, y: 800 },
      content: 'It\'s bad practice to include uppercase characters in your project name because we often write paths which include our project\'s names in our code, and because file paths are "<a href="https://www.merriam-webster.com/dictionary/case-sensitive" target="_blank">case sensative</a>" keeping names lowercase helps minimize errors. <input placeholder="project-name" style="width: 300px;">',
      options: {
        'ready!': (e, t) => {
          validateName(e, t)
        },
        'never mind, i\'ll just experiment': (e) => e.goTo('just-experimenting')
      }
    },
    {
      id: 'display-template-single-file-no-auth',
      graph: { id: 17, x: 375, y: 475 },
      content: `This is the complete <i>${self._getTemplateName()}</i> template! If you connect me to your GitHub account we can turn this into a new <i>project</i>, otherwise feel free experiment with this as a <i>sketch</i>.`,
      options: {
        'ok, let\'s connect to GitHub': (e) => WIDGETS['student-session'].chatGitHubAuth(),
        'just experimenting': (e) => e.hide()
      }
    },
    {
      id: 'display-template-multi-file',
      graph: { id: 18, x: 250, y: 475 },
      content: `This is the complete index.html file for the <i>${self._getTemplateName()}</i> template! This template contains other files as well, would you like to create a new <i>project</i> from it on GitHub so you can access all the files or are you just experimenting?`,
      options: {
        'let\'s create a new project': (e) => e.goTo('new-project-from-template'),
        'just experimenting': (e) => e.goTo('just-experimenting')
      }
    },
    {
      id: 'just-experimenting',
      graph: { id: 19, x: 50, y: 650 },
      content: 'Ok, just keep in mind that if you want to save any changes you make, you\'ll need to create a <i>project</i> for this to work properly. Saving it as a <i>sketch</i> will break any references to other files in this template.',
      options: {
        ok: (e) => e.hide()
      }
    },
    {
      id: 'display-template-multi-file-no-auth',
      graph: { id: 20, x: 125, y: 475 },
      content: `This is the complete index.html page for the <i>${self._getTemplateName()}</i> template! This template contains other files as well, I could create a <i>project</i> for you from this template, bu you'll first need to connect me to your GitHub.`,
      options: {
        'ok, let\'s connect to GitHub': (e) => WIDGETS['student-session'].chatGitHubAuth(),
        'just experimenting': (e) => e.goTo('just-experimenting')
      }
    },
    {
      id: 'title-click-from-template',
      graph: { id: 21, x: 400, y: 275 },
      content: `Would you like me to guide you through creating this <i>${self._getTemplateName()}</i> template from scratch, or do you want to create a new project from this template?`,
      options: {
        'guide me through it': (e) => {
          self.startGuide(self.state.name)
        },
        'let\'s start a project': (e) => {
          self.preNewRepoFromTemplate()
        },
        'neither, I\'m just experimenting': (e) => e.hide()
      }
    },
    {
      id: 'new-proj-name-exists',
      graph: { id: 22, x: 75, y: 800 },
      content: 'You\'ve already got a repo on your GitHub with that name, try another one. <input placeholder="project-name" style="width: 300px;">',
      options: {
        'ready!': (e, t) => {
          validateName(e, t)
        },
        'never mind, i\'ll just experiment': (e) => e.goTo('just-experimenting')
      }
    },
    {
      id: 'oh-no-error',
      before: () => {
        NNW.menu.updateFace({
          leftEye: 'ŏ', mouth: '︵', rightEye: 'ŏ', lookAtCursor: false
        })
      },
      content: 'Oh dang! seems there was a server error... sorry about that...',
      options: {
        'it\'s ok, errors are a part of the process': (e) => {
          e.hide(); NNW.menu.switchFace('default')
        },
        'what was the error?': (e) => e.goTo('explain-error')
      }
    }, {
      id: 'explain-error',
      before: () => NNW.menu.switchFace('default'),
      content: `The details are beyond my awareness, but if you're feeling curious you can investigate the issue yourself by pressing <code>${f12}</code> to open your browser developer tools ${safari ? '(You\'re using Safari, so you may need to enable you developer tools first)' : ''} and check the "Console". Then <a href="https://github.com/netizenorg/netnet.studio/issues/new" target="_blank">open an issue</a> on our GitHub to let us know what you found!`,
      options: { ok: (e) => e.hide() }
    },
    {
      id: 'can-not-edit',
      content: 'Occasionally I might ask you for content which I\'ll include in the code, but you can\'t edit the code directly while I build out the template. You\'ll have to wait till I\'m finished, or click on the "Notes" button at the top to skip to the end.',
      options: {
        ok: (e) => {
          if (self._lastConvo === 'start-guide') e.goTo('start-guide')
          else self._templateConvo()
        }
      }
    }
  ]
}
