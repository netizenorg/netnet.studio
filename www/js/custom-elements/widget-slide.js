/* global HTMLElement, utils */
class WidgetSlide extends HTMLElement {
  updateSlide (opts) {
    /*
      updateSlide({
        name: 'new-slide',    // a unique name for this slide
        widget: wigInstance,  // the instance of the parent Widget
        back: prevOptsObject, // the options object of the slide to "return" to
        ele: htmlElement,     // an html element w/the slide's content
        // ...or, a list of objects to create an index page from
        list: [
          { name: 'string', click: func, html: 'optional-html-string' },
          { name: 'string', click: func, html: 'optional-html-string' }
        ]
      })
    */
    this._widget = opts.widget
    this.className = 'reference-widget'

    if (opts.list) {
      if (this._currentSlide) {
        this._previousSlide = this._currentSlide
        this._fadeOutSlide(this._previousSlide, () => {
          this._createList(opts)
          this._fadeInSlide(this._currentSlide, 'grid')
        })
      } else {
        this._createList(opts)
        this._fadeInSlide(this._currentSlide, 'grid')
      }
    } else {
      if (this._currentSlide) {
        this._previousSlide = this._currentSlide
        this._fadeOutSlide(this._previousSlide, () => {
          this._createSlide(opts)
          this._fadeInSlide(this._currentSlide)
        })
      } else {
        this._createSlide(opts)
        this._fadeInSlide(this._currentSlide)
      }
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸ PRIVATE METHODS
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸

  _fadeInSlide (sel, display) {
    const ele = typeof sel === 'string' ? this.querySelector(sel) : sel
    ele.style.display = display || 'block'
    setTimeout(() => { ele.style.opacity = 1 }, 10)
    const o = this._widget.ele.offsetTop + this._widget.ele.offsetHeight
    if (o > window.innerHeight - 10) {
      this._widget.update({ bottom: 10 }, 500)
    }
  }

  _fadeOutSlide (sel, callback) {
    const ele = typeof sel === 'string' ? this.querySelector(sel) : sel
    ele.style.opacity = 0
    setTimeout(() => {
      ele.style.display = 'none'
      ele.remove()
      if (callback) callback()
    }, utils.getVal('--menu-fades-time'))
  }

  _createNav (parent, backOpts) {
    const n = document.createElement('div')
    n.className = 'reference-widget--nav'
    const b = document.createElement('span')
    b.textContent = '❮ BACK'
    b.addEventListener('click', () => this.updateSlide(backOpts))
    n.appendChild(b)
    parent.appendChild(n)
  }

  _createSlide (opts) {
    this.innerHTML = ''
    this._currentSlide = `.reference-widget--slide[name="${opts.name}"]`

    const slide = document.createElement('div')
    slide.className = 'reference-widget--slide'
    slide.setAttribute('name', opts.name)

    if (opts.back) this._createNav(slide, opts.back)

    slide.appendChild(opts.ele)
    this.appendChild(slide)
  }

  _createList (opts) {
    this.innerHTML = ''
    this._currentSlide = `.reference-widget--slide[name="${opts.name}"]`

    const headings = []
    const slide = document.createElement('div')
    slide.className = 'reference-widget--slide'
    slide.setAttribute('name', opts.name)

    if (opts.back) this._createNav(slide, opts.back)

    // create content items (links && headings)
    const newHeading = (letter) => {
      const l = document.createElement('div')
      l.className = 'reference-widget--list-heading'
      l.textContent = letter
      headings.push(letter)
      slide.appendChild(l)
    }

    const newItem = (i) => {
      const item = document.createElement('div')
      item.className = 'reference-widget--list-item'
      if (i.html) item.innerHTML = i.html
      else item.innerHTML = `<span style="color:var(--netizen-tag-bracket);">${i.name}</span>`
      if (i.click) item.addEventListener('click', () => i.click())
      slide.appendChild(item)
    }

    opts.list.forEach(item => {
      if (!headings.includes(item.name[0])) newHeading(item.name[0])
      newItem(item)
    })

    // place content items into 3 columns
    const sel = '.reference-widget--list-item, .reference-widget--list-heading'
    const items = [...slide.querySelectorAll(sel)]
    const max = Math.ceil(opts.list.length / 3)
    for (let i = items.length - 1; i >= 0; i--) slide.querySelectorAll(sel)[i].remove()
    for (let i = 0; i < 3; i++) {
      const col = document.createElement('div')
      const rows = items.slice(i * max, (i + 1) * max)
      rows.forEach(item => col.appendChild(item))
      slide.appendChild(col)
    }

    this.appendChild(slide)
  }
}

window.customElements.define('widget-slide', WidgetSlide)
