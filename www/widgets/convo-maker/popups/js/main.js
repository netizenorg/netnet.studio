/* global QuiltGraph CodeMirror nn filemenu */

let debounceTimer // debounce timer to send main widget updates
let curPsg // reference to currently open passage object

// message netnet (ie. convo-maker widget)
const MSG = (data) => window.opener.postMessage(data, window.origin)

// message netnet's convo-maker widget about convo data update
const updateWidget = () => MSG({ type: 'cnvmkr-data-update', payload: JSON.stringify(graph.data) })

// -----------------------------------------------------------------------------
// --------------------------------------------- Graph Setup -------------------
// -----------------------------------------------------------------------------

const graph = new QuiltGraph({
  container: '#graph-container',
  connectionColor: 'var(--netizen-text)',
  menu: { zoom: '#zoom', delete: '#delete' }
})

graph.setZoom(1)

graph.updateGridColor(240, 31, 46, 0.20, 1, 4)

graph.on('delete', (obj) => {
  if (obj.id === curPsg.id) {
    curPsg = null
    nn.get('#editor').css({ display: 'none' })
    if (netitor) netitor.close()
  }
})

graph.on('selected', (obj) => {
  nn.get('#delete').css({ opacity: 1 })
  const sels = graph.getSelectedPassages()
  if (sels.length === 1 && nn.get('#editor').style.display === 'block') {
    curPsg = obj
    if (netitor) netitor.close()
    updateEditor()
  }
})

graph.on('unselected', (obj) => {
  if (!graph.getSelectedPassages()) {
    nn.get('#delete').css({ opacity: 0.5 })
  }
})

graph.on('dblclick', (obj) => {
  curPsg = obj
  if (netitor) netitor.close()
  nn.get('#editor').css({ display: 'block' })
  updateEditor()
})

// -----------------------------------------------------------------------------
// --------------------------------------------- Passage Editor Setup ----------
// -----------------------------------------------------------------------------

const editInFocus = () => {
  return nn.get('#editor .name') === document.activeElement || cm.hasFocus()
}

function closeClearEditor () {
  curPsg = null
  nn.get('#editor').css({ display: 'none' })
  cm.setValue('')
  if (netitor) netitor.close()
}

function updateEditor () {
  nn.get('.name').content(curPsg.name)
  if (curPsg.text) cm.setValue(curPsg.text)
  else cm.setValue('')
  nn.get('.layout').value = curPsg.layout || 'default'
  createEditorMenu()
}

function createEditorMenu () {
  const funcLnks = nn.get('#FUNC-links')
  funcLnks.content('')
  const opts = createFuncOptions()
  createCodeSelectUI(opts, funcLnks)
}

function createFuncOptions () {
  const links = graph.parsePassageLinks(curPsg)
  // create/update options
  const funcs = {} // collection previous funcs
  if (curPsg.options) {
    Object.entries(curPsg.options).forEach(([key, code]) => { funcs[key] = code })
  }
  curPsg.options = {} // clear options && recreate
  links.forEach(l => {
    if (l.label === l.target) {
      curPsg.options = l.target
    } if (l.target === 'HIDE') {
      curPsg.options[l.label] = '(e) => e.hide()'
    } else if (l.target === 'FUNC') {
      if (funcs[l.label]) curPsg.options[l.label] = funcs[l.label]
      else curPsg.options[l.label] = '(e) => {\n\n}'
    } else if (l.target !== 'HIDE' && l.target !== 'FUNC') {
      curPsg.options[l.label] = `(e) => e.goTo('${l.target}')`
    }
  })
  graph.updatePassage(curPsg.id, curPsg)
  nn.get(`#card${curPsg.id}`).classList.add('selected')
  return { links, options: curPsg.options }
}

function createCodeSelectUI (opts, menu) {
  const dict = {
    'code inside netnet': curPsg.code,
    'before run function': curPsg.before,
    'after run function': curPsg.after
  }

  opts.links // add FUNC options/links to dict
    .filter(l => l.target === 'FUNC')
    .forEach(l => { dict[`OPT: ${l.label}`] = opts.options[l.label] })

  const sel = nn.create('select')
    .set({
      id: 'edit-sel',
      options: Object.keys(dict),
      class: 'func-btn',
      title: 'edit netnet code or custom logic for this passage'
    })

  nn.create('button')
    .content('edit')
    .set({ class: 'func-btn', title: 'open code editor for custom logic' })
    .addTo(menu)
    .on('click', (e) => {
      const data = {}
      if (sel.value === 'code inside netnet') {
        data.type = 'CODE'
        data.code = dict[sel.value]
        data.edit = curPsg.edit
        data.spotlight = curPsg.spotlight
      } else if (sel.value === 'before run function') {
        data.type = 'BEFORE'
        data.code = dict[sel.value]
      } else if (sel.value === 'after run function') {
        data.type = 'AFTER'
        data.code = dict[sel.value]
      } else if (sel.value.indexOf('OPT: ') === 0) {
        data.type = 'FUNC'
        data.name = sel.value.split('OPT: ')[1]
        data.code = dict[sel.value]
      }
      openNetitor(data)
    })

  sel.addTo(menu)
}

function updatePassageName (e) {
  if (curPsg) {
    const oldName = curPsg.name
    const newName = e.target.textContent
    if (graph.data.filter(p => p.name === newName).length > 0) {
      e.target.textContent = oldName
      return window.alert(`The name "${newName}" is already taken.`)
    } else {
      if (!filemenu.validateName(newName, 'passage')) e.target.textContent = oldName
      else graph.updatePassage(curPsg.id, { name: newName })
    }
  }
}

function createMissingLinkedPassages () {
  const before = graph.data.length
  graph.createMissingPassages(curPsg)
  graph.data.filter(p => p.name === 'HIDE' || p.name === 'FUNC')
    .forEach(p => graph.deletePassage(p.id))
  const after = graph.data.length
  if (before === after) window.alert('This passage has no missing links')
}

function previewPassage () {
  updateWidget()
  const hasIssues = filemenu.projHasIssues()
  if (!hasIssues) MSG({ type: 'cnvmkr-preview-passage', payload: JSON.stringify(curPsg) })
}

nn.get('.make-links').on('click', createMissingLinkedPassages)

nn.get('.preview').on('click', previewPassage)

nn.get('.close').on('click', closeClearEditor)

// ----------------------------------------------- CodeMirror For Passage Editor

const cm = CodeMirror.fromTextArea(nn.get('#editor textarea'), {
  mode: 'nnConvoMode',
  lineNumbers: false,
  theme: 'default',
  lineWrapping: true
})

cm.on('change', (instance, changeObj) => {
  if (changeObj.origin !== 'setValue' && curPsg) {
    graph.updatePassage(curPsg.id, { text: instance.getValue() })
    createEditorMenu()
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(updateWidget, 1500)
  }
})

// -----------------------------------------------------------------------------
// --------------------------------------------- Pop Up Code Editor Setup ------
// -----------------------------------------------------------------------------

let netitor
let netitorWatcher
let netitorPayload = {}

function updateNetitorPayload (data) {
  netitorPayload = {}
  Object.entries(data).forEach(([key, val]) => {
    if (val !== null) netitorPayload[key] = val
  })
}

function openNetitor (data) {
  if (netitor) {
    window.alert('You already have an editor open, please close it before opening a new one.')
    return
  }

  if (data) updateNetitorPayload(data)

  netitor = window.open('code-editor.html', 'convo-maker-coder', 'width=860,height=500')
  // keep an eye on the pop up to see if it closed
  netitorWatcher = setInterval(() => {
    if (netitor && netitor.closed) {
      clearInterval(netitorWatcher)
      netitor = null
    }
  }, 500)
  // on netitor-ready (after it loads) calls msgNetitor
}

function msgNetitor (data) {
  if (data) updateNetitorPayload(data)
  netitor.postMessage(netitorPayload, window.origin)
}

nn.on('message', (e) => {
  // console.log(e.data);
  if (e.origin !== window.location.origin) return
  const { type, code } = e.data

  if (type === 'netitor-ready') {
    // netitor window is ready for content
    msgNetitor()
    // ...
  } else if (type === 'netitor-globals-update') {
    // netitor has updated global variables
    const globals = e.data.globals
    filemenu.globals = globals
    filemenu.variables = code
    const payload = { globals, code }
    MSG({ type: 'cnvmkr-globals-update', payload })
    // ...
  } else if (e.data.type === 'netitor-code-update') {
    // netitor has updated a passage's code property
    curPsg.code = e.data.code
    curPsg.spotlight = e.data.spotlight
    curPsg.edit = e.data.edit
    createEditorMenu()
    updateWidget()
    // ...
  } else if (e.data.type === 'netitor-before-update') {
    // netitor has updated a passage's before function
    curPsg.before = e.data.code === '() => {\n\n}' ? null : e.data.code
    createEditorMenu()
    nn.get('#edit-sel').value = 'before run function'
    updateWidget()
    // ...
  } else if (e.data.type === 'netitor-after-update') {
    // netitor has updated a passage's after function
    curPsg.after = e.data.code === '() => {\n\n}' ? null : e.data.code
    createEditorMenu()
    nn.get('#edit-sel').value = 'after run function'
    updateWidget()
    // ...
  } else if (e.data.type === 'netitor-func-update') {
    // netitor has updated a passage's option's func
    curPsg.options[e.data.name] = e.data.code
    createEditorMenu()
    nn.get('#edit-sel').value = `OPT: ${e.data.name}`
    updateWidget()
    // ...
  }
})

// -----------------------------------------------------------------------------
// ------------------------------- Misc Event Listeners Setup ------------------
// -----------------------------------------------------------------------------

// ------------------------------------------------------------------ CONVO MENU

nn.get('.name').on('input', updatePassageName)

nn.get('#custom-code').on('click', () => {
  openNetitor({
    type: 'VARS',
    globals: filemenu.globals,
    code: filemenu.variables
  })
})

nn.get('#new').on('click', () => {
  if (!filemenu.convoname) window.alert('You must create a "new-file" first')
  else {
    const psg = graph.newPassage()
    psg.options = {}
    graph.updatePassage(psg.id, psg)
  }
})

nn.get('#delete').on('click', () => {
  if (!graph.getSelectedPassages()) window.alert('You don\'t have a passage selected')
})

// --------------------------------------------------------------------- GENERAL

nn.on('mousemove', (e) => {
  const rect = graph.container.getBoundingClientRect()
  graph.mouseX = e.clientX - rect.left
  graph.mouseY = e.clientY - rect.top
})

nn.on('keydown', (e) => {
  if (e.key === 'Escape') closeClearEditor()
  else if (e.key === 'n' && !curPsg) {
    graph.newPassage(null, null, graph.mouseX, graph.mouseY)
  } else if (e.key === 'Backspace' && !editInFocus()) {
    const selected = graph.getSelectedPassages()
    if (selected) selected.forEach(p => graph.deletePassage(p.id))
  }
})

nn.on('message', (e) => {
  if (e.origin !== window.location.origin) return
  // convo-widget has some data to give us
  if (e.data.type === 'new-file-data') filemenu.loadNewFile(e.data.payload)
  else if (e.data.type === 'widgets-list') filemenu.widgets = e.data.payload
})

nn.on('load', () => {
  // setup listene for layout dropdown in editor
  nn.get('.layout').on('change', (e) => {
    const v = e.target.value
    curPsg.layout = v === 'default' ? null : v
    updateWidget()
  })
  // let widget know we've re/opened this popup
  MSG({ type: 'cnvmkr-opened' })
})

nn.on('beforeunload', () => {
  if (netitor && !netitor.closed) netitor.close()
})
