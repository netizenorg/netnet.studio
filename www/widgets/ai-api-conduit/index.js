/* global NNE, NNW, WIDGETS, Widget, Convo, utils, nn */
class AiApiConduit extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'ai-api-conduit'
    this.keywords = ['ai', 'artificial', 'intelligence', 'api', 'llm', 'conduit']
    this.title = 'LLM-API Conduit <span style="opacity: 0.5;margin-left:10px">(EXPERIMENTAL BETA)</span>'
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.width = 638
    this.height = 535

    this.provider = 'openai' // or 'anthropic', 'ollama', 'disabled'
    this.useSchema = false // no schema by default
    this.systemPrompt = '' // see data/system-prompt.txt
    this.schema = null // see data/schema.json
    this.nnDocs = null // see core/netnet-standard-library/nn-context.md

    // the current settings, loaded from (&& saved to) student-session
    // by _loadSettings() && _saveSetting(), see _settingsKeys()
    this.settings = { key: null, model: null, temperature: 0.4, maxTokens: 4096, numCtx: 32768, think: false }
    this.adapters = this._createAdapters()

    this._setupConvoListener()

    this.on('open', () => this._createHTML(opts))
  }

  convo (key, rerun) {
    if (rerun) {
      this.convos = window.CONVOS[this.key](this)
    }
    window.convo = new Convo(this.convos, key)
  }

  switchTab (name) {
    this.$('.ai-api-conduit__tab-label').forEach(l => {
      l.classList.toggle('active', l.dataset.tab === name)
    })
    this.$('.ai-api-conduit__tab').forEach(t => {
      t.style.display = t.dataset.tab === name ? '' : 'none'
    })
  }

  async _createHTML (opts) {
    const w = this.key
    this.innerHTML = await utils.getSync(`/widgets/${w}/index.html`, true)
    this.systemPromptSketch = await utils.getSync(`/widgets/${w}/data/system-prompt-sketch.txt`, true)
    this.systemPromptProject = await utils.getSync(`/widgets/${w}/data/system-prompt-project.txt`, true)
    this.systemPromptSketchPlain = await utils.getSync(`/widgets/${w}/data/system-prompt-sketch-plain.txt`, true)
    this.systemPromptProjectPlain = await utils.getSync(`/widgets/${w}/data/system-prompt-project-plain.txt`, true)
    this.schema = await utils.getSync(`/widgets/${w}/data/schema.json`)
    this.nnDocs = await utils.getSync('/core/netnet-standard-library/nn-context.md', true)
    this._setupTabs()
    // restore useSchema before _setupRequestBody so the body renders correctly
    const storedSchema = WIDGETS['student-session'].getData('llm-use-schema')
    if (storedSchema !== null) this.useSchema = storedSchema !== 'false'
    this._setupProviderToggle()
    this._setupApiKey()
    this._setupRequestBody()
    this._populateSystemPrompt()
    this._populateSchema()
    this._populateIncludeCode()
    this._setupSendButton()
    this.$('[name="help-btn"]').addEventListener('click', () => this.convo('start'))
    if (this._pendingQuery) {
      this.$('[name="user-input"]').value = this._pendingQuery
      this._pendingQuery = null
    }
    if (opts !== 'no-convo') this.convo('start')
  }

  _setupTabs () {
    this.$('.ai-api-conduit__tab-label').forEach(label => {
      label.addEventListener('click', () => {
        if (label.dataset.tab === 'include-code' || label.dataset.tab === 'system') {
          this._populateSystemPrompt()
        }
        if (label.dataset.tab === 'include-code') this._populateIncludeCode()
        this.switchTab(label.dataset.tab)
        this.convo(label.dataset.tab, true)
      })
    })
  }

  _toggleApiKeySection () {
    const needsKey = this.adapters[this.provider]?.needsKey
    this.$('[name="api-key-section"]').style.display = needsKey ? '' : 'none'
  }

  _setupProviderToggle () {
    const ss = WIDGETS['student-session']
    const select = this.$('[name="provider"]')

    // restore last selected provider
    const storedProvider = ss.getData('llm-provider')
    if (storedProvider) {
      this.provider = storedProvider
      select.value = storedProvider
    }

    this._loadSettings()
    this._toggleApiKeySection()

    select.addEventListener('change', () => {
      this.provider = select.value
      ss.setData('llm-provider', select.value)
      this._loadSettings()
      this._toggleApiKeySection()
      this._setupRequestBody()
      this.$('[name="api-key"]').value = this.settings.key || ''
      window.convo = new Convo(this.convos, `create-${select.value}-key`)
    })
  }

  _setupApiKey () {
    const input = this.$('[name="api-key"]')
    input.value = this.settings.key || ''

    input.addEventListener('click', async (e) => {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'paste-key')
      await nn.sleep(utils.getVal('--menu-fades-time'))
      input.focus()
    })

    input.addEventListener('change', (e) => {
      this._saveSetting('key', e.target.value.trim())
    })
  }

  // ...........................................................................
  // settings: anything the student sets is stored locally via student-session

  _settingsKeys () {
    // the student-session (localStorage) key for each setting
    return {
      key: `llm-key-${this.provider}`,
      model: `llm-model-${this.provider}`,
      temperature: 'llm-temperature',
      maxTokens: 'llm-max-tokens',
      numCtx: 'llm-num-ctx',
      think: 'llm-think'
    }
  }

  _loadSettings () {
    const ss = WIDGETS['student-session']
    const keys = this._settingsKeys()
    const a = this.adapters[this.provider]
    const num = (v, def) => isNaN(parseFloat(v)) ? def : parseFloat(v)
    this.settings = {
      key: a?.needsKey ? ss.getData(keys.key) || null : null,
      model: ss.getData(keys.model) || a?.model || null,
      temperature: num(ss.getData(keys.temperature), 0.4),
      maxTokens: num(ss.getData(keys.maxTokens), 4096),
      numCtx: num(ss.getData(keys.numCtx), 32768),
      think: ss.getData(keys.think) === 'true'
    }
  }

  _saveSetting (name, value) {
    // an empty value removes it from student-session (&& reverts to default)
    const empty = value === '' || value === null || Number.isNaN(value)
    WIDGETS['student-session'].setData(this._settingsKeys()[name], empty ? null : String(value))
    this._loadSettings()
  }

  // ...........................................................................
  // provider adapters: each LLM provider's API "dialect"
  // model: default model, needsKey: whether it requires an API key
  // request(o): builds the { url, method, headers, body } sent to the API
  // reply(data): finds the text of the reply in the API's response
  // display(h): the request body as rendered in the "Request Body" tab

  _createAdapters () {
    return {
      openai: {
        model: 'gpt-5.4-mini',
        needsKey: true,
        request: (o) => {
          const body = { model: o.model, instructions: o.system, input: o.input, temperature: o.temperature }
          if (o.schema) {
            body.text = {
              format: {
                type: 'json_schema',
                name: 'coding_tutor_response',
                schema: o.schema,
                strict: true
              }
            }
          }
          return {
            url: 'https://api.openai.com/v1/responses',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${o.key}`
            },
            body
          }
        },
        reply: (data) => {
          if (data.error) throw new Error(data.error.message)
          const msg = data.output.find(item => item.type === 'message')
          if (!msg?.content?.[0]) throw new Error('Unexpected OpenAI response structure')
          const content = msg.content[0]
          if (content.type !== 'output_text') throw new Error(`Expected output_text, got ${content.type}`)
          return content.text
        },
        display: (h) => this.useSchema ? `{
  model: ${h.model},
  instructions: ${h.system},
  input: ${h.input},
  text: {
    format: {
      type: 'json_schema',
      name: 'coding_tutor_response',
      schema: ${h.schema},
      strict: true
    }
  },
  temperature: ${h.temperature}
}` : `{
  model: ${h.model},
  instructions: ${h.system},
  input: ${h.input},
  temperature: ${h.temperature}
}`
      },

      anthropic: {
        // NOTE: no temperature, Anthropic's newer models reject it
        model: 'claude-haiku-4-5',
        needsKey: true,
        request: (o) => {
          const body = {
            model: o.model,
            system: o.system,
            messages: [{ role: 'user', content: o.input }],
            max_tokens: parseInt(o.maxTokens) || 4096
          }
          if (o.schema) {
            body.output_config = {
              format: { type: 'json_schema', schema: o.schema }
            }
          }
          return {
            url: 'https://api.anthropic.com/v1/messages',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': o.key,
              'anthropic-version': '2023-06-01',
              'anthropic-dangerous-direct-browser-access': 'true'
            },
            body
          }
        },
        reply: (data) => {
          if (data.error) throw new Error(data.error.message)
          if (data.type === 'error') throw new Error(data.error?.message || 'Unknown error')
          // the reply can contain other types of blocks, so join the text ones
          const text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('')
          if (!text && data.stop_reason === 'max_tokens') {
            throw new Error('The model reached the max_tokens limit before it finished replying. Try a larger max_tokens.')
          }
          if (!text) throw new Error(`Unexpected Anthropic response structure (stop_reason: ${data.stop_reason})`)
          return text
        },
        display: (h) => this.useSchema ? `{
  model: ${h.model},
  system: ${h.system},
  messages: [
    { role: 'user', content: ${h.input} }
  ],
  max_tokens: ${h.maxTokens},
  output_config: {
    format: {
      type: 'json_schema',
      schema: ${h.schema}
    }
  }
}` : `{
  model: ${h.model},
  system: ${h.system},
  messages: [
    { role: 'user', content: ${h.input} }
  ],
  max_tokens: ${h.maxTokens}
}`
      },

      ollama: {
        model: 'gemma4:e2b',
        needsKey: false,
        request: (o) => {
          const body = {
            model: o.model,
            messages: [
              { role: 'system', content: o.system },
              { role: 'user', content: o.input }
            ],
            stream: false,
            think: o.think,
            options: { temperature: o.temperature, num_ctx: parseInt(o.numCtx) || 32768 }
          }
          if (o.schema) body.format = o.schema
          return {
            url: 'http://localhost:11434/api/chat',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
          }
        },
        reply: (data) => {
          if (data.error) throw new Error(data.error)
          if (!data.message?.content && data.done_reason === 'length') {
            throw new Error(`The model ran out of room in its context window (num_ctx: ${this.settings.numCtx} tokens) before it finished replying. Try a larger num_ctx or attach fewer files.`)
          }
          if (!data.message?.content) throw new Error('Unexpected Ollama response structure')
          return typeof data.message.content === 'object'
            ? JSON.stringify(data.message.content)
            : data.message.content
        },
        display: (h) => this.useSchema ? `{
  model: ${h.model},
  messages: [
    { role: 'system', content: ${h.system} },
    { role: 'user', content: ${h.input} }
  ],
  stream: false,
  think: ${h.think},
  format: ${h.schema},
  options: {
    temperature: ${h.temperature},
    num_ctx: ${h.numCtx}
  }
}` : `{
  model: ${h.model},
  messages: [
    { role: 'system', content: ${h.system} },
    { role: 'user', content: ${h.input} }
  ],
  stream: false,
  think: ${h.think},
  options: {
    temperature: ${h.temperature},
    num_ctx: ${h.numCtx}
  }
}`
      }
    }
  }

  _buildRequest (input) {
    const a = this.adapters[this.provider]
    return a.request({
      key: this.settings.key,
      model: this.settings.model || a.model,
      system: this.systemPrompt,
      input,
      temperature: this.settings.temperature,
      maxTokens: this.settings.maxTokens,
      numCtx: this.settings.numCtx,
      think: this.settings.think,
      schema: this.useSchema ? this.schema : null
    })
  }

  // ...........................................................................

  _setupRequestBody () {
    const pre = this.$('[name="request-body"]')
    const a = this.adapters[this.provider]
    if (!a) { pre.innerHTML = ''; return }

    const s = this.settings
    // the editable parts of the request && links to the other tabs
    pre.innerHTML = a.display({
      model: `<input type="text" name="model" value="${s.model || ''}" placeholder="model-name">`,
      temperature: `<input type="number" name="temperature" min="0.0" max="2.0" step="0.01" value="${s.temperature}">`,
      maxTokens: `<input type="number" name="max-tokens" min="1" max="8192" step="1" value="${s.maxTokens}">`,
      numCtx: `<input type="number" name="num-ctx" min="2048" max="262144" step="1024" value="${s.numCtx}">`,
      think: `<select name="think"><option value="false">false</option><option value="true"${s.think ? ' selected' : ''}>true</option></select>`,
      system: '<span class="link" data-tab="system">systemPrompt</span>',
      input: '<span class="link" data-tab="post">userInput</span>',
      schema: '<span class="link" data-tab="schema">schema</span>'
    })

    pre.querySelectorAll('.link').forEach(link => {
      link.addEventListener('click', () => {
        this.switchTab(link.dataset.tab)
        this.convo(link.dataset.tab, true)
      })
    })

    const model = pre.querySelector('[name="model"]')
    model.addEventListener('change', (e) => this._saveSetting('model', e.target.value.trim()))

    const temp = pre.querySelector('[name="temperature"]')
    if (temp) temp.addEventListener('change', (e) => this._saveSetting('temperature', parseFloat(e.target.value)))

    const max = pre.querySelector('[name="max-tokens"]')
    if (max) max.addEventListener('change', (e) => this._saveSetting('maxTokens', parseInt(e.target.value)))

    const ctx = pre.querySelector('[name="num-ctx"]')
    if (ctx) ctx.addEventListener('change', (e) => this._saveSetting('numCtx', parseInt(e.target.value)))

    const think = pre.querySelector('[name="think"]')
    if (think) think.addEventListener('change', (e) => this._saveSetting('think', e.target.value))
  }

  _populateSystemPrompt () {
    const isProject = !!WIDGETS['project-files']?.projectData?.name
    if (this.useSchema) {
      this.systemPrompt = isProject ? this.systemPromptProject : this.systemPromptSketch
    } else {
      this.systemPrompt = isProject ? this.systemPromptProjectPlain : this.systemPromptSketchPlain
    }
    this.$('[name="system-prompt"]').textContent = this.systemPrompt
  }

  _populateSchema () {
    const display = this.$('[name="schema-display"]')
    display.textContent = JSON.stringify(this.schema, null, 2)
    display.style.display = this.useSchema ? '' : 'none'
    const cb = this.$('[name="use-schema"]')
    cb.checked = this.useSchema
    cb.addEventListener('change', () => {
      this.useSchema = cb.checked
      display.style.display = this.useSchema ? '' : 'none'
      WIDGETS['student-session'].setData('llm-use-schema', String(cb.checked))
      this._populateSystemPrompt()
      this._setupRequestBody()
    })
  }

  _populateIncludeCode () {
    const container = this.$('[name="include-code-content"]')
    const projectName = WIDGETS['project-files']?.projectData?.name
    const isSketch = !projectName && NNE.code !== utils.starterCode()

    if (projectName) {
      // PROJECT MODE
      container.innerHTML = '<p>Select which files from your project to include with your query:</p>'

      const list = document.createElement('div')
      list.setAttribute('name', 'project-file-list')
      list.className = 'ai-api-conduit__file-list'

      const files = WIDGETS['project-files'].files
      const viewing = WIDGETS['project-files'].viewing

      for (const [filename, fileData] of Object.entries(files)) {
        // skip binary/media files (Blob or GitHub raw URL)
        if (fileData.code instanceof window.Blob) continue
        if (typeof fileData.code === 'string' && fileData.code.startsWith('https://raw.githubusercont')) continue

        const label = document.createElement('label')
        label.className = 'ai-api-conduit__file-item'
        const cb = document.createElement('input')
        cb.type = 'checkbox'
        cb.name = 'include-file'
        cb.value = filename
        if (filename === viewing) cb.checked = true
        label.appendChild(cb)
        label.appendChild(document.createTextNode(' ' + filename))
        list.appendChild(label)
      }

      container.appendChild(list)
      if (this._usesNnLib()) container.appendChild(this._createNnCheckbox())
    } else if (isSketch) {
      // SKETCH MODE
      container.innerHTML = ''

      const sketchLabel = document.createElement('label')
      sketchLabel.className = 'ai-api-conduit__file-item'
      const sketchCb = document.createElement('input')
      sketchCb.type = 'checkbox'
      sketchCb.name = 'include-sketch'
      sketchCb.checked = true
      sketchLabel.appendChild(sketchCb)
      sketchLabel.appendChild(document.createTextNode(' include code from current sketch'))
      container.appendChild(sketchLabel)

      if (this._usesNnLib()) container.appendChild(this._createNnCheckbox())
    } else {
      container.innerHTML = '<p style="margin-top:0"><i>No sketch or project is currently open.</i></p>'
    }
  }

  _createNnCheckbox () {
    const label = document.createElement('label')
    label.className = 'ai-api-conduit__file-item'
    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.name = 'include-nn-docs'
    cb.checked = true
    label.appendChild(cb)
    label.appendChild(document.createTextNode(' include nn.min.js docs'))
    return label
  }

  _usesNnLib () {
    return utils.usesLib('https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library@1.0.1/build/nn.min.js')
  }

  getIncludedCode () {
    const parts = []
    const projectName = WIDGETS['project-files']?.projectData?.name

    if (projectName) {
      // project mode: gather checked files
      const checkboxes = this.ele.querySelectorAll('[name="include-file"]:checked')
      checkboxes.forEach(cb => {
        const filename = cb.value
        const fileData = WIDGETS['project-files'].files[filename]
        if (fileData) {
          parts.push(`--- ${filename} ---\n${fileData.code}`)
        }
      })
    } else {
      // sketch mode
      const sketchCb = this.$('[name="include-sketch"]')
      if (sketchCb && sketchCb.checked) {
        parts.push(`--- sketch code ---\n${NNE.code}`)
      }
    }

    // include nn.js documentation if checked
    const nnCb = this.ele.querySelector('[name="include-nn-docs"]')
    if (nnCb && nnCb.checked && this.nnDocs) {
      parts.push(`--- nn.js library documentation ---\n${this.nnDocs}`)
    }

    return parts.length > 0 ? parts.join('\n\n') : ''
  }

  _setupSendButton () {
    this.$('[name="send-btn"]').addEventListener('click', () => this._sendRequest())
  }

  async _sendRequest () {
    const pconvo = this.useSchema ? 'llm-possessed-takeover' : 'llm-possessed-processing'
    window.convo = new Convo(this.convos, pconvo)

    const a = this.adapters[this.provider]
    if (!a) return this.convo('provider-disabled')

    if (a.needsKey && !this.settings.key) return this.convo('no-key')

    const rawInput = this.$('[name="user-input"]').value.trim()
    if (!rawInput) return this.convo('no-input')

    if (window.plausible) window.plausible('llm_chat')
    const includedCode = this.getIncludedCode()
    const userInput = includedCode
      ? `${rawInput}\n\nHere is the code I'm working with:\n\n${includedCode}`
      : rawInput

    const btn = this.$('[name="send-btn"]')
    btn.textContent = 'sending...'
    btn.disabled = true

    this.$('[name="response-display"]').textContent = 'waiting for response...'

    try {
      const req = this._buildRequest(userInput)
      const response = await window.fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(req.body)
      })

      const data = await response.json()
      const rawText = a.reply(data)

      this.$('[name="response-display"]').textContent = rawText

      if (this.useSchema) {
        const model = req.body.model
        const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
        let result
        try {
          result = JSON.parse(cleaned)
        } catch (e) {
          throw new Error(`The model "${model}" did not return valid JSON. Try disabling the schema for this model.`)
        }
        if (typeof result.restatement !== 'string' || !Array.isArray(result.snippets) || result.snippets.length === 0) {
          console.warn('[llm] unexpected result structure:', result)
          throw new Error(`The model "${model}" returned JSON but did not follow the required schema. Try disabling the schema for this model.`)
        }
        this._shareResult(result)
      } else {
        this._showRawReply(rawText)
      }
    } catch (err) {
      this.$('[name="response-display"]').textContent = `Error: ${err.message}`
      console.error('ŏ︵ŏ error from LLM provider:', err)
      if (this.provider === 'ollama' && err.message.includes('Failed to fetch')) {
        const isChrome = nn.browserInfo().name === 'Chrome'
        window.convo = new Convo(this.convos, isChrome ? 'ollama-cors-error-chrome' : 'ollama-cors-error')
      } else {
        window.convo = new Convo(this.convos, 'oh-no-error')
      }
    }

    btn.textContent = 'send request'
    btn.disabled = false
  }

  _showRawReply (text) {
    WIDGETS.open('ai-llm-reply', (w) => {
      w.loadReply(text)
      window.convo = new Convo(this.convos, 'llm-reply-wig')
    })
  }

  _shareResult (json) {
    if (!this._possessed) this._getPossessed()

    const escapeHtml = (str) => {
      const escaped = str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
      return escaped.replace(/`([^`]+)`/g, '<code>$1</code>')
    }

    const displaySnippets = () => {
      WIDGETS.open('ai-code-tracer', (w) => {
        if (this.opened) this.close()
        w.loadSnippets(json.snippets)
      })
    }

    const askAgain = () => {
      NNW.menu.switchFace('default')
      if (this.opened) {
        this.switchTab('post')
        window.convo = new Convo(this.convos, 'restate-query')
      } else {
        const ssConvos = WIDGETS['student-session'].convos
        window.convo = new Convo(ssConvos, 'ask-llm-restate')
      }
    }

    // restate question to confirm understanding
    window.convo = new Convo({
      id: 'llm-possessed-restatement',
      content: escapeHtml(json.restatement),
      options: {
        yes: () => displaySnippets(),
        no: () => askAgain()
      }
    })
  }

  _getPossessed () {
    // add LLM possessed look
    NNW.menu.updateFace({
      leftEye: '☉', mouth: '﹏', rightEye: '☉', animation: 'possessed'
    })
    nn.get('.text-bubble').classList.add('text-bubble-llm')
    nn.get('.text-bubble-triangle').classList.add('text-bubble-triangle-llm')
    this._possessed = true
  }

  _setupConvoListener () {
    // remove LLM possessed look
    let _convo = window.convo
    const self = this
    const obj = {
      get () { return _convo },
      set (convo) {
        _convo = convo
        if (convo.id.indexOf('llm-possessed') !== 0 && self._possessed) {
          self._possessed = false
          nn.get('.text-bubble').classList.remove('text-bubble-llm')
          nn.get('.text-bubble-triangle').classList.remove('text-bubble-triangle-llm')
          NNW.menu.switchFace('default')
        }
      }
    }
    Object.defineProperty(window, 'convo', obj)
  }
}

window.AiApiConduit = AiApiConduit
