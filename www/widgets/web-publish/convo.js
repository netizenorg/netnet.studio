/* global NNW WIDGETS */
window.CONVOS['web-publish'] = (self) => {
  const errorFace = () => {
    NNW.menu.updateFace({
      leftEye: 'ŏ', mouth: '︵', rightEye: 'ŏ', lookAtCursor: false
    })
  }

  return [{
    id: 'cant-publish-project',
    content: 'You need to be working on a "project" before I can publish to the web. Click on my face to open the <b>Coding Menu</b> then select <i>my code > new</i> &nbsp; to start a new project. Learn more about creating projects on our <a href="/docs/students/coding.html" target="_blank">docs</a>.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'first-published',
    content: 'Your project is live! From now on, every time you "push" updates to your GitHub repo your published site will automatically update. It usually takes a few minutes to go live, you can watch the build status here in the <b>Web Publish</b> widget.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'domain-saved',
    content: 'Your custom domain has been saved! GitHub will rebuild your site to use it, this can take a few minutes so keep an eye on the status indicator here which will switch from "building" to "live" when it\'s ready. Don\'t forget you\'ll need to configure DNS records with your domain provider for this to work.',
    options: {
      'great!': (e) => e.hide(),
      'DNS records?': (e) => e.goTo('dns-records')
    }
  }, {
    id: 'domain-invalid',
    content: 'That doesn\'t look like a valid domain. Try something like <code>example.com</code> or <code>example.net</code>, make sure that it\'s a domain you\'ve personally registered or it won\'t work.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'domain-removed',
    content: 'Your custom domain has been removed, your site will go back to its default github.io address.',
    options: {
      ok: (e) => e.hide()
    }
  }, {
    id: 'pub-info',
    content: 'This widget is used to publish your project to the web using <a href="https://docs.github.com/en/pages" target="_blank">ghpages</a>, GitHub\'s free web hosting service. You can click your <i>published URL</i> to view your page live on the web. When you first publish, and every time you push updates after that, the status indicator will display "building" until the changes are "live".',
    options: {
      ok: (e) => e.hide(),
      'what\'s a custom domain?': (e) => e.goTo('custom-domain'),
      'can I use another service?': (e) => e.goTo('other-host')
    }
  }, {
    id: 'other-host',
    content: 'Of course! The web is an open platform, GitHub isn\'t required to publish online. You could always download your project and upload it to your preferred web host. You could even <a href="https://homebrewserver.club/" target="_blank">host it yourself</a>, the Web is an open platform after all! But since your project already lives on GitHub, the easiest option is <a href="https://pages.github.com/" target="_blank">ghpages</a>, GitHub\'s free hosting, which I can enable for you here.',
    options: {
      'got it': (e) => e.hide(),
      'download it': (e) => WIDGETS['project-files'].downloadProject()
    }
  }, {
    id: 'custom-domain',
    content: 'When you publish with GitHub Pages, your site gets a free address like <i>yourname.github.io/your-project</i>. A "custom domain" lets you swap that out for something you own and control instead, like <i>yourname.com</i>. You\'ll first need to pay for and register a domain from a registrar like <a href="https://www.namecheap.com/" target="_blank">namecheap</a>. Once you have one, enter it in the custom domain field and I\'ll tell GitHub to use it, but you\'ll need to configure DNS records with your domain provider before it works, as <a href="https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/" target="_blank">explained here</a>.',
    options: {
      ok: (e) => e.hide(),
      'what\'s DNS?': (e) => e.goTo('dns-records')
    }
  }, {
    id: 'dns-records',
    content: 'DNS (<a href="https://en.wikipedia.org/wiki/Domain_Name_System" target="_blank">Domain Name System</a>) is basically the Internet\'s giant address book. Computers find each other using numbers called IP addresses, but those are hard for humans to remember, so DNS maps names like <a href="https://google.com" target="_blank">google.com</a> to the right number like <a href="http://142.251.210.206" target="_blank">142.251.210.206</a>, the same way a contact in your phone maps a name to a phone number. When you "add a DNS record," you\'re telling that address book where your domain should point, in our case, that\'s GitHub\'s servers, as <a href="https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/" target="_blank">explained here</a>.',
    options: {
      'I see': (e) => e.hide()
    }
  }, {
    id: 'domain-input-focus',
    content: 'If you\'ve bought your own custom domain name and setup its DNS to point to GitHub\'s IP addresses (where your project is hosted) you can add it here.',
    options: {
      ok: (e) => e.hide(),
      'custom domain?': (e) => e.goTo('custom-domain'),
      'what\'s DNS?': (e) => e.goTo('dns-records')
    }
  }, {
    id: 'oh-no-error',
    after: () => errorFace(),
    content: 'Oh dang! seems there was a server error... sorry about that...',
    options: {
      'it\'s ok, errors are a part of the process': (e) => {
        e.hide()
        NNW.menu.switchFace('default')
      }
    }
  }]
}
