# Dear Contributors,

If you want to donate some time to helping improve netnet.studio, whether that be something large or small, then these are the docs for you!

<div class="warning">
⚠️ <b>UNDER CONSTRUCTION</b> ⚠️
<br>
these docs are still in progress, if you can't find what you're looking for, or something seems out of date, please <a href="https://netent.studio/docs/contributors/bug-report.html" target="_blank">open an issue</a> (or feel free to fix it yourself! See "The Docs" section below)
</div>
<br><br>  

Contributing to open source can feel intimidating, even for experienced developers. netnet.studio’s docs break it down into manageable steps, starting with small changes (like correcting a type-o) and gradually moving into more complex contributions (like creating your own widget). Each stage guides you through our codebase and the wider open source contribution process on GitHub.

- **If this is your first time contributing to an open source project** you'll need to start by [creating a GitHub account](https://github.com/signup), if you've already got one make sure you're [logged in](https://github.com/login) before staring section 1 below.
- **If you're a seasoned open source contributor** and want to dive right in check out our [contributor workflow doc](contributor-workflow.md) and then review our [project architecture](project-architecture.md) docs for a general orientation of the project architecture.

### 0. [Bug Reports](bug-report.md)

If you came across a bug or some sort of issue you think we should know about please tell us about it! We just ask that you file an issue following the format explained at the link above.

### 1. [The Docs](the-docs.md)

netnet is constantly changing, which means our docs always need lots of editing to keep up! Making an edit to these docs is something you can do entirely on GitHub and is a great way to get familiar with the basics of contributing to an open source project.

### 2. [Convos and Passages](editing-convos.md)

Central to netnet's "hypermedia" navigation system are the conversation passages that appear in netnet's speech bubbles. In these docs we'll explain how this system works as well as how to use netnet's "Convo Maker Widget" to either edit a passage in an existing conversation file or create your own.

### 3. [Code Demos](code-demos.md)

Anyone can create and share "sketches" (single file web sites) in netnet by writing some code in netnet's editor and then saving it (either as a sharable URL or downloadable html file). These sketches can also become "demos", with annotations explaining how different parts of the code works, and added to netnet's "Code Demos" widget.

### 4. [Interactive Tutorials](tutorial-maker.md)

One of netnet.studio's most dynamic educational components are the interactive tutorials, like this [Orientation Tutorial](https://dev.netnet.studio/?tutorial=orientation) made by Nick Briz for example. You can create your own interactive tutorials using our "Tutorial Maker" widget.

### 5. [Widgets](widgets.md)

The vast majority of netnet's features exist in "widgets", these are the moveable windows that pop up to do all the various things artists can do in netnet beyond coding.

### 6. [Core Components & Architecture](project-architecture.md)

Underneath all the convos, demos, tutorials and widgets are netnet's "core" components, the foundational code controlling how netnet looks and how it functions. This part of our system doesn't change often, but if you notice any bugs or have ideas for some fundamental improvements, these are the docs for you. These are the most complex contributions, so it would be wise to have gone through some of the steps above before diving into the depths of netnet's codebase.

- [Project Architecture](project-architecture.md)
- [CSS Styleguide](css-styleguide.md)
- [Dialogue System](dialogue-system.md)

**other misc notes**
- [netent's face](netnet-faces.md)
- [Anatomy of a netnet URL](../educators/url-anatomy.md)
- [LLM Integration](../students/ai-integration.md)

# Sub-Modules

netnet.studio contains a couple of "sub-modules", these are other repositories which make up part of netnet's code base but can also be used independently on other projects (which is why they're separated into their own repos), below you'll find docs for working on these.


### the netnet-standard-library

The **nn** object sprinkled throughout netnet's code base, also known as the [netnet-standard-library](https://github.com/netizenorg/netnet-standard-library), or **nn.min.js** for short, is a browser based JavaScript library designed to aid creative coders (artists, designers, etc). It's a core utility library used within netnet.studio; both in the sense that it can be used to create projects and sketches in netnet, but also that it's used to create netet.studio itself. You can find [contributor info here](https://github.com/netizenorg/netnet-standard-library#contributions).

### the netitor

The [netitor](https://github.com/netizenorg/netitor) is the core code editor used in netnet.studio. What makes the netitor unique to other code editors is that it's made specifically for beginners learning/experimenting with web code (HTML, SVG, CSS and JavaScript). For this reason (in addition to the usual code editor features like syntax highlighting and code hinting) it has some extra features designed to help beginners like friendly error messages and built-in edu info (you can double click on any piece of code in the editor to learn more about it). As an online + realtime editor it's purpose is not so much to replace professional code editors used to create larger projects, but rather quickly experiment, demonstrate concepts and share ideas.

1. [README](https://github.com/netizenorg/netitor): a general introduction to the library
2. [contributor notes](https://github.com/netizenorg/netitor/wiki/Development-Notes): here you'll find the general process/notes for contributors
3. [creating color themes](https://github.com/netizenorg/netitor/wiki/Creating-Custom-Themes): we've got a theme-editor you can use to create new syntax highlighting themes. This is also where netnet derives it's color scheme from.
4. [editing edu data](https://github.com/netizenorg/netitor/wiki/Editing-Edu-Data-Copy): anytime you double click on a piece of code in the netitor netnet can explain it to you, all those explinations are stored in json files in this repo. We have a copy-editor you can use to more easily edit these JSON files, it include AI integration to help jump-start your writing, but keep in mind you should **NEVER USE AI GENERATED LANGUAGE** in a netnet passage. The AI integration is used as an optional starting point (it will generate 3 different starting points by default). Just as with netnet's code, while generative AI can be used as a starting point and/or to get over certain hurdles/blocks, everything netent says or does (ie. the logic) must be understood and evaluated by a human being.
