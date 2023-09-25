/* global Widget */
class PrivacyPolicy extends Widget {
  constructor (opts) {
    super(opts)

    this.key = 'privacy-policy'
    this.keywords = ['privacy', 'policy', 'terms', 'conditions', 'data']
    this.title = 'Privacy Policy'

    utils.get(`./widgets/${this.key}/index.html`, html => { this.innerHTML = html }, true)

  }
}

window.PrivacyPolicy = PrivacyPolicy
