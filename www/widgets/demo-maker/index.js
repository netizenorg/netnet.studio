/* global Widget, Convo, nn, NNE, NNW, utils */

// for new notes, must match the NOTE_PLACEHOLDER in popups/main.js
const NOTE_PLACEHOLDER = 'This is the note\'s content, you can use simple HTML, like <b>bold</b>, <i>italic</i>, or a <a href="#" target="_blank">link</a>.'

class DemoMaker extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'demo-maker'
    this.listed = true
    this.keywords = ['demos', 'sketch', 'annotations', 'notes', 'example', 'create', 'lesson']
    this.title = 'Demo Maker'
    this.hidden = true

    this.popup = null // reference to pop up widget
    this.demos = {} // directory of demos
    this.demo = null // data for demo being worked on

    // tracking note's spotlighted code (while editing demo, not part of json)
    // used to better handle code edits (tries not to loose track of spotlight)
    this._markers = {} // fid -> CodeMirror TextMarker
    this._fidCounter = 0
    this._curNoteIdx = null // whichever note is currently loaded in the popup

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    // check for spotlight issues
    // (drifts from code edits after creating spotlit note)
    NNE.on('code-update', () => {
      clearTimeout(this._focusCheckTimeout)
      this._focusCheckTimeout = setTimeout(() => {
        if (this._curNoteIdx != null) this._checkFocusStatus(this._curNoteIdx)
      }, 400)
    })

    this.on('open', () => {
      if (!this.popup) this._openPopup()
    })

    utils.get('api/demos', (res) => {
      if (res.success === false) return utils._Convo('oh-no-error', res)
      this.demos = res.data
      this._messagePopup('demo-list', this.demos)
    })

    nn.on('message', e => {
      if (e.origin !== window.location.origin) return // for security
      if (e.data.type === 'demo-mkr-opened') {
        this._messagePopup('demo-list', this.demos)
        if (this.demo) {
          this._messagePopup('demo-data', this.demo)
        }
      } else if (e.data.type === 'demo-mkr-edit-file') {
        utils.get(`api/demo/${e.data.payload}`, (demo) => {
          this.demo = demo
          this._loadData(this.demo)
          this._messagePopup('demo-data', this.demo)
        })
      } else if (e.data.type === 'demo-mkr-open-file') {
        this.demo = JSON.parse(e.data.payload)
        this._loadData(this.demo)
        this._messagePopup('demo-data', this.demo)
        this._messagePopup('demo-list', this.demos)
      } else if (e.data.type === 'demo-mkr-get-selection') {
        this._messagePopup('demo-mkr-selection', this._getSelectionSpotlight())
      } else if (e.data.type === 'demo-mkr-spotlight') {
        NNE.spotlight(e.data.payload)
        this._deselect()
      } else if (e.data.type === 'demo-mkr-preview') {
        this._preview(e.data.payload)
      } else if (e.data.type === 'demo-mkr-loaded-note') {
        this._curNoteIdx = e.data.payload
        this._checkFocusStatus(e.data.payload)
        if (NNW.menu.textBubble.opened) {
          this._preview(e.data.payload)
        }
      } else if (e.data.type === 'demo-mkr-update') {
        const demo = JSON.parse(e.data.payload)
        demo.info = demo.info.map(o => { delete o.id; return o })
        if (!this.demo || !this.demo.key) {
          if (NNW.layout === 'welcome') NNW.layout = 'dock-left'
          const hasCode = NNE.code !== '' && NNE.code !== utils.starterCode()
          if (hasCode) {
            this._pendingDemo = demo
            this.convos = window.CONVOS[this.key](this)
            window.convo = new Convo(this.convos, 'clear-code?')
            return
          }
          utils.afterLayoutTransition(() => {
            if (window.convo && window.convo.id !== 'clear-code?') {
              window.convo.hide()
            }
          })
          NNE.code = ''
        }
        this.demo = demo
        this._reconcileMarkers(this.demo)
      } else if (e.data.type === 'demo-mkr-download') {
        this._downloadJSON()
      } else if (e.data.type === 'demo-mkr-gen-url') {
        this._generateURL()
      } else if (e.data.type === 'explain') {
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, e.data.payload)
      }
    })

    nn.on('beforeunload', () => {
      if (this.popup && !this.popup.closed) this.popup.close()
    })
  }

  _openPopup (type, payload) {
    const url = 'widgets/demo-maker/popups/index.html'
    this.popup = window.open(url, 'example-widget', 'width=760,height=480')
    // keep an eye on the pop up to see if it closed
    this.popupWatcher = setInterval(() => {
      if (this.popup && this.popup.closed) {
        clearInterval(this.popupWatcher)
        this.popup = null
      }
    }, 500)
  }

  _messagePopup (type, payload) {
    if (!this.popup) return
    this.popup.postMessage({ type, payload }, window.origin)
  }

  _resumeNewDemo () {
    this._markers = {}
    this.demo = this._pendingDemo
    this._pendingDemo = null
  }

  _getSelectionSpotlight () {
    const cm = NNE.cm
    const items = []
    if (!cm.somethingSelected()) {
      items.push(cm.getCursor().line + 1)
    } else {
      cm.listSelections().forEach(range => {
        const from = range.from()
        const to = range.to()
        if (from.line === to.line) {
          items.push({ line: from.line + 1, startCol: from.ch, endCol: to.ch })
        } else {
          for (let n = from.line; n <= to.line; n++) items.push(n + 1)
        }
      })
    }
    const fids = items.map(item => this._trackItem(item))
    this._deselect()
    return { items, fids }
  }

  _deselect () {
    NNE.cm.setCursor(NNE.cm.getCursor())
  }

  // ...........................................................................
  // ........................................................ spotlight tracking
  // so demo changes don't ruin spotlights (FYI these methods were AI generated)
  // this is in-memory only (while working on demo), not part of exported json
  // ...........................................................................

  _markerRangeFor (item) {
    const cm = NNE.cm
    const line = typeof item === 'object' ? item.line : item
    const idx = line - 1
    const lineLen = (cm.getLine(idx) || '').length
    const startCol = (typeof item === 'object' && item.startCol) ? item.startCol : 0
    const endCol = (typeof item === 'object' && item.endCol != null) ? item.endCol : lineLen
    const from = { line: idx, ch: startCol }
    let to = { line: idx, ch: endCol }
    // a zero-width mark (e.g. a blank line) gets auto-cleared by CodeMirror
    // the instant it's created — extend it to include the line's trailing
    // newline instead, so it has real width to anchor to
    if (startCol === endCol && idx + 1 < cm.lineCount()) {
      to = { line: idx + 1, ch: 0 }
    }
    return { from, to }
  }

  _trackItem (item) {
    const { from, to } = this._markerRangeFor(item)
    const marker = NNE.cm.markText(from, to)
    const fid = `f${this._fidCounter++}`
    // a marker only tracks *position* — it happily survives someone
    // selecting its text and typing something else over it. Remembering
    // the original text lets us catch that as "changed" too, not just
    // outright deletion (which is the only thing that clears a marker).
    this._markers[fid] = { marker, text: NNE.cm.getRange(from, to) }
    return fid
  }

  // resolves a tracked item to wherever its code currently lives;
  // returns null if that code can no longer be found (marker cleared,
  // or its text was edited into something else)
  _resolveItem (fid, fallbackItem) {
    const entry = fid && this._markers[fid]
    if (!entry) return fallbackItem // never tracked (shouldn't normally happen)
    const found = entry.marker.find()
    if (!found) return null // the code it was anchored to is gone
    if (NNE.cm.getRange(found.from, found.to) !== entry.text) return null // it changed
    const line = found.from.line + 1
    const startCol = found.from.ch
    const lineLen = (NNE.cm.getLine(found.from.line) || '').length
    // clamp to this line even if the mark spilled onto the next one
    // (e.g. our own blank-line trick, or the line got split by an edit)
    const endCol = found.to.line === found.from.line ? found.to.ch : lineLen
    if (startCol === 0 && endCol === lineLen) return line
    return { line, startCol, endCol }
  }

  _resolveNoteFocus (note) {
    if (!note.focus || note.focus.length === 0) return { resolved: null, lost: [] }
    const fids = note._focusFids || []
    const lost = []
    const resolved = []
    note.focus.forEach((item, i) => {
      const r = this._resolveItem(fids[i], item)
      if (r === null) lost.push(item)
      else resolved.push(r)
    })
    return { resolved: resolved.length > 0 ? resolved : null, lost }
  }

  // wraps stored (JSON) focus items in live markers so this session can
  // track them going forward, without changing the JSON itself
  _hydrateMarkers (demo) {
    this._markers = {}
    this._fidCounter = 0
    if (!demo.info) return
    demo.info.forEach(note => {
      note._focusFids = note.focus ? note.focus.map(item => this._trackItem(item)) : null
    })
  }

  // garbage-collect markers no longer referenced by any note
  // (covers "clear", note deletion, reordering, etc. all in one place)
  _reconcileMarkers (demo) {
    const active = new Set()
    ;(demo.info || []).forEach(note => {
      (note._focusFids || []).forEach(fid => { if (fid) active.add(fid) })
    })
    Object.keys(this._markers).forEach(fid => {
      if (!active.has(fid)) {
        this._markers[fid].marker.clear()
        delete this._markers[fid]
      }
    })
  }

  // ..................................... end of spotlight tracking helpers ...
  // ...........................................................................

  _loadData (demo) {
    NNE.code = NNE._decode(demo.code.split('#code/').pop())
    NNW.layout = demo.layout || 'dock-left'
    if (!NNE.autoUpdate) NNE.update()
    if (window.convo) window.convo.hide()
    this._hydrateMarkers(demo)
  }

  _preview (noteIdx) {
    const note = this.demo.info[noteIdx]
    if (!note) return
    this._deselect()
    const { resolved, lost } = this._resolveNoteFocus(note)
    NNE.spotlight(resolved)
    this._messagePopup('demo-mkr-focus-status', { noteIdx, lost })
    window.convo = new Convo({
      content: note.text
    })
  }

  _checkFocusStatus (noteIdx) {
    const note = this.demo && this.demo.info && this.demo.info[noteIdx]
    if (!note) return
    const { lost } = this._resolveNoteFocus(note)
    this._messagePopup('demo-mkr-focus-status', { noteIdx, lost })
  }

  _getData () {
    const data = {
      key: this.demo.key,
      name: this.demo.name,
      tags: this.demo.tags,
      layout: this.demo.layout,
      code: NNE.generateHash()
    }

    const hasInfo = this.demo.info &&
        this.demo.info.length > 0 &&
        this.demo.info[0].text !== NOTE_PLACEHOLDER
    if (hasInfo) {
      data.info = this.demo.info.map(note => {
        const { resolved } = this._resolveNoteFocus(note)
        const clean = { ...note }
        delete clean._focusFids
        delete clean._warning
        delete clean._warningDismissed
        clean.focus = resolved
        return clean
      })
    }

    return data
  }

  _generateURL () {
    const data = this._getData()
    const str = JSON.stringify(data)
    const loc = window.location
    const l = data.layout !== 'dock-left' ? `?layout=${data.layout}` : ''
    const url = `${loc.protocol}//${loc.host}/${l}#demo/${NNE._encode(str)}`
    this._messagePopup('generated-url', url)
  }

  _downloadJSON () {
    const data = this._getData()
    const str = JSON.stringify(data, null, 2)
    const uri = `data:application/json;base64,${utils.btoa(str)}`
    const name = data.name.toLowerCase().replace(/\s/g, '_')
    const a = document.createElement('a')
    a.setAttribute('download', `${data.key}--${name}.json`)
    a.setAttribute('href', uri)
    a.click()
    a.remove()
  }
}

window.DemoMaker = DemoMaker
