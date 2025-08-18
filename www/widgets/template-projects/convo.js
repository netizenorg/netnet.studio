/* global utils WIDGETS */
window.CONVOS['template-projects'] = (self) => {
  return [{
    id: 'start',
    content: 'This widget contains a collection of templates which serve as starting points for new web projects.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'buttons',
    content: 'Clicking on "Jump to Template" will display the full template, ready for remixing. If instead you click "Begin Guide", I\'ll type out the code for you line by line, explaining the purpose of each piece as we code.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'load-template',
    content: `Would you like me to start the step-by-step guide for the <i>${self._getTemplateName()} Template</i> or would you prefer I just load the full template?`,
    options: {
      'guide me through it': (e) => {
        self.startGuide(self._tempName)
      },
      'load the full template': (e) => {
        self.displayTemplate(self._tempName)
      }
    }
  }, {
    id: 'start-guide',
    content: `I'm going to walk you through creating the <i>${self._getTemplateName()} Template</i>. Feel free to experiment with the code at anytime, you can always click the <b>Notes</b> button at the top of the editor to reset the code and return to the guided tour.`,
    options: {
      ok: (e) => {
        self._templateConvo(true) // first template convo
      }
    }
  }, {
    id: 'notes-click',
    content: 'Would you like to continue where we left off, restart the guide from the start or skip to the end?',
    options: {
      'continue guide': (e) => {
        self._continueGuide()
      },
      'restart guide': (e) => {
        self.startGuide(true) // first template convo
      },
      'skip to the end': (e) => {
        self.displayTemplate()
      }
    }
  }, {
    id: 'clear-code',
    content: 'It appears you\'ve got some code in the editor, I\'ll have to remove that code before writing the template, is that ok?',
    options: {
      'yes, that\'s ok': (e) => {
        if (self._tempType === 'guide') self.startGuide(self._tempName)
        else self.displayTemplate(self._tempName)
      },
      'no, never mind': (e) => e.hide()
    }
  }, {
    id: 'clear-code-unsaved-proj',
    content: 'It appears you\'re working on a project and have some changes which have not been committed. Are you sure you don\'t want to push those changes to your GitHub first before opening this template? These changes will be lost otherwise.',
    options: {
      'yes, let\'s save it first': (e) => {
        WIDGETS.open('git-push')
      },
      'no, we can discard my changes': (e) => {
        if (WIDGETS['project-files']) WIDGETS['project-files'].closeProject()
        if (WIDGETS['project-files']) WIDGETS['project-files'].close()
        if (self._tempType === 'guide') self.startGuide(self._tempName)
        else self.displayTemplate(self._tempName)
      },
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'clear-code-opened-proj',
    content: 'It appears you\'re working on a project. Starting a new template will require closing this project, are you ok with that?.',
    options: {
      'yes, let\'s go ahead': (e) => {
        if (WIDGETS['project-files']) WIDGETS['project-files'].closeProject()
        if (WIDGETS['project-files']) WIDGETS['project-files'].close()
        if (self._tempType === 'guide') self.startGuide(self._tempName)
        else self.displayTemplate(self._tempName)
      },
      'oh, never mind': (e) => e.hide()
    }
  }, {
    id: 'remix',
    content: `Here's the full <i>${self._getTemplateName()}</i> template! Feel free to remix it and make it your own. If you do, don't forget to save your progress using the shortcut key <code>${utils.hotKey()} + S</code>`,
    options: {
      ok: (e) => e.hide()
    }
  }]
}
