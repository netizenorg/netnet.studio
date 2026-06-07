/* global Widget, Convo, utils, nn, WIDGETS */
class LingoGlossary extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'lingo-glossary'
    this.listed = true
    this.keywords = ['lingo', 'glossary', 'dictionary', 'index', 'terminology', 'definition']
    this.title = 'Lingo Glossary'
    this.width = 483
    this.height = 352
    this.dict = {}

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    utils.get('/widgets/lingo-glossary/data.json', (data) => {
      if (data.success === false) return utils._Convo('oh-no-error', data)
      this.dict = Object.fromEntries(
        Object.entries(data).sort(([a], [b]) => a.localeCompare(b))
      )
      Object.entries(this.dict).forEach(a => this._createVocabItem(a))
    })

    this._createHTML()
  }

  showVocab (keyword) {
    const o = this.dict[keyword]
    if (!o) return
    this._displayDefinition(o)
  }

  _createHTML () {
    this.innerHTML = `
      <nav class="lingo-glossary__nav">
        <input type="text" placeholder="search/filter glossary">
        <button class="pill-btn pill-btn--secondary" name="general-info">?</button>
      </nav>
      <div class="lingo-glossary__list">
        <!-- list goes here -->
      </div>
      <div class="lingo-glossary__entry">
        <div class="lingo-glossary__back">
          <span>search glossary</span>
        </div>
        <span class="lingo-glossary__name"></span>
        <span class="lingo-glossary__definition"></span>
        <div class="lingo-glossary__extra">
          <span class="lingo-glossary__see"></span>
          <span class="lingo-glossary__doc"></span>
        </div>
      </div>
    `

    this.$('[name="general-info"]').addEventListener('click', () => this._startConvo())
    this.$('[placeholder="search/filter glossary"]').addEventListener('input', e => this._filterResults(e))
    this.$('.lingo-glossary__back span').addEventListener('click', () => this._displayList())

    const docIcon = nn.create('span').set('class', 'lingo-glossary__icon')
    this.ele.querySelector('.widget__top').prepend(docIcon)
  }

  _startConvo () {
    window.convo = new Convo(this.convos, 'gen-info')
  }
  // -------------------------------------------------------------- LIST RESULTS

  _createVocabItem (arr) {
    const k = arr[0]
    const o = arr[1]
    nn.create('span')
      .content(o.name)
      .set({ class: 'highlight' })
      .set({ name: k })
      .addTo(this.$('.lingo-glossary__list'))
      .on('click', () => this._displayDefinition(o))
  }

  _filterResults (e) {
    if (!e.target.value) {
      this.$('.lingo-glossary__list span').forEach(span => {
        span.classList.remove('vocab--hide')
      })
      return
    }
    const v = e.target.value.toLowerCase()
    const ele = this.$('.lingo-glossary__list')
    const res = [...ele.children]
    res.forEach(ele => {
      if (v === '') ele.classList.remove('demo--hide')
      else {
        let pass = false
        if (ele.getAttribute('name').includes(v)) pass = true
        if (ele.textContent.trim().includes(v)) pass = true
        if (pass) {
          ele.classList.remove('vocab--hide')
        } else ele.classList.add('vocab--hide')
      }
    })
  }

  _displayList () {
    this.$('.lingo-glossary__list span').forEach(span => {
      span.classList.remove('vocab--hide')
    })

    this.$('[placeholder="search/filter glossary"]').value = ''

    nn.get('.lingo-glossary__entry').css('display', 'none')
    nn.get('.lingo-glossary__nav').css('display', 'flex')
    nn.get('.lingo-glossary__list').css('display', 'grid')
    this.update({ width: 483, height: 352 }, 500)
  }

  _displaySeeAlso (arr) {
    nn.get('.lingo-glossary__see').content('see also: ')
    arr.forEach((vocab, i) => {
      const o = this.dict[vocab]
      const t = i === arr.length - 1 ? '' : ', '
      nn.create('span')
        .content(o.name + t)
        .set('class', 'highlight')
        .addTo('.lingo-glossary__see')
        .on('click', () => this._displayDefinition(o))
    })
  }

  _displayWidgetLink (doc) {
    nn.get('.lingo-glossary__doc').content('')

    const wig = doc[0]
    const sub = doc[1]
    const anc = doc[2]

    const lan = wig.split('-')[0]

    let txt = '???'
    if (wig === 'demo-sketches') txt = 'open demo in new tab'
    else if (wig.includes('-reference')) txt = `open ${lan} docs`
    else if (wig === 'open') txt = 'open widget'

    nn.create('span')
      .set('class', 'pill-btn pill-btn--secondary')
      .content(txt)
      .addTo('.lingo-glossary__doc')
      .on('click', () => {
        if (wig === 'demo-sketches') {
          const url = `${window.location.origin}?demo=${sub}`
          window.open(url, '_blank')
        } else if (wig.includes('-reference')) { // reference widget
          WIDGETS[wig].openDocs(sub, anc)
        } else { // general widget
          WIDGETS.open(sub)
        }
      })
  }

  async _displayDefinition (o) {
    nn.get('.lingo-glossary__entry').css('display', 'block')
    nn.get('.lingo-glossary__nav').css('display', 'none')
    nn.get('.lingo-glossary__list').css('display', 'none')

    nn.get('.lingo-glossary__name').textContent = o.name
    nn.get('.lingo-glossary__definition').innerHTML = o.definition
    if (o.see && o.see.length > 0) {
      this._displaySeeAlso(o.see)
    } else {
      nn.get('.lingo-glossary__see').textContent = ''
    }
    if (o.doc && o.doc.length > 0) {
      this._displayWidgetLink(o.doc)
    } else {
      nn.get('.lingo-glossary__doc').textContent = ''
    }

    if (this.width !== 483) {
      this.update({ width: 483 }, 250)
      await nn.sleep(300)
      const height = nn.get('.lingo-glossary__entry').height + 80
      this.update({ width: 483, height }, 500)
    } else {
      await nn.sleep(100)
      const height = nn.get('.lingo-glossary__entry').height + 80
      this.update({ width: 483, height }, 500)
    }
  }
}

window.LingoGlossary = LingoGlossary
