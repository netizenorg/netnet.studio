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

  _fadeInSlide (sel, display) {
    const ele = typeof sel === 'string' ? this.$(sel) : sel
    ele.style.display = display || 'block'
    setTimeout(() => { ele.style.opacity = 1 }, 10)
    if (this.ele.offsetTop + this.ele.offsetHeight > window.innerHeight - 10) {
      this.update({ bottom: 10 }, 500)
    }
  }

  _fadeOutSlide (sel, callback) {
    const ele = typeof sel === 'string' ? this.$(sel) : sel
    ele.style.opacity = 0
    setTimeout(() => {
      ele.style.display = 'none'
      if (callback) callback()
    }, utils.getVal('--menu-fades-time'))
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _createHTML () {
    this.innerHTML = ''
    utils.loadStyleSheet(this.key)

    const div = document.createElement('div')
    div.className = 'html-reference-widget'
    this.innerHTML = div

    this._createMainSlide()
    this._createListSlide('elements')
    this._createListSlide('attributes')
  }

  _createMainSlide () {
    const slide = document.createElement('div')
    slide.className = 'html-reference-widget--slide'
    slide.setAttribute('name', 'main')
    slide.style.display = 'block'
    slide.style.opacity = 1
    slide.innerHTML = `
      <p>
        The Web is a creative medium and core to the craft are three coding languages, HTML, CSS and JavaScript. The most fundamental of these is HTML, or Hypertext Markup Language. HTML is used to create the structure of a Web project.
      </p>
      <br>
      <!-- <div class="html-reference-widget--sec-link" name="intro">
        TODO: add links to intro HTML tutorials when tutorials are ready
      </div>
      <br> -->
      <div class="html-reference-widget--sec-link" name="elements" style="color: var(--netizen-tag)">
        List of HTML elements
      </div>
      <br>
      <div class="html-reference-widget--sec-link" name="attributes" style="color: var(--netizen-attribute)">
        List of HTML attributes
      </div>`

    this.$('.html-reference-widget').appendChild(slide)

    const displayList = (type) => {
      this._fadeOutSlide('.html-reference-widget--slide[name="main"]', () => {
        this._fadeInSlide(`.html-reference-widget--slide[name="${type}"]`, 'grid')
      })
    }

    this.$('.html-reference-widget--sec-link[name="elements"]')
      .addEventListener('click', () => displayList('elements'))

    this.$('.html-reference-widget--sec-link[name="attributes"]')
      .addEventListener('click', () => displayList('attributes'))
  }

  _createNav (parent, obj) {
    const n = document.createElement('div')
    n.className = 'html-reference-widget--nav'
    for (const t in obj) {
      const b = document.createElement('span')
      b.textContent = t === 'back' ? '❮ BACK' : 'NEXT ❯'
      b.addEventListener('click', () => obj[t]())
      n.appendChild(b)
    }
    parent.appendChild(n)
  }

  _createListSlide (type) {
    const headings = []
    const slide = document.createElement('div')
    slide.className = 'html-reference-widget--slide'
    slide.setAttribute('name', type)

    this._createNav(slide, {
      back: () => {
        this._fadeOutSlide(slide, () => {
          this._fadeInSlide('.html-reference-widget--slide[name="main"]')
        })
      }
    })

    // create content items (links && headings)
    const newHeading = (letter) => {
      const l = document.createElement('div')
      l.className = 'html-reference-widget--list-heading'
      l.textContent = letter
      headings.push(letter)
      slide.appendChild(l)
    }

    const newItem = (name, t) => {
      const item = document.createElement('div')
      item.className = 'html-reference-widget--list-item'
      if (t === 'elements') {
        item.innerHTML = `<span style="color:var(--netizen-tag-bracket);">&lt;</span><span style="color:var(--netizen-tag);">${name}</span><span style="color:var(--netizen-tag-bracket);">&gt;</span>`
      } else if (t === 'attributes') {
        item.innerHTML = `<span style="color:var(--netizen-attribute);">${name}</span>`
      }

      const nfo = NNE.edu.html[t][name]
      item.addEventListener('click', () => this._createInfoSlide(t, name, nfo))
      slide.appendChild(item)
    }

    Object.keys(NNE.edu.html[type]).sort().forEach(name => {
      if (!headings.includes(name[0])) newHeading(name[0])
      newItem(name, type)
    })

    // place content items into 3 columns
    const sel = '.html-reference-widget--list-item, .html-reference-widget--list-heading'
    const items = [...slide.querySelectorAll(sel)]
    const max = Math.ceil(Object.keys(NNE.edu.html[type]).length / 3)
    for (let i = items.length - 1; i >= 0; i--) slide.querySelectorAll(sel)[i].remove()
    for (let i = 0; i < 3; i++) {
      const col = document.createElement('div')
      const rows = items.slice(i * max, (i + 1) * max)
      rows.forEach(item => col.appendChild(item))
      slide.appendChild(col)
    }
    this.$('.html-reference-widget').appendChild(slide)
  }

  _createInfoSlide (type, name, nfo) {
    const info = this.$('.html-reference-widget--slide[name="info"]')
    if (info) info.remove()
    if (!nfo) nfo = NNE.edu.html[type][name]

    const slide = document.createElement('div')
    slide.className = 'html-reference-widget--slide'
    slide.setAttribute('name', 'info')

    this._createNav(slide, {
      back: () => {
        this._fadeOutSlide(slide, () => {
          slide.remove()
          this._fadeInSlide(`.html-reference-widget--slide[name="${type}"]`, 'grid')
        })
      }
    })

    const h1 = document.createElement('h1')
    if (type === 'elements') {
      h1.innerHTML = nfo.singleton
        ? nfo.keyword.html
        : `<a href="${nfo.url}" target="_blank">&lt;${name}&gt;&lt;/${name}&gt;`
    } else {
      h1.innerHTML = nfo.keyword.html
      h1.querySelector('a').style.color = 'var(--netizen-attribute)'
    }

    slide.appendChild(h1)

    if (nfo.status !== 'standard') {
      const d = document.createElement('div')
      d.innerHTML = `Be warned! this element is <b>${nfo.status}</b> so it may not work on all browsers`
      slide.appendChild(d)
    }

    const description = document.createElement('p')
    description.innerHTML = nfo.description.html
    slide.appendChild(description)

    if (type === 'elements') this._createElementDetails(slide, name, nfo)
    else if (type === 'attributes') this._createAttributeDetails(slide, name, nfo)

    this.$('.html-reference-widget').appendChild(slide)

    const main = '.html-reference-widget--slide[name="main"]'
    const eleb4 = '.html-reference-widget--slide[name="elements"]'
    const attrb4 = '.html-reference-widget--slide[name="attributes"]'
    const fout = this.$(eleb4).style.opacity === '1'
      ? eleb4 : this.$(attrb4).style.opacity === '1' ? attrb4 : main
    this._fadeOutSlide(fout, () => {
      const ex = this.$('code-example')
      if (ex) ex.updateExample(this.data[name].example, 'html')
      this._fadeInSlide(slide)
    })
  }

  _createElementDetails (slide, name, nfo) {
    const extras = this.data[name]
    if (extras && extras.example) {
      const ce = document.createElement('code-example')
      slide.appendChild(ce)
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
