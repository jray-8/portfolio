document.addEventListener('DOMContentLoaded', function () {
	fetch('projects.json')
		.then(response => response.json())
		.then(projects => displayProjects(projects))
		.catch(error => console.error('Error loading projects:', error));
});

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
	subprojectsContainer.classList.add('subprojects');

	// Recursively create new subprojects
	subprojects.forEach(spec => {
		const subProjectEl = createProjectElement(spec, true);
		subprojectsContainer.appendChild(subProjectEl);
	});

	return subprojectsContainer;
}

function generateIconLinks(links) {
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
		if (scroll) { // Make project centered within scrollable region
			projects[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	}
}

/** Show or hide content region */
function toggleExpand(projectEl) {
	const isExpanded = projectEl.classList.toggle('expanded');
	const content = projectEl.querySelector('.project-content');
	content.style.display = isExpanded ? 'block' : 'none';
}

/**  Add event listeners for expanding/collapsing a project's content area */
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
