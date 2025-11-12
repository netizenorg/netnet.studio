const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

const fldrDict = {
  students: 'Dear Students',
  educators: 'Dear Educators',
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
  return /^poster-/.test(file)
}

function posterToVideoTag (src, alt = '') {
  // build video src by removing 'poster-' prefix from filename and swapping extension to .mp4
  const lastSlash = src.lastIndexOf('/')
  const dir = lastSlash >= 0 ? src.slice(0, lastSlash + 1) : ''
  const file = lastSlash >= 0 ? src.slice(lastSlash + 1) : src
  const base = file.replace(/^poster-/, '').replace(/\.[a-zA-Z0-9]+$/, '')
  const videoSrc = `${dir}${base}.mp4`
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
function generateNav (directory, basePath = '') {
  const folders = Object.keys(fldrDict)
  let items = fs.readdirSync(directory, { withFileTypes: true })
  // sort by order in folder array (rather than alphabetically)
  items = items.sort((a, b) => {
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
    return 0
  })
  // create nav's <ul> element
  let nav = '<ul class="docs__panel__list" role="navigation">'
  if (/\/docs\/?$/.test(directory)) {
    nav += '<li class="docs__panel__list-item"><a class="inline-link" href="/docs/">README</a></li>'
  }
  items.forEach(item => {
    const itemPath = path.join(directory, item.name)
    const relative = path.join(basePath, item.name)
    if (item.isDirectory() && !skipFldrs.includes(item.name)) { // Folder Links
      const readme = path.join(itemPath, 'README.md')
      const hasReadme = fs.existsSync(readme)
      const link = hasReadme
        ? path.join(relative, 'index.html').replace(/\\/g, '/')
        : '#'
      nav += `<li class="docs__panel__list-item">
                <a class="header inline-link" href="/docs/${link}">${fldrDict[item.name]}</a>
                ${generateNav(itemPath, relative)}
              </li>`
    } else if (path.extname(item.name) === '.md') { // Markdown File Links
      if (item.name.toLowerCase() !== 'readme.md') {
        const name = path.basename(item.name, '.md')
        const link = path.join(basePath, `${name}.html`).replace(/\\/g, '/')
        nav += `<li class="docs__panel__list-item">
                  <a class="inline-link" href="/docs/${link}">
                  ${name.replace(/-/g, ' ')}
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
const nav = generateNav(baseDir)

// Create home page
const homeInput = path.join(baseDir, 'README.md')
const homeOutput = path.join(baseDir, 'index.html')
const homeTemplate = path.join(baseDir, 'template.html')
convertMarkdownToHtml(homeInput, homeOutput, homeTemplate, nav)

// Create sub-pages
Object.keys(fldrDict).forEach(folder => {
  const folderPath = path.join(baseDir, folder)
  fs.readdir(folderPath, (err, files) => {
    if (err) return console.error(` ✖ ᴖ ✖ ) Error reading folder ${folder}:`, err)
    files.forEach(file => {
      const filePath = path.join(folderPath, file)
      if (path.extname(file) === '.md') {
        const outputFileName = path.basename(file).toLowerCase() === 'readme.md'
          ? 'index.html' : `${path.basename(file, '.md')}.html`
        const outputFilePath = path.join(folderPath, outputFileName)
        const templatePath = path.join(baseDir, 'template.html')
        convertMarkdownToHtml(filePath, outputFilePath, templatePath, nav)
      }
    })
  })
})
