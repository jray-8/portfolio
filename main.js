document.addEventListener('DOMContentLoaded', function () {
	fetch('projects.json')
		.then(response => response.json())
		.then(projects => displayProjects(projects))
		.catch(error => console.error('Error loading projects:', error));
});

function displayProjects(projects) {
	const container = document.getElementById('projects-container');

	projects.forEach(project => {
		const projectEl = createProjectElement(project);
		container.appendChild(projectEl);
	});
}

function createProjectElement(project, isSubproject = false) {
	const projectEl = document.createElement('div');
	projectEl.classList.add(isSubproject ? 'subproject' : 'project'); // Differentiate nested projects

	// Generate title
	const preview = project.links?.preview; // Check if preview link exists, undefined otherwise
	const titleContent = preview
		? `<a href="${preview}" target="_blank" class="project-title">${project.name}</a>`
		: `<span class="project-title">${project.name}</span>`;

	// Check for description
	const description = project.description ? `<p>${project.description}</p>` : '';

	// Generate icons
	const icons = generateIconLinks(project.links);

	// Create the surface structure
	projectEl.innerHTML = `
		<div class="project-header">
			${titleContent}
			<div class="project-icons">
				${icons}
				<span class="arrow"><i class="fas fa-chevron-right"></i></span>
			</div>
		</div>
		<div class="project-content">
			${description}
		</div>
	`;

	// Recursively generate subproject elements
	if (project.subprojects && project.subprojects.length > 0) {
		const subprojects = generateSubprojects(project.subprojects); // Div container
		const content = projectEl.querySelector('.project-content');
		content.appendChild(subprojects);
	}

	// Attach event listeners to handling expanding/collapsing header
	setupExpandCollapse(projectEl);

	return projectEl;
}

/** Returns the div element for a list of subprojects under a project */
function generateSubprojects(subprojects) {
	const subprojectsContainer = document.createElement('div');
	subprojectsContainer.classList.add('subprojects');

	// Recursively create new subprojects
	subprojects.forEach(sub => {
		const subProjectEl = createProjectElement(sub, true);
		subprojectsContainer.appendChild(subProjectEl);
	});

	return subprojectsContainer;
}

/** Adds event listeners to a project element to control content area */
function setupExpandCollapse(projectEl) {
	const header = projectEl.querySelector('.project-header');
	const content = projectEl.querySelector('.project-content');

	// Show or hide content region
	function toggleExpand() {
		projectEl.classList.toggle('expanded');
		content.style.display = projectEl.classList.contains('expanded') ? 'block' : 'none';
	}

	// Click anywhere on header *except links* to expand
	header.addEventListener('click', (event) => {
		if (!event.target.closest('a')) {
			toggleExpand();
		}
	});

	// Enter key when project div is focused
	projectEl.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			toggleExpand();
		}
	});
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
