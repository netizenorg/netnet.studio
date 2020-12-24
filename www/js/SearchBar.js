/* global utils, Fuse, WIDGETS */
class SearchBar {
  constructor () {
    this.fuse = null
    this.dict = []

    this.events = {
      open: [],
      close: []
    }

    this.loaded = {
      functions: false,
      widgets: false,
      tutorials: false
    }

    this.type2color = {
      'Functions Menu': 'var(--netizen-variable)',
      Widgets: 'var(--netizen-operator)',
      Tutorials: 'var(--netizen-string)',
      netnet: 'var(--netizen-number)'
    }

    this._loadMiscData()
    this._loadFunctionsMenuData()
    this._loadWidgetsData()
    this._loadTutorialsData()

    this._setupSearchBar()
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  get opened () {
    return Number(this.ele.style.opacity) > 0
  }

  set opened (v) {
    return console.error('SearchBar: opened property is read only')
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•.¸ public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  on (eve, cb) {
    if (!this.events[eve]) { this.events[eve] = [] }
    this.events[eve].push(cb)
  }

  emit (eve, data) {
    if (this.events[eve] instanceof Array) {
      this.events[eve].forEach((cb, i) => {
        data.unsubscribe = () => { this.events[eve].splice(i, 1) }
        cb(data)
      })
    }
  }

  open () {
    this.ele.style.transition = 'opacity var(--menu-fades-time) ease-out'
    this.ele.style.visibility = 'visible'
    setTimeout(() => {
      this.ele.querySelector('input').focus()
      this.ele.style.opacity = 1
      this.emit('open')
    }, 100)
  }

  close () {
    this.ele.style.transition = 'opacity var(--menu-fades-time) ease-out'
    setTimeout(() => { this.ele.style.opacity = 0 }, 10)
    setTimeout(() => {
      this.ele.style.visibility = 'hidden'
      this.emit('open')
    }, utils.getVal('--menu-fades-time'))
  }

  addToDict (arr) {
    const strfy = this.dict.map(i => JSON.stringify({ t: i.type, w: i.word }))
    const diff = arr.map(i => JSON.stringify({ t: i.type, w: i.word }))
      .filter(i => !strfy.includes(i)).map((s, i) => i)
    arr = arr.filter((o, i) => diff.includes(i)) // filter out duplicates
    this.dict = this.dict.concat(arr)
    this.fuse = new Fuse(this.dict, {
      ignoreLocation: true,
      includeScore: true,
      includeMatches: true,
      keys: [
        { name: 'word', weight: 1 },
        { name: 'subs', weight: 0.5 },
        { name: 'alts', weight: 0.25 }
      ]
    })
  }

  search (e) {
    const term = e.target.value
    let results = this.fuse.search(term)
    results = results.filter(o => o.score < 0.5)
    const resultsDiv = this.ele.querySelector('#search-results')
    resultsDiv.innerHTML = ''
    results.forEach(res => this._createSearchResult(res))
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _loadFunctionsMenuData () {
    if (!WIDGETS['functions-menu']) {
      setTimeout(() => this._loadFunctionsMenuData(), 250)
      return
    }

    // TODO: when user logins && "my sketch" turns into "my project"
    // ...we'll need to remove "my sketch" from dict && add "my project"

    const arr = []
    for (const submenu in WIDGETS['functions-menu'].subs) {
      const funcs = WIDGETS['functions-menu'].subs[submenu]
      arr.push({
        type: 'Functions Menu',
        word: submenu,
        alts: funcs.map(f => f.click),
        clck: () => {
          WIDGETS['functions-menu'].open()
          const id = `func-menu-${submenu.replace(/ /g, '-')}`
          WIDGETS['functions-menu'].toggleSubMenu(id, 'open')
        }
      })
      funcs.forEach(func => {
        arr.push({
          type: `Functions Menu.${submenu}`,
          word: `${func.click}()`,
          alts: func.alts,
          clck: () => {
            if (func.select) {
              WIDGETS['functions-menu'].open()
              const id = `func-menu-${submenu.replace(/ /g, '-')}`
              WIDGETS['functions-menu'].toggleSubMenu(id, 'open')
            } else WIDGETS['functions-menu'][func.click]()
          }
        })
      })
    }

    this.addToDict(arr)
    this.loaded.functions = true
  }

  _loadWidgetsData () {
    // TODO:
    // hitup a api/widgets to find widgets that haven't been loaded yet && add them to dict
    // ...check that they have this.listed = true (or at least that they don't have it = false)
    this.loaded.widgets = true
  }

  _loadTutorialsData () {
    // TODO:
    // hitup a similar api for tutorials && create those objects as well
    this.loaded.tutorials = true
  }

  _loadMiscData () {
    const arr = []
    arr.push({
      type: 'netnet',
      word: 'main menu',
      alts: ['help', 'about', 'main', 'options', 'hello', 'netnet', 'hi', 'welcome'],
      clck: () => { window.greetings.startMenu() }
    })

    // TODO push edu-info data as well, so it's discoverable via search
    // maybe it simply launches the Convo bubble? maybe it also opens an appendix widget?

    this.addToDict(arr)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createSearchResult (res) {
    const item = res.item
    const type = item.type.split('.')
    const resultsDiv = this.ele.querySelector('#search-results')

    const d = document.createElement('div')
    d.setAttribute('tabindex', '0')
    d.innerHTML = `<i style="color: ${this.type2color[type[0]]}">${type[0]}</i>`
    if (type.length > 1) d.innerHTML += ` &gt; ${type[1]}`
    d.innerHTML += ` &gt; ${item.word}`

    d.addEventListener('click', () => {
      this.ele.querySelector('input').value = ''
      resultsDiv.innerHTML = ''
      this.close()
      if (typeof item.clck === 'function') item.clck()
      else {
        Object.assign(document.createElement('a'), {
          target: '_blank', href: item.clck
        }).click()
      }
    })

    resultsDiv.appendChild(d)
  }

  _setupSearchBar () {
    this.ele = document.createElement('div')
    this.ele.id = 'search-bar'
    this.ele.innerHTML = `
      <div id="search-overlay"></div>
      <section>
        <span><input placeholder="what are you looking for?"></span>
        <div id="search-results" tabindex="-1"></div>
      </section>
    `
    this.ele.style.visibility = 'hidden'
    this.ele.style.opacity = '0'
    document.body.appendChild(this.ele)

    this.ele.querySelector('input')
      .addEventListener('input', (e) => this.search(e))

    this.ele.querySelector('#search-overlay')
      .addEventListener('click', (e) => { if (this.opened) this.close() })

    document.addEventListener('keydown', (e) => this._keyDown(e))
  }

  _keyDown (e) {
    if (this.opened) {
      const res = this.ele.querySelector('#search-results')
      const arrows = (e.keyCode === 38 || e.keyCode === 40)
      const divs = res.children
      if (divs.length > 0 && arrows) {
        let idx = (e.keyCode === 40) ? -1 : divs.length
        for (let i = 0; i < divs.length; i++) {
          if (divs[i].className === 'selected') {
            divs[i].className = ''
            idx = i; break
          }
        }
        if (e.keyCode === 38) { // up arrow
          idx = idx - 1 >= 0 ? idx - 1 : divs.length - 1
        } else if (e.keyCode === 40) { // down arrow
          idx = idx + 1 < divs.length ? idx + 1 : 0
        }
        divs[idx].className = 'selected'
      } else if (divs.length > 0 && e.keyCode === 13) { // enter
        let idx = null
        for (let i = 0; i < divs.length; i++) {
          if (divs[i].className === 'selected') {
            idx = i; break
          }
        }
        if (typeof idx === 'number') divs[idx].click()
      }
    }
  }
}

window.SearchBar = SearchBar
