/* global NNW, utils */
class Menu {
  constructor (win) {
    this.face = 'basic'
    this.itemOpts = {
      hi: {
        path: 'images/menu/hi.png',
        click: () => {
          // if (STORE.is('TUTORIAL_LOADED')) {
          //   const url = STORE.state.tutorial.url
          //   if (url === 'tutorials/orientation') {
          //     NNT.goTo('ex-hi-menu')
          //   } else {
          //     STORE.dispatch('TOGGLE_MENU')
          //     window.greetings.startMenu()
          //   }
          // } else {
          //   STORE.dispatch('TOGGLE_MENU')
          //   window.greetings.startMenu()
          // }
        }
      },
      functions: {
        path: 'images/menu/functions.png',
        click: () => {
          // STORE.dispatch('TOGGLE_MENU')
          // WIDGETS['functions-menu'].open()
        }
      },
      search: {
        path: 'images/menu/search.png',
        click: () => {
          // STORE.dispatch('TOGGLE_MENU')
          // if (this.search.opened) this.search.close()
          // else this.search.open()
        }
      },
      guide: {
        path: 'images/menu/tutorials.png',
        click: () => {
          // STORE.dispatch('TOGGLE_MENU')
          // WIDGETS['tutorials-menu'].open()
        }
      }
    }

    this._setupMenu(win) // radial menu of <menu-item> elements
    window.addEventListener('mousemove', (e) => this._moveEyes(e))
    window.addEventListener('DOMContentLoaded', (e) => {
      this._setupFace() // netnet's face
      this._setupTextBubble() // <text-bubble> element
      // TODO: this.search = new SearchBar()
      this.updatePosition()
    })
  }

  get opened () { return this.items.children[0].opened }
  set opened (v) { return console.error('Menu: opened property is read-only') }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸ PUBLIC METHODS
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸

  updatePosition () {
    const center = this.ele.querySelector('#face > span:nth-child(2)')
    if (!center) return
    this.items.style.top = center.offsetTop + 'px'
    this.items.style.left = center.offsetLeft + 'px'
    if (this.textBubble) {
      const win = document.querySelector('#nn-window')
      this.textBubble.style.bottom = win.offsetHeight + 35 + 'px'
      this.textBubble.style.left = win.offsetWidth - 430 - 4 + 'px'
      this.textBubble.updatePosition()
    }
  }

  updateFace (t) {
    if (!window.NNW) return
    this.face = t || 'basic'
    const face = document.querySelectorAll('#face > span')
    face[0].innerHTML = this._eye()
    face[1].innerHTML = this._mouth()
    face[2].innerHTML = this._eye()
  }

  toggleMenu (show) {
    this.updatePosition()
    if (typeof show === 'undefined') show = !this.opened
    const radius = this.items.children.length * 25
    this.items.querySelectorAll('menu-item').forEach(item => {
      if (NNW.layout === 'dock-left') {
        item.toggle(show, radius, 0.5, Math.PI * 1.6)
      } else if (NNW.layout === 'dock-bottom') {
        item.toggle(show, radius, 0.5, Math.PI)
      } else if (NNW.layout === 'separate-window') {
        item.toggle(show, radius * 0.8, 1, Math.PI)
      } else if (NNW.layout === 'full-screen') {
        item.toggle(show, radius * 1.33, 0.32, Math.PI * 1.54)
      } else if (show && NNW.layout === 'welcome') {
        item.toggle(false)
      } else if (!show) {
        item.toggle(false)
      }
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸ PRIVATE METHODS
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸

  _setupMenu (win) {
    this.ele = document.createElement('div')
    this.ele.setAttribute('id', 'nn-menu')
    win.prepend(this.ele)

    this.items = document.createElement('div')
    this.items.id = 'menu-items-parent'
    this.ele.appendChild(this.items)
    this.items.style.position = 'absolute'

    const createMenuItems = () => {
      if (!utils.customElementReady('menu-item')) {
        setTimeout(() => createMenuItems(), 100)
        return
      }
      for (const key in this.itemOpts) {
        const item = document.createElement('menu-item')
        item.setAttribute('title', key)
        item.setAttribute('icon', this.itemOpts[key].path)
        item.addEventListener('click', () => this.itemOpts[key].click())
        this.items.appendChild(item)
      }
    }
    createMenuItems()
  }

  _setupTextBubble () {
    const createTextBubble = () => {
      if (!utils.customElementReady('text-bubble')) {
        setTimeout(() => createTextBubble(), 100)
        return
      }
      this.textBubble = document.createElement('text-bubble')
      this.ele.appendChild(this.textBubble)
    }
    createTextBubble()
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.• FACE STUFF
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸

  _setupFace () {
    const face = document.createElement('div')
    face.setAttribute('id', 'face')
    face.innerHTML = `
    <span>${this._eye('basic')}</span>
    <span>${this._mouth('basic')}</span>
    <span>${this._eye('basic')}</span>
    `
    this.ele.appendChild(face)
    face.addEventListener('click', () => {
      if (NNW.layout !== 'welcome') this.toggleMenu()
      // TODO
      // else if tutorials are loaded: open tutorials menu
      // else if tutorials not loaded launch welcome text bubble
    })
    this._spinEyes = true
  }

  _mouth () {
    const mouths = {
      basic: '<span>◞</span>'
      // TODO: more SVG mouths
    }
    return mouths[this.face]
  }

  _eye (t) {
    const fg = NNW.getThemeColors().fg
    const sz = NNW.layout === 'welcome' ? '64px' : '20px'
    const eye = {
      basic: `
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
         viewBox="0 0 200 200" xml:space="preserve" style="enable-background:new 0 0 200 200; fill: ${fg}; height: ${sz}">
        <g>
          <path class="clr-wig-svg-text" d="M100.28,0c27.93,0,51.49,9.79,70.7,29.35c19.2,19.57,28.81,43.63,28.81,72.18c0,18.79-5.81,36.85-17.44,54.19
            c-8.93,13.39-20.84,24.01-35.74,31.84c-14.9,7.84-30.65,11.76-47.26,11.76c-26.99,0-50.3-9.86-69.92-29.59
            C9.81,150.02,0,126.6,0,99.51c0-14.12,3.11-27.87,9.34-41.27s14.79-24.81,25.69-34.26C53.51,8,75.26,0,100.28,0z M100.28,12.93
            c-24.29,0-44.87,8.38-61.74,25.15c-16.87,16.77-25.3,37.19-25.3,61.28l86.74,0.47L100.28,12.93z"/>
        </g>
      </svg>
      `
      // TODO: more SVG eyes
    }
    return eye[this.face]
  }

  _startBlinking () {
    // TODO
  }

  _lookAt (eye, x, y) {
    const mom = this.ele.parentNode
    const pos = {
      x: mom.offsetLeft + eye.offsetLeft,
      y: mom.offsetTop + eye.offsetTop
    }
    const offX = x - pos.x
    const offY = y - pos.y
    const rot = Math.atan2(offY, offX) + Math.PI * 0.75
    eye.querySelector('svg').style.transform = `rotate(${rot}rad)`
  }

  _moveEyes (e) {
    const leftEye = this.ele.querySelector('#face > span:nth-child(1)')
    const rightEye = this.ele.querySelector('#face > span:nth-child(3)')
    if (leftEye && rightEye && this._spinEyes) {
      this._lookAt(leftEye, e.clientX, e.clientY)
      this._lookAt(rightEye, e.clientX, e.clientY)
    } else if (leftEye && rightEye) {
      leftEye.style.transform = null
      rightEye.style.transform = null
    }
  }
}

window.Menu = Menu
