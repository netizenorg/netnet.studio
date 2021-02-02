## Tests

To test the Convo system, open the dev console and run `utils.testConvo()` or `utils.testConvo('name-of-convo')`

To test the Widget system, open the dev console and run `utils.testWidget()` or some variation on the following...

```js
utils.testWidget({
  key: 'my-test-widget',       // must be unique
  title: 'netnet widget',      // for widget title bar
  innerHTML: '<p>oh hi!</p>',  // html string or HTMLElement
  closable: true,              // allow user to close the widget
  resizable: true,             // allow user to resize the widget
  listed: true,                // should widget be listed in search results
  left: 20,                    // defaults to center of page
  top: 20,                     // defaults to center of page
  zIndex: 100,                 // defaults to center of page
  width: 500,                  // defaults to width of content, or min of 200
  height: 500                  // defaults to height of content, or min of 150
})
```
