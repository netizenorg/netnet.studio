/* global Widget, Convo, nn, NNW, utils, WIDGETS, NNE */
class JsReference extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'js-reference'
    // this.listed = true
    this.keywords = ['js', 'javascript', 'reference'] // TODO add cheatsheets when finsihed
    this.resizable = false

    this.title = 'JavaScript Reference Docs'

    // this.on('close', () => { this.slide.updateSlide(this.mainOpts) })
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    utils.get('./widgets/js-reference/data/edu-supplement.json', (json) => {
      if (json.success === false) return utils._Convo('oh-no-error', json)
      this.data = json
    })

    utils.get('./widgets/js-reference/data/basic-examples.json', (json) => {
      if (json.success === false) return utils._Convo('oh-no-error', json)
      this.exBasic = json // TODO: maybe other json files for other lessons?
    })

    utils.get('./widgets/js-reference/data/main-slide.html', (html) => {
      const div = nn.create('div').content(html)

      const updateSlide = opts => {
        this._lastScrollTop = this.slide.scrollTop
        this.slide.updateSlide(opts)
      }

      div.get('.js-reference-widget--intro-btn')
        .addEventListener('click', () => this.toggleIntroPresentation())

      div.getAll('[name="data-types"]').forEach(ele => {
        ele.on('click', () => updateSlide(this.dataTypesOpts))
      })
      div.getAll('[name="data-structs"]').forEach(ele => {
        ele.on('click', () => updateSlide(this.dataStructOpts))
      })
      div.getAll('[name="deeper-funcs"]').forEach(ele => {
        ele.on('click', () => updateSlide(this.deeperFuncsOpts))
      })
      div.getAll('[name="apis-and-libs"]').forEach(ele => {
        ele.on('click', () => updateSlide(this.apisAndLibsOpts))
      })

      this.mainOpts = {
        name: 'js-reference-main',
        widget: this,
        cb: async () => {
          if (this._lastScrollTop) {
            this.slide.scrollTop = this._lastScrollTop
          }
        },
        ele: div
      }

      this._createHTML(div)

      NNW.on('theme-change', () => { this._createHTML(div) })
    }, true)

    this.on('open', () => {
      this.slide.scrollTop = 0
    })

    // NNW.on('theme-change', () => { this._createHTML() })
  }

  toggleIntroPresentation () {
    if (WIDGETS['hyper-video-player']?.opened) {
      WIDGETS['hyper-video-player'].close()
    }

    const isStarterCode = NNE.code === utils.starterCode()
    if (isStarterCode) return this._toggleIntroPresentation()

    if (WIDGETS['project-files']?.projectData.name) {
      window.convo = new Convo(this.convos, 'confirm-start')
      return
    }

    const workingOnDemoOrTemplate = typeof utils.url.demo === 'string' ||
      typeof utils.url.template === 'string'
    if (workingOnDemoOrTemplate) {
      window.convo = new Convo(this.convos, 'confirm-start')
      return
    }

    this._toggleIntroPresentation()
  }

  openDocs (opt, anchor) {
    if (!this.opened) this.open()
    const dict = {
      'data-types': 'dataTypesOpts',
      'data-structures': 'dataStructOpts',
      functions: 'deeperFuncsOpts',
      libraries: 'apisAndLibsOpts',
      intro: 'introPresOpts'
    }
    this._lastScrollTop = this.slide.scrollTop
    const name = dict[opt] || opt
    this.slide.updateSlide(this[name], anchor)
  }

  textBubble (eve) {
    if (!eve) return

    // check if this is a JS string literal containing a color value
    const raw = eve.data || ''
    const quotedMatch = /^(['"`])(.*)\1$/.exec(raw)
    if (quotedMatch) {
      const inner = quotedMatch[2].trim()
      const c = nn.colorMatch(inner.toLowerCase())
      const k = NNE.edu.css.colors[inner.toLowerCase()]
      if (c || k) return this._colorStringBubble(inner, c, k)
    }

    if (!eve.nfo) return

    const keywordMap = {
      variable: () => this.openDocs('mainOpts', 'variables'),
      string: () => this.openDocs('mainOpts', 'variables'),
      var: () => this.openDocs('mainOpts', 'variables'),
      const: () => this.openDocs('mainOpts', 'variables'),
      let: () => this.openDocs('mainOpts', 'variables'),
      function: () => this.openDocs('mainOpts', 'functions'),
      if: () => this.openDocs('mainOpts', 'conditionals'),
      for: () => this.openDocs('mainOpts', 'for-loop'),
      while: () => this.openDocs('mainOpts', 'loops'),
      'Arrow function expression': () => this.openDocs('deeperFuncsOpts'),
      Array: () => this.openDocs('dataStructOpts', 'arrays'),
      parentheses: () => this.openDocs('mainOpts', 'functions'),
      Object: () => this.openDocs('mainOpts', 'functions')
    }

    // add extra text to nn methods info
    if (eve.nfo?.note === 'nn' && !this.data[eve.data]) {
      this.data[eve.data] = {
        extra: ' This is part of the <a href="https://netizenorg.github.io/netnet-standard-library/" target="_blank">nn library</a>, so make sure you\'ve added it.'
      }
    }

    const more = () => {
      const specialCase = keywordMap[eve.nfo?.keyword?.text]
      if (specialCase) return specialCase()

      const url = eve.nfo.url
      const a = document.createElement('a')
      a.setAttribute('download', 'index.html')
      a.setAttribute('href', url)
      a.setAttribute('target', '_blank')
      a.click()
      a.remove()
    }

    const options = {
      'tell me more': () => more(),
      ok: (e) => { e.hide() }
    }

    const eduSup = this.data[eve.data] || this.data[eve.nfo?.keyword?.text]
    const content = (eduSup && eduSup.bubble)
      ? `<p>${eduSup.bubble}</p>`
      : (eduSup && eduSup.extra)
        ? `<p>${eve.nfo.description.html}${eduSup.extra}</p>`
        : `<p>${eve.nfo.description.html}</p>`

    // TODO: update HTML to display corresponding cheatsheet

    window.convo = new Convo({ content, options }, null, true)
  }

  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.••.¸¸¸.•*• private methods
  // •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

  async _createHTML (div) {
    if (!utils.customElementReady('widget-slide') || !utils.customElementReady('code-sample') || !utils.customElementReady('code-trace')) {
      setTimeout(() => this._createHTML(div), 100)
      return
    }

    this.slide = document.createElement('widget-slide')
    this.innerHTML = this.slide

    this.ele.querySelector('.widget__top').style.padding = '0px 15px 0px'
    this.ele.querySelector('.widget__inner-html').style.padding = '10px 0px'

    // initiate main slide
    this.slide.updateSlide(this.mainOpts)
    this._loadCodeExamples('main', div)

    // create sub pages
    const html0 = await utils.getSync('./widgets/js-reference/data/data-types.html', true)
    const sub0 = nn.create('div').content(html0)
    this.dataTypesOpts = {
      name: 'js-reference-data-types',
      widget: this,
      back: this.mainOpts,
      cb: async () => {
        await nn.sleep(utils.getVal('--menu-fades-time'))
        this._loadCodeExamples('data-types', sub0)
        sub0.querySelector('[name="data-structs"]')
          .addEventListener('click', () => this.openDocs('dataStructOpts'))
        sub0.querySelector('[name="more-funcs"]')
          .addEventListener('click', () => this.openDocs('mainOpts', 'functions'))
      },
      ele: sub0
    }

    const html1 = await utils.getSync('./widgets/js-reference/data/data-structs.html', true)
    const sub1 = nn.create('div').content(html1)
    this.dataStructOpts = {
      name: 'js-reference-data-structs',
      widget: this,
      back: this.mainOpts,
      cb: async () => {
        await nn.sleep(utils.getVal('--menu-fades-time'))
        this._loadCodeExamples('data-structs', sub1)
      },
      ele: sub1
    }

    const html2 = await utils.getSync('./widgets/js-reference/data/deeper-funcs.html', true)
    const sub2 = nn.create('div').content(html2)
    this.deeperFuncsOpts = {
      name: 'js-reference-deeper-funcs',
      widget: this,
      back: this.mainOpts,
      cb: async () => {
        await nn.sleep(utils.getVal('--menu-fades-time'))
        this._loadCodeExamples('deeper-funcs', sub2)
        sub2.querySelector('[name="intro-funcs"]')
          .addEventListener('click', () => this.openDocs('mainOpts', 'functions'))
      },
      ele: sub2
    }

    const html3 = await utils.getSync('./widgets/js-reference/data/apis-and-libs.html', true)
    const sub3 = nn.create('div').content(html3)
    this.apisAndLibsOpts = {
      name: 'js-reference-apis-and-libs',
      widget: this,
      back: this.mainOpts,
      ele: sub3
    }

    const html4 = await utils.getSync('./widgets/js-reference/data/intro-pres.html', true)
    const sub4 = nn.create('div').content(html4)
    this.introPresOpts = {
      name: 'js-reference-intro-pres',
      widget: this,
      back: this.mainOpts,
      ele: sub4,
      onBack: () => this._toggleIntroPresentation(true),
      cb: async () => {
        await nn.sleep(utils.getVal('--menu-fades-time'))
        this._setupTraceExamplesEvents()
      }
    }
  }

  async _toggleIntroPresentation (calledOnBack) {
    const inPresentation = this.slide.getAttribute('name') === 'js-reference-intro-pres'
    if (inPresentation) {
      if (!calledOnBack) this.slide.updateSlide(this.mainOpts)
      window.convo.hide()
    } else {
      utils.cancelAllNetitorUses('js-reference')
      window.convo = new Convo(this.convos, 'start-guide')
      this.slide.updateSlide(this.introPresOpts)
      await nn.sleep(500)
      this._displayTraceExample('variables', 'var')
    }
  }

  _displayTraceExample (concept, key) {
    // TODO: maybe other lessons beyond "Basic", ex: data structures
    const ex = this.exBasic[concept][key]
    this.$('code-trace').code = ex.code
    if (ex.convo) this.$('code-trace').dataset.convo = ex.convo
    else delete this.$('code-trace').dataset.convo
    this.$('code-trace').dataset.concept = concept
    this.$('code-trace').dataset.key = key
    this.$('.js-reference-widget--console').style.color = 'var(--netizen-meta)'
    this.$('.js-reference-widget--console').innerHTML = '...'
  }

  _setupTraceExamplesEvents () {
    this.$('[name="run-code"]').addEventListener('click', () => {
      window.convo.hide()
      const check = this.$('code-trace').check()
      const key = this.$('code-trace').dataset.key
      const concept = this.$('code-trace').dataset.concept
      const ex = this.exBasic[concept][key]
      if (!check.matched) {
        this.$('code-trace').showDiff('rgba(255, 0, 0, 0.4)')
        this.$('.js-reference-widget--console').style.color = 'red'
        this.$('.js-reference-widget--console').innerHTML = 'error (try again)'
        if (!check.overlayCode) window.convo = new Convo(this.convos, 'no-code')
        else window.convo = new Convo(this.convos, 'code-error')
      } else {
        this.$('code-trace').clearDiff()
        if (ex.output) {
          this.$('.js-reference-widget--console').style.color = 'var(--netizen-meta)'
          this.$('.js-reference-widget--console').innerHTML = ex.output
        } else {
          this.$('.js-reference-widget--console').style.color = 'var(--netizen-meta)'
          this.$('.js-reference-widget--console').innerHTML = 'correct (nothing to output)'
        }
      }
    })
    this.$('[name="explain-code"]').addEventListener('click', () => {
      const convo = this.$('code-trace').dataset.convo
      const key = this.$('code-trace').dataset.key
      window.convo = new Convo(this.convos, convo || key)
    })
    this.$('[name="js-ref-concept-drop-down"]').addEventListener('change', () => {
      const c = this.$('[name="js-ref-concept-drop-down"]').value
      const keys = Object.keys(this.exBasic[c])
      nn.get('[name="js-ref-example-drop-down"]').innerHTML = ''
      nn.get('[name="js-ref-example-drop-down"]').set('options', keys)
      this._displayTraceExample(c, keys[0])
      const convo = this.$('code-trace').dataset.convo
      window.convo = new Convo(this.convos, convo || keys[0])
    })
    this.$('[name="js-ref-example-drop-down"]').addEventListener('change', () => {
      const concept = this.$('[name="js-ref-concept-drop-down"]').value
      const key = nn.get('[name="js-ref-example-drop-down"]').value
      this._displayTraceExample(concept, key)
      const convo = this.$('code-trace').dataset.convo
      window.convo = new Convo(this.convos, convo || key)
    })
  }

  _colorStringBubble (val, c, k) {
    const r = { hex: null, rgb: null, hsl: null }
    let type, alpha

    if (k) {
      type = 'keyword'
      r.hex = k.hex
      r.rgb = k.rgb
      const hsl = nn.toHSL(k.hex)
      r.hsl = `hsl(${hsl.h}, ${hsl.s}, ${hsl.l})`
    } else {
      type = c[0]
      if (type === 'hex') {
        r.hex = c[1].length > 7 ? c[1].substring(0, 7) : c[1]
        alpha = c[1].length === 9 ? c[1].substring(7) : c[1].length === 5 ? c[1].substring(4) : null
      } else if (type === 'rgb' || type === 'rgba') {
        r.hex = nn.toHex({ r: parseInt(c[2]), g: parseInt(c[3]), b: parseInt(c[4]) })
        alpha = c[5] || null
      } else if (type === 'hsl' || type === 'hsla') {
        r.hex = nn.toHex({ h: parseInt(c[2]), s: parseInt(c[3]), l: parseInt(c[4]) })
        alpha = c[5] || null
      }

      const rgb = nn.toRGB(r.hex)
      r.rgb = alpha
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
        : `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`

      const hsl = nn.toHSL(r.hex)
      r.hsl = alpha
        ? `hsla(${hsl.h}, ${hsl.s}, ${hsl.l}, ${alpha})`
        : `hsl(${hsl.h}, ${hsl.s}, ${hsl.l})`
    }

    const clrURL = {
      keyword: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#Color_keywords',
      rgb: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#RGB_colors',
      rgba: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#RGB_colors',
      hsl: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#HSL_colors',
      hsla: 'https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#HSL_colors',
      hex: 'https://www.w3schools.com/colors/colors_hexadecimal.asp'
    }

    let clr = '<span style="color: hsl(0, 80%, 68%);">C</span><span style="color: hsl(62, 80%, 68%);">O</span><span style="color: hsl(120, 80%, 68%);">L</span><span style="color: hsl(239, 80%, 68%);">O</span>'
    clr += '<span style="color: hsl(296, 80%, 68%);">R</span>'

    let s = `<p>This is a ${clr} code, `
    s += (type === 'keyword')
      ? `this specific color <code>${val}</code> is defined using a color <a href="${clrURL[type]}" target="_blank">${type}</a>.`
      : `this specific color <code>${val}</code> is defined using ${type === 'hex' ? 'a' : 'an'} <a href="${clrURL[type]}" target="_blank">${type}</a> color ${type === 'hex' ? 'code' : '<a href="https://css-tricks.com/complete-guide-to-css-functions/#aa-color-functions" target="_blank">function</a>'}.`

    const ix = `written as a <i>hex</i> code it would be <code>${r.hex}</code>`
    const ir = `written as an <i>rgb</i> code it would be <code>${r.rgb}</code>`
    const ih = `written as an <i>hsl</i> code it would be <code>${r.hsl}</code>`

    if (type === 'keyword') s += ` If this were ${ix}, ${ir}, ${ih}.</p>`
    else if (type === 'hex') s += ` If this were ${ir}, ${ih}.</p>`
    else if (type === 'rgb' || type === 'rgba') s += ` If this were ${ix}, ${ih}.</p>`
    else if (type === 'hsl' || type === 'hsla') s += ` If this were ${ix}, ${ir}.</p>`

    if (type === 'hex') {
      setTimeout(() => {
        const from = NNE.cm.getCursor('from')
        const to = NNE.cm.getCursor('to')
        const line = NNE.cm.getLine(from.line)
        if (line[from.ch - 1] === '#') {
          NNE.cm.setSelection({ line: from.line, ch: from.ch - 1 }, to)
        }
      }, 100)
    }

    window.convo = new Convo({
      content: s,
      options: {
        'open Color Widget': () => WIDGETS.open('color-widget'),
        ok: (e) => { e.hide() }
      }
    }, null, true)
  }

  _loadCodeExamples (type, ele) {
    if (type === 'main') {
      const examples = [
`let i = 100
i = i * 2
i = i + 1`,
'print()',
`const user = 'Ada Lovelace'
alert(user)`,
`function square (x) {
  return x * x
}

const area = square(5)
alert(area)`,
`let score = 4

if (score > 7) {
  alert('Good job!')
} else if (score > 3) {
  alert('Not bad!')
} else {
  alert('Try again!')
}`,
`let x = 0

while (x < 5) {
  x++
}

alert('x is now ' + x)`,
`let total = 0

for (let i = 1; i <= 5; i++) {
  total = total + i
}

alert('The total is ' + total)`,
'<button onclick="alert(\'Hi!\')"> hello </button>',
`<script>
  alert('Hi!')
</script>`,
'<script src="main.js"></script>',
`const first = ""
const second = "hello"
if (first) { // empty strings are "falsey"
  alert('hello first!')
} else if (second) { // strings are "truthy"
  alert('hello second!')
}`
      ]

      examples.forEach((ex, i) => {
        const lang = i > 6 && i <= 9 ? 'htmlmixed' : 'javascript'
        ele.querySelector(`[name="js-ex-${i}"]`).updateExample(ex, lang)
      })
    } else if (type === 'data-structs') {
      const examples = [
`const a = {}
alert(typeof b)`,
`const b = new Object()
alert(typeof b)`,
`const a = { name: 'Nick', height: 5.92 }
alert(a.name)
`,
`const a = { name: 'Nick', height: 5.92 }
alert(a['height'])

const prop = 'height'
alert(a[prop])
`,
`const person = { name: 'Nick', height: 5.92 }
person.name = 'Nicholas'
alert(person.name)

// this will remove the property
// after we alert it
delete person.name
`,
`const person = {
  firstName: 'Nick',
  lastName: 'Briz',
  height: 5.92,
  sleeping: false,
  location: {
    birth: 'Miami',
    current: 'Chicago'
  }
}

alert(person.location.current)`,
`const person = {
  firstName: 'Nick',
  lastName: 'Briz',
  height: 5.92,
  sleeping: false,
  location: {
    birth: 'Miami',
    current: 'Chicago'
  },
  sing: function () {
    alert('la la la la la')
  }
}

person.sing()`,
`const a = []
alert(typeof a)`,
`const b = new Array()
alert(typeof b)`,
`const c = []
alert(c instanceof Array)`,
`const a = ['nick', 'tina', 'andy']
alert(a[0])

// this will change 'nick' to 'frank'
// after we alert it
a[0] = 'frank'`,
`const names = ['nick', 'tina', 'andy']

// adding a couple new items
names.push('frank')
names.push('ana')

// removing the last item
names.pop()

alert(names.join())
`,
`
const names = ['nick', 'tina', 'andy']

// removing an item from the start of the list
names.shift()

// adding a a new item to the start of the list
names.unshift('frank')

alert(names.join())`,
`const names = ['nick', 'tina', 'andy']

for (let i = 0; i < names.length; i++) {
  alert(names[i])
}`
      ]

      examples.forEach((ex, i) => {
        ele.querySelector(`[name="js-ex-${i}"]`).updateExample(ex, 'javascript')
      })
    } else if (type === 'deeper-funcs') {
      const examples = [
`function square (x) {
  return x * x
}`,
`const square = function (x) {
  return x * x
}`,
`const square = (x) => {
  return x * x
}`,
'const square = x => x * x',
`function greet () {
  alert('Welcome to my page!')
}

nn.on('load', greet)`,
`const greet = () => alert('Welcome to my page!')
nn.on('load', greet)`,
'nn.on(\'load\', () => alert(\'Welcome to my page!\'))'
      ]

      examples.forEach((ex, i) => {
        ele.querySelector(`[name="js-ex-${i}"]`).updateExample(ex, 'javascript')
      })
    } else if (type === 'data-types') {
      const examples = [
`if (typeof user === 'string') {
  alert('Welcome ' + user)
} else {
  alert('You are not logged in')
}`,
`let x = 0 / 0 // NaN
typeof x // "number"
isNaN(x) // true`,
`let big = 9007199254740991n // typeof "bigint"
big / 2 // error: can't divide "bigint" by "number"
// convert "bigint" into a "number"
Number(big) / 2 // 4503599627370495.5`,
`let x // typeof "undefined"

// a function without a "return" statement
function greet () {
  alert('hello there!')
}

let y = greet() // y is "undefined"
`,
`const a = "hello there"
const a = 'hello there'
const a = \`hello there\``,
`const user = 'Ada Lovelace'
const a = 'Hi ' + user + '! Don\\'t forget to say goodbye!'
const b = \`Hi \${user}! Don't forget to say goodbye!\``,
`const a = 'hi'
const b = 'hi'
a === b // true

const x = Symbol('hi')
const y = Symbol('hi')
x === y // false`,
`let user // typeof "undefined"
if (user) { // undefined is "falsy"...
  alert('Hi') // ...so this will NOT run
}

user = 'Ada' // typeof "string"
if (user) { // a string is "truthy"...
  alert('Hi') // ...so this will run
}

user = null // typeof "object"
if (user) { // null is "falsy"...
  alert('Hi') // ...so this will NOT run
}`,
`const user = { first: 'Ada', last: 'Lovelace' }
typeof user // "object"
typeof user.first // "string"

// user is "const" so we can't reassign it
// but we can reassign its properties
user.first = 'Augusta'`,
`function greet () {
  alert('hello there!')
}

typeof greet // "function"`

      ]

      examples.forEach((ex, i) => {
        ele.querySelector(`[name="js-ex-${i}"]`).updateExample(ex, 'javascript')
      })
    }
  }
}

window.JsReference = JsReference
