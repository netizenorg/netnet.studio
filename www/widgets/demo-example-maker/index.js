/* global Widget, WIDGETS, Convo, NNE, Netitor, nn, NNW, utils */
class DemoExampleMaker extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'demo-example-maker'
    this.listed = true
    this.title = 'Demo/Example Maker'
    this._curStep = 0
    this._sections = null
    this.resizable = false
    this._data = {
      name: null, toc: true, tags: [], layout: 'dock-left', key: null, code: null, steps: []
    }
    // this.loaded = null
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
    utils.get('api/examples', (res) => {
      // this._data.key = Math.max(...Object.keys(res.data)) + 1
      this._data.key = Date.now()
      this._sections = res.sections
      this._createHTML(res.sections.map(o => o.name))
    })

    const loadData = () => {
      if (!this.$('.demo-example-maker')) {
        return setTimeout(() => loadData(), 100)
      }
      if (utils.url.example) {
        const obj = WIDGETS['code-examples'].exData
        this._uploadJSON(obj)
      } else if (window.location.hash.includes('#example/')) {
        const hash = window.location.hash.split('#example/')[1]
        const data = JSON.parse(NNE._decode(hash))
        this._uploadJSON(data)
      }

      // console.log(this._data)
      if (this._data.steps) this._selectStep(0)
      this.$('[name="dem-demo-name"]').value = this._data.name
      this.$('[name="dem-demo-layout"]').value = this._data.layout || 'dock-left'
      this.$('[name="dem-demo-toc"]').checked = this._data.toc
      if (this._data.tags && this._data.tags instanceof Array) {
        this.$('[name="dem-demo-tags"]').value = this._data.tags.join(',')
      } else if (this._data.tags && typeof this._data.tags === 'string') {
        this.$('[name="dem-demo-tags"]').value = this._data.tags.replace(/ /g, ',')
      }
    }

    this.on('open', () => {
      if (utils.url.example || window.location.hash.includes('#example/')) {
        WIDGETS['code-examples'].close()
        loadData()
      }
    })
  }

  _createHTML (types) {
    this.innerHTML = `
      <div class="demo-example-maker">
        <div class="demo-example-maker__step-cnt">
          <div class="dem-rl-div">
            <button class="pill-btn pill-btn--secondary" name="dem-add-step" style="float: right">add new step</button>
          </div>

          <div class="demo-example-maker__step-data">
            <div class="dem-div">
              <input placeholder="step title" type="text" name="dem-s-title">
              <input type="text" placeholder="line numbers (comma separated)" name="dem-s-focus">
            </div>
            <div name="dem-s-text" placeholder="explain step"></div>
            <button class="pill-btn pill-btn--secondary" name="dem-preview-step">preview this step</button>
            <button class="pill-btn pill-btn--secondary" name="dem-remove-step">remove this step</button>
          </div>
        </div>

        <h3 class="demo-example-maker__settings-btn">
           <i class="rl-arrow rl-down"></i> settings
        </h3>

        <div class="demo-example-maker__settings">
          <div>
            <button class="pill-btn pill-btn--secondary"class="pill-btn pill-btn--secondary" name="dem-gen-url">generate link</button>
            <button class="pill-btn pill-btn--secondary"class="pill-btn pill-btn--secondary" name="dem-up-json" id="json-btn">upload json</button>
            <button class="pill-btn pill-btn--secondary"class="pill-btn pill-btn--secondary" name="dem-dl-json">download json</button>
            <button class="pill-btn pill-btn--secondary" name="dem-save-info">?</button>
          </div>

          <textarea name="dem-url"></textarea>

          <div class="demo-exmaple-maker__settings__details">
            <div>
              <span>layout <select class="dropdown dropdown--invert" name="dem-demo-layout"></select></span>
              <button class="pill-btn pill-btn--secondary" style="margin-left: 3px;" name="dem-layout-info">?</button>
            </div>
            <div>
              <span>
                <input type="checkbox" name="dem-demo-toc"> display table of contents
              </span>
              <button class="pill-btn pill-btn--secondary" style="margin-left: 10px;" name="dem-toc-info">?</button>
            </div>
            <div>
            json file name <input style="width: 300px; margin: 0 10px 0 10px;" name="dem-demo-name" placeholder="demo name" type="text">
              <button class="pill-btn pill-btn--secondary" name="dem-name-info">?</button>
            </div>
            <div>
              json file tags <input type="text" placeholder="(comma separated)" name="dem-demo-tags" style="width: 300px; margin: 0 10px 0 20px;">
              <button class="pill-btn pill-btn--secondary" name="dem-tags-info">?</button>
            </div>
          </div>
        </div>
      </div>
    `
    this._setupReorderableList()

    this._text = new Netitor({
      ele: 'div[name="dem-s-text"]',
      code: 'in this step...',
      wrap: true,
      hint: false,
      lint: false,
      theme: NNE.theme,
      language: 'html'
    })

    this._text.cm.on('blur', () => {
      this._updateStep(this._curStep)
    })

    this._addStep({
      id: this._data.steps.length,
      title: 'getting started',
      focus: null,
      text: 'in this step...'
    })

    // this.$('[name="dem-current-step"]').addEventListener('change', () => {
    //   const s = Number(e.target.value)
    //   this._selectStep(this._data.steps[s])
    // })

    this.$('[name="dem-preview-step"]').addEventListener('click', () => {
      this._previewStep(this._curStep)
    })

    this.$('[name="dem-add-step"]').addEventListener('click', () => {
      this._addStep()
    })

    this.$('[name="dem-remove-step"]').addEventListener('click', () => {
      this._updateStep(this._curStep, 'remove')
    })

    this.$('.demo-example-maker__settings-btn').addEventListener('click', () => {
      if (this.$('.demo-example-maker__settings').style.display === 'block') {
        this.$('.demo-example-maker__settings').style.display = 'none'
        this.$('.demo-example-maker__settings-btn > i').classList.remove('rl-up')
        this.$('.demo-example-maker__settings-btn > i').classList.add('rl-down')
        this.$('.demo-example-maker__step-cnt').style.height = '280px'
        this.keepInFrame()
      } else {
        this.$('.demo-example-maker__settings').style.display = 'block'
        this.$('.demo-example-maker__settings-btn > i').classList.remove('rl-down')
        this.$('.demo-example-maker__settings-btn > i').classList.add('rl-up')
        this.$('.demo-example-maker__step-cnt').style.height = '0px'
        this.keepInFrame()
      }
    })

    this.$('.pill-btn.pill-btn--secondary').forEach(b => b.addEventListener('click', (e) => {
      if (e.target.name === 'dem-save-info') {
        window.convo = new Convo(this.convos, 'save-info')
      } else if (e.target.name === 'dem-layout-info') {
        window.convo = new Convo(this.convos, 'layout-info')
      } else if (e.target.name === 'dem-toc-info') {
        window.convo = new Convo(this.convos, 'toc-info')
      } else if (e.target.name === 'dem-name-info') {
        window.convo = new Convo(this.convos, 'name-info')
      } else if (e.target.name === 'dem-tags-info') {
        window.convo = new Convo(this.convos, 'tags-info')
      }
    }))

    this.$('[name="dem-demo-toc"]').addEventListener('change', () => {
      if (this.$('[name="dem-demo-toc"]').checked) {
        this._data.toc = true
      } else { this._data.toc = false }
    })

    this.$('[name="dem-gen-url"]').addEventListener('click', () => {
      this._generateURL()
      this.keepInFrame()
    })

    this.$('[name="dem-dl-json"]').addEventListener('click', () => {
      if (!this._data.name) window.alert('you must enter a name for this file')
      else this._downloadJSON()
    })

    this.$('[name="dem-s-focus"]').addEventListener('click', () => {
      if (NNE.cm.getSelection().length > 0) {
        const arr = []
        const lines = NNE.cm.getSelection().split('\n')
        const code = NNE.code.split('\n')
        lines.forEach(l => {
          const idx = code.indexOf(l)
          if (idx >= 0) arr.push(idx + 1)
        })
        this.$('[name="dem-s-focus"]').value = arr.join(',')
      }
    })

    this.$('input').forEach(input => {
      input.addEventListener('change', (e) => {
        this._updateStep(this._curStep)
        this.reorderableList.updateStep(this._data.steps[this._curStep])
      })
    })

    this.fu = new nn.FileUploader({
      maxsize: 500,
      types: 'application/json',
      click: '#json-btn',
      ready: (file) => {
        const d = file.data.split('data:application/json;base64,').pop()
        this.loaded = JSON.parse(window.atob(d))
        if (NNW.layout === 'welcome') {
          this._uploadJSON(this.loaded, 'demo-example-maker')
          window.convo.hide()
        } else window.convo = new Convo(this.convos, 'before-loading-json')
      },
      error: (err) => {
        console.error(err)
      }
    })

    // ...
    const urlReset = (e, key) => {
      this._data[key] = key === 'tags'
        ? e.target.value.split(',').map(s => s.trim())
        : e.target.value
      this.$('[name="dem-url"]').value = null
      this.$('[name="dem-url"]').style.display = 'none'
    }

    this.$('[name="dem-demo-name"]')
      .addEventListener('input', e => urlReset(e, 'name'))

    this.$('[name="dem-url"]').addEventListener('click', (e) => {
      // e.target.focus()
      // e.target.select()
      // navigator.clipboard.writeText(e.target.value)
      utils.copyLink(e.target)
    })

    NNW.layouts.filter(l => l !== 'welcome').forEach(layout => {
      const o = document.createElement('option')
      o.textContent = layout
      o.value = layout
      this.$('[name="dem-demo-layout"]').appendChild(o)
    })
    this.$('[name="dem-demo-layout"]').value = 'dock-left'
    this.$('[name="dem-demo-layout"]')
      .addEventListener('input', e => urlReset(e, 'layout'))

    this.$('[name="dem-demo-toc"]').checked = true
    this.$('[name="dem-demo-toc"]')
      .addEventListener('input', e => urlReset(e, 'toc'))

    this.$('[name="dem-demo-tags"]')
      .addEventListener('input', e => urlReset(e, 'tags'))
  }

  // ------------------------------

  _setupReorderableList () {
    const createReorderableList = (key) => {
      if (!utils.customElementReady('reorderable-list')) {
        setTimeout(() => createReorderableList(key), 100)
        return
      }
      this.reorderableList = document.createElement('reorderable-list')
      this.reorderableList.widget = key
      const dem = document.querySelector('.dem-rl-div')
      dem.insertBefore(this.reorderableList, this.$('[name="dem-add-step"]'))
    }
    createReorderableList(this.key)
  }

  _previewStep (step) {
    window.convo = new Convo({ content: this._text.code })
    if (this.$('[name="dem-s-focus"]').value.length > 0) {
      const lines = this.$('[name="dem-s-focus"]').value.split(',').flatMap(f => {
        if (f.includes('-')) {
          const [start, end] = f.split('-').map(n => Number(n))
          return Array.from({ length: end - start + 1 }, (_, i) => start + i)
        } else {
          return Number(f)
        }
      })
      NNE.spotlight([...lines])
    } else NNE.spotlight(null)
  }

  _addStep (step) {
    step = step || {
      id: this._data.steps.length,
      title: null,
      focus: null,
      text: null
    }
    this._data.steps.push(step)
    this._selectStep(step.id)
    this.reorderableList.addStep(step)
    this.$('[name="dem-url"]').style.display = 'none'
  }

  _updateStep (step, remove) {
    const { steps } = this._data
    if (remove === 'uploading') {
      steps.splice(step, 1)
      this.reorderableList.updateStep(Number(step), 'uploading')
    } else if (remove) {
      if (steps.length < 2) return window.alert('need at least 1 step')
      steps.splice(step, 1)
      this.reorderableList.updateStep(Number(step), 'remove')
      for (let i = step; i < steps.length; i++) {
        steps[i].id = i
      }
      step = (step === 0)
        ? Number(step)
        : Number(step) - 1
      this._selectStep(step)
    } else if (isNaN(step)) {
      const { newIdx, oldIdx } = step

      const [selectedStep] = steps.splice(oldIdx, 1)
      const updatedSteps = steps.splice(newIdx, 0, selectedStep)

      updatedSteps.forEach((step, index) => {
        this._data.steps[index].id = index
      })
      this._selectStep(newIdx)
    } else {
      steps[step] = {
        id: steps[step].id,
        title: this.$('[name="dem-s-title"]').value,
        focus: this.$('[name="dem-s-focus"]').value || null,
        text: this._text.code
      }
      this.reorderableList.updateStep(this._data.steps[step])
    }
    this.$('[name="dem-url"]').style.display = 'none'
  }

  _selectStep (index) {
    this._curStep = index
    const step = this._data.steps[index]
    this.$('[name="dem-s-title"]').value = step.title
    this.$('[name="dem-s-focus"]').value = step.focus
    this._text.code = step.text || 'in this step...'
  }

  // ------------------------------

  _getData () {
    const name = this._data.name
    const key = this._data.key
    const toc = this._data.toc
    const tags = this._data.tags
    const layout = this._data.layout
    const info = this._data.steps.map(s => {
      if (s.focus && typeof s.focus === 'string') {
        s.focus = s.focus.split(',').flatMap(f => {
          if (f.includes('-')) {
            const [start, end] = f.split('-').map(n => Number(n))
            return Array.from({ length: end - start + 1 }, (_, i) => start + i)
          } else {
            return Number(f)
          }
        })
      }
      return s
    })

    const code = `#code/${NNE._encode(NNE.code)}`
    return { name, toc, tags, layout, key, code, info }
  }

  _generateURL () {
    const data = this._getData()
    const str = JSON.stringify(data)
    const loc = window.location
    const l = this._data.layout !== 'dock-left' ? `?layout=${this._data.layout}` : ''
    const url = `${loc.protocol}//${loc.host}/${l}#example/${NNE._encode(str)}`
    this.$('[name="dem-url"]').value = url
    this.$('[name="dem-url"]').style.display = 'block'
  }

  _uploadJSON (ex) {
    for (let step = this._data.steps.length; step >= 1; step--) {
      this._updateStep(step, 'uploading')
    }
    this._data = {
      name: ex.name,
      tags: ex.tags || null,
      toc: ex.toc || false,
      layout: ex.layout || 'dock-left',
      key: Number(ex.key),
      code: ex.code,
      steps: ex.info || []
    }
    this.$('[name="dem-demo-name"]').value = ex.name
    this.$('[name="dem-demo-layout"]').value = ex.layout || 'dock-left'
    this.$('[name="dem-demo-toc"]').checked = ex.toc || true
    this.$('[name="dem-demo-tags"]').value = ex.tags || null
    if (NNW.layout !== this._data.layout) NNW.layout = this._data.layout
    NNE.code = NNE._decode(ex.code.split('#code/').pop())
    if (this._data.steps.length > 0) {
      this._selectStep(0)
      this._data.steps.forEach((step, index) => {
        step.id = index
        this.reorderableList.addStep(step)
      })
      this.reorderableList.selectStep(0)
    } else {
      this.$('[name="dem-s-title"]').value = null
      this.$('[name="dem-s-focus"]').value = null
      this._text.code = ''
      this._selectStep(null)
    }
  }

  _downloadJSON () {
    const data = this._getData()
    const str = JSON.stringify(data, null, 2)
    const uri = `data:application/json;base64,${utils.btoa(str)}`
    const name = data.name.toLowerCase().replace(/\s/g, '_')
    const a = document.createElement('a')
    a.setAttribute('download', `${data.key}--${name}.json`)
    a.setAttribute('href', uri)
    a.click()
    a.remove()
  }
}

window.DemoExampleMaker = DemoExampleMaker
