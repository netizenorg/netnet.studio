/* global JSZip nn metadata Blob FILES recorder fetch */
const zipper = {
  mimeFromName: (name) => {
    const ext = name.split('.').pop().toLowerCase()
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'].includes(ext)) return 'image/' + (ext === 'jpg' ? 'jpeg' : ext)
    if (ext === 'svg') return 'image/svg+xml'
    if (ext === 'pdf') return 'application/pdf'
    if (['txt', 'md', 'csv', 'log'].includes(ext)) return 'text/plain'
    if (ext === 'json') return 'application/json'
    if (ext === 'html') return 'text/html'
    if (ext === 'css') return 'text/css'
    if (ext === 'js') return 'text/javascript'
    return 'application/octet-stream'
  },

  isTextType: (type) => {
    if (type.startsWith('text/')) return true
    if ([ // TODO might need to add more?
      'application/json',
      'application/javascript',
      'application/xml',
      'application/xhtml+xml',
      'application/svg+xml'
    ].includes(type)) {
      return true
    }
    return false
  },

  isHiddenFile: (path) => {
    return path.startsWith('__MACOSX/') || path.split('/').some(p => p.startsWith('.'))
  },

  open: (swPath, callback) => {
    const picker = nn.create('input')
      .set({ type: 'file', accept: '.zip,application/zip' })
      .css({ display: 'none' })
      .addTo('body')

    async function handleFile (file) {
      const filesDict = {}
      const id = file.name.split('.')[0]
      const zip = await JSZip.loadAsync(await file.arrayBuffer())
      const tasks = []
      zip.forEach((path, item) => {
        if (item.dir) return
        if (zipper.isHiddenFile(path)) return

        tasks.push((async () => {
          const type = zipper.mimeFromName(item.name)
          if (zipper.isTextType(type)) { // store raw text (utf-8)
            const text = await item.async('string')
            filesDict[`${swPath}/${path}`] = text
          } else { // store object URL for binary (images, video, pdf, etc.)
            const blob = await item.async('blob')
            const typed = new window.Blob([blob], { type })
            const url = URL.createObjectURL(typed)
            filesDict[`${swPath}/${path}`] = url
          }
        })())
      })

      await Promise.all(tasks)
      if (callback) callback(id, filesDict)
    }

    picker.on('change', (e) => {
      const file = picker.files && picker.files[0]
      if (file) handleFile(file)
      picker.value = ''
    })

    picker.click()
  },

  URLtoBlob: async (url) => {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch blob URL.')
      const blob = await res.blob()
      return blob
    } catch (error) {
      throw new Error('Failed to convert blob URL to Blob: ', error)
    }
  },

  download: async (data = null) => {
    try {
      const video = data?.video || FILES.readFile(`${metadata.id}.mp4`)
      const tutorial = { metadata: {}, widgets: {}, keyframes: [], keylogs: [] }
      // set metadata
      const keys = ['id', 'title', 'author', 'authorURL', 'duration', 'jsfile', 'description', 'keywords', 'thumbnails']
      keys.forEach(key => {
        tutorial.metadata[key] = metadata[key]
      })
      // TODO: configure widgets
      tutorial.keyframes = data?.keyframes ?? []
      tutorial.keylogs = data?.keylogs ?? []

      const json = JSON.stringify(tutorial, null, 2)

      // handle video data
      let blob
      if (video instanceof Blob) blob = video
      else if (typeof video === 'string' && video.startsWith('blob:')) blob = await zipper.URLtoBlob(video)
      else throw new Error('Video must be type Blob or blob URL. type was: ', typeof video)

      const zip = new JSZip()
      zip.file('tutorial.json', json)
      zip.file(
        data?.video
          ? metadata.id + (recorder.mimeType.includes('mp4') ? '.mp4' : '.webm')
          : `${metadata.id}.mp4`,
        blob,
        { compression: 'STORE' }
      )

      // load all files under FILES.files
      const ignoreFiles = [`${metadata.id}.mp4`, 'tutorial.json', 'index.html']
      for (const file of Object.entries(FILES.files)) {
        const fileName = file[1].path.split('/').pop()
        if (ignoreFiles.includes(fileName)) continue

        const filePath = file[1].path.split('/').slice(2).join('/')
        const fileData = FILES.readFile(file[1].path)
        if (fileData.startsWith('blob:')) {
          const res = await fetch(fileData)
          const blob = await res.blob()
          zip.file(filePath, blob, { binary: true })
        } else {
          zip.file(filePath, fileData)
        }
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' })
      //  trigger download
      const a = document.createElement('a')
      a.href = URL.createObjectURL(zipBlob)
      a.download = `${metadata.id}.zip`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(a.href)
    } catch (error) {
      console.error('Failed to download tutorial: ', error)
    }
  }
}

window.zipper = zipper
