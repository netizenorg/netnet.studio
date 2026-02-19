/* global HTMLElement CustomEvent FileList */
class FileDrop extends HTMLElement {
  static get observedAttributes () { return ['accept', 'max-size', 'max-files', 'multiple', 'disableFileList', 'allowNames', 'allowFolder'] }

  constructor (opts) {
    super()
    this.config = {
      accept: '.pdf, .jpg, .png',
      maxSize: '5MB',
      maxFiles: 1,
      multiple: false,
      disableFileList: false,
      allowNames: [],
      allowFolder: false
    }
    this.files = []
  }

  connectedCallback () {
    this.applyAttributes()

    this.innerHTML = `
      <div class="fldp-drop-area" role="button" tabindex="0" aria-label="Upload files">
        <svg width="28" height="31" viewBox="0 0 28 31" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2L14 20.5" stroke="#C3C3DA" stroke-width="3" stroke-linecap="round"/>
          <path d="M22 13L14.832 2.24807C14.4362 1.65434 13.5638 1.65434 13.1679 2.24808L6 13" stroke="#C3C3DA" stroke-width="3" stroke-linecap="round"/>
          <path d="M2 21.5V28.5C2 29.0523 2.44772 29.5 3 29.5H25C25.5523 29.5 26 29.0523 26 28.5V21.5" stroke="#C3C3DA" stroke-width="3" stroke-linecap="round"/>
        </svg>
        <p class="fldp-dd-text">Drag & Drop</p>
        <div class="fldp-or-divider">
          <hr><p>or</p><hr>
        </div>
        <div class="fldp-browse-btns">
          <button class="fldp-dd-btn icon-btn pill-btn pill-btn--secondary">Upload Files</button>
          ${this.config.allowFolder ? '<button class="fldp-folder-btn icon-btn pill-btn pill-btn--secondary">Upload Folder</button>' : ''}
        </div>
        <input class="fldp-file-input" type="file" hidden>
        <input class="fldp-folder-input" type="file" webkitdirectory hidden>
        <p class="fldp-msg">* accepted file formats: ${this.config.accept}</p>
      </div>
      <div class="fldp-file-list"></div>
    `

    this.dropArea = this.querySelector('.fldp-drop-area')
    this.fileInput = this.querySelector('.fldp-file-input')
    this.folderInput = this.querySelector('.fldp-folder-input')
    this.fileList = this.querySelector('.fldp-file-list')

    this.applyListeners()

    this.fileInput.setAttribute('accept', this.config.accept)
    this.fileInput.multiple = this.config.multiple
  }

  applyAttributes () {
    this.config.accept = this.getAttribute('accept') ?? this.config.accept
    this.config.maxSize = this.getAttribute('max-size') ?? this.config.maxSize
    this.config.maxFiles = this.getAttribute('maxFiles') || this.config.maxFiles
    this.config.multiple = this.getAttribute('multiple') || this.config.maxFiles > 1
    this.config.disableFileList = this.hasAttribute('disableFileList') || this.config.disableFileList
    this.config.allowNames = this.getAttribute('allowNames')
      ? this.getAttribute('allowNames').split(',').map(x => x.trim().toLowerCase()).filter(Boolean)
      : this.config.allowNames
    this.config.allowFolder = this.hasAttribute('allowFolder') || this.config.allowFolder
  }

  applyListeners () {
    this.dropArea.addEventListener('dragover', e => { e.preventDefault(); this.classList.add('dragover') })
    this.dropArea.addEventListener('dragleave', () => this.classList.remove('dragover'))
    this.dropArea.addEventListener('drop', e => this.addFiles(e))

    this.querySelector('.fldp-dd-btn').addEventListener('click', e => {
      if (e.target.closest('.fldp-dd-btn') || e.target.closest('.drop-area')) {
        e.preventDefault()
        this.fileInput.click()
      }
    })

    this.fileInput.addEventListener('change', e => this.addFiles(e))
    this.folderInput.addEventListener('change', e => this.addFiles(e))

    if (this.config.allowFolder) {
      this.querySelector('.fldp-folder-btn').addEventListener('click', e => {
        e.preventDefault()
        this.folderInput.click()
      })
    }
  }

  async addFiles (e) {
    e.preventDefault()
    this.classList.remove('dragover')

    const { accept, maxFiles } = this.config

    // resolve incoming files — use FileSystem API for drag-drop when allowFolder
    // is set so that folder structure (relativePath) is preserved
    let incoming = []
    const items = e?.dataTransfer?.items
    if (items && items.length > 0 && this.config.allowFolder) {
      const entries = Array.from(items).map(i => i.webkitGetAsEntry()).filter(Boolean)
      const allFiles = await Promise.all(entries.map(entry => this._readEntry(entry)))
      incoming = allFiles.flat()
    } else {
      const files =
        e?.dataTransfer?.files ||
        e?.currentTarget?.files ||
        e?.target?.files ||
        (e instanceof FileList ? e : null)
      if (!files || files.length === 0) return
      incoming = Array.from(files).map(file => {
        // <input webkitdirectory> already populates webkitRelativePath — copy
        // it onto our own relativePath property so the consumer always has one
        // consistent property to read regardless of how files were added
        if (file.webkitRelativePath) {
          Object.defineProperty(file, 'relativePath', {
            value: file.webkitRelativePath,
            writable: false,
            configurable: true
          })
        }
        return file
      })
    }

    if (incoming.length === 0) return

    // remove any previous error messages
    this.displayMsg({
      text: `* accepted file formats: ${accept}`
    })

    // return if maxFiles amount is already met
    if (this.files.length > maxFiles) {
      this.displayMsg({
        text: `Max amount of files (${maxFiles}) has already been uploaded. Please remove previously uploaded files and re-upload.`,
        type: 'error'
      })
      return
      // TODO: if a user uploads a new file, prompt them with the option to replace the already uploaded files with the new uploads
    }

    // filter new files uploaded (key on relativePath when available so that
    // two files with the same name in different folders are treated as distinct)
    const pathSet = new Set(this.files.map(f => (f.relativePath || f.name).toLowerCase()))
    const newFiles = incoming.filter(f => !pathSet.has((f.relativePath || f.name).toLowerCase()))
    // filter non-accepted file formats
    const acceptedFiles = this.filterAcceptedFiles(newFiles)
    // only allow maxFiles
    const { add, rejected } = this.filterMaxFilesAmount(acceptedFiles)

    this.files.push(...add)
    if (!this.config.disableFileList) this.renderFileItems()

    this.dispatchEvent(new CustomEvent('files-changed', {
      detail: { added: add, rejected, files: this.files.slice() },
      bubbles: true,
      composed: true
    }))
  }

  // recursively resolve a FileSystemEntry into a flat array of File objects,
  // each with a .relativePath set to its full path within the dropped folder
  async _readEntry (entry, basePath = '') {
    if (entry.isFile) {
      return new Promise(resolve => {
        entry.file(file => {
          const relPath = basePath ? `${basePath}/${file.name}` : file.name
          Object.defineProperty(file, 'relativePath', {
            value: relPath,
            writable: false,
            configurable: true
          })
          resolve([file])
        }, () => resolve([]))
      })
    } else if (entry.isDirectory) {
      const dirPath = basePath ? `${basePath}/${entry.name}` : entry.name
      const reader = entry.createReader()
      // readEntries only returns up to 100 entries at a time — loop until empty
      const allEntries = await new Promise(resolve => {
        const results = []
        const readBatch = () => {
          reader.readEntries(batch => {
            if (batch.length === 0) return resolve(results)
            results.push(...batch)
            readBatch()
          }, () => resolve(results))
        }
        readBatch()
      })
      const nested = await Promise.all(allEntries.map(e => this._readEntry(e, dirPath)))
      return nested.flat()
    }
    return []
  }

  filterAcceptedFiles (files) {
    const acceptedTypes = this.config.accept.split(',').map(x => x.trim()).filter(Boolean)
    const allowedNames = this.config.allowNames
    const acceptedFiles = []
    const rejectedFiles = []
    files.forEach(f => {
      const dot = f.name.lastIndexOf('.')
      const ext = f.name.slice(dot).toLowerCase()
      if (acceptedTypes.includes(ext) || allowedNames.includes(f.name.toLowerCase())) {
        acceptedFiles.push(f)
      } else {
        rejectedFiles.push(f)
      }
    })
    if (rejectedFiles.length > 0) {
      const names = rejectedFiles.map(f => f.name).join(', ')
      this.displayMsg({
        text: `${rejectedFiles.length === 1 ? 'File' : 'Files'} not accepted: ${names}`,
        type: 'error'
      })
    }
    return acceptedFiles
  }

  filterMaxFilesAmount (files) {
    const maxFiles = this.config.maxFiles
    const max = maxFiles ?? 1
    const room = Math.max(0, max - this.files.length)
    const add = files.slice(0, room)
    const rejected = files.slice(room)

    // if maxFile is exceeded, show error message
    if (Array.isArray(rejected) && rejected.length > 0) {
      this.displayMsg({
        text: `
          Max amount of files accepted is
          ${maxFiles}. ${rejected.length}
          ${rejected.length > 1 ? 'files were' : 'file was'} rejected.`,
        type: 'error'
      })
    }
    return { add, rejected }
  }

  renderFileItems () {
    this.fileInput.innerHTML = ''
    this.files.forEach((file) => {
      const div = document.createElement('div')
      div.className = 'fldp-file-item'
      div.dataset.name = file.name.toLowerCase()
      const p = document.createElement('p')
      p.textContent = file.relativePath || file.name

      // create 'X' svg button
      const NS = 'http://www.w3.org/2000/svg'
      const svg = document.createElementNS(NS, 'svg')
      svg.setAttribute('width', '15')
      svg.setAttribute('height', '15')
      svg.setAttribute('viewBox', '0 0 15 15')
      svg.setAttribute('fill', 'none')
      svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

      const p1 = document.createElementNS(NS, 'path')
      p1.setAttribute('d', 'M13 2L2 13')
      p1.setAttribute('stroke', '#1D1B36')
      p1.setAttribute('stroke-width', '3')
      p1.setAttribute('stroke-linecap', 'round')

      const p2 = document.createElementNS(NS, 'path')
      p2.setAttribute('d', 'M13 13L2 2')
      p2.setAttribute('stroke', '#1D1B36')
      p2.setAttribute('stroke-width', '3')
      p2.setAttribute('stroke-linecap', 'round')
      svg.appendChild(p1)
      svg.appendChild(p2)

      svg.addEventListener('click', (e) => this.removeFileItem(e))

      div.appendChild(p)
      div.appendChild(svg)
      this.fileList.appendChild(div)
    })
  }

  removeFileItem (e) {
    const item = e.target.closest('.fldp-file-item')
    const name = item.dataset.name
    const i = this.files.findIndex(f => f.name.toLowerCase() === name.toLowerCase())
    if (i !== -1) this.files.splice(i, 1)
    item.remove()
    this.dispatchEvent(new CustomEvent('files-changed', {
      detail: { files: this.files.slice() }, bubbles: true, composed: true
    }))
  }

  displayMsg (data) {
    const { text, type } = data
    const msg = this.querySelector('.fldp-msg')
    msg.textContent = text
    if (type === 'error') msg.style.color = '#FF4545'
    else msg.style.color = 'var(--netizen-meta)'
  }
}

window.customElements.define('file-drop', FileDrop)
