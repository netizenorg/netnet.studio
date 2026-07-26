# Bug Reports

If something in netnet.studio didn’t work the way you expected, we want to hear about it! This document explains how to file a helpful bug report with enough detail for us to reproduce the issue on our end and fix it.

Don't forget, **if this is your first time contributing to an open source project** you'll need to start by [creating a GitHub account](https://github.com/signup), if you've already got one make sure you're [logged in](https://github.com/login) before filling out the form below.
<br><br>

## Filing a New Issue

We use GitHub to track all of our [issues](https://github.com/netizenorg/netnet.studio/issues), you can use the form below to create a new issue. Because different devices, operating systems, browsers, settings, or even small differences in the steps taken can lead to different results, sharing your setup and exactly what you did gives us the best chance to reproduce the bug on our end so we can fix it! So please fill in as much as you can below then click **Open on GitHub** to open a pre-filled issue, or **Copy** to copy the text and paste it into a [new issue](https://github.com/netizenorg/netnet.studio/issues/new) yourself.

<div class="bug-report-form">

  <div class="bug-report-form__field">
    <label for="br-title">Issue title</label>
    <input type="text" id="br-title" placeholder="A brief summary of the problem">
  </div>

  <div class="bug-report-form__field">
    <label for="br-expected">Expected result</label>
    <textarea id="br-expected" placeholder="What did you expect to happen?"></textarea>
  </div>

  <div class="bug-report-form__field">
    <label for="br-actual">Actual result</label>
    <textarea id="br-actual" placeholder="What actually happened? Include any error messages."></textarea>
  </div>

  <fieldset class="bug-report-form__group">
    <legend>Where it happened</legend>
    <div class="bug-report-form__field">
      <label for="br-widget">Widget / feature</label>
      <input type="text" id="br-widget" placeholder="e.g. Project Files widget, Code Review, Learning Guide">
    </div>
    <div class="bug-report-form__field">
      <label for="br-url">URL (if relevant)</label>
      <input type="text" id="br-url" placeholder="The URL in the address bar when the bug occurred">
    </div>
  </fieldset>

  <div class="bug-report-form__field">
    <label for="br-steps">Steps to reproduce</label>
    <textarea id="br-steps" rows="5" placeholder="1. First I clicked...&#10;2. Then I...&#10;3. The bug appeared when..."></textarea>
  </div>

  <fieldset class="bug-report-form__group">
    <legend>Frequency</legend>
    <div class="bug-report-form__radios">
      <label><input type="radio" name="br-freq" value="Always"> Always</label>
      <label><input type="radio" name="br-freq" value="Sometimes"> Sometimes</label>
      <label><input type="radio" name="br-freq" value="Happened once"> Happened once</label>
    </div>
  </fieldset>

  <fieldset class="bug-report-form__group">
    <legend>Platform</legend>
    <div class="bug-report-form__field">
      <label for="br-device">Device</label>
      <input type="text" id="br-device" placeholder="e.g. MacBook Air M1, Windows Desktop, iPad">
    </div>
    <div class="bug-report-form__field">
      <label for="br-os">OS + version</label>
      <input type="text" id="br-os" placeholder="e.g. macOS 14.2, Windows 11 23H2, iOS 17">
    </div>
    <div class="bug-report-form__field">
      <label for="br-browser">Browser + version</label>
      <input type="text" id="br-browser" placeholder="e.g. Chrome 120, Firefox 121, Safari 17">
    </div>
    <div class="bug-report-form__field">
      <label for="br-extensions">Extensions / privacy settings</label>
      <input type="text" id="br-extensions" placeholder="Any extensions or unusual settings (optional)">
    </div>
  </fieldset>

  <fieldset class="bug-report-form__group">
    <legend>Extra context (optional but VERY helpful)</legend>
    <p class="bug-report-form__hint">📎 Once you open the issue on GitHub, you can drag and drop <strong>screenshots</strong> or <strong>screen recordings</strong> directly into the text field, this is extremely helpful for us!</p>
    <div class="bug-report-form__field">
      <label for="br-console">Console errors</label>
      <textarea id="br-console" placeholder="Open DevTools (F12 or Fn+F12), go to Console, copy+paste any errors here"></textarea>
    </div>
  </fieldset>

  <div class="bug-report-form__actions">
    <button class="bug-report-form__btn bug-report-form__btn--primary" onclick="openBugReportOnGitHub()">Open on GitHub ↗</button>
    <button class="bug-report-form__btn" onclick="copyBugReport()">Copy</button>
    <span class="bug-report-form__notice" id="br-notice">Copied to clipboard!</span>
  </div>

</div>

<script>
function getBugReportBody () {
  function val (id) { var el = nn.get('#' + id); return el ? el.value.trim() : '' }
  var freq = nn.get('input[name="br-freq"]:checked')
  return 'Platform\n' +
    '- Device: ' + val('br-device') + '\n' +
    '- OS + version: ' + val('br-os') + '\n' +
    '- Browser + version: ' + val('br-browser') + '\n' +
    '- Extensions/privacy settings: ' + val('br-extensions') + '\n\n' +
    'Expected result:\n' + val('br-expected') + '\n\n' +
    'Actual result:\n' + val('br-actual') + '\n\n' +
    'Where it happened\n' +
    '- Widget/feature: ' + val('br-widget') + '\n' +
    '- URL (if relevant): ' + val('br-url') + '\n\n' +
    'Steps to reproduce\n' + val('br-steps') + '\n\n' +
    'Frequency: ' + (freq ? freq.value : '') + '\n\n' +
    'Extra context\n' +
    '- Console errors:\n' + val('br-console')
}

function openBugReportOnGitHub () {
  var title = encodeURIComponent(nn.get('#br-title').value.trim())
  var body = encodeURIComponent(getBugReportBody())
  window.open('https://github.com/netizenorg/netnet.studio/issues/new?title=' + title + '&body=' + body, '_blank')
}

function copyBugReport () {
  var text = 'Title: ' + nn.get('#br-title').value.trim() + '\n\n' + getBugReportBody()
  navigator.clipboard.writeText(text).then(function () {
    var notice = nn.get('#br-notice')
    notice.css('opacity', 1)
    setTimeout(function () { notice.css('opacity', 0) }, 2000)
  })
}
</script>


<div class="warning">
🙏 Opening an issue is the start of a conversation between you and us. Please keep an eye on it, as we may ask clarifying questions to help fix things. Thank you for taking the time to report a bug!
</div>



<br><br><br>
## The Manual Approach

If you're experiencing issues with the form above and would prefer to simply create your own issue manually you can do so by vising:

- ### [https://github.com/netizenorg/netnet.studio/issues/new](https://github.com/netizenorg/netnet.studio/issues/new)

Please use the template below as a starting point and dont' forget, as mentioned in the [contributors page](README.md), you'll need to create a free GitHub account before you can contribute:

```
Platform
- Device:
- OS + version:
- Browser + version:
- Extensions/privacy settings (if any):

Expected result:

Actual result:

Where it happened
- Widget/feature:
- URL (if relevant):

Steps to reproduce
1.
2.
3.


Frequency
- [ ] Always  - [ ] Sometimes  - [ ] Happened once

Optional but SUPER helpful context
- Screenshots/video:
- Console errors (copy/paste):
```
