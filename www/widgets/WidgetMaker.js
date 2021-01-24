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
      <style>
        .__wig-maker-field {
          width: 148px !important;
        }
        .__wig-maker-ta {
          display: block;
          width: 100%;
          height: 250px;
          padding: 10px;
        }
        .__wig-maker-templates {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 10px 0px 15px 0px;
        }
      </style>
      <select class="__wig-maker-sel"></select>
      <input class="__wig-maker-field" type="text" placeholder="widget-key">
      <input class="__wig-maker-field" type="text" placeholder="Widget Title">
      <div class="__wig-maker-templates"><span>templates:</span></div>
      <textarea class="__wig-maker-ta"></textarea><hr>
      <button name="update-widget">create widget</button>
      <button name="open-widget">open widget</button>
    `
    this._createSelection()
    this.$('.__wig-maker-sel').addEventListener('change', (e) => this._update(e))

    const templates = ['info', 'quote', 'image', 'video']
    templates.forEach(t => {
      const btn = document.createElement('button')
      btn.textContent = t
      btn.addEventListener('click', () => this._loadTemplate(t))
      this.$('.__wig-maker-templates').appendChild(btn)
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
    const sel = this.$('.__wig-maker-sel')
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
      this.$('.__wig-maker-field').forEach(i => { i.value = '' })
      this.$('.__wig-maker-ta').value = ''
      this.$('button[name="update-widget"]').textContent = 'create widget'
    } else {
      const key = e.target.value
      const inputs = this.$('.__wig-maker-field')
      inputs[0].value = WIDGETS[key].key
      inputs[1].value = WIDGETS[key].title
      this.$('.__wig-maker-ta').value = WIDGETS[key].innerHTML
      this.$('button[name="update-widget"]').textContent = 'edit widget'
    }
  }

  _getData () {
    const inputs = this.$('.__wig-maker-field')
    const data = {
      key: inputs[0].value,
      title: inputs[1].value,
      innerHTML: this.$('.__wig-maker-ta').value
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
    const path = (tm) ? `tutorials/${tm.metadata.id}` : 'videos'
    let val = ''
    if (t === 'info') {
      val = `<h1>Some Info</h1>
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`
    } else if (t === 'quote') {
      val = `<blockquote cite="https://website.com/quote">
  <p>This is a very inspirational and informative quote</p>
  <cite>
    &mdash; <a href="https://website.com/quote" target="_blank">Relevant Person</a>
  </cite>
</blockquote>`
    } else if (t === 'image') {
      val = `<img style="width:100%" src="tutorials/FOLDER/images/FILE.png">
<br>
<p>
  <a href="https://website.com" target="_blank">This</a> is an image.
</p>`
    } else if (t === 'video') {
      val = `<video style="width: 100%" loop src="${path}/FILE.mp4"></video>
<p>
  <a href="https://website.com" target="_blank">This Video</a>, by this person | <a href="${path}/FILE.mp4" target="_blank">download video</a>
</p>`
    }
    this.$('.__wig-maker-ta').value = val
  }
}

window.WidgetMaker = WidgetMaker
