/* global NNE, NNW, WIDGETS, Widget, Convo, utils, nn, marked, navigator */
class AiApiConduit extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'ai-api-conduit'
    this.keywords = ['ai', 'artificial', 'intelligence', 'api', 'llm', 'conduit']
    this.title = 'LLM-API Conduit <span style="opacity: 0.5;margin-left:10px">(EXPERIMENTAL BETA)</span>'
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.width = 638
    this.height = 535

    this.provider = 'gemini' // or 'openai', 'anthropic', 'ollama', 'disabled'
    this.systemPrompt = '' // see data/system-prompt-sketch.txt (or -project.txt)
    this.nnDocs = null // see core/netnet-standard-library/nn-context.md

    // the current settings, loaded from (&& saved to) student-session
    // by _loadSettings() && _saveSetting(), see _settingsKeys()
    this.settings = { key: null, model: null, temperature: 1, maxTokens: 4096, numCtx: 32768, think: false, attach: true, mode: 'library', extended: false, integration: 'possessed' }
    this.adapters = this._createAdapters()

    // the current conversation, in nn.prompt()'s format (kept in memory):
    // [{ role: 'user', content, files }, { role: 'model', content }, ...]
    this.history = []

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
    this.nnDocs = await utils.getSync('/core/netnet-standard-library/nn-context.md', true)
    this._setupTabs()
    this._setupProviderToggle()
    this._setupApiKey()
    this._setupIntegration()
    this._setupOptionsBar()
    this._setupRequestBody()
    this._populateSystemPrompt()
    this._setupSystemPrompt()
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
        if (label.dataset.tab === 'attach' || label.dataset.tab === 'system') {
          this._populateSystemPrompt()
        }
        if (label.dataset.tab === 'attach') this._populateIncludeCode()
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

  _setupIntegration () {
    // how netnet shares the LLM's reply: 'widget' or 'possessed' (convo)
    const select = this.$('[name="integration"]')
    select.value = this.settings.integration
    select.addEventListener('change', () => {
      this._saveSetting('integration', select.value)
      this.convo(`integration-${select.value}`, true)
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
      temperature: `llm-temperature-${this.provider}`,
      maxTokens: 'llm-max-tokens',
      numCtx: 'llm-num-ctx',
      think: 'llm-think',
      attach: 'llm-attach-files',
      mode: 'llm-mode',
      extended: 'llm-extended-options',
      integration: 'llm-integration'
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
      temperature: num(ss.getData(keys.temperature), a?.temperature ?? 0.4),
      maxTokens: num(ss.getData(keys.maxTokens), 4096),
      numCtx: num(ss.getData(keys.numCtx), 32768),
      think: ss.getData(keys.think) === 'true',
      attach: ss.getData(keys.attach) !== 'false', // on by default
      mode: ss.getData(keys.mode) === 'vanilla' ? 'vanilla' : 'library',
      extended: ss.getData(keys.extended) === 'true',
      integration: ss.getData(keys.integration) === 'widget' ? 'widget' : 'possessed' // the default
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
  // model, temperature: defaults, needsKey: whether it requires an API key
  // timeout: seconds to wait for a reply before giving up (default 90)
  // status: the provider's status page (for when their servers have issues)
  // request(o): builds the { url, method, headers, body } sent to the API
  // reply(data): finds the text of the reply in the API's response
  // display(h): the request body as rendered in the "API Request" tab
  // library(h): extra nn.prompt() options shown in "library" mode (if any)
  //             when "show extended options" is checked (they're always sent)
  // libraryOpts(s): those same options for copied code (see sendFunctionCode)
  // replyCode: where the reply's text is in the response (for copied code)

  _createAdapters () {
    // our messages use nn.prompt()'s roles: 'user' && 'model',
    // most providers call the model's role 'assistant' (Gemini uses 'model')
    const as = (messages, word) => messages.map(m => ({
      role: m.role === 'model' ? word : m.role, content: m.content
    }))
    return {
      gemini: {
        model: 'gemini-3.5-flash-lite',
        temperature: 1, // Google recommends keeping Gemini 3 models at 1
        needsKey: true,
        status: 'https://aistudio.google.com/status',
        request: (o) => ({
          // NOTE: Gemini is the only provider that puts the model in the URL
          url: `https://generativelanguage.googleapis.com/v1beta/models/${o.model}:generateContent`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': o.key
          },
          body: {
            systemInstruction: { parts: [{ text: o.system }] },
            contents: o.messages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
            generationConfig: { temperature: o.temperature }
          }
        }),
        reply: (data) => {
          if (data.error) throw new Error(data.error.message)
          const candidate = data.candidates?.[0]
          if (!candidate) {
            const reason = data.promptFeedback?.blockReason
            throw new Error(reason ? `Request blocked by Gemini (${reason})` : 'Unexpected Gemini response structure')
          }
          // join the text parts (skipping any "thought" parts)
          const parts = candidate.content?.parts || []
          const text = parts.filter(p => p.text && !p.thought).map(p => p.text).join('')
          if (!text) throw new Error(`Gemini returned no text (finishReason: ${candidate.finishReason})`)
          return text
        },
        replyCode: 'data.candidates[0].content.parts[0].text',
        display: (h) => `{
  systemInstruction: { parts: [{ text: ${h.system} }] },
  contents: [
${h.history}    { role: 'user', parts: [{ text: ${h.input} }] }
  ],
  generationConfig: {
    temperature: ${h.temperature}
  }
}`
      },

      openai: {
        model: 'gpt-5.4-mini',
        temperature: 0.4,
        needsKey: true,
        status: 'https://status.openai.com',
        request: (o) => ({
          url: 'https://api.openai.com/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${o.key}`
          },
          body: {
            model: o.model,
            messages: [
              { role: 'system', content: o.system },
              ...as(o.messages, 'assistant')
            ],
            temperature: o.temperature
          }
        }),
        reply: (data) => {
          if (data.error) throw new Error(data.error.message)
          const msg = data.choices?.[0]?.message
          if (!msg) throw new Error('Unexpected OpenAI response structure')
          if (msg.refusal) throw new Error(`The model refused: ${msg.refusal}`)
          if (!msg.content) throw new Error(`OpenAI returned no text (finish_reason: ${data.choices[0].finish_reason})`)
          return msg.content
        },
        replyCode: 'data.choices[0].message.content',
        display: (h) => `{
  model: ${h.model},
  messages: [
    { role: 'system', content: ${h.system} },
${h.history}    { role: 'user', content: ${h.input} }
  ],
  temperature: ${h.temperature}
}`
      },

      anthropic: {
        // NOTE: no temperature, Anthropic's newer models reject it
        model: 'claude-haiku-4-5',
        needsKey: true,
        status: 'https://status.claude.com',
        request: (o) => ({
          url: 'https://api.anthropic.com/v1/messages',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': o.key,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true'
          },
          body: {
            model: o.model,
            system: o.system,
            messages: as(o.messages, 'assistant'),
            max_tokens: parseInt(o.maxTokens) || 4096
          }
        }),
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
        replyCode: 'data.content.find(block => block.type === \'text\').text',
        display: (h) => `{
  model: ${h.model},
  system: ${h.system},
  messages: [
${h.history}    { role: 'user', content: ${h.input} }
  ],
  max_tokens: ${h.maxTokens}
}`,
        library: (h) => [`max_tokens: ${h.maxTokens}`],
        libraryOpts: (s) => ({ max_tokens: s.maxTokens })
      },

      ollama: {
        model: 'gemma4:e2b',
        temperature: 0.4,
        timeout: 300, // local models can be slow on less powerful computers
        needsKey: false,
        request: (o) => ({
          url: 'http://localhost:11434/api/chat',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: {
            model: o.model,
            messages: [
              { role: 'system', content: o.system },
              ...as(o.messages, 'assistant')
            ],
            stream: false,
            think: o.think,
            options: { temperature: o.temperature, num_ctx: parseInt(o.numCtx) || 32768 }
          }
        }),
        reply: (data) => {
          if (data.error) throw new Error(data.error)
          if (!data.message?.content && data.done_reason === 'length') {
            throw new Error(`The model ran out of room in its context window (num_ctx: ${this.settings.numCtx} tokens) before it finished replying. Try a larger num_ctx or attach fewer files.`)
          }
          if (!data.message?.content) throw new Error('Unexpected Ollama response structure')
          return data.message.content
        },
        replyCode: 'data.message.content',
        display: (h) => `{
  model: ${h.model},
  messages: [
    { role: 'system', content: ${h.system} },
${h.history}    { role: 'user', content: ${h.input} }
  ],
  stream: false,
  think: ${h.think},
  options: {
    temperature: ${h.temperature},
    num_ctx: ${h.numCtx}
  }
}`,
        libraryOpts: (s) => ({ think: s.think, options: { num_ctx: s.numCtx } }),
        library: (h) => [`think: ${h.think}`, `options: {
    num_ctx: ${h.numCtx}
  }`]
      }
    }
  }

  _requestMessages () {
    // the history as it gets sent: only the newest question carries the
    // attached files (older ones get a placeholder, so the model isn't
    // confused by old versions of the code)
    const last = this.history.length - 1
    return this.history.map((m, i) => {
      if (m.role !== 'user' || !m.files) return { role: m.role, content: m.content }
      const files = i === last
        ? `Here is the code I'm working with:\n\n${m.files}`
        : '[files omitted: see the latest message for the current version]'
      return { role: 'user', content: `${m.content}\n\n${files}` }
    })
  }

  contextSize () {
    // a rough estimate of the conversation's size (~4 characters per token)
    const chars = this._requestMessages().reduce((n, m) => n + m.content.length, 0) +
      (this.systemPrompt || '').length
    return { messages: this.history.length, tokens: Math.round(chars / 4) }
  }

  clearHistory () {
    this.history = []
    this._refreshRequestBody()
    if (WIDGETS['ai-llm-reply']?.opened) WIDGETS['ai-llm-reply'].loadConversation()
  }

  _refreshRequestBody () {
    if (this.$('[name="request-body"]')) this._setupRequestBody()
  }

  _buildRequest (messages) {
    // messages: [{ role: 'user' || 'model', content }] (see _requestMessages)
    const a = this.adapters[this.provider]
    return a.request({
      key: this.settings.key,
      model: this.settings.model || a.model,
      system: this.systemPrompt,
      messages,
      temperature: this.settings.temperature,
      maxTokens: this.settings.maxTokens,
      numCtx: this.settings.numCtx,
      think: this.settings.think
    })
  }

  // ...........................................................................

  _setupRequestBody () {
    const pre = this.$('[name="request-body"]')
    const a = this.adapters[this.provider]
    if (!a) { pre.innerHTML = ''; return }

    const s = this.settings
    // the editable parts of the request && links to the other tabs
    const h = {
      model: `<input type="text" name="model" value="${s.model || ''}" placeholder="model-name">`,
      temperature: `<input type="number" name="temperature" min="0.0" max="2.0" step="0.01" value="${s.temperature}">`,
      maxTokens: `<input type="number" name="max-tokens" min="1" max="8192" step="1" value="${s.maxTokens}">`,
      numCtx: `<input type="number" name="num-ctx" min="2048" max="262144" step="1024" value="${s.numCtx}">`,
      think: `<select name="think"><option value="false">false</option><option value="true"${s.think ? ' selected' : ''}>true</option></select>`,
      system: '<span class="link" data-tab="system">systemPrompt</span>',
      input: '<span class="link" data-tab="test">userInput</span>' +
        (s.attach ? ' + <span class="link" data-tab="attach">attachedFiles</span>' : ''),
      // the earlier messages in this conversation (if any)
      history: this.history.length === 0 ? ''
        : `    ...<span class="link" data-convo="req-history">history</span>, <span style="opacity: 0.5">// ${this.history.length} earlier messages</span> (<span class="link" data-action="clear-history">clear</span>)\n`
    }
    pre.innerHTML = s.mode === 'library' ? this._libraryDisplay(a, h) : this._vanillaDisplay(a, h)

    // only offer "extended options" in library mode, for providers that have any
    const ext = this.ele.querySelector('[name="extended-option"]')
    if (ext) ext.style.display = s.mode === 'library' && a.library ? '' : 'none'

    pre.querySelectorAll('.link').forEach(link => {
      link.addEventListener('click', () => {
        if (link.dataset.action === 'clear-history') return this.convo('clear-history', true)
        if (link.dataset.convo) return this.convo(link.dataset.convo, true)
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

  _vanillaDisplay (a, h) {
    // the URL && headers come from the adapter's actual request (so they always
    // match what's sent), with the key && model swapped for placeholders
    const KEY = '\u0000KEY\u0000'
    const MODEL = '\u0000MODEL\u0000'
    const req = a.request({ ...this.settings, key: KEY, model: MODEL, system: '', messages: [] })
    const keyLink = '<span class="link" data-convo="mode-key">KEY</span>'
    const url = req.url.replace(MODEL, h.model)
    const headers = Object.entries(req.headers).map(([name, value]) => {
      const v = value === KEY ? keyLink
        : value.includes(KEY) ? `'${value.replace(KEY, '')}' + ${keyLink}`
          : `'${value}'`
      return `  '${name}': ${v}`
    })
    return `<span class="link" data-convo="req-method">${req.method}</span> ${url}\n\n` +
      `<span class="link" data-convo="req-headers">headers</span>: {\n${headers.join(',\n')}\n}\n\n` +
      `body: ${a.display(h)}`
  }

  _libraryDisplay (a, h) {
    // the request as the options object passed to nn.prompt()
    // (from the netnet-machine-learning library: src/nn-prompt.js)
    const opts = [
      `provider: '${this.provider}'`,
      `model: ${h.model}`,
      ...(a.needsKey ? ['key: <span class="link" data-convo="mode-key">KEY</span>'] : []),
      `system: ${h.system}`,
      `messages: [
${h.history}    { role: 'user', content: ${h.input} }
  ]`,
      ...(typeof a.temperature === 'number' ? [`temperature: ${h.temperature}`] : []),
      ...(a.library && this.settings.extended ? a.library(h) : [])
    ]
    return `{\n  ${opts.join(',\n  ')}\n}`
  }

  _setupOptionsBar () {
    // options at the top of the API Request tab
    this.$('[name="copy-code"]').addEventListener('click', () => this.copyCode())

    this.$('[name="mode"]').forEach(radio => {
      radio.checked = radio.value === this.settings.mode
      radio.addEventListener('change', () => {
        this._saveSetting('mode', radio.value)
        this._setupRequestBody()
        this.convo(`mode-${radio.value}`, true)
      })
    })

    const extended = this.$('[name="extended"]')
    extended.checked = this.settings.extended
    extended.addEventListener('change', () => {
      this._saveSetting('extended', String(extended.checked))
      this._setupRequestBody()
      if (extended.checked) this.convo('extended-on', true)
    })

    const attach = this.$('[name="attach-files"]')
    attach.checked = this.settings.attach
    this._toggleAttachTab()
    attach.addEventListener('change', () => {
      this._saveSetting('attach', String(attach.checked))
      this._toggleAttachTab()
      this._setupRequestBody()
      if (attach.checked) this.convo('attach-on', true)
    })
  }

  _toggleAttachTab () {
    const label = this.ele.querySelector('.ai-api-conduit__tab-label[data-tab="attach"]')
    label.style.display = this.settings.attach ? '' : 'none'
  }

  _defaultSystemPrompt () {
    // one for sketches && one for projects, see data/system-prompt-*.txt
    const isProject = !!WIDGETS['project-files']?.projectData?.name
    return isProject ? this.systemPromptProject : this.systemPromptSketch
  }

  _populateSystemPrompt () {
    // a student's custom system prompt (if they've edited it) or the default
    const custom = WIDGETS['student-session'].getData('llm-system-prompt')
    this.systemPrompt = custom || this._defaultSystemPrompt()
    const textarea = this.$('[name="system-prompt"]')
    if (!textarea) return
    if (document.activeElement !== textarea) textarea.value = this.systemPrompt
    const isProject = !!WIDGETS['project-files']?.projectData?.name
    this.$('[name="system-prompt-status"]').textContent = custom
      ? 'your custom system prompt'
      : `my default system prompt (for ${isProject ? 'projects' : 'sketches'})`
    this.$('[name="system-prompt-reset"]').style.display = custom ? '' : 'none'
  }

  _setupSystemPrompt () {
    const textarea = this.$('[name="system-prompt"]')
    textarea.addEventListener('input', () => {
      const ss = WIDGETS['student-session']
      const wasCustom = !!ss.getData('llm-system-prompt')
      // saved as custom, unless it's empty or the same as the default
      const val = textarea.value
      const isDefault = val.trim() === '' || val === this._defaultSystemPrompt()
      ss.setData('llm-system-prompt', isDefault ? null : val)
      this._populateSystemPrompt()
      if (!wasCustom && !isDefault) this.convo('sys-custom', true)
    })
    this.$('[name="system-prompt-reset"]').addEventListener('click', () => {
      this.convo('sys-reset-confirm', true)
    })
  }

  resetSystemPrompt () {
    WIDGETS['student-session'].setData('llm-system-prompt', null)
    this.$('[name="system-prompt"]').value = this._defaultSystemPrompt()
    this._populateSystemPrompt()
  }

  _populateIncludeCode () {
    const container = this.$('[name="attach-content"]')
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

  async _sendRequest (question, newConversation) {
    // question: if not passed, uses the one in the Test tab
    // newConversation: if true, clears the history first (ex: "ask an LLM")
    window.convo = new Convo(this.convos, 'llm-possessed-processing')

    const a = this.adapters[this.provider]
    if (!a) return this.convo('provider-disabled')

    if (a.needsKey && !this.settings.key) return this.convo('no-key')

    const rawInput = (question || this.$('[name="user-input"]').value).trim()
    if (!rawInput) return this.convo('no-input')
    this.$('[name="user-input"]').value = rawInput

    if (window.plausible) window.plausible('llm_chat')
    this._populateSystemPrompt() // in case they've opened a project since
    this._lastSend = { question: rawInput, newConversation } // for "try again"
    if (newConversation) this.history = []
    const files = this.settings.attach ? this.getIncludedCode() : ''
    this.history.push({ role: 'user', content: rawInput, files })

    const btn = this.$('[name="send-btn"]')
    btn.textContent = 'sending...'
    btn.disabled = true

    this.$('[name="response-display"]').textContent = 'waiting for response...'

    let status = null
    // if the provider is slow to reply, let the student know what's going on,
    // && give up (or let them cancel) if it takes too long
    this._request = new window.AbortController()
    this._request.timedOut = false
    const slowTimer = setTimeout(() => this.convo('llm-slow', true), 20 * 1000)
    const timeout = setTimeout(() => {
      this._request.timedOut = true
      this._request.abort()
    }, (a.timeout || 90) * 1000)

    try {
      const req = this._buildRequest(this._requestMessages())
      const response = await window.fetch(req.url, {
        method: req.method,
        headers: req.headers,
        body: JSON.stringify(req.body),
        signal: this._request.signal
      })

      status = response.status
      const data = await response.json()
      const rawText = a.reply(data)

      this.$('[name="response-display"]').textContent = rawText
      this.history.push({ role: 'model', content: rawText })
      this._refreshRequestBody()

      if (this.settings.integration === 'possessed') this._showSteps(rawText)
      else this._showRawReply(rawText)
    } catch (err) {
      this.history.pop() // remove the question that failed (try again resends it)
      const aborted = err.name === 'AbortError'
      const msg = aborted && this._request.timedOut
        ? `No reply after ${a.timeout || 90} seconds.`
        : aborted ? 'Request canceled.' : err.message
      this.$('[name="response-display"]').textContent = `Error: ${msg}`
      console.error('ŏ︵ŏ error from LLM provider:', err)
      this.lastError = msg
      if (aborted && !this._request.timedOut) {
        // canceled by the student (see the llm-slow convo)
      } else if (aborted || [429, 503, 529].includes(status)) {
        // timed out, rate limited (429) or the servers are overloaded (503, 529)
        this.convo('llm-busy', true)
      } else if (err instanceof TypeError && status === null) {
        // fetch couldn't reach the server at all (no response, so no status),
        // browsers report these as "NetworkError" or "Failed to fetch" errors
        if (this.provider === 'ollama') {
          const isChrome = nn.browserInfo().name === 'Chrome'
          window.convo = new Convo(this.convos, isChrome ? 'ollama-cors-error-chrome' : 'ollama-cors-error')
        } else this.convo('llm-network-error', true)
      } else {
        window.convo = new Convo(this.convos, 'oh-no-error')
      }
    }

    clearTimeout(slowTimer)
    clearTimeout(timeout)
    this._refreshRequestBody()
    btn.textContent = 'send request'
    btn.disabled = false
  }

  retry () {
    // resend the last question (see the llm-network-error convo)
    if (this._lastSend) this._sendRequest(this._lastSend.question, this._lastSend.newConversation)
    else this._sendRequest()
  }

  // ...........................................................................
  // follow up questions (in the last bubble of a reply)

  followUpHTML () {
    return '<br><input name="llm-follow-up" style="width:350px" placeholder="reply to the LLM">'
  }

  setupFollowUp (convo) {
    // pressing Enter in the follow up input also sends it
    if (window.convo !== convo) return // in case it's been replaced
    const input = NNW.menu.textBubble.querySelector('[name="llm-follow-up"]')
    if (!input) return
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendFollowUp()
    })
  }

  sendFollowUp () {
    const input = NNW.menu.textBubble.querySelector('[name="llm-follow-up"]')
    const q = input ? input.value.trim() : ''
    if (!q) return input && input.focus()
    if (WIDGETS['ai-code-tracer']?.opened) WIDGETS['ai-code-tracer'].close()
    this._sendRequest(q)
  }

  _showRawReply (text) {
    this.loadMarked(() => {
      WIDGETS.open('ai-llm-reply', (w) => {
        w.loadConversation() // the whole conversation (see this.history)
        window.convo = new Convo(this.convos, 'llm-reply-wig')
      })
    })
  }

  // ...........................................................................
  // copy code: the current request as a send() function students can use in
  // their own code (nn.prompt() in "library" mode, fetch() in "vanilla" mode)

  copyCode () {
    const code = this.sendFunctionCode()
    navigator.clipboard.writeText(code)
    this.convo('copied-code', true)
  }

  sendFunctionCode () {
    const a = this.adapters[this.provider]
    if (!a) return ''
    const s = this.settings
    const hasHistory = this.history.length > 0
    const KEY = 'YOUR-API-KEY-HERE'
    // placeholders, replaced with code by _toJS
    const MSG = '\u0000message\u0000'
    const REPLY = '\u0000reply\u0000'
    const SYS = '\u0000system\u0000'
    const ctx = {
      hasHistory,
      MSG,
      code: {
        [MSG]: 'message',
        [REPLY]: 'text',
        [SYS]: '"You\'re a friendly assistant"'
      }
    }
    const js = (v, indent) => this._toJS(v, indent, ctx)
    const lines = []
    if (hasHistory) lines.push('const contextHistory = [] // the conversation', '')
    lines.push('async function send (message) {')

    if (s.mode === 'library') {
      const opts = {
        provider: this.provider,
        model: s.model || a.model,
        ...(a.needsKey ? { key: KEY } : {}),
        system: SYS,
        messages: [{ role: 'user', content: MSG }],
        ...(typeof a.temperature === 'number' ? { temperature: s.temperature } : {}),
        ...(a.libraryOpts ? a.libraryOpts(s) : {})
      }
      if (hasHistory) lines.push('  contextHistory.push({ role: \'user\', content: message })')
      lines.push(`  const reply = await nn.prompt(${js(opts, 1)})`)
      if (hasHistory) lines.push('  contextHistory.push({ role: \'model\', content: reply.text })')
      lines.push('  return reply.text')
    } else {
      const build = (messages) => a.request({ ...s, key: KEY, model: s.model || a.model, system: SYS, messages })
      const req = build([{ role: 'user', content: MSG }])
      // the user's && model's messages in this provider's format (for the history)
      const find = (body, marker) => Object.values(body)
        .filter(v => Array.isArray(v)).flat()
        .find(m => JSON.stringify(m).includes(JSON.stringify(marker).slice(1, -1)))
      const userMsg = find(req.body, MSG)
      const modelMsg = find(build([{ role: 'model', content: REPLY }]).body, REPLY)
      const options = {
        method: req.method,
        headers: req.headers,
        body: { _js: (indent) => `JSON.stringify(${js(req.body, indent)})` }
      }
      if (hasHistory) lines.push(`  contextHistory.push(${js(userMsg, 1)})`)
      lines.push(`  const response = await fetch('${req.url}', ${js(options, 1)})`)
      lines.push('  const data = await response.json()')
      lines.push('  if (!response.ok) throw new Error(data.error?.message || data.error)')
      lines.push(`  const text = ${a.replyCode}`)
      if (hasHistory) lines.push(`  contextHistory.push(${js(modelMsg, 1)})`)
      lines.push('  return text')
    }

    lines.push('}')
    return lines.join('\n')
  }

  loadSendExample () {
    // replaces the current sketch with a small page that uses a send() function
    const lib = this.settings.mode === 'library'
      ? '\n<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-machine-learning@0.1.0/src/nn-prompt.js"></script>'
      : ''
    NNE.code = `<script src="https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library@1.0.1/build/nn.min.js"></script>${lib}
<script>
  let input, output

  function setup () {
    input = nn.create('input')
      .set('placeholder', 'ask me anything')
      .addTo('body')

    nn.create('button')
      .content('send')
      .addTo('body')
      .on('click', async () => {
        output.content('...thinking...')
        const text = await send(input.value)
        output.content(text)
      })

    output = nn.create('p').addTo('body')
  }

  // ... PASTE YOUR SEND FUNCTION HERE...

  nn.on('load', setup)
</script>
`
  }

  _templateLiteral (str) {
    const escaped = String(str)
      .replace(/\\/g, '\\\\')
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${')
    return '`' + escaped + '`'
  }

  _toJS (v, indent, ctx) {
    // writes a value as JavaScript code (in netnet's code style)
    const pad = '  '.repeat(indent)
    const inner = '  '.repeat(indent + 1)
    if (v && typeof v._js === 'function') return v._js(indent)
    if (typeof v === 'string') {
      if (ctx.code[v]) return ctx.code[v]
      return `'${v.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\n/g, '\\n')}'`
    }
    if (Array.isArray(v)) {
      // in a conversation, the user's message (in the list of messages) is
      // replaced by the history
      const hasMsg = (m) => m && typeof m === 'object' && 'role' in m &&
        JSON.stringify(m).includes(JSON.stringify(ctx.MSG).slice(1, -1))
      if (ctx.hasHistory && v.length === 1 && hasMsg(v[0])) return 'contextHistory'
      const items = v.map(m => ctx.hasHistory && hasMsg(m) ? '...contextHistory' : this._toJS(m, indent + 1, ctx))
      const oneLine = `[${items.join(', ')}]`
      if (oneLine.length < 60 && !oneLine.includes('\n')) return oneLine
      return `[\n${inner}${items.join(`,\n${inner}`)}\n${pad}]`
    }
    if (v && typeof v === 'object') {
      const key = (k) => /^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`
      const items = Object.entries(v)
        .filter(([k, val]) => val !== undefined)
        .map(([k, val]) => `${key(k)}: ${this._toJS(val, indent + 1, ctx)}`)
      const oneLine = `{ ${items.join(', ')} }`
      if (oneLine.length < 60 && !oneLine.includes('\n')) return oneLine
      return `{\n${inner}${items.join(`,\n${inner}`)}\n${pad}}`
    }
    return String(v)
  }

  // ...........................................................................
  // markdown: LLMs (almost always) format their replies as markdown

  loadMarked (callback) {
    // the markdown parser (core/libs/marked.min.js), loaded only when needed
    if (window.marked) return callback()
    utils.loadFile('/core/libs/marked.min.js', callback)
  }

  _escapeHTML (str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }

  _markdownParser (blocks) {
    // a marked parser which displays any HTML in the reply (rather than
    // rendering it), opens links in a new tab && collects code blocks into
    // the blocks array (leaving a placeholder where each one was)
    const esc = (s) => this._escapeHTML(s)
    const safeURL = (href) => /^(https?:|mailto:|#|\/)/i.test(href || '')
    const md = new marked.Marked({ gfm: true, breaks: true })
    md.use({
      renderer: {
        html ({ text }) { return esc(text) },
        code ({ text, lang }) {
          blocks.push({ code: text, lang: (lang || '').trim().split(/\s+/)[0] })
          return `<span data-block="${blocks.length - 1}"></span>`
        },
        link ({ href, tokens }) {
          const text = this.parser.parseInline(tokens)
          if (!safeURL(href)) return text
          return `<a href="${esc(href)}" target="_blank">${text}</a>`
        },
        image ({ href, text }) {
          if (!safeURL(href)) return esc(text || '')
          return `<a href="${esc(href)}" target="_blank">${esc(text || href)}</a>`
        }
      }
    })
    return md
  }

  renderMarkdown (text) {
    // returns the reply as HTML, with placeholders for its code blocks
    // (<span data-block="0"></span>) && the list of those blocks: [{ code, lang }]
    const blocks = []
    const html = this._markdownParser(blocks).parse(text)
    return { html, blocks }
  }

  // ...........................................................................
  // "possessed convo" integration: the LLM's reply, one speech bubble at a time

  toSteps (text, maxWords = 60) {
    // splits a reply's markdown into steps: [{ html, block }], where html is
    // the content of a speech bubble && block is the index of the code block
    // (in the blocks list) shown alongside it, or null. returns { steps, blocks }
    const blocks = []
    const md = this._markdownParser(blocks)
    const tokens = md.lexer(text)
    const words = (str) => str.trim().split(/\s+/).filter(w => w).length
    const steps = []
    let heading = null // headings get added to the start of the next step

    const addStep = (html, isCode) => {
      if (heading) { html = `<b>${heading}</b><br>${html}`; heading = null }
      steps.push({ html, block: null, isCode: !!isCode })
    }

    // splits a long paragraph at the end of sentences (never in the middle of
    // one, or inside `inline code`), adding … where it was split
    const splitParagraph = (src) => {
      const sentences = src.split(/(?<=[.!?:])\s+(?=\S)/)
      const merged = [] // re-join sentences split inside `inline code`
      sentences.forEach(s => {
        const prev = merged[merged.length - 1]
        const openCode = prev && (prev.match(/`/g) || []).length % 2 === 1
        if (openCode) merged[merged.length - 1] += ' ' + s
        else merged.push(s)
      })
      const chunks = []
      merged.forEach(s => {
        const last = chunks[chunks.length - 1]
        if (last && words(last) + words(s) <= maxWords) chunks[chunks.length - 1] += ' ' + s
        else chunks.push(s)
      })
      return chunks.map((c, i) => {
        const html = md.parseInline(c)
        const start = i > 0 ? '…' : ''
        const end = i < chunks.length - 1 ? '…' : ''
        return start + html + end
      })
    }

    const addToken = (t) => {
      if (t.type === 'space' || t.type === 'hr') return
      if (t.type === 'blockquote') {
        // treat a quote's contents as ordinary paragraphs (some models
        // put their whole reply, or parts of it, in quotes)
        t.tokens.forEach(addToken)
      } else if (t.type === 'heading') {
        heading = md.parseInline(t.text)
      } else if (t.type === 'paragraph') {
        splitParagraph(t.text).forEach(html => addStep(html))
      } else if (t.type === 'code') {
        md.parser([t]) // adds it to the blocks list
        const block = blocks.length - 1
        // the step just before a code block introduces it, if there isn't
        // one (or it already introduces another block) add a short one
        const prev = steps[steps.length - 1]
        if (!prev || prev.isCode || heading) addStep(prev && prev.isCode ? 'Here\'s some more code:' : 'Here\'s some code:')
        const intro = steps[steps.length - 1]
        intro.block = block
        intro.isCode = true
      } else if (t.type === 'list') {
        // keep lists together, unless they're too long
        let items = []
        let start = t.start || 1
        const flush = () => {
          if (items.length === 0) return
          addStep(md.parser([{ ...t, start, items }]))
          start += items.length
          items = []
        }
        t.items.forEach(item => {
          const count = items.reduce((n, it) => n + words(it.text), 0)
          if (items.length > 0 && count + words(item.text) > maxWords) flush()
          items.push(item)
        })
        flush()
      } else {
        // tables, etc
        addStep(md.parser([t]))
      }
    }
    tokens.forEach(addToken)
    if (heading) addStep('')

    // a code block stays open after the step that introduced it, but only
    // while the following steps are still talking about that code
    const common = ['nn', 'const', 'let', 'var', 'function', 'return', 'this',
      'true', 'false', 'null', 'undefined', 'new', 'async', 'await', 'document',
      'window', 'console', 'log', 'amp', 'quot', 'lt', 'gt']
    const names = (str) => (str.match(/[A-Za-z_$][\w$]*/g) || [])
      .filter(n => n.length > 1 && !common.includes(n))
    const inlineCode = (html) => (html.match(/<code>[\s\S]*?<\/code>/g) || []).join(' ')
    let open = null
    let after = 0
    steps.forEach(s => {
      if (s.isCode) { open = s.block; after = 0; return }
      if (open === null) return
      after++
      const newSection = /^(<b>|<strong>|<h\d)/.test(s.html)
      const code = inlineCode(s.html)
      const blockNames = names(blocks[open].code)
      const related = names(code).some(n => blockNames.includes(n))
      // the step right after a block is usually explaining it, unless its
      // inline code is about something else, later steps need to mention it
      const explains = after === 1 && code === ''
      if (!newSection && (related || explains)) s.block = open
      else open = null
    })

    return { steps: steps.map(s => ({ html: s.html, block: s.block })), blocks }
  }

  _showSteps (text) {
    this.loadMarked(() => {
      const { steps, blocks } = this.toSteps(text)
      // (only if a reply had nothing but ex: a horizontal rule)
      if (steps.length === 0) return this._showRawReply(text)
      this._steps = { text, steps, blocks, idx: 0 }
      this._getPossessed()
      this._goToStep(0)
    })
  }

  _goToStep (idx) {
    // creates the possessed convo for the given step of the current reply
    const { steps, blocks } = this._steps
    this._steps.idx = idx
    const step = steps[idx]
    const block = step.block !== null ? blocks[step.block] : null
    const first = idx === 0
    const last = idx === steps.length - 1

    const options = {}
    if (last) options.send = () => this.sendFollowUp()
    if (!last) options.next = () => this._goToStep(idx + 1)
    if (!first) options.previous = () => this._goToStep(idx - 1)
    if (block) options['open code snippet'] = () => this._showStepCode(block)
    if (first || last) options['show full reply'] = () => this._endSteps(true)
    options.done = () => this._endSteps()

    window.convo = new Convo({
      id: `llm-possessed-step-${idx}`,
      before: () => {
        this._getPossessed()
        if (block) this._showStepCode(block)
        else if (WIDGETS['ai-code-tracer']?.opened) WIDGETS['ai-code-tracer'].close()
      },
      after: (c) => { if (last) this.setupFollowUp(c) },
      content: last ? step.html + this.followUpHTML() : step.html,
      options
    })
  }

  _showStepCode (block) {
    WIDGETS.open('ai-code-tracer', (w) => w.showBlock(block))
  }

  resumeSteps () {
    // back to the current step (ex: after the code widget's copy convos)
    if (this._steps) this._goToStep(this._steps.idx)
  }

  _endSteps (showFullReply) {
    if (WIDGETS['ai-code-tracer']?.opened) WIDGETS['ai-code-tracer'].close()
    this._unpossess()
    if (showFullReply) this._showRawReply(this._steps.text)
    else window.convo.hide()
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

  _unpossess () {
    // remove LLM possessed look
    this._possessed = false
    nn.get('.text-bubble').classList.remove('text-bubble-llm')
    nn.get('.text-bubble-triangle').classList.remove('text-bubble-triangle-llm')
    NNW.menu.switchFace('default')
  }

  _setupConvoListener () {
    // remove LLM possessed look when any other convo is displayed
    let _convo = window.convo
    const self = this
    const obj = {
      get () { return _convo },
      set (convo) {
        _convo = convo
        if (convo.id.indexOf('llm-possessed') !== 0 && self._possessed) {
          self._unpossess()
        }
      }
    }
    Object.defineProperty(window, 'convo', obj)
  }
}

window.AiApiConduit = AiApiConduit
