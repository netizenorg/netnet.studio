/* global nn metadata */
const recorder = {
  // TODO: methdos for recording video (migrate + refactor from stream-video widget)
  // TODO: methods for recording keystrokes (migrate + refactor from netitor-logger)
  key: 'stream-video',
  rtcOpts: {
    audio: { echoCancellation: true },
    video: { width: 720, height: 480 }
  },
  data: [],
  recorder: null,

  close: () => {
    if (window.stream) window.stream.getTracks().forEach(t => t.stop())
    recorder.reset()
  },

  startRecording: (keylogger) => {
    recorder.data = []
    // NOTE: in future might want to use .isTypeSupported
    // to check for supported types, like:
    // 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
    // 'video/webm;codecs=vp9,opus'
    // 'video/webm;codecs=vp8,opus'
    // TODO if firefox record webm and display conversion message afterwards
    const opts = { mimeType: 'video/webm' }
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
    const blob = new window.Blob(recorder.data, { type: 'video/webm' })
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
    // nn.get('[name="dl-kl"]').addEventListener('click', () => {
    //   recorder.download()
    //   // const k = nn.get('[name="av-keylog-sync"]').checked
    //   // if (k) WIDGETS['netitor-logger'].download()
    // })

    try {
      const stream = await navigator.mediaDevices.getUserMedia(recorder.rtcOpts)
      recorder.handleSuccess(stream)
      nn.get('[name="vid-stream"]').style.display = 'inline'
      // nn.get('.recorded-videos').innerHTML = ''
      nn.get('.av-strm-controls').style.display = 'flex'
    } catch (e) {
      recorder.handleError(e)
    }
  },

  initMenu: () => {
    nn.get('#record-video').addEventListener('click', (e) => recorder.init(e, true))
    // TODO add handling for uploading a video
  },

  // -------------------------- [ WebRTC ] ------------------------------------

  changeState: () => {
    const btn = nn.get('[name="vr-start-rec"]')
    const text = nn.get('[name="vr-start-rec"] > p')
    const icon = nn.get('[name="vr-start-rec"] > svg')

    if (text.textContent === 'record video') {
      // change "record video" to "stop" button
      text.textContent = 'stop'
      icon.width = '19'
      icon.height = '19'
      icon.viewBox = '0 0 19 19'
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
    video.src = window.URL.createObjectURL(blob)
    nn.get('.recorded-videos').appendChild(video)

    nn.get('.av-str-post-msg').style.display = 'block'
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
  }
}

window.recorder = recorder
