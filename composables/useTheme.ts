
/*
	InACTually
	> interactive theater for actual acts
	> this file is part of the "InACTually Stage", a spatial Interface for orchestrating interactive Media

	Copyright (c) 2023–2025 Fabian Töpfer, Lars Engeln
	Copyright (c) 2025 InACTually Community
	Licensed under the MIT License.
	See LICENSE file in the project root for full license information.

	This file is created and substantially modified: 2023-2024

	contributors:
	Fabian Töpfer - baniaf@uber.space
*/

let lightTheme = ref<boolean>(true);


export default function () {

	let switchTheme = () => {
		lightTheme.value = !lightTheme.value;
		setTheme();
	}


	let setTheme = () => {

		if (!lightTheme.value) {
			document.documentElement.style.setProperty("--background-color", "#2a2a2a")
			document.documentElement.style.setProperty("--primary-color", "#ffffff")
			document.documentElement.style.setProperty("--primary-color-highlight", "#ffffff")
			document.documentElement.style.setProperty("--secondary-color", "#000000")
			document.documentElement.style.setProperty("--border-color", "#3e3e3e")
			document.documentElement.style.setProperty("--border-color-highlight", "#ffffff")
			document.documentElement.style.setProperty("--semi-background-color", "rgba(12,12,12,0.8)")
		}
		else {
			document.documentElement.style.setProperty("--background-color", "#f1f1f1")
			document.documentElement.style.setProperty("--primary-color", "#1a1a1a")
			document.documentElement.style.setProperty("--primary-color-highlight", "#000000")
			document.documentElement.style.setProperty("--secondary-color", "#f1f1f1")
			document.documentElement.style.setProperty("--border-color", "#dddddd")
			document.documentElement.style.setProperty("--border-color-highlight", "#000000")
			document.documentElement.style.setProperty("--semi-background-color", "rgba(255, 255, 255,0.7)")
		}
	}

	return {
		lightTheme,
		switchTheme,
		setTheme
	}
}
