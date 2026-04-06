/* global WIDGETS, NNW, Convo  */
window.CONVOS['ai-api-conduit'] = (self) => {
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
    content: 'Most "AI powered" coding apps plug into some LLM provider behind the scenes. This is accomplished using an Application Programming Interface or API. There are different kinds of APIs, a common one is a REST API, a server that runs in a datacenter waiting for specifically formatted requests coming from other apps like me.',
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
    content: 'In order to use their REST API you\'ll need to create an API key, before that you often (though not always) need to prepay for some number of requests and to do that you first need to sign up for an account on your chosen LLM providers platform.',
    options: {
      'I see': (e) => e.goTo('choose-provider')
    }
  }, {
    id: 'choose-provider',
    content: 'Select your preferred LLM provider from the drop-down list, the company who trained the model(s) which they maintain on their servers but make available to us through their APIs. Then I\'ll explain how to get an API key, after that you can click the tabs below and I\'ll explain how it all works.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'create-openai-key',
    content: 'To create an API Key first <a href="https://platform.openai.com/" target="_blank">create an OpenAI account</a>, then go to <b>Settings → Billing</b> and add a credit card. Then click <b>API keys</b> in the sidebar to <b>Create new secret key</b>.',
    options: {
      ok: (e) => e.hide(),
      'how much will it cost?': (e) => e.goTo('api-cost')
    }
  }, {
    id: 'create-anthropic-key',
    content: 'To create an API Key first <a href="https://platform.anthropic.com/" target="_blank">create an Anthropic account</a>, then go to <b>Settings → Billing</b> and add a credit card. Then click <b>API keys</b> in the sidebar to <b>Create new secret key</b>.',
    options: {
      ok: (e) => e.hide(),
      'how much will it cost?': (e) => e.goTo('api-cost')
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
    content: 'Unfortunately, while there are some free REST APIs out there (for accessing data like weather or news), LLMs are constly to run and maintain, so these companies charge for the service. But I\'m not here to promote these companies, you don\'t have to integrate one of these LLMs.',
    options: {
      'no?': (e) => e.goTo('no-pay')
    }
  }, {
    id: 'no-pay',
    content: 'This widget exists to help you learn how these integrations work behind the scenes as well as how to use a coding agent in way that helps us learn to code rather than code for us. But there are <span class="link" onclick="WIDGETS.open(\'learning-guide\', w => w.openDocs(\'ai\'))">other creative wasys</span> to engage with machine learning in our practice that doesn\'t cost anything.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'paste-key',
    content: 'Paste your API key here. Like other personal data, this is saved locally in your browser and never leaves your computer except when sent in the request\'s Authorization header to the provider\'s API. We do not store any of your personal data on our server.',
    options: {
      'got it': (e) => e.goTo('post-key'),
      'my API key?': (e) => e.goTo(`create-${self.$('[name="provider"]').value}-key`),
      'my data?': (e) => WIDGETS.open('student-session')
    }
  }, {
    id: 'post-key',
    content: 'Once you\'ve added your key click on each section\'s tab starting with <b>Request Body</b> to learn how this all works.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'request',
    content: 'This is the <b>Request\'s Body</b>, it\'s the <span class="link" onclick="WIDGETS.open(\'lingo-glossary\', w => w.showVocab(\'json\'))">JSON</span> data we send to the LLM provider\'s API. You can edit parts, like the name of the <span style="color:var(--netizen-attribute)">model</span> you want to use and the <span style="color:var(--netizen-attribute)">temperature</span> value, other parts like the <span style="color:var(--fg-color)">systemPrompt</span> and <span style="color:var(--fg-color)">schema</span> I\'ve set myself in the other tabs.',
    options: {
      'got it': (e) => e.hide(),
      'model?': (e) => e.goTo('req-model'),
      'temperature?': (e) => e.goTo('req-temperature')
    }
  }, {
    id: 'req-model',
    content: 'Each of these companies provide access to different LLMs they\'ve created, visit <a href="https://developers.openai.com/api/docs/models/all" target="_blank">OpenAI</a>\'s and <a href="https://platform.claude.com/docs/en/about-claude/models" target="_blank">Anthropic</a>\'s docs for the full list to choose from.',
    options: {
      'got it': (e) => e.hide(),
      'and temperature?': (e) => e.goTo('req-temperature')
    }
  }, {
    id: 'req-temperature',
    content: 'The "temperature" is a setting that controls how predictable the output is: a low temperature makes the model stick to the most likely, safe answers, while a high temperature lets it take more risks, producing more imaginative (or less reliable) responses.',
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
    content: 'That\'s because we\'re also defining a system prompt and output format which tries to enforce a specific structure and output, so even at a high temperature in this case it\'s not likely to get too wacky. You can click on those tabs to learn more about that.',
    options: {
      'got it': (e) => e.hide(),
      'what if I want wacky?': (e) => e.goTo('req-temperature5')
    }
  }, {
    id: 'req-temperature5',
    content: 'It\'s certainly possible! ...just not in this widget. Check out Ch.6 in my <span class="link" onclick="WIDGETS.open(\'learning-guide\', w => w.openDocs(\'ai\'))">Notes on AI</span> for more experimental ways of working with AI in your code, or Ch.7 where I\'ll teach you how to train your own language model which is sure to produce some weirder and more poetic text!',
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
    content: 'When working with the API directly you can, that\'s something I\'ll show you how to implement yourself in Ch.6 of my <span class="link" onclick="WIDGETS.open(\'learning-guide\', w => w.openDocs(\'ai\'))">Notes on AI</span>, but in this widget I\'ve hard-coded this System Prompt to ensure it integrates into our widgets in a way that guarantees our learning goals.',
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
    content: 'That\'s were our System Prompt and Schema come in. The LLM should respond as a "tutor" and any code it suggests will get rendered in a widget called <b>LLM Code Snippets</b> with <i>traceable</i> code I can explain. But remember we can\'t ever guarantee the output of an LLM, we can only pass input we hope will influence the output a certain way.',
    options: {
      'got it': (e) => e.hide(),
      'traceable?': (e) => e.goTo('sys-traceable')
    }
  }, {
    id: 'sys-traceable',
    content: 'Once you\'re a pro, it\'s best to copy+paste code snippets to save time, but while you\'re learning it\'s important to type code out yourself, even if that\'s code you\'re copying from somewhere else, this has been proven to help you retain core concepts better. The <b>LLM Code Snippets</b> widget allows you to copy+paste a code snippet <i>only after</i> you\'ve re-typed or "traced" over it.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'schema',
    content: 'In the System Prompt we explained how we wanted the LLM to respond, this Schema defines the format that response should get sent back to us in. Like the Request Body we send to the API, this response is structured as <span class="link" onclick="WIDGETS.open(\'lingo-glossary\', w => w.showVocab(\'json\'))">JSON</span>, which will make it possible for my widgets to systematically parse and present the explinations and code to you.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'include-code',
    content: 'When you\'re working on a sketch or project I\'ll send along the sketch or file your working on to the LLM accompanying your question, so it has more context. However, if for some reason you don\'t want to do that you\'ll be able to adjust that setting here before each time you send a query to the API.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'post',
    content: 'Once you\'ve added your API key, the LLM conduit is ready to go! You can close this widget and start working on code. Anytime after that you can click on my face and say "Hi", I\'ll give you the option to "ask an LLM" a question. Then, using these settings, I\'ll send your question along to the LLM\'s API.',
    options: {
      'I see': (e) => e.goTo('post2')
    }
  }, {
    id: 'post2',
    content: 'So you don\'t need to keep this widget open to start sending questions to an LLM. You only need to open it back up when you want to change any of these settings. This "Post Request" tab is really just a place to test and make sure responses are coming back as you expect.',
    options: {
      'got it': (e) => e.hide()
    }
  }, {
    id: 'no-key',
    before: () => NNW.menu.switchFace('upset'),
    content: 'Looks like you haven\'t entered your API key yet! You\'ll need one from your chosen provider (OpenAI or Anthropic) to make requests. Paste it into the "Your API Key" field up top.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'no-input',
    before: () => NNW.menu.switchFace('upset'),
    content: 'You haven\'t written anything in the <b>POST Request</b> tab yet! That\'s where you type the question or prompt you want to send to the LLM. Switch to the <b>POST Request</b> tab and write something first.',
    options: {
      ok: (e) => {
        e.hide()
        self.switchTab('post')
      }
    }
  }, {
    id: 'llm-possessed-processing',
    content: '...LLM taking over...',
    after: () => self._getPossessed(),
    options: {}
  }, {
    id: 'restate-query',
    content: 'Try restating your question differently in the <b>Post Request</b> tab, then press "send request" to try agian.',
    options: {
      ok: (e) => e.hide()
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
