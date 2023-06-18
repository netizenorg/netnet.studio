/* global HTMLElement NNE */
/*

  <svg-template colors="red,green,blue"></svg-template>

  This file is used as a template for creating other custom svg elements which
  update their colors when netnet's theme colors change. Make sure you rename
  the class "SvgTemplate" at the top and botom of this file, as well as rename
  the custtom element itself 'svg-template' to something specific.

*/
class SvgTemplate extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    // replace any references to colors in the SVG markup with colors passed to
    // this element's "colors" attribute which can be accessed via this.c like:
    // ${this.c[0]} ... ${this.c[1]} ...etc...
    this.innerHTML = `[YOUR SVG CODE HERE]`
  }

  get colors () {
    return this.c
  }

  set colors (val) {
    if (val instanceof Array) val = val.join(',')
    this.setAttribute('colors', val)
    this.c = val.split(',')
    this.updateHTML()
  }

  static get observedAttributes () {
    return ['colors']
  }

  attributeChangedCallback (attrName, oldVal, newVal) {
    if (newVal !== oldVal) this[attrName] = newVal
  }
}

window.customElements.define('svg-template', SvgTemplate)
