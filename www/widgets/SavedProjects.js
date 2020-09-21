/* global Widget, STORE, Convo, NNE, NNM */
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
  WIDGETS['saved-projects'].updateView() // re-render the list of projects
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
    this.updateView()

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
    this.updateView()
  }

  updateView () {
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
        window.utils.processingFace = false
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
        if (STORE.state.layout === 'welcome') {
          STORE.dispatch('CHANGE_LAYOUT', 'dock-left')
        }
        this.close()
        window.utils.processingFace = false
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
    window.utils.get('./api/github/auth-status', (res) => {
      if (res.success) {
        window.utils.get('./api/github/username', (res) => {
          if (!res.success) return
          window.localStorage.setItem('owner', res.data.login)
        })
        window.utils.get('./api/github/saved-projects', (res) => {
          if (!res.success) return
          const arr = res.data.map(p => p.name)
          const str = JSON.stringify(arr)
          window.localStorage.setItem('saved-projets', str)
          this.updateView()
          this._addProjectsToSearch(arr)
        })
      } else {
        this.sec.innerHTML = '<div>You have not connected your GitHub account. </div><div><span id="save-projects-help" class="link">need help?</span></div>'
        this.$('#save-projects-help').addEventListener('click', () => {
          window.convo = new Convo(this.convos['save-help'])
        })
      }
    })
  }

  _addProjectsToSearch (data) {
    const arr = data
      .filter(proj => !NNM.search.dict.map(o => o.word).includes(proj))
      .map(proj => {
        return {
          type: 'widgets.Saved Projects',
          word: proj,
          subs: [],
          alts: [],
          clck: () => { STORE.dispatch('OPEN_WIDGET', this.key) }
        }
      })
    NNM.search.addToDict(arr)
  }
}

window.SavedProjects = SavedProjects
