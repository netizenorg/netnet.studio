/* global STORE */
class NetitorEduInfoHandler {
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
  // edu-info

  static htmlEduInfo (eve) {
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

  static cssEduInfo (eve) {
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

  static jsEduInfo (eve) {
    const status = (eve.nfo.status && eve.nfo.status !== 'standard')
      ? `. (<b>NOTE</b>: this CSS feature is ${eve.nfo.status}). ` : ''

    return `
        <h1>${eve.nfo.keyword.html}</h1>
        <p>${eve.nfo.description.html} ${status}</p>
      `
  }

  static parse (eve) {
    if (!eve.nfo) return null // TODO handle these differently?

    let cnt
    if (eve.language === 'html') cnt = this.htmlEduInfo(eve)
    else if (eve.language === 'css') cnt = this.cssEduInfo(eve)
    else if (eve.language === 'javascript') cnt = this.jsEduInfo(eve)

    return {
      content: cnt,
      options: {
        ok: () => { STORE.dispatch('HIDE_EDU_TEXT') }
      }
    }
  }
}

window.NetitorEduInfoHandler = NetitorEduInfoHandler
