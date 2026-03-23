/* global nn, Netitor */
let type = 'VARS'
let name // for FUNC methods (the option's key/name)

function reset () {
  nn.getAll('#nfo > p').forEach(p => p.css({ display: 'none' }))
  nn.get(`#${type}`).css({ display: 'block' })
  nn.get('#nfo').set({ class: '' })
  ne.spotlight('clear')
}

function markErrors (eve) {
  const explainError = (err) => {
    ne.spotlight(err.line)
    nn.getAll('#nfo > p').forEach(p => p.css({ display: 'none' }))
    nn.get('#nfo').set({ class: 'error' })
    nn.get('#ERR').css({ display: 'block' }).content(err.friendly || err.message)
  }

  ne.marker(null)
  const lines = []
  if (eve.length === 0) reset()
  eve.forEach(e => {
    if (lines.includes(e.line)) return
    lines.push(e.line)
    const clk = () => explainError(e)
    if (e.type === 'warning') ne.marker(e.line, 'yellow', clk)
    else ne.marker(e.line, 'red', clk)
  })
}

function extractGlobals () {
  const m = ne.code.match(/\/\*\s*global\s+([^*]+)\*\//)
  if (!m) return []
  return m[1]
    .split(',')
    .map(name => name.trim())
    .filter(Boolean)
}

function translateSpotlight (str) {
  if (!str || str === '') return null
  return str.split(',').flatMap(f => {
    if (f.includes('-')) {
      const [start, end] = f.split('-').map(n => Number(n))
      return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    } else {
      return Number(f)
    }
  })
}

function sendUpdate () {
  const payload = {}
  if (type === 'VARS') {
    const glob = ne.code.match(/\/\*\s*global\s+([^*]+)\*\//)
    const idx = glob ? ne.code.indexOf(glob[0]) : null
    const globals = (idx === 0) ? extractGlobals() : undefined
    const code = ne.code.split('\n')
    if (globals) code.shift()
    payload.type = 'netitor-globals-update'
    payload.code = code.join('\n')
    payload.globals = globals
  } else if (type === 'CODE') {
    payload.type = 'netitor-code-update'
    payload.code = ne.code
    payload.spotlight = translateSpotlight(nn.get('#spotlight').value)
    payload.edit = nn.get('#editable').value === 'true'
    if (!nn.get('#editable').value) delete payload.edit
  } else if (type === 'BEFORE') {
    payload.type = 'netitor-before-update'
    if (ne.code === 'const BEFORE = () => {\n  \n}') {
      payload.code = null
    } else payload.code = ne.code.replace('const BEFORE = ', '')
  } else if (type === 'AFTER') {
    payload.type = 'netitor-after-update'
    if (ne.code === 'const AFTER = () => {\n  \n}') {
      payload.code = null
    } else payload.code = ne.code.replace('const AFTER = ', '')
  } else if (type === 'FUNC') {
    payload.type = 'netitor-func-update'
    payload.name = name
    payload.code = ne.code.replace('const LINK = ', '')
  }

  window.opener.postMessage(payload, window.origin)
}

// ------------------------------------------ Netitor Setup --------------------

const ne = new Netitor({
  ele: '#netitor',
  code: '',
  theme: 'dark',
  wrap: true,
  language: 'javascript',
  autoUpdate: true,
  renderWithErrors: true
})

ne.on('lint-error', (eve) => {
  // console.log('lint-error', eve)
  eve = eve
    .map(e => { if (!e.jshint) e.jshint = {}; return e })
    .filter(e => e.jshint.code !== 'W098') // defining var but not using
    .filter(e => e.jshint.code !== 'W117') // using var not previously defined
  markErrors(eve)
})

ne.on('cursor-activity', (eve) => {
  // console.log('cursor-activity', ne.code)
  sendUpdate()
  reset()
})

// -------------------------------------------------- on events ---------------

nn.on('message', (e) => {
  // console.log(e.data);
  type = e.data.type
  ne.language = 'javascript'

  nn.getAll('#nfo > p').forEach(p => p.css({ display: 'none' }))
  nn.get(`#${type}`).css({ display: 'block' })

  if (type === 'VARS') {
    if (!e.data.globals && !e.data.code) return
    if (!e.data.globals && e.data.code) {
      ne.code = e.data.code
      return
    }
    const garr = e.data.globals
    const code = `/* global ${garr.join(', ')} */\n`
    ne.code = code + (e.data.code || '')
  } else if (type === 'CODE') {
    const edit = typeof e.data.edit === 'boolean' ? e.data.edit.toString() : null
    const spot = e.data.spotlight === 'undefined' ? null : e.data.spotlight
    nn.get('#editable').value = edit
    nn.get('#spotlight').set({ value: spot || '' })
    ne.language = 'html'
    ne.code = e.data.code || ''
  } else if (type === 'BEFORE') {
    if (!e.data.code) {
      ne.code = 'const BEFORE = () => {\n  \n}'
    } else ne.code = 'const BEFORE = ' + e.data.code
  } else if (type === 'AFTER') {
    if (!e.data.code) {
      ne.code = 'const AFTER = () => {\n  \n}'
    } else ne.code = 'const AFTER = ' + e.data.code
  } else if (type === 'FUNC') {
    ne.code = 'const LINK = ' + e.data.code
    name = e.data.name
  }
  ne.tidy()
})

nn.on('beforeunload', (e) => {
  sendUpdate()
})

nn.on('keydown', (e) => {
  if (e.key === 'Escape') window.close()
})

nn.on('load', () => {
  nn.get('#editable').on('change', sendUpdate)
  nn.get('#spotlight').on('input', sendUpdate)
  window.opener.postMessage({ type: 'netitor-ready' }, window.origin)
})
