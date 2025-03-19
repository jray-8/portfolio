// #region Themes

// Reusable color palettes
const NIGHT_PURPLE = 	['rgba(92, 82, 116, 0.2)', 	'rgba(23, 20, 29, 0.7)'];
const DEEP_BLUE = 		['rgba(0, 59, 78, 0.3)', 		'rgba(5, 14, 17, 0.4)'];
const CLASSIC_BLUE = 	['rgba(36, 204, 255, 0.1)', 	'rgba(6, 27, 34, 0.7)'];
const SUNSET_RED = 		['rgba(184, 111, 96, 0.1)', 	'rgba(41, 12, 7, 0.4)'];
const SEA_GREEN = 		['rgba(18, 238, 220, 0.07)',	'rgba(1, 19, 18, 0.7)'];
const ASH = 			['rgba(255, 255, 255, 0.1)',	'rgba(31, 31, 31, 0.7)'];
const PYRAMID = 		['rgba(221, 193, 156, 0.25)',	'rgba(34, 29, 23, 0.7)'];
const SHADOW = 			['rgba(255, 255, 255, 0.05)',	'rgba(15, 15, 15, 0.4)'];
const PURPLE = 			['rgba(178, 121, 224, 0.2)',	'rgba(27, 18, 34, 0.7)'];
const CASTLE_BROWN = 	['rgba(231, 164, 151, 0.1)',	'rgba(36, 24, 22, 0.7)'];
const MAGENTA = 		['rgba(240, 143, 183, 0.1)',	'rgba(32, 18, 24, 0.7)'];
const SLATE_BLUE = 		['rgba(53, 104, 121, 0.2)',	'rgba(10, 25, 31, 0.7)'];
const SPACE_GREEN = 	['rgba(82, 189, 162, 0.15)',	'rgba(9, 20, 18, 0.7)'];


class Theme {
	/** @param {} bgUrl name of the background image inside the `assets/bg` folder */
	constructor(bgUrl, subprojectColorSet) {
		this.bgUrl = bgUrl; // Background image for the body
		this.subprojectColor = subprojectColorSet[0];
		this.selectedColor = subprojectColorSet[1];
	}

	/** Apply this theme to the page */
	apply() {
		// Override CSS with inline styles
		document.body.style.backgroundImage = `url('assets/bg/${this.bgUrl}')`;
		document.documentElement.style.setProperty('--subproject-bg', this.subprojectColor);
		document.documentElement.style.setProperty('--subproject-selected-bg', this.selectedColor);
	}

	/** Reset the theme to the CSS default */
	clear() {
		// Clear inline styles and let the CSS rules take precedence
		document.body.style.backgroundImage = '';
		document.documentElement.style.setProperty('--subproject-bg', '');
		document.documentElement.style.setProperty('--subproject-selected-bg', '');
	}
}

let themeIndex = 0;

const themes = [
	new Theme('checkered-space-2.jpg', 	NIGHT_PURPLE),
	new Theme('blue-checkered.jpg', 	DEEP_BLUE),
	new Theme('spirit-2.jpg', 			CLASSIC_BLUE),
	new Theme('pyramids-3.jpg', 		SUNSET_RED),
	new Theme('bw-3.jpg', 				NIGHT_PURPLE),
	new Theme('blue-space.jpg', 		SEA_GREEN),
	new Theme('bw.jpg', 				ASH),
	new Theme('pyramids.jpg', 			PYRAMID),
	new Theme('bw-4.jpg', 				SHADOW),
	new Theme('checkered-space.jpg', 	PURPLE),
	new Theme('pyramids-2.jpg', 		PYRAMID),
	new Theme('castle.jpg', 			NIGHT_PURPLE),
	new Theme('castle-2.jpg', 			CASTLE_BROWN),
	new Theme('checkered-space-3.jpg', 	MAGENTA),
	new Theme('bw-2.jpg', 				ASH),
	new Theme('portal.jpg',				SLATE_BLUE),
	new Theme('plains.jpg', 			MAGENTA),
	new Theme('gates.jpg', 				SEA_GREEN),
	new Theme('red-py.jpg', 			MAGENTA),
	new Theme('moon-desert.jpg', 		ASH),
	new Theme('gates-3.jpg', 			SUNSET_RED),
	new Theme('gates-5.jpg', 			SHADOW),
	new Theme('blue-py.jpg', 			CLASSIC_BLUE),
	new Theme('blue-py-2.jpg', 			SEA_GREEN),
	new Theme('moon-desert-2.jpg', 		ASH),
	new Theme('moon-desert-3.jpg', 		ASH),
	new Theme('golden-py.jpg', 			SUNSET_RED),
	new Theme('gates-2.jpg', 			NIGHT_PURPLE),
	new Theme('spirit.jpg', 			SPACE_GREEN),
	new Theme('green-ice-2.jpg', 		SPACE_GREEN),
	new Theme('green-ice.jpg', 			SHADOW),
	new Theme('glory.jpg', 				PYRAMID)
];

// Scroll through background themes using: Alt + Wheel
document.addEventListener('wheel', (event) => {
	if (event.altKey) {
		event.preventDefault();
		themeIndex = (themeIndex + (event.deltaY > 0 ? 1 : -1) + themes.length) % themes.length;
		console.log(themeIndex); //!
		themes[themeIndex].apply();
	}
}, { passive: false} );

// #endregion

document.addEventListener('DOMContentLoaded', function () {
	fetch('projects.json')
		.then(response => response.json())
		.then(projects => displayProjects(projects))
		.catch(error => { 
			console.error('Error loading projects:', error);
			showErrorMessage('Failed to load projects. Please check your connection.');
		});
});

function showErrorMessage(message) {
	const errorDiv = document.createElement('div');
	errorDiv.classList.add('error-box');
	const warningSign = '<i class="fas fa-triangle-exclamation"></i>';
	errorDiv.innerHTML = `${warningSign} &nbsp;<span>${message}</span>&nbsp; ${warningSign}`;

	const container = document.getElementById('projects-container');
	container.append(errorDiv);
}

function displayProjects(projectSpecs) {
	const container = document.getElementById('projects-container');

	// Add projects to DOM
	projectSpecs.forEach(spec => {
		const projectEl = createProjectElement(spec);
		container.appendChild(projectEl);
	});

	// Event listeners for selecting different projects
	setupNavigation();
}

/** Recursively create and return a new project or subproject div */
function createProjectElement(spec, isSubproject = false) {
	const projectEl = document.createElement('div');
	projectEl.classList.add(isSubproject ? 'subproject' : 'project'); // Differentiate nested projects

	// Generate title
	const preview = spec.links?.preview; // Check if preview link exists, undefined otherwise
	const titleContent = preview
		? `<a href="${preview}" target="_blank" class="project-title">${spec.name}</a>`
		: `<span class="project-title">${spec.name}</span>`;

	// Check for description
	const description = spec.description ? `<p>${spec.description}</p>` : '';

	// Check for image
	const imageContent = spec.image ? `<img src="${spec.image}" alt="${spec.name} image" class="project-image">` : '';

	// Generate icons
	const icons = generateIconLinks(spec.links);

	// Create the surface structure
	projectEl.innerHTML = `
		<div class="project-header">
			${titleContent}
			<div class="project-icons">
				${icons}
				<span class="arrow" tabindex="0"><i class="fas fa-chevron-right"></i></span>
			</div>
		</div>
		<div class="project-content">
			${description}
			${imageContent}
		</div>
	`;

	// Attach event listeners
	setupExpandCollapse(projectEl, spec.expanded);

	// Generate subproject elements
	if (spec.subprojects && spec.subprojects.length > 0) {
		const subprojects = generateSubprojects(spec.subprojects); // Div container
		const content = projectEl.querySelector('.project-content');
		content.appendChild(subprojects);
	}

	return projectEl;
}

/** Returns the div element for a list of subprojects under a project */
function generateSubprojects(subprojects) {
	const subprojectsContainer = document.createElement('div');
	subprojectsContainer.classList.add('subprojects-container');

	// Recursively create new subprojects
	subprojects.forEach(spec => {
		const subProjectEl = createProjectElement(spec, true);
		subprojectsContainer.appendChild(subProjectEl);
	});

	return subprojectsContainer;
}

function generateIconLinks(links) {
	if (!links) return;
	const icons = {
		'live': 'fas fa-globe', 					// Website hosted on GitHub Pages
		'github': 'fab fa-github', 					// Link to GitHub repo
		'nbviewer': 'fal fa-chart-bar', 			// Host static Jupyter notebooks (through nbviewer)
		'binder': 'fal fa-book', 					// Host interactive Jupyter notebooks (through Binder)
		'download': 'fal fa-arrow-down-to-line', 	// Local download
		'youtube': 'fab fa-youtube' 				// YouTube video demo
	};

	return Object.keys(links).map(key =>
		`<a href="${links[key]}" target="_blank"><i class="${icons[key]}"></i></a>`
	).join('\n');
}



// #region Project Listeners 
let projects = null;
let selectedIndex = -1; // Active project or subproject. (-1 marks no selection)

/** Change the `.selected` project based on index */
function updateSelection(newIndex, scroll = false) {
	if (!projects) return;
	if (selectedIndex >= 0) {
		projects[selectedIndex].classList.remove('selected');
	}
	selectedIndex = newIndex ?? -1;
	if (selectedIndex >= 0) {
		projects[selectedIndex].classList.add('selected');
		if (scroll) { // Move this project to the top of the scrollable region
			projects[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
}

/** Show or hide content region */
function toggleExpand(projectEl) {
	const isExpanded = projectEl.classList.toggle('expanded');
	const content = projectEl.querySelector('.project-content');
	content.style.display = isExpanded ? 'block' : 'none';
}

/** Add event listeners for expanding/collapsing a project's content area */
function setupExpandCollapse(projectEl, startExpanded = false) {
	const header = projectEl.querySelector('.project-header');

	// If the content should be open initially, change states immediately
	if (startExpanded) {
		toggleExpand(projectEl);
	}

	// Click anywhere on header *except links* to expand
	header.addEventListener('click', (event) => {
		if (!event.target.closest('a')) {
			toggleExpand(projectEl);
		}
	});

	// Enter key when project div is focused
	projectEl.addEventListener('keydown', (event) => {
		if (event.code === 'Enter') {
			toggleExpand(projectEl);
			event.stopPropagation(); // Do not collapse parent projects, ignore selectedIndex enter press

			// Select the expanded project
			const index = projects?.indexOf(projectEl);
			updateSelection(index, true);
		}
	});
}

/** Add document listener for selecting project on mouse hover */
function setupMouseSelection() {
	document.addEventListener('mousemove', (event) => {
		const projectEl = event.target.closest('.project, .subproject');
		const index = projects.indexOf(projectEl);
		if (selectedIndex !== index) updateSelection(index);
	});
}

/** Add document listener for selecting project on arrow keydown */
function setupKeydownSelection() {
	const keysPressed = {}; // Track held keys

	document.addEventListener('keydown', (event) => {
		if (keysPressed[event.code]) return; // Prevent spam
		keysPressed[event.code] = true;

		// console.log('cockfiddle', event.target);

		if (event.code === 'ArrowUp') {
			let i = selectedIndex < 0 ? 0 : selectedIndex - 1;
			while (i >= 0 && projects[i].offsetParent === null) {
				--i; // Skip hidden projects
			}
			// Select project
			if (i >= 0) updateSelection(i, true);
			event.preventDefault();
		}

		else if (event.code === 'ArrowDown') {
			let i = selectedIndex + 1;
			while (i < projects.length && projects[i].offsetParent === null) {
				++i; // Skip hidden
			}
			if (i < projects.length) updateSelection(i, true);
			event.preventDefault();
		}

		// Expand/collapse content
		else if (event.code === 'Enter' && selectedIndex >= 0) {
			toggleExpand(projects[selectedIndex]);
			event.preventDefault();
		}

		// Deselect
		else if (event.code === 'Escape') {
			if (document.activeElement === document.body) updateSelection(-1);
			else event.target.blur(); // Deselect links
		}
	});

	document.addEventListener('keyup', (event) => {
		keysPressed[event.code] = false;
	});
}

/** Add project selection by arrow keys or mouse hover */
function setupNavigation() {
	// Get access to all projects in DOM (in depth-first order)
	projects = Array.from(document.querySelectorAll('.project, .subproject'));
	setupKeydownSelection();
	setupMouseSelection();
}
// #endregion
