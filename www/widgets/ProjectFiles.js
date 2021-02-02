/* global Widget, Convo, utils, FileUploader */
class ProjectFiles extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'project-files'
    this.keywords = ['assets', 'upload', 'github', 'files', 'project', 'finder']

    this.shaDict = {}

    this.title = 'Project Files'
    this._createHTML()
    this._setupFileUploader()

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
  }

  _createHTML () {
    this.innerHTML = `
      <div class="files-widget">
        <div class="files-widget__overlay">
          <div><!-- message --></div>
        </div>
        <!-- if logged out of GitHub -->
        <div class="files-widget__disclaimer">
          You're working on a sketch. In order to add assets (other files) you need to create a project first by authenticating your GitHub account and then clicking <code>newProject()</code> in the <b>Functions Menu</b>. (click on netnet's face to launch the <b>Functions Menu</b>)
        </div>
        <!-- if logged into GitHub -->
        <div class="files-widget__header">
          <button name="upload">Upload Asset</button>
        </div>
        <div class="files-widget__list">
          <!-- upldateFiles populates this div -->
        </div>
      </div>
    `

    this.$('[name="upload"]')
      .addEventListener('click', () => this.fu.input.click())

    this.updateFiles()
  }

  updateFiles (data) {
    // runs everytime a new repo (github project) is created or opened
    // as well as anytime a file is uploaded or deleted
    this._showHideDivs()
    this.$('.files-widget__list').innerHTML = ''
    if (!data) return

    const files = data
      .filter(f => f.name !== 'index.html')
      .filter(f => f.name !== 'README.md')
    files.forEach(file => {
      this.shaDict[file.name] = file.sha

      const ele = document.createElement('div')
      ele.className = 'files-widget__file'

      const name = document.createElement('span')
      name.textContent = file.name

      const del = document.createElement('span')
      del.textContent = '(✖)'
      del.className = 'files-widget--pointer'
      del.addEventListener('click', () => this.deleteFile(file.name))

      ele.appendChild(name)
      ele.appendChild(del)
      this.$('.files-widget__list').appendChild(ele)
    })
  }

  uploadFile (file) {
    this._upload = file.name
    if (this.shaDict[file.name]) {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'duplicate-file')
    } else {
      this.$('.files-widget__overlay > div').textContent = `...uploading ${file.name}...`
      this.$('.files-widget__overlay').style.display = 'flex'
      const data = {
        owner: window.localStorage.getItem('owner'),
        repo: window.localStorage.getItem('opened-project'),
        name: file.name,
        code: file.data.split('base64,')[1]
      }
      utils.post('./api/github/upload-file', data, (res) => {
        if (!res.success) {
          console.log('FunctionsMenu:', res)
          window.convo = new Convo(this.convos, 'oh-no-error')
        } else {
          this._upload = null
          this._postUpdate()
        }
      })
    }
  }

  deleteFile (filename) {
    // runs when user clicks a files delete button
    this._delete = filename
    this.convos = window.CONVOS[this.key](this)
    window.convo = new Convo(this.convos, 'confirm-delete')
  }

  _postDeletion (file) {
    // runs if user confirms deletion of file
    this.$('.files-widget__overlay > div').textContent = '...deleting...'
    this.$('.files-widget__overlay').style.display = 'flex'
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: window.localStorage.getItem('opened-project'),
      name: this._delete,
      sha: this.shaDict[this._delete]
    }
    utils.post('./api/github/delete-file', data, (res) => {
      if (!res.success) {
        console.log('FunctionsMenu:', res)
        window.convo = new Convo(this.convos, 'oh-no-error')
      } else {
        delete this.shaDict[this._delete]
        this._delete = null
        this._postUpdate()
      }
    })
  }

  _postUpdate () {
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: window.localStorage.getItem('opened-project')
    }
    utils.post('./api/github/open-project', data, (res) => {
      this.updateFiles(res.data)
      this.$('.files-widget__overlay').style.display = 'none'
    })
  }

  _showHideDivs () {
    const op = window.localStorage.getItem('opened-project')
    if (!op) {
      this.$('.files-widget__disclaimer').style.display = 'block'
      this.$('.files-widget__header').style.display = 'none'
      this.$('.files-widget__list').style.display = 'none'
    } else {
      this.$('.files-widget__disclaimer').style.display = 'none'
      this.$('.files-widget__header').style.display = 'block'
      this.$('.files-widget__list').style.display = 'block'
    }
  }

  _setupFileUploader () {
    this.fu = new FileUploader({
      maxSize: 5000, // 5 MB (see convos/project-files)
      ready: (file) => this.uploadFile(file),
      drop: '.files-widget',
      error: (err) => {
        console.error('ProjectFiles:', err)
        if (err.includes('file larger than max size')) {
          window.convo = new Convo(this.convos, 'file-too-big')
        }
      }
    })
  }
}

window.ProjectFiles = ProjectFiles
