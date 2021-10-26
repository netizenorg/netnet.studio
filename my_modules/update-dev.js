// npm run update-dev

/*
  github.js has a couple of lines commented out (in order for it to work
  properly on the staging server: 68.183.115.149:1337), this will create a
  merge conflict before pulling changes from the repo, which is why we first
  need to uncommnet those lines, then pull changes, && then comment them back
  out. this script automates that process.
*/

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const ghfilepath = path.join(__dirname, 'github.js')
const ghfile = fs.readFileSync(ghfilepath, 'utf8')
let tempdata = ghfile.replace('// secure: true,', 'secure: true,')
tempdata = tempdata.replace('// sameSite: true,', 'sameSite: true,')

fs.writeFile(ghfilepath, tempdata, (err) => {
  if (err) return console.log(err)
  console.log('>>> created temporary edit to github.js')
  console.log('>>> pulling changes')
  exec('git pull', (err, stdout, stderr) => {
    if (err) return console.log(err)
    if (stderr && stderr.length > 0) return console.log(stderr)
    console.log(stdout)
    fs.writeFileSync(ghfilepath, ghfile)
    console.log('>>> update complete')
  })
})
