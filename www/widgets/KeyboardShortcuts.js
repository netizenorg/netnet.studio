/* global Widget, WIDGETS, NNE, NNW, utils */
class KeyboardShortcuts extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'keyboard-shortcuts'
    this.keywords = ['keyboard', 'shortcut', 'keys']

    this.shortcuts = [
      {
        key: `${utils.hotKey()} + S`,
        nfo: 'quick save/share options',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 83,
        callback: (e) => {
          e.preventDefault()
          if (!NNE.autoUpdate) NNE.update()
          if (window.localStorage.getItem('opened-project')) {
            WIDGETS['functions-menu'].saveProject()
          } else WIDGETS['functions-menu'].saveSketch()
        }
      },
      // {
      //   key: `${utils.hotKey()} + O`,
      //   nfo: '',
      //   condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 79,
      //   callback: (e) => {
      //     e.preventDefault()
      //     // TODO if user logged in .openProject() else .uploadCode()
      //   }
      // },
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
        nfo: 'open the Tutorial\'s Guide',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 76,
        callback: (e) => {
          e.preventDefault()
          WIDGETS.open('tutorials-guide')
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
        nfo: 'open search',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 222,
        callback: (e) => {
          e.preventDefault()
          NNW.menu.search.open()
        }
      },
      // {
      //   key: `${utils.hotKey()} + Enter`,
      //   nfo: '',
      //   condition: (e) => (e.ctrlKey || e.metaKey) && e.keyCode === 13,
      //   callback: (e) => {
      //     //
      //   }
      // },
      {
        key: 'spacebar',
        nfo: 'play/pause tutorial',
        condition: (e) => !NNE.cm.hasFocus() && e.keyCode === 32,
        callback: (e) => {
          if (utils.tutorialOpen()) WIDGETS['hyper-video-player'].toggle()
        }
      },
      {
        key: 'esc',
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
        nfo: 'open search',
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
      }
    ]

    this.title = 'Keyboard Shortcuts'
    this.width = 400
    this._createHTML()
    this._createShortcuts()
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

  _createShortcuts () {
    this.shortcuts.forEach(sc => {
      window.addEventListener('keydown', (e) => {
        if (sc.condition(e)) sc.callback(e)
      })
    })
  }
}

window.KeyboardShortcuts = KeyboardShortcuts
