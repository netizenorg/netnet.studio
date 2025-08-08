#!/usr/bin/env node

const fs = require('fs').promises
const path = require('path')

// Recursively remove .DS_Store files from a directory
async function removeDSStore (dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await removeDSStore(fullPath)
    } else if (entry.name === '.DS_Store') {
      await fs.unlink(fullPath)
      console.log(`Deleted ${fullPath}`)
    }
  }
}

async function main () {
  const targetDir = process.argv[2] || process.cwd()
  try {
    await removeDSStore(targetDir)
    console.log('All .DS_Store files removed')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
