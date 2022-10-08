// npm run setup

const fs = require('fs')
const { execSync } = require('child_process')
const readline = require('readline')

const say = {
  intro: 'Hi there netnet contributor! Welcome to the local development setup guide. I\'ll walk you through the setup process. If you haven\'t done so already, I\'d recommend you review the "contributor\'s guide" on our GitHub repo\'s wiki page. I\'m going to ask you a series of questions, you can simply press enter without typing anything to enter the [default] answer, otherwise you can answer "yes", "no" or pasting in your token/keys, etc.',
  exit: 'Ok, next when you\'re ready just rerun the setup script.',
  token: 'If you generate a personal access token https://github.com/settings/tokens and enter it here I can modify your git config so you can push/pull without having to enter your credentials each time.',
  remote: 'In order to pull updates from netizen.org\'s netnet repo you\'ll need to add it as the "remote upstream".',
  remote2: 'Ok, you\'ll need to do this yourself later if/when you want to pull changes/updates from netizen.org\'s netnet repo (review the "contributor\'s guide" on our GitHub repo\'s wiki page to learn more).',
  github: 'If you plan on working on or using any of netnet\'s GitHub integration functions you\'ll need to create a new GitHub OAuth ID/Secret https://github.com/settings/developers, and enter them below.',
  github2: 'Ok, you\'ll need to set this up yourself later if/when you want to test any of netnet\'s GitHub integration functionality locally (review the "contributor\'s guide" on our GitHub repo\'s wiki page to learn more).',
  install: 'Ok, give me a minute while I download all the server dependencies...',
  finished: 'Great! you\'re all setup to start contributing! You\'re currently on the "main" branch, don\'t forget to create/checkout a new branch named after the feature or bug you plan to work on before you add, edit or commit any code (review the "contributor\'s guide" on our GitHub repo\'s wiki page to learn more).'
}

// -----------------------------------------------------------------------------

const maxWidth = 100
const cols = () => process.stdout.columns - 1

const start = () => {
  const len = cols() < maxWidth ? cols() : maxWidth
  let str = '  '
  for (let i = 0; i < len - 4; i += 2) { str += '_ ' }
  str += '  \n /'
  for (let i = 0; i < len - 3; i++) { str += ' ' }
  str += '\\\n'
  return str
}

const line = (speach) => {
  const limit = cols() < maxWidth ? cols() : maxWidth
  const wds = speach.split(' ')
  let str = '| '
  for (let i = 0; i < wds.length; i++) {
    if (str[str.length - 1] === '\n') str += '| '
    const chk = str.split('\n')
    const len = chk[chk.length - 1].length
    const nxt = wds[i] + ' '
    if (nxt.length + len <= limit) str += nxt
    else {
      for (let i = 0; i < limit - len - 1; i++) { str += ' ' }
      str += '|\n'
      i--
    }
  }
  if (str[str.length - 1] !== '\n') {
    const chk = str.split('\n')
    const len = chk[chk.length - 1].length
    for (let i = 0; i < limit - len - 1; i++) { str += ' ' }
    str += '|\n'
  }
  return str
}
const end = () => {
  let str = ' \\'
  const len = cols() < maxWidth ? cols() : maxWidth
  for (let i = 0; i < len - 4; i += 2) { str += '_ ' }
  str += ',/\n'
  for (let i = 0; i < len - 4 + 1; i++) { str += ' ' }
  str += '.\''
  str += '\n'
  for (let i = 0; i < len - 4 - 10; i++) { str += ' ' }
  str += '( ◕ ◞ ◕ )つ'
  return str
}

function printDialogue (key) {
  console.clear()
  let str = start()
  str += line(say[key])
  str += end()
  console.log(str)
}

// -----------------------------------------------------------------------------

const isYes = (s) => s === 'y' || s === 'Y' || s === 'yes' || s === 'Yes' || s === '"yes"'
const isNo = (s) => s === 'n' || s === 'N' || s === 'no' || s === 'No' || s === '"no"'
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function exitSetup () {
  printDialogue('exit')
  rl.close()
}

function addToken (code) {
  let config = fs.readFileSync('./.git/config', 'utf8')
  const spot = 'url = https://github.com/'
  const ns = `url = https://${code}@github.com/`
  config = config.replace(spot, ns)
  fs.writeFileSync('./.git/config', config)
}

// .................. ....................... ...................... ...........

function setupGHToken () {
  const config = fs.readFileSync('./.git/config', 'utf8')
  const spot = 'url = https://github.com/'
  if (config.includes(spot) && !config.includes('@github.com')) {
    printDialogue('token')
    rl.question('Enter you access token [no] ', (s) => {
      if (isNo(s)) setupRemote()
      else { addToken(s); setupRemote() }
    })
  } else setupRemote()
}

function setupRemote () {
  const config = fs.readFileSync('./.git/config', 'utf8')
  if (config.includes('[remote "upstream"]')) return setupGitHub()
  else {
    printDialogue('remote')
    rl.question('Would you like me to add "remote upstream"? [yes] ', (s) => {
      if (isNo(s)) return warnAboutRemote()
      execSync('git remote add upstream https://github.com/netizenorg/netnet.studio.git')
      setupGitHub()
    })
  }
}

function warnAboutRemote () {
  printDialogue('remote2')
  rl.question('sounds good? [ok] ', (s) => setupGitHub())
}

function setupGitHub () {
  let env
  try {
    env = fs.readFileSync('.env')
  } catch (err) {
    env = 'PORT = 8001'
  }

  if (env.includes('GITHUB_CLIENT_ID')) return downloadDeps()

  let clientID, clientSecret
  printDialogue('github')
  rl.question('Enter your GitHub App Client ID. [no] ', (s) => {
    if (isNo(s) || s === '') return warnAboutGitHub()
    clientID = s
    rl.question('Enter your GitHub App Secret. [no] ', (s) => {
      if (isNo(s) || s === '') return warnAboutGitHub()
      clientSecret = s
      env += `
GITHUB_CLIENT_ID = ${clientID}
GITHUB_CLIENT_SECRET = ${clientSecret}
TOKEN_PASSWORD = th6NjrRkEb4ieUQFzRpfyUm4ZMY6Kqer
`
      fs.writeFileSync('./.env', env)
      downloadDeps()
    })
  })
}

function warnAboutGitHub () {
  printDialogue('github2')
  let env
  try {
    env = fs.readFileSync('.env')
  } catch (err) {
    env = 'PORT = 8001'
    fs.writeFileSync('./.env', env)
  }
  rl.question('sounds good? [ok] ', (s) => downloadDeps())
}

function downloadDeps () {
  printDialogue('install')
  execSync('npm install')
  printDialogue('finished')
  rl.question('sounds good? [ok] ', (s) => rl.close())
}

// -----------------------------------------------------------------------------

printDialogue('intro')
rl.question('Ready to continue with the setup? [y] ', (s) => {
  if (isNo(s)) exitSetup()
  else setupGHToken()
})
