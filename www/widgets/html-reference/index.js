/* global Widget Convo NNE NNW utils nn WIDGETS */
class HtmlReference extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'html-reference'
    this.listed = true
    this.keywords = ['html', 'elements', 'attributes', 'reference']
    this.resizable = false

    this.width = 638
    this.height = 483

    this.title = 'HTML Reference Docs'

    this.on('close', () => { this.slide.updateSlide(this.mainOpts) })

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

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

  openDocs (opt, entry) {
    let type
    if (opt === 'eleListOpts') {
      type = 'elements'
    } else if (opt === 'attrListOpts') {
      type = 'attributes'
    }
    this.goTo(type, entry)
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
    else if (!eve.nfo) return

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

    const eduSup = this.data[eve.type] ? this.data[eve.type][eve.data] : null
    const content = (eduSup && eduSup.bubble)
      ? `<p>${eduSup.bubble}</p>`
      : (eduSup && eduSup.extra)
        ? `<p>${eve.nfo.description.html}${eduSup.extra}</p>`
        : `<p>${eve.nfo.description.html}</p>`

    this._createInfoSlide(eve.type + 's', eve.data, eve.nfo)

    window.convo = new Convo({ content, options }, null, true)
  }

  inPresentation () {
    return this.slide.style.overflowY === 'hidden'
  }

  toggleIntroPresentation () {
    if (WIDGETS['hyper-video-player']?.opened) {
      WIDGETS['hyper-video-player'].close()
    }

    const isStarterCode = NNE.code === utils.starterCode()
    if (isStarterCode) return this._toggleIntroPresentation()

    if (WIDGETS['project-files']?.projectData.name) {
      window.convo = new Convo(this.convos, 'confirm-start')
      return
    }

    const workingOnDemoOrTemplate = typeof utils.url.demo === 'string' ||
      typeof utils.url.template === 'string'
    if (workingOnDemoOrTemplate) {
      window.convo = new Convo(this.convos, 'confirm-start')
      return
    }

    this._toggleIntroPresentation()
  }

  togglePresentationConvo () {
    const id = window.convo?.id
    if (!id || id === '0' || !this.convos.map(c => c.id).includes(id)) {
      window.convo = new Convo(this.convos, this._lastConvo)
    } else {
      this._lastConvo = window.convo.id
      window.convo.hide(); window.convo = null
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  async _toggleIntroPresentation () {
    const div = this.slide.querySelector('div')
    const ntro = div.querySelector('.html-reference-widget--guided-intro')
    const btn = div.querySelector('.html-reference-widget--intro-btn')
    const p = div.querySelector('.html-reference-widget--intro-p')
    const svg = div.querySelector('svg-tag-presentation')

    if (this.inPresentation()) { // displaying presentation
      //                             (toggle into regular HTML Reference page)
      NNE.code = utils.starterCode()
      NNE.update()
      if (typeof this._prevUpdateState === 'boolean') {
        WIDGETS['coding-menu'].autoUpdate(this._prevUpdateState)
      }
      svg.clearTimers()
      window.convo.hide()
      ntro.style.opacity = 0
      await nn.sleep(1000)
      ntro.style.display = 'none'
      btn.style.display = 'block'
      p.style.display = 'block'
      svg.updateHTML(0)
      this.update({ height: 483 }, 500)
      this._prevSize.height = 483
      this.slide.style.overflowY = 'auto'
      await nn.sleep(100)
      ntro.style.height = '0px'
      btn.style.opacity = 1
      p.style.opacity = 1
    } else { // displaying ref (toggle into presentation)
      utils.cancelAllNetitorUses('html-reference')
      this.slide.style.overflowY = 'hidden'
      svg.style.cursor = 'pointer'
      btn.style.opacity = 0
      p.style.opacity = 0
      ntro.style.display = 'flex'
      this.update({ height: 290, bottom: 20, right: 20 }, 500)
      this._prevSize.height = 290
      await nn.sleep(100)
      ntro.style.height = '222px'
      this._prevUpdateState = NNE.autoUpdate
      WIDGETS['coding-menu'].autoUpdate(true)
      window.convo = new Convo(this.convos, 'start-guide')
      await nn.sleep(1000)
      btn.style.display = 'none'
      p.style.display = 'none'
      await nn.sleep(100)
      ntro.style.opacity = 1
    }
  }

  _createHTML () {
    if (!utils.customElementReady('widget-slide')) {
      setTimeout(() => this._createHTML(), 100)
      return
    }

    this.slide = document.createElement('widget-slide')
    this.innerHTML = this.slide

    this.slide.updateSlide(this.mainOpts)
  }

  _createMainSlide (html) {
    const div = document.createElement('div')
    div.innerHTML = html

    div.querySelector('.html-reference-widget--sec-link[name="elements"]')
      .addEventListener('click', () => this.slide.updateSlide(this.eleListOpts))

    div.querySelector('.html-reference-widget--sec-link[name="attributes"]')
      .addEventListener('click', () => this.slide.updateSlide(this.attrListOpts))

    div.querySelector('.html-reference-widget--intro-btn')
      .addEventListener('click', () => this.toggleIntroPresentation())

    div.querySelector('.html-reference-widget--guided-intro span.link')
      .addEventListener('click', () => this.toggleIntroPresentation())

    div.querySelector('svg-tag-presentation')
      .addEventListener('svg-click', e => this.togglePresentationConvo())

    div.querySelector('svg-tag-presentation').addEventListener('svg-update', e => {
      if (window.convo?.id && this.convos.map(c => c.id).includes(window.convo.id)) {
        this._lastConvo = window.convo.id
      }
    })

    return div
  }

  _createList (type) {
    const list = []
    const names = [
      ...new Set([
        ...Object.keys(NNE.edu.html[type]),
        ...Object.keys(NNE.edu.svg[type])
      ])
    ]
    names.sort().forEach(name => {
      const item = { name }
      const isSVG = !Object.keys(NNE.edu.html[type]).includes(name)
      if (type === 'elements') {
        item.html = `<span style="color:var(--netizen-tag-bracket);">&lt;</span><span style="color:var(--netizen-tag);">${name}</span><span style="color:var(--netizen-tag-bracket);">&gt;</span>`
      } else if (type === 'attributes') {
        item.html = `<span style="color:var(--netizen-attribute);">${name}</span>`
      }
      if (isSVG) item.html += '<span class="html-ref__svg-label">SVG</span>'
      item.click = () => {
        const nfo = isSVG ? NNE.edu.svg[type][name] : NNE.edu.html[type][name]
        this._createInfoSlide(type, name, nfo)
      }
      list.push(item)
    })
    return list
  }

  _createInfoSlide (type, name, nfo) {
    const div = document.createElement('div')
    if (!nfo) nfo = NNE.edu.html[type][name]
    if (!nfo) nfo = NNE.edu.svg[type][name]
    if (!nfo) return

    const h1 = document.createElement('h1')
    h1.classList.add('hdr-highlight')
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
    const hasEle = this.data.element[name]
    const hasAtr = this.data.attribute[name]
    if (type === 'elements' && hasEle) {
      if (this.data.element[name].bubble) {
        description.innerHTML = this.data.element[name].bubble
      } else if (this.data.element[name].extra) {
        description.innerHTML = nfo.description.html + this.data.element[name].extra
      } else {
        description.innerHTML = nfo.description.html
      }
    } else if (type === 'attributes' && hasAtr) {
      if (this.data.attribute[name].bubble) {
        description.innerHTML = this.data.attribute[name].bubble
      } else if (this.data.attribute[name].extra) {
        description.innerHTML = nfo.description.html + this.data.attribute[name].extra
      } else {
        description.innerHTML = nfo.description.html
      }
    } else {
      description.innerHTML = nfo.description.html
    }
    div.appendChild(description)

    // if it's an SVG element
    if (type === 'elements' && !Object.keys(NNE.edu.html.elements).includes(name)) {
      nn.create('br').addTo(div)
      const m = 'This is an <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Getting_started" target="_blank">SVG element</a> so it must be placed within <code>&lt;svg&gt;</code> tags.'
      nn.create('div').content(m).addTo(div)
    }

    if (type === 'elements') this._createElementDetails(div, name, nfo)
    else if (type === 'attributes') this._createAttributeDetails(div, name, nfo)

    if (type === 'elements' || type === 'attributes') {
      this.slide.updateSlide({
        name: `html-reference-${type}-${name}`,
        widget: this,
        back: type === 'elements' ? this.eleListOpts : this.attrListOpts,
        ele: div
      })
    }
  }

  _createElementDetails (slide, name, nfo) {
    const eduSup = this.data.element[name]
    if (eduSup && eduSup.example) {
      const ce = document.createElement('code-sample')
      slide.appendChild(ce)
      setTimeout(() => {
        ce.updateExample(eduSup.example, 'html')
      }, utils.getVal('--menu-fades-time') + 100)
    } else {
      slide.appendChild(document.createElement('br'))
    }
    if (nfo.flow || nfo.singleton) {
      const d = document.createElement('div')
      d.innerHTML = ''
      // NOTE: don't think differentiating between inline/block is all that helpful here after all.
      // ...but will leave it here in case we change our mind.
      // if (nfo.flow === 'inline') {
      //   d.innerHTML += `The <b>${name}</b> element is an <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements" target="_blank">inline</a> element.`
      // } else if (nfo.flow === 'block') {
      //   d.innerHTML += `The <b>${name}</b> element is a <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements" target="_blank">block</a> element.`
      // }
      if (nfo.singleton) {
        d.innerHTML += `${nfo.flow ? ' ' : ''}The <b>${name}</b> element is${nfo.flow ? ' also' : ''} a "<a href="https://www.thoughtco.com/html-singleton-tags-3468620" target="_blank">void element</a>" (aka "<a href="https://www.thoughtco.com/html-singleton-tags-3468620" target="_blank">singleton tag</a>"), which means it consists ony of an opening tag, it does not require a closing tag.`
      }

      if (d.innerHTML !== '') {
        slide.appendChild(d)
        slide.appendChild(document.createElement('br'))
      }
    }
    if (nfo.attributes) {
      const d = document.createElement('div')

      const displayTxtWithAttrs = () => {
        d.innerHTML = `The following attributes can be applied to the opening <code>&lt;${name}&gt;</code> tag:`
        nfo.attributes.forEach(attr => {
          const span = document.createElement('span')
          span.className = 'inline-link inline-link--attr'
          span.textContent = attr
          span.addEventListener('click', () => this._createInfoSlide('attributes', attr))
          d.appendChild(span)
        })
      }

      if (nfo.attributes.length > 5) {
        d.innerHTML = `This element can have ${nfo.attributes.length} different attributes applied to it's opening tag. `
        nn.create('span')
          .set('class', 'link').content('<span class="link">list attributes?')
          .on('click', displayTxtWithAttrs).addTo(d)
      } else displayTxtWithAttrs()

      slide.appendChild(d)
      slide.appendChild(document.createElement('br'))
    }
    if (nfo.url) {
      const d = document.createElement('div')
      d.innerHTML = `Learn more about it at the <a href="${nfo.url}" target="_blank">Mozilla Developer Network</a> page.`
      slide.appendChild(d)
    }
  }

  _createAttributeDetails (slide, name, nfo) {
    const eduSup = this.data.attribute[name]
    if (eduSup && eduSup.example) {
      const ce = document.createElement('code-sample')
      slide.appendChild(ce)
      setTimeout(() => {
        ce.updateExample(eduSup.example, 'html')
      }, utils.getVal('--menu-fades-time') + 100)
    }
    if (nfo.note) {
      const d = document.createElement('div')
      d.innerHTML = `<b>NOTE:</b> ${nfo.note}`
      slide.appendChild(d)
      slide.appendChild(document.createElement('br'))
    }
    if (nfo.elements) {
      if (!nfo.note) slide.appendChild(document.createElement('br'))

      const d = document.createElement('div')
      if (nfo.elements.text === 'Global attribute') {
        d.innerHTML = `<b>${name}</b> is a global attribute, it can be applied to any element`
      } else {
        d.innerHTML = `The <b>${name}</b> attribute can be applied to the following elements:`
        nfo.elements.text.split(',').forEach(ele => {
          const span = document.createElement('span')
          span.className = 'inline-link mx-5'
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
        d.innerHTML = `Learn more about it at the <a class="inline-link" href="${dict.mdn}" target="_blank">Mozilla Developer Network</a> and at <a href="${dict.w3s}" target="_blank">w3schools</a>`
      } else if (nfo.url) {
        d.innerHTML = `<a class="inline-link" href="${nfo.url}" target="_blank">Want to learn more about it?</a>`
      }
      slide.appendChild(d)
    }
  }
}

window.HtmlReference = HtmlReference
