function tenPrint () {
  document.body.innerText = ''
  for (let i = 0; i < 600; i++) {
    if (Math.random() > 0.5) {
      document.body.innerText += '／'
    } else {
      document.body.innerText += '＼'
    }
  }
}

window.addEventListener('load', tenPrint)
