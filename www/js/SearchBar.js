/* global STORE, NNT, NNE, Fuse, WIDGETS */
/*
  -----------
     info
  -----------

  This class is used to create netnet's speach/text bubble. While it can
  technically be instantiated multiple times, it's really designed to be used
  by the main menu, which only ever creates a single instance. (b/c there
  should really only ever be one search bar present at any given time)

  NOTE: this class is dependent on a couple of outside variables, see globals
  in the comment on the fist line for global JS variables it references

  -----------
     usage
  -----------

  const search = new SearchBar()

  search.opened       // true/false
  search.open()       // opens search
  search.close()      // closes search
  search.search(term) // does the searching

*/
class SearchBar {
  constructor () {
    const t = window.getComputedStyle(document.documentElement)
      .getPropertyValue('--menu-fades-time')
    this.transitionTime = t.includes('ms') ? parseInt(t) : parseInt(t) * 1000
    this.netnet = document.querySelector('#netnet')

    this.dict = []
    this.loadedTutorialsData = 0
    this.loadedWidgetsData = 0
    STORE.subscribe('tutorials', (e) => {
      if (this.loadedTutorialsData < 1) this._loadData('tutorials', e)
      this.loadedTutorialsData++
    })
    STORE.subscribe('widgets', (e) => {
      // 2, b/c the general widgets load call doesnt fire until
      // after the welcome widgets load call
      if (this.loadedWidgetsData < 2) this._loadData('widgets', e)
      this.loadedWidgetsData++
    })

    document.addEventListener('keydown', (e) => {
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
    })

    this._setupSearchBar()
    this._loadData('edu-info', NNE.edu)
    this._loadMiscData()
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

  open () {
    this.ele.style.transition = 'opacity var(--menu-fades-time) ease-out'
    this.ele.style.visibility = 'visible'
    setTimeout(() => {
      this.ele.querySelector('input').focus()
      this.ele.style.opacity = 1
      this.netnet.style.filter = 'blur(25px)'
    }, 100)
  }

  close () {
    this.ele.style.transition = 'opacity var(--menu-fades-time) ease-out'
    setTimeout(() => {
      this.ele.style.opacity = 0
      this.netnet.style.filter = 'none'
    }, 10)
    setTimeout(() => { this.ele.style.visibility = 'hidden' }, this.transitionTime)
  }

  search (e) {
    const term = e.target.value
    let results = this.fuse.search(term)
    results = results.filter(o => o.score < 0.5)
    console.log(results)
    const div = this.ele.querySelector('#search-results')
    div.innerHTML = ''
    results.forEach(res => {
      const d = document.createElement('div')
      d.setAttribute('tabindex', '0')
      d.className = `${res.item.type}-results`
      if (res.item.word === 'Functions') {
        const m = res.matches[0].key === 'subs'
          ? res.matches[0].value + '()' : 'Menu'
        d.innerHTML = `<i class="f-results">(Functions)</i> &gt; ${m}`
      } else if (res.item.type.includes('widgets')) {
        const wrd = res.item.word
        if (res.item.type === 'widgets') {
          d.innerHTML = `<i class="w-results">(Widgets)</i> &gt; ${wrd}`
        } else { // Functions Menu (sub menus)
          const t = res.item.type.split('.')
          if (t.length > 2) {
            d.innerHTML = `<i class="w-results">(${t[1]})</i> &gt; ${t[2]} &gt; ${wrd}`
          } else {
            d.innerHTML = `<i class="w-results">(${t[1]})</i> &gt; ${wrd}`
          }
        }
      } else if (res.item.type === 'tutorials') {
        d.innerHTML = `<i class="t-results">(Tutorials)</i> &gt; ${res.item.word}`
        if (res.matches[0] && res.matches[0].key === 'subs') {
          d.innerHTML += ` &gt; ${res.matches[0].value}`
        } else if (res.matches[1] && res.matches[1].key === 'subs') {
          d.innerHTML += ` &gt; ${res.matches[1].value}`
        }
        d.className = 'tutorials-results'
      } else if (res.item.type === 'netnet') {
        d.innerHTML = `<i class="e-results">(netnet)</i> &gt; ${res.item.word}`
        d.className = 'edu-results'
      }
      d.addEventListener('click', () => {
        this.ele.querySelector('input').value = ''
        div.innerHTML = ''
        this.close()
        if (typeof res.item.clck === 'function') res.item.clck()
        else {
          Object.assign(document.createElement('a'), {
            target: '_blank', href: res.item.clck
          }).click()
        }
      })
      div.appendChild(d)
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _setupSearchBar (content, options) {
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

    this.ele.querySelector('#search-overlay').addEventListener('click', (e) => {
      if (this.opened) {
        this.close()
      }
    })
  }

  _addToDict (arr) {
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

  _createFuncMenuObj (subs) {
    const arr = []
    for (const sub in subs) {
      arr.push({
        type: 'widgets.Functions Menu',
        word: sub,
        clck: () => {
          STORE.dispatch('OPEN_WIDGET', 'functions-menu')
          const id = `func-menu-${sub.replace(/ /g, '-')}`
          WIDGETS['functions-menu'].toggleSubMenu(id)
        }
      })
      subs[sub].forEach(s => {
        arr.push({
          type: `widgets.Functions Menu.${sub}`,
          word: `${s.click}()`,
          alts: s.alts,
          clck: () => {
            STORE.dispatch('OPEN_WIDGET', 'functions-menu')
            const id = `func-menu-${sub.replace(/ /g, '-')}`
            WIDGETS['functions-menu'].toggleSubMenu(id)
          }
        })
      })
    }
    this._addToDict(arr)
  }

  _loadData (type, data) {
    const arr = []
    if (type === 'widgets') {
      data.filter(w => {
        const keys = ['functions-menu', 'widgets-menu']
        if (w.ref.listed || keys.includes(w.ref.key)) return w
        else return false
      }).forEach(w => {
        if (w.key === 'functions-menu') this._createFuncMenuObj(w.ref.subs)
        const obj = {
          type: 'widgets',
          word: w.ref.title,
          alts: w.ref.keywords || [],
          clck: () => { STORE.dispatch('OPEN_WIDGET', w.ref.key) }
        }
        arr.push(obj)
      })
    } else if (type === 'tutorials') {
      data.forEach(t => {
        const obj = {
          type: 'tutorials',
          word: t.title,
          subs: Object.keys(t.checkpoints) || [],
          alts: t.keywords || [],
          clck: () => {
            STORE.dispatch('OPEN_WIDGET', 'tutorials-menu')
            NNT.load(t.dirname)
          }
        }
        arr.push(obj)
      })
    } else if (type === 'edu-info') {
      // TODO open anatomy of "an html element widget" for elements/attributes
      // type: 'netnet'
    }
    this._addToDict(arr)
  }

  _loadMiscData () {
    const arr = []
    arr.push({
      type: 'netnet', // for "convos" like 'edu-info'
      word: 'main menu',
      alts: ['help', 'about', 'main', 'options', 'hello', 'netnet', 'hi', 'welcome'],
      clck: () => { window.greetings.startMenu() }
    })
    this._addToDict(arr)
  }
}

window.SearchBar = SearchBar
