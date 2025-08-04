const findActive = () => {
  let currentPage = location.pathname;
  console.log(currentPage);

  let navLinks = document.querySelectorAll('.docs__panel__list-item > a')
  navLinks.forEach((link) => {
    console.log(link.pathname == currentPage);
    if (link.pathname == currentPage) {
      link.classList.add('active');
    }
  })
}

window.addEventListener('load', () => {
  findActive();
});
