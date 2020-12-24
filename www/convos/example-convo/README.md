This convo is meant to test the Conversation system. If/when we edit or add new functionality to `www/js/Convo.js` we should test it by adding to this example's `index.js`.

To run the test, navigate to netnet in your browser, open the dev console and run `utils.testConvo()`, which is the equivalent of copy+paste the following:

```js
Convo.load('example-convo', () => {
  const convoArray = window.CONVOS['example-convo']()
  const convoInstance = new Convo(convoArray)
  console.log(convoInstance)
})
```


Here's a convo template:

```js
window.CONVOS['THIS-NAME-SHOULD-MATCH-ITS-FOLDER'] = (self) => {
  // LOCAL VARIABLES HERE
  const example = 'of a local variable'
  console.log('example', example)

  // return the actual array of conversation objects
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
