/* global nn timeline zipper recorder FILES metadata HTMLElement customElements Netitor */

const SWP = 'TUTORIAL_MAKER' // MUST MATCH PATH IN: files-db-service-worker.js
let TIMECODE = 0 // timeline's current timecode (ie. playhead location)
let modal
let WN // neitior instance for widget maker
let WIDGET // previous widget state
let videoReady = false
let keyLogging = false

const msg = (type, payload) => {
  window.opener.postMessage({ type, payload }, window.origin)
}

function overlay (ele) {
  nn.getAll('.overlay').forEach(e => e.css('display', 'none'))
  if (ele) nn.get(ele).css('display', 'block')
  if (ele) window.resizeTo(436, 731)
  else window.resizeTo(1000, 280)

  if (ele === '#metadata') {
    window.resizeTo(420, 850)
    metadata.init()
  } else if (ele === '#video-menu') {
    window.resizeTo(420, 572)
    recorder.initMenu()
  } else if (ele === '#widget-maker') {
    window.resizeTo(610, 400)
  } else if (ele === '#upload') {
    window.resizeTo(425, 500)
    loadFiles()
  } else if (ele === '#start') {
    nn.get('#metadata').css('display', 'none')
    nn.get('#start').css('display', 'block')
    window.resizeTo(485, 236)
  }
}

function openTutorial () {
  // open zip file...
  zipper.open(SWP, async (id, files) => {
    await FILES.init(id, files) // load files to indexedDB
    // const tut = JSON.parse(files[`${SWP}/${id}/tutorial.json`]) // get tutorial data
    const tut = JSON.parse(FILES.readFile(`${SWP}/${id}/tutorial.json`)) // get tutorial data
    // load metadata
    Object.assign(metadata, tut.metadata)

    // modify's path so that the service worker resolves requests correctly
    for (const key in tut.widgets) {
      const wig = tut.widgets[key]
      wig.innerHTML = wig.innerHTML.replace(/tutorials\//g, 'TUTORIAL_MAKER/')
    }
    if (tut.keyframes[0]?.code && tut.keyframes[0]?.code !== 'DEFAULT') {
      // update db's index.html (used by SW to render iframe)
      FILES.updateFile(`${SWP}/${metadata.id}/index.html`, tut.keyframes[0].code)
    }
    // create timeline markers for keyframes && keylogs
    tut.keyframes.forEach(kf => addMarker(kf, 'keyframe'))
    tut.keylogs.forEach(kl => addMarker(kl, 'keylog'))
    timeline.updateMarkers()

    tut.videoBlob = FILES.readFile(metadata.id + '.mp4')
    if (!tut.videoBlob) tut.videoBlob = FILES.readFile(metadata.id + '.webm')
    videoReady = true

    msg('tut-mkr-opened-tutorial', tut) // let main tutorial-maker widget know

    // TODO: load widgets into widget editor
    loadWidgets(tut.widgets)

    lockMetadataID()

    overlay(null) // remove overlay
  })
}

function updateVideo (blob, newRecording) {
  // NOTE: chrome has issues with "seeking" a video when being served by a SW...
  // FILES.updateFile(`${TUT_ID}.mp4`, blob) // <-(so can't do this anymore)
  // ...so instead of requesting the blob from the SW we need to give it to the
  // HyperVideoPlayer directly...
  msg('tut-mkr-update-video', blob)
  if (newRecording) msg('tut-mkr-get-keylog', 'all')
  overlay(null)
  // NOTE: this should only run once per tutorial,
  // either when they upload a video, or record a new one.
  // if they want to re-record the video, they should make a new tutorial
  videoReady = true
}

function updateMetadata (data) {
  if (videoReady) { // updating existing project
    overlay(null)
  } else { // first time submitting metadata
    FILES.init(metadata.id, {}) // reset files (new empty projet)
    lockMetadataID()
    // upload or record a video first
    overlay('#video-menu')
  }

  msg('tut-mkr-update-metadata', data)
}

function lockMetadataID () {
  // NOTE: the metadata.id is used all over the place && works best if only set once
  nn.get('#metadata input[name="id"]').classList.add('locked')
  nn.get('#metadata input[name="id"]').set('readonly', true)
  nn.get('#metadata input[name="id"]').on('click', () => {
    nn.get('#metadata button[name="tip-id"]').click()
  })
  // if later we choose to allow the user to change it, we'll need to make sure
  // to do some cleanup. first things that comes to mind is we'll need to
  // re-run FILES.init(id, files) with the new id name
}

function openMetadata (metadata) {
  const q = n => `#metadata *[name="${n}"]`
  const except = ['thumbnails', 'duration', 'jsfile'] // upated another way
  for (const key in metadata) {
    if (!except.includes(key)) {
      nn.get(q(key)).value = metadata[key]
    }
  }
  overlay('#metadata')
}

function videoTimeUpdated (obj) { // runs as video plays && it's time udpates
  TIMECODE = obj.time
  if (!metadata.duration) {
    console.log('TUT MKR: skipping videoTimeUpdated, no DUR (duration) set yet')
    return
  }
  const x = obj.time / metadata.duration * 100
  timeline.updatePlayhead(x)
  timeline.clearSelections()
  if (obj.keyframe) {
    const { timecode } = obj.keyframe
    const marker = nn.get(`[name="keyframe-${timecode}"]`)
    timeline.selectMarker(marker)
    keyframeEditMode(true)
  } else {
    keyframeEditMode(false)
  }
  if (obj.keylog) {
    const marker = nn.get(`[name="keylog-${obj.keylog.timecode}"]`)
    timeline.selectMarker(marker)
    keylogEditMode('delete')
  } else {
    if (!keyLogging) keylogEditMode(false)
  }
}

// -------------------------------------------------------- KEYLOGGING FUNCTIONS

recorder.toggleKeyLogging = function (rec) {
  if (rec) msg('tut-mkr-start-keylog')
  else msg('tut-mkr-stop-keylog')
}

function startLogging () {
  if (keyLogging) {
    // TODO: let them know it's already recording
    window.alert('keylogging already enabled')
    showCreateOptions()
    return
  }
  keyLogging = true
  recorder.toggleKeyLogging(keyLogging)
  keylogEditMode('recording')
  showCreateOptions()
}

function stopLogging () {
  keyLogging = false
  recorder.toggleKeyLogging(keyLogging)
  keylogEditMode(false)
}

function newKeylogsFromRecording (logs) {
  if (!metadata.duration) return setTimeout(newKeylogsFromRecording, 100, logs)
  logs.forEach(kl => addMarker(kl, 'keylog'))
  timeline.updateMarkers()
}

function createKeylog (kl) {
  addMarker(kl, 'keylog')
  timeline.updateMarkers()
}

function deleteKeylog () {
  timeline.removeMarker(TIMECODE, 'keylog')
  msg('tut-mkr-update-keylog', { timecode: TIMECODE, remove: true })
}

function keylogEditMode (type) {
  if (!type) {
    nn.get('#keylog-tools').css('display', 'none')
  } else if (type === 'selected') {
    nn.get('#delete-keylog').css('display', 'block')
    nn.get('#recording-keylog').css('display', 'none')
    nn.get('#keylog-rec-tip').css('display', 'none')
    nn.get('#keylog-tools').css('display', 'flex')
  } else if (type === 'recording') {
    nn.get('#delete-keylog').css('display', 'none')
    nn.get('#recording-keylog').css('display', 'block')
    nn.get('#keylog-rec-tip').css('display', 'block')
    nn.get('#keylog-tools').css('display', 'flex')
  }
}

function displayKeylogData (kl) {
  if (kl.remove) {
    keylogEditMode(false) // hide
  } else {
    keylogEditMode('selected')
  }
}

// ---------------------------------------------------------- KEYFRAME FUNCTIONS

function displayKeyframeData (kf) {
  if (kf.frame) return
  // display name
  nn.get('#kf-name-input').textContent = kf.name || ''
  // update widgets options
  const keys = kf.widgets?.map(w => w.key)
  nn.getAll('#widget-options .widget input')
    .forEach(ch => { ch.checked = false })
  nn.getAll('#widget-options .widget').forEach(ele => {
    const key = ele.get('p').textContent
    if (keys.includes(key)) ele.get('input').checked = true
  })
  // update timecode
  nn.get('#kf-timecode').content(kf.timecode)
  // update netitor options
  if (kf.netitor.code) {
    const n = kf.netitor
    nn.getAll('.netitor-set').forEach(s => s.css('opacity', 1))
    nn.get('[name="include-netitor"]').checked = true
    if (n.spotlight?.length > 0) {
      nn.get('#netitor-spotlight').value = n.spotlight.join(', ')
    } else {
      nn.get('#netitor-spotlight').value = ''
    }
    if (n.scrollTo?.x || n.scrollTo?.y) {
      nn.get('[name="include-scroll"]').checked = true
    } else {
      nn.get('[name="include-scroll"]').checked = false
    }
    if (n.autoType) {
      nn.get('[name="auto-type"]').checked = true
    } else {
      nn.get('[name="auto-type"]').checked = false
    }
  } else {
    nn.getAll('.netitor-set').forEach(s => s.css('opacity', 0.25))
    nn.get('[name="include-netitor"]').checked = false
    nn.get('#netitor-spotlight').value = ''
    nn.get('[name="include-scroll"]').checked = false
    nn.get('[name="auto-type"]').checked = false
  }
}

function showCreateOptions () {
  const o = nn.get('#create-options')
  const s = nn.get('#create-marker svg')
  const c = o.style.display === 'flex'
  if (!c) {
    o.style.display = 'flex'
    s.style.transform = 'rotate(45deg)'
  } else {
    o.style.display = 'none'
    s.style.removeProperty('transform')
  }
  // TODO configure so it only displays options that aren't already created on selected timestamp
}

function addMarker (k, type) {
  const t = k.timecode
  const x = t / metadata.duration * 100
  timeline.createMarker(x, t, type, (tc) => {
    msg(`tut-mkr-${type}-click`, tc)
    nn.get('#widget-options').css('display', 'none')
    nn.get('#netitor-options').css('display', 'none')
    if (type === 'keyframe') setNameInput(tc)
  })
  if (type === 'keyframe') nn.get(`[name="keyframe-${k.timecode}"]`).dataset.name = k.name
}

function createKeyframe (kf) {
  addMarker(kf, 'keyframe')
  timeline.updateMarkers()
  keyframeEditMode(true)
  displayKeyframeData(kf)
}

function updateKeyframe () {
  const name = document.querySelector('#kf-name-input')?.textContent
  const netitor = getNetitorSettings()
  msg('tut-mkr-update-keyframe', { name, timecode: TIMECODE, netitor })
  nn.get(`[name="keyframe-${TIMECODE}"]`).dataset.name = name
}

function deleteKeyframe () {
  timeline.removeMarker(TIMECODE, 'keyframe')
  msg('tut-mkr-update-keyframe', { timecode: TIMECODE, remove: true })
}

function keyframeEditMode (enable) {
  const tools = nn.getAll('[kf-edit-tool]')
  if (enable) {
    tools.forEach((t) => {
      const s = t.classList.contains('code-bton') ? 'flex' : 'block'
      t.style.display = s
    })
  } else tools.forEach((t) => { t.style.display = 'none' })
}

function setNameInput (tc) {
  const name = nn.get(`[name="keyframe-${tc}"]`).dataset.name
  nn.get('#kf-name-input').textContent = name
}

// --------------------------------------------------------- NETITOR FUNCTIONS
function toggleNetitorOptions (e) {
  const em = nn.get('#netitor-options')
  if (!em.contains(e.target)) {
    em.style.display = em.style.display === 'none' ? 'flex' : 'none'
    const includeNet = nn.get('[name="include-netitor"]').checked
    if (includeNet) nn.getAll('.netitor-set').forEach(s => s.css('opacity', 1))
    else nn.getAll('.netitor-set').forEach(s => s.css('opacity', 0.25))
  }
}

function includeNetitor (e) {
  if (this.checked) nn.getAll('.netitor-set').forEach(s => s.css('opacity', 1))
  else nn.getAll('.netitor-set').forEach(s => s.css('opacity', 0.25))
}

function getSpotlight () {
  let focus
  let val = nn.get('#netitor-spotlight').value.trim()
  const lastChar = val.slice(-1)
  if (lastChar === ',') val = val.slice(0, -1)
  if (val === '') focus = null
  else {
    focus = val.split(',').flatMap(f => {
      if (f.includes('-')) {
        const [start, end] = f.split('-').map(n => Number(n))
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
      } else {
        return Number(f)
      }
    })
  }
  return focus
}

function getNetitorSettings () {
  const includeNet = nn.get('[name="include-netitor"]').checked
  if (includeNet) {
    const code = true
    const scrollTo = nn.get('[name="include-scroll"]').checked
    const autoType = nn.get('[name="auto-type"]').checked
    const spotlight = getSpotlight()
    return { code, scrollTo, spotlight, autoType }
  } else {
    return { code: null, scrollTo: null, spotlight: null, autoType: null }
  }
}

// ------------------------------------------------------------ WIDGET FUNCTIONS

function toggleWidgetOptions (e) {
  const em = nn.get('#widget-options')
  if (!em.contains(e.target) || e.target?.name === 'widget-create') {
    em.style.display = em.style.display === 'none' ? 'flex' : 'none'
  }
}

// create widget option in widget dropdown menu
function addWidgetOption (w, opened = false) {
  const d = document.createElement('div')
  d.className = 'widget'

  // create checkbox and title
  const d1 = document.createElement('div')
  const box = document.createElement('input')
  box.type = 'checkbox'
  box.name = `${w.key}-checkbox`
  box.checked = opened
  const p = document.createElement('p')
  p.textContent = w.key
  d1.appendChild(box)
  d1.appendChild(p)

  // create edit and delete buttons
  const d2 = document.createElement('div')
  const ebtn = document.createElement('button')
  ebtn.textContent = 'edit'
  ebtn.name = `${w.key}-edit`
  ebtn.className = 'pill-btn pill-btn--secondary'
  const dbtn = document.createElement('button')
  dbtn.textContent = 'delete'
  dbtn.name = `${w.key}-delete`
  dbtn.className = 'pill-btn pill-btn--secondary'
  d2.appendChild(ebtn)
  d2.appendChild(dbtn)

  function checkboxSelected (e, key) {
    if (e.target.checked) msg('tut-mkr-open-widget', { widget: w, open: true })
    else msg('tut-mkr-open-widget', { widget: w, open: false })
  }

  box.addEventListener('change', (e) => checkboxSelected(e, w.key))
  ebtn.addEventListener('click', () => msg('tut-mkr-get-widget', { key: w.key }))
  dbtn.addEventListener('click', () => deleteWidget(w, d))

  d.appendChild(d1)
  d.appendChild(d2)
  nn.get('#widget-options').appendChild(d)
}

function createWidget () {
  nn.get('[name="widget-maker-update"]').textContent = 'create'
  overlay('#widget-maker')
  nn.get('#widget-maker').dataset.widget = 'new-widget'
  // open new widget in netnet
  msg('tut-mkr-open-widget', {
    widget: {
      key: 'new-widget',
      title: 'new widget',
      innerHTML: '...'
    },
    open: true
  })
}

function updateWidget () {
  updateWidgetState()
  const key = nn.get('#widget-key-input').textContent
  const title = nn.get('#widget-title-input').textContent
  const innerHTML = WN.code
  const widget = { key, title, innerHTML, type: 'Widget' }

  // if widget is new, add it to the dropdown options
  if (nn.get('[name="widget-maker-update"]').textContent === 'create') {
    addWidgetOption(widget, true)
  }

  // if editing an existent widget, send old widget key
  if (nn.get('[name="widget-maker-update"]').textContent === 'update') {
    const maker = nn.get('#widget-maker')
    widget.oldKey = maker.dataset.widget
    maker.dataset.widget = key // set to new key
  }
  msg('tut-mkr-update-widget', { widget })
  closeWidgetMaker('true')
}

function editWidget (w) {
  // set widget to active and open in netnet
  nn.get(`[name="${w.key}-checkbox"]`).checked = true
  msg('tut-mkr-open-widget', { widget: w, open: true })
  // load widget data into widget maker
  nn.get('#widget-maker').dataset.widget = w.key
  nn.get('#widget-key-input').textContent = w.key
  nn.get('#widget-title-input').textContent = w.title
  WN.code = w.innerHTML
  WIDGET = w // store current widget state
  nn.get('[name="widget-maker-update"]').textContent = 'update'
  overlay('#widget-maker')
}

function deleteWidget (w, ele) {
  // TODO: do we want to confirm with users if they want to remove a widget?
  msg('tut-mkr-update-widget', { widget: w, remove: true })
  ele.remove()
}

function copyProjPath () {
  const path = `${SWP}/${metadata.id}/`
  navigator.clipboard.writeText(path)
}

function updateWidgetState (code) {
  // TODO: make sure it is a astring with no spaces
  // TODO: check if that widget key is already in the netnet system
  const key = nn.get('#widget-key-input').textContent
  const title = nn.get('#widget-title-input').textContent
  const innerHTML = code || WN.code
  if (key && title && innerHTML) {
    // fetch old key incase it changed
    const maker = nn.get('#widget-maker')
    const oldKey = maker.dataset.widget
    if (oldKey !== key) {
      msg('tut-mkr-update-widget-state', { widget: { key, title, innerHTML, oldKey } })
      maker.dataset.widget = key // set to new key
    }
    msg('tut-mkr-update-widget-state', { widget: { key, title, innerHTML } })
  }
}

function loadWidgets (widgets) {
  Object.keys(widgets).forEach(key => addWidgetOption(widgets[key]))
}

function closeWidgetMaker (updated = false) {
  const key = nn.get('#widget-key-input').textContent
  const title = nn.get('#widget-title-input').textContent
  const innerHTML = WN.code
  const currentWidget = { key, title, innerHTML, type: 'Widget' }
  if (updated || JSON.stringify(WIDGET) === JSON.stringify(currentWidget)) {
    // close widget maker & clear inputs
    overlay(null)
    nn.get('#modal').css('display', 'none')
    nn.get('#widget-key-input').textContent = ''
    nn.get('#widget-title-input').textContent = ''
    WN.code = '...'
  } else {
    // double-check users want to close without saving changes
    const modal = nn.get('.custom-modal-inner')
    modal.classList.add('warning')
    modal.innerHTML = `
    <p>You have unsaved changes that you’re about to lose. Are you sure you want to proceed?</p>
    <div class="custom-modal-buttons">
      <button name="wgt-mkr-discard" class="pill-btn pill-btn--secondary pill-btn--red">Discard Changes</button>
      <button name="wgt-mkr-cancel" class="pill-btn pill-btn--secondary">Cancel</button>
    </div>
    `
    nn.get('[name="wgt-mkr-discard"]').on('click', () => closeWidgetMaker(true))
    nn.get('[name="wgt-mkr-cancel"]').on('click', () => nn.get('#modal').css('display', 'none'))
    nn.get('#modal').css('display', 'flex')
  }
}

function debounce (fn, wait, { leading = false, trailing = true } = {}) {
  let timer = null
  let lastArgs
  let lastThis
  let invoked = false
  const invoke = () => {
    timer = null
    if (trailing && (!leading || invoked)) {
      fn.apply(lastThis, lastArgs)
    }
    invoked = false
  }
  return function debounced (...args) {
    lastArgs = args
    lastThis = this
    if (timer) clearTimeout(timer)
    else if (leading && !invoked) {
      fn.apply(lastThis, lastArgs) // call immediately once
      invoked = true
    }
    timer = setTimeout(invoke, wait)
  }
}

// ----------------------------------------------------- UPLOAD ASSETS FUNCTIONS

function fileUploaded (e) {
  if (!e.detail.files.length > 0) return
  e.detail.files.forEach(file => {
    const path = file.relativePath || file.name
    FILES.updateFile(path, file).then(() => loadFiles())
  })
  // when uploading a new init.js, re-run init.js setup
  if (e.detail.files[0].name === 'init.js') msg('tut-mkr-new-initjs')
}

function buildFileTree (files) {
  // files to hide from the asset view
  const filtered = [
    'tutorial.json',
    'index.html', // NOTE: created by 'tut-mkr-code-update'
    `${metadata.id}.mp4`,
    `${metadata.id}.webm`
  ]
  // strip TUTORIAL_MAKER/{id}/ prefix, filter system files, wrap under "assets/"
  const prefix = `${SWP}/${metadata.id}/`
  const agg = { temp: [] }
  Object.values(files).forEach(file => {
    const rawPath = file?.path || file
    if (!rawPath) return
    const stripped = rawPath.startsWith(prefix) ? rawPath.slice(prefix.length) : rawPath
    if (!stripped) return
    if (filtered.includes(stripped)) return
    const virtual = `${metadata.id} (click to view files)/${stripped}`
    virtual.split('/').reduce((agg, part, level, parts) => {
      if (!agg[part]) {
        agg[part] = { temp: [] }
        agg.temp.push({
          id: parts.slice(0, level + 1).join('/'),
          fullPath: rawPath,
          level: level + 1,
          children: agg[part].temp
        })
      }
      return agg[part]
    }, agg)
  })
  return agg.temp
}

function renderFileTree (tree, container, depth = 0) {
  tree.forEach(node => {
    if (node.children.length > 0) {
      // folder node — collapsed by default
      const li = nn.create('li').css('paddingLeft', `${depth * 14}px`)
      li.className = 'upl-folder upl-folder--collapsed'

      const label = nn.create('span')
      label.className = 'upl-folder-label'
      label.textContent = node.id.split('/').pop()
      li.appendChild(label)

      const ul = nn.create('ul')
      ul.className = 'upl-tree-children upl-tree-children--collapsed'

      li.on('click', () => {
        const isOpen = !ul.classList.contains('upl-tree-children--collapsed')
        ul.classList.toggle('upl-tree-children--collapsed', isOpen)
        li.classList.toggle('upl-folder--collapsed', isOpen)
      })

      container.appendChild(li)
      container.appendChild(ul)
      renderFileTree(node.children, ul, depth + 1)
    } else {
      // file node
      const li = nn.create('li').css('paddingLeft', `${depth * 14}px`)
      li.className = 'upl-file'

      const name = nn.create('span')
      name.className = 'upl-file-name'
      name.textContent = node.id.split('/').pop()

      const del = nn.create('button')
      del.className = 'upl-delete-btn'
      del.textContent = '✕'
      del.on('click', () => {
        FILES.deleteFile(node.fullPath)
        li.remove()
      })

      li.appendChild(name)
      li.appendChild(del)
      container.appendChild(li)
    }
  })
}

function loadFiles () {
  const container = nn.get('#upload .uploaded-assets')
  container.innerHTML = ''
  const ul = nn.create('ul')
  ul.className = 'upl-tree'
  container.appendChild(ul)
  const tree = buildFileTree(FILES.files)
  renderFileTree(tree, ul)
}

// -------------------------------------------------------- SETUP EVENT LISTENRS

nn.get('#new').on('click', () => overlay('#metadata'))
nn.get('#open').on('click', openTutorial)
nn.get('#open-metadata').on('click', () => msg('tut-mkr-get-metadata'))
nn.get('#create-marker').on('click', () => showCreateOptions())

nn.get('#create-keyframe').on('click', () => {
  msg('tut-mkr-update-keyframe', { timecode: TIMECODE })
  showCreateOptions()
})
nn.get('#update-keyframe').on('click', () => updateKeyframe())
nn.get('#delete-keyframe').on('click', () => deleteKeyframe())
nn.get('#download-tutorial').on('click', () => {
  console.log('CLICKD DOWNLOAD');
  msg('tut-mkr-get-data')
})

nn.get('#create-keylog').on('click', startLogging)
nn.get('#recording-keylog').on('click', stopLogging)
nn.get('#delete-keylog').on('click', deleteKeylog)

// netitor options
nn.get('#netitor-dd').on('click', toggleNetitorOptions)
nn.get('[name="include-netitor"]').on('click', includeNetitor)

// widget options
nn.get('#widget-dd').on('click', toggleWidgetOptions)
nn.get('[name="widget-create"]').on('click', () => createWidget())
nn.get('[name="widget-maker-goback"]').on('click', () => closeWidgetMaker())
nn.get('[name="widget-maker-path"]').on('click', () => copyProjPath())
nn.get('[name="widget-maker-update"]').on('click', () => updateWidget())
nn.get('#widget-key-input').on('blur', () => updateWidgetState())
nn.get('#widget-title-input').on('blur', () => updateWidgetState())

nn.get('[name="upload-assets"]').on('click', () => overlay('#upload'))
nn.get('#upload file-drop').addEventListener('files-changed', (e) => fileUploaded(e))
nn.get('[name="upload-goback"]').on('click', () => overlay(null))

nn.getAll('.tool-tip[data-tip]').forEach((btn) => {
  const tipDiv = document.createElement('div')
  tipDiv.className = 'tooltip-content closed' // manifest.css classes
  const tipP = document.createElement('p')
  tipP.innerHTML = btn.dataset.tip
  tipDiv.appendChild(tipP)
  btn.after(tipDiv)

  btn.addEventListener('click', (e) => {
    if (tipDiv.classList.contains('closed')) {
      btn.textContent = 'x'
      const rect = btn.getBoundingClientRect()

      // temporarily render off-screen to measure height (display:none prevents measurement)
      tipDiv.style.position = 'fixed'
      tipDiv.style.visibility = 'hidden'
      tipDiv.style.top = '-9999px'
      tipDiv.style.left = '-9999px'
      tipDiv.classList.remove('closed')
      tipDiv.classList.add('opened')
      const tipHeight = tipDiv.offsetHeight

      // calculate left, clamping to right edge
      let left = rect.left
      const rightSide = rect.left + 365 + 20 // tipDiv width + margin
      const rightOverflow = rightSide - window.innerWidth
      if (rightOverflow > 0) left -= rightOverflow

      // calculate top: below btn by default, above if it would overflow bottom
      let top = rect.bottom
      if (rect.bottom + tipHeight > window.innerHeight) {
        top = rect.top - tipHeight
      }

      tipDiv.style.left = `${left}px`
      tipDiv.style.top = `${top}px`
      tipDiv.style.visibility = ''
    } else {
      btn.textContent = '?'
      tipDiv.classList.remove('opened')
      tipDiv.classList.add('closed')
    }
  })
})

// .................... window events

nn.on('load', () => {
  timeline.onScrub = (x) => {
    const time = (x / 100) * metadata.duration
    msg('tut-mkr-seek', time)
  }
  timeline.init()

  keyframeEditMode(false)

  const m = document.createElement('tutorial-modal')
  nn.get('body').appendChild(m)
  modal = m

  // init netitor for widget maker
  WN = new Netitor({
    ele: '#widget-maker-html',
    code: '...',
    wrap: true,
    hint: false,
    lint: false,
    language: 'html'
  })
  WN.cm.setOption('lineNumbers', false)
  const debouncedUpdate = debounce(updateWidgetState, 1500)
  WN.on('code-update', (code) => debouncedUpdate(code))
  WN.ele.querySelector('.CodeMirror-gutters').style.background = 'transparent'
  // TODO: fix where if you try to ctrl + arrow doesn't jump to different keyframes
})

nn.on('resize', () => {
  timeline.placeLabels()
  timeline.updateMarkers()
})

nn.on('keydown', (e) => {
  const avoidToggle = ['input', 'textarea']
  if (avoidToggle.includes(e.target.localName)) return
  const editable = e.target.getAttribute('contenteditable')
  if (editable) return // stop propagation on all editable elements
  if (e.key === ' ') {
    msg('tut-mkr-toggle')
  } else if (e.key === 'ArrowLeft') {
    const frame = timeline.getPrevMarker(TIMECODE)
    if (frame) msg('tut-mkr-seek', frame.timecode)
  } else if (e.key === 'ArrowRight') {
    const frame = timeline.getNextMarker(TIMECODE)
    if (frame) msg('tut-mkr-seek', frame.timecode)
  }
})

nn.on('message', (e) => {
  if (e.origin !== window.location.origin) return
  const { type, payload } = e.data
  if (type === 'tut-mkr-code-update') {
    FILES.updateFile(`${SWP}/${metadata.id}/index.html`, payload)
  } else if (type === 'tut-mkr-metadata') {
    openMetadata(payload)
  } else if (type === 'tut-mkr-video-duration') {
    metadata.duration = payload
  } else if (type === 'tut-mkr-keyframe') {
    // when payload === { add, frame }, widget created a new keyframe
    if (payload.add) createKeyframe(payload.frame)
    else if (payload.frame) console.log('updated', payload)
    else displayKeyframeData(payload) // else, payload === keyframe
  } else if (type === 'tut-mkr-keylog') {
    if (payload instanceof Array) newKeylogsFromRecording(payload)
    else if (payload.add) createKeylog(payload.frame)
    else displayKeylogData(payload)
  } else if (type === 'tut-mkr-time-update') {
    videoTimeUpdated(payload)
  } else if (type === 'tut-mkr-data') {
    zipper.download(payload)
  } else if (type === 'tut-mkr-edit-widget') {
    editWidget(payload)
  }
})

nn.on('beforeunload', (e) => {
  // warn user about attmpet to close window
  // so they dont' accidently quit popup and loose tutorial progress
  e.preventDefault(); e.returnValue = ''
})

// custom modal element
class TutorialModal extends HTMLElement {
  constructor (opt) {
    super()
  }

  connectedCallback () {
    this.id = 'tut-mkr-modal'
    this.style.display = 'none'

    this.innerHTML = '<div class="tut-mkr-modal-content"></div>'
    this.content = this.querySelector('.tut-mkr-modal-content')
  }

  openWithHTML (html) {
    this.clear()
    this.style.display = 'flex'
    this.content.innerHTML = html
  }

  clear () { this.content.innerHTML = '' }

  close (options) {
    this.style.display = 'none'
    if (options.clear) this.clear()
  }
}

customElements.define('tutorial-modal', TutorialModal)
window.modal = modal
window.updateVideo = updateVideo
window.updateMetadata = updateMetadata
