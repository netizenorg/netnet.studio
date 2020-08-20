/* global Widget, NNT, STORE */
/*
  -----------
     info
  -----------

  the main menu's Tutorials sub-menu

  -----------
     usage
  -----------

  // it's important that the file-name matches the class-name because
  // this widget is instantiated by the WindowManager as...
  WIDGETS['Tutorial Menu'] = new MenuTutorial()

  // this class inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js to see what those are
  // or take a look at the wiki...
  // https://github.com/netizenorg/netnet.studio/wiki/Creating-Widgets
*/
class MenuTutorial extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Tutorials'
    this.key = 'Tutorials Menu'
    this.listed = false
    this.resizable = false
    this.keywords = ['lessons', 'lectures', 'workshops', 'demos', 'instructions', 'exercises', 'classes']
    this.loaded = {} // meta data for currently loaded tutorial
    this._createTutorialsList()
    STORE.subscribe('tutorial.url', (arr) => { this.update() })
  }

  _addTut (dir) {
    window.fetch(`tutorials/${dir}/metadata.json`, { method: 'GET' })
      .then(res => res.json())
      .then(json => {
        json.dirname = dir
        this._tutorialMetaData.push(json)
        if (this._tutorialMetaData.length === this._numberOfTutorials) {
          STORE.dispatch('LOAD_TUTORIALS', this._tutorialMetaData)
          this.update()
        }
      })
  }

  _createTutorialsList () {
    window.fetch('api/tutorials', { method: 'GET' })
      .then(res => res.json())
      .then(json => {
        this._numberOfTutorials = json.length
        this._tutorialMetaData = []
        json.forEach(dir => this._addTut(dir))
      })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  update () {
    if (STORE.is('TUTORIAL_LOADED')) this._displayTutInfo()
    else this._displayList()
  }

  _displayList () {
    const parent = document.createElement('div')
    STORE.state.tutorials.forEach(t => {
      const d = document.createElement('div')
      const title = document.createElement('div')
      title.textContent = t.title
      title.className = 'link'
      title.addEventListener('click', () => NNT.load(t.dirname))
      const sub = document.createElement('p')
      sub.textContent = t.subtitle
      d.appendChild(title)
      d.appendChild(sub)
      parent.appendChild(d)
    })
    this.innerHTML = parent
  }

  _displayTutInfo () {
    const url = `${STORE.state.tutorial.url}/metadata.json`
    const sub = ['information', 'sections', 'references']
    window.fetch(url, { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        this.loaded = data
        const parent = document.createElement('div')
        parent.id = 'tut-menu-content'

        const subContent = document.createElement('div')
        subContent.className = 'tut-menu-sub-content'
        this._displayInfoPanel(subContent)

        const subMenu = document.createElement('div')
        subMenu.className = 'tut-menu-sub-menu'
        sub.forEach(txt => {
          const s = document.createElement('span')
          s.className = txt === 'information' ? 'link selected' : 'link'
          s.textContent = txt
          s.addEventListener('click', (e) => {
            this._displaySubContent(txt, subMenu, subContent)
          })
          subMenu.appendChild(s)
        })

        parent.appendChild(subMenu)
        parent.appendChild(subContent)
        this.innerHTML = parent
      })
  }

  _displaySubContent (txt, menu, cont) {
    for (let i = 0; i < menu.children.length; i++) {
      menu.children[i].className = 'link'
    }
    if (txt === 'information') {
      menu.children[0].className = 'link selected'
      this._displayInfoPanel(cont)
    } else if (txt === 'sections') {
      menu.children[1].className = 'link selected'
      this._displaySectionsPanel(cont)
    } else if (txt === 'references') {
      menu.children[2].className = 'link selected'
      this._displayReferencesPanel(cont)
    }
  }

  _displayInfoPanel (ele) {
    const t = this.loaded
    ele.innerHTML = `
      <h1>${t.title}</h1>
      <h2>${t.subtitle}</h2>
      <h3>
        by <a href="${t.author.url}" target="_blank">
          ${t.author.name}
        </a>
      </h3>
      <p>${t.description}</p>
      <div>
        <button id="tut-menu-restart">restart</button>
        <button id="tut-menu-quit">quit</button>
      </div>
      `
    setTimeout(() => { // HACK: delay for unknown race conditions
      this.$('#tut-menu-restart').addEventListener('click', () => {
        STORE.dispatch('TUTORIAL_GOTO', '__START__')
      })
      this.$('#tut-menu-quit').addEventListener('click', () => {
        STORE.dispatch('TUTORIAL_FINISHED')
      })
    }, 500)
  }

  _displaySectionsPanel (ele) {
    ele.innerHTML = ''
    const t = this.loaded
    for (const cp in t.checkpoints) {
      const d = document.createElement('div')
      d.textContent = cp
      d.className = 'link'
      d.addEventListener('click', () => {
        STORE.dispatch('TUTORIAL_GOTO', t.checkpoints[cp])
      })
      ele.appendChild(d)
    }
  }

  _displayReferencesPanel (ele) {
    ele.innerHTML = ''
    const t = this.loaded
    for (const r in t.references) {
      const ref = t.references[r]
      ele.innerHTML += `
        <div>
          <a href="${ref.url}" target="_blank">${ref.note}</a>
        </div>
      `
    }
  }
}

window.MenuTutorial = MenuTutorial
