/* global nn timeline zipper recorder FILES metadata HTMLElement customElements */

const SWP = 'TUTORIAL_MAKER' // MUST MATCH PATH IN: files-db-service-worker.js
let TIMECODE = 0 // timeline's current timecode (ie. playhead location)
let modal

const msg = (type, payload) => {
  window.opener.postMessage({ type, payload }, window.origin)
}

function overlay (ele) {
  nn.getAll('.overlay').forEach(e => e.css('display', 'none'))
  if (ele) nn.get(ele).css('display', 'block')
  if (ele) window.resizeTo(436, 731)
  else window.resizeTo(1000, 300)

  if (ele === '#metadata') {
    window.resizeTo(420, 850)
    metadata.init()
  } else if (ele === '#video-menu') {
    window.resizeTo(420, 850)
    recorder.initMenu()
  }
}

function openTutorial () {
  // open zip file...
  zipper.open(SWP, async (id, files) => {
    const loaded = await FILES.init(id, files) // load files to indexedDB
    console.log('FILES LOADED:', loaded)
    const tut = JSON.parse(files[`${SWP}/${id}/tutorial.json`]) // get tutorial data
    // load metadata
    Object.assign(metadata, tut.metadata)

    // modify's path so that the service worker resolves requests correctly
    for (const key in tut.widgets) {
      const wig = tut.widgets[key]
      wig.innerHTML = wig.innerHTML.replace(/tutorials\//g, 'TUTORIAL_MAKER/')
    }
    if (tut.keyframes[0].code && tut.keyframes[0].code !== 'DEFAULT') {
      // update db's index.html (used by SW to render iframe)
      FILES.updateFile(`${SWP}/${metadata.id}/index.html`, tut.keyframes[0].code)
    }
    // create timeline markers for keyframes && keylogs
    tut.keyframes.forEach(kf => addMarker(kf, 'keyframe'))
    tut.keylogs.forEach(kl => addMarker(kl, 'keylog'))
    timeline.updateMarkers()

    tut.videoBlob = FILES.readFile(metadata.id + '.mp4')
    msg('tut-mkr-opened-tutorial', tut) // let main tutorial-maker widget know
    overlay(null) // remove overlay
  })
}

function updateMetadata (data) {
  FILES.init(metadata.id, {})
  msg('tut-mkr-update-metadata', data)

  const hasVid = FILES.readFile(`${metadata.id}.mp4`) || FILES.readFile(`${metadata.id}.webm`)
  if (hasVid) overlay(null)
  else overlay('#video-menu')

  // NOTE: the metadata.id is used all over the place && works best if only set once
  // but we may want to allow the user to change it, so we'll need to make sure
  // to do some cleanup. first things that comes to mind is we'll need to
  // re-run FILES.init(id, files) with the new id name
}

function updateVideo (blob) {
  // NOTE: chrome has issues with "seeking" a video when being served by a SW...
  // FILES.updateFile(`${TUT_ID}.mp4`, blob) // <-(so can't do this anymore)
  // ...so instead of requesting the blob from the SW we need to give it to the
  // HyperVideoPlayer directly...
  msg('tut-mkr-update-video', blob)
  overlay(null)
  // NOTE: this should only run once per tutorial
  // if they want to re-record the video, they should make a new tutorial
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
    const marker = nn.get(`[name="keyframe-${obj.keyframe.timecode}"]`)
    timeline.selectMarker(marker)
    keyframeEditMode(true)
  } else {
    keyframeEditMode(false)
  }
  if (obj.keylog) {
    const marker = nn.get(`[name="keylog-${obj.keylog.timecode}"]`)
    timeline.selectMarker(marker)
  }
}

function openMetadata (metadata) {
  const q = n => `#metadata input[name="${n}"]`
  const except = ['thumbnails', 'duration', 'jsfile'] // upated another way
  for (const key in metadata) {
    if (!except.includes(key)) {
      nn.get(q(key)).value = metadata[key]
    }
  }
  overlay('#metadata')
}

function addMarker (k, type) {
  const t = k.timecode
  const x = t / metadata.duration * 100
  timeline.createMarker(x, t, type, (tc) => {
    msg(`tut-mkr-${type}-click`, tc)
    if (type === 'keyframe') setNameInput(tc)
  })
  if (type === 'keyframe') nn.get(`[name="keyframe-${k.timecode}"]`).dataset.name = k.name
}

function createKeyframe (kf) {
  addMarker(kf, 'keyframe')
  timeline.updateMarkers()
}

function updateKeyframe () {
  const name = document.querySelector('#kf-name-input')?.textContent
  msg('tut-mkr-get-keyframe', { name, timecode: TIMECODE })
  nn.get(`[name="keyframe-${TIMECODE}"]`).dataset.name = name
}

function deleteKeyframe () {
  timeline.removeMarker(TIMECODE, 'keyframe')
  msg('tut-mkr-get-keyframe', { timecode: TIMECODE, remove: true })
}

function keyframeEditMode (enable) {
  const tools = nn.getAll('[kf-edit-tool]')
  if (enable) tools.forEach((t) => { t.style.display = 'block' })
  else tools.forEach((t) => { t.style.display = 'none' })
}

function setNameInput (tc) {
  const name = nn.get(`[name="keyframe-${tc}"]`).dataset.name
  nn.get('#kf-name-input').textContent = name
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

// -------------------------------------------------------- SETUP EVENT LISTENRS

nn.get('#new').on('click', () => overlay('#metadata'))
nn.get('#open').on('click', openTutorial)
// nn.get('#close-recorder').on('click', updateVideo)
nn.get('#open-metadata').on('click', () => msg('tut-mkr-get-metadata'))
nn.get('#create-marker').on('click', () => showCreateOptions())

nn.get('#create-keyframe').on('click', () => msg('tut-mkr-get-keyframe', { timecode: TIMECODE }))
nn.get('#update-keyframe').on('click', () => updateKeyframe())
nn.get('#delete-keyframe').on('click', () => deleteKeyframe())
nn.get('#download-tutorial').on('click', () => msg('tut-mkr-get-data'))

// TODO: configure keylog actions
// nn.get('#create-keylog').on('click', () => msg('tut-mkr-get-keyframe', { timecode: TIMECODE }))

nn.getAll('button[name]').forEach(btn => {
  btn.on('click', () => {
    msg('tut-mkr-explain', btn.getAttribute('name'))
  })
})
nn.get('#kf-name-input').on('keydown', (e) => { e.stopPropagation() }) // prevents shortcuts when typing

// opening and closing spotlight dropdown
nn.get('#spotlight-dd').addEventListener('click', (e) => {
  const em = nn.get('.sptlght-edit-menu')
  if (!em.contains(e.target)) {
    em.style.display = em.style.display === 'none' ? 'flex' : 'none'
  }
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
})

nn.on('resize', () => {
  timeline.placeLabels()
  timeline.updateMarkers()
})

nn.on('keydown', (e) => {
  const avoidToggle = ['input', 'textarea']
  if (e.key === ' ' && !avoidToggle.includes(e.target.localName)) {
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
    if (payload.add) createKeyframe(payload.frame)
  } else if (type === 'tut-mkr-keylog') {
    // TODO...
  } else if (type === 'tut-mkr-time-update') {
    videoTimeUpdated(payload)
  } else if (type === 'tut-mkr-data') {
    zipper.download(payload)
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
