#!/usr/bin/env node
/**
 * Passage search script for netnet.studio educational content.
 * Searches across all convo files, edu-data, demos, and linter messages.
 *
 * Usage: node my_modules/scripts/passage-search.js "your search text"
 *
 * Tips:
 *   - Search for a short snippet (3-6 words), not the full passage
 *   - Avoid words with apostrophes or HTML markup in your search term
 *   - Search is case-insensitive
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '../..')
const query = process.argv.slice(2).join(' ')

if (!query) {
  console.error('\nUsage: node my_modules/scripts/passage-search.js "search text"\n')
  process.exit(1)
}

// ─── helpers ────────────────────────────────────────────────────────────────

function stripHTML (str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim()
}

function unescapeJS (str) {
  return str.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, ' ').replace(/\\t/g, ' ')
}

function normalize (str) {
  return stripHTML(unescapeJS(str)).toLowerCase().replace(/\s+/g, ' ').trim()
}

function lineAt (src, index) {
  return src.substring(0, index).split('\n').length
}

function preview (str, maxLen) {
  maxLen = maxLen || 120
  const clean = stripHTML(unescapeJS(str)).replace(/\s+/g, ' ').trim()
  return clean.length > maxLen ? clean.substring(0, maxLen) + '...' : clean
}

const normalizedQuery = normalize(query)
const results = []

function report (file, line, raw, type) {
  results.push({ file, line, preview: preview(raw), type })
}

// ─── JS file searcher ────────────────────────────────────────────────────────
// Extracts string values matching a given property pattern and checks for query.
// Creates fresh RegExp objects on each call to avoid lastIndex state issues.

function searchJS (filepath, label, propertyPatterns) {
  const src = fs.readFileSync(filepath, 'utf8')

  for (const { prop, type } of propertyPatterns) {
    const patterns = [
      new RegExp(prop + '\\s*:\\s*`([\\s\\S]*?)`', 'g'),
      new RegExp(prop + "\\s*:\\s*'((?:[^'\\\\]|\\\\.)*)'", 'g'),
      new RegExp(prop + '\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"', 'g')
    ]

    for (const re of patterns) {
      let m
      while ((m = re.exec(src)) !== null) {
        const raw = m[1]
        if (!raw) continue
        if (normalize(raw).includes(normalizedQuery)) {
          report(label, lineAt(src, m.index), raw, type)
        }
      }
    }
  }
}

function searchFriendlyJS (filepath, label) {
  const src = fs.readFileSync(filepath, 'utf8')
  const patterns = [
    /obj\.friendly\s*=\s*`([\s\S]*?)`/g,
    /obj\.friendly\s*=\s*'((?:[^'\\]|\\.)*)'/g,
    /obj\.friendly\s*=\s*"((?:[^"\\]|\\.)*)"/g
  ]
  for (const re of patterns) {
    let m
    while ((m = re.exec(src)) !== null) {
      const raw = m[1]
      if (!raw) continue
      if (normalize(raw).includes(normalizedQuery)) {
        report(label, lineAt(src, m.index), raw, 'friendly error')
      }
    }
  }
}

// ─── JSON file searcher ──────────────────────────────────────────────────────

function searchJSON (filepath, label, extractor) {
  let data
  try {
    data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
  } catch (e) {
    return
  }
  for (const text of extractor(data)) {
    if (normalize(text).includes(normalizedQuery)) {
      report(label, null, text, 'edu-data')
    }
  }
}

function flatTexts (data) {
  const texts = []
  for (const key of Object.keys(data)) {
    const entry = data[key]
    if (entry && entry.description && entry.description.text) texts.push(entry.description.text)
    if (entry && entry.text) texts.push(entry.text)
  }
  return texts
}

function nestedTexts (data) {
  const texts = []
  for (const group of Object.keys(data)) {
    texts.push(...flatTexts(data[group] || {}))
  }
  return texts
}

function demoTexts (data) {
  const texts = []
  if (Array.isArray(data.info)) {
    for (const step of data.info) {
      if (step && step.text) texts.push(step.text)
    }
  }
  return texts
}

// ─── run ─────────────────────────────────────────────────────────────────────

const eduBase = path.join(ROOT, 'www/core/netitor/src/edu-data')
const linterBase = path.join(ROOT, 'www/core/netitor/src/linters')
const convoPatterns = [{ prop: 'content', type: 'convo' }]

// netitor edu-data
const eduFiles = [
  'css/at-rules.json', 'css/data-types.json', 'css/display.json',
  'css/functions.json', 'css/properties.json', 'css/pseudo-classes.json',
  'css/pseudo-elements.json', 'css/units.json',
  'html/elements.json', 'html/attributes.json',
  'html/svg-elements.json', 'html/svg-attributes.json',
  'js/arrays.json', 'js/canvas2d.json', 'js/date.json', 'js/document.json',
  'js/dom-canvas.json', 'js/dom-element.json', 'js/dom-event-target.json',
  'js/dom-media.json', 'js/dom-node.json', 'js/history.json',
  'js/html-element.json', 'js/location.json', 'js/math.json',
  'js/navigator.json', 'js/number.json', 'js/refs.json',
  'js/string.json', 'js/syntax.json', 'js/window.json'
]
for (const file of eduFiles) {
  searchJSON(path.join(eduBase, file), `netitor/src/edu-data/${file}`, flatTexts)
}
searchJSON(path.join(eduBase, 'js/events.json'), 'netitor/src/edu-data/js/events.json', nestedTexts)
searchJSON(path.join(eduBase, 'custom/nn-netitor-docs.json'), 'netitor/src/edu-data/custom/nn-netitor-docs.json', nestedTexts)

// netitor linter friendly errors
for (const file of ['css-friendly-translator.js', 'html-friendly-translator.js', 'js-friendly-translator.js']) {
  searchFriendlyJS(path.join(linterBase, file), `netitor/src/linters/${file}`)
}

// widget convos
const widgetsBase = path.join(ROOT, 'www/widgets')
for (const widget of fs.readdirSync(widgetsBase).sort()) {
  if (widget === 'EXAMPLE-WIDGET' || widget === 'index.js') continue
  const p = path.join(widgetsBase, widget, 'convo.js')
  if (fs.existsSync(p)) searchJS(p, `www/widgets/${widget}/convo.js`, convoPatterns)
}

// core utils-convo
searchJS(path.join(ROOT, 'www/core/utils-convo.js'), 'www/core/utils-convo.js', convoPatterns)

// demos
const demoBase = path.join(ROOT, 'data/demos')
for (const file of fs.readdirSync(demoBase).filter(f => f.endsWith('.json')).sort()) {
  searchJSON(path.join(demoBase, file), `data/demos/${file}`, demoTexts)
}

// template convos
const templateBase = path.join(ROOT, 'data/templates')
for (const dir of fs.readdirSync(templateBase).sort()) {
  const p = path.join(templateBase, dir, 'convo.js')
  if (fs.existsSync(p)) searchJS(p, `data/templates/${dir}/convo.js`, convoPatterns)
}

// ─── output ──────────────────────────────────────────────────────────────────

if (!results.length) {
  console.log(`\nNo matches found for: "${query}"`)
  console.log('\nTips:')
  console.log('  - Try a shorter snippet (3-6 words)')
  console.log('  - Avoid words with apostrophes or HTML markup')
  console.log('  - Search is case-insensitive\n')
  process.exit(0)
}

const colW = 70
console.log('\n' + '─'.repeat(colW))
console.log(`  ${results.length} match${results.length === 1 ? '' : 'es'} for: "${query}"`)
console.log('─'.repeat(colW))

for (const r of results) {
  const loc = r.line ? `:${r.line}` : ''
  console.log(`\n  [${r.type}] ${r.file}${loc}`)
  console.log(`  ${r.preview}`)
}

console.log('\n' + '─'.repeat(colW) + '\n')
