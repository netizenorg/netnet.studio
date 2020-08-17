window.TUTORIAL = {
  widgets: {
    'color wheel': new Widget({
      title: 'color wheel',
      content: `<img src="https://cdn.sparkfun.com/assets/learn_tutorials/7/1/0/TertiaryColorWheel_Chart.png" alt="color wheel" style="width: 400px">`
    })
  },
  steps: [
    {
      content: 'Take a look at this line of code, notice anything?',
      highlight: 10
    },
    {
      content: 'We\'ve changed the way we\'re defining colors.'
    },
    {
      content: 'There are even more ways to specify colors in CSS.',
      options: {
        'launch color widget': () => {
          STORE.dispatch('OPEN_WIDGET', 'color wheel')
        },
        'cool, i\'ll experiment': (e) => e.hide()
      }
    }
  ]
}
