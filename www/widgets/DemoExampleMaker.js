/* global Widget, WIDGETS, NNE, NNW, utils */
class DemoExampleMaker extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'demo-example-maker'
    this.listed = false
    this.title = 'Demo/Example Maker'
    this._curStep = 0
    this._sections = null
    this._data = {
      name: null, type: null, toc: true, layout: 'dock-left', key: null, code: null, steps: []
    }
    utils.get('api/examples', (res) => {
      this._data.key = Math.max(...Object.keys(res.data)) + 1
      this._sections = res.sections
      this._createHTML(res.sections.map(o => o.name))
    })

    const loadData = () => {
      if (!this.$('.demo-example-maker')) {
        return setTimeout(() => loadData(), 100)
      }

      if (utils.url.example) {
        const obj = WIDGETS['code-examples'].exData
        this._data = {
          name: obj.name,
          toc: obj.toc,
          layout: obj.layout,
          key: Number(obj.key),
          code: obj.code,
          steps: obj.info
        }
        for (let i = 0; i < this._sections.length; i++) {
          const sec = this._sections[i]
          if (sec.listed.includes(this._data.key)) {
            this._data.type = sec.name
            break
          }
        }
      } else if (window.location.hash.includes('#example/')) {
        const hash = window.location.hash.split('#example/')[1]
        const data = JSON.parse(NNE._decode(hash))
        data.steps = data.info
        this._data = data
      }

      this._selectStep(this._data.steps[0])
      this.$('[name="dem-demo-name"]').value = this._data.name
      this.$('[name="dem-demo-type"]').value = this._data.type
      this.$('[name="dem-demo-layout"]').value = this._data.layout
      this.$('[name="dem-demo-toc"]').checked = this._data.toc
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
      <style>
        .demo-example-maker > textarea {
          width: 100%;
          margin: 10px 5px;
          border-radius: 5px;
          padding: 5px;
          border: none;
        }
        textarea[name="dem-s-text"] {
          background: var(--netizen-meta);
        }
        textarea[name="dem-url"] {
          display: none;
          color: var(--netizen-meta);
          background-color: var(--netizen-hint-shadow);
        }
      </style>
      <div class="demo-example-maker">
        editing step <select name="dem-current-step"></select>
        <button name="dem-add-step" style="float: right">add step</button>
        <br>
        <br>
        <hr>
        <input placeholder="step title" type="text" name="dem-s-title">
        <input type="text" placeholder="line numbers (comma separated)" name="dem-s-focus">
        <br>
        <textarea name="dem-s-text" placeholder="explain step"></textarea>
        <br>
        <button name="dem-update-step">update step</button>
        <button name="dem-remove-step">remove step</button>
        <hr>
        <br>
        <input name="dem-demo-name" placeholder="demo name" type="text">
        <select name="dem-demo-type"></select>
        <br>
        <div style="margin: 10px 15px;">
          layout <select name="dem-demo-layout"></select> |
          display toc <input type="checkbox" name="dem-demo-toc"> (table of contents)
        </div>
        <textarea name="dem-url"></textarea>
        <br>
        <div style="float: right">
          <button name="dem-gen-url">generate link</button>
          <button name="dem-dl-json">download json</button>
        </div>
      </div>
    `
    this._addStep({
      title: 'getting started',
      focus: null,
      text: 'in this step...'
    })

    this.$('[name="dem-current-step"]').addEventListener('change', (e) => {
      const s = Number(e.target.value)
      this._selectStep(this._data.steps[s])
    })

    this.$('[name="dem-add-step"]').addEventListener('click', () => {
      this._addStep()
    })

    this.$('[name="dem-update-step"]').addEventListener('click', () => {
      this._updateStep(this._curStep)
    })

    this.$('[name="dem-remove-step"]').addEventListener('click', () => {
      this._updateStep(this._curStep, 'remove')
    })

    this.$('[name="dem-gen-url"]').addEventListener('click', () => {
      this._generateURL()
    })

    this.$('[name="dem-dl-json"]').addEventListener('click', () => {
      this._downloadJSON()
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

    // ...

    this.$('[name="dem-demo-name"]').addEventListener('input', (e) => {
      this._data.name = e.target.value
      this.$('[name="dem-url"]').value = null
      this.$('[name="dem-url"]').style.display = 'none'
    })

    types.forEach(type => {
      const o = document.createElement('option')
      o.textContent = type
      o.value = type
      this.$('[name="dem-demo-type"]').appendChild(o)
    })

    this.$('[name="dem-demo-type"]').addEventListener('change', (e) => {
      this._data.type = e.target.value
      this.$('[name="dem-url"]').value = null
      this.$('[name="dem-url"]').style.display = 'none'
    })

    this.$('[name="dem-url"]').addEventListener('click', (e) => {
      e.target.focus()
      e.target.select()
      navigator.clipboard.writeText(e.target.value)
    })

    NNW.layouts.filter(l => l !== 'welcome').forEach(layout => {
      const o = document.createElement('option')
      o.textContent = layout
      o.value = layout
      this.$('[name="dem-demo-layout"]').appendChild(o)
    })
    this.$('[name="dem-demo-layout"]').value = 'dock-left'
    this.$('[name="dem-demo-layout"]').addEventListener('input', (e) => {
      this._data.layout = e.target.value
    })

    this.$('[name="dem-demo-toc"]').addEventListener('input', (e) => {
      this._data.toc = e.target.checked
    })
  }

  // ------------------------------

  _addStep (step) {
    step = step || { title: null, focus: null, text: null }
    this._data.steps.push(step)
    this._selectStep(step)
  }

  _updateStep (step, remove) {
    if (remove) {
      const prev = step - 1
      if (prev < 0) return window.alert('need at least 1 step')
      this._data.steps.splice(step, 1)
      this._selectStep(prev)
    } else {
      this._data.steps[step] = {
        title: this.$('[name="dem-s-title"]').value,
        focus: this.$('[name="dem-s-focus"]').value || null,
        text: this.$('[name="dem-s-text"]').value
      }
      this._selectStep(step)
    }
  }

  _selectStep (step) {
    this._curStep = (typeof step === 'number')
      ? step : this._data.steps.indexOf(step)
    step = (typeof step === 'number') ? this._data.steps[step] : step

    const stepSelect = this.$('[name="dem-current-step"]')
    stepSelect.innerHTML = ''
    this._data.steps.forEach((s, i) => {
      const o = document.createElement('option')
      o.textContent = `${i}. ${s.title}`
      o.value = i
      stepSelect.appendChild(o)
    })
    stepSelect.selectedIndex = this._curStep

    this.$('[name="dem-s-title"]').value = step.title
    this.$('[name="dem-s-focus"]').value = step.focus
    this.$('[name="dem-s-text"]').value = step.text
  }

  // ------------------------------

  _getData () {
    const name = this._data.name || 'demo'
    const type = this.$('[name="dem-demo-type"]').value
    const key = this._data.key
    const toc = this._data.toc
    const layout = this._data.layout
    const info = this._data.steps.map(s => {
      if (s.focus && typeof s.focus === 'string') {
        s.focus = s.focus.split(',').map(n => Number(n))
      }
      return s
    })
    const code = `#code/${NNE._encode(NNE.code)}`
    return { name, type, toc, layout, key, code, info }
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
