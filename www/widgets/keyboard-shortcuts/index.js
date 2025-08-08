/* global Widget, WIDGETS, NNE, NNW, utils */
class KeyboardShortcuts extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'keyboard-shortcuts'
    this.keywords = ['keyboard', 'shortcut', 'keys']

    this.shortcuts = [
      {
        hidden: true,
        key: `${utils.hotKey()} + Shift + K`,
        nfo: 'kiosk mode',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'k',
        callback: (e) => {
          e.preventDefault()
          const element = document.documentElement
          if (element.requestFullscreen) element.requestFullscreen()
          else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen()
          else if (element.msRequestFullscreen) element.msRequestFullscreen()
        }
      },
      {
        key: `${utils.hotKey()} + S`,
        nfo: 'quick save / share options',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 's',
        callback: (e) => {
          e.preventDefault()
          WIDGETS['coding-menu'].save()
        }
      },
      {
        key: `${utils.hotKey()} + O`,
        nfo: 'open project / upload sketch',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 'o',
        callback: (e) => {
          e.preventDefault()
          WIDGETS['coding-menu'].openFile()
        }
      },
      { // NOTE: doesn't work :( browser's don't let u use "Ctrl + N"
        hidden: true,
        key: `${utils.hotKey()} + N`,
        nfo: 'new sketch / new project',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 'n',
        callback: (e) => {
          e.preventDefault()
          WIDGETS['coding-menu'].new()
        }
      },
      {
        key: `${utils.hotKey()} + G`,
        nfo: 'push to GitHub',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 'g',
        callback: (e) => {
          e.preventDefault()
          WIDGETS.open('git-push')
        }
      },
      {
        key: `${utils.hotKey()} + >`,
        nfo: 'switch netnet to next layout',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === '.',
        callback: (e) => {
          e.preventDefault()
          NNW.nextLayout()
        }
      },
      {
        key: `${utils.hotKey()} + <`,
        nfo: 'swtich netnet to previous layout',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === ',',
        callback: (e) => {
          e.preventDefault()
          NNW.prevLayout()
        }
      },
      // NOTE: if u change any of the following 3, make sure to update
      // the info in the learning-guide/convo.js bubbles
      {
        key: `${utils.hotKey()} + L`,
        nfo: 'open the Learning Guide',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 'l',
        callback: (e) => {
          e.preventDefault()
          WIDGETS.open('learning-guide')
        }
      },
      {
        key: `${utils.hotKey()} + ;`,
        nfo: 'open the Coding Menu',
        condition: (e) => ((e.ctrlKey || e.metaKey) && e.key === ';'),
        callback: (e) => {
          e.preventDefault()
          WIDGETS.open('coding-menu')
        }
      },
      {
        key: `${utils.hotKey()} + '`,
        nfo: 'open universal search bar',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === "'",
        callback: (e) => {
          e.preventDefault()
          NNW.menu.search.open()
        }
      },
      {
        key: `${utils.hotKey()} + Enter`,
        nfo: 'update/refresh output',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 'Enter',
        callback: (e) => {
          // SEE _preventCodeMirrorDefaults BELLOW
        }
      },
      {
        key: 'Spacebar',
        nfo: 'play/pause tutorial',
        condition: (e) => !NNE.cm.hasFocus() && e.key === ' ',
        callback: (e) => {
          if (utils.tutorialOpen() && !NNE.cm.hasFocus()) WIDGETS['hyper-video-player'].toggle()
        }
      },
      {
        key: 'Right Arrow',
        nfo: 'skip ahead 5s in tutorial',
        condition: (e) => e.key === 'ArrowRight',
        callback: (e) => {
          if (utils.tutorialOpen() && !NNE.cm.hasFocus()) WIDGETS['hyper-video-player'].skip(5)
        }
      },
      {
        key: 'Left Arrow',
        nfo: 'jump back 5s in tutorial',
        condition: (e) => e.key === 'ArrowLeft',
        callback: (e) => {
          if (utils.tutorialOpen() && !NNE.cm.hasFocus()) WIDGETS['hyper-video-player'].skip(-5)
        }
      },
      {
        key: 'Esc',
        nfo: 'close widget / close search',
        condition: (e) => e.key === 'Escape',
        callback: (e) => {
          e.preventDefault()
          if (NNW.menu.search.opened) NNW.menu.search.close()
          else utils.closeTopMostWidget()
        }
      },
      {
        hidden: true,
        key: `${utils.hotKey()} + Shift + P`,
        nfo: 'open the Search Bar',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p',
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
        if (!NNE.autoUpdate) {
          console.clear()
          NNE.update()
        }
      }
    })
  }

  _createShortcuts () {
    this.shortcuts.forEach(sc => {
      document.addEventListener('keydown', (e) => {
        if (sc.condition(e)) {
          // e.stopPropagation()
          // window.event.cancelBubble = true
          sc.callback(e)
        }
      })
    })
  }
}

window.KeyboardShortcuts = KeyboardShortcuts
