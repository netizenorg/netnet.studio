/* global nn, graph, closeClearEditor, MSG, netitor */

const filemenu = {
  convoname: null,
  widgets: []
}

filemenu.validateName = (name, type) => {
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

filemenu.readyForNewFile = (t) => {
  if (!filemenu.convoname) return true
  let m = 'You\'re currently working on a convo file, '
  m += `are you sure you want to discard this one and ${t} something new?`
  return window.confirm(m)
}

filemenu.openNewFile = () => {
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
        MSG({ type: 'cnvmkr-open-file', payload: evt.target.result })
      } catch (err) {
        console.error('Failed to parse convo file:', err)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

filemenu.loadNewFile = (file) => {
  closeClearEditor()
  nn.getAll('.quilt-card').forEach(e => e.remove())
  filemenu.updateDisplayFilename(file.name)
  graph.data = file.data ? file.data : []
  filemenu.variables = file.variables
  filemenu.globals = file.globals
  graph.update()
}

filemenu.updateDisplayFilename = (name) => {
  filemenu.convoname = name
  nn.get('#convo-name').value = filemenu.convoname
  nn.get('.menu-bar > div:nth-child(2)').css({ visibility: 'visible' })
  nn.get('.menu-bar').css({ height: 82 })
  nn.get('#graph-wrapper').css({ top: 82 })
}

filemenu.projHasIssues = () => {
  const test = graph.evaluate()
  if (test.badNames.length > 0) {
    filemenu.prompt('error', 'some of your passages have bad names, make sure none where left untitled.')
    return true
  } else if (test.deadends.length > 0) {
    const de = test.deadends.join(', ')
    filemenu.prompt('error', `The following passages contain links to dead-ends: ${de}`)
    return true
  } else if (test.empty.length > 0) {
    const es = test.empty.map(o => o.name).join(', ')
    filemenu.prompt('error', `The following passages where left empty: ${es}`)
    return true
  }
  return false
}

filemenu.prompt = (type, data) => {
  nn.get('#modal').css({ display: 'flex' })
  const close = () => nn.get('#modal').css({ display: 'none' })

  if (type === 'file-name') { // ................................
    nn.get('#modal > div').innerHTML = `
      <p style=" margin-top: 0;">What would you like to name this new convo/widget?</p>
      <input type="text" class="input" placeholder="name" style="display: inline-block;">
      <button class="pill-btn pill-btn--secondary" id="e">enter</button>
      <button class="pill-btn pill-btn--secondary" id="c">cancel</button>
    `
    const check = () => {
      const name = nn.get('#modal > div > input').value
      if (!filemenu.validateName(name, 'convo')) return
      MSG({ type: 'cnvmkr-new-file', payload: name })
      filemenu.loadNewFile({ name })
      close()
    }
    nn.get('#modal #e').on('click', check)
    nn.get('#modal #c').on('click', close)
    nn.get('#modal input').on('keypress', e => { if (e.key === 'Enter') check() })
  } else if (type === 'pick-widget') { // ................................
    if (filemenu.widgets.length === 0) {
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">Widget list has not finished loading</p>
        <button class="pill-btn pill-btn--secondary" id="e">try again?</button>
        <button class="pill-btn pill-btn--secondary" id="c">cancel</button>
      `
      nn.get('#modal #e').on('click', () => filemenu.prompt('edit-name'))
      nn.get('#modal #c').on('click', close)
      return
    }
    nn.get('#modal > div').innerHTML = `
      <p style=" margin-top: 0;">Which widget's convo would you like to edit?</p>
      <select class="pill-btn pill-btn--secondary"></select>
      <button class="pill-btn pill-btn--secondary" id="e">edit</button>
      <button class="pill-btn pill-btn--secondary" id="c">cancel</button>
    `
    nn.get('#modal select').set({
      options: filemenu.widgets.map(w => w.title)
    })

    nn.getAll('#modal select option').forEach(ele => {
      const w = filemenu.widgets.find(o => o.title === ele.value)
      ele.textContent = `[${w.key}] ${ele.value}`
    })

    nn.get('#modal #e').on('click', (e) => {
      const sel = nn.get('#modal select').value
      const wig = filemenu.widgets.find(w => w.title === sel)
      MSG({ type: 'cnvmkr-open-file', payload: wig.code })
      close()
    })
    nn.get('#modal #c').on('click', close)
  } else if (type === 'error') { // ................................
    nn.get('#modal > div').innerHTML = `
      <h2>Error</h2>
      <p style=" margin-top: 0;">${data}</p>
      <button class="pill-btn pill-btn--secondary" id="c">ok</button>
    `
    nn.get('#modal #c').on('click', close)
  }
}

// -----------------------------------------------------------------------------
// ------------------------------- FILE  MENU UI/EVENTS SETUP ------------------
// -----------------------------------------------------------------------------

nn.get('#new-file').on('click', () => {
  const allClear = filemenu.readyForNewFile('start')
  if (allClear) filemenu.prompt('file-name')
})

nn.get('#edit-file').on('click', () => {
  const allClear = filemenu.readyForNewFile('start')
  if (allClear) filemenu.prompt('pick-widget')
})

nn.get('#open-file').on('click', () => {
  const allClear = filemenu.readyForNewFile('open')
  if (allClear) filemenu.openNewFile()
})

nn.get('#save-file').on('click', () => {
  const hasIssues = filemenu.projHasIssues()
  if (hasIssues) return

  const cards = graph.data.length
  if (filemenu.convoname && cards > 0) {
    if (netitor) netitor.close()
    MSG({ type: 'cnvmkr-save-file' })
  }
  if (filemenu.convoname && cards <= 0) window.alert('You must create at least one passage first.')
  else if (!filemenu.convoname) window.alert('Nothing to save, open or create a new convo first.')
})
