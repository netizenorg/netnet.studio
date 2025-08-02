/* global nn demos MSG newDemo, utils */

function uploadJSON () {
  let filePicked = false
  const input = nn.create('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = e => {
    filePicked = true
    const file = e.target.files[0]
    if (!file) return
    const reader = new window.FileReader()
    reader.onload = evt => {
      try {
        MSG('demo-mkr-open-file', evt.target.result)
      } catch (err) {
        console.error('Failed to parse demo file:', err)
        window.modal.open('error')
      }
    }
    reader.readAsText(file)
  }

  const onFocus = () => {
    window.removeEventListener('focus', onFocus)
    if (!filePicked) window.modal.close()
  }

  nn.on('focus', onFocus)
  input.click()
}

window.modal = {
  opened: null,
  close: () => {
    nn.get('#modal').css({ display: 'none' })
    window.modal.opened = null
  },
  open: (type, data) => {
    window.modal.opened = type
    nn.get('#modal').css({ display: 'flex' })

    if (type === 'upload') { // ................................................
      if (nn.get('main').style.opacity !== '1') {
        window.modal.open('loading')
        return uploadJSON()
      }
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">
          Are you sure you want to upload a new demo file? Any unsaved changes
          to this current demo as well as any code in netnet's editor will be
          overwritten.
        </p>
        <button class="pill-btn pill-btn--secondary" id="u">upload file</button>
        <button class="pill-btn pill-btn--secondary" id="c">cancel</button>
      `
      nn.get('#modal #u').on('click', uploadJSON)
    } else if (type === 'need-one-note') { // ..................................
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">
          You need to have at least one note per annotated demo
        </p>
        <button class="pill-btn pill-btn--secondary" id="c">ok</button>
      `
    } else if (type === 'error') { // ..........................................
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">Oh no! There was an error :(</p>
        <button class="pill-btn pill-btn--secondary" id="c">ok</button>
      `
    } else if (type === 'loading') { // ........................................
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">loading...</p>
      `
      return
    } else if (type === 'new-demo-confirm') { // ..............................
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">
          Are you sure you want to create a new demo file? Any unsaved changes
          to this current demo as well as any code in netnet's editor will be
          overwritten.
        </p>
        <button class="pill-btn pill-btn--secondary" id="u">new demo</button>
        <button class="pill-btn pill-btn--secondary" id="c">cancel</button>
      `
      nn.get('#modal #u').on('click', () => newDemo(true))
    } else if (type === 'pick-demo-confirm') { // ..............................
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">
          Are you sure you want to edit a new demo file? Any unsaved changes
          to this current demo as well as any code in netnet's editor will be
          overwritten.
        </p>
        <button class="pill-btn pill-btn--secondary" id="u">edit another demo</button>
        <button class="pill-btn pill-btn--secondary" id="c">cancel</button>
      `
      nn.get('#modal #u').on('click', () => window.modal.open('pick-demo'))
    } else if (type === 'pick-demo') { // ......................................
      if (demos.length === 0) {
        nn.get('#modal > div').innerHTML = `
          <p style=" margin-top: 0;">Demos list has not finished loading</p>
          <button class="pill-btn pill-btn--secondary" id="e">try again?</button>
          <button class="pill-btn pill-btn--secondary" id="c">cancel</button>
        `
        nn.get('#modal #e').on('click', () => window.modal.open('pick-demo'))
      }
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">Which demo would you like to edit?</p>
        <select class="pill-btn pill-btn--secondary"></select>
        <button class="pill-btn pill-btn--secondary" id="e">edit</button>
        <button class="pill-btn pill-btn--secondary" id="c">cancel</button>
      `
      nn.get('#modal select')
        .set({ options: demos.map(d => d.name) })
        .css({ maxWidth: 250 })
      nn.get('#modal #e').on('click', (e) => {
        const sel = nn.get('#modal select').value
        const demo = demos.find(d => d.name === sel)
        MSG('demo-mkr-edit-file', demo.key)
        window.modal.close()
      })
    } else if (type === 'missing-name') { // ...................................
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">The demo must have a name, you left it blank.</p>
        <button class="pill-btn pill-btn--secondary" id="c">ok</button>
      `
    } else if (type === 'generating-url') { // ...................................
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">Generating URL...</p>
      `
      return
    } else if (type === 'new-url') { // ...................................
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">Below is a sharable URL for this Demo</p>
        <input id="url" class="input" style="width:100%; margin-bottom: 20px;" value="${data}">
        <button class="pill-btn pill-btn--secondary" id="u">copy URL</button>
        <button class="pill-btn pill-btn--secondary" id="c">close</button>
      `
      nn.get('#modal #u').on('click', () => {
        utils.copyLink(nn.get('#url'))
      })
    } else if (type === 'need-to-start') { // ...................................
      nn.get('#modal > div').innerHTML = `
        <p style=" margin-top: 0;">You need to upload, edit or start working on a new demo first.</p>
        <button class="pill-btn pill-btn--secondary" id="c">ok</button>
      `
    }
    // close button...
    nn.get('#modal #c').on('click', () => window.modal.close())
  }
}
