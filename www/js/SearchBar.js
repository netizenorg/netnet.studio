/* global utils, Fuse, WIDGETS, NNE, SNT */
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
      Examples: 'var(--netizen-string)',
      netnet: 'var(--netizen-number)'
    }

    this._loadMiscData()
    // this._loadFunctionsMenuData() // called when Functions Menu is created
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
      this.emit('open', {})
    }, 100)
    SNT.post(SNT.dataObj('search-open'))
  }

  close () {
    this.ele.style.transition = 'opacity var(--menu-fades-time) ease-out'
    setTimeout(() => { this.ele.style.opacity = 0 }, 10)
    setTimeout(() => {
      this.ele.style.visibility = 'hidden'
      this.emit('open', {})
    }, utils.getVal('--menu-fades-time'))
  }

  addToDict (arr) {
    const strfy = this.dict.map(i => JSON.stringify({ t: i.type, w: i.word }))
    const diff = arr.map(i => JSON.stringify({ t: i.type, w: i.word }))
      .filter(i => !strfy.includes(i)).map((s, i) => i)
    arr = arr.filter((o, i) => diff.includes(i)) // filter out duplicates
    this.dict = this.dict.concat(arr)
    this.updateDict()
  }

  updateDict () {
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
    results = results.map(res => {
      // down score reference results to avoid drowning others out
      const downScore = res.item.alts.includes('element') ||
        res.item.alts.includes('attribute') ||
        res.item.alts.includes('property')
      if (downScore) res.score += 0.2
      return res
    })
    results = results.filter(o => o.score < 0.5)
    const resultsDiv = this.ele.querySelector('#search-results')
    resultsDiv.innerHTML = ''
    results.forEach(res => this._createSearchResult(res))

    if (this._termDebounce) clearTimeout(this._termDebounce)
    this._termDebounce = setTimeout(() => {
      if (term !== '') SNT.post(SNT.dataObj('search-term', { search: term }))
    }, 1000)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _loadFunctionsMenuData () {
    if (!WIDGETS['functions-menu']) {
      setTimeout(() => this._loadFunctionsMenuData(), 250)
      return
    }

    // remove previously created items if we login/logout
    this.dict = this.dict.filter(o => !o.type.includes('Functions Menu'))
    this.updateDict()
    const loggedIn = window.localStorage.getItem('owner')

    const arr = []
    arr.push({
      type: 'Functions Menu',
      word: loggedIn ? 'logout' : 'login',
      alts: ['login', 'logout', 'session', 'github', 'repo', 'account'],
      clck: () => { WIDGETS['functions-menu'].open() }
    })
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
        const hidden = WIDGETS['functions-menu'].checkIfHidden(func.click)
        if (!hidden) { // only add to search if it's currently in the menu
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
        }
      })
    }

    this.addToDict(arr)
    this.loaded.functions = true
  }

  _loadWidgetsData () {
    utils.get('./api/widgets', (list) => {
      const arr = []
      list.forEach(file => {
        file.keywords.push('widget')
        arr.push({
          type: 'Widgets',
          word: file.title,
          alts: file.keywords,
          clck: () => WIDGETS.open(file.key, file.filename)
        })
      })
      this.addToDict(arr)
      this.loaded.widgets = true
    })
  }

  _loadTutorialsData () {
    this.loaded.tutorials = true
    utils.get('tutorials/list.json', (json) => {
      const arr = []
      let len = 0
      for (const sec in json) { len += json[sec].length }
      const update = () => { if (arr.length === len) this.addToDict(arr) }

      for (const sec in json) {
        json[sec].forEach(name => {
          utils.get(`tutorials/${name}/metadata.json`, (tut) => {
            arr.push({
              type: 'Tutorials',
              word: tut.title,
              alts: tut.keywords,
              clck: () => {
                WIDGETS.open('learning-guide', null, (w) => w.load(name))
              }
            })
            update()
          })
        })
      }
    })

    utils.get('api/examples', (json) => {
      const arr = []
      const len = Object.keys(json.data).length
      const update = () => { if (arr.length === len) this.addToDict(arr) }

      const split = (tags) => {
        // legacy examples are space separated, but new ones are comma separated
        if (typeof tags === 'string') return tags.split(' ')
        else return tags
      }

      for (const i in json.data) {
        const ex = json.data[i]
        const tags = ex.tags ? split(ex.tags) : []
        const name = ex.name.split(' ').filter(s => !s.includes('element'))
        const keywords = [...tags, ...name]
        arr.push({
          type: 'Examples',
          word: ex.name,
          alts: keywords,
          clck: () => {
            if (!WIDGETS['code-examples']) {
              WIDGETS.load('CodeExamples.js', w => w.loadExample(i, 'search'))
            } else { WIDGETS['code-examples'].loadExample(i, 'search') }
          }
        })
        update()
      }
    })
  }

  _loadMiscData () {
    const arr = []
    arr.push({
      type: 'netnet',
      word: 'main menu',
      alts: ['help', 'about', 'main', 'options', 'hello', 'netnet', 'hi', 'welcome'],
      clck: () => {
        WIDGETS['student-session'].greetStudent()
      }
    })

    const html = ['elements', 'attributes']
    html.forEach(type => {
      Object.keys(NNE.edu.html[type]).forEach(data => {
        arr.push({
          type: 'netnet.html elements',
          word: `&lt;${data}&gt;`,
          alts: ['element', 'tag', type],
          clck: () => {
            const nfo = NNE.edu.html[type][data]
            type = type.substr(0, type.length - 1) // rmv "s"
            WIDGETS['html-reference'].textBubble({ data, type, nfo })
            WIDGETS['html-reference'].open()
          }
        })
      })
    })

    Object.keys(NNE.edu.css.properties)
      .filter(name => name[0] !== '-')
      .forEach(property => {
        arr.push({
          type: 'netnet.css properties',
          word: property,
          alts: ['property', 'tag', property],
          clck: () => {
            const nfo = NNE.edu.css.properties[property]
            WIDGETS['css-reference'].textBubble({ nfo, type: 'property', data: property })
            WIDGETS['css-reference'].open()
          }
        })
      })

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
