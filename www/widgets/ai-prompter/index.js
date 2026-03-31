/* global NNE, WIDGETS, Widget, Convo, utils, nn */
class AiPrompter extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'ai-prompter'
    this.keywords = ['ai', 'artificial', 'intelligence', 'prompt', 'madlib']
    this.title = 'AI Prompt Generator'
    Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })

    this.width = 638
    this.height = 483

    this.selects = {
      level: ['beginner', 'intermediate', 'advanced'],
      file: ['sketch', 'project'],
      lang: ['HTML', 'CSS', 'JavaScript', 'HTML/CSS', 'HTML/CSS/JS'],
      question: ['question I have', 'issue I\'m having']
    }

    this.libs = {
      'anime.js': {
        src: 'https://cdn.jsdelivr.net/npm/animejs/dist/bundles/anime.umd.min.js',
        docs: [
          'https://animejs.com/documentation/',
          'https://animejs.com/documentation/getting-started/',
          'https://animejs.com/documentation/animation/',
          'https://animejs.com/documentation/web-animation-api/'
        ]
      },
      'd3.js': {
        src: 'https://cdn.jsdelivr.net/npm/d3@7',
        docs: [
          'https://d3js.org/getting-started',
          'https://d3js.org/api',
          'https://d3js.org/what-is-d3'
        ]
      },
      'gsap.js': {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
        docs: [
          'https://gsap.com/resources/get-started/',
          'https://gsap.com/docs/v3/',
          'https://gsap.com/docs/v3/GSAP/'
        ]
      },
      'hydra.js': {
        src: 'https://unpkg.com/hydra-synth@1.3.29/dist/hydra-synth.js',
        docs: [
          'https://hydra.ojack.xyz/docs/',
          'https://hydra.ojack.xyz/hydra-docs-v2/',
          'https://hydra.ojack.xyz/docs/docs/learning/guides/how-to/hydra-in-a-webpage/',
          'https://github.com/hydra-synth/hydra'
        ]
      },
      'nn.js': {
        src: 'https://cdn.jsdelivr.net/gh/netizenorg/netnet-standard-library/build/nn.min.js',
        docs: [
          'https://github.com/netizenorg/netnet-standard-library/blob/main/README.md',
          'https://github.com/netizenorg/netnet-standard-library/blob/main/docs/examples.md'
        ]
      },
      'p5.js': {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.10.0/p5.min.js',
        docs: [
          'https://p5js.org/reference/',
          'https://p5js.org/tutorials/get-started/',
          'https://p5js.org/tutorials/'
        ]
      },
      'paper.js': {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/paper.js/0.12.15/paper-full.min.js',
        docs: [
          'https://paperjs.org/reference/',
          'https://paperjs.org/tutorials/',
          'https://paperjs.org/tutorials/getting-started/',
          'https://paperjs.org/tutorials/getting-started/using-javascript-directly/'
        ]
      },
      'three.js': {
        src: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.1/three.js',
        docs: [
          'https://threejs.org/manual/',
          'https://threejs.org/docs/',
          'https://threejs.org/'
        ]
      },
      'tone.js': {
        src: 'https://unpkg.com/tone',
        docs: [
          'https://tonejs.github.io/',
          'https://tonejs.github.io/docs/',
          'https://tonejs.github.io/examples/'
        ]
      },
      'two.js': {
        src: 'https://cdn.jsdelivr.net/npm/two.js@latest/build/two.js',
        docs: [
          'https://two.js.org/docs/',
          'https://two.js.org/examples/',
          'https://two.js.org/'
        ]
      }
    }

    this.on('open', () => this._createHTML(opts))
  }

  convo (key) {
    window.convo = new Convo(this.convos, key)
  }

  reviewPrompt () {
    this.$('.ai-prompter__output').value = this.getPrompt()
    this.$('.ai-prompter__madlib-view').style.display = 'none'
    this.$('.ai-prompter__review-view').style.display = 'block'
  }

  getPrompt () {
    const level = this.$('[name="level"]').value
    const file = this.$('[name="file"]').value
    const postFile = file === 'sketch' ? '(a single HTML file)' : ''
    const lang = this.$('[name="lang"]').value
    const question = this.$('[name="question"]').value
    const q = this.$('[name="user-question"]').value

    const listLibs = () => {
      let list = ''
      if (lang.includes('JavaScript') || lang.includes('JS')) {
        nn.getAll('.ai-prompter__madlib-view [name^="js-lib-"]')
          .filter(box => box.checked)
          .map(box => box.parentNode.innerText.trim())
          .forEach(lib => {
            list += lib + ':\n'
            this.libs[lib].docs.forEach(doc => { list += `- ${doc}\n` })
            list += '\n'
          })
      }
      return list
    }

    const libs = listLibs()

    return `I'm a ${level} creative coder working on a web based ${file} ${postFile} and need help with my ${lang} code. Please act as a patient coding tutor, helping me understand how to achieve my goals rather than achieving them for me. The ${question} is ${q}
${libs ? '\nBelow are the libraries I\'m using, use the URLs for their docs as your source of truth:\n\n' + libs : ''}
Before you give me any code, I need you to:
  - Restate what you think my goal is, so I can confirm you understood me.
  - If my question is vague or you're missing details, ask me specific questions before answering.
  - If I'm using incorrect terminology, explain what the right term is and why, I'm trying to build good habits with technical language.
  - If something in my phrasing suggests I misunderstand a concept, correct that first with a short explanation and a tiny example.

When you do give me code:
  - Show me only the smallest snippet that illustrates the idea, no more than about 10 lines. Don't give me a complete working solution. I need to do the rest myself so I actually learn.
  - Explain every snippet in plain language. If you use a technical term for the first time, define it in parentheses.`
  }

  _createHTML (opts) {
    utils.get(`./widgets/${this.key}/data/mad-lib.html`, html => {
      this.innerHTML = html
      this._setupUI()
      this.convo('start')
    }, true)
  }

  _setupUI () {
    for (const s in this.selects) {
      const arr = this.selects[s]
      const sel = `.ai-prompter__madlib-view select[name="${s}"]`
      const ele = nn.get(sel).set('options', arr).set('class', 'pill-btn pill-btn--secondary')
      if (s === 'file') this._setupPostFile(ele)
      else if (s === 'question') this._setupQplaceholder(ele)
      else if (s === 'lang') this._setupJSLibs(ele)
    }

    const ul = nn.get('.ai-prompter__madlib-view [name="js-lib-list"]')
    const libs = Object.keys(this.libs)
    libs.forEach(lib => {
      nn.create('span')
        .content(`<input type="checkbox" name="js-lib-${lib}"> ${lib}`)
        .addTo(ul)
    })

    this.$('.reference-widget__nav span').addEventListener('click', () => {
      this.$('.ai-prompter__madlib-view').style.display = 'block'
      this.$('.ai-prompter__review-view').style.display = 'none'
      this.$('.ai-prompter__madlib-view').scrollTo(0, 0)
    })

    this.$('[name="download"]').addEventListener('click', () => {
      if (WIDGETS['project-files']?.projectData?.name) {
        WIDGETS['project-files'].downloadProject()
      } else WIDGETS['coding-menu'].downloadCode()
    })

    this.$('[name="copy-prompt"]').addEventListener('click', () => {
      utils.copyLink(nn.get('.ai-prompter__output'), 'Copied to Clipboard')
      this.convo('copied-prompt')
    })

    this.$('.ai-prompter__madlib-view').scrollTo(0, 0)
  }

  _setupPostFile (ele) {
    ele.on('change', () => {
      const s = '.ai-prompter__madlib-view span[name="post-file"]'
      if (ele.value === 'sketch') {
        nn.get(s).content('(a single HTML file)')
        this.$('[name="download"]').textContent = 'Download Sketch'
      } else {
        nn.get(s).content('')
        this.$('[name="download"]').textContent = 'Download Project'
      }
    })

    if (WIDGETS['project-files']?.projectData?.name) {
      ele.value = 'project'
      ele.dispatchEvent(new window.Event('change'))
    }
  }

  _setupQplaceholder (ele) {
    ele.on('change', () => {
      const ph = ele.value === 'question I have'
        ? '...ask your question.'
        : '...explain your issue, as well as what you already tried to solve it and why that didn\'t work.'
      nn.get('.ai-prompter__madlib-view  [name="user-question"]')
        .set('placeholder', ph)
    })
  }

  _setupJSLibs (ele) {
    const lb = nn.get('.ai-prompter__madlib-view [name="js-lib-label"]')
    const lp = nn.get('.ai-prompter__madlib-view [name="js-lib-p"]')

    const checkForLibs = () => {
      const matches = []
      for (const [name, lib] of Object.entries(this.libs)) {
        if (NNE.code.includes(lib.src)) matches.push(name)
      }
      return matches
    }

    ele.on('change', () => {
      const libs = checkForLibs()
      if (ele.value.includes('JavaScript') || ele.value.includes('JS')) {
        nn.getAll('.ai-prompter__madlib-view [name^="js-lib-"]').forEach(box => {
          const n = box.getAttribute('name').split('-lib-')[1]
          if (libs.includes(n)) box.checked = true
          else box.checked = false
        })
        lb.css('display', 'inline-block')
        lp.css('display', 'block')
      } else {
        lb.css('display', 'none')
        lp.css('display', 'none')
      }
    })
  }
}

window.AiPrompter = AiPrompter
