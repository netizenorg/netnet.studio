# Project Architecture

netnet.studio is a Single Page Application (SPA) built with vanilla HTML, CSS, and JavaScript: no framework, no bundler, no transpiler. The code is deliberately transparent. Like the web-days of yore, you can *view-source* on it and read what's happening. The only compiled dependencies are two submodules maintained separately: the [netitor](https://github.com/netizenorg/netitor) (the code editor) and the [netnet-standard-library](https://github.com/netizenorg/netnet-standard-library) (`nn`), both bundled into [www](https://github.com/netizenorg/netnet.studio/tree/main/www) as **netitor.min.js** and **nn.min.js**.

## Directory Structure

```
netnet.studio/
├── server.js              # backend entry point (minimal by design)
├── my_modules/            # server-side modules
│   ├── routes.js          # API route handlers
│   ├── github.js          # GitHub API integration
│   ├── utils.js           # server-side utilities
│   ├── errors.js          # 404 / error middleware
│   └── sockets.js         # Socket.io (inactive, for future ideas)
│
├── www/                   # client-side code (statically served at /)
│   ├── index.html         # single HTML page (loads everything)
│   ├── core/              # core JS classes and utilities
│   │   ├── main.js        # boot script (more info below)
│   │   ├── NetNet.js      # netnet window (see NNW below)
│   │   ├── NetNetFaceMenu.js  # main menu (the face and passages)
│   │   ├── Convo.js       # dialogue system (more info below)
│   │   ├── utils.js       # general purpose utilities
│   │   ├── utils-convo.js # shared dialogue passages
│   │   ├── analytics.js   # Plausible pageview logic
│   │   ├── styles/        # core CSS (more info below)
│   │   ├── libs/          # couple 3rd party libs (Fuse.js, qrious)
│   │   ├── netitor/       # Netitor submodule (netitor.min.js)
│   │   └── netnet-standard-library/  # nn submodule (nn.min.js)
│   │
│   ├── widgets/           # the widgets (each in its own folder)
│   │   ├── index.js       # WIDGETS manager/base-class (info below)
│   │   └── {widget-name}/
│   │       ├── index.js   # widget definition
│   │       ├── convo.js   # optional dialogue passages
│   │       └── styles.css # optional widget-specific styles
│   │
│   ├── custom-elements/   # web components (info below)
│   │   ├── misc/          # general-purpose elements
│   │   ├── svg-diagrams/  # annotated SVG diagrams
│   │   └── bi-directional-editing/  # for code injection widgets
│   │
│   ├── tutorials/         # tutorial content (see below)
│   │   └── {id}/
│   │       ├── tutorial.json  # lesson data + metadata
│   │       ├── {id}.mp4       # main video
│   │       ├── {id}.jpg       # main thumbnail
│   │       └── init.js        # optional timecode hooks
│   │
│   ├── assets/            # images, fonts, audio, video
│   └── files-db-service-worker.js  # for projects (see below)
│
├── data/                  # static database
│   ├── demos/             # annotated demo JSON files
│   ├── templates/         # starter project template JSON files
│   └── shortened-urls.json  # URL shortcode database
│
└── docs/                  # all the static docs
    ├── build-docs.js      # converts markdown to HTML
    ├── template.html      # HTML template for all generated pages
    ├── scripts.js         # JS logic for docs
    ├── styles.css         # CSS styles for docs
    └── {section}/         # docs sub-directory
        ├── README.md      # section index page
        └── *.md           # individual doc pages
```

## the Backend

`server.js` is deliberately minimal. All the details and routing logic lives in [my_modules](https://github.com/netizenorg/netnet.studio/tree/main/my_modules). The server handles serving static files (*www* and *docs*) and a small API surface for GitHub operations, demo/template data, and URL shortening. GitHub OAuth flow exchanges code for token, encrypts it with AES-256-GCM, stores in HTTP-only cookie, the raw token never reaches the client.

All user data (username, preferences, save state, LLM API keys) is stored in `localStorage` on the client via the [student-session](https://github.com/netizenorg/netnet.studio/tree/main/www/widgets/student-session) widget. The server stores nothing about individual users, except for shortened sketches if/when users opt-in to the URL shortener.

The [my_modules](https://github.com/netizenorg/netnet.studio/tree/main/my_modules) directory also contains some dev scripts (see [package.json](https://github.com/netizenorg/netnet.studio/blob/main/package.json))

---

## the Frontend

### HTML (structure)

The literal "single page" in this SPA that brings all the styles and logic together is [www/index.html](https://github.com/netizenorg/netnet.studio/blob/main/www/index.html). Apart from this page, the only HTML pages in the root <a href="https://github.com/netizenorg/netnet.studio/blob/main/www" target="_blank">www</a> folder are the <a href="https://github.com/netizenorg/netnet.studio/blob/main/www/404.html" target="_blank">404.html</a> page and the <a href="https://github.com/netizenorg/netnet.studio/blob/main/www/curtain.html" target="_blank">curtain.html</a> page, which is used if/when we need to temporarily place the app behind a login page or maintaince message.

<div class="two-col">
  <div>
    <h3>CSS (styles)</h3>
    <p>
      The CSS follows the <a href="https://getbem.com/" target="_blank">BEM</a> (block, element, modifier) methodology for class naming. Declarations within rules follow a consistent order based on <a href="https://github.com/necolas/idiomatic-css" target="_blank">Idiomatic CSS</a>: Positioning; Display; Box Model; Color; Typography; Animation.
    </p>
    <p>
      CSS variables are defined in the <code>:root</code> rule of <a href="https://github.com/netizenorg/netnet.studio/blob/main/www/core/styles.css" target="_blank">core/styles.css</a> and referenced throughout via <code>var(--variable-name)</code>. When you need to read or write a CSS variable from JavaScript, use <code>utils.getVal('--variable-name')</code> and <code>utils.setVal('--variable-name', value)</code>.
    </p>
    <p>
      See the <a href="css-styleguide.html">CSS Styleguide doc</a> for more info.
    </p>
  </div>
  <div>
    <h3>JS (logic)</h3>
    <p>
      We intentionally avoid buisiness/enterprise software patterns. Our goal is to create a codebase a curious person can read from top to bottom. No TypeScript, no transpilation, no module bundler. The less obfuscation the better.
    </p>
    <p>
      All JavaScript is written in the <a href="https://standardjs.com" target="_blank">StandardJS</a> style.  Run <code>npm run lint</code> to check that your code conforms to the style, or better yet, install a StandardJS plugin in your editor so you can catch style mistakes as you code.
    </p>
    <p>
      The <a href="https://github.com/netizenorg/netnet.studio/blob/main/www/core/main.js" target="_blank">www/core/main.js</a> is the entry point, it boots everything up and instantiates the global variables.
    </p>
  </div>
</div>

---

## Global Variables

All globals live on `window`. Their definition order is fixed by the boot sequence defined in the [index.html](https://github.com/netizenorg/netnet.studio/blob/main/www/index.html) page and its [main.js](https://github.com/netizenorg/netnet.studio/blob/main/www/core/main.js) file.

| Global | Defined in | Role |
|--------|-----------|------|
| `nn` | [nn.min.js](https://github.com/netizenorg/netnet.studio/tree/main/www/core) | utility library, DOM helpers, math, browser/platform detection |
| `Netitor` | [netitor.min.js](https://github.com/netizenorg/netnet.studio/tree/main/www/core) | code editor class (instantiated as NNE) |
| `WIDGETS` | [widgets/index.js](https://github.com/netizenorg/netnet.studio/blob/main/www/widgets/index.js) | widget manager and registry |
| `Widget` | [widgets/index.js](https://github.com/netizenorg/netnet.studio/blob/main/www/widgets/index.js) | base class all widgets extend |
| `Convo` | [core/Convo.js](https://github.com/netizenorg/netnet.studio/blob/main/www/core/Convo.js) | dialogue runtime class |
| `CONVOS` | [core/Convo.js](https://github.com/netizenorg/netnet.studio/blob/main/www/core/Convo.js) | registry of loaded dialogue passage arrays |
| `NetNet` | [core/NetNet.js](https://github.com/netizenorg/netnet.studio/blob/main/www/core/NetNet.js) | window/layout controller class (instantiated as NNW) |
| `utils` | [core/utils.js](https://github.com/netizenorg/netnet.studio/blob/main/www/core/utils.js) | misc utility functions (fetch, CSS vars, URL routing, etc.) |
| `NNE` | [core/main.js](https://github.com/netizenorg/netnet.studio/blob/main/www/core/main.js) | the main Netitor instance (the code editor) |
| `NNW` | [core/main.js](https://github.com/netizenorg/netnet.studio/blob/main/www/core/main.js) | the NetNet instance (the window/face/layout) |
| `convo` | set at runtime | current active Convo instance |


<div class="two-col">
  <div>
    <h3>NNW (the netnet window)</h3>
    <p>
      <code>NNW</code> is the single instance of <a href="https://github.com/netizenorg/netnet.studio/blob/main/www/core/NetNet.js" target="_blank">core/NetNet.js</a>. It controls the <code>NNW.layout</code> and <code>NNW.theme</code> (both getter/setter) and provides access to the main DOM elements <code>NNW.edtr</code> and <code>NNW.rndr</code> (logic controlled via <code>NNE</code>)
    </p>
    <p>
      It also provides access to netnet's face/menu/text bubble via <code>NNW.menu</code>, the single instance of <a href="https://github.com/netizenorg/netnet.studio/blob/main/www/core/NetNetFaceMenu.js" target="_blank">core/NetNetFaceMenu.js</a>, the convo passage DOM element is accessible via <code>NNW.menu.textBubble</code>, the state is managed via <code>convo</code> see below).
    </p>
  </div>
  <div>
    <h3>NNE (the editor)</h3>
    <p>
      <code>NNE</code> is the main instance of the <a href="https://github.com/netizenorg/netitor" target="_blank">netitor</a> sub-module (there can be others, see <a href="https://github.com/netizenorg/netnet.studio/tree/main/www/widgets/demo-sketches" target="_blank">demo-sketches</a> widget). It renders output to an <code>iframe</code> inside <code>div#nn-output</code> in the main page.
    </p>
    <p>
      Most of the time netnet changes code in the editor it's done via <code>NNE.code = '...'</code>, learn more about the instance's methods/properties and events in the <a href="https://github.com/netizenorg/netitor" target="_blank">netitor</a>'s documentation.
    </p>
  </div>
</div>

### utility modules

There are a whole host of utility methods shared across core components (like <code>NNW</code>) and many of the widgets. These are all found in one of two globabl variables.

<div class="two-col">
  <div>
    <h3>nn</h3>
    <p>
      The <a href="https://github.com/netizenorg/netnet-standard-library" target="_blank">netnet-standard-library.js</a> is not only a core utility library for the platform (handling things like DOM manipulation, device detection, color maths and other functions), it's also used by students in many of the netnet demos and templates. You'll see it used throughout the codebase, best way to learn how it works is to review the <b>nn.min.js</b> <a href="https://netizenorg.github.io/netnet-standard-library/" target="_blank">documentation page</a>.
    </p>
  </div>
  <div>
    <h3>utils</h3>
    <p>
      The <a href="https://github.com/netizenorg/netnet.studio/blob/main/www/core/utils.js" target="_blank">core/utils.js</a> collects other functions, which wouldn't make sense in <code>nn</code> but are also used across widgets and core components, for example <code>utils.get()</code> and <code>utils.post()</code> requests, <code>utils.getVal()</code> and <code>utils.setVal()</code> for accessing CSS variables, <code>utils.hotKey()</code> and many others. The best way to become familiar with it is to read through the source code.
    </p>
  </div>
</div>

*✏️ it's on our TODO list to better document utils.js, likely this will require splitting some of it's logic out, currently it handles all the `utils.checkURL()` loading logic (which may make better sense in a separate file) and `utils.cancelAllNetitorUses()` which might make sense to handle differently at some point as well*


---

## The Widget System

Widgets are multi-purpose independent windows that can be thought of as "plugins" or "addons" for netnet.studio. They're used in a variety of contexts to provide functions, utilities, and information. Apart from the core netnet window and dialogue system, everything in netnet is handled through widgets.

These are managed by the global `WIDGETS` object:

```js
WIDGETS.list()                 // returns all Widget instances
WIDGETS.load('widget-key', cb) // load the JS file only
WIDGETS.open('widget-key', cb) // load + instantiate if needed, then open
WIDGETS['widget-key']          // direct instance access
```

Widgets can be simple one-off widgets, like the ones used during tutorials to open up various media types (images, videos, gifs, audio, texts, 3D objects, etc).

```js
// to create the widget first run
WIDGETS.create({
  key: 'welcome-widget',
  title: 'Welcome to netnet.studio!',
  innerHTML: 'by <a href="https://netizen.org" target="_blank">netizen</a>'
})

// then to open the widget run
WIDGETS.open('welcome-widget')
// you can also close it by calling
WIDGETS.close('welcome-widget')
```

### Creating a widget

For more complex widgets meant to be permanent additions to the studio, there is a base `Widget` class provide which all other widgets extend from. This base class provides: `open()`, `close()`, `update(opts, time)`, `$(selector)` (scoped querySelector), `on(event, cb)`, `emit(event, data)`, `keepInFrame()`, `createCodeField(opts)`, `createSlider(opts)` and more. See [widgets/index.js](https://github.com/netizenorg/netnet.studio/blob/main/www/widgets/index.js) for details.

Widgets are created as folders (with at least a <code>index.js</code> file) in the *widgets* directory. Widget folder names and `key` properties are **kebab-case**. The class name is **PascalCase**, where each hyphen-separated segment is independently capitalized. The `WIDGETS` loader derives the class name from the folder name, so this convention is **mandatory**, deviating from it breaks the loader.

| folder | class | key |
|--------|-----------|------|
| my-cool-widget | MyCoolWidget | 'my-cool-widget'


```js
// www/widgets/my-cool-widget/index.js
class MyCoolWidget extends Widget {
  constructor (opts) {
    super(opts)
    this.key = 'my-cool-widget' // must match folder name
    this.title = 'My Cool Widget'
    this.innerHTML = `<div>...</div>`
  }
}
window.MyCoolWidget = MyCoolWidget // required, manager reads window[ClassName]
```

### Widget Dialogue Passages (convo.js)

If a widget has dialogue, its passages live in `www/widgets/my-widget/convo.js`:

```js
window.CONVOS['my-widget'] = (self) => [
  {
    id: 'greet',
    content: 'Hello!',
    options: {
      'help!': (e) => e.goTo('explain'),
      'never mind': (e) => e.hide()
    }
  }, {
    id: 'explain',
    content: 'Here\'s how this widget works!',
    options: { 'ok': (e) => e.hide() }
  }
]
```

Load it with:
```js
Convo.load(this.key, () => {
  this.convos = window.CONVOS[this.key](this)
})
```

Always re-derive the passages array `this.convos = window.CONVOS[this.key](this)` after any state changes, like `student-session` state change, especially if/when the passages contain template strings with variables that change.

Then trigger a widget's convo by doing:
```js
window.convo = new Convo(this.convos, 'greet')
```

**For more info on widgets see the dedicated [Widget Docs Page](widgets.md)**

---

## The Convo System

Netnet's dialogue passages are hand-authored data, not generated text. Every word is written by a human. The [Convo](https://github.com/netizenorg/netnet.studio/blob/main/www/core/Convo.js) class renders these passages into netnet's text bubble and manages navigation between them.

```js
window.convo = new Convo(passages, 'start-id')
```

A passage looks like:

```js
{
  id: 'passage-id',
  content: 'HTML string shown in the text bubble',
  options: { 'button label': (e) => e.hide() },  // e is the Convo instance
  layout: 'dock-left',   // optionally switch layout when this passage shows
  code: '<h1>hi</h1>',   // optionally inject code into NNE
  highlight: [1, 5],     // highlight these line numbers in the editor
  before: (convo) => {}, // runs synchronously before the bubble updates
  after:  (convo) => {}  // runs after the fade-in animation completes
}
```

Only one `Convo` instance is active at a time (`window.convo`). `before` is synchronous; `after` fires after the bubble animates in, don't put layout-dependent DOM measurements in `before`.

**For more info on editing passages see the [Editing Convos](editing-convos.md) doc spage.**

**For more info on the dialogue system itself see the [Dialogue System](dialogue-system.md) doc spage.**
