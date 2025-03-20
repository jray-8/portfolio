
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
	new Theme('castle.jpg', 			SLATE_BLUE),
	new Theme('castle-2.jpg', 			CASTLE_BROWN),
	new Theme('checkered-space-3.jpg', 	MAGENTA),
	new Theme('bw-2.jpg', 				ASH),
	new Theme('portal.jpg',				SLATE_BLUE),
	new Theme('plains.jpg', 			CASTLE_BROWN),
	new Theme('gates.jpg', 				SEA_GREEN),
	new Theme('red-py.jpg', 			MAGENTA),
	new Theme('moon-desert.jpg', 		ASH),
	new Theme('gates-3.jpg', 			PYRAMID),
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
		themes[themeIndex].apply();
	}
}, { passive: false} );


/** Choose and apply a random background theme */
function randomizeTheme() {
	themeIndex = Math.floor(Math.random() * themes.length);
	themes[themeIndex].apply();
}

/** Randomize the cycle order of themes */
function randomizeCycleOrder() {
	let i = themes.length;
	while (i > 1) {
		let j = Math.floor(Math.random() * i--); // Random index from 0..i
		[themes[i], themes[j]] = [themes[j], themes[i]]; // Swap elements
	}
}


// Start each page load with a random theme
document.addEventListener('DOMContentLoaded', randomizeTheme);