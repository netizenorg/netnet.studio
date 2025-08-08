/* global utils, Fuse */

const findActive = () => {
  let currentPage = location.pathname
  console.log(currentPage)

  let navLinks = document.querySelectorAll('.docs__panel__list-item > a')
  navLinks.forEach((link) => {
    console.log(link.pathname == currentPage)
    if (link.pathname == currentPage) {
      link.classList.add('active')
    }
  })
}

window.addEventListener('load', () => {
  findActive()
});


const initButton = document.querySelector('#search-btn')
const searchWrapper = document.querySelector('.docs__panel__search')
const searchBar = document.querySelector('#search-bar')
const navItems = document.querySelectorAll('.docs__panel > .docs__panel__list > li')
let navArray = [];
let children = []

navItems.forEach(navItem => {
  navItem.querySelectorAll('li').forEach(child => {
    children.push({
      'text': child.textContent,
      'el': child
    })
  })

  const navItemObj = {
      'parent': {
        'text': navItem.querySelector('a').textContent.trim(),
        'el': navItem.querySelector('a'),
      },
      children
  };
  navArray.push(navItemObj);
});

console.log(navArray)

const searchOpts = {
	keys: [
    'parent.text',
    'children.text'
	]
};

const fuse = new Fuse(navArray, searchOpts)

searchBar.addEventListener('keydown', (e) => {
  let searchResult = fuse.search(searchBar.value);

  filterNav(searchResult)
})

const filterNav = (result) => {
  result.forEach(res => {
    console.log(res.item.parent)
    console.log(res.item.children)
  })
}
