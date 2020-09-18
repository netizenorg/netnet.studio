/* global STORE, NNE, WIDGETS, Color */
class NetitorEduInfoHandler {
  static findFormat (s) {
    const i = s.indexOf('.jpg') >= 0 || s.indexOf('.png') >= 0 || s.indexOf('.gif') >= 0
    const o = s.indexOf('.obj') >= 0 || s.indexOf('.gltf') >= 0
    const m = s.indexOf('.mtl') >= 0
    const j = s.indexOf('.js') >= 0
    if (j) return 'JavaScript '
    else if (i) return 'image '
    else if (o) return '3D object '
    else if (m) return '3D object material '
    else return null
  }

  static checkLibs (eve) {
    const libs = {
      'aframe.min.js': '<a href="https://aframe.io/" target="_blank">A-Frame</a>',
      'aframe.js': '<a href="https://aframe.io/" target="_blank">A-Frame</a>'
    }
    let nfo = null
    if (eve.data === 'script' && NNE.getLine(eve.line).includes('src')) {
      const src = NNE.getLine(eve.line).split('src="')[1].split('"')[0]
      const l = src.split('/')[src.split('/').length - 1]
      nfo = `In this case, it's loading a file called <code>${l}</code>`
      if (libs[l]) nfo += `, which is likely the ${libs[l]} library.`
      else nfo += '.'
    } else if (eve.type === 'attribute' && eve.data === 'src') {
      const src = NNE.getLine(eve.line).split('src="')[1].split('"')[0]
      const l = src.split('/')[src.split('/').length - 1]
      const t = this.findFormat(l) || ''
      nfo = `In this case, it's loading a ${t}file called <code>${l}</code>`
      if (libs[l]) nfo += `, which is likely the ${libs[l]} library.`
      else nfo += '.'
    }
    return nfo
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // edu-info

  static htmlEduInfo (eve) {
    const type = (typeof eve.nfo.singleton === 'boolean')
      ? 'element' : 'attribute'
    const snfo = this.checkLibs(eve) || ''
    const note = eve.nfo.note
      ? eve.nfo.note.html
      : (eve.nfo.status && eve.nfo.status !== 'standard' &&
        eve.nfo.status !== 'core')
        ? `This ${type} is ${eve.nfo.status}. ` : ''

    return `
      <h1>${eve.nfo.keyword.html}</h1>
      <p>${eve.nfo.description.html} ${snfo} ${note}</p>
    `
  }

  static cssEduInfo (eve) {
    const status = (eve.nfo.status && eve.nfo.status !== 'standard')
      ? `. (<b>NOTE</b>: this CSS feature is ${eve.nfo.status}). ` : ''

    let links = '' // css properties have multiple reference URLs
    if (eve.nfo.urls) {
      links = Object.keys(eve.nfo.urls)
        .map(k => `<a href="${eve.nfo.urls[k]}" target="_blank">${k}</a>`)
      if (links.length > 0) {
        links = `To learn more visit ${links.join(', ').slice(0, -2)}.`
      }
    }

    return `
      <h1>${eve.nfo.keyword.html}</h1>
      <p>${eve.nfo.description.html} ${status} ${links}</p>
    `
  }

  static jsEduInfo (eve) {
    const status = (eve.nfo.status && eve.nfo.status !== 'standard')
      ? `. (<b>NOTE</b>: this CSS feature is ${eve.nfo.status}). ` : ''

    return `
        <h1>${eve.nfo.keyword.html}</h1>
        <p>${eve.nfo.description.html} ${status}</p>
      `
  }

  static colorEduInfo (eve, c, k) {
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
          ? Color.rgb2hex(c[2], c[3], c[4]) : Color.hsl2hex(c[2], c[3], c[4])
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

    let s = '<h1><a href="https://developer.mozilla.org/en-US/docs/Web/CSS color_value" target="_blank">color</a></h1><p>'

    s += (type === 'keyword') ? `This specific color <code>${val}</code> is defined using a color <a href="${clrURL[type]}" target="_blank">${type}</a>.` : `This specific color <code>${val}</code> is defined using a <a href="${clrURL[type]}" target="_blank">${type}</a> color code.`

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

  static parse (eve) {
    const c = Color.match(eve.data.toLowerCase())
    const k = NNE.edu.css.colors[eve.data]
    // if (c) {
    //   console.log('IN IT', c, '#', NNE.cm.getSelection());
    //   if (c[0] === 'hex' && c[1] !== '#' + NNE.cm.getSelection()) return null
    //   else if (c[1] !== NNE.cm.getSelection()) return null
    // }

    if (!c && !k && !eve.nfo) return null // TODO handle these differently?

    let cnt
    if (c || k) cnt = this.colorEduInfo(eve, c, k)
    else if (eve.language === 'html') cnt = this.htmlEduInfo(eve)
    else if (eve.language === 'css') cnt = this.cssEduInfo(eve)
    else if (eve.language === 'javascript') cnt = this.jsEduInfo(eve)

    const opts = {
      ok: () => { STORE.dispatch('HIDE_EDU_TEXT') }
    }
    // TODO: as we create more widgets this should prolly be re-org
    if (c) {
      opts['open color widget'] = () => {
        WIDGETS['color-widget'].open()
      }
    } else if (eve.type === 'attribute' && NNE._customAttributes) {
      const awig = WIDGETS['aframe-component-widget']
      if (awig && awig.data[eve.data]) {
        opts['open component widget'] = () => awig.open()
      }
    }

    return {
      content: cnt,
      options: opts
    }
  }
}

window.NetitorEduInfoHandler = NetitorEduInfoHandler
