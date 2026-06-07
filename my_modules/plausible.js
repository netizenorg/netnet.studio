const fs = require('fs')
const path = require('path')

const snippets = {
  'netnet.studio': `<!-- Privacy-friendly analytics by Plausible -->
    <script async src="https://plausible.io/js/pa-q-WoRsN82NLnB8rErBOJR.js"></script>
    <script>
      window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
      plausible.init()
    </script>`,
  'dev.netnet.studio': `<!-- Privacy-friendly analytics by Plausible -->
    <script async src="https://plausible.io/js/pa--liAn7YwQV8JABF_qdkid.js"></script>
    <script>
      window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
      plausible.init()
    </script>`
}

module.exports = (app, wwwDir) => {
  const indexHTML = fs.readFileSync(path.join(wwwDir, 'index.html'), 'utf8')
  app.get('/', (req, res) => {
    const snippet = snippets[req.hostname] || ''
    res.send(indexHTML.replace('<!-- PLAUSIBLE -->', snippet))
  })
}
