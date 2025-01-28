const fs = require('fs')
const path = require('path')
const { marked } = require('marked')

// update some of the "marked" library's rendering behavior
// ........................................................
const renderer = new marked.Renderer()

renderer.link = function (obj) {
  let { href, text } = obj

  if (typeof href !== 'string') href = '#'

  // Replace .md with .html for local links
  if (href.endsWith('.md')) {
    href = href.replace(/\.md$/, '.html')
  }

  // Add target="_blank" for external links
  const isExternal = href.startsWith('http') || href.startsWith('//')
  const targetAttr = isExternal ? ' target="_blank"' : ''

  // Check if the text contains an image using basic Markdown syntax for images
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/
  const match = text.match(imageRegex)

  if (match) {
    // Extract the alt text and image source
    const alt = match[1]
    const src = match[2]

    // Construct the <a> tag with the nested <img> tag
    return `<a href="${href}"${targetAttr}><img src="${src}" alt="${alt}" /></a>`
  }

  // Return a standard <a> tag for regular links
  return `<a href="${href}"${targetAttr}>${text}</a>`
}


marked.setOptions({ renderer })

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~ MD to HTML function ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function generateNav (directory, basePath = '') {
  const items = fs.readdirSync(directory, { withFileTypes: true })
  let nav = '<ul>'
  items.forEach(item => {
    const itemPath = path.join(directory, item.name)
    const relativePath = path.join(basePath, item.name)
    if (item.isDirectory()) {
      // Check if the directory contains a README.md
      const readmePath = path.join(itemPath, 'README.md')
      const hasReadme = fs.existsSync(readmePath)
      const link = hasReadme ? path.join(relativePath, 'index.html').replace(/\\/g, '/') : '#'
      const text = item.name
      nav += `<li><a href="/docs/${link}">${text}</a>${generateNav(itemPath, relativePath)}</li>`
    } else if (path.extname(item.name) === '.md') {
      if (path.basename(item.name).toLowerCase() !== 'readme.md') {
        const outputFileName = `${path.basename(item.name, '.md')}.html`
        const link = path.join(basePath, outputFileName).replace(/\\/g, '/')
        const text = path.basename(item.name, '.md')
        nav += `<li><a href="/docs/${link}">${text}</a></li>`
      }
    }
  })
  nav += '</ul>'
  return nav
}

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
const folders = ['advocates', 'developers']
folders.forEach(folder => {
  const folderPath = path.join(baseDir, folder)
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(` ✖ ᴖ ✖ ) Error reading folder ${folder}:`, err)
      return
    }
    files.forEach(file => {
      const filePath = path.join(folderPath, file)
      if (path.extname(file) === '.md') {
        const outputFileName = path.basename(file).toLowerCase() === 'readme.md' ? 'index.html' : `${path.basename(file, '.md')}.html`
        const outputFilePath = path.join(folderPath, outputFileName)
        const templatePath = path.join(baseDir, 'template.html')
        convertMarkdownToHtml(filePath, outputFilePath, templatePath, nav)
      }
    })
  })
})
