/* global plausible */
/*

  ( ◕ ◞ ◕ )つ hi there! here's our custom setup for our Plausible web analytics!
  for reasons mentioned here: https://github.com/nbriz/StatsNotTracks we had
  originally created our own custom web analytics framework from scratch in
  order to record useful stats on how our site is performing without compromising
  the privacy of our users.

  Unfortunately the most popular "free" web analytics frameworks, like Google
  Analytics, are based on surveillance capitalist buisiness models, which
  contradict our values, so we rolled out our own framework... but that proved
  difficult to maintain (and a bit of a tangent from our main goal, netnet).

  Fortunately we discovered Plausibe! an independent, open source analytics
  company based in the EU which shares our values! learn more about them here:
  https://plausible.io/about

*/
window.plausible = window.plausible || function () { (plausible.q = plausible.q || []).push(arguments) }
window.plausible.init = window.plausible.init || function (i) { plausible.o = i || {} }
plausible.init({ endpoint: '/api/event', autoCapturePageviews: false })

;(function () {
  var p = new URLSearchParams(window.location.search)
  var url = window.location.origin + window.location.pathname
  var gh = p.get('gh')
  var demo = p.get('demo') || p.get('ex')
  var template = p.get('template')
  var tutorial = p.get('tutorial')
  var shortCode = p.get('c')
  var widget = p.get('w')
  if (tutorial) url += 'tutorial'
  else if (gh) url += 'github'
  else if (shortCode) url += 'shortcode'
  else if (demo) url += 'demo/' + demo
  else if (template) url += 'template/' + template
  else if (widget) url += 'widget/' + widget
  if (widget && (tutorial || gh || shortCode || demo || template)) url += '/w/' + widget
  plausible('pageview', { u: url })
})()
