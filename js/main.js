document.addEventListener('DOMContentLoaded', function () {
	fetch('projects.json')
		.then(response => response.json())
		.then(projects => displayProjects(projects))
		.catch(error => { 
			console.error('Error loading projects:', error);
			showErrorMessage('Failed to load projects. Please check your connection.');
		});
});

/** Clear the `#projects-container` and insert an error message box */
function showErrorMessage(message) {
	const warningSign = '<i class="fas fa-triangle-exclamation"></i>';
	const errorDiv = `<div class="error-box">
						${warningSign} &nbsp;<span>${message}</span>&nbsp; ${warningSign}</i>
					</div>`;
	const container = document.getElementById('projects-container');
	container.innerHTML = errorDiv;
}

function displayProjects(projectSpecs) {
	const container = document.getElementById('projects-container');

	try {
		// Add projects to DOM
		projectSpecs.forEach(spec => {
			const projectEl = createProjectElement(spec);
			container.appendChild(projectEl);
		});
	}
	catch (error) {
		console.error('Error building projects:', error);
		showErrorMessage('Failed to display projects. Please try again later.');
	}

	// Event listeners for selecting different projects
	setupNavigation();
	setupTooltips();
}

/** Generate the HTML for a project's description (from JSON file) 
 * 
 * - `\n` becomes a new paragraph `<p>`
 * - `\n-` becomes a new bullet in an `<ul>`
*/
function descriptionToHTML(raw) {
	if (!raw) return '';

	const lines = raw.split('\n');
	let html = '';
	let inList = false;

	for (let i=0; i < lines.length; ++i) {
		const line = lines[i].trim();

		if (line.startsWith('-')) { // Bullet
			// Start new list
			if (!inList) {
				html += '<ul>';
				inList = true;
			}
			html += `<li>${line.slice(1).trim()}</li>`;
		}
		else { // Paragraph
			// End current list
			if (inList) {
				html += '</ul>';
				inList = false;
			}
			if (line) html += `<p>${line}</p>`;
		}
	}
	// Ends with list
	if (inList) html += '</ul>';
	return html;
}

/** Recursively create and return a new project or subproject div */
function createProjectElement(spec, isSubproject = false) {
	const projectEl = document.createElement('div');
	projectEl.classList.add(isSubproject ? 'subproject' : 'project'); // Differentiate nested projects

	// Generate title
	// Check if preview link exists
	const titleHTML = spec.preview
		? `<a href="${spec.preview}" target="_blank" class="tooltip" data-tooltip="Preview project">${spec.name}</a>`
		: `<span>${spec.name}</span>`;

	// Check for description
	const description = descriptionToHTML(spec.description);

	// Check for image
	const imageHTML = spec.image ? `<img src="${spec.image}" alt="${spec.name} image" class="project-image">` : '';

	// Generate icons
	const links = generateIconLinks(spec.links);
	const techStackIcons = generateTechStack(spec.techStack);

	// Group content
	const hasContent = spec.description || spec.image;
	
	const contentHTML = hasContent  
		? `<div class="project-content">
				${description}
				${imageHTML}
			</div>`
		: '';

	// Create the project structure
	projectEl.innerHTML = `
		<div class="project-header">
			<div class="project-title">
				${titleHTML}
				${techStackIcons}
			</div>
			<div class="project-icons">
				${links}
				${hasContent ? '<span class="arrow" tabindex="0"><i class="fas fa-chevron-right"></i></span>' : ''}
			</div>
		</div>
		${contentHTML}
	`;

	// Attach event listeners
	if (hasContent) {
		setupExpandCollapse(projectEl, spec.expanded);
	}

	// Generate subproject elements
	if (spec.subprojects && spec.subprojects.length > 0) {
		const content = projectEl.querySelector('.project-content');
		if (content) {
			const subprojects = generateSubprojects(spec.subprojects); // Div container
			content.appendChild(subprojects);
		}
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

/** Store icon types from Font Awesome */
const linkIcons = {
	'live': 		{ className: 'fas fa-globe', 				title: 'Website hosted on GitHub Pages' },
	'github':		{ className: 'fab fa-github', 				title: 'Link to GitHub repo' },
	'gitClone': 	{ className: 'fal fa-clone', 				title: 'Copy git clone command' },
	'nbviewer': 	{ className: 'fal fa-chart-bar', 			title: 'Static Jupyter notebook (nbviewer)' },
	'binder': 		{ className: 'fal fa-book', 				title: 'Interactive Jupyter notebook (Binder)' },
	'download': 	{ className: 'fal fa-arrow-down-to-line', 	title: 'Local download (DownGit)' },
	'youtube': 		{ className: 'fab fa-youtube', 				title: 'YouTube videw demo' }
};

function generateIconLinks(links) {
	if (!links) return '';

	return Object.keys(links).map(key => {
		const icon = linkIcons[key];
		if (!icon) { // Skip if icon not found
			console.error(`Link icon key not found: ${key}`);
			return '';
		}

		const iconHTML = `<i class="${icon.className}"></i>`;

		if (key === 'gitClone') {
			return `<span class="clone-icon tooltip" data-tooltip="${icon.title}" data-text="${links[key]}" tabindex="0">
						${iconHTML}
					</span>`;
		}
		// Any links
		return `<a href="${links[key]}" target="_blank" class="tooltip" data-tooltip="${icon.title}">${iconHTML}</a>`;
	}).join('\n');
}

/** From https://devicon.dev */
const devIcons = {
	'python': 		{ src: 'python/python-original.svg', 				title: 'Python' },
	'jupyter': 		{ src: 'jupyter/jupyter-original-wordmark.svg', 	title: 'Jupyter' },
	'latex': 		{ src: 'latex/latex-original.svg', 					title: 'LaTeX'},
	'js': 			{ src: 'javascript/javascript-original.svg', 		title: 'JavaScript' },
	'html': 		{ src: 'html5/html5-original.svg', 					title: 'HTML' },
	'css': 			{ src: 'css3/css3-original.svg', 					title: 'CSS' },
	'json': 		{ src: 'json/json-plain.svg', 						title: 'JSON' },
	'c++': 			{ src: 'cplusplus/cplusplus-original.svg', 			title: 'C++' },
	'c': 			{ src: 'c/c-original.svg', 							title: 'C Programming' },
	'julia': 		{ src: 'julia/julia-original.svg', 					title: 'Julia' }
};

const withBackdrop = new Set(['jupyter', 'latex']);

function generateTechStack(techStack) {
	if (!techStack) return '';

	return techStack
		.map(tech => {
			const icon = devIcons[tech];
			if (!icon) { // Icon name not found
				console.error(`Tech stack icon key not found: ${tech}`);
				return '';
			}

			const classAttr = withBackdrop.has(tech) ? 'icon-backdrop' : '';
			return `<div class="${classAttr} tooltip" data-tooltip="${icon.title}">
						<img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon.src}" alt="${icon.title}">
					</div>`;
		})
		.join('\n');
}



// #region Project Listeners 
let projects = null;
let selectedIndex = -1; // Active project or subproject. (-1 marks no selection)

/** Bring selected project to center of scrollable region */
function scrollIntoView() {
	projects[selectedIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/** Change the `.selected` project based on new index */
function updateSelection(newIndex, scroll = false) {
	if (!projects) return;

	// Deselect old project if any
	if (selectedIndex >= 0) {
		const oldProject = projects[selectedIndex];
		oldProject.classList.remove('selected');
		oldProject.closest('.project')?.classList.remove('bigger');
	}

	// Update selected index
	selectedIndex = newIndex ?? -1;

	// Select new project if any
	if (selectedIndex >= 0) {
		const newProject = projects[selectedIndex];
		newProject.classList.add('selected');
		newProject.closest('.project')?.classList.add('bigger');

		if (scroll) { // Center project
			scrollIntoView();
		}
	}
}

/** Show or hide content region */
function toggleExpand(projectEl) {
	const content = projectEl.querySelector('.project-content');
	if (!content) return;

	const isExpanded = projectEl.classList.toggle('expanded');
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

/** Return the index of the first partially visible project in `projects` */
function findClosestVisibleProject(reverse = false) {
	const start = reverse ? projects.length - 1 : 0;
	const end = reverse ? -1 : projects.length;
	const step = reverse ? -1 : 1;

	for (let i = start; i !== end; i += step) {
		const rect = projects[i].getBoundingClientRect();
		if (rect.top < window.innerHeight && rect.bottom > 0) {
			return i; // First partially visible project in viewport
		}
	}
	return -1; // None found
};

/** Add document listener for selecting project on arrow keydown */
function setupKeydownSelection() {
	document.addEventListener('keydown', (event) => {
		if (keysPressed[event.code]) return; // Prevent spam

		if (event.code === 'ArrowUp') {
			let i = selectedIndex < 0 ? findClosestVisibleProject() : selectedIndex - 1;
			while (i >= 0 && projects[i].offsetParent === null) {
				--i; // Skip hidden projects
			}
			// Select project
			if (i >= 0) updateSelection(i, true);
		}

		else if (event.code === 'ArrowDown') {
			let i = selectedIndex < 0 ? findClosestVisibleProject(true) : selectedIndex + 1;
			while (i >= 0 && i < projects.length && projects[i].offsetParent === null) {
				++i; // Skip hidden
			}
			if (i < projects.length) updateSelection(i, true);
		}

		// Expand/collapse content
		else if (event.code === 'Enter' && selectedIndex >= 0) {
			// Only expand if no link or icon has focus
			if (document.activeElement === document.body) { 
				toggleExpand(projects[selectedIndex]);
				scrollIntoView();
			}
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
				cloneIcon._originalTitle = cloneIcon.getAttribute('data-tooltip') || '';
			}

			// Indicate command was copied
			icon.className = 'fal fa-check-circle';
			cloneIcon.setAttribute('data-tooltip', 'Copied!');
			cloneIcon.style.color = 'limegreen';

			// Clear previous timeout, and restart timer
			clearTimeout(cloneIcon.timerID);

			// Revert after delay
			cloneIcon.timerID = setTimeout(() => {
				icon.className = cloneIcon._originalClass;
				cloneIcon.setAttribute('data-tooltip', cloneIcon._originalTitle);
				cloneIcon.style.color = ''; // Reset color
			}, 1500);
		})
		.catch(err => console.error('Failed to copy text:', err));
}


const keysPressed = {}; // Track held keys
const blockedKeys = new Set(['ArrowUp', 'ArrowDown']);

/** Track key codes currently held & prevent default behaviors */
function handleKeyTracking() {
	document.addEventListener('keydown', (event) => {
		if (blockedKeys.has(event.code)) event.preventDefault();
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
	handleKeyTracking();
}

/** Trigger `.tooltip` elements on hover or focus */
function setupTooltips() {
	const tooltips = document.querySelectorAll('.tooltip');

	tooltips.forEach(tip => {
		tip.addEventListener('mouseenter', activateTooltip);
		tip.addEventListener('focus', activateTooltip);

		// Mouseout and blur to remove active state
		tip.addEventListener('mouseleave', deactivateTooltip);
		tip.addEventListener('blur', deactivateTooltip);
	});

	function activateTooltip(event) {
		clearActiveTooltips();
		event.currentTarget.classList.add('active');
	}

	function deactivateTooltip(event) {
		event.currentTarget.classList.remove('active');
	}

	function clearActiveTooltips() {
		tooltips.forEach(tooltip => tooltip.classList.remove('active'));
	}
}
// #endregion
