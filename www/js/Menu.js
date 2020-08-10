/* global MenuItem, TextBubble, NNW, NNE */
/*
  -----------
     info
  -----------

  This class handles netnet's face... which is also the menu. netnet's menu
  system breaks down into the following sub types:
    - main menu: the radial options that appear around it's face when u click it
    - alerts: which appear when netnet wants to tell u something
    - textbubbles: which is where netnet tells u the thigns it wants to tell u

  NOTE: This class is only meant to be instantiated once... so why not just make it
  a global object? ...b/c i like JS's class syntax better than that of global
  objects. It's also dependent on a lot of outside variables && elements, see
  globals in the comment on the fist line for global JS variables it references,
  doing a search for querySelector on this file will also reveal the html
  elements it assumes are in the index.html page

  -----------
     usage
  -----------

  const nnm = new Menu({
    ele: '#nn-menu', // id of the element to inject the menu system into
    radius: 100, // radius of the radial circle of menu options when opened
    items: {
      menuOptionName: {
        path: 'path/to/icon.png', // icon to display in menu item
        click: () => { } // function to call when menu item is clicked
      },
      anotherOptionName: {
        path: 'path/to/icon.png',
        click: () => { }
      }
    }
  })

  NNM.opened // if the menu is currently opened this will return an object like:
  // { type: 'alert', content: '...' }
  // { type: 'textbubble', content: '...' }
  // { type: 'alert', sub: 'error', content: '...' }

  NNM.toggleMenu()      // toggle's the main menu
  NNM.showMainMenu()    // displays the main menu
  NNM.hideMainMenu()    // hides the main menu

  NNM.clearAlerts()     // clears all alerts from internal history stack
  NNM.hideAlert()       // hides the currently displayed alert
  NNM.showAlert(t,c)    // displays an alert of specified [t]ype,
                        // when clicked it will display a textBubble w/the
                        // specified [c]ontent

  NNM.showTextBubble(c) // displays a text bubble w/the [c]ontent passed into it
  NNM.hideTextBubble()  // hides the currently displayed text bubble

  NNM.fadeIn(ms, callback)  // fades all the menus in && displays them
  NNM.fadeOut(ms, callback) // fades all the menus out && hides them
  NNM.updatePosition()      // reposition's the menu's to match NNW.layout

  NNM.getFace()         // returns an array w/current unicode face chars
  NNM.setFace(l,m,r,t)  // update's netnet's face given a unicode char for it
                        //  [l]eft eye, [m]outh && [r]ight eye
                        //  [t] is an optional boolean which determines whether
                        //  or not to turn/spin netnet's eyes on mouse move
*/
class Menu {
  constructor (opts) {
    this.tis = null // parent element for text bubble navigation
    this.ais = null // parent element for alert bubbles
    this.mis = null // parent element for main menu items
    this.radius = opts.radius || 100 // radius of main menu circle
    this.items = [] // main menu items

    // keeps track of previously opened menu items
    this.history = []

    this._setupNetnetFace(opts)
    this._setupMenuItems(opts)
    this._setupAlertItems()
    this._setupTextBubbles()
    this.updatePosition() // to match netnet window placement

    // ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ .  event listeners

    window.addEventListener('mousemove', (e) => this._moveEyes(e))

    this.ele.querySelector('#face')
      .addEventListener('click', () => this.toggleMenu())
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  get opened () {
    const lastMenuItem = this.history[this.history.length - 1]
    return lastMenuItem || false
  }

  set opened (v) {
    return console.error('Menu: opened property is read only')
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•.¸ public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  toggleMenu () {
    if (NNW.layout === 'welcome') return window.alert('open alt menu') // TODO
    else if (this.opened && this.opened.type === 'mainmenu') this.hideMainMenu()
    else this.showMainMenu()
  }

  showMainMenu (viaHistory) {
    if (!viaHistory) this._updateHistory({ type: 'mainmenu' })
    this.updatePosition()
    this.setFace('◕', '✖', '◕')
    this._toggleRadialMenuItems(true)
  }

  hideMainMenu (removedItem) {
    if (removedItem) {
      this.setFace('◕', '◞', '◕')
      this._toggleRadialMenuItems(false)
    } else this._userCalledHide('mainmenu')
  }

  // ~ * ~

  showAlert (type, content, viaHistory) {
    const types = ['error', 'warning', 'information']
    if (!types.includes(type)) {
      const m = 'Menu: showAlert expecting one of the following types as the first argument'
      return console.error(m, types)
    } else if (!content) {
      const m = 'Menu: showAlert requires a second content argument'
      return console.error(m)
    }

    if (!viaHistory) this._updateHistory({ type: 'alert', sub: type, content })
    this.updatePosition()

    this.alertBubble.icon = `images/alerts/${type}.png`
    this.alertBubble.title = type
    this.alertBubble._click = () => { this.showTextBubble(content) }
    this._toggleAlertItem(true)

    if (type === 'error') {
      this.setFace('✖', '︵', '✖', false)
    } else if (type === 'warning') {
      this.setFace('◑', '﹏', '◑', false)
    } else if (type === 'information') {
      this.setFace('ᴖ', '◞', 'ᴖ', false)
    }
  }

  hideAlert (removedItem) {
    if (removedItem) {
      this.alertBubble.toggle(false)
      this.setFace('◕', '◞', '◕')
    } else this._userCalledHide('alert')
  }

  clearAlerts () {
    let had = false
    for (let i = this.history.length - 1; i >= 0; i--) {
      if (this.history[i].type === 'alert') {
        had = true
        this.history.splice(i, 1)
      }
    }
    if (had) {
      this.alertBubble.toggle(false)
      this.setFace('◕', '◞', '◕')
    }
  }

  // ~ * ~

  showTextBubble (content, viaHistory) {
    if (!content) {
      const m = 'Menu: showTextBubble requires a content argument'
      return console.error(m)
    }

    if (!viaHistory) this._updateHistory({ type: 'textbubble', content })
    this.updatePosition()
    this.setFace('◕', '◞', '◕')

    if (typeof content === 'string' || content instanceof window.HTMLElement) {
      this.textBubble.update({
        content: content,
        options: {
          ok: () => { this.hideTextBubble() }
        }
      })
    } else { // assuming object or array of objs
      if (!content.options) {
        content.options = {
          ok: () => {
            this.hideTextBubble()
            if (content.highlight) NNE.highlight(0)
          }
        }
      }
      this.textBubble.update(content)
    }
  }

  hideTextBubble (removedItem) {
    if (removedItem) {
      this.textBubble.fadeOut()
      this.setFace('◕', '◞', '◕')
    } else this._userCalledHide('textbubble')
  }

  // ~ * ~

  fadeIn (ms, callback) {
    if (this.opened && this.opened.type === 'mainmenu') {
      this._toggleRadialMenuItems(true)
    }
    this._fadeIn(ms, callback, 'tis')
    if (NNW.layout === 'welcome') {
      this.setFace('◕', '◞', '◕')
    } else {
      if (this.opened) this.setFace(...this._tempFace)
      this._fadeIn(ms, callback, 'mis')
      this._fadeIn(ms, callback, 'ais')
    }
  }

  fadeOut (ms, callback) {
    this._fadeOut(ms, callback, 'mis')
    this._fadeOut(ms, callback, 'ais')
    this._fadeOut(ms, callback, 'tis')
    if (NNW.layout !== 'welcome') {
      this._tempFace = this.getFace()
    }
    this.setFace('◕', '◞', '◕')
  }

  updatePosition () {
    this.center = this.ele.querySelector('#face > span:nth-child(2)')
    this.mis.style.top = this.center.offsetTop + 'px'
    this.mis.style.left = this.center.offsetLeft + 'px'
    this.ais.style.top = this.center.offsetTop + 'px'
    this.ais.style.left = this.center.offsetLeft + 'px'
    const win = document.querySelector('#nn-window')
    this.tis.style.bottom = win.offsetHeight + 20 + 'px'
    this.tis.style.left = win.offsetWidth - 340 - 4 + 'px'
    this.textBubble.updatePosition()
  }

  setFace (leftEye, mouth, rightEye, spinEyes) {
    if (spinEyes === false) this._spinEyes = false
    else this._spinEyes = true
    this.ele.querySelector('#face > span:nth-child(1)').textContent = leftEye
    this.ele.querySelector('#face > span:nth-child(2)').textContent = mouth
    this.ele.querySelector('#face > span:nth-child(3)').textContent = rightEye
    this.ele.querySelector('#face > span:nth-child(1)')
      .style.transform = 'rotate(0rad)'
    this.ele.querySelector('#face > span:nth-child(3)')
      .style.transform = 'rotate(0rad)'
  }

  getFace () {
    return [
      this.ele.querySelector('#face > span:nth-child(1)').textContent,
      this.ele.querySelector('#face > span:nth-child(2)').textContent,
      this.ele.querySelector('#face > span:nth-child(3)').textContent
    ]
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•* private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _setupNetnetFace (opts) {
    this.ele = document.querySelector(opts.ele)
    this.ele.innerHTML = `
      <div id="face">
        <span>◕</span>
        <span>◞</span>
        <span>◕</span>
      </div>
    `
    this._spinEyes = true
  }

  _setupMenuItems (opts) {
    this.mis = document.createElement('div')
    this.mis.id = 'menu-items-parent'
    this.ele.appendChild(this.mis)
    this.mis.style.position = 'absolute'

    let index = 0
    for (const key in opts.items) {
      const mi = new MenuItem({
        title: key,
        icon: opts.items[key].path,
        click: opts.items[key].click,
        index: index,
        total: Object.keys(opts.items).length
      })
      this.mis.appendChild(mi.ele)
      this.items.push(mi)
      index++
    }
  }

  _setupAlertItems () {
    this.ais = document.createElement('div')
    this.ais.id = 'alert-items-parent'
    this.ele.appendChild(this.ais)
    this.ais.style.position = 'absolute'

    this.alertBubble = new MenuItem({
      title: 'information',
      icon: 'images/alerts/information.png',
      offset: -15
    })

    this.ais.appendChild(this.alertBubble.ele)
  }

  _setupTextBubbles () {
    this.tis = document.createElement('div')
    this.tis.id = 'text-bubbles-parent'
    this.ele.appendChild(this.tis)
    this.tis.style.position = 'absolute'

    const de = document.documentElement
    const t = window.getComputedStyle(de).getPropertyValue('--transition-time')
    this.tis.style.transition = `bottom ${t}, left  ${t}`

    this.textBubble = new TextBubble()

    this.tis.appendChild(this.textBubble.ele)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _lookAt (eye, x, y) {
    const mom = this.ele.parentNode
    const pos = {
      x: mom.offsetLeft + eye.offsetLeft,
      y: mom.offsetTop + eye.offsetTop
    }
    const offX = x - pos.x
    const offY = y - pos.y
    const rot = Math.atan2(offY, offX) + Math.PI * 0.6
    eye.style.transform = `rotate(${rot}rad)`
  }

  _moveEyes (e) {
    const leftEye = this.ele.querySelector('#face > span:nth-child(1)')
    const rightEye = this.ele.querySelector('#face > span:nth-child(3)')
    if (this._spinEyes) {
      this._lookAt(leftEye, e.clientX, e.clientY)
      this._lookAt(rightEye, e.clientX, e.clientY)
    } else {
      leftEye.style.transform = null
      rightEye.style.transform = null
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _fadeIn (ms, callback, menu) {
    const t = ms || 250
    this[menu].style.transition = `opacity ${t}ms`
    this[menu].style.display = 'block'
    if (this[menu + '_fading']) clearTimeout(this[menu + '_fading'])
    setTimeout(() => {
      this.updatePosition()
      this[menu].style.opacity = 1
    }, 100)
    this[menu + '_fading'] = setTimeout(() => {
      if (callback) callback()
    }, t + 100)
  }

  _fadeOut (ms, callback, menu) {
    const t = ms || 250
    this[menu].style.transition = `opacity ${t}ms`
    if (this[menu + '_fading']) clearTimeout(this[menu + '_fading'])
    setTimeout(() => { this[menu].style.opacity = 0 }, 10)
    this[menu + '_fading'] = setTimeout(() => {
      this[menu].style.display = 'none'
      if (callback) callback()
    }, t + 5)
  }

  _userCalledHide (type) {
    if (this.opened && this.opened.type === type) {
      this._updateHistory('pop')
    } else {
      console.warn(`Menu: attempted to hide ${type} but no ${type} was present`)
    }
  }

  _updateHistory (obj) {
    if (obj === 'pop') {
      const last = this.history.pop()
      if (last.type === 'mainmenu') this.hideMainMenu(last)
      else if (last.type === 'textbubble') this.hideTextBubble(last)
      else if (last.type === 'alert') this.hideAlert(last)

      if (this.opened) {
        if (this.opened.type === 'mainmenu') this.showMainMenu(true)
        else if (this.opened.type === 'alert') {
          this.showAlert(this.opened.sub, this.opened.content, true)
        } else if (this.opened.type === 'textbubble') {
          this.showTextBubble(this.opened.content, true)
        }
      }
    } else if (typeof obj === 'object') {
      const last = this.opened
      const tb = last.type === 'textbubble'
      if (this.opened) {
        if (this.opened.type === 'mainmenu') this.hideMainMenu(last)
        else if (this.opened.type === 'textbubble' && !tb) this.hideTextBubble(last)
        else if (this.opened.type === 'alert') this.hideAlert(last)
      }
      this.history.push(obj)
    }
  }

  _toggleAlertItem (show) {
    // 75, null, Math.PI
    if (NNW.layout === 'dock-left') {
      this.alertBubble.toggle(show, 75, null, Math.PI * 2)
    } else if (NNW.layout === 'dock-bottom') {
      this.alertBubble.toggle(show, 75, null, Math.PI)
    } else if (NNW.layout === 'separate-window') {
      this.alertBubble.toggle(show, 75, null, Math.PI)
    } else if (NNW.layout === 'full-screen') {
      this.alertBubble.toggle(show, 75, null, Math.PI * 2)
    } else if (show && NNW.layout === 'welcome') {
      this.alertBubble.toggle(false)
    }
  }

  _toggleRadialMenuItems (show) {
    this.items.forEach(mi => {
      if (NNW.layout === 'dock-left') {
        mi.toggle(show, this.radius, 0.5, Math.PI * 1.6)
      } else if (NNW.layout === 'dock-bottom') {
        mi.toggle(show, this.radius, 0.5, Math.PI)
      } else if (NNW.layout === 'separate-window') {
        mi.toggle(show, this.radius * 0.8, 1, Math.PI)
      } else if (NNW.layout === 'full-screen') {
        mi.toggle(show, this.radius * 1.33, 0.32, Math.PI * 1.54)
      } else if (show && NNW.layout === 'welcome') {
        mi.toggle(false)
      }
    })
  }
}

window.Menu = Menu
