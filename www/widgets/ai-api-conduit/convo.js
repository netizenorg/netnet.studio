/* global WIDGETS, NNW, Convo  */
window.CONVOS['ai-api-conduit'] = (self) => {
  const providerInfo = () => {
    const dict = {
      gemini: 'Google Gemini',
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      ollama: 'Ollama'
    }

    return self.provider === 'disabled'
      ? 'This widget is currently disabled because you haven\'t chosen an LLM provider, but you can change that at anytime by picking a one from the drop down list.'
      : `You currently have <b>${dict[self.provider]}</b> set as your chosen provider, but you can change that at anytime by picking a different one from the drop down list.`
  }

  return [{
    id: 'start',
    before: () => NNW.menu.switchFace('default'),
    content: 'As a <i>classical</i> AI, everything I say and do has been intentionally predefined by the folks that made me. Today, many "AI powered" apps have integrated machine learning models, like LLMs. I\'m not one of those by default, but if you\'d like I can show you how to integrate one yourself.',
    options: {
      'yes, show me how': (e) => e.goTo('rest-api'),
      'no thanks': (e) => e.hide()
    }
  }, {
    id: 'rest-api',
    content: 'Most “AI-powered” coding apps connect to an LLM through an Application Programming Interface or <span class="link" onclick="WIDGETS.open(\'lingo-glossary\', w => w.showVocab(\'api\'))">API</span>. A common type is a REST API, a server running in a datacenter that waits for specially formatted requests from apps like me.',
    options: {
      ok: (e) => e.goTo('api-steps'),
      'requests?': (e) => e.goTo('api-reqs')
    }
  }, {
    id: 'api-reqs',
    content: 'REST APIs are used to connect apps/services so they can send "requests" and "responses" to each other. We\'ll be sending not only our "prompts" but also settings to our LLM provider\'s API and it will be sending responses back as <span class="link" onclick="WIDGETS.open(\'lingo-glossary\', w => w.showVocab(\'json\'))">JSON</span> (structured data) which I can then present in my widgets.',
    options: {
      'I see': (e) => e.goTo('api-steps')
    }
  }, {
    id: 'api-steps',
    content: 'To connect me to one, first choose your preferred LLM provider from the drop-down list, this could be a company, like <a href="https://aistudio.google.com/" target="_blank">Google</a>, <a href="https://platform.openai.com/" target="_blank">OpenAI</a> or <a href="https://platform.anthropic.com/" target="_blank">Anthropic</a>, running models in their "cloud" but I could also connect to a model running locally on your computer using <a href="https://ollama.com/" target="_blank">Ollama</a>.',
    options: {
      'I see': (e) => e.goTo('choose-provider')
    }
  }, {
    id: 'choose-provider',
    content: 'Choosing a cloud provider is easiest, but it will require creating an API key, which means you\'ll first need to create an account on their platform. Most of them also require you to prepay for credits, though Google offers a limited free tier. On the other hand, running a model locally requires a bit more setup, but it\'s free, private and energy efficient because it all runs on your computer.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'choose-provider2',
    content: providerInfo(),
    options: {
      'I see': (e) => {
        if (self.provider === 'disabled') e.hide()
        else e.goTo(`create-${self.provider}-key`)
      }
    }
  }, {
    id: 'create-gemini-key',
    content: 'To use Google Gemini as a provider, sign in to <a href="https://aistudio.google.com/apikey" target="_blank">Google AI Studio</a> with a Google account and click <b>Create API key</b>. You don\'t need a credit card to use their free tier, but it limits how many requests you can send per minute and per day.',
    options: {
      ok: (e) => e.hide(),
      'free? what\'s the catch?': (e) => e.goTo('gemini-free')
    }
  }, {
    id: 'gemini-free',
    content: 'Good question! Just because you\'re not paying with money, doesn\'t mean there isn\'t an exchange. According to Google\'s <a href="https://ai.google.dev/gemini-api/terms" target="_blank">terms</a>, they use what you send to the free tier (and what the model sends back) to improve their products, and human reviewers may read it. So don\'t send anything personal or sensitive.',
    options: {
      'I see': (e) => e.goTo('gemini-free2')
    }
  }, {
    id: 'gemini-free2',
    content: 'If you set up billing in your Google account, they say they won\'t use your data that way (unless you\'re in the EU, Switzerland or the UK, where those protections apply to the free tier too). Their terms also say you must be 18 or older to use their API.',
    options: {
      'got it': (e) => e.hide(),
      'what if I pay?': (e) => e.goTo('api-cost')
    }
  }, {
    id: 'create-openai-key',
    content: 'To use OpenAI as a provider you\'ll first need to <a href="https://platform.openai.com/" target="_blank">create an OpenAI account</a>, then go to <b>Settings → Billing</b> and add a credit card. Then click <b>API keys</b> in the sidebar to <b>Create new secret key</b>.',
    options: {
      ok: (e) => e.hide(),
      'how much will it cost?': (e) => e.goTo('api-cost')
    }
  }, {
    id: 'create-anthropic-key',
    content: 'To use Anthropic as a provider you\'ll first need to  <a href="https://platform.anthropic.com/" target="_blank">create an Anthropic account</a>, then go to <b>Settings → Billing</b> and add a credit card. Then click <b>API keys</b> in the sidebar to <b>Create new secret key</b>.',
    options: {
      ok: (e) => e.hide(),
      'how much will it cost?': (e) => e.goTo('api-cost')
    }
  }, {
    id: 'create-disabled-key',
    content: 'Ok, I\'ve disabled the LLM integration. If you change your mind you can re-connect me to your preferred LLM API anytime, just reopen this widget.',
    options: {
      thanks: (e) => e.hide()
    }
  }, {
    id: 'create-ollama-key',
    content: 'If you have <a href="https://ollama.com/" target="_blank">Ollama</a> installed and currently running on your computer with the API configured properly I\'ll be able to connect to it. Keep in mind, smaller LLMs might not perform as well as larger ones.',
    options: {
      'how do i run it?': (e) => e.goTo('ollama2'),
      'ollama?': (e) => e.goTo('ollama1')
    }
  }, {
    id: 'ollama1',
    content: '<a href="https://ollama.com" target="_blank">Ollama</a> is an app for running large language models locally on your own computer instead of relying on a remote API. It provides a simple interface for downloading and interacting with models, allowing you to experiment with AI in a way that keeps data private and reduces reliance on external services.',
    options: {
      'how do I run it?': (e) => e.goTo('ollama2')
    }
  }, {
    id: 'ollama2',
    content: 'First, download and install <a href="https://ollama.com/download" target="_blank">Ollama</a> on your computer. You can use Ollama on it\'s own (you don\'t need me), but because it can also run an API I can also connect to it.',
    options: {
      'and then?': (e) => e.goTo('ollama3')
    }
  }, {
    id: 'ollama3',
    content: 'Ollama doesn\'t come with any models, so you\'ll need to <a href="https://ollama.com/search" target="_blank">choose</a> and download the LLM you want. You can do this in the Ollama app or in your terminal.',
    options: {
      'and then?': (e) => e.goTo('ollama6'),
      'terminal? how?': (e) => e.goTo('ollama4')
    }
  }, {
    id: 'ollama4',
    content: 'For example, if you wanted to download <a href="https://deepmind.google/models/gemma/gemma-4/" target="_blank">gemma4:e4b</a> you would run <code>ollama pull gemma4:e4b</code>, just make sure your computer has enough memory to run the model you download.',
    options: {
      'ok, and then?': (e) => e.goTo('ollama6'),
      'enough memory?': (e) => e.goTo('ollama5')
    }
  }, {
    id: 'ollama5',
    content: 'Yes, even though these LLMs are smaller than the ones that run in datacenters, they can still be too large for your laptop. A good rule of thumb is that a 4B (4 billion parameters) model needs several gigabytes of memory to run, around 8–16 GB of RAM.',
    options: {
      'ok, and then?': (e) => e.goTo('ollama6')
    }
  }, {
    id: 'ollama6',
    content: 'The last step is to make sure the API is running and that you\'ve given me permission to connect to it. This step varies slightly depending on your OS, but we\'ve documented it all in detail on our <a href="/docs/misc/ai-integration.html" target="_blank">Connecting netnet to a local LLM</a> docs.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'api-cost',
    content: 'LLM providers charge per token sent in the request and response, and pricing varies by model, but with the smallest model (which I\'ve set by default) each requests will usually cost a fraction of a cent, so even paying one US dollar can go a long way.',
    options: {
      'got it': (e) => e.hide(),
      'do I have to pay?': (e) => e.goTo('pay-to-play')
    }
  }, {
    id: 'pay-to-play',
    content: 'There are lots of free REST APIs out there (for accessing data like weather or news), but LLMs are costly to run and maintain, so most of these companies charge for the service. Google offers a limited free tier, but "free" services are usually paid for some other way, often with your data. And I\'m not here to promote these companies, you don\'t have to integrate any of their LLMs.',
    options: {
      'no?': (e) => e.goTo('no-pay')
    }
  }, {
    id: 'no-pay',
    content: 'You could instead choose Ollama and then download and run open source models locally on your computer. It might not perform as well as the big corporate models, but it\'s free, private and much more energy efficient.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'paste-key',
    content: 'Paste your API key here. Like other personal data, this is saved locally in your browser and never leaves your computer except when sent in the request\'s headers to the provider\'s API. We do not store any of your personal data on our server.',
    options: {
      'got it': (e) => e.goTo('post-key'),
      'my API key?': (e) => e.goTo(`create-${self.$('[name="provider"]').value}-key`),
      'my data?': (e) => WIDGETS.open('student-session')
    }
  }, {
    id: 'post-key',
    content: 'Once you\'ve added your key click on each section\'s tab starting with <b>API Request</b> to learn how this all works.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'request',
    content: (self.settings.mode === 'library'
      ? 'This is the <b>Request</b>, written as the <code>nn.prompt()</code> code you could use to send it yourself (switch to "vanilla JS" to see exactly what gets sent). '
      : 'This is the <b>API Request</b>, exactly as I send it: the URL it gets sent to, its <span style="color:var(--fg-color)">headers</span>, and its body, the <span class="link" onclick="WIDGETS.open(\'lingo-glossary\', w => w.showVocab(\'json\'))">JSON</span> data we send to the LLM provider\'s API. ') +
      'You can edit parts, like the name of the <span style="color:var(--netizen-attribute)">model</span> you want to use and the <span style="color:var(--netizen-attribute)">temperature</span> value, other parts like the <span style="color:var(--fg-color)">systemPrompt</span> and <span style="color:var(--fg-color)">userInput</span> are set in the other tabs (click on them to see).',
    options: {
      'got it': (e) => e.hide(),
      'model?': (e) => e.goTo('req-model'),
      ...(self.settings.mode === 'vanilla' && { 'headers?': (e) => e.goTo('req-headers') }),
      ...(self.provider !== 'anthropic' && { 'temperature?': (e) => e.goTo('req-temperature') }),
      ...(self.provider === 'ollama' && {
        'think?': (e) => e.goTo('req-think'),
        'num_ctx?': (e) => e.goTo('req-num-ctx')
      })
    }
  }, {
    id: 'mode-library',
    content: 'Now I\'m showing you this request as the code you\'d write using <code>nn.prompt()</code>, a function from my <a href="https://github.com/netizenorg/netnet-machine-learning/blob/main/docs/prompt.md" target="_blank">netnet-machine-learning</a> library. It takes care of the "plumbing" for you, so the code looks nearly the same no matter which provider you choose.',
    options: {
      'got it': (e) => e.hide(),
      'plumbing?': (e) => e.goTo('mode-plumbing')
    }
  }, {
    id: 'mode-vanilla',
    content: 'Now I\'m showing you the request exactly as it gets sent to the provider\'s API, written in plain (aka "vanilla") JavaScript, without any libraries. If you use <code>nn.prompt()</code> in your own code, you can see this same thing by logging <code>reply.request</code>.',
    options: {
      'got it': (e) => e.hide(),
      'why are they different?': (e) => e.goTo('mode-plumbing')
    }
  }, {
    id: 'mode-plumbing',
    content: 'Each provider expects requests in its own format, with different names and structures for the same ideas. Switch between the two options with different providers selected to compare. <code>nn.prompt()</code> translates our code into each provider\'s format for us. That\'s what libraries do, they hide tedious details so we can focus on what we\'re making.',
    options: {
      'I see': (e) => e.hide()
    }
  }, {
    id: 'extended-on',
    content: 'These are extra settings specific to the provider you\'ve chosen. I always send them (switch to "vanilla JS" to see them in the request), but most of the time you won\'t need to change them. <code>nn.prompt()</code> passes any option it doesn\'t recognize straight through to the provider, so you can add these to your own code too.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'mode-key',
    content: '<code>KEY</code> is a variable, which is where you\'d store your API key in your own code. I\'m not showing your actual key here because you should never write it directly in code you share or publish, otherwise anyone could use it (and you\'d pay for it).',
    options: {
      'got it': (e) => e.hide(),
      'where should I put it?': (e) => e.goTo('key-storage')
    }
  }, {
    id: 'key-storage',
    content: 'Here on netnet, when you paste your key into the "Your API Key" field, I store it locally in this browser (using its <code>localStorage</code>), so it never leaves your computer except when it\'s sent in a request\'s headers to your provider. You can see (and delete) it anytime in my <span class="link" onclick="WIDGETS.open(\'student-session\')">Session Data</span> widget.',
    options: {
      'got it': (e) => e.hide(),
      'what about my own projects?': (e) => e.goTo('key-storage-own')
    }
  }, {
    id: 'key-storage-own',
    content: 'You can follow the same pattern in your own code: create an input box where people paste their own API key, then save it to <code>localStorage</code> so they don\'t have to paste it in every time they visit. That way everyone uses their own key, and it never ends up in your code. Check out this <a href="/?demo=1792342439404" target="_blank">demo</a> to see how.',
    options: {
      'got it': (e) => e.hide(),
      'is that the only way?': (e) => e.goTo('key-storage-server')
    }
  }, {
    id: 'key-storage-server',
    content: 'No, it\'s also possible to store keys securely on a server, which sends requests to the LLM provider on behalf of your visitors, so the key never reaches their browser at all. But that involves back-end programming, which is a bit beyond what we\'re learning here, creating stuff on the front-end.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'req-method',
    content: 'There are a few different types (or "methods") of requests we can send to a server. The most common are <code>GET</code>, which asks a server to send us something (like when your browser loads a web page), and <code>POST</code>, which sends data to a server to do something with. Here, we\'re sending our settings and messages to the LLM provider\'s server so it can generate a reply.',
    options: {
      'got it': (e) => e.hide(),
      'what\'s the rest of that line?': (e) => e.goTo('req-url')
    }
  }, {
    id: 'req-url',
    content: 'That\'s the URL, or "endpoint", we send the request to. Each provider has its own, and some have different endpoints for different things (like generating text vs images). Google even puts the name of the model in theirs.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'req-headers',
    content: 'Headers are extra information sent along with a request, separate from its body. They describe the request, like what format the body is in (<code>Content-Type</code>), and they\'re often how APIs know who\'s asking. That\'s why the API key goes here: the provider checks it before reading anything else in the request.',
    options: {
      'got it': (e) => e.hide(),
      'they\'re all different?': (e) => e.goTo('req-headers2')
    }
  }, {
    id: 'req-headers2',
    content: `Yup! Each provider decided on its own name for the key's header: Google uses <code>x-goog-api-key</code>, Anthropic uses <code>x-api-key</code>, and OpenAI uses the more standard <code>Authorization</code> header, with the word "Bearer" before the key. Ollama runs on your own computer, so it doesn't need a key at all.${self.provider === 'anthropic' ? ' Anthropic also asks for a couple of extra headers.' : ''}`,
    options: {
      'I see': (e) => e.hide(),
      ...(self.provider === 'anthropic' && { 'extra headers?': (e) => e.goTo('req-headers-anthropic') }),
      'and with nn.prompt()?': (e) => e.goTo('req-headers-library')
    }
  }, {
    id: 'req-headers-anthropic',
    content: '<code>anthropic-version</code> makes clear which API version we\'re using in our code (becasue these chaange). <code>anthropic-dangerous-direct-browser-access</code>, is us confirming that we know we\'re sending the key directly from a web page, where it could be seen. That\'s fine for your own key in your own browser, but it\'s another reason never to put your key in code you share.',
    options: {
      'got it': (e) => e.hide(),
      'where should I keep my key?': (e) => e.goTo('key-storage')
    }
  }, {
    id: 'req-headers-library',
    content: 'When you use <code>nn.prompt()</code> you just pass it your <code>key</code>, and it puts it in the right header for whichever provider you choose. Switch between the two options at the top of this tab to compare.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'clear-history',
    content: `This will clear the <code>history</code> of our conversation (${self.history.length} earlier messages), which means the next question you send will start a brand new conversation. The LLM won't "remember" anything we said before.`,
    options: {
      'yes, clear it': (e) => {
        self.clearHistory()
        e.goTo('history-cleared')
      },
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'history-cleared',
    content: 'Done, the next question you send will start a new conversation.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'llm-context-warning',
    content: (() => {
      const { messages, tokens } = self.contextSize()
      return `We've exchanged ${messages} messages so far in this conversation (about ${tokens.toLocaleString()} tokens). Keep in mind, the longer a conversation's context gets, the more a model can drift, losing track of details and getting less reliable (researchers have found models are especially likely to <a href="https://arxiv.org/abs/2307.03172" target="_blank">overlook things in the middle</a> of a long context). Each request also costs more as the conversation grows. Would you like to continue this conversation anyway, or start a new one?`
    })(),
    options: {
      'yes, continue it': (e) => {
        const q = self._pendingQuery
        self._pendingQuery = null
        self._sendRequest(q)
      },
      'start a new one': (e) => {
        const q = self._pendingQuery
        self._pendingQuery = null
        self._sendRequest(q, true)
      },
      'never mind': (e) => {
        self._pendingQuery = null
        e.hide()
      }
    }
  }, {
    id: 'req-history',
    content: 'LLMs don\'t remember anything. To have a conversation, I resend everything we\'ve said so far (the <code>history</code> of our messages) along with each new question. That\'s why each request gets bigger (and costs a bit more) the longer a conversation goes on.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'req-think',
    content: 'Some open models, like <a href="https://ollama.com/library/gemma4" target="_blank">Gemma 4</a>, can "think" before they reply, meaning they first write out their reasoning step by step and then write their answer. Setting <code>think</code> to <code>true</code> turns this on, which can lead to better answers, but it takes longer and uses up more of the context window. Not every model can do this, if yours can\'t, Ollama will send back an error, so set it back to <code>false</code>.',
    options: {
      'got it': (e) => e.hide(),
      'it thinks?': (e) => e.goTo('req-think2')
    }
  }, {
    id: 'req-think2',
    content: 'Not the way you or I do. Its "thinking" is just more generated text, tokens predicted to look like <a href="https://en.wikipedia.org/wiki/Reasoning_model" target="_blank">reasoning</a>. Because that text then becomes part of what the model reads before writing its answer, it often helps, but it\'s no guarantee the answer will be correct.',
    options: {
      'I see': (e) => e.hide(),
      'what\'s num_ctx?': (e) => e.goTo('req-num-ctx')
    }
  }, {
    id: 'req-num-ctx',
    content: 'The <code>num_ctx</code> setting is the size of the model\'s "context window", how many tokens it can consider at once. That includes everything we send it (the system prompt, your question and your code) as well as everything it writes back (including its "thinking"). If the window fills up, the model stops mid-reply.',
    options: {
      'got it': (e) => e.hide(),
      'why not make it huge?': (e) => e.goTo('req-num-ctx2')
    }
  }, {
    id: 'req-num-ctx2',
    content: 'Because a bigger window needs more of your computer\'s memory. Ollama runs the model on your own computer, so if it gets slow or fails to load, try a smaller number. Just keep in mind that the more code you include with your question, the more room it needs.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'req-model',
    content: 'Each of these providers offer different LLMs to choose from, visit <a href="https://ollama.com/search" target="_blank">Ollama</a>\'s docs for a list of all the compatiable open source models for download or <a href="https://ai.google.dev/gemini-api/docs/models" target="_blank">Google</a>\'s, <a href="https://developers.openai.com/api/docs/models/all" target="_blank">OpenAI</a>\'s and <a href="https://platform.claude.com/docs/en/about-claude/models" target="_blank">Anthropic</a>\'s docs for the full list of their proprietary models.',
    options: {
      'got it': (e) => e.hide(),
      'and temperature?': (e) => e.goTo('req-temperature'),
      'ollama has a lot!': (e) => e.goTo('check-ollama')
    }
  }, {
    id: 'check-ollama',
    content: 'There are definitely lots of open source <a href="https://ollama.com/search" target="_blank">models available for download</a>, but remember, because these run locally you need to download them first, you can visi <a href="http://localhost:11434/api/tags" target="_blank">http://localhost:11434/api/tags</a> to check which you\'ve got',
    options: {
      'got it': (e) => e.hide(),
      'I don\'t see anything?': (e) => e.goTo('ollama-not-running')
    }
  }, {
    id: 'ollama-not-running',
    content: 'hmmm, that may mean you don\'t have ollama running. Double-check!',
    options: {
      ok: (e) => e.hide(),
      'what\'s temperature?': (e) => e.goTo('req-temperature')
    }
  }, {
    id: 'req-temperature',
    content: `The "temperature" is a setting that controls how predictable the output is: a low temperature makes the model stick to the most likely, safe answers, while a high temperature lets it take more risks, producing more imaginative (or less reliable) responses.${self.provider === 'gemini' ? ' Google recommends keeping their Gemini 3 models at <code>1</code>, which is why I set it to that by default.' : ''}`,
    options: {
      'got it': (e) => e.hide(),
      'less reliable?': (e) => e.goTo('req-temperature2')
    }
  }, {
    id: 'req-temperature2',
    content: 'LLMs don\'t "think" or look things up, they generate text one token at a time based on patterns learned during training. At temperature <code>0</code>, the model always picks the most likely next token, so the same prompt gives the same result.',
    options: {
      'I see': (e) => e.goTo('req-temperature3')
    }
  }, {
    id: 'req-temperature3',
    content: 'At higher temperatures it samples more randomly from possible tokens, leading to more varied and sometimes unexpected outputs. Although to a lesser extent in our case.',
    options: {
      'how come?': (e) => e.goTo('req-temperature4')
    }
  }, {
    id: 'req-temperature4',
    content: 'That\'s because we\'re also defining a system prompt, which asks the model to reply in a specific tone and format, so even at a high temperature in this case it\'s not likely to get too wacky. You can click on the System Prompt tab to learn more about that.',
    options: {
      'got it': (e) => e.hide(),
      'what if I want wacky?': (e) => e.goTo('req-temperature5')
    }
  }, {
    id: 'req-temperature5',
    content: 'It\'s certainly possible! ...just not in this widget. Check out Ch.4 in my <span class="link" onclick="WIDGETS.open(\'learning-guide\', w => w.openDocs(\'ai\'))">Notes on AI</span> for more experimental ways of working with AI in your code, or Ch.5 where I\'ll teach you how to train your own language model which is sure to produce some weirder and more poetic text!',
    options: {
      'cool!': (e) => e.hide()
    }
  }, {
    id: 'system',
    content: 'Like temperature, the system prompt is another setting that influences a model\'s output, one you typically can\'t control in a consumer chatbot (because it\'s set for you), but you can when using the API. It\'s a set of instructions given to the model before your prompt that tells it how to respond by defining things like tone and role.',
    options: {
      'why not in my prompt?': (e) => e.goTo('sys-not-prompt'),
      'why can\'t I edit here?': (e) => e.goTo('sys-no-edit')
    }
  }, {
    id: 'sys-not-prompt',
    content: 'Sure, you could. If you\'ve previously used my <span class="link" onclick="WIDGETS.open(\'ai-prompter\')">AI Prompt Generator</span> widget you may recall that we had to include this context in our prompt alongside our question in order to get the model to act more like a coding tutor and avoid writing all our code for us.',
    options: {
      'right?': (e) => e.goTo('sys-ctx-win')
    }
  }, {
    id: 'sys-ctx-win',
    content: 'The issue with that approach is that this info lives in your first prompt, so the model has to carry it forward with every follow-up question. Since LLMs have a limited “context window” (how much text they can consider at once), that information can eventually get pushed out or lose influence as the conversation grows.',
    options: {
      'I see': (e) => e.goTo('sys-ctx-win2')
    }
  }, {
    id: 'sys-ctx-win2',
    content: 'A system prompt solves this by keeping those instructions persistent and separate from the conversation itself. It acts like a stable set of rules that always stays in scope, so you don\'t have to repeat yourself and the model is less likely to lose or ignore that context over time.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'sys-no-edit',
    content: 'When working with the API directly you can, that\'s something I\'ll show you how to implement yourself in Ch.4 of my <span class="link" onclick="WIDGETS.open(\'learning-guide\', w => w.openDocs(\'ai\'))">Notes on AI</span>, but in this widget I\'ve hard-coded this System Prompt to ensure it integrates into our widgets in a way that guarantees our learning goals.',
    options: {
      'got it': (e) => e.hide(),
      'learning goals?': (e) => e.goTo('sys-learning-goals')
    }
  }, {
    id: 'sys-learning-goals',
    content: 'After adding your API key to this widget, you\'ll be able to ask me questions that I\'ll pass along to the LLM. Anytime you\'re working on code you can click on my face and say "Hi" and you\'ll have the option to "ask an LLM" a question which will hopefully respond the way we want it to.',
    options: {
      'got it': (e) => e.hide(),
      'hopefully?': (e) => e.goTo('sys-hopefullly')
    }
  }, {
    id: 'sys-hopefullly',
    content: 'That\'s where our System Prompt comes in. The LLM should respond as a "tutor" and any code it suggests will be displayed as <i>traceable</i> code. But remember we can\'t ever guarantee the output of an LLM, we can only pass input we hope will influence the output a certain way.',
    options: {
      'got it': (e) => e.hide(),
      'traceable?': (e) => e.goTo('sys-traceable')
    }
  }, {
    id: 'sys-traceable',
    content: 'Once you\'re a pro, it\'s best to copy+paste code snippets to save time, but while you\'re learning it\'s important to type code out yourself, even if that\'s code you\'re copying from somewhere else, this has been proven to help you retain core concepts better. That\'s why I\'ll only let you copy+paste the LLM\'s code <i>after</i> you\'ve re-typed or "traced" over it.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'attach',
    content: 'When the "attach files" option is checked in the <b>API Request</b> tab, I\'ll add the code from your sketch (or the project files you choose here) to the end of your question, so the LLM has more context. If your code uses my nn.js library, I can also attach its documentation, so the model knows how it works.',
    options: {
      'got it': (e) => e.hide(),
      'why would I not attach them?': (e) => e.goTo('attach2')
    }
  }, {
    id: 'attach2',
    content: 'Sometimes your question has nothing to do with your code. Also, everything you attach gets sent to the LLM provider\'s servers, and it makes the request bigger, which means it costs more and takes longer to process. So it\'s worth thinking about what you actually need to send.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'attach-on',
    content: 'Ok, I\'ll attach your code to your questions. You can choose which files to attach in the <b>Attach Files</b> tab.',
    options: {
      'got it': (e) => e.hide(),
      'show me': (e) => {
        e.hide()
        self.switchTab('attach')
        self._populateIncludeCode()
      }
    }
  }, {
    id: 'test',
    content: 'Once you\'ve picked your provider, added your API key (if required) and chosen your settings the LLM conduit is ready to go! You can close this widget and start working on code. Anytime after that you can click on my face and say "Hi", I\'ll give you the option to "ask an LLM" a question. Then, using these settings, I\'ll send your question along to the LLM\'s API.',
    options: {
      'I see': (e) => e.goTo('test2')
    }
  }, {
    id: 'test2',
    content: 'So you don\'t need to keep this widget open to start sending questions to an LLM. You only need to open it back up when you want to change any of these settings. This "Test" tab is really just a place to test and make sure responses are coming back as you expect.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'no-key',
    before: () => NNW.menu.switchFace('upset'),
    content: 'Looks like you haven\'t entered your API key yet! You\'ll need one from your chosen provider (Google, OpenAI or Anthropic) to make requests. Paste it into the "Your API Key" field up top.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'no-input',
    before: () => NNW.menu.switchFace('upset'),
    content: 'You haven\'t written anything in the <b>Test</b> tab yet! That\'s where you type the question or prompt you want to send to the LLM. Switch to the <b>Test</b> tab and write something first.',
    options: {
      ok: (e) => {
        e.hide()
        self.switchTab('test')
      }
    }
  }, {
    id: 'llm-reply-wig',
    before: () => NNW.menu.switchFace('default'),
    after: (e) => self.setupFollowUp(e),
    content: 'Here\'s the synthesized reply from your chosen LLM provider. If you want to reply, type below.' + self.followUpHTML(),
    options: {
      send: (e) => self.sendFollowUp(),
      ok: (e) => e.hide()
    }
  }, {
    id: 'integration',
    content: 'This is how I\'ll share the LLM\'s reply with you. I can display the whole reply in an <b>output widget</b>, like most chatbots do, or I can let the LLM "possess" me and walk you through its reply one piece at a time in my speech bubbles, with any code it writes displayed in its own widget.',
    options: {
      'got it': (e) => e.hide(),
      'possessed?': (e) => e.goTo('integration-possessed')
    }
  }, {
    id: 'integration-widget',
    content: 'Ok, I\'ll display the LLM\'s full reply in the <b>LLM Response</b> widget, any code it writes will be displayed as <i>traceable</i> code.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'integration-possessed',
    content: 'When I\'m "possessed" you\'ll notice my face and speech bubble change, that\'s how you\'ll know it\'s the LLM talking and not me. I\'ll break the reply up into small pieces you can step through, and any code will show up in its own widget as we go. You can always choose to see the full reply instead.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'llm-possessed-processing',
    content: '...communicating with LLM...',
    // only if it's still the current convo (a fast error may have replaced it)
    after: (c) => { if (window.convo === c) self._getPossessed() },
    options: {}
  }, {
    id: 'ollama-cors-error-chrome',
    before: () => NNW.menu.switchFace('upset'),
    content: 'I wasn\'t able to reach your local Ollama server. This is a known limitation in Chrome — it blocks requests from HTTPS pages to local addresses for security reasons. Try using <b>Firefox</b> instead, which doesn\'t have this restriction.',
    options: {
      ok: (e) => { e.hide(); NNW.menu.switchFace('default') }
    }
  }, {
    id: 'ollama-cors-error',
    before: () => NNW.menu.switchFace('upset'),
    content: 'I wasn\'t able to reach your local Ollama server. This might be a browser security restriction blocking requests from HTTPS pages to local addresses. Try a different browser, or check that Ollama is running and configured to allow requests from this origin.',
    options: {
      ok: (e) => { e.hide(); NNW.menu.switchFace('default') }
    }
  }, {
    id: 'provider-disabled',
    before: () => NNW.menu.switchFace('default'),
    content: 'The LLM integration is currently disabled. Choose an LLM provider from the drop down list at the top of this widget first.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'llm-busy',
    before: () => NNW.menu.switchFace('upset'),
    content: `Hmm, your LLM provider didn't answer this time. Either their servers are too busy right now or you've hit your account's rate limit, which is how many requests you're allowed to send in a given amount of time. Here's what happened: <i>${String(self.lastError || '').replace(/</g, '&lt;')}</i>`,
    options: {
      'ok, I\'ll try again in a bit': (e) => { e.hide(); NNW.menu.switchFace('default') },
      'can I do anything else?': (e) => e.goTo('llm-busy2')
    }
  }, {
    id: 'llm-slow',
    before: () => NNW.menu.switchFace('default'),
    content: self.provider === 'ollama'
      ? 'This is taking a while. Models running locally can be slow, especially the first time they\'re loaded or on a less powerful computer. I\'ll keep waiting for up to 5 minutes.'
      : 'This is taking a while. Your LLM provider\'s servers might be busy right now. I\'ll keep waiting for up to a minute and a half, but you can also cancel and try again later.',
    options: {
      'ok, I\'ll wait': (e) => {
        e.hide()
        self._getPossessed()
      },
      'cancel the request': (e) => {
        if (self._request) self._request.abort()
        e.hide()
      }
    }
  }, {
    id: 'llm-network-error',
    before: () => NNW.menu.switchFace('upset'),
    content: 'Hmm, I couldn\'t reach your LLM provider\'s servers, the request never got an answer. This happens from time to time, it could be a hiccup in your internet connection or an issue on their end.',
    options: {
      'try again': (e) => {
        NNW.menu.switchFace('default')
        self.retry()
      },
      'what if it keeps happening?': (e) => e.goTo('llm-network-error2')
    }
  }, {
    id: 'llm-network-error2',
    content: `Check that you're connected to the internet${self.adapters?.[self.provider]?.status ? `, then check your provider's <a href="${self.adapters[self.provider].status}" target="_blank">status page</a> to see if they're having issues` : ''}. Otherwise, wait a bit and try again later, or try a different provider.`,
    options: {
      ok: (e) => { e.hide(); NNW.menu.switchFace('default') }
    }
  }, {
    id: 'llm-busy2',
    content: 'You could wait a minute and try again, or try a different (often smaller) model in the <b>API Request</b> tab. Free tiers, like Google\'s, have stricter limits, so this will happen more often there.',
    options: {
      ok: (e) => { e.hide(); NNW.menu.switchFace('default') }
    }
  }, {
    id: 'oh-no-error',
    after: () => {
      NNW.menu.updateFace({
        leftEye: 'ŏ', mouth: '︵', rightEye: 'ŏ', lookAtCursor: false
      })
    },
    content: 'Oh dang! seems your LLM provider had a server error...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => {
        e.hide()
        NNW.menu.switchFace('default')
      },
      'what was the error?': (e) => {
        Convo.load('/core/utils-convo.js', () => {
          const convos = window.CONVOS['utils-misc'](window.utils)
          window.convo = new Convo(convos, 'explain-error')
        })
      }
    }
  }]
}
