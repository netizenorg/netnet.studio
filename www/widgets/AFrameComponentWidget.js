/* global Widget, NNW, NNE, Convo, Maths */
/*
  -----------
     info
  -----------

  This Widget helps you create hex, rgb/a, hsl/a color codes and inject them
  into the netitor.

  -----------
     usage
  -----------

  // this class inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js to see what those are
  // or take a look at the wiki...
  // https://github.com/netizenorg/netnet.studio/wiki/Creating-Widgets

  WIDGETS['color-widget'].updateColor(str) // takes a color string
*/
class AFrameComponentWidget extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'aframe-component-widget'
    this.keywords = ['a-frame', 'frame', 'component', 'attribute', 'properites', 'gui']

    this.resizable = false
    this.listed = false
    this.title = 'A-Frame Component Widget'

    this.data = {}
    window.utils.get('./api/data/aframe', (res) => {
      this.data = res.properties
    })

    this._createHTML()

    this.on('open', () => {
      window.convo = new Convo({
        content: 'The A-Frame component widgets let\'s you update and preview changes to an entity\'s scale, rotation and position component.'
      })
    })

    NNE.on('cursor-activity', (e) => {
      this._resetGUI()
    })

    NNE.on('edu-info', (e) => {
      if (e.type === 'attribute') this._displayGUI(e.data)
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods

  _createHTML () {
    this.innerHTML = `
      <style>
        :root {
        }

        #af-comp-wig-main {
          max-width: 500px;
        }

        #af-comp-wig-main  code {
          background: var(--netizen-meta);
          color: var(--bg-color);
          position: relative;
          top: -0.1em;
          padding: .1em 0.3em 0.2em;
          border-radius: 6px;
          font-size: 14px;
          line-height: 1.4em;
          font-weight: 700;
        }

        #af-comp-wig-gui > input[type="range"] {
          -webkit-appearance: none;
          width: 90%;
          height: 10px;
          border-radius: 5px;
          outline: none;
          /* border: 1px solid var(--netizen-meta); */
        }

        #af-comp-wig-gui > input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 4px;
          height: 24px;
          background: #fff;
          cursor: pointer;
          border-radius: 5px;
        }

        #af-comp-wig-gui > input::-moz-range-thumb {
          width: 4px;
          height: 24px;
          background: #fff;
          cursor: pointer;
          border-radius: 5px;
        }

        #af-comp-wig-gui > span {
          display: inline-block;
          margin-right: 5%;
        }

        .af-comp-wig-num {
          color: var(--netizen-meta);
          transform: translate(17px, 5px);
          text-align: center;
          position: relative;
          width: 60px;
          left: 127px;
        }

        #af-comp-wig-output {
          background-color: var(--netizen-meta);
          font-family: monospace;
          color: var(--netizen-hint-color);
          padding: 6px;
          border: none;
          margin: 6px;
          width: 250px;
          border-radius: 5px;
        }
      </style>
      <div id="af-comp-wig-main">
        <p>Double click on an entity's component (aka attribute) to load up it's properties GUI</p>
        <br>
        <div id="af-comp-wig-gui"></div>
      </div>
    `
  }

  _resetGUI () {
    this.$('#af-comp-wig-gui').innerHTML = ''
    this.$('#af-comp-wig-main > p').textContent = 'Double click on an entity\'s scale, rotation or position component to load up it\'s XYZ GUI. The entity must have an <code>id</code> defined.'
  }

  _displayGUI (comp) {
    if (this.data[comp]) {
      if (this.data[comp].type === 'vec3') this._vec3GUI(comp)
      // else if (this.data[comp].type === 'component') this._compGUI(this.data[comp])
    } else {
      this.$('#af-comp-wig-main > p').textContent = `The ${comp} component can not be edited with this Widget.`
      this.$('#af-comp-wig-gui').innerHTML = ''
    }
  }

  _missingId (comp) {
    this.$('#af-comp-wig-main > p').innerHTML = 'The <code>&lt;a-entity&gt;</code> you\'ve selected the component from is missing an <code>id</code>. You must add an <code>id="example"</code> in order for the Widget to be able to modify it. Make sure no two entity\'s have the same id'
  }

  // ...........................................................................

  _findId () {
    function parseId (s) {
      const rg = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/g
      const rx = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))+.)["']?/
      if (s.indexOf('id=') >= 0) {
        s.match(rg).forEach(m => {
          if (m.indexOf('id=') === 0) { id = m.match(rx)[2] }
        })
      }
    }

    let id = null
    const arr = NNE.code.split('\n')
    const pos = NNE.cm.getCursor()
    const str = NNE.cm.getLine(pos.line)
    const idx = arr.indexOf(str)

    let i = idx
    while (i >= 0) { // loop back
      const s = arr[i]
      parseId(s)
      if (s.indexOf('<a-entity') >= 0) break
      if (id !== null) break
      else i--
    }

    if (id) return id

    while (i < arr.length) { // loop fwd
      const s = arr[i]
      parseId(s)
      if (s.indexOf('</a-entity') >= 0) break
      if (id !== null) break
      else i++
    }

    return id
  }

  _toNum (str, dec) {
    dec = dec || 10
    return Math.round(Number(str) * dec) / dec
  }

  _updateCompAttr (ele, data, i) {
    // update a-frame code string
    const arr = data.str.split(';')
    let updated = false
    for (let j = 0; j < arr.length; j++) {
      arr[j] = arr[j].trim()
      if (arr[j].indexOf(i) === 0) {
        const pv = arr[j].split(':')
        pv[1] = data.obj[i]
        arr[j] = pv.join(': ')
        updated = true
        break
      }
    }
    if (arr.length === 1 && arr[0] === '') arr.pop()
    if (!updated) arr.push(`${i}: ${data.obj[i]}`)
    data.str = arr.join(';')
    const str = data.str.replace(/;/g, '; ')
    // update a-frame element
    ele.setAttribute(data.name, data.obj)
    // return string
    return str
  }

  _updateNumAttr (e, t, ele, comp, i) {
    let str
    if (t === 'vec3') {
      const newVal = {}
      const oldVal = ele.getAttribute(comp)
      newVal.x = i === 0 ? this._toNum(e.target.value) : oldVal.x
      newVal.y = i === 1 ? this._toNum(e.target.value) : oldVal.y
      newVal.z = i === 2 ? this._toNum(e.target.value) : oldVal.z
      str = `${newVal.x} ${newVal.y} ${newVal.z}`
      // update a-frame element
      ele.setAttribute(comp, str)
    } else if (t === 'component') {
      comp.obj[i] = this._toNum(e.target.value)
      str = this._updateCompAttr(ele, comp, i)
    }
    return str
  }

  // ...........................................................................

  _createInput (i, t, comp, mn, mx, st, v, ele, num) {
    const input = document.createElement('input')
    input.setAttribute('type', 'range')
    input.setAttribute('min', mn)
    input.setAttribute('max', mx)
    input.setAttribute('step', st)
    input.setAttribute('value', v)
    input.setAttribute('data-string', '')
    if (i === 0) input.style.background = 'var(--netizen-tag)'
    else if (i === 1) input.style.background = 'var(--netizen-attribute)'
    else if (i === 2) input.style.background = 'var(--netizen-string)'
    else input.style.background = 'var(--netizen-meta)'
    input.addEventListener('input', (e) => {
      // update a-frame attribute && return string
      const str = this._updateNumAttr(e, t, ele, comp, i)
      input.dataset.string = str
      if (num) {
        // update number under slider
        const p = Maths.map(e.target.value, mn, mx, 3, 252)
        num.style.left = `${p}px`
        num.textContent = e.target.value
      }
      // update code output field
      this.$('#af-comp-wig-output').dataset.val = str
      if (t === 'vec3') {
        this.$('#af-comp-wig-output').value = `${comp}="${str}"`
      } else if (t === 'component') {
        this.$('#af-comp-wig-output').value = `${comp.name}="${str}"`
      }
    })
    return input
  }

  // _createDropDown (arr, ele, data, i) {
  //   const input = document.createElement('select')
  //   arr.forEach(item => {
  //     const opt = document.createElement('option')
  //     opt.value = item
  //     opt.textContent = item
  //     input.appendChild(opt)
  //   })
  //   input.addEventListener('change', (e) => {
  //     data.obj[i] = e.target.value === 'true'
  //     const str = this._updateCompAttr(ele, data, i)
  //     input.dataset.string = str
  //     // update code output field
  //     this.$('#af-comp-wig-output').dataset.val = str
  //     this.$('#af-comp-wig-output').value = `${data.name}="${str}"`
  //   })
  //   return input
  // }

  _createInsertButton (type, ele, attr) {
    const button = document.createElement('button')
    button.textContent = 'insert'
    button.addEventListener('click', () => {
      // const str = bind.dataset.string
      const pos = NNE.cm.getCursor()
      const line = NNE.cm.getLine(pos.line)
      let start, end, val
      if (line[pos.ch] === '=') {
        start = pos.ch + 2
        end = start + line.substring(start).indexOf('"')
        val = this.$('#af-comp-wig-output').dataset.val
      } else {
        start = end = pos.ch
        val = `="${this.$('#af-comp-wig-output').dataset.val}"`
      }
      NNE.cm.setSelection(
        { line: pos.line, ch: start }, { line: pos.line, ch: end }
      )
      NNE.cm.replaceSelection(val)
    })
    return button
  }

  // ...........................................................................

  _vec3GUI (comp) {
    this.$('#af-comp-wig-gui').innerHTML = ''
    const id = this._findId()
    if (!id) this._missingId(comp)
    else {
      this.$('#af-comp-wig-main > p').textContent = 'Adjust the sliders to preview your change. Then click "insert" to update your code with these changes.'

      const ele = NNW.rndr.querySelector('iframe')
        .contentDocument.querySelector(`#${id}`)
      const val = ele.getAttribute(comp)

      for (let i = 0; i < 3; i++) {
        const opts = (comp === 'position') ? [-10, 10, 0.1, 0]
          : (comp === 'rotation') ? [-360, 360, 1, 0]
            : [0, 2, 0.1, 1] // scale

        const num = document.createElement('div')
        num.textContent = i === 0 ? val.x : i === 1 ? val.y : val.z
        num.className = 'af-comp-wig-num'

        const input = this._createInput(i, 'vec3', comp, ...opts, ele, num)
        input.value = i === 0 ? val.x : i === 1 ? val.y : val.z

        const span = document.createElement('span')
        span.textContent = i === 0 ? 'X' : i === 1 ? 'Y' : 'Z'

        this.$('#af-comp-wig-gui').appendChild(span)
        this.$('#af-comp-wig-gui').appendChild(input)
        this.$('#af-comp-wig-gui').appendChild(num)
        this.$('#af-comp-wig-gui').appendChild(document.createElement('br'))
      }

      const button = this._createInsertButton('vec3', ele, comp)
      this.$('#af-comp-wig-gui').appendChild(button)
      const output = document.createElement('input')
      output.setAttribute('id', 'af-comp-wig-output')
      output.value = `${comp}="${val.x} ${val.y} ${val.z}"`
      this.$('#af-comp-wig-gui').appendChild(output)
    }
  }

  // _compGUI (comp) {
  //   this.$('#af-comp-wig-gui').innerHTML = ''
  //   const id = this._findId()
  //   if (!id) this._missingId(comp)
  //   else {
  //     this.$('#af-comp-wig-main > p').textContent = 'adjust the slider to preview your change...'
  //
  //     const ele = NNW.rndr.querySelector('iframe')
  //       .contentDocument.querySelector(`#${id}`)
  //     const data = {
  //       name: comp.name,
  //       obj: JSON.parse(JSON.stringify(ele.getAttribute(comp.name)))
  //     }
  //     for (const i in ele.attributes) {
  //       const a = ele.attributes[i]
  //       if (a.name === comp.name) data.str = a.value
  //     }
  //
  //     if (data.str.includes('\n')) {
  //       const w = `The ${data.name} component's value must be written in a single line in order for this Widget to function propertly (sorry, this is still a work inprogress).`
  //       this.$('#af-comp-wig-main > p').textContent = w
  //       return
  //     }
  //
  //     const schema = comp.schema
  //     for (const prop in schema) {
  //       const o = schema[prop]
  //
  //       const name = document.createElement('div')
  //       name.textContent = prop + ': '
  //
  //       if (o.type === 'number') {
  //         const opts = [o.min, o.max, o.step || 1, o.default]
  //         const input = this._createInput(prop, 'component', data, ...opts, ele)
  //         const num = document.createElement('span')
  //         num.textContent = data.obj[prop]
  //         name.appendChild(num)
  //         this.$('#af-comp-wig-gui').appendChild(name)
  //         this.$('#af-comp-wig-gui').appendChild(input)
  //         this.$('#af-comp-wig-gui').appendChild(document.createElement('br'))
  //       } else if (o.type === 'boolean') {
  //         const arr = ['true', 'false']
  //         const input = this._createDropDown(arr, ele, data, prop)
  //         name.appendChild(input)
  //         this.$('#af-comp-wig-gui').appendChild(name)
  //       }
  //
  //       this.$('#af-comp-wig-gui').appendChild(document.createElement('br'))
  //     }
  //
  //     this.$('#af-comp-wig-gui').appendChild(document.createElement('br'))
  //
  //     const button = this._createInsertButton('component', ele, data)
  //     this.$('#af-comp-wig-gui').appendChild(button)
  //
  //     const output = document.createElement('textarea')
  //     output.setAttribute('id', 'af-comp-wig-output')
  //     output.style.width = '100%'
  //     output.style.margin = '6px auto'
  //     output.value = data.str ? `${data.name}="${data.str}"` : data.name
  //     this.$('#af-comp-wig-gui').appendChild(output)
  //   }
  // }
}

window.AFrameComponentWidget = AFrameComponentWidget
