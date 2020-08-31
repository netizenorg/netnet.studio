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
    if (eve.length > 0) {
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
    } else return null
  }
}

window.NetitorErrorHandler = NetitorErrorHandler
