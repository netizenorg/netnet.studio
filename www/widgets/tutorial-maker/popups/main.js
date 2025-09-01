/* global nn timeline zipper recorder FILES metadata */

const SWP = 'TUTORIAL_MAKER' // MUST MATCH PATH IN: files-db-service-worker.js
let TUT_ID = null
let THUMBNAILS = []
let DUR = 0
let JSFILE = false
let TIMECODE = 0 // timeline's current timecode (ie. playhead location)

const msg = (type, payload) => {
  window.opener.postMessage({ type, payload }, window.origin)
}

function overlay (ele) {
  console.log("here")
  nn.getAll('.overlay').forEach(e => e.css('display', 'none'))
  if (ele) nn.get(ele).css('display', 'block')
  if (ele) window.resizeTo(436, 731)
  else window.resizeTo(1000, 300)

  if (ele === '#metadata') {
    window.resizeTo(420, 850)
    metadata.init()
  }
}

function openTutorial () {
  // open zip file...
  zipper.open(SWP, async (id, files) => {
    TUT_ID = id // set tutorial id globally
    const loaded = await FILES.init(id, files) // load files to indexedDB
    console.log('FILES LOADED:', loaded)
    const tut = JSON.parse(files[`${SWP}/${id}/tutorial.json`]) // get tutorial data
    THUMBNAILS = tut.metadata.thumbnails
    DUR = tut.metadata.duration
    JSFILE = tut.metadata.jsfile
    // modify's path so that the service worker resolves requests correctly
    for (const key in tut.widgets) {
      const wig = tut.widgets[key]
      wig.innerHTML = wig.innerHTML.replace(/tutorials\//g, 'TUTORIAL_MAKER/')
    }
    if (tut.keyframes[0].code && tut.keyframes[0].code !== 'DEFAULT') {
      // update db's index.html (used by SW to render iframe)
      FILES.updateFile(`${SWP}/${TUT_ID}/index.html`, tut.keyframes[0].code)
    }
    // create timeline markers for keyframes && keylogs
    const marker = (k, type) => {
      const t = k.timecode
      const x = t / DUR * 100
      timeline.createMarker(x, t, type, (tc) => {
        msg(`tut-mkr-${type}-click`, tc)
      })
    }
    tut.keyframes.forEach(kf => marker(kf, 'keyframe'))
    tut.keylogs.forEach(kl => marker(kl, 'keylog'))
    timeline.updateMarkers()

    msg('tut-mkr-opened-tutorial', tut) // let main tutorial-maker widget know
    overlay(null) // remove overlay
  })
}

function updateMetadata (data) {
  TUT_ID = data.id

  msg('tut-mkr-update-metadata', data)

  const hasVid = FILES.readFile(`${TUT_ID}.mp4`) || FILES.readFile(`${TUT_ID}.webm`)
  if (hasVid) overlay(null)
  else overlay('#video-recorder')

  // NOTE: the TUT_ID is used all over the place && works best if only set once
  // but we may want to allow the user to change it, so we'll need to make sure
  // to do some cleanup. first things that comes to mind is we'll need to
  // re-run FILES.init(id, files) with the new id name
}

function updateVideo () {
  // TODO: need to store video blob to indexedDB
  // like this >> FILES.updateFile(`${TUT_ID}.mp4`, video-blob)
  msg('tut-mkr-update-video') // << notifies to load video blob from indexedDB
  overlay(null)
  // NOTE: this should only run once per tutorial
  // if they want to re-record the video, they should make a new tutorial
}
window.updateMetadata = updateMetadata

function videoTimeUpdated (obj) { // runs as video plays && it's time udpates
  TIMECODE = obj.time
  const x = obj.time / DUR * 100
  timeline.updatePlayhead(x)
  timeline.clearSelections()
  if (obj.keyframe) {
    const marker = nn.get(`[name="keyframe-${obj.keyframe.timecode}"]`)
    timeline.selectMarker(marker)
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

// -------------------------------------------------------- SETUP EVENT LISTENRS

nn.get('#new').on('click', () => overlay('#metadata'))
nn.get('#open').on('click', openTutorial)
nn.get('#close-recorder').on('click', updateVideo)
nn.get('#open-metadata').on('click', () => msg('tut-mkr-get-metadata'))
nn.get('#update-keyframe').on('click', () => msg('tut-mkr-get-keyframe', TIMECODE))

nn.getAll('button[name]').forEach(btn => {
  btn.on('click', () => {
    msg('tut-mkr-explain', btn.getAttribute('name'))
  })
})

// .................... window events

nn.on('load', () => {
  timeline.onScrub = (x) => {
    const time = (x / 100) * DUR
    msg('tut-mkr-seek', time)
  }
  timeline.init()
})

nn.on('resize', () => {
  timeline.placeLabels()
  timeline.updateMarkers()
})

nn.on('keydown', (e) => {
  if (e.key === ' ' && e.target.localName !== 'input') {
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
    FILES.updateFile(`${SWP}/${TUT_ID}/index.html`, payload)
  } else if (type === 'tut-mkr-metadata') {
    openMetadata(payload)
  } else if (type === 'tut-mkr-video-duration') {
    DUR = payload
  } else if (type === 'tut-mkr-keyframe') {
    // TODO: select/enable keyframe, payload === keyframe object
  } else if (type === 'tut-mkr-keylog') {
    // TODO...
  } else if (type === 'tut-mkr-time-update') {
    videoTimeUpdated(payload)
  }
})

nn.on('beforeunload', (e) => {
  // warn user about attmpet to close window
  // so they dont' accidently quit popup and loose tutorial progress
  e.preventDefault(); e.returnValue = ''
})
