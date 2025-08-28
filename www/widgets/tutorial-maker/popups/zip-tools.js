/* global JSZip nn */
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

  download: () => {
    // TODO: store all the data in FILES.files into a zip file && download it
    // NOTE: except for FILES.files["TUTORIAL_MAKER/what-is-test/tutorial.json"]
    // the tutorials.json should be created from the latest code in HVP.data
    console.log('TODO: create zipper.download() method')
  }
}

window.zipper = zipper
