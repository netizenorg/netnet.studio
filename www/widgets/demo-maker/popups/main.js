/* global Netitor, nn */

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
    const note = { id: 0, focus: null, text: '...', title: 'getting started' }
    DEMO.info = [note]
    nn.get('#note-list').addStep(note)
  }
  // setup event listeners
  nn.get('#note-list').on('selected', (e) => loadNote(e.detail.id))
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
  nn.get('#note-nums').value = note.focus ? note.focus.join(', ') : ''
  nn.get('#note-list').selectStep(curNoteIdx)
  ne.code = note.text || '...'
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

function updateNoteFocus () {
  const note = DEMO.info[curNoteIdx]
  let val = nn.get('#note-nums').value.trim()
  const lastChar = val.slice(-1)
  if (lastChar === ',') val = val.slice(0, -1)
  if (val === '') note.focus = null
  else {
    note.focus = val.split(',').flatMap(f => {
      if (f.includes('-')) {
        const [start, end] = f.split('-').map(n => Number(n))
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
      } else {
        return Number(f)
      }
    })
  }
  nn.get('#note-list').updateStep(note)
  updateWidget()
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

nn.get('#delete').on('click', () => deleteNote(curNoteIdx))

// ..................................................

nn.get('#note-title').on('input', updateNoteTitle)
nn.get('#note-title').on('focus', closeNotesList)

nn.get('#note-nums').on('input', updateNoteFocus)
nn.get('#note-nums').on('focus', closeNotesList)

const ne = new Netitor({
  ele: '#note-info',
  code: '...',
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
ne.cm.on('focus', closeNotesList)

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
  }
})

nn.on('load', () => {
  MSG('demo-mkr-opened')
})
