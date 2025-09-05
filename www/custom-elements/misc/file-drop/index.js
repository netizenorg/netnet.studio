/* global HTMLElement CustomEvent */
class FileDrop extends HTMLElement {
  static get observedAttributes () { return ['accept', 'max-size', 'max-files', 'multiple'] }

  constructor (opts) {
    super()
    this.config = {
      accept: '.pdf,.jpg,.png',
      maxSize: '5MB',
      maxFiles: '1',
      multiple: false
    }
    this.files = []
  }

  connectedCallback () {
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
        <button class="fldp-dd-btn icon-btn pill-btn pill-btn--secondary">Browse Files</button>
        <input class="fldp-file-input" type="file" hidden>
      </div>
      <div class="fldp-file-list"></div>
    `

    this.dropArea = this.querySelector('.fldp-drop-area')
    this.fileInput = this.querySelector('.fldp-file-input')
    this.fileList = this.querySelector('.fldp-file-list')

    this.applyListeners()
    this.applyAttributes()

    this.fileInput.setAttribute('accept', this.config.accept)
    this.fileInput.multiple = this.config.multiple
  }

  applyAttributes () {
    this.config.accept = this.getAttribute('accept') ?? this.config.accept
    this.config.maxSize = this.getAttribute('max-size') ?? this.config.maxSize
    const mf = parseInt(this.getAttribute('max-files'), 10)
    this.config.maxFiles = Number.isFinite(mf) ? mf : this.config.maxFiles
    this.config.multiple = this.hasAttribute('multiple') || this.config.maxFiles > 1
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
  }

  addFiles (e) {
    e.preventDefault()
    this.classList.remove('dragover')
    const incoming = Array.from(e.dataTransfer.files)

    // filter new files uploaded
    const nameSet = new Set(this.files.map(f => f.name.toLowerCase()))
    const fresh = incoming.filter(f => !nameSet.has(f.name.toLowerCase()))

    // only allow maxFiles
    const max = Number.isFinite(this.maxFiles) ? this.maxFiles : 1
    const room = Math.max(0, max - this.files.length)
    const toAdd = fresh.slice(0, room)
    const overflow = fresh.slice(room)

    this.files.push(...toAdd)
    this.renderFileItems()

    this.dispatchEvent(new CustomEvent('files-dropped', {
      detail: { added: toAdd, rejected: overflow, all: this.files.slice() },
      bubbles: true,
      composed: true
    }))
  }

  renderFileItems () {
    this.fileInput.innerHTML = ''
    this.files.forEach((file) => {
      const div = document.createElement('div')
      div.className = 'fldp-file-item'
      div.dataset.name = file.name.toLowerCase()
      const p = document.createElement('p')
      p.textContent = file.name

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
}

window.customElements.define('file-drop', FileDrop)
