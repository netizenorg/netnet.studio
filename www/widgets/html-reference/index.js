/* global Widget, Convo, NNE, NNW, utils */
class HtmlReference extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'html-reference'
    this.listed = true
    this.keywords = ['html', 'elements', 'attributes', 'reference']
    this.resizable = false

    this.title = 'HTML Reference'

    this.on('close', () => { this.slide.updateSlide(this.mainOpts) })

    utils.get('./widgets/html-reference/data/edu-supplement.json', (json) => { this.data = json })

    utils.get('./widgets/html-reference/data/main-slide.html', (html) => {
      // options objects for <widget-slide> .updateSlide() method
      this.mainOpts = {
        name: 'html-reference-main',
        widget: this,
        ele: this._createMainSlide(html)
      }

      this.eleListOpts = {
        name: 'html-reference-elements',
        widget: this,
        back: this.mainOpts,
        list: this._createList('elements')
      }

      this.attrListOpts = {
        name: 'html-reference-attributes',
        widget: this,
        back: this.mainOpts,
        list: this._createList('attributes')
      }

      this._createHTML()

      NNW.on('theme-change', () => { this._createHTML() })
    }, true)
  }

  goTo (type, name) {
    if (!this.opened) this.open()
    // ex: goTo('attributes', 'src')
    if (!name) {
      if (type === 'attributes') {
        this.slide.updateSlide(this.attrListOpts)
      } else if (type === 'elements') {
        this.slide.updateSlide(this.eleListOpts)
      }
    } else {
      const nfo = NNE.edu.html[type][name]
      this._createInfoSlide(type, name, nfo)
    }
  }

  textBubble (eve) {
    if (!eve) return
    else if (eve.type === 'tag bracket') {
      const content = this.data['tag bracket'].bubble
      const options = { ok: (e) => { NNE.spotlight(null); e.hide() } }
      window.convo = new Convo({ content, options }, null, true)
      return
    } else if (!eve.nfo) return

    const more = () => {
      if (eve.type === 'element' || eve.type === 'attribute') {
        this._createInfoSlide(eve.type + 's', eve.data, eve.nfo)
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

    const options = {
      'tell me more': () => more(),
      ok: (e) => { NNE.spotlight(null); e.hide() }
    }

    const extras = this.data[eve.type] ? this.data[eve.type][eve.data] : null
    let content = (extras && extras.bubble)
      ? `<p>${extras.bubble}</p>`
      : `<p>${eve.nfo.description.html}</p>`
    if (eve.type === 'comment') content = this.data.comment.bubble

    this._createInfoSlide(eve.type + 's', eve.data, eve.nfo)

    window.convo = new Convo({ content, options }, null, true)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML () {
    if (!utils.customElementReady('widget-slide')) {
      setTimeout(() => this._createHTML(), 100)
      return
    }

    this.slide = document.createElement('widget-slide')
    this.innerHTML = this.slide

    this.ele.style.padding = '8px 5px 10px'
    this.ele.querySelector('.w-top-bar').style.padding = '0px 15px 0px'
    this.ele.querySelector('.w-innerHTML').style.padding = '10px 0px'

    this.slide.updateSlide(this.mainOpts)
  }

  _createMainSlide (html) {
    const div = document.createElement('div')
    div.innerHTML = html

    div.querySelector('.html-reference-widget--sec-link[name="elements"]')
      .addEventListener('click', () => this.slide.updateSlide(this.eleListOpts))

    div.querySelector('.html-reference-widget--sec-link[name="attributes"]')
      .addEventListener('click', () => this.slide.updateSlide(this.attrListOpts))

    return div
  }

  _createList (type) {
    const list = []
    Object.keys(NNE.edu.html[type]).sort().forEach(name => {
      const item = { name }
      if (type === 'elements') {
        item.html = `<span style="color:var(--netizen-tag-bracket);">&lt;</span><span style="color:var(--netizen-tag);">${name}</span><span style="color:var(--netizen-tag-bracket);">&gt;</span>`
      } else if (type === 'attributes') {
        item.html = `<span style="color:var(--netizen-attribute);">${name}</span>`
      }
      item.click = () => {
        const nfo = NNE.edu.html[type][name]
        this._createInfoSlide(type, name, nfo)
      }
      list.push(item)
    })
    return list
  }

  _createInfoSlide (type, name, nfo) {
    const div = document.createElement('div')
    if (!nfo) nfo = NNE.edu.html[type][name]

    const style = document.createElement('style')
    style.innerHTML = `
      .html-reference-widget--tag-link,
      .html-reference-widget--attr-link {
        color: var(--netizen-attribute);
        cursor: pointer;
        display: inline-block;
        margin: 0px 5px;
        border-bottom: 1px solid var(--netizen-attribute);
      }

      .html-reference-widget--tag-link {
        color: var(--netizen-tag);
        border-bottom: 1px solid var(--netizen-tag);
      }
    `
    div.appendChild(style)

    const h1 = document.createElement('h1')
    if (type === 'elements') {
      h1.innerHTML = nfo.singleton
        ? nfo.keyword.html
        : `<a href="${nfo.url}" target="_blank">&lt;${name}&gt;&lt;/${name}&gt;`
    } else {
      h1.innerHTML = nfo.keyword.html
      h1.querySelector('a').style.color = 'var(--netizen-attribute)'
    }
    div.appendChild(h1)

    if (typeof nfo.status !== 'undefined' && nfo.status !== 'standard') {
      const d = document.createElement('div')
      d.innerHTML = `Be warned! this element is <b>${nfo.status}</b> so it may not work on all browsers`
      div.appendChild(d)
    }

    const description = document.createElement('p')
    const hasEle = this.data.element[name] && this.data.element[name].bubble
    const hasAtr = this.data.attribute[name] && this.data.attribute[name].bubble
    if (type === 'elements' && hasEle) {
      description.innerHTML = this.data.element[name].bubble
    } else if (type === 'attributes' && hasAtr) {
      description.innerHTML = this.data.attribute[name].bubble
    } else {
      description.innerHTML = nfo.description.html
    }
    div.appendChild(description)

    if (type === 'elements') this._createElementDetails(div, name, nfo)
    else if (type === 'attributes') this._createAttributeDetails(div, name, nfo)

    this.slide.updateSlide({
      name: `html-reference-${type}-${name}`,
      widget: this,
      back: type === 'elements' ? this.eleListOpts : this.attrListOpts,
      ele: div
    })
  }

  _createElementDetails (slide, name, nfo) {
    const extras = this.data.element[name]
    if (extras && extras.example) {
      const ce = document.createElement('code-sample')
      slide.appendChild(ce)
      setTimeout(() => {
        ce.updateExample(extras.example, 'html')
      }, utils.getVal('--menu-fades-time') + 100)
    } else {
      slide.appendChild(document.createElement('br'))
    }
    if (nfo.flow || nfo.singleton) {
      const d = document.createElement('div')
      d.innerHTML = ''
      if (nfo.flow === 'inline') {
        d.innerHTML += `The <b>${name}</b> element is an <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements" target="_blank">inline</a> element.`
      } else if (nfo.flow === 'block') {
        d.innerHTML += `The <b>${name}</b> element is a <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements" target="_blank">block</a> element.`
      }
      if (nfo.singleton) {
        d.innerHTML += `${nfo.flow ? ' ' : ''}The <b>${name}</b> element is${nfo.flow ? ' also' : ''} a "<a href="https://www.thoughtco.com/html-singleton-tags-3468620" target="_blank">void element</a>" (aka "<a href="https://www.thoughtco.com/html-singleton-tags-3468620" target="_blank">singleton tag</a>"), which means it consists ony of an opening tag, it does not require a closing tag.`
      }
      slide.appendChild(d)
      slide.appendChild(document.createElement('br'))
    }
    if (nfo.attributes) {
      const d = document.createElement('div')
      d.innerHTML = `The following attributes can be applied to the opening <code>&lt;${name}&gt;</code> tag:`
      nfo.attributes.forEach(attr => {
        const span = document.createElement('span')
        span.className = 'html-reference-widget--attr-link'
        span.textContent = attr
        span.addEventListener('click', () => this._createInfoSlide('attributes', attr))
        d.appendChild(span)
      })
      slide.appendChild(d)
    }
    if (nfo.url) {
      slide.appendChild(document.createElement('br'))
      const d = document.createElement('div')
      d.innerHTML = `Learn more about it at the <a href="${nfo.url}" target="_blank">Mozilla Developer Network</a> page.`
      slide.appendChild(d)
    }
  }

  _createAttributeDetails (slide, name, nfo) {
    const extras = this.data.attribute[name]
    if (extras && extras.example) {
      const ce = document.createElement('code-sample')
      slide.appendChild(ce)
      setTimeout(() => {
        ce.updateExample(extras.example, 'html')
      }, utils.getVal('--menu-fades-time') + 100)
    }
    if (nfo.note) {
      const d = document.createElement('div')
      d.innerHTML = `<b>NOTE:</b> ${nfo.note}`
      slide.appendChild(d)
      slide.appendChild(document.createElement('br'))
    }
    if (nfo.elements) {
      const d = document.createElement('div')
      if (nfo.elements.text === 'Global attribute') {
        d.innerHTML = `<b>${name}</b> is a global attribute, it can be applied to any element`
      } else {
        d.innerHTML = `The <b>${name}</b> attribute can be applied to the following elements:`
        nfo.elements.text.split(',').forEach(ele => {
          const span = document.createElement('span')
          span.className = 'html-reference-widget--tag-link'
          span.textContent = ele
          const n = ele.substring(ele.indexOf('<') + 1, ele.indexOf('>'))
          span.addEventListener('click', () => this._createInfoSlide('elements', n))
          d.appendChild(span)
        })
      }
      slide.appendChild(d)
    }
    if (nfo.url || nfo.urls) {
      slide.appendChild(document.createElement('br'))
      const d = document.createElement('div')
      if (nfo.urls) {
        const dict = {}
        nfo.urls.forEach(url => {
          if (url.includes('mozilla')) dict.mdn = url
          else if (url.includes('w3s')) dict.w3s = url
        })
        d.innerHTML = `Learn more about it at the <a href="${dict.mdn}" target="_blank">Mozilla Developer Network</a> and at <a href="${dict.w3s}" target="_blank">w3schools</a>`
      } else if (nfo.url) {
        d.innerHTML = `<a href="${nfo.url}" target="_blank">Want to learn more about it?</a>`
      }
      slide.appendChild(d)
    }
  }
}

window.HtmlReference = HtmlReference
