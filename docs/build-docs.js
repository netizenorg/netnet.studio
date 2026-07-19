const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

const fldrDict = {
  students: 'Dear Students',
  educators: 'Dear Educators',
  supporters: 'Dear Supporters',
  contributors: 'Dear Contributors'
}
const skipFldrs = ['images']

// update some of the "marked" library's rendering behavior
// ........................................................
const renderer = new marked.Renderer()

// helper to detect and convert poster images to <video>
function isPosterSrc (src) {
  if (typeof src !== 'string') return false
  const file = src.split('/').pop() || src
  return /-poster\.[a-zA-Z0-9]+$/.test(file)
}

function posterToVideoTag (src, alt = '') {
  // build video src by removing '-poster' suffix from filename and swapping extension to .mp4
  const lastSlash = src.lastIndexOf('/')
  const dir = lastSlash >= 0 ? src.slice(0, lastSlash + 1) : ''
  const file = lastSlash >= 0 ? src.slice(lastSlash + 1) : src
  const base = file.replace(/-poster\.[a-zA-Z0-9]+$/, '')
  const videoSrc = `${dir}${base}.mp4`
  // exception for intro video
  if (base === 'netnet-intro') {
    return `<video style="display: block; margin: 0 auto; border: 4px solid var(--netizen-tag); border-radius: 25px 25px 1px 1px;" controls playsinline width="720"\n  src="${videoSrc}"\n  poster="${src}">\n</video>`
  }
  return `<video autoplay loop muted playsinline width="720"\n  src="${videoSrc}"\n  poster="${src}">\n</video>`
}

renderer.link = function (obj) {
  let { href, text } = obj
  // format links
  if (typeof href !== 'string') href = '#'
  if (href.endsWith('.md')) href = href.replace(/\.md$/, '.html')
  if (href.includes('README')) href = href.replace('README', 'index')
  // add target="_blank" for external links
  const isExternal = href.startsWith('http') || href.startsWith('//')
  const targetAttr = isExternal ? ' target="_blank"' : ''
  // check for linked images
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/
  const match = text.match(imageRegex)
  if (match) {
    const alt = match[1]
    const src = match[2]
    if (isPosterSrc(src)) {
      const video = posterToVideoTag(src, alt)
      return `<a href="${href}"${targetAttr}>${video}</a>`
    }
    return `<a href="${href}"${targetAttr}><img src="${src}" alt="${alt}" /></a>`
  }

  return `<a href="${href}"${targetAttr}>${text}</a>`
}

renderer.image = function (obj) {
  const { href, text } = obj
  if (isPosterSrc(href)) {
    return posterToVideoTag(href, text)
  }
  const alt = text || ''
  return `<img src="${href}" alt="${alt}" />`
}

renderer.code = function (token) {
  // add custom class to js, html && css blocks so that we can nn.getAll
  // in scripts.js && style correctly when converted into a Netitor instance
  const lang = token.lang || ''
  const cls = lang === 'js' ? 'javascript' : lang
  const classAttr = cls ? ` class="${cls}"` : ''
  const content = this.options.highlight
    ? this.options.highlight(token.text, lang)
    : token.text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  return `<pre><code${classAttr}>${content}</code></pre>\n`
}

marked.setOptions({ renderer })

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~ create side-panel navigation <ul> ~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function generateNav (directory, basePath = '', activeFolder = '') {
  const folders = Object.keys(fldrDict)
  let items = fs.readdirSync(directory, { withFileTypes: true })

  // load optional per-folder file ordering (_order.json lists entries in desired order)
  const orderFile = path.join(directory, '_order.json')
  const fileOrder = fs.existsSync(orderFile)
    ? JSON.parse(fs.readFileSync(orderFile, 'utf8'))
    : []
  // build lookup maps: filename → index, display name override, and divider positions
  const fileOrderIndex = {}
  const fileNameOverride = {}
  const dividerIndices = new Set()
  fileOrder.forEach((entry, i) => {
    const filename = typeof entry === 'string' ? entry : entry.file
    if (filename === '/' || filename === '---') { dividerIndices.add(i); return }
    fileOrderIndex[filename] = i
    if (entry.name) fileNameOverride[filename] = entry.name
  })

  items = items.sort((a, b) => {
    // sort directories by fldrDict position
    if (a.isDirectory() && b.isDirectory()) {
      const ai = folders.indexOf(a.name)
      const bi = folders.indexOf(b.name)
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1
        if (bi === -1) return -1
        return ai - bi
      }
      return a.name.localeCompare(b.name)
    }
    // sort files: _order.json entries first (in listed order), then natural order
    if (!a.isDirectory() && !b.isDirectory()) {
      const ai = fileOrderIndex[a.name] ?? -1
      const bi = fileOrderIndex[b.name] ?? -1
      if (ai !== -1 && bi !== -1) return ai - bi
      if (ai !== -1) return -1
      if (bi !== -1) return 1
    }
    // dirs always before files so dir-dir comparisons aren't blocked by interleaved files
    return a.isDirectory() ? -1 : 1
  })
  // create nav's <ul> element
  let nav = '<ul class="docs__panel__list" role="navigation">'
  if (/\/docs\/?$/.test(directory)) {
    nav += '<li class="docs__panel__list-item"><a class="inline-link" href="/docs/">README</a></li>'
  }
  let prevOrderIndex = -1
  items.forEach(item => {
    const curOrderIndex = fileOrderIndex[item.name] ?? Infinity
    for (const di of dividerIndices) {
      if (di > prevOrderIndex && di < curOrderIndex) {
        nav += '<li class="docs__panel__list-item docs__panel__divider"></li>'
      }
    }
    prevOrderIndex = curOrderIndex
    const itemPath = path.join(directory, item.name)
    const relative = path.join(basePath, item.name)
    if (item.isDirectory() && !skipFldrs.includes(item.name)) { // Folder Links
      const readme = path.join(itemPath, 'README.md')
      const hasReadme = fs.existsSync(readme)
      const link = hasReadme
        ? path.join(relative, 'index.html').replace(/\\/g, '/')
        : '#'
      const isOpen = item.name === activeFolder
      nav += `<li class="docs__panel__list-item${isOpen ? ' open' : ''}">
                <a class="header inline-link" href="/docs/${link}">${fldrDict[item.name]}</a>
                ${generateNav(itemPath, relative, activeFolder)}
              </li>`
    } else if (path.extname(item.name) === '.md') { // Markdown File Links
      if (item.name.toLowerCase() !== 'readme.md') {
        const base = path.basename(item.name, '.md')
        const link = path.join(basePath, `${base}.html`).replace(/\\/g, '/')
        const label = fileNameOverride[item.name] || base.replace(/-/g, ' ')
        nav += `<li class="docs__panel__list-item">
                  <a class="inline-link" href="/docs/${link}">
                  ${label}
                </a></li>`
      }
    }
  })
  nav += '</ul>'
  return nav
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~ MD to HTML function ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function convertMarkdownToHtml (inputFile, outputFile, templatePath, nav) {
  fs.readFile(inputFile, 'utf8', (err, markdown) => {
    if (err) {
      console.error(` ✖ ᴖ ✖ ) Error reading file ${inputFile}:`, err)
      return
    }
    const htmlContent = marked(markdown)
    let finalHtml = htmlContent
    if (templatePath) {
      try {
        const template = fs.readFileSync(templatePath, 'utf8')
        finalHtml = template.replace('{{content}}', htmlContent).replace('{{nav}}', nav)
      } catch (templateErr) {
        console.error(` ✖ ᴖ ✖ ) Error reading template ${templatePath}:`, templateErr)
        return
      }
    }
    const outputDir = path.dirname(outputFile)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    fs.writeFile(outputFile, finalHtml, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error(` ✖ ᴖ ✖ ) ERROR with: ${outputFile}:`, writeErr)
      } else {
        console.log(`( ◕ ◞ ◕ ) created docs/${outputFile.split('/docs/')[1]}`)
      }
    })
  })
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~ CONVERT THE DOCS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const baseDir = __dirname // in case this needs to change later
const templatePath = path.join(baseDir, 'template.html')

// Create 404 page (reuses template + nav so the panel search works out of the box)
;(function () {
  const content = `
<style>
  .docs__viewer--404 { display: flex; align-items: center; justify-content: center; height: 100%; }
  .docs__404 { max-width: 480px; width: 100%; text-align: center; }
  .docs__404__face { font-size: 2rem; margin-bottom: 12px; }
  .docs__404__label {
    font-family: 'fira-mono-regular', monospace; font-size: 13px;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--netizen-comment); margin-bottom: 12px;
  }
  .docs__404__msg { font-size: 18px; color: var(--netizen-comment); line-height: 1.5em; margin: 0 0 8px; }
  .docs__404__url {
    font-family: 'fira-mono-regular', monospace; font-size: 13px;
    color: var(--netizen-comment); margin: 0 0 28px; word-break: break-all;
  }
  .docs__404__home {
    font-family: 'fira-mono-regular', monospace; font-size: 13px;
    color: var(--netizen-comment); text-decoration: none;
    transition: color var(--element-transition-time) ease;
  }
  .docs__404__home:hover { color: var(--netizen-def); }
</style>
<div class="docs__404">
  <div class="docs__404__face">( &#9685; &#9694; &#9685; )</div>
  <div class="docs__404__label">404 — page not found</div>
  <p class="docs__404__msg">The page <span class="docs__404__url" id="missing-url"></span> doesn't exist. Use the search on the left to find what you were looking for.</p>
  <a href="/docs/" class="docs__404__home">← or go back to the main page</a>
</div>
<script>
  const el = document.getElementById('missing-url')
  if (el) el.textContent = window.location.pathname
</script>`

  const template = fs.readFileSync(templatePath, 'utf8')
  const nav = generateNav(baseDir, '', '')
  const finalHtml = template
    .replace('{{content}}', content)
    .replace('{{nav}}', nav)
    .replace('<div class="docs__viewer">', '<div class="docs__viewer docs__viewer--404">')
  fs.writeFileSync(path.join(baseDir, '404.html'), finalHtml, 'utf8')
  console.log('( ◕ ◞ ◕ ) created docs/404.html')
})()

// Create home page (no folder pre-opened)
convertMarkdownToHtml(
  path.join(baseDir, 'README.md'),
  path.join(baseDir, 'index.html'),
  templatePath,
  generateNav(baseDir, '', '')
)

// Create sub-pages (each folder gets its own nav with the right section pre-opened)
Object.keys(fldrDict).forEach(folder => {
  const folderPath = path.join(baseDir, folder)
  const folderNav = generateNav(baseDir, '', folder)
  fs.readdir(folderPath, (err, files) => {
    if (err) return console.error(` ✖ ᴖ ✖ ) Error reading folder ${folder}:`, err)
    files.forEach(file => {
      const filePath = path.join(folderPath, file)
      if (path.extname(file) === '.md') {
        const outputFileName = path.basename(file).toLowerCase() === 'readme.md'
          ? 'index.html' : `${path.basename(file, '.md')}.html`
        const outputFilePath = path.join(folderPath, outputFileName)
        convertMarkdownToHtml(filePath, outputFilePath, templatePath, folderNav)
      }
    })
  })
})
