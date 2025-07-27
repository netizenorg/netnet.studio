/* global nn, QuiltGraph, CodeMirror */
let currentPassageId, debounceTimer, filename
let globals // contains array of /* global */ variables for main comment
let netitor, netitorWatcher // netitor instance && watcher timer
const neState = { // netitor state
  type: 'globals', // or 'FUNC', 'CODE', 'B4', 'AF' (type of code being edited)
  globals: null, // all the global variables/function for this file
  // specific to current convo object bing edtied
  func: null, // code for [[option->FUNC]] being edited in currnet convo
  funcName: null, // key value of the option func being edited
  code: null, // code value of current convo
  edit: null, // edit value of current convo
  spotlight: null, // spotlight value of current convo
  before: null, // before function of current convo
  after: null // after function of current convo
}

const MSG = (data) => window.opener.postMessage(data, window.origin)

const updateWidget = () => MSG({ type: 'quilt-data-update', payload: JSON.stringify(graph.data) })

function validateName (name, type) {
  if (name === '') {
    window.alert(`A ${type} name can not be left blank`)
    return false
  } else if (/^[a-z-]+$/.test(name) === false) {
    window.alert(`A ${type} name can not contain spaces, underscores or capital letters.`)
    return false
  } else {
    return true
  }
}

// --------------------------- Pop Out Netitor .................................

function openNetitor (config) {
  if (netitor) {
    window.alert('You already have an editor open, please close it before opening a new one.')
    return
  }

  const { type, globals, funcName, func, code, edit, spotlight, before, after } = config
  Object.entries({
    type, globals, funcName, func, code, edit, spotlight, before, after
  }).forEach(([key, val]) => { if (val != null) neState[key] = val })

  netitor = window.open('code-editor.html', 'convo-maker-coder', 'width=860,height=500')
  // keep an eye on the pop up to see if it closed
  netitorWatcher = setInterval(() => {
    if (netitor && netitor.closed) {
      clearInterval(netitorWatcher)
      netitor = null
    }
  }, 500)
  // on netitor load, calls msgNetitor
}

function msgNetitor () {
  const type = neState.type
  const payload = {}
  if (type === 'FUNC') {
    payload.code = neState.func
  } else if (type === 'globals') {
    payload.globals = globals
    payload.code = neState.globals
  } else if (type === 'CODE') {
    payload.code = neState.code
    payload.edit = neState.edit
    payload.spotlight = neState.spotlight
  } else if (type === 'B4') {
    payload.before = neState.before
  } else if (type === 'AF') {
    payload.after = neState.after
  }
  netitor.postMessage({ type, payload }, window.origin)
}

// --------------------------- Convo Editor ....................................

const editInFocus = () => nn.get('#editor .name') === document.activeElement || cm.hasFocus()

function closeClearEditor () {
  nn.get('#editor').css({ display: 'none' })
  cm.setValue('')
  currentPassageId = null
  if (netitor) netitor.close()
}

function updateEditor (obj) {
  nn.get('.name').content(obj.name)
  if (obj.text) cm.setValue(obj.text)
  else cm.setValue('')
  const passage = graph.getPassageById(currentPassageId)
  createEditorMenu(passage)
}

function createEditorMenu (obj) {
  const funcLnks = nn.get('#FUNC-links')
  funcLnks.content('')
  const opts = createFuncOptions(obj)
  createCodeSelectUI(obj, opts, funcLnks)
}

function createFuncOptions (obj) {
  const links = graph.parsePassageLinks(obj)
  // create/update options
  const funcs = {} // collection previous funcs
  Object.entries(obj.options).forEach(([key, code]) => { funcs[key] = code })
  obj.options = {} // clear options && recreate
  links.forEach(l => {
    if (l.label === l.target) {
      obj.options = l.target
    } if (l.target === 'HIDE') {
      obj.options[l.label] = '(e) => e.hide()'
    } else if (l.target === 'FUNC') {
      if (funcs[l.label]) obj.options[l.label] = funcs[l.label]
      else obj.options[l.label] = '(e) => {\n\n}'
    } else if (l.target !== 'HIDE' && l.target !== 'FUNC') {
      obj.options[l.label] = `(e) => e.goTo('${l.target}')`
    }
  })
  graph.updatePassage(obj.id, obj)
  nn.get(`#card${obj.id}`).classList.add('selected')
  return { links, options: obj.options }
}

function createCodeSelectUI (obj, opts, menu) {
  const dict = {
    code: obj.code,
    before: obj.before,
    after: obj.after
  }

  opts.links
    .filter(l => l.target === 'FUNC')
    .forEach(l => { dict[`OPT: ${l.label}`] = opts.options[l.label] })

  const sel = nn.create('select').set({ options: Object.keys(dict) })
  if (neState.type === 'B4') sel.value = 'before'
  else if (neState.type === 'AF') sel.value = 'after'
  else if (neState.type === 'FUNC') {
    sel.value = `OPT: ${neState.funcName}`
  }

  nn.create('button')
    .content('edit')
    .set({ class: 'func-btn' })
    .addTo(menu)
    .on('click', (e) => {
      const payload = {}
      if (sel.value === 'before') {
        payload.type = 'B4'
        payload.before = dict.before
      } else if (sel.value === 'after') {
        payload.type = 'AF'
        payload.after = dict.after
      } else if (sel.value === 'code') {
        payload.type = 'CODE'
        payload.code = dict.code
        payload.edit = obj.edit
        payload.spotlight = obj.spotlight
      } else if (sel.value.indexOf('OPT: ') === 0) {
        payload.type = 'FUNC'
        payload.func = dict[sel.value]
        payload.funcName = sel.value.split('OPT: ')[1]
      }
      openNetitor(payload)
    })

  sel.addTo(menu)
}

function updatePassageName (e) {
  if (currentPassageId) {
    const oldName = graph.getPassageById(currentPassageId).name
    const newName = e.target.textContent
    if (graph.data.filter(p => p.name === newName).length > 0) {
      e.target.textContent = oldName
      return window.alert(`The name "${newName}" is already taken.`)
    } else {
      if (!validateName(newName, 'passage')) e.target.textContent = oldName
      else graph.updatePassage(currentPassageId, { name: newName })
    }
  }
}

function createMissingLinkedPassages () {
  if (!currentPassageId && !graph.getSelectedPassages()) {
    return window.alert('You don\'t have a passage selected')
  }
  const before = graph.data.length
  const p = graph.getPassageById(currentPassageId)
  graph.createMissingPassages(p)
  graph.data.filter(p => p.name === 'HIDE' || p.name === 'FUNC')
    .forEach(p => graph.deletePassage(p.id))
  const after = graph.data.length
  if (before === after) window.alert('This passage has no missing links')
}

// --------------------------- File Menu Functions .............................

function openNewFile () {
  closeClearEditor()
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.js'
  input.onchange = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new window.FileReader()
    reader.onload = evt => {
      try {
        MSG({ type: 'quilt-open-file', payload: evt.target.result })
      } catch (err) {
        console.error('Failed to parse convo file:', err)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

function loadNewFile (file) {
  nn.getAll('.quilt-card').forEach(e => e.remove())
  updateDisplayFilename(file.name)
  if (file.data) graph.data = file.data
  if (file.variables) neState.globals = file.variables
  if (file.globals) globals = file.globals
  graph.update()
}

function updateDisplayFilename (name) {
  filename = name
  nn.get('#convo-name').value = filename
  nn.get('.menu-bar > div:nth-child(2)').css({ visibility: 'visible' })
  nn.get('.menu-bar').css({ height: 82 })
  nn.get('#graph-wrapper').css({ top: 82 })
}

function readyForNewFile (t) {
  if (!filename) return true
  let m = 'You\'re currently working on a convo file, '
  m += `are you sure you want to discard this one and ${t} something new?`
  return window.confirm(m)
}

// -----------------------------------------------------------------------------
// ------------------------------- FILE && CONVO MENU (Main UI Setup) ----------
// -----------------------------------------------------------------------------

nn.get('#new-file').on('click', () => {
  const allClear = readyForNewFile('start')
  if (allClear) {
    const name = window.prompt('What would you like to name this new convo?')
    if (!validateName(name, 'convo')) return
    updateDisplayFilename(name)
    MSG({ type: 'quilt-new-file', payload: name })
  }
})

nn.get('#open-file').on('click', () => {
  const allClear = readyForNewFile('open')
  if (allClear) openNewFile()
})

nn.get('#save-file').on('click', () => {
  const cards = graph.data.length
  if (filename && cards > 0) {
    if (netitor) netitor.close()
    MSG({ type: 'quilt-save-file' })
  }
  if (filename && cards <= 0) window.alert('You must create at least one passage first.')
  else if (!filename) window.alert('Nothing to save, open or create a new convo first.')
})

nn.get('#custom-code').on('click', () => {
  openNetitor({ type: 'globals' })
})

nn.get('#convo-name').on('input', (e) => {
  const newName = e.target.value
  const oldName = filename
  if (!validateName(newName, 'convo')) {
    e.target.value = oldName
  } else {
    updateDisplayFilename(newName)
    MSG({ type: 'quilt-name-update', payload: newName })
  }
})

nn.get('#new').on('click', () => {
  if (!filename) window.alert('You must create a "new-file" first')
  else {
    const psg = graph.newPassage()
    psg.options = {}
    graph.updatePassage(psg.id, psg)
  }
})

nn.get('#delete').on('click', () => {
  if (!graph.getSelectedPassages()) window.alert('You don\'t have a passage selected')
})

nn.get('#create-missing-links').on('click', createMissingLinkedPassages)

nn.get('.name').on('input', updatePassageName)

nn.get('.close').on('click', closeClearEditor)

nn.on('mousemove', (e) => {
  const rect = graph.container.getBoundingClientRect()
  graph.mouseX = e.clientX - rect.left
  graph.mouseY = e.clientY - rect.top
})

nn.on('keydown', (e) => {
  if (e.key === 'Escape') closeClearEditor()
  else if (e.key === 'n' && !currentPassageId) {
    graph.newPassage(null, null, graph.mouseX, graph.mouseY)
  } else if (e.key === 'Backspace' && !editInFocus()) {
    const selected = graph.getSelectedPassages()
    if (selected) selected.forEach(p => graph.deletePassage(p.id))
  }
})

// -----------------------------------------------------------------------------
// --------------------------------------------- Graph Setup --------------------
// -----------------------------------------------------------------------------

const graph = new QuiltGraph({
  container: '#graph-container',
  connectionColor: 'var(--netizen-text)',
  menu: { zoom: '#zoom', delete: '#delete' }
})

graph.setZoom(1)

graph.updateGridColor(240, 31, 46, 0.20, 1, 4)

graph.on('delete', (obj) => {
  if (obj.id === currentPassageId) {
    nn.get('#editor').css({ display: 'none' })
    currentPassageId = null
    if (netitor) netitor.close()
  }
})

graph.on('selected', (obj) => {
  nn.get('#delete').css({ opacity: 1 })
  nn.get('#create-missing-links').css({ opacity: 1 })
  if (document.querySelector('#editor').style.display === 'block') {
    currentPassageId = obj.id
    if (netitor) netitor.close()
    updateEditor(obj)
  }
})

graph.on('unselected', (obj) => {
  if (!graph.getSelectedPassages()) {
    nn.get('#delete').css({ opacity: 0.5 })
    nn.get('#create-missing-links').css({ opacity: 0.5 })
  }
})

graph.on('dblclick', (obj) => {
  currentPassageId = obj.id
  if (netitor) netitor.close()
  nn.get('#editor').css({ display: 'block' })
  updateEditor(obj)
})

// -----------------------------------------------------------------------------
// --------------------------------------- CodeMirror Setup --------------------
// -----------------------------------------------------------------------------

const cm = CodeMirror.fromTextArea(nn.get('#editor textarea'), {
  mode: 'nnConvoMode',
  lineNumbers: false,
  theme: 'default',
  lineWrapping: true
})

cm.on('change', (instance, changeObj) => {
  if (changeObj.origin !== 'setValue' && currentPassageId) {
    graph.updatePassage(currentPassageId, { text: instance.getValue() })
    createEditorMenu(graph.getPassageById(currentPassageId))
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(updateWidget, 1500)
  }
})

// -----------------------------------------------------------------------------
// --------------------------------- Widget Messaging Setup --------------------
// -----------------------------------------------------------------------------

window.addEventListener('message', (e) => {
  // console.log(e.data);
  if (e.origin !== window.location.origin) return

  if (e.data.type === 'new-file-data') {
    // convo-widget has some data to give us
    loadNewFile(e.data.payload)
    // ...
  } else if (e.data.type === 'netitor-ready') {
    // netitor window is ready for content
    msgNetitor()
    // ...
  } else if (e.data.type === 'netitor-globals-update') {
    // netitor has updated global variables
    globals = e.data.payload.globals
    neState.globals = e.data.payload.code
    const payload = { globals, code: neState.globals }
    MSG({ type: 'quilt-globals-update', payload })
    // ...
  } else if (e.data.type === 'netitor-func-update') {
    // netitor has updated a passage's option's func
    neState.func = e.data.payload.code
    const obj = graph.getPassageById(currentPassageId)
    obj.options[neState.funcName] = neState.func
    graph.updatePassage(obj.id, obj)
    createEditorMenu(obj)
    updateWidget()
    // ...
  } else if (e.data.type === 'netitor-code-update') {
    // netitor has updated a passage's code property
    const obj = graph.getPassageById(currentPassageId)
    obj.code = neState.code = e.data.payload.code
    obj.edit = neState.edit = e.data.payload.edit
    obj.spotlight = neState.spotlight = e.data.payload.spotlight
    graph.updatePassage(obj.id, obj)
    createEditorMenu(obj)
    updateWidget()
    // ...
  } else if (e.data.type === 'netitor-before-update') {
    // netitor has updated a passage's before function
    const obj = graph.getPassageById(currentPassageId)
    obj.before = neState.before = e.data.payload.code
    graph.updatePassage(obj.id, obj)
    createEditorMenu(obj)
    updateWidget()
    // ...
  } else if (e.data.type === 'netitor-after-update') {
    // netitor has updated a passage's after function
    const obj = graph.getPassageById(currentPassageId)
    obj.after = neState.after = e.data.payload.code
    graph.updatePassage(obj.id, obj)
    createEditorMenu(obj)
    updateWidget()
    // ...
  }
})

nn.on('load', () => {
  MSG({ type: 'quilt-opened' })
})

nn.on('beforeunload', () => {
  if (netitor && !netitor.closed) netitor.close()
})
