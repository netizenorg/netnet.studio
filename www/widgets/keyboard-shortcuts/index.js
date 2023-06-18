/* global Widget, WIDGETS, NNE, NNW, utils */
class KeyboardShortcuts extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'keyboard-shortcuts'
    this.keywords = ['keyboard', 'shortcut', 'keys']

    this.shortcuts = [
      {
        key: `${utils.hotKey()} + S`,
        nfo: 'quick save / share options',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 83,
        callback: (e) => {
          e.preventDefault()
          if (window.sessionStorage.getItem('opened-project')) {
            WIDGETS['functions-menu'].saveProject()
          } else WIDGETS['functions-menu'].saveSketch()
        }
      },
      {
        key: `${utils.hotKey()} + O`,
        nfo: 'open project / upload sketch',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 79,
        callback: (e) => {
          e.preventDefault()
          if (WIDGETS['student-session'].getData('owner')) {
            WIDGETS['functions-menu'].openProject()
          } else {
            WIDGETS['functions-menu'].uploadCode()
          }
        }
      },
      {
        key: `${utils.hotKey()} + >`,
        nfo: 'switch netnet to next layout',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 190,
        callback: (e) => {
          e.preventDefault()
          NNW.nextLayout()
        }
      },
      {
        key: `${utils.hotKey()} + <`,
        nfo: 'swtich netnet to previous layout',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 188,
        callback: (e) => {
          e.preventDefault()
          NNW.prevLayout()
        }
      },
      {
        key: `${utils.hotKey()} + L`,
        nfo: 'open the Learning Guide',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 76,
        callback: (e) => {
          e.preventDefault()
          WIDGETS.open('learning-guide')
        }
      },
      {
        key: `${utils.hotKey()} + :`,
        nfo: 'open the Functions Menu',
        condition: (e) => ((e.ctrlKey || e.metaKey) && e.keyCode === 59),
        callback: (e) => {
          e.preventDefault()
          WIDGETS.open('functions-menu')
        }
      },
      {
        key: `${utils.hotKey()} + "`,
        nfo: 'open universal search bar',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 222,
        callback: (e) => {
          e.preventDefault()
          NNW.menu.search.open()
        }
      },
      {
        key: `${utils.hotKey()} + Enter`,
        nfo: 'update/refresh output',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 13,
        callback: (e) => {
          // SEE _preventCodeMirrorDefaults BELLOW
        }
      },
      {
        key: 'Spacebar',
        nfo: 'play/pause tutorial',
        condition: (e) => !NNE.cm.hasFocus() && e.keyCode === 32,
        callback: (e) => {
          if (utils.tutorialOpen()) WIDGETS['hyper-video-player'].toggle()
        }
      },
      {
        key: 'Right Arrow',
        nfo: 'skip ahead 5s in tutorial',
        condition: (e) => e.keyCode === 39,
        callback: (e) => {
          if (utils.tutorialOpen()) WIDGETS['hyper-video-player'].skip(5)
        }
      },
      {
        key: 'Left Arrow',
        nfo: 'jump back 5s in tutorial',
        condition: (e) => e.keyCode === 37,
        callback: (e) => {
          if (utils.tutorialOpen()) WIDGETS['hyper-video-player'].skip(-5)
        }
      },
      {
        key: 'Esc',
        nfo: 'close widget / close search',
        condition: (e) => e.keyCode === 27,
        callback: (e) => {
          if (NNW.menu.search.opened) NNW.menu.search.close()
          else utils.closeTopMostWidget()
        }
      },
      {
        hidden: true,
        key: `${utils.hotKey()} + Shift + P`,
        nfo: 'open the Search Bar',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 80,
        callback: (e) => {
          e.preventDefault() // CTRL/CMD+SHIFT+P
          e.stopPropagation() // TODO... not working :(
          window.event.cancelBubble = true
          NNW.menu.search.open()
          return false
        }
      },
      {
        hidden: true,
        key: `${utils.hotKey()} + 1`,
        nfo: 'launch tutorial maker',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 49,
        callback: (e) => {
          WIDGETS.open('tutorial-maker')
        }
      },
      {
        hidden: true,
        key: `${utils.hotKey()} + 2`,
        nfo: 'launch video stream/recorder',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 50,
        callback: (e) => {
          WIDGETS.open('stream-video')
        }
      },
      {
        hidden: true,
        key: `${utils.hotKey()} + 3`,
        nfo: 'launch netitor key logger',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 51,
        callback: (e) => {
          WIDGETS.open('netitor-logger')
        }
      },
      {
        hidden: true,
        key: `${utils.hotKey()} + 4`,
        nfo: 'launch netitor key logger',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 52,
        callback: (e) => {
          WIDGETS.open('demo-example-maker')
        }
      }
    ]

    this.title = 'Keyboard Shortcuts'
    this.width = 400
    this._createHTML()
    this._createShortcuts()
    this._preventCodeMirrorDefaults()
  }

  _createHTML () {
    const ul = document.createElement('ul')
    ul.style.padding = 0
    this.shortcuts.forEach(sc => {
      if (!sc.hidden) {
        const li = document.createElement('li')
        li.style.display = 'flex'
        li.style.justifyContent = 'space-between'
        li.innerHTML = `<span>${sc.key}</span><span>${sc.nfo}</span>`
        ul.appendChild(li)
      }
    })
    this.innerHTML = ul
  }

  _preventCodeMirrorDefaults () {
    // run update when autoUpdate(false) handler
    NNE.cm.on('keyHandled', (a, b, e) => {
      if (b === 'Ctrl-Enter' || b === 'Cmd-Enter') {
        e.preventDefault()
        e.stopPropagation()
        NNE.cm.undo() // remove \n that Enter adds
        if (!NNE.autoUpdate) WIDGETS['functions-menu'].runUpdate()
      }
    })
  }

  _createShortcuts () {
    this.shortcuts.forEach(sc => {
      window.addEventListener('keydown', (e) => {
        if (sc.condition(e)) sc.callback(e)
      })
    })
  }
}

window.KeyboardShortcuts = KeyboardShortcuts
