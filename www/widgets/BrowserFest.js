/* global WIDGETS, Widget, nn, Convo, utils */
class BrowserFest extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'browser-fest'
    this.listed = true
    this.keywords = ['browserfest', 'submission']

    this.title = 'BrowserFest Submission'
    this.width = 600

    this.on('open', () => {
      this.owner = WIDGETS['student-session'].getData('owner')
      this.repo = WIDGETS['student-session'].getData('opened-project')
      this.branch = WIDGETS['student-session'].getData('branch')
      this._createHTML()
    })

    this._createFileUploader()
  }

  submit () {
    if (this.convos) {
      const owner = WIDGETS['student-session'].getData('owner')
      const repo = WIDGETS['student-session'].getData('opened-project')
      if (!owner) {
        window.convo = new Convo(this.convos, 'bf-no-login')
      } else if (!repo) {
        window.convo = new Convo(this.convos, 'req-project')
      } else {
        this.open()
        window.convo = new Convo(this.convos, 'browserfest')
      }
    } else {
      Convo.load(this.key, () => {
        this.convos = window.CONVOS[this.key](this)
        this.submit()
      })
    }
  }

  _preSubmitForkCheck () {
    const validity = this.$('[name="email"]').validity
    const url = this.$('[name="url"]').validity
    if (validity.valueMissing || validity.typeMismatch) {
      window.alert('please enter a valid email, we gotta be able to get in touch with you')
      return
    } else if (!url.valueMissing && url.typeMismatch) {
      window.alert('please enter a valid URL or leave that field blank')
      return
    }

    const imgName = `${this.owner}-${Date.now()}`
    const data = {
      owner: this.owner,
      repo: this.repo,
      branch: this.branch,
      email: this.$('[name="email"]').value,
      author: this.$('[name="author"]').value,
      title: this.$('[name="title"]').value || 'unititled',
      url: this.$('[name="url"]').value,
      description: this.$('[name="description"]').value,
      date: Date.now()
    }

    this._submittingHTML()

    const repoData = { owner: this.owner, repo: this.repo }
    utils.post('/api/github/repo-data', repoData, (json) => {
      if (json.data.fork) {
        data.fork = {
          owner: json.data.parent.owner.login,
          repo: json.data.parent.name,
          branch: json.data.parent.default_branch
        }
      } else { data.fork = false }
      this._submitToBF(data, imgName)
    })
  }

  _submitToBF (data, imgName) {
    const submitData = (data) => {
      utils.post('./api/browserfest/submission', data, (json) => {
        console.log(json)
        if (json.success) {
          this.innerHTML = `<p>Your project, ${data.title} has been submitted! You should see it displayed in the <a href="https://browserfest.netizen.org/gallery.html" target="_blank">BrowserFest Demo Gallery</a> soon.</p>`
        } else {
          this.innerHTML = '<p>Dang! seems there was an error (peep the conosle)! Close this widget and try again maybe? If you keep having troulbe send us an email: h<i></i>i@net<i></i>izen.org</p>'
        }
      })
    }

    if (this._bfthumb) {
      const ext = this._bfthumb.type.split('/')[1]
      data.thumbnail = `https://netnet.studio/${imgName}.${ext}`
      const formData = new window.FormData()
      formData.append('image', this.fu.input.files[0], data.thumbnail)
      window.fetch('api/browserfest/upload-image', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(json => { if (json.success) submitData(data) })
        .catch(err => console.error(err))
    } else { submitData(data) }
  }

  // ---------------------------------------------------------------------------
  // ----------------------------------------------------------- innerHTML -----

  _createFileUploader () {
    this.fu = new nn.FileUploader({
      maxSize: 5000,
      types: ['image/jpeg', 'image/png', 'image/gif'],
      ready: (file) => {
        this.$('[name="thumbnail-name"]').textContent = file.name
        this._bfthumb = file
      },
      error: (err) => {
        window.alert('oops! there was an issue (peep the console)')
        console.error(err)
      }
    })
  }

  _submittingHTML () {
    const uploadSvg = `
    <?xml version="1.0" encoding="utf-8"?>
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 75 500 200" style="enable-background:new 0 0 500 350;" xml:space="preserve">
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
    <p style="text-align: center">...submitting your project to BrowserFest...</p>
    `

    const svgContainer = document.createElement('div')
    svgContainer.className = 'files-widget__overlay__svg'
    svgContainer.innerHTML = uploadSvg
    this.innerHTML = svgContainer
  }

  _createHTML () {
    if (!this.owner || !this.repo) {
      this.innerHTML = `
        <p>You don't have a project currently open. In order to submit to <a href="https://browserfest.netizen.org/" target="_blank">BrowserFest</a>, open an old project or create a new one and then I can submit it for you. To create a new project (rather than simply a sketch) you need to connect me to your <a href="https://github.com" target="_blank">GitHub</a> account. If you don't already have a GitHub account you can <a href="https://github.com/join" target="_blank">create one for free</a>.</p>
      `
      return
    }

    this.innerHTML = `
      <style>
        .__bf-sub {
          background-color: var(--netizen-meta);
          font-family: 'fira-mono-regular', monospace;
          color: var(--netizen-hint-color);
          padding: 6px;
          border: none;
          margin: 6px;
          width: 250px;
          border-radius: 5px;
        }
      </style>
      <div>
        <input type="text" name="author" placeholder="name (alias, handle)">
        <input type="email" name="email" placeholder="email (required)" required class="__bf-sub"><br>
        <input type="text" name="title" placeholder="demo title">
        <input type="url" class="__bf-sub" name="url" placeholder="url (homepage, github or social)"><br>
        <textarea name="description" class="__bf-sub" style="width: 516px; height: 126px;" placeholder="demo description. instructions (anything you want the judges to know?), attribution (credit for media, assets, code snippets. this should also be in your comments) shoutouts (folks who helped, folks you respect. always a good idea to include these in the demo itself)"></textarea>
        <br>
        <button name="thumbnail">Upload Thumbnail</button>
        <span name="thumbnail-name"></span>
        <button name="submit" style="float:right">Submit to BrowserFest</button>
      </div>
    `

    const thumb = this.$('[name="thumbnail"]')
    thumb.style.color = 'var(--netizen-hint-color)'
    thumb.style.backgroundColor = 'var(--netizen-meta)'
    thumb.style.borderRadius = '5px'
    thumb.style.margin = '6px'
    thumb.addEventListener('click', () => this.fu.input.click())

    this.$('[name="submit"]')
      .addEventListener('click', () => this._preSubmitForkCheck())
  }
}

window.BrowserFest = BrowserFest
