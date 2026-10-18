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

    this.provider = 'gemini' // or 'openai', 'anthropic', 'ollama', 'disabled'
    this.systemPrompt = '' // see data/system-prompt-sketch.txt (or -project.txt)
    this.nnDocs = null // see core/netnet-standard-library/nn-context.md

    // the current settings, loaded from (&& saved to) student-session
    // by _loadSettings() && _saveSetting(), see _settingsKeys()
    this.settings = { key: null, model: null, temperature: 1, maxTokens: 4096, numCtx: 32768, think: false, attach: true }
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
    this.nnDocs = await utils.getSync('/core/netnet-standard-library/nn-context.md', true)
    this._setupTabs()
    this._setupProviderToggle()
    this._setupApiKey()
    this._setupOptionsBar()
    this._setupRequestBody()
    this._populateSystemPrompt()
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
      attach: 'llm-attach-files'
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
      attach: ss.getData(keys.attach) !== 'false' // on by default
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
  // display(h): the request body as rendered in the "Request Body" tab

  _createAdapters () {
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
            contents: [
              { role: 'user', parts: [{ text: o.input }] }
            ],
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
        display: (h) => `POST .../models/${h.model}:generateContent
{
  systemInstruction: { parts: [{ text: ${h.system} }] },
  contents: [
    { role: 'user', parts: [{ text: ${h.input} }] }
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
              { role: 'user', content: o.input }
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
        display: (h) => `{
  model: ${h.model},
  messages: [
    { role: 'system', content: ${h.system} },
    { role: 'user', content: ${h.input} }
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
            messages: [{ role: 'user', content: o.input }],
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
        display: (h) => `{
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
              { role: 'user', content: o.input }
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
        display: (h) => `{
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
    pre.innerHTML = a.display({
      model: `<input type="text" name="model" value="${s.model || ''}" placeholder="model-name">`,
      temperature: `<input type="number" name="temperature" min="0.0" max="2.0" step="0.01" value="${s.temperature}">`,
      maxTokens: `<input type="number" name="max-tokens" min="1" max="8192" step="1" value="${s.maxTokens}">`,
      numCtx: `<input type="number" name="num-ctx" min="2048" max="262144" step="1024" value="${s.numCtx}">`,
      think: `<select name="think"><option value="false">false</option><option value="true"${s.think ? ' selected' : ''}>true</option></select>`,
      system: '<span class="link" data-tab="system">systemPrompt</span>',
      input: '<span class="link" data-tab="test">userInput</span>' +
        (s.attach ? ' + <span class="link" data-tab="attach">attachedFiles</span>' : '')
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

  _setupOptionsBar () {
    // options at the top of the Request Body tab
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

  _populateSystemPrompt () {
    const isProject = !!WIDGETS['project-files']?.projectData?.name
    this.systemPrompt = isProject ? this.systemPromptProject : this.systemPromptSketch
    this.$('[name="system-prompt"]').textContent = this.systemPrompt
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

  async _sendRequest () {
    window.convo = new Convo(this.convos, 'llm-possessed-processing')

    const a = this.adapters[this.provider]
    if (!a) return this.convo('provider-disabled')

    if (a.needsKey && !this.settings.key) return this.convo('no-key')

    const rawInput = this.$('[name="user-input"]').value.trim()
    if (!rawInput) return this.convo('no-input')

    if (window.plausible) window.plausible('llm_chat')
    const includedCode = this.settings.attach ? this.getIncludedCode() : ''
    const userInput = includedCode
      ? `${rawInput}\n\nHere is the code I'm working with:\n\n${includedCode}`
      : rawInput

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
      const req = this._buildRequest(userInput)
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

      this._showRawReply(rawText)
    } catch (err) {
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
    btn.textContent = 'send request'
    btn.disabled = false
  }

  _showRawReply (text) {
    WIDGETS.open('ai-llm-reply', (w) => {
      w.loadReply(text)
      window.convo = new Convo(this.convos, 'llm-reply-wig')
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
