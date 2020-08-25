/* global Widget, STORE, Convo, NNM, NNE */
/*
  -----------
     info
  -----------

  A Widget for listing the authenticated users owned GitHub repositories

  -----------
     usage
  -----------

  // it's important that the file-name matches the class-name because
  // this widget is instantiated by the WindowManager as...
  WIDGETS['saved-projects'] = new SavedProjects()

  // this class inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js to see what those are
  // or take a look at the wiki...
  // https://github.com/netizenorg/netnet.studio/wiki/Creating-Widgets

  WIDGETS['saved-projects'].add('project-name') // add a new project to the list
  WIDGETS['saved-projects'].update() // re-render the list of projects
  WIDGETS['saved-projects'].openProject('project-name') // gets data from GitHub
*/
class SavedProjects extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'saved-projects'
    this.keywords = ['saved', 'opened', 'projects', 'work']
    this.title = 'Saved Projects'
    this._initList()
    this._createContent()
    this.update()

    this.convos = null
    window.utils.loadConvoData('saved-projects', () => {
      this.convos = window.convos['saved-projects'](this)
    })
  }

  add (proj) {
    const projs = window.localStorage.getItem('saved-projets')
    if (projs) {
      const arr = JSON.parse(projs)
      if (!arr.includes(proj)) arr.push(proj)
      const str = JSON.stringify(arr)
      window.localStorage.setItem('saved-projets', str)
    } else {
      const arr = [proj]
      const str = JSON.stringify(arr)
      window.localStorage.setItem('saved-projets', str)
    }
    this.update()
  }

  update () {
    const projs = window.localStorage.getItem('saved-projets')
    if (projs) {
      this.sec.innerHTML = ''
      const arr = JSON.parse(projs)
      arr.forEach(proj => {
        const p = document.createElement('span')
        p.className = 'link'
        p.style.display = 'inline-block'
        p.style.margin = '4px'
        p.textContent = proj
        p.addEventListener('click', (e) => this.openProject(proj))
        this.sec.appendChild(p)
        this.sec.appendChild(document.createElement('br'))
      })
    }
  }

  openProject (project) {
    STORE.dispatch('SHOW_EDU_TEXT', { content: '...asking GitHub for data...' })
    window.utils.runProcessingFace()
    const data = {
      owner: window.localStorage.getItem('owner'),
      repo: project
    }
    window.utils.post('./api/github/open-project', data, (res) => {
      if (!res.success) {
        window.convo = new Convo(this.convos['open-project'])
        window.utils.updateRoot()
      } else {
        NNE.code = window.atob(res.data.content)
        window.utils.setProjectData({
          name: project, code: res.data.content, sha: res.data.sha
        })
        window.utils.post('./api/github/get-commits', data, (res) => {
          const msg = res.data[0].commit.message
          window.localStorage.setItem('last-commit-msg', msg)
        })
        window.utils.updateRoot()
        STORE.dispatch('HIDE_EDU_TEXT')
        this.close()
      }
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createContent () {
    this.sec = document.createElement('section')
    this.sec.style.maxHeight = '400px'
    this.sec.style.overflowY = 'scroll'
    this.sec.textContent = '...loading projects...'
    this.innerHTML = this.sec
  }

  _initList () {
    window.utils.get('./api/github/username', (res) => {
      if (!res.success) return
      window.localStorage.setItem('owner', res.data.login)
    })
    window.utils.get('./api/github/saved-projects', (res) => {
      if (!res.success) return
      const arr = res.data.map(p => p.name)
      const str = JSON.stringify(arr)
      window.localStorage.setItem('saved-projets', str)
      this.update()
    })
  }
}

window.SavedProjects = SavedProjects
