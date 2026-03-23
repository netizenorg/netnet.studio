/* global NNW, WIDGETS, utils */
class NetNetFaceMenu {
  constructor (win) {
    this.face = {
      leftEye: '◕',
      mouth: '◞',
      rightEye: '◕',
      lookAtCursor: true,
      animation: 'blink'
    }
    this.itemOpts = {
      'talk to netnet': {
        path: 'images/menu/hi.png',
        click: () => {
          WIDGETS['student-session'].greetStudent()
        }
      },
      'Coding Menu': {
        path: 'images/menu/code.png',
        click: () => {
          if (utils.warnSafari()) return WIDGETS['student-session'].greetStudent()
          NNW.menu.toggleMenu(false)
          WIDGETS.open('coding-menu')
        }
      },
      'Search Bar': {
        path: 'images/menu/search.png',
        click: () => {
          if (utils.warnSafari()) return WIDGETS['student-session'].greetStudent()
          NNW.menu.toggleMenu(false)
          if (this.search.opened) this.search.close()
          else this.search.open()
        }
      },
      'Learning Guide': {
        path: 'images/menu/tutorials.png',
        width: '73%',
        click: () => {
          if (utils.warnSafari()) return WIDGETS['student-session'].greetStudent()
          NNW.menu.toggleMenu(false)
          WIDGETS.open('learning-guide', w => w.scrollTo(0))
        }
      }
    }

    this.faceLoaded = false
    this._setupMenu(win) // radial menu of <menu-item> elements
    window.addEventListener('mousemove', (e) => this._moveEyes(e))
    window.addEventListener('DOMContentLoaded', (e) => {
      this._setupFace() // netnet's face
      this._setupTextBubble() // <text-bubble> element
      // this.search = new SearchBar()
      const createSearchBar = () => {
        if (!utils.customElementReady('search-bar')) {
          setTimeout(() => createSearchBar(), 100)
          return
        }
        this.search = document.createElement('search-bar')
        document.body.appendChild(this.search)
      }
      createSearchBar()

      setTimeout(() => this.updatePosition(), 500)
    })
  }

  get opened () { return this.items.children[0].opened }
  set opened (v) { return console.error('Menu: opened property is read-only') }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸ PUBLIC METHODS
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸

  updatePosition () {
    const center = this.ele.querySelector('#face > span:nth-child(2)')
    if (!center) return
    if (NNW.layout === 'welcome') {
      this.items.style.top = center.offsetTop + 28 + 'px'
      this.items.style.left = center.offsetLeft + 36 + 'px'
    } else {
      this.items.style.top = center.offsetTop + 'px'
      this.items.style.left = center.offsetLeft + 11 + 'px'
    }
    if (this.textBubble) {
      const win = document.querySelector('#nn-window')
      this.textBubble.style.bottom = win.offsetHeight + 35 + 'px'
      this.textBubble.style.left = win.offsetWidth - 430 - 4 + 'px'
      this.textBubble.updatePosition()
    }
  }

  updateFace (obj) {
    if (!window.NNW) return
    this.faceLoaded = true
    obj = obj || {}

    if (obj.leftEye) this.face.leftEye = obj.leftEye.normalize('NFC')
    if (obj.mouth) this.face.mouth = obj.mouth.normalize('NFC')
    if (obj.rightEye) this.face.rightEye = obj.rightEye.normalize('NFC')

    this.face.lookAtCursor = typeof obj.lookAtCursor === 'boolean'
      ? obj.lookAtCursor : true

    const nomotion = WIDGETS['student-session']?.getData('nomotion') === 'true'
    if (obj.animation && !nomotion) {
      this.face.animation = obj.animation
      this._runFaceAnimation()
    } else {
      NNW.menu.ele.querySelector('#face').style.animation = 'none'
    }

    const face = document.querySelectorAll('#face > span')
    face[0].innerHTML = this._char2SVG(this.face.leftEye)
    face[1].innerHTML = this._char2SVG(this.face.mouth)
    face[2].innerHTML = this._char2SVG(this.face.rightEye)
  }

  switchFace (type) {
    // a few shortcuts for commonly used faces to reduce code redundency
    const lookAtCursor = false
    const newFace = (f) => NNW.menu.updateFace(f)
    const commonFaces = {
      default: {
        leftEye: '◕', mouth: '◞', rightEye: '◕', lookAtCursor: true, animation: 'blink'
      },
      processing: {
        leftEye: '◉', mouth: '⌄', rightEye: '☉', lookAtCursor, animation: 'processing'
      },
      happy: {
        leftEye: 'ᴖ', mouth: '◡', rightEye: 'ᴖ', lookAtCursor, animation: 'big-nod'
      },
      surprise: {
        leftEye: 'ŏ', mouth: '.', rightEye: 'ŏ', lookAtCursor: false, animation: 'spring-up'
      },
      upset: {
        leftEye: '⇀', mouth: '^', rightEye: '↼', lookAtCursor, animation: 'shake'
      },
      menu: {
        leftEye: '◕', mouth: '✖', rightEye: '◕', lookAtCursor: true
      },
      error: {
        leftEye: 'ŏ', mouth: '︵', rightEye: 'ŏ', lookAtCursor: false
      }
    }
    if (commonFaces[type]) newFace(commonFaces[type])
    else console.warn(`netnet: there is no ${type} face`, type)
  }

  toggleMenu (show) {
    if (typeof show === 'undefined') show = !this.opened

    if (typeof NNW !== 'undefined') {
      if (show) this.switchFace('menu')
      else this.switchFace('default')
    }

    this.updatePosition()

    const radius = this.items.children.length * 25
    this.items.querySelectorAll('menu-item').forEach(item => {
      if (NNW.layout === 'dock-left') {
        item.toggle(show, radius, 0.5, Math.PI * 1.6)
      } else if (NNW.layout === 'dock-bottom') {
        item.toggle(show, radius, 0.5, Math.PI)
      } else if (NNW.layout === 'separate-window') {
        item.toggle(show, radius * 0.8, 1, Math.PI * 1.25)
      } else if (NNW.layout === 'full-screen') {
        item.toggle(show, radius * 1.33, 0.32, Math.PI * 1.54)
      } else if (NNW.layout === 'welcome') {
        item.toggle(show, radius * 1.33, 0.3, Math.PI * 1.77)
      } else if (!show) {
        item.toggle(false)
      }
    })

    if (show && this.textBubble.opened) window.convo.hide()
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
        const o = this.itemOpts[key]
        const item = document.createElement('menu-item')
        item.setAttribute('title', key)
        item.setAttribute('icon', o.path)
        item.addEventListener('click', () => o.click())
        if (o.width) item.setAttribute('w', o.width)
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

  _updateFavicon (svg) {
    // NOTE: this is no longer in use (was causing way too many HTTP reqs before)
    // leaving it here in case we want to re-use in another context
    if (svg === '.') svg = 'mouth-dot'
    document.querySelector('link[rel="icon"]').href = `images/faces/${svg}.svg`
  }

  _loadFaceAssets (cb) {
    this._faceAssets = { null: '' }
    let ready = false
    utils.get('api/face-assets', (json) => {
      if (json.success === false) return utils._Convo('oh-no-error', json)
      json.forEach(svg => {
        const name = svg.split('.')[0]
        let key = name === 'mouth-dot' ? '.' : name
        key = key.normalize('NFC')
        utils.get(`images/faces/${svg}`, (code) => {
          let start = 0
          let end = 0
          const arr = code.split('\n')
          arr.forEach((s, i) => {
            if (s.indexOf('<g') === 0) start = i
            else if (s.indexOf('</g') === 0) end = i + 1
          })
          this._faceAssets[key] = arr.slice(start, end).join('\n')
          // ...
          if (!ready && this._faceAssets['◕'] && this._faceAssets['◞']) {
            ready = true
            cb()
          }
        }, true)
      })
    })
  }

  _setupFace () {
    const face = document.createElement('div')
    face.setAttribute('id', 'face')
    face.innerHTML = `
    <span><!-- this.face.leftEye --></span>
    <span><!-- this.face.mouth --></span>
    <span><!-- this.face.rightEye --></span>
    `
    this.ele.appendChild(face)
    face.addEventListener('click', () => this.toggleMenu())
    // when necessary assets are loaded, set default face && run blink animation
    this._loadFaceAssets(() => this.updateFace({ animation: 'blink' }))
  }

  _char2SVG (char, altClr) {
    const fg = altClr || NNW.getThemeColors().fg
    const sz = NNW.layout === 'welcome' ? '64px' : '20px'
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       viewBox="0 0 200 200" xml:space="preserve" style="enable-background:new 0 0 200 200; fill: ${fg}; height: ${sz}">
      ${this._faceAssets[char]}
    </svg>`
  }

  _runFaceAnimation () {
    // remove any current animations
    if (this._faceAnimTO) clearTimeout(this._faceAnimTO)
    NNW.menu.ele.querySelector('#face').style.animation = ''
    NNW.menu.ele.querySelector('#face').style.animationTimingFunction = ''
    NNW.menu.ele.querySelector('#face').style.animationIterationCount = ''

    // run new animation
    // NOTE: CSS defined found in www/css/styles.css
    if (this.face.animation === 'blink') {
      if (this.face.leftEye === '-') {
        this._faceAnimTO = setTimeout(() => {
          this.updateFace({ leftEye: '◕', rightEye: '◕', lookAtCursor: true })
          const nomotion = WIDGETS['student-session']?.getData('nomotion') === 'true'
          if (nomotion) return // stop blinking
          this._runFaceAnimation()
        }, 150)
      } else {
        this._faceAnimTO = setTimeout(() => {
          const nomotion = WIDGETS['student-session']?.getData('nomotion') === 'true'
          if (nomotion) return // stop blinking
          this.updateFace({ leftEye: '-', rightEye: '-', lookAtCursor: false })
          this._runFaceAnimation()
        }, Math.random() * 6000 + 8000)
      }
    } else if (this.face.animation === 'processing') {
      this._faceAnimTO = setTimeout(() => {
        if (this.face.leftEye === '◉') {
          this.updateFace({ leftEye: '☉', rightEye: '◉' })
        } else this.updateFace({ leftEye: '◉', rightEye: '☉' })
        this._runFaceAnimation()
      }, 500)
    } else if (this.face.animation === 'bounce') {
      NNW.menu.ele.querySelector('#face').style.animation = 'bounce 1s'
      NNW.menu.ele.querySelector('#face').style.animationTimingFunction = 'easeInQuint'
      NNW.menu.ele.querySelector('#face').style.animationIterationCount = 1
    } else if (this.face.animation === 'big-nod') {
      NNW.menu.ele.querySelector('#face').style.animation = 'big-nod 0.7s ease-in-out 0s 1'
    } else if (this.face.animation === 'spring-up') {
      NNW.menu.ele.querySelector('#face').style.animation = 'spring-up 0.7s ease-out 0s 1 normal forwards'
    } else if (this.face.animation === 'shake') {
      NNW.menu.ele.querySelector('#face').style.animation = 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
    } else if (this.face.animation === 'duck-down') {
      NNW.menu.ele.querySelector('#face').style.animation = 'duck-down 0.82s ease-out 0s 1 normal forwards'
    }
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
    if (!eye) return
    eye.querySelector('svg').style.transform = `rotate(${rot}rad)`
  }

  _moveEyes (e) {
    const leftEye = this.ele.querySelector('#face > span:nth-child(1)')
    const rightEye = this.ele.querySelector('#face > span:nth-child(3)')
    const nomotion = WIDGETS['student-session']?.getData('nomotion') === 'true'
    if (leftEye && rightEye && this.face.lookAtCursor && !nomotion) {
      this._lookAt(leftEye, e.clientX, e.clientY)
      this._lookAt(rightEye, e.clientX, e.clientY)
    } else if (leftEye && rightEye) {
      leftEye.style.transform = null
      rightEye.style.transform = null
    }
  }
}

window.NetNetFaceMenu = NetNetFaceMenu
