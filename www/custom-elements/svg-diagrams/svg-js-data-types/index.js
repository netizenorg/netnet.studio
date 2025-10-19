/* global HTMLElement */
class SvgJsDataTypes extends HTMLElement {
  connectedCallback (opts) {
    if (!this.c) this.c = []
    this.updateHTML()
  }

  updateHTML () {
    this.innerHTML = `
    <link rel="stylesheet" href="/core/styles/fonts.css">
  <svg
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 35"
    style="width:100%;display:block;border:none;">
  <text
    x="36"
    y="3"
    font-family="fira-sans-regular, sans-serif"
    font-size="3"
    fill="${this.c[1]}">
    JavaScript Data Types
  </text>
  <path
    d="M50,7.25 h-22.5 M50,7.25 v-3 M50,7.25 h19"
    fill="none"
    stroke="${this.c[0]}"
    stroke-width="0.1"
    stroke-linecap="butt"
    stroke-linejoin="miter">
  </path>
  <text
    x="15"
    y="8"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[2]}">
    primitives
  </text>
  <path
    d="M20.5,11 h-10 v2 M20.5,11 v-2 M20.5,11 h15 v 2"
    fill="none"
    stroke="${this.c[0]}"
    stroke-width="0.1"
    stroke-linecap="butt"
    stroke-linejoin="miter">
  </path>
  <text
    x="2"
    y="15.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[2]}">
    number-types
  </text>
  <text
    x="28"
    y="15.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[2]}">
    non-numbers
  </text>
  <path
    d="M10.5,16.5 v2"
    fill="none"
    stroke="${this.c[0]}"
    stroke-width="0.1"
    stroke-linecap="butt"
    stroke-linejoin="miter">
  </path>
  <text
    x="5"
    y="21.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[3]}">
    "number"
  </text>
  <text
    x="5"
    y="24.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[3]}">
    "bigint"
  </text>

  <text
    x="5"
    y="21.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[3]}">
    "number"
  </text>
  <text
    x="5"
    y="24.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[3]}">
    "bigint"
  </text>
  <path
    d="M35.5,16.5 v2"
    fill="none"
    stroke="${this.c[0]}"
    stroke-width="0.1"
    stroke-linecap="butt"
    stroke-linejoin="miter">
  </path>
  <text
    x="28"
    y="21.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[3]}">
    "undefined"
  </text>
  <text
    x="28"
    y="24.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[3]}">
    "boolean"
  </text>
  <text
    x="28"
    y="27.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[3]}">
    "string"
  </text>
  <text
    x="28"
    y="30.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[3]}">
    "symbol"
  </text>
  <text
    x="28"
    y="33.5"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[4]}"> null
  </text>

  <path
    d="M35,33 h6"
    fill="none"
    stroke="${this.c[4]}"
    stroke-dasharray="1"
    stroke-width="0.1"
    stroke-linecap="butt"
    stroke-linejoin="miter">
  </path>
  <text
    x="40.5"
    y="33.5"
    font-style="italic"
    font-family="fira-sans-regular, sans-serif"
    font-size="2"
    fill="${this.c[4]}">
    special case
  </text>
  <path
    d="M52.5,33 h5 v-20 h14"
    fill="none"
    stroke="${this.c[4]}"
    stroke-dasharray="1"
    stroke-width="0.1"
    stroke-linecap="butt"
    stroke-linejoin="miter">
  </path>
  <text
    x="70"
    y="8"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[2]}">
    non-primitive
  </text>
  <path
    d="M78,9 v2"
    fill="none"
    stroke="${this.c[0]}"
    stroke-width="0.1"
    stroke-linecap="butt"
    stroke-linejoin="miter">
  </path>
  <text
    x="73"
    y="14"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[3]}">
    "object"
  </text>
  <text
    x="73"
    y="17"
    font-family="fira-sans-regular, sans-serif"
    font-size="2.5"
    fill="${this.c[3]}">
    "function"
  </text>
  <text
    x="85"
    y="17"
    font-family="fira-sans-regular, sans-serif"
    font-size="3.5"
    fill="${this.c[4]}">
    *
  </text>
  </svg>
    `
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

window.customElements.define('svg-js-data-types', SvgJsDataTypes)
