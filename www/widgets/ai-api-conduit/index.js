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

    this.provider = 'openai' // or 'anthropic'
    this.systemPrompt = '' // see data/system-prompt.txt
    this.schema = null // see data/schema.json
    this.nnDocs = null // see data/nn-docs-for-llm.md

    this._setupConvoListener()

    this.on('open', () => this._createHTML(opts))
  }

  convo (key) {
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
    this.schema = await utils.getSync(`/widgets/${w}/data/schema.json`)
    this.nnDocs = await utils.getSync(`/widgets/${w}/data/nn-docs-for-llm.md`, true)
    this._setupTabs()
    this._setupProviderToggle()
    this._setupRequestBody()
    this._loadStoredSettings()
    this._setupSettingsSync()
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
        window.convo = new Convo(this.convos, label.dataset.tab)
      })
    })
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

    select.addEventListener('blur', () => {
      window.convo = new Convo(this.convos, `create-${select.value}-key`)
    })

    select.addEventListener('change', () => {
      window.convo = new Convo(this.convos, `create-${select.value}-key`)
      this.provider = select.value
      ss.setData('llm-provider', select.value)
      this._setupRequestBody()
      this.$('[name="api-key"]').value = ''
      this._loadStoredSettings()
      this._setupSettingsSync()
    })
  }

  _setupRequestBody () {
    const pre = this.$('[name="request-body"]')
    if (this.provider === 'openai') {
      pre.innerHTML = `{
  model: <input type="text" name="model" value="gpt-5.4-mini" placeholder="model-name">,
  instructions: <span class="link" data-tab="system">systemPrompt</span>,
  input: <span class="link" data-tab="post">userInput</span>,
  text: {
    format: {
      type: 'json_schema',
      name: 'coding_tutor_response',
      schema: <span class="link" data-tab="schema">schema</span>,
      strict: true
    }
  },
  temperature: <input type="number" name="temperature" min="0.0" max="2.0" step="0.01" value="0.4">
}`
    } else {
      pre.innerHTML = `{
  model: <input type="text" name="model" value="claude-haiku-4-5" placeholder="model-name">,
  system: <span class="link" data-tab="system">systemPrompt</span>,
  messages: [
    { role: 'user', content: <span class="link" data-tab="post">userInput</span> }
  ],
  max_tokens: <input type="number" name="max-tokens" min="1" max="8192" step="1" value="4096">,
  output_config: {
    format: {
      type: 'json_schema',
      schema: <span class="link" data-tab="schema">schema</span>
    }
  },
  temperature: <input type="number" name="temperature" min="0.0" max="2.0" step="0.01" value="0.4">
}`
    }
    pre.querySelectorAll('.link').forEach(link => {
      link.addEventListener('click', () => this.switchTab(link.dataset.tab))
    })
  }

  _populateSystemPrompt () {
    const isProject = !!WIDGETS['project-files']?.projectData?.name
    this.systemPrompt = isProject ? this.systemPromptProject : this.systemPromptSketch
    this.$('[name="system-prompt"]').textContent = this.systemPrompt
  }

  _populateSchema () {
    this.$('[name="schema-display"]').textContent = JSON.stringify(this.schema, null, 2)
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
    const nnSrc = 'cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js'
    return NNE.code.includes(nnSrc)
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

  _loadStoredSettings () {
    const ss = WIDGETS['student-session']

    const key = ss.getData(`llm-key-${this.provider}`)
    if (key) this.$('[name="api-key"]').value = key

    const modelEl = this.$('[name="model"]')
    const storedModel = ss.getData(`llm-model-${this.provider}`)
    if (storedModel) modelEl.value = storedModel
    else ss.setData(`llm-model-${this.provider}`, modelEl.value)

    const tempEl = this.$('[name="temperature"]')
    const storedTemp = ss.getData('llm-temperature')
    if (storedTemp) tempEl.value = storedTemp
    else ss.setData('llm-temperature', tempEl.value)

    const maxEl = this.ele.querySelector('[name="max-tokens"]')
    if (maxEl) {
      const storedMax = ss.getData('llm-max-tokens')
      if (storedMax) maxEl.value = storedMax
      else ss.setData('llm-max-tokens', maxEl.value)
    }
  }

  _setupSettingsSync () {
    const ss = WIDGETS['student-session']

    this.$('[name="api-key"]').addEventListener('click', async (e) => {
      this.convos = window.CONVOS[this.key](this)
      window.convo = new Convo(this.convos, 'paste-key')
      await nn.sleep(utils.getVal('--menu-fades-time'))
      this.$('[name="api-key"]').focus()
    })

    this.$('[name="api-key"]').addEventListener('change', (e) => {
      const val = e.target.value.trim()
      ss.setData(`llm-key-${this.provider}`, val || null)
    })

    this.$('[name="model"]').addEventListener('change', (e) => {
      ss.setData(`llm-model-${this.provider}`, e.target.value.trim() || null)
    })

    this.$('[name="temperature"]').addEventListener('change', (e) => {
      ss.setData('llm-temperature', e.target.value || null)
    })

    const maxEl = this.ele.querySelector('[name="max-tokens"]')
    if (maxEl) {
      maxEl.addEventListener('change', (e) => {
        ss.setData('llm-max-tokens', e.target.value || null)
      })
    }
  }

  _setupSendButton () {
    this.$('[name="send-btn"]').addEventListener('click', () => this._sendRequest())
  }

  async _sendRequest () {
    window.convo = new Convo(this.convos, 'llm-possessed-processing')

    const apiKey = this.$('[name="api-key"]').value.trim()
    if (!apiKey) return this.convo('no-key')

    const rawInput = this.$('[name="user-input"]').value.trim()
    if (!rawInput) return this.convo('no-input')

    const includedCode = this.getIncludedCode()
    const userInput = includedCode
      ? `${rawInput}\n\nHere is the code I'm working with:\n\n${includedCode}`
      : rawInput

    const systemPrompt = this.$('[name="system-prompt"]').textContent
    const model = this.$('[name="model"]').value
    const temperature = parseFloat(this.$('[name="temperature"]').value)

    const btn = this.$('[name="send-btn"]')
    btn.textContent = 'sending...'
    btn.disabled = true

    this.$('[name="response-display"]').textContent = 'waiting for response...'

    try {
      let url, headers, body

      if (this.provider === 'openai') {
        url = 'https://api.openai.com/v1/responses'
        headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        }
        body = {
          model,
          instructions: systemPrompt,
          input: userInput,
          text: {
            format: {
              type: 'json_schema',
              name: 'coding_tutor_response',
              schema: this.schema,
              strict: true
            }
          },
          temperature
        }
      } else if (this.provider === 'anthropic') {
        url = 'https://api.anthropic.com/v1/messages'
        headers = {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        }
        const maxTokens = parseInt(this.$('[name="max-tokens"]').value) || 4096
        body = {
          model,
          system: systemPrompt,
          messages: [{ role: 'user', content: userInput }],
          max_tokens: maxTokens,
          output_config: {
            format: {
              type: 'json_schema',
              schema: this.schema
            }
          },
          temperature
        }
      }

      const response = await window.fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      })

      const data = await response.json()
      let result

      if (this.provider === 'openai') {
        if (data.error) throw new Error(data.error.message)
        const msg = data.output.find(item => item.type === 'message')
        if (!msg?.content?.[0]) throw new Error('Unexpected OpenAI response structure')
        const content = msg.content[0]
        if (content.type !== 'output_text') throw new Error(`Expected output_text, got ${content.type}`)
        result = JSON.parse(content.text)
      } else if (this.provider === 'anthropic') {
        if (data.error) throw new Error(data.error.message)
        if (data.type === 'error') throw new Error(data.error?.message || 'Unknown error')
        const content = data.content?.[0]
        if (!content || content.type !== 'text') throw new Error('Unexpected Anthropic response structure')
        result = JSON.parse(content.text)
      }

      this.$('[name="response-display"]').textContent = JSON.stringify(result, null, 2)
      this._shareResult(result)
    } catch (err) {
      this.$('[name="response-display"]').textContent = `Error: ${err.message}`
      console.error('ŏ︵ŏ error from LLM provider:', err)
      window.convo = new Convo(this.convos, 'oh-no-error')
    }

    btn.textContent = 'send request'
    btn.disabled = false
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
