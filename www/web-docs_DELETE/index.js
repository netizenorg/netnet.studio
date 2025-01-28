// global var
var panel = document.querySelector('.docs__panel');
var viewer = document.querySelector('.docs__viewer');

// setup and size calculations
function sizeCalcs() {
	// define side navigation panel
	// get its width
	var panelWidth = panel.offsetWidth;

	// determine viewers width
	viewer.style.width = "calc(100vw - " + panelWidth + "px - (var(--doc-padding) * 3))";
}

// empty function
function emptyViewer() {
	// include check in url for preloaded content--
	// this will probably also depend on how .md data is loaded in...

	// if nothing, add class:
	viewer.classList.add('docs__viewer--empty')

	// and include:
	var emptyViewer = document.createElement('div');
	var p = document.createElement('p');
	p.innerHTML = "_φ(◕ ◞ ◕ ) under construction";
	emptyViewer.append(p);
	viewer.append(emptyViewer)
}

// load function
function load() {
	sizeCalcs();
	emptyViewer();
}

// event listeners
window.addEventListener('load', load)

window.addEventListener("resize", function(e) {
	sizeCalcs();
});
