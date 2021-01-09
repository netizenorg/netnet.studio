/* global Widget, Convo, NNE, NNW, utils, Color, WIDGETS */
class CSSReference extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'css-reference'
    this.listed = true
    this.keywords = ['css', 'properties', 'reference']
    this.resizable = false

    utils.get('./data/css-reference.json', (json) => { this.data = json })

    NNW.on('theme-change', () => { this._createHTML() })

    this.title = 'CSS Reference'

    // options objects for <widget-slide> .updateSlide() method
    this.mainOpts = {
      name: 'css-reference-main',
      widget: this,
      ele: this._createMainSlide()
    }

    this.propsListOpts = {
      name: 'css-reference-properties',
      widget: this,
      back: this.mainOpts,
      list: this._createPropsList()
    }

    this._createHTML()
  }

  textBubble (eve) {
    if (!eve) return
    const clr = ['rgb', 'rgba', 'hsl', 'hsla', 'hex'].includes(eve.data)
    if (!eve.nfo && !clr) return

    // create color info (if color)
    // return b/c textBubble called again in _selectColor
    const k = NNE.edu.css.colors[eve.data]
    const c = Color.match(eve.data.toLowerCase())
    if (k && !eve.modified) return this._selectColor(eve, 'keyword', c, k)
    else if (c && c[0] === 'hex' && !eve.modified) {
      return this._selectColor(eve, 'hex', c, k)
    } else if (['rgb', 'rgba', 'hsl', 'hsla'].includes(eve.data)) {
      return this._selectColor(eve, eve.data, c, k)
    }

    // textBubble content + options

    const more = () => {
      if (eve.type === 'property') {
        this._createPropSlide(eve.data)
        this.open()
      } else {
        const url = eve.nfo.url
        const a = document.createElement('a')
        a.setAttribute('download', 'index.html')
        a.setAttribute('href', url)
        a.setAttribute('target', '_blank')
        a.click()
        a.remove()
      }
    }

    const options = {}
    if (eve.nfo.url || eve.type === 'property') {
      options['tell me more'] = () => more()
    } else if (eve.modified === 'color') {
      options['open Color Widget'] = () => WIDGETS.open('color-widget')
    }
    options.ok = (e) => { NNE.spotlight(null); e.hide() }

    const extras = this.data[eve.data]
    let content = (extras && extras.bubble)
      ? `<p>${this.data[eve.data].bubble}</p>`
      : `<p>${eve.nfo.description.html}</p>`
    if (eve.type === 'comment') content = this.data[eve.type].bubble

    // update slide if necessary
    if (eve.type === 'property') this._createPropSlide(eve.data)

    window.convo = new Convo({ content, options })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _selectColor (e, type, c, k) {
    if (type === 'hex') {
      const c = Color.match(e.data.toLowerCase())
      setTimeout(() => {
        if (c && c[0] === 'hex') {
          const from = NNE.cm.getCursor('from')
          const to = NNE.cm.getCursor('to')
          const f = { line: from.line, ch: from.ch - 1 }
          NNE.cm.setSelection(f, to)
          e.nfo = { description: { html: this._colorEduInfo(e, c, k) } }
          e.modified = 'color'
          this.textBubble(e)
        }
      }, 100)
    } else if (type === 'keyword') {
      e.nfo = { description: { html: this._colorEduInfo(e, c, k) } }
      e.modified = 'color'
      this.textBubble(e)
    } else {
      const to = NNE.cm.getCursor('to')
      const s = NNE.cm.getLine(to.line)
      const from = s.indexOf(e.data)
      const f = { line: to.line, ch: from }
      for (let i = to.ch; i < s.length; i++) {
        if (s[i] === ')') { to.ch = i + 1; break }
      }
      setTimeout(() => {
        NNE.cm.setSelection(f, to)
        const sel = NNE.cm.getSelection()
        e.data = sel
        c = Color.match(sel.toLowerCase())
        e.nfo = { description: { html: this._colorEduInfo(e, c, k) } }
        e.modified = 'color'
        this.textBubble(e)
      }, 100)
    }
  }

  _colorEduInfo (eve, c, k) {
    let type
    let val
    let alpha = null
    const r = { hex: null, hsl: null, rgb: null }
    const clrURL = {
      keyword: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords',
      rgb: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#RGB_colors',
      hsl: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#HSL_colors',
      hex: 'https://www.w3schools.com/colors/colors_hexadecimal.asp'
    }

    if (c && c[0] === 'hex') {
      if (c[0].length === 9) alpha = c[0].substring(7, 9)
      else if (c && c[0].length === 5) alpha = c[0].substring(4, 5)
    } else if (c && (c[0] === 'rgb' || c[0] === 'hsl')) {
      if (c[5]) alpha = c[5]
    }

    if (k) {
      type = 'keyword'
      val = k.name
      r.keyword = k.name; r.hex = k.hex; r.rgb = k.rgb
      const hsl = Color.hex2hsl(k.hex)
      r.hsl = `hsl(${hsl.h}, ${hsl.s}, ${hsl.l})`
    } else {
      type = c[0]
      val = c[1]

      if (type === 'hex') {
        r.hex = val.length === 9 ? val.substring(0, 7)
          : val.length === 5 ? val.substring(0, 4)
            : val
      } else if (type === 'rgb' || type === 'hsl') {
        r.hex = type === 'rgb'
          ? Color.rgb2hex(parseInt(c[2]), parseInt(c[3]), parseInt(c[4]))
          : Color.hsl2hex(parseInt(c[2]), parseInt(c[3]), parseInt(c[4]))
        if (alpha) r.hex += Color.alpha2hex(alpha)
      }

      const rgb = Color.hex2rgb(r.hex)
      r.rgb = type === 'rgb' ? val
        : alpha ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
          : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

      const hsl = Color.hex2hsl(r.hex)
      r.hsl = type === 'hsl' ? val
        : alpha ? `hsla(${hsl.h}, ${hsl.s}, ${hsl.l}, ${alpha})`
          : `hsl(${hsl.h}, ${hsl.s}, ${hsl.l})`
    }

    // const offset = new Date().getTimezoneOffset()
    let clr = '<span style="color: hsl(0, 80%, 68%);">C</span><span style="color: hsl(62, 80%, 68%);">O</span><span style="color: hsl(120, 80%, 68%);">L</span><span style="color: hsl(239, 80%, 68%);">O</span>'
    // if (offset >= 0) clr += '<span style="color: hsl(178, 80%, 68%);">U</span>'
    clr += '<span style="color: hsl(296, 80%, 68%);">R</span>'

    let s = `<h1><a href="https://developer.mozilla.org/en-US/docs/Web/CSS color_value" target="_blank">color</a></h1><p>This is a ${clr} code, `

    s += (type === 'keyword') ? `this specific color <code>${val}</code> is defined using a color <a href="${clrURL[type]}" target="_blank">${type}</a>.` : `this specific color <code>${val}</code> is defined using ${type === 'hex' ? 'a' : 'an'} <a href="${clrURL[type]}" target="_blank">${type}</a> color code.`

    const ix = `written as a <i>hex</i> code it would be <code>${r.hex}</code>`
    const ir = `written as an <i>rgb</i> code it would be <code>${r.rgb}</code>`
    const ih = `written as an <i>hsl</i> code it would be <code>${r.hsl}</code>`

    if (type === 'keyword') {
      return `${s} If this were ${ix}, ${ir}, ${ih}.</p>`
    } else if (type === 'hex') {
      return `${s} If this were ${ir}, ${ih}.</p>`
    } else if (type === 'rgb') {
      return `${s} If this were ${ix}, ${ih}.</p>`
    } else if (type === 'hsl') {
      return `${s} If this were ${ix}, ${ir}.</p>`
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• Widget Content
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML () {
    if (!utils.customElementReady('widget-slide')) {
      setTimeout(() => this._createHTML(), 100)
      return
    }

    this.slide = document.createElement('widget-slide')
    this.innerHTML = this.slide

    this.ele.style.padding = '5px 5px 10px'
    this.ele.querySelector('.w-top-bar').style.padding = '0px 15px 0px'
    this.ele.querySelector('.w-innerHTML').style.padding = '10px 0px'

    this.slide.updateSlide(this.mainOpts)
  }

  _createMainSlide () {
    const div = document.createElement('div')
    div.innerHTML = `
      <style>
        .css-reference-widget--sec-link {
          display: inline-block;
          color: var(--netizen-meta);
          font-size: 24px;
          margin: 8px;
          transition: color .5s ease, border .5s ease;
          border-bottom: 2px solid var(--netizen-meta);
          text-shadow: -2px 2px var(--bg-color), 0px 2px var(--bg-color), -1px 2px var(--bg-color), 1px 1px var(--bg-color);
        }

        .css-reference-widget--sec-link:hover {
          color: var(--netizen-match-color);
          border-bottom: 2px solid var(--netizen-match-color);
          cursor: pointer;
        }
      </style>
      <p>
        Cascading Style Sheets, or CSS, was a language introduced to the Web in the mid 90s for the purpose of separating a webpage's "form" or "presentation" from it's "structure" or "content". Initially it handled things like layout, color changes and typography, but today in the era of CSS3, it has evolved to become a much more expressive language capable of creating interactive effects and animations.
      </p>
      <br>
      <!--
      TODO: add high-level HTML notes here
      <br> -->
      <div class="css-reference-widget--sec-link" name="properties" style="color: var(--netizen-property)">
        List of CSS properties
      </div>`

    div.querySelector('.css-reference-widget--sec-link[name="properties"]')
      .addEventListener('click', () => this.slide.updateSlide(this.propsListOpts))

    return div
  }

  _createPropsList () {
    const list = []
    Object.keys(NNE.edu.css.properties)
      .filter(name => name[0] !== '-')
      .sort()
      .forEach(name => {
        const item = { name }
        item.html = `<span style="color:var(--netizen-property);">${name}</span>`
        item.click = () => this._createPropSlide(name)
        list.push(item)
      })
    return list
  }

  _createPropSlide (name) {
    const div = document.createElement('div')
    const nfo = NNE.edu.css.properties[name]

    const style = document.createElement('style')
    style.innerHTML = `
      .css-reference-widget--prop-link {
        color: var(--netizen-attribute);
        cursor: pointer;
        display: inline-block;
        margin: 0px 5px;
        border-bottom: 1px solid var(--netizen-property);
      }

      .css-reference-widget--prop-link {
        color: var(--netizen-property);
        border-bottom: 1px solid var(--netizen-tag);
      }
    `
    div.appendChild(style)

    const h1 = document.createElement('h1')
    h1.innerHTML = nfo.keyword.html
    h1.querySelector('a').style.color = 'var(--netizen-property)'
    div.appendChild(h1)

    const description = document.createElement('p')
    description.innerHTML = ''
    if (typeof nfo.status !== 'undefined' && nfo.status !== 'standard') {
      description.innerHTML += `Be warned! this property is <b>${nfo.status}</b> so it may not work on all browsers. `
    }
    description.innerHTML += nfo.description.html
    if (description.innerHTML[description.innerHTML.length - 1] !== '.') {
      description.innerHTML += '.'
    }
    if (nfo.default === 'variesFromBrowserToBrowser') {
      description.innerHTML += ' When this property isn\'t explicitly declared the default value varies, depending on the context.'
    } else if (nfo.default) {
      description.innerHTML += ` When this property is not explicitly decalred, the default value is <b>${nfo.default}</b>.`
    }
    div.appendChild(description)
    div.appendChild(document.createElement('br'))

    const extras = this.data[name]
    if (extras && extras.example) {
      const ce = document.createElement('code-example')
      div.appendChild(ce)
      setTimeout(() => {
        ce.updateExample(extras.example, 'css')
      }, utils.getVal('--menu-fades-time') + 100)
    } else {
      div.appendChild(document.createElement('br'))
    }

    const d = document.createElement('div')
    d.innerHTML = 'Learn more about it at'
    let i = 0
    for (const key in nfo.urls) {
      const url = nfo.urls[key]
      if (i === 1) d.innerHTML += ','
      else if (i === 2) d.innerHTML += ' and'
      if (key === 'mdn') {
        d.innerHTML += ` the <a href="${url}" target="_blank">Mozilla Developer Network</a>`
      } else if (key === 'css-tricks') {
        d.innerHTML += ` <a href="${url}" target="_blank">CSS-Tricks</a>`
      } else if (key === 'w3schools') {
        d.innerHTML += ` <a href="${url}" target="_blank">w3schools</a>`
      }
      i++
    }
    div.appendChild(d)

    this.slide.updateSlide({
      name: `css-reference-properties-${name}`,
      widget: this,
      back: this.propsListOpts,
      ele: div
    })
  }
}

window.CSSReference = CSSReference
