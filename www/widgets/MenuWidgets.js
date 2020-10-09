/* global NNW, Widget, WIDGETS */
/*
  -----------
     info
  -----------

  the main menu's Widgets sub-menu

  -----------
     usage
  -----------

  // this widget is instantiated by the WindowManager as...
  WIDGETS['widgets-menu'] = new MenuWidgets()

  // it has the following methods
  WIDGETS['widgets-menu']...

  // also inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js
*/
class MenuWidgets extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Widgets Menu'
    this.key = 'widgets-menu'
    this.listed = false // make sure it doesn't show up in Widgets Menu
    this.resizable = false
    this.keywords = ['gizmos', 'tools', 'toolbar', 'doodad', 'gui', 'interface', 'windows', 'helpers']
    NNW.onWidgetLoaded((keys) => { this.updateView() })
  }

  updateView () {
    // first order list by most recently LOADED, OPENED or CLOSED
    let keyList = Object.keys(WIDGETS).map(w => {
      return { ref: WIDGETS[w], key: w }
    }).filter(w => w.ref.listed).map(w => w.key).reverse()
    // then remove any starred widgets && place them on top
    let stared = window.localStorage.getItem('stared-widgets')
    stared = stared ? JSON.parse(stared) : []
    keyList = keyList.filter(key => !stared.includes(key))
    keyList = [...stared, ...keyList]
    // remove itself && Functions && Tutorials
    const no = [
      'widgets-menu', 'functions-menu', 'tutorials-menu', 'example-widget'
    ]
    keyList = keyList.filter(key => !no.includes(key))

    // create menu list
    const parent = document.createElement('div')
    parent.id = 'wig-menu-content'
    keyList.forEach(key => {
      // HACK: seems to be some weird race condition i can't figure out
      // so putting this in a conditional for now...
      if (WIDGETS[key]) {
        const div = document.createElement('div')
        const starSpan = document.createElement('span')
        const str = stared.includes(key) ? '★' : ''
        starSpan.textContent = str
        // if (stared.includes(key)) {
        //   starSpan.innerHTML = '<img src="images/chicago-star.png" style="width: 25px;">'
        // } else {
        //   starSpan.innerHTML = ''
        // }
        div.textContent = `${WIDGETS[key].title}`
        div.className = 'link'
        div.addEventListener('click', () => WIDGETS[key].open())
        parent.appendChild(div).appendChild(starSpan)
      }
    })
    this.innerHTML = parent
    if (this._recentered) this.update({ right: 20, top: 20 })
  }
}

window.MenuWidgets = MenuWidgets
