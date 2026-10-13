/* global Netitor, nn */

// for new notes, must match the one in index.js
const NOTE_PLACEHOLDER = 'This is the note\'s content, you can use simple HTML, like <b>bold</b>, <i>italic</i>, or a <a href="#" target="_blank">link</a>.'

let curNoteIdx = 0
let demos = []
const DEMO = { key: null, info: [] }

// ------------------------------------------------------------------- FUNCTIONS

const MSG = (type, payload) => {
  window.opener.postMessage({ type, payload }, window.origin)
}

function explain (btn) {
  const convo = btn.getAttribute('name')
  MSG('explain', convo)
}

// ....................................................... LOADING DATA ........

function newDemo (confirmed) {
  if (DEMO.key && !confirmed) window.modal.open('new-demo-confirm')
  else {
    DEMO.key = Date.now()
    DEMO.info = []
    loadData(DEMO)
    displayNoteUI()
    window.modal.close()
    updateWidget()
  }
}

function editDemo () {
  if (!DEMO.key) window.modal.open('pick-demo')
  else {
    window.modal.open('pick-demo-confirm')
    displayNoteUI()
    updateWidget()
  }
}

function loadData (demo) {
  DEMO.key = demo.key

  nn.get('#demo-name').value = demo.name || ''

  if (demo.tags && demo.tags instanceof Array) {
    nn.get('#tags').value = demo.tags.join(', ')
  } else if (demo.tags && typeof demo.tags === 'string') {
    nn.get('#tags').value = demo.tags.replace(/ /g, ', ')
  } else {
    nn.get('#tags').value = ''
  }

  nn.get('#layout').value = demo.layout || 'dock-left'

  DEMO.info = demo.info || []
  newNoteList(demo)
  loadNote(0)

  window.modal.close()
  displayNoteUI()
}

function parseTags () {
  let val = nn.get('#tags').value.trim()
  const lastChar = val.slice(-1)
  if (lastChar === ',') val = val.slice(0, -1)
  if (val === '') return null
  return val.split(',').map(s => s.trim()).filter(s => s !== '')
}

// ....................................................... DOWNLOADING DATA ....

function downloadJSON () {
  if (!DEMO.key) {
    return window.modal.open('need-to-start')
  } else if (nn.get('#demo-name').value === '') {
    return window.modal.open('missing-name')
  }
  MSG('demo-mkr-download')
}

function generateURL () {
  if (!DEMO.key) {
    return window.modal.open('need-to-start')
  }
  window.modal.open('generating-url')
  MSG('demo-mkr-gen-url')
}

// ....................................................... SEND UPDATE TO WIDGET

function updateWidget () {
  const payload = {
    name: nn.get('#demo-name').value,
    tags: parseTags(),
    layout: nn.get('#layout').value,
    key: DEMO.key,
    info: DEMO.info
  }
  MSG('demo-mkr-update', JSON.stringify(payload))
}

// `~ ~ ~ ~ ~ ~ ~ ~ `~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~`~ Note Functions`~ ~ ~ ~ ~ ~

function displayNoteUI () {
  nn.get('main').css({ opacity: 1 })
  nn.get('#demo-settings').css({ opacity: 1 })
}

function newNoteList (demo = {}) {
  const oldList = nn.get('#note-list')
  const newList = nn.create('reorderable-list').set({ id: 'note-list' })
  oldList.replaceWith(newList)
  // populate steps
  if (demo.info instanceof Array && demo.info.length > 0) {
    demo.info.forEach((note, idx) => {
      note.id = idx
      nn.get('#note-list').addStep(note)
    })
  } else {
    const note = { id: 0, focus: null, text: NOTE_PLACEHOLDER, title: 'getting started' }
    DEMO.info = [note]
    nn.get('#note-list').addStep(note)
  }
  // setup event listeners
  nn.get('#note-list').on('selected', (e) => {
    loadNote(e.detail.id)
    closeNoteListModal()
  })
  nn.get('#note-list').on('remove', (e) => deleteNote(e.detail.id))
  nn.get('#note-list').on('reordered', (e) => reorderNotes(e.detail))
  nn.get('#note-list').on('opened', async () => {
    await nn.sleep(300)
    const s = { top: nn.get('body').scrollHeight, behavior: 'smooth' }
    window.scrollTo(s)
  })
  // select first one
  curNoteIdx = 0
  nn.get('#note-list').selectStep(0)
}

function loadNote (idx) {
  if (idx < 0) idx = DEMO.info.length + idx
  if (idx > DEMO.info.length - 1) idx = idx % DEMO.info.length
  curNoteIdx = idx
  const note = DEMO.info[curNoteIdx] || {}
  nn.get('#note-title').value = note.title || ''
  nn.get('#note-list').selectStep(curNoteIdx)
  ne.code = note.text || NOTE_PLACEHOLDER
  hideInfoBar()
  updateWarningIcon()
  MSG('demo-mkr-loaded-note', curNoteIdx)
}

function newNote () {
  const note = { title: null, focus: null, text: null }
  note.id = DEMO.info.length
  DEMO.info.push(note)
  loadNote(note.id)
  nn.get('#note-list').addStep(note)
  updateWidget()
}

function reorderNotes (e) {
  const { oldid: from, newid: to } = e
  const item = DEMO.info.splice(from, 1)[0]
  DEMO.info.splice(to, 0, item)
  loadNote(to)
  updateWidget()
}

function closeNotesList () {
  if (nn.get('#note-list').offsetHeight > 50) {
    nn.get('#note-list').dropdownActivated()
  }
}

function openNoteListModal () {
  nn.get('#note-list-modal').css({ display: 'flex' })
}

function closeNoteListModal () {
  nn.get('#note-list-modal').css({ display: 'none' })
}

function deleteNote (idx) {
  if (DEMO.info.length < 2) return window.modal.open('need-one-note')
  // update DEMO.info array...
  if (idx > -1 && idx < DEMO.info.length) DEMO.info.splice(idx, 1)
  for (let i = idx; i < DEMO.info.length; i++) { DEMO.info[i].id = i }
  // ...update the UI
  nn.get('#note-list').updateStep(idx, 'remove')
  loadNote(idx === 0 ? idx : idx - 1)
  updateWidget()
}

function updateNoteTitle () {
  const note = DEMO.info[curNoteIdx]
  note.title = nn.get('#note-title').value
  nn.get('#note-list').updateStep(note)
  updateWidget()
}

function addFocusFromSelection () {
  MSG('demo-mkr-get-selection', null)
}

function describeFocusItems (items) {
  if (items.length === 1) {
    const item = items[0]
    return typeof item === 'object'
      ? `added part of line ${item.line} to spotlight list`
      : `added line ${item} to spotlight list`
  }
  const allWholeLines = items.every(i => typeof i === 'number')
  return allWholeLines
    ? `added lines ${items.join(', ')} to spotlight list`
    : `added ${items.length} selections to spotlight list`
}

function describeLostFocus (lost) {
  const n = lost.length
  return n === 1
    ? 'this note\'s spotlight lost track of 1 location — the code it pointed to may have been edited or removed.'
    : `this note's spotlight lost track of ${n} locations — the code they pointed to may have been edited or removed.`
}

// ....................................................... INFO BAR (below main)

let infoBarFadeTimeout
function showInfoBar (text, opts = {}) {
  clearTimeout(infoBarFadeTimeout)
  const bar = nn.get('#note-info-bar')
  bar.style.transition = 'none'
  bar.style.opacity = 1
  bar.hidden = false
  nn.get('#note-info-bar-text').textContent = text
  nn.get('#note-info-bar-dismiss').hidden = !opts.dismissible
  bar.dataset.noteIdx = opts.noteIdx != null ? String(opts.noteIdx) : ''
}

function hideInfoBar () {
  clearTimeout(infoBarFadeTimeout)
  const bar = nn.get('#note-info-bar')
  bar.hidden = true
  bar.style.opacity = ''
  bar.style.transition = ''
  nn.get('#note-info-bar-text').textContent = ''
}

function showFocusFeedback (msg) {
  showInfoBar(msg)
  const bar = nn.get('#note-info-bar')
  infoBarFadeTimeout = setTimeout(() => {
    bar.style.transition = 'opacity 800ms ease'
    bar.style.opacity = 0
    infoBarFadeTimeout = setTimeout(() => hideInfoBar(), 800)
  }, 3000)
}

function updateWarningIcon () {
  const note = DEMO.info[curNoteIdx]
  const hasWarning = !!(note && note._warning && note._warning.length > 0)
  const dismissed = hasWarning && note._warningDismissed === JSON.stringify(note._warning)
  nn.get('#note-focus-warn').hidden = !(hasWarning && !dismissed)
}

function clearNoteFocus () {
  const note = DEMO.info[curNoteIdx]
  const hadFocus = note.focus && note.focus.length > 0
  note.focus = null
  note._focusFids = null
  note._warning = null
  note._warningDismissed = null
  nn.get('#note-list').updateStep(note)
  updateWidget()
  updateWarningIcon()
  MSG('demo-mkr-spotlight', null)
  showFocusFeedback(hadFocus ? 'cleared spotlight list' : 'spotlight list already empty')
}

// ----------------------------------------------------------------------- SETUP

nn.getAll('button[name]')
  .forEach(btn => btn.on('click', () => explain(btn)))

nn.get('#new-demo').on('click', () => newDemo())

nn.get('#edit').on('click', editDemo)

nn.get('#demo-name').on('input', updateWidget)

nn.get('#tags').on('input', updateWidget)

nn.get('#layout').on('change', updateWidget)

// ..................................................

nn.get('#new').on('click', newNote)

nn.get('#preview').on('click', () => MSG('demo-mkr-preview', curNoteIdx))

nn.get('#note-prev').on('click', () => loadNote(curNoteIdx - 1))

nn.get('#note-next').on('click', () => loadNote(curNoteIdx + 1))

nn.get('#note-view-all').on('click', openNoteListModal)

nn.get('#note-list-modal-close').on('click', closeNoteListModal)

nn.get('#delete').on('click', () => deleteNote(curNoteIdx))

// ..................................................

nn.get('#note-title').on('input', updateNoteTitle)
nn.get('#note-title').on('focus', closeNotesList)

nn.get('#note-focus-add').on('click', addFocusFromSelection)
nn.get('#note-focus-clear').on('click', clearNoteFocus)

nn.get('#note-focus-warn').on('click', () => {
  const note = DEMO.info[curNoteIdx]
  if (!note || !note._warning) return
  showInfoBar(describeLostFocus(note._warning), { dismissible: true, noteIdx: curNoteIdx })
})

nn.get('#note-info-bar-dismiss').on('click', () => {
  const idx = nn.get('#note-info-bar').dataset.noteIdx
  if (idx !== '') {
    const note = DEMO.info[Number(idx)]
    // remember exactly *what* was dismissed, so a further change to the
    // spotlight (a different lost-items set) still re-triggers the warning
    if (note && note._warning) note._warningDismissed = JSON.stringify(note._warning)
    if (Number(idx) === curNoteIdx) updateWarningIcon()
  }
  hideInfoBar()
})

const ne = new Netitor({
  ele: '#note-info',
  code: NOTE_PLACEHOLDER,
  wrap: true,
  hint: false,
  lint: false,
  language: 'html'
})
ne.cm.setOption('lineNumbers', false)
ne.cm.on('blur', () => {
  DEMO.info[curNoteIdx].text = ne.code
  updateWidget()
})
ne.cm.on('focus', () => {
  if (ne.code === NOTE_PLACEHOLDER) ne.cm.execCommand('selectAll')
  closeNotesList()
})

// ..................................................

nn.get('#upload').on('click', () => window.modal.open('upload'))

nn.get('#download').on('click', downloadJSON)

nn.get('#gen-link').on('click', generateURL)

// ..................................................

nn.on('keydown', (e) => {
  const onBody = e.target === document.body
  if (onBody && e.key === 'ArrowLeft') loadNote(curNoteIdx - 1)
  else if (onBody && e.key === 'ArrowRight') loadNote(curNoteIdx + 1)
  else if (onBody && e.key === 'ArrowDown') loadNote(curNoteIdx + 1)
  else if (onBody && e.key === 'ArrowUp') loadNote(curNoteIdx - 1)
})

nn.on('message', (e) => {
  if (e.origin !== window.location.origin) return
  const { type, payload } = e.data
  if (type === 'demo-data') {
    loadData(payload)
  } else if (type === 'demo-list') {
    demos = Object.values(payload)
    if (window.modal.opened === 'pick-demo') {
      window.modal.open('pick-demo', demos)
    }
  } else if (type === 'generated-url') {
    window.modal.open('new-url', payload)
  } else if (type === 'demo-mkr-selection') {
    const { items, fids } = payload || {}
    if (!items || items.length === 0) return
    const note = DEMO.info[curNoteIdx]
    if (!note.focus) note.focus = []
    if (!note._focusFids) note._focusFids = []
    const added = []
    items.forEach((item, i) => {
      const exists = note.focus.some(f => JSON.stringify(f) === JSON.stringify(item))
      if (!exists) {
        note.focus.push(item)
        note._focusFids.push(fids[i])
        added.push(item)
      }
    })
    if (added.length > 0) {
      note._warningDismissed = null
      updateWarningIcon()
    }
    nn.get('#note-list').updateStep(note)
    updateWidget()
    MSG('demo-mkr-spotlight', note.focus)
    showFocusFeedback(added.length > 0 ? describeFocusItems(added) : 'already in spotlight list')
  } else if (type === 'demo-mkr-focus-status') {
    const { noteIdx, lost } = payload || {}
    const note = DEMO.info[noteIdx]
    if (!note) return
    note._warning = lost && lost.length > 0 ? lost : null
    if (noteIdx === curNoteIdx) updateWarningIcon()
  }
})

nn.on('load', () => {
  MSG('demo-mkr-opened')
})
