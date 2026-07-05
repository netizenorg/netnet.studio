# netnet's Dialogue System

In the interest of keeping things modular and avoiding conflicts between folks fixing grammar/spelling in the dialogue system and those working on the rest of the code, most dialogue related files are kept separate from the parts of the code that actually invoke the dialogue bubbles. **Most** of the general dialogue, as well as dialogue related to any of the Widgets, can be found in the [www/convos/](https://github.com/netizenorg/netnet.studio/tree/dev/www/convos) folder (this will also make it easier for us to add "localization", if/when we get contributions who can translate netnet's dialogue into other languages).

- [Creating New Dialogue (the convo object)](#convo)
- [Creating New Dialogue (for a widget)](#widget)
- [Modifying the Dialogue System](#core)

## <a id="convo"></a>Creating New Dialogue (the convo object)

As mentioned above, a **convo** (like those found in the [www/convos/](https://github.com/netizenorg/netnet.studio/tree/dev/www/convos) folders) is a function that returns an array of **convo objects**, a convo object can take any number of the following properties, but the only one that's required is the `content` property used to specify the string of text which should appear in netnet's text bubble, the rest are optional.

```js
{
  id: 'object-name',
  before: () => { /* some function */ },
  after: () => { /* some function  */ },
  code: 'code which should show up in the editor at this time',
  edit: true, // whether the editor should be editable
  highlight: 30, // line of code to highlight
  spotlight: 30, // line of code to highlight
  layout: 'dock-left', // netnet's desired layout/orientation
  content: 'The string you want to display inside the text bubble',
  options: {
    'first option': (e, t) => e.goTo('next-convo-object'),
    'another option': (e, t) => e.goTo('another-convo-object')
  }
}
```

**content**: The string of text which will appear inside netnet's text bubble

**options**: These are the clickable buttons that show up below the text bubble. The options property should always be an object which contains one property per button you want accompanying that text bubble. The property name should be the string you want appearing in the button, and the value should be the function you want to run when the button is clicked. The callback functions are passed two arguments: `t` is a reference to the text bubble itself, and can be used to interact with it, for example if your content looked like `'type your name here: <input>'`, you could access the value of the input element when the option is clicked by including `t.$('input').value` in your callback function. `e` is an object that gives you acces to the Convo systems methods, these include:
  - `e.next()`: jump to the next convo object in the convo array
  - `e.prev()`: jump to the previous convo object in the convo array
  - `e.hide()`: make the text bubble disappear
  - `e.goTo(id)`: jump to the convo object with the specified id

If no options property is declared then a default "ok" option will be generated which runs the `e.hide()` when clicked. If for whatever reason you want to create a text bubble that has no options displayed then pass an empty object to the options property, like this: `options: {}`

**id**: If you're creating a linear conversation, where each convo object is meant to follow the next, you don't really need any ids, because you can simply use `e.next()` and/or `e.prev()` to progress through the conversation. However, if you want to create non-linear conversations using `e.goTo()` to specify a particular convo object in the array you want to switch to, then the convo object needs to have an id string so you can specify which object to "goTo".

**before** and **after**: Occasionally you want might to trigger some logic just before the text bubble appears (opening a widget for example, or changing a widget's position), for that we have the *before* hook. Similarly, you can write some logic to fire just after the text bubble appears with the *after* hook.

**code**: This can be used to replace whatever code is currently in netnet's editor at the time this particular convo object appears. You could of course also use the *before* hook to do this by including a `NNE.code = 'new code'` statement in the hook's function.

**edit**: Setting this to `false` will make netent's editor "read only" (not editable), setting it to `true` will make it editable (which is the default).

**highlight** and **spotlight**: These are used to highlight and spotlight code in netnet's editor. These are alias for the netitors `NNE.highlight()` and `NNE.spotlight()` methods. Refer to the [netitor](https://github.com/netizenorg/netitor#methods) docs for more on how these can be used.

**layout**: This changes netnet's layout the moment that the text bubble appears, available options are: "welcome", "separate-window", "dock-left", "full-screen", "dock-bottom".

#### testing your convo object

The quickest way to test a convo object is using the browsers web console and entering in a `new Convo({/* your convo object */})`, for example, try copy+pasting the following into the developer console:

```js
new Convo({
  content: 'hello world wide web!'
})
```

## <a id="widget"></a>Creating New Dialogue (for a widget)

Though the dialogue system can be triggered directly by instantiating a `new Convo` object, rather than declaring these inside your widget's code, it's best to separate these objects out into a separate **convo** file, in the [www/convos/](https://github.com/netizenorg/netnet.studio/tree/dev/www/convos) folder. The process is as follows:

**0. create a new convo directory for your widget**: create a new folder in the [www/convos/](https://github.com/netizenorg/netnet.studio/tree/dev/www/convos) folder with a name that matches your widget's key value. For example if your widget has a `this.key = 'cool-widget'`, then your folder should be called "cool-widget".

**1. create a new convo file for your widget**: inside the new folder create a file called `index.js` which looks like:
```js
window.CONVOS['cool-widget'] = (self) => {
  // local variables used by convo objects here
  const example = 'of a local variable'

  // return the actual array of conversation objects you want
  return [{
    content: 'Hello!',
    options: {
      hi: (e) => e.goTo('good-bye')
    }
  }, {
    id: 'good-bye',
    content: 'Good Bye!',
    options: {
      'bye bye': (e) => e.hide()
    }
  }]
}
```

The `self` variable gives you access to your corresponding widget, which is useful if, for example, you want to trigger different methods within your widget in the conversation (for example when an option is clicked or withing a *before* or *after* hook).

At this point you could test to make sure your convo is working by running something like this in the browser's dev console:
```js
Convo.load('cool-widget', () => {
  const convoArray = window.CONVOS['cool-widget']()
  const convoInstance = new Convo(convoArray)
  console.log(convoInstance)
})
```
(assuming the name of the folder you created was "cool-widget")

**3. instantiate the convo object in your widget**: If everything seems to be working right after testing your convo in the dev console, the next step is to include the following snippet inside your widget's constructor.

```js
Convo.load(this.key, () => { this.convos = window.CONVOS[this.key](this) })
```

It's important to note that because this is being loaded in the constructor, any variables declared or content strings created that include variables in them, will be defined at that time. If a variable being used/referenced in a convo object changes later on, that change won't be reflected in the convo objects. However, you can recreate that convo at anytime by calling `this.convos = window.CONVOS[this.key](this)` at any point inside your widget.

**4. triggering dialogue**: If you've created a new convo file and loaded it up in your widget's constructor, the assumption is you've got some set of convo objects you want to trigger at different points in your widget. For example, maybe there's a method in your widget that fires when the user interacts with it in a certain way and you want to generate a dialogue text bubble to provide some feedback at that point, you simply call...
```js
window.convo = new Convo(this.convos, 'convo-object-id')
```
...where the 'convo-object-id' is the id of the convo object (from your convo file) that you want to trigger at that point. One common example might be triggering a dialogue the moment your widget is opened, to do this you can add something like this to your widget's constructor:

```js
this.on('open', () => {
  window.convo = new Convo(this.convos, 'cool-widget-welcome')
})
```

## <a id="core"></a>Modifying the Dialogue System

If you're trying to edit some aspect of netnet's core dialogue system itself, the code for this is contained in two different files.

- **[www/js/Convo.js](https://github.com/netizenorg/netnet.studio/blob/dev/www/js/Convo.js)**: This is the Convo class used to load conversations and generate `new Convo`s. It contains all the logic related to the dialogue system.

- **[www/js/custom-elements/text-bubble](https://github.com/netizenorg/netnet.studio/blob/dev/www/js/custom-elements/text-bubble)**: This is the actual text-bubble, which is a [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). If you want to change anything about the "view" (ie. the display, the way the actual text bubble looks or behaves) you can find all that code here.
