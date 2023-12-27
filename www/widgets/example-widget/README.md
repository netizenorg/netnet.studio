# Example Widget

the files in this folder can be used to get a general overview and template for creating your own widget. Start by taking a look at the `index.js` file and reading through all the comments. If you'd like to see this widget in action you can open up the web console in netnet.studio and run the following command:

```js
WIDGETS.open('example-widget') 
```

The `styles.css` and `convo.js` files are both optional. The example `convo.js` file is fairly complex as it's also used to test the conversation system. A much simpler convo.js might look like this:

```js
window.CONVOS['THIS-NAME-SHOULD-MATCH-ITS-FOLDER'] = (self) => {
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

As noted in the comments within the `index.js` file, you can also include an optional `index.html` rather than writing your markup as a template literal within the `index.js` file. Refer to the `privacy-policy` widget for an example.