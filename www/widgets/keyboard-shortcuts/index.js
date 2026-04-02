/* global Widget, WIDGETS, NNE, NNW, utils, nn, Convo */
class KeyboardShortcuts extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'keyboard-shortcuts'
    this.keywords = ['keyboard', 'shortcut', 'keys']

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.shortcuts = [
      // .................. coding .................
      {
        key: `${utils.hotKey()} + S`,
        nfo: 'quick save / share options',
        category: 'coding',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 's',
        callback: (e) => {
          e.preventDefault()
          WIDGETS['coding-menu'].save()
        }
      },
      {
        key: `${utils.hotKey()} + O`,
        nfo: 'open project / upload sketch',
        category: 'coding',
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
        category: 'coding',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 'n',
        callback: (e) => {
          e.preventDefault()
          WIDGETS['coding-menu'].new()
        }
      },
      {
        key: `${utils.hotKey()} + Enter`,
        nfo: 'update/refresh output',
        category: 'coding',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 'Enter',
        callback: (e) => {
          // SEE _preventCodeMirrorDefaults BELLOW
        }
      },
      {
        key: `${utils.hotKey()} + C`,
        nfo: 'copy selected text',
        category: 'coding'
      },
      {
        key: `${utils.hotKey()} + V`,
        nfo: 'paste from clipboard',
        category: 'coding'
      },
      {
        key: `${utils.hotKey()} + /`,
        nfo: 'toggle comment on selected lines',
        category: 'coding'
      },
      {
        key: `${utils.hotKey()} + D`,
        nfo: 'select next instance of selected text (multi-cursor)',
        category: 'coding'
      },
      {
        key: `${utils.hotKey()} + Left Arrow`,
        nfo: 'jump to start of line',
        category: 'coding'
      },
      {
        key: `${utils.hotKey()} + Right Arrow`,
        nfo: 'jump to end of line',
        category: 'coding'
      },
      {
        key: `${utils.hotKey()} + Shift + Left Arrow`,
        nfo: 'select to start of line',
        category: 'coding'
      },
      {
        key: `${utils.hotKey()} + Shift + Right Arrow`,
        nfo: 'select to end of line',
        category: 'coding'
      },
      // .................. tutorial .................
      {
        key: 'Spacebar',
        nfo: 'play/pause tutorial',
        category: 'tutorial',
        condition: (e) => !NNE.cm.hasFocus() && e.key === ' ',
        callback: (e) => {
          const hvp = WIDGETS['hyper-video-player']
          if (hvp?.opened && !NNE.cm.hasFocus()) hvp.toggle()
        }
      },
      {
        key: 'Right Arrow',
        nfo: 'skip ahead 5s in tutorial',
        category: 'tutorial',
        condition: (e) => e.key === 'ArrowRight',
        callback: (e) => {
          const hvp = WIDGETS['hyper-video-player']
          if (hvp?.opened && !NNE.cm.hasFocus()) hvp.skip(5)
        }
      },
      {
        key: 'Left Arrow',
        nfo: 'jump back 5s in tutorial',
        category: 'tutorial',
        condition: (e) => e.key === 'ArrowLeft',
        callback: (e) => {
          const hvp = WIDGETS['hyper-video-player']
          if (hvp?.opened && !NNE.cm.hasFocus()) hvp.skip(-5)
        }
      },
      // .................. netnet .................
      {
        key: `${utils.hotKey()} + >`,
        nfo: 'switch netnet to next layout',
        category: 'netnet',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === '.',
        callback: (e) => {
          e.preventDefault()
          NNW.nextLayout()
        }
      },
      {
        key: `${utils.hotKey()} + <`,
        nfo: 'swtich netnet to previous layout',
        category: 'netnet',
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
        category: 'netnet',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 'l',
        callback: (e) => {
          e.preventDefault()
          WIDGETS.open('learning-guide')
        }
      },
      {
        key: `${utils.hotKey()} + ;`,
        nfo: 'open the Coding Menu',
        category: 'netnet',
        condition: (e) => ((e.ctrlKey || e.metaKey) && e.key === ';'),
        callback: (e) => {
          e.preventDefault()
          WIDGETS.open('coding-menu')
        }
      },
      {
        key: `${utils.hotKey()} + '`,
        nfo: 'open universal search bar',
        category: 'netnet',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === "'",
        callback: (e) => {
          e.preventDefault()
          NNW.menu.search.open()
        }
      },
      {
        key: 'Esc',
        nfo: 'close widget / close search',
        category: 'netnet',
        condition: (e) => e.key === 'Escape',
        callback: (e) => {
          e.preventDefault()
          if (NNW.menu.search.opened) NNW.menu.search.close()
          else utils.closeTopMostWidget()
        }
      },
      {
        key: `${utils.hotKey()} + Shift + K`,
        nfo: 'kiosk mode',
        category: 'netnet',
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
        hidden: true,
        key: `${utils.hotKey()} + G`,
        nfo: 'open git version control',
        category: 'netnet',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.key === 'g',
        callback: (e) => {
          e.preventDefault()
          WIDGETS.open('git-push')
        }
      },
      {
        hidden: true,
        key: `${utils.hotKey()} + Shift + P`,
        nfo: 'open the Search Bar',
        category: 'netnet',
        condition: (e) => (e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p',
        callback: (e) => {
          e.preventDefault() // CTRL/CMD+SHIFT+P
          e.stopPropagation() // TODO... not working :(
          window.event.cancelBubble = true
          NNW.menu.search.open()
          return false
        }
      }
    ]

    this.title = 'Keyboard Shortcuts'
    this.width = 862
    this.height = 404
    this._createHTML()
    this._createShortcuts()
    this._preventCodeMirrorDefaults()
  }

  explain () {
    window.convo = new Convo(this.convos, this.selected)
  }

  select (val, skipExplain) {
    const normalizeKey = s => {
      if (s === 'Left Arrow') return 'left'
      if (s === 'Right Arrow') return 'right'
      if (s.includes('arrow')) return s.split(' ')[0]
      if (s === '<') return 'comma'
      if (s === '>') return 'period'
      if (s === ';') return 'semi'
      if (s === '\'') return 'quote'
      if (s === '/') return 'fwd-slash'
      return s.toLowerCase()
    }

    const key = this.shortcuts.find(k => k.key === val)
    nn.get('#keyboard-shortcuts__nfo').content(key.nfo)
    const sel = key.key.toLowerCase().split(' + ').map(s => normalizeKey(s))
    nn.get('key-board').clearAllHighlights()
    const c = utils.getVal('--fg-color')
    sel.forEach(s => nn.get('key-board').highlightKey(s, c))

    // for convos
    this.selected = val
      .replace(/CMD/g, 'hotkey')
      .replace(/CTRL/g, 'hotkey')
      .split(' + ')
      .map(normalizeKey)
      .join('-')

    if (!skipExplain) this.explain()
  }

  _updateSelectList (cat) {
    const keys = this.shortcuts
      .filter(k => !k.hidden)
      .filter(k => k.category === cat)
      .map(k => k.key)
    nn.get('#keyboard-shortcuts__sel-type').innerHTML = ''
    nn.get('#keyboard-shortcuts__sel-type')
      .set('options', keys)
      .on('change', e => this.select(e.target.value))
  }

  _createHTML () {
    utils.get(`./widgets/${this.key}/index.html`, html => {
      this.innerHTML = html
      this._updateSelectList('coding')
      this.select(`${utils.hotKey()} + S`, true)
      nn.get('#keyboard-shortcuts__sel-cat')
        .on('change', e => this._updateSelectList(e.target.value))
    }, true)
  }

  _preventCodeMirrorDefaults () {
    // run update when autoUpdate(false) handler
    NNE.cm.on('keyHandled', (a, b, e) => {
      if (b === 'Ctrl-Enter' || b === 'Cmd-Enter') {
        e.preventDefault()
        e.stopPropagation()
        NNE.cm.undo() // remove \n that Enter adds
        if (WIDGETS['project-files']?.projectData?.name) {
          WIDGETS['project-files'].explainSave()
        } else if (!NNE.autoUpdate) {
          console.clear()
          NNE.update()
        }
      }
    })
  }

  _createShortcuts () {
    this.shortcuts.forEach(sc => {
      if (!sc.callback) return
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
