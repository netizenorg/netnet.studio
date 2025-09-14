/* global nn metadata modal updateVideo zipper */
const recorder = {
  // TODO: methods for recording keystrokes (migrate + refactor from netitor-logger)
  key: 'stream-video',
  rtcOpts: {
    audio: { echoCancellation: true },
    video: { width: 720, height: 480 }
  },
  data: [],
  recorder: null,
  mimeType: 'video/webm',
  file: null,

  close: () => {
    if (window.stream) window.stream.getTracks().forEach(t => t.stop())
    recorder.reset()
  },

  displayRecordingSettings: (show) => {
    const settings = nn.getAll('.b-recording')
    settings.forEach((s) => {
      if (show) s.style.removeProperty('display')
      else s.style.display = 'none'
    })
  },

  startRecording: (keylogger) => {
    const mimeType = [
      'video/mp4;codecs="avc1.42E01E, mp4a.40.2"',
      'video/mp4;codecs="avc1.64001F, mp4a.40.2"',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ]
    for (const type of mimeType) {
      if (window.MediaRecorder.isTypeSupported?.(type)) {
        recorder.mimeType = type
        break
      }
    }
    recorder.data = []
    const opts = { mimeType: recorder.mimeType }
    recorder.recorder = new window.MediaRecorder(window.stream, opts)
    recorder.recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recorder.data.push(e.data)
    }
    recorder.recorder.onerror = (e) => { recorder.handleError(e) }
    recorder.recorder.onstop = (e) => {
      window.stream.getTracks().forEach(t => t.stop())
      recorder.displayRecording()
      // if (keylogger) WIDGETS['netitor-logger'].stopRecording()
      recorder.filename = metadata.id
    }
    recorder.recorder.start()
    // if (keylogger) WIDGETS['netitor-logger'].startRecording()
  },

  stopRecording: () => {
    recorder.recorder.stop()
    // recorder.download()
  },

  download: () => {
    const blob = new window.Blob(recorder.data, { type: recorder.mimeType })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.style = 'display: none'
    a.href = url
    a.download = `${recorder.filename || 'netnet-recording'}.webm`
    a.click()
    window.URL.revokeObjectURL(url)
    setTimeout(() => {
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }, 100)
  },

  // -------------------------- [ view ] ---------------------------------------

  createRecorder: async (opts) => {
    // TODO: add handling for keylogger
    nn.get('[name="vr-start-rec"]').addEventListener('click', () => recorder.changeState())
    nn.get('[name="vr-go-back"]').addEventListener('click', () => recorder.goBack())
    nn.get('[name="vr-edit-tut"]').addEventListener('click', () => recorder.editTutorial())
    // nn.get('[name="dl-kl"]').addEventListener('click', () => {
    //   recorder.download()
    //   // const k = nn.get('[name="av-keylog-sync"]').checked
    //   // if (k) WIDGETS['netitor-logger'].download()
    // })

    try {
      const stream = await navigator.mediaDevices.getUserMedia(recorder.rtcOpts)
      recorder.handleSuccess(stream)
      nn.get('.recorded-videos').innerHTML = ''
      nn.get('.vid-stream-loading').style.display = 'none'
      nn.get('[name="vid-stream"]').style.display = 'inline'
      nn.get('.av-strm-controls').style.display = 'flex'
    } catch (e) {
      recorder.handleError(e)
    }
  },

  initMenu: () => {
    nn.get('#record-video').addEventListener('click', (e) => recorder.init(e, true))
    nn.get('[name="file-drop-submit"]').addEventListener('click', () => recorder.onFileSubmit())
    nn.get('#video-menu file-drop').addEventListener('files-changed', (e) => {
      recorder.onFileChanged(e)
      const submit = nn.get('[name="file-drop-submit"]')
      if (recorder.file) submit.style.display = 'block'
      else submit.style.display = 'none'
    })
  },

  // -------------------------- [ WebRTC ] ------------------------------------

  changeState: () => {
    const btn = nn.get('[name="vr-start-rec"]')
    const text = nn.get('[name="vr-start-rec"] > p')
    const icon = nn.get('[name="vr-start-rec"] > svg')

    if (text.textContent === 'record video') {
      recorder.displayRecordingSettings(false)
      // change "record video" to "stop" button
      text.textContent = 'stop'
      icon.setAttribute('width', '19')
      icon.setAttribute('height', '19')
      icon.setAttribute('viewBox', '0 0 19 19')
      icon.style.width = '19px'
      icon.style.height = '19px'
      icon.innerHTML = '<rect width="19" height="19" rx="3" fill="#FF4545"/>'

      const k = nn.get('[name="av-keylog-sync"]').checked
      btn.style.animation = 'av-strm-rec 1s infinite'
      nn.get('.v-r-header').style.display = 'none'
      recorder.startRecording(k)
    } else if (text.textContent === 'stop') {
      recorder.stopRecording()
      btn.style.animation = 'none'
      // TODO: do we add a download option?
      // TODO: maybe add a discard and re-record option
    }
  },

  editTutorial: () => {
    if (recorder.mimeType.split(';')[0].trim() === 'video/mp4') {
      updateVideo(recorder.blob)
      nn.get('#video-recorder').style.display = 'none'
    } else {
      recorder.displayVFN()
      // nn.get('[name="vfn-download"]').addEventListener('click' => main.downloadTutorial())
    }
  },

  goBack: () => {
    nn.get('#video-recorder').style.display = 'none'
    nn.get('#video-menu').style.display = 'block'
  },

  includeKeylogs: () => {
    // TODO: add logic here
  },

  reset: () => {
    // nn.get('.av-str-post-msg').style.display = 'none'
    nn.get('[name="vid-stream"]').style.display = 'none'
    nn.get('.av-strm-controls').style.display = 'none'
    nn.get('.rec-opts').style.display = 'flex'
    // nn.get('.recorded-videos').innerHTML = `
    // <div style="margin-top: 15px; text-align: center;">
    //   <p>⚠️ WARNING!!! AUDIO FEEDBACK ⚠️</p>
    //   <p>(mute your audio or use headphones)</p>
    // </div>
    // `
  },

  displayRecording: () => {
    nn.get('[name="vid-stream"]').style.display = 'none'
    const video = document.createElement('video')
    video.controls = true
    const blob = new window.Blob(recorder.data, { type: 'video/webm' })
    recorder.blob = blob
    video.src = window.URL.createObjectURL(blob)
    nn.get('.recorded-videos').appendChild(video)

    // nn.get('.av-str-post-msg').style.display = 'block'
    nn.get('.recording-controls').style.display = 'none'
    nn.get('.playback-controls').style.removeProperty('display')
  },

  init: async (e) => {
    // hide video menu & display video recorder
    nn.get('#video-menu').style.display = 'none'
    nn.get('#video-recorder').style.display = 'block'

    const widthDiff = window.outerWidth - window.innerWidth
    const heightDiff = window.outerHeight - window.innerHeight
    window.resizeTo(802 + widthDiff, 700 + heightDiff)

    recorder.createRecorder()
  },

  handleSuccess: (stream) => {
    const video = nn.get('[name="vid-stream"]')
    const videoTracks = stream.getVideoTracks()
    console.log('Got stream with constraints:', recorder.rtcOpts)
    console.log(`Using video device: ${videoTracks[0].label}`)
    window.stream = stream // make variable available to browser console
    video.srcObject = stream
  },

  handleError: (e) => {
    window.alert('error! see console')
    console.error(e)
  },

  onFileChanged: (e) => {
    if (!e.detail.files) recorder.file = null
    else recorder.file = e.detail.files[0]
  },

  onFileSubmit: async () => {
    if (!recorder.file) {
      console.error('No file detected to be uploaded. Please upload a file.')
      return
    }
    if (document.querySelector('tutorial-modal file-drop')) modal.close({ clear: true })
    const blobURL = URL.createObjectURL(recorder.file)
    updateVideo(blobURL)
  },

  // functions for Video Format Notice
  displayVFN: () => {
    const innerHTML = `
      <h2>Video Format Notice</h2>
      <p>Looks like for compatibility reasons you recorded we recorded your video as a .webm. In order to be able to continue editing your tutorial we require users to convert their tutorial videos to .mp4.</p>
      <a href="#" style="margin-bottom: 10px;">how to convert my video to .mp4?</a>
      <div class="buttons">
        <button name="vfn-download" class="pill-btn pill-btn--secondary">download tutorial</button>
        <button name="vfn-upload" class="pill-btn pill-btn--secondary">upload mp4</button>
      </div>
      <p class="warning">Please download your tutorial before leaving this page, otherwise your data will be lost.</p>
    `
    modal.openWithHTML(innerHTML)
    nn.get('[name="vfn-upload"]').addEventListener('click', () => recorder.onUploadVFN())
    nn.get('[name="vfn-download"]').addEventListener('click', () => zipper.download(recorder.blob))
  },

  onUploadVFN: () => {
    const uploader = `
      <file-drop accept=".mp4" maxFiles="1" maxSize="1GB"></file-drop>
      <div class="buttons">
         <button name="vfn-upload-go-back" class="pill-btn pill-btn--secondary">go back</button>
         <button name="vfn-upload-submit" class="pill-btn pill-btn--secondary">submit</button>
      </div>
    `
    modal.openWithHTML(uploader)
    nn.get('tutorial-modal file-drop').addEventListener('files-changed', (e) => recorder.onFileChanged(e))
    nn.get('[name="vfn-upload-go-back"]').addEventListener('click', () => recorder.displayVFN())
    nn.get('[name="vfn-upload-submit"]').addEventListener('click', () => recorder.onFileSubmit())
  }
}

window.recorder = recorder
