/* global STORE, NNE */
class NetitorErrorHandler {
  // NOTE: if we decide to create higher-level error logic, for example
  // infering a higher level error based on a particular set of errors
  // that show up in the error array (like miss / in closing <tag>),
  // then we'll need tow work that logic into this handler

  static ignore (err) {
    function confirmed () {
      const errExcStr = JSON.stringify(NNE._errExceptions)
      window.localStorage.setItem('error-exceptions', errExcStr)
      STORE.dispatch('SHOW_EDU_TEXT', {
        content: 'Ok, that\'s the last time I\'ll <i>bug</i> you about it. If you change your mind later you can always run <code>resetErrors()</code> in the Functions Menu.',
        options: { cool: () => STORE.dispatch('CLEAR_ERROR') }
      })
    }
    STORE.dispatch('SHOW_EDU_TEXT', {
      content: 'Are you sure you want me to ignore this type of error from now on?',
      options: {
        Yes: () => {
          const time = STORE.getTransitionTime()
          NNE.addErrorException(err)
          STORE.dispatch('CLEAR_ERROR')
          setTimeout(() => confirmed(), time)
        },
        No: () => STORE.dispatch('HIDE_EDU_TEXT')
      }
    })
  }

  static createErrorOpts (i, arr) {
    if (arr.length > 1) {
      if (i === 0) {
        return {
          'ok, i\'ll fix it.': () => STORE.dispatch('HIDE_ERROR_TEXT'),
          'notice something else?': () => STORE.dispatch('NEXT_ERROR'),
          'ignore this error': () => NetitorErrorHandler.ignore(arr[i])
        }
      } else if (i === arr.length - 1) {
        return {
          'ok, i\'ll fix it.': () => STORE.dispatch('HIDE_ERROR_TEXT'),
          'wait, go back': () => STORE.dispatch('PREV_ERROR'),
          'ignore this error': () => NetitorErrorHandler.ignore(arr[i])
        }
      } else {
        return {
          'ok, i\'ll fix it.': () => STORE.dispatch('HIDE_ERROR_TEXT'),
          'wait, go back': () => STORE.dispatch('PREV_ERROR'),
          'notice something else?': () => STORE.dispatch('NEXT_ERROR'),
          'ignore this error': () => NetitorErrorHandler.ignore(arr[i])
        }
      }
    } else {
      return {
        'ok, i\'ll fix it.': () => STORE.dispatch('HIDE_ERROR_TEXT'),
        'ignore this error': () => NetitorErrorHandler.ignore(arr[i])
      }
    }
  }

  static parse (eve) {
    // if we're using a-frame, filter out any edge-case errors (>_<)
    const initLength = eve.length
    if (window.utils._libs.includes('aframe')) {
      eve = eve.filter(() => {
        const x = '{"rule":{"id":"attr-whitespace","description":"All attributes should be separated by only one space and not have leading/trailing whitespace.","link":"https://github.com/thedaviddias/HTMLHint/wiki/attr-whitespace"},"message":"The attributes of [ animation ] must be separated by only one space."}'
        const y = JSON.stringify({ rule: eve[0].rule, message: eve[0].message })
        return NNE._compareTwoStrings(x, y) < 0.9
      })
    }

    if (eve.length > 0) {
      // check for errors caused by a-frame custom elements......
      const ce = eve.filter(e => e.rule.id === 'standard-elements')
      if (ce.length > 0 && !window.utils._libs.includes('aframe')) {
        const lib = window.utils.checkForLibs('aframe', eve[0])
        if (lib) return
      } // .......................................................

      return eve.map((err, i) => {
        const markerColor = err.type === 'error' ? 'red' : 'yellow'
        const highlightColor = err.type === 'error'
          ? 'rgba(255,0,0,0.25)' : 'rgba(255, 255, 0, 0.25)'
        /*
        // was dynamically assigning col value, but the number netitor
        // returns for column error is not super accurate,
        // so not using this code until that can be improved in netitor
        const code = NNE.code.split('\n')[err.line - 1]
        const column = code.length <= err.col
          ? 0 : typeof err.col === 'number' ? err.col : 0
        */
        return {
          line: err.line,
          col: 0,
          type: err.type,
          content: err.friendly || err.message,
          options: NetitorErrorHandler.createErrorOpts(i, eve),
          langauge: err.language,
          colors: [markerColor, highlightColor]
        }
      })
    } else {
      // netitor won't update if it found a-frame errors (even if we rmv'd those
      // errors here) so i'm reproducing the netitors _update logic here
      if (initLength > 0 && window.utils._libs.includes('aframe')) {
        const h = document.querySelector('.CodeMirror-hints')
        if (NNE._auto && !h) NNE.update()
      } // .......................................................

      return null
    }
  }
}

window.NetitorErrorHandler = NetitorErrorHandler
