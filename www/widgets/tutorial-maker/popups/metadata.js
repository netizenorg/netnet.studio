
/* global nn updateMetadata */
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

  init: () => {
    if (metadata.initialized) return

    metadata.generateToolTips()
    nn.get('#metadata-submit').on('click', updateMetadata)
    nn.get('#metadata-close').on('click', metadata.close)
    metadata.initialized = true
  },

  close: () => {
    nn.get('#metadata').css('display', 'none')
    nn.get('#start').css('display', 'block')
  },

  generateToolTips: () => {
    const tooltips = {
      id: {
        label: 'Tutorial ID:',
        tip: `The <b>Tutorial ID</b> must match the video's filename.<br><br>
        - If creating a new video, enter the filename you’d like to use.<br>
        - If uploading an existing video, enter its current filename.`,
        required: true
      },
      title: {
        label: 'Title:',
        tip: "The <b>Title</b> is the main name of your tutorial. It will be displayed in the Net Artisan's Guide.",
        required: true
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

    nn.getAll('#metadata > input, #metadata > textarea').forEach((input, i) => {
      // create input's label
      const div = document.createElement('div')
      const label = document.createElement('p')
      label.textContent = tooltips[input.name].label
      if (tooltips[input.name].required) label.className = 'required'
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
  }
}

window.metadata = metadata
