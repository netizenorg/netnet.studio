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
        <div class="files-widget__overlay files-widget__overlay--upload">
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
        <ul class="files-widget__list">
          <!-- upldateFiles populates this div -->
        </ul>
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

      const ele = document.createElement('li')
      ele.className = 'files-widget__file'

      const name = document.createElement('span')
      name.className = 'files-widget__name'
      name.textContent = file.name

      const del = document.createElement('span')

      const trash = '<?xml version="1.0" encoding="utf-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)"><path d="M4230.9,4975.2c-271.7-74.3-476.8-241-607.6-497.3c-69.2-138.4-71.8-153.8-79.5-625.5c-7.7-464-7.7-484.5,46.1-540.9c151.2-161.5,556.3-125.6,638.3,56.4c15.4,35.9,28.2,220.5,28.2,430.7c0,335.8,5.1,376.8,51.3,423c28.2,28.2,76.9,56.4,110.2,64.1c30.8,7.7,320.4,12.8,643.5,7.7l584.5-7.7l61.5-71.8c59-69.2,61.5-87.2,61.5-464c0-423,0-423,153.8-502.5c89.7-48.7,330.7-43.6,428.1,7.7c133.3,69.2,141,107.7,130.7,592.2c-7.7,428.1-10.3,440.9-87.1,605c-100,212.8-258.9,371.7-471.7,471.7l-166.6,79.5l-692.1,5.1C4510.4,5013.7,4343.7,5006,4230.9,4975.2z"/><path d="M2936.4,4616.3c-753.7-182-1286.9-435.8-1591.9-758.8c-269.2-284.5-343.5-499.9-343.5-994.6c0-474.3,74.3-710.1,294.8-945.9l110.2-117.9l182-1768.8c100-974.1,223-2171.3,271.7-2666.1c89.7-892.1,92.3-897.2,179.4-1079.2c258.9-530.7,956.2-874.2,2102.1-1040.8c358.9-51.3,1463.8-43.6,1832.9,15.4c1074.1,166.6,1748.3,512.7,1997,1020.3c92.3,184.6,61.5-61.5,505,4288.8l123.1,1204.8l105.1,128.2c248.7,299.9,294.8,448.6,294.8,961.3c0,487.1-43.6,640.9-253.8,917.7c-251.2,328.1-974.1,687-1709.8,846l-233.3,48.7l48.7-130.7c28.2-71.8,58.9-220.5,66.6-333.3l17.9-202.5l256.3-71.8c825.4-230.7,1274.1-594.7,1168.9-951.1c-43.6-146.1-269.2-364-502.4-487.1c-1322.8-687-4258-705-5639.7-30.8c-512.7,248.7-689.6,543.5-512.7,846c148.7,253.8,584.5,479.4,1335.6,689.6c15.4,5.1,35.9,87.2,43.6,184.6c7.7,97.4,38.4,246.1,66.7,330.7c28.2,82,48.7,151.2,46.2,153.8C3195.3,4675.3,3077.4,4649.6,2936.4,4616.3z M2741.5,1145.3c100-28.2,243.5-156.4,299.9-264c25.6-48.7,92.3-605,205.1-1691.9c89.7-892.1,182-1779.1,202.5-1971.4c20.5-192.3,38.5-415.3,38.5-492.2c0-123-7.7-146.1-79.5-205.1c-174.3-148.7-474.3-17.9-558.8,246.1C2821-3143.4,2408.3,748,2408.3,940.2c-2.6,92.3,10.3,125.6,66.7,171.8C2549.3,1176.1,2608.2,1183.8,2741.5,1145.3z M7548.1,1117.1c56.4-43.6,66.6-71.8,66.6-179.4c0-192.3-405-4047.8-438.3-4163.1c-56.4-202.5-289.7-356.3-471.7-310.2c-76.9,20.5-158.9,102.5-171.8,176.9c-20.5,112.8,407.6,4160.6,448.6,4237.5C7107.2,1117.1,7394.3,1240.2,7548.1,1117.1z M5187.1,783.8c30.8-15.4,76.9-53.8,100-84.6c41-48.7,46.2-205.1,46.2-2199.5v-2143.1l-64.1-79.5c-169.2-197.4-507.6-143.5-576.8,94.9c-20.5,64.1-25.6,751.1-20.5,2186.7c7.7,2053.4,7.7,2094.4,59,2150.8c28.2,30.8,74.3,66.7,102.5,79.5C4910.3,819.7,5123,817.2,5187.1,783.8z"/></g></svg>'
      const receptacle = document.createElement('span')
      receptacle.innerHTML = trash
      del.appendChild(receptacle)

      del.className = 'files-widget__del files-widget--pointer'
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
      const uploadSvg = `
        <?xml version="1.0" encoding="utf-8"?>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
             viewBox="0 0 500 350" style="enable-background:new 0 0 500 350;" xml:space="preserve">
          <style type="text/css">
            .fill-color {
              fill:#D593CD;
            }
            .stroke-color {
              stroke:#D593CD;
            }
            .st1{fill:none;stroke-width:2;stroke-miterlimit:10;}
            .st2{enable-background:new;}
            .st3{fill:transparent;stroke-width:1;stroke-miterlimit:10;}
            .st4{fill:transparent;stroke-width:1;stroke-miterlimit:10;}
            .st6{font-family:'fira-mono-regular';}
            .st7{font-size:10.1238px;}
          </style>
          <g>
            <path class="fill-color" d="M391,137c1.65,0,3,1.35,3,3v67H290v-67.01c0-1.65,1.34-2.99,2.99-2.99L391,137 M391,135h-98.01
              c-2.75,0-4.99,2.23-4.99,4.99v69c0,0.01,0.01,0.02,0.02,0.02h107.97c0.01,0,0.02-0.01,0.02-0.02V140C396,137.24,393.76,135,391,135
              L391,135z"/>
          </g>
          <g>
            <path class="fill-color" d="M151.26,137l6.44,5.52l6.3,5.4V207h-57v-70H151.26 M152,135h-47v74h61v-62l-7-6L152,135L152,135z"/>
          </g>
          <polyline class="st1 stroke-color" points="152,136.9 152,148 165,147.9 "/>
          <g class="st2">
            <path class="fill-color" d="M321.02,163.53c2.1,0,3.87,0.73,5.31,2.2c1.45,1.47,2.16,3.27,2.16,5.42c0,1.41-0.44,2.77-1.31,4.07
              c-0.67,1.01-1.57,1.81-2.68,2.4c-1.12,0.59-2.3,0.89-3.55,0.89c-2.03,0-3.78-0.74-5.26-2.22c-1.47-1.49-2.2-3.25-2.2-5.28
              c0-1.06,0.23-2.09,0.7-3.1c0.47-1.01,1.11-1.87,1.93-2.58C317.51,164.14,319.15,163.53,321.02,163.53z M321.02,164.51
              c-1.82,0-3.37,0.63-4.64,1.89c-1.27,1.26-1.9,2.8-1.9,4.6l6.52,0.03L321.02,164.51z"/>
          </g>
          <g class="st2">
            <path class="fill-color" d="M362.02,163.53c2.1,0,3.87,0.73,5.31,2.2c1.45,1.47,2.16,3.27,2.16,5.42c0,1.41-0.44,2.77-1.31,4.07
              c-0.67,1.01-1.57,1.81-2.68,2.4c-1.12,0.59-2.3,0.89-3.55,0.89c-2.03,0-3.78-0.74-5.26-2.22c-1.47-1.49-2.2-3.25-2.2-5.28
              c0-1.06,0.23-2.09,0.7-3.1c0.47-1.01,1.11-1.87,1.93-2.58C358.51,164.14,360.15,163.53,362.02,163.53z M362.02,164.51
              c-1.82,0-3.37,0.63-4.64,1.89c-1.27,1.26-1.9,2.8-1.9,4.6l6.52,0.03L362.02,164.51z"/>
          </g>
          <g class="st2">
            <path class="fill-color" d="M337,177.97l-0.01-1.01c2.07-0.14,3.75-0.84,5.01-2.12c1.27-1.27,1.9-2.89,1.9-4.84l1.07,0.03
              c-0.02,0.18-0.03,0.31-0.03,0.39c-0.06,0.94-0.23,1.78-0.52,2.5c-0.29,0.72-0.73,1.47-1.34,2.24c-0.65,0.81-1.53,1.49-2.63,2.02
              s-2.17,0.8-3.2,0.8C337.23,177.99,337.15,177.98,337,177.97z"/>
          </g>
          <path class="st4 loading-bar stroke-color" d="M195,182.92h-8c-1.1,0-2-0.53-2-1.18v-9.48c0-0.65,0.9-1.18,2-1.18h8c1.1,0,2,0.53,2,1.18v9.48
  C197,182.39,196.1,182.92,195,182.92z"/>
          <path class="st3 loading-bar stroke-color" d="M213,182.92h-8c-1.1,0-2-0.53-2-1.18v-9.48c0-0.65,0.9-1.18,2-1.18h8c1.1,0,2,0.53,2,1.18v9.48
  C215,182.39,214.1,182.92,213,182.92z"/>
          <path class="st3 loading-bar stroke-color" d="M231,182.92h-8c-1.1,0-2-0.53-2-1.18v-9.48c0-0.65,0.9-1.18,2-1.18h8c1.1,0,2,0.53,2,1.18v9.48
  C233,182.39,232.1,182.92,231,182.92z"/>
          <path class="st3 loading-bar stroke-color" d="M249,182.92h-8c-1.1,0-2-0.53-2-1.18v-9.48c0-0.65,0.9-1.18,2-1.18h8c1.1,0,2,0.53,2,1.18v9.48
  C251,182.39,250.1,182.92,249,182.92z"/>
          <path class="st3 loading-bar stroke-color" d="M267,182.92h-8c-1.1,0-2-0.53-2-1.18v-9.48c0-0.65,0.9-1.18,2-1.18h8c1.1,0,2,0.53,2,1.18v9.48
  C269,182.39,268.1,182.92,267,182.92z"/>
        </svg>
        <p class="files-widget__overlay__svg-name">${file.name}</p>
      `
      const svgContainer = document.createElement('div')
      svgContainer.className = 'files-widget__overlay__svg'
      svgContainer.innerHTML = uploadSvg
      this.$('.files-widget__overlay--upload > div').textContent = ''
      this.$('.files-widget__overlay--upload > div').appendChild(svgContainer)

      this.$('.files-widget__overlay--upload').style.display = 'flex'
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
    this.$('.files-widget__overlay--upload > div').textContent = '...deleting...'
    this.$('.files-widget__overlay--upload').style.display = 'flex'
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
      if (this.$('.files-widget__overlay--upload').contains(this.$('.files-widget__overlay--upload').querySelector('.files-widget__overlay__svg'))) {
        this.$('.files-widget__overlay--upload').querySelector('.files-widget__overlay__svg').remove()
      }
      this.$('.files-widget__overlay--upload').style.display = 'none'
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
