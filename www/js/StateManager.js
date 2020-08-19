/* global NNW, NNM, NNE, WIDGETS, Widget */
/*
  -----------
     info
  -----------

  This class is responsible for netnet's State Managment, it's modeled on the
  "Flux" state managment pattern. While Widgets && other smaller components
  handle certain details regarding their internal state on their own, any/all
  high level state changes to netnet itself should be handled via this State
  Manager.

  NOTE: This class is only meant to be instantiated once... so why not just make it
  a global object? ...b/c i like JS's class syntax better than that of global
  objects. It's also dependent on a lot of outside variables && elements, see
  globals in the comment on the fist line for global JS variables it references

  -----------
     usage
  -----------

  const STORE = new StateManager({
    log: true // optionally log each action to the console
  })

  // To trigger a state change/mutation, use the update()
  // method && specify the action...

  STORE.dispatch('TYPE_OF_ACTION', dataPayload)

  // the action types of events are listed in the *Types array's
  // in the constructor below. a dataPayload isn't always required,
  // this depends on the type of action, see comments below next
  // to each action type for examples/references for the type of
  // dataPayload it expects

  // while the state itself can be queired to test for certain conditions, ex:

  STORE.state.layout === 'welcome'

  // there are certain conditions that require more complex conditional logic
  // for these there are the .is() && .was() (to check a condition against
  // netnet's prior state) methods. see _check() methods for conditions list.

  STORE.is('CHECK_FOR_CONDITION')
  STORE.was('CHECK_FOR_CONDITION')

*/
class StateManager {
  constructor (opts) {
    opts = opts || {}
    this.state = {
      layout: 'welcome', // netnet's layout
      opacity: 1, // netnet's opacity
      editable: true, // is netitor editable
      hash: window.location.hash ? 'has-hash' : 'no-hash',
      theme: 'dark', // the netitor's syntax highlight theme
      background: false, // false means netitor has transparent background
      widgets: [], // widgets which have been opened during session
      menu: false, // displaying main menu or not
      eduinfo: { display: false, payload: null },
      errors: { display: false, index: -1, list: [] },
      tutorial: { display: false, id: null, steps: {} }
    }
    this.log = opts.log || false
    this.holding = false // if true, prevent state change
    this.listeners = {}
    this.history = {
      states: [{ ...this.state }],
      actions: [{ type: 'PAGE_LOAD' }]
    }
    this.generalActionTypes = [
      'TOGGLE_MENU', // (no-data-required)
      'NEXT_LAYOUT', // (no-data-required)
      'PREV_LAYOUT', // (no-data-required)
      'CHANGE_LAYOUT', // 'dock-left'
      'INCREASE_OPACITY', // 0.1
      'DECREASE_OPACITY', // 0.1
      'CHANGE_OPACITY', // 1
      'ENABLE_EDITING', // (no-data-required)
      'DISABLE_EDITING', // (no-data-required)
      'SHARE_URL', // (no-data-required), updates address bar URL
      'CHANGE_THEME', // 'theme-name' or { theme, background }
      // ............
      'LOAD_WIDGETS', // object { key: referenceToWidgetInstance }
      'OPEN_WIDGET', // referenceToWidgetInstance
      'CLOSE_WIDGET', // referenceToWidgetInstance
      'DELETE_WIDGET' // referenceToWidgetInstance
    ]
    this.eduActionTypes = [
      'SHOW_EDU_ALERT', // { content, options }
      'HIDE_EDU_ALERT', // (no-data-required)
      'SHOW_EDU_TEXT', // { content, options }
      'HIDE_EDU_TEXT' // (no-data-required)
    ]
    this.errorActionTypes = [
      'SHOW_ERROR_ALERT', // { type, content, options, line } or Array of such objs
      'SHOW_ERROR_TEXT', // { type, content, options, line } or Array of such objs
      'HIDE_ERROR_ALERT', // (no-data-required)
      'HIDE_ERROR_TEXT', // (no-data-required)
      'CLEAR_ERROR', // (no-data-required)
      'NEXT_ERROR', // (no-data-required)
      'PREV_ERROR' // (no-data-required)
    ]
    this.tutorialActionTypes = [
      'TUTORIAL_DATA', // { steps, id, editable }
      'TUTORIAL_NEXT_STEP', // id, of the initiated step
      'TUTORIAL_PREV_STEP', // id, of the initiated step
      'TUTORIAL_GOTO', // id, of the initiated step
      'HIDE_TUTORIAL_TEXT', // (no-data-required)
      'TUTORIAL_FINISHED' // (no-data-required)
    ]
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  get prior () {
    if (this.history.states.length - 2 < 0) return this.state
    return this.history.states[this.history.states.length - 2]
  }

  set prior (v) {
    console.error('StateManager: .prior is read-only')
  }

  didChange (p) {
    const equalArr = (a, b) => JSON.stringify(a) === JSON.stringify(b)
    const prior = p.includes('.')
      ? this.prior[p.split('.')[0]][p.split('.')[1]] : this.prior[p]
    const current = p.includes('.')
      ? this.state[p.split('.')[0]][p.split('.')[1]] : this.state[p]

    if (current instanceof Array) {
      return !equalArr(prior, current)
    } else if (typeof current === 'object') {
      let changed = false
      for (const k in current) {
        if (typeof current[k] === 'object') {
          if (!equalArr(current[k], prior[k])) {
            changed = true; break
          }
        } else if (current[k] !== prior[k]) {
          changed = true; break
        }
      }
      return changed
    } else {
      return prior !== current
    }
  }

  updateSubscribers () {
    for (const prop in this.listeners) {
      if (this.didChange(prop)) {
        this.listeners[prop].forEach(cb => {
          if (prop.includes('.')) {
            const p = prop.split('.')
            cb(this.state[p[0]][p[1]])
          } else cb(this.state[prop])
        })
      }
    }
  }

  subscribe (prop, callback) {
    if (!this.listeners[prop]) this.listeners[prop] = []
    this.listeners[prop].push(callback)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  is (type) {
    const s = this.state
    if (type === 'SHOWING') { // showing any (menu, alerts, text-bubbles)
      return (
        s.eduinfo.display || s.errors.display || s.menu || s.tutorial.display
      )
    } else if (type === 'SHOWING_ALERT') {
      return (s.eduinfo.display === 'alert' || s.errors.display === 'alert')
    } else if (type === 'SHOWING_TEXT') {
      return (s.eduinfo.display === 'text' || s.errors.display === 'text' ||
      s.tutorial.display === 'text')
    } else if (type === 'SHOWING_MENU') {
      return s.menu
    } else if (type === 'SHOWING_EDU') {
      return s.eduinfo.display
    } else if (type === 'SHOWING_EDU_ALERT') {
      return s.eduinfo.display === 'alert'
    } else if (type === 'SHOWING_EDU_TEXT') {
      return s.eduinfo.display === 'text'
    } else if (type === 'SHOWING_ERROR') {
      return s.errors.display
    } else if (type === 'SHOWING_ERROR_ALERT') {
      return s.errors.display === 'alert'
    } else if (type === 'SHOWING_ERROR_TEXT') {
      return s.errors.display === 'text'
    } else if (type === 'SHOWING_TUTORIAL') {
      return s.tutorial.display
    } else if (type === 'SHOWING_TUTORIAL_TEXT') {
      return s.tutorial.display === 'text'
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  dispatch (type, data) {
    const types = [
      ...this.generalActionTypes,
      ...this.eduActionTypes,
      ...this.errorActionTypes,
      ...this.tutorialActionTypes
    ]
    if (!types.includes(type)) {
      return console.error(`StateManager: ${type} is not an action type`)
    }
    // CREATE ACTION
    let act, ren
    if (type.includes('_LAYOUT')) {
      act = this.changeLayout(type, data); ren = 'window'
    } else if (type.includes('_OPACITY')) {
      act = this.changeOpacity(type, data); ren = 'window'
    } else if (type === 'SHARE_URL') {
      act = { type, data: 'has-hash' }; ren = 'netitor-hash'
    } else if (type.includes('_EDITING')) {
      act = this.updateEditing(type); ren = 'window'
    } else if (type === 'CHANGE_THEME') {
      act = this.updateTheme(type, data); ren = 'netitor'
    } else if (type.includes('_WIDGET')) {
      act = this.updateWidgets(type, data); ren = 'widgets'
    } else if (type === 'TOGGLE_MENU') {
      act = this.toggleMenu(type); ren = 'netnet'
    } else if (this.eduActionTypes.includes(type)) {
      act = data ? { type, data } : { type }; ren = 'netnet'
    } else if (this.errorActionTypes.includes(type)) {
      act = this.updateError(type, data); ren = 'netnet'
    } else if (this.tutorialActionTypes.includes(type)) {
      act = this.updateTutorial(type, data); ren = 'tutorial'
    }
    if (this.log) console.log(act)
    // UPDATE STATE DATA
    const state = this.rootReducer(this.state, act)
    this.state = state
    // UPDATE VIEW TO REFLECT STATE
    this.render(ren)
    // UPDATE HISTORY
    this.history.actions.push(act)
    this.history.states.push(state)
    // LET SUBSCRIBERS KNOW STATE CHANGED
    this.updateSubscribers()
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // ACTION CREATORS

  changeLayout (type, data) {
    if (type === 'NEXT_LAYOUT') {
      let idx = NNW.layouts.indexOf(NNW.layout)
      idx = idx < NNW.layouts.length - 1 ? idx + 1 : 0
      return { type, data: NNW.layouts[idx] }
    } else if (type === 'PREV_LAYOUT') {
      let idx = NNW.layouts.indexOf(NNW.layout)
      idx = idx > 0 ? idx - 1 : NNW.layouts.length - 1
      return { type, data: NNW.layouts[idx] }
    } else if (type === 'CHANGE_LAYOUT') {
      if (!NNW.layouts.includes(data)) {
        return console.error(`StateManager: ${data} is not a layout type`)
      }
      return { type, data: data }
    }
  }

  changeOpacity (type, data) {
    data = Number(data)
    if (type === 'INCREASE_OPACITY') {
      return { type, data: NNW.opacity < 1 ? NNW.opacity + data : 1 }
    } else if (type === 'DECREASE_OPACITY') {
      return { type, data: NNW.opacity > 0 ? NNW.opacity - data : 0 }
    } else if (type === 'CHANGE_OPACITY') {
      return { type, data }
    }
  }

  updateEditing (type, data) {
    if (type === 'ENABLE_EDITING') return { type, data: true }
    else if (type === 'DISABLE_EDITING') return { type, data: false }
  }

  updateTheme (type, data) {
    if (typeof data === 'string') {
      return { type, data: { theme: data, background: this.state.background } }
    } else {
      return { type, data: { theme: data.theme, background: data.background } }
    }
  }

  updateWidgets (type, data) {
    // NOTE: this action creator "breaks the rules" a little bit, as it
    // also has the "side effect" of updating the global WIDGETS obj
    let wig, key
    if (typeof data === 'object' && !(data instanceof Widget)) { // collection
      // LOAD_WIDGETS
      const arr = [...this.state.widgets]
      for (const key in data) {
        if (WIDGETS[key]) {
          console.warn(`StateManager: WIDGETS.${key} already exists`)
        } else if (!(data[key] instanceof Widget)) {
          console.warn(`StateManager: ignoring ${key}, it's not a Widget`)
        } else {
          WIDGETS[key] = data[key]
          if (WIDGETS[key].key !== key) WIDGETS[key].key = key
          arr.push({ key, ref: WIDGETS[key], visible: false })
        }
      }
      return { type, data: arr }
      // ...
    } else { // single widget (key or reference)
      // OPEN, CLOSE or DELETE
      wig = (typeof data === 'string') ? WIDGETS[data] : data
      key = (typeof data === 'string') ? key : undefined
      // ....ERROR CHECK....
      if (!wig) {
        console.warn(`StateManager: WIDGETS['${data}'], does not exist`)
        return { type, data: [...this.state.widgets] }
      } else if (!(wig instanceof Widget)) {
        console.warn(`StateManager: ignoring "${wig}", it's not a Widget`)
        return { type, data: [...this.state.widgets] }
      }
      if (!key) {
        key = this.state.widgets
          .filter(w => w.ref === wig)
          .map(w => w.key)[0]
      }
      // ....CREATE ACTION....
      wig = this.state.widgets.filter(w => w.ref === wig)[0]
      const arr = this.state.widgets.filter(w => w.key !== key)
      if (type === 'OPEN_WIDGET' || type === 'CLOSE_WIDGET') {
        if (type === 'OPEN_WIDGET') wig.visible = true
        else if (type === 'CLOSE_WIDGET') wig.visible = false
        arr.push(wig)
        return { type, data: arr }
      } else if (type === 'DELETE_WIDGET') {
        delete WIDGETS[key]
      }
      return { type, data: arr }
    }
  }

  toggleMenu (type) {
    if (this.state.menu) return { type, data: false }
    else return { type, data: true }
  }

  updateError (type, data) {
    if (type === 'SHOW_ERROR_ALERT') {
      return {
        type, data: { index: -1, list: data }
      }
    } else if (type === 'SHOW_ERROR_TEXT') {
      return {
        type, data: { index: 0, list: this.state.errors.list }
      }
    } else if (type === 'HIDE_ERROR_ALERT') {
      return {
        type, data: { index: -1, list: this.state.errors.list }
      }
    } else if (type === 'HIDE_ERROR_TEXT') {
      return {
        type, data: { index: -1, list: this.state.errors.list }
      }
    } else if (type === 'CLEAR_ERROR') {
      return {
        type, data: { index: -1, list: [] }
      }
    } else if (type === 'NEXT_ERROR') {
      const i = this.state.errors.index + 1 >= this.state.errors.list.length
        ? 0 : this.state.errors.index + 1
      return {
        type, data: { index: i, list: this.state.errors.list }
      }
    } else if (type === 'PREV_ERROR') {
      const i = this.state.errors.index - 1 < 0
        ? this.state.errors.list.length - 1 : this.state.errors.index - 1
      return {
        type, data: { index: i, list: this.state.errors.list }
      }
    }
  }

  updateTutorial (type, data) {
    if (type === 'TUTORIAL_FINISHED') {
      return {
        type, data: { display: false, id: null, steps: {} }
      }
    } else if (type === 'HIDE_TUTORIAL_TEXT') {
      return { type, data: false }
    } else return { type, data }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // REDUCERS (CREATE NEW STATE OBJECT)

  layout (state, action) {
    if (action.type.includes('_LAYOUT')) return action.data
    else if (this.tutorialActionTypes.includes(action.type)) {
      if (action.type.includes('STEP') || action.type.includes('GOTO')) {
        const layout = this.state.tutorial.steps[action.data].layout
        if (typeof layout === 'string') return layout
        else return state
      } else return state
    } else return state
  }

  opacity (state, action) {
    if (action.type.includes('_OPACITY')) return action.data
    else if (this.tutorialActionTypes.includes(action.type)) {
      if (action.type.includes('STEP') || action.type.includes('GOTO')) {
        const opacity = this.state.tutorial.steps[action.data].opacity
        if (typeof opacity === 'number') return opacity
        else return state
      } else return state
    } else return state
  }

  editable (state, action) {
    if (action.type.includes('_EDITING')) return action.data
    else if (this.tutorialActionTypes.includes(action.type)) {
      if (action.type === 'TUTORIAL_DATA') return action.data.editable
      else if (action.type === 'TUTORIAL_FINISHED') return true
      else if (action.type === 'HIDE_TUTORIAL_TEXT') return true
      else {
        const e = this.state.tutorial.steps[action.data].edit
        if (typeof e === 'boolean') return e
        else return true
      }
    } else return state
  }

  theme (state, action) {
    if (action.type === 'CHANGE_THEME') return action.data.theme
    else return state
  }

  background (state, action) {
    if (action.type === 'CHANGE_THEME') return action.data.background
    else return state
  }

  hash (state, action) {
    if (action.type === 'SHARE_URL') return action.data
    else return state
  }

  widgets (state, action) {
    if (action.type.includes('_WIDGET')) return action.data
    else return state
  }

  menu (state, action) {
    if (action.type === 'TOGGLE_MENU') {
      return action.data
    } else if (this.errorActionTypes.includes(action.type)) {
      if (action.type.includes('SHOW')) return false
      else return state
    } else if (this.eduActionTypes.includes(action.type)) {
      if (action.type.includes('SHOW')) return false
      else return state
    } else if (this.tutorialActionTypes.includes(action.type)) {
      return false
    } else return state
  }

  eduinfo (state, action) {
    state = { ...state } // clone old errors state
    if (action.type === 'TOGGLE_MENU') {
      // if we toggle the menu dismiss any prior edu-info
      return { display: false, payload: null }
    } else if (this.errorActionTypes.includes(action.type)) {
      // if we get an error dismiss any prior edu-info
      return { display: false, payload: null }
    } else if (this.eduActionTypes.includes(action.type)) {
      // if we trigger edu-info set display accordingly
      if (action.type === 'SHOW_EDU_ALERT') {
        return { display: 'alert', payload: action.data }
      } else if (action.type === 'SHOW_EDU_TEXT') {
        return { display: 'text', payload: action.data }
      } else {
        return { display: false, payload: null }
      }
    } else if (this.tutorialActionTypes.includes(action.type)) {
      return { display: false, payload: null }
    } else return state
  }

  errors (state, action) {
    state = { ...state } // clone old errors state
    // ...
    if (action.type === 'TOGGLE_MENU') {
      // if we open the menu, hide errors for now
      if (!this.state.menu) {
        state.display = false
        state.index = -1
      } else { // if we closed the menu...
        if (state.list.length > 0) { // ...&& there are still errors present
          state.display = 'alert' // ...show error alert
          state.index = -1
        }
      }
      return state
    } else if (this.errorActionTypes.includes(action.type)) {
      const d = action.data
      state = { display: false, index: d.index, list: d.list }
      // if we've got new error data from our action
      if (action.type === 'SHOW_ERROR_ALERT') state.display = 'alert'
      else if (action.type === 'SHOW_ERROR_TEXT') state.display = 'text'
      else if (action.type === 'HIDE_ERROR_ALERT') state.display = false
      else if (action.type === 'HIDE_ERROR_TEXT') state.display = 'alert'
      else if (action.type === 'CLEAR_ERROR') state.display = false
      else state.display = 'text' // next or prev
      return state
    } else if (this.eduActionTypes.includes(action.type)) {
      // if we triggered an edu-info event, hide errors for now
      if (action.type.includes('SHOW')) {
        state.display = false
        state.index = -1
      } else if (action.type.includes('HIDE')) { // ...if we hid edu-info
        if (state.list.length > 0) { // ...&& there are still errors present
          state.display = 'alert' // ...show error alert
          state.index = -1
        }
      }
      return state
    } else if (this.tutorialActionTypes.includes(action.type)) {
      // if we triggered a tutorial event, hide errors for now
      state.display = false
      state.index = -1
      return state
    } else return state
  }

  tutorial (state, action) {
    state = { ...state } // clone old errors state
    // ...
    if (action.type === 'TOGGLE_MENU') {
      if (action.data) state.display = false
      else if (state.id !== null) state.display = 'text' // TODO or video?
      return state
    } else if (this.errorActionTypes.includes(action.type) ||
      this.eduActionTypes.includes(action.type)) {
      if (action.type.includes('SHOW')) {
        state.display = false
        return state
      } else if (action.type.includes('HIDE') ||
        action.type.includes('CLEAR')) {
        if (state.id !== null) state.display = 'text' // TODO or video?
        return state
      } else return state
    } else if (this.tutorialActionTypes.includes(action.type)) {
      if (action.type === 'TUTORIAL_DATA') {
        return {
          display: 'text', id: action.data.id, steps: action.data.steps
        }
      } else if (action.type === 'HIDE_TUTORIAL_TEXT') {
        state.display = action.data
        return state
      } else if (action.type === 'TUTORIAL_FINISHED') {
        return action.data
      } else { // NEXT, PREV, GOTO
        state.id = action.data
        if (state.id !== null) state.display = 'text' // TODO or video?
        return state
      }
    } else return state
  }

  rootReducer (state = {}, action) {
    return {
      layout: this.layout(state.layout, action),
      opacity: this.opacity(state.opacity, action),
      editable: this.editable(state.editable, action),
      theme: this.theme(state.theme, action),
      background: this.background(state.background, action),
      hash: this.hash(state.hash, action),
      widgets: this.widgets(state.widgets, action),
      menu: this.menu(state.menu, action),
      eduinfo: this.eduinfo(state.eduinfo, action),
      errors: this.errors(state.errors, action),
      tutorial: this.tutorial(state.tutorial, action)
    }
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // RE-RENDER VIEW AFTER STATE CHANGES

  getTransitionTime () {
    const t = window.getComputedStyle(document.documentElement)
      .getPropertyValue('--menu-fades-time')
    return t.includes('ms') ? parseInt(t) : parseInt(t) * 1000
  }

  resetErrorMarkers () {
    if (this.is('SHOWING_ERROR')) {
      NNE.marker(null)
      NNE.highlight(null)
      const idx = this.state.errors.index >= 0 ? this.state.errors.index : 0
      const line = this.state.errors.list[idx].line
      const col = this.state.errors.list[idx].col
      const clrz = this.state.errors.list[idx].colors
      NNE.marker(line, clrz[0])
      if (this.is('SHOWING_ERROR_TEXT')) NNE.highlight(line, col, clrz[1])
      else NNE.highlight(null)
    } else {
      NNE.marker(null)
      NNE.highlight(null)
    }
  }

  renderMenuManager () {
    if (!this.is('SHOWING')) { // if nothing should be showing...
      // ...hide anything that was previously being shown.
      if (NNM.opened === 'mis') NNM.hideMenu()
      else if (NNM.opened === 'ais') NNM.hideAlert()
      else if (NNM.opened === 'tis') NNM.hideTextBubble()
    } else if (this.is('SHOWING_MENU')) { // if menu should be showing...
      if (NNM.opened) { // ...but something else is, hide that first,
        if (NNM.opened === 'ais') NNM.hideAlert()
        else if (NNM.opened === 'tis') NNM.hideTextBubble()
        // ...wait for hiding transition to finish before showing menu
        const tt = this.getTransitionTime()
        setTimeout(() => NNM.showMenu(), tt)
      } else { // ...if nothing was previously showing, show the menu.
        NNM.showMenu()
      }
    } else if (this.is('SHOWING_ALERT')) { // if an alert should be showing...
      const idx = this.state.errors.index >= 0
        ? this.state.errors.index : 0
      const data = this.is('SHOWING_ERROR_ALERT')
        ? this.state.errors.list[idx] : this.state.eduinfo.payload
      const type = this.is('SHOWING_ERROR_ALERT') ? data.type : 'information'
      if (NNM.opened) { // ...but something else is, hide that first,
        if (NNM.opened === 'mis') NNM.hideMenu()
        else if (NNM.opened === 'ais') NNM.hideAlert()
        else if (NNM.opened === 'tis') NNM.hideTextBubble()
        // ...wait for hiding transition to finish before showing menu
        const tt = this.getTransitionTime()
        setTimeout(() => NNM.showAlert(type, data), tt)
      } else { // ...if nothing was previously showing, show the alert.
        NNM.showAlert(type, data)
      }
    } else if (this.is('SHOWING_TEXT')) { // if a text should be showing...
      const tut = this.state.tutorial.id
      const idx = this.state.errors.index >= 0
        ? this.state.errors.index : 0
      const data = this.is('SHOWING_ERROR_TEXT')
        ? this.state.errors.list[idx] : this.is('SHOWING_EDU_TEXT')
          ? this.state.eduinfo.payload : this.state.tutorial.steps[tut]
      if (NNM.opened) { // ...but something else is, hide that first,
        if (NNM.opened === 'mis') NNM.hideMenu()
        else if (NNM.opened === 'ais') NNM.hideAlert()
        else if (NNM.opened === 'tis') NNM.hideTextBubble()
        // ...wait for hiding transition to finish before showing menu
        const tt = this.getTransitionTime()
        setTimeout(() => NNM.showTextBubble(data), tt)
      } else { // ...if nothing was previously showing, show the alert.
        NNM.showTextBubble(data)
      }
    }
  }

  renderWindowManager () {
    const s = this.state
    if (s.layout !== NNW.layout) {
      if (this.holding) return
      this.holding = true
      if (NNM.opened) NNM.fadeOut()
      NNW.layout = this.state.layout
      NNW._whenCSSTransitionFinished(() => {
        this.holding = false
        this.renderNetitor()
        NNM.fadeIn()
      })
    }
    if (s.opacity !== NNW.opacity) {
      NNW.opacity = this.state.opacity
    }
  }

  renderNetitor (change) {
    const s = this.state
    const t = s.tutorial.id !== null ? s.tutorial.steps[s.tutorial.id] : null
    if (change && change.includes('hash')) {
      NNE.saveToHash()
    }
    if (s.theme !== NNE.theme) {
      NNW.updateTheme(this.state.theme, this.state.background)
    }
    if (s.editable === NNE.cm.getOption('readOnly')) {
      NNE.cm.setOption('readOnly', !this.state.editable)
    }
    if (t && t.highlight) {
      if (typeof t.highlight === 'object') NNE.highlight(t.highlight)
      else NNE.highlight(t.highlight, '#81c99444')
    }
  }

  renderWidgets () {
    this.state.widgets.forEach(w => {
      if (w.visible) w.ref._display('block')
      else w.ref._display('none')
    })
  }

  render (change) {
    if (change.includes('netitor')) {
      this.renderNetitor(change)
    } else if (change === 'window') {
      this.renderWindowManager()
    } else if (change === 'widgets') {
      this.renderWidgets()
    } else if (change === 'netnet') {
      this.renderMenuManager()
      this.resetErrorMarkers()
    } else if (change === 'tutorial') {
      this.renderMenuManager()
      this.resetErrorMarkers()
      this.renderWindowManager()
      this.renderNetitor()
    }
  }
}

window.StateManager = StateManager
