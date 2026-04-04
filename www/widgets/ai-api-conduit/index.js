/* global NNE, WIDGETS, Widget, Convo, utils, nn */
class AiApiConduit extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'ai-api-conduit'
    this.keywords = ['ai', 'artificial', 'intelligence', 'api', 'llm', 'conduit']
    this.title = 'LLM-API Conduit'
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.width = 638
    this.height = 535

    this.provider = 'openai' // or 'anthropic'
    this.systemPrompt = '' // see data/system-prompt.txt
    this.schema = null // see data/schema.json

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
    this.innerHTML = await utils.getSync(`./widgets/${w}/index.html`, true)
    this.systemPrompt = await utils.getSync(`./widgets/${w}/data/system-prompt.txt`, true)
    this.schema = await utils.getSync(`./widgets/${w}/data/schema.json`)
    this._setupTabs()
    this._setupProviderToggle()
    this._setupRequestBody()
    this._populateSystemPrompt()
    this._populateSchema()
    this._setupSendButton()
    this.$('[name="help-btn"]').addEventListener('click', () => this.convo('start'))
    this.convo('start')
  }

  _setupTabs () {
    this.$('.ai-api-conduit__tab-label').forEach(label => {
      label.addEventListener('click', () => this.switchTab(label.dataset.tab))
    })
  }

  _setupProviderToggle () {
    this.$('[name="provider"]').forEach(radio => {
      radio.addEventListener('change', () => {
        this.provider = radio.value
        this._setupRequestBody()
      })
    })
  }

  _setupRequestBody () {
    const pre = this.$('[name="request-body"]')
    if (this.provider === 'openai') {
      pre.innerHTML = `{
  model: <input type="text" name="model" value="gpt-5.4-mini" placeholder="model-name">,
  instructions: <span class="link" data-tab="system">systemPrompt</span>,
  input: <span class="link" data-tab="test">userInput</span>,
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
    { role: 'user', content: <span class="link" data-tab="test">userInput</span> }
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
    this.$('[name="system-prompt"]').textContent = this.systemPrompt
  }

  _populateSchema () {
    this.$('[name="schema-display"]').textContent = JSON.stringify(this.schema, null, 2)
  }

  _setupSendButton () {
    this.$('[name="send-btn"]').addEventListener('click', () => this._sendRequest())
  }

  async _sendRequest () {
    const apiKey = this.$('[name="api-key"]').value.trim()
    if (!apiKey) return this.convo('no-key')

    const userInput = this.$('[name="user-input"]').value.trim()
    if (!userInput) return this.convo('no-input')

    const systemPrompt = this.$('[name="system-prompt"]').value
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
      } else {
        return window.alert('no valid LLM provider selected')
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
    } catch (err) {
      this.$('[name="response-display"]').textContent = `Error: ${err.message}`
    }

    btn.textContent = 'send request'
    btn.disabled = false
  }
}

window.AiApiConduit = AiApiConduit
