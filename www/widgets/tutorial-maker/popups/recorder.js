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

    // if (!WIDGETS.loaded.includes('netitor-logger')) {
    //   WIDGETS.load('netitor-logger')
    // }

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
    const opts = { mimeType: 'video/mp4' }
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

  createRecorder: (opts) => {
    const html = `
      <video name="vid-stream" style="width: 100%;display:none;" autoplay playsinline muted></video>
      <div class="rec-opts av-strm-row">
        <button class="pill-btn" name="stream">stream only</button>
        <button class="pill-btn" name="record">stream + record</button>
      </div>
      <div class="recorded-videos av-strm-row">
        <!-- <div style="margin-top: 15px; text-align: center;">
          <p>⚠️ WARNING!!! AUDIO FEEDBACK ⚠️</p>
          <p>(mute your audio or use headphones)</p>
        </div> -->
      </div>
      <div class="av-strm-controls">
        <button class="pill-btn pill-btn--secondary" name="start-rec">start recording</button>
        <div>
          <input type="checkbox" name="av-keylog-sync"> include keylogger
        </div>
      </div>
      <div class="av-str-post-msg" style="margin-top: 15px">
        <button name="dl-kl">download</button>
      </div>
    `
    nn.get('#video-recorder').innerHTML = html

    nn.get('[name="stream"]').addEventListener('click', (e) => recorder.init(e))
    nn.get('[name="record"]').addEventListener('click', (e) => recorder.init(e, true))
    nn.get('[name="start-rec"]').addEventListener('click', (e) => {
      if (e.target.textContent === 'start recording') {
        e.target.textContent = 'stop'
        const k = nn.get('[name="av-keylog-sync"]').checked
        e.target.style.animation = 'av-strm-rec 1s infinite'
        recorder.startRecording(k)
      } else {
        e.target.textContent = 'start recording'
        e.target.style.animation = 'none'
        recorder.stopRecording()
      }
    })

    nn.get('[name="dl-kl"]').addEventListener('click', () => {
      recorder.download()
      // const k = nn.get('[name="av-keylog-sync"]').checked
      // if (k) WIDGETS['netitor-logger'].download()
    })
  },

  // -------------------------- [ WebRTC ] ------------------------------------

  reset: () => {
    nn.get('.av-str-post-msg').style.display = 'none'
    nn.get('[name="vid-stream"]').style.display = 'none'
    nn.get('.av-strm-controls').style.display = 'none'
    nn.get('.rec-opts').style.display = 'flex'
    nn.get('.recorded-videos').innerHTML = `
    <div style="margin-top: 15px; text-align: center;">
      <p>⚠️ WARNING!!! AUDIO FEEDBACK ⚠️</p>
      <p>(mute your audio or use headphones)</p>
    </div>
    `
  },

  displayRecording: () => {
    nn.get('[name="vid-stream"]').style.display = 'none'
    const video = document.createElement('video')
    video.controls = true
    const blob = new window.Blob(recorder.data, { type: 'video/webm' })
    video.src = window.URL.createObjectURL(blob)
    nn.get('.recorded-videos').appendChild(video)
    nn.get('.av-strm-controls').style.display = 'none'
    nn.get('.av-str-post-msg').style.display = 'block'
  },

  init: async (e, rec) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(recorder.rtcOpts)
      recorder.handleSuccess(stream)
      // e.target.disabled = true
      nn.get('[name="vid-stream"]').style.display = 'inline'
      nn.get('.rec-opts').style.display = 'none'
      nn.get('.recorded-videos').innerHTML = ''
      if (rec) nn.get('.av-strm-controls').style.display = 'flex'
    } catch (e) { recorder.handleError(e) }
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
