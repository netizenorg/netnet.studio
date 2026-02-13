
/* global nn updateMetadata, videoReady, overlay */
const metadata = {
  initialized: false,

  // metadata
  id: '',
  title: '',
  subtitle: '',
  author: '',
  authorURL: '',
  description: '',
  keywords: '',
  duration: 0,
  thumbnails: [],

  init: () => {
    if (metadata.initialized) return

    metadata.generateToolTips()
    nn.get('#metadata-submit').on('click', metadata.submit)
    nn.get('#metadata-close').on('click', metadata.close)
    metadata.initialized = true
  },

  close: () => {
    if (!videoReady) overlay('#start')
    else overlay(null)
  },

  submit: () => {
    // check for any missing required values
    const requiredInputs = nn.getAll('#metadata > input[required]')
    // remove any previous error UI
    requiredInputs.forEach((i) => i.classList.remove('missing-value'))
    const errorMsgs = nn.getAll('.metadata-error-msg')
    if (errorMsgs) errorMsgs.forEach((e) => e.remove())

    const missingValues = []
    requiredInputs.forEach((input, i) => {
      if (!input.value) {
        missingValues.push(input.name)
      }
    })
    // if any missing values display error messages
    if (missingValues.length > 0) {
      metadata.displayError(missingValues)
      return
    }
    metadata.updateMetadata()
  },

  updateMetadata: () => {
    nn.getAll('#metadata > input, #metadata > textarea').forEach((input) => {
      metadata[input.name] = input.value
    })

    const { id, title, subtitle, author, authorURL, description, keywords, duration, thumbnails } = metadata
    updateMetadata({ id, title, subtitle, author, authorURL, description, keywords, duration, thumbnails })
  },

  displayError: (values) => {
    values.forEach((value) => {
      const errorMsg = document.createElement('p')
      errorMsg.className = 'metadata-error-msg'
      errorMsg.textContent = `
        please provide
        ${metadata.startsWithVowel(value) ? 'an' : 'a'}
        ${value}`
      const input = nn.get(`#metadata > input[name="${value}"]`)
      input.classList.add('missing-value')
      input.after(errorMsg)
    })
  },

  generateToolTips: () => {
    const tooltips = {
      // id: {
      //   label: 'Tutorial ID:',
      //   tip: `The <b>Tutorial ID</b> must match the video's filename.<br><br>
      //   - If creating a new video, enter the filename you’d like to use.<br>
      //   - If uploading an existing video, enter its current filename.`
      // },
      id: {
        label: 'Tutorial ID:',
        tip: 'The <b>Tutorial ID</b> can only be defined once when first creating a tutorial and is no longer editable after that'
      },
      title: {
        label: 'Title:',
        tip: "The <b>Title</b> is the main name of your tutorial. It will be displayed in the Net Artisan's Guide."
      },
      subtitle: {
        label: 'Subtitle:',
        tip: "The <b>Subtitle</b> is an optional secondary title that provides extra context or detail about your tutorial (ex: 'Part 1: Getting Started')."
      },
      author: {
        label: "Author's Name:",
        tip: "The <b>Author's Name</b> is the name you'd like credited as the creator of this tutorial. It can be your full name, a username, or a team name."
      },
      authorURL: {
        label: "Author's Website URL:",
        tip: "The <b>Author's Website URL</b> is an optional link where viewers can learn more about you or your work (ex: personal site, portfolio, or social media)."
      },
      description: {
        label: 'Description:',
        tip: 'The <b>Description</b> is a short summary of your tutorial. It helps viewers understand what they’ll learn or create by following along.'
      },
      keywords: {
        label: 'Keywords:',
        tip: "<b>Keywords</b> help others find your tutorial through netnet's search bar.<br><br>Enter multiple keywords separated by commas (ex: 'animation, css, beginner')."
      }
    }

    nn.getAll('#metadata > input, #metadata > textarea').forEach((input) => {
      // create input's label
      const div = document.createElement('div')
      const label = document.createElement('p')
      label.textContent = tooltips[input.name].label
      if (input.required) label.className = 'required'
      div.appendChild(label)

      // create input's tooltip
      const subDiv = document.createElement('div')
      const tipButton = document.createElement('button')
      tipButton.name = `tip-${input.name}`
      tipButton.className = 'pill-btn pill-btn--secondary tooltip'
      tipButton.textContent = '?'

      const tipDiv = document.createElement('div')
      tipDiv.className = 'tooltip-content closed'
      const tip = document.createElement('p')
      tip.innerHTML = tooltips[input.name].tip

      tipButton.addEventListener('click', (e) => {
        if (tipDiv.classList.contains('closed')) {
          tipButton.textContent = 'x'
          tipDiv.classList.remove('closed')
          tipDiv.classList.add('opened')
        } else {
          tipButton.textContent = '?'
          tipDiv.classList.remove('opened')
          tipDiv.classList.add('closed')
        }
      })

      tipDiv.appendChild(tip)
      subDiv.appendChild(tipButton)
      subDiv.appendChild(tipDiv)
      div.appendChild(subDiv)
      nn.get('#metadata').insertBefore(div, input)
    })
  },

  startsWithVowel: (str) => /^[aeiou]/i.test(str)
}

window.metadata = metadata
