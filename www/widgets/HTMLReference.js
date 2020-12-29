/* global Widget, Convo, NNE, NNW, utils */
class HTMLReference extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'html-reference'
    this.listed = true
    this.keywords = ['html', 'elements', 'attributes', 'reference']

    utils.get('./data/html-reference.json', (json) => { this.data = json })

    NNW.on('theme-change', () => { this._createHTML() })

    this.title = 'HTML Reference'

    // options objects for <widget-slide> .updateSlide() method
    this.mainOpts = {
      name: 'html-reference-main',
      widget: this,
      ele: this._createMainSlide()
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
  }

  textBubble (eve) {
    if (!eve) return
    else if (eve.type === 'tag bracket') {
      const content = this.data['tag bracket'].bubble
      const options = { ok: (e) => { e.hide() } }
      window.convo = new Convo({ content, options })
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
      ok: (e) => { e.hide() }
    }

    const extras = this.data[eve.data]
    let content = (extras && extras.bubble)
      ? `<p>${this.data[eve.data].bubble}</p>`
      : `<p>${eve.nfo.description.html}</p>`
    if (eve.type === 'comment') content = this.data[eve.type].bubble

    this._createInfoSlide(eve.type + 's', eve.data, eve.nfo)

    window.convo = new Convo({ content, options })
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
    this.slide.updateSlide(this.mainOpts)
  }

  _createMainSlide () {
    const div = document.createElement('div')
    div.innerHTML = `
      <style>
        .html-reference-widget--sec-link {
          display: inline-block;
          color: var(--netizen-meta);
          font-size: 24px;
          margin: 8px;
          transition: color .5s ease, border .5s ease;
          border-bottom: 2px solid var(--netizen-meta);
          text-shadow: -2px 2px var(--bg-color), 0px 2px var(--bg-color), -1px 2px var(--bg-color), 1px 1px var(--bg-color);
        }

        .html-reference-widget--sec-link:hover {
          color: var(--netizen-match-color);
          border-bottom: 2px solid var(--netizen-match-color);
          cursor: pointer;
        }
      </style>
      <p>
        The Web is a creative medium and core to the craft are three coding languages, HTML, CSS and JavaScript. The most fundamental of these is HTML, or Hypertext Markup Language. HTML is used to create the structure of a Web project.
      </p>
      <br>
      <!--
      TODO: add high-level HTML notes here
      <br> -->
      <div class="html-reference-widget--sec-link" name="elements" style="color: var(--netizen-tag)">
        List of HTML elements
      </div>
      <br>
      <div class="html-reference-widget--sec-link" name="attributes" style="color: var(--netizen-attribute)">
        List of HTML attributes
      </div>`

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

    if (nfo.status !== 'standard') {
      const d = document.createElement('div')
      d.innerHTML = `Be warned! this element is <b>${nfo.status}</b> so it may not work on all browsers`
      div.appendChild(d)
    }

    const description = document.createElement('p')
    description.innerHTML = nfo.description.html
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
    const extras = this.data[name]
    if (extras && extras.example) {
      const ce = document.createElement('code-example')
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
        d.innerHTML += `${nfo.flow ? ' ' : ''}The <b>${name}</b> element is${nfo.flow ? ' also' : ''} a "void element" (aka "singleton tag"), which means it consists ony of an opening tag, it does not require a closing tag.`
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
    const extras = this.data[name]
    if (extras && extras.example) {
      const ce = document.createElement('code-example')
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

window.HTMLReference = HTMLReference
