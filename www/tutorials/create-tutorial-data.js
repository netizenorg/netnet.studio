const fs = require('fs')
const path = require('path')
const dirname = process.argv[2]
const dir = path.join(__dirname, dirname)
const files = fs.readdirSync(dir)

if (!files.includes('README.md')) {
  console.log('FOLDER MUST CONTAIN README.md')
  process.exit()
}

const filedata = fs.readFileSync(`${dir}/README.md`, 'utf8')
const metadata = {}
let mainJS = ''
let holdCheckpoint = null
const has = { hypervid: false, widget: false }
const steps = []
const widgets = []

createMetadata()
createMainJS()

// ` * ~ . _ . ~ * ` * ~ . _ . ~ * ` * ~ . _ . ~ * ` * ~ . _ . ~ * ` * ~  utils

function parseURL (url) {
  const arr = url.split('](')
  const obj = {
    note: arr[0].split('[')[1],
    url: arr[1].split(')')[0]
  }
  return obj
}

function createMetadata () {
  const titles = filedata.split('\n').filter(s => s.indexOf('#') === 0)
  metadata.title = titles[0].split('# ')[1]
  metadata.subtitle = titles[1].split('## ')[1]
  metadata.author = {
    name: 'Nick Briz', preferred: 'Nick', url: 'http://nickbriz.com'
  }
  const list = filedata.split('\n')
  const nonTitles = list
    .filter(s => s.indexOf('#') !== 0)
    .filter(s => s !== '')
  metadata.description = nonTitles[0]
  metadata.keywords = []
  metadata.main = 'main.js'
  metadata.checkpoints = {}
  titles.slice(2, titles.length - 1).forEach((t, i) => {
    const sec = t.split('## ')[1]
    metadata.checkpoints[`${i}: ${sec}`] = sec.toLowerCase().replace(/ /g, '-')
  })
  metadata.references = []
  const refIdx = list.indexOf('## References')
  const refs = list.slice(refIdx).filter(r => r.indexOf('-') === 0)
  refs.forEach(r => {
    const ref = parseURL(r)
    metadata.references.push(ref)
  })

  const json = JSON.stringify(metadata, null, 2)
  fs.writeFile(`${dir}/metadata.json`, json, (err) => {
    if (err) console.log(err)
  })
}

function addB4 (str, wig) {
  let xtra
  const arr = str.split('\n')
  if (arr.includes('    before: () => {')) {
    let idx = arr.map((s, i) => {
      if (s.indexOf('      WIDGETS') === 0) return i
      else return null
    }).filter(i => i !== null)
    idx = Math.max(...idx) + 1
    const a = `
      WIDGETS['${wig}'].open()
      WIDGETS['${wig}'].update({ left: 20, top: 20 }, 500)`
    arr.splice(idx, 0, a)
  } else {
    xtra = `    before: () => {
      WIDGETS['${wig}'].open()
      WIDGETS['${wig}'].update({ left: 20, top: 20 }, 500)
    },`
    arr.splice(1, 0, xtra)
  }
  return arr.join('\n')
}

function addWidget (w, name) {
  widgets.push(w)
  steps[steps.length - 1] = addB4(steps[steps.length - 1], name)
}

function updateStepToCheckPoint (id) {
  const step = steps[steps.length - 1]
  const find = `e.goTo('nn-${steps.length}')`
  const replace = `e.goTo('${id}')`
  if (step) steps[steps.length - 1] = step.replace(find, replace)
}

// ` * ~ . _ . ~ * ` * ~ . _ . ~ * ` * ~ . _ . ~ * ` * ~ . _ . ~ * ` * ~  subs

function createQuotationWidget (line) {
  const arr = line.split('—')
  const n = arr[1]
  const auth = n.substring(n.indexOf('<i>') + 3, n.indexOf('</i>'))
  const wigname = `${auth.replace(/ /g, '-')}-quote-w${widgets.length}`
  const w = `    '${wigname}': new Widget({
      width: window.innerWidth * 0.33,
      title: '${auth} quote',
      innerHTML: '<blockquote style="font-size: 22px; line-height: 25px;">"${arr[0].replace(/'/g, "\\'").substr(2)}</blockquote><div style="text-align:right; font-size: 22px; line-height: 25px;">—${auth}</div>'
    })`
  addWidget(w, wigname)
}

function createVideoWidget (list, i) {
  const line = list[i]
  const next = list[i + 1].indexOf('*') === 0
    ? list[i + 1] : null
  const arr = line.split('](https://netnet.studio/')
  const url = arr[1].substring(0, arr[1].length - 1)
  // [![jodi-dot-org](images/jodi.png)
  const cap = arr[0].indexOf('[![') === 0
    ? parseURL(arr[0].substr(2))
    : arr[0].substr(1)
  const name = typeof cap === 'string' ? cap : cap.note
  const title = name.replace(/-/g, ' ')
  let w
  if (next) {
    w = `    '${name}': new HyperVidPlayer({
      video: '${url}',
      width: window.innerWidth * 0.33,
      title: '${title}',
      text: '${next.replace(/\*/g, '').replace(/'/g, "\\'")}'
    })`
  } else {
    w = `    '${name}': new HyperVidPlayer({
      video: '${url}',
      width: window.innerWidth * 0.33,
      title: '${title}'
    })`
  }
  addWidget(w, name)
}

function createImageWidget (list, i) {
  const line = list[i]
  const next = list[i + 1]
  const img = parseURL(line)
  const name = `${img.note}-w${widgets.length}`
  const title = img.note.replace(/-/g, ' ')
  let w
  if (next && next.indexOf('*') === 0) {
    let nfo = `<img style="width: 100%" alt="${title}" src="tutorials/${dirname}/${img.url}">`
    nfo += `<p>${next.replace(/\*/g, '').replace(/'/g, "\\'")}</p>`
    w = `    '${name}': new Widget({
      width: window.innerWidth * 0.33,
      title: '${title}',
      innerHTML: '${nfo}'
    })`
  } else {
    w = `    '${name}': new Widget({
      width: window.innerWidth * 0.33,
      title: '${title}',
      innerHTML: '<img style="width: 100%" alt="${img.note}" src="tutorials/${dirname}/${img.url}">'
    })`
  }
  addWidget(w, name)
}

function createStep (line, id) {
  let str = '{\n'
  if (holdCheckpoint) {
    str += `    id: '${holdCheckpoint}',\n`
    updateStepToCheckPoint(holdCheckpoint)
    holdCheckpoint = null
  } else if (id) {
    str += `    id: '${id}-${steps.length}',\n`
  } else str += `    id: 'nn-${steps.length}',\n`

  const txt = line.replace(/'/g, "\\'")
  str += `    content: '${txt}',\n`
  if (id) {
    str += `    options: { ok: (e) => e.goTo('${id}-${steps.length + 1}') }\n`
  } else {
    str += `    options: { ok: (e) => e.goTo('nn-${steps.length + 1}') }\n`
  }

  str += '  }'
  steps.push(str)
  if (holdCheckpoint) holdCheckpoint = null
}

function createTangent (line) {
  const url = line.split(':** ')[1]
  const obj = parseURL(url)
  const choice = obj.note.replace(/'/g, "\\'")
  const id = choice.replace(/ /g, '-')
  const idx = steps.length - 1
  let step = steps[idx]
  // const next = step.split('e.goTo(')[1].split(') }')[0]
  if (step) {
    steps[idx] = step.replace(') }', ')\n    }')
    step = steps[idx]
    const find = '{ ok:'
    const replace = `{
      '${choice}': (e) => e.goTo('${id}-${steps.length}'),
      ok:`
    steps[idx] = step.replace(find, replace)
  }

  const aside = fs.readFileSync(`${dir}/${obj.url}`, 'utf8')
  const list = aside.split('\n').filter(s => s !== '')
  for (let i = 0; i < list.length; i++) {
    const line = list[i]
    if (line.indexOf('>') === 0) { // found quotation
      has.widget = true
      createQuotationWidget(line)
    } else if (line.indexOf('[![') === 0) { // found Video
      has.hypervid = true
      createVideoWidget(list, i)
    } else if (line.indexOf('!') === 0) { // found Image
      has.widget = true
      createImageWidget(list, i)
    } else if (line.indexOf('**ASIDE') === 0) { // found tangent convo
      createTangent(line)
    } else if (line.indexOf('*') === 0) { // found caption
      // ignore, b/c these are assumed to be image or video captions
      // && thus hanlded in those respective functions
    } else if (line.indexOf('##') === 0) { // found a Check Point
      holdCheckpoint = line.split('## ')[1].toLowerCase().replace(/ /g, '-')
    } else { // found a step
      createStep(line, id)
    }
  }

  steps.pop() // remove [return](README.md)
  const last = `${id}-${steps.length}`
  const next = `nn-${steps.length}`
  steps[steps.length - 1] = steps[steps.length - 1].replace(last, next)

  step = steps[idx]
  steps[idx] = step.replace(`nn-${idx + 1}`, next)
}

// ` * ~ . _ . ~ * ` * ~ . _ . ~ * ` * ~ . _ . ~ * ` * ~ . _ . ~ * ` * ~  main

function createMainJS () {
  const fulllist = filedata.split('\n').filter(s => s !== '')
  const titles = fulllist.filter(s => s.indexOf('#') === 0)
  const start = fulllist.indexOf(titles[2])
  const end = fulllist.indexOf(titles[titles.length - 1])
  const list = fulllist.slice(start, end)
  let ignoring = false
  for (let i = 0; i < list.length; i++) {
    const line = list[i]
    const dismiss = ['----', '```']
    if (line.indexOf('```') === 0) ignoring = !ignoring
    if (!ignoring && !dismiss.includes(line)) {
      if (line.indexOf('>') === 0) { // found quotation
        has.widget = true
        createQuotationWidget(line)
      } else if (line.indexOf('[![') === 0) { // found Video
        has.hypervid = true
        createVideoWidget(list, i)
      } else if (line.indexOf('!') === 0) { // found Image
        has.widget = true
        createImageWidget(list, i)
      } else if (line.indexOf('**ASIDE') === 0) { // found tangent convo
        createTangent(line)
      } else if (line.indexOf('*') === 0) { // found caption
        // ignore, b/c these are assumed to be image or video captions
        // && thus hanlded in those respective functions
      } else if (line.indexOf('##') === 0) { // found a Check Point
        holdCheckpoint = line.split('## ')[1].toLowerCase().replace(/ /g, '-')
      } else { // found a step
        createStep(line)
      }
    }
  }

  let globalVars = 'NNE'
  if (has.widget) globalVars += ' Widget WIDGETS'
  if (has.hypervid) globalVars += ' HyperVidPlayer'
  mainJS = `/* global ${globalVars} */
window.TUTORIAL = {
  onload: () => {
    NNE.addCustomRoot('tutorials/${dirname}/')
    NNE.code = '<!DOCTYPE html>'
  },

  steps: [${steps.join(', ')}],

  widgets: {
${widgets.join(',\n')}
  }
}
`
  fs.writeFile(`${dir}/main.js`, mainJS, (err) => {
    if (err) console.log(err)
  })
}
