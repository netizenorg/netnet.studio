const path = require('path')

// 404 for anything that didn't match a route/static
function notFound (req, res, next) {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'not_found' })
  }

  const file = req.path.startsWith('/docs')
    ? path.join(__dirname, '..', 'docs', '404.html')
    : path.join(__dirname, '..', 'www', '404.html')
  res.status(404).format({
    html: () => res.sendFile(file),
    json: () => res.json({ error: 'not_found' }),
    default: () => res.type('txt').send('( ◕ ◞ ◕ ) 404 Not Found')
  })
}

// Centralized error handler for unexpected failures
function errorHandler (err, req, res, next) {
  console.error(err)
  const status = err.status || 500
  const isApi = req.path.startsWith('/api')
  const message = status === 500 ? 'server_error' : err.message

  if (isApi) {
    return res.status(status).json({ error: message })
  }

  res
    .status(status)
    .send(status === 500 ? 'Oh no! Something went wrong (ŏ ︵ ŏ)' : message)
}

// Helper to catch async errors and forward to errorHandler
const wrap = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
// consider implementing something like this in other routes
/*
  const { wrap } = require('./my_modules/errors.js')

  router.get('/api/widgets', wrap(async (req, res) => {
    const widgets = await loadWidgetsFromDb()
    res.json(widgets)
  }))
*/

module.exports = { notFound, errorHandler, wrap }
