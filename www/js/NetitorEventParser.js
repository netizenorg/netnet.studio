/* global NNM, NNE */
const NetitorEventParser = {}

NetitorEventParser.js = function (eve) {
  const status = (eve.nfo.status && eve.nfo.status !== 'standard')
    ? `. (<b>NOTE</b>: this CSS feature is ${eve.nfo.status}). ` : ''

  return `
      <h1>${eve.nfo.keyword.html}</h1>
      <p>${eve.nfo.description.html} ${status}</p>
    `
}

NetitorEventParser.html = function (eve) {
  const type = (typeof eve.nfo.singleton === 'boolean')
    ? 'element' : 'attribute'
  const note = eve.nfo.note
    ? eve.nfo.note.html
    : (eve.nfo.status && eve.nfo.status !== 'standard')
      ? `This ${type} is ${eve.nfo.status}. ` : ''

  return `
    <h1>${eve.nfo.keyword.html}</h1>
    <p>${eve.nfo.description.html} ${note}</p>
  `
}

NetitorEventParser.css = function (eve) {
  const status = (eve.nfo.status && eve.nfo.status !== 'standard')
    ? `. (<b>NOTE</b>: this CSS feature is ${eve.nfo.status}). ` : ''

  let links = '' // css properties have multiple reference URLs
  if (eve.nfo.urls) {
    links = Object.keys(eve.nfo.urls)
      .map(k => `<a href="${eve.nfo.urls[k]}" target="_blank">${k}</a>`)
    if (links.length > 0) {
      links = `To learn more visit ${links.join(', ').slice(0, -2)}.`
    }
  }

  return `
    <h1>${eve.nfo.keyword.html}</h1>
    <p>${eve.nfo.description.html} ${status} ${links}</p>
  `
}

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•* used to return markup to display in netnet's textbubble when a
// •.¸¸¸.•* user double clicks a piece of syntax they want to learn more about
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

NetitorEventParser.toHTMLStr = function (eve) {
  if (eve.language === 'html') return NetitorEventParser.html(eve)
  else if (eve.language === 'css') return NetitorEventParser.css(eve)
  else if (eve.language === 'javascript') return NetitorEventParser.js(eve)
}

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•* used to return markup to display in netnet's textbubble when a
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸. the netitor contains an error or warning
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

NetitorEventParser.toContentArray = function (eve) {
  return eve.map((err, i) => {
    let clr = err.type === 'error' ? 'red' : 'yellow'
    clr = err.type === 'error' ? 'rgba(255,0,0,0.25)' : 'rgba(255, 255, 0, 0.25)'
    const opts = {
      'ok i\'ll fix it': () => {
        NNM.hideTextBubble()
        NNE.highlight(0)
      }
    }
    if (eve.length > 1) {
      const last = eve.length - 1
      if (i < last) opts['could it be something else?'] = (e) => { e.next() }
      if (i > 0) opts['let me see that last one again?'] = (e) => { e.prev() }
    }
    return {
      content: err.friendly || err.message,
      highlight: err.line,
      highlightColor: clr,
      type: err.type,
      options: opts
    }
  })
}

window.NetitorEventParser = NetitorEventParser
