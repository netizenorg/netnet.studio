# The Logic (JavaScript)

This README explains (at a high level) what the files in this `/www/js/` direcotry are. If you want a deeper dive into any of this, each `.js` file has comments on the top with more details.

- [StateManager.js](https://github.com/netizenorg/netnet.studio/tree/master/www/js#statemanagerjs)
- [TutorialManager.js](https://github.com/netizenorg/netnet.studio/tree/master/www/js#tutorialmanagerjs)
- [WindowManager.js](https://github.com/netizenorg/netnet.studio/tree/master/www/js#windowmanager) (Widget.js)
- [MenuManager.js](https://github.com/netizenorg/netnet.studio/tree/master/www/js#menumanager) (TextBubble.js, SearchBar.js)
- [./netitor.min.js](https://github.com/netizenorg/netnet.studio/tree/master/www/js#netitorminjs) (NetitorEduInfoHandler.js, NetitorErrorHandler.js)


## [StateManager.js](https://github.com/netizenorg/netnet.studio/blob/master/www/js/StateManager.js)
### global instance: `STORE`

```js
const STORE = new StateManager()
```

This class is responsible for netnet's State Managment, it's modeled on the
"[Flux](https://medium.com/hacking-and-gonzo/flux-vs-mvc-design-patterns-57b28c0f71b7)" state management design pattern. Part of netnet's state is managed elsewhere. Specifically, the netitor's history (in terms of the actual code we type into it) is managed by the netitor instance. Also, widgets && other smaller components handle certain details regarding their state (like that of it's view/presentation) on their own (managed by the instances of the Manager classes below). For a more in depth explanation on how it works visit the [State Management Wiki](https://github.com/netizenorg/netnet.studio/wiki/State-Management) page.


## [TutorialManager.js](https://github.com/netizenorg/netnet.studio/blob/master/www/js/StateManager.js)
### global instance: `NNT`

```js
window.NNT = new TutorialManager()
```

This class is responsible for much of the interactive tutorials logic. It can load tutorial data by passing a tutorial name into it's `.load()` method. It can also load tutorials hosted elsewhere on the Internet by passing it a URL (to a directory with a `metadata.json` file). It can also launch a tutorial on page load by passing netnet a `tutorial` URL parameter, ex: `http://netnet.studio/?tutorial=tutorial-name-or-url`. For a more in depth explanation on how to produce tutorials visit the [Creating Tutorials Wiki](https://github.com/netizenorg/netnet.studio/wiki/Creating-Tutorials)


## [WindowManager.js](https://github.com/netizenorg/netnet.studio/blob/master/www/js/WindowManager.js)
### global instance: `NNW`

```js
window.NNW = new WindowManager()
```

![netnet layouts](https://github.com/netizenorg/netnet.studio/wiki/layouts.gif)
> transitioning between layout types in order: 'welcome', 'separate-window', 'dock-left', 'dock-bottom' and 'full-screen'

This is netent's window manager. It's main concern is handling netnet.studio's layout (including updating the menu/dialogue system's layout to match the current window layout). It has an opacity property, a number between 0 and 1, for example: `NNW.opacity = 0.5`, as well as a layout property, for example `NNW.layout = 'separate-window'`, the other options are: **'welcome', 'separate-window', 'dock-left', 'dock-bottom' and 'full-screen'**. This is also the layout *order*, which comes into play when dispatching the StateManager's `NEXT_LAYOUT` and `PREV_LAYOUT` actions.

The window manager also handles loading all of netnet's widgets, this includes creating the initial widget instances (as properties in the global `WIDGETS` object) as well as loading any files it finds inside the `www/js/widgets` directory (ie. classes extended from the [base Widget class](https://github.com/netizenorg/netnet.studio/blob/master/www/js/Widget.js)). For more on widgets refer to the [Creating Widgets](https://github.com/netizenorg/netnet.studio/wiki/Creating-Widgets) wiki page.

The window manager also handles expanding shortened URL codes via it's `NNW.expandShortURL(shortCode)` method as well as theme changes, both for the netitor but also for the page at large, as the windows, widgets, menu items, alerts and text bubbles inherit their foreground and background colors from the editor's theme. This is done by calling the `NNW.updateTheme('theme-name')` method. Though this should never be called directly, rather it should be called by dispatching the StateManager's `CHANGE_THEME` action.

Additional documentation can be found at the top of the [www/js/WindowManager.js](https://github.com/netizenorg/netnet.studio/blob/master/www/js/WindowManager.js) file itself.


## [MenuManager.js](https://github.com/netizenorg/netnet.studio/blob/master/www/js/MenuManager.js)
### global instance: `NNM`

```js
const NNM = new MenuManager()
```

![netnet main menu](https://github.com/netizenorg/netnet.studio/wiki/main-menu.gif)

This is netnet's menu/dialogue system. Though technically the entire SPA *is* netnet, it's focal presence is really in the menu/dialogue system made most apparent by the fact that this is where netnet's face lives. Clicking on netnet's face opens it's "main menu".

We can check if the menu/dialogue system is currently open by calling it's `NNM.opened` (read-only) property (or we could alternatively ask the StateManager `STORE.is('SHOWING')`). `NNM.opened` will return `'mis'` when the main menu items are showing, `'ais'` if there's an alert item currently open and `'tis'` if there's a text-bubble open.

### general methods

**netnet's face**: netnet's face changes depending on what's going on in the menu, but there will be presumably other reasons to change netnet's expression (when using widgets or going through tutorials), for this there's a `NNM.getFace()` method which returns an array with the current unicode chars making up netnet's face (default is `[ "◕", "◞", "◕" ]`), as well as `NNM.setFace('◕', '◞', '◕')` which takes 3 required arguments (the left eye, mouth and right eye) as well as an additional (optional) fourth argument: a boolean used to determine whether or not netnet's eyes should spin around to follow the cursor (default is `true`).

**general menu display**: there are three methods for handling general menu display, these are the `NNM.fadeIn(ms, callback)` and `NNM.fadeOut(ms, callback)` both of which can take optional arguments. First, the number for the fade-in time in milliseconds and second, a callback function to run after the fade is complete.

**NOTE:** these general display methods are used to hide/show and reposition the menu when the window manager is changing it's layout, it's not *very* likely other parts of the code base will need to make use of these. If you're working on something that needs to change the menu's state use the StateManager (refer to the [State Management Wiki](https://github.com/netizenorg/netnet.studio/wiki/State-Management) page for more info).

![netnet alerts](https://github.com/netizenorg/netnet.studio/wiki/alerts.gif)

The [MenuManager](https://github.com/netizenorg/netnet.studio/blob/master/www/js/MenuManager.js) has a series of other methods for creating alerts and text bubbles (themselves an instance of [TextBubble](https://github.com/netizenorg/netnet.studio/blob/master/www/js/TextBubble.js) which has it's own properties and methods). You can read the comments at the top of these files for more info on these methods, but these should not be called directly, instead you should dispatch actions via the STORE, again refer to the [State Management Wiki](https://github.com/netizenorg/netnet.studio/wiki/State-Management) for more.

The [MenuManager](https://github.com/netizenorg/netnet.studio/blob/master/www/js/MenuManager.js) also maintains a references to netnet's [SearchBar](https://github.com/netizenorg/netnet.studio/blob/master/www/js/SearchBar.js) instance.


## [./netitor.min.js](https://github.com/netizenorg/netitor)
### global instance: `NNE`

```js
const NNE = new Netitor({ /* configuration details */})
```

The netnet window contains an instance of netizen's Internet editor ([netitor](https://github.com/netizenorg/netitor)), this handles all of the code editor logic as well as the rendered output. It communicates with netnet's menu/dialogue system through it's events (see [main.js](https://github.com/netizenorg/netnet.studio/blob/master/www/js/main.js)).

![netnet dialogue](https://github.com/netizenorg/netnet.studio/wiki/dialogue.gif)

It does this with the help of a couple of additional global objects, the [NetitorEduInfoHandler.js](https://github.com/netizenorg/netnet.studio/blob/master/www/js/NetitorEduInfoHandler.js) and the [NetitorErrorHandler.js](https://github.com/netizenorg/netnet.studio/blob/master/www/js/NetitorErrorHandler.js)

The lib itself is served by the server, but is not hosted in this directory. For more info see the README.md in the netitor's [repository](https://github.com/netizenorg/netitor).
