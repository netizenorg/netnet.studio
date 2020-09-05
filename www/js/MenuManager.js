/* global MenuItem, TextBubble, NNW, STORE, SearchBar */
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

  const NNM = new MenuManager()

  NNM.opened // if the menu is currently opened
             // returns false, or 'mis' for main menu items,
             // 'ais' for alert menu item, 'tis' for textBubble item

  NNM.toggleMenu()      // toggle's the main radial menu
  NNM.showMainMenu()    // displays the main radial menu
  NNM.hideMainMenu()    // hides the main menu

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
class MenuManager {
  constructor () {
    this.ele = document.querySelector('#nn-menu')
    this.tis = null // parent element for text bubble navigation
    this.ais = null // parent element for alert bubbles
    this.mis = null // parent element for main menu items

    this.items = [] // main menu items
    this.radius = 100 // radius of main menu circle
    // TODO: determine radius size based on item length

    this._opened = false
    this.itemOpts = {
      search: {
        path: 'images/menu/search.png',
        click: () => {
          STORE.dispatch('TOGGLE_MENU')
          if (this.search.opened) this.search.close()
          else this.search.open()
        }
      },
      functions: {
        path: 'images/menu/settings.png',
        click: () => {
          STORE.dispatch('TOGGLE_MENU')
          STORE.dispatch('OPEN_WIDGET', 'functions-menu')
        }
      },
      widgets: {
        path: 'images/menu/settings.png',
        click: () => {
          STORE.dispatch('TOGGLE_MENU')
          STORE.dispatch('OPEN_WIDGET', 'widgets-menu')
        }
      },
      tutorials: {
        path: 'images/menu/open.png',
        click: () => {
          STORE.dispatch('TOGGLE_MENU')
          STORE.dispatch('OPEN_WIDGET', 'tutorials-menu')
        }
      }
    }

    this._setupNetnetFace()
    this._setupMenuItems()
    this._setupAlertItem()
    this._setupTextBubble()
    this.search = new SearchBar()
    this.updatePosition() // to match netnet window placement

    // ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ . ~ * ~ . _ .  event listeners

    window.addEventListener('mousemove', (e) => this._moveEyes(e))

    this.ele.querySelector('#face').addEventListener('click', () => {
      if (STORE.state.layout !== 'welcome') STORE.dispatch('TOGGLE_MENU')
      else window.greetings.welcome()
    })
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸ properties
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  get opened () { return this._opened }
  set opened (v) { return console.error('Menu: opened property is read only') }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*•.¸ public methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  toggleMenu () {
    if (this.opened === 'mis') this.hideMenu()
    else this.showMenu()
  }

  showMenu () {
    this.updatePosition()
    this.setFace('◕', '✖', '◕')
    this._toggleRadialMenuItems(true)
    this._opened = 'mis'
  }

  hideMenu () {
    this.setFace('◕', '◞', '◕')
    this._toggleRadialMenuItems(false)
    if (this._opened === 'mis') this._opened = false
  }

  hideAll () {
    this.hideMenu()
    this.hideAlert()
    this.hideTextBubble()
  }

  // ~ * ~

  showAlert (type, content) {
    const types = ['error', 'warning', 'information']
    if (!types.includes(type)) {
      const m = 'Menu: showAlert expecting one of the following types as the first argument'
      return console.error(m, types)
    } else if (!content) {
      const m = 'Menu: showAlert requires a second content argument'
      return console.error(m)
    }

    this.updatePosition()
    this._opened = 'ais'

    this.alertBubble.icon = `images/alerts/${type}.png`
    this.alertBubble.title = type
    this.alertBubble.click = () => {
      if (type === 'information') {
        STORE.dispatch('SHOW_EDU_TEXT', content)
      } else if (type === 'error' || type === 'warning') {
        STORE.dispatch('SHOW_ERROR_TEXT', content)
      }
    }
    this._toggleAlertItem(true)

    if (type === 'error') {
      this.setFace('✖', '︵', '✖', false)
    } else if (type === 'warning') {
      this.setFace('◑', '﹏', '◑', false)
    } else if (type === 'information') {
      this.setFace('ᴖ', '◞', 'ᴖ', false)
    }
  }

  hideAlert () {
    this.alertBubble.toggle(false)
    this.setFace('◕', '◞', '◕')
    if (this._opened === 'ais') this._opened = false
  }

  // ~ * ~

  showTextBubble (content) {
    if (!content) {
      const m = 'Menu: showTextBubble requires a content argument'
      return console.error(m)
    }

    this.updatePosition()
    this.setFace('◕', '◞', '◕')
    this._opened = 'tis'

    // if text bubble is out of frame
    if (STORE.state.layout === 'welcome' ||
      STORE.state.layout === 'separate-window') NNW._stayInFrame()

    this.textBubble.update({
      content: content.content,
      options: content.options,
      scope: content.scope
    })
  }

  hideTextBubble (removedItem) {
    this.textBubble.fadeOut()
    this.setFace('◕', '◞', '◕')
    if (this._opened === 'tis') this._opened = false
  }

  // ~ * ~

  // NOTE: watch out for a potential race condition here, if the layout
  // changes && we dispatch an action that hides text IMMEDIATLY after, then
  // this._opened will become false && when the StateManager manager calls
  // fadeIn (which is on a timeout after the layout change) there will be
  // nothing to fade back in (b/c this._opened will be false)
  // ...if this becomes an issue again, consider using STORE._layingout
  // to wrap whatever is causing the issue in some sorta debounce logic
  // (ie. to get around the race condition)

  fadeIn (ms, callback) {
    const t = ms || 250
    const menu = this._opened
    const welc = NNW.layout === 'welcome'
    const exceptWelcome = (welc && menu === 'tis') || (!welc)
    if (welc) this.setFace('◕', '◞', '◕')
    else if (this._tempFace) this.setFace(...this._tempFace)
    if (this.opened === 'mis') this._toggleRadialMenuItems(true)
    else if (this.opened === 'ais') this._toggleAlertItem(true)
    if (menu && exceptWelcome) {
      this[menu].style.transition = `opacity ${t}ms`
      this[menu].style.display = 'block'
      if (this[menu + '_fading']) clearTimeout(this[menu + '_fading'])
      if (this[menu + '_pre_fading']) clearTimeout(this[menu + '_pre_fading'])
      this[menu + '_pre_fading'] = setTimeout(() => {
        this.updatePosition()
        this[menu].style.opacity = 1
      }, 100)
      this[menu + '_fading'] = setTimeout(() => {
        if (callback) callback()
      }, t + 100)
    }
  }

  fadeOut (ms, callback) {
    const t = ms || 250
    const menu = this._opened
    const welc = NNW.layout === 'welcome'
    if (!welc) this._tempFace = this.getFace()
    else this._tempFace = null
    this.setFace('◕', '◞', '◕')
    if (this.opened === 'mis') this._toggleRadialMenuItems(false)
    else if (this.opened === 'ais') this._toggleAlertItem(false)
    else if (!this.opened) return
    this[menu].style.transition = `opacity ${t}ms`
    if (this[menu + '_fading']) clearTimeout(this[menu + '_fading'])
    if (this[menu + '_pre_fading']) clearTimeout(this[menu + '_pre_fading'])
    this[menu + '_pre_fading'] = setTimeout(() => { this[menu].style.opacity = 0 }, 10)
    this[menu + '_fading'] = setTimeout(() => {
      this[menu].style.display = 'none'
      if (callback) callback()
    }, t + 5)
  }

  updatePosition () {
    this.center = this.ele.querySelector('#face > span:nth-child(2)')
    this.mis.style.top = this.center.offsetTop + 'px'
    this.mis.style.left = this.center.offsetLeft + 'px'
    this.ais.style.top = this.center.offsetTop + 'px'
    this.ais.style.left = this.center.offsetLeft + 'px'
    const win = document.querySelector('#nn-window')
    this.tis.style.bottom = win.offsetHeight + 35 + 'px'
    this.tis.style.left = win.offsetWidth - 430 - 4 + 'px'
    if (this.opened === 'tis') this.textBubble.updatePosition()
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
      this.ele.querySelector('#face > span:nth-child(3)').textContent,
      this._spinEyes
    ]
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•* private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  _setupNetnetFace () {
    this.ele.innerHTML = `
      <div id="face">
        <span>◕</span>
        <span>◞</span>
        <span>◕</span>
      </div>
    `
    this._spinEyes = true
  }

  _setupMenuItems () {
    this.mis = document.createElement('div')
    this.mis.id = 'menu-items-parent'
    this.ele.appendChild(this.mis)
    this.mis.style.position = 'absolute'

    let index = 0
    for (const key in this.itemOpts) {
      const mi = new MenuItem({
        title: key,
        icon: this.itemOpts[key].path,
        click: this.itemOpts[key].click,
        index: index,
        total: Object.keys(this.itemOpts).length
      })
      this.mis.appendChild(mi.ele)
      this.items.push(mi)
      index++
    }
  }

  _setupAlertItem () {
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

  _setupTextBubble () {
    this.tis = document.createElement('div')
    this.tis.id = 'text-bubbles-parent'
    this.ele.appendChild(this.tis)
    this.tis.style.position = 'absolute'
    this.tis.style.zIndex = 50
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
    } else if (!show) {
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
      } else if (!show) {
        mi.toggle(false)
      }
    })
  }
}

window.Menu = MenuManager
