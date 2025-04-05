
// Reusable color palettes
const NIGHT_PURPLE = 	['rgba(92, 82, 116, 0.2)', 	'rgba(23, 20, 29, 0.7)'];
const DEEP_BLUE = 		['rgba(0, 59, 78, 0.3)', 		'rgba(5, 14, 17, 0.4)'];
const CLASSIC_BLUE = 	['rgba(36, 204, 255, 0.1)', 	'rgba(6, 27, 34, 0.7)'];
const SUNSET_RED = 		['rgba(184, 111, 96, 0.1)', 	'rgba(41, 12, 7, 0.4)'];
const SEA_GREEN = 		['rgba(18, 238, 220, 0.07)',	'rgba(1, 19, 18, 0.7)'];
const ASH = 			['rgba(255, 255, 255, 0.1)',	'rgba(31, 31, 31, 0.7)'];
const PYRAMID = 		['rgba(180, 157, 126, 0.25)',	'rgba(34, 29, 23, 0.7)'];
const SHADOW = 			['rgba(255, 255, 255, 0.05)',	'rgba(15, 15, 15, 0.4)'];
const CASTLE_BROWN = 	['rgba(231, 164, 151, 0.1)',	'rgba(36, 24, 22, 0.7)'];
const MAGENTA = 		['rgba(240, 143, 183, 0.1)',	'rgba(32, 18, 24, 0.7)'];
const SLATE_BLUE = 		['rgba(53, 104, 121, 0.2)',	'rgba(10, 25, 31, 0.7)'];
const SPACE_GREEN = 	['rgba(82, 189, 162, 0.15)',	'rgba(9, 20, 18, 0.7)'];


class Theme {
	/** @param {} bgUrl name of the background image inside the `assets/bg` folder */
	constructor(bgUrl, subprojectColorSet) {
		this.bgUrl = bgUrl; // Background image for the body
		this.subprojectColor = subprojectColorSet[0];
		this.selectedColor = subprojectColorSet[1] || '';
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

const themes = [
	new Theme('checkered-space.jpg', 	NIGHT_PURPLE),
	new Theme('checkered-space-2.jpg', 	NIGHT_PURPLE),
	new Theme('checkered-space-3.jpg', 	MAGENTA),

	new Theme('bw.jpg', 				ASH),
	new Theme('bw-2.jpg', 				ASH),
	new Theme('bw-3.jpg', 				NIGHT_PURPLE),
	new Theme('bw-4.jpg', 				SHADOW),

	new Theme('spirit.jpg', 			SPACE_GREEN),
	new Theme('spirit-2.jpg', 			CLASSIC_BLUE),
	
	new Theme('space-py.jpg', 			PYRAMID),
	new Theme('space-py-2.jpg', 		PYRAMID),
	new Theme('red-py.jpg', 			MAGENTA),
	new Theme('blue-py.jpg', 			CLASSIC_BLUE),
	new Theme('blue-py-2.jpg', 			SEA_GREEN),
	new Theme('golden-py.jpg', 			SUNSET_RED),
	
	new Theme('castle.jpg', 			SLATE_BLUE),
	new Theme('castle-2.jpg', 			CASTLE_BROWN),
	new Theme('castle-3.jpg', 			SUNSET_RED),
	new Theme('castle-4.jpg', 			MAGENTA),
	new Theme('castle-5.jpg', 			SUNSET_RED),

	new Theme('gates.jpg', 				SEA_GREEN),
	new Theme('gates-2.jpg', 			NIGHT_PURPLE),
	new Theme('gates-3.jpg', 			PYRAMID),
	new Theme('gates-4.jpg', 			SHADOW),

	new Theme('moon-desert.jpg', 		ASH),	
	new Theme('moon-desert-2.jpg', 		ASH),
	new Theme('moon-desert-3.jpg', 		ASH),
	
	new Theme('green-ice.jpg', 			SHADOW),
	new Theme('green-ice-2.jpg', 		SPACE_GREEN),
	new Theme('green-ice-3.jpg', 		SPACE_GREEN),

	new Theme('portal.jpg',				SLATE_BLUE),
	new Theme('plains.jpg', 			CASTLE_BROWN),
	new Theme('blue-checkered.jpg', 	DEEP_BLUE),
	new Theme('space-fog.jpg', 			DEEP_BLUE),
	new Theme('glory.jpg', 				PYRAMID),

	new Theme('fire-hawks.jpg', 		SLATE_BLUE),
	new Theme('fire-hawks-2.jpg', 		SUNSET_RED),
	new Theme('fire-hawks-3.jpg', 		PYRAMID),
	new Theme('fire-hawks-4.jpg', 		CASTLE_BROWN),
	new Theme('fire-hawks-5.jpg', 		SHADOW),
	new Theme('fire-hawks-6.jpg', 		MAGENTA)
];

let themeIndex = 0;
let transitioning = false;

const imageCache = []; // Maintain references to Image objects so they can be loaded seamlessly

/** Preload all background images */
function preloadThemeImages() {
	themes.forEach(theme => {
		const img = new Image();
		img.src = `assets/bg/${theme.bgUrl}`;
		imageCache.push(img);
	});
}

/** Transition background theme to the next one in order */
function switchTheme(dir) {
	if (transitioning) return;
	transitioning = true;

	// If the background was not yet set (using CSS default), do not increment index
	if (document.body.style.backgroundImage) {
		themeIndex = (themeIndex + dir + themes.length) % themes.length;
	}
	themes[themeIndex].apply();
}

// Scroll through themes using: Alt + Wheel
document.addEventListener('wheel', (event) => {
	if (event.altKey) {
		event.preventDefault();
		switchTheme(event.deltaY > 0 ? 1 : -1);
	}
}, { passive: false} );

// Change themes with: Alt + Arrow keys
document.addEventListener('keydown', (event) => {
	if (event.altKey) {
		event.stopImmediatePropagation();
		event.preventDefault();
		if (event.code === 'ArrowUp' || event.code === 'ArrowLeft') {
			switchTheme(-1);
		}
		else if (event.code === 'ArrowDown' || event.code === 'ArrowRight') {
			switchTheme(1);
		}
	}
});

// Track theme transition end to prevent overlap
document.addEventListener('transitionend', (event) => {
	if (event.propertyName === 'background-image') {
		transitioning = false; // Unlock
	}
});


/** Set theme based on the `name` of a background image (.ext included) */
function chooseTheme(name) {
	themeIndex = themes.findIndex(theme => theme.bgUrl === name);
	themes[themeIndex].apply();
}

/** Choose and apply a random background theme */
function chooseRandomTheme() {
	themeIndex = Math.floor(Math.random() * themes.length);
	themes[themeIndex].apply();
}

/** Randomize the order themes will switch to */
function randomizeCycleOrder() {
	let i = themes.length;
	while (i > 1) {
		let j = Math.floor(Math.random() * i--); // Random index from 0..i
		[themes[i], themes[j]] = [themes[j], themes[i]]; // Swap elements
	}
}


// Start each page load with a random theme
document.addEventListener('DOMContentLoaded', () => {
	preloadThemeImages();
	randomizeCycleOrder();
	chooseRandomTheme();
});