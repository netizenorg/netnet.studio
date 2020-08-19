/* global Widget */
window.TUTORIAL = {
  widgets: {
    'color wheel': new Widget({
      title: 'color wheel',
      innerHTML: '<img src="https://cdn.sparkfun.com/assets/learn_tutorials/7/1/0/TertiaryColorWheel_Chart.png" alt="color wheel" style="width: 400px">'
    })
  },
  steps: [
    {
      content: 'this is the first thing i want to tell you'
    },
    {
      content: 'this is the second thing i want to tell you'
    },
    {
      content: 'now you have a couple of options for where to go next',
      options: {
        'let\'s see the widget': (e) => e.open('color wheel'),
        'jump to the fifth thing': (e) => e.goTo('the jump'),
        'proceed to the next/fourth thing': (e) => e.goTo('contd')
      }
    },
    {
      id: 'contd',
      content: 'this is the fourth thing'
    },
    {
      id: 'the jump',
      content: 'this is the fifth thing'
    },
    {
      content: 'there\'s one more thing, or we call it quits now?',
      options: {
        'call it quits': (e) => e.end(),
        'let\'s see the last thing': (e) => e.next()
      }
    },
    {
      content: 'the end'
    }
  ]
}
