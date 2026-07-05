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

function setupFolderToggles () {
  nn.getAll('.docs__panel .docs__panel__list-item > a.header')
    .forEach(link => {
      link.addEventListener('click', () => {
        link.closest('.docs__panel__list-item').classList.toggle('open')
      })
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

  if (v === '') {
    navItems.forEach(ele => ele.classList.remove('hide'))
    // restore open state: close all, then re-open the folder containing the active link
    document.querySelectorAll('.docs__panel .docs__panel__list-item').forEach(li => li.classList.remove('open'))
    const activeLink = document.querySelector('.docs__panel .active')
    if (activeLink) {
      const li = activeLink.closest('.docs__panel__list-item')
      const folderLi = li?.parentElement?.closest('.docs__panel__list-item')
      if (folderLi) folderLi.classList.add('open')
      else if (li) li.classList.add('open')
    }
    return
  }

  document.querySelectorAll('.docs__panel .docs__panel__list-item').forEach(li => li.classList.remove('open'))

  navItems.forEach(ele => {
    const eleText = ele.textContent.toLowerCase()
    const parentEle = ele.parentElement.parentElement.previousElementSibling

    if (eleText.trim().includes(v)) {
      ele.classList.remove('hide')
      if (parentEle && parentEle.classList.contains('header')) {
        parentEle.classList.remove('hide')
        parentEle.closest('.docs__panel__list-item').classList.add('open')
      }
    } else {
      ele.classList.add('hide')
    }
  })
}

function setupSearch () {
  const searchInput = document.querySelector('#search-input')

  searchInput.addEventListener('input', (e) => filterResults(e))
}

function setupAutoplayVideos () {
  const videos = nn.getAll('video[autoplay]')
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => { entry.target.controls = true })
      } else {
        entry.target.pause()
      }
    })
  }, { threshold: 0.25 })
  videos.forEach(v => observer.observe(v))
}

function setupQuoteCarousels () {
  nn.getAll('.quote-carousel').forEach(carousel => {
    const quotes = Array.from(carousel.querySelectorAll('blockquote'))
    if (quotes.length < 2) return
    let current = 0

    const counter = document.createElement('span')
    counter.className = 'quote-carousel__counter'

    const prev = document.createElement('button')
    prev.className = 'quote-carousel__btn'
    prev.textContent = '←'

    const next = document.createElement('button')
    next.className = 'quote-carousel__btn'
    next.textContent = '→'

    const controls = document.createElement('div')
    controls.className = 'quote-carousel__controls'
    controls.append(prev, counter, next)
    carousel.appendChild(controls)

    function show (i) {
      quotes.forEach((q, idx) => { q.style.display = idx === i ? '' : 'none' })
      counter.textContent = `${i + 1} / ${quotes.length}`
    }

    prev.addEventListener('click', () => { current = (current - 1 + quotes.length) % quotes.length; show(current) })
    next.addEventListener('click', () => { current = (current + 1) % quotes.length; show(current) })

    show(0)
  })
}

function replaceSuperKey () {
  const isMac = nn.platformInfo().platform.includes('Mac')
  const key = isMac ? 'CMD' : 'CTRL'
  const viewer = document.querySelector('.docs__viewer-inner')
  if (!viewer) return
  const walker = document.createTreeWalker(viewer, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  nodes.forEach(node => {
    if (node.textContent.includes('{SUPER}')) {
      node.textContent = node.textContent.replace(/\{SUPER\}/g, key)
    }
  })
}

function setupEyeAnimation () {
  const eyes = nn.getAll('.eye')
  let idleTimer = null

  const blink = async () => {
    eyes.forEach(e => { e.rotate(0); e.textContent = '-' })
    await nn.sleep(250)
    eyes.forEach(e => { e.textContent = '◕' })
    idleTimer = setTimeout(blink, nn.random(5000, 10000))
  }

  nn.on('mousemove', () => {
    clearTimeout(idleTimer)
    idleTimer = setTimeout(blink, 5000)
    eyes.forEach(eye => {
      const cx = eye.left + eye.width / 2
      const cy = eye.top + eye.height / 2
      const deg = nn.radToDeg(nn.angleBtw(cx, cy, nn.mouseX, nn.mouseY)) + 130
      eye.rotate(deg)
    })
  })

  idleTimer = setTimeout(blink, nn.random(3000, 7000))
}

function mobileMenu () {
  const hamburger = document.querySelector('#hamburger')
  const docsPanel = document.querySelector('.docs__panel')

  hamburger.addEventListener('click', (e) => {
    docsPanel.classList.toggle('open')
    if (docsPanel.classList.contains('open')) {
      hamburger.setAttribute('aria-expanded', 'true')
      const overlay = nn.create('div')
        .set('class', 'overlay')
        .on('click', () => docsPanel.hide())
    } else {
      hamburger.setAttribute('aria-expanded', 'false')
    }
  })
}

nn.on('load', () => {
  findActive()
  setupFolderToggles()
  setupNetitors()
  setupSearch()
  mobileMenu()
  setupAutoplayVideos()
  replaceSuperKey()
  setupQuoteCarousels()
  setupEyeAnimation()
})
