window.TUTORIAL = {
  steps: [
    {
      id: 'begin',
      code: '<!DOCTYPE html>',
      edit: false, // prevent user from editing code until end of content Array
      content: 'Would you like to experiment a bit more?',
      options: {
        'yes please': (e) => { e.goTo('more-experimenting') },
        'naw, i\'m good': (e) => { e.goTo('finished') }
      }
    },
    {
      id: 'more-experimenting',
      content: 'Ok great, dont\'t forget about the helpful widgets!',
      options: {
        'open color widget': () => { window.alert('widget') },
        'open other widget': () => { window.alert() },
        'ok, i\'m done': (e) => { e.goTo('finished') }
      }
    },
    {
      id: 'finished',
      content: 'Great! Nick want\'s to tell u something',
      options: {
        'ok, what?': (e) => { e.goTo('nick') }
      }
    }
  ]
}
