/* global Widget, WIDGETS */
class WidgetMaker extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'widget-maker'
    this.listed = false
    this.title = 'Simple Widget Maker'
    this._createHTML()
  }

  _createHTML () {
    this.innerHTML = `
      <select class="dropdown dropdown--invert wig-maker-sel"></select>
      <input class="wig-maker-field" type="text" placeholder="widget-key">
      <input class="wig-maker-field" type="text" placeholder="Widget Title">
      <div class="wig-maker-templates"><span>templates:</span></div>
      <textarea class="wig-maker-ta"></textarea><hr>
      <button class="pill-btn pill-btn--secondary" name="update-widget">create widget</button>
      <button class="pill-btn pill-btn--secondary" name="open-widget">open widget</button>
    `
    this._createSelection()
    this.$('.wig-maker-sel').addEventListener('change', (e) => this._update(e))

    const templates = ['info', 'quote', 'image', 'video']
    templates.forEach(t => {
      const btn = document.createElement('button')
      btn.textContent = t
      btn.addEventListener('click', () => this._loadTemplate(t))
      this.$('.wig-maker-templates').appendChild(btn)
    })

    this.$('button[name="update-widget"]').addEventListener('click', (e) => {
      if (e.target.textContent === 'create widget') this._createNewWidget()
      else this._updateCurrentWidget()
    })

    this.$('button[name="open-widget"]').addEventListener('click', (e) => {
      const key = this._getData().key
      if (WIDGETS.instantiated.includes(key)) WIDGETS.open(key)
      else window.alert(`the ${key} widget hasn't been created yet`)
    })
  }

  _createSelection () {
    const tm = WIDGETS['tutorial-maker']
    const sel = this.$('.wig-maker-sel')
    sel.innerHTML = '<option value="NEW">NEW</option>'
    if (tm) {
      Object.keys(tm.widgets).forEach(key => {
        const opt = document.createElement('option')
        opt.value = key
        opt.textContent = key
        sel.appendChild(opt)
      })
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _update (e) {
    if (e.target.value === 'NEW') {
      this.$('.wig-maker-field').forEach(i => { i.value = '' })
      this.$('.wig-maker-ta').value = ''
      this.$('button[name="update-widget"]').textContent = 'create widget'
    } else {
      const key = e.target.value
      const inputs = this.$('.wig-maker-field')
      inputs[0].value = WIDGETS[key].key
      inputs[1].value = WIDGETS[key].title
      this.$('.wig-maker-ta').value = WIDGETS[key].innerHTML
      this.$('button[name="update-widget"]').textContent = 'edit widget'
    }
  }

  _getData () {
    const inputs = this.$('.wig-maker-field')
    const data = {
      key: inputs[0].value,
      title: inputs[1].value,
      innerHTML: this.$('.wig-maker-ta').value
    }
    return data
  }

  _validateData (data) {
    let forgot = null
    for (const k in data) { if (data[k].length < 0) forgot = k }
    return forgot
  }

  _createNewWidget () {
    const tm = WIDGETS['tutorial-maker']
    const data = this._getData()
    const err = this._validateData(data)
    if (err) { window.alert(`missing widget ${err}`); return }
    const wig = WIDGETS.create(data)
    wig.open()
    this.close()
    this._update({ target: { value: 'NEW' } })
    if (tm) tm.widgets[data.key] = data
    this._createSelection()
  }

  _updateCurrentWidget () {
    const data = this._getData()
    const err = this._validateData(data)
    if (err) { window.alert(`missing widget ${err}`); return }
    WIDGETS[data.key].title = data.title
    WIDGETS[data.key].innerHTML = data.innerHTML
    const tm = WIDGETS['tutorial-maker']
    if (tm) tm.widgets[data.key] = data
  }

  _loadTemplate (t) {
    const tm = WIDGETS['tutorial-maker']
    const ipath = (tm) ? `tutorials/${tm.metadata.id}/images` : 'images'
    const vpath = (tm) ? `tutorials/${tm.metadata.id}/videos` : 'videos'
    let val = ''
    if (t === 'info') {
      val = `<h1>INFO</h1>
<p>INFO</p>`
    } else if (t === 'quote') {
      val = `<blockquote cite="HTTP">
  <p>QUOTE</p>
  <cite>
    &mdash; <a href="HTTP" target="_blank">PERSON</a>
  </cite>
</blockquote>`
    } else if (t === 'image') {
      val = `<img style="width:100%" src="${ipath}/FILE.png">
<br>
<p>
  <a href="HTTP" target="_blank">THIS</a> THING.
</p>`
    } else if (t === 'video') {
      val = `<video controls style="width: 100%" poster="${ipath}/FILE.jpeg">
        <source src="${vpath}/FILE.mp4" type="video/mp4">
        <source src="${vpath}/FILE.webm" type="video/webm">
      </video>
<p>
  <a href="HTTP" target="_blank">VIDEO</a>, by PERSON | <a href="${vpath}/FILE.mp4" target="_blank">download video</a>
</p>`
    }
    this.$('.wig-maker-ta').value = val
  }
}

window.WidgetMaker = WidgetMaker
