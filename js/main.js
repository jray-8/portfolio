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
	// Check if preview link exists
	const titleContent = spec.preview
		? `<a href="${spec.preview}" target="_blank" class="project-title">${spec.name}</a>`
		: `<span class="project-title">${spec.name}</span>`;

	// Check for description
	const description = spec.description
		? spec.description.split('\n').map(para => `<p>${para}</p>`).join('')
		: '';

	// Check for image
	const imageContent = spec.image ? `<img src="${spec.image}" alt="${spec.name} image" class="project-image">` : '';

	// Generate icons
	const icons = generateIconLinks(spec.links);

	// Create the project structure
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
	if (!links) return '';
	const icons = {
		'live': 'fas fa-globe', 					// Website hosted on GitHub Pages
		'github': 'fab fa-github', 					// Link to GitHub repo
		'nbviewer': 'fal fa-chart-bar', 			// Host static Jupyter notebooks (through nbviewer)
		'binder': 'fal fa-book', 					// Host interactive Jupyter notebooks (through Binder)
		'download': 'fal fa-arrow-down-to-line', 	// Local download
		'youtube': 'fab fa-youtube', 				// YouTube video demo
		'git-clone': 'fal fa-clone' 				// Copy git clone command
	};

	return Object.keys(links).map(key => {
		if (key === 'git-clone') {
			return `<span class="clone-icon" data-text="${links[key]}" tabindex="0">
						<i class="${icons[key]}"></i>
					</span>`;
		}
		// Anchor tag
		return `<a href="${links[key]}" target="_blank"><i class="${icons[key]}"></i></a>`;
	}).join('\n');
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
	const arrow = projectEl.querySelector('.arrow');

	// If the content should be open initially, change states immediately
	if (startExpanded) {
		toggleExpand(projectEl);
	}

	// Click anywhere on header *except non-arrow icons* to expand
	header.addEventListener('click', (event) => {
		if (event.target.closest('.arrow')) toggleExpand(projectEl);
		else if (!event.target.closest('.project-icons, a')) toggleExpand(projectEl);
	});

	// Enter key when the arrow icon is focused
	arrow.addEventListener('keydown', (event) => {
		if (keysPressed[event.code]) return; // Prevent spam

		if (event.code === 'Enter') {
			toggleExpand(projectEl);

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
	document.addEventListener('keydown', (event) => {
		if (keysPressed[event.code]) return; // Prevent spam

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
			// Only expand if no link or icon has focus
			if (document.activeElement === document.body) toggleExpand(projects[selectedIndex]);
		}

		// Deselect
		else if (event.code === 'Escape') {
			// No element has focus
			if (document.activeElement === document.body) updateSelection(-1);
			else event.target.blur(); // Deselect links
		}
	});
}

function setupCloneButton() {
	document.addEventListener('click', (event) => {
		const cloneIcon = event.target.closest('.clone-icon');
		if (cloneIcon) copyToClipboard(cloneIcon);
	});

	document.addEventListener('keydown', (event) => {
		if (keysPressed[event.code]) return; // Prevent spam

		if (event.code === 'Enter') {
			const cloneIcon = event.target.closest('.clone-icon');
			if (cloneIcon) copyToClipboard(cloneIcon);
		}
	})
}

function copyToClipboard(cloneIcon) {
	const repoUrl = cloneIcon.getAttribute('data-text');
	if (!repoUrl) return console.error('Missing data-text attribute for clone command.');

	const command = `git clone ${repoUrl}`;
	navigator.clipboard.writeText(command)
		.then(() => {
			const icon = cloneIcon.querySelector('i');

			// Store original properties
			if (!cloneIcon._originalClass) {
				cloneIcon._originalClass = icon.className;
				cloneIcon._originalTitle = cloneIcon.getAttribute('title') || '';
			}

			// Indicate command was copied
			icon.className = 'fal fa-check-circle';
			cloneIcon.setAttribute('title', 'Copied!');
			cloneIcon.style.color = 'limegreen';

			// Clear previous timeout, and restart timer
			clearTimeout(cloneIcon.timerID);

			// Revert after delay
			cloneIcon.timerID = setTimeout(() => {
				icon.className = cloneIcon._originalClass;
				cloneIcon.setAttribute('title', cloneIcon._originalTitle);
				cloneIcon.style.color = ''; // Reset color
			}, 1500);
		})
		.catch(err => console.error('Failed to copy text:', err));
}

/** Add an event listener to un-focus elements clicked with the mouse */
function preventClickFocus() {
	document.addEventListener('mouseup', () => document.activeElement.blur());
}

const keysPressed = {}; // Track held keys

/** Prevent keydown spam by tracking which keys (code) are already pressed */
function trackKeysPressed() {
	document.addEventListener('keydown', (event) => {
		keysPressed[event.code] = true;
	});

	document.addEventListener('keyup', (event) => {
		keysPressed[event.code] = false;
	});
}

/** 
 * - Add project selection by arrow keys or mouse hover 
 * - Detect click to clone icons
*/
function setupNavigation() {
	// Get access to all projects in DOM (in depth-first order)
	projects = Array.from(document.querySelectorAll('.project, .subproject'));
	setupKeydownSelection();
	setupMouseSelection();
	setupCloneButton();
	preventClickFocus();
	trackKeysPressed();
}
// #endregion
