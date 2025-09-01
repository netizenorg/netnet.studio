/* global nn, Netitor, NNE, utils, Fuse */

const netitors = [] // netitor instances

const copySvg = `<svg viewBox="0 0 16 16" version="1.1" height="16" width="16">
    <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
</svg>`

function findActive () {
  const currentPage = window.location.pathname
  nn.getAll('.docs__panel__list-item > a')
    .forEach(link => {
      if (link.pathname === currentPage) link.classList.add('active')
    })
}

function setupNetitors () {
  nn.getAll('pre > code')
    .forEach((ele, i) => {
      // create code editor block
      const lang = ele.className || 'markdown'
      const code = ele.textContent
      ele.classList.add(`code-${i}`)
      ele.innerHTML = ''
      const ne = new Netitor({
        ele: `.code-${i}`,
        code: code,
        language: lang,
        hint: false,
        lint: false,
        autoUpdate: false,
        readOnly: true,
        wrap: true
      })
      if (lang === 'markdown') ne.cm.setOption('lineNumbers', false)
      netitors.push(ne)

      // create copy symbol element
      const cp = nn.create('div')
        .set('class', 'copy-code')
        .content(copySvg)
        .on('click', () => navigator.clipboard.writeText(ne.code))
      const pn = ele.parentNode
      pn.insertBefore(cp, ele)
    })
}

function filterResults (e) {
  const v = e.target.value.toLowerCase()
  const navItems = document.querySelectorAll('.docs__panel > .docs__panel__list .inline-link')
  navItems.forEach(ele => {
    if (v === '') ele.classList.remove('hide')
    else {
      let pass = false
      let parent = false
      let eleText = ele.textContent.toLowerCase()
      let parentEle = ele.parentElement.parentElement.previousElementSibling

      if (eleText.trim().includes(v)) pass = true
      if (pass) {
        ele.classList.remove('hide')
        if (parentEle.classList.contains('header')) parent = true
        if (parent) {
          parentEle.classList.remove('hide')
        } else {
          parentEle.classList.add('hide')
        }
      } else {
        ele.classList.add('hide')
      }

    }
  })
}

function setupSearch () {
  const searchInput = document.querySelector('#search-input')

  searchInput.addEventListener('input', (e) => filterResults(e))
}

nn.on('load', () => {
  findActive()
  setupNetitors()
  setupSearch()
})
