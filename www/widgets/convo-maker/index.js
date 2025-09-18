/* global WIDGETS, Widget, Convo, NNE, nn, utils */
class ConvoMaker extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'convo-maker'
    this.listed = true
    this.keywords = ['convo', 'conversation', 'dialogue', 'bubble', 'maker', 'story', 'narrative']
    this.title = 'Convo Maker'
    this.hidden = true

    this.widgets = []

    this.state = {
      globals: [], // global variables of eslint comment
      name: null, // name of convo
      variables: '', // custom JS code for convo
      data: [] // array of passage objects
    }

    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    nn.on('beforeunload', () => {
      if (this.cnvmkr && !this.cnvmkr.closed) this.cnvmkr.close()
    })

    // listen for messages from popups
    nn.on('message', e => {
      // console.log(e.data)
      if (e.origin !== window.location.origin) return // for security
      if (e.data.type === 'cnvmkr-opened') {
        utils.get('/api/convos', (res) => {
          this.widgets = res.map(w => w.key)
          this._msgCnvMkr('widgets-list', res)
        })
        if (this.state.name) {
          // if cnvmkr popup is closed by accident && then re-opened
          // then load previously saved data
          const { globals, name, variables, data } = this.state
          this._msgCnvMkr('new-file-data', { name, data, variables, globals })
        }
        // ......
      } else if (e.data.type === 'cnvmkr-open-file') {
        // when pop up uploads a new convo file, parse it
        const result = this.parseConvosCode(e.data.payload)
        const { globals, name, variables, data } = result
        this.state.globals = globals // array of global variables at top of file /* global */
        this.state.name = name // key value  for window.CONVOS (widget name)
        this.state.variables = variables // variables/functions defined in convo's global scope
        this.state.data = data // array of convo objects
        this._msgCnvMkr('new-file-data', { name, data, variables, globals })
        // ......
      } else if (e.data.type === 'cnvmkr-save-file') {
        // when pop up wants to save/download the file
        this.saveConvosToFile()
        // ......
      } else if (e.data.type === 'cnvmkr-new-file') {
        // when pop up wants to create a new convo file
        this.state.globals = []
        this.state.name = e.data.payload
        this.state.variables = ''
        this.state.data = []
        // ......
      } else if (e.data.type === 'cnvmkr-preview-passage') {
        const obj = JSON.parse(e.data.payload)
        this.previewConvo(obj)
      } else if (e.data.type === 'cnvmkr-name-update') {
        // when pop up updates name of convo
        this.state.name = e.data.payload
        // ......
      } else if (e.data.type === 'cnvmkr-globals-update') {
        // when pop up updates globals && JS code (variables) for the convo file
        const { globals, code } = e.data.payload
        this.state.globals = globals
        this.state.variables = code
        // ......
      } else if (e.data.type === 'cnvmkr-data-update') {
        // when popup updates a convo object (data)
        const arr = JSON.parse(e.data.payload)
        this.state.data = arr
        // ......
      }
    })

    this.on('open', () => {
      const askAboutWidgetType = () => {
        this.convos = window.CONVOS[this.key](this)
        window.convo = new Convo(this.convos, 'start')
        this._openCnvMkr()
      }

      if (!this.cnvmkr) {
        if (!window.CONVOS[this.key]) {
          setTimeout(askAboutWidgetType, 250)
        } else askAboutWidgetType()
      }
    })
  }

  _openCnvMkr (type) {
    // create pop up
    const url = 'widgets/convo-maker/popups/index.html'
    this.cnvmkr = window.open(url, 'convo-maker', 'width=1000,height=620')
    // keep an eye on the pop up to see if it closed
    this.cnvmkrWatcher = setInterval(() => {
      if (this.cnvmkr && this.cnvmkr.closed) {
        clearInterval(this.cnvmkrWatcher)
        this.cnvmkr = null
      }
    }, 500)
  }

  _msgCnvMkr (type, payload) {
    if (!this.cnvmkr) return
    this.cnvmkr.postMessage({ type, payload }, window.origin)
  }

  previewConvo (obj) {
    /* eslint no-eval: "off" */
    const code = this.getConvoFuncStr()
    const func = eval(`((self) => {\n${code}\n})`)

    const preview = (w) => {
      // console.log('CONVO MAKER: previewing...')
      // console.log(w.convos, obj)
      window.CONVOS[this.state.name] = func
      w.convos = window.CONVOS[this.state.name](w)
      window.convo = new Convo(w.convos, obj.name)
    }

    if (this.widgets.includes(this.state.name)) {
      if (WIDGETS.instantiated.includes(this.state.name)) {
        const w = WIDGETS[this.state.name]
        if (!w.opened) w.open(preview)
        else preview(w)
      } else {
        WIDGETS.open(this.state.name, preview)
      }
    } else {
      const w = {}
      preview(w)
    }
  }

  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖ LOAD / SAVE CONVO ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖
  // ⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖⁖

  parseConvosCode (code) {
    try {
      const globals = this._extractGlobals(code)
      const name = this._extractConvoName(code)
      const variables = this._extractVariables(code)
      const arrayText = this._extractArrayContent(code)
      const data = this._parseConvoItems(arrayText)
      return { name, data, variables, globals }
    } catch (err) {
      return err
    }
  }

  // ———————————————————————————————————————————————————————————————————————————

  // 0) extract global variables comment
  _extractGlobals (code) {
    const m = code.match(/\/\*\s*global\s+([^*]+)\*\//)
    if (!m) return []
    return m[1]
      .split(',')
      .map(name => name.trim())
      .filter(Boolean)
  }

  /** 1) get window.CONVOS['foo'] */
  _extractConvoName (code) {
    const m = code.match(/window\.CONVOS\['([^']+)'\]/)
    if (!m) throw new Error('Invalid convo file: no window.CONVOS[...]')
    return m[1]
  }

  _extractVariables (code) {
    // 1) find the convo fn body start
    const baseIdx = code.indexOf("window.CONVOS['")
    const arrowIdx = code.indexOf('=>', baseIdx)
    const bodyStart = code.indexOf('{', arrowIdx)
    if (bodyStart < 0) return ''

    // 2) locate the top-level return of your convo array
    const returnRe = /return\s*\[\s*{/
    const returnM = returnRe.exec(code)
    if (!returnM) return ''

    // 3) slice out everything in between, preserving newlines exactly
    const varsBlock = code.slice(bodyStart + 1, returnM.index)

    // 4) trim off any leading/trailing blank lines, but leave internal formatting intact
    return varsBlock.replace(/^\s*\n/, '').replace(/\n\s*$/, '')
  }

  /** 3) isolate everything between return [ … ] */
  _extractArrayContent (code) {
    // 1) find the start of the main function body
    const baseIdx = code.indexOf('window.CONVOS')
    const arrowIdx = code.indexOf('=>', baseIdx)
    const bodyStart = code.indexOf('{', arrowIdx)
    if (bodyStart < 0) throw new Error('Invalid convo file: no function body')

    // 2) scan from there, tracking curly depth
    let depth = 0
    for (let i = bodyStart; i < code.length; i++) {
      const ch = code[i]
      if (ch === '{') depth++
      else if (ch === '}') depth--

      // 3) only at depth===1 do we consider "return [ {"
      if (depth === 1 && code.startsWith('return', i)) {
        let j = i + 'return'.length

        // skip any whitespace (spaces, tabs, newlines) before the '['
        while (/\s/.test(code[j])) j++
        if (code[j] !== '[') continue
        j++

        // skip any whitespace before the '{'
        while (/\s/.test(code[j])) j++
        if (code[j] !== '{') continue

        // 4) found it! now find the matching "]"
        const arrStart = i + code.slice(i).indexOf('[')
        let arrDepth = 0
        let endIdx = -1
        for (let k = arrStart; k < code.length; k++) {
          if (code[k] === '[') arrDepth++
          else if (code[k] === ']') {
            arrDepth--
            if (arrDepth === 0) {
              endIdx = k
              break
            }
          }
        }
        if (endIdx < 0) throw new Error('Invalid convo file: unmatched [ ]')

        // slice out the contents between the [ and ]
        return code.slice(arrStart + 1, endIdx)
      }
    }

    throw new Error('No top-level convo array found')
  }

  /** 4) walk that arrayContent, pulling out each top-level { … } */
  _parseConvoItems (arrayContent) {
    let items = []
    let i = 0
    // state for old-convo fallback
    const state = { newId: 1, newX: 25, newY: 25, lastConvoHides: false }

    while (i < arrayContent.length) {
      const ch = arrayContent[i]
      if (/\s|,/.test(ch)) { i++; continue }
      if (ch === '{') {
        const start = i
        i++ // skip '{'
        let depth = 1
        while (i < arrayContent.length && depth > 0) {
          if (arrayContent[i] === '{') depth++
          else if (arrayContent[i] === '}') depth--
          i++
        }
        const objText = arrayContent.slice(start, i)
        const item = this._parseConvoObject(objText, state)
        items.push(item)
        continue
      }
      i++
    }

    // ensure that there are no duplicate ids and all are in order
    items = items.map((o, i) => { o.id = i + 1; return o })
    return items
  }

  _parseConvoObject (objText, state) {
    const name = this._parseName(objText)
    const { id, x, y } = this._parseCnvMkr(objText, state)

    const before = this._parseFunctionProperty(objText, 'before')
    const after = this._parseFunctionProperty(objText, 'after')
    const code = this._parseStringProperty(objText, 'code')
    const edit = this._parseBooleanProperty(objText, 'edit')
    const highlight = this._parseNumberProperty(objText, 'highlight')
    const spotlight = this._parseNumberProperty(objText, 'spotlight')
    const layout = this._parseStringProperty(objText, 'layout')

    const contentRaw = this._parseContentLiteral(objText)
    const { options, links } = this._parseOptionsAndLinks(objText)
    // update positioning state for “old” convos
    state.lastConvoHides = (links.length === 1 && links[0].includes('HIDE'))
    const text = contentRaw + '\n\n' + links.join('\n')
    return {
      id, name, x, y, before, after, code, edit, highlight, spotlight, layout, options, text
    }
  }

  // new helper: grab any arrow‐fn or IIFE assigned to propName
  _parseFunctionProperty (str, propName) {
    // locate propName:
    const propRe = new RegExp(propName + '\\s*:')
    const m = propRe.exec(str)
    if (!m) return undefined
    // find colon, then skip whitespace
    let pos = str.indexOf(':', m.index) + 1
    while (/\s/.test(str[pos])) pos++
    const start = pos
    // find arrow '=>'
    const arrow = str.indexOf('=>', pos)
    if (arrow < 0) return undefined
    pos = arrow + 2
    while (/\s/.test(str[pos])) pos++
    // body can be block or expression
    let end
    if (str[pos] === '{') {
      // skip balanced braces
      end = this._skipBalanced(str, pos, '{', '}')
    } else {
      // skip until comma or closing brace
      end = this._skipUntil(str, pos, [',', '}'])
    }
    return str.slice(start, end).trim()
  }

  // new helper: skip until comma or closing brace at depth 0 for parens/braces
  _skipExpression (str, start) {
    let dParen = 0
    let dBrace = 0
    let i = start
    while (i < str.length) {
      const ch = str[i]
      if (ch === '(') dParen++
      else if (ch === ')') dParen = Math.max(0, dParen - 1)
      else if (ch === '{') dBrace++
      else if (ch === '}') dBrace = Math.max(0, dBrace - 1)
      // break on comma or closing '}' when all nesting closed
      if ((ch === ',' || ch === '}') && dParen === 0 && dBrace === 0) break
      i++
    }
    return i
  }

  _unescapeJsString (s) {
    // handle common escapes produced when saving
    return s
      .replace(/\\\\/g, '\\') // \\ -> \
      .replace(/\\n/g, '\n') // \n -> newline
      .replace(/\\r/g, '\r') // \r -> carriage return
      .replace(/\\t/g, '\t') // \t -> tab
      .replace(/\\b/g, '\b') // \b -> backspace (optional)
      .replace(/\\f/g, '\f') // \f -> form feed (optional)
      .replace(/\\"/g, '"') // \" -> "
      .replace(/\\'/g, "'") // \' -> '
  }

  // new helper: parse quoted or backtick string for propName
  _parseStringProperty (str, propName) {
    const re = new RegExp(`${propName}\\s*:\\s*('(?:\\\\'|[^'])*'|\`[\\s\\S]*?\`)`)
    const m = re.exec(str)
    if (!m) return undefined
    const lit = m[1]
    if (lit.startsWith('`')) return lit.slice(1, -1) // template literal: already real newlines
    // single or double-quoted: strip quotes, then unescape
    const raw = lit.slice(1, -1)
    return this._unescapeJsString(raw)
  }

  // new helper: parse boolean literal
  _parseBooleanProperty (str, propName) {
    const re = new RegExp(`${propName}\\s*:\\s*(true|false)`)
    const m = re.exec(str)
    return m ? m[1] === 'true' : undefined
  }

  // new helper: parse integer literal
  _parseNumberProperty (str, propName) {
    const re = new RegExp(`${propName}\\s*:\\s*(\\d+)`)
    const m = re.exec(str)
    return m ? Number(m[1]) : undefined
  }

  /** helper for _parseConvoObject */
  _parseName (objText) {
    const m = objText.match(/id\s*:\s*'([^']+)'/)
    return m ? m[1] : ''
  }

  /** helper for _parseConvoObject */
  _parseCnvMkr (objText, state) {
    const m = objText.match(
      /graph\s*:\s*{\s*id\s*:\s*(\d+),\s*x\s*:\s*(\d+),\s*y\s*:\s*(\d+)\s*}/
    )
    if (m) {
      return { id: +m[1], x: +m[2], y: +m[3] }
    }
    // fallback for old convos
    const { newId, newX, newY, lastConvoHides } = state
    let x = newX
    let y = newY
    if (lastConvoHides) {
      x += 150
      y = 25
    }
    state.newId++
    state.newX = x
    state.newY = y + 150
    return { id: newId, x, y }
  }

  // helper for _parseContentLiteral (replaces former regext, see method below)
  _findPropValueStart (str, propName) {
    let i = 0
    let depth = 0
    let inSQ = false
    let inDQ = false
    let inBT = false
    let esc = false

    while (i < str.length) {
      const ch = str[i]

      if (esc) { esc = false; i++; continue }
      if (inSQ) { if (ch === '\\') esc = true; else if (ch === "'") inSQ = false; i++; continue }
      if (inDQ) { if (ch === '\\') esc = true; else if (ch === '"') inDQ = false; i++; continue }
      if (inBT) { if (ch === '\\') esc = true; else if (ch === '`') inBT = false; i++; continue }

      if (ch === "'") { inSQ = true; i++; continue }
      if (ch === '"') { inDQ = true; i++; continue }
      if (ch === '`') { inBT = true; i++; continue }

      if (ch === '{') { depth++; i++; continue }
      if (ch === '}') { depth--; i++; continue }

      // only match prop at top level of this object (depth === 1)
      if (depth === 1 && str.startsWith(propName, i)) {
        let j = i + propName.length
        while (/\s/.test(str[j])) j++
        if (str[j] === ':') {
          j++
          while (/\s/.test(str[j])) j++
          return j
        }
      }

      i++
    }
    return -1
  }

  /** helper for _parseConvoObject */
  _parseContentLiteral (str) {
    // this regex was catching "content" strings from within "code" blocks
    // const reKey = /content\s*:\s*/g
    // const mKey = reKey.exec(str)
    // if (!mKey) return ''

    const pos0 = this._findPropValueStart(str, 'content')
    if (pos0 < 0) return ''

    const pos = pos0
    // backtick template
    if (str[pos] === '`') {
      const m = /`([\s\S]*?)`/.exec(str.slice(pos))
      return m ? m[1] : ''
    }

    // single or double quote
    if (str[pos] === "'" || str[pos] === '"') {
      const quote = str[pos]
      let i = pos + 1
      while (i < str.length) {
        if (str[i] === '\\') i += 2
        else if (str[i] === quote) break
        else i++
      }
      const raw = str.slice(pos + 1, i)
      return quote === "'"
        ? raw.replace(/\\'/g, "'")
        : raw.replace(/\\"/g, '"')
    }

    // expression (e.g. returningStudent())
    const end = this._skipUntil(str, pos, [',', '}'])
    return str.slice(pos, end).trim()
  }

  _parseConvoOptions (optsText) {
    const options = {}
    let pos = 0

    while (pos < optsText.length) {
      // 1) skip whitespace & commas
      while (pos < optsText.length && /[\s,]/.test(optsText[pos])) pos++
      if (pos >= optsText.length) break

      // 2) parse a quoted or bare key
      const key = this._parseOptionKey(optsText, () => { pos++ }, () => pos)

      // 3) skip up to the colon and any whitespace
      pos = optsText.indexOf(':', pos) + 1
      while (/\s/.test(optsText[pos])) pos++

      // 4) record start of the function _signature_
      const startFn = pos

      // 5) if we see "(", skip the entire "(…)" arg list, then "=>"
      if (optsText[pos] === '(') {
        pos = this._skipBalanced(optsText, pos, '(', ')')
        while (/\s/.test(optsText[pos])) pos++
        if (optsText.slice(pos, pos + 2) === '=>') {
          pos += 2
          while (/\s/.test(optsText[pos])) pos++
        }
      }

      // 6) now skip either the `{ … }` body or a single‐expression
      if (optsText[pos] === '{') {
        pos = this._skipBalanced(optsText, pos, '{', '}')
      } else {
        pos = this._skipUntil(optsText, pos, [',', '}'])
      }

      // 7) slice out exactly from the start of the signature through the end of the body
      const fnBody = optsText.slice(startFn, pos).trim()
      options[key] = fnBody

      // 8) drop any trailing comma
      if (optsText[pos] === ',') pos++
    }

    return options
  }

  _parseOptionsAndLinks (objText) {
    const links = []
    let options = {}
    const idx = objText.indexOf('options')
    if (idx < 0) return { options, links }

    // find the colon and first non-space
    const colon = objText.indexOf(':', idx)
    let pos = colon + 1
    while (/\s/.test(objText[pos])) pos++

    if (objText[pos] === '{') {
      // object literal case
      const start = pos + 1
      const end = this._skipBalanced(objText, pos, '{', '}')
      const optsText = objText.slice(start, end - 1)
      options = this._parseConvoOptions(optsText)

      Object.entries(options).forEach(([key, fnBody]) => {
        const fn = fnBody.trim()
        let target = 'FUNC'
        const goM = /^\(e\)\s*=>\s*e\.goTo\('([^']+)'\)$/.exec(fn)
        if (goM) target = goM[1]
        else if (/^\(e\)\s*=>\s*e\.hide\(\)$/.test(fn)) target = 'HIDE'
        links.push(`[[${key}->${target}]]`)
      })
    } else {
      // expression case (e.g. sessionSaveOpts())
      const exprEnd = this._skipUntil(objText, pos, [',', '}'])
      const expr = objText.slice(pos, exprEnd).trim()
      options = expr
      links.push(`[[${options}]]`)
    }

    return { options, links }
  }

  /** skips from `start` over balanced open/close chars, returns index of closing+1 */
  _skipBalanced (str, start, openCh, closeCh) {
    let depth = 1
    let i = start + 1
    while (i < str.length && depth > 0) {
      if (str[i] === openCh) depth++
      else if (str[i] === closeCh) depth--
      i++
    }
    return i
  }

  /** skips until any of `stops` at depth-0, returns that index */
  _skipUntil (str, start, stops) {
    let depth = 0
    let i = start
    while (i < str.length) {
      const ch = str[i]
      if (ch === '(') depth++
      else if (ch === ')') depth--
      else if (stops.includes(ch) && depth === 0) break
      i++
    }
    return i
  }

  /** parses a quoted or bare option-key, returns it */
  _parseOptionKey (str, advance, getPos) {
    const pos = getPos()
    let key = ''
    if (str[pos] === '"' || str[pos] === "'") {
      const quote = str[pos]
      advance()
      const start = getPos()
      while (getPos() < str.length) {
        if (str[getPos()] === '\\') {
          advance(); advance()
        } else if (str[getPos()] === quote) {
          break
        } else {
          advance()
        }
      }
      const raw = str.slice(start, getPos())
      advance()
      key = raw.replace(/\\\\/g, '\\')
        .replace(/\\'/g, "'")
        .replace(/\\"/g, '"')
    } else {
      const start = pos
      while (getPos() < str.length && /[^\s:]/.test(str[getPos()])) advance()
      key = str.slice(start, getPos())
    }
    return key.trim()
  }

  // ---------------------------------------------------------------------- SAVE
  _globalsToStr () {
    let globals = `/* global ${this.state.globals.join(', ')} */`
    if (this.state.data.filter(o => o.code).length > 0) {
      globals += '\n/* eslint no-template-curly-in-string: "off" */'
    }

    let varLines = this.state.variables.split('\n')
      .map(v => `  ${v.trim()}`)
      .join('\n')
    varLines = NNE.tidy(varLines, 'js')
    if (varLines === '  ') varLines = null
    return { globals, varLines }
  }

  _textToContentStr (text, addQuotes) {
    if (!text) text = ''
    const raw = text.replace(/\[\[.*?\]\]/g, '').trim()
    const isTpl = /\$\{.*?\}/.test(raw)
    const isExpr = /^[A-Za-z_$][\w$]*(?:\([\s\S]*\))$/.test(raw)

    let contentLiteral = raw
    if (addQuotes) {
      if (isTpl) contentLiteral = `\`${raw}\``
      else if (isExpr) contentLiteral = raw
      else contentLiteral = `'${raw.replace(/'/g, "\\'")}'`
    }

    return contentLiteral
  }

  _dataArrayToStr () {
    const pushProp = (lines, key, val, formatter) => {
      if (val == null || (typeof val === 'string' && val === '')) return
      const out = formatter
        ? formatter(val)
        : `${key}: ${val}`
      lines.push(`      ${out},`)
    }

    const hasSpecialChars = (str) => {
      // this one flags anything _not_ A–Z, a–z or 0–9
      const specialRe = /[^A-Za-z0-9]/
      return specialRe.test(str)
    }

    const items = this.state.data.map(item => {
      const contentLiteral = this._textToContentStr(item.text, true)

      let optsText
      if (typeof item.options === 'string') {
        optsText = item.options
      } else {
        const entryIndent = '        '
        // const bodyIndent = entryIndent + '  '
        const entries = Object.entries(item.options)
          .map(([key, fnBody]) => {
            // quote only if needed
            const keyName = hasSpecialChars(key)
              ? `'${key.replace(/'/g, "\\'")}'` : key
            const formattedFn = NNE.tidy(fnBody, 'js')
              .split('\n')
              .map((line, i) => i === 0 ? line : entryIndent + line)
              .join('\n')
            return `${entryIndent}${keyName}: ${formattedFn}`
          })
          .join(',\n')
        optsText = `{\n${entries}\n      }`
      }

      const lines = ['    {']
      lines.push(`      id: '${item.name}',`)
      lines.push(`      graph: { id: ${item.id}, x: ${item.x}, y: ${item.y} },`)
      pushProp(lines, 'layout', item.layout, val =>
        `layout: '${val.replace(/'/g, "\\'")}'`
      )
      // pushProp(lines, 'before', item.before)
      // pushProp(lines, 'after', item.after)
      const ba = ['before', 'after']
      ba.forEach(propName => {
        pushProp(lines, propName, item[propName], val => {
          const tidyFn = NNE.tidy(val, 'js')
          const [first, ...rest] = tidyFn.split('\n')
          const ind = [first].concat(rest.map(l => '      ' + l))
          return `${propName}: ${ind.join('\n')}`
        })
      })
      pushProp(lines, 'code', item.code, val =>
        `code: '${val.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r?\n/g, '\\n')}'`
      )
      pushProp(lines, 'edit', item.edit)
      pushProp(lines, 'highlight', item.highlight)
      pushProp(lines, 'spotlight', item.spotlight, val =>
        `spotlight: [${val.join(', ')}]`
      )
      lines.push(`      content: ${contentLiteral},`)
      lines.push(`      options: ${optsText}`)
      lines.push('    }')
      return lines.join('\n')
    }).join(',\n')

    return items
  }

  getConvoFuncStr () {
    const code = []

    const { varLines } = this._globalsToStr()
    if (varLines) {
      code.push(varLines)
      code.push('')
    } else code.push('')

    const items = this._dataArrayToStr()
    code.push('  return [', items, '  ]')

    return code.join('\n')
  }

  getConvoFileStr () {
    const name = this.state.name
    const { globals, varLines } = this._globalsToStr()
    const items = this._dataArrayToStr()

    let code = [globals, `window.CONVOS['${name}'] = (self) => {`]
    if (varLines) {
      code.push(varLines)
      code.push('')
    }
    code.push('  return [', items, '  ]', '}\n')
    code = code.join('\n')

    return code
  }

  saveConvosToFile () {
    const code = this.getConvoFileStr()
    const blob = new window.Blob([code], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    // link.download = `${name}.js`
    link.download = 'convo.js'
    link.click()
  }
}

window.ConvoMaker = ConvoMaker
