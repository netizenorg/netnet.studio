As mentioned in our (Data and Privacy)(https://github.com/netizenorg/netnet.studio/wiki/Data-and-Privacy#saving-projects) docs:

> When you first create a new project, the code associated with that project is sent to our servers so that we can pass it along to GitHub to store in your account. After that, every time you "save" your progress (Ctrl+S or CMD+S on Mac) we'll store that progress temporarily on our server as well as locally in your session data. When you choose to "push" those changes to your GitHub we'll pass that along to GitHub and later delete it from our servers after it's been stored safely on your GitHub account.

Originally, when the user saved their progress on a project, we'd simply send that data to GitHub (updating their index.html file), this worked fine for single-file projects, but on multi-file projects it posed an issue. GitHub has a 2-5minute delay between the moment we push updates to a file and the time it'll return the updated code when requested via their raw URLS. This means, for example, that with this old method if a user would update their `styles.css` page, then switch to their `index.html` (which links to the styles) we wouldn't see those style updates reflected for 2-5mins... which is obviously not ideal. To solve this (and to better resemble a more conventional local workflow for the student), users now "save their progress locally" and later "push those changes" to their GitHub.

And so, the reason we're storing these "save states" on the server in this folder now is because if the user is working on a project which they've "saved locally" (local storage) but haven't yet pushed to their GitHub, we need some way of tracking those saved (but not yet pushed) changes when rendering those pages to the output. And because netnet's `<base>` url is set to redirect all paths in the user's code to our GitHub proxy (`router.get('/api/github/proxy')` in `my_modules/github.js`) we needed somewhere to put this temporarily saved progress on the server so that we could first check to see if this exists (`checkTempGHFile()` in `my_modules/github.js`) and return that to the front-end (and only return the code hosted on GitHub if no locally saved changes exist).

This is just 1 of a set of changes we needed to make when adding multiple file editing functionality to netnet, as a result the act of "saving" on netnet has increased in complexity. Below we've documented exactly what happens when a user "saves" their progress


# the save flow

<!-- TOOD: add table of contents... -->

## when working on a "sketch"

the user presses the `Cmd/Ctrl+S` or runs the `saveSketch()` function from the menu/search bar to trigger:
```js
WIDGETS['functions-menu'].saveSketch()
```
which then triggers:
```js
WIDGETS['student-session'].setSavePoint()
```
which updates `localStorage` data with the `last-saved-sketch` code, `last-saved-layout` and the `last-saved-widgets` (currently opened widgets and their positions).

students are also prompted at that moment if they want to:
```js
WIDGETS['functions-menu'].downloadCode() // download code to local .html file
WIDGETS['functions-menu'].shareSketch() // open 'share-widget'
WIDGETS['functions-menu'].saveProject() // create a new GitHub project
```

if they choose to `shareSketch()`, the "share-widget" helps them create a custom netnet URL w/their sketch compressed/encoded into the actual URL (see [Anatomy of a netnet URL](Anatomy-of-a-netnet-URL) in the wiki docs), as well as the option to create a "short url", which will create a new entry in our `/data/shortened-urls.json` (a dictionary mapping short-codes to longer URL strings).

## when working on a "project"

### creating new project

if the user runs `newProject()` from the project's menu, it will trigger:
```js
WIDGETS['functions-menu'].newProject()
```

1. we first check to see if this someone else's project, if so they'll be given the option to "fork" it, if they choose to do so then we run `utils.forkRepo()` which hits our `./api/github/fork` and then runs `WIDGETS['functions-menu']._openProject()` to load in their newly forked project from their GitHub (see below for more on `_openProject`), they might instead choose to create a new project which will `WIDGETS['student-session'].clearProjectData() ` as well as `WIDGETS['functions-menu']._createNewRepo()`

2. if they have a project opened with unsaved changes they will be prompted to optionally save that first

3. otherwise, this will trigger `WIDGETS['functions-menu']._createNewRepo()` which will: `WIDGETS['student-session'].clearSaveState()` and post `{ name: 'project-name', data: 'index-html-code' }` to `./api/github/new-repo`, if that succeeds it will then trigger:
```js
WIDGETS['student-session'].updateRoot() // to NNE.addCustomRoot({ base, proxy })
NNW.updateTitleBar(`${res.name}/index.html`) // to update editors title bar link
utils.updateURL(`?gh=${owner}/${repo}`) // to update the browser URL
// and...
WIDGETS['student-session'].setProjectData({
  name: res.name,
  message: res.message,
  file: res.path,
  url: res.url,
  ghpages: res.ghpages,
  branch: res.branch,
  code: utils.btoa(NNE.code)
})
```

### opening an old project

if the user navigates to netnet with a gh URL in it (like those created by `utils.updateURL('?gh=${owner}/${repo}')`) they will be prompted to remix it (if it's someone else's project, see `forkRepo()` above/below) or open it if it's theres, triggering `WIDGETS['functions-menu']._openProject(repo)`.

Similarly, if the user runs `Cmd/Ctrl+O` or the `openProject()` function in the project's menu it will prompt the user with a list of their projects, once they select one it will also call `WIDGETS['functions-menu']._openProject(repo)`

running `_openProject()` will `WIDGETS['student-session'].clearSaveState()` and then post `{ repo, owner }` to `./api/github/open-project` if successful it will then update the `opened-project`, `branch` and `project-url` in the student-session, then (like when creating a new project above) it will also `NNW.updateTitleBar(...)` and `utils.updateURL(...)` before updating the Files-And-Folders widget:
```js
// update the widgets view w/the new tree structure
WIDGETS['files-and-folders'].updateFiles(res.data.tree)
// and automatically open it...
WIDGETS['files-and-folders'].open()
```
once the widget is ready, it'll post to `./api/github/open-file` to get the index.html file's data and update the "student-session" local info (for `open-file` and `last-commit-code`) as well as the "files-and-folders" dictionary and the netitor settings, specifically:
```js
WIDGETS['student-session'].updateRoot()
NNE.code = c
NNE.language = 'html'
NNE.autoUpdate = false
```
before calling the `WIDGETS['files-and-folders']._renderToIframe('index.html')`

### saving a project

if the user ran `Cmd/Ctrl+S` or `saveProject()` while working on a sketch and chose to save their project, or if they run `Cmd/Ctrl+S` while there was an unsaved project open, that will trigger:

```js
WIDGETS['functions-menu'].saveProject()
```

1. we first check to see if this someone else's project, if so they'll be given the option to "fork" it, if they choose to do so then we run `utils.forkRepo()` which hits our `./api/github/fork` and then runs `WIDGETS['functions-menu']._openProject()` (see `_openProject` above for more), they might instead choose to create a new project which will `WIDGETS['student-session'].clearProjectData() ` as well as `WIDGETS['functions-menu']._createNewRepo()` (see above for more on `_createNewRepo`)

2. if there's no project opened, they'll be prompted to save a new one (see `newProject` above).

3. if they have a project opened but there's nothing new to save, we'll let them know

4. *otherwise* if they have a project opened && there are unsaved changes to the current file, then we'll post the `{ owner, path, name, code }` to `./api/github/update-cache` to store those changes in the server session temporarily for the reasons explained at the top of this README file. This will also trigger a call to `WIDGETS['files-and-folders']_updateOpenFile(true)`

What `_updateOpenFile()` essentially does is:
  1. when triggered on save, it'll first update that file's `lastSavedCode` in the dictionary && then re-render the netitor
  2. update the title bar (to reflect it's save state)
  3. update the 'files-and-folders' view to label the html page currently being rendered

`_updateOpenFile()` not only runs after the user saves their project, but also:
- on `NNE.on('code-update')` (assuming Files-And-Folders has been instantiated)
- every time we run `WIDGETS['files-and-folders']._setupTreeView()` (assuming a `this._rendering` file has been set) this happens every call to `updateFiles()`
- every time we run `WIDGETS['files-and-folders'].updateDict()` (which happens every time a new commit is made)



TODO: ....staging + pushing....
